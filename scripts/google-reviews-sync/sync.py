"""
Main entry point for the Google Reviews -> Shopify metafield sync job.

Intended deployment (once activated): a systemd timer / cron job on the
stocktradingbot droplet, same pattern as the Petty Cash bot -- run this
script daily (reviews don't change fast enough to need more often; Google's
Basic API Access is also rate-limited, so don't over-poll).

    python3 sync.py            # REAL run: writes the SHOP-level custom.google_reviews metafield
    python3 sync.py --dry-run  # safe preview: Google half only, prints what WOULD be written

WARNING -- a real run changes the LIVE homepage immediately. The metafield is
Shop-level, not theme-level, and the published theme's ka-voice-of-bride
section prefers it over its editor blocks, so there is no staging step for
the first write. Always run --dry-run first and review the output.

--dry-run does the token refresh, account/location discovery, fetch and
transform_reviews(), prints the payload plus raw Google totals, and exits 0
WITHOUT calling shopify_client and WITHOUT needing
SHOPIFY_ADMIN_API_TOKEN. It never prints tokens or secrets.

Exit codes: 0 = success, 1 = expected/blocked state (e.g. Google OAuth not
configured, or Shopify token missing on a real run) -- logged clearly, not a
crash. Anything else = a real bug, logged with a traceback.

Google API access was approved 2026-09-14 and authorize.py (one-time) creates
the GOOGLE_* credentials -- see README.md.
"""

from __future__ import annotations

import argparse
import json
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


def print_dry_run(raw: dict, payload: dict) -> None:
    """Human-readable preview. Public review text/names only -- never tokens or secrets."""
    # Windows consoles default to cp1252 and crash on emoji/typographic characters
    # that appear in real review text; force UTF-8 (replace, never raise) for this output.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    reviews = raw["reviews"]
    with_text = [r for r in reviews if r.get("comment", "").strip()]
    print("=" * 70)
    print("DRY RUN -- nothing was written to Shopify. Raw figures from Google:")
    print(f"  totalReviewCount (Google) : {raw['total_review_count']}")
    print(f"  averageRating   (Google)  : {raw['average_rating']}")
    print(f"  reviews returned by fetch : {len(reviews)}  ({len(with_text)} with text, {len(reviews) - len(with_text)} without)")
    print("-" * 70)
    print("All fetched reviews (order the API returned = updateTime desc):")
    for i, r in enumerate(reviews, 1):
        has_text = "text" if r.get("comment", "").strip() else "NO TEXT"
        name = r.get("reviewer", {}).get("displayName", "")
        print(
            f"  {i:>2}. {r.get('starRating', '?'):<5} {has_text:<7} "
            f"updated {str(r.get('updateTime', ''))[:10]}  "
            f"raw name={name!r} -> {format_reviewer_name(name)!r}"
        )
    print("-" * 70)
    print("Payload that WOULD be written to shop metafield custom.google_reviews:")
    print(f"  rating_number : {payload['rating_number']}")
    print(f"  rating_count  : {payload['rating_count']}")
    print(f"  rating_label  : {payload['rating_label']}")
    print(f"  google_url    : {payload['google_url']}")
    print(f"  synced_at     : {payload['synced_at']}")
    print(f"  reviews ({len(payload['reviews'])}):")
    for i, r in enumerate(payload["reviews"], 1):
        print(f"    [{i}] reviewer_name={r['reviewer_name']!r} occasion={r['occasion']!r}")
        print(f"        quote={json.dumps(r['quote'], ensure_ascii=False)}")
    print("=" * 70)


def run(dry_run: bool = False) -> int:
    if not dry_run and not config.SHOPIFY_ADMIN_API_TOKEN:
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

    if dry_run:
        print_dry_run(raw, payload)
        if not payload["reviews"] or not payload["rating_label"]:
            print("NOTE: a real run would REFUSE to write this payload (missing rating or review content).")
        return 0

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
    parser = argparse.ArgumentParser(description="Sync Google reviews into the custom.google_reviews Shopify metafield.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch + transform from Google and print what WOULD be written; never calls Shopify, needs no Shopify token.",
    )
    args = parser.parse_args()
    sys.exit(run(dry_run=args.dry_run))
