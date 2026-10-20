# Capsule heroes and final calls (2026-10-20)

Creative Director decisions, delegated by Suraj. Contact sheet: `Docs/review-assets/capsule-heroes.png` (rows top to bottom: First Love, Festive Edit [new image], Bloom Soirée, Chamakk, Barre Oblique, Wedding Festive, Signature; columns left to right: 1470x771, 1440x900, 1920x1080, 390x844; every crop uses the FINAL focus values below). Replacement image file for Festive Edit: `Docs/review-assets/festive-edit-hero.jpg`.

## 0. Hero geometry (from the real CSS)
- Frame = `min(viewport,1680) - 2 x gutter` wide (gutter `clamp(20px,5vw,80px)`; 16px at 600px and below). Height = 78vh clamped 520 to 820px (64vh min 460 at 900px and below; 58vh min 420 at 600px and below). Image is `object-fit: cover`, default `object-position: center 30%`.
- 1470x771: 1323x601. 1440x900: 1296x702. 1920x1080: 1520x820. 390x844: 358x490.
- The nav is fixed; the breadcrumb section above has ~110px top padding, so the frame top sits about 165px down the page. At first paint the header does not cover the frame; only after scroll does it overlap the top ~105px. So the face needs headroom of roughly 10 percent of frame height, no more.
- IMPORTANT code gap: `custom.hero_focus` works ONLY for the metafield-image branch and the `else` branch (collection.image / setting). The seven capsule `when` branches ignore it. A change is needed (section 1.3).

## 1. Capsule heroes

### 1.1 Verdicts (face AND outfit together, all four viewports)
| Capsule | At default (center 30%) | Verdict | Final |
|---|---|---|---|
| first-love (first-love-hero.jpg, landscape 1800x1350) | Face, red off-shoulder blouse and lehenga train all in frame at every viewport | PASS | no focus needed (default) |
| the-festive-edit (celebrity-editorial.jpg) | n/a | REJECT, see 1.2 | new image, focus `50% 10%` |
| the-bloom-soiree (portrait 1200x1800) | Crown and eyes cut off at top on desktop widths | FAIL | `50% 10%` (face with the pistachio bodice and drape in frame; mobile keeps the full figure) |
| chamak (portrait 1350x1800) | Face missing entirely (choker and bodice only) | FAIL | `50% 10%` (face, choker, blush corset under the chandelier) |
| barre-oblique (portrait 1200x1800) | Face and hand good, teal outfit nearly absent | MARGINAL | `50% 40%` (face, choker and the teal corset both present; mobile unchanged and good) |
| wedding-festive (portrait 1440x1800) | Forehead cut off | FAIL | `50% 10%` (face, red blouse and net cape in frame) |
| bestsellers (Signature, portrait 1350x1800) | Face, pearl corset and skirt top all in frame | PASS | no focus needed (default) |

### 1.2 Festive Edit: celebrity-editorial.jpg is REJECTED as a hero
- That file is the Celebrity & Influencer on-hold work (pending-tasks #1). It is a tightly framed studio portrait of a named-person-type editorial (red beaded corset, chandelier). Consent is unverified; it must not be the face of a public collection page.
- Wider finding: the same file is also used as the Festive Edit tile in `ka-collections-directory.liquid` (homepage), `ka-collections-list.liquid` (/collections), `ka-collection-cross-link.liquid`, `ka-collection-grid.liquid` and the hero. Those already ship on Live today. Replace all five Festive Edit uses with the new file (do NOT touch `ka-celebrity.liquid`, that is the on-hold section).
- Replacement (from Festive Edit's own product "Deep Purple cutout corset with pre stitched drape"): source `https://cdn.shopify.com/s/files/1/0768/3112/9890/files/Untitleddesign_34_717370dd-8872-46c8-9e29-dbad02d1f5da.png?v=1773898729` (2100x2850). I have exported a 1800x2443 JPEG: `Docs/review-assets/festive-edit-hero.jpg` (847 KB). Why this one: face, kundan choker and the plum cutout corset together; carved screen and terracotta wall read as festive and warm; the full figure shows on mobile; it sits in the capsule's own tonal story. Runners-up if Suraj dislikes it: Mustard (Untitleddesign_5.png, figure too small at desktop), Mauve halter (Untitled_design_32, good face but flat set).
- Note: this is a product-page image already live on that product. If the model is a named individual, TD/Suraj should confirm her consent for hero use the same way as for any lookbook image; I cannot verify.

### 1.3 TD instructions
1. Copy `Docs/review-assets/festive-edit-hero.jpg` to `assets/festive-edit-hero.jpg`.
2. In `sections/ka-collection-hero.liquid`, change the `the-festive-edit` branch to `'festive-edit-hero.jpg'` (remove the "Interim stand-in" comment).
3. Make capsule branches honour focus, with per-handle defaults so Live never depends on metafields. In the liquid block at the top add, after `hero_focus_style` is built:
```
{%- if hero_focus_style == blank -%}
  {%- case collection.handle | downcase -%}
    {%- when 'the-bloom-soiree', 'chamak', 'wedding-festive', 'the-festive-edit' -%}
      {%- assign hero_focus_style = 'object-position: 50% 10%;' -%}
    {%- when 'barre-oblique' -%}
      {%- assign hero_focus_style = 'object-position: 50% 40%;' -%}
  {%- endcase -%}
{%- endif -%}
```
   and add `{% if hero_focus_style != blank %}style="{{ hero_focus_style }}"{% endif %}` to each of the seven capsule `<img>` tags. A metafield `custom.hero_focus`, if set, still wins (it is assigned first). first-love and bestsellers keep the CSS default.
4. Replace `'celebrity-editorial.jpg'` with `'festive-edit-hero.jpg'` in the Festive Edit branches of `ka-collections-directory.liquid`, `ka-collections-list.liquid`, `ka-collection-cross-link.liquid`, `ka-collection-grid.liquid`. Tile crops (2:3 and 4:3) were checked against this portrait; for the 4:3 cross-link and grid tiles add `object-position: 50% 12%` so the face is not cut.
5. No metafield `custom.hero_image` is needed for any capsule (Suraj's call: each capsule uses its own photo).
6. After deploy, QA re-renders the seven pages at the four viewports against the contact sheet.

## 2. Collection descriptions ("About this Collection") - REVISED with the real Admin text
Method: light edit of each real description. Kept every true, specific craft fact; cut generic superlatives ("captivating", "stunning", "go-to", "truly unique", "perfect choice"), the marketing hooks, and festival or story lines that the intro above the grid already says. Fixed spacing and punctuation typos. SEO note: the meta descriptions of the five launched capsules are separate custom text on Live, so editing the body costs nothing there. Apply in Admin > Collections at release (checklist A2). Use plain `<p>`.

**Barre Oblique** (92 words down to 56)
> Barre Oblique is inspired by the technique of Slash & Spread. Each drape saree is cut by this method, which does away with traditional darts, and is paired with a corset worked in quilting, ruching, pleating and similar detail. Traditional and contemporary dressing meet here, in fluid drape set against structured silhouette.

**Chamakk** (72 words down to 50)
> Chamakk is inspired by the sparkle of radiant light. Each piece is designed to reflect beauty, elegance and confidence, with intricate detailing, shimmering embellishment and vibrant hues, in luxurious fabrics and elegant silhouettes, for the woman who wants her own light to show.

**The Bloom Soirée** (108 words down to 55)
> The Bloom Soirée plays with contrast, between classic silhouettes and contemporary prints. Structured corset drapes, sleek bustiers and flowing draped skirts come in bright summer colours, with floral motifs and Chantilly lace. Wear it to a celebration, or to turn an everyday moment into something special.

**The Festive Edit** (106 words down to 60; also fixes the missing spaces after "spirit." and "movement.")
> The Festive Edit pairs sculpted corsets with draped skirts and coordinated stoles, in rich hues. Crafted in modal satin with jacquard butti, each corset is finished with quilted texture and refined crystal edging, a subtle touch of sparkle, balanced by soft, flowing drape. Made for festive celebrations and standout moments.

**First Love** (110 words down to 52)
> First Love is a collection for a bride's most cherished moments: traditional Indian craftsmanship in contemporary silhouettes, for the woman who honours heritage and her own individuality. Each piece moves easily between classic and modern, designed to be timeless and of its moment.

**LOOMIÈRE** (not launched): KEEP, fix only the missing space after "Shimmer." (it also prints in the meta description, which falls back to this text)
> Rich Textures. Fluid Drapes. Playful Shimmer. A contemporary celebration of pure handwoven brocades, sculpted corsets, fluid draped skirts and solid-colour silhouettes finished with statement tassels.

**Signature, Top Sellers** (`signature-top-sellers`): REPLACE. The current line ("genuine best-selling pieces, ranked by real order volume") is ranking language and marketplace tone, against house rules.
> The silhouettes our clients return to first, made to order in Mumbai.

Note: First Love's "honours" uses the British spelling to match the house voice (the original said "honors"). Chantilly lace is stated as lace; the original said only "Chantilly".

## 3. Eyebrow contrast (hero eyebrow, small rose gold)
Cause: `.eyebrow--on-dark` is rose gold #9A7B4F (about 2.5:1 on the red or pale-pink areas under a thin overlay). Fix: make the hero eyebrow warm ivory and deepen the overlay only where the text sits. Scope to the hero so other uses of rose gold are untouched. The ivory, with the existing italic white title, keeps the hero a single quiet ivory-on-image system.
```
.ka-coll-hero__eyebrow {
  color: #F4ECDE;               /* warm ivory, replaces rose gold in the hero only */
  opacity: .94;
  font-weight: 500;
  text-shadow: 0 1px 14px rgba(15,12,10,.45);
}
.ka-coll-hero__overlay {
  background: linear-gradient(to top,
    rgba(15,12,10,.72) 0%,
    rgba(15,12,10,.42) 30%,
    rgba(15,12,10,.12) 55%,
    rgba(15,12,10,.18) 100%);
}
```
Verify: ivory eyebrow at or above 4.5:1 on Lehengas (red), Drape Sarees (pale pink) and mobile Indo-Western; if a pale image still fails at mobile, raise the 30% stop to .48 on `max-width: 600px`. No change to the title or piece count.

## 4. /collections second-chapter label
Replace "The Garments" with **The Wardrobe** (chapter one's eyebrow is "Maison"; "The Garments" is generic and reads like a category tag, "The Wardrobe" is warm and personal and speaks to the mother, sister and bridesmaid as much as the bride). Set in `templates/list-collections.json` line 90 (`"eyebrow"`). The "By Silhouette" heading stays.

## 5. First Love facts: APPLY NOW
Yes, now. The Live page reads these metafields today and shows a wrong lead time (8-10 weeks contradicts the 40–45 working days policy). Both are correct facts, no design dependency.
- First Love (gid 666638811426), `custom.lead_time` = `40–45 working days`
- `custom.price_range_display` = `₹1,70,000 – ₹4,80,000+` (en dashes)
Also, TD should read `custom.lead_time` and `custom.price_range_display` on every other capsule and silhouette collection and report any that disagree with 40–45 working days or the published product min and max; I could not see them. Fix only after reporting to Suraj.
Update checklist row A3 to "applied now".

## 6. D1 title renames: CONFIRMED, at release
`Drapes` to `Drape Sarees`; `Indo Western` to `Indo-Western`. Handles unchanged (so URLs, menus and links do not break). Apply at release with the main push, as already planned (renaming earlier would change Live H1s before the new designs exist). TD should confirm nothing keys on the old titles (search chips and footer menu labels ship their own text).

## Summary of changes needed in code (all at TD)
1. `ka-collection-hero.liquid`: focus honoured on capsule branches, per-handle defaults, Festive Edit asset swap.
2. Four other section files: Festive Edit tile asset swap.
3. `ka-collection-hero.css`: eyebrow colour and overlay.
4. `list-collections.json`: eyebrow text.
5. Admin: First Love metafields now; descriptions and title renames at release.
6. New asset: `assets/festive-edit-hero.jpg` (from `Docs/review-assets/festive-edit-hero.jpg`).

Build complexity: simple.


---

# Round 2 (QA follow-ups, 2026-10-20)

## R2.1 Eyebrow contrast: robust fix (supersedes section 3's overlay snippet)

Diagnosis: the 3.0 to 4.4 ratios come from a photograph that is still bright where the eyebrow sits (it is the highest line of the text block, so it is the furthest up the gradient, where the overlay is lightest). The text-shadow is a 14px blur at 45% so it adds almost nothing; remove it. A per-photo toggle is not needed. The fix is a soft, feathered dark pool behind the eyebrow and title block, plus a slightly stronger base gradient. It moves with the text (desktop row or mobile column), so it works on any photo.

Arithmetic (so it is not a guess): ivory #F4ECDE needs a backdrop relative luminance of 0.15 or less for 4.5:1. The worst measured pixel (2.4 to 2.6) has luminance about 0.30 to 0.33. A 50% warm-black layer takes that to about 0.07, which is roughly 7:1. Even the mean-ratio failures gain 2x headroom. The pool is feathered with blur so there is no visible box.

Exact CSS, in `assets/ka-collection-hero.css`:

1. Replace the `.ka-coll-hero__overlay` rule with:
```css
.ka-coll-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top,
    rgba(15,12,10,.78) 0%,
    rgba(15,12,10,.52) 34%,
    rgba(15,12,10,.16) 60%,
    rgba(15,12,10,.18) 100%);
}
```
2. Replace the `.ka-coll-hero .ka-coll-hero__eyebrow` rule with (text-shadow removed, colour kept):
```css
.ka-coll-hero .ka-coll-hero__eyebrow {
  margin-bottom: 18px;
  color: #F4ECDE;
  opacity: 1;
  font-weight: 500;
}
```
(opacity .94 to 1 also adds about 0.1 of ratio on the worst pixels.)
3. Add after the `__content` rule:
```css
/* Soft dark pool behind eyebrow + title. Photo-independent contrast. */
.ka-coll-hero__content > div:first-child {
  position: relative;
  isolation: isolate;
}
.ka-coll-hero__content > div:first-child::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -64px;
  right: -72px;
  bottom: -32px;
  left: calc(-1 * clamp(24px, 4vw, 64px));
  background: rgba(15,12,10,.5);
  filter: blur(28px);
  pointer-events: none;
}
```
The left bleed runs to the frame edge so no hard left edge appears (the frame has overflow hidden). The top inset (-64px) is deliberately larger than the 28px blur radius so the eyebrow sits in the full-strength centre of the pool, not the faded rim.
4. In the `max-width: 600px` block add:
```css
  .ka-coll-hero__content > div:first-child::before { right: -24px; top: -56px; }
```
Do not set will-change or animate the pseudo; the `.reveal` classes stay on the eyebrow and h1 only, so the pool is static and the reveal still reads as text arriving.

Look check: on a dark photo the pool is invisible (it adds depth only). On pale pink and red it reads as the photo falling into shadow at the lower left, the way a couture lookbook vignettes. If Suraj finds it heavy on Drape Sarees, drop .5 to .42 (still about 5.5:1 on the measured worst pixel). Do not go below .42.

Verification (QA re-run): same matrix. Pass bar is worst-5% ratio of at least 4.5 at 1470, 1440, 1920 and 390 on all 11 collections, especially Bloom Soirée, Drape Sarees, Signature, Gowns (maroon) mobile and Lehengas mobile. Expected 6 to 8 on all. If any single case still fails, report it to me with the screenshot rather than adding per-page CSS.

## R2.2 Festive Edit tile: decision and mechanism

Decision: YES. Festive Edit's tile on the homepage directory, /collections and the cross-links shows the new face-and-outfit image (`festive-edit-hero.jpg`). A faceless back view cannot be the capsule's only image, and the capsule hero already uses the new image, so the tile and the page must match.

Mechanism (theme-only on staging; no Admin collection-image change, so Live is untouched until release):

a) Homepage directory: in `templates/index.json`, delete the single line `"image": "shopify://shop_images/Wearing_-_karishmaashita_..._d_3.jpg",` from the `the-festive-edit` block settings. `ka-collections-directory.liquid` then falls to its `'the festive edit'` case, which (after the item-4 swap above) points to `festive-edit-hero.jpg`. Other blocks are untouched. Confirm the block still has `name` and `card_url`; it does.

b) /collections and cross-link: do NOT reorder the global lookup. Add one handle-specific branch between the metafield branch and the `collection.image` branch, in both `sections/ka-collections-list.liquid` (after the `coll_mf_image` branch, before `elsif coll.image != blank`) and `sections/ka-collection-cross-link.liquid` (after the `cl_mf_image` branch, before `elsif cl_collection.image != blank`). Use the same `<img>` markup and sizes the existing per-handle Festive Edit case already uses in that file, just with this condition:
```liquid
{%- elsif coll.handle == 'the-festive-edit' -%}   {# cross-link file: cl_collection.handle #}
  ...existing Festive Edit <img> using 'festive-edit-hero.jpg' | asset_url (cross-link: keep object-position 50% 12%)
```
Because the condition is scoped to one handle, exactly one tile changes on each surface. A general "asset beats collection.image for capsules" reorder is rejected: it would also swap First Love, Bloom Soirée, Chamakk and Barre Oblique from their reviewed Admin images to the per-handle placeholder assets, which nobody has signed off.

Tiles that change (complete list):
- Homepage directory: Festive Edit, back view to face and outfit. Improvement, approved.
- /collections capsule grid: Festive Edit, same. Improvement, approved.
- Cross-link on every other capsule page (First Love, Bloom Soirée, Chamakk, Barre Oblique pages, where Festive Edit appears in the ring): Festive Edit card, same. Approved.
- No other tile changes: First Love, Bloom Soirée, Chamakk, Barre Oblique, Wedding Festive, Signature, silhouettes keep what they show today.
Check: if the Festive Edit collection has `custom.hero_image` set, it beats the new branch; TD to confirm it is empty (expected, that metafield is for silhouette pages) and tell me if not.

c) Admin collection image: leave it alone until release. At release (or later) Suraj may replace the Festive Edit collection image with the new file so Admin matches the theme; that is optional once the branch exists, and the back-view photo remains available for the Journal or social.

d) Grid editorial insert: keep the generic `midnight_blue_re.jpg` insert from `templates/collection.json`; do not make the Festive Edit insert special. Reason: the insert appears after the Nth product on the same page whose hero already shows the capsule image, so repeating the capsule portrait would be redundant, and the generic insert gives the grid a different, brand-level beat. Consequence for the TD: the per-handle Festive Edit case in `ka-collection-grid.liquid` is dead code (the template always sets insert_image). Do NOT bother swapping it; remove 'celebrity-editorial.jpg' from that case only if tidying, no effect. Drop `ka-collection-grid.liquid` from item 4's file list (correcting my earlier "five uses": it is four, plus the hero).

Correction note: my earlier statement that Live's Festive Edit tile used celebrity-editorial.jpg was wrong; the back-view photo is the Live image in the places QA named. The above supersedes section 1.2's "wider finding".

Build complexity: simple. Risk to Live before release: none (all theme changes on staging).


## R2.3 Hero scrim tuned: lighter, text-anchored (supersedes R2.1 items 1 and 3 and the 600px pseudo rule)

Why R2.1 read heavy: the .5 pool was a blurred rectangle on top of a .78/.52 frame gradient, so a wash covered the lower half and had a visible soft box. I tried (rendered and looked at each, headless Chrome, real CSS, real hero images, all 12 x 4 viewports) a smaller eyebrow-only pool, a text-block pool with blur, radial pools and eased radial pools. All either missed 5:1 on Bloom Soiree / Drapes mobile or read as a dark lozenge or hump on pale photos. A pool cannot be both small enough to be invisible and strong enough on a 0.30-luminance beige. What worked: move the darkening out of the frame and into a scrim that is anchored to the text block (so the eyebrow always sits at the same depth in it, even when a long title such as The Wedding Festive Collection wraps the meta row and lifts the eyebrow, which the frame-percentage gradient missed), with an eased ramp (no visible edge) and a desktop-only horizontal mask so the dark thins out toward the right where the garment and face sit. The frame gradient is cut to a whisper.

Exact CSS in `assets/ka-collection-hero.css`:

1. Replace `.ka-coll-hero__overlay`:
```css
.ka-coll-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top,
    rgba(15,12,10,.20) 0%,
    rgba(15,12,10,.08) 25%,
    rgba(15,12,10,.03) 45%,
    rgba(15,12,10,.05) 100%);
}
```
2. Delete the R2.1 `.ka-coll-hero__content > div:first-child` and `::before` rules and the `max-width: 600px` `div:first-child::before` rule. Add after the `__content` rule:
```css
.ka-coll-hero__content {
  isolation: isolate;
}
/* Text-anchored scrim (R2.3): travels with the title block, so the eyebrow always
   sits at the same depth inside it whatever the photo or title length. Eased
   ramp, full-bleed edge to edge, so no visible box. */
.ka-coll-hero__content::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -120px;
  right: calc(-1 * clamp(24px, 4vw, 64px));
  bottom: calc(-1 * clamp(28px, 5vw, 56px));
  left: calc(-1 * clamp(24px, 4vw, 64px));
  background: linear-gradient(to bottom,
    rgba(15,12,10,0) 0,
    rgba(15,12,10,.02) 20px,
    rgba(15,12,10,.08) 40px,
    rgba(15,12,10,.19) 60px,
    rgba(15,12,10,.35) 80px,
    rgba(15,12,10,.54) 100px,
    rgba(15,12,10,.70) 120px,
    rgba(15,12,10,.75) 140px,
    rgba(15,12,10,.76) 100%);
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 45%, rgba(0,0,0,.4) 80%, rgba(0,0,0,.3) 100%);
  mask-image: linear-gradient(to right, #000 0%, #000 45%, rgba(0,0,0,.4) 80%, rgba(0,0,0,.3) 100%);
  pointer-events: none;
}
```
3. In the `max-width: 600px` block add:
```css
  .ka-coll-hero__content::before { -webkit-mask-image: none; mask-image: none; }
```
4. Eyebrow rule stays as R2.1 (colour #F4ECDE, opacity 1, weight 500, no text-shadow). No other changes. The text-shadow was not needed.

Notes: the scrim top (-120px) is tuned to the eyebrow depth; the eyebrow must remain the first element of the first child of `__content`. Mask support is Chrome/Safari/Firefox current; if it were ignored the scrim just stays full width (still passes, slightly heavier on the right). Do not animate it.

Look result (Docs/review-assets/hero-pool-tuned.png, before = current staging, after = R2.3, Drapes / Bloom Soiree / Lehengas / Corsets at 1470 and 390): no rectangle or lozenge on any; Drapes' arm, bodice and the Bloom Soiree torso stay readable on desktop (the scrim thins toward the right), and the face is never touched. On mobile the text column spans the frame so the lower third of the garment is still toned down, but as a smooth ramp, with the face and bodice clear. Dark photos (Corsets) are essentially unchanged.

Measured worst-5% contrast of the eyebrow backdrop vs #F4ECDE (QA's an.py, final CSS; bar 4.5, target about 5):

| Collection | 1470x771 | 1440x900 | 1920x1080 | 390x844 |
|---|---|---|---|---|
| first-love | 9.64 | 9.74 | 10.06 | 9.34 |
| the-festive-edit | 9.68 | 10.22 | 11.17 | 12.80 |
| the-bloom-soiree | 8.34 | 8.18 | 8.63 | 8.20 |
| chamak | 10.44 | 10.53 | 10.80 | 10.42 |
| barre-oblique | 14.10 | 14.15 | 14.59 | 14.04 |
| the-wedding-festive-collection-22 | 4.84 | 5.19 | 6.68 | 11.36 |
| bestsellers | 8.62 | 8.73 | 9.05 | 8.73 |
| lehengas | 9.44 | 9.75 | 9.92 | 9.71 |
| drapes | 7.82 | 7.91 | 8.15 | 7.91 |
| indo-western | 13.05 | 10.35 | 11.50 | 9.02 |
| corsets | 15.60 | 15.92 | 16.07 | 15.49 |
| gowns | 9.94 | 9.83 | 10.18 | 10.28 |

Minimum 4.84 (Wedding Festive Collection at 1470, which is a bright amber backdrop plus the wrapped title); next lowest 5.19. All 48 cells clear 4.5. Honest limit: reaching 5.0 on that one cell would need roughly +.05 scrim alpha at the eyebrow, which I judged not worth the added weight everywhere else. Say if you want it. Measurement hides the eyebrow glyphs (transparent colour) and reads the backdrop in its bounding box, as QA did.
