# Footer Addendum -- Concierge De-duplication

Small addendum to `Docs/search-404-footer-build-spec.md` (Section 3, Footer). Not a
new audit/prototype cycle -- a single information-architecture fix to the already-
approved, already-simplified footer. Creative Director sign-off only; Technical
Director implements directly from this note.

## Problem (confirmed by reading the live footer, `sections/ka-footer.liquid`)

"Concierge" (a `wa.me` link) currently appears twice in the footer, on top of a
sitewide, always-present floating "Speak with a Couture Concierge" WhatsApp button
that already does this job on every page, footer included:

1. **Brand column, social row** (line 60) -- `Instagram -> YouTube -> Pinterest ->
   Concierge`. The code comment at lines 43-50 explicitly frames this as "browsing
   platforms first... then the pivot from 'look' to 'ask' last."
2. **Maison column, site-index list** (line 125) -- `About Karishma & Ashita ->
   Client Diaries -> Journal -> Visit Us -> Book an Appointment -> Concierge`.

A third, related mention is NOT part of this problem and is not touched: the
**Contact column's WhatsApp link** (line 148-151) is labeled with the phone number
itself, not the word "Concierge" -- it's ordinary contact info (how to reach us),
doing a different job than a named "Concierge" service CTA. Left as-is.

Three labeled/branded "ask us" touchpoints (2 footer + 1 floating) for one function
reads as repetition, not generosity -- inconsistent with the site's calm, editorial
standard and with the recent footer-clutter fixes already approved in
`Docs/search-404-footer-build-spec.md` §3 (copy repetition removed from the bottom
bar for the exact same reason).

## Decision

**Keep exactly one "Concierge" link in the footer: the Maison column instance.
Remove it from the Brand column's social row entirely.**

Considered and rejected: removing "Concierge" from the footer altogether (floating
button + Contact column's WhatsApp number already cover the function). Rejected
because the Maison column is the footer's site index (About / Client Diaries /
Journal / Visit Us / Book an Appointment...) -- omitting "Concierge" from that list
would read as an incomplete sitemap for a house that leads with bespoke service, and
naming the service once, where a visitor scanning the footer's nav expects to find
it, still communicates it exists without repeating the word. Net-a-Porter,
Mytheresa and comparable houses keep a named "Client Services" link in their footer
nav column for the same reason, even though they also offer chat/phone elsewhere.

## Why the Maison column keeps it and the Brand column doesn't

The Brand column's social row has one job: "here are the channels where you can see
our work" (Instagram, YouTube, Pinterest -- all browse/content channels). Concierge
is not a content channel, it's a service action; splicing a "talk to us" CTA into a
pure "follow us" row conflates two different visitor intents and turns a quiet
editorial social row into something that reads like a sales nudge -- exactly what
the existing "look -> ask, pivot last" comment admits it's doing. Dior, Chanel and
Hermes do not mix a client-services CTA into their social-icon row; it lives in the
navigational/site-index column instead.

The Maison column is that site-index column. There, "Concierge" sits naturally as
the last of two direct-engagement links (Book an Appointment, then Concierge)
closing out an otherwise informational list (About, Client Diaries, Journal, Visit
Us) -- browse-and-learn items first, then the two ways to actually engage further.
That hierarchy is coherent; the social row's was not.

## Exact change for Technical Director

**File:** `sections/ka-footer.liquid`

1. **Remove** the Concierge link at line 60 (`<a href="https://wa.me/{{
   settings.whatsapp_number }}" target="_blank" rel="noopener">Concierge</a>`) from
   `.ka-footer__social`. That row becomes Instagram -> YouTube -> Pinterest only.
2. **Update the stale code comment** at lines 43-50, which documents the row as
   ending in a "pivot from 'look' to 'ask' last" via Concierge. Replace with a short
   note that the row is purely content-channel links (Instagram/YouTube/Pinterest)
   and that Concierge intentionally lives in the Maison column only, per this
   addendum.
3. **Leave line 125 (Maison column) exactly as-is** -- `Concierge` stays as the last
   `<li>`, after "Book an Appointment."
4. **Leave the Contact column's WhatsApp link (lines 148-151) exactly as-is** --
   contact info, not a "Concierge" duplicate, out of scope.
5. **Leave the sitewide floating Concierge button exactly as-is** -- independent
   component, out of scope for this task.
6. **No schema changes.** The Concierge link on both sides uses the global
   `settings.whatsapp_number` directly; it isn't tied to a section schema setting.
   Nothing to add or remove in `{% schema %}`.
7. **No CSS changes needed.** `.ka-footer__social` is a `flex-wrap` list; removing
   one text link needs no layout adjustment. Does not touch or conflict with the
   mobile two-column grid work already approved in `Docs/search-404-footer-build-
   spec.md` §3.2 -- that spec's phone-range `Maison | Contact` pairing rationale
   (Book an Appointment sitting next to the Contact column's phone/WhatsApp line)
   is unaffected either way.

## Supersedes

`Docs/search-404-footer-build-spec.md` §3.2, "YouTube link" paragraph -- it
documents the social row's final composition as "...Pinterest -> Concierge." That
detail is now out of date. This addendum is the current source of truth for that
row: Instagram -> YouTube -> Pinterest, three items, browsing channels only.

## Build complexity

Simple. One line removed, one stale comment updated, no schema/CSS impact.

## Copy needed

None -- pure removal, no new copy.

## Images needed

None.
