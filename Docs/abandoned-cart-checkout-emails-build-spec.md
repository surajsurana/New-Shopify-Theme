# Abandoned-Cart & Checkout Emails — Copy & Creative Direction
**Document version:** 1.0
**Date:** 29 August 2026
**Status:** Copy approved-for-review by Creative Director — ready for Technical Director to confirm the exact Shopify native mechanism and wire up merge fields. No Liquid/theme/notification-template code written as part of this document.

---

## 0. Context and decisions already made

`Docs/pending-tasks.md` item #2 had this listed as "not yet scoped at all — needs tone/platform specifics from Suraj." Suraj approved starting this item on 2026-08-29 with two explicit decisions:

1. **Platform: Shopify native** — not a third-party app (Klaviyo etc.), consistent with his standing "I'm not sure I want to depend on any external app" position (same reasoning already applied to Google Reviews live-sync, see `pending-tasks.md` item #3).
2. **Tone: the same house voice as the rest of the site** — warm, restrained luxury register, matching Client Diaries/Journal copy already built and approved. Explicitly **not** urgency-gimmick copy ("hurry, your cart is expiring!") — that register is banned sitewide per `.claude/agents/creative-director.md` ("NEVER RECOMMEND ... Fake urgency").

This document is copy and creative direction only. Technical Director must confirm the exact Shopify mechanism (see §2) before building anything.

---

## 1. Voice grounding — what was read before writing this

Before drafting, the following were read directly to calibrate tone: `Docs/homepage-build-spec.md` (Manifesto, Appointment CTA, Craft Strip, Newsletter, Footer sections), `Docs/about-us-build-spec.md` (Founders/Origin copy, Atelier & Trust Strip, Closing CTA), `Docs/journal-build-spec.md` (Article body voice, pull-quote pattern), `Docs/search-404-footer-build-spec.md` and `Docs/store-location-build-spec.md` (existing WhatsApp-concierge CTA phrasing).

**Recurring patterns extracted and reused below:**
- Restrained, specific — never generic superlatives ("stunning," "must-have"), never exclamation marks.
- Addresses the reader as someone already mid-consideration of a real bespoke purchase, not a browser who needs converting.
- "We listen before we design" / "Begin with a Conversation." — the house's core relationship framing.
- Concierge = "a conversation, not a call centre" (`about-us-build-spec.md` §3, Craft Strip copy) — WhatsApp is a human channel, never a bot or a form.
- No discounts, no countdowns, no "last chance." Confirmed banned twice over — both the Creative Director's own standing rules and `docs/brand-brief.md`'s "no discount language, no urgency/FOMO gimmicks."
- Sign-off register: unsigned-by-individual, signed as the house ("The K&A Atelier"), matching the Newsletter's "From the Atelier" framing rather than a first-name customer-service signature.
- Every page's closing CTA routes to the same two real actions: continue toward the piece itself, or open a real conversation via WhatsApp. These emails do the same, at a smaller scale.

---

## 2. Scope — what's actually being drafted, and the platform question flagged for TD

"Abandoned-cart & checkout emails" covers two distinct visitor moments:

- **(a) Cart abandonment** — added an item to the cart, left without ever starting checkout (no email address captured yet).
- **(b) Checkout abandonment** — started checkout (at minimum entered an email/contact), left before completing payment.

**Shopify's native mechanism (Marketing → Automations → "Send an abandoned checkout email") targets (b) only.** It requires a checkout to have been initiated, because that's the point at which Shopify has an identifiable email address to send to — a cart with items but no checkout started has no contact record attached to it natively. True pre-checkout, cart-only recovery is the thing third-party apps like Klaviyo do via anonymous browser/cookie tracking; Shopify's own native system does not replicate that without an app. **Flagging this explicitly rather than assuming** — Technical Director should confirm this is still accurate against the current Shopify product (it may have changed) before scoping the build, per the task brief's instruction not to assume the technical mechanism.

**Given that, this document drafts copy for the checkout-abandonment moment** — which in practice is the vast majority of real recoverable intent anyway (someone who never reached checkout at all has given far less signal than someone who entered contact/shipping details). The copy is written generically enough ("began choosing," "your selection") that it reads correctly whether the visitor got as far as the shipping step or the payment step — no copy branch needed for exactly how far they got.

**If Technical Director confirms a native path exists for true pre-checkout cart recovery** (e.g. via Shopify Flow reading cart-update events against a logged-in/known customer), the same Email 1 copy below can likely be reused with a lighter product-recap block — flag back to Creative Director if that turns out to be buildable, since the emotional register doesn't need to change, only the trigger and how much detail is known about the visitor.

---

## 3. Sequence decision: two emails, not one

**A short two-email sequence, not a single blast.** Reasoning:

- A ₹30,000–₹280,000+ made-to-order piece is a genuinely considered purchase (`docs/brand-brief.md`: "high-involvement purchase, not an impulse buy"). Treating a first lapse in checkout the same way a ₹500 impulse cart would be treated — one templated nudge — undersells how real this decision is for the person making it.
- The two emails do **different emotional work**, not the same message twice: Email 1 is practical and warm (here's where you left off, here's how to finish, here's a human if you need one). Email 2 is patient and explicitly pressure-free (we know this takes time, we're not going anywhere, the conversation option leads more visibly here since a second lapse usually means a real question, not a fumble).
- This mirrors a pattern already proven elsewhere on the site: `Docs/faq-build-spec.md` deliberately reorders its closing CTA (concierge-first, booking second) because "the exit visitor still has one specific unanswered question" — Email 2 borrows that exact logic, leading with the conversation option rather than the checkout link.
- Two emails, not three or more: a longer drip risks tipping into exactly the pushy, salesy cadence this brand exists to avoid. Two is enough to (1) hand back a practical link same-day and (2) remove any pressure a few days later. A third email would have nothing new to say and would start to feel like chasing.

**Recommended timing** (TD/Suraj to confirm the exact hours — this is a creative recommendation, not a technical constraint):
- **Email 1:** same day, a few hours after checkout is abandoned (long enough that it doesn't feel like the site is watching in real time; short enough to still be useful if it was a genuine interruption — a call, a closed laptop tab).
- **Email 2:** 2–3 days later, only if checkout is still incomplete.

---

## 4. Email 1 — "We Kept This For You"

**Purpose:** Practical, warm hand-back to the exact point the visitor left off. Assumes the most generous explanation (they were interrupted), not that they need convincing.

**Subject line:** `Your Selection, Held For You`
**Preview text (preheader):** `A note from the atelier.`

**Body copy:**

> FROM THE ATELIER
>
> **We Kept This For You.**
>
> Every piece at K&A is made to order — cut, boned, and hand-embellished once we know it's yours. We noticed you began choosing [Product Name] and wanted to hold the details here, in case you'd like to continue.
>
> *[Shopify's native order-recovery block renders here — product image, name, price, quantity]*
>
> **[Complete Your Order →]**
>
> Have a question first — about fit, fabric, or how long the piece will take? Message our styling concierge on WhatsApp. A real person from the atelier, not a call centre.
>
> [Message the Concierge]
>
> With care,
> The K&A Atelier

**Notes on specific lines:**
- "We Kept This For You" deliberately reframes the recovery email as a courtesy (the atelier holding something) rather than a reminder or a nudge — consistent with the made-to-order operating model, where nothing is mass-stocked and "held" is literally closer to true than in a normal e-commerce cart.
- "A real person from the atelier, not a call centre" is a direct, near-verbatim echo of the Craft Strip copy already live on the About page ("Concierge / A conversation, not a call centre") — deliberate continuity, not a coincidence.
- No mention of stock levels, no "only X left," no delivery-deadline pressure — all explicitly excluded.

---

## 5. Email 2 — "No Rush. We're Here When You Are."

**Purpose:** Explicitly remove pressure. Leads with the conversation option, not the checkout link — a second lapse more often signals a real open question than a simple interruption.

**Subject line:** `No Rush. We're Here When You Are.`
**Preview text (preheader):** `On your own time, always.`

**Body copy:**

> THE ATELIER
>
> **Take Your Time. / We Will Be Here.**
>
> A piece like [Product Name] is not a quick decision — and it shouldn't be. Every K&A garment is made to order, by hand, for the person who will wear it. If you're still weighing the fit, the fabric, or simply the moment, we're glad to talk it through. No obligation, only a conversation.
>
> *[Shopify's native order-recovery block renders here — simpler variant: product image, name, price]*
>
> **[Book a Styling Conversation →]** *(WhatsApp — primary CTA in this email)*
>
> Prefer to pick up exactly where you left off?
> [Return to Your Selection] *(checkout recovery link — secondary CTA)*
>
> With care,
> The K&A Atelier

**Notes on specific lines:**
- "Take Your Time. / We Will Be Here." is built in the same two-line, comma-free headline cadence as "Begin with a / Conversation." and "Every K&A Story / Starts the Same Way." — matching the site's existing large-headline rhythm so it reads as the same house even in an inbox.
- CTA order is deliberately inverted from Email 1 (concierge leads, checkout link follows) — see §3 for the reasoning, borrowed directly from the FAQ page's own precedent.
- "Book a Styling Conversation" reuses "conversation" rather than introducing new vocabulary — ties back to "Begin with a Conversation" (homepage Appointment CTA) so a returning visitor recognizes the phrase.

---

## 6. Personalization / merge fields — notes for Technical Director

Written in plain language since Creative Director doesn't need to know Shopify Email's exact Liquid/editor syntax — TD to confirm the real field names and how gracefully each degrades when data is missing.

1. **Customer first name.** Not used in either subject line or as a "Hi [Name]," salutation in the drafts above — deliberate, since a checkout only partially filled in may not have a name captured yet, and an empty "Hi ," salutation would read as broken, not personal. If Shopify's native abandoned-checkout template has a first-name merge field with a clean fallback (i.e. it gracefully omits the greeting line entirely when no name exists, not just prints blank), it's fine to add an optional opening line — e.g. "Hello, [First Name]." — ahead of the eyebrow. Do not build a custom fallback string like "Hello there," as a substitute; better to omit the line entirely than sound like a form letter.
2. **Product(s) left in cart/checkout — image, name, price, quantity.** Use Shopify's built-in abandoned-checkout content block in the Shopify Email editor (the drag-and-drop "recovery" section that auto-populates real line-item data) rather than manually inserting product fields — this is the native, already-solved way to do this and avoids a custom build. The copy above is written to sit before/after that block, not to duplicate what it already shows.
3. **"[Product Name]" inline in the body copy** (e.g. "began choosing [Product Name]") — if Shopify's editor supports inserting a single line-item's product title inline in body text (not just inside the pre-built recovery block), use it for the single-item case. If a checkout has multiple different products, this line should gracefully degrade to something like "began choosing a few pieces" rather than concatenating product names — flag back to Creative Director if that copy branch is needed; not drafted above since it's a minor variant.
4. **Checkout recovery link ("Complete Your Order" / "Return to Your Selection").** Must point to Shopify's actual generated checkout-recovery URL (the same one embedded in the native recovery block), which carries the real cart contents forward — never a generic `/cart` or `/checkout` link.
5. **WhatsApp concierge link ("Message the Concierge" / "Book a Styling Conversation").** Same sitewide number used everywhere else on the site: `https://wa.me/919967543087`. Check whether Shopify Email supports a dynamic pre-filled WhatsApp message (e.g. referencing the product name) the way the existing site CTAs do (`search-404-footer-build-spec.md` §"Concierge sentence" uses a pre-filled WhatsApp message pattern already) — if not straightforward in the email editor, a generic pre-filled message is an acceptable fallback and still consistent with the sitewide pattern.
6. **Sender name / reply-to.** Recommend sending as "K&A Atelier" or "Karishma & Ashita," matching the "With care, / The K&A Atelier" sign-off used in both drafts. **Minor open item, not blocking:** the repo has two different studio email addresses in use — `hello@karishmaashita.com` (homepage footer) and `info@karishmaashita.com` (About Us verified contact facts). TD/Suraj should confirm which is the canonical outbound address before this ships; not a copy decision.
7. **Second-email delay mechanism.** Shopify's single native "abandoned checkout email" recipe typically supports one delay setting for one email. Achieving a genuine second email at a different delay likely needs either two separate Marketing Automations, or one Shopify Flow with two "Send marketing email" actions at different wait times — both still fully native (Shopify Flow is Shopify's own automation builder, not a third-party app), but TD should confirm which is actually available on this store's plan before committing to the two-email structure as specified. If only a single native email turns out to be buildable without Flow, ship Email 1 alone and treat Email 2 as a fast-follow once the mechanism is confirmed — not a reason to hold up Email 1.

---

## 7. What was deliberately kept out of scope

- No new imagery required — both emails rely entirely on Shopify's native product-recovery block (real product photos already in the catalogue) plus text. No net-new photography or design system needed, per the task's "keep it proportionate" instruction.
- No discount code, no percentage-off, no free-shipping-if-you-complete-now line — all considered and rejected, consistent with `docs/brand-brief.md`'s standing "no discount language" rule and the Creative Director's "NEVER RECOMMEND ... Fake urgency" rule.
- No countdown timer, no "X people are viewing this" social-proof-of-scarcity line — same reasoning.
- No third-party review/UGC insert (e.g. "see what other brides said") — would dilute the direct, one-to-one concierge register these emails are built around.

---

## 8. Technical Director findings (2026-08-29) — manual build required

**No Admin API write path exists** for notification templates, Marketing Automations, or Shopify Flow workflow content — confirmed by exhaustive search of the live GraphQL Mutation schema (same class of gap as the checkout-branding investigation: real platform feature, visual-editor-only, no API). This must be configured by hand in Shopify Admin. QA verification for this deliverable cannot be checksum-based like theme files — the real gate is triggering a test abandoned checkout and confirming the received email matches this doc exactly.

**Resolved open items from §6:**
- **Canonical sender email: `info@karishmaashita.com`** — confirmed live via two independent Admin API checks (`Shop.email`), matches 23+ live template references and the footer's schema default. `hello@karishmaashita.com` (homepage-build-spec.md's mailto) is a stale, unconfigured artifact — worth a one-line fix separately, out of scope here.
- **Scope reality check confirmed:** native Shopify still can't reach a genuinely anonymous pre-checkout cart abandonment — only checkout abandonment (contact info captured) or a known/returning customer's cart (a newer, minor `Abandonment` object exists but requires an identifiable `Customer`, not relevant to the dominant anonymous-visitor case). Copy scope as drafted (checkout-abandonment moment) stands as-is.

**Still needs Suraj's own eyes (2-minute check) — the only unresolved question:** whether this store's Shopify plan/Automations builder actually offers a second delayed email out of the box, or whether Email 2 needs a custom Shopify Flow. Steps below cover both paths.

### Manual build guide

**Step 0:** Admin → **Marketing → Automations** → open the built-in "Abandoned checkout" template. Does it offer a second delayed step?
- **Yes** → drop Email 1 in the first slot, Email 2 in the second, set its delay to 2-3 days.
- **No** → **Create automation** → trigger **"Customer abandoned checkout"** → this opens the native Flow canvas (still 100% native, not an app) → add step **Send marketing email** (Email 1) → add step **Wait** (2-3 days) → optionally add a condition "checkout not yet completed" → add step **Send marketing email** (Email 2).
- **If neither path supports a second email at all** → ship Email 1 alone now, treat Email 2 as a fast-follow — this was always the accepted fallback per §6 point 7, not a new decision.

**Sender settings (both emails):** Sender name `K&A Atelier`; sender/reply-to `info@karishmaashita.com`.

**Email 1 — same day, a few hours after abandonment**
Subject: `Your Selection, Held For You` — Preview text: `A note from the atelier.`
```
FROM THE ATELIER

We Kept This For You.

Every piece at K&A is made to order — cut, boned, and hand-embellished once we know
it's yours. We noticed you began choosing [Product Name] and wanted to hold the
details here, in case you'd like to continue.

[ Shopify's native recovery content block — drag from the editor panel, don't
  rebuild manually ]

[Button: Complete Your Order →]  → the recovery URL the block auto-generates

Have a question first — about fit, fabric, or how long the piece will take?
Message our styling concierge on WhatsApp. A real person from the atelier, not
a call centre.

[Button: Message the Concierge]  → https://wa.me/919967543087?text=Hi%2C%20I%27d%20like%20to%20finish%20my%20order%20%E2%80%94%20could%20you%20help%3F

With care,
The K&A Atelier
```
No "Hi [Name]," greeting line — deliberate (see §6 point 1). If multiple products, change the bracketed phrase to "began choosing a few pieces."

**Email 2 — 2-3 days later, only if still incomplete**
Subject: `No Rush. We're Here When You Are.` — Preview text: `On your own time, always.`
```
THE ATELIER

Take Your Time. / We Will Be Here.

A piece like [Product Name] is not a quick decision — and it shouldn't be. Every
K&A garment is made to order, by hand, for the person who will wear it. If you're
still weighing the fit, the fabric, or simply the moment, we're glad to talk it
through. No obligation, only a conversation.

[ Shopify's native recovery block — simpler variant if the editor offers one ]

[Button: Book a Styling Conversation →]  → https://wa.me/919967543087?text=Hi%2C%20I%20have%20a%20question%20before%20I%20complete%20my%20order.
(this is the PRIMARY button in Email 2 — leads before the checkout link, per §5)

Prefer to pick up exactly where you left off?
[Text link: Return to Your Selection]  → same recovery URL as Email 1

With care,
The K&A Atelier
```

**What couldn't be checked from outside Shopify Admin:** exact merge-field/product-name insertion behavior inside the visual email builder (no browser access from this session) — the copy above is written to degrade gracefully either way, per §6.

---

## 9. Visual design spec (added 2026-08-29) — what §8 was missing

§8's manual build guide was copy-paste text only. Dropped into Shopify's editor as-is it renders as the tool's generic default template with K&A's words on top of it — not a designed K&A email. This section is the missing visual layer: exact fields to set inside the Shopify Email editor, derived from the same design system already live on the rest of the site (`assets/ka-base.css` design tokens; the real sitewide button family in `assets/ka-cart-items.css` / `assets/ka-product-main.css`, `.ka-btn` / `.ka-btn--ghost` / `.ka-btn--concierge`), not invented fresh for email.

**Where this spec came from, so Suraj can sanity-check it against what the editor actually shows him:** the sitewide primary CTA (`.ka-btn`) is a solid fill button — `background: var(--c-charcoal)` (#2A2420) / `color: var(--c-paper)` (#F7F3EC, warm off-white, not pure white) — uppercase, letter-spaced 0.2em, Jost, no border-radius anywhere in the button family (hard rectangle, always). The task brief noted the checkout/sitewide button convention is already configured as pure `#000000` fill elsewhere — that's a shade darker than the theme's own `--c-charcoal` token but close enough at email scale that it reads identically; **use `#000000` for the email button fill**, per what's already established and live, rather than importing the theme's slightly-warmer charcoal as a new one-off value. Secondary weight sitewide is either a transparent/outline treatment (`.ka-btn--ghost`) or a plain underlined text link (`.btn-dark`) — never a second competing solid button. That hierarchy is the one thing to protect here: **only one solid black button per email.**

Headings sitewide are always the serif display face (`--f-display`, Cormorant Garamond), never Jost — Jost is the sans used for eyebrows, buttons, and UI text (`--f-sans`), confirmed as the checkout font. Reproduce that same contrast in the emails (serif headline, sans everything else) rather than defaulting the whole email to one typeface — this is the single highest-leverage typography decision available in a tool this constrained, worth getting right even if nothing else about the font rendering is controllable.

### 9.1 Color tokens — set these in the editor's "Email colors" panel

| Token (as labeled in the panel, best guess) | Value | Notes |
|---|---|---|
| Content background | `#FFFFFF` | Leave as-is. Already correct — don't swap to the site's warm ivory (`#F7F3EC`); pure white renders most reliably across email clients and is a legitimate, standard choice for an editorial email, not a compromise worth fighting. |
| Border | `#DBDBDB` | Leave as-is. Close enough to the site's own hairline tone that changing it isn't worth the effort — see §9.5. |
| Heading/text color (if a separate field exists) | `#2A2420` | The site's actual ink token (`--c-ink`), a hair softer than pure black. If the panel only offers pure black/gray presets with no custom hex entry, leave default black — the visual difference at this scale is negligible. |
| Accent/link color (if a separate field exists) | `#9A7B4F` | The site's rosegold accent (`--c-rosegold`). Use for the eyebrow label and for any plain text-link CTA (see §9.2). |

**If the panel exposes fewer or different tokens than this** (e.g. no separate heading-color field), that's expected — Suraj, report back exactly what fields you see and I'll re-map this table; don't spend time hunting for a field that isn't there.

### 9.2 Button styling — both emails

**Primary button** (Email 1: "Complete Your Order"; Email 2: "Book a Styling Conversation"):
- Fill color: `#000000`
- Text color: `#FFFFFF`
- Shape: square corners, no rounding — if the button block has a corner-radius option (Square / Rounded / Pill), choose **Square**. If there's no such option, the default is very likely already square; don't chase it further.
- Label text: type it **in actual capital letters** — `COMPLETE YOUR ORDER` / `BOOK A STYLING CONVERSATION` — since the editor almost certainly has no text-transform or letter-spacing control to apply uppercase automatically (see §9.5). Drop the trailing "→" from the typed label only if the button block has its own built-in arrow/chevron icon toggle; otherwise keep the arrow exactly as drafted in §8.
- Only one of these per email. Do not also make the secondary CTA a solid black button — see below.

**Secondary button** (Email 1: "Message the Concierge" — WhatsApp; Email 2: "Return to Your Selection" — checkout link):
- Email 1 ("Message the Concierge"): give it visibly lighter weight than the primary button, matching how `.ka-btn--ghost` works sitewide (outline, not filled). **If the button block supports an Outline/Bordered style:** border `#000000`, text `#000000`, fill transparent/none. **If the block only supports solid fills** (no outline option — plausible in Shopify Email's simpler block system): don't make it a second black button. Instead set it as a plain text link, not a button block at all — text color `#9A7B4F` (rosegold), underlined, normal weight. Either way it must read as visibly secondary to "Complete Your Order."
- Email 2 ("Return to Your Selection"): this one is **already specified as a plain text link in the copy draft**, not a button — keep it that way. Text color `#9A7B4F`, underlined. No button block needed here at all; this is the easy case.

**Reasoning on the outline-vs-text-link fallback:** the sitewide system has three tiers (solid charcoal, transparent-outline, and plain underlined text) precisely so the eye never has to guess which action matters more. A second solid black button in the same email would flatten that hierarchy and make the email feel like two competing offers instead of one primary path with a human alternative. If in doubt, default down to a text link rather than up to a second button.

### 9.3 Typography

- **Body/UI text (eyebrow, paragraphs, buttons, sign-off):** search the font dropdown for **Jost** first — it's a standard Google Font and plausibly available; if present, select it everywhere the site uses `--f-sans`, matching checkout exactly. If Jost isn't in the list, fall back in this order: **Assistant → Poppins → Century Gothic → system sans-serif default.** All share Jost's geometric, single-story character; don't substitute a serif here.
- **Heading only** ("We Kept This For You." / "Take Your Time. / We Will Be Here."): search for **Cormorant Garamond** — this is the site's actual display face for every headline sitewide (`--f-display`), and reproducing the serif/sans contrast is worth more than font-matching accuracy on the body text. If unavailable, fall back to **Playfair Display → Georgia → the editor's default serif.** Do not use a sans font for the heading even if Jost is available — the contrast between serif headline and sans body is the point.
- Set the heading to the **largest** heading-size preset the editor offers (replacing the default "Your cart is ready for checkout" size/weight one-for-one is fine — don't shrink it).
- Eyebrow and sign-off should use the **smallest** available text-size preset.

### 9.4 Layout / block order

**Email 1 — "We Kept This For You":**
1. Logo — already correct, no change.
2. Eyebrow text block: `FROM THE ATELIER`, all caps as typed, smallest text size, color `#9A7B4F` if a per-block text color picker exists (else leave default).
3. Heading block: replace default heading copy with `We Kept This For You.` — largest heading preset, Cormorant Garamond per §9.3, color `#2A2420` or default black.
4. Body paragraph: the "Every piece at K&A is made to order..." copy from §8, regular body size, default text color.
5. Native product-recovery block: leave Shopify's own styling as-is. **Worth checking, not worth fighting:** if the block has its own accent/highlight color setting (e.g. the price text), try retinting it to `#9A7B4F` for a small extra touch of continuity — report back if that field exists. If it doesn't, leave the block entirely default; it already shows real product photography, which does the visual work on its own.
6. Primary button: `COMPLETE YOUR ORDER →`, per §9.2.
7. Body paragraph: "Have a question first..." WhatsApp invitation copy.
8. Secondary button/text link: `Message the Concierge`, per §9.2.
9. Divider (optional): if a divider/rule block with a color option exists, set it to a thin, light line — either the existing `#DBDBDB` border token or, if a custom color is allowed, something closer to the site's own hairline (a light warm gray, not pure gray). If the only option is Shopify's plain default divider, that's fine as-is — don't spend effort here.
10. Sign-off block: `With care, / The K&A Atelier`, smallest text size, default color.

**Email 2 — "No Rush. We're Here When You Are.":** identical skeleton, with two deliberate differences from Email 1, both already decided in §5/§8 and just needing the same visual treatment applied:
1. Logo (unchanged) → 2. Eyebrow `THE ATELIER` (same treatment as above) → 3. Heading `Take Your Time. / We Will Be Here.` (same serif/large treatment) → 4. Body paragraph → 5. Native product-recovery block, simpler variant if the editor offers one (per §5's note) → **6. Primary button here is the WhatsApp one: `BOOK A STYLING CONVERSATION →`, full solid-black treatment per §9.2 — this is the CTA-order inversion that's the entire point of Email 2, so it must carry the same visual weight Email 1 gave the checkout button, not a lesser one** → 7. "Prefer to pick up exactly where you left off?" line → 8. `Return to Your Selection` as a plain text link, rosegold, underlined — never a button → 9. optional divider → 10. sign-off.

### 9.5 What to leave as Shopify default — not worth fighting

- **Exact font rendering / kerning / line-height.** The editor will render its own defaults regardless of what's picked from a font dropdown; don't try to nudge line-height or paragraph spacing pixel-by-pixel.
- **True letter-spacing on buttons/eyebrows.** The sitewide 0.2em tracking is a CSS property this editor almost certainly can't expose. Typing labels in actual capitals (§9.2/§9.3) gets 90% of the visual effect for free; chasing the remaining tracking is not worth the time.
- **Centered vs. left-aligned heading.** Shopify's default centers the heading; that's a legitimate, calm, letter-quality layout for a transactional email and matches the "quiet, editorial" brand mindset well enough as-is. Don't fight the block system to force left-alignment.
- **The native product-recovery block's internal layout** (image size, price/qty placement). It's Shopify's own solved component with real product data — restyle only the accent color if that single field is exposed (§9.4 step 5), leave the rest.
- **Precise spacing between blocks.** Use whatever the editor's default block spacing gives; don't hunt for a manual padding override per block.

**What IS worth setting deliberately, in priority order:** (1) the single solid-black primary button per email, correctly distinguished from the secondary CTA — this is the one lever with real hierarchy impact; (2) the serif heading / sans body typographic contrast; (3) the rosegold eyebrow and text-link color, if the color pickers exist. Everything else in this section is a nice-to-have layered on top of those three.

---

## 10. Custom Liquid code — ready to paste (added 2026-08-29)

Suraj found a **"Custom Liquid"** block type under a "Custom" category in Shopify Email's block-adding menu — this is a raw HTML/CSS code block (with Liquid templating available), and it's a far more reliable way to hit §9's design spec exactly than setting a dozen individual GUI fields whose exact behavior can't be verified without live editor access. Below is complete, ready-to-paste code for both emails, built directly from §4/§5's approved copy and §9's design tokens.

**Architecture — two Custom Liquid blocks per email, native block kept exactly where it is:**
- Leave Shopify's native **"Items left in shopping cart"** block exactly where it already sits in the email (it's already rendering real product image/name/variant/quantity correctly — don't touch it, don't try to rebuild what it does).
- Add a new **Custom Liquid** block immediately **ABOVE** it (logo/eyebrow/heading/intro paragraph) — labeled **Block A** below.
- Add a second new **Custom Liquid** block immediately **BELOW** it (buttons/WhatsApp invite/sign-off) — labeled **Block B** below.
- Do not merge these into one block wrapping the native block — Shopify Email blocks are edited/reordered as discrete units in the sidebar, and keeping them separate means repositioning the native block later (if ever needed) doesn't require touching this code at all.

**Email-safety choices made in this code, so you know why it looks the way it does:**
- Table-based layout (not `<div>`s) — the standard email-dev pattern for cross-client reliability, especially Outlook on Windows, which still uses a Word rendering engine that ignores most modern CSS.
- All styling is inline `style="..."` attributes on every element — no `<style>` block, since many email clients (Gmail included, in some contexts) strip `<style>` blocks or apply them inconsistently.
- Buttons are `<a>` tags styled to look like buttons (table-cell background + padded anchor), never `<button>` elements — `<button>` is unreliable across email clients.
- Fonts: **Georgia, 'Times New Roman', serif** for headings, **Helvetica, Arial, sans-serif** for body/UI text. These are graceful-degradation stand-ins for the site's actual Cormorant Garamond / Jost — email clients can't reliably load custom web fonts, so this is the closest widely-supported approximation of the serif-heading / sans-body contrast that matters most (per §9's own priority list, item 2), not a pixel match to the site.
- Colors are exactly §9.1's table: content background `#FFFFFF`, border `#DBDBDB`, heading/text `#2A2420`, accent/rosegold `#9A7B4F`, primary button `#000000` fill / `#FFFFFF` text.
- No border-radius anywhere — square corners throughout, per §9.2.
- Button labels are typed in actual capital letters (`COMPLETE YOUR ORDER`, `MESSAGE THE CONCIERGE`, `BOOK A STYLING CONVERSATION`) since raw HTML *can* set real `letter-spacing` and `text-transform: uppercase` (unlike the constrained GUI blocks §9.5 was hedging for) — both are included below, so you get the sitewide 0.2em tracking look for real this time, not just the approximation §9.5 settled for.
- Secondary CTA in Email 1 ("Message the Concierge") is built as a real outlined button (black border, black text, transparent fill) — matching `.ka-btn--ghost`'s sitewide semantic exactly. This is possible here (unlike the GUI-block fallback §9.2 hedged toward) because raw HTML gives full control over borders, which render fine in Outlook (it's border-radius and gradients that are the actual Outlook problem, not borders).
- **Product name is deliberately NOT inserted as a merge field in the body copy.** §6/§8 flagged the exact Liquid variable name for a single line-item's product title as unverified and risky to guess without live testing access — the same caution the brief gave for the native block's cart data applies here too, since it's the same underlying checkout object. The copy below uses safe generic phrasing instead ("a piece from the collection" / "a piece like this one") that reads correctly either way, with the real product name and image still shown immediately below by the native block. An optional, clearly-flagged merge-field version is included as an HTML comment in each block if you want to test it — see the "OPTIONAL, UNVERIFIED" comment in Block A of each email.
- **The "Complete Your Order" / "Book a Styling Conversation" / "Return to Your Selection" links all point to `{{ checkout.abandoned_checkout_url }}`.** This is a real, documented Shopify Liquid object property (`checkout.abandoned_checkout_url`), used specifically for cart-recovery links in abandoned-checkout contexts — but it has **not been confirmed against this store's live editor**, since no browser access exists from this session. **Before turning the automation live: send yourself a test email and click every checkout-recovery link/button.** If it lands on a working checkout with the actual items still present, you're done. If the link is blank, broken, or 404s, do this instead: delete that one `<a href="{{ checkout.abandoned_checkout_url }}">...` link's href value, and check whether Shopify's own native "Items left in shopping cart" block already includes its own working "complete checkout" button with the recovery URL correctly wired — if so, either (a) rely on that native button alone and drop my duplicate button from the Custom Liquid code, keeping only the surrounding text/WhatsApp CTA, or (b) add a native "Button" block instead of Custom Liquid for just that one link, and use its own link-type picker if it offers a dynamic "Checkout URL" / "Recovery link" option — report back what you find either way and I'll fold the fix into this doc.
- WhatsApp URLs are pasted exactly as specified in §8 — no changes.

### 10.1 Email 1 — "We Kept This For You"

**What to do:** In the "Send marketing email" step of the Abandoned checkout automation, add a **Custom Liquid** block directly above the native "Items left in shopping cart" block and paste Block A into it. Add a second **Custom Liquid** block directly below the native block and paste Block B into it. Nothing else required — no other fields to set for these two blocks.

**Block A — paste ABOVE the native "Items left in shopping cart" block:**

```html
<!-- K&A Email 1 — Custom Liquid Block A (above native recovery block)
     Eyebrow + heading + intro paragraph. Fonts are safe email-client
     fallback stacks (serif heading / sans body), not the site's actual
     Cormorant Garamond / Jost — see §10 note on graceful degradation. -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background-color:#FFFFFF;">
  <tr>
    <td style="padding:32px 32px 0 32px;">

      <!-- Eyebrow -->
      <p style="margin:0 0 14px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#9A7B4F;">
        FROM THE ATELIER
      </p>

      <!-- Heading -->
      <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:34px;font-weight:400;color:#2A2420;">
        We Kept This For You.
      </h1>

      <!-- Body -->
      <p style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#2A2420;">
        Every piece at K&amp;A is made to order &mdash; cut, boned, and hand-embellished once we know it&rsquo;s yours. We noticed you began choosing a piece from the collection and wanted to hold the details here, in case you&rsquo;d like to continue.
      </p>

      <!--
      OPTIONAL, UNVERIFIED — only use if you confirm the variable works in a test send:
      replace the body paragraph above with this version to name the product inline.
      Untested: could be blank, could error, could show the wrong item on a multi-item
      checkout. Test before relying on it; the generic version above is the safe default.

      <p style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#2A2420;">
        Every piece at K&amp;A is made to order &mdash; cut, boned, and hand-embellished once we know it&rsquo;s yours. We noticed you began choosing {{ checkout.line_items.first.title }} and wanted to hold the details here, in case you&rsquo;d like to continue.
      </p>
      -->

    </td>
  </tr>
</table>
```

**Block B — paste BELOW the native "Items left in shopping cart" block:**

```html
<!-- K&A Email 1 — Custom Liquid Block B (below native recovery block)
     Primary button (checkout) + WhatsApp invite + secondary button
     (concierge) + sign-off. -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background-color:#FFFFFF;">
  <tr>
    <td style="padding:28px 32px 0 32px;" align="center">

      <!-- Primary button: Complete Your Order -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 32px auto;">
        <tr>
          <td align="center" bgcolor="#000000" style="background-color:#000000;">
            <a href="{{ checkout.abandoned_checkout_url }}" target="_blank" style="display:inline-block;padding:16px 40px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;background-color:#000000;">
              Complete Your Order &rarr;
            </a>
          </td>
        </tr>
      </table>

    </td>
  </tr>
  <tr>
    <td style="padding:0 32px;">
      <!-- WhatsApp invite paragraph -->
      <p style="margin:0 0 20px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#2A2420;">
        Have a question first &mdash; about fit, fabric, or how long the piece will take? Message our styling concierge on WhatsApp. A real person from the atelier, not a call centre.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px;" align="center">
      <!-- Secondary button (outline): Message the Concierge -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 32px auto;">
        <tr>
          <td align="center" style="border:1px solid #000000;">
            <a href="https://wa.me/919967543087?text=Hi%2C%20I%27d%20like%20to%20finish%20my%20order%20%E2%80%94%20could%20you%20help%3F" target="_blank" style="display:inline-block;padding:14px 36px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#000000;text-decoration:none;">
              Message the Concierge
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px 32px;border-top:1px solid #DBDBDB;">
      <!-- Sign-off -->
      <p style="margin:24px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:20px;color:#2A2420;">
        With care,<br>
        The K&amp;A Atelier
      </p>
    </td>
  </tr>
</table>
```

### 10.2 Email 2 — "No Rush. We're Here When You Are."

**What to do:** Same pattern as Email 1. In this email's own "Send marketing email" step, add a **Custom Liquid** block directly above the native "Items left in shopping cart" block and paste Block A into it. Add a second **Custom Liquid** block directly below the native block and paste Block B into it. Nothing else required.

**Block A — paste ABOVE the native "Items left in shopping cart" block:**

```html
<!-- K&A Email 2 — Custom Liquid Block A (above native recovery block)
     Eyebrow + two-line heading + intro paragraph. Same font-stack
     graceful-degradation note as Email 1 applies here. -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background-color:#FFFFFF;">
  <tr>
    <td style="padding:32px 32px 0 32px;">

      <!-- Eyebrow -->
      <p style="margin:0 0 14px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#9A7B4F;">
        THE ATELIER
      </p>

      <!-- Heading (two-line, same cadence as "Begin with a / Conversation.") -->
      <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:34px;font-weight:400;color:#2A2420;">
        Take Your Time.<br>
        We Will Be Here.
      </h1>

      <!-- Body -->
      <p style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#2A2420;">
        A piece like this one is not a quick decision &mdash; and it shouldn&rsquo;t be. Every K&amp;A garment is made to order, by hand, for the person who will wear it. If you&rsquo;re still weighing the fit, the fabric, or simply the moment, we&rsquo;re glad to talk it through. No obligation, only a conversation.
      </p>

      <!--
      OPTIONAL, UNVERIFIED — same caveat as Email 1 Block A. Test before relying on it.

      <p style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#2A2420;">
        A piece like {{ checkout.line_items.first.title }} is not a quick decision &mdash; and it shouldn&rsquo;t be. Every K&amp;A garment is made to order, by hand, for the person who will wear it. If you&rsquo;re still weighing the fit, the fabric, or simply the moment, we&rsquo;re glad to talk it through. No obligation, only a conversation.
      </p>
      -->

    </td>
  </tr>
</table>
```

**Block B — paste BELOW the native "Items left in shopping cart" block:**

```html
<!-- K&A Email 2 — Custom Liquid Block B (below native recovery block)
     Primary button here is WhatsApp (the CTA-order inversion that's the
     whole point of this email) + plain text link back to checkout +
     sign-off. "Return to Your Selection" is intentionally NOT a button. -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background-color:#FFFFFF;">
  <tr>
    <td style="padding:28px 32px 0 32px;" align="center">

      <!-- Primary button: Book a Styling Conversation (WhatsApp) -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 28px auto;">
        <tr>
          <td align="center" bgcolor="#000000" style="background-color:#000000;">
            <a href="https://wa.me/919967543087?text=Hi%2C%20I%20have%20a%20question%20before%20I%20complete%20my%20order." target="_blank" style="display:inline-block;padding:16px 40px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;background-color:#000000;">
              Book a Styling Conversation &rarr;
            </a>
          </td>
        </tr>
      </table>

    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px 32px;" align="center">
      <!-- Plain text link, never a button -->
      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;color:#2A2420;">
        Prefer to pick up exactly where you left off?<br>
        <a href="{{ checkout.abandoned_checkout_url }}" target="_blank" style="color:#9A7B4F;text-decoration:underline;">Return to Your Selection</a>
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px 32px;border-top:1px solid #DBDBDB;">
      <!-- Sign-off -->
      <p style="margin:24px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:20px;color:#2A2420;">
        With care,<br>
        The K&amp;A Atelier
      </p>
    </td>
  </tr>
</table>
```

### 10.3 If padding looks doubled once pasted in

Shopify Email's own content area may already add its own left/right padding around every block. If Block A/B look over-indented compared to the native block above/below them, that's the likely cause — the fix is to lower the `32px` side-padding values in the outer `<td>` of whichever block looks off (try `16px` or `0`), not to change anything else. Everything else in the code should render as designed regardless of the surrounding editor chrome.
