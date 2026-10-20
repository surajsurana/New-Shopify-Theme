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
