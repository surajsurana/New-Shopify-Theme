# Blog visual review, 2026-10-19 (Creative Director sign-off)

Method: geometry re-derived from the theme code (not the old notes), then each real image was cropped with the exact object-fit: cover math (PIL, Lanczos) at each viewport and inspected by eye. Render sheets are in the CD scratchpad `.../scratchpad/out/` (breakouts.png, heroes.png, heroes_live.png, hero8pct.png, cards.png).

## Real current geometry (from code)

| Slot | CSS | 1440x900 | 1920x1080 | 1470x771 (Suraj's Safari) | 390x844 |
|---|---|---|---|---|---|
| Breakout frame (`assets/ka-article-body.css`) | width = min(vw,1180) - 2*gutter (mobile pad 16); height 62vh clamp 380-640 (mobile 46vh, min 300); `object-position: center 10%` | 1036x558 (1.86:1) | 1020x640 (1.59:1) | 1033x478 (2.16:1) | 358x388 (0.92:1) |
| Source band visible, 2100x2850 | | 6.0-45.7% down | 5.3-51.6% | 6.6-40.7% | 2.1-81.9% |
| Hero (`assets/ka-article-hero.css`) | 84svh, min 560, full-bleed, `object-position: center 30%` | 1440x756, band 18.4-57.1% | 1920x907, 19.6-54.4% | 1470x648, 20.3-52.7% | portrait, full height (crops sides only) |
| Journal grid card (`ka-journal-card.css`) | 4:3, `center 8%` | band 3.5-58.7% (any width) | same | same | same |

Suraj's screenshot reconciles exactly with the 1470x771 column (1033x478 frame, band 6.6-40.7%), so the geometry is right.

---

## POST 7: festive-season-structured-navratri-diwali (LIVE)

**Verdict: breakout image REJECT, replace. Hero OK as is (but improves if the hero focal fix below ships). No breakout theme change.**

### Evidence
- Current breakout (Untitleddesign_36): the model's face sits ~38-47% down the source (small figure, large ceiling/wall headroom). The frame only ever shows 5-52% of the source on desktop. Result at 1440x900, 1920x1080 and 1470x771: pink wall, arch, door; at best the top of the head at the very bottom edge (1470x771, exactly Suraj's screenshot), never a face. Only mobile (0.92:1, band 2-82%) shows her, as a small figure far from the lens. The old note ("face 18-38%, clean") was wrong for this slot, and the earlier "accepted outlier" was understated: it fails at every desktop viewport, not only the flattest.
- It is also a weak image regardless of crop: a distant figure in a corridor, which does not read as couture.
- Hero (electric blue, Untitleddesign_21): face ~22-32% down, inside the 18-57% hero band at 1440x900, 1920x1080, 1470x771. Face and bodice in frame. Card (4:3 at 8%): face and upper body in frame. Both fine.

### Why not a global theme change for the breakout
The breakout frame is a wide landscape window over a portrait source; a face at ~40% needs a position of ~70%+ (e.g. `center 75%`). That would push the crop band to ~60-100% down and put faces ABOVE the frame on the other six live articles whose faces sit at 1-30% (corset-lehenga-reconsidered, what-makes-a-corset-structured, corset-lehenga-reception, indo-western-defined, dressing-for-every-wedding-event, pant-drape-saree-modern-read, plus electric-blue-victorian). 7 of 8 live articles would break to fix 1. A per-article focal metafield remains rejected (recurring workflow cost); one image swap is cheaper and the better photograph anyway.

### Exact fix (SEO sets article data)
Set `custom.breakout_image` (replace MediaImage 54409907142946) to the Deep Purple Cutout Corset product's lifestyle shot, 2100x2850, K&A's own imagery, same garment the article calls out for Diwali:

URL: https://cdn.shopify.com/s/files/1/0768/3112/9890/files/Untitleddesign_35_f2d897b2-11dc-4178-a21a-a13e7e7b1f5d.png?v=1773898728

Alt text: `Deep purple cutout corset with pre-stitched drape, embroidered with ivory florets and styled with a gold polki choker and bangles`

What is in frame (checked visually): head, face, jewellery, embroidered bodice and cutout fully in frame at 1440x900 (6-46%), 1920x1080 (5-52%), 1470x771 (6.6-41%, bust-length, hands partially cut, acceptable) and 390x844 (full look). Face spans ~8-24% of source, well inside every band. Warm arched-doorway backdrop sits in the same ivory/gold world as the rest of the Journal.

Rejected alternative: Untitleddesign_34 (carved screen, product image 1) also frames perfectly and is the richer image, but it is the Deep Purple product's primary image, which the article's own product card is likely to show a few screens below, so it would duplicate. Use it only if Suraj prefers drama over de-duplication.

Also set alt on the hero featured image if blank: `Electric blue jacquard corset and saree with golden zari butti embroidery` (already present on the live page).

Who: SEO sets the metafield + alt. No theme work needed for this post's breakout.

---

## POST 8: corset-jumpsuits-bustier-sets-sangeet (SCHEDULED 2026-10-28 09:00 UTC)

**Verdict: breakout APPROVED with alt text. Card APPROVED. HERO REJECTED AS THINGS STAND on desktop: face is cut off. Either ship the hero focal-point theme fix (preferred, below) before 28 Oct or the post must not publish with this hero.**

### Evidence
Hero (red 3D flower jumpsuit drape, product `red-3d-flower-jumpsuit-drape`; alt text matches the product, keep it). Face sits 3-17% down the 2100x2850 source. The hero band at `center 30%` starts at 18.4% (1440x900), 19.6% (1920x1080), 20.3% (1470x771). Rendered result at all three desktop viewports: model's head is cut off at the top edge, only the jaw/neck/hair and the bodice visible. On mobile (390x844) the full figure shows, no problem. The hero's "luxury first impression" on desktop would be a headless torso. Hard fail.

Grid card (4:3 at 8%, band 3.5-58.7%): face, bodice, cape and drape in frame, only the top of the hair trimmed. Approved at all widths (cards are width-independent).

Breakout (Onion Pink Mirror Work, back/three-quarter, 2_bdf94d02): head and ponytail braid at 3-18% down; fully inside every band. 1440x900 (6-46%): head, mirror-work back, sheer cape, waist. 1920x1080 (5-52%): to the flared pants. 1470x771 (6.6-41%): head to mid-back, clean. 390x844 (2-82%): near full figure. Colour (onion pink against the amber backdrop) complements the red hero. Approved. Minor: the very top of the hair is trimmed by ~1-3% at desktop, nothing important.

### Exact fix
1. Theme (Technical Director): change `.a-hero__bg img { object-position: center 30%; }` to `center 10%` in `assets/ka-article-hero.css`. This is a GLOBAL change and it is a net improvement, not just for post 8. I rendered every live article hero at 1440x900 at 30% vs the proposed value. At the current 30%, 6 of 7 live hero featured images already lose the model's face on desktop (corset-lehenga-reception, corset-lehenga-reconsidered, dressing-for-every-wedding-event, electric-blue-victorian-corset-with-drape-saree, what-makes-a-corset-structured, pant-drape-saree-modern-read: only the chin/neck/mouth survives or no face at all; indo-western-defined shows a partial face). At 8% (verified; 10% is within a hair of it) every one of the 8 existing heroes plus post 8 shows face and garment at 1440x900, 1920x1080 and 1280x1000. Only trade-off: post 7's hero (small figure, tall headroom) sits a little lower in frame, face and bodice still fully visible. Mobile unaffected (portrait crop trims sides only). Consider the hero band after the fix: ~6-45% (1440x900), ~6-41% (1920x1080); faces at 1-35% in all existing sources fit. Verify on staging against all 9 hero images at 1440x900, 1920x1080, 1280x1000 and 390x844 before release (I did the math and the renders; QA should repeat on the real DOM).
   Note this reverses "30%" in the hero css; it makes hero consistent with the 8%/10% already used on cards and breakouts. Per-article metafield not needed.
2. Process: TD implements via staging + QA + Suraj's release approval. Timeline: has until 2026-10-27 to be live. If the theme release is not approved by then, SEO should un-schedule post 8 (or push the date); do not publish with the current hero.
3. SEO sets breakout alt text on MediaImage (2_bdf94d02...): `Back view of the onion pink mirror work blouse with a sheer mirror-edged dupatta and embellished flared pants, hair in a low ponytail braid`

No image change needed for post 8 if the hero fix ships. (Fallback if it cannot: no other red-jumpsuit image works either, images 8 and 9 have face at 3-27%; so the choice then would be to delay, not to swap.)

---

## Who does what

| Action | Owner |
|---|---|
| Post 7: replace breakout image with Untitleddesign_35 URL above + alt; keep hero | SEO (article data) |
| Post 8: set breakout alt text (above); keep images | SEO |
| Hero `object-position` 30% to 10% in `ka-article-hero.css` (global), staging + QA against all published/scheduled hero images | Technical Director; release needs Suraj's approval |
| Post 8 go/no-go on 28 Oct depends on hero fix being live | SEO + TD |
| Add to checklist for every future post: face within source 0-35% for hero, 0-30% for breakout; verify with real render before scheduling | SEO / CD |

## Footnote on process
Prior QA (#13, #22) was math on face estimates; this review rendered real crops and found the old "known accepted outlier" understated, and a hero-slot problem that math on the breakout never covered.
