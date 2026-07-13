# Footer Addendum -- Legal Entity Disclosure ("Peekay International Ltd.")

Small addendum to `Docs/search-404-footer-build-spec.md` (Section 4, Footer). Not a
new audit/prototype cycle -- a single compliance line added to the already-approved,
already-simplified footer. Creative Director sign-off only; Technical Director
implements directly from this note.

## Decision

**Option (a): fold into the existing copyright line in the bottom bar.**
Rejected option (b) -- a new line in the Contact column -- see rationale below.

## Exact copy

Replace the current bottom-bar copyright sentence:

    © {year} Karishma Ashita. All rights reserved.

with:

    © {year} Karishma Ashita, a brand of Peekay International Ltd. All rights reserved.

In Liquid terms (`sections/ka-footer.liquid`, current line 161), this becomes:

    &copy; {{ 'now' | date: '%Y' }} {{ section.settings.brand_name }}, a brand of {{ section.settings.legal_entity_name }}. All rights reserved.

New schema setting to add (Legal links header, alongside privacy/terms/shipping):

    { "type": "text", "id": "legal_entity_name", "label": "Legal entity name", "default": "Peekay International Ltd." }

Making it a setting (not hard-coded text) means the exact legal name can be corrected
later without a code change -- entity names occasionally change spelling/suffix for
registration reasons, and this is exactly the kind of edit that should never require
touching Liquid.

## Where it goes, and where it does NOT go

- **Goes:** the single existing bottom-bar copyright row (`.ka-footer__bottom` >
  `.ka-footer__copy`), appended as a clause of the same sentence.
- **Does NOT go:** the Contact column. Rejected because the Contact column is a
  "how to reach us" list (WhatsApp, email, address) -- all things a visitor might
  act on. A legal-entity name is not actionable; placing it there would read like
  a fourth contact method and dilute the column's purpose. It would also be the
  first line of visible body copy in that column at most viewport widths, which
  gives a purely administrative fact more visual priority than the phone number
  or email above it.
- **Does NOT go:** a new row, a new divider, or its own line anywhere. Suraj
  explicitly flattened the bottom bar to one row recently after complaining about
  footer clutter; reopening that with a second line/rule for this would undo work
  he already approved, for a fact that is genuinely minor to any visitor who isn't
  specifically looking for it.

## Why the copyright line is correct

This is the same placement convention used across luxury e-commerce and most
couture maisons' own sites (Net-a-Porter, Mytheresa, and comparable houses) --
the legal operating entity is disclosed in the smallest, quietest, most
administrative line on the page, exactly where a shopper's eye is not drawn, and
exactly where a legal/compliance reader knows to look. It sits at `0.63rem`,
already the smallest type on the page, in the existing muted tone (`#7E7567` on
the charcoal footer) -- no new type scale, no new color, no new weight.

The sentence remains one continuous clause ("Karishma Ashita, a brand of Peekay
International Ltd.") rather than two separated facts, so it still reads as a
single quiet legal sentence and not as two competing announcements.

## Visual check

`Prototypes/search-404-footer-v1.html`, Section 3 (Footer), has been updated in
place -- both the resizable device-preview frame and the full-bleed "real
context" instance share one footer markup block, so the change appears in both
automatically. A new annotation ("Revision v4 -- legal entity disclosure") has
been added to that section's proto-section-label explaining the change in
context, consistent with the file's existing revision-log pattern (v1-v3).

Confirmed at all three breakpoints (desktop / tablet / mobile) via the existing
device-preview toggle: at `0.63rem` with `flex-wrap: wrap` already set on
`.ka-footer__bottom`, the longer sentence wraps cleanly onto a second visual
line on narrow phone widths, same as the legal-links list already does today --
no layout change needed, no line-height or spacing adjustment required.

## Build complexity

Simple. One schema setting addition, one Liquid line edit, no CSS changes, no
new markup structure.

## Copy needed

- Legal entity name setting default: `Peekay International Ltd.`
- No other new copy.

## Images needed

None.
