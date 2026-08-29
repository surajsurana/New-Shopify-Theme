"""
Main entry point for the Google Reviews -> Shopify metafield sync job.

Intended deployment (once activated): a systemd timer / cron job on the
stocktradingbot droplet, same pattern as the Petty Cash bot -- run this
script daily (reviews don't change fast enough to need more often; Google's
Basic API Access is also rate-limited, so don't over-poll).

    python3 sync.py

Exit codes: 0 = success, 1 = expected/blocked state (e.g. Google OAuth not
configured yet, or Shopify token missing) -- logged clearly, not a crash.
Anything else = a real bug, logged with a traceback.

======================================================================
CANNOT RUN END-TO-END YET -- see google_business_client.py's docstring.
======================================================================
The Google half is stubbed on purpose (no fabricated credentials). The
Shopify half is real and independently testable today. Run this script now
and it will fail fast and clearly at the Google OAuth step with a message
explaining exactly why -- that is the expected, correct behavior until
Suraj's Basic API Access is approved, not a bug to "fix."
"""

from __future__ import annotations

import logging
import sys
from datetime import datetime, timezone

import config
import google_business_client as gbp
import shopify_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("google-reviews-sync")


def star_rating_to_number(value) -> str | None:
    """
    Google's `averageRating` field (top-level on the reviews list response)
    is already a plain float on a 1-5 scale -- NOT the per-review `starRating`
    enum (ONE/TWO/THREE/FOUR/FIVE), which only applies to individual reviews.
    This formats that average for display, e.g. 4.87 -> "4.9".
    """
    if value is None:
        return None
    return f"{float(value):.1f}"


def format_reviewer_name(display_name: str) -> str:
    """
    Google gives a full display name (e.g. "Priya Sharma"). The site's
    existing editorial convention (see the pre-existing block settings in
    sections/ka-voice-of-bride.liquid) is "first name + last initial", e.g.
    "Priya S." -- matches how reviews were manually curated before this sync
    existed, and avoids publishing a reviewer's full name without consent.
    """
    parts = display_name.strip().split()
    if not parts:
        return "A K&A Bride"
    if len(parts) == 1:
        return parts[0]
    return f"{parts[0]} {parts[-1][0]}."


def transform_reviews(raw: dict) -> dict:
    """
    Converts the raw Google Business Profile API response into the JSON
    shape stored in the custom.google_reviews Shopify metafield (see the
    schema documented in sections/ka-voice-of-bride.liquid's header comment
    and in config.py).

    KNOWN LIMITATION -- "occasion" (e.g. "Bridal, 2024"): Google's Reviews
    API has no equivalent field. It was previously hand-curated per review
    when quotes were entered manually as section blocks. This sync leaves
    "occasion" as an empty string for every auto-synced review. If Suraj
    wants that detail to keep appearing, the options are: (a) drop it from
    the card design, (b) maintain a small manual override map (e.g. keyed by
    Google reviewId) that this script merges in before writing the
    metafield, or (c) accept it blank. Not resolved here -- a product
    decision, not a code gap.
    """
    reviews_with_text = [r for r in raw["reviews"] if r.get("comment", "").strip()]
    # Already ordered by updateTime desc via the API's orderBy param.
    top_reviews = reviews_with_text[: config.MAX_REVIEWS]

    rating_number = star_rating_to_number(raw.get("average_rating"))
    rating_count = raw.get("total_review_count")
    rating_label = None
    if rating_number and rating_count is not None:
        rating_label = f"{rating_number} · {rating_count} Google Reviews"

    return {
        "rating_number": rating_number,
        "rating_count": rating_count,
        "rating_label": rating_label,
        "google_url": config.GOOGLE_REVIEW_URL or None,
        "reviews": [
            {
                "quote": r["comment"].strip(),
                "reviewer_name": format_reviewer_name(r.get("reviewer", {}).get("displayName", "")),
                "occasion": "",  # see KNOWN LIMITATION above
            }
            for r in top_reviews
        ],
        "synced_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def run() -> int:
    if not config.SHOPIFY_ADMIN_API_TOKEN:
        log.error(
            "SHOPIFY_ADMIN_API_TOKEN is not set. This half is not blocked on Google -- "
            "create a Shopify custom app (write_metafields scope) and set this env var. "
            "See README.md."
        )
        return 1

    try:
        access_token = gbp.get_access_token()
    except gbp.GoogleAuthNotConfigured as exc:
        log.error(str(exc))
        return 1

    account_id, location_id = gbp.discover_account_and_location(access_token)
    log.info("Resolved Google Business Profile account=%s location=%s", account_id, location_id)

    raw = gbp.fetch_reviews(access_token, account_id, location_id)
    log.info(
        "Fetched %d reviews (average_rating=%s, total_review_count=%s)",
        len(raw["reviews"]), raw["average_rating"], raw["total_review_count"],
    )

    payload = transform_reviews(raw)
    if not payload["reviews"] or not payload["rating_label"]:
        log.error(
            "Transformed payload is missing rating or review content -- refusing to write "
            "an incomplete metafield (the theme section treats an incomplete payload as "
            "'not synced' and stays hidden, but better to fail loudly here than write junk)."
        )
        return 1

    result = shopify_client.write_reviews_metafield(payload)
    log.info("Wrote custom.google_reviews metafield: %s", result)
    return 0


if __name__ == "__main__":
    sys.exit(run())
