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
WITHOUT calling shopify_client and WITHOUT needing any
Shopify credentials. It never prints tokens or secrets.

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
import re
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


# Google's per-review `starRating` is an enum string, NOT a number.
STAR_RATING_MAP = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}

ANONYMOUS_NAME = "A Google Reviewer"


def star_rating_value(review: dict) -> int:
    """Map Google's starRating enum (ONE..FIVE) to 1-5. Unknown/missing -> 0 (never eligible)."""
    return STAR_RATING_MAP.get(str(review.get("starRating", "")).upper(), 0)


def _normalise_name_part(part: str) -> str:
    """
    Fix casing of a name token only when it is clearly wrong: ALL-lowercase or
    ALL-CAPS ("juee", "AASHVI") -> capitalised; mixed case ("McDonald",
    "D'Souza", "DeShawn") is left exactly as the reviewer typed it. Hyphen and
    apostrophe segments are each capitalised ("anne-marie" -> "Anne-Marie").
    """
    letters = [c for c in part if c.isalpha()]
    if not letters or not (part.islower() or part.isupper()):
        return part
    pieces = re.split(r"([-'’])", part)
    return "".join(p[:1].upper() + p[1:].lower() if p and p not in "-'’" else p for p in pieces)


def format_reviewer_name(display_name: str) -> str:
    """
    "First L." convention (matches the hand-curated cards, and avoids
    publishing a reviewer's full name), with casing normalised:
      "Sakshi kachharae" -> "Sakshi K."   "AASHVI SHAH" -> "Aashvi S."
      "juee vora" -> "Juee V."            "Karishma Abhishek Sindhu" -> "Karishma S."
      "Kiran" -> "Kiran"                  "S Kaur" -> "S K."
      "" / whitespace / "A Google User"   -> ANONYMOUS_NAME
    The initial is the first alphabetic character of the LAST word, uppercased
    (unicode-aware: "élodie ñandú" -> "Élodie Ñ."). If the last word has no
    letters at all (e.g. an emoji), only the first name is returned.
    """
    parts = (display_name or "").strip().split()
    if not parts or " ".join(parts).lower() in {"a google user", "google user"}:
        return ANONYMOUS_NAME
    first = _normalise_name_part(parts[0])
    if len(parts) == 1:
        return first
    initial = next((c for c in parts[-1] if c.isalpha()), "")
    return f"{first} {initial.upper()[:1]}." if initial else first


TRANSLATED_PREFIX = "(Translated by Google)"
ORIGINAL_MARKER = "(Original)"


def has_translation_prefix(comment) -> bool:
    return (comment or "").strip().startswith(TRANSLATED_PREFIX)


def review_text(comment) -> str:
    """
    The verbatim reviewer text to publish (the site's rule: never a translation).

    Google's v4 API can return a machine-translated comment shaped like
        "(Translated by Google) <translated text>

(Original) <original text>"
    In that case return the ORIGINAL text, with both markers removed. If the
    "(Original)" marker (or the original text after it) is missing, fall back
    to the text after the "(Translated by Google)" prefix so a marker string is
    never shown. Any comment that does not start with the prefix is returned
    unchanged (just stripped).
    """
    text = (comment or "").strip()
    if not text.startswith(TRANSLATED_PREFIX):
        return text
    body = text[len(TRANSLATED_PREFIX):]
    idx = body.find(ORIGINAL_MARKER)
    if idx == -1:
        return body.strip()
    original = body[idx + len(ORIGINAL_MARKER):].strip()
    return original or body[:idx].strip()


def classify_reviews(reviews: list[dict]) -> dict:
    """
    Buckets every fetched review. Precedence: no text first (any rating), then
    below-threshold-with-text, else eligible. Used by transform_reviews (to
    select) and by --dry-run (to report exclusion counts).
    """
    eligible, no_text, below_min = [], [], []
    for r in reviews:
        if not review_text(r.get("comment")):
            no_text.append(r)
        elif star_rating_value(r) < config.MIN_STAR_RATING:
            below_min.append(r)
        else:
            eligible.append(r)
    return {"eligible": eligible, "no_text": no_text, "below_min_rating": below_min}


def transform_reviews(raw: dict) -> dict:
    """
    Converts the raw Google Business Profile API response into the JSON
    shape stored in the custom.google_reviews Shopify metafield (see the
    schema documented in sections/ka-voice-of-bride.liquid's header comment
    and in config.py).

    Selection is fully automatic (Suraj's decision, 2026-09-21): the most
    recently updated reviews (API order = updateTime desc) that have text AND
    at least config.MIN_STAR_RATING stars, up to config.MAX_REVIEWS. Fewer
    eligible reviews simply yields fewer cards. Rating average / total count
    are Google's own top-level figures, never recomputed from the filter.

    KNOWN LIMITATION -- "occasion" (e.g. "Bridal, 2024"): Google's Reviews
    API has no equivalent field. It is left as an empty string for every
    auto-synced review (the theme renders that cleanly; Suraj's curated cards
    have none either). Not a code gap.
    """
    top_reviews = classify_reviews(raw["reviews"])["eligible"][: config.MAX_REVIEWS]

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
                "quote": review_text(r.get("comment")),
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
    buckets = classify_reviews(reviews)
    with_text = [r for r in reviews if review_text(r.get("comment"))]
    print("=" * 70)
    print("DRY RUN -- nothing was written to Shopify. Raw figures from Google:")
    print(f"  totalReviewCount (Google) : {raw['total_review_count']}")
    print(f"  averageRating   (Google)  : {raw['average_rating']}")
    print(f"  reviews returned by fetch : {len(reviews)}  ({len(with_text)} with text, {len(reviews) - len(with_text)} without)")
    translated = [r for r in reviews if has_translation_prefix(r.get("comment"))]
    print(f"  comments with a '(Translated by Google)' prefix : {len(translated)}")
    print(f"  min star rating for cards  : {config.MIN_STAR_RATING}   max cards: {config.MAX_REVIEWS}")
    print("  Selection breakdown (counts only):")
    print(f"    excluded - no text (any rating)          : {len(buckets['no_text'])}")
    print(f"    excluded - has text but rated < {config.MIN_STAR_RATING} stars   : {len(buckets['below_min_rating'])}")
    print(f"    eligible (text and >= {config.MIN_STAR_RATING} stars)          : {len(buckets['eligible'])}")
    print(f"    eligible but beyond the {config.MAX_REVIEWS}-card cap          : {max(0, len(buckets['eligible']) - config.MAX_REVIEWS)}")
    print("-" * 70)
    print("All fetched reviews (order the API returned = updateTime desc):")
    for i, r in enumerate(reviews, 1):
        has_text = "text" if review_text(r.get("comment")) else "NO TEXT"
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


def run(dry_run: bool = False, json_out: str | None = None) -> int:
    if not dry_run and not shopify_client.is_configured():
        log.error(
            "Shopify auth is not configured. Set SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET "
            "(Shopify Dev Dashboard app 'K&A Reviews Sync' > Settings), or the legacy "
            "SHOPIFY_ADMIN_API_TOKEN. See README.md."
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
        if json_out:
            with open(json_out, "w", encoding="utf-8") as fh:
                json.dump(payload, fh, ensure_ascii=False, indent=2)
            print(f"(payload JSON written to {json_out} -- local file only, nothing sent anywhere)")
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
    parser.add_argument(
        "--json-out",
        metavar="PATH",
        help="With --dry-run only: also save the would-be payload as JSON to this local file (e.g. to build a staging test fixture).",
    )
    args = parser.parse_args()
    if args.json_out and not args.dry_run:
        parser.error("--json-out is only allowed together with --dry-run")
    sys.exit(run(dry_run=args.dry_run, json_out=args.json_out))
