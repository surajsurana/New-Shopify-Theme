# "Advisor" -> "Designer" copy change (Suraj decision, 2026-10-21)

Rule: the person who calls after a made-to-measure order and takes WhatsApp enquiries is "your designer" / "our designers". Drop "personal", "style" and "advisor" entirely ("your personal style advisor" becomes just "your designer"; the extra adjectives read as a job title, not a person).
"Concierge" stays as the name of the WhatsApp/appointment service (button labels, floating button, nav, footer, 404, search, collection band). It is a service, not a person. Only the two spots that name a person as "advisor" change.
Verified: no WhatsApp pre-filled message text (wa.me data) contains "advisor". Full-theme grep: nothing else customer-facing.

## Replacements (sitewide, ordered by file)

| # | file:line | old | new |
|---|---|---|---|
| 1 | sections/ka-product-main.liquid:350 | Your advisor will call within 24 hours of your order. | Your designer will call within 24 hours of your order. |
| 2 | sections/ka-product-main.liquid:361 | ...Your personal style advisor will be in touch within 24 hours to begin. | ...Your designer will be in touch within 24 hours to begin. |
| 3 | sections/ka-product-main.liquid:362 | Confirm your fit with your advisor — over WhatsApp... | Confirm your fit with your designer — over WhatsApp... |
| 4 | sections/ka-product-main.liquid:402 | Message our advisor on WhatsApp | Message our designer on WhatsApp |
| 5 | sections/ka-product-main.liquid:419 | A personal advisor accompanies every order, confirming your measurements and fit after you enquire. | Your designer accompanies every order, confirming your measurements and fit after you enquire. |
| 6 | sections/ka-product-main.liquid:447 | ...share your details with your style advisor. | ...share your details with your designer. |
| 7 | sections/ka-product-main.liquid:470 | ...kindly review our exchange policy with your style advisor | ...kindly review our exchange policy with your designer |
| 8 | sections/ka-cart-items.liquid:217 | A style advisor will confirm your measurements after checkout | Your designer will confirm your measurements after checkout |
| 9 | sections/ka-cart-items.liquid:287 | Crafted to order. A personal advisor will confirm fit and measurements after you check out. | Crafted to order. Your designer will confirm fit and measurements after you check out. |
| 10 | sections/ka-cart-items.liquid:311 | ...our style advisors are always glad to begin with a conversation rather than a cart. | ...our designers are always glad to begin with a conversation rather than a cart. |
| 11 | sections/ka-cart-cross-link.liquid:27 | A few pieces our style advisors often pair with what's already in your bag. | A few pieces our designers often pair with what's already in your bag. |
| 12 | templates/page.faq.json:194 | ...our styling concierge and advisors are always glad to help... | ...our styling concierge and designers are always glad to help... (keeps concierge = service, designers = people; or simplify to "our designers are always glad to help" if preferred) |
| 13 | sections/ka-product-styling.liquid:45 (schema default, missed in original list) | ...Our style advisors will tailor the silhouette... | ...Our designers will tailor the silhouette... |
| 14 | templates/product.json:171 (saved live value of #13, customer-facing, missed in original list) | ...Our style advisors will tailor the silhouette... | ...Our designers will tailor the silhouette... |

Notes
- #13/#14: the product_styling body is overridden by the product's custom.styling_notes metafield when present. Technical Director should grep product metafield values for "advisor" too (outside theme files, not checked here).
- #5 and #9 change "A personal advisor" to "Your designer" (definite article, matches the 24-hour call line).
- Code comments (ka-product-main.liquid:342, ka-product.js:171) are not customer-facing; optionally update for consistency.
- Remaining "concierge" copy intentionally unchanged: floating button, nav drawer, footer link, 404 "styling concierge on WhatsApp", search empty state, FAQ empty state ("Ask Our Styling Concierge"), cart empty "Speak with a Couture Concierge", collection band, reviews quote (Meera S., a real review, never edit).
- Pre-filled WhatsApp texts ("I'd like to speak with a concierge") unchanged; optional later: "speak with a designer" if Suraj wants the PDP line #4 to feel consistent when the chat opens.
