# Client Diaries Page — Build Specification
**Document version:** 1.0
**Date:** 6 July 2026
**Prototype source:** `Prototypes/client-diaries-v1.html`
**Route:** `/pages/client-diaries`
**Status:** Ready for Technical Director feasibility review — Phase 4 (owner review) not yet complete

---

## 0. Context and Relationship to Homepage Teaser

The homepage already carries a small "Client Diaries" teaser (`sections/ka-client-diaries.liquid`) — a 3-image grid + text CTA linking to this page via "Read the diaries". This document specifies the **full standalone destination page** that CTA links to. It is not a repeat of the teaser grid; it is a complete editorial lookbook experience with browsing, storytelling, and commerce woven in.

Naming/caption consistency: the homepage teaser uses placeholder captions "The Bloom Soirée Lehenga," "The Snow Veil Corset," "The Column Corset." This spec reuses "Bloom Soirée," "Snow Veil," and "Column Corset" as recurring garment names across diary stories so the homepage teaser and this page feel like one continuous world, not two disconnected placeholder sets.

All design tokens (color, type, spacing, motion) are transcribed verbatim from `Docs/homepage-build-spec.md` Section 1 and the live `:root` block in `Prototypes/homepage-v2.html`. No new tokens were required except one sticky z-index value, flagged below.

---

## 1. Audit Summary (Phase 1)

This page must do five things the homepage teaser cannot:
1. **Prove the brand through real people**, not products — the single strongest trust signal available to a made-to-order luxury house with no return policy safety net.
2. **Broaden who "belongs" on this page.** Brides are not the only customer — mothers, sisters, and festive-occasion shoppers (Rakhi, Karva Chauth, Diwali, Ganpati, sangeet/reception) are equally valuable and are explicitly represented, not treated as a bridal afterthought.
3. **Be browsable**, not just scrollable — a visitor looking for "something like what I need for Karva Chauth" should be able to filter to it.
4. **Stay commerce-connected.** Luxury houses (Dior "Le Défilé," Chanel runway/campaign pages, Sabyasachi's Instagram-led real-wedding features, Gaurav Gupta's editorial lookbooks) never let real-wedding content become a dead end — it always bridges back to acquiring the piece or booking a fitting. This page must do the same, tastefully.
5. **Never feel like a testimonial carousel or a UGC grid.** The bar is editorial magazine spread (Vogue "Real Weddings," Vogue India bridal diaries), not review-site social proof.

---

## 2. Redesign Concept (Phase 2)

**Emotional arc:** Cinematic hero (silence, one image, one bride) → a quiet intro statement widening the frame to "not every story begins at the altar" → a browse bar that invites active exploration → a sequence of full-bleed "spreads," each one a single real client's story (image, name, occasion, garment, quote, shop-the-look) → a denser mosaic interlude that shows breadth across many more occasions at once → a small commerce edit ("Shop the Diary") → a closing appointment invitation.

**Structural decision — "spreads," not "cards":** Each story gets a full-bleed, alternating-side editorial spread (image | text, then text | image), not a repeating card grid. This is the single biggest differentiator from the homepage teaser and from generic "customer stories" sections — it reads as a magazine feature, echoing Vogue "Real Weddings" and Sabyasachi's Instagram story format, not a testimonials widget.

**Occasion breadth is structural, not decorative:** Of five sample spreads built into the prototype, only two are bridal in the traditional sense — one is Ganpati, one is a mother-of-the-bride piece, one is a sangeet, one is a Karva Chauth return-client story. The browse bar's default filter is "All Stories," and "Bridal" is one of five equal filter chips, not the implicit default lens.

**Buy path stays reachable at three altitudes**, per standing principle (buy path must remain primary, never crowded):
- Micro: each spread has a quiet "Shop the [garment] edit" text-link CTA (`.btn-dark`) plus a secondary "Ask about this piece" WhatsApp link — buy-first, concierge-second, matching CLAUDE.md's standing order of priority.
- Meso: a dedicated "Shop the Diary" product-card section pulls the specific garments referenced in the stories above, styled identically to homepage Bestsellers cards for instant familiarity.
- Macro: closing CTA offers both "Book a Styling Appointment" and "Explore the Collections" with equal visual weight — commerce and concierge side by side, no artificial funneling toward WhatsApp only.

**Pacing follows the established light/dark rhythm** (per homepage-build-spec.md Section 9, Note 12): Hero (dark) → Intro (light) → Browse bar (light, sticky) → Spreads (alternating light paper-deep) → Mosaic (dark) → Shop the Diary (light) → Closing CTA (dark image) → Footer (dark). This is a deliberate continuation of the sitewide cadence, not a new rhythm.

---

## 3. Section-by-Section Breakdown

### Section A — Diary Hero
**Purpose:** Full-viewport cinematic open. Establishes the page is an editorial destination, not a listing page, before any UI chrome appears.
**Structure:** Full-bleed image, gradient overlay, eyebrow ("Real Clients · Real Occasions"), H1 "Client / Diaries" (Cormorant Garamond italic, `--t-hero`, "Diaries" rendered as the `<strong>` sub-line at 0.42em — a deliberately smaller ratio than the homepage's 0.6em split, since this H1 is two stacked nouns rather than a noun + authority-statement), subtitle naming multiple occasions explicitly (wedding, Karva Chauth, Ganpati, Rakhi) in the first screen the visitor sees, scroll indicator.
**Motion:** Identical to homepage hero — bg entry scale 1.05→1 over 2.2s `--ease-luxury`; eyebrow/H1/subtitle/scroll indicator staggered `fadeUp`/`fadeIn` at 0.6s/0.9s/1.3s/2.2s delays. No parallax on this page (parallax was flagged homepage-only in the original spec; omitted here to keep implementation simple — see Motion Tokens note below).
**Responsive:** `100svh` with `100vh` fallback, `min-height: 560px`. Text scales via existing clamp() tokens — no new breakpoint logic.

### Section B — Intro Statement
**Purpose:** A single breath after the hero, and the moment the page explicitly widens its scope beyond bridal ("Not every K&A story begins at the altar…"). Directly sets audience expectations before the browse bar appears.
**Structure:** Centered quote (Cormorant Garamond italic, `clamp(1.5rem, 3vw, 2.6rem)`), hairline rules before/after (identical `::before`/`::after` pattern to homepage Manifesto), attribution line.
**Motion:** `.reveal` / `.reveal.reveal-delay-2` — standard one-shot IntersectionObserver reveal.

### Section C — Browse Bar (occasion + garment filter)
**Purpose:** Makes the page actively browsable. Visitors can filter to the occasion relevant to them (Bridal / Festive / Mothers & Family / Reception & Sangeet) rather than scrolling through everything.
**Structure:** Sticky bar (`position: sticky; top: 84px`, sitting just below the fixed utility bar + nav stack), label + five filter chips reusing the **exact existing `.chip` component** from `collection-page-v1.html` (same visual states: rest, hover, `.is-active`) — this is a reused pattern with new filter values, not a new UI language.
**Motion/interaction:** Click toggles `.is-active` on the chip; filters both the Spreads section and the Mosaic section by a shared `data-occasion` attribute. Filtering in the prototype is instant show/hide (no animation) to keep it calm and non-jumpy; a future refinement could crossfade, but instant is the safer default for a filter bar the user may click repeatedly.
**Responsive:** Bar remains sticky on mobile at an adjusted `top` (78px, matching the mobile nav's shorter utility-bar height). Chips wrap to multiple rows rather than horizontally scrolling, to avoid an ambiguous "is there more?" scroll affordance on a page that already scrolls vertically.

### Section D — Diary Spreads (repeating, 5 built in prototype)
**Purpose:** The core of the page — one full-bleed editorial spread per real client story, alternating image-left/image-right for rhythm.
**Structure per spread:** `.spread` (2-col grid, ~1.1fr/0.9fr, alternating via `.spread--reverse`), image side with a small occasion tag chip overlay (e.g. "Bridal", "Festive — Ganpati"), text side on `--c-paper-deep` background containing: eyebrow (occasion + location + year), H2 client-and-moment title, meta row (garment name · colourway), body paragraph (the story), a pull-quote from the client with attribution, and a CTA pair (shop-the-garment `.btn-dark` + quiet WhatsApp "Ask about this piece" link).
**One spread (Sangeet/Kavya) demonstrates a variant:** a 2-up image strip instead of a single tall image, showing the page can flex per story without breaking the grid system.
**Motion:** Each spread's image is `.reveal-img` (scale 1.04→1 on scroll entry); text elements use staggered `.reveal`/`.reveal-delay-1/2/3`.
**Filtering:** Each `.spread` carries `data-occasion="bridal|festive|family|reception"`; the browse bar toggles `.is-hidden` (`display:none`) per spread.
**Responsive:** Collapses to single column below 900px; `.spread--reverse`'s order is reset so image always leads text on mobile (no reversed order on narrow screens — reversing left/right only reads as intentional at desktop grid width).

### Section E — Mosaic Interlude
**Purpose:** After five in-depth spreads, a denser wall of additional real moments — signals "there are many more stories than the five we slowed down for," and reintroduces pace/energy before the page moves toward commerce. Dark ground, following the established rhythm.
**Structure:** Asymmetric CSS grid (6-column base, some items spanning 3×3, most spanning 2×2) — six sample images with hover captions (name + occasion tag), each tagged `data-occasion` and responsive to the same browse-bar filter.
**Motion:** Each tile is `.reveal-img`; hover reveals a gradient overlay + caption (identical interaction pattern to the homepage lookbook hover treatment — overlay opacity 0→1, caption translateY(8px)→0, both `--dur-med`).
**Responsive:** Grid reduces to 4 columns with uniform 2×2 spans below 900px (the large 3×3 "hero" tiles are not preserved on mobile — an intentional simplification since asymmetric mosaic spans get visually cramped on narrow viewports; uniform tiles remain calm rather than chaotic).

### Section F — Shop the Diary
**Purpose:** The tasteful commerce bridge. A small, curated edit of the exact garments referenced in the stories above, presented with zero pressure — styled identically to the homepage Bestsellers product cards for instant pattern recognition and trust.
**Structure:** Standard `.section-header` (eyebrow "As Seen In These Diaries" + H2 "Shop the Diary" + "View all Signature Pieces" link) above a 4-up product-card grid (2px gap, same hairline-joint treatment as homepage). Card content: image, name, fabric line, price, hover-revealed "View piece →".
**Motion:** `.reveal-img` per card; hover scale 1.04, action link fades/slides in — identical interaction spec to homepage Bestsellers cards (Section 5 of homepage-build-spec.md).
**Responsive:** 4-column → 2-column (900px) → 1-column (600px), matching the homepage Bestsellers breakpoint behaviour exactly.

### Section G — Closing CTA (Appointment)
**Purpose:** The page's single macro conversion moment — invites the visitor to start their own diary entry, whether bridal or festive, in-store or virtual.
**Structure:** Full-bleed dark-overlaid image, eyebrow "Your Story, Next", H2 "Every Diary / Begins the Same Way.", body copy explicitly naming both bridal and festive/family occasions again (Karva Chauth named directly) so the CTA doesn't silently regress to bridal-only framing, two equal-weight `.btn-outline-white` CTAs ("Book a Styling Appointment" / "Explore the Collections") separated by an "or" divider — reusing the homepage Appointment section's exact component.
**Motion:** Identical to homepage Appointment section — bg `.reveal-img`, staggered `.reveal` text/CTA group.
**Responsive:** CTA row stacks vertically below 600px, matching homepage behaviour exactly.

### Footer
Shared global footer — full specification lives in `Docs/homepage-build-spec.md` Section 13 and is not re-litigated here. The prototype includes a condensed one-row reference footer only, to keep the prototype file focused on the new page content; the Technical Director should implement the real shared footer section (identical to Home/Collection/Product) rather than build the condensed placeholder shown in the prototype.

---

## 4. New or Changed Design Tokens

**Deliberately minimal** — this page should feel like it belongs to the same site, not a new sub-brand.

| Token/value | Status | Justification |
|---|---|---|
| Sticky browse-bar `top: 84px` (desktop) / `78px` (mobile), `z-index: 40` | **New — not a `:root` token, a component-specific value** | Needed so the browse bar sits directly under the fixed utility-bar+nav stack (34px + ~50px nav height ≈ 84px) without overlapping it. Not added to `:root` as a reusable token because it's specific to this one sticky component; if a future page needs a second sticky filter bar, promote this to a token then. |
| Mosaic grid `grid-auto-rows: 140px` (desktop) / `110px` (mobile) | **New — component-specific**, not a spacing token | Mosaic-specific row height for the asymmetric span grid; not reusable elsewhere, so not promoted to `--s-*`. |
| Hero H1 sub-line ratio `0.42em` (vs. homepage's `0.6em`) | **New — component-specific override**, not a type-scale token | "Diaries" needed a different visual ratio to "Client" than "Couture" does to "Bridal" on the homepage, because both words here are nouns of similar semantic weight rather than emotion+authority-statement. Documented as a deliberate, one-off override of the same `--t-hero`/`<strong>` pattern, not a new token. |

No new colors, fonts, spacing scale values, or motion durations/easings were introduced. All `--ease-luxury`, `--ease-soft`, `--dur-slow/med/fast` values are used verbatim.

---

## 5. Content Requirements

### Placeholder — needs real content before launch

**Photography (highest priority gap):** Every image in the prototype is a `picsum.photos` placeholder. Real content needed:
- 1 hero image (a genuine K&A client, ideally mid-motion or candid rather than posed catalog-style, to sustain the "diary" feeling)
- 5+ full spread images (one per story) — client consent for editorial/marketing usage must be confirmed per client before publishing any real photo
- 2 secondary images for the sangeet spread's 2-up strip variant
- 6+ mosaic images spanning multiple additional occasions not covered by the five main spreads (suggest: Rakhi, Diwali, mother-daughter matching moment, reception, additional bridal detail shots)
- 1 closing CTA atelier/appointment image

**Copy — all placeholder, needs Karishma & Ashita's review and real story detail:**
- All five spread narratives (client first name, occasion, year, garment name, story paragraph, pull-quote) — currently invented placeholder text in the K&A editorial voice. Real client names require explicit consent to publish; consider using first-name-only or a chosen alias if full names aren't cleared.
- Intro statement quote and attribution
- Mosaic caption names/tags
- Closing CTA body copy

**Garment/product data:** The "Shop the Diary" section's four product cards reuse placeholder names ("Bloom Soirée Lehenga," "Snow Veil Drape Saree," "Column Corset," "Festive Chanderi Drape") and prices consistent with the homepage's placeholder bestseller names — these should be reconfirmed against real product handles once the actual pieces referenced in real client stories are identified. Ideally, each spread's "Shop the [garment]" link points to the literal product page for that story's garment, not a generic collection link.

**Appointment booking destination:** Same open flag as the homepage (see homepage-build-spec.md Section 7/F5) — must be confirmed once, reused here.

### Not blocked / usable as-is
- All motion timings, easings, and component visual treatments are final (copied verbatim from approved prototypes).
- Chip filter component visual states are final (already approved on collection-page-v1.html).

---

## 6. Shopify Platform Feasibility Flags

### G1 — Diary Spreads as repeatable content
**Issue:** Each spread has ~8 discrete content fields (image, occasion tag, eyebrow, title, garment name, colourway, body, quote, quote attribution, CTA link, WhatsApp link) plus an occasion value used for filtering.
**Recommendation:** Build as a section with **blocks** (one block = one spread/story), each block schema exposing all fields above as `image_picker`/`text`/`textarea`/`url`/`select` (occasion) settings. This lets Karishma & Ashita add/reorder/remove client stories from the theme editor without a code change — high-value flexibility given this content will grow continuously as new real clients are photographed.
**Risk:** Low–medium. Standard Shopify section-block pattern; the only complexity is the alternating left/right layout, which can be handled with `{% cycle %}` or `forloop.index` odd/even logic in Liquid to toggle a `--reverse` class per block.

### G2 — Occasion/garment filtering logic
**Issue:** The prototype's filter is pure client-side JS matching a `data-occasion` attribute. This works identically in Shopify if spreads are rendered server-side with the same data attribute sourced from a block setting (`select` type: bridal/festive/family/reception).
**Recommendation:** No app needed. Keep filtering as vanilla JS exactly as prototyped — do not reach for a filtering app (e.g. Shopify Search & Discovery filtering is built for product/collection filtering, not free-form content blocks, so it does not apply here). If the number of stories grows very large (30+) and page weight becomes a concern, consider lazy-loading hidden images, but this is a future optimization, not a launch blocker.
**Risk:** Low.

### G3 — "Shop the Diary" product cards
**Issue:** Same pattern as homepage Bestsellers (see homepage-build-spec.md F2) — needs real product data.
**Recommendation:** Reuse the exact same approach: a `product` picker per card (up to 4-6), pulling `product.title`, `product.price | money`, `product.featured_image`, and a `fabric` metafield already defined for the homepage. Ideally, each Diary Spread block also includes an optional `product` reference field so its "Shop the [garment]" CTA can deep-link to the specific product rather than a generic collection page.
**Risk:** Low — metafield definition already exists from homepage build.

### G4 — Client photo usage rights / consent
**Issue:** This is not a technical risk but a legal/process one worth flagging to the Technical Director and owner: publishing real identifiable client photography requires documented consent (a simple photo-release step during or after the styling appointment, ideally captured as part of the existing appointment/fitting workflow).
**Recommendation:** Not a platform build item, but should be tracked as a content-operations checklist item before each new story goes live. No app or metafield needed — flagging so it isn't missed.
**Risk:** Low technically, but real reputational/legal risk if skipped.

### G5 — Sticky browse bar and fixed header stacking
**Issue:** The sticky `top: 84px` value depends on the utility-bar + nav combined height staying constant. If a future promo banner or utility-bar content change alters that height, the browse bar will either gap awkwardly or overlap.
**Recommendation:** Calculate the sticky offset via a small JS measurement (read `utility-bar` + `nav` actual heights on load and set `--browse-bar-top` as a CSS custom property) rather than a hardcoded `84px`, to stay robust against future header changes. Document this in the section's CSS comments per the existing z-index stacking-order convention (homepage-build-spec.md Section 1, "Z-index stacking order").
**Risk:** Low, but worth the small extra robustness given the header is a shared global component that other work may touch later.

### G6 — Mosaic asymmetric grid maintenance
**Issue:** The `:nth-child(3n+1)` span logic for large tiles assumes a specific ordering of mosaic items. If Karishma & Ashita adds/removes mosaic images via the theme editor, the "every third tile is large" pattern could land awkwardly (e.g., two large tiles adjacent).
**Recommendation:** Either (a) accept this as a minor known cosmetic risk and document it in the section's schema info text ("for best visual results, add mosaic images in multiples of 3"), or (b) let the Technical Director make tile size an explicit per-block setting (`small`/`large`) so the merchant controls it directly. Option (b) is more robust; flagging both as options rather than prescribing one.
**Risk:** Low–medium, cosmetic only.

---

## 7. Build Complexity Estimate

**Overall: Moderate.**

Reasoning:
- **Reuses, does not invent:** header/nav/footer/concierge button, chip filter component, product card component, appointment CTA component, and all motion/reveal logic are copy-pasted patterns from already-approved and (per CLAUDE.md) already-built pages. This significantly reduces net-new CSS/JS.
- **Net-new complexity is concentrated in three places:** (1) the repeatable block-based Diary Spread section with its alternating layout logic, (2) the occasion filter wiring across two independent sections (spreads + mosaic) sharing one filter state, (3) the sticky browse-bar positioning robustness (G5).
- **Not complex:** no new apps, no new third-party integrations, no checkout-adjacent logic, no metafield systems beyond what the homepage build already established.
- **Comparable reference point:** roughly the same order of complexity as the homepage's Client Diaries teaser + Bestsellers + Collections Directory sections combined, since this page's sections individually reuse those exact patterns at a larger scale.

---

## 8. Scorecard

**Luxury Score: 87/100**
Strong: editorial spread format, restrained CTA language, consistent token reuse, real-client-first framing over UGC-grid conventions. Held back from higher only by the placeholder photography currently in the prototype — the actual luxury ceiling of this page is entirely dependent on real photography quality, which cannot be scored yet.

**Editorial Score: 90/100**
The alternating full-bleed spread format, pull-quotes with attribution, and mosaic interlude genuinely mirror Vogue "Real Weddings" / Sabyasachi-style storytelling rather than a testimonials widget. Occasion breadth (festive/family, not just bridal) is structurally built in, not bolted on. Small deduction because five spreads is a strong prototype baseline but the real page will need continuous content operations to keep feeling "alive" rather than static once live.

**Mobile Experience Score: 85/100**
Full breakpoint parity for every section (spreads collapse cleanly, mosaic simplifies deliberately rather than cramming, browse bar remains sticky and usable, product/CTA grids match existing homepage mobile behavior exactly). Slight deduction because the mosaic's asymmetric large-tile treatment is intentionally simplified on mobile (G6) — a reasonable trade-off, but it does mean mobile and desktop are not pixel-identical in that one section (they are equal in effort and quality, per CLAUDE.md's standard, but not visually identical, which is the correct call here).

**Brand Consistency Score: 96/100**
Every color, font, spacing, and motion token is verbatim from the approved system. Every component (chips, product cards, appointment CTA, nav, footer, concierge button) is a direct reuse of already-approved patterns, not a reinterpretation. The only deductions are the three flagged component-specific values in Section 4, which are justified deviations, not accidental drift.

---

### Top 5 Immediate Improvements
1. Commission real client photography (hero + 5 spreads minimum) — this is the single highest-leverage gap; nothing else on this page can be properly judged without it.
2. Secure explicit written consent from each featured client before publishing identifiable photos or quotes.
3. Confirm real product handles for the "Shop the Diary" section and wire each spread's CTA to the specific product referenced in that story, not a generic collection link.
4. Confirm the appointment booking destination (shared open item with homepage — resolve once, reuse everywhere).
5. Replace placeholder story copy with real client narratives reviewed by Karishma & Ashita for tone and factual accuracy.

### Top 5 Strategic Improvements
1. Build a lightweight internal workflow so every completed fitting/order has a "diary consent" checkbox, turning photo/story sourcing into a standing operational habit rather than a one-time content push.
2. Consider a short (10–20s, muted, autoplay-on-scroll) video moment for one or two flagship stories — video is the single biggest quality delta available in luxury bridal editorial and is not represented in this HTML/CSS/JS-only prototype.
3. Add a lightweight "Diary Map" or seasonal grouping (e.g. "This Wedding Season," "Festive 2026") once enough stories accumulate, so the page ages gracefully rather than reading as a fixed, dated set of five.
4. Explore a "Save/Shortlist" affordance (client-side, no login required) letting a visitor mark garments seen across multiple stories to revisit later — supports the long consideration cycle typical of Rs 38,000+ purchases without adding checkout friction.
5. Once traffic data exists, consider whether occasion-based landing entry points (e.g. a direct link to "Festive Stories" from an Instagram bio or ad) outperforms the single all-stories entry — the filter bar's URL state could be made shareable via query param (`?occasion=festive`) at low cost.

### Quick Wins
- Add `?occasion=` URL query param support so filter state is shareable/linkable (small JS addition).
- Add `rel="noopener"` (already present) and `loading="lazy"` to all below-the-fold images once real photography is in place (currently omitted only because placeholder images are non-critical path).
- Add descriptive `alt` text per real photo once sourced (currently placeholder alt text describing intended content).

### Medium Projects
- Build the block-based Diary Spread section with alternating layout logic and occasion `select` field (G1).
- Implement the JS-measured sticky browse-bar offset instead of a hardcoded value (G5).
- Wire per-spread "Shop the [garment]" CTAs to specific product references via an optional `product` picker per block.

### Major Projects
- Full real-photography shoot/sourcing campaign across bridal + festive + family occasions (the page's single largest dependency).
- A recurring content-operations process for continuously adding new real client stories post-launch, so the page doesn't calcify at five spreads.
- Potential future video-editorial layer (per Strategic Improvement #2) — a genuinely new production capability, not a build task.
