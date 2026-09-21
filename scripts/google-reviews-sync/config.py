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
# Google approved Basic API Access on 2026-09-14. These three values are
# produced by the one-time interactive authorize.py (run locally by Suraj; it
# writes them to the gitignored .env). See google_business_client.py's module
# docstring and README.md for exactly what that flow looks like.
GOOGLE_CLIENT_ID = _optional("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = _optional("GOOGLE_CLIENT_SECRET")
GOOGLE_REFRESH_TOKEN = _optional("GOOGLE_REFRESH_TOKEN")

# These identify which Business Profile
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
# Shopify no longer lets you create classic admin "custom apps" with a
# reveal-once token. Auth is now an app created in the Shopify Dev Dashboard
# ("K&A Reviews Sync"), installed on this store, using the OAuth
# client-credentials grant: SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (from the
# app's Settings page) are exchanged for a short-lived (~24h) Admin API token on
# every run (shopify_client.get_access_token; held in memory only, never
# written to disk or logged). SHOPIFY_ADMIN_API_TOKEN is kept ONLY as an
# optional static-token fallback (used when the client id/secret are not set).
# See README.md. Never commit any of these values.
SHOPIFY_STORE_DOMAIN = _optional("SHOPIFY_STORE_DOMAIN", "d21bac.myshopify.com")
SHOPIFY_CLIENT_ID = _optional("SHOPIFY_CLIENT_ID")
SHOPIFY_CLIENT_SECRET = _optional("SHOPIFY_CLIENT_SECRET")
SHOPIFY_ADMIN_API_TOKEN = _optional("SHOPIFY_ADMIN_API_TOKEN")  # optional legacy fallback
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

# How many review excerpts to keep in the synced payload (a CAP on the data, not
# a layout decision). Each theme surface renders its own `limit`: the homepage
# section (sections/ka-voice-of-bride.liquid) currently shows the first 5 and the
# product page (sections/ka-product-reviews.liquid) up to 6, so 6 covers both.
# Final on-page card counts/layout are a Creative Director decision.
MAX_REVIEWS = int(_optional("MAX_REVIEWS", "6"))

# Minimum star rating (1-5) for a review to be eligible for the homepage cards.
# Per-review `starRating` from Google is the enum ONE..FIVE (see
# sync.STAR_RATING_MAP). Default 4: only 4- and 5-star reviews WITH text are
# published automatically. This does NOT affect the rating average / total
# count, which always come from Google's top-level fields unchanged.
MIN_STAR_RATING = int(_optional("MIN_STAR_RATING", "4"))
