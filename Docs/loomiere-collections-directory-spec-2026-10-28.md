# Loomière in the collections directory — build spec (2026-10-28)

Asked by Sameeksha. Her screenshot confirms the surface: HOMEPAGE "Collections Directory" (Maison / Our Collections). Editor shows "Add Collection card (5/5)" greyed out because the block schema has "limit": 5. Spec only; no theme files edited.

## Images checked (live site)
- custom.hero_image (crimson, `loomiere-teaser-desktop-crimson.jpg`): 4:3 landscape, model reclining, face at ~78% x / 62% y. Centre-cropped into a 2:3 portrait card it CUTS THE FACE (this is what /collections does today: no object-position). With 70% 90% it keeps face + bodice + necklace but loses the skirt sweep. Wrong image for a portrait card.
- collection.image / mobile hero (fuchsia, `loomiere-teaser-phone-fuchsia.jpg`): 3:4 portrait, standing, face top third, corset, scarf, skirt all in frame. In a 2:3 card only ~6% of width is trimmed. Face + outfit, and it matches the other four portrait cards (standing model, full look).

## PRIMARY: Homepage directory (6 cards)
Decision: raise block limit 5 -> 6, add Loomière FIRST (01), keep First Love second (02), keep all five existing cards. Nothing is dropped.
Order: Loomière, First Love, The Festive Edit, The Bloom Soirée, Chamakk, Barre Oblique (matches slider order).

Layout: 3 columns x 2 rows on desktop (not 6 columns).
- 6 columns at 1470x771 gives ~215x320 cards: too small, names ("The Bloom Soirée") wrap, photography stops being "large". 5 -> 6 columns is a step toward marketplace density; rejected.
- 3x2 at 1470 (and 1440): cards ~450-470 wide x ~690 tall, one row per screen, calm and cinematic; Safari 1470x771 shows one full row of three with the next row peeking. Gap stays 2px.
- <=900px (tablet and phone): 2 columns x 3 rows, an even grid (today's 5 cards leave an orphan, this fixes it). On phone (~180x270 card) reduce label inset to 14px and name size to clamp(1.05rem, 4.4vw, 1.3rem) so long names wrap cleanly.
- Breakpoint: 3 columns >900px, 2 columns <=900px.

Image: fuchsia (collection.image) in the 2:3 card, object-position 50% 30%. Vertical position barely matters (only the sides are trimmed); 50% horizontal keeps the model and the flowing scarf balanced. Do not use the crimson hero here.
Mechanics: set the block's Shopify collection picker to `loomiere` (also gives the URL) and make the section read the image in this order: block image_picker, then collection.image, then the existing name-keyed asset case. No new upload needed. Alt text: "Loomière".

Code (Website Engineering):
1. `sections/ka-collections-directory.liquid`: schema limit 5 -> 6; add the collection.image fallback step before the `case`; preset left alone.
2. `assets/ka-collections-directory.css`: grid `repeat(3,1fr)`; keep 2 columns <=900px; phone label tweak above.
3. Safari: no aspect-ratio on grid items. Replace `.ka-coll-card__image{aspect-ratio:2/3}` with the padding-top:150% wrapper and img `position:absolute; inset:0` (the same class of grid/aspect-ratio bug blanked Client Diaries in Safari on 2026-10-19).
4. `templates/index.json`: add block `loomiere` (name "Loomière", collection "loomiere") first, update block_order. Numerals auto-become 01-06.
Complexity: simple. Verify with staging checksum and Suraj's Safari check at 1470x771.

## SECONDARY (light): /collections page
Add `loomiere` block FIRST in `templates/list-collections.json`; Wedding Festive stays last. That is 7 cards, which in the 4-column grid leaves a row of 4 + 3 (a visible hole). Light fix with a clean result: make the Loomière card a 2-wide feature card (`grid-column: span 2`) so the grid is 2 + 6 = 8 cells = two full rows. A 2-wide card at row height of a 2:3 card is exactly 4:3, which is the crimson image's native ratio, so the existing metafield-first lookup (custom.hero_image = crimson) shows the WHOLE image with no face crop. Set `object-position: 70% 90%` anyway (list css has none today).
- Feature card sizing: wrapper `position:absolute; inset:0` filling the row height set by its two 150%-padding siblings (no aspect-ratio). At <=900px (2 columns) feature spans both columns with padding-top:75% (4:3 banner), then 6 cards in 3 even rows.
- Implementation: block checkbox "Wide feature card" (or key on handle == 'loomiere'), class `.ka-coll-card--feature`. Fallback if the metafield is ever cleared: collection.image (fuchsia) with object-position 50% 18%, degraded but face visible.
- If you prefer zero layout change: skip the feature card, but then the crimson metafield would be used in a portrait card and cuts the face, so you would have to special-case handle `loomiere` to use collection.image (fuchsia). Either way do not ship the unmodified metafield crop.
Complexity: simple to moderate.

## Copy / assets
Name exactly "Loomière" (mixed case). No new copy, no new uploads.
