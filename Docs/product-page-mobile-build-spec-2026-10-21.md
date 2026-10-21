# Mobile product page v1 — build specification (2026-10-21)

For: Technical Director. From: Creative Director.
Approved by Suraj 2026-10-21 ("i agree to the fixes") for priorities 1-4 of `Docs/mobile-pdp-review-2026-10-21.md`, with one decision: **the payment flow stays exactly as it is today (customer pays at checkout, then the advisor gets in touch; no deposit, no pay-later).**
Prototype: `Prototypes/product-page-mobile-v1.html` (open it; toggles for iPhone 390x844, in-app 390x660, desktop 1440, and "Live today" for comparison). On a real phone the page fills the screen.
Screenshots: `Docs/review-assets/mobile-pdp-v1-*.png`.
Not covered here (TD already owns it): real pre-filled WhatsApp links and enquiry tracking. This spec assumes them and reuses TD's own attribute convention (`data-ka-enquiry="whatsapp"`, `data-ka-placement`, `data-ka-product`) and the `wa_enquire` variable already in the section.

Baseline: the three files as they stood on 2026-10-21 at 20:08 (they already contain TD's `wa_appt` / `data-ka-enquiry` changes). The patches below were dry-run applied to exactly that baseline. If the files have moved since, apply the hunks by hand; the intent of each hunk is described in section 4.

---

## 1. What ships (and what does not change)

| # | Change | Phones only (<=900px)? |
|---|---|---|
| 1 | Sticky bar becomes two buttons: charcoal **Message us on WhatsApp** + outlined **Select size / Add to Bag**. 54px tall, 11.5px type, safe-area padding. "Appointment" and "Concierge" leave the bar. | Yes |
| 2 | First screen: breadcrumb retired (a back chip sits on the photo), nav bar tightened (logo sub-line dropped), full-bleed **swipe gallery** with dots replaces the thumbnail strip; **title, price, lead time** sit directly under the photo and clear the bar at 390x844, 390x660, 375x667 and 360x740. | Yes |
| 3 | **Made to measure first** on pieces >= Rs 50,000: card leads and is selected by default, standard sizes follow ("Or choose a standard size"), then the inline "Prefer to talk? Message our advisor on WhatsApp" line. Checkout flow untouched. | Yes |
| 4 | Polish: poem + Google rating move below the price; monochrome Google mark; in-page duplicate Add to Bag / Book an Appointment hidden on phones; size hint sits under the size grid; toast clears the bar; 48px size buttons; 44px tap targets; "How it works" disclosure for the 3-step explainer. | Yes |

**Desktop and tablet-landscape (>=901px) are unchanged.** Verified by pixel diff of the real current CSS against the proposed CSS at 901, 1024 and 1440 wide (first screen, scrolled, size chosen, made-to-measure chosen): zero differing pixels. Every new element is `display:none` above 900px; the MTM pre-selection is gated on `matchMedia('(max-width: 900px)')`.

Recommended for a later, separate approval (not in this build): the same made-to-measure-first order on desktop, and the monochrome Google mark on desktop. Desktop was left alone on purpose.

## 2. Decisions

**2.1 Threshold for made-to-measure first: Rs 50,000** (section setting, default 50000, editable without code).
Why: every online order to date was Rs 29,000-48,000 (11 orders; 9 of 12 items shipped abroad), so Rs 50,000 leaves every price that has actually converted online on today's size-first layout. Everything above it is where we have zero online orders and where the abandoned checkouts sit (Rs 3.8 lakh and Rs 4.75 lakh lehengas, repeat attempts): those buyers want a fit conversation before paying, and a couture house would lead with that. The catalogue runs about Rs 30,000-2,80,000, so the line splits it sensibly. It is a judgment, not a measurement: review after 4 weeks of enquiry data (section 9) and move the setting if needed. Per-product override: optional product metafield `custom.mtm_first` = `yes` / `no`.

**2.2 Pre-selected, not merely first.** On those pieces the card is selected on load (phones), so the bar reads "Add to Bag" immediately and the buyer who wants to be measured has nothing to decide. Choosing a size deselects it. The explainer stays closed until "How it works" is tapped (it is long). Nothing is added to the bag until Add to Bag is tapped. To switch pre-selection off later, remove the `data-preselect` attribute in the Liquid; nothing else depends on it.

**2.3 Flow unchanged.** Add to Bag with the card selected does exactly what it does today (real MTM variant if the product has one, otherwise the first variant plus line-item property `Size: Made to my measurements`). No new copy implies a deposit, a refund or a pause before payment.

**2.4 Lead time on phones is set in Cormorant italic, sentence case** ("Made to measure · Crafted to order in 30-35 working days") so it fits one line at 360px and reads as house voice rather than a tracked label. Desktop keeps its uppercase tracked line.

**2.5 Crop.** On short screens (in-app browsers) the gallery floors at 360px tall, which crops a full-length gown at about the thigh (face and corset still in frame; `object-position: 50% 12%`). On a normal 844px screen the photo shows in full. Accepted so name, price and lead time are never below the fold.

## 3. Copy (exact strings)

| Where | String |
|---|---|
| Bar, primary | Message us on WhatsApp |
| Bar, secondary idle | Select size |
| Bar, secondary ready | Add to Bag |
| MTM card title | Made to my measurements |
| MTM card note | Your advisor will call within 24 hours of your order. |
| Disclosure | How it works |
| Size label (MTM-first pages, phones) | Or choose a standard size |
| Size label (other pages) | Select Your Size (unchanged) |
| Inline line | Prefer to talk? **Message our advisor on WhatsApp** |
| Back chip | the product's first collection title (fallback "All Products") |
| Size hint (unchanged) | Please select a size, or choose Made to my measurements. |

Existing explainer copy is unchanged. **Flag for Suraj:** the card says the advisor will *call*; the explainer's first step still says "be in touch within 24 hours". If the team will mostly message (overseas buyers, time zones), change the card to "will be in touch" so the promise is one we always keep. I used "call" because that was the wording requested.
Optional, not built: a response-time promise next to the inline line ("we reply within the hour, 10am-8pm IST"). Only add it if the team can honour it every day.

## 4. Files and exact changes

Only three theme files change. No new files, no snippets, no `layout/` change, no new settings other than one section setting.

1. `sections/ka-product-main.liquid`
2. `assets/ka-product-main.css`
3. `assets/ka-product.js`

Ready-made, dry-run-verified patches (apply from the theme root with `patch -p1 < file`, or `git apply`) and the full proposed files are in `Prototypes/product-page-mobile-v1-proposed/`:
`ka-product-main.liquid.patch`, `ka-product-main.css.patch`, `ka-product.js.patch` (and the three full `.liquid/.css/.js` files for reading).

### 4.1 Liquid, what each hunk does
- **Top `liquid` block:** computes `mtm_first` (price >= `section.settings.mtm_first_from` x 100 paise, with the `custom.mtm_first` yes/no override) using plain `if / elsif` (no filters inside any `case`), plus `back_url` / `back_label`.
- `<section class="ka-product ka-product--mtm">` modifier class when `mtm_first`.
- **Inside `.ka-stage`:** new `.ka-swipe` (one `.ka-swipe__slide` per image, `<img>` with srcset 600/900/1200, first image `fetchpriority="high"`, rest `loading="lazy"`), `.ka-dots`, `.ka-back`. Existing stage markup (background-image, counter, zoom, wishlist heart) is untouched so desktop is identical and there is still exactly one heart button.
- **Purchase block:** `opt-head`, `size-grid`, `bespoke` card, `mtm` explainer and `cta-stack` are wrapped in `<div class="ka-buy">` (+ `ka-buy--mtm`). The CSS `order` property reorders it on phones; DOM order, tab order and desktop are unchanged.
- **Bespoke card:** text wrapped in `.ka-bespoke__txt`, new `.ka-bespoke__n` note (phones only), `data-preselect="true"` when `mtm_first`; new `.ka-mtm-toggle` button ("How it works").
- **Size label:** two spans, `.ka-opt-label__d` (desktop/standard) and `.ka-opt-label__m` (phones, MTM-first only).
- **Inline line:** `<p class="ka-talk">` with a real `<a href="{{ wa_enquire }}" target="_blank" rel="noopener" data-ka-enquiry="whatsapp" data-ka-placement="pdp-inline-whatsapp" data-ka-product="{{ product.handle }}">`.
- **Mobile bar:** replaced by the two-button markup (`.ka-btn--wa` anchor with `data-ka-placement="pdp-mobilebar-whatsapp"`, and the `#ka-mobilebar-bag` button carrying `data-label-idle="Select size"`). **Keep the `ka-btn ka-btn--wa` classes and the `data-ka-*` attributes if the WhatsApp link markup is touched again.**
- **Schema:** one new setting (below).

### 4.2 Schema notes (known silent-drop rules)
- New setting: `{ "type": "number", "id": "mtm_first_from", "label": "Measure-first from (INR)", "default": 50000, "info": "..." }`. Label is 24 characters; schema `name` / preset name / block names are untouched (all <= 25). No new `header` setting. **No `url` default** anywhere. **No filters inside any `case`** (none used; the new logic is `if/elsif`).
- Run `scripts/validate-theme-schema.ps1` before pushing and the checksum verify after deploy, as per CLAUDE.md. I could not run the PowerShell validator against the proposed files (read-only task); I checked by hand: all `if/endif`, `for/endfor`, `unless/endunless`, `comment/endcomment` pairs balance, and the schema block parses as JSON.
- Optional metafield: define `custom.mtm_first` as single-line text (values `yes` / `no`) in Shopify admin if per-product override is wanted. The Liquid tolerates it not existing.

### 4.3 CSS (append to the end of `assets/ka-product-main.css`; nothing above it is edited)
```css
/* ================================================================
   MOBILE PRODUCT PAGE v1 — 2026-10-21
   Docs/product-page-mobile-build-spec-2026-10-21.md

   Everything below is additive. The new elements (.ka-swipe, .ka-dots,
   .ka-back, .ka-mtm-toggle, .ka-talk, .ka-bespoke__txt/__n, the
   .ka-opt-label__m label) are display:none above 900px, and nothing
   here changes a desktop rule — desktop must render pixel-identical.

   Safari/WebKit rules followed here: no aspect-ratio on any flex/grid
   item that lacks in-flow content (the mobile stage sets aspect-ratio:auto
   and an explicit height; slides use an absolutely-positioned <img>);
   100vh fallback declared before 100svh; env() paired with a max() floor.
================================================================ */

/* ── desktop: hide every mobile-only element ── */
.ka-swipe, .ka-dots, .ka-back, .ka-mtm-toggle, .ka-talk, .ka-bespoke__n, .ka-opt-label__m { display: none; }
.ka-bespoke__txt { display: flex; flex-direction: column; min-width: 0; }
.ka-mobile-bar .ka-wa-glyph { display: none; }

@media (max-width: 900px) {

  /* 1. slimmer chrome on the product page: breadcrumb retired (the back
        chip over the photo replaces it), nav bar tightened, logo
        sub-line dropped. Utility bar (marquee + currency chip) is kept. */
  .ka-pb { display: none; }
  body.template-product .ka-nav { padding-top: 9px; padding-bottom: 9px; }
  body.template-product .ka-nav__logo small { display: none; }
  .ka-product { padding: var(--ka-hdr, 79px) 0 0; }

  /* 2. gallery: full-bleed swipe gallery, no thumbnail strip.
        Height = what is left of the screen after the header (79px), the
        title / price / lead-time strip (~128px) and the sticky bar (78px),
        never taller than the photo's own 3:4 and never shorter than 360px.
        That floor is what makes name, price and lead time fit above the
        bar inside an in-app browser (390x660). */
  .ka-thumbs { display: none; }
  .ka-stage,
  .ka-stage--native-ratio {
    aspect-ratio: auto; width: 100%; max-height: none; min-height: 0;
    height: clamp(360px, calc(100vh - 79px - 136px - 78px), 133.33vw);
    height: clamp(360px, calc(100svh - 79px - 136px - 78px), 133.33vw);
    background-image: none !important;
    background-color: var(--c-paper-deep);
  }
  .ka-stage__idx { display: none; }
  .ka-swipe {
    display: flex; height: 100%;
    overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }
  .ka-swipe::-webkit-scrollbar { display: none; }
  .ka-swipe__slide { flex: 0 0 100%; position: relative; scroll-snap-align: start; scroll-snap-stop: always; }
  .ka-swipe__slide img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
  .ka-dots { display: flex; gap: 7px; position: absolute; left: 0; right: 0; bottom: 14px; justify-content: center; pointer-events: none; }
  .ka-dots i { width: 6px; height: 6px; border-radius: 50%; background: rgba(247,243,236,0.55); transition: background 0.35s var(--ease-luxury), transform 0.35s var(--ease-luxury); }
  .ka-dots i.on { background: #F7F3EC; transform: scale(1.25); }
  .ka-back {
    position: absolute; top: 14px; left: 14px; z-index: 4;
    display: inline-flex; align-items: center; gap: 4px; min-height: 44px; padding: 0 14px 0 8px;
    background: rgba(247,243,236,0.88); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    font-family: var(--f-sans); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-charcoal);
  }
  .ka-back svg { width: 16px; height: 16px; fill: none; stroke: var(--c-charcoal); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .ka-stage__wish { width: 44px; height: 44px; }

  /* 2b. title, price, lead time first; poem and rating follow. The panel
         becomes a column so DOM order is untouched (SEO/a11y unchanged). */
  .ka-panel { display: flex; flex-direction: column; padding: 16px var(--gutter) 0; }
  .ka-collection-tag { display: none; }
  .ka-p-title { order: 1; font-size: 1.5rem; line-height: 1.12; margin: 0 0 6px; }
  .ka-p-price-row { order: 2; margin-bottom: 2px; }
  .ka-p-price { font-size: 1.5rem; line-height: 1.2; }
  .ka-p-price-row { line-height: 1.2; }
  .ka-p-tax { line-height: 1.2; }
  .ka-p-made {
    order: 3; margin-bottom: 16px; display: block; line-height: 1.3;
    font-family: var(--f-display); font-style: italic; font-size: 1.02rem; letter-spacing: 0; text-transform: none;
  }
  .ka-p-made::before { display: none; }
  .ka-p-poem { order: 4; font-size: 1.1rem; max-width: none; margin-bottom: 16px; }
  .ka-grating { order: 5; margin-bottom: 24px; font-size: 0.74rem; }
  .ka-glogo { font-family: var(--f-sans); font-size: 0.74rem; gap: 0; }
  .ka-glogo span { color: var(--c-ink-mid) !important; }          /* monochrome G: off-palette colours retired */
  .ka-buy { order: 6; display: flex; flex-direction: column; padding-top: 22px; border-top: 1px solid var(--line); }
  .ka-toast { order: 7; }
  .ka-assure { order: 8; }
  .ka-accordion { order: 9; }

  /* 3. purchase block: bigger targets, made-to-measure card, order switch */
  .ka-opt-head { order: 3; align-items: center; margin-bottom: 12px; }
  .ka-size-grid { order: 4; gap: 8px; margin-bottom: 14px; }
  .ka-size { min-height: 48px; padding: 0; font-size: 0.88rem; display: inline-flex; align-items: center; justify-content: center; }
  .ka-opt-label__d { display: inline; }
  .ka-btn-line { min-height: 44px; display: inline-flex; align-items: center; padding: 0 2px; border-bottom: 0; text-decoration: underline; text-decoration-color: var(--c-charcoal); text-underline-offset: 5px; }

  .ka-bespoke {
    order: 5; padding: 18px 16px; gap: 14px; align-items: flex-start; margin-bottom: 10px; min-height: 72px;
  }
  .ka-bespoke__dot { width: 12px; height: 12px; margin-top: 7px; }
  .ka-bespoke__k { font-family: var(--f-display); font-size: 1.3rem; letter-spacing: 0; text-transform: none; font-weight: 400; line-height: 1.2; }
  .ka-bespoke__n { display: block; font-family: var(--f-sans); font-size: 0.82rem; line-height: 1.5; color: var(--c-ink-mid); margin-top: 4px; }
  .ka-bespoke__s { display: none; }   /* the card's position and note already say it; badge retired on phones */
  .ka-bespoke.sel { border-color: var(--c-charcoal); }
  .ka-mtm-toggle {
    order: 6; display: block; align-self: flex-start; min-height: 44px; margin: -4px 0 6px 2px; padding: 0 2px;
    font-family: var(--f-sans); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-rosegold-2);
    text-decoration: underline; text-decoration-color: var(--c-rosegold-pale); text-underline-offset: 5px; line-height: 44px; height: 44px;
  }
  .ka-mtm { order: 7; }
  .ka-talk { order: 9; }

  /* made-to-measure first: card, how-it-works, then the standard sizes */
  .ka-buy--mtm .ka-bespoke { order: 0; margin-bottom: 0; }
  .ka-buy--mtm .ka-mtm-toggle { order: 1; }
  .ka-buy--mtm .ka-mtm { order: 2; }
  .ka-buy--mtm .ka-opt-head { order: 3; margin-top: 14px; }
  .ka-buy--mtm .ka-size-grid { order: 4; }
  .ka-buy--mtm .ka-opt-label__d { display: none; }
  .ka-buy--mtm .ka-opt-label__m { display: inline; }
  /* standard-size-first pages keep sizes above the card; the card keeps its small italic tag */

  .ka-mtm.open { max-height: 760px; }
  .ka-mtm__steps li { font-size: 0.95rem; }

  /* in-page Add to Bag / Book an Appointment are retired on mobile: the sticky bar carries both.
     The size hint stays (it is the response to a "Select size" tap). */
  .ka-cta-stack { display: contents; }   /* hint becomes a direct child of .ka-buy so it can sit under the size grid */
  .ka-cta-stack .ka-btn { display: none; }
  .ka-size-required-hint { order: 4; font-size: 0.78rem; letter-spacing: 0.03em; text-align: left; }
  .ka-size-required-hint.show { max-height: 48px; margin-top: 0; margin-bottom: 8px; }

  /* inline enquiry line */
  .ka-talk {
    display: block; margin: 14px 0 0; font-family: var(--f-display); font-style: italic; font-size: 1.08rem; color: var(--c-ink-mid); line-height: 1.5;
  }
  .ka-talk a { font-family: var(--f-sans); font-style: normal; font-size: 0.74rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-charcoal); text-decoration: underline; text-decoration-color: var(--c-rosegold-pale); text-underline-offset: 5px; display: inline-block; padding: 8px 0; }

  /* 1b. sticky bar: two buttons, bigger type and targets, safe-area aware */
  .ka-mobile-bar {
    display: flex; gap: 10px; align-items: stretch;
    padding: 12px 14px max(12px, env(safe-area-inset-bottom));
    background: rgba(247,243,236,0.97);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  }
  .ka-mobile-bar .ka-btn {
    width: auto; min-width: 0; min-height: 54px; padding: 0 11px;
    font-size: 0.72rem; letter-spacing: 0.07em; line-height: 1.25; text-align: center; gap: 9px;
    -webkit-tap-highlight-color: transparent;
  }
  .ka-mobile-bar .ka-btn--wa { flex: 1 1 auto; background: var(--c-charcoal); border-color: var(--c-charcoal); color: var(--c-paper); }
  .ka-mobile-bar .ka-btn--wa:hover { background: var(--c-charcoal); color: var(--c-paper); }
  .ka-mobile-bar .ka-btn--wa:active { background: var(--c-charcoal-2); }
  .ka-mobile-bar .ka-wa-glyph { display: block; width: 18px; height: 18px; flex: 0 0 auto; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linejoin: round; }
  .ka-mobile-bar .ka-btn--bag {
    flex: 0 0 auto; min-width: 104px; background: transparent; color: var(--c-charcoal); border: 1px solid var(--c-charcoal); cursor: pointer;
  }
  .ka-mobile-bar .ka-btn--bag[aria-disabled="true"],
  .ka-mobile-bar .ka-btn--bag[aria-disabled="true"]:hover { background: transparent; color: var(--c-charcoal); border-color: var(--c-charcoal); cursor: pointer; }
  .ka-mobile-bar .ka-btn--bag:not([aria-disabled="true"]),
  .ka-mobile-bar .ka-btn--bag:not([aria-disabled="true"]):hover { background: var(--c-rosegold); border-color: var(--c-rosegold); color: #fff; }
  body { padding-bottom: calc(84px + env(safe-area-inset-bottom)); }

  /* toast clears the bar */
  body.template-product .ka-toast { bottom: calc(96px + env(safe-area-inset-bottom)); min-width: 0; width: calc(100vw - 28px); }
}

/* narrow phones (<=380px): keep the lead-time line on one row so the strip still clears the bar */
@media (max-width: 380px) {
  .ka-p-made { font-size: 0.92rem; }
  .ka-p-title { font-size: 1.4rem; }
}

/* tablet portrait (601-900px): same stack, gallery capped so it never swallows the screen */
@media (min-width: 601px) and (max-width: 900px) {
  .ka-stage,
  .ka-stage--native-ratio { height: min(133.33vw, 78vh); height: min(133.33vw, 78svh); }
}

```
Layout constants that are coupled: header 79px (`--ka-hdr`, utility bar 30 + nav 49 after slimming), title/price/lead strip about 128px, bar 78px. They appear in the stage `height: clamp(...)` and the product padding-top. **If the header height changes (for example the header-by-silhouette work), re-measure and update `79px` in both places.** How to measure: at 390x660 the lead-time line's bottom edge must be at least 4px above the bar's top edge.

No new design tokens. All colours, fonts and the easing come from `ka-base.css`.

### 4.4 JS (`assets/ka-product.js`), patch
```diff
--- a/assets/ka-product.js	2026-10-21 20:18:50
+++ b/assets/ka-product.js	2026-10-21 20:18:50
@@ -23,6 +23,24 @@
     });
   });
 
+  /* ---------- mobile swipe gallery (<=900px): dots follow the scroll position ----------
+     CSS scroll-snap does the swiping; this only mirrors the position into the dots. */
+  var swipe = document.getElementById('ka-swipe');
+  var dots = Array.prototype.slice.call(document.querySelectorAll('#ka-dots i'));
+  if (swipe && dots.length) {
+    var swipeTick = false;
+    swipe.addEventListener('scroll', function () {
+      if (swipeTick) return;
+      swipeTick = true;
+      window.requestAnimationFrame(function () {
+        swipeTick = false;
+        var i = Math.round(swipe.scrollLeft / (swipe.clientWidth || 1));
+        i = Math.max(0, Math.min(dots.length - 1, i));
+        dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
+      });
+    }, { passive: true });
+  }
+
   /* ---------- size selection + made-to-measure reveal ---------- */
   var sizes = Array.prototype.slice.call(document.querySelectorAll('.ka-size'));
   var bespoke = document.getElementById('ka-bespoke');
@@ -43,11 +61,15 @@
   var sizeHint = document.getElementById('ka-size-hint');
   var bagButtons = Array.prototype.slice.call(document.querySelectorAll('[data-ka-add-to-bag]'));
 
+  /* Mobile bar secondary button: reads "Select size" (data-label-idle) until a size or
+     Made to my measurements is chosen, then "Add to Bag". Every other Add to Bag button has
+     no data-label-idle and always reads "Add to Bag". */
   function refreshBagButtons() {
     var ready = !!selectedVariantId || isBespokeSelected;
     bagButtons.forEach(function (btn) {
       if (ready) { btn.removeAttribute('aria-disabled'); }
       else { btn.setAttribute('aria-disabled', 'true'); }
+      btn.textContent = (!ready && btn.getAttribute('data-label-idle')) || 'Add to Bag';
     });
   }
 
@@ -57,7 +79,7 @@
       sizes.forEach(function (x) { x.classList.remove('sel'); });
       if (bespoke) bespoke.classList.remove('sel');
       s.classList.add('sel');
-      if (mtm) mtm.classList.remove('open');
+      if (mtm) { mtm.classList.remove('open'); syncMtmToggle(); }
       selectedSizeLabel = s.textContent.trim();
       selectedVariantId = s.getAttribute('data-variant-id') || null;
       isBespokeSelected = false;
@@ -66,24 +88,44 @@
     });
   });
 
-  if (bespoke) {
-    bespoke.addEventListener('click', function () {
-      sizes.forEach(function (x) { x.classList.remove('sel'); });
-      bespoke.classList.add('sel');
-      if (mtm) mtm.classList.add('open');
-      selectedSizeLabel = 'Made to my measurements';
-      /* Read the variant ID baked into the button by Liquid.
-         · Real MTM variant: data-variant-id set, no data-mtm-fallback → plain cart add.
-         · Fallback: data-mtm-fallback="true" → cart add with "Size: Made to my
-           measurements" line-item property so the order reads correctly. */
-      selectedVariantId = bespoke.getAttribute('data-variant-id') || null;
-      isBespokeFallback = bespoke.getAttribute('data-mtm-fallback') === 'true';
-      isBespokeSelected = true;
-      if (sizeHint) sizeHint.classList.remove('show');
-      refreshBagButtons();
+  /* selectBespoke(): shared by the click handler and the made-to-measure-first
+     pre-selection (data-preselect="true", set by Liquid on high-ticket pages). */
+  function selectBespoke(openExplainer) {
+    sizes.forEach(function (x) { x.classList.remove('sel'); });
+    bespoke.classList.add('sel');
+    if (mtm && openExplainer) { mtm.classList.add('open'); syncMtmToggle(); }
+    selectedSizeLabel = 'Made to my measurements';
+    /* Read the variant ID baked into the button by Liquid.
+       · Real MTM variant: data-variant-id set, no data-mtm-fallback → plain cart add.
+       · Fallback: data-mtm-fallback="true" → cart add with "Size: Made to my
+         measurements" line-item property so the order reads correctly. */
+    selectedVariantId = bespoke.getAttribute('data-variant-id') || null;
+    isBespokeFallback = bespoke.getAttribute('data-mtm-fallback') === 'true';
+    isBespokeSelected = true;
+    if (sizeHint) sizeHint.classList.remove('show');
+    refreshBagButtons();
+  }
+
+  /* "How it works" disclosure (mobile, under the Made to my measurements card). */
+  var mtmToggle = document.getElementById('ka-mtm-toggle');
+  function syncMtmToggle() {
+    if (mtmToggle && mtm) mtmToggle.setAttribute('aria-expanded', mtm.classList.contains('open') ? 'true' : 'false');
+  }
+  if (mtmToggle && mtm) {
+    mtmToggle.addEventListener('click', function () {
+      mtm.classList.toggle('open');
+      syncMtmToggle();
     });
   }
 
+  if (bespoke) {
+    bespoke.addEventListener('click', function () { selectBespoke(true); });
+    /* Made-to-measure-first pages: the option is the default. Selected quietly (explainer stays
+       closed, "How it works" opens it) and the order is still only placed by tapping Add to Bag. */
+    /* Phones only (<=900px): desktop keeps today's behaviour (nothing pre-selected). */
+    if (bespoke.getAttribute('data-preselect') === 'true' && window.matchMedia && window.matchMedia('(max-width: 900px)').matches) { selectBespoke(false); }
+  }
+
   /* "Book an Appointment" → TEMPORARY: routes to the same WhatsApp
      concierge destination as the Concierge button until a real
      appointment-booking flow/calendar exists. Flagged in
@@ -162,7 +204,6 @@
         }
       })
       .finally(function () {
-        bagButtons.forEach(function (btn) { btn.textContent = 'Add to Bag'; });
         refreshBagButtons();
       });
   }
```
Behaviour notes: dots follow `scrollLeft` with a passive scroll listener throttled by `requestAnimationFrame`; swiping uses native CSS scroll-snap (`scroll-snap-stop: always`), so there is no custom touch code. Bag-button labels are now set in one place (`refreshBagButtons`) so "Adding..." can never leave the bar reading the wrong word. The desktop thumbnail, lightbox, minibar, accordion and wishlist code is untouched.

### 4.5 Liquid patch (full)
```diff
--- a/sections/ka-product-main.liquid	2026-10-21 20:18:50
+++ b/sections/ka-product-main.liquid	2026-10-21 20:18:50
@@ -33,6 +33,24 @@
   assign wa_appt_text_enc = wa_appt_text | url_encode
   assign wa_appt = 'https://wa.me/' | append: wa | append: '?text=' | append: wa_appt_text_enc
 
+  # Made-to-measure-first layout (Docs/product-page-mobile-build-spec-2026-10-21.md, decision 3).
+  # ON when the product's price is at/above the section setting "mtm_first_from" (INR, default
+  # 50000 = the highest price that has ever converted online was Rs 48,000), unless the optional
+  # product metafield custom.mtm_first says "yes" (force on) or "no" (force off). Plain if/elsif,
+  # no filters inside any case block (known silent-drop pattern).
+  assign mtm_first = false
+  assign mtm_override = product.metafields.custom.mtm_first | append: '' | downcase
+  assign mtm_from_paise = section.settings.mtm_first_from | default: 50000 | times: 100
+  if mtm_override == 'yes'
+    assign mtm_first = true
+  elsif mtm_override == 'no'
+    assign mtm_first = false
+  elsif product.price >= mtm_from_paise
+    assign mtm_first = true
+  endif
+  assign back_url = product.collections.first.url | default: routes.all_products_collection_url
+  assign back_label = product.collections.first.title | default: 'All Products'
+
   # Detect the Size option (case-insensitive) for variant-driven selection
   assign size_option = null
   for opt in product.options_with_values
@@ -109,7 +127,7 @@
 }
 </script>
 
-<section class="ka-product" id="ka-product">
+<section class="ka-product{% if mtm_first %} ka-product--mtm{% endif %}" id="ka-product">
 
   <!-- ── Gallery: sticky thumbnail rail + stage ── -->
   <div class="ka-media" id="ka-media">
@@ -119,6 +137,33 @@
       id="ka-stage"
       {% if first_image %}style="background-image:url('{{ first_image | image_url: width: 1400 }}'); --ratio: {{ first_image.aspect_ratio }};"{% endif %}
     >
+      {%- comment -%}
+        MOBILE ONLY (<=900px): native swipe gallery replaces the thumbnail strip. On desktop this
+        whole block is display:none and the stage/thumbs behave exactly as before. Slides use an
+        absolutely-positioned <img> (no aspect-ratio on flex items: Safari collapse bug).
+      {%- endcomment -%}
+      {%- if product.images.size > 0 -%}
+      <div class="ka-swipe" id="ka-swipe" tabindex="0" aria-label="{{ product.title | escape }} photographs">
+        {%- for image in product.images -%}
+          <div class="ka-swipe__slide">
+            <img
+              src="{{ image | image_url: width: 900 }}"
+              srcset="{{ image | image_url: width: 600 }} 600w, {{ image | image_url: width: 900 }} 900w, {{ image | image_url: width: 1200 }} 1200w"
+              sizes="100vw"
+              width="{{ image.width }}" height="{{ image.height }}"
+              alt="{{ image.alt | default: product.title | escape }}"
+              {% if forloop.first %}fetchpriority="high"{% else %}loading="lazy"{% endif %}
+              draggable="false">
+          </div>
+        {%- endfor -%}
+      </div>
+      {%- if product.images.size > 1 -%}
+        <div class="ka-dots" id="ka-dots" aria-hidden="true">
+          {%- for image in product.images -%}<i{% if forloop.first %} class="on"{% endif %}></i>{%- endfor -%}
+        </div>
+      {%- endif -%}
+      {%- endif -%}
+      <a class="ka-back" href="{{ back_url }}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>{{ back_label }}</span></a>
       <span class="ka-stage__idx" id="ka-stage-idx">01 / {% if product.images.size > 0 %}{{ product.images.size | prepend: '0' | slice: -2, 2 }}{% else %}01{% endif %}</span>
       <span class="ka-stage__zoom" aria-hidden="true">&#10530; Zoom</span>
       {%- comment -%}
@@ -204,8 +249,10 @@
       <div class="ka-p-made">Made to measure · Crafted to order in {{ lead_time }}</div>
 
       <!-- SIZE + BESPOKE (mapped to Shopify variant option) -->
+      {%- comment -%}.ka-buy groups the purchase controls so that on mobile the made-to-measure card can lead (CSS order) on high-ticket pieces. No visual change on desktop.{%- endcomment -%}
+      <div class="ka-buy{% if mtm_first %} ka-buy--mtm{% endif %}">
       <div class="ka-opt-head">
-        <span class="ka-opt-label">Select Your Size</span>
+        <span class="ka-opt-label"><span class="ka-opt-label__d">Select Your Size</span>{% if mtm_first %}<span class="ka-opt-label__m">Or choose a standard size</span>{% endif %}</span>
         <button type="button" class="ka-btn-line" data-open-acc="size">Size &amp; Fit Guide</button>
       </div>
 
@@ -288,19 +335,23 @@
       {%- endfor -%}
       {%- if bespoke_variant -%}
         {%- comment -%}Real MTM variant — add to cart directly, no special properties needed.{%- endcomment -%}
-        <button class="ka-bespoke" id="ka-bespoke" type="button" data-variant-id="{{ bespoke_variant.id }}">
+        <button class="ka-bespoke" id="ka-bespoke" type="button" data-variant-id="{{ bespoke_variant.id }}"{% if mtm_first %} data-preselect="true"{% endif %}>
       {%- else -%}
         {%- comment -%}No dedicated MTM variant — use first available variant as fallback.
           ka-product.js will add "Size: Made to my measurements" as a line-item property
           so the order reads correctly for the style advisor.{%- endcomment -%}
         <button class="ka-bespoke" id="ka-bespoke" type="button"
           data-variant-id="{{ product.selected_or_first_available_variant.id }}"
-          data-mtm-fallback="true">
+          data-mtm-fallback="true"{% if mtm_first %} data-preselect="true"{% endif %}>
       {%- endif -%}
         <span class="ka-bespoke__dot" aria-hidden="true"></span>
-        <span class="ka-bespoke__k">Made to my measurements</span>
+        <span class="ka-bespoke__txt">
+          <span class="ka-bespoke__k">Made to my measurements</span>
+          <span class="ka-bespoke__n">Your advisor will call within 24 hours of your order.</span>
+        </span>
         <span class="ka-bespoke__s">Recommended</span>
       </button>
+      <button type="button" class="ka-mtm-toggle" id="ka-mtm-toggle" aria-expanded="false" aria-controls="ka-mtm">How it works</button>
 
       <!-- MADE-TO-MEASURE reveal -->
       <div class="ka-mtm" id="ka-mtm">
@@ -346,6 +397,10 @@
         <p class="ka-size-required-hint" id="ka-size-hint">Please select a size, or choose Made to my measurements.</p>
         <a class="ka-btn ka-btn--ghost" id="ka-cta-appt" href="{{ wa_appt }}" target="_blank" rel="noopener" data-ka-enquiry="appointment" data-ka-placement="pdp-appointment" data-ka-product="{{ product.handle }}">Book an Appointment</a>
       </div>
+
+      {%- comment -%}MOBILE ONLY inline enquiry line (hidden on desktop). Real anchor, product pre-filled, tracked like every other enquiry link (assets/ka-theme.js reads data-ka-enquiry).{%- endcomment -%}
+      <p class="ka-talk">Prefer to talk? <a href="{{ wa_enquire }}" target="_blank" rel="noopener" data-ka-enquiry="whatsapp" data-ka-placement="pdp-inline-whatsapp" data-ka-product="{{ product.handle }}">Message our advisor on WhatsApp</a></p>
+      </div><!-- /.ka-buy -->
 
       <!-- Toast: shared component, CSS in ka-base.css, JS in ka-theme.js (window.kaShowToast) -->
       <div class="ka-toast" id="kaToast" role="status" aria-live="polite">
@@ -439,14 +494,18 @@
   </div>
 </div>
 
-<!-- ── Mobile sticky action bar ── -->
-<!-- "Appointment" + "Add to Bag" per Round 2; Concierge is kept as a
-     secondary WhatsApp-questions affordance, not the primary buy path
-     (CLAUDE.md: buy path stays clear/simple/primary; WhatsApp secondary). -->
-<div class="ka-mobile-bar">
-  <a class="ka-btn ka-btn--ghost" href="{{ wa_appt }}" target="_blank" rel="noopener" data-ka-enquiry="appointment" data-ka-placement="pdp-mobilebar-appointment" data-ka-product="{{ product.handle }}">Appointment</a>
-  <a class="ka-btn ka-btn--concierge" href="{{ wa_enquire }}" target="_blank" rel="noopener" data-ka-enquiry="whatsapp" data-ka-placement="pdp-mobilebar-concierge" data-ka-product="{{ product.handle }}"><span class="dot"></span>Concierge</a>
-  <button type="button" class="ka-btn ka-btn--bag" id="ka-mobilebar-bag" data-ka-add-to-bag aria-disabled="true">Add to Bag</button>
+<!-- ── Mobile sticky action bar (<=900px) ──
+     Two buttons only. Primary: charcoal "Message us on WhatsApp" (real anchor, product pre-filled).
+     Secondary: "Select size" until a size / Made-to-measure is chosen, then "Add to Bag".
+     The secondary keeps aria-disabled="true" while idle (JS shows the size hint on tap) but is
+     styled as a normal outlined button, never greyed out. The separate "Appointment" button is
+     retired from the bar: appointment requests are made in the WhatsApp chat. -->
+<div class="ka-mobile-bar" role="group" aria-label="Order actions">
+  <a class="ka-btn ka-btn--wa" href="{{ wa_enquire }}" target="_blank" rel="noopener" data-ka-enquiry="whatsapp" data-ka-placement="pdp-mobilebar-whatsapp" data-ka-product="{{ product.handle }}">
+    <svg class="ka-wa-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20z"/></svg>
+    <span>Message us on WhatsApp</span>
+  </a>
+  <button type="button" class="ka-btn ka-btn--bag" id="ka-mobilebar-bag" data-ka-add-to-bag data-label-idle="Select size" aria-disabled="true">Select size</button>
 </div>
 
 <!-- ── Lightbox (desktop/tablet only, disabled <900px via JS) ── -->
@@ -463,6 +522,7 @@
   "tag": "section",
   "settings": [
     { "type": "url",  "id": "appointment_url", "label": "Appointment booking URL (dormant — interim WhatsApp routing active)", "info": "Not currently used. \"Book an Appointment\" routes to WhatsApp until a real booking flow exists (Round 2, Docs/cta-architecture-revision.md). Kept here so a future booking flow has a ready setting to wire up." },
+    { "type": "number", "id": "mtm_first_from", "label": "Measure-first from (INR)", "default": 50000, "info": "Pieces at or above this price lead with Made to my measurements on phones. Override per product with metafield custom.mtm_first (yes/no)." },
     { "type": "text", "id": "default_lead_time", "label": "Default lead time", "default": "20–25 days", "info": "Used when a product has no custom.lead_time metafield." },
     {
       "type": "header",
```

## 5. Behaviour and responsive notes

- **>= 901px:** identical to today.
- **<= 900px:** everything in this spec. 601-900px (tablet portrait) gets the same stack with the gallery capped at 78vh so it never swallows the screen.
- **<= 380px:** title 1.4rem, lead time 0.92rem so the lead-time line stays on one row.
- **Motion:** dots scale/fade 0.35s on the house easing; toast as today; nothing else animates. No parallax, no autoplay, no pop-ups, no urgency copy, no discount language.
- **Sticky bar:** fixed bottom, `z-index: 95` (unchanged), `max(12px, env(safe-area-inset-bottom))` bottom padding, `backdrop-filter` with `-webkit-` prefix. The floating Concierge chip stays hidden on the product page on phones (existing rule).
- **"Select size" tap (nothing chosen):** scrolls the size grid to centre and reveals the hint directly under the grid (not under a hidden button).
- **Hidden-but-present on phones:** the in-page Add to Bag and Book an Appointment buttons stay in the DOM with `display:none` because `ka-product.js` still reads `#ka-cta-appt` for the made-to-measure WhatsApp fallback. Do not remove them.

## 6. Content needed
- No new photography or video. Real Mani photographs were used in the prototype (from the live product).
- Every product needs at least one image; alt text falls back to the product title. Image order is the product's media order.
- Copy: section 3. Nothing else.

## 7. Shopify-platform feasibility flags (one line each)
1. Per-product override needs a product metafield definition created in admin (optional; Liquid works without it).
2. `viewport-fit=cover` is deliberately **not** added (a sitewide `layout/theme.liquid` change with landscape-notch side effects). The `env(safe-area-inset-bottom)` padding is harmless without it and takes effect where the browser exposes the inset (standalone/in-app views). Confirm on a real iPhone.
3. `.ka-cta-stack{display:contents}` (so the hint can sit under the sizes) is supported by every iOS Safari since 11.1; QA on a real device anyway.
4. Phones now load one set of swipe `<img>` files (srcset). The desktop stage background image is overridden to `none !important` at <=900px and the thumbnail strip is `display:none`; confirm in the network panel that WebKit does not also download the thumbnail backgrounds (page weight).
5. Nothing here needs server code, apps or checkout changes.

## 8. Build complexity
**Moderate.** Three files, roughly 40 lines of Liquid, 190 of CSS (additive), 40 of JS. Risk is concentrated in the first-screen height constants and Safari behaviour, not in logic.

## 9. Measure (so the next review is evidence, not taste)
Using TD's `ka_enquiry_click` events: placements are now `pdp-mobilebar-whatsapp` and `pdp-inline-whatsapp` (the old `pdp-mobilebar-appointment` and `pdp-mobilebar-concierge` placements stop firing; tell SEO & Discoverability so dashboards do not read that as a drop). Compare, per 1,000 phone sessions on product pages: enquiry taps by placement, Add-to-Bag taps, checkouts started; split Instagram vs other; split pieces >= and < Rs 50,000. Judge enquiries plus orders together over at least 4 weeks per change.

## 10. QA checklist

**A. First screen (phone, fresh load, no scroll)** — check at 390x844, 390x660 (Instagram-style viewport), 375x667, 360x740:
- [ ] Photograph is full width; back chip top-left, heart top-right, dots bottom-centre; no thumbnail strip, no breadcrumb.
- [ ] Product name, price and "Made to measure · Crafted to order in ..." are all visible above the bar, nothing clipped by the bar (>= 4px clearance).
- [ ] Header is the slim version: utility bar + 49px nav, logo without the "Bridal Couture · Mumbai" sub-line. Currency chip still works.
- [ ] Swipe left/right moves one photo at a time, snaps, dots follow; vertical page scroll is not hijacked.

**B. Bar**
- [ ] Two buttons, WhatsApp label on one line at 390 (may wrap to two lines at 360, must not overflow). Both >= 54px tall.
- [ ] WhatsApp button opens `wa.me` with the product name and URL pre-filled; tracked as `pdp-mobilebar-whatsapp`.
- [ ] MTM-first page: secondary reads "Add to Bag" on load. Standard page: reads "Select size" (outlined, not greyed); tapping it scrolls to sizes and shows the hint under the grid; choosing a size turns it into "Add to Bag".
- [ ] Add to Bag with a size adds that variant; with the card adds as today (real variant or fallback + `Size` property); bag count and toast update; toast sits above the bar; after adding, the label returns correctly.

**C. Made to measure first (price >= Rs 50,000 or `custom.mtm_first = yes`)**
- [ ] Card first, selected; note line present; "How it works" opens and closes the explainer; choosing a size deselects the card and closes the explainer; choosing the card again re-selects.
- [ ] Label reads "Or choose a standard size". Inline WhatsApp line below the sizes, tracked as `pdp-inline-whatsapp`.
- [ ] Below the threshold (or `custom.mtm_first = no`): sizes first, card below, label "Select Your Size", nothing pre-selected.
- [ ] Changing the section setting changes which products flip (test with the setting at 0 and at 500000).

**D. Desktop unchanged (>= 901px, Chrome and Safari)**
- [ ] Gallery stage + thumbnails + zoom lightbox, minibar, size grid, bespoke card with "Recommended", Book an Appointment, accordion all exactly as before; no card pre-selected; no back chip, dots, swipe, inline line or "How it works" visible.
- [ ] Resize across 900/901px in both directions: no layout jump, no console errors.

**E. Real Safari / iOS (mandatory; QA so far has been Chrome-only)** — real iPhone, not a desktop emulator:
- [ ] Gallery height is not collapsed to 0 and the photo is not squashed (the aspect-ratio-on-childless-box Safari bug). The mobile stage uses explicit `height` and `aspect-ratio: auto`; slides use an absolutely positioned `<img>`.
- [ ] `100svh` works (iOS 15.4+); on older iOS the `100vh` fallback is used. First-screen clearance still holds when the Safari toolbar is expanded and when it collapses on scroll.
- [ ] Bar sits above the home indicator, is not covered by the Safari toolbar, and does not jump when the toolbar collapses. Tap targets are comfortable with a thumb.
- [ ] No sticky-hover: after tapping the WhatsApp button it stays charcoal (the `:hover` rule is pinned).
- [ ] Scroll-snap: swipe is smooth, no rubber-banding of the whole page sideways, no horizontal page scroll (`scrollWidth` equals viewport).
- [ ] `backdrop-filter` on the bar, back chip and heart renders (needs the `-webkit-` prefix, present).
- [ ] Fonts (Cormorant, Jost) loaded before the strip is measured: no visible jump of the title/price block after load.
- [ ] Check the page after the Client Diaries lesson: nothing in this change uses grid `aspect-ratio`, but confirm anyway.
- [ ] Rotate to landscape: page still usable (gallery capped by the 360px floor); no layout break.

**F. In-app browsers and Android**
- [ ] Instagram iOS, Instagram Android and Facebook in-app: first screen as in A at the real viewport; WhatsApp link opens the WhatsApp app (or the web chooser) rather than a blank tab; back chip works.
- [ ] Android Chrome: same checks as E where applicable; dynamic toolbar does not cover the bar.

**G. Accessibility and regressions**
- [ ] Tab/VoiceOver order unchanged; `.ka-swipe` is focusable and has an `aria-label`; "How it works" has `aria-expanded`; hidden in-page buttons are not focusable.
- [ ] Wishlist heart still works (single instance); lightbox still disabled <=900px.
- [ ] JSON-LD Product and BreadcrumbList unchanged (breadcrumb is hidden visually only).
- [ ] Theme schema validator passes; staging checksum verify says PASS; no file silently missing.

## 11. Open points for Suraj
1. "Call within 24 hours": can the team always call (overseas, time zones)? If not, soften to "be in touch".
2. Pre-selected card on pieces >= Rs 50,000: confirmed as the default? (Easy to remove.)
3. Threshold Rs 50,000: keep, raise or lower after 4 weeks of data.
4. Extend made-to-measure-first and the monochrome Google mark to desktop? (Recommended, separate approval; not built.)
5. Optional response-time promise beside the inline WhatsApp line: only if it can be kept daily.
