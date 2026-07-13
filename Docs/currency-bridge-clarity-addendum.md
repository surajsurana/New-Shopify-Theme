# Currency Bridge Line — Clarity Addendum (Task 86 follow-up)

Small copy/format fix to the cart's currency conversion bridge line, in response to Suraj's device-preview feedback. No layout change, no new section, no new vertical space added in the common case.

Reference: `assets/ka-currency.js` (`updateBridge()`), `assets/ka-currency.css` (`.ka-currency-bridge`, `.ka-summary-tax`), `sections/ka-cart-items.liquid` (lines ~223-255, the Order Summary panel).

---

## Decision

Two changes, both pure copy/format edits to existing elements — no new DOM elements, no new CSS classes for layout, no added height in the default (INR) case.

**A. Label the rate itself, in the existing bridge line.** Keep the equation structure (`×` / `=`) — it isn't the problem and rebuilding it into a sentence would add visual weight for no gain. The only defect is that the multiplier has no unit. Fix it at the source: the rate is always "rupees per one unit of the foreign currency," so label it exactly that way, using the ISO code (not the currency symbol) as the suffix.

**B. Extend the existing checkout-currency disclaimer, not add a new one.** The line directly beneath the bridge (`.ka-summary-tax`, currently "Taxes included. Nothing further is added at checkout.") already occupies exactly the register this needs — quiet, small, muted, footnote-weight. Reuse it: when a non-INR currency is active, its content gets one clause prepended stating checkout currency in plain words. Zero-cost for the ~majority-Indian, INR-default visitor, who never sees any change.

No standalone "why 900 × 95" sentence is needed once the rate carries its own unit — that was the actual source of confusion, not a missing explanation. Adding a *third* line here, on top of the bridge and the tax line, in an Order Summary panel already through multiple decluttering passes, would be the wrong trade.

---

## Exact copy / format

### A. Bridge line

Before:
```
$900 × 95 = ₹86,000
```

After — pattern: `{converted amount} × ₹{rate}/{ISO CODE} = {inr amount}`
```
$900 × ₹95/USD = ₹86,000
```

Worked across all five supported currencies (illustrative rates):
```
$900 × ₹95/USD = ₹86,000
£720 × ₹110/GBP = ₹86,000 (approx., rounded per-currency as today)
C$1,220 × ₹63/CAD = ₹86,000
AED 3,300 × ₹24/AED = ₹86,000
```

Implementation note for Technical Director: this is a one-line change inside `updateBridge()` in `ka-currency.js`. Today:
```js
var displayRate = Math.round(1 / rate);
...
if (rateEl) rateEl.textContent = displayRate;
```
Change only the text assigned to `rateEl`, to `'₹' + displayRate + '/' + code`. Everything else — the `×` and `=` operator spans, `.ka-currency-bridge__amt` / `__inr` population, the `.show` class toggle, the animation timing — is unchanged. No CSS edit required; `.ka-currency-bridge__rate` already inherits the line's font size/color/tabular-nums.

Why the ISO code and not the currency symbol as the suffix: `$` is ambiguous between USD and CAD (both appear in the currency menu). `/USD` vs `/CAD` is unambiguous even out of context, and reads like a private-banking rate ticket rather than a retail calculator — closer to the register we want. For AED, `AED 3,300 × ₹24/AED` does repeat "AED" twice in close proximity; that's an acceptable, minor redundancy — it reinforces rather than confuses.

### B. Checkout-currency line (extends `.ka-summary-tax`)

Default / INR active / converter disabled — **unchanged**:
```
Taxes included. Nothing further is added at checkout.
```

Non-INR currency active — replace with:
```
Charged in Indian Rupees (₹) at checkout. Taxes included; nothing further is added.
```

This is not new invented copy — it's the same sentence family (short, declarative, ends on "at checkout" / "is added"), just stating the checkout currency in plain words before the existing reassurance. No abbreviation ("INR") used in the sentence itself — spelled out once as "Indian Rupees (₹)" so it's legible to a visitor unfamiliar with the ISO code, then the symbol alone carries it in every subsequent number on the page.

Implementation note: give `.ka-summary-tax` two text variants gated the same way the bridge already is (currency === 'INR' vs not), toggled from the same `updateBridge()` call path in `ka-currency.js` (it already knows `code` and already fires exactly when this needs to change — no new event wiring). Simplest approach: one element, JS sets `textContent` to the appropriate string; or two sibling spans toggled via the same `.show` class pattern already used elsewhere in this file. Either is trivial; leave the exact DOM shape to Technical Director's judgement, the copy strings above are load-bearing, the markup mechanics are not.

---

## Illustrative snippet (Order Summary panel, non-INR state)

```
ESTIMATED TOTAL                                    $900

$900 × ₹95/USD = ₹86,000

Charged in Indian Rupees (₹) at checkout.
Taxes included; nothing further is added.
```

Visual hierarchy unchanged from today: bridge line stays the larger/darker of the two (per the existing CD Note 5 rule — it must never read smaller than the tax line beneath it, so it never looks like fine print), tax line stays small and muted. Nothing about size, color, spacing, or position changes — only the text content of two existing elements.

---

## Why this is the right fix, not a bigger one

- **Luxury rationale:** A bare, unlabeled number ("× 95") reads like an unfinished calculator, which is the opposite of the quiet precision this brand needs — a private client desk never hands you a number without telling you what it's a number *of*. Labeling it fully (`₹95/USD`) is the smallest possible fix that removes all ambiguity, and it upgrades the tone from "web widget" to "rate ticket," which is a luxury-appropriate register on its own, with zero added elements.
- **Business/trust rationale:** International brides, bridesmaids and family shopping in USD/GBP/CAD/AED are exactly the highest-AOV, most flight-risk segment for checkout-currency confusion (fear of a surprise charge or bank conversion fee). Stating the checkout currency in plain words, once, in the exact spot they're already reading the total, directly reduces cart abandonment risk for that segment without adding a single pixel of new visual weight for the majority INR visitor.
- **Restraint rationale:** Rejected: converting the bridge into a full sentence ("Converted at today's exchange rate of $1 = ₹95...") — too long for the panel, starts to read like a tooltip/help-text pattern, which this brand should never need for something this simple once labeled correctly. Rejected: a third standalone line — this panel has already been through multiple decluttering passes per CLAUDE.md history; reusing the existing tax line is the only version of "add clarity" that doesn't also add clutter.

## Build complexity

Trivial. Two string edits inside functions/elements that already exist and already re-render on every currency change (`updateBridge()` in `ka-currency.js`). No new sections, no new CSS rules, no new liquid markup beyond (at most) one extra `<span>` if Technical Director chooses the two-sibling-span approach for the tax line instead of a single dynamic string.

## Priority

High-clarity / low-effort — should ship in the same pass as any other Task 86 follow-up work, ahead of anything requiring new visual design.
