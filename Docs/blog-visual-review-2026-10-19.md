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

---

# Round 2 -- face + outfit (2026-10-19, after Suraj stopped the 8% release)

Criterion corrected: the hero must show face AND outfit together, the way a stylist would frame it. Round 1 optimised for face only; 8% would have pushed the festive post's face up under the header. Suraj was right about both posts.

## Method and calibration
Same cover math as Round 1, rebuilt with two additions Round 1 ignored: (1) the fixed header (announcement bar + nav, about 105 CSS px) sits over the top of the hero, so the top 105px of the crop is not visible; (2) the title/dek block, bottom-left. Calibrated against Suraj's two Live screenshots at 1470x771: hero 1470x648, festive shows face under the header with bodice and choker; indo-western shows the headless torso. My render reproduces both exactly (face top, bodice line, hands position). All 9 heroes (8 published + scheduled sangeet post) rendered at 1470x771, 1440x900 and 1920x1080, at 0, 3, 6, 8, 10, 15, 22, 26, 30, 34%. Hero images are the 1800px (and p8 2100px) sources.

## Findings (1470x771, header-aware)
| Article | Live 30% | Best range | Notes |
|---|---|---|---|
| festive-season-structured-navratri-diwali | Face + bodice + choker. Good | 26-30% | Small figure, large headroom. At 8% the face disappears under the header; at 15% it is half hidden. Suraj's approval stands |
| indo-western-defined | Headless torso (Suraj's problem) | 0-3% | Face + halter corset |
| corset-lehenga-reconsidered | Hands/blouse, no face | 2-5% | Face, necklace, bodice |
| what-makes-a-corset-structured | Waist/saree only | 0-3% | Face, hand at collarbone, bodice |
| corset-lehenga-reception | Midriff/skirt only | 0-4% | Face, necklace, off-shoulder bodice |
| dressing-for-every-wedding-event | Chin/neck | 2-8% | Beauty close-up; face is the picture, 2-4% keeps eyes clear of header |
| pant-drape-saree-modern-read | Midriff only | 0-3% | Face + embroidered blouse; above 6% the face is lost |
| electric-blue-victorian-corset-with-drape-saree | Waist/peplum | 0-3% | Face, necklace, bodice |
| corset-jumpsuits-bustier-sets-sangeet (scheduled) | Torso/net cape, no face | 0-3% | Face + red 3D-flower bodice and net drape |

The same ranking holds at 1440x900 and 1920x1080 (the visible band is 33-39% of the source at all three, so a percentage transfers across viewports). Mobile is unaffected (portrait crop trims sides only).

## Can ONE global value satisfy face + outfit on all nine?
No. Eight of nine want 0-4%. The festive post wants 26-30% because its photograph is a small figure with a lot of headroom. Any global value that works for the eight (about 2%) hides the festive face under the header; the live 30% (which suits festive) fails the other eight, including post 8. Round 1's 8% was the wrong compromise: it fails festive and over-crops outfits on several others.

## Top recommendation: a low global default plus a per-article override, used only by exceptions
1. Theme: `.a-hero__bg img { object-position: center var(--hero-y, 2%); }` (default 2%).
2. Theme: a number article metafield, suggested `custom.hero_focus_y` (0-100, integer, optional). If set, the hero section writes it as an inline `--hero-y: N%` custom property on `.a-hero__bg`; if empty, the 2% default applies. Mobile unchanged.
3. Set the festive post's metafield to 30 so it stays exactly as Suraj approved it. Every other current post, and post 8, need nothing set.

Why this beats the alternatives:
- Previously rejected for "recurring workflow cost". That cost is now close to zero: with a 2% default, only the occasional small-figure-with-headroom photo needs a value, and SEO already sets article data (custom.breakout_image) on every post. It is one optional number, not a per-post chore.
- It is the only option that keeps the approved festive hero untouched while fixing the other eight.
- Suraj already reviews every post visually; the number is what that review decides.
- Re-cropping the festive source image (cut the headroom, then use a pure global 2%) would work with no metafield, but it changes an image Suraj called perfect and any future small-figure photo breaks it again. Keep as fallback only.
- Changing the hero layout (split portrait/text) would solve cropping permanently but abandons the cinematic full-bleed language used site-wide; not worth it for a crop problem solvable with one number.

What it means for whoever publishes: choose a hero image with the face in the top ~25% of the frame (portrait, face high, 3:4 or taller). If it fits, do nothing. If the figure is small or has headroom, the CD previews it, gives a number (higher moves the crop lower toward the outfit), and SEO enters it. Rule of thumb: face top at ~10% of image height = 2%; at ~25% = about 25-30%.

Platform note for Technical Director (one line): metafield definitions and Liquid reading of `article.metafields.custom.*` are standard; worth checking whether Shopify's own file focal point is available for article images (if so it could replace the number), but do not depend on it.

Priority and complexity: simple (one CSS line, one optional metafield definition, one inline style).

## Post 8 (publishes 28 Oct)
With the 2% default (no metafield needed) the sangeet hero shows face + red bodice + net drape at all three viewports. Needs the theme change live by 27 Oct. Round 1's 8% is withdrawn; the Round 1 recommendation to set the global value to 8-10% in `ka-article-hero.css` is superseded by this section. Fix 2 (breakout alt text) unchanged.

## Contact sheets for Suraj (left: Live 30%, right: recommended; white band = site header; box = title block)
- Docs/review-assets/hero-crops-1470x771.png (Suraj's Safari window)
- Docs/review-assets/hero-crops-1440x900.png
- Docs/review-assets/hero-crops-1920x1080.png

---

# Round 3 -- dressing-for-every-wedding-event and a 2% re-check (2026-10-19)

Contact sheet: Docs/review-assets/hero-crops-round3.png (same header-aware render, 1470x771, 1440x900, 1920x1080).

## dressing-for-every-wedding-event: no per-article value works; swap the hero image
The current hero (files/27.png, 1800x2443) is a 3/4 portrait: eyes at ~19% of image height, chin ~33%, bodice top ~40%. The visible hero band is about 35% of the image height and the fixed header hides the top ~16% of that band, so only ~29% of the image is actually seen. Eyes-to-bodice needs ~26-30%, so it cannot fit once the crop is held to a decent margin. Tested 2-30%: 2-10% = face only (yellow absent); 16% = face plus a sliver of yellow shoulder edge and no bodice; 20%+ = chin/neck/shoulders, eyes gone. Best possible compromise is 16%, which is still a face with yellow at the margins, so it fails the face + outfit rule. Same result at all three viewports.

Recommendation: swap the hero to the lime-yellow product's main image, same shoot, same outfit, full length, 1800x2443:
https://karishmaashita.com/cdn/shop/files/25_b30aa8e7-058c-4617-9aad-8f7fd2c7727d.png
At the default 2% (no metafield) it shows face, hand at the collarbone, the yellow 3D-flower bodice and the pleated drape at all three viewports (0-4% all work). It is not used as another post's hero. Keep files/27.png as the in-article image if wanted. The metafield design is unchanged; this post needs no value.
(Do not use articles/47.png: it is already the pant-drape post's hero.)

## Re-check of the other seven at 2%
- indo-western-defined, corset-lehenga-reconsidered, corset-lehenga-reception: face, necklace and bodice. Pass.
- what-makes-a-corset-structured, electric-blue-victorian: face (eyes down), jewellery, bodice. Pass. Head-top is slightly under the header at 2%; 0% gives a little more headroom if wanted but is not required.
- pant-drape-saree-modern-read: face from the eyes down plus the red embroidered blouse. Pass; 0% marginally better.
- festive-season-structured-navratri-diwali: needs its own value, 30 (as approved); at 2% only the top of a small head shows.
- scheduled sangeet post: face plus red bodice and net drape. Pass.
Conclusion: no other article needs its own value. Festive = 30 remains the only override.
