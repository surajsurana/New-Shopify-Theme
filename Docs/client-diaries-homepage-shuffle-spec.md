# Homepage Client Diaries — Living Shuffle: Recommendation and Build Spec
**Date:** 2026-10-19 (task #32)
**Prototype:** `Prototypes/homepage-client-diaries-shuffle-v1.html` (real images of both live entries; Shuffle / revisit button; desktop/mobile switcher; reduced-motion toggle)
**Replaces:** the hand-set 3-image / hand-typed-caption behaviour of `sections/ka-client-diaries.liquid`
**Status:** Phase 3 prototype, awaiting Suraj's review. Not yet a build.

---

## 1. Executive summary

The homepage Client Diaries section should stop being a place we paste photographs and become a window onto the real diary. Every look image from every consented, published entry feeds one pool. Each visit shows a different, well-matched set of three. A returning bride sees faces and dresses she has not seen yet before she sees one again. New entries appear the day they publish, with no one touching the homepage.

Emotional target: **Curiosity, then Desire** ("there are real women in this house, and there are more of them every time I come back"). Not a carousel, not a feed. The quietest possible motion: a new set per visit, and one slow dissolve at a time while she lingers.

## 2. Recommendations (top choice first, with the reason)

### 2.1 Image pool — every look image, not just featured images

**Recommendation: all `look_images` across all consented, published entries, filtered, with the article featured image ranked first within each entry.**

- Featured-only gives 2 images today and 1 per bride forever. That cannot fill 3 tiles, cannot shuffle, and repeats the single most-seen frame (the hero) on both the homepage and the entry.
- All looks gives 8 usable portrait frames today (9 minus 1 landscape), and roughly 4 to 5 per bride later. 10 diaries means about 40 frames, 3 tiles at a time, so a long time before a repeat.
- The pool is filtered, not raw. Quality control is automatic where it can be, and one optional curation field covers the rest:
  1. **Orientation gate:** only images with `aspect_ratio <= 0.85` (portrait). Today this correctly drops `cd-simran-maroon-2` (3:2 landscape).
  2. **Optional curation:** a new optional list field `home_images` on `client_diary_look`. If filled, only those images from that look enter the pool; if empty, all that pass the orientation gate enter. Use it to keep out frames where the bride is too small at tile size. Real example: `cd-jinali-sagegreen-3` (garden walk) is a lovely frame at full-bleed and a speck at 360px wide. The prototype shows it excluded this way.
  3. Entries must have `custom.client_diary_consent == true`, and be published (the blog loop only returns published articles anyway).
- **Pool size cap:** newest 12 entries, up to 4 images per entry (featured first, then look order), hard cap 36 candidates. Beyond 12 entries, older diaries stop appearing on the homepage but remain fully in the archive. This keeps the inline JSON around 10 KB. Rank is by recency only for which entries get in; selection from the pool is shuffled.

### 2.2 Captions — bride's first name + occasion; link to her diary

- **Caption (hover):** `Simran` (Cormorant italic) over `SANGEET & COCKTAIL` (Jost uppercase micro), then a hairline and `Read her diary`. Occasion comes from the article's single tag (already the occasion taxonomy). Name is the first word of `article.title` (`Simran Bandukwalla` becomes `Simran`).
- Why not piece name: look names are long ("The Sage Green Jacquard Corset with Drape Skirt & Stole"), they wrap badly on a tile, and the piece belongs to the diary page where it sits next to her photographs and its shop link. A first name is intimate and exclusive-feeling; it is also what a bride or her mother wants to recognise ("Simran wore this to her sangeet"). It also speaks to non-bridal occasions with no extra copy: Welcome Event, Festive, Mother & Family, Karva Chauth.
- **Touch devices have no hover.** The current section hides captions until hover, so on mobile they never show. New behaviour on `(hover: none)` or under 900px: the caption is always shown, small, at the tile's lower edge over a soft gradient; the "Read her diary" line is hidden.
- **Link:** the whole tile is one `<a>` to `article.url`. Accessible name: `Read Simran's Client Diary — Sangeet & Cocktail`. `alt`: `Simran wearing Karishma & Ashita — Sangeet & Cocktail` (not the file's own alt, which is often empty).
- **Consent:** first name only on the homepage. Full name stays on the entry itself. The existing `client_diary_consent` gate is checked once, in the pool loop.

### 2.3 How shuffling works — combination of date-rotated Liquid first paint, plus client-side per-visit selection

**Recommendation: both, in layers. Neither alone is right.**

| Layer | What it does | Why it is there |
|---|---|---|
| 1. Liquid first paint | Section renders 3 real `<img>` tiles server-side, picked by a day-based rotation of the pool | Works with JS off, for crawlers, and for the Shopify cache; gives every tile a real box so there is **zero layout shift** |
| 2. Inline JS, per visit | A small script placed right after the grid reads the pool JSON and replaces the 3 images with a fresh, rule-matched set | Gives real per-visit freshness on a cached page |
| 3. Slow on-page dissolve | One tile at a time cross-fades to a spare image | "Keeps changing on its own" for a visitor who stays; strictly capped |

**Date rotation (Liquid, layer 1).** `seed = 'now' | date: '%s' | divided_by: 86400` (days since epoch). Walk the pool by a stride coprime to its size starting at `seed mod pool.size`, applying the same diversity rules (max 2 per diary). It changes daily even if no JS runs and no diary is added. Cached pages may serve yesterday's seed for a while; that is harmless because layer 2 supersedes it.

**No flicker of the wrong images.** The section is far below the fold and its `<img>`s are `loading="lazy"`, so the browser has not requested them when the inline script runs during parsing. The script swaps `src`/`srcset`/`alt`/`href`/`object-position` before any fetch or paint of that region. The visitor never sees the server image. In the rare case the section is already in the viewport (deep link, restored scroll), see the guard in 3.3.

**Per-visit rules (layer 2).**
1. **Unseen first.** `localStorage` keeps a list of image ids this browser has been shown. Unseen images rank before seen ones; when everything has been seen, the list resets. This turns "random" into "always something new for returning visitors" and matters most while the pool is small (8 images today).
2. **Diversity:** at most 2 images from one diary; at least 2 diaries when 2+ exist; avoid two images from the same look when another look is available.
3. **Large tile gets the best-suited frame.** Prefer a single-subject, full-length frame for the large tile; couples and close portraits go to the smaller tiles. Needs no new data if the pool lists the featured image first within each entry, since the featured image is by house convention the full-length editorial frame (documented for both live entries).
4. **Pinned lead** (see 2.5) overrides tile 1.
5. **Session-stable:** the chosen set is stored in `sessionStorage`. Scrolling away, opening a product, and pressing Back gives the same three; closing the browser and returning later gives a new set. A page that rearranges itself on every navigation would feel broken.

**On-page dissolve (layer 3): yes, but only as a breath.**
- One tile at a time, every ~9 s (randomised 8 to 12 s), 1.8 s opacity cross-fade (`ease-in-out`), no movement, no zoom, no sliding. The new image is decoded off-screen first; the swap only begins once it can paint.
- Only while the grid is at least 35% in view (IntersectionObserver); paused while the tab is hidden, while the tile is hovered or focused, and **capped at 4 dissolves per page view**, then the section rests. A visitor who is reading the text next to it is never fighting motion.
- Never changes two tiles in the same cycle; never repeats an image already visible; never goes below the diversity rules.
- No pager, no dots, no arrows, no autoplay controls. There is no carousel UI to describe.
- Exposed as a theme setting ("Slow image dissolve", checkbox, default on) so Suraj can switch it off without a build.

**Reduced motion.** `prefers-reduced-motion: reduce` turns the dissolve off entirely and makes any swap instant. Per-visit selection still happens (it is a change between visits, not motion).

**No-JS / crawler.** Layer 1 output stands on its own: three real linked images with names. Nothing about the section is JS-only.

### 2.4 Composition and cropping — keep three images and the text column, but change the geometry (strong reason)

**The reason:** the live section stacks two image slots at ~700x500 (landscape) in column 3, and sizes the section by `min-height: 70vh`. Eight of the nine real diary photographs are 2:3 portraits that show **face and outfit in one frame** (full-length, hem to head). A landscape slot keeps about 44% of such a photo's height: a face and a bodice, no skirt. That is exactly the "just a face" outcome Suraj rules out. Hand-picked images could dodge this; a live pool of images from many shoots cannot.

**New geometry (desktop):** four tracks `1.15fr | 0.8fr | 1fr | 1fr`, gap 3px, in this order: **large tile, text column, tile, tile**. Row height is set by the large tile's `aspect-ratio: 4/5`, not by viewport height. The two right tiles fill the row height and at that width land at ~0.70, close to the native 2:3 (0.667), so the crop is under about 6% on any side. All three tiles are portrait. The text column keeps its role and copy.
**Mobile:** large tile full width at `3/4`, then the text block, then two tiles side by side at `2/3`. (Prototype order puts text between; the existing section's mobile order is retained.)

**Focal points.** Each tile uses `object-fit: cover` with `object-position` taken from the image's own **Shopify focal point** (Admin > Content > Files > edit image > set focal point), read in Liquid from `image.presentation.focal_point` (a `"x% y%"` string). The pool JSON carries it per image. Default when none is set: `50% 40%` (face sits high, outfit below; 40% keeps the head and most of the garment on a full-length frame). Rule for whoever uploads: **set the focal point on the face-to-waist line of the frame, not on the face alone**; the checklist in 4.6 says so.
Landscape and square images never reach a tile because of the orientation gate; there is no "crop a landscape" case to solve.

### 2.5 Fallback and manual curation

**Fallback ladder (evaluated in Liquid, then confirmed in JS):**
1. Pool has 3+ images from 2+ diaries: full behaviour.
2. Pool has 3+ images, one diary only: allowed (max-2 rule relaxed to 3, look-diversity kept); dissolve limited to unseen images of that diary.
3. Pool has 1 or 2 images: those appear first; the remaining slots are filled from the **manual fallback images** in the section settings (the existing `image_tall`, `image_mid_1`, `image_mid_2` pickers, kept under those same ids) with their existing captions; no JS selection, no dissolve.
4. Pool has 0: render exactly today's static section (manual images, then the `client-diaries-1/2/3.jpg` theme assets). Nothing breaks if every entry is unpublished or consent is withdrawn.
5. Dissolve needs at least 1 spare image beyond the 3 shown; otherwise it is off automatically (the prototype's `eligible.length <= 3` guard).

**Pinning a favourite.** Two ways, both optional:
- **Lead diary** (section setting, `article` picker): that diary's best image always takes the large tile; the other two tiles shuffle from everyone else. Use it to lead with a bride whose story is current (a new entry, a festival like Diwali or Karva Chauth).
- **Block "Pinned look"** (up to 3 blocks, `article` picker + optional `image_picker` override): if filled, those images take priority slots in the pool selection for that many tiles. Empty = fully automatic. A pinned image honours the consent gate too.
Default state after build: nothing pinned, fully automatic.

## 3. Build specification (platform-agnostic, then Shopify notes)

### 3.1 Components, in DOM order
1. **Header**: eyebrow ("Real Brides") + H2 ("Client Diaries"), unchanged.
2. **Grid** (`.ka-lookbook__grid`): 4 children: `tile 0 (lead)`, `text column`, `tile 1`, `tile 2`.
3. **Tile** (`<a class="ka-tile">`): a stack of `.ka-tile__layer` (one or two, for cross-fade) each containing one `<img>`; `.ka-tile__veil` gradient; `.ka-tile__cap` (name, occasion, "Read her diary").
4. **Text column**: unchanged copy and CTA ("Read the diaries" links to the blog index; keep `/pages/client-diaries` if that remains the index route).
5. **Pool JSON**: `<script type="application/json" id="ka-cd-pool-{{ section.id }}">` containing an array of `{ id, d (diary handle), first, occ, url, look, src, w, h, fp, hero }`, ordered newest entry first.
6. **Inline controller script** (about 3 KB, no dependencies), placed immediately after the grid.

### 3.2 Exact behaviour
- **Selection:** as 2.3, rules 1 to 5. `id` = `{article.id}:{image.id}`.
- **Swap method:** build the new layer, `img.decode()`, then insert and fade `.is-on`; fall back to immediate swap if `decode` is missing. Old layers removed after the transition.
- **Image sizing:** `image_url: width: 900` for the large tile and 720 for the others in the pool (one `src` per pool entry, 900 is acceptable if the TD prefers one value); `sizes` set per slot; first-paint `<img>`s carry intrinsic `width`/`height` of the file so the aspect box is reserved. `loading="lazy"`, `decoding="async"`.
- **Hover (pointer devices):** existing veil + caption reveal, existing 1.2 to 1.4 s image scale to 1.03; caption now name + occasion + "Read her diary".
- **Touch / under 900px:** caption always visible, small; veil always on at a low opacity. No hover-dependent information.
- **Dissolve:** as 2.3, layer 3. Paused on hover/focus-within of the tile; cleared on `visibilitychange` hidden and on section leaving the viewport.
- **Focus:** the tile is a normal link; `:focus-visible` shows a 1px antique-gold inset outline.
- **Reduced motion:** no dissolve, no scale, no transitions on layers.
- **Storage failures** (private mode, blocked storage): wrap in try/catch; selection still works, just without "unseen first" and session stability.
- **First-paint guard:** if the section's top is within the viewport when the script runs, run the swap before its `<img>`s have `src` (i.e. server markup for the lead tile uses `loading="eager"` only when the section is the first thing in view, which never happens on the homepage). Practically: on the homepage, no special handling is needed. If the section is later reused near the top of a page, the TD should render the first paint with `visibility:hidden` on the layers until the script marks `data-ready`, plus a `<noscript>` rule that undoes it.

### 3.3 Design tokens
No new colour, type, or spacing tokens. Reused: `--c-paper-deep`, `--c-charcoal`, `--c-rosegold`, `--f-display`, `--f-sans`, `--ease-luxury`, `--dur-med`, `--gutter`. **One new token:** `--dissolve: 1.8s` for the on-page cross-fade (section-scoped is fine). Aspect ratios `4/5` (lead, desktop), `3/4` (lead, mobile), `2/3` (small tiles, mobile) are layout constants.

### 3.4 Content and data needed
- **Photography:** nothing new to shoot. Gold-standard rule for every new entry: **at least 3 portrait frames per look, at least one full-length**, so the pool never has a thin diary. Landscape is welcome on the entry page; the orientation gate keeps it off the homepage tile.
- **Focal points** set on every look image in Shopify Files (see 2.4); the 9 existing images should be done once when this ships.
- **Copy:** no new homepage copy; fixed strings: `Read her diary`. Alt text template: `{first} wearing Karishma & Ashita — {occasion}`.
- **Data (new, all optional):** `client_diary_look.home_images` (list of file references, same type as `look_images`); no article metafield additions.

### 3.5 Shopify notes (for Technical Director)
- **Schema limits (CLAUDE.md known issue):** section `name` and preset `name` and block `name` all **25 characters or fewer** ("Client Diaries" is 14; "Pinned look" 11; "Pinned diary" 12). **No `default` on any `url` setting** (`text_cta_url` already has none; keep it that way). Run `scripts/validate-theme-schema.ps1` before pushing.
- **New section settings** (labels any length; ids lower-snake): `enable_shuffle` (checkbox, default true), `enable_dissolve` (checkbox, default true), `lead_article` (`article` picker), plus blocks `pin` (name "Pinned look": `article` picker, `image_picker`). Keep existing `eyebrow/title/text_*` ids and keep `image_tall`, `image_mid_1`, `image_mid_2`, `caption_*` as the **manual fallback** group so `templates/index.json` stays valid with no migration. Relabel them "Fallback image ..." and the caption headers "Fallback captions".
- **List metafields need `.value`:** `article.metafields.custom.client_diary_looks.value` and `look.look_images.value`, exactly the fix documented in `sections/ka-diary-looks-spreads.liquid`. The bare dot path returns a non-iterable wrapper (that bug has already cost a day).
- **Pool loop:** `blog = blogs['client-diaries']`; `for article in blog.articles limit: 12`; skip when `article.metafields.custom.client_diary_consent != true`. Nested loops (article, look, image) are cheap at these caps; note Shopify's Liquid render time budget and keep the cap.
- **Feasibility flags (check early):**
  1. `image.presentation.focal_point` on **file-reference images inside metaobjects**. Documented for image objects, but verify it returns the file's focal point in this nesting; if not, fall back to a per-look `home_focal` text field ("50% 40%") or a default.
  2. `image.aspect_ratio` on file references (needed for the orientation gate). If missing, compute from `image.width / image.height`.
  3. `blog.articles` only returns published articles; an article scheduled for the future will not appear. That is the desired behaviour.
  4. Metaobject definition **storefront access** must be enabled for `client_diary_look` (already needed by the entry template; confirmed working per the 2026-08-11 notes).
  5. Day seed via `'now' | date: '%s'`: the value is the render time of the cached page, not the visit time. Acceptable because layer 2 overrides it; this is why layer 2 exists.
- **No platform gap** for the JS layers: everything is theme-asset JS/CSS, `localStorage`, and `sessionStorage`. No app, no server code. Cross-device memory ("unseen first" across phone and laptop) is not possible without an account system and is deliberately out of scope.
- **Theme editor behaviour:** in the Theme Editor, shuffle and dissolve should be disabled (`Shopify.designMode`) so the previewed set is the Liquid-rendered one and editing does not flicker.
- **Performance:** only the 3 chosen images are ever downloaded on load; the dissolve preloads one at a time on demand. Pool JSON about 10 KB. No new third-party requests.

### 3.6 Responsive summary
| Breakpoint | Layout |
|---|---|
| Above 900px | 4 tracks: lead 4/5, text, tile, tile; hover captions |
| 600 to 900px | 2 columns: lead full width at 3/4, text full width, two tiles at 2/3; captions always visible |
| Under 600px | same as above; gutter 20px; caption type 1rem name / 0.55rem occasion |

### 3.7 Build complexity
**Moderate.** Liquid pool and date-rotation logic: moderate. Inline controller JS: moderate (about 150 lines). CSS: simple (small delta from the current file). Content setup (focal points on 9 images; optional `home_images` field): simple.

## 4. What this decision rests on

### 4.1 Luxury rationale
Dior, Chanel and Sabyasachi never show a spinning feed; but the best of them let the site feel alive between visits (changing campaign imagery per season, per visit). Letting the diary change by itself says "the house has many brides", which is exclusive in the most honest way: a depth that cannot be faked with a banner. The dissolve is the lowest-energy motion we can offer: no direction, no UI, no loop the eye is invited to follow.

### 4.2 Business rationale
Fresh, real faces raise return-visit engagement and give every bridesmaid, mother and festive shopper a nearer match to herself (different occasions in the same three tiles). Each tile is a direct, relevant entry point to a diary that already carries shop links and the appointment CTA. New entries flow to the highest-traffic page without a Technical Director ticket.

### 4.3 Risks and how they are handled
- A weak frame appears on the homepage: orientation gate plus optional `home_images` curation plus the "featured image first" convention.
- Pool too small at launch (8 frames, 2 diaries): unseen-first rotation, relaxed rules, and the fallback ladder.
- Layout shift or flicker: reserved aspect boxes, lazy images swapped before fetch, decode-before-reveal.
- Motion fatigue or accessibility: dissolve capped at 4, reduced-motion respected, off switch in settings.
- Consent withdrawn: setting `client_diary_consent` to false removes every image of that bride from the homepage on the next render, and the cached first paint ages out; no extra step.

### 4.4 Priority and impact
Priority: **high** for Suraj's stated goal; the section currently never reflects new entries. Expected impact: higher click-through into diaries from the homepage, and a homepage that stays fresh without upkeep.

### 4.5 Luxury Board check
Removed: auto-rotating carousel with dots, "Shop this look" overlays on tiles, scarcity/"new" badges, Instagram-style masonry. Kept: one first-name caption, one hairline, one slow dissolve.

### 4.6 Content checklist for every new diary (put in the entry-creation guide)
1. 3+ portrait frames per look; 1+ full-length.
2. Featured image = the full-length editorial frame (already the rule).
3. Set Shopify focal point on the face-to-waist line, not the face alone, on every image.
4. If a frame is too wide or the bride too small, leave it out of `home_images`.
5. Occasion tag set (it is the caption).

## 5. Decisions needed from Suraj
1. **Dissolve while on the page: on (recommended, capped at 4, ~9 s apart) or between-visits only?**
2. **Caption: first name + occasion (recommended)**, or also the piece name?
3. **Approve the geometry change** (all-portrait tiles, 4/5 lead) over keeping the current stacked landscape pair. Recommended for the face-and-outfit rule.
4. **OK to add the optional `home_images` field** on `client_diary_look` (needs Suraj or whoever owns Shopify metaobject definitions to add it) and to set focal points on the existing 9 images?
5. **Pinning:** is a single "Lead diary" setting enough, or do you also want the 3-block pin?
6. Homepage cap of the newest 12 diaries: fine for now, or should every diary ever published be eligible?

## 6. Luxury scorecard of the proposed section (before the build; page-level scores unchanged)
Editorial 9, Photography 9 (all real clients, portrait, face and outfit), Luxury pacing 9, Storytelling 9, White space 8, Mobile 8 (captions always visible; two tiles side by side), Brand consistency 9. Emotional read: Curiosity then Desire.
