"""
Configuration for the Google Reviews -> Shopify metafield sync job.

Loads everything from environment variables (via a .env file locally, or real
environment variables when run as a systemd service on the droplet -- same
pattern as the Petty Cash bot on the stocktradingbot droplet). Nothing in this
repo ever holds a real credential; see .env.example for the variable names
this script expects and README.md for where each one comes from.
"""

import os
import sys

from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    """Fetch a required env var, or exit with a clear error naming what's missing."""
    value = os.environ.get(name, "").strip()
    if not value:
        print(f"[config] Missing required environment variable: {name}", file=sys.stderr)
        sys.exit(1)
    return value


def _optional(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


# ---------------------------------------------------------------------------
# Google Business Profile API (Basic API Access)
# ---------------------------------------------------------------------------
# THE BLOCKER (as of 2026-08-29): Suraj is personally submitting Google's
# "Application for Basic API Access" (manual, human-reviewed, 1-6 weeks).
# None of GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN can
# exist until that access is approved and Suraj completes the one-time OAuth
# consent flow (see google_business_client.py's module docstring for exactly
# what that flow looks like and where it plugs in). Everything else in this
# script is written to be structurally ready for that moment.
GOOGLE_CLIENT_ID = _optional("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = _optional("GOOGLE_CLIENT_SECRET")
GOOGLE_REFRESH_TOKEN = _optional("GOOGLE_REFRESH_TOKEN")

# Once Basic API Access is approved, these identify which Business Profile
# account/location to pull reviews from. Can be discovered at runtime (see
# google_business_client.discover_account_and_location), but pinning them
# here after the first successful run avoids a repeated discovery call on
# every cron tick. Safe to leave blank -- discovery is the fallback.
GOOGLE_ACCOUNT_ID = _optional("GOOGLE_ACCOUNT_ID")
GOOGLE_LOCATION_ID = _optional("GOOGLE_LOCATION_ID")

# The public "leave a review" URL for K&A's Google Business Profile
# (the g.page/r/... link, same one currently hardcoded as a placeholder in
# sections/ka-voice-of-bride.liquid's editor fallback). This is copied once
# from the Business Profile dashboard by Suraj -- it is NOT behind the API
# access application and can be set today, independent of the Google API
# blocker.
GOOGLE_REVIEW_URL = _optional("GOOGLE_REVIEW_URL")

# ---------------------------------------------------------------------------
# Shopify Admin API
# ---------------------------------------------------------------------------
# This half is NOT blocked on anything -- a Shopify custom app scoped to the
# write_metafields (and read_metafields) Admin API scope can be created today
# in Shopify Admin > Settings > Apps and sales channels > Develop apps.
# See README.md for the exact steps. Store the resulting Admin API access
# token as SHOPIFY_ADMIN_API_TOKEN; never commit it.
SHOPIFY_STORE_DOMAIN = _optional("SHOPIFY_STORE_DOMAIN", "d21bac.myshopify.com")
SHOPIFY_ADMIN_API_TOKEN = _optional("SHOPIFY_ADMIN_API_TOKEN")
SHOPIFY_API_VERSION = _optional("SHOPIFY_API_VERSION", "2025-01")

# Confirmed live 2026-08-29 (Admin GraphQL `shop { id }`): gid://shopify/Shop/76831129890.
# The script re-fetches this at runtime rather than trusting a hardcoded value long-term
# (the store's underlying Shop ID does not change, but re-fetching costs one cheap query
# and avoids ever silently writing to the wrong owner if that ever changed).

# Must match the metafield definition created 2026-08-29:
# gid://shopify/MetafieldDefinition/292565483810 (namespace "custom",
# key "google_reviews", type "json", owner type SHOP).
METAFIELD_NAMESPACE = "custom"
METAFIELD_KEY = "google_reviews"
METAFIELD_TYPE = "json"

# How many review excerpts to keep in the synced payload. Matches the
# section's card grid (sections/ka-voice-of-bride.liquid renders up to 3).
MAX_REVIEWS = 3
