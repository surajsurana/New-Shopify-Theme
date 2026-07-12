# Visit Us (Store Location) — Build Specification
**Document version:** 2.1
**Date:** 12 July 2026
**Prototype source:** `Prototypes/store-location-v1.html`
**Proposed route:** `/pages/visit-the-atelier`
**Status:** v2.1 is a narrow fix on top of v2.0, not a re-review of it. Suraj caught a redundancy in v2.0's Find Us section: the same "message us on WhatsApp" action was offered twice within one glance — the "WhatsApp the Concierge" CTA in the left panel, immediately followed by a duplicate Call/WhatsApp link pair in the right panel's fact sheet. Fixed by keeping one actionable contact method and converting the fact sheet's phone row to plain reference text; a full-page redundancy pass also caught and fixed one softer echo (the Walk-Ins fact row nearly duplicating the Assurance Strip's phrasing). See Section 2A for the complete account. Address/hours/photo content untouched — still as approved in v2.0.

**v2.0 status (unchanged, for reference):** Supersedes v1.0. v1.0 was built around a "we don't publish the exact address" exclusivity framing — Suraj corrected this directly: *"we need to share the address publicly. already lot of people know the store address. also there are walkins which cannot deny at all times."* v2.0 reversed the core creative decision of v1.0, publishing the real, verified address/phone/hours/rating sourced directly from K&A's own Google Business listing, and added the Store Photo section using a temporary, explicitly-authorised placeholder image. See Section 2 for the full account of what changed and why.

---

## 0. Scope Decision — Section vs. Dedicated Page

**Unchanged from v1.0: a short, dedicated Shopify Page**, not a section folded into an existing page. The reasoning holds and is even stronger now that there's more real content to justify its own URL:
- **Practical/SEO reason to give it its own URL:** a location page is exactly what gets linked from Google Business Profile, Instagram bio, WhatsApp Business "location" field, and local search ("K&A atelier Mumbai," "Karishma Ashita store," "K&A Santacruz"). Confirmed live in this revision: K&A's own Google Business listing already exists and is already being found by "a lot of people" per Suraj — this page's job is to be the site's own authoritative answer to that same search, not to compete with or hide from it.
- **Editorial reason not to fold it into About Us:** unchanged from v1.0 — About Us already has its own complete arc and its own Appointment CTA; this page has one clear job (how to find and visit us) that About Us shouldn't have to also carry.
- **v1.0's "the appointment-only model argues for a short page" reasoning is now partially revised, not scrapped.** The house is no longer "appointment-only" in the sense of turning away walk-ins — v1.0's proportionality argument for a short page still holds (this is a single atelier, not a multi-location retail chain needing hours tables and multiple pins), but the copy throughout no longer implies visits require an invitation. The page stays short and quiet; what changed is what it says, not how much of it there is.

Net result: **one page, five content sections** (Arrival, Find Us, Store Photo — new — Assurance Strip, Appointment CTA) plus shared Nav/Footer. One section longer than v1.0, still the shortest page in the build order.

---

## 1. Audit Summary — Corrected From v1.0

v1.0's audit was accurate about the underlying gap (no dedicated location page existed anywhere on the live site or in this codebase) but proposed the wrong solution to it. Treating "we haven't published an address" as a deliberate exclusivity device was a legitimate pattern for some appointment-only luxury houses **in principle** — but it was never actually K&A's own policy. It was this project's own assumption, applied without checking it against how the business actually operates. Suraj's correction makes the real operating model clear: the address is already publicly known (via Google, via word of mouth), and walk-ins are a real, unavoidable part of how people arrive at the store. A luxury bridal house's website that pointedly withholds an address the public already has doesn't read as exclusive — it reads as evasive, and actively works against the "real, findable store" trust this page now needs to build.

**Emotional audit of v1.0's approach, in hindsight:** Confusion bordering on mild distrust — the same diagnosis v1.0 gave the *complete absence* of a location page also applies, with less force, to a location page that describes an address without stating it. A visitor who already knows roughly where K&A is (because plenty of people do) and finds a website coyly declining to confirm it does not feel more exclusive; she feels like the website doesn't fully trust her, or isn't quite telling the truth.

**Emotional audit of this revision:** Trust, cleanly — a visitor gets a real address, a real phone number, real (partially confirmed) hours, and a real, verifiable Google rating, presented with the same quiet, considered typography as the rest of the site. Nothing about publishing an address needs to look unluxurious; Hermès, Chanel and Dior all publish full addresses and opening hours for their boutiques without it diminishing their exclusivity one degree. The exclusivity in this house's actual model lives in the made-to-order process and the concierge relationship, not in whether you can find the front door.

---

## 2. Redesign Concept — v2.0 (Reversed From v1.0)

**Core creative reversal: the address is now the single most prominent piece of content on the page, not a withheld one.** In the Find Us section, the real postal address is set in large display italic type at the top of the left panel — before the body copy, before the CTAs — because Suraj was explicit that this needs to read as "prominent and clear, not gated behind booking." Structurally this took the place of what was previously an "address shared once your appointment is confirmed" paragraph; that paragraph and its accompanying `.invitation__tbc` "locality note" placeholder have been removed entirely, not softened.

**What did NOT change, and why:** the page keeps its quiet, uncluttered register — no map widget with a default blue-pin skin, no hours-of-operation table, no crowded "store locator" layout. Publishing real information honestly is not the same creative decision as adopting a generic retail-directory visual language, and this revision is careful to keep the two separate. The Arrival hero keeps its engraved-invitation register (dark ground, bordered card, quiet typography) — a real address can still be presented with considered typography instead of a Google Maps embed dropped in at default styling. The Assurance Strip still exists, but its three items were rewritten from "appointment only, never a walk-in" (no longer true) to "walk-ins welcome, appointments preferred" (the actual policy) — reassurance now flows from honesty about how visits work, not from implying exclusivity that isn't real.

**New in v2.0 — the Store Photo section.** v1.0 deliberately built a photography-free hero specifically because no real atelier interior photography existed, and reusing garment photography to imply "this is our space" would have been a trust risk. That reasoning is preserved for the *hero* — it still isn't built on a photograph. But Suraj separately, explicitly authorised a different solution for a dedicated photo moment further down the page: *"I would also like to add photos of the store, right now can take any image from google and later i can change and add from the theme."* This is a materially different instruction from "invent a photo of our specific store" — it's "show a photo now, on the explicit understanding it's temporary, wired so it can be swapped the moment a real one exists." See Section 6 for exactly what was sourced and why, and Section 7 (L5) for how this must be built (a real `image_picker` setting, not a hardcoded image) so the swap is trivial for Suraj to make himself.

**Emotional arc, revised:** Arrival (still an invitation-card moment — quiet, dark, typographic — but now naming the real neighbourhood instead of gatekeeping it) → Find Us (the real address, prominently set, plus real phone/hours/rating/walk-in-policy facts — confidence through transparency rather than confidence through mystery) → Store Photo (a warm, tasteful mood image — honestly temporary, but not visibly labelled "placeholder" on-page, since that would undercut the page's own credibility while it's live) → Assurance (walk-ins welcome, appointments preferred, concierge-guided — reassurance about *how* a visit goes, not gatekeeping about *whether* you're allowed one) → Appointment CTA (same sitewide booking action, copy adjusted to "walk in, or write ahead").

---

## 2A. v2.1 Redundancy Fix

**Current Issue:** In v2.0's Find Us section, the left panel's `.invitation__actions` row included a prominent "WhatsApp the Concierge" CTA (`.btn-text`), and immediately below it, the right panel's fact sheet opened with a "Call / WhatsApp" row containing two additional inline links — `tel:` and a second `wa.me` link — to the exact same number. The same action (message or call the concierge) was offered three times in total within one screen's worth of content (two of them literally adjacent, left panel vs. top row of the right panel), which a first-time visitor would register subconsciously as clutter or uncertainty about which one to use — the opposite of the "quiet, considered" register this page is built around.

**Evidence:** `.invitation__actions` (WhatsApp the Concierge, `wa.me/919967543087`) sitting directly beside `.facts__row` "Call / WhatsApp" (`tel:+919967543087` + a second `wa.me/919967543087` link) — same panel, same number, same underlying action, twice.

**Luxury Rationale:** A house this considered doesn't need to ask twice. Repeating the identical call-to-action in quick succession reads as uncertain or salesy — closer to a retail landing page hedging its bets than a couture atelier confidently offering one clear way to reach it. Dior or Hermès boutique-locator pages state a phone number once, as a fact, and offer one clear primary action — they don't duplicate it for emphasis.

**Business Rationale:** Redundant CTAs don't increase conversion on a luxury page — they dilute it, by making the visitor pause to figure out if there's a difference between the two before acting (there wasn't). One clear, unambiguous action converts better than two identical ones competing for the same click.

**Resolution:** Kept exactly one actionable contact method — the left panel's "WhatsApp the Concierge" CTA, which sits naturally alongside "Get Directions" as the section's two real actions (go there, or message ahead). The right panel's fact row was converted from two link chips to a single line of plain, non-linked text — **"Phone" / +91 99675 43087** — consistent with the fact sheet's own framing ("A Visit, in Brief") as quiet reference information, matching the non-interactive treatment already used for Hours and Rated on Google in the same list. The number itself was kept as text (not deleted) because a visitor scanning quick facts may still want to note it down or dial manually from another device — that's a genuinely different use case from the panel's one-tap WhatsApp CTA, not a duplicate of it.

**Full-page redundancy pass:** Per standing instruction, every other section was checked against every other for repeated actions or information:
- **Header (nav) vs. body:** The persistent top-bar/mobile-drawer "Concierge" WhatsApp link is global site chrome, present on every page identically — not page-specific repetition, left as-is.
- **Hero "Get Directions" vs. Find Us panel "Get Directions":** Both link to the same Google Maps listing, but at genuinely different moments of the scroll — the hero offers it as an immediate top-of-page action before any detail is given; the panel offers it again after the full address and context have been read. This mirrors standard practice of restating a primary CTA at a later, better-informed point in the journey (not two clicks apart, not on the same panel) — reviewed and kept.
- **Facts sheet "View on Google Maps" (Rated on Google row) vs. "Get Directions":** Same underlying URL, but contextually anchored to a different intent — checking the rating/reviews vs. wayfinding. Kept as a natural pairing with the rating fact, not treated as a duplicate action.
- **Facts sheet "Walk-Ins" row vs. Assurance Strip's "Walk-Ins Welcome" / "Appointments Preferred" items:** Found and fixed. The fact row's original copy ("Welcome — appointments preferred, so we may prepare for you") nearly verbatim-echoed the Assurance Strip's phrasing two sections later ("Walk-Ins Welcome... Appointments Preferred, so we can prepare for your visit"). Shortened the fact row to a bare, terse statement ("Welcome anytime — no appointment required") consistent with the terse register of the other fact rows (Phone, Hours, Rating don't explain their own rationale either) — the fuller warm framing and "so we can prepare" reasoning now lives only in the Assurance Strip, where it belongs as an atmospheric closing beat rather than being said twice.
- **Closing Appointment CTA ("Book In-Store Appointment" / "Book Virtual Styling Session") vs. earlier CTAs:** Distinct action (a specific booking type) from "Get Directions" (navigation) and "WhatsApp the Concierge" (general enquiry) — not a repeat, correctly placed as the page's final conversion moment.
- **Footer contact block (WhatsApp, email, address) vs. body content:** Standard global footer utility, expected sitewide reference chrome — not treated as page-specific repetition.

**Build Complexity:** Trivial — content/markup only, no new tokens, no new components, no JS or layout change.

---

## 3. Section-by-Section Breakdown

### Section 0 — Navigation
Unchanged structurally from v1.0. One copy change: the mobile-nav and footer link label changed from "Visit the Atelier" to **"Visit Us"** — a small but deliberate wording shift, more welcoming and consistent with the walk-ins-welcome repositioning of the whole page. Still not added to the minimal desktop top-bar nav, matching the existing pattern (About isn't there either; the fuller sitemap lives in the mobile drawer and footer).

### Section 1 — Arrival (hero)
**Purpose:** Unchanged — the opening emotional beat, an invitation-card moment rather than a store-locator banner.
**What changed:** Eyebrow copy changed from "By Private Appointment" to **"Santacruz West, Mumbai"** — naming the real neighbourhood immediately, since withholding it no longer serves any real purpose. Sub-copy rewritten from "This is where your K&A story takes its first measurements" (implicitly gatekept) to "Walk in, or write ahead — either way, we're glad to have you." The single CTA changed from a WhatsApp "Enquire About Visiting" link to a direct **"Get Directions"** link, opening the real Google Maps listing (`https://maps.app.goo.gl/tU41xSkVonr4Qe8v9`) in a new tab — the most honest, useful first action for a page whose whole point is now "we have a real, findable address."
**What didn't change:** still no photography in the hero (see Section 2 above for why this is a different judgment call from the Store Photo section). Same dark ground, bordered card, rotated-diamond mark, CSS-only woven texture, staggered fade-up motion sequence.

### Section 2 — Find Us (address & practicalities)
**Purpose:** Convert the page's core new information — a real address, phone, hours (partially), and rating — into a confident, uncluttered moment, not a data dump.
**Structure:** Same two-column `.invitation` grid as v1.0 (`1.05fr 0.95fr`), same `--c-paper-deep` left panel / quiet right-column fact sheet pattern. What's inside both columns changed substantially:
- **Left panel:** H2 changed from "A Private Atelier, By Appointment." to **"Come Find Us."** A new element, `.invitation__address`, sits directly beneath the heading — the full real postal address set in large display italic type with a hairline rule beneath it, deliberately the most visually weighted content in the section. Body copy rewritten to state plainly that this is a real working studio, not a hidden address, and that walk-ins are welcome while appointments let the team prepare in advance. Two real actions replace the single WhatsApp link from v1.0: **"Get Directions"** (new `.btn-outline-dark` button, linking to the real Google Maps listing) and **"WhatsApp the Concierge"** (existing `.btn-text` link, WhatsApp-routed as before).
- **Right panel (`.facts`):** Fully rebuilt. v1.0's four rows (By Appointment / Hours / Getting There / Session Length) — three of which were placeholder `[ To be confirmed ]` rows — are replaced with four rows built from real, sourced data:
  - **Phone** *(v2.1: revised from "Call / WhatsApp")* — the phone number shown as plain, non-linked text. v2.0 originally gave this row two inline action links (`Call` → `tel:`, `WhatsApp` → `wa.me`), which duplicated the left panel's "WhatsApp the Concierge" CTA immediately above it — fixed in v2.1 (see Section 2A). The number is kept as reference text, not a live link, matching the non-interactive treatment of Hours and Rated on Google in the same list.
  - **Hours** — "Opens 11:00 AM" shown as a confirmed fact, with a small muted note (new `.facts__note` style, distinct from the old `--tbc` placeholder styling) honestly flagging that full weekly hours and closing time are still unconfirmed, and suggesting a visitor message ahead if visiting outside typical daytime hours. This is a genuine practical help, not just an apology for missing data.
  - **Rated on Google** — "4.7 ★ · Designer Clothing Store," sourced directly from K&A's own Google Business listing, with a "View on Google Maps" link. First real, verifiable social-proof element on this page — presented in the same restrained typographic register as everything else, not as a review-widget badge.
  - **Walk-Ins** — *(v2.1: shortened)* "Welcome anytime — no appointment required." Originally "Welcome — appointments preferred, so we may prepare for you," which nearly duplicated the Assurance Strip's phrasing two sections later — see Section 2A. The fuller rationale now lives only in the Assurance Strip.
**Motion:** Unchanged — standard `.reveal` fade-up, staggered between columns.

### Section 3 — Store Photo (NEW in v2.0)
**Purpose:** Give the page a genuine photographic moment — something v1.0 explicitly and deliberately omitted — now that Suraj has authorised a temporary image and a path to a real one.
**Structure:** New component `.storephoto`. A single full-bleed image (`min-height: 620px`), bottom-up gradient overlay, and a bottom-left two-tier caption ("The Atelier" / "Santacruz West, Mumbai") — reusing the exact caption pattern already established on the About Us page's Founders section (`.founders__image-caption`), rather than inventing a new convention.
**Image used (temporary):** `visit-store-placeholder.jpg` — see Section 6 for full sourcing detail. A warm, softly lit shot of wedding gowns displayed on mannequins in a boutique window, styled with a velvet bench and a floral arrangement. Sourced from Unsplash (free licence, no attribution required), chosen specifically because it reads as generic luxury-bridal mood rather than any identifiable real competitor's storefront (no visible signage, no readable branding).
**Critical build note:** this image is explicitly temporary. It must be wired as a real `image_picker` setting in the Shopify section schema (not hardcoded in the section's Liquid), so Suraj can swap it for real atelier photography himself the moment it exists — see Section 7 (L5). No on-page "placeholder" or "coming soon" label is used; the caption reads as ordinary content. Placeholder status is tracked here and in code comments only, per the task brief's explicit instruction to mark this as a temporary stand-in in documentation without treating it as final content.

### Section 4 — Assurance Strip
**Purpose:** Unchanged — reinforce the practical experience of visiting.
**What changed:** All three items rewritten. v1.0 had "Appointment Only / Every visit reserved, never a walk-in" — no longer true, and removed. Replaced with:
- "Walk-Ins Welcome / Drop by — we'd love to meet you"
- "Appointments Preferred / So we can prepare for your visit"
- "Concierge Guided / From first message to final fitting" (unchanged from v1.0 — still accurate)
Structurally identical `.craft-strip` reuse — same class, same dark ground, same dot-divider layout.

### Section 5 — Appointment CTA
**Purpose:** Unchanged — the page's single conversion moment.
**What changed:** Body copy updated from "The rest is a conversation..." to "Walk in, or write ahead — either way, we're glad to have you. Message us and we'll make sure you're expected." Same component (`sections/ka-appointment.liquid`), same background image, same dual-CTA WhatsApp routing.

### Footer
Shared component, scoped to this prototype file. Two changes: the "Visit the Atelier" link in "The House" column is now labelled **"Visit Us"** (matching the nav change), and the Contact column now includes the real address as a clickable line linking to the Google Maps listing, in addition to the existing WhatsApp/email/shipping lines. See Section 7 (L6) for the platform note on propagating this sitewide.

---

## 4. New or Changed Design Tokens

**Still no new colour, font, spacing, motion-duration or easing tokens.** Every value used is verbatim from the already-established system. New **component classes**, all built from existing tokens:

| Component | Status | Justification |
|---|---|---|
| `.invitation__address` | **New in v2.0** | Large display-italic address block, the visual anchor of the Find Us section. Uses existing `--f-display`, existing colour/spacing tokens, a `clamp()` size between the existing `--t-h3` and `--t-body-l` scale points — not a new named token, a one-off tuned value for this specific block, same category as other per-component tuning already documented elsewhere in this project's specs. |
| `.invitation__actions`, `.btn-outline-dark` | **New in v2.0** | A dark-bordered button variant for use on light (`--c-paper-deep`) panels — the existing `.btn-ghost`/`.btn-outline-white` variants are both designed for dark grounds. Same padding/type-scale/transition values as those existing variants, just inverted colour logic (`var(--c-charcoal)` text/border instead of white). Recommend promoting this to a shared sitewide button variant if any future light-panel CTA needs it, rather than treating it as page-specific. |
| `.facts__note`, `.facts__link`, `.facts__rating*` | **New in v2.0** | Needed to present the new fact types (a partially-confirmed hours fact, inline call/WhatsApp/map links, a star rating) within the existing `.facts` component's established visual language. All built from existing type scale and colour tokens (`--c-rosegold-2` for links, `--c-ink-muted` for the muted note) — no new values. |
| `.storephoto`, `.storephoto__bg/__overlay/__caption/__name/__sub` | **New in v2.0** | A full-bleed single-image section with a bottom-left two-tier caption. Directly reuses the caption *pattern* already established in About Us's `.founders__image-caption/-name/-sub` (same two-tier name/sub-label convention, same typographic choices) rather than inventing a new one — the background/overlay structure mirrors the existing `.appointment__bg/__overlay` pattern already used lower on this same page. |

**Removed in v2.0:** `.invitation__tbc` styling is no longer used in this page's markup (the CSS rule itself is left in place, unused, in case a future genuinely-unconfirmed item needs the same treatment elsewhere — flagged for Technical Director to drop if truly dead code by the time of build). `facts__value--tbc` is likewise no longer referenced on this page.

---

## 5. Visitor Journey & Emotional Notes

A bride, bridesmaid, or family member browsing the site clicks "Visit Us" from the footer or mobile nav. She lands on a quiet, dark, considered opening moment — same emotional register as v1.0 — but now the eyebrow tells her exactly where she is (Santacruz West, Mumbai) instead of making her wait. If she already knows roughly where K&A is — plausible, since Suraj notes many people already do — the page confirms what she suspected rather than coyly withholding it, which builds trust rather than testing her patience. Scrolling, she finds the real address set prominently, a real phone number she can call, honest hours (partial, but honestly so), and a real Google rating she could have found herself but is glad to see acknowledged rather than ignored. A warm photographic moment (currently a tasteful placeholder, soon to be the real space) gives her a sense of atmosphere before the practical reassurance strip confirms walk-ins are genuinely fine, though booking ahead means better service. She closes on the same familiar booking action used everywhere else on the site, now confident she could simply show up if she preferred to.

**Dominant emotion: Trust**, more directly and immediately than v1.0 achieved, because the page no longer has to work around a self-imposed information gap to get there. Not Awe or Desire — still correctly so, this remains a logistics-and-reassurance page — but the trust it builds is now unambiguous rather than partially undercut by an address it declines to state.

---

## 6. Content — What Was Verified and Sourced

Per CLAUDE.md's standing instruction not to invent unverifiable claims, everything below states exactly where each fact came from and what, if anything, is still open.

### Address, phone, rating — sourced directly by Suraj from K&A's own Google Business listing, 11 July 2026
- **Business name (as listed):** "K&A By Karishma And Ashita"
- **Address (used verbatim, not reworded):** Gurudwara, Ganga Building, 2A, Talmaki Rd, near Dhan, Potohar Nagar, Santacruz (West), Mumbai, Maharashtra 400054 — presented on-page split across three lines for readability (Ganga Building, 2A, Talmaki Road / Potohar Nagar, Santacruz West / Mumbai, Maharashtra 400054) but not reworded or "corrected." **Flag, not a blocker:** the source string includes "near Dhan," which reads as possibly truncated (e.g. a landmark name cut short) — presented as-is rather than guessed at or silently dropped; worth Suraj double-checking the exact listing text if he'd like the on-page copy to spell it out further.
- **Phone:** 099675 43087 — this is the **same number already used sitewide** as the WhatsApp concierge number (`+91 99675 43087` / `wa.me/919967543087`), not a second number. In this HTML prototype the identical literal number/link format already used everywhere else on the site is reused verbatim (no new number introduced). *(v2.1: the fact sheet's phone row is now plain text, not a `tel:` link — see Section 2A. The number still appears as a live link in the left panel's "WhatsApp the Concierge" CTA and in the footer.)* **Platform note (L4 below):** when built in Liquid, every instance of this number sitewide — including the footer address block — must reference the existing `settings.whatsapp_number` theme setting, not a second hardcoded copy.
- **Rating:** 4.7, listed as "Designer Clothing Store" — used on-page exactly as sourced, linked out to the real listing rather than presented as an unlinked, unverifiable badge.
- **Google Maps link:** `https://maps.app.goo.gl/tU41xSkVonr4Qe8v9` — used for every "Get Directions" / "View on Google Maps" action on this page and in the footer.

**Independent cross-check performed during this build:** a web search surfaced a third-party directory listing (Justdial) showing a *different* address for "K & A By Karishma And Ashita" — a Santacruz **East** address ("4/26, Nutan Cooperative Society, Anand Nagar, Santacruz (E)"), as opposed to the Santacruz **West** address Suraj supplied from the Google Business listing directly. This was **not** used anywhere in this build — Suraj's first-party check of K&A's own Google Business listing is treated as authoritative over a third-party directory (Justdial listings for small businesses are frequently stale). Flagged here transparently in case Suraj wants to get the Justdial listing corrected or removed separately (an outdated third-party address listing for the same business name is its own minor trust risk, independent of this website), but it does not change anything about what this page publishes.

### Hours — partially confirmed
Suraj: *"all information regarding hours etc is mentioned"* on the listing, but a logged-out view of the listing only surfaced "Opens 11 am" (confirmed for at least Monday) — the full weekly schedule and any closing time were not visible in that view. **Per the task's explicit instruction, no closing time was guessed.** The page states "Opens 11:00 AM" as a confirmed fact and honestly flags the rest as pending, with a practical suggestion (message ahead if visiting outside typical daytime hours) rather than leaving a visitor with no guidance at all.

**Still needed from Suraj:** the full weekly hours and closing time (even an approximate "11am–7pm, closed Sundays"-style line would resolve this completely) — ideally confirmed directly from the Google Business listing's full hours card (visible when logged into the account that manages the listing, even if not visible in a logged-out public view).

### Store photo — explicitly authorised temporary placeholder
Suraj: *"I would also like to add photos of the store, right now can take any image from google and later i can change and add from the theme."* Per this explicit authorisation, one candidate image was sourced and used — full detail below.

**What was considered and rejected first, and why:**
- Several Unsplash results for generic "boutique interior" searches (e.g. Clark Street Mercantile's menswear/streetwear store) were rejected for two independent reasons: (a) they are literally named, identifiable real businesses — exactly the "another identifiable real business's storefront" risk the task brief warned against — and (b) the aesthetic (industrial streetwear, exposed piping, army-surplus styling) has nothing in common with K&A's warm, feminine, bridal-couture register.
- Several "fashion atelier" results were Unsplash+ (paid/premium) images, which are not free-to-use without a subscription — excluded on licensing grounds, not just aesthetic ones.
- A "Jarvis Couture Bridal & Prom" result (a real, named US bridal boutique) was rejected outright — using a photo of a specific, identifiable competitor bridal store as a stand-in for K&A's own would be a much sharper version of exactly the risk the brief flagged.

**What was selected:** `visit-store-placeholder.jpg`, sourced from Unsplash (photo by Raymond Yeung, published under the standard Unsplash Licence — free for commercial use, no attribution legally required, though the photographer is credited here for transparency). The image shows three mannequins in wedding gowns displayed in a boutique window, described by its own listing as photographed in "a charming bridal boutique within Hong Kong's historic Western Market" — warm ambient light, a floral arrangement, a tan velvet bench, soft window-glass reflections. No readable signage or brand name is visible in the frame. It reads as a generic, tasteful bridal-boutique mood shot rather than a documentary claim about any specific real space (K&A's or anyone else's) — satisfying the brief's instruction to choose "an appropriate placeholder mood/texture, not a misleading 'this is our store' claim."
**Saved to:** `Prototypes/images/visit-store-placeholder.jpg`.
**This is explicitly a temporary stand-in, not final content** — flagged here, in the prototype's own code comments, and must be built as a swappable `image_picker` setting (see Section 7, L5) so replacing it requires no code change once real atelier photography exists.

### Not blocked / usable as-is
The WhatsApp concierge number, the "walk-ins welcome, appointments preferred" policy statement, and the general Mumbai/Santacruz West locality are all confirmed and used as-is. The page's structure and copy voice do not depend on the two still-open items (full weekly hours, real store photography) — both are additive improvements Section 8 and the Top 5 lists below account for, not blockers to reviewing or shipping this design.

### Appointment booking destination
Same shared open flag tracked across the homepage, Client Diaries and About Us pages (see `homepage-build-spec.md` Section 7/F5) — both CTA buttons on this page still point to placeholder URLs pending a confirmed booking destination. Resolved once, reused everywhere; not re-litigated per page.

---

## 7. Shopify Platform Feasibility Flags

### L1 — New Shopify Page + template
Unchanged from v1.0. Standard pattern, directly precedented by Client Diaries and About Us — a dedicated `templates/page.visit-the-atelier.json` referencing new sections (`ka-visit-arrival`, `ka-visit-find-us`, `ka-visit-photo` — new — plus reuse of the existing Craft Strip/Appointment CTA sections). **Risk: Low.**

### L2 — Superseded in v2.0
v1.0's L2 warned that `facts__value--tbc` placeholder rows must not ship live looking unfinished. This is now much narrower in scope: the only remaining genuinely-open fact is the closing-time/full-weekly-hours detail, presented via the new `.facts__note` treatment (a small honest caveat attached to an otherwise-confirmed fact, not a full placeholder row). **Recommendation:** this page *can* reasonably ship live in its current state — unlike v1.0, publishing it does not require withholding a real address or phone number, only accepting that the hours line carries one small honest caveat until Suraj confirms the rest. **Risk: Low**, and no longer a hard publish-blocker the way v1.0's flag was.

### L3 — Google Maps embed — still not included, now lower-priority
v1.0 flagged this as a likely future want, contingent on Suraj deciding to publish an address. That decision is now made (yes, publish it), so this is worth re-evaluating: a "Get Directions" out-link (what this revision uses) is simple, fast, and doesn't visually clash with the page's considered register the way a default-styled iframe embed would. **Recommendation unchanged from v1.0:** if an embedded map is wanted later, it's trivial to add (a standard iframe, zero platform risk) but should be styled/cropped carefully — treat as a future enhancement on the Find Us section, not a v2.0 requirement. **Risk: None** — flagging only so Technical Director has this pre-scoped.

### L4 — `settings.whatsapp_number` reuse (NEW flag, explicit per task brief)
**Issue:** This page introduces a *new* surface for the existing WhatsApp/phone number beyond the ones already live sitewide — the new address/phone context in the footer. *(v2.1: the fact sheet's phone row is now plain display text, not a live `tel:` link — see Section 2A — so it needs the setting's raw display value only, not a Liquid `tel:`-format link.)*
**Recommendation:** The footer phone/WhatsApp link must reference the existing `settings.whatsapp_number` theme setting (already the established pattern used everywhere else this number appears sitewide), not a second hardcoded literal. If a `tel:`-format link is added anywhere on the site in future, it will need the setting rendered in `tel:+91XXXXXXXXXX` format (no spaces) even though the WhatsApp links use the `wa.me/91XXXXXXXXXX` format — worth a small shared snippet/filter at that point so the formatting logic isn't duplicated per page; not required for this page as currently specified.
**Risk:** Low technically. Flagged explicitly because the task brief specifically called out this exact reuse requirement.

### L5 — Store Photo section MUST use `image_picker`, not a hardcoded image (NEW flag)
**Issue:** `visit-store-placeholder.jpg` is explicitly temporary (see Section 6). If hardcoded directly into the section's Liquid/HTML, swapping it later requires a code change — exactly the friction Suraj's own instruction ("later i can change and add from the theme") is asking to avoid.
**Recommendation:** The new `ka-visit-photo` section must expose its image via a standard `image_picker` setting with the current placeholder set as the section's *default* value (so it renders correctly out of the box), plus editable caption text fields for the name/sub-caption. This is a simple, standard Shopify pattern — no platform risk — but it's the one item in this build that actively fails its purpose if built the wrong way (hardcoded), so it's called out explicitly rather than left implicit under L1.
**Risk:** Low technically; **high importance** — this is the one build detail in this spec most worth double-checking during QA.

### L6 — Footer address propagation (NEW flag)
**Issue:** This prototype's own footer now includes the real address (see Section 3, Footer). Since each current prototype file has its own independent footer markup (per this project's flat-HTML-prototype convention), this change exists only on this one page's prototype right now.
**Recommendation:** Once approved, the address line should be added to the *shared* Liquid footer section/snippet so it appears sitewide, not just on this page — consistent with how `.is-current` nav-state propagation has already been flagged as a "solve once, centrally" item across About Us and this page's own v1.0. Should reference the same address content source as the Find Us section (ideally a single theme setting or metafield, not copy-pasted text in two places) so future address changes only need to happen once.
**Risk:** Low.

---

## 8. Build Complexity Estimate

**Overall: Simple.**

- **Three components carried over unchanged in structure from v1.0** (`.arrival`, `.craft-strip` reuse, `.appointment` reuse) — only copy changed, no new layout logic.
- **One component substantially rebuilt** (`.invitation`/`.facts` — now "Find Us") — still pure layout/typography, no new JS, but more content fields than v1.0 (address block, two-action CTA row, four real fact rows including inline sub-links) — a modest step up from v1.0's four simple label/value rows.
- **One genuinely new section** (`.storephoto`) — a single full-bleed image with a caption, directly modelled on an existing pattern (`.founders__image-caption` from About Us) — low complexity, its only real requirement is the `image_picker` wiring flagged in L5.
- **No forms, no filtering, no map embed, no third-party integrations.** Still the lowest-complexity page in the build order — marginally more content-rich than v1.0, but no new interaction patterns or JS logic beyond what's already used elsewhere on the page (the same `data-ka-appt-link` WhatsApp-routing script, reveal-on-scroll observer, and mobile nav drawer already used sitewide).
- **The one non-trivial judgment call for Technical Director is L5** (image_picker, not hardcoded image) — a content-governance/build-hygiene concern with real consequences if built wrong, not a technically hard problem.

---

## 9. Scorecard

**Luxury Score: 90/100** (v1.0: 79/100)
The single biggest driver of this jump: v1.0's "address on request" framing was creatively defensible in isolation but factually wrong about how this specific house operates — a luxury page built on a false premise has a ceiling no amount of typography can lift. Publishing the real address, phone, hours (honestly partial) and rating removes that ceiling entirely; what's left is a genuinely confident, well-typeset, honest page. Not yet in the mid-90s only because the store photography is still a placeholder and the hours are still partially open — both real, trackable, near-term fixes rather than open-ended gaps.

**Editorial Score: 79/100** (v1.0: 74/100)
Improved by the new Store Photo section, which gives the page a photographic beat it previously and deliberately lacked — even as a temporary placeholder, a warm, well-composed image does more editorial work than the absence of one. The Find Us section is still necessarily more functional/informational than narrative by nature (it's a real fact sheet now, doing real work) — correctly so for this page's job, and not a page that should chase a higher "editorial" register than About Us or Client Diaries.

**Mobile Experience Score: 89/100** (v1.0: 88/100)
Full breakpoint parity maintained; new elements (`.invitation__address`, `.invitation__actions`, `.storephoto`) all tested against the existing breakpoint system with light-touch additions (a new mobile min-height for the photo section, a stacked layout for the two new action buttons). No new mobile-specific interaction risk.

**Brand Consistency Score: 95/100** (v1.0: 93/100)
Every new component reuses established tokens and, where possible, established *patterns* (the Store Photo caption directly mirrors About Us's Founders caption; the new dark-panel button variant mirrors the existing light-panel button logic inverted). Slightly higher than v1.0 specifically because this version no longer contains a page-specific creative device (the "address withheld" framing) that, however well-executed, didn't actually match the rest of the site's straightforward, confident voice.

---

### Top 5 Immediate Improvements
1. Confirm the full weekly hours and closing time with Suraj — the single remaining genuinely open content item on this page (see Section 6).
2. Replace `visit-store-placeholder.jpg` with real atelier photography the moment it exists — flagged as explicitly temporary throughout this document; ensure Technical Director builds the section so this swap requires no code change (L5).
3. Resolve the appointment booking destination (shared open item with every other page built so far — resolve once, reuse everywhere).
4. Consider getting the outdated Justdial listing (Santacruz East address) corrected or removed, independent of this website — a stale third-party directory entry for the same business name is a small but real trust risk on its own (see Section 6).
5. Have Karishma & Ashita/Suraj do a final read of the address, phone and hours copy before publishing — this page now makes factual, checkable claims (an address, a phone number, hours) in a way v1.0 deliberately didn't, so it deserves a final accuracy pass before going live.

### Top 5 Strategic Improvements
1. Once real interior/atelier photography exists, revisit the Store Photo section with the real image — likely also worth reconsidering whether a second, smaller interior image could accompany it (e.g. a fitting-room detail) once real photography makes that possible.
2. If the full weekly hours turn out to have interesting texture (e.g. later hours on weekends, a weekly closed day), consider whether that's worth its own small callout rather than a single flat hours line — not needed until the real data exists.
3. Once this page is live and indexed, monitor whether it actually captures "K&A atelier Mumbai"-style local search traffic as intended (Section 0) — if so, worth a lightweight local-SEO pass (structured data / LocalBusiness schema) referencing the same address/hours/rating data already on this page.
4. Cross-link this page from About Us's Atelier & Trust Strip item, updating that item's copy to match the new walk-ins-welcome framing (currently reads "Private consultations, always by appointment" — worth a light edit for consistency once this page ships, not a blocker to shipping either page).
5. If K&A ever opens a second location, the `.facts` component and the new address-block pattern are both structured simply enough to extend to multiple locations without a redesign — worth keeping in mind, not building for prematurely.

### Quick Wins (<1 hour)
- Propagate the "Visit Us" nav/footer label change and the new footer address line to the other pages' shared footer once this page is approved and built (L6).
- Add `loading="lazy"` to the Store Photo and Appointment CTA background images once implemented in Liquid (matches existing sitewide convention).

### Medium Projects (1 day)
- Build the three new/updated sections (`ka-visit-arrival`, `ka-visit-find-us`, `ka-visit-photo`) as proper Shopify sections, with the Store Photo section's `image_picker` wiring (L5) and the phone number's `settings.whatsapp_number` reuse (L4) both treated as required, not optional, parts of this build.
- Once full hours are confirmed, replace the `.facts__note` caveat with a complete, confirmed hours line and republish.

### Major Projects (>1 week)
- None. As with v1.0, the only large open item (real atelier photography) is a photography/production task for Suraj, not an engineering effort, and — per his own explicit instruction — is not a blocker to shipping this page now with the temporary placeholder in place.
