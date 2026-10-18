# Concierge Float / Footer Legal Row — Clearance Fix
**Date:** 25 September 2026  **Status:** approved by Suraj ("i agree with the concierge desktop fix. yes i want it"). Spec only; Technical Director builds it.
**Scope:** footer bottom spacing only. The float's look and position, the welcome popup, and mobile (≤ 600px) are not changed.

## 1. Cause (read from origin/staging)
- Float (`assets/ka-concierge-float.css`): `position:fixed; right:26px; bottom:26px; padding:15px 22px; border:1px; font-size:.66rem` (line-height 1.75 inherited from `body`). Height ≈ 2×15 + 2 + 1.75×10.56 ≈ **50.5px**, so its top edge sits **≈ 76.5px above the viewport bottom**.
- Footer (`assets/ka-footer.css`): `.ka-footer { padding: var(--s-2xl) var(--gutter) var(--s-lg) }` → **64px** bottom padding. QA's measurement puts the last legal link's bottom 69px above the page bottom. 69 < 76.5, so at the very bottom of the page the float covers the lowest ~7px of the link.
- Not width-specific: the float is always `right:26px` and the legal row always ends at `100% − gutter` (gutter 20–80px), so they overlap horizontally at every width from 601px up (1920, 1440, 1024, 768). At ≤ 600px the float is smaller and nearer the edge (bottom 16px, ≈ 45px tall → top ≈ 61px) and clears the 64px padding, which matches QA's finding at 390px.

## 2. Fix
Reserve space equal to *float bottom offset + float height + 24px* beneath the footer content, defined once next to the float's own values.

**`assets/ka-concierge-float.css`** — add tokens and have the float read them (rendered values are identical to today):
```css
:root {
  --ka-float-bottom: 26px;
  --ka-float-pad-y: 15px;
  /* 2 x vertical padding + 2px border + one line (.66rem x body line-height 1.75) */
  --ka-float-h: calc(2 * var(--ka-float-pad-y) + 2px + 1.75 * 0.66rem);
  /* space the footer must keep clear at the bottom of the page: float offset + float height + 24px breathing */
  --ka-float-reserve: calc(var(--ka-float-bottom) + var(--ka-float-h) + 24px);   /* ≈ 100.5px */
}
.ka-concierge-float {
  bottom: var(--ka-float-bottom);          /* was 26px */
  padding: var(--ka-float-pad-y) 22px;     /* was 15px 22px */
  /* everything else unchanged */
}
/* the existing @media (max-width:600px) block is left exactly as it is */
```

**`assets/ka-footer.css`** — add after the base `.ka-footer` rule (or after the bottom-bar rules):
```css
/* Keep the legal row clear of the floating Concierge chip when scrolled to the very bottom.
   Docs/concierge-footer-clearance-spec.md. Not needed <=600px (smaller, nearer-the-edge float already clears 64px). */
@media (min-width: 601px) {
  .ka-footer { padding-bottom: max(var(--s-lg), var(--ka-float-reserve, 100px)); }
}
/* Product pages hide the float below 900px (mobile action bar), so no extra room there. */
@media (max-width: 900px) {
  .template-product .ka-footer { padding-bottom: var(--s-lg); }
}
```
Result: footer bottom padding goes **64px → ≈ 100.5px** (+≈ 36.5px of charcoal at the very end of the page) at ≥ 601px; unchanged at ≤ 600px. Nothing changes at any other scroll position (a fixed element is only ever an issue at the end of the page).

## 3. Why these numbers
- **Float top offset (26 + 50.5 = 76.5px)** is the minimum for the link to be uncovered; **+24px** breathing room (about the float's own 26px edge inset) so the link visibly stands clear, not merely un-overlapped.
- **Sized from the float's own variables**, so a future change to the float's padding or offset updates the reserve automatically. `max(var(--s-lg), …)` guarantees the padding is never less than today's 64px. The `100px` fallback in the footer rule covers the (unlikely) case that the float stylesheet is absent.
- **Footer padding, not the bottom bar**, because the reserve is measured from the page bottom; the visual result is the same, and it needs no change to `ka-footer.liquid`.
- One breakpoint (`601px`) matches the float's existing `600px` break. Tablet (768/1024) and desktop (1440/1920) all get the same value because the overlap is identical at all of them.
- Known coupling (commented in the CSS): the `1.75` in `--ka-float-h` is the body line-height. If the float's font-size or `body` line-height changes, update it there.

## 4. How to verify (repeatable, any browser)
At each of **1920, 1440, 1024, 768** (viewport height ≈ 900) and **390**, open any page with the footer (home, a collection, a policy page, a product page), then in the console:
```js
window.scrollTo(0, document.documentElement.scrollHeight);
setTimeout(() => {
  const links = [...document.querySelectorAll('.ka-footer__legal a')].map(a => a.getBoundingClientRect());
  const f = document.querySelector('.ka-concierge-float').getBoundingClientRect();
  const lowest = Math.max(...links.map(r => r.bottom));
  console.log({ gapPx: Math.round(f.top - lowest),
                footerPaddingBottom: getComputedStyle(document.querySelector('.ka-footer')).paddingBottom,
                floatH: Math.round(f.height), floatBottomOffset: Math.round(innerHeight - f.bottom) });
}, 600);
```
**Pass:** at 1920 / 1440 / 1024 / 768: `gapPx ≥ 24` (expect ≈ 27–30) and `footerPaddingBottom ≈ "100.5px"`; `floatH ≈ 50`, `floatBottomOffset = 26`. At 390: `footerPaddingBottom = "64px"` and `gapPx` positive and unchanged from before. Product page at 768: `footerPaddingBottom = "64px"` (float hidden). Before the fix the same script at 1440×900 gives `gapPx ≈ −7` (QA's overlap). Also eyeball: footer, float and popup look and behave exactly as before at every other scroll position; only ≈ 36px more charcoal below the legal row at the very bottom.
