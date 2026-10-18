# Product Page Main Image — Structural Crop Fix (spec)

Pending-tasks #27, approved by Suraj 2026-09-07. Fixes a severe, live, catalog-wide
bug in `.ka-stage` (the main product image on the PDP): a fixed `min-height`
with no width constraint or `aspect-ratio`, so the crop gets progressively worse
as the browser gets wider, cutting heads off at normal desktop widths. Creative
Director sign-off only — Technical Director implements directly from this note,
no further design judgment calls needed.

**Scope:** `.ka-stage` sizing only (`sections/ka-product-main.liquid`,
`assets/ka-product-main.css`). Everything else on the product page — the
`.ka-thumbs` rail, `.ka-media`/`.ka-product` grid tracks, the lightbox, the
minibar, the info panel — is confirmed clean and explicitly out of scope (see
"What does NOT change" below).

---

## 1. The current system (read in full before changing anything)

`.ka-product` is the outer grid: `max-width: var(--max-wide)` (1680px),
`grid-template-columns: 1.18fr 1fr`, `gap: 60px`, centered with
`padding: 26px var(--gutter) 0` where `--gutter: clamp(20px, 5vw, 80px)`.
At `max-width: 1100px` this narrows to `1.1fr 1fr` / `gap: 40px`. At
`max-width: 900px` the whole thing collapses to `display: block` — a single
stacked column, full content width.

Inside the left grid track, `.ka-media` is a second, nested grid:
`grid-template-columns: 86px 1fr; gap: 16px`, `position: sticky; top: 104px`.
The `86px` column is `.ka-thumbs` (fixed-width thumbnail rail); the `1fr`
column is `.ka-stage` (the hero image). At `≤900px`, `.ka-media` also becomes
`display: block` and `.ka-thumbs` reflows to a horizontal scroll strip above
the stage (both stacked full-width, in document order — thumbs, then stage;
see pending-tasks #14 for why the *markup* order is stage-then-thumbs with
CSS reordering, unrelated to this fix).

**The bug:** `.ka-stage` has never had a width-linked height rule. Its size is:

```css
.ka-stage { position: relative; overflow: hidden; min-height: 640px; background-size: cover; background-position: center; }
/* @media (max-width: 900px) */
.ka-stage { cursor: default; min-height: 480px; }
```

Width is whatever the grid track gives it (fluid, grows with viewport, capped
only by `--max-wide`). Height is pinned at a flat `640px` (`480px` under
900px) regardless of width. Because the image is a CSS `background-image`
with `background-size: cover`, the box's *own* aspect ratio — not the source
photo's — decides what gets cropped. A fixed height + growing width means the
box gets progressively more landscape-shaped as the viewport widens, forcing
`cover` to crop more and more off the top/bottom of a portrait source photo.
That is the entire bug, in one sentence: **the box's shape was never tied to
the photography's shape.**

Confirmed independently (own grid-math walkthrough, not just trusting the
pending-tasks writeup): at a typical ≥1680px-content desktop, the two-column
grid gives `.ka-stage` a width of ~688px against a fixed 640px height — a box
only slightly taller than wide, holding a photo that is (see §2) 30–45%
*taller* than wide. Cover-crop under that mismatch removes roughly the top
quarter to third of the frame, which is exactly where a bridal portrait's
head sits. At the `≤900px` stacked breakpoint, content width jumps to
~690–810px against the same fixed 480px height — an even more landscape box
(ratio up to ~1.7:1), cropping hard on the *sides* instead. Both directions
of the reported bug trace to the same root cause.

## 2. Verifying the real photography ratio (done directly, not taken on trust)

The brief handed to this investigation cited "2100×2850px, ratio 0.7368,
~14:19" as the confirmed source ratio for all real product photography.
**That figure is real, but it is not the whole picture** — pulling it apart
mattered enough to change the recommendation below, so it's worth walking
through in full.

**What was actually checked:** live product data pulled directly from the
store's Shopify Admin API (not local repo assets, which turned out to be
unrelated design-phase placeholders at 800×1200/0.667 and 900×1200/0.75 —
prototype stand-ins, not real catalog photography, correctly excluded). Two
distinct populations of real, live, `status: ACTIVE` product images exist on
this store:

**Population A — legacy 2023 catalog** (`KA0001`–`KA0008` SKUs, ₹30,000–
65,000, PNG files, e.g. `.../files/50.png`). Sampled all 8: every single one
is **exactly 2100×2850px, ratio 0.7368**. This is where the "14:19" figure
came from — it's accurate, but only describes this one, older, lower-priced
batch of products.

**Population B — current catalog** (`KAFL0xx` SKUs, created 2026-07-23/25,
₹170,000–480,000 — the price band that actually matches CLAUDE.md's stated
brand positioning, and clearly the deliberate, current photography set for
this rebuild). Sampled 20 "front" hero shots (one per product, spanning
20 different products) plus 3 additional angles (closeup/side/back) on one
product to check within-product consistency too. **These are NOT a fixed
ratio.** Real, measured values:

| Ratio (w/h) | Count of samples in that band |
|---|---|
| 0.68 – 0.72 | 3 |
| 0.73 – 0.78 | 6 |
| 0.78 – 0.82 | 7 |
| 0.82 – 0.92 | 4 |

Full range: **0.6875 to 0.9158** — a ~33% spread. Mean 0.790, median 0.790.
Even within one product (the "Champagne Peach" corset-with-lehenga), the
front/closeup/side/back shots measured 0.748 / 0.788 / 0.745 / 0.725 — not
identical either, though tighter than the cross-catalog spread.

**Conclusion this changes:** the premise that a single `aspect-ratio` value
can make the box "always match the source image, eliminating crop entirely"
does not hold for the real, current catalog — only for the smaller, older,
lower-priced legacy batch. With genuine ratio variance from 0.69 to 0.92
across live current-catalog photography, **no fixed box ratio removes all
cropping; the achievable goal is choosing the ratio that minimizes crop
severity across the real spread and matches how this exact problem is
already solved elsewhere on this site** — not "zero crop," which was never
actually achievable once the real variance is accounted for. `.ka-stage`
already uses `background-size: cover`, so *some* edge-trimming on
off-median photos is normal, expected, and already how every other
image box on this site behaves (see §3) — the goal is to fix the
*severe, systematic, viewport-driven* crop, not to chase a mathematically
impossible zero-crop guarantee.

## 3. How this site already solves this exact problem elsewhere

Grepped every `aspect-ratio` declaration across `assets/`. The pattern is
already extremely consistent, and one instance is directly load-bearing for
this decision:

- `assets/ka-bestsellers.css`, `ka-collection-grid.css`,
  `ka-cart-cross-link.css`, `ka-cart-items.css` (`.ka-item__img`),
  `ka-product-related.css`, `ka-diary-grid.css`, `ka-search.css` — **all use
  `aspect-ratio: 3/4`** for real garment/model photography in a portrait
  card. This is the house standard for "real fashion photography in a
  portrait box," used at least seven times across collection grids, cart
  items, related-product cards, Client Diaries cards, and search results.
- `assets/ka-product-desc.css` line 137 — **the product page's own
  description-gallery module**, `.ka-desc-gallery__item img`, already uses
  `aspect-ratio: 3/4; object-fit: cover;` for the *same real product
  photography*, on the *same template*, just further down the same page as
  `.ka-stage`. This is the strongest single piece of evidence: this exact
  page has already made this exact call, for this exact photography, and it
  works today with zero reported complaints.
- A few outliers exist for *different* content types, each deliberately
  distinct: `ka-journal-card.css` uses `4/3` (landscape editorial images,
  different content), `ka-collections-directory.css`/`ka-collections-list.css`
  use `2/3` (collection cover art, taller/more dramatic framing is
  intentional for those), `ka-cart-items.css`'s empty-cart illustration and
  `ka-product-styling.css` use `4/5`. None of these are real per-product
  garment photography in a primary product-viewing context — `3/4` is
  specifically the ratio this codebase reaches for whenever the content is
  "a real photo of a real garment," which is exactly what `.ka-stage` shows.

`3/4` (0.75) also sits almost exactly at the real catalog's measured median
(0.790) and mean (0.790) — closer to true center-of-distribution than the
legacy-only `14/19` (0.7368) figure, and it's a small, clean, sitewide-
consistent number rather than a one-off decimal invented for this single
box.

## 4. Decision

**Give `.ka-stage` `aspect-ratio: 3 / 4`, matching the sitewide house
standard and this exact page's own description-gallery module, with a
viewport-height-based `max-height` safety clamp and (mobile only) a
`min-height` floor. Remove the flat `min-height: 640px` / `480px` rules
entirely.**

Rejected alternatives:

- **`aspect-ratio: 14/19` (the legacy-catalog-exact figure).** Rejected —
  §2 shows this describes only 8 older, lower-priced products, not the
  current ₹170k–480k catalog this brand is actually selling today. Using it
  would optimize for the wrong photography set.
- **A bespoke ratio computed from the current catalog's mean/median
  (~0.79, i.e. close to but not exactly 4/5).** Rejected in favor of the
  cleaner, already-established `3/4` — §3's finding that `3/4` is already
  this exact template's own choice for the same photography, one section
  down the page, is a stronger reason to converge on `3/4` than a marginal
  ~0.01 improvement in fit to the sample mean. Two different ratios for the
  same photography on the same page would look like an inconsistency, not a
  deliberate choice.
- **No `aspect-ratio`, keep tuning `min-height` per breakpoint.** Rejected —
  this is the actual bug. Height must be derived from width via a real
  ratio, not set independently of it, or the same class of bug reappears at
  the next breakpoint someone doesn't think to re-tune.

### Why this isn't "zero crop" and why that's fine

`background-size: cover` on `.ka-stage` was never touched by this fix and
stays exactly as-is. A `3/4` box will still lightly crop the tallest photos
(ratio ~0.69, e.g. the "Barbie Pink" corset) a bit tighter, and lightly
crop the sides of the boxiest photos (ratio ~0.92, e.g. "White Stone
Crystal") — but this is the same, small, expected `cover`-crop tolerance
every other image box on this site already lives with, not the severe,
viewport-driven, unbounded crop this fix removes. The difference in degree
is the entire point: today's bug can crop off an entire head; a `3/4` box
against real 0.69–0.92 photography crops, at most, a modest margin off one
edge, at every viewport width, consistently — never worsening as the window
resizes.

## 5. Exact values for Technical Director

**Base rule** (desktop, applies at every width down to the `900px`
breakpoint — i.e. covers both the `>1100px` and `900–1100px` grid states,
neither of which need their own stage-sizing override):

```css
.ka-stage {
  position: relative; overflow: hidden;
  aspect-ratio: 3 / 4;
  max-height: 90vh;
  background-size: cover; background-position: center;
  cursor: zoom-in;
  filter: sepia(0.10) saturate(0.90) brightness(0.94);
}
```

— i.e. **delete** the existing `min-height: 640px;` and **add**
`aspect-ratio: 3 / 4; max-height: 90vh;` in its place. Everything else on
that rule (`position`, `overflow`, `background-size`, `background-position`,
`cursor`, `filter`) stays untouched.

`max-height: 90vh` is a safety net, not something that should visibly
engage in normal desktop use — worked example: at the widest content the
grid ever produces (viewport ≥ ~1840px, where `--max-wide: 1680px` caps
further growth), `.ka-stage` computes to ~688px wide → ~917px tall under
`3/4`, which is below `90vh` on any monitor taller than ~1019px. It only
starts to matter on unusually short desktop browser windows (e.g. a
1900×650 resized window), where without it the box would demand more
vertical space than the window has to give.

**`≤900px` breakpoint** (stacked layout — this is the block currently
holding `min-height: 480px`):

```css
@media (max-width: 900px) {
  .ka-stage {
    cursor: default;
    max-height: 80vh;
    min-height: 380px;
  }
  /* aspect-ratio: 3/4 is inherited from the base rule above — do not repeat it */
}
```

— i.e. **delete** `min-height: 480px;` and **add**
`max-height: 80vh; min-height: 380px;` in its place. `cursor: default` and
everything else in that block (the zoom-icon hide, thumbnail-row reflow,
wishlist-heart resize) is unrelated and stays exactly as-is.

Why `80vh` here specifically, tighter than desktop's `90vh`: at this
breakpoint, `.ka-stage` can reach a much larger fraction of content width
relative to its context (full-width stacked block, not a constrained grid
track) — at a 900px-wide viewport, content width is ~810px, which under a
pure `3/4` ratio wants a ~1080px-tall box. On a genuine portrait phone
that's fine (viewport height comfortably exceeds it), but on a landscape
tablet or a squarish/short browser window at that width, 1080px can
meaningfully exceed the visible viewport height. `80vh` keeps the box from
ever demanding more than 80% of whatever vertical space is actually there,
at the cost of a slightly wider-than-`3/4` effective box (still
`background-size: cover`, so it just crops a touch more off the sides) only
in that specific short-viewport corner case.

Why `min-height: 380px` here specifically: it's a floor against `max-height`
being too aggressive on a pathologically short viewport (if a device's
`80vh` computes to something tiny, `min-height` wins the conflict per CSS's
own resolution order, so the box never becomes uncomfortably small). It's
set just below the height that `3/4` naturally produces at the narrowest
real phone content width sampled (~350px content width at a 390px-wide
iPhone → ~373px tall), so it should essentially never visibly engage — it
exists purely as an insurance floor, not as a value expected to be "hit" in
normal use.

No separate value is needed for the `≤600px` breakpoint — that rule only
touches `.ka-p-title` font-size today and has no reason to touch `.ka-stage`
under this fix (see §6).

## 6. Mobile — does it need the same fix, or is it fine as-is?

**It needs the same fix too — this is not desktop-only**, though the
*severity* is uneven across the `≤900px` bucket, and that unevenness is
worth stating precisely rather than hand-waving "mobile is fine":

- **True phones (~320–430px wide)** were, by coincidence, mostly spared in
  practice. Worked example at a 390px-wide iPhone: content width ≈ 350px
  against the old fixed `480px` height gives a box ratio of ~0.73 — already
  close to real portrait-photography ratios (0.69–0.92), so `cover` had
  relatively little to crop. The bug's *mechanism* (fixed height,
  independent of width) was still present and still wrong in principle, it
  just happened not to produce a visually severe result at these specific
  widths.
- **Tablets within the same `≤900px` bucket (~768–900px wide, e.g. iPad
  portrait at 768px, Surface/iPad Pro class devices)** were genuinely
  broken, in the same direction as the reported desktop bug. Worked example
  at 768px: content width ≈ 691px against the fixed `480px` height gives a
  box ratio of ~1.44 — a landscape-shaped box forced onto portrait
  photography, cropping hard off the sides. This is the same underlying
  defect as the desktop case, just triggered at a narrower absolute width
  because Shopify (and this stylesheet) buckets "mobile" as everything
  `≤900px`, which includes real tablets, not only phones.

So the accurate statement for the record: **the crop-severity problem was
real and live within part of the existing mobile bucket (tablet widths),
not only on desktop** — "worst on wide viewports" is true in the sense that
severity scales up continuously with width within each layout mode, but the
`≤900px` bucket's own wide end already exhibited the same class of bug
before this fix, just less dramatically than 1920px desktop. The fix in §5
(`aspect-ratio: 3/4` inherited into the mobile block, with the tighter
`80vh`/`380px` clamp pair) resolves this across the whole bucket uniformly,
rather than leaving the tablet-width end of "mobile" quietly broken.

## 7. `.ka-thumbs` — confirmed no change needed

TD's original investigation found the thumbnail rail clean (20 real images
checked, no cropping), and this investigation found no reason to revisit
that. `.ka-thumb` is a fixed `86×116px` box on desktop (`64×86px` at
`≤900px`), sized independently of `.ka-stage` and untouched by this fix.
Worth noting as a point of incidental confirmation, not a coincidence to
build on: `86/116 = 0.741` — the existing thumbnail box was already almost
exactly `3/4` (0.75) before this fix ever touched anything, which is a
small extra signal that `3/4` is the right ratio for this photography on
this page, not a new invention. **No CSS change to `ka-thumbs`/`ka-thumb`
in this fix.**

## 8. What does NOT change

- `.ka-product` and `.ka-media` grid templates, gaps, breakpoints — untouched.
  Width was never the broken part; only height-sizing logic on `.ka-stage`
  changes.
- `.ka-thumbs` / `.ka-thumb` — see §7.
- `background-size: cover`, `background-position: center`, the sepia/
  saturate/brightness filter, `cursor: zoom-in` — untouched.
- `.ka-stage__idx`, `.ka-stage__zoom`, `.ka-stage__wish` (absolute-positioned
  overlays) — anchored to the box's corners, unaffected by height changes,
  no changes needed.
- The lightbox (`.ka-lb__frame`, sized independently at `70vw`/`80vh`) — out
  of scope, unrelated sizing system.
- Markup in `sections/ka-product-main.liquid` — this is a pure CSS fix, no
  HTML/Liquid structure changes required in `.ka-stage`'s markup.

## 9. Build complexity

**Simple.** Two small CSS edits in `assets/ka-product-main.css`: replace one
declaration in the base `.ka-stage` rule, replace one declaration in the
existing `@media (max-width: 900px)` block. No markup changes, no new
classes, no JS changes, no schema changes. Straightforward to implement,
straightforward to QA visually against a spread of real product photos at
the ratio extremes identified in §2 (e.g. "Barbie Pink" corset at ~0.6875
and "White Stone Crystal" corset at ~0.9158 make good worst-case QA
samples, alongside a legacy-catalog 0.7368 product for the narrow end).

## 10. Suggested QA checklist for Technical Director / QA Reviewer

- Visual check at ≥5 viewport widths spanning the full range: ~390px (real
  phone), ~768px (tablet portrait, the previously-broken tablet band),
  ~1024px (small laptop), ~1440px (common desktop), ~1920px (the width
  Suraj's original report flagged as worst).
- Confirm no viewport width in that range crops a head/face out of frame on
  a real current-catalog product (sample at least the two ratio extremes
  named in §9, plus one mid-range product).
- Confirm the box never visibly "jumps" in shape at the `900px`/`1100px`
  breakpoints the way the old fixed-`min-height` version did.
- Confirm `.ka-thumbs` is visually unaffected (still 86×116 desktop /
  64×86 mobile, still positioned correctly relative to the now
  differently-sized `.ka-stage`).
