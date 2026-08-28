# Account + Wishlist — Build Specification
**Document version:** 1.0
**Date:** 29 August 2026
**Prototype sources:** `Prototypes/account-nav-entry-v1.html`, `Prototypes/wishlist-page-v1.html`, `Prototypes/product-page-wishlist-v1.html`
**Status:** All three prototypes approved by Suraj — Phase 5 build specification for Technical Director. Phase 4 (owner review) is complete; this document is the only remaining step before implementation begins.

---

## 0. Context and Relationship Between the Three Prototypes

This is one feature delivered as three prototypes because it touches three structurally different surfaces of the theme:

1. **`account-nav-entry-v1.html`** — the entry points. A desktop icon cluster (Search → Account → Wishlist → Bag) added to `.ka-nav__actions`, and two new mobile-drawer rows (My Account, My Wishlist) added above the existing My Bag row.
2. **`wishlist-page-v1.html`** — the destination. A new standalone page reusing the sitewide `.ka-p-card` grid verbatim, plus the add-to-wishlist heart button that gets added to that card component wherever it renders, plus a populated/empty state pair.
3. **`product-page-wishlist-v1.html`** — the one place `.ka-p-card` doesn't apply. The product detail page has its own gallery/info-panel layout, so the heart button needed a separate placement decision there (top-right of the hero gallery stage, deliberately excluded from the info panel, CTA stack, sticky minibar, and mobile action bar).

All three share one underlying data model (Section 1) and one visual/interaction language (line-heart → rosegold-filled heart, no popup, no toast) — this is a single feature, not three unrelated changes, and should be built and QA'd as one unit even though the code lands in several different files.

**No new design tokens are introduced anywhere in this feature.** Every colour, font, spacing, and easing value in all three prototypes was checked directly against the live `assets/ka-base.css` `:root` block during this spec's preparation and matches exactly — see Section 3.

---

## 1. The Wishlist Data Model (read this before building anything)

This is the part of the feature with real architectural decisions in it. Get this section right and the three prototypes above are mostly a matter of transcribing markup/CSS.

### 1.1 Storage: localStorage, device-scoped, identical for guest and logged-in

The wishlist is **not** a Shopify customer resource (no metafield, no draft order, no customer tag) and **must never branch on login state**. It is a plain browser-local list, exactly as the empty-state copy promises: *"Saved on this device — no account needed to begin."* A logged-in customer and a guest on the same device see and use exactly the same wishlist through exactly the same code path — there is no merge-on-login behaviour to build, because there are not two states to merge.

**Key:** `ka_wishlist` (matches the existing `ka_` prefix convention already used by `ka-currency.js`'s `ka_currency_override`).

**Shape:** a bare JSON array of product **handles** (not numeric IDs, not variant IDs):

```json
["bloom-soiree-lehenga", "ivory-column-corset", "snow-veil-corset"]
```

Handles were chosen over numeric product IDs because every render site that needs to hydrate saved state already has `product.handle` on hand server-side (for `data-` attributes) and handles are what Shopify's own storefront JSON endpoints key off (`/products/{handle}.js`) — no extra ID→handle lookup is ever needed. Wishlisting is product-level, not variant-level, matching the prototypes (no size is captured or implied by a save).

Order in the array is insertion order (oldest saved first); the Wishlist page may reverse this for display ("most recently saved first") — a minor display-order call left to Technical Director, not an architectural one.

**Not building now, explicitly:** any migration/versioning wrapper (`{ "v":1, "handles":[...] }`) — YAGNI at this scope. If a future need (e.g. per-variant wishlisting) ever requires a shape change, it can be migrated then; a bare array is correct for what's specified today.

### 1.2 Shared module: `assets/ka-wishlist.js` (new, sitewide)

Create one new, sitewide-loaded JS file — same tier as `ka-theme.js` and `ka-currency.js` (loaded unconditionally in `layout/theme.liquid`, near the bottom, deferred — see Section 6 for the exact line). This is the single source of truth every heart button and the nav badge talk to. Do **not** let each render site (collection grid, product page, wishlist page) read/write `localStorage` directly — that's how the count and the hearts drift out of sync.

Expose on `window.kaWishlist`:

| Method | Behaviour |
|---|---|
| `getAll()` | Returns the current array of saved handles (reads + parses localStorage fresh each call; cheap, no in-memory cache needed at this data size). |
| `has(handle)` | Boolean — is this handle currently saved. |
| `add(handle)` | Adds if not already present, persists, fires the sync event (below). No-ops silently if already saved (idempotent). |
| `remove(handle)` | Removes if present, persists, fires the sync event. No-ops silently if not saved. |
| `toggle(handle)` | Convenience wrapper every heart button actually calls — returns the new saved/unsaved boolean so the calling button knows which visual state to render. |

Internally, every mutating call (`add`/`remove`/`toggle`) does two things after writing to `localStorage`:
1. Dispatches `document.dispatchEvent(new CustomEvent('ka:wishlist:change', { detail: { handles: kaWishlist.getAll() } }))` — the sync mechanism every other component listens for (Section 1.3).
2. Wraps the `localStorage` read/write in `try/catch` (private browsing, storage disabled, quota edge cases) and fails silently — the heart still visually toggles for that page view even if persistence fails, rather than throwing and breaking the click handler. Same defensive pattern already used in `ka-currency.js`.

### 1.3 Sync mechanism: one custom event, three listeners

The brief specifically asks for this to be unambiguous, so: **`ka:wishlist:change`**, a `document`-level `CustomEvent`, fired by every `ka-wishlist.js` mutation (Section 1.2). Three things listen for it:

1. **The nav badge** (desktop icon cluster + mobile drawer "My Wishlist" row, both rendered by `sections/ka-nav.liquid` on every template). On `ka:wishlist:change`, update every `[data-ka-wishlist-count]` node's text and `data-count` attribute to `handles.length` — structurally identical to the existing `kaUpdateBagCount()` pattern in `ka-theme.js` (`[data-ka-bag-count]`), just for wishlist. Also toggle `.has-saved` on `.ka-nav__wishlist` so the heart glyph itself fills/empties (mirrors `.ka-nav__bag`'s badge-only pattern, but the wishlist icon additionally has its own fill state per the prototype).
2. **Every heart button visible on the current page** (card hearts, product-page hero heart) — on `ka:wishlist:change`, each button checks whether *its own* `data-product-handle` is in `event.detail.handles` and sets `.is-saved` accordingly. This is what makes "unsave from the Wishlist page" correctly un-fill that same product's heart if it's also visible in, say, a Bestsellers strip rendered lower on that same page (edge case, but free correctness from using one event rather than each button only knowing about its own click).
3. **The Wishlist page's own grid renderer** (Section 2, S4/S5) — on `ka:wishlist:change`, re-derive whether to show the populated grid or the empty state from the new handle list. In practice the Wishlist page's own heart clicks already drive this via the fade-and-remove transition (matching the prototype); listening to the shared event too is what makes it also correct if `localStorage` changed from another tab (see 1.5) or via a heart on a different page reached by back-navigation (bfcache).

**Hydration on load (separate from the event, and just as necessary):** every heart button must set its correct initial `.is-saved` state on page load by calling `kaWishlist.has(handle)` once — the event only fires on a *change*, not on load. Because this is synchronous `localStorage` (no fetch, no network round-trip, unlike the cart-count pattern which needs a `/cart.js` fetch), this hydration can and should run as early as possible — ideally the very first thing `ka-wishlist.js` does on `DOMContentLoaded`, or even earlier via a small inline snippet if a flash of unfilled hearts on a page with many saved items is visible in QA. Flagging this explicitly because the existing bag-count pattern *does* tolerate a brief default-state flash (it's waiting on a fetch); the wishlist hydration has no excuse to, since the data is already sitting in `localStorage` with zero latency.

### 1.4 Every server-rendered heart button needs a stable handle attribute

Every `.ka-p-card__wish` and the product page's `.ka-stage__wish` must carry `data-product-handle="{{ product.handle }}"`. This is the only thing that lets the shared hydration/sync logic in 1.2/1.3 identify which button corresponds to which saved handle — without it, `ka-wishlist.js` has no way to know what a given heart button on the page actually represents. Add this attribute in every one of the five render sites listed in Section 5, Flag G1 — it is easy to add and easy to silently forget in the ones that aren't the "main" collection grid.

### 1.5 What this data model deliberately does NOT do

- **No cross-device sync.** A wishlist saved on a phone does not appear on a laptop. This is the honest, correct behaviour for a no-login-required feature and is stated plainly in the empty-state copy already approved in the prototype — do not attempt to backfill this with, e.g., a customer metafield "just in case," since that would require gating on login state, which Section 1.1 explicitly rules out.
- **No expiry/TTL.** Saved items persist until the visitor clears site data or removes them manually. Not flagged as a risk — this matches how every comparable localStorage-based save/wishlist feature on other sites behaves.
- **No server round-trip of any kind for read/write.** Fast, works offline, works identically for a guest and a signed-in customer. The only network calls this feature makes are the product-data fetches needed to *render* the Wishlist page's grid (Section 2, S4) — never to persist the wishlist itself.
- **Cross-tab consistency is a free side effect, not a build requirement.** The browser's native `storage` event fires in *other* open tabs when `localStorage` changes in one tab. `ka-wishlist.js` does not need to explicitly wire this up for the feature to be considered complete, but should not do anything that would break it (e.g. don't switch to `sessionStorage`, which is tab-scoped and would silently break this).

---

## 2. Section-by-Section Breakdown (in build order)

### S0 — Desktop nav icon cluster
**Purpose:** the entry point for Account and Wishlist on desktop, placed with Search/Bag as "things you do," not with the top-level Signature/Collections/Client Diaries links, which stay editorial and exclusive.
**Structure:** two new `.ka-nav__icon-btn` elements inserted into `.ka-nav__actions` between Search and Bag: Account (`<a href="{{ routes.account_url }}">`, person-outline SVG, 24×24 viewBox / 1.4 stroke / round caps — identical spec to Search/Bag) and Wishlist (`<a href="/pages/wishlist">` — or whatever route the new page ends up at, see Section 6 — heart-outline SVG, same spec). Order left to right: Search → Account → Wishlist → Bag.
**Behaviour:**
- Account icon: a small rosegold dot (`.ka-nav__signed-dot`, 7px circle, `--c-rosegold`, positioned top-right of the icon) appears only when `{% if customer %}` is true — a plain presence indicator, no numeral, driven entirely server-side by Liquid's `customer` object (see Section 5, Flag G6 for the one thing to verify here). No JS involved in this specific state.
- Wishlist icon: reuses the **exact same badge component** already used by the Bag icon (`.ka-nav__badge`, rosegold circle, white numeral, `[data-count="0"]{display:none}`) — not a new badge style. Additionally, the heart glyph itself fills rosegold when count > 0 (`.has-saved` class, per Section 1.3 item 1) — the Bag icon has no equivalent fill state, this is Wishlist-specific.
**Motion:** heart fill/unfill uses `--ease-luxury`, `--dur-fast` — a soft settle, not a bouncy pop, matching every other micro-interaction sitewide. Badge count updates instantly (no count-up animation), same as the Bag badge today.
**Responsive:** at ≤900px, Account and Wishlist icons are hidden from `.ka-nav__actions` entirely (`display:none`) — they do not join the mobile action cluster (which stays Search + Bag only, its tested minimum width already hand-tuned to keep the logo centred). They move into the mobile drawer instead (S1).

### S1 — Mobile drawer: two new rows
**Purpose:** mobile equivalent of S0, since the mobile header itself is deliberately left untouched.
**Structure:** two new `.ka-mobile-nav__util-row` elements inserted above the existing "My Bag" row, styled identically to it (same icon size, same row rhythm, same list-row treatment) — not a new row style:
- **My Account** row: person-outline icon, label text server-rendered as `{% if customer %}View Account{% else %}Log In{% endif %}`, links to `{{ routes.account_url }}`. When signed in, the label is additionally preceded by the same small rosegold dot used elsewhere (`.dot`, matching the existing Bag-count numeral's colour language).
- **My Wishlist** row: heart-outline icon, label "My Wishlist", a right-aligned count value in the same rosegold text style already used for the Bag row's count (empty string, not "0", when the wishlist is empty — matches the Bag row's own `{% if cart.item_count > 0 %}...{% endif %}` pattern). Links to the Wishlist page.
**Behaviour:** the Wishlist row's count is a `[data-ka-wishlist-count]` node, kept in sync by the same mechanism as S0's desktop badge (Section 1.3 item 1) — one update function targets both the desktop badge and this mobile row's count span, exactly as `kaUpdateBagCount()` already does for its own two `[data-ka-bag-count]` nodes today.
**Responsive:** n/a — this is the mobile-only surface.

### S2 — Add-to-wishlist heart on the product card (`.ka-p-card`)
**Purpose:** the actual save action, available everywhere a product card renders.
**Structure:** one new element, `.ka-p-card__wish`, a 34px circle button positioned top-right of `.ka-p-card__image` (12px inset), mirroring the existing "Made to Order" badge's top-left position so the two corner treatments read as a matched pair. Contains two stacked SVG hearts (`.heart-line` at rest, `.heart-fill` shown via `.is-saved`) — same construction as the nav icon's heart. Carries `aria-label`/`aria-pressed` that flip between "Save to wishlist"/"Remove from wishlist" and `false`/`true`, and `data-product-handle="{{ product.handle }}"` (Section 1.4).
**Behaviour:** persistent, not hover-only (must work on tap, where there is no hover state). Click/tap calls `kaWishlist.toggle(handle)`, sets `.is-saved` on the button immediately from the returned boolean (instant local feedback, no waiting on the shared event round-trip), and stops propagation so it never triggers the card's own image-link navigation. No popup, no toast — the fill itself is the confirmation.
**Motion:** identical rosegold fill-in as the nav heart — opacity/scale transition on `.heart-fill`, `--dur-fast` / `--ease-luxury`.
**Responsive:** shrinks to 30px circle / 15px icon at ≤600px, matching the grid's own breakpoint.
**Critical build note — this is not one file.** `.ka-p-card` markup is independently duplicated across five render sites, not centralised in one snippet. See Section 5, Flag G1 for the full list and a recommendation.

### S3 — Wishlist page: header
**Purpose:** quiet wayfinding for a utility page the visitor arrives at with intent — same register as the Collection page/Journal index headers, not a hero.
**Structure:** centred `eyebrow` ("Saved For You") + italic serif H1 ("Your Wishlist") + one meta line showing live piece count ("3 Pieces Saved" / "1 Piece Saved").
**Behaviour:** the count text and the header's very visibility (Section S5) are both driven by the client-side grid renderer (S4) — this header is not purely static markup, see S4.
**Responsive:** standard type-scale clamp(), no new breakpoint logic.

### S4 — Wishlist page: populated grid
**Purpose:** show the visitor's actual saved pieces.
**Structure:** `.ka-product-grid` (verbatim, same 3-col/2-col/2-col responsive grid as the Collection page) containing one `.ka-p-card` per saved handle. **This grid cannot be server-rendered** — Liquid has no way to know at request time which products a given visitor's browser has saved. Section 6 covers exactly where this logic lives; functionally, on page load:
1. Read `kaWishlist.getAll()`.
2. If empty, skip straight to S5 (empty state) — do not attempt any fetch.
3. Otherwise, fetch each saved handle's live product data in parallel via Shopify's own storefront JSON endpoint, `/products/{handle}.js` (same-origin, no auth needed, standard Shopify AJAX API — not a new integration).
4. For each successful response, build the `.ka-p-card` markup client-side (title, image, price, fabric metafield if present, "Made to Order" badge if tagged) and inject into the grid — **the same client-side card-building pattern already established and working today in `assets/ka-search.js` for predictive search's result cards**, not a new technique for this codebase. Each built card's heart renders pre-filled (`.is-saved`, since by definition everything here is saved) and wired with `data-wl-remove` behaviour (below).
5. **Edge case the prototype never had to handle, because the build must:** if a fetch for a saved handle 404s (the product was deleted, unpublished, or its handle changed since it was saved), silently drop that handle from the stored array via `kaWishlist.remove(handle)` and skip rendering a card for it — never show a broken/blank card, never throw and abort the rest of the render loop.
6. Update the S3 header's count to the number of cards actually rendered (post-pruning, not the raw saved count) and reveal the grid + header.
**Behaviour — removing an item:** clicking a filled heart on this page removes that card with the exact fade-and-collapse transition already in the prototype (`.is-removing` → opacity/scale to 0 over `--dur-med`/`--ease-luxury`, then the DOM node is removed after the transition completes, ~380ms), calls `kaWishlist.remove(handle)`, and updates the header count live. Removing the last card triggers S5 automatically.
**Responsive:** identical breakpoints to the Collection page's own grid (3 → 2 → 2 columns).

### S5 — Wishlist page: empty state
**Purpose:** the honest, calm "nothing here yet" state — same restrained voice family as the Collection page's own empty state and the Client Diaries "Coming Soon" page, not literally "coming soon" wording (the feature exists; this visitor's list is just empty).
**Structure:** small heart-outline mark → eyebrow ("Your Wishlist") → italic serif H2 ("Nothing Saved, Yet.") → one line of muted body copy → primary CTA ("Explore the Collections") → a small note stating plainly the wishlist lives on-device, no account needed.
**Copy (final, approved — reproduce verbatim):**
- Title: **Nothing Saved, Yet.**
- Body: *"The pieces you return to, gathered in one place. Tap the heart on any piece across the collections to begin your own edit — we'll keep it here, exactly as you left it."*
- CTA: **Explore the Collections** → `/collections`
- Note: *"Saved on this device — no account needed to begin."*
**Behaviour:** shown by default in the page's markup (present in the DOM, hidden) and revealed by the same client-side check that would otherwise populate S4 (Section 2 S4, steps 2 and 6) — this is a toggle between two states of one page load, not two separate templates.
**Responsive:** centred single column at all sizes, max-width 560px.

### S6 — Product page: gallery heart button
**Purpose:** the save action on the product detail page, where `.ka-p-card` doesn't apply.
**Structure:** one new element, `.ka-stage__wish`, a 46px circle button positioned top-right of the gallery stage image (`#ka-stage` / `.ka-stage`, 20px inset) — same construction as S2's card heart (stacked line/fill SVGs, `aria-label`/`aria-pressed`, `data-product-handle="{{ product.handle }}"`), scaled up to suit the much larger hero canvas.
**Deliberately excluded from:** the info panel (protects the page's one purely emotional beat — collection tag → title → poem → rating), the CTA stack (protects the Round 2 CTA-architecture work that makes Add to Bag read as the unambiguous primary action), the sticky desktop minibar, and the mobile sticky action bar (both are pure buy-path furniture — Add to Bag / Book an Appointment / Concierge only; a fourth, non-transactional icon there would crowd the one job those bars exist to do). Do not add a heart to any of these four surfaces even if it seems like a small, convenient addition later — this was an explicit, reasoned rejection in the approved prototype (see `Prototypes/product-page-wishlist-v1.html` Section 3), not an oversight to "complete."
**Behaviour:** identical toggle mechanism to S2 — `kaWishlist.toggle(handle)`, instant local `.is-saved` feedback, no popup/toast. Also updates the nav badge live via the shared event (Section 1.3), so a visitor who saves from the product page sees the header wishlist count bump immediately without navigating away.
**Motion:** identical easing/fill treatment to every other heart on the site, just larger.
**Responsive:** stays top-right at every breakpoint (position never changes, only size) — 46px/21px icon desktop → 40px/18px icon at ≤900px, 14px inset. On mobile the gallery stage is not sticky and sits at the very top of the page, so this heart is the first interactive element a visitor encounters there.

---

## 3. Design Tokens

**Zero new tokens.** Every value used across all three prototypes was checked directly against the live `assets/ka-base.css` `:root` block (not the older `homepage-build-spec.md` token table, which predates a since-shipped rebrand — Cormorant Garamond replaced Bodoni Moda and the rosegold/paper values changed; `ka-base.css` is the current, correct source of truth and is what all three wishlist prototypes actually match) and confirmed identical, value for value:

| Token | Value in `ka-base.css` | Used for, in this feature |
|---|---|---|
| `--c-paper` | `#F7F3EC` | Page/card backgrounds |
| `--c-charcoal` | `#2A2420` | Icon stroke colour, ink |
| `--c-rosegold` | `#9A7B4F` | Heart fill, badge fill, signed-in dot |
| `--c-rosegold-pale` | `#B99B6E` | Empty-state mark stroke |
| `--f-display` | `'Cormorant Garamond', ...` | Wishlist page H1/H2, empty-state title |
| `--f-sans` | `'Jost', ...` | All labels, eyebrows, body copy |
| `--ease-luxury` | `cubic-bezier(0.16, 0.84, 0.44, 1)` | Heart fill transition, card removal transition |
| `--dur-fast` / `--dur-med` | `0.35s` / `0.65s` | Heart fill (`fast`), card removal (`med`) |
| `--line` / `--line-strong` | existing rgba values | Borders, empty-state mark |

No new component classes require a new colour, spacing, or motion value to be invented — every new class (`.ka-nav__signed-dot`, `.ka-nav__wishlist`, `.ka-p-card__wish`, `.ka-stage__wish`, `.wl-header`, `.wl-empty`, etc.) is built entirely from the table above plus the existing `--s-*` spacing scale and `--t-*` type scale.

---

## 4. Content Requirements

**No new photography.** This feature adds no imagery of its own — it reuses whatever product photography already exists via the same card/gallery components everywhere else.

**Copy — final, not placeholder** (all approved in the prototypes, reproduce verbatim):
- Empty state title/body/CTA/note — Section 2, S5.
- Nav aria-labels: "Search", "Log in or view your account", "View your wishlist", "View your bag".
- Mobile drawer row labels: "My Account" (value: "Log In" / "View Account"), "My Wishlist", "My Bag".
- Wishlist page header: eyebrow "Saved For You", H1 "Your Wishlist", meta line pattern "{n} Piece{s} Saved".

**Icons:** all new icons (person-outline for Account, heart-outline/heart-fill for Wishlist) are inline SVG, hand-drawn to the site's existing 24×24 viewBox / 1.4 stroke-width / round-cap spec — no new icon font, no new asset files, no external icon library. The exact path data is already finalised in the prototypes and should be copied verbatim into the Liquid files (see Section 6) rather than redrawn.

**Not blocked / usable as-is:** every visual treatment, motion timing, and interaction pattern in this spec is final, copied directly from the three approved prototypes.

---

## 5. Shopify Platform Feasibility Flags

### G1 — `.ka-p-card` is not one file; the heart needs to be added in five places
**Issue:** unlike a component built once and reused via a snippet, `.ka-p-card` markup is independently hand-written in at least four existing render sites, confirmed by direct inspection of the repo:
1. `sections/ka-collection-grid.liquid` — the canonical, most complete implementation (badge, quick-add veil, separate image-link layer).
2. `sections/ka-search-results.liquid` — its own simplified re-implementation.
3. `sections/ka-article-shop-story.liquid` — its own re-implementation (Journal's shop-the-story cards).
4. `assets/ka-search.js` — builds equivalent `.ka-p-card` markup **client-side from raw JSON** for the predictive-search overlay (`snippets/ka-search-overlay.liquid`'s results).
This feature adds a **fifth** render site (the Wishlist page's own client-built cards, Section 2 S4), which — not coincidentally — needs the exact same client-side card-building technique already proven in #4.
**Recommendation:** at minimum, add the heart button + `data-product-handle` + hydration wiring to all five sites individually — do not assume fixing #1 covers the others, it does not, they are independent markup. **Better, and worth doing now rather than later:** since a fifth client-side card-builder is being written anyway for the Wishlist page, extract one shared client-side card-building function (e.g. `assets/ka-product-card.js`, exporting something like `window.kaBuildProductCard(productJson, options)`) that both `ka-search.js`'s predictive search and the new Wishlist page renderer call, and consider whether the three server-rendered sites (#1–#3) could eventually converge on a single `{% render 'ka-product-card' %}` snippet. This spec does not require the full consolidation — Technical Director's call on scope/timing — but flags it clearly so a sixth future duplication doesn't happen by default.
**Risk:** Low technically (each site is a small, mechanical addition), but genuinely easy to under-scope if only the Collection page is touched — flagging explicitly so QA checks all five sites, not just the obvious one.

### G2 — Account entry point is a link only; no theme template needed for login/account itself
**Issue:** none — this is a confirmed, already-investigated platform constraint (Technical Director's Phase 1 work), not an open question. Restating it here so it isn't accidentally redesigned around during this build: Shopify's New Customer Accounts owns `/account` entirely as a hosted, non-theme surface. One URL (`{{ routes.account_url }}`) handles both the signed-out (login/register) and signed-in (account overview/order history) states — there is no separate "login page" vs. "account page" to build, and no Liquid template/section for either.
**Recommendation:** the Account icon and mobile "My Account" row are the entire build surface for this part of the feature — a link, a Liquid `{% if customer %}` check for the dot/label, nothing more. Do not attempt to build a themed login form, an embedded account panel, or a custom order-history view — the platform does not support intercepting or theming that flow from theme code.
**Risk:** None — this is a hard platform boundary, not a build risk.

### G3 — Order-history styling happens in Shopify's branding editor, not in theme code — a required manual Admin action
**Issue:** because `/account` is Shopify-hosted (G2), matching its visual presentation (logo, colours, type) to the K&A brand cannot be done by writing theme files at all — it is configured separately, in Shopify Admin's own branding settings for Customer Accounts (Settings → Customer accounts → Branding, or the equivalent Admin path for whichever Customer Accounts version is active on this store).
**Recommendation:** this is a standalone action item, not a Technical Director build task — flagging it explicitly here so it does not get silently missed the way a code-only checklist would miss it. **Suraj/Admin needs to**, at minimum: upload the K&A logo, set the accent colour to `--c-rosegold` (`#9A7B4F`), and set typography to match the storefront as closely as the branding editor's controls allow (it will not support Cormorant Garamond/Jost exactly — Shopify's Customer Accounts branding editor offers a constrained font picker, not arbitrary custom fonts). Technical Director cannot perform this step from the repo; it should be tracked as its own checklist item and confirmed done (per this project's standing "never assume a manual external setup step is done — ask explicitly" rule) before this feature is considered fully shipped, not just before the theme-code portion ships.
**Risk:** None technically. Real risk if skipped: the account/order-history pages a customer reaches from the new nav icon will look visually generic/un-branded relative to the rest of the site, which is a real luxury-perception gap even though it involves zero lines of theme code.

### G4 — New page template + a required manual page-template assignment step
**Issue:** no Wishlist page exists yet. Following the exact same pattern already used successfully for About Us, Client Diaries, and FAQ (all confirmed in the repo): a new `templates/page.wishlist.json` needs a corresponding live Shopify Page (title "Wishlist" or similar, handle `wishlist`) with its Theme template explicitly set to `wishlist` from Shopify Admin (Online Store → Pages → [the page] → Theme template dropdown) — **this cannot be done from theme code/git alone**, same caveat already documented for every prior new page in this project.
**Recommendation:** create the Shopify Page if it doesn't exist, then set its template — track as a manual step alongside the template/section build, not assume it happens automatically on deploy.
**Risk:** Low, but a known recurring miss pattern on this project (flagged identically for About Us, Client Diaries, FAQ) — call it out explicitly in the release checklist for this feature.

### G5 — Detecting signed-in state server-side needs a quick empirical confirmation
**Issue:** the desktop signed-in dot and the mobile "Log In"/"View Account" label both rely on Liquid's standard `{% if customer %}` object. This is the correct, standard mechanism and is expected to work unchanged under Shopify's New Customer Accounts (the classic `customer` Liquid object is documented to continue populating on the storefront regardless of which account system is active) — but this project's own Phase 1 investigation already found one New-Customer-Accounts-specific surprise (the link-only `/account` constraint), so this should be empirically verified on staging with a real logged-in test customer rather than assumed from documentation alone.
**Recommendation:** during staging QA, log in as a real customer and confirm the rosegold dot / "View Account" label actually appear — a five-minute check, not a build task, but worth its own explicit QA line item given the precedent.
**Risk:** Low — if `customer` doesn't populate as expected for some account-system-specific reason, the fallback (always showing "Log In"/no dot) is not broken, just less polished; not a functional blocker either way.

### G6 — Wishlist state cannot be server-rendered; the page must be built as a client-hydrated shell
**Issue:** covered in depth in Section 1 and Section 2 (S4) — restating here as a platform-feasibility item because it's the one place this feature diverges from every other page built in this project so far (all of which are fully server-rendered Liquid). The Wishlist page's product grid is structurally different from every other grid on the site: it cannot use `{% for product in collection.products %}` because Liquid has no access to a given visitor's `localStorage` at request time.
**Recommendation:** build exactly as specified in Section 2 S4 — empty grid container + hidden empty-state markup in the initial HTML, populated/toggled entirely by `assets/ka-wishlist.js` (or a page-specific script it delegates to) using Shopify's own `/products/{handle}.js` AJAX endpoint. This is a well-understood, standard Shopify pattern (the same JSON endpoint Dawn's own quick-add and cart drawer use) — not a new integration or app dependency.
**Risk:** Low technically. The one real UX risk is a visible loading gap between page paint and the grid populating if many items are saved and fetches are slow — not a launch blocker, but worth a simple loading affordance (even just the existing `.reveal-img` fade-in already used elsewhere) rather than a hard content jump. Flag as a small polish item, not a structural risk.

### G7 — Product-handle stability
**Issue:** because the wishlist stores handles (Section 1.1), a merchant renaming a product's handle in Shopify Admin (which changes its URL) will orphan any existing saved reference to it. Shopify auto-creates a URL redirect when a handle changes, but the *stored* handle in a visitor's `localStorage` won't itself update to the new one.
**Recommendation:** Section 2 S4 step 5's fetch-failure pruning already handles the *worst* case (product deleted/unpublished) gracefully. A renamed-but-still-live product is a softer case: `/products/{old-handle}.js` will typically still resolve correctly through Shopify's redirect for a JSON fetch in most configurations, but this should be spot-checked in QA rather than assumed. If it does 404, the same auto-prune logic in step 5 handles it safely (worst case: the item silently drops off the visitor's wishlist rather than showing broken).
**Risk:** Low — an edge case with a graceful existing fallback, not a new failure mode to design around.

---

## 6. File Map — exactly where this build lands

| File | Change |
|---|---|
| `sections/ka-nav.liquid` | Add Account + Wishlist icon-buttons to `.ka-nav__actions` (S0); add My Account + My Wishlist rows to the mobile drawer, above My Bag (S1). Both use `{% if customer %}` for account state — no new Liquid object needed. |
| `assets/ka-nav.css` | New rules for `.ka-nav__signed-dot`, `.ka-nav__wishlist` heart-fill states, `.ka-mobile-nav__util-row` reuse for the two new rows (all copied from the prototype's CSS, which was itself written as a direct extension of this file's existing patterns). |
| `sections/ka-collection-grid.liquid` | Add `.ka-p-card__wish` button + `data-product-handle` to the canonical card markup (S2). |
| `sections/ka-search-results.liquid` | Same addition, independently (Flag G1). |
| `sections/ka-article-shop-story.liquid` | Same addition, independently (Flag G1). |
| `assets/ka-search.js` | Add the same heart markup to its client-built predictive-search cards (Flag G1); wire hydration. |
| `assets/ka-collection-grid.css` | New rules for `.ka-p-card__wish` and `.ka-p-card.is-removing` (shared by every site that renders `.ka-p-card`, since this stylesheet is already loaded sitewide via `ka-nav.liquid` — confirmed in the existing file, not a new load). |
| **`assets/ka-wishlist.js`** *(new)* | The shared data-model module (Section 1.2/1.3): `window.kaWishlist` (`getAll`/`has`/`add`/`remove`/`toggle`), the `ka:wishlist:change` event dispatch, sitewide hydration of every heart button + the nav badge/mobile-row count on load, and delegated click handling for every `.ka-p-card__wish` / `.ka-stage__wish` on the page (event delegation from `document`, so it works uniformly whether a card was server-rendered or built client-side). |
| `layout/theme.liquid` | Add `<script src="{{ 'ka-wishlist.js' \| asset_url }}" defer></script>` near the existing `ka-theme.js`/`ka-currency.js` script tags — unconditional, not gated behind a settings toggle (unlike currency). |
| **`templates/page.wishlist.json`** *(new)* | References `ka-nav`, a new `ka-wishlist-main` section, reused `ka-appointment` (optional closing CTA — Creative Director's call left open, prototype doesn't include one; simplest correct choice is to omit it and end on the empty/populated grid, matching the prototype exactly), and `ka-footer`. Same structure convention as `templates/page.faq.json`. |
| **`sections/ka-wishlist-main.liquid`** *(new)* | Renders S3 (header, with live count text left blank/placeholder server-side since JS owns it), the empty `#wlGrid` container for S4, and the hidden S5 empty-state markup — the client-hydrated shell described in Flag G6. |
| **`assets/ka-wishlist-main.css`** *(new)* | `.wl-header`, `.wl-empty` and its children — everything not already covered by the sitewide-loaded `ka-collection-grid.css` (which the grid itself reuses verbatim). |
| `sections/ka-product-main.liquid` | Add `.ka-stage__wish` button + `data-product-handle` to the gallery stage (S6). |
| `assets/ka-product-main.css` | New rules for `.ka-stage__wish` and its ≤900px size variant. |

**Not touched:** `sections/ka-footer.liquid` (no wishlist/account link specified in any approved prototype — not adding one speculatively), any cart/checkout file, any customer/account template (none exists or is needed, per Flag G2).

---

## 7. Build Complexity Estimate

**Overall: Moderate.**

- **Simple, individually:** S0/S1 (nav icons + drawer rows) — small, mechanical additions to an already-well-understood shared section, following an exact existing precedent (`kaUpdateBagCount()`/`[data-ka-bag-count]`) closely enough that there's little to design. S6 (product-page heart) is similarly simple — one button, one class, no new data flow beyond what S2 already establishes.
- **The real complexity is concentrated in three places**, all in Section 1/2's data-model work:
  1. Building `assets/ka-wishlist.js` itself — not hard individually, but it's genuinely new sitewide state-management surface for this project (nothing else in the theme currently manages cross-component client-side state via a custom event; the closest precedent, `ka-currency.js`, is display-only and doesn't drive multiple independent UI surfaces the way this does).
  2. The Wishlist page's client-hydrated grid (S4/Flag G6) — the first page in this project that cannot be server-rendered from Liquid alone, including its own edge-case handling (fetch failures, auto-pruning stale handles).
  3. Touching five independent render sites for the card heart (Flag G1) rather than one — mechanically simple per-site, but real total surface area, and the one place scope is easy to under-estimate if only the obvious file is touched.
- **Not complex:** no new Shopify resource type, no app, no checkout-adjacent logic, no metafields, no customer-account theming (explicitly out of scope per Flag G2/G3). Every visual component is copied near-verbatim from already-approved patterns (`.ka-p-card`, `.ka-collection-empty`, the nav badge).
- **Comparable reference point:** more architecturally novel than any prior page in this build (Home/About/Client Diaries/Journal/FAQ), despite touching less new visual surface than most of them — the complexity here is in cross-page state synchronisation, not in layout or photography, which is a different kind of build risk for Technical Director to plan around (more JS-architecture review, less pixel-fidelity review).

---

## Summary — Action Items Before/During Build

1. **Build `assets/ka-wishlist.js` first**, before touching any of the five card-render sites or the product page — every other change in this feature depends on its `window.kaWishlist` API and event contract existing and being stable (Section 1).
2. **Touch all five `.ka-p-card` render sites**, not just `ka-collection-grid.liquid` (Flag G1) — consider consolidating into a shared card-builder while a fifth site is being added anyway.
3. **Track G3 (Customer Accounts branding) as its own manual Admin action item for Suraj**, separate from the theme-code deploy — it will not happen as a side effect of shipping this build.
4. **Track G4's manual page-template assignment** the same way every prior new page in this project has required.
5. **QA must verify G5 (signed-in state) with a real logged-in test customer on staging**, and G6/G7's failure paths (a saved product that's since been deleted/unpublished/renamed) — none of these are visible in the static prototypes and are easy to skip in a fidelity-only QA pass.
