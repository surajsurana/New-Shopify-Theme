# Photo design fixes, build spec for Technical Director (2026-10-22)

Source: Photo Director sweep (Docs/photo-audits/2026-10-21-full-site-sweep.md). Visual pack for Suraj: Docs/photo-audits/design-pack-1.pdf (source images in Prototypes/design-pack-1/). All "after" renders were produced on the live site with the CSS below injected, so the CSS is tested at the stated viewports in Chrome only. Safari (1470x771 and iPhone) is untested and must be checked on items 1 and 2.

Nothing here touches Shopify data except item 5 (metafield values) and, optionally, item 3 (an image pick in the Theme Editor).

---

## Item 1. Journal article heroes on phones (sections/ka-article-hero.liquid, assets/ka-article-hero.css)

**Decision:** on phones the hero image starts where the fixed header ends. The hero grows by the header height so the photograph keeps its 78svh. The strip behind the header is ivory (#F7F3EC, the nav colour), so no seam shows.

**Behaviour / CSS (tested, `max-width: 600px`):**
```css
@media (max-width: 600px) {
  .a-hero { --hh: 100px; height: calc(78svh + var(--hh)); background: #F7F3EC; }
  .a-hero__bg, .a-hero__overlay { top: var(--hh); }
  .a-hero__overlay { background: linear-gradient(to bottom, rgba(15,12,10,.16) 0%, rgba(15,12,10,0) 30%, rgba(15,12,10,.84) 100%); }
  .a-hero__title { font-size: clamp(1.8rem, 7.4vw, 2.15rem); }
  .a-hero__content { bottom: 28px; }
}
@media (max-width: 600px) and (max-height: 720px) {
  .a-hero__dek { display: none; }
  .a-hero__byline { margin-top: 18px; }
}
```
- The header measured 99.25px (announcement bar 30px plus nav 69px) at 390 wide. `--hh` should not be a hard-coded guess: set it from JS, `document.getElementById('ka-nav').getBoundingClientRect().bottom`, on load and resize, with 100px as the CSS fallback. If the announcement bar can wrap or hide on scroll, read the value at scroll position 0.
- The existing `object-position: center var(--hero-y, 2%)` stays. With the image now in a 390x658 box (cover, height-fit) the heads of all 8 posts clear the header at the default 2%; no per-post `hero_focus_y` needed.
- "Back to the Journal" (`.article-return`, fixed at top 132px) crosses the head on posts 6 and 7. On phones, shorten the visible label to "Journal" (wrap "Back to the" in a span hidden at 600px). Keep the arrow. Position unchanged.
- Desktop (above 600px) unchanged.
- The `.reveal-img` entry animation on `.a-hero__bg` should still work (the box moved, not the class). Verify no flash of ivory strip over the image during the load animation.

**Images:** none new. **Copy:** none. **Complexity:** simple (CSS plus a 4-line JS variable). **Platform risk:** none. **Verified:** all 8 posts at 390x844 and 390x660 (see pack pages 2 to 4).

---

## Item 2. Product page main image fits the first screen (assets/ka-product-main.css)

**Decision: cap it.** A head-to-toe photograph with the hem under the fold reads as a crop. The cost is a narrower image (about 18% at 1470x771: 511px to 421px), accepted.

**Rule:** stage height = min(90vh, 100svh minus 200px); width follows the photograph's own ratio; floor 440px wide so short windows do not produce a thumbnail. Tested override of the existing `.ka-stage--native-ratio` width formula (desktop, above 900px):
```css
.ka-stage--native-ratio {
  width: min(100%, max(440px, min(90vh, 100svh - 200px)) * var(--ratio, 0.75));
}
```
- The 200px is the stage's top offset on desktop (measured 184.5px) plus about 16px of breathing room. If the header or breadcrumb height changes, update it, or better, define `--stage-top: 200px` once.
- Measured results: 1470x771 gives 421x571 (Mani 428x571, ratio 0.75); 1440x900 gives about 516x700 (Mani 525x700). Before: 511x694 and 597x810.
- Keep the stage left-aligned in its column (aligned with the breadcrumb). Do not centre it.
- `aspect-ratio: var(--ratio)` stays; `max-height` stays as a belt-and-braces ceiling.
- Phones (900px and below) are NOT changed by this item. The 15 to 19% of the hem hidden under the sticky Appointment/Concierge bar on 390x660 is part of Docs/product-page-mobile-build-spec-2026-10-21.md; flag to whoever builds that.
- Optional (not required): reduce the breadcrumb-to-image gap by about 20px to recover about 5% height.

**Images/copy:** none. **Complexity:** simple. **Platform risk:** none, but this is the aspect-ratio plus calc family that caused the 19 October Safari bug, so check in Safari at 1470x771 before release. **Verified:** Mani, Electric Blue Victorian Corset, Snow Veil at 1470x771 and 1440x900 (pack pages 5 to 8).

---

## Item 3. Journal index masthead image (sections/ka-journal-masthead.liquid, assets/ka-journal-masthead.css)

**Decision:** replace bloom-soiree-main.jpg (back view, no face; it is the section's hard-coded fallback because no image is set in templates/blog.json) with **first-love-hero.jpg** (1800x1350, K&A's own; face, full beaded blouse and skirt line fit a 2.4:1 band because the source is landscape).

- **Exact asset:** `first-love-hero.jpg` in theme assets. Live URL today: `https://karishmaashita.com/cdn/shop/t/14/assets/first-love-hero.jpg?v=77327054911815621631783250817` (the `t/14` and `v=` change per theme version, so reference the asset by name, not by this URL).
- **Preferred build:** upload to Files and set it through the section's existing `image` picker in templates/blog.json (`"image": "shopify://shop_images/first-love-hero.jpg"` or whatever name the upload takes). Also change the Liquid fallback from bloom-soiree-main.jpg to first-love-hero.jpg so an empty setting never reverts to the faceless frame.
- **Focus:** `.j-mast__bg img { object-position: 50% 6%; }` desktop (was `center 32%`); on `max-width: 600px` use `30% 6%`. At 32% the head tucks under the header at 1470x771; 6% clears it (the header is opaque and covers the top 100px of the masthead).
- Title and subtitle stay centred; they cross the blouse and rely on the existing overlay. No change to the overlay.
- The same image is the First Love collection hero. The repeat is a deliberate call; if Suraj prefers a unique image, a new wide frame would need a shoot (see sweep item 8).

**Complexity:** simple. **Platform risk:** none. **Verified:** pack page 9 (1470x771 and 390x844).

---

## Item 4. Homepage hero on phones (assets/ka-hero.css, sections/ka-hero.liquid)

**Decision:** keep the full-bleed hero, but on phones let the garment own the upper 55% and give the words a dark quiet base.

**CSS (tested, `max-width: 600px`):**
```css
@media (max-width: 600px) {
  .ka-hero__bg img { object-position: 34% 8%; }
  .ka-hero__overlay { background: linear-gradient(to bottom, rgba(15,12,10,.22) 0%, rgba(15,12,10,0) 22%, rgba(15,12,10,0) 46%, rgba(15,12,10,.78) 78%, rgba(15,12,10,.9) 100%); }
  .ka-hero__content { bottom: 84px; }
  .ka-hero__eyebrow { margin-bottom: 12px; }
  .ka-hero__title { font-size: 2.5rem; }   /* was 57.6px */
  .ka-hero__sub { display: none; }
  .ka-hero__ctas { margin-top: 26px; gap: 22px; }
}
```
- Hiding `.ka-hero__sub` on phones: the paragraph is the single largest block over the garment. It is not removed from the DOM (stays for screen readers and for desktop). If Suraj wants it kept, the alternative is to move it below the hero on phones; not recommended.
- The `bottom: 84px` keeps the CTAs clear of the Concierge pill (bottom right). Check at 360x740 as well as 390x844 and 390x660; nothing smaller was rendered.
- The gold "Bridal Couture . Mumbai" tagline under the logo is low-contrast over the photograph on phones (pre-existing, not addressed here); note for a later header pass.
- Desktop unchanged.

**Complexity:** simple. **Platform risk:** none. **Verified:** pack page 10 (390x844 and 390x660). The homepage hero is a single image on the live site (no slides found in the DOM at phone width); if a slider ships later, the `object-position` must be per slide.

---

## Item 5. Final copy for the two live placeholder collections

Set via Admin > Collections > [collection] > Metafields (the live pages read the metafields because the collection has no per-collection template; templates/collection.json holds blank values). Note the placeholder is live today: facts strip shows an em dash in each of the three fact cells, and the intro line reads "Intro copy pending". House format follows Docs/category-pages-copy-2026-10-20.md (values render raw, so "working days" and the rupee sign stay in the value; en dash in lead time; spaced en dash in price).

### Signature Top Sellers (/collections/signature-top-sellers)
| Metafield | Final value |
|---|---|
| custom.intro_copy | The pieces our clients choose most, by K&A by Karishma and Ashita: corset drapes, Indo-Western sets and the Mani lehenga. Hand-embellished and made to order in our Mumbai atelier, with free worldwide shipping via DHL Express. |
| custom.silhouettes | Corset drapes, Indo-Western, lehengas |
| custom.lead_time | 20–35 working days |
| custom.price_range_display | ₹35,000 – ₹1,40,000+ |
| custom.editorial_caption | The pieces chosen first, made to your measure. |

### Anarkalis (/collections/anarkalis)
| Metafield | Final value |
|---|---|
| custom.intro_copy | Anarkalis by K&A by Karishma and Ashita, in organza and viscose silk, each with a hand-embellished dupatta. Made for Karva Chauth, Diwali, Rakhi and the days around a wedding. Made to order in our Mumbai atelier, with free worldwide shipping via DHL Express. |
| custom.silhouettes | Anarkali with dupatta |
| custom.lead_time | 20–35 working days |
| custom.price_range_display | ₹34,500 – ₹42,000+ |
| custom.editorial_caption | A long flare, and a dupatta worked by hand. |

**To verify (TD/QA via API, as the rule is min and max of the published products, not these snapshots):**
- Read on 22 Oct from the public collection feed. Signature: 10 products, lead times 20–25 or 30–35 working days (read from each product page's "Crafted to order in" line), prices ₹35,000 (Rust Orange Tie-Up) to ₹1,40,000 (Mani). Anarkalis: 11 products, lead times 20–25 or 30–35, prices ₹34,500 (Hot Pink) to ₹42,000 (Pastel Olive Green).
- The lead time displayed on the product page comes from `product.metafields.custom.lead_time` (the theme normalises "days" to "working days"). Take min and max from those metafields, not from the page text.
- The fabrics named in the Anarkali intro (organza, viscose silk) and the "hand-embellished dupatta" come from the product descriptions read on 22 Oct (Black and Hot Pink); QA should confirm they hold across all 11, or reduce the line to "each with a hand-embellished dupatta".
- Signature: "Mani lehenga" is named in the intro because it is the one lehenga in the set; if the published set changes, the intro needs a re-read. A set-agnostic fallback: "corset drapes, Indo-Western sets and lehengas".
- The Anarkalis editorial caption only shows if that collection has an editorial insert tile in the grid (`ka-collection-grid.liquid` picks the image by handle; Anarkalis falls to the else branch, a plain charcoal block). Supplying the caption is harmless; if no tile renders, no action. Signature's tile currently shows "Caption pending", so it needs this value now.
- No "Santacruz" appears in either entry.

**Complexity:** simple (8 metafield writes). **Platform risk:** none (metafield definitions already exist; the live collection pages already read them).

---

## Order of build and checks
1. Item 5 (live placeholders, zero code, do first).
2. Items 1, 3, 4 (CSS only), then item 2.
3. Staging only; per CLAUDE.md the usual schema validate, deploy, checksum verify, QA gate, drift check, and Suraj's release-specific approval apply. Suraj sees the before/after images in the PDF first.
4. Suraj to check items 1 and 2 in Safari (1470x771 and an iPhone) on staging.
