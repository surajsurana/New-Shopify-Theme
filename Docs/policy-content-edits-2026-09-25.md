# Policy content edits -- DRAFT for Suraj's approval (2026-09-25)

Shop policies are store data (Admin > Settings > Policies), not theme code: any save is live
immediately, with no staging. Nothing below has been written yet.

Decisions already made by Suraj (2026-09-25): phone = +91 99675 43087 (same as site WhatsApp);
keep "Peekay International Ltd." as website operator in the Terms; correct email = info@karishmaashita.com;
correct address = 2A, Ganga Building, Talmaki Road, Near Dhan Pothohar Gurudwara, Santacruz (West),
Mumbai - 400054; add a Returns section to the Shipping policy AND a separate "Returns & Refunds" footer link.
Heading convention (per Docs/policy-pages-build-spec.md): h1 = sections, h2 = sub-sections, h3 = minor labels.

## 1. Shipping policy -- full replacement body

Fixes: "Shipping Charges: Calculated automatically at checkout" (wrong -- checkout is genuinely free to every
country, verified in the delivery profiles); duplicated customs-duties paragraph; adds the Returns section.
Deliberately does NOT list day-counts by category: the product pages state the time per piece (the store has a
fourth "45 - 50" tier not in the FAQ, still to be decided).

```html
<h1>Shipping charges</h1>
<p>We offer complimentary shipping on every order, worldwide. Orders are dispatched by DHL Express, and no shipping charge is added at checkout.</p>

<h1>Production and delivery time</h1>
<p>Every piece is made to order, so timelines vary with the design and any customisations you choose. The estimated time for each piece, in working days, is shown on its product page. If you would like a precise timeframe for your order, feel free to contact us on WhatsApp.</p>

<h1>International shipping</h1>
<p>We ship worldwide through our trusted partner, DHL Express, known for reliable and timely service. Orders are shipped directly from Mumbai, India, and delivery times depend on your destination address.</p>
<p>Any customs duties or taxes, if applicable, are the responsibility of the customer. These charges are determined by your country's regulations, and we appreciate your understanding.</p>
<ul>
<li><strong>Tracking number:</strong> every order is provided with a tracking number as soon as it ships.</li>
<li><strong>Cash on delivery:</strong> currently not offered.</li>
</ul>

<h1>Returns, exchanges and cancellations</h1>
<p>Because every piece is made to order and to your measurements, we are unable to offer returns on any of our products. If a genuine defect is detected, we may, at our discretion, exchange the product. Refunds are not offered.</p>
<p>Once an order is placed, it cannot be cancelled.</p>
<p>For full details, please see our <a href="https://karishmaashita.com/policies/refund-policy">Refund policy</a>, or get in touch with us at info@karishmaashita.com.</p>

<p>Thank you for shopping with us. We are committed to ensuring that your order arrives as quickly and seamlessly as possible.</p>
```

## 2. Terms of service -- only these edits, everything else stays word-for-word

- Section 6: "[LINK TO REFUND POLICY]" -> link "Refund Policy" to https://karishmaashita.com/policies/refund-policy
- Section 10: "[LINK TO PRIVACY POLICY]" -> link "Privacy Policy" to https://karishmaashita.com/policies/privacy-policy
- Section 20 (contact), replace with:
  "Questions about the Terms of Service should be sent to us at info@karishmaashita.com.
   Our contact information is posted below:
   K&A by Karishma and Ashita
   info@karishmaashita.com
   2A, Ganga Building, Talmaki Road, Near Dhan Pothohar Gurudwara, Santacruz (West), Mumbai - 400054, Maharashtra, India
   +91 99675 43087"
- Unchanged: "This website is operated by Peekay International Ltd." (kept by decision).
- Optional, NOT included unless Suraj says so: the CD's restructured Terms body with real headings
  (Docs/policy-terms-restructured-body.html; wording unchanged, structure only).

## 3. Contact information policy -- full replacement body

Fixes the email (was kariashi.couture@gmail.com), keeps the correct Ganga Building address and the existing
phone (same number as the site's WhatsApp, now formatted like the site), makes phone/email tappable, drops the
empty trailing paragraph.

```html
<p><img alt="" src="https://cdn.shopify.com/s/files/1/0768/3112/9890/files/IMG_6433.jpg?v=1725805721"></p>
<p><strong>K&amp;A by Karishma and Ashita</strong></p>
<p>2A, Ganga Building, Talmaki Road, Near Dhan Pothohar Gurudwara, Santacruz (West), Mumbai - 400054. MH, India.</p>
<p><a href="tel:+919967543087">+91 99675 43087</a></p>
<p><a href="mailto:info@karishmaashita.com">info@karishmaashita.com</a></p>
```

## 4. Refund policy -- no edit
Text has no contact details and is consistent with the FAQ (no returns, exchange only for genuine defect, no
refund, no cancellation). Left word-for-word. (Its fake headings are styled by the new policy CSS.)

## 5. Privacy policy -- ON HOLD
Live text is Shopify's unfilled template (26 visible [INSERT ...] placeholders, "Last updated: [Date]", refers
to karishmaandashita.myshopify.com, contains an unfilled CCPA "sells Personal Information" statement, contact
email kariashi.couture@gmail.com). Suraj says an earlier privacy policy existed before the new theme and wants
that one used. The copy could not be found automatically: not in Drive, not in the repo, and the Wayback
Machine index lists a 2023-07-23 snapshot of /policies/privacy-policy but the content returns 404. Waiting for
Suraj to say where it is (file, doc, email, old page).

## Also found (not changed)
- The existing Google review replies (Ashita's, e.g. the 1-star responses) tell customers to write to
  kariashi.couture@gmail.com. Outside this task, but the same wrong-email problem exists there.
- Collection pages' "Made to Order" facts show weeks (e.g. "4-6 Weeks", "6-8 Weeks", "8-10 weeks") that
  contradict the product-page tiers; 18 collections show "-". A content decision, fixed in collection metafields.
- Cart page has a hardcoded sentence "Crafted to order in 20-25 days..." shown for every cart (sections/ka-cart-items.liquid L273).
- 30 active products carry a 4th tier "45 - 50 Days" not in the FAQ; two more have malformed spellings.
