# Google Reviews Sections (Homepage + Product Page) — Design Recommendation & Build Spec
**Document version:** 1.0
**Date:** 21 September 2026
**Prototype:** `Prototypes/google-reviews-sections-v1.html` (live count / quote-mix / viewport switcher; its CSS is the proposed production CSS)
**Status:** For Suraj's review. Nothing implemented. Visual treatment only; the Google sync itself is out of scope here.
**Data contract assumed (from the existing sections):** `shop.metafields.custom.google_reviews` = `{ rating_number, rating_count, rating_label, google_url, reviews:[{quote, reviewer_name ("First L."), occasion:"" , rating (4–5)}] }`, up to 6 reviews.

---

## 0. Recommendation in brief

1. **Homepage empty block.** The repo's `assets/ka-voice-of-bride.css` *already* contains the correct root-cause fix (hairlines drawn as card borders, empty cell transparent). The solid block in Suraj's screenshot is therefore most likely an **older copy of that file on the staging theme**, not a remaining design flaw. **First action for Technical Director: checksum `assets/ka-voice-of-bride.css` on Staging and Live against the repo** (standard staging-verification procedure) before building anything. Even with that fix in, a 5-card grid still leaves a lopsided, hollow lower-right cell, so I recommend making the grid **always fill its rows** (§1). With the sync supplying 6 cards, the normal case is a full 3 × 2 and none of the fallback rules will show.
2. **Target count: 6.** A 3 × 2 hairline grid is the approved composition. Fewer than 6 is a fallback, and each count 1–5 has an explicit layout below.
3. **Product page: no visible change.** Badge untouched. Card look untouched. 6 auto cards fix the current 7-card orphan (3 + 3 + 1). Incomplete rows centre at the same card width.
4. **Long and short quotes.** Truncate at a word boundary on the homepage only (40 words), leave the product page effectively untruncated (70-word safety cap), give both card types a minimum height, and pin the footer to the bottom (already the case). Details in §3.
5. **One small addition, worth approving:** with occasion removed, the homepage card footer's right slot is empty. Fill it with the reviewer's **real star rating** (the sync supplies 4–5). It is honest data, it mirrors the product page's star row, and it stops the footer looking unfinished.

---

## 1. Homepage — "The words of our brides" (`ka-voice-of-bride`)

### 1.1 Diagnosis (checked in code)
- Original: `grid-template-columns: repeat(3,1fr); gap:1px` over a `var(--line-on-dark)` background. Any unfilled cell shows that background as a solid lighter-brown rectangle. Matches the screenshot, on Live too with 5 cards.
- Repo today: `gap:0`, top/left borders on each `.ka-voice-card`, grid pulled `-1px` and clipped. An empty cell is now transparent. So the *painting* bug is fixed in the repo; what remains is layout balance (an empty third of row 2), covered next.

### 1.2 Layout by card count (desktop, viewport > 900px)
A 6-track grid; every card spans 2 tracks by default. Rows are always full, so the grid never has an empty cell and never relies on the background. The hairline aesthetic is kept: hairlines are still card borders and there is still no outer frame.

| Cards | Layout | Note |
|---|---|---|
| **6** | 3 × 2, thirds | Target. |
| **5** | Row 1: three thirds. Row 2: two halves | Row-2 divider sits at 50% rather than 33/66%: reads as an editorial offset, not a gap. |
| **4** | 2 × 2, halves | |
| **3** | 1 × 3, thirds | |
| **2** | 1 × 2, halves | |
| **1** | Single featured quote, centred, unframed, `max-width:720px`, larger quote (`clamp(1.25rem,2vw,1.7rem)`), footer centred | A lone bordered card looks lost; an unframed pull-quote looks deliberate. |

Why stretch (not centre) on the homepage: adjacent cells share hairlines, so a centred, narrower last row would leave dangling dividers and break the grid logic. (The product page is different, see §2.)

**Mobile (≤ 900px), any count:** 1 column, unchanged: cards stack, each with its top hairline; padding 28px 24px 32px at ≤ 600px (existing values). No spans apply. Rating block stacks under the title, left-aligned (existing).

### 1.3 CSS (production; replaces the grid/card rules in `assets/ka-voice-of-bride.css`)
Structure change: **mobile-first for the grid only**. Base = 1 column; every span rule is inside `@media (min-width: 901px)` so it can never leak into mobile (the quantity-query selectors are more specific than a `max-width` reset would beat). Keep the existing `.ka-voices`, header, title, rating, quote-mark, quote, name, CTA rules as they are.

```css
.ka-voices__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin: -1px 0 0 -1px;
  clip-path: inset(1px -100vw -200px 1px);      /* unchanged */
}
.ka-voice-card { /* existing rules, plus: */ }
.ka-voice-card__quote { overflow-wrap: anywhere; }   /* long URLs / unbroken strings */
.ka-voice-card__meta  { gap: 12px; }                 /* name + stars never touch */
.ka-voice-card__stars {                               /* NEW: replaces .ka-voice-card__occasion */
  font-family: var(--f-sans); font-size: 0.62rem; letter-spacing: 0.22em;
  color: var(--c-rosegold); white-space: nowrap;
}

@media (min-width: 901px) {
  .ka-voices__grid { grid-template-columns: repeat(6, 1fr); }
  .ka-voice-card   { grid-column: span 2; min-height: 280px; }

  /* 5 cards: last two take half the row */
  .ka-voice-card:nth-child(4):nth-last-child(2),
  .ka-voice-card:nth-child(5):last-child { grid-column: span 3; }

  /* 4 or 2 cards: two columns */
  .ka-voice-card:first-child:nth-last-child(4),
  .ka-voice-card:first-child:nth-last-child(4) ~ .ka-voice-card,
  .ka-voice-card:first-child:nth-last-child(2),
  .ka-voice-card:first-child:nth-last-child(2) ~ .ka-voice-card { grid-column: span 3; }

  /* 1 card: featured pull-quote */
  .ka-voice-card:only-child {
    grid-column: 1 / -1; max-width: 720px; margin: 0 auto;
    border: 0; align-items: center; text-align: center; min-height: 0;
  }
  .ka-voice-card:only-child .ka-voice-card__quote { font-size: clamp(1.25rem, 2vw, 1.7rem); }
  .ka-voice-card:only-child .ka-voice-card__meta  { width: 100%; justify-content: center; gap: 24px; }
}
```
- **Selectors are CSS quantity queries on the rendered cards, not Liquid counts.** The Liquid loop skips blank quotes, so `forloop.length`/`limit` can over-count; the DOM is the truth. No Liquid change is needed for layout.
- Existing `@media (max-width: 900px)` rule for `.ka-voices__grid` becomes redundant (base is already 1 column); keep the header/rating-block rules in it.
- The one-card rule removes the border on the card; the section's own top hairline (`.ka-voices::before`) still frames the section.

### 1.4 Markup change (`sections/ka-voice-of-bride.liquid`)
- **Synced path:** replace `<span class="ka-voice-card__occasion">{{ review.occasion | escape }}</span>` with a star row when a rating exists:
  ```liquid
  {%- assign r = review.rating | default: 0 -%}
  {%- if r > 0 -%}<span class="ka-voice-card__stars" aria-label="{{ r }} out of 5">{% for i in (1..5) %}{% if i <= r %}&#9733;{% else %}&#9734;{% endif %}{% endfor %}</span>{%- endif -%}
  ```
- **Editor-block fallback path:** leave the `occasion` span as is (that path is manual curation and still has the field). Keep the `.ka-voice-card__occasion` CSS for it.
- If `r` is 0/missing the footer shows the name only, left-aligned (current behaviour), which is acceptable.
- Truncate quotes: `{{ review.quote | truncatewords: 40, '…' | escape }}` (truncate first so the word count is on raw text, escape last so nothing untrusted is emitted unescaped; the "…" character is not touched by `escape`). Synced path only; never truncate hand-entered editor blocks.
- `delay_classes` unchanged (5th/6th reuse `reveal-delay-4`).

---

## 2. Product page

### 2.1 Rating badge (`ka-grating` in `ka-product-main`) — **no change**
Markup, star glyphs, copy ("4.7 · 67 reviews on Google") stay exactly as they are; only the numbers are live. Notes for the sync/data side only:
- `rating_number` must be a **one-decimal string** ("4.7"; "5.0", never "5"), or the badge and the summary score will drift in format from what Suraj approved.
- The five stars stay a fixed decorative run (as on Google itself and on the current design). Do not "fill proportionally" — it would be a visible change and adds nothing.
- Edge: if `rating_count` is 1 the copy reads "1 reviews". Cosmetic and unlikely; if trivial, pluralise (`{% if badge_count == '1' %}review{% else %}reviews{% endif %}`), otherwise ignore.

### 2.2 Review section (`ka-product-reviews`) — look unchanged, grid gains a centring rule
- Card visual (border, padding, star row, avatar initial, name, "via Google") unchanged. Score, "Based on N reviews", heading and "Read all N reviews on Google →" unchanged; all already read the live values in the synced path.
- Up to 6 auto cards → a clean 3 × 2. The old 7 hand-entered blocks made a 3 + 3 + 1 orphan; that goes away for free. (For the manual-fallback path, which still allows 7 blocks, a rule below centres a lone 7th card so that path also looks intentional.)
- **Incomplete rows are centred at the same card width**, unlike the homepage. These are separate boxed cards with a 26px gap (no shared hairlines), so centred cards read as a composed group, whereas left-stranded cards read as missing ones.

| Cards | Layout |
|---|---|
| **6** | 3 × 2 |
| **5** | 3, then 2 centred |
| **4** | 2 × 2, centred (same card width as elsewhere) |
| **3** | 3 across |
| **2** | 2 centred |
| **1** | 1 centred |
| **7** (manual fallback only) | 3 + 3 + 1 centred |

Mobile (≤ 900px): unchanged, 1 column, `max-width:460px`, gap 16px, no spans.

### 2.3 CSS (production; additions/changes in `assets/ka-product-reviews.css`)
Same technique: base = 1 column (as now), all spans inside `min-width: 901px`.
```css
.ka-rev p { overflow-wrap: anywhere; }             /* add to existing rule */

@media (min-width: 901px) {
  .ka-rev-grid { grid-template-columns: repeat(6, 1fr); }   /* was repeat(3,1fr); gap 26px unchanged */
  .ka-rev      { grid-column: span 2; min-height: 220px; }

  /* Incomplete rows: centred, same card width */
  .ka-rev:nth-child(4):nth-last-child(2),   /* 5 cards: card 4 */
  .ka-rev:first-child:nth-last-child(4),    /* 4 cards: card 1 */
  .ka-rev:nth-child(3):nth-last-child(2),   /* 4 cards: card 3 */
  .ka-rev:first-child:nth-last-child(2)     /* 2 cards: card 1 */
    { grid-column: 2 / span 2; }
  .ka-rev:nth-child(5):last-child,          /* 5 cards: card 5 */
  .ka-rev:nth-child(2):nth-last-child(3),   /* 4 cards: card 2 */
  .ka-rev:nth-child(4):last-child,          /* 4 cards: card 4 */
  .ka-rev:nth-child(2):last-child           /* 2 cards: card 2 */
    { grid-column: 4 / span 2; }
  .ka-rev:only-child,
  .ka-rev:nth-child(7):last-child           /* 1 card, or the 7th manual block */
    { grid-column: 3 / span 2; }
}
```
The existing `@media (max-width: 900px)` block (1 column, 460px) already handles mobile; no change. Because the spans live only in the `min-width` block, mobile is untouched.

No Liquid change is required for the product section (star row, "via Google", avatar, escaping all already exist in the synced path). Optional: lower the manual-fallback block `"limit"` from 7 to 6 to match the sync; not needed for layout.

---

## 3. Long and short quotes

Real reviews range from ~5 to ~60+ words. Goal: cards of different length in one row still look intentional, without ever paraphrasing.

| Decision | Homepage | Product page |
|---|---|---|
| Truncation | `truncatewords: 40, '…'` (≈ 8 lines at the 3-up column width ≈ 294px text measure at 20px). Untruncated, a 60-word review is 11–12 lines and stretches its whole row, leaving neighbours mostly empty. | `truncatewords: 70, '…'` safety cap only; 60 words is ≈ 8 lines at the ≈ 336px measure and fits fine. |
| Truncation location | Liquid, at a word boundary, with an ellipsis. Not CSS `line-clamp` (breaks mid-line, inconsistent across browsers). | Liquid. |
| Minimum height | `min-height: 280px` per card (desktop only) so a five-word review is a full, considered card and short rows keep rhythm. | `min-height: 220px`. |
| Footer alignment | Already correct: quote is `flex:1`, so name/stars sit on the same baseline at the bottom of every card in a row. Do not remove `flex:1`. | Same (`p{flex:1}`). |
| Very short quotes | Keep them. Do not enlarge or pad. A short review beside a long one is normal for real reviews and honest. | Same. |
| Unbroken strings | `overflow-wrap: anywhere` on the quote | Same |

Truncated reviews are a curated homepage excerpt with the CTA "Read all reviews on Google" directly below, so the reader can always reach the full text. Never truncate on the product page unless it exceeds the cap.

**Recommendation for the sync (not built by me):** since the same 6 reviews feed both sections, prefer reviews of roughly 8 to 55 words when choosing among equally rated candidates, so the homepage rarely needs to truncate and no card is a one-liner beside a wall of text. This is a preference, not a rule; anything in the 4–5 star, has-text pool remains valid.

---

## 4. Tokens
None new. Everything uses existing `ka-base.css` values (`--c-charcoal`, `--line-on-dark`, `--c-rosegold`, `--f-display`, `--f-sans`, `--s-*`, `--gutter`). No new colours, fonts or motion.

## 5. Feasibility notes for Technical Director
- **Quantity-query selectors** (`:first-child:nth-last-child(N)`) are supported everywhere current; no JS, no `:has()`. Prototype uses `@container` only so the mobile frame can be demonstrated on one page; production uses `@media (min-width: 901px)`.
- **Verify deployment state first** (§0.1): compare `assets/ka-voice-of-bride.css` checksum on Staging and Live with the repo. If Staging is stale this alone removes the solid block.
- The clip-path on the homepage grid is unchanged; the `.reveal` slide-up is not cut off (right/bottom stay open). Re-check the one-card case for the reveal transform.
- QA matrix: for each of 6/5/4/3/2/1 cards × desktop/mobile on both sections: no empty cell paints, hairlines continuous, footers bottom-aligned, star rows correct (4 vs 5 stars), a 60-word and a 5-word review in the same row, and an escaped `<`/`&` in a quote.

## 6. Build complexity
**Simple.** CSS-only for the layout on both sections; the only Liquid edits are the homepage star-row slot and `truncatewords`. No new files, no JS, no schema change.

## 7. Open items for Suraj
1. Approve replacing the homepage "occasion" slot with the star row (or prefer showing nothing / "via Google").
2. Confirm the 40-word homepage cut is acceptable, or say if you would rather show longer reviews and accept taller cards.

---

## 8. Addendum v1.1 (21 Sept 2026) — design review of the staged build (git `staging` @ `ff1f111`)

**Verdict: the synced-path build matches this spec; the product page matches; the fallback path (what Suraj sees on staging today) is not finished and is the cause of "something is off".** Change requests below are CSS/Liquid-level. Nothing else needs to change.

### 8.1 What matches the spec (confirmed by reading the staged files)
- `ka-voice-of-bride.css`: card-border hairlines, mobile-first 1 column, all spans inside `@media (min-width:901px)`, 6-track grid, 5/4/2/1 quantity rules, `min-height:280px`, `overflow-wrap`, meta `gap:12px`, only-child pull-quote. Identical to §1.3.
- `ka-voice-of-bride.liquid` synced path: `truncatewords: 40, '…' | escape`, star row with clamped rating, `role="img"` label. Matches §1.4.
- `ka-product-reviews.css` / `.liquid`: 6-track grid, centring rules, `min-height:220px`, 70-word cap, star row, badge (`ka-grating`) untouched, `disclaimer` blank in `templates/product.json` (no "sample reviews" note leaks). Matches §2.

### 8.2 Change requests
**CR-1 (fixes the staging look): make the editor-block fallback footer uniform and show stars there too.** Today the 6 editor cards mix footers: 3 cards show an occasion ("Wedding Reception", "Custom Lehenga", "Graduation, Corset Saree") and 3 show the name alone. A grid whose footers differ card to card reads as unfinished, and Suraj has dropped occasion. Change the fallback path to match the synced look:
- `sections/ka-voice-of-bride.liquid`, block schema: add `{ "type":"range","id":"rating","label":"Star rating","min":1,"max":5,"step":1,"default":5,"info":"The reviewer's actual Google rating (1-5). Verify against the real Google review; do not guess." }`. Set each existing block from the real rating (the same reviewers already carry verified ratings in `templates/product.json`; reuse those). Keep the `occasion` setting in the schema for saved-data safety but change its label/info to "No longer displayed".
- Fallback markup: remove the `.ka-voice-card__occasion` span and render the exact same star-row markup as the synced path, using `block.settings.rating`.
- Result: staging shows the same finished card as the future synced version, and Suraj can see the stars now. Do not truncate hand-entered quotes (unchanged).

**CR-2 (star row look, now that it is real CSS).** Two problems: the star is 0.62rem (~10px) in `--c-rosegold` on charcoal (about 3.9:1, faint), and `★`/`☆` are not in Jost, so each OS substitutes a different symbol font and the hollow `☆` is hairline-thin at 10px (a 4-star card can read as "4 stars and a smudge"). Replace with one glyph (★) always, unfilled ones dimmed:
```css
.ka-voice-card__stars {
  display: inline-flex; gap: 0.22em;
  font-family: var(--f-sans); font-size: 0.72rem; line-height: 1;
  color: var(--c-rosegold-pale);          /* was --c-rosegold */
  white-space: nowrap;
}
.ka-voice-card__stars > span.is-off { opacity: 0.28; }
```
Markup (both paths): `{% for i in (1..5) %}<span{% unless i <= r %} class="is-off"{% endunless %}>&#9733;</span>{% endfor %}` inside the existing `role="img"` wrapper. Drop `letter-spacing` (the `gap` replaces it, so no trailing space is added after the last star and it aligns flush right). Position stays: right side of the footer, opposite the name. Check on Windows, macOS and iOS in the preview theme. The product page keeps its existing `★`/`☆` row (approved look; leave).

**CR-3 (content, probably part of "something is off"): emoji in quotes.** Arushi G.'s quote contains 💜 and ✨; they render as full-colour emoji inside italic serif on a restrained charcoal card, the only saturated colour on the page. There is no reliable CSS fix. (a) Edit the fallback/product blocks to remove the emoji; (b) ask the sync to strip pictographic emoji code points (and trim trailing whitespace) from quotes and reviewer names before writing the metafield. Removing emoji is a typographic normalization, not a paraphrase.

**CR-4 (hygiene):** `assets/ka-voice-of-bride.css` on staging starts with a UTF-8 BOM (`ef bb bf`); the other two files do not. Harmless in browsers, but strip it so the file is clean.

### 8.3 Product page (d)
No design change required. Only carry-over: CR-3 (emoji) applies here too, and the product blocks' `☆` row stays as is.

### 8.4 What I still want to see in the scratch preview theme (synced data)
Six cards with mixed lengths (one ~60 words, one 5 words) and a mix of 4/5-star ratings on desktop and 390px mobile; the 5-card and 4-card fallbacks; the star row at 0.72rem on Windows, macOS and iOS; and the reveal animation on the 5th/6th cards. I will confirm or adjust once I have looked at it in a browser.
