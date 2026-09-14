# Welcome Offer Popup (KLP3000) — Build Specification
**Document version:** 2.0 (revised)
**Date:** 14 September 2026
**Prototype source:** `Prototypes/welcome-offer-popup-v2.html` (`v1.html` retained for reference/history only — no longer the current version)
**Status:** v1 was built, staged, and reviewed by Suraj on the live staged build. This v2 reflects his three requested changes below and is ready for a fresh Phase 4 review before Technical Director re-implements it.
**Requested by:** Suraj, directly — the coupon (KLP3000, ₹3,000 off a customer's first purchase) already exists and is already live in Shopify. This spec covers only the on-site mechanism that surfaces it.

---

## Revision History

**v2.1 (typography fix, same v2 prototype file, updated in place) — code plate baseline bug:**

Suraj reviewed v2 and flagged a real rendering bug in the code plate: "KLP" and "3000" in "KLP3000" were not sitting on one flat baseline. **Diagnosed cause:** the code was set in `--f-display` (Cormorant Garamond), and that typeface draws its digits as old-style (text) figures — designed to blend with lowercase text, not to align flush with capital letters — so the caps and digits genuinely sit at different heights within the same string; this was not an optical illusion or a spacing/`vertical-align` artifact. **Fix:** the code specifically (only the code — the oversized amount stays in `--f-display`) now uses `--f-sans` (Jost), a geometric sans already in this project's stack with uniform lining figures, plus an explicit `font-variant-numeric: lining-nums tabular-nums` as a defensive guarantee rather than relying on an unstated font default. Font-size trimmed 1.7rem → 1.5rem and letter-spacing 0.1em → 0.08em, only to compensate for Jost's caps reading visually larger/bolder than the serif did at the same size — the code plate's prominence and position relative to the amount are otherwise unchanged. See Section 3 for the updated token table and reasoning. No other part of v2 changed.

**v2 — three specific changes from Suraj's review of the staged v1 build:**

1. **Email capture removed entirely.** No "email this to yourself" field, no form, no tie-in to the footer's Inner Circle newsletter signup. The card is offer + code + CTA only.
2. **Amount and code are now the clear visual focus.** ₹3,000 is now the single largest, highest-contrast element in the card; the code plate is enlarged and more clearly bordered. Both were switched from v1's softer rosegold treatment to charcoal/higher-contrast presentation specifically because "unmistakable at a glance" is a legibility requirement, not just a size one — rosegold-on-paper tested as too low-contrast for that job.
3. **Copy cut to the essentials.** The long explanatory paragraph is gone (replaced by a seven-word line); fine print is now one compact line instead of a full sentence with three clauses; the separate italic headline is dropped since the oversized amount now does that job.

**Everything below that is NOT called out as changed carries over unchanged from v1:** the engagement-based trigger (scroll-or-dwell, never on-load, never exit-intent), the eligibility/suppression rules (never to returning customers, permanent suppression once claimed, 30-day cooldown after a dismissal, once per session), the mutual-exclusion behaviour with the search overlay/mobile drawer, the mobile bottom-sheet mechanics, the discount deep-link mechanism, and the overall reasoning for why this exists as a restrained popup rather than a utility-bar message. Those sections are reproduced below largely as-is, trimmed only where the copy/email changes require it.

---

## 0. Executive Summary and Recommendation

**Recommendation (unchanged in substance):** a sitewide, engagement-triggered invitation card — not a homepage-only popup, not an exit-intent popup, and not styled like a conventional ecommerce discount popup. It shows itself once a visitor has demonstrated real interest, presents the amount and code plainly and prominently, offers auto-apply at checkout as the primary path, and stops showing itself permanently to anyone who has already claimed it or already bought from us.

**On the "never recommend popups" tension:** unchanged from v1 — this remains Suraj's own explicit, direct request, and the design stays argued against the brand's luxury standard rather than assumed safe. What's different in v2 is *where* the restraint is applied: v1 kept both the tone *and* the amount/code quiet; the review made clear that was over-correcting — the offer itself should be legible and confident, and the *restraint* should live in the absence of urgency tactics (no countdown, no red, no "SALE" badge, no fake scarcity), not in making the actual number hard to find. That's the calibration this revision makes.

**The core reframe still holds:** ₹3,000 is roughly 1–10% of an order at this price point — not the reason someone buys, but a confident first gesture. v2 doesn't change that framing; it changes how *visible* that gesture is allowed to be while keeping the framing intact ("with our compliments," never "% OFF").

---

## 1. Placement — Where It Appears, and Why

**Unchanged from v1.** Sitewide (all templates except cart and, off-theme, checkout), not homepage-only — K&A's real first-touch traffic (strong Instagram presence, celebrity/editorial features) lands on product/collection/article pages directly, not reliably on `/`. Restricting to homepage would under-serve the exact audience this offer targets.

**Trigger type: engagement-gated (scroll ~60% or ~25s dwell, whichever first), not entry, not exit-intent.** Full reasoning unchanged from v1 — an on-load popup violates this brand's "never crowded, never loud, slow browsing experience" principles regardless of how the card itself looks; exit-intent doesn't work on mobile and reads as chasing rather than inviting. None of this was in scope for Suraj's requested changes.

**Explicitly excluded (unchanged):** cart page (a transacting visitor, not a browsing one), checkout (off-theme), and any moment another overlay is already open (Section 7).

---

## 2. Timing, Trigger and Frequency Rules

**Unchanged from v1.** Restated briefly for completeness:

1. **Not a returning customer** — `{% if customer and customer.orders_count > 0 %}` → never eligible, checked server-side.
2. **No prior claim on this device** — `localStorage` `ka_welcome_offer` state `claimed` suppresses **permanently**.
3. **No recent dismissal** — state `dismissed` suppresses for **30 days**, then resumes normal eligibility.
4. **Once per session** — `sessionStorage` flag caps it regardless of repeated trigger conditions within one visit.
5. **Not on the cart page**, and not while another overlay is open (Section 7).

**What counts as "claimed" changes slightly in v2**, as a direct consequence of removing the email field: claiming now happens via **copying the code** or **clicking "Begin Shopping"** only (v1's third path, "sent by email," no longer exists). No other change to this section.

---

## 3. Visual Design

Full working prototype: `Prototypes/welcome-offer-popup-v2.html` (open it, scroll the live demo section to see the real trigger fire, and use the demo control bar to walk through every suppression state — mechanically identical to v1's demo).

**Every token used remains checked directly against `assets/ka-base.css`'s `:root` block — v2 introduces no new tokens either, only different application of the same existing ones:**

| Token | Value | Used for |
|---|---|---|
| `--c-paper` | `#F7F3EC` | Card background |
| `--c-paper-deep` | `#EFE8DD` | Code plate background |
| `--c-charcoal` | `#2A2420` | **Now also the amount's color** (v1 used rosegold here — see below) |
| `--c-rosegold` / `-2` / `-pale` | `#9A7B4F` / `#7E6440` / `#B99B6E` | Eyebrow, code-plate border (thickened to 1.5px), copy-link, hover states |
| `--line` / `--line-strong` | existing rgba values | Card border, dismiss-row rule |
| `--f-display` | Cormorant Garamond, weight 500 (non-italic) | The amount — largest text in the card |
| `--f-sans` | Jost | Eyebrow, caption, code label, **the code value itself (v2.1 fix — see below)**, buttons, fine print |
| `--ease-luxury` | `cubic-bezier(0.16, 0.84, 0.44, 1)` | Card open/close transition (unchanged) |
| `--dur-med` / `--dur-fast` | `0.65s` / `0.35s` | Open transition / hover states (unchanged) |

**What actually changed visually, and the reasoning for each:**

- **The amount (₹3,000) is now the single largest element in the card** — `clamp(3.2rem, 9vw, 4.8rem)`, up from being folded into a body sentence in v1. It is now in `--c-charcoal`, not rosegold: rosegold (`#9A7B4F`) against the paper background (`#F7F3EC`) is a soft, lower-contrast pairing — appropriate for a hairline rule or an eyebrow label, but not sufficient contrast to satisfy "unmistakable at a glance" at any size. High-contrast ink at large scale reads as confident and clear without needing a garish accent color to get there.
- **The code plate is enlarged** — `1.5rem` (up from v1's `1.3rem`), a firmer `1.5px` rosegold-pale border (up from `1px` line-strong), positioned directly beneath the amount so the eye moves amount → code → CTA in a straight line, with no competing elements between them.
- **v2.1 typography fix — the code's font-family is `--f-sans` (Jost), not `--f-display` (Cormorant Garamond).** Cormorant Garamond's digits are drawn as old-style figures, which don't share a cap-height baseline with capital letters — this produced a real, visible misalignment between "KLP" and "3000" that Suraj caught on the staged build. Jost's lining figures sit flush with its caps, giving one flat, legible line with no special handling needed; `font-variant-numeric: lining-nums tabular-nums` is set explicitly as a second guarantee rather than trusting an unstated font default. The amount above it is unaffected — it stays in `--f-display`, since it's all-numeral text with no capital letters to misalign against.
- **The separate italic headline is removed.** v1 had "Consider This Our Welcome." above the amount; with the amount now this large, a headline above it competed for the same "first thing you read" role instead of supporting it. The eyebrow ("A Welcome, From Us") alone still carries the "gesture, not a sale" framing.
- **Card is narrower and shorter** — 440px (was 460px), with noticeably less vertical content — a direct, mostly automatic consequence of cutting the copy in Section 4, not a separate design decision.

**Still deliberately absent, unchanged from v1:** no percentage-off badge or "OFF!" burst treatment, no countdown timer, no urgency color (red/orange), no full-screen takeover on any breakpoint, no bounce/spring motion. Making the amount and code prominent was achieved entirely through scale, contrast, and framing — not through any of the tactics this brand's principles rule out. That distinction is the calibration this revision is making, not a reversal of the original restraint.

---

## 4. Copy

**Cut substantially in v2, per Suraj's direct simplification request.** Checked once more against the established voice (`sections/ka-manifesto.liquid`, `sections/ka-appointment.liquid`) to make sure trimming didn't strip the brand register along with the word count — short, warm, first-person-plural fragments, still no exclamation points.

**Final copy, v2:**

- **Eyebrow:** A Welcome, From Us
- **Amount:** ₹3,000 *(large display numeral — this is now doing the work v1's headline did)*
- **Amount caption (one line, replaces v1's full paragraph):** "toward your first piece, with our compliments"
- **Code label:** Code
- **Code:** KLP3000
- **Copy button:** Copy → Copied (2.2s, then reverts) — unchanged
- **Primary CTA:** Begin Shopping — unchanged
- **Fine print (trimmed from a full sentence to one compact line):** "First order only · One use per customer · Not combinable" *(exact terms still to be confirmed against KLP3000's actual configured Shopify rules — Flag F3, unchanged concern from v1)*
- **Dismiss link:** Not today — unchanged

**Removed outright in v2, not trimmed:** the long body paragraph ("Every piece we create begins with a conversation…"), the separate italic title ("Consider This Our Welcome."), the email toggle prompt, the email input/submit form, the Inner-Circle explanatory note, and the "Sent. And welcome to The Inner Circle" success state. None of these are reduced or relocated — they no longer exist anywhere in this component.

---

## 5. Mechanism — How KLP3000 Actually Reaches the Customer

**Discount mechanism itself is unchanged from v1.** Both paths remain recommended together:

- **Primary path ("Begin Shopping"):** Shopify's native discount deep link — `https://karishmaashita.com/discount/KLP3000?redirect=/collections/all` — applies the code to the visitor's session and redirects, no app or custom backend required.
- **Plain, always-visible code as the resilient fallback:** unchanged reasoning — a made-to-order purchase in this price range is rarely decided in one session, and this project has no confirmed data on how long an auto-applied Shopify discount session survives a multi-day gap. The visible code (now the second-largest element on the card, not a small aside) works regardless of session state, device, or elapsed time.

**Email/newsletter tie-in — removed entirely, not modified.** v1 recommended the popup's optional email field feed the same Inner Circle subscription mechanism as `sections/ka-footer.liquid`. Per change 1, this popup no longer captures email in any form, so **there is no longer any interaction between this component and the newsletter signup** — they are now fully independent, exactly as they were before this feature existed. `sections/ka-footer.liquid` requires no changes of any kind for this feature (true in v1 too, but now trivially true rather than true-by-design-choice).

**What "claim" means for suppression purposes (Section 2), restated:** copying the code or clicking "Begin Shopping" — the email-submission path no longer exists as a third option.

---

## 6. Mobile Behavior

**Bottom-sheet mechanics entirely unchanged from v1** — slide-up from the bottom edge, rounded top corners, drag handle, dismissible via swipe-down, tap-on-scrim, ×, or "Not today," all one-thumb-reachable. Trigger logic and eligibility gate are identical to desktop, same as v1.

**What changed as a result of the copy cut:** the sheet is now noticeably more compact — with the paragraph, headline, and email form all gone, the mobile card is unlikely to need its `max-height: 88vh` internal-scroll allowance in practice even on short devices, though that safety allowance is left in place unchanged (costs nothing, and protects against any future copy growth). Amount scales to `3rem` at the ≤640px breakpoint (was folded into body text at this size in v1).

---

## 7. Section/Component Breakdown and Interaction Rules

| Element | Purpose | Change in v2 |
|---|---|---|
| `.ka-welcome-scrim` | Fixed overlay layer | Unchanged |
| `.ka-welcome` | The card itself | Narrower (440px), less padding, shorter overall |
| `.ka-welcome__close` | Icon dismissal (×) | Unchanged |
| `.ka-welcome__amount` / `__amount-sub` | **New primary focal element** — the numeral + one-line context | New in v2, replaces the old title + body paragraph |
| `.ka-welcome__code` | Code plate | Enlarged type, thicker border |
| `.ka-welcome__cta` | Primary action (discount deep-link) | Unchanged |
| ~~`.ka-welcome__email-toggle` / `__email-form` / `__email-success`~~ | ~~Optional email capture~~ | **Removed entirely** |
| `.ka-welcome__fine` | Fine print | Condensed to one line |
| `.ka-welcome__dismiss` | Worded dismissal ("Not today") | Unchanged |

**Interaction rules — all unchanged from v1:**
- Opens only via the trigger logic in Section 2.
- Mutual exclusion with the search overlay and mobile nav drawer — defers opening if one is already open; closes itself (soft dismiss) if one is opened while it's showing.
- `Escape` closes (soft dismiss). Focus moves to the close button on open.
- `z-index`: 400, above the utility bar (101) and nav (100), below nothing that currently exists.

---

## 8. Shopify Platform Feasibility Flags

Flags F1, F2, F3, F5 from v1 are unchanged and restated briefly. **F4 is removed as no longer applicable** (kept here, marked, rather than silently deleted, so the history of what was considered is traceable).

### F1 — Discount deep-link auto-apply is a native Shopify mechanism, not a custom build
Unchanged. Technical Director should still smoke-test the actual redirect/apply behaviour against this store's live checkout once staged.
**Risk:** Low.

### F2 — Discount session persistence across a multi-day gap is unverified, not assumed safe
Unchanged. The plain, now much more prominent, code is the safety net regardless.
**Risk:** None to correctness; low informational gap only.

### F3 — Fine-print terms need confirmation against the coupon's real, configured Shopify rules
Unchanged concern, now applies to a shorter line of text: "First order only · One use per customer · Not combinable" must still be checked against KLP3000's actual configured Shopify settings before shipping.
**Risk:** Low technically, real trust/accuracy risk if unconfirmed.

### ~~F4 — Newsletter tag merge requires no new Shopify configuration~~ — **Removed in v2, no longer applicable**
This flag existed only because v1 proposed tagging popup email submissions with `welcome-offer-KLP3000` alongside the existing Inner Circle tags. Since v2 removes email capture from this component entirely (change 1), there is no tag merge, no shared form, and no newsletter interaction of any kind left to flag.

### F5 — `customer.orders_count` is a standard Liquid object, expected to work unchanged
Unchanged. Spot-check with a real logged-in test customer with a prior order during staging QA.
**Risk:** Low.

---

## 9. File Map

| File | Change |
|---|---|
| **`sections/ka-welcome-offer.liquid`** | Renders the (now simpler) card + scrim markup (Section 7): eyebrow, amount, amount caption, code plate, CTA, fine print, dismiss. Server-side eligibility pre-check unchanged (`{% unless customer and customer.orders_count > 0 %}`). **No `{% form 'customer' %}` block in this file at all** — that was the only piece of v1's markup with any server-side form logic, and it's gone. |
| **`assets/ka-welcome-offer.css`** | Rules in Section 3, including the enlarged amount/code treatment and the ≤640px bottom-sheet breakpoint. Email-related classes (`__email-toggle`, `__email-form`, `__email-row`, `__email-note`, `__email-success`) are removed, not just hidden. |
| **`assets/ka-welcome-offer.js`** | Trigger logic (unchanged), eligibility check (unchanged), open/close/copy/CTA handlers. Email toggle/submit handlers removed entirely — if Technical Director is revising the existing v1 implementation rather than rebuilding from scratch, this is the file most likely to have dead code left behind from the email feature; worth an explicit check. |
| `layout/theme.liquid` | No change from v1's file map — still rendered once, sitewide, excluding cart. |
| `sections/ka-footer.liquid` | **Not changed — and now not referenced by this feature at all**, not even indirectly via a shared tag convention. Fully independent of this popup. |

**Not touched:** cart/checkout logic, any customer/account template, the utility bar (considered and rejected as the mechanism in Section 1 — unaffected by this revision).

---

## 10. Build Complexity Estimate

**Overall: Simple.** (Downgraded from "Simple–Moderate" in v1.)

- **The email-capture removal actually reduces complexity** relative to v1 — no `{% form 'customer' %}` handling, no success/error state, no tag-attribution logic to get right.
- **The trigger/eligibility engine remains the one genuinely stateful piece of logic**, unchanged in scope from v1 — same bounded complexity, same reference precedent in `assets/ka-wishlist.js`.
- **The visual changes (larger amount/code) are pure CSS** — type scale, color, and border-weight adjustments to already-existing rules, not new components or new interaction logic.
- **If Technical Director is revising the already-staged v1 build rather than building fresh:** the fastest path is likely deleting the email-related markup/CSS/JS outright, adjusting the amount/code CSS per Section 3, and trimming the copy strings per Section 4 — a smaller diff than the original build, not a rebuild.

---

## Summary — Action Items Before/During Build

1. **Confirm F3** (KLP3000's actual configured Shopify rules) before finalising the trimmed fine-print copy — unresolved carryover from v1, still not done.
2. **If revising the existing staged build:** remove the email form/toggle/success markup, CSS, and JS handlers completely — check `assets/ka-welcome-offer.js` in particular for now-dead event listeners referencing removed element IDs.
3. **QA must re-verify F5** (signed-in customer with prior orders never sees the offer) and the mutual-exclusion behaviour (Section 7) on the revised build — these don't change with this revision, but a re-implementation is a re-opportunity to regress them.
4. **QA should specifically confirm no residual newsletter/Inner-Circle tie-in remains** anywhere in the shipped code — this was a real integration point in v1 and needs to be confirmed fully removed, not just visually absent from the card.
5. Same standing note as v1: hold the revised build to the "does this make K&A feel more exclusive, more luxurious, more desirable" test before merging to Live — bolder amount/code presentation is the explicit ask here, but the line between "confident" and "loud" is still Suraj's and Technical Director's to watch for in the actual staged build, not just in this document.
