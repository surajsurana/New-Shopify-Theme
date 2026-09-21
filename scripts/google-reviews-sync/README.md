# Google Reviews -> Shopify sync

Keeps the homepage "Voice of the Bride" section (`sections/ka-voice-of-bride.liquid`,
Section 8 of `Docs/homepage-build-spec.md`) fed with real, live Google review
data instead of hand-typed placeholder quotes. Suraj decided against a
third-party embed widget (Elfsight, EmbedSocial, etc.) so this owns the sync
directly: Google Business Profile API -> transform -> a single Shopify JSON
metafield -> the theme section reads it. Same architectural shape as other
droplet automation in this business (e.g. the Petty Cash bot, a systemd
service on the `stocktradingbot` droplet).

## Status (2026-09-21)

**Google approved Business Profile API access on 2026-09-14** (Cloud project
number `250716548984`, 300 QPM). Suraj has enabled the Account Management API,
Business Information API and Google My Business API (`mybusiness.googleapis.com`,
v4) in Cloud project `project-da1a7b04-6eee-443f-bb8`, OAuth consent is
External / In production, and a Desktop-app OAuth client JSON is saved (and
gitignored) at `Google My Business Reviews API/client_secret_<...>.json`.

**The remaining Google-side step is the one-time interactive authorization**,
which `authorize.py` now does. Nothing has been authorized yet -- it needs
Suraj's browser sign-in.

| Piece | Status |
|---|---|
| Google API access (Basic API Access) | **Approved 2026-09-14** |
| Shopify metafield definition (`custom.google_reviews`, JSON, Shop-level) | **Done** -- `gid://shopify/MetafieldDefinition/292565483810` |
| Theme section reads the metafield when populated, falls back to static otherwise | **Done** -- `sections/ka-voice-of-bride.liquid` |
| Shopify Admin API write half (`shopify_client.py`) | **Done** -- authenticates via a Dev Dashboard app (client credentials); app not created yet |
| Google reviews read half (`google_business_client.py`) | **Ready** -- runs as soon as the three `GOOGLE_*` values exist |
| One-time OAuth authorization (`authorize.py`) | **Written, not yet run** -- Suraj runs it (below) |
| Orchestration (`sync.py`) | **Done** |

## One-time Google authorization (Suraj, on his Windows PC)

Prerequisite: `https://www.googleapis.com/auth/business.manage` is listed under
Data access on the OAuth consent screen (Cloud Console > Google Auth Platform).

From the repo root (`Website Engineering`), in a normal terminal:

```
py -m pip install -r scripts/google-reviews-sync/requirements-authorize.txt
py scripts/google-reviews-sync/authorize.py "Google My Business Reviews API/client_secret_250716548984-1qllpe22u1mqr1tbvhbnfeiln67av0jj.apps.googleusercontent.com.json"
```

(Use `py`, not `python` -- on this PC bare `python` is the Microsoft Store stub.
Tip: type the first few letters of the filename and press Tab to complete it.)

What you will see:

1. Your browser opens on a Google sign-in. Sign in as **suraj.surana@gmail.com**
   (the Owner of K&A's Business Profile).
2. **"Google hasn't verified this app"** screen -- expected, this is our own
   private client. Click **Advanced**, then **"Go to <app name> (unsafe)"**,
   then **Continue / Allow** on the permission screen (it asks to "manage your
   Business Profile"). Do not close the terminal while you do this.
3. The tab says "Authorization complete" -- close it and go back to the terminal.
4. The script writes `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and
   `GOOGLE_REFRESH_TOKEN` into `scripts/google-reviews-sync/.env` (gitignored;
   existing lines such as `SHOPIFY_CLIENT_ID` are preserved). **It never
   prints these values** -- do not paste that file anywhere.
5. Smoke test: it calls `accounts.list` and prints
   `Smoke test OK ... N Business Profile account(s) visible` plus the account
   resource names (`accounts/<id>`). That proves the grant works. Add
   `--skip-smoke-test` to skip it.

If Google returns no refresh token, revoke this app's earlier access at
https://myaccount.google.com/permissions and re-run (the script forces the
consent screen, so this is rare). A 403/429 smoke-test error prints Google's
own message -- report that text (never the `.env` contents).

## What's left after authorization

1. Run `py scripts/google-reviews-sync/sync.py` once (needs `SHOPIFY_CLIENT_ID`/`SHOPIFY_CLIENT_SECRET`
   and `GOOGLE_REVIEW_URL` in `.env` too -- see `.env.example`), confirm it writes
   the metafield correctly (Shopify Admin, or a `graphql_query` read of
   `shop.metafields`), then confirm the homepage section renders the real data
   **on staging** -- full CD/TD/QA pipeline applies, same as any theme-visible change.
2. Pin `GOOGLE_ACCOUNT_ID` / `GOOGLE_LOCATION_ID` after the first successful run
   (optional -- discovery is the fallback).
3. Move the three `GOOGLE_*` values to the droplet's systemd unit environment
   (never via git) and wire a daily systemd timer/cron on the `stocktradingbot`
   droplet. Daily is plenty -- reviews don't change fast.
4. Flip `show_section` to `true` in the Shopify theme editor -- only after step 1
   confirms real data renders correctly.
5. Normal release approval (Suraj, explicit, per CLAUDE.md) before this reaches Live.

## Setting up the Shopify side (Dev Dashboard app, client credentials)

Shopify no longer allows creating classic admin "custom apps" (the old
"Develop apps -> reveal token once" flow), so there is no static
`SHOPIFY_ADMIN_API_TOKEN` to copy. Instead the sync authenticates as an app made
in the **Shopify Dev Dashboard**, using the OAuth *client-credentials* grant:
Client ID + Client secret -> `POST https://<shop>.myshopify.com/admin/oauth/access_token`
-> a short-lived (~24h) Admin API token, fetched fresh on each run and kept in
memory only (never written to disk or logged).

1. In the Shopify Dev Dashboard create a NEW app named **"K&A Reviews Sync"**.
   (Do NOT reuse or modify the existing "Stitchflow Sync" app.)
2. Give it the Admin API access scope(s) needed to write a Shop metafield and
   release a version. **Which exact scope is required is not yet confirmed**
   (Shopify's scope list does not obviously show `write_metafields`); the probe
   below will name any missing scope in Shopify's own error message, so start with
   the metafield/metaobject-related scopes on offer and adjust after the probe.
3. **Install** the app on the K&A store (d21bac.myshopify.com).
4. Open the app's **Settings** page and copy the **Client ID** and **Client secret**
   into `scripts/google-reviews-sync/.env` on your PC as `SHOPIFY_CLIENT_ID` and
   `SHOPIFY_CLIENT_SECRET` (see `.env.example`). Keep them out of chat and git.
5. `py -m pip install -r scripts/google-reviews-sync/requirements.txt`
6. Run the harmless permission probe (writes then deletes a throwaway
   `custom.sync_probe` metafield on the Shop; **never** touches
   `custom.google_reviews`; refuses to run without the flag):
   ```
   py scripts/google-reviews-sync/probe_shopify.py --yes-probe
   ```
   It prints only OK/FAILED per step plus Shopify's exact error text, which names
   any missing access scope. Fix the scope in the Dev Dashboard, release/reinstall,
   and re-run until every step is OK.

`SHOPIFY_ADMIN_API_TOKEN` is still honoured as an optional fallback, but only if
`SHOPIFY_CLIENT_ID` / `SHOPIFY_CLIENT_SECRET` are not both set.

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
- `authorize.py` -- ONE-TIME interactive OAuth consent, run locally; writes the `GOOGLE_*` values to the gitignored `.env`.
- `requirements-authorize.txt` -- extra dependency for `authorize.py` only (not needed on the droplet).
- `google_business_client.py` -- refresh-token -> access-token exchange + account/location discovery + reviews fetch.
- `shopify_client.py` -- Shopify Admin API GraphQL client, `metafieldsSet` write (real, ready).
- `probe_shopify.py` -- harmless Shopify permission probe (`--yes-probe` required; only touches `custom.sync_probe`).
- `sync.py` -- orchestrates the above; the actual entry point to run/schedule.
- `.env.example` -- variable names this expects; copy to `.env`, never commit the real one.
