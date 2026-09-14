# Welcome Offer Popup (KLP3000) — Build Specification
**Document version:** 1.0
**Date:** 14 September 2026
**Prototype source:** `Prototypes/welcome-offer-popup-v1.html`
**Status:** Approved. Suraj reviewed the Creative Director's summary together with this spec and the prototype (`Prototypes/welcome-offer-popup-v1.html`) directly in the Website Engineering session and gave explicit, real-time sign-off ("ok lets build it") on 2026-09-14, immediately clearing Phase 4 and authorizing the Technical Director to build. (This line originally read "Not yet approved — do not build until Phase 4 sign-off"; it was left unupdated after that approval, which independent QA correctly flagged as a stale-doc contradiction against the build that followed — updated here to record what actually happened, not a process violation.)
**Requested by:** Suraj, directly — the coupon (KLP3000, ₹3,000 off a customer's first purchase) already exists and is already live in Shopify. This spec covers only the on-site mechanism that surfaces it.

---

## 0. Executive Summary and Recommendation

**Recommendation:** a sitewide, engagement-triggered invitation card — not a homepage-only popup, not an exit-intent popup, and deliberately not styled like a conventional ecommerce discount popup. It shows itself once a visitor has demonstrated real interest (scrolled meaningfully or stayed a while), reveals the code immediately with no email wall, offers auto-apply at checkout as the primary path, and stops showing itself permanently to anyone who has already claimed it or already bought from us.

**One thing worth stating plainly:** my standing brief for this site includes "never recommend popups," aimed squarely at the flashing-banner / countdown-timer / spinning-wheel genre that would actively damage this brand's positioning. Suraj asked for this one directly, coupon and mechanism already decided, and asked specifically for my judgment on how to do it well. So this spec is not a reversal of that instinct — it's the instinct applied *inside* a real, explicit request: design the most restrained version of this mechanism that still does its job, and refuse every generic pattern that would make it feel like a markdown sale rather than a welcome gesture. Every decision below is argued against that standard, not assumed.

**The core reframe driving every design choice:** at this price point (₹30,000–280,000+), ₹3,000 is roughly 1–10% of an order — genuinely too small to be the *reason* someone buys, and trying to make it feel like a bargain would just look confused about its own scale. Its real job is emotional, not financial: a confident first gesture from the house to someone considering it for the first time. Every visual and copy decision treats it that way — "a welcome," never "a discount," "with our compliments," never "% OFF."

---

## 1. Placement — Where It Appears, and Why

**Sitewide (all templates except cart and — irrelevant to theme code — checkout), not homepage-only.**

Reasoning: this offer is for *first-time* visitors, and K&A's actual first-touch traffic does not reliably land on the homepage. The brand has a strong Instagram presence and runs celebrity/editorial features (`sections/ka-celebrity.liquid`) — a meaningful share of new visitors arrive via a direct link to a specific product, collection, or Client Diaries entry, never touching `/`. Restricting the offer to homepage-only would under-serve exactly the audience it exists for. The eligibility gate (Section 2) already does the real targeting work — *who* sees it — so *where* it can appear should be "everywhere a first-time visitor might land," not artificially narrowed to one template.

**Explicitly excluded:**
- **Cart page.** A visitor at the cart is transacting, not browsing. An unrelated modal at that moment reads as a hard-sell interruption, not a welcome — the one place this mechanism would flip from gracious to pushy.
- **Checkout.** Off-theme (Shopify-hosted), not reachable by theme code regardless.
- Any moment another overlay (search, mobile nav drawer) is already open — see Section 7, Interaction Rules.

**Trigger type: engagement-gated, not entry, not exit-intent.** Considered and rejected:
- **Immediate on-load popup.** The single most damaging option for this brand specifically — CLAUDE.md's "never crowded, never loud" and "slow browsing experience" principles are direct casualties of a popup that fires before a visitor has even seen the page. It also reads as begging rather than inviting, the opposite of the confident posture a couture house needs.
- **Exit-intent (mouse-leaves-viewport).** Rejected on two grounds, not one: it doesn't work at all on mobile (no cursor to track), and a brand with "strong Instagram presence" almost certainly skews mobile-heavy for first-touch traffic, so an exit-intent-only trigger would simply miss most of its intended audience. Separately, the emotional register is wrong regardless of device: an offer extended *as someone is leaving* reads as chasing them; the same offer extended *while they're engaged* reads as attentive service. Luxury brands don't plead at the door.
- **Scroll depth OR dwell time, whichever comes first (recommended).** Fires only after a visitor has actually looked — scrolled roughly 60% of the page they landed on, or spent about 25 seconds on the site, whichever happens first. This means a visitor who reads intently without scrolling far (a long product description, say) still gets the invitation at a reasonable moment, and a visitor who scrolls fast gets it once they've clearly engaged rather than bounced. Both signals are implemented and demonstrable in the prototype's live scroll demo (`Prototypes/welcome-offer-popup-v1.html`, Section A).

---

## 2. Timing, Trigger and Frequency Rules

**Eligibility gate — every condition below must be true, checked before any trigger logic runs:**

1. **Not a returning customer.** `{% if customer and customer.orders_count > 0 %}` → never eligible. Checked server-side in Liquid, so a logged-in repeat customer never even receives the client-side trigger script's chance to fire — showing a "welcome, first purchase" offer to someone who has already bought from us would look sloppy, not generous, and undermines the relationship the brand has already built with them.
2. **No prior claim on this device.** `localStorage` key `ka_welcome_offer` — a `{state:"claimed", ts:...}` record suppresses the offer **permanently** on that device. Once someone has the code (copied it, clicked through, or had it emailed), continuing to show a "welcome" card is not enthusiasm, it's carelessness.
3. **No recent dismissal.** A `{state:"dismissed", ts:...}` record suppresses for **30 days**. One graceful re-invitation a month respects a visitor who simply wasn't ready, without becoming a nag. After 30 days with no further action, normal eligibility resumes.
4. **Not already shown this session.** A `sessionStorage` flag caps it at once per browsing session even if the visitor re-triggers scroll/dwell conditions by navigating between pages within the same visit.
5. **Not on the cart page**, and not while another overlay (search, mobile drawer) is open (Section 7).

**Why localStorage/sessionStorage, not cookies, and why these specific durations:** matches the existing pattern already established in this codebase (`ka_currency_override` in `assets/ka-currency.js`, `ka_wishlist` per the Account/Wishlist build spec) — client-side only, no server round-trip, no cookie-consent complexity. 30 days for a dismissal (long enough not to nag, short enough that a genuinely interested visitor who wasn't ready in August might see it again in September) and permanent for a claim are judgment calls, not platform constraints — Suraj should feel free to adjust either number; nothing about the mechanism depends on these exact values.

---

## 3. Visual Design

Full working prototype: `Prototypes/welcome-offer-popup-v1.html` (open it, scroll the live demo section to see the real trigger fire, and use the demo control bar to walk through every suppression state).

**Every token used was checked directly against `assets/ka-base.css`'s `:root` block — nothing new introduced:**

| Token | Value | Used for |
|---|---|---|
| `--c-paper` | `#F7F3EC` | Card background |
| `--c-paper-deep` | `#EFE8DD` | Code plate background |
| `--c-charcoal` | `#2A2420` | Title/body ink, primary CTA fill |
| `--c-rosegold` / `-2` / `-pale` | `#9A7B4F` / `#7E6440` / `#B99B6E` | Eyebrow, hairline rule, copy-link, hover states |
| `--line` / `--line-strong` | existing rgba values | Card border, code-plate border, dismiss-row rule |
| `--f-display` | Cormorant Garamond | Title (italic, matching `ka-appointment.liquid`'s title register) |
| `--f-sans` | Jost | Eyebrow, body, buttons, fine print |
| `--ease-luxury` | `cubic-bezier(0.16, 0.84, 0.44, 1)` | Card open/close transition |
| `--dur-med` / `--dur-fast` | `0.65s` / `0.35s` | Open transition / hover states |

**Deliberately absent, itemised because each is a common default in this genre of component that was actively rejected, not overlooked:**
- No percentage-off badge or "₹3,000 OFF!" burst treatment — the code plate presents the code the way a name-card presents a name, not the way a sale banner shouts a number.
- No countdown timer, no "X people claimed this today," no red/orange urgency colour anywhere.
- No full-screen takeover on any breakpoint — desktop is a bounded 460px card over a soft 42%-charcoal, 3px-blur scrim (not a hard blackout); mobile is a bottom sheet that leaves the page visible above it.
- No confetti/bounce/spring motion — the open/close transition uses the same `--ease-luxury` "soft settle" already used for every other micro-interaction sitewide (nav heart fill, card reveals).

**Layout, desktop:** centred card, thin single hairline rule beneath the eyebrow in place of any photography (kept text-led and quiet — closer to a note than a marketing tile), generous internal padding (46px/42px), one code plate, one primary action, one secondary (email) option, fine print, and a soft text-link dismissal ("Not today") beneath a full × close button in the corner — both are offered because a considered visitor may want a formal, worded way out, not just an icon.

---

## 4. Copy

Checked against the established voice in `sections/ka-manifesto.liquid` ("Every lehenga, every corset, every draped silhouette — handcrafted...") and `sections/ka-appointment.liquid` ("Begin with a\nConversation.") before writing anything new — short declarative fragments, first-person-plural warmth, no exclamation points, title-case line breaks in the display serif.

**Final copy, approved for build once Suraj signs off on the prototype:**

- **Eyebrow:** A Welcome, From Us
- **Title:** Consider This / Our Welcome. *(two-line break, italic serif, same construction as the Appointment section's title)*
- **Body:** "Every piece we create begins with a conversation — a fitting, a fabric chosen, a silhouette considered. As you begin yours, please accept ₹3,000 toward your first, with our compliments."
- **Code label:** Your Code
- **Code:** KLP3000
- **Copy button:** Copy → Copied (2.2s, then reverts)
- **Primary CTA:** Begin Shopping
- **Email toggle:** Prefer it by email? →
- **Email note (shown once the field is open):** "We'll also add you to The Inner Circle — collection previews and styling notes, delivered quietly. Unsubscribe anytime." *(direct echo of the footer's own Inner Circle description, so the two capture points read as one relationship, not two)*
- **Email success state:** "Sent. And welcome to The Inner Circle."
- **Fine print:** "Valid toward your first order. One use per customer. Not combinable with other offers." *(exact terms to be confirmed against the live Shopify discount's actual configured rules — see Flag F3)*
- **Dismiss link:** Not today

Notably absent by design: the word "discount," the word "sale," any exclamation mark, any "limited time" framing (it isn't limited-time, and manufacturing urgency around a standing first-purchase gesture would be exactly the "fake urgency" this brand's principles rule out).

---

## 5. Mechanism — How KLP3000 Actually Reaches the Customer

**Recommended: both auto-apply-on-click-through and always-visible plain code, together — not an either/or choice.**

- **Primary path ("Begin Shopping"):** Shopify natively supports discount deep links — `https://karishmaashita.com/discount/KLP3000?redirect=/collections/all` applies the code to the visitor's checkout session and redirects, with zero app dependency and zero custom backend. This is a real, standard, documented Shopify mechanism, confirmed feasible for this platform (flagged per the project's standing practice of calling out anything that depends on platform behaviour). Clicking through means the code is already active by the time the visitor reaches checkout — no manual entry, no risk of a mistyped code.
- **Why the plain code still needs to stay visible, not hidden behind that link alone:** K&A is a considered, made-to-order purchase in the ₹30,000–280,000+ range — nobody buys a piece like this in the same session they first hear about it. Shopify's auto-applied discount session is not guaranteed to persist across a multi-day gap (browser closed, different device, cart abandoned and resumed later), and this project has no visibility into exactly how long that session state survives without direct testing against the live store. The plain, copyable code is the resilient fallback that works regardless: whenever they do reach checkout, days or weeks later, on a different device, "enter code KLP3000" always works, "still has an auto-applied session from three weeks ago" might not.
- **Why no email gate on the code itself:** the code is not secret — it's already live in Shopify and presumably discoverable. Gating it behind a mandatory email form would turn a welcome gesture into a lead-generation trade, which is the exact transactional feeling this design is built to avoid. Email is offered as a *convenience* ("prefer it by email?"), never a requirement.

**Interaction with the existing Inner Circle newsletter capture (`sections/ka-footer.liquid`):** recommend the popup's optional email field **feeds the same subscription mechanism**, not a second disconnected list. Concretely: reuse the identical `{% form 'customer' %}` pattern already in `ka-footer.liquid`, with `contact[tags]` set to `newsletter,ka-correspondence,welcome-offer-KLP3000` — the extra tag lets Suraj (or whoever manages email marketing) distinguish "joined via the welcome offer" from "joined via the footer" for attribution, without maintaining two separate capture flows or two separate consent records for the same customer relationship. Reasoning for merging rather than keeping them separate: both are, at heart, "we'd like to stay in touch" moments: the popup's own copy already says so explicitly ("We'll also add you to The Inner Circle"), so the visitor is told plainly what submitting the field does — no surprise opt-in.

**What "claim" means for suppression purposes (Section 2):** copying the code, clicking "Begin Shopping," or submitting the email form all mark the device as `claimed` — any one of those three means the visitor now has the code by whichever means they chose, so the offer should stop re-surfacing regardless of which path they took.

---

## 6. Mobile Behavior

Not an afterthought — a distinct layout, specified explicitly:

- **Bottom sheet, not a centred modal and not a full-screen takeover.** Slides up from the bottom edge with rounded top corners (18px) and a small drag-handle bar, leaving the page visible above the scrim. This is a deliberate departure from simply shrinking the desktop card: a full-bleed mobile modal on a small screen reads as an ambush that blocks the whole page; a bottom sheet reads as a note being slipped in, matching the "quietly luxurious" register the desktop card also aims for.
- **Dismissal is one-thumb-reachable four ways:** swipe down on the sheet, tap the scrim above it, the × in the corner, or the "Not today" text link at the bottom — no dismissal path requires reaching across the screen.
- **Trigger logic is identical** (scroll % / dwell time, same eligibility gate) — mobile visitors are not a separate targeting case, only a separate layout.
- **Breakpoint:** ≤640px switches from the desktop centred-card CSS to the bottom-sheet CSS (see prototype's `@media (max-width: 640px)` block) — chosen to match, not diverge from, the breakpoint conventions already used elsewhere in this theme's own CSS files.
- **Max height 88vh with internal scroll** if the card's content (unlikely, given its length, but specified for safety) would otherwise exceed the viewport on a short device.

---

## 7. Section/Component Breakdown and Interaction Rules

| Element | Purpose |
|---|---|
| `.ka-welcome-scrim` | Fixed, full-viewport overlay layer (backdrop + centring/anchoring), `is-open` class toggles visibility |
| `.ka-welcome` | The card itself — desktop centred, mobile bottom-sheet via breakpoint |
| `.ka-welcome__close` | Icon dismissal (×), top-right, `aria-label="Close"` |
| `.ka-welcome__code` | The code plate — label, monospaced-feeling serif code, Copy button |
| `.ka-welcome__cta` | Primary action — the Shopify discount deep-link |
| `.ka-welcome__email-toggle` / `__email-form` | Optional, collapsed-by-default email capture, expands in place |
| `.ka-welcome__dismiss` | Worded dismissal ("Not today"), beneath the fine print |

**Interaction rules:**
- Opens via the trigger logic in Section 2, never any other way (no manual re-trigger button exists in the live build — the prototype's demo control bar is presentation-only, not part of the shipped feature).
- **Mutual exclusion with other overlays.** If the search overlay (`#ka-search-overlay`) or mobile nav drawer is open when the trigger condition is met, defer opening the welcome card until that overlay closes, rather than stacking two modals. If the welcome card is already open and a visitor opens search or the mobile drawer, close the welcome card first (treat as a soft dismiss, not a claim) so only one overlay is ever visible at a time.
- `Escape` key closes (soft dismiss). Focus moves to the close button on open; returns to the triggering scroll position on close (no explicit focus-return target needed since opening isn't itself a click action).
- `z-index`: above the utility bar (101) and nav (100) — recommend 400, comfortably clear of both, matching the layering headroom already used by the toast component (160) and leaving room below it for anything that should still interrupt the welcome card itself in future (there is nothing that needs to today).

---

## 8. Shopify Platform Feasibility Flags

### F1 — Discount deep-link auto-apply is a native Shopify mechanism, not a custom build
**Issue:** none — confirmed standard Shopify behaviour (`/discount/{code}?redirect={path}`), not dependent on any app or custom backend.
**Recommendation:** Technical Director should still do a live smoke test against this store's actual checkout once staged (confirm the code applies and is visible in checkout at the standard 3-decimal or whole-rupee display, and confirm the `redirect` param lands where expected) before considering this shipped — a "should work per Shopify's documented behaviour" is not the same as "confirmed working on this specific store's checkout configuration."
**Risk:** Low.

### F2 — Discount session persistence across a multi-day gap is unverified, not assumed safe
**Issue:** Section 5 already designs around this (plain code stays visible regardless), but flagging explicitly: this spec does not know, and has not tested, how long Shopify keeps an auto-applied discount code active in a visitor's session if they close the browser and return days later without ever reaching checkout. This affects only the "how reliable is the auto-apply convenience" question, not the offer's core function — the plain code is the safety net either way.
**Recommendation:** no build blocker; Technical Director can note actual observed behaviour during staging QA for Suraj's information, but should not delay the release waiting on it.
**Risk:** None to the feature's correctness; low informational gap only.

### F3 — Fine-print terms need confirmation against the coupon's real, configured Shopify rules
**Issue:** the fine print above ("Valid toward your first order. One use per customer. Not combinable with other offers.") reflects the coupon as described in the brief, not a direct read of KLP3000's actual configured settings in Shopify Admin (usage limits, customer eligibility restrictions, combination rules).
**Recommendation:** before shipping copy, Technical Director or Suraj should confirm the live discount's actual settings match this wording exactly — if, for example, it's *not* actually restricted to one use per customer at the Shopify level, the popup should not claim it is.
**Risk:** Low technically, but a real trust/legal-accuracy risk if the printed terms don't match the coupon's real behaviour — flagging so it isn't shipped on assumption.

### F4 — Newsletter tag merge requires no new Shopify configuration
**Issue:** none — `contact[tags]` accepts an arbitrary comma-separated list via the standard `{% form 'customer' %}`, exactly as `ka-footer.liquid` already uses today. Adding `welcome-offer-KLP3000` as a third tag alongside the two already in use is a one-line change with no platform risk.
**Risk:** None.

### F5 — `customer.orders_count` is a standard Liquid object, expected to work unchanged
**Issue:** the eligibility check in Section 2 relies on `customer.orders_count`, standard under both classic and New Customer Accounts (this project's account/wishlist build already confirmed `{% if customer %}` itself works correctly under New Customer Accounts — see `Docs/account-wishlist-build-spec.md` Flag G5).
**Recommendation:** spot-check with a real logged-in test customer who has at least one prior order during staging QA, same precedent as G5 in that spec — a five-minute check, not a build task.
**Risk:** Low — if it somehow doesn't populate as expected, the safe fallback is showing the offer to someone who's already purchased (a mild miss, not a broken feature).

---

## 9. File Map

| File | Change |
|---|---|
| **`sections/ka-welcome-offer.liquid`** *(new)* | Renders the card + scrim markup (Section 7), server-side eligibility pre-check (`{% unless customer and customer.orders_count > 0 %}` wraps the whole section so ineligible customers never even receive the markup), reads `settings`/`section.settings` for the code, copy strings, and redirect target so Suraj can edit copy from the theme editor without a code change. |
| **`assets/ka-welcome-offer.css`** *(new)* | All rules in Section 3, including the ≤640px bottom-sheet breakpoint. |
| **`assets/ka-welcome-offer.js`** *(new)* | Trigger logic (scroll/dwell), eligibility check against `localStorage`/`sessionStorage`, open/close/copy/email handlers, mutual-exclusion check against the search overlay and mobile drawer's own open state (Section 7). |
| `layout/theme.liquid` | Render `ka-welcome-offer` once, sitewide, excluding the cart template (`{% unless template == 'cart' %}`) — same unconditional-load tier as `ka-wishlist.js`, not gated behind a settings toggle. |
| `sections/ka-footer.liquid` | **Not changed.** The popup's email form posts through its own instance of the same `{% form 'customer' %}` pattern, independently — no shared markup, just a shared tag convention (Section 5). |

**Not touched:** cart/checkout logic (auto-apply is a native redirect, not custom checkout code), any customer/account template, the utility bar (`sections/ka-nav.liquid` — considered and rejected as the mechanism, Section 1 / prototype's closing note).

---

## 10. Build Complexity Estimate

**Overall: Simple–Moderate.**

- **Simple:** the card markup/CSS itself — one new section, no new design tokens, direct reuse of existing button/eyebrow patterns.
- **The one genuinely new piece of logic:** the trigger/eligibility engine (scroll-or-dwell detection + the three-state `localStorage` suppression model). This is a smaller, more self-contained version of the same kind of client-side state management already built for the wishlist feature (`assets/ka-wishlist.js`) — real but bounded complexity, with a working reference implementation already in this project to follow.
- **Not complex:** no new Shopify resource, no app, no metafields, no checkout-adjacent custom code (the discount deep-link is a native redirect). The mutual-exclusion check against the search overlay/mobile drawer (Section 7) is the only cross-component coordination this feature needs, and both of those components' open/closed state are already simple, inspectable DOM attributes.
- **Comparable reference point:** smaller in scope than the Account/Wishlist feature (one new section vs. five render-site touches), but introduces the same *category* of new capability to this theme — sitewide client-side state that persists across page loads and governs whether a component renders at all.

---

## Summary — Action Items Before/During Build

1. **Confirm F3** (KLP3000's actual configured Shopify rules) before finalising the fine-print copy — do not ship the current wording on assumption.
2. **Build the eligibility/trigger engine first**, same sequencing lesson as the wishlist feature — every visual state depends on it being correct before it's worth wiring up the markup.
3. **QA must verify F5** (signed-in customer with prior orders never sees the offer) with a real test customer on staging, and must verify the mutual-exclusion behaviour against the search overlay and mobile drawer (Section 7) — neither is visible in a static fidelity check of the card alone.
4. **This is a genuine, if restrained, popup mechanism** — hold it to the same "does this make K&A feel more exclusive, more luxurious, more desirable" test as everything else before merging to Live, not just a fidelity-to-prototype check.
