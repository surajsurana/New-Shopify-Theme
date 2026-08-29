# Google Reviews -> Shopify sync

Keeps the homepage "Voice of the Bride" section (`sections/ka-voice-of-bride.liquid`,
Section 8 of `Docs/homepage-build-spec.md`) fed with real, live Google review
data instead of hand-typed placeholder quotes. Suraj decided against a
third-party embed widget (Elfsight, EmbedSocial, etc.) so this owns the sync
directly: Google Business Profile API -> transform -> a single Shopify JSON
metafield -> the theme section reads it. Same architectural shape as other
droplet automation in this business (e.g. the Petty Cash bot, a systemd
service on the `stocktradingbot` droplet).

## Status (2026-08-29)

**Not live yet -- intentionally.** Suraj is personally submitting Google's
"Application for Basic API Access" (a manual, human-reviewed process,
1-6 weeks). Nobody can complete the Google half of this until that's
approved. Everything that *doesn't* depend on it has been built:

| Piece | Status |
|---|---|
| Shopify metafield definition (`custom.google_reviews`, JSON, Shop-level) | **Done** -- created live on staging/the store, `gid://shopify/MetafieldDefinition/292565483810` |
| Theme section reads the metafield when populated, falls back to the existing static behavior otherwise | **Done** -- `sections/ka-voice-of-bride.liquid` |
| Shopify Admin API write half (`shopify_client.py`) | **Done, testable today** -- not blocked on Google at all |
| Google Business Profile API read half (`google_business_client.py`) | **Stubbed** -- structurally correct, cannot run without real OAuth credentials |
| Orchestration (`sync.py`) | **Done** -- wires the above together, fails fast/clearly at the OAuth step until credentials exist |

## What's left once Google access is approved

1. Create OAuth 2.0 credentials (Client ID + Secret) in Google Cloud Console
   for a project with the Business Profile APIs enabled.
2. Run a one-time interactive OAuth consent flow as Suraj (the confirmed
   Owner of K&A's Business Profile), scope
   `https://www.googleapis.com/auth/business.manage`, to get a refresh
   token. (`google_business_client.py`'s module docstring has the exact
   step list.)
3. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`,
   and `GOOGLE_REVIEW_URL` as real env vars (see `.env.example`).
4. Run `python3 sync.py` manually once, confirm it writes the metafield
   correctly (check via Shopify Admin or a `graphql_query` read of
   `shop.metafields`), then confirm the homepage section renders the real
   data correctly **on staging** -- full CD/TD/QA pipeline applies, same as
   any other theme-visible change.
5. Wire it into a systemd timer (or cron) on the `stocktradingbot` droplet
   to run daily. A daily cadence is plenty -- reviews don't change fast, and
   Basic API Access is rate-limited.
6. Flip `show_section` to `true` on the section in the Shopify theme editor
   -- only after step 4 confirms real data renders correctly.
7. Normal release approval (Suraj, explicit, per CLAUDE.md) before this ever
   reaches Live.

## Setting up the Shopify side today (not blocked on anything)

1. Shopify Admin -> Settings -> Apps and sales channels -> Develop apps ->
   Create an app (e.g. "Google Reviews Sync").
2. Configure Admin API scopes: `read_metafields`, `write_metafields`.
3. Install the app, copy the Admin API access token.
4. Set `SHOPIFY_ADMIN_API_TOKEN` in `.env` (or the droplet's systemd unit).
5. `pip install -r requirements.txt`, then `python3 -c "import shopify_client; print(shopify_client.get_shop_gid())"`
   as a smoke test -- should print `gid://shopify/Shop/76831129890` with no error.

## Known limitation: "occasion" has no Google API source

The existing hand-curated reviews carry an "occasion" tag (e.g. "Bridal,
2024"). Google's Reviews API has no equivalent field -- it's not something
reviewers provide. `sync.py`'s `transform_reviews()` leaves this blank for
every auto-synced review and documents the tradeoff inline. If Suraj wants
this detail preserved, that's a product decision for a follow-up (a small
manual override map keyed by Google `reviewId`, or drop the field from the
card design) -- not something this sync job can infer from Google's data.

## Files

- `config.py` -- env var loading, constants (metafield namespace/key, API version).
- `google_business_client.py` -- Google OAuth (stub) + reviews fetch (real, ready).
- `shopify_client.py` -- Shopify Admin API GraphQL client, `metafieldsSet` write (real, ready).
- `sync.py` -- orchestrates the above; the actual entry point to run/schedule.
- `.env.example` -- variable names this expects; copy to `.env`, never commit the real one.
