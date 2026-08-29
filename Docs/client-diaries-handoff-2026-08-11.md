# Client Diaries — Handoff Brief (2026-08-11)

Continuing this in a new session. This doc is self-contained — read it in full before doing anything.

## Goal

Get the "Client Diaries" feature live on staging with Simran Bandukwalla's story as the first real, published entry, then QA-verify it before reporting done.

## What's already built (code, in git on `staging` branch)

Full theme code for two templates exists in this repo, built by Technical Director from an approved Creative Director spec:

- **Index page** (`/pages/client-diaries`) — replaces the old "Coming Soon" placeholder. Files: `templates/page.client-diaries.json`, `sections/ka-diary-mast.liquid`, `ka-diary-intro.liquid`, `ka-diary-featured.liquid`, `ka-diary-filter.liquid`, `ka-diary-grid.liquid`, `ka-diary-share.liquid`, `snippets/ka-diary-card.liquid`.
- **Entry template** (alternate article template) — files: `templates/article.diaryentry.json`, `sections/ka-diary-entry-hero.liquid`, `ka-diary-entry-review.liquid`, `ka-diary-entry-atelier.liquid`, `ka-diary-entry-looks.liquid`, `ka-diary-entry-more.liquid`, `snippets/ka-diary-look-spread.liquid`. Section order: Nav → Entry Hero → Her Review → From the Atelier → Look Spreads (one per outfit) → More Diaries/Share → Appointment CTA → Footer.
- CSS: `assets/ka-diary-*.css` (11 files).
- Reference docs: `Docs/client-diaries-build-spec.md` (full spec), `Prototypes/client-diaries-index-v1.html` and `Prototypes/client-diaries-entry-v1.html` (approved visual prototypes, open directly in a browser).

All of this reuses the existing `assets/ka-base.css` design tokens — no new design system was invented.

## ⚠️ STEP 1 — confirm the deployment gap is actually closed (do this first)

As of my last direct check (Admin GraphQL, staging theme `gid://shopify/OnlineStoreTheme/189829808418` — **re-verify this ID is still current, it changes on every GitHub disconnect/reconnect**), these 4 files were still missing from the live staging theme despite being correctly committed and pushed to `origin/staging`:

- `templates/article.diaryentry.json`
- `sections/ka-diary-entry-atelier.liquid`
- `sections/ka-diary-entry-looks.liquid`
- `sections/ka-diary-entry-more.liquid`

This is a real, reproducible silent GitHub→Shopify sync failure — the known failure class documented in `CLAUDE.md`'s Deployment Verification section. **Already tried and failed to fix it:**
1. Two separate git pushes updating these files' content (commits `df0055a`, `44a2b42`).
2. A delete-then-recreate of the same 4 files as brand-new files (commits `158db10`, `6d01af7`) — different sync-trigger path, still failed.
3. A full GitHub disconnect/reconnect of the staging theme (this is what changed the staging theme ID) — a complete fresh resync of all 294 files, and these 4 specific files *still* didn't come in.

**Do not repeat these same attempts** — they're confirmed not to work. Options from here:
- Manually paste these 4 files' content into Shopify Admin's own code editor (Online Store → Themes → staging → Edit code) — this bypasses GitHub sync entirely and is the most likely to actually work.
- Try a direct Admin API `themeFilesUpsert` write (bypasses GitHub sync) if you have write/mutation access in this session that wasn't available in the prior one.
- If genuinely stuck, consider whether these 4 files specifically might need renaming (untested theory: possible stuck dedup state on Shopify's side keyed to these exact filenames+paths, surviving even the theme reconnect) — if you rename them, update the cross-references: `templates/article.diary.json`'s `"type"` fields reference the 3 section files by their filename (minus `.liquid`), so a rename to the sections requires updating the template's `sections.*.type` values and the `order` array to match.

**Re-verify via Admin GraphQL before proceeding to Step 2** — query `theme(id: "<current staging ID>") { files(filenames: [...]) { nodes { filename } } }` for these 4 filenames and confirm all 4 return.

## STEP 2 — create required Shopify Admin definitions (manual, cannot be done via read-only API)

None of these exist yet as of this build. Create in Shopify Admin:

1. **Blog**: "Client Diaries", handle `client-diaries` (Online Store → Blog posts → Manage blogs → Add blog).
2. **Metaobject definition**: `client_diary_look` (Content → Metaobjects → Add definition). Fields:
   - `look_name` (single line text)
   - `look_description` (multi-line text)
   - `look_images` (list of file/image references)
   - `cta_label` (single line text, optional)
   - `category_link` (URL, optional — links to a collection, not a specific product since these are made-to-order)
   - `product_link` (URL or product reference, optional nice-to-have)
3. **Article metafield definitions** (Settings → Custom data → Articles → Add definition):
   - `custom.client_diary_atelier_note` — multi-line text
   - `custom.client_diary_consent` — boolean (**publishing gate** — every diary section checks this is `true` before rendering any name/image; false/unset = entry is structurally invisible everywhere)
   - `custom.client_diary_year` — single line text (optional override; year can also just live in the article's published date)
   - `custom.client_diary_looks` — list of metaobject references → `client_diary_look`

## STEP 3 — create and populate Simran's entry

1. Create a new article in the "Client Diaries" blog.
2. **Title**: Simran Bandukwalla
3. **Tags**: `Sangeet & Cocktail` (this is the occasion taxonomy the theme filters/groups by — other valid values used elsewhere in the code: `Bridal`, `Festive`, `Mother & Family`)
4. **Excerpt/Summary** (native Shopify field, renders as "Her Review"): *"My experience was so so good!! I truly loved all my outfits. I think my most favourite would be the red outfit. It made me feel like a total princess!!"*
5. **Featured image**: use one of her real photos (see below) as the article/hero image.
6. **Theme template**: in the right sidebar, under "Theme template", select **"diaryentry"** (this is what makes it render with the Client Diaries entry template instead of the default Journal article template — easy to miss).
7. Set metafields:
   - `custom.client_diary_consent` → **true** (Suraj has confirmed full consent for name + images to be used anywhere on the site/marketing)
   - `custom.client_diary_atelier_note` → *"It was such a pleasure being a part of her bridal journey! She initially came in looking for the perfect red outfit and we're so happy that she ended up falling in love with our designs and choosing 3 outfits for her wedding functions."*
   - `custom.client_diary_looks` → create 3 `client_diary_look` metaobject entries, one per outfit:
     1. **Maroon corset with fishcut lehenga** (the red outfit — her favorite, mention this if it fits the design)
     2. **Pink embroidered lehenga with blouse**
     3. **Golden blouse & fishcut lehenga**
     
     Each look needs at least one real photo attached via `look_images`.

## Source photos

5 real event photos exist, already committed to the repo:
- `Prototypes/images/cd-simran-*.jpg`
- `assets/cd-simran-*.jpg`

If those are gone for any reason, they can be re-extracted from the original source doc: `Client Diaries/Simran Bandukwalla client diaries with occ.docx` is a zip file — images are at `word/media/image1.jpeg` through `image5.jpeg` inside it. Content of the photos: a couple portrait against a red rose heart backdrop (maroon outfit), a candid cake-cutting/stage moment (maroon outfit), a red-carpet entrance shot (maroon outfit), a solo shot in a gold two-piece lehenga (golden outfit), a solo twirling shot in a pink lehenga (pink outfit).

## STEP 4 — QA and merge (do not skip)

Per this project's standing rule, **no theme change gets reported as "done" without independent QA verification** — both design fidelity against the approved prototypes and actual deployment state (confirm file presence/content on the real staging theme via Admin API, not just "git push succeeded"). Use the QA Reviewer agent for this.

**Do not merge `staging` → `main` without Suraj's fresh, explicit, release-specific approval** — this is never standing, regardless of any earlier approval on other work.

## Reference: full CLAUDE.md context

This repo's `CLAUDE.md` has the full standing rules for this project (staging/live theme IDs — always re-verify live, never trust a hardcoded ID — deployment verification procedure, QA gate, LIVE↔STAGING drift check before any release). Read it before doing theme work if the new session hasn't already.
