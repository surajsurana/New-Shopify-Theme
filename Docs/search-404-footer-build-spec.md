# Search / 404 / Footer — Build Specification
**Document version:** 1.2 (revision v3 — mobile footer divider cleanup; also carries v2's mobile search trigger placement and mobile footer two-column layout)
**Date:** 11 July 2026
**Prototype source:** `Prototypes/search-404-footer-v1.html`
**Status:** 404 page design is fully approved by Suraj, no outstanding items. Footer design is approved (repetition fix, YouTube added, Press removed, two-column phone layout all confirmed) with one outstanding revision now applied here (divider cleanup at ≤480px, §3.2/§3.3) — not yet re-confirmed. Search has not yet received a separate approval pass from Suraj; its mobile trigger-placement revision (§1.2/§1.4) is applied here alongside the others. Nothing else in this document (search overlay behavior/results, 404 copy/CTAs, footer copy) has changed from v1.0.

**v1.2 changelog:**
1. **Footer mobile (≤480px) divider cleanup (§3.2, §3.3).** Suraj reviewed v2's two-column phone layout and pushed back: too many divider lines, reads as a spreadsheet/table grid — a horizontal rule under each of the two paired rows PLUS a vertical rule splitting each row into columns, 5 rule lines stacked in one footer, conflicting with the site's own calm/editorial standard. Fixed: every internal divider removed — both row-dividers and the column hairline — relying purely on the existing padding to separate the three stacked blocks, mirroring how the desktop 5-column footer already separates its columns with gap alone and zero rules. Only one hairline survives (below the newsletter block, before the copyright bar) — kept because it's the same functional closing line desktop already has under `.ka-footer__top`, not a new row-separator. Net: 5 rule lines → 1, single axis (horizontal only).

**v1.1 changelog:**
1. **Mobile search trigger placement (§1.2, §1.4).** Suraj reviewed on a real phone and found the mobile top bar — search + bag + hamburger all clustered together on the right — cramped and crowding the logo. Fixed: hamburger moves to its own position at the far left of the nav row; search and bag stay grouped together at the far right (hamburger-left / logo-centre / utility-icons-right — the pattern Chanel and Dior both use on mobile). The logo-centring fix from v1.0 is re-derived accordingly (§1.4).
2. **Footer mobile (≤480px) two-column layout (§3.2, §3.3).** Suraj confirmed the footer design overall (repetition fix, YouTube, Press removal) but asked for two columns on real phones instead of the single-column hairline stack, to shorten the scroll. Fixed: an explicit-grid two-column arrangement (Brand+Social | Collections, then Maison | Contact, then Inner Circle full-width alone) replaces the single-column stack below 480px. The ≤900px tablet tier is unchanged.

**Scope note:** These are three related component-level additions/fixes to existing global chrome, not new flagship pages — treated at the same weight as the Client Diaries "Coming Soon" component work, not a full Phase 1–5 page audit. All three reuse existing tokens and components; no new color, type, or spacing system introduced.

---

## 1. Search

### 1.1 Problem
No search feature exists anywhere on the site — no icon, no modal, no results page. A visitor who knows exactly what she wants (e.g. "the ivory corset I saw on Instagram") has no way to jump directly to it and must browse collection-by-collection.

### 1.2 Design decision
**Trigger placement:** A new minimal line-icon (magnifying glass, matching the existing bag icon's exact stroke spec — 24×24 viewBox, `stroke-width:1.4`, round caps) sits in `.ka-nav__actions`, immediately left of the bag icon, on every template. **Not** placed in the utility bar — the utility bar's balance between the marquee and the Task 86 currency chip is deliberately tight already; adding a search affordance there would crowd it and mix two different jobs (service messaging vs. site search) in one strip. The main nav row is the correct home for it, as a peer to the bag icon.

**Revision v2 — mobile trigger position.** Suraj reviewed on a real phone: the original mobile arrangement grouped search inside `.ka-nav__actions` alongside the bag icon *and* the hamburger toggle, putting all three controls in one three-icon cluster on the right. On a true phone viewport this cluster is wide enough (three 30px icon targets + two 14px gaps ≈ 122px) that it visibly crowded the layout and pushed `.ka-nav__logo` off true optical centre — confirmed not working. Two options were weighed: (a) keep search grouped with bag on the right and relocate the hamburger to its own position on the left (matching the classic hamburger-left / logo-centre / utility-icons-right pattern used by Chanel and Dior on mobile), or (b) remove search from the top bar entirely and place it as a row inside the mobile hamburger drawer, matching Task 86's currency-chip drawer placement. **Decision: option (a).** Search is a primary, frequently-reached-for action for a bride who already knows what she wants — burying it an extra tap deep inside the hamburger drawer measurably increases friction for exactly the visitor most likely to convert quickly, and doesn't match how Dior/Chanel/Hermès treat search on mobile (always a direct top-bar icon, never drawer-buried). Option (a) also directly fixes the crowding: the right-hand cluster drops from three icons to two (search + bag, ≈74px), and the hamburger — now alone on the left — makes the two flanking columns far closer in width than before, restoring a genuinely centred logo. See §1.4 for the exact centring mechanics.

**Activation:** Full-viewport overlay (not a small dropdown, not an immediate navigation to a separate page) — the luxury-standard pattern (Chanel, Dior, Hermès all use a full-screen search takeover). Entrance motion is a fade + slight drop from the top (`translateY(-14px) → 0`, 0.5s `--ease-luxury`), because the trigger lives in the top nav row — this completes the header's existing directional-motion language: the hamburger drawer already slides in from the side, the mobile currency sheet already rises from the bottom; search dropping from the top gives each disclosure pattern in the header its own logical entry direction rather than three arbitrary/inconsistent motions.

**Empty state (query < 2 characters):** "Popular Searches" — five chips reusing the exact `.ka-chip` component from the Collection page's refine bar, one per real collection (Signature, The Bloom Soirée, Chamakk, Barre Oblique, The Festive Edit) — real destinations, not invented categories. Below the chips, three small image tiles (reusing the collection-card hover-caption treatment) give the empty screen some visual life rather than a bare input on a white void, matching how Dior/Chanel search overlays are never purely typographic.

**Results state (query ≥ 2 characters, matches found):** A result-count line, then a product grid using the **existing `.ka-p-card` component verbatim** — identical markup/styling to Collection page cards, so results are instantly recognisable, not a new pattern. Capped to 8 results in the overlay, with a "View All Results" `.btn-dark` link to a dedicated `/search?q=` results page (full pagination) for anyone who wants to keep browsing.

**No-results state:** No dead end. Quiet message + two CTAs: `.btn-outline-rose` "Ask Our Styling Concierge" (WhatsApp, pre-filled) as the primary action, `.btn-dark` "Browse All Collections" as the secondary. A made-to-order luxury house with no big-box return safety net should always resolve "we don't have that" into a human conversation, not a dead search box — this mirrors the brand's existing concierge-first ethos used elsewhere (Client Diaries no-story-match pattern, product OOS states).

**Dedicated `/search` results page:** Mirrors the Collection page's exact grid/breadcrumb pattern (breadcrumb reading "Search results for '[query]'", standard `.ka-product-grid` of `.ka-p-card`s). The no-results state on this page reuses the **existing `.ka-collection-empty` component verbatim** (already built for Collection page empty states) — zero new CSS needed for that state. This page is what "View All Results," a direct Enter-key search, or a bookmarked/shared search URL all resolve to.

**Nav centering — v1.0 fix, then re-derived in v2:** Adding a third icon to the mobile action cluster (search + bag + hamburger) broke the original mobile nav's logo centering. The mobile nav originally used `grid-template-columns: auto 1fr auto`, where the left column (auto, empty since links are hidden) and right column (auto, action icons) were unequal widths — the logo, though centered *within* its own column, ended up visibly off-center of the actual viewport. v1.0 fixed the grid definition itself: `grid-template-columns: 1fr auto 1fr`, matching desktop's already-correct symmetric pattern (both flanking columns are genuine `1fr` tracks, column 2 is `auto`-sized to the logo).

**v2 addendum — that grid-level fix isn't sufficient on its own.** `1fr` tracks are only visually equal when both tracks' own *minimum content width* is also equal — CSS Grid first reserves each track's min-content floor, then distributes remaining free space evenly, so two `1fr` tracks with unequal content floors still render at unequal final widths (the track with more content keeps its extra floor width *plus* an equal share of the leftover space). This is exactly what broke centering under the v1.0 three-icon-cluster layout, and it is the same underlying mechanic that must be re-solved now that the icon split has changed from "0 left / 3 right" to "1 left / 2 right":
- `.ka-nav__toggle` moves out of `.ka-nav__actions` entirely and becomes its own grid item in column 1 (mutually exclusive with `.ka-nav__links`, which occupies the same column 1 on desktop — only one of the two is ever `display`-active at a given breakpoint, so there's no conflict).
- `.ka-nav__actions` (now just search + bag) has a natural min-content floor of 74px (two 30px icon-buttons + one 14px gap).
- `.ka-nav__toggle`'s own natural min-content floor is only ~32px (padding + bars), so without intervention the right column would again end up wider than the left, pushing the logo off-centre by roughly 42px.
- **Fix:** give `.ka-nav__toggle` an explicit `min-width: 74px` at the mobile breakpoint, matching `.ka-nav__actions`' floor exactly, plus `align-items: flex-start` so the hamburger bars sit at the left edge of that now-wider box rather than centering within it. This makes both flanking columns' content floors genuinely equal, so the two `1fr` tracks compute to equal final widths and the logo sits on true optical centre — the same fix *pattern* as v1.0, reapplied to the new icon split. Documented inline in the CSS at `.ka-nav__toggle`'s mobile rule.
- This is a general pattern the Technical Director should keep in mind for any future header icon-count changes: matching `1fr` grid tracks alone does not guarantee a centred logo — matching *content-floor widths* on both flanking columns does.

### 1.3 Section/Component Breakdown
| Component | Purpose |
|---|---|
| Search trigger icon | Entry point, nav row, every template |
| Search overlay (empty/results/no-results states) | Fast, in-context answer without leaving the page |
| `/search` results page | Full browsing/pagination destination for "View All Results," Enter key, and shared links |

### 1.4 Design Tokens
No new colors, type, or spacing tokens. One new component-specific value: **z-index 220** for the search overlay — the new top of the header's stacking order (previously topped out at 210, the currency menu). Document in `assets/ka-nav.css`'s existing stacking-order comment block: `search overlay 220 > currency menu/sheet 210 > mobile drawer 200 > concierge float 110 > utility bar 101 > nav 100 > content`.

### 1.5 Custom Behavior
- Click/tap trigger → overlay opens, input auto-focuses after the entrance transition completes (avoids focus-triggered layout jump mid-animation).
- **v2:** on mobile, the hamburger toggle button is now the first focusable element in the nav's DOM (before the desktop nav-links list), giving a left-to-right tab order of hamburger → logo → search → bag that matches the new left-to-right visual order. It remains `display:none` (and therefore excluded from the tab sequence entirely) at desktop widths, so desktop tab order is unaffected.
- Debounced live filtering (~250ms) as the visitor types, matching Shopify's native Predictive Search API behavior.
- ESC closes; focus returns to the trigger button (same pattern as the existing currency menu in `ka-currency.js`).
- Body scroll locked while open (same pattern as the mobile nav drawer).
- No click-outside-to-close — the overlay is a full-viewport takeover with no "outside" to click, consistent with the mobile drawer's own full-screen behavior (Close button + ESC only).
- Popular-search chips fill the input and trigger a search on click (same code path as typing).

### 1.6 Images Needed
Empty-state tiles: 3 curated collection images. Prototype uses existing real assets (`bloom-soiree-card.jpg`, `chamak-card.jpg`, `barre-card.jpg`) — usable as-is at launch, swappable later.

### 1.7 Copy Needed
- Input placeholder: "Search pieces, collections, stories…"
- No-results body copy (final, see prototype)
- Popular-search chip labels (final — real collection names, no placeholder)

### 1.8 Shopify Platform Feasibility Flags
**S1 — This is Shopify's Predictive Search API + native `/search` route, not a custom build.** Shopify provides `predictive-search.json` (AJAX, live-as-you-type, exactly what the overlay needs) and a native `/search` route backed by `templates/search.json` (exactly what the full results page needs). **Recommendation:** build on these directly — no third-party search app needed for launch. This is a well-suited fit, not a workaround.
**Risk:** Low. Standard, well-documented Shopify platform capability.

**S2 — Result relevance/ranking.** Shopify's native predictive search does reasonable out-of-the-box keyword matching against title/tags/type, but has no fashion-specific synonym awareness (e.g. "corset" vs. "bustier," "lehenga" vs. "lehnga" common misspelling). **Recommendation:** ensure product tags are seeded with common alternate spellings/synonyms as a content task — not a platform limitation, a data-quality task. Flagging so it isn't missed, not a build blocker.
**Risk:** Low, content-operations item.

**S3 — Overlay must not conflict with the currency-conversion module.** Search result cards render prices via the same `[data-price]` attribute contract `ka-currency.js` already sweeps sitewide. **Recommendation:** ensure the search overlay's result cards use the exact same `data-price` markup as Collection-page cards so currency conversion "just works" on search results with zero additional code — a direct benefit of reusing `.ka-p-card` verbatim rather than inventing a new card.
**Risk:** Low — this is a consequence of correct reuse, not a new risk, flagging to confirm TD wires it identically.

### 1.9 Build Complexity
**Moderate.** Reuses the product-card component and Shopify's native predictive-search/search infrastructure — no app, no custom index. Net-new work is the overlay UI (open/close, debounce, three-state rendering) and the one-line nav grid fix. Comparable in scope to the Task 86 currency-chip/menu build.

---

## 2. 404 Page

### 2.1 Problem
Any broken/missing URL currently falls through to Shopify's generic default 404 — plain, unbranded, jarring on a luxury site. Confirmed present, not designed at all.

### 2.2 Design decision
Treated as a **soft-launch utility page**, same tier as the Client Diaries "Coming Soon" frame — not a flagship moment, but intentional, not an accident. **Deliberately no photography.** A visitor lands here from any broken link at any time; an image tied to one specific collection would read as randomly promotional to someone who didn't ask for it, and would need continual updating to stay seasonally correct. Quiet typography carries the whole page instead — a small hairline rule + eyebrow ("Page Not Found") + an italic serif headline ("This Page Has Stepped Away") + one short line of body copy.

**CTA hierarchy — three options asked for, two real buttons, not three:** "Explore the Collections" (`.btn-outline-rose`, a proper bordered button — the heaviest visual weight, because keeping a lost visitor shopping is the more valuable business outcome than sending her to the homepage) and "Return Home" (`.btn-dark`, lighter text-link-with-arrow treatment — the safe fallback). "Concierge" is **not** a third boxed button — it's a quiet inline sentence beneath the buttons ("Can't find what you're looking for? Message our styling concierge on WhatsApp.") with the WhatsApp link woven into the sentence. Three equal-weight boxed buttons in a row reads as a busy utility page; two buttons + one quiet sentence reads as calm and considered, and still surfaces all three paths asked for. (The global floating Concierge button is also already present on this page like every other template, so concierge is reachable two ways without ever feeling pushed.)

### 2.3 Section/Component Breakdown
| Component | Purpose |
|---|---|
| Nav + utility bar | Standard global chrome, settled state (no dark hero behind it) |
| `.ka-404` content block | The entire page — eyebrow, headline, body, two CTAs, one concierge sentence |
| Global footer | Standard shared footer, unchanged pattern |

### 2.4 Design Tokens
None new. Entirely existing tokens (`--t-display`, `--f-display` italic, `.btn-dark`, `.btn-outline-rose`, `.eyebrow`).

### 2.5 Custom Behavior
None beyond standard link navigation. No motion beyond the page's standard load state — deliberately no reveal-on-scroll choreography, since the whole page is above the fold with nothing to scroll toward.

### 2.6 Images Needed
None (deliberate design decision, see 2.2).

### 2.7 Copy Needed (final, not placeholder — short enough to finalize now)
- Eyebrow: "Page Not Found"
- Headline: "This Page Has Stepped Away"
- Body: "The page you were looking for may have moved, changed its name, or simply isn't ready yet. Let us guide you back to the collections."
- CTAs: "Explore the Collections" / "Return Home"
- Concierge sentence: "Can't find what you're looking for? Message our styling concierge on WhatsApp."

### 2.8 Shopify Platform Feasibility Flags
**F1 — Shopify serves 404s automatically via `templates/404.json` (or `.liquid`) — no routing config needed.** Any URL that doesn't resolve to a real resource automatically renders this template. **Recommendation:** build `templates/404.json` referencing a new `sections/ka-404.liquid`, following the exact same pattern already used for `templates/page.client-diaries.json`.
**Risk:** None — this is standard, guaranteed Shopify platform behavior.

### 2.9 Build Complexity
**Simple.** One static section, no blocks, no settings beyond standard header/body text fields, no new components, no JS.

---

## 3. Footer

### 3.1 Problems (confirmed by reading `sections/ka-footer.liquid` and `assets/ka-footer.css`)

**(a) Copy repetition.** "Mumbai" and worldwide-shipping messaging appeared in four places: the logo sub-line ("Bridal Couture · Mumbai"), the Contact column's address block ("Mumbai, India / Complimentary worldwide shipping"), the bottom bar's service line ("Mumbai · Worldwide Delivery · DHL Express"), and the bottom bar's locale line ("Ships worldwide, priced in INR") — three of those four are near-identical restatements of the same two facts (where we are, that we ship worldwide) in a footer that isn't large enough to justify saying either twice, let alone three times.

**(b) Mobile layout — two distinct, confirmed bugs, not one:**
1. **Tablet range (601–900px), a real layout bug, not a style quibble.** The current CSS relies on grid auto-flow with only Brand and Inner Circle given explicit `grid-column: 1 / -1`. Tracing the auto-placement: Brand (full width, row 1) → Collections (row 2, col 1) → Maison (row 2, col 2) → Contact (row 3, col 1, forced there because the next item, Inner Circle, needs a full row and can't share row 3) → Inner Circle (forced to row 4, full width). Result: **Contact sits alone next to an empty grid cell** at every width from 601–900px — an orphaned gap in the layout, confirmed by tracing the actual CSS, not assumed.
2. **Phone range (≤600px), a hierarchy/density problem.** All five blocks — Brand, Collections, Maison, Contact, Inner Circle — stack full-width with no differentiation beyond the outer top border, reading as one long undifferentiated wall of grey text rather than five distinct, considered sections.

### 3.2 Design decisions

**Copy fix.** The logo sub-line's "Mumbai" **stays**, unchanged — it functions as brand/heritage identity (the way Sabyasachi's site consistently states "Kolkata" under the wordmark), not logistics information, so it isn't actually part of the repetition problem. The **Contact column's address block becomes the single authoritative place** for logistics: "Mumbai, India" + "Complimentary worldwide shipping via DHL Express" — merging in the DHL Express detail that used to live in the now-removed service line, so the one genuinely useful additional fact (which carrier) is preserved, just stated once, in the place a visitor actually looks for delivery/location information. **The bottom bar's service line and locale line are removed outright, not relocated elsewhere** — once the Contact column carries the full story, repeating any part of it in the bottom bar again would recreate the exact problem being fixed. The bottom bar simplifies to the calm luxury-standard pattern: copyright + legal links, one row, nothing else — this is what Chanel's and Dior's bottom bars carry, and no more.

**Mobile fix — deliberately not an accordion.** An accordion/collapsible pattern was considered and rejected: it reads as SaaS/utility chrome (an FAQ-page convention), and this brand's mobile footers should feel like a considered, confident continuation of the desktop footer, not a collapsed set of hidden drawers. Instead, two fixes address the two actual confirmed bugs:
1. **Tablet range (≤900px), unchanged by revision v2:** every column gets an **explicit** `grid-column` assignment instead of relying on auto-flow, so pairing is deliberate rather than accidental: Collections + Maison pair together (both are "browse" columns), Contact + Inner Circle pair together (both are "do something now" columns — WhatsApp/email/address, and email capture). This eliminates the orphaned-cell bug entirely. DOM/source order is left completely unchanged (Brand, Collections, Maison, Contact, Inner Circle) — only the *visual* placement changes, so tab order and reading order stay in sync with desktop; reordering the DOM itself was considered and rejected to avoid a screen-reader/keyboard tab-order mismatch for a business-priority-only gain that isn't worth that trade-off.
2. **Phone range (≤480px) — REVISED in v2.** v1.0 shipped this range as a single column with a visible hairline divider between every block. Suraj confirmed the footer design overall but, reviewing on a real phone, asked specifically for a two-column layout here to cut how far the footer scrolls. v2 replaces the single column with an explicit-grid two-column arrangement — see below. The accordion rejection above still stands as the reason this stays a real (if shorter) scroll rather than a collapsed/hidden pattern.

**v2 — phone-range (≤480px) two-column arrangement.** Every one of the five blocks is given an explicit `grid-column` **and** `grid-row` — none rely on auto-flow — specifically so this new arrangement cannot reintroduce the class of bug already fixed once at the tablet tier:
- **Row 1: Brand+Social | Collections.** The identity/social column beside the shoppable collections list opens the footer's mobile sequence — "who we are" next to "what we sell."
- **Row 2: Maison | Contact.** Deliberately not the same pairing as the tablet tier (Contact was paired with Inner Circle there). On a phone specifically, placing the Maison column's "Book an Appointment" link directly beside the Contact column's phone/WhatsApp line puts a business-priority link and the means to act on it immediately, in the same visual row — a stronger pairing for the appointment-booking/WhatsApp-enquiry objective than an arbitrary alphabetical or DOM-order pairing would be.
- **Row 3: Inner Circle, full width, alone** (`grid-column: 1 / -1`), not part of the two-column grid at all. It holds a real email input + submit button; halving its width on a true phone would compress the input field below a comfortable typing/touch size. This directly reflects Suraj's own note that the newsletter form should span full width.
- `.ka-footer__logo`'s font-size is reduced (1.7rem → 1.32rem, tighter line-height) specifically at this breakpoint, since Brand now sits in a half-width column rather than full width. The wordmark may still wrap to two lines ("Karishma" / "Ashita") at the narrowest real phone widths — this is treated as an accepted, elegant stacked-wordmark outcome, not a defect; other maisons do the same in their tightest mobile spaces, and the tagline/social row already wrap gracefully via existing flex-wrap with no additional CSS needed.

**v3 — phone-range (≤480px) divider cleanup.** v2 (above) gave the two-column arrangement a vertical hairline splitting each row into columns AND a horizontal hairline closing off each row — 5 rule lines total (2 horizontal row-dividers + 2 vertical column-dividers, since the vertical `border-left` rule applied to both paired rows + the pre-existing horizontal line under Inner Circle). Reviewing on a real phone, Suraj called this a spreadsheet/table-grid read — horizontal AND vertical rules together, exactly the kind of pattern this brand's "calm, editorial, never crowded" standard exists to rule out. Fix, confirmed by counting the actual CSS, not estimated:
- **Removed: both horizontal row-dividers** (`border-bottom` under Brand+Collections, and under Maison+Contact). These were purely decorative row-separators duplicating a job the existing padding already does — 32px of padding above and 32px below the boundary (`--s-md` each side) already reads as a clear, generous break between blocks once the competing line is gone.
- **Removed: the vertical column hairline** (`border-left` on Collections/Contact). The existing padding (`--s-sm` each side = 32px total gutter) already separates the two columns without a rule — the same principle the desktop 5-column `.ka-footer__top` already uses one breakpoint up, where columns are separated by `gap` alone with zero vertical rules. Matching that precedent here, rather than inventing a mobile-only "grid line" treatment, is the more consistent, more restrained choice.
- **Kept: the one horizontal hairline below Inner Circle**, unchanged (`border-bottom: 1px solid rgba(201,191,174,0.18)`). This is not a row-divider in the same family as the two removed above — it is the same functional line the desktop footer already carries under `.ka-footer__top`, closing the brand-content block before the copyright/legal bar. Removing it would create an inconsistency with desktop (which keeps this exact transition line) for no gain; keeping it does not reintroduce the spreadsheet problem, since it is the only line on the page and sits on one axis only.
- **Net result:** 5 rule lines → 1. Single axis (horizontal). No new spacing values introduced — the existing `--s-sm`/`--s-md`/`--s-lg` padding already in place is doing the separating work unaided.

**YouTube link.** Added to the Brand column's social row, positioned Instagram → YouTube → Pinterest → Concierge — browsing platforms first (in descending order of the brand's actual channel activity, per CLAUDE.md's note on Instagram being the strongest channel), then the pivot from "look" to "ask" (Concierge) last. Kept as a **text link**, matching the row's existing established language (Instagram/Pinterest/Concierge are already text labels, not icons) — adding an icon-only YouTube mark would introduce a second, inconsistent visual system into one four-item row for no real gain.

**Press link removal.** Removed from the Maison column's fallback list per direct instruction — no live page exists behind `/pages/press` yet. Pull now, reintroduce when real press content exists.

### 3.3 Section/Component Breakdown
| Component | Purpose | Change |
|---|---|---|
| Brand column | Identity + social row | YouTube link added; explicit `grid-column`/`grid-row` at ≤900px and ≤480px; **v2:** logo font-size reduced at ≤480px (now paired half-width with Collections); **v3:** no divider change (column had no rule of its own) |
| Collections column | Link list | Unchanged content; explicit `grid-column`/`grid-row` at ≤900px and ≤480px; **v3:** vertical hairline separating it from Brand removed, separation now by padding/gutter alone |
| Maison column | Link list | Press removed; explicit `grid-column`/`grid-row` at ≤900px and ≤480px; **v2:** paired with Contact (not Inner Circle) at ≤480px; **v3:** horizontal hairline above this row removed, separation now by padding alone |
| Contact column | Logistics/contact info | Consolidated single address block (Mumbai + worldwide shipping + DHL Express, stated once); explicit `grid-column`/`grid-row` at ≤900px and ≤480px; **v2:** paired with Maison (not Inner Circle) at ≤480px; **v3:** vertical hairline separating it from Maison removed, separation now by padding/gutter alone |
| Inner Circle (newsletter) | Email capture | Unchanged content; explicit `grid-column`/`grid-row` at ≤900px; **v2:** full-width standalone row at ≤480px (was paired with Contact in single-column stack before); **v3:** its own closing hairline (below it, before the copyright bar) is unchanged/kept — the one surviving rule line |
| Bottom bar | Copyright + legal | Simplified to one row; service_line/locale_line removed entirely |

### 3.4 Design Tokens
No new colors/type/spacing values. One new breakpoint value: **480px**, not previously present in the footer's responsive system (old system only had 600px and 900px). This is a component-specific breakpoint addition, not a new `:root` token. **v2 (superseded by v3):** had reused the existing `--s-sm` (16px) token for a vertical hairline's padding at ≤480px. **v3:** that vertical hairline is removed outright — no border token needed there at all; the pre-existing `--s-sm`/`--s-md`/`--s-lg` padding values now do 100% of the separation work between the three stacked mobile blocks, unaided by any new rule.

### 3.5 Custom Behavior
None beyond existing newsletter form submission and standard link navigation — no new interactivity introduced.

### 3.6 Images Needed
None.

### 3.7 Copy Needed
- **Address block (Contact column), final:** "Mumbai, India" / "Complimentary worldwide shipping via DHL Express" (replaces the old two-line address default)
- **Schema settings removed:** `service_line`, `locale_line` (both text settings under the old "Bottom bar" schema header — remove the header and both fields)
- **Schema setting added:** `youtube_url` (url type, same pattern/info-text convention as the existing `pinterest_url`: "Leave blank to hide the YouTube link.")
- **Maison fallback list:** remove the Press `<li>` (currently `sections/ka-footer.liquid` line ~59)

### 3.8 Shopify Platform Feasibility Flags
**T1 — Liquid markup needs three new class hooks.** `sections/ka-footer.liquid`'s Collections, Maison, and Contact columns are currently bare `<div>`s with no distinguishing class (only Brand and Inner Circle have one). The new explicit `grid-column` CSS needs to target them individually. **Recommendation:** add `class="ka-footer__collections"`, `class="ka-footer__maison"`, `class="ka-footer__contact"` to those three `<div>`s — a small, safe, purely-additive markup change, no schema/settings impact.
**Risk:** None — trivial markup addition.

**T2 — Minor, worth noting but explicitly out of scope for this task.** The site's utility bar (top of every page, `sections/ka-nav.liquid`) already states "Complimentary Worldwide Delivery" as one of its three rotating phrases — meaning even after this fix, the "we ship worldwide" fact is still stated in two separate places sitewide (utility bar + footer Contact column), just no longer three or four times *within the footer itself*, which was the actual scoped complaint. Flagging for awareness only; not recommending a change to the utility bar as part of this task.

### 3.9 Build Complexity
**Simple–Moderate.** No new components; a CSS breakpoint restructure, one Liquid markup class addition, two schema fields removed, one schema field added, and copy consolidation. Comparable in scope to a single build-spec item from the Task 86 currency module, not a new section build.

---

## 4. Scorecard

**Build Complexity Summary:** Search = Moderate · 404 = Simple · Footer = Simple–Moderate. None of the three require a new app, a new design token system, or checkout-adjacent logic.

**Sequencing recommendation:** 404 first (simple, zero dependencies, immediate brand-consistency win), then Footer (also simple, fixes confirmed bugs), then Search last (moderate complexity, benefits from Predictive Search API wiring being done carefully rather than rushed alongside the other two).

---

## 5. Open Items Before Build

1. Suraj's approval of `Prototypes/search-404-footer-v1.html` (all three components).
2. Confirm product tag/synonym seeding for search relevance (S2) is tracked as a content task, not silently skipped.
3. Confirm real YouTube channel URL to populate the new `youtube_url` setting.
4. Confirm whether any real page should eventually replace the removed `/pages/press` footer link, or whether it should simply stay absent indefinitely.
