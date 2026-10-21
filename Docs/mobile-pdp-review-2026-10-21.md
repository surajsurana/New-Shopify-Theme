# Mobile product page review (Creative Director) - 2026-10-21

Prepared for: SEO & Discoverability (conversion report Findings 3 and 4), Technical Director.
Status: review and recommendation only. Nothing built, nothing touched in the theme, Shopify or git.
Method: live pages rendered in headless Chrome (puppeteer-core, iPhone + Instagram user agent, 2x), at 390x844 and 390x660 (660 approximates Instagram's in-app browser after its top and bottom chrome; the real Instagram chrome itself is not drawn, only the shorter viewport). Pages: /products/mani and /products/electric-blue-victorian-corset-with-drape-saree. Code read: sections/ka-product-main.liquid, assets/ka-product-main.css, assets/ka-product.js, sections/ka-nav.liquid (appointment handler), assets/ka-concierge-float.css. Safari/WebKit not tested (Chrome engine only, per the known testing gap).

Screenshots (all in Docs/review-assets/):
- mobile-pdp-mani-first-screen-390x844.png, mobile-pdp-mani-first-screen-390x660.png
- mobile-pdp-electric-blue-first-screen-390x844.png, ...-390x660.png
- mobile-pdp-mani-purchase-area-390x844.png, ...-purchase-area-size-selected-390x844.png, ...-cta-stack-390x844.png (same three for electric-blue)

---

## Answer to Q4: what is visible on /products/mani without scrolling

Measured page positions (CSS px from top of page; identical on both products within 8px):

| Element | Top of page (px) | On first screen at 844? | At 660? |
|---|---|---|---|
| Utility bar + nav + breadcrumb (all chrome) | 0 to 183 | yes | yes |
| Gallery image | 183 to 650 | yes (fully) | cropped at about knee height |
| Thumbnails | 650 to 750 | yes | no |
| Product title (h1) | 833 | no | no |
| Price | 1,012 | no | no |
| "Made to measure, crafted to order in 20-25 working days" | 1,066 | no | no |
| Size buttons | 1,182 | no | no |
| Add to Bag / Book an Appointment (in page) | 1,318 / 1,394 | no | no |
| Sticky bottom bar (Appointment / Concierge / Add to Bag) | fixed, 72px | yes | yes |

At 390x844 a visitor sees: the announcement strip, the logo bar, a breadcrumb, the product name only as a small grey uppercase breadcrumb (the real h1 is below), the full model image with a "01 / 03" counter, the three thumbnails, and the sticky bar. At 390x660 the image is cut off below the knees and the thumbnails are gone. Roughly 28% of a 660px screen is brand chrome before any garment appears.

**Not visible on the first screen: price, lead time, size, any explanation of made-to-measure, any reason to enquire.** A first-time Instagram visitor sees a beautiful photo and nothing about what this is, what it costs or what to do.

**Is a WhatsApp option visible without scrolling? Yes, but weakly.** The sticky bar's middle button, "Concierge" (small dot, pale beige fill, 0.62rem), is a wa.me link with the product name pre-filled. The big floating Concierge chip is deliberately hidden on this page on phones (it would collide with the bar). So WhatsApp is present, but:
1. It is labelled "Concierge", not "WhatsApp" or "Message us", so an Instagram visitor does not know it is a human chat on WhatsApp. It looks like a third equal-weight button between two others.
2. It is the lowest-contrast of the three, sandwiched between an outlined "Appointment" and a greyed-out "Add to Bag". The disabled Add to Bag (grey, looks broken until a size is chosen) is the most visible thing in the bar on first load.
3. The in-page buttons (after the gallery, at 1,318px) contain **no** WhatsApp/enquire button at all: only Add to Bag and "Book an Appointment". The one product-aware enquiry link exists only in the sticky bar.
4. "Appointment" and "Book an Appointment" open WhatsApp too (a delegated handler in ka-nav.liquid calls `window.open('https://wa.me/<number>')`), but **with no product text**. So the two most prominent "talk to us" buttons start an empty chat with no idea which piece the person was looking at; only the small "Concierge" button carries the product name. Also `window.open` from a script is the form most likely to be blocked or mishandled in Instagram's in-app browser; a plain `<a href target=_blank>` is the safe form.

Verdict: the enquiry route exists and is one tap away, but it is camouflaged, mislabelled, and the best-wired version of it is the least visible. For about 2,200 Instagram visitors on a Rs 1,40,000 piece this is a plausible reason for zero orders AND for unmeasured (because untracked) enquiries.

---

## Answer to Q5: the mobile purchase area in general

What is there (code + render):
- **Order of the panel:** collection tag, title, poem, Google rating row, price + "taxes included", made-to-measure line, size grid (XS-XL, five columns), "Made to my measurements - Recommended" option, a hidden explainer, Add to Bag, Book an Appointment, three assurance lines, accordions.
- **Sticky bar (<900px):** fixed bottom, z-index 95, three buttons in a row: Appointment, Concierge, Add to Bag (disabled until a size is chosen). Price and product name are not in it. The desktop mini-bar (with name and price) is hidden on phones.
- **Lead time:** shown (small rose-gold uppercase line under the price), normalised to "working days". Good, but it sits below the first screen.

What makes the next step harder on a phone:

1. **Nothing decision-relevant above the first scroll** (see Q4). Title, price, lead time and size all arrive 1.4 to 2 screens down. A visitor must scroll past the gallery and thumbnails before learning the price.
2. **A made-to-measure piece is sold with a ready-to-wear size selector.** XS to XL buttons are the first interaction; "Made to my measurements: Recommended" is a *second*, unselected option underneath. The page says "Recommended" yet leads with off-the-peg sizes and a size chart. For Rs 30,000 to 4,80,000 pieces, the honest primary path is "tell us your measurements/occasion".
3. **Add to Bag is the loudest control, the enquiry is not.** Bag: full-width rose-gold block in the page and a button in the bar. Enquiry: pale beige "Concierge". Reverse of how a 1.4 lakh purchase is actually made.
4. **Three buttons in a 390px bar at about 10px type.** Each is about 110px wide; labels are tiny and tracked wide. Three decisions at once; no clear primary. The in-page stack then repeats Add to Bag and Appointment, so after the first scroll the screen shows the same two buttons twice (see cta-stack screenshot).
5. **A disabled-looking primary.** Add to Bag is grey until a size is tapped. Tapping it does show a hint and scroll to the sizes (good), but the visitor from the first screen sees a greyed-out button and no size picker anywhere on screen.
6. **Add to Bag with "Made to my measurements" is an unspecified payment.** The explainer says place the order, no measurements needed yet, an advisor contacts you in 24 hours. For a Rs 1,40,000+ item that is asking for card payment before any fit conversation. The abandoned checkouts in the conversion report (Rs 3.8 lakh and 4.75 lakh lehengas, repeat attempts) look like exactly the people who wanted to talk first.
7. **Appointment buttons lose context and may misbehave in-app** (no product text; script-opened window).
8. **"Concierge" vs "Appointment" vs "Book an Appointment" all go to the same WhatsApp thread**, three names for one action. The visitor cannot tell which to choose; the Concierge team cannot tell which was pressed (nothing is tracked).
9. **No inline reassurance near the buttons.** The assurances (hand-embroidered, free DHL delivery, personal advisor) sit below the CTAs and are text-heavy; the response-time promise ("reply within the hour, 10am-8pm IST") exists nowhere near the WhatsApp button.
10. Minor: the Google rating row (with a multicolour G logo) sits above the price and pushes it further down; the logo colours are off-palette.

Emotional audit of the mobile PDP: dominant emotion **Desire** for the first image (strong, well-lit photography), dropping to **Confusion** at the first screen's call to action (three similar buttons, one greyed out) and **Indifference** once the visitor has scrolled and still sees no price.

Scorecard (mobile PDP, 1-10): First impression 7, Photography 8, Typography 7 (button type too small), White space 6, Storytelling 5 (nothing above the fold), Craftsmanship visibility 4 (lower down), Navigation 5, Mobile experience 5, Brand consistency 8, Overall luxury 6.5.

---

## Recommendations (opinionated, in priority order)

Principle: for this price band the website's job is to start a private conversation with a person, quietly and without pressure. Add to Bag remains available for the lower price points and overseas buyers who do buy online (all 11 online orders were Rs 29,000-48,000, 9 of 12 items shipped abroad), but it should stop being the loudest element on pieces above roughly Rs 50,000.

### 1. Replace the three-button bar with one two-button concierge bar (PRIORITY 1)
- **What:** sticky bar becomes two buttons: primary, charcoal, full height: "Message us on WhatsApp" (small WhatsApp-style glyph, product pre-filled); secondary, outlined: "Add to Bag" (labelled "Select size" until chosen, not greyed). Drop the separate "Appointment" button from the bar; appointment becomes a line inside the WhatsApp message options (see 3).
- **Why:** one clear primary action, honest label ("WhatsApp" is understood instantly by an Instagram visitor, "Concierge" is not), visible at 390x660.
- **Build size:** small. Markup change in the mobile bar plus a CSS tweak.
- **Expected effect:** the largest likely lift in measured enquiries; cannot be quantified without baseline enquiry data. Bag rate on phones may drop slightly for high-priced pieces; that is acceptable if enquiries rise, and should be judged on enquiries plus orders together.
- **Luxury check:** passes. Charcoal, not a bright colour; no urgency copy.

### 2. Put the essentials on the first screen (PRIORITY 2)
- **What:** slim the chrome and add a compact "title + price" line directly over or under the image. Concretely: (a) merge the breadcrumb into a one-line small back-link ("< All products") saving about 60px; (b) show the real title and price (and "Made to measure - 20-25 working days") immediately under the image, with the thumbnails turned into a swipeable gallery with dots so they stop taking 100px; (c) keep the image about 4:5 so the model and a caption fit in 660px.
- **Why:** a visitor deciding in a few seconds on Instagram needs name, price and lead time without scrolling. Luxury houses show the price, quietly.
- **Build size:** moderate. Reorders markup and replaces the thumbnail strip with a swipe gallery (the native-ratio stage logic needs care).
- **Expected effect:** fewer "what is this and what does it cost" bounces; supports every other step. Hard to isolate; measure scroll depth.

### 3. Make made-to-measure the default path, not the second option (PRIORITY 3)
- **What:** on pieces above a price threshold (a metafield, for example `custom.enquiry_first`), reorder the purchase block: first "Begin your order with your advisor" (WhatsApp, product + occasion pre-filled), then the size grid below as "or choose a standard size". Keep Add to Bag for sized variants. Change the MTM option's Add to Bag so it opens WhatsApp instead of a paid cart line, or require a note; and revise the wording that implies payment before fit.
- **Why:** it matches how a 1.4 lakh made-to-measure sale actually happens, and it removes the "pay before we have talked" problem behind the abandoned lehenga checkouts. It also feels more couture.
- **Build size:** moderate (metafield + conditional markup + copy), plus a decision from Suraj about MTM checkout behaviour (business decision, not a design one).
- **Expected effect:** more qualified enquiries, fewer abandoned checkouts on high-value pieces; average order value up over time. Needs Suraj's decision before build.

### 4. One WhatsApp destination with product context everywhere (PRIORITY 4, quick)
- **What:** all appointment/concierge buttons on a product page use a real `<a href>` to wa.me with the product title and URL pre-filled (appointment variant: "I would like to book an appointment to see the X"), instead of a script `window.open` with no text. Tag each with `data-ka-enquiry` and `data-ka-placement` (`pdp-sticky-bar`, `pdp-inline`, ...) per the SEO report's section 6.
- **Why:** an anchor is more reliable in Instagram's in-app browser; context lets the concierge reply properly; tracking is the prerequisite for judging all of this.
- **Build size:** small.
- **Expected effect:** fewer lost or blank chats, enquiries finally countable.

### 5. Add an inline WhatsApp line next to the in-page buttons, with a response promise (PRIORITY 5)
- **What:** under Add to Bag, a quiet text link "Prefer to talk? Message our style advisor on WhatsApp - we reply within the hour, 10am-8pm IST." (only state a time the team can honour; copy needs Suraj's confirmation).
- **Build size:** small. **Effect:** reassurance at the exact moment of hesitation; also gives a second, tracked placement.

### 6. Small refinements (batch together, small)
- Bar text size to at least 11px (0.7rem) with less letter-spacing; bar height unchanged.
- Add to Bag in the bar reads "Select size" and scrolls to the sizes on tap, rather than appearing disabled.
- Move the Google rating row below the price (or onto one line with it), and use a monochrome G.
- Respect `env(safe-area-inset-bottom)` on the sticky bar.
- Instagram traffic only: keep the Instagram-landed page simple; do not add popups or exit prompts (not recommended on any account).

### Rejected on luxury grounds
Countdown or "only N left" urgency, discount nudges, a pop-up chat widget, a bright green WhatsApp button, auto-opening chat prompts. A small neutral glyph in the house charcoal and rose-gold is enough.

---

## What to measure (ties into the enquiry-tracking work)

Prerequisite: TD adds `ka_enquiry_click` with `placement`, `product_handle`, `device` (SEO report section 6). Then, by device and by source (Instagram vs Google vs direct), per product page:
1. **Enquiry rate** = WhatsApp/appointment taps / product-page sessions. Primary metric for these changes. Break out by placement: sticky bar, inline, nav.
2. **Add-to-bag rate** (already available) and bag-to-checkout rate, shown alongside enquiries so a shift from bag to WhatsApp is not misread as a loss.
3. **Scroll depth / first-screen interaction**: percentage of sessions that scroll past the gallery (to test recommendation 2).
4. **Concierge-side:** a simple tally of how many WhatsApp conversations that began from the site turned into an order or appointment (the pre-filled text with a product reference makes this countable). Online conversion alone will understate the result.
5. **Mani check:** the next Instagram push to /products/mani is the natural test. Record enquiry taps per 1,000 visits before and after recommendation 1.
6. Sample caution: at 2 to 5 online orders a month, compare enquiries and bag adds, not orders, over at least 4 weeks per change; change one thing at a time.

## Suggested sequence
1. Tracking plus recommendation 4 (small, no visual change) - ships first so a baseline exists.
2. Recommendation 1 and 6 (small, visible, low risk).
3. Recommendation 2 (moderate).
4. Recommendation 3 after Suraj decides how made-to-measure orders should be paid (business decision).
I can prototype 1 + 2 + 3 as a 390px interactive HTML mock for approval before any build, once the current release has shipped.

## Platform notes for Technical Director
- Nothing here needs more than Liquid, CSS and JS; the high-price metafield is a normal product metafield.
- WhatsApp web links opened from Instagram's in-app browser hand off to the WhatsApp app; behaviour should be checked on a real iPhone and Android, since only Chrome rendering was tested here.
