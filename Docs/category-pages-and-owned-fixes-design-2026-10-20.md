# Category pages and owned-page fixes: design and build note

**Author:** Creative Director · **Date:** 2026-10-20 · **Status:** Recommendations for Suraj and Technical Director. No theme, Shopify or git changes made.
**Source:** SEO & Discoverability owned-pages spec (`SEO & Discoverability/Docs/specs/2026-10-20-owned-pages-fixes-for-website-engineering.md`). Item numbers (#2, #3, #5 ...) match it. Facts marked (code) were read from the theme files in this folder; (live) from karishmaashita.com on 2026-10-20.
**Not touched:** `Docs/category-pages-copy-2026-10-20.md` (the other CD's file). The metafield values in SEO's spec Priority 1 are assumed as written.

---

## Executive summary

The four category pages are the house's best search-facing pages and the least designed. They share one template, so today they carry the same hero (maroon raw silk), the same eyebrow ("The Collections — 01", which also collides with the Festive Edit's own "01"), and no way in except Journal posts.

One idea runs through every recommendation below: **the house has two ways of being shopped.** By story (the capsules: Loomière, First Love, Festive Edit, Bloom Soirée, Chamakk, Barre Oblique) and by garment (the four silhouettes: Lehengas, Drape Sarees, Indo-Western, Corsets). A bride shops by story. A mother, sister or bridesmaid usually shops by garment ("I need a saree for the sangeet"). Both are first-class, and they must never sit in one flat, mixed list. Everywhere they appear, capsules come first and silhouettes appear as a quieter second chapter headed **By Silhouette**.

| # | Item | Recommendation in one line | Complexity | Priority |
|---|---|---|---|---|
| 3 | Link the 4 pages | `/collections` gets a second chapter "By Silhouette"; footer menu gets a quiet two-part Collections column; cross-link strip becomes ring-ordered and silhouette-aware; search chips become the four silhouettes. No nav dropdown. | Simple to moderate | High |
| 2 | Render `collection.description` | New "About this Collection" block below the grid; collapsed with a fade past about 10 lines; renders nothing when empty; on every collection template. | Moderate | High |
| 5 | Per-collection hero and eyebrow | Hero from the collection's own image, eyebrow and focal point from two small metafields. Four real hero photographs named below. | Simple | Medium |
| 4 | Copy fit checks | #7 fits, #8 trim one, #11 do not replace the opening sentence, #16 and #17 fit, #27 fits. | Content | Low |
| 5b | Journal tags heads-up | No design review needed if the tags are the existing four exact category strings. | None | Info |

---

## 1. #3: Linking the four category pages

### Current issue and evidence
- Live footer Collections column is the hardcoded fallback: Festive Edit, Bloom Soirée, Chamakk, Barre Oblique, Signature (live). No `footer-collections` menu exists. First Love and Wedding Festive are not in it either.
- `/collections` shows six capsule cards (live): First Love, Festive Edit, Bloom Soirée, Chamakk, Barre Oblique, Wedding Festive. Four per row, so the last row is an orphan pair.
- `ka-collection-cross-link.liquid` is fixed to four capsule handles in a **3-column** grid. On any non-capsule page (which the category pages are) it shows four cards: three plus one orphan. On capsule pages it shows three. This is an existing flaw, and the category pages make it visible.
- Search overlay chips: the five chips are all capsule names. Chip clicks run a search (they are intercepted in `ka-search.js`), and the three image tiles all have blank URLs, so every tile goes to `/collections` (live).
- Eyebrow numbering is already inconsistent: the list page numbers First Love 01, but the pages themselves say Festive Edit 01 and First Love 05 (code). Signature has an empty position that falls back to "01" (code: `default: '01'`).

### Luxury rationale
A flat list of ten collections reads as a catalogue and marketplace-like. Two named chapters read as a house with a point of view: "our collections" (the creative work) and "by silhouette" (how you wear it). Restraint means no dropdown, no mega-menu, no badges, no "New" tags.

### The recommendation, surface by surface

**A. Primary nav: do nothing.** Keep the four deliberate items. "Collections" already goes to `/collections`, and that page is now the complete answer. A dropdown of ten links is exactly the busy, marketplace pattern to avoid, and it would date with every launch. Mobile drawer: same.

**B. `/collections` page (`list-collections.json`).**
- Keep the existing section as chapter one: capsules only, in this order, newest first: Loomière (when live), First Love, The Festive Edit, The Bloom Soirée, Chamakk, Barre Oblique, The Wedding Festive Collection.
- Add a **second instance of the same section** below it as chapter two. Eyebrow "Maison" is replaced by a quiet label; title (an H2, not an H1): **By Silhouette**. Four blocks in this order: Lehengas, Drape Sarees, Indo-Western, Corsets. Four cards fill the existing 4-column grid exactly, so there is no orphan row.
- The cards use the same portrait card and same hover. Two small code changes in `ka-collections-list.liquid`: a `show_numbers` checkbox (silhouettes must not print "01 to 04", which would read as a ranking and clash with the capsule numerals) and a `heading_level` select (H1 on the first instance, H2 on the second, so the page keeps exactly one H1).
- Card images come from each collection's own image (Admin), which is also what feeds the hero (see section 3), so this costs no extra asset work.

**C. Footer Collections column.** Create the Admin menu `footer-collections` (this replaces the hardcoded fallback, so the capsules must be in it, as SEO noted). Use a **nested menu**: six capsule links at the top level, then one top-level item "By Silhouette" with the four silhouettes as its children.
- Order: Loomière, First Love, The Festive Edit, The Bloom Soirée, Chamakk, Barre Oblique, then the sub-label **By Silhouette**, then Lehengas, Drape Sarees, Indo-Western, Corsets.
- Signature leaves the footer column (it is the first link in the primary nav; footers should not repeat the nav). Wedding Festive stays reachable via `/collections` only (it is a catch-all, not a chapter). Both are Suraj's call (Decision D4).
- Code (`ka-footer.liquid`): when a menu link has children (`link.links.size > 0`), render its title as a small non-clickable label (same style as `.ka-footer__col-title` but smaller and muted, with extra top margin) and its children as the normal list beneath. Update the hardcoded fallback to the same structure so deleting the menu never regresses.
- Height: the column goes from 5 rows to 11 rows (the Maison column has 7). That is about two extra lines of height at the footer's current size; acceptable, and the Contact column absorbs the difference. If Suraj wants it shorter, drop the two oldest capsules, not the silhouettes.

**D. `ka-collection-cross-link.liquid` (the "Other Collections" strip).** Two changes.
1. **Ring order, three cards.** Replace the fixed four-handle list with one ordered list of the six capsule handles. For the current page, start at the item after it and take the next three, wrapping around. That fixes the orphan, gives every collection equal cross-link exposure, and remains a hand-maintained, non-algorithmic list (the original spec's intent, CD Note 5). Handles: `loomiere|first-love|the-festive-edit|the-bloom-soiree|chamak|barre-oblique`. On a silhouette page, there is no "current capsule", so start at the top and show the first three.
2. **A second list for silhouette pages.** When `collection.handle` is one of `lehengas|drapes|indo-western|corsets`, show the other three silhouettes instead, with eyebrow "Continue Through the Maison" and title "The Other Silhouettes". On capsule pages and silhouette pages alike, add one quiet text line under the grid, in the existing small tracked-caps style: "Or shop by silhouette: Lehengas · Drape Sarees · Indo-Western · Corsets" (links) on capsule pages, and "Or explore the capsule collections" (one link to `/collections`) on silhouette pages. No extra images, no extra row.
- When Loomière launches, add `loomiere` to the first of the two handle lists. Its card image comes from `collection.image` (already first in the lookup).

**E. Search overlay (settings only, no code).** The empty-state chips should be what people actually look for. Set chip labels to: **Lehengas, Drape Sarees, Indo-Western, Corsets, Loomière** (Loomière replaces Signature while new; afterwards Signature or Corset Lehengas). Chips run a product search, which is correct for a search box. Leave the three image tiles on capsules (image-led, story-led) but **set their URLs**: they are blank today and every tile lands on `/collections`. This is a two-minute Admin task.

### Section/component breakdown (what Technical Director builds)
1. `list-collections.json`: second `ka-collections-list` instance with four blocks; `ka-collections-list.liquid`: `show_numbers` and `heading_level` settings.
2. `ka-footer.liquid`: child-link rendering (label + children) in the Collections column; update fallback; small CSS for `.ka-footer__sublabel`.
3. `ka-collection-cross-link.liquid`: ring-order logic, silhouette mode, one text line. Grid stays 3-column.
4. Admin: menu `footer-collections` (nested); nav search chip labels and tile URLs; set `collection.image` on the four silhouettes.

### Design tokens
None new. Footer sub-label: existing sans, 0.62rem, tracking 0.16em, uppercase, muted ink (same as `.ka-coll-intro__fact-label`).

### Platform note (one line)
Nested menu children are readable in Liquid (`link.links`), but if the theme has a header/footer cache or the menu is edited in Admin only, the hardcoded fallback no longer shows, so test with the menu present and absent.

### Loomière slot
Collections page: first block of chapter one. Footer: first capsule link. Cross-link: first handle in the ring. Search: chip five (and optionally tile one, as the launch brief suggested). Nothing else moves. No numbered eyebrow (see D2).

### Business rationale
Four pages that rank and convert on exact-match garment searches ("corset lehenga", "drape saree") become reachable by a human in one click from the footer and `/collections`, and by crawlers from every collection page via the cross-link strip.
**Expected impact:** High for discoverability, neutral on perceived exclusivity (the chapters read as editorial, not as a filter list).

---

## 2. #2: Rendering `collection.description`

### Current issue and evidence
No collection section outputs `collection.description` (code: the only description references in `sections/` are product-card fabric lines). The Corsets collection has about 450 words that nobody can see.

### Recommendation
A new section, **`ka-collection-description`**, placed **after the product grid and before the cross-link strip**, on **every collection template**: `collection.json` plus all seven alternates (`barre-oblique`, `bloom-soiree`, `chamak`, `festive-edit`, `first-love`, `signature`, `wedding-festive`) and the future `loomiere`. It is safe everywhere because it renders nothing when there is nothing to render.

Why below the grid: the hero and intro already open the page in the house's voice and give the facts. A bride should reach the pieces first. The long note is for the reader who wants to understand structure, fabric and occasions, and for search and AI engines, and it should not delay the pieces.

### Visual description
A quiet editorial coda, set off by a hairline rule and generous padding (`--s-xl` above and below). Two columns on desktop, mirroring the Intro section's own 1:1 grid so the page has a consistent rhythm:
- **Left column:** eyebrow "About This Collection" (existing eyebrow style, muted); beneath it the collection title in the italic display face at the intro-fact size (`clamp(1.4rem, 2.6vw, 2.2rem)`). Sticky is not needed.
- **Right column:** the description body at a comfortable measure (about 62 characters, `max-width: 34rem`), light-weight sans at the Intro body size, line-height 1.9, colour `--c-ink-mid`. Paragraph spacing `1.4em`. Links use the existing rose-gold underlined link style (as in `.ka-acc__inner a`). Any lists use the em-dash bullets already defined in the product accordion. Headings that authors put in the Admin description (use H3 only) render in the display italic at body-plus size.
- Mobile: single column, left-aligned, same 16px gutter as the rest of the page.

### Behaviour
- **Long descriptions (over roughly ten lines at the column width, which is about 120 words):** collapsed by default to about **15.5em** of text with a soft fade (a linear gradient to the page background over the last 4em) and a text link beneath: **"Read the full note"**; expanded it becomes **"Show less"**. The expand is a smooth height transition (`--ease-luxury`, about 600ms), honouring `prefers-reduced-motion`. The toggle appears only if JavaScript measures an overflow. **The full text is always in the DOM** (collapse is CSS height only, not removal), and with JavaScript off the whole note simply shows. No `display:none`, so nothing is hidden from crawlers or screen readers; the toggle uses `aria-expanded` and `aria-controls`.
- **Medium (about 25 to 120 words):** shown in full, no toggle.
- **Very short (under about 25 words, one or two sentences):** do not use the two-column layout. Render a single centred line or two in the italic display face, as a quiet closing note, no eyebrow.
- **Empty:** the section outputs **nothing at all**: no rule, no padding, no placeholder. Test with `collection.description | strip_html | strip | size == 0`.
- **Pagination:** render only when `current_page == 1`, so the note does not repeat on `?page=2` and further.
- **Refine-chip views** (`/collections/corsets/lehengas`): hide the note when `current_tags` is non-empty, for the same reason.

### Before release (important)
Because this will make **any existing Admin description on any collection suddenly visible**, Technical Director should list the current description of every published collection first (Admin or Storefront API). Anything old, test-like or duplicating the Intro must be cleared or approved by Suraj before this goes live. Capsule collections that already carry their story in the template should simply have an empty description.

### Section/component breakdown
One section file, one small CSS file, about 15 lines of JS (measure, toggle, `aria-expanded`), a schema with only an optional "Eyebrow text" setting. Add to the 8 collection templates.

### Design tokens
None new.

### Copy needed
Only the eyebrow ("About This Collection") and the two toggle labels ("Read the full note" / "Show less"). Descriptions themselves are the other CD's and SEO's.

### Business and luxury rationale
Long-form product knowledge is what a considered buyer (and a mother choosing for a daughter's wedding) rewards with trust, and it earns search and AI visibility. Collapsing keeps the gallery in charge. **Complexity:** moderate. **Impact:** High (Corsets immediately; the other three once descriptions exist).

---

## 3. #5: Per-collection hero and eyebrow, with least build

### Current issue
All four pages show the maroon raw silk hero because the default template sets `hero_image` to `maroon_raw_silk.jpg`, and "The Collections — 01" because `position` defaults to "01".

### Least-build recommendation
Keep **one shared default template** for the four pages (no four alternates to maintain) and let each collection carry its own look from Admin.
- **Hero image:** change the lookup order in `ka-collection-hero.liquid` to: section setting, then the known-capsule handle images (so no capsule changes), then **`collection.image`**, then charcoal. Clear the `maroon_raw_silk.jpg` setting from `collection.json`. The same photograph then also feeds the `/collections` card and the cross-link card with no extra work.
- **Eyebrow:** if collection metafield `custom.hero_eyebrow` has a value, print it. Otherwise print the existing "The Collections — {position}". Capsule templates are untouched.
- **Focal point:** hero frames are landscape (about 1.6:1) and every K&A photograph is portrait, so only about the top 45 to 50% of a photograph shows on desktop (on mobile, nearly all of it). The fixed `object-position: center 30%` slices heads off the closeups below. Add optional metafield `custom.hero_focus` (for example `50% 8%`), applied as an inline `object-position`; default stays `center 30%`.
- Both metafields are single-line text on the Collection resource. A **hero is therefore a content task, not a code task** after this one small change. Where the shared default template is used, remove the stale "01" by also treating an empty `position` as "print no number" (and fix Signature the same way).

### Eyebrow values (recommended)
Each keeps the em-dash pattern and speaks to guests and family, not only the bride.
- Lehengas: `By Silhouette — Bridal & Reception`
- Drape Sarees: `By Silhouette — Reception & Sangeet`
- Indo-Western: `By Silhouette — Sangeet & Cocktail`
- Corsets: `By Silhouette — The Structured Edit`

On a 360px screen each of these wraps to two lines at the current tracking; that is acceptable, since the eyebrow block already allows it.

### Hero photographs (face and outfit together; Suraj's standing rule)
All are live products in the collection, all 2100 px or wider, so they exceed the 1800 px hero. The desktop crop shows roughly the top half of the frame, so each choice was made for **face + bodice + the garment's defining feature inside that top half**.

| Collection | Product (live) | Image | Focus (`hero_focus`) | Why, and the caveat |
|---|---|---|---|---|
| **Lehengas** | Maroon Marodi Raw Silk Lehenga With Blouse & Dupatta (`/products/maroon-marodi-raw-silk-lehenga-with-blouse-dupatta`), image 2 (seated, skirt spread) | https://cdn.shopify.com/s/files/1/0768/3112/9890/files/Maroonmarodirawsilkcloseup.jpg?v=1785043450 | `50% 6%` | Face, embellished blouse, emerald necklace and the spread of the hand-worked skirt all sit in one frame; soft curtain backdrop. The most "lehenga" frame in the range, and warm rather than loud. Alternate: Red Hand Embellished Corset With Raw Silk Lehenga, image 2, https://cdn.shopify.com/s/files/1/0768/3112/9890/files/redrawsilkcloseup.jpg?v=1784881591 |
| **Drape Sarees** | Primrose Corset and Drape (`/products/primrose-corset-and-drape`), image 2 (leaning on the wall) | https://cdn.shopify.com/s/files/1/0768/3112/9890/files/Untitleddesign_40_8c61708a-ad8d-46ad-9220-eb8c755dfd76.png?v=1751456332 | `50% 8%` | Face, lace corset, and the drape falling from the shoulder in one calm cream-and-blush frame. Desktop loses the lower drape; mobile shows the whole figure. Alternate: Lili Corset and Drape Saree (lilac), first image. |
| **Indo-Western** | Mustard Yellow jacquard cut-out corset with drape skirt and stole (`/products/mustard-yellow-jacquard-cut-out-corset-with-drape-skirt-and-stole`), image 2 | https://cdn.shopify.com/s/files/1/0768/3112/9890/files/Untitled_design_9_dba8be29-fa2f-4f0e-af5a-97e517f606e1.png?v=1773827329 | `50% 10%` | Face, sculpted corset and stole with tassel clutch, vivid and festive. **Weakest of the four**: the dark-wood room is busy. If Suraj has no studio frame, this is the one to replace first (see photography note). |
| **Corsets** | Electric Blue Victorian Corset With Drape Saree (`/products/electric-blue-victorian-corset-with-drape-saree`), image 1 | https://cdn.shopify.com/s/files/1/0768/3112/9890/files/Electric_Blue_Corset_Drape.png?v=1730722423 | `50% 8%` | Clean studio frame, hands on hips, the boning and peplum clearly visible, face included. The most legible image of "structured". Its emerald backdrop is strong; do not reuse that backdrop in the Drapes hero. |

**Photography note.** Three of the four sources are product-card photographs (2100 x 2850), not editorial plates. They will hold at hero size, but a proper landscape editorial image per silhouette would lift these pages a level. Recommend commissioning one landscape frame each at the next shoot (face and full garment, 16:10, headroom, a calm neutral backdrop). Until then, no image replaces a hero; these are the best available live frames.

### Section/component breakdown
`ka-collection-hero.liquid`: new lookup order, metafield eyebrow, optional focal point. Admin: two metafield definitions; four hero images set as `collection.image`; eyebrow and focus values. No new template.

### Design tokens
None. **Complexity:** simple. **Impact:** Medium (each page finally feels like its own chapter, which also makes each result more distinct in shared links).

---

## 4. Quick fit checks (copy-only theme items)

- **#7 Hero eyebrow, `Santacruz, Mumbai — Est. 2016`: confirm.** (code: `.ka-hero__eyebrow`, 0.63rem sans, 0.28em tracking, uppercase, 65% white.) It is 29 characters against today's 22; about 330px on desktop, one line. On a 360px phone it may wrap to two lines; the eyebrow has no nowrap, so that is graceful. Keep the em dash. The tone is right: a place and a year, no adjectives.
- **#8 Craft strip sublabels: adjust one.** The sublabels are uppercase 0.62rem with 0.18em tracking and the strip is a wrapping flex row (code), so length matters; the current longest is already 34 characters ("Personal styling, always available").
  - Worldwide Delivery: `Complimentary, via DHL Express` (30 characters, same length as today; confirm).
  - Made to Order: SEO's `20–45 working days, by silhouette` is 33 characters and unbalances the row. Use **`20–45 working days`** (18 characters, shorter than today's "Designed around you") and keep "by silhouette" for the collection facts strip and the FAQ.
  - Handcrafted "Every stitch by hand" is untouched here (held under #13).
- **#11 About founders opening: do not replace the opening sentence.** Today's body opens "K&A began the way most quiet houses do — between two people who saw the same picture before either said it aloud." It is the About page's best sentence, and SEO's replacement is a flat press-release line that would sit directly under a poetic hero subtitle ("A friendship that became an atelier ...") and shift the page's voice. Instead keep one sentence and add the facts to it: **"K&A by Karishma and Ashita was founded in 2016 by Karishma Surana and Ashita Surana, and began the way most quiet houses do — between two people who saw the same picture before either said it aloud."** The rest of the paragraph already says Santacruz, Mumbai and "every lehenga, every corset, every draped silhouette", which carries the product list. If Suraj wants it even more quotable, add to the caption line instead: `Founders, K&A · Santacruz, Mumbai · Since 2016`. **Flag for Suraj (D5):** the section title is "Best Friends, Bound by Craft." while SEO's sentence gives both founders the surname Surana. Please confirm the relationship wording is correct and both names are right before they are printed together.
- **#16 New FAQ question: place it last in "Sizing & Occasion" and keep the group structure.** (code/spec: four fixed groups.) That group already contains the consultation-booking question, and the new answer mentions private and video consultations, so it reads as a natural continuation, and no fifth group needs a numbered eyebrow, title and supporting line. The wording fits. The sentence "also stocked by Aza and Pernia's Pop-Up Shop" is a stockist claim like the About list in #13: **hold that sentence until Suraj confirms**, or ship the question without it.
- **#17 FAQ to collection links: fits the existing style with no new CSS.** `.ka-acc__inner a` is already rose-gold, underlined with a soft rule, upright. Rules: link only the category word, never the number ("[Drape sarees] 20–25 working days"); link the first mention only in a paragraph; the three Q5 links and three Q7 bullets are enough. Link text should read "lehengas", "drape sarees", "Indo-Western sets" (matching the collection titles in D1).
- **#27 First Love facts strip: fits.** The value text is the italic display face at `clamp(1.1rem, 1.8vw, 1.5rem)` in a two-column grid (code). `40–45 working days` (18 characters) and `₹1,70,000 – ₹4,80,000+` (22 characters) both fit one line on desktop; on a 375px phone the price wraps cleanly to two lines at the narrow half-column, which is acceptable. Use the en dash. (The values live in Admin metafields; they are not in the theme files.)

---

## 5. Heads-up: SEO's category tags on 7 Journal posts

**No design review needed, provided the tags are the existing four exact category strings.** `ka-article-related.liquid` picks "same category first, then newest", but only recognises `Craft & Atelier`, `Style Notes`, `Occasion Edit`, `The House` (exact, case-sensitive); the card label and filter chips use the same four (code). So:
- Adding those exact tags to the 7 posts simply moves them into the right "More From the Journal" pool, which is the intended behaviour.
- Any other tag (for example `lehengas`) is ignored by both the related strip and the card label, so it is harmless.
- Two checks for SEO: **one category tag per post** (the code takes the first match in a fixed order, so a post with two shows only one), and spell them exactly.
- Optional 2-minute look afterwards: open two or three of the seven posts and confirm the strip does not show the same three articles every time, which can happen if one category suddenly holds most posts. That is a content check, not a design change.

---

## Decisions for Suraj

- **D1. Collection titles.** The live hero H1s read "Lehengas", "Drapes", **"Indo Western"** (no hyphen) and "Corsets", while SEO copy uses "Drape Sarees" and "Indo-Western". Recommend renaming the Admin titles to **Lehengas, Drape Sarees, Indo-Western, Corsets** (handles unchanged). One word, clearer for search and AI, and consistent with the menu, chips and FAQ links.
- **D2. Numbering.** Collection eyebrows and the `/collections` cards both print numerals, and they already disagree. With Loomière, six pages would need renumbering. Recommend **dropping the numerals everywhere** (eyebrow reads "The Collections" or a short descriptor); the alternative is to give Loomière "07" and leave the rest inconsistent.
- **D3. Hero photographs.** Approve the four picks above, in particular the Indo-Western frame (busy backdrop), or commission replacements.
- **D4. Footer contents.** Confirm: six capsules (without Signature and Wedding Festive) plus the four silhouettes under "By Silhouette".
- **D5. Founders wording.** Confirm "Karishma Surana and Ashita Surana" alongside "Best Friends".
- **D6. Stockist mention.** Aza and Pernia's in the new FAQ answer waits with #13.
- **Pre-release:** Technical Director to list existing collection descriptions before the description block goes live.

## Build-complexity and priority summary

| Work | Complexity | Priority |
|---|---|---|
| Search chip labels and tile URLs; `collection.image` on the four silhouettes; metafield values | Content only, under 1 hour | Quick win |
| FAQ links, founders sentence, craft strip, eyebrow, First Love facts | Content only | Quick win |
| Hero lookup order, eyebrow and focus metafields | Simple | Medium |
| `/collections` second chapter (two settings) | Simple | High |
| Footer nested menu | Moderate | High |
| Cross-link ring order, silhouette mode | Moderate | High |
| Description block (section, CSS, toggle JS, 8 templates) | Moderate | High |
