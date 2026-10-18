# Policy Pages (Refund, Shipping, Privacy, Terms, Contact Information) — Design & Build Specification
**Document version:** 1.0
**Date:** 25 September 2026
**Prototype:** `Prototypes/policy-pages-v1.html` (loads the real, unedited live policy text into the proposed design; switch policy / desktop-mobile / related-row on-off; its CSS is the proposed production CSS)
**Status:** For Suraj's review. Nothing implemented. Footer link labels/structure are deliberately out of scope (waiting on Suraj).

---

## 0. Summary and recommendations

1. **Header + footer.** Policy pages need the standard `ka-nav` (utility bar, logo, menu, currency chip) and `ka-footer`, unchanged. Because Shopify gives themes **no template for policy pages** (verified below: the body is rendered by Shopify itself), they must be rendered from `layout/theme.liquid` when `request.page_type == 'policy'`. Recommended mechanism in §2.
2. **Long-form design.** One reading column (720px, `--max-text`), Jost 300 body at 1rem/1.85, an italic Cormorant page title with a small "Our Policies" eyebrow and hairline rule, and a **visual heading map** that turns Shopify's "h1 for every section" into a calm three-tier hierarchy. Reuses `ka-base.css` tokens and the `ka-article-body.css` reading recipe. **No new tokens, no new fonts.**
3. **Cookie tables** stay real tables on desktop and become stacked rows (name, function, duration) at 640px and below. No horizontal scrolling.
4. **"Related policies" row: yes, recommended** (§5) — a 2 × 2 grid at the foot of every policy: **Returns & Refunds**, Shipping, Privacy, Terms of Service, each with a one-line description. It directly answers "customers can't find the returns policy" for anyone who lands on any policy page, and labels the refund policy the way customers look for it ("Returns").
5. **Content problems found while verifying (need Suraj, not build work) — please read §6.** The most important: **the live Privacy Policy still contains 26 unfilled Shopify template instructions** (e.g. "[INSERT AGE]", "[ADD ANY OTHER VENDORS…]", "Last updated: [Date]") and a clause stating *"Our Site sells Personal Information, as defined by the California Consumer Privacy Act"* that is almost certainly template text, not a considered statement. Giving these pages a proper header and better design makes that text more visible, not less. It should be completed/reviewed before this ships.

---

## 1. What Shopify actually emits (verified against the live pages, 25 Sept 2026)

Fetched raw HTML of all five `/policies/*` URLs. Every page has:

```html
<body class="template-policy">        <!-- from layout/theme.liquid: class="template-{{ request.page_type }}" -->
  <div class="shopify-policy__container">
    <div class="shopify-policy__title"><h1>Refund policy</h1></div>
    <div class="shopify-policy__body"><div class="rte"> …merchant HTML… </div></div>
  </div>
```
Confirmed: `.shopify-policy__container`, `__title`, `__body`, `.rte` (your recollection was right). Titles are Shopify's fixed strings: "Refund policy", "Shipping policy", "Privacy policy", "Terms of service", "Contact information". The theme cannot change the title text or wrap the body; **it can only style these classes** (plus add extra chrome in the layout). The global concierge button and the welcome-offer markup also render on these pages (they are in the layout).

What the merchant HTML contains (this drives the design):

| Page | Body size | Structure |
|---|---|---|
| Refund | 0.9 KB | 8 `<p>`; sub-headings are **fake**: `<p><span style="text-decoration:underline"><strong>Returns</strong></span></p>` |
| Shipping | 1.4 KB | `<p><em>Shipping Time:</em><br>…` lead-ins (fake headings), one `<ul>` of 3 items |
| Privacy | 21 KB | **10 × `<h1>` (every section) + 9 × `<h2>`**, 42 `<li>`, `<ul>` placed **directly inside `<ul>`** (invalid nesting), 2 cookie tables × 3 columns (45 data rows in total), 12 links, lots of `<i>`/`<u>` |
| Terms | 20 KB | **A single `<p>`** with 107 `<br>`; section titles are inline `<strong>SECTION 1 - …</strong>`; no headings, no paragraphs |
| Contact | 0.5 KB | One store photo (`<img>` 4032×3024, 1.5 MB) inside `<p><strong>`, then name / address / phone / email as bold paragraphs, one empty `<p><br></p>` |

---

## 2. Platform approach (for Technical Director — please verify quickly)

**Why the header/footer are missing (confirmed by reading `layout/theme.liquid`):** the layout only outputs `{{ content_for_layout }}`; `ka-nav` and `ka-footer` are declared as sections inside each page's template JSON. Policy pages have no template JSON, so neither renders. *(To verify: that Shopify offers no `templates/policy.*` override. My understanding is that legal policies are rendered by Shopify's built-in template and are not themeable per-template; the emitted `shopify-policy__*` classes are the only hook. If a policy template does exist for this theme type, the design below applies unchanged as a section.)*

**Recommended mechanism — conditional section groups in the layout:**
- `sections/ka-policy-header-group.json` (`"type":"header"`) containing `ka-nav`, and `sections/ka-policy-footer-group.json` (`"type":"footer"`) containing `ka-footer`. Copy the exact `ka-nav` and `ka-footer` settings from `templates/page.json` so the header and footer are **identical to every other page**.
- In `layout/theme.liquid`:
  ```liquid
  {%- if request.page_type == 'policy' -%}{% sections 'ka-policy-header-group' %}{%- endif -%}
  {{ content_for_layout }}
  {%- if request.page_type == 'policy' -%}{% render 'ka-policy-nav' %}{% sections 'ka-policy-footer-group' %}{%- endif -%}
  ```
  (Use the same `request.page_type` idiom the layout already uses; class `template-policy` on `<body>` confirms the value.)
- Alternative if groups misbehave: `{% section 'ka-nav' %}` / `{% section 'ka-footer' %}` static renders (settings then live in `config/settings_data.json`).
- Load `ka-policy.css` (below) **only** on policy pages: `{%- if request.page_type == 'policy' -%}{{ 'ka-policy.css' | asset_url | stylesheet_tag }}{%- endif -%}` in `<head>`.
- The header is `position:fixed` (utility bar + nav), so `.shopify-policy__container` supplies the top clearance (150px, same convention as `ka-page-generic`).
- **Editor caveat:** policies are not selectable in the theme editor's page picker, so header/footer settings for these pages will not be editable visually; they live in the two JSON files. Acceptable (same content as other pages; changes are rare).
- **Welcome-offer popup:** recommend adding `policy` to its exclusion (same reasoning as the cart: someone reading Returns terms is mid-decision, and an offer card over legal text interrupts reading). One-line change to the existing `unless request.page_type == 'cart'` guard in the layout. Not required for this build; your and Suraj's call.
- **No `.reveal` classes / scroll animation** on policy content: nothing here should be able to stay invisible if JS is slow. Plain, instant, reliable.

---

## 3. Design

### 3.1 Page structure (top to bottom)
1. Fixed header (utility bar + nav) — unchanged `ka-nav`.
2. `.shopify-policy__container` — paper background, `padding: 150px var(--gutter) var(--s-xl)` (130px ≤ 900px; `110px 20px var(--s-lg)` ≤ 600px).
3. **Title block** (720px column): eyebrow **"Our Policies"** (added by CSS `::before`, `--f-sans` 0.66rem, 0.24em caps, `--c-rosegold-2`, same as `.eyebrow`) → `h1` in `--f-display` italic 400 at `--t-h2`, `--c-charcoal`, line-height 1.08 → 40px `--c-rosegold-pale` hairline (CSS `::after`, the manifesto motif) → 64px to the body (32px on mobile).
4. **Body** (`.rte`, same 720px column, centred; left-aligned text).
5. **Related policies** row (§5) — same column, hairline above.
6. Unchanged `ka-footer` (`--s-xl` = 96px of paper below the related row, 64px on mobile).

Left-aligned title (not centred) matches `ka-page-generic` / journal body; centred type is wrong for text people read to the end. Title size is `--t-h2`, not `--t-display`: these are utility pages, "Terms of service" should not shout.

### 3.2 Reading measure and body type
`max-width: var(--max-text)` (720px) ≈ 70–80 characters at 1rem Jost 300 — the same column as the Journal. Body `1rem / 1.85`, colour `--c-ink`. Slightly smaller than the article's 1.1rem because legal text is long (Privacy is ~3,000 words). Paragraph rhythm 20px (`> * + *`), 32px after a list or table. `strong`/`b` = weight 500 (Jost 300 body, so bold is a clear step, not a smudge). `u` (used as list-item labels in Privacy) is rendered as weight 500 charcoal with **no underline** so it can't be mistaken for a link.

### 3.3 Heading map (visual tiers, independent of Shopify's semantic levels)
Shopify's Privacy template uses `<h1>` for every section and `<h2>` for sub-sections (the page title is an additional `<h1>`). Mapping by tier so it reads as an editorial document, not a wall of giant headings:

| Element in `.rte` | Role | Style |
|---|---|---|
| `h1` | Section | Cormorant italic 400, `clamp(1.55rem, 2.4vw, 1.95rem)`, charcoal; **1px `--line` hairline above** with 32px padding and 96px space above (64/16 on mobile); the very first `h1` has no rule |
| `h2` | Sub-section | Cormorant **roman** 500, 1.3rem, charcoal, 64px above (roman vs italic makes the tier obvious without more size) |
| `h3` | Minor label | Jost 400, 0.68rem, 0.2em caps, `--c-rosegold-2`, 32px above (eyebrow style) |

`h1`/`h2` also get `font-variant-numeric: lining-nums` (Cormorant defaults to old-style figures; same cause as the welcome-popup code baseline bug, and matters for "Section 12" style headings).

**Fake headings bridge (progressive enhancement, CSS only):**
- Refund: `p > span[style*="underline"] > strong` alone in a paragraph is styled exactly like an `h2` (no underline, Cormorant 500 1.3rem). Uses `:has()` (supported in all current browsers; if unsupported it falls back to bold text, still readable).
- Shipping: `p > em:first-child` followed by `<br>` becomes a small caps `h3`-style label with the `<br>` hidden.
- **The durable fix is to make these real headings in Admin (§6)**; the bridge just makes today's content look right.

**Optional, low priority — semantics:** Privacy has 11 `<h1>` on one page in the accessibility tree. Visual design is unaffected. If wanted, a 6-line deferred script can demote `.rte h2→h3` then `h1→h2` after load (anchors like `#behavioural-advertising` are preserved). Not needed to ship.

### 3.4 Lists, links, images, empties
- `ul/ol` padding-left 1.3em; items 0.6em apart; markers `--c-rosegold-pale`. Shopify's invalid `<ul><li/><ul>…</ul></ul>` nesting is handled (`ul > ul` gets 0.6em top margin and inherits one more indent), and renders as a clean two-level list (verified in the prototype with the live Privacy text).
- Links: `--c-rosegold-2`, underline in `--line-light`, 3px offset, hover `--c-rosegold` — identical to `.a-body a`. Long URLs wrap (`overflow-wrap:anywhere`).
- Images (Contact page store photo): full column width, `aspect-ratio: 3/2; object-fit:cover`, the standard sepia/saturation filter (`sepia(.10) saturate(.90) brightness(.96)`), 16px below. (The source is a 1.5 MB, 4032×3024 JPEG; consider re-uploading at ~2000px in Admin — content task, not required.)
- Empty paragraphs (`<p><br></p>`, `<p></p>`) are hidden with `:empty` / `:has(> br:only-child)`.
- **Bracketed template notes** in Privacy are currently italic (Shopify's own `<i>`); no special styling is added — they should be deleted from the content (§6), not designed around.

### 3.5 Tables (Privacy cookie lists: 2 tables, 3 columns, 45 data rows in total)
- **Desktop (> 640px):** real table, `table-layout: fixed`, columns 30 / 54 / 16 %. Header row in Jost caps (0.62rem, 0.18em, `--c-ink-muted`) over a `--line-strong` rule; rows separated by `--line` hairlines, 14px vertical padding; name in charcoal, function/duration in `--c-ink-mid` at 0.9rem; cell text `overflow-wrap:anywhere` (cookie names such as `_shopify_country` never overflow).
- **≤ 640px:** each row becomes a small stacked block: **name** (charcoal, 500) → function (ink-mid) → "DURATION · 2y" in rosegold with a tiny caps label added by CSS `::before`. Header row is visually hidden. Rows separated by hairlines. No horizontal scroll, no nested scrolling.
- Accessibility note: `display:block` on table parts drops table semantics in some screen readers. Acceptable for a cookie reference list; the alternative (horizontal scroll) fails 390px usability. If ever a concern, the CSS is confined to the ≤ 640px block.

### 3.6 Mobile (390px)
Gutter 20px; container padding `110px 20px 64px`; title `clamp(2rem,…)` (≈ 2rem); section `h1` 1.55rem with 64px above / 16px padding under its hairline; tables stacked; related row 2 × 2 (title 1.1rem); utility bar/nav are the existing responsive `ka-nav`. Verified at 390px in the prototype.

---

## 4. Production CSS — new file `assets/ka-policy.css`
Same CSS as the prototype, with `@container` translated to `@media` at the same breakpoints. Only tokens from `assets/ka-base.css` (`--c-*`, `--line*`, `--f-*`, `--t-*`, `--s-*`, `--max-text`, `--gutter`, `--dur-fast`). Every selector is scoped to `.shopify-policy__*` or `.ka-policy-nav`, so nothing can leak to other pages.

```css
/* =====================================================================
   ka-policy.css  — PRODUCTION CSS (spec §4). Production version of the prototype CSS
   (prototype uses @container at the same breakpoints).
   Selectors target ONLY the markup Shopify emits:
   .shopify-policy__container > .shopify-policy__title > h1
                              > .shopify-policy__body  > .rte
===================================================================== */
.shopify-policy__container{background:var(--c-paper);padding:150px var(--gutter) var(--s-xl)}
.shopify-policy__title,
.shopify-policy__body{max-width:var(--max-text);margin-left:auto;margin-right:auto}
.shopify-policy__title::before{content:'Our Policies';display:block;margin-bottom:18px;font-family:var(--f-sans);font-size:var(--t-eyebrow);font-weight:400;letter-spacing:.24em;text-transform:uppercase;color:var(--c-rosegold-2)}
.shopify-policy__title h1{font-family:var(--f-display);font-size:var(--t-h2);font-weight:400;font-style:italic;color:var(--c-charcoal);line-height:1.08}
.shopify-policy__title::after{content:'';display:block;width:40px;height:1px;background:var(--c-rosegold-pale);margin:28px 0 var(--s-lg)}

.shopify-policy__body .rte{font-family:var(--f-sans);font-size:var(--t-body);font-weight:300;line-height:1.85;color:var(--c-ink);overflow-wrap:break-word}
.shopify-policy__body .rte > * + *{margin-top:20px}
.shopify-policy__body .rte > ul + *,
.shopify-policy__body .rte > ol + *,
.shopify-policy__body .rte > table + *{margin-top:var(--s-md)}
.shopify-policy__body .rte strong,
.shopify-policy__body .rte b{font-weight:500}
.shopify-policy__body .rte u{text-decoration:none;font-weight:500;color:var(--c-charcoal)}
.shopify-policy__body .rte p:empty,
.shopify-policy__body .rte p:has(> br:only-child){display:none}

/* Heading map. Shopify policy bodies use <h1> for every SECTION and <h2> for sub-sections
   (the page title is a separate h1 above). Visual tiers, not semantic ones: */
.shopify-policy__body .rte > h1{font-family:var(--f-display);font-style:italic;font-weight:400;font-size:clamp(1.55rem,2.4vw,1.95rem);line-height:1.2;color:var(--c-charcoal);margin-top:var(--s-xl);padding-top:var(--s-md);border-top:1px solid var(--line)}
.shopify-policy__body .rte > h1,
.shopify-policy__body .rte > h2{font-variant-numeric:lining-nums}   /* "Section 1", "Article 12": Cormorant defaults to old-style figures (same cause as the welcome-popup code baseline bug) */
.shopify-policy__body .rte > h1:first-child{margin-top:0;padding-top:0;border-top:0}
.shopify-policy__body .rte > h2{font-family:var(--f-display);font-style:normal;font-weight:500;font-size:1.3rem;line-height:1.25;color:var(--c-charcoal);margin-top:var(--s-lg)}
.shopify-policy__body .rte > h3{font-family:var(--f-sans);font-size:.68rem;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:var(--c-rosegold-2);margin-top:var(--s-md)}
.shopify-policy__body .rte > h1 + *,
.shopify-policy__body .rte > h2 + *,
.shopify-policy__body .rte > h3 + *{margin-top:12px}

/* CSS bridge for policies written with fake headings (Refund, Shipping) — progressive enhancement;
   the durable fix is to make them real headings in Admin (spec §6). */
.shopify-policy__body .rte > p:has(> span[style*="underline"] > strong:only-child){margin-top:var(--s-lg)}
.shopify-policy__body .rte > p:has(> span[style*="underline"] > strong:only-child) span{text-decoration:none !important}
.shopify-policy__body .rte > p:has(> span[style*="underline"] > strong:only-child) strong{font-family:var(--f-display);font-weight:500;font-size:1.3rem;line-height:1.25;color:var(--c-charcoal)}
.shopify-policy__body .rte > p:has(> span[style*="underline"] > strong:only-child) + p{margin-top:12px}
.shopify-policy__body .rte p > em:first-child:has(+ br){display:block;font-style:normal;font-family:var(--f-sans);font-size:.68rem;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:var(--c-rosegold-2);margin-bottom:6px}
.shopify-policy__body .rte p > em:first-child + br{display:none}
.shopify-policy__body .rte > p:has(> em:first-child + br){margin-top:var(--s-md)}
.shopify-policy__body .rte > p:first-child:has(> em:first-child + br){margin-top:0}

/* Links, lists */
.shopify-policy__body .rte a{color:var(--c-rosegold-2);text-decoration:underline;text-decoration-color:var(--line-light);text-underline-offset:3px;transition:color var(--dur-fast);overflow-wrap:anywhere}
.shopify-policy__body .rte a:hover{color:var(--c-rosegold)}
.shopify-policy__body .rte ul,
.shopify-policy__body .rte ol{padding-left:1.3em}
.shopify-policy__body .rte li + li{margin-top:.6em}
.shopify-policy__body .rte li::marker{color:var(--c-rosegold-pale)}
.shopify-policy__body .rte ul ul,
.shopify-policy__body .rte ul > ul{margin-top:.6em}          /* Shopify's privacy template puts <ul> directly inside <ul> */

/* Tables (cookie tables) */
.shopify-policy__body .rte table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:.9rem;line-height:1.55;margin-top:var(--s-sm)}
.shopify-policy__body .rte th{text-align:left;padding:0 16px 12px 0;font-family:var(--f-sans);font-size:.62rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:var(--c-ink-muted);border-bottom:1px solid var(--line-strong)}
.shopify-policy__body .rte th strong{font-weight:400}
.shopify-policy__body .rte th:nth-child(1){width:30%}
.shopify-policy__body .rte th:nth-child(2){width:54%}
.shopify-policy__body .rte th:nth-child(3){width:16%}
.shopify-policy__body .rte td{padding:14px 16px 14px 0;vertical-align:top;border-bottom:1px solid var(--line);color:var(--c-ink-mid);overflow-wrap:anywhere}
.shopify-policy__body .rte td:first-child{color:var(--c-charcoal)}

/* Images (Contact information page carries the atelier photo) */
.shopify-policy__body .rte img{width:100%;height:auto;aspect-ratio:3 / 2;object-fit:cover;filter:sepia(.10) saturate(.90) brightness(.96);margin-bottom:var(--s-sm)}

@media (max-width:900px){ .shopify-policy__container{padding-top:130px} }
@media (max-width:640px){
  /* Cookie tables -> stacked rows: name, then function, then duration */
  .shopify-policy__body .rte table,
  .shopify-policy__body .rte tbody,
  .shopify-policy__body .rte tr,
  .shopify-policy__body .rte td{display:block;width:100%}
  .shopify-policy__body .rte thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .shopify-policy__body .rte table{table-layout:auto}
  .shopify-policy__body .rte tr{padding:16px 0;border-bottom:1px solid var(--line)}
  .shopify-policy__body .rte td{padding:0;border:0}
  .shopify-policy__body .rte td:nth-child(1){font-weight:500;color:var(--c-charcoal)}
  .shopify-policy__body .rte td:nth-child(2){margin-top:4px}
  .shopify-policy__body .rte td:nth-child(3){margin-top:8px;font-size:.82rem;color:var(--c-rosegold-2)}
  .shopify-policy__body .rte td:nth-child(3)::before{content:'Duration \00B7  ';font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--c-ink-muted)}
}
@media (max-width:600px){
  .shopify-policy__container{padding:110px 20px var(--s-lg)}
  .shopify-policy__title::after{margin-bottom:var(--s-md)}
  .shopify-policy__body .rte > h1{margin-top:var(--s-lg);padding-top:var(--s-sm)}
}

/* =====================================================================
   .ka-policy-nav — "Related policies" row (spec §5), rendered by a snippet
===================================================================== */
.ka-policy-nav{background:var(--c-paper);padding:0 var(--gutter) var(--s-xl)}
.ka-policy-nav__inner{max-width:var(--max-text);margin:0 auto;border-top:1px solid var(--line);padding-top:var(--s-md)}
.ka-policy-nav__label{display:block;margin-bottom:28px}
.ka-policy-nav__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:32px 40px;list-style:none}
.ka-policy-nav__item a,
.ka-policy-nav__item span.is-current{display:block}
.ka-policy-nav__title{display:block;white-space:nowrap;font-family:var(--f-display);font-style:italic;font-size:1.25rem;line-height:1.2;color:var(--c-charcoal);transition:color var(--dur-fast)}
.ka-policy-nav__item a:hover .ka-policy-nav__title{color:var(--c-rosegold-2)}
.ka-policy-nav__title::after{content:' \2192';font-family:var(--f-sans);font-style:normal;font-size:.8em;color:var(--c-rosegold-pale)}
.ka-policy-nav__desc{display:block;margin-top:6px;font-family:var(--f-sans);font-size:.76rem;font-weight:300;line-height:1.55;color:var(--c-ink-mid)}
.ka-policy-nav__item .is-current .ka-policy-nav__title{color:var(--c-ink-muted)}
.ka-policy-nav__item .is-current .ka-policy-nav__title::after{content:''}
.ka-policy-nav__item .is-current .ka-policy-nav__desc{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--c-rosegold-2)}
@media (max-width:600px){ .ka-policy-nav{padding-bottom:var(--s-lg)} .ka-policy-nav__grid{gap:28px 20px} .ka-policy-nav__title{font-size:1.1rem} }
```

---

## 5. "Related policies" row — recommendation: **yes**

**Why:** the complaint is that customers cannot find the returns policy. Anyone who has reached *any* policy page is already looking for terms; the row puts the other three one tap away, labels the refund policy as **Returns & Refunds** (the word customers actually search for — Shopify's own title is the less obvious "Refund policy"), and gives each a one-line description so "Where do I check exchanges/cancellations?" answers itself. It does not replace the footer links (separate decision, out of scope), it complements them. It only helps people already on a policy page; the real fix for findability is the footer plus links from where the question arises (see 5.4).

**Design (prototype-verified):** below the body, inside the same 720px column: a 1px `--line` rule, eyebrow "Also in Our Policies" (muted), then a **2 × 2 grid** (always two columns, at every width: symmetric, generous tap targets, no orphan wrapping). Each item: Cormorant italic title with a soft "→" (rosegold-pale), Jost 0.76rem description in `--c-ink-mid`. The current policy is shown as a non-link, dimmed title with "YOU ARE HERE" in place of the description. Order leads with the one people look for: **Returns & Refunds, Shipping, Privacy, Terms of Service**. Contact information is excluded (it is a contact page, not a policy customers need to compare; it is already in the footer).

| Item | Label | Description | Target |
|---|---|---|---|
| 1 | Returns & Refunds | Exchanges, cancellations and our made-to-order terms | `shop.refund_policy.url` |
| 2 | Shipping | Delivery times, duties and tracking | `shop.shipping_policy.url` |
| 3 | Privacy | How we care for your information | `shop.privacy_policy.url` |
| 4 | Terms of Service | The terms of using our site | `shop.terms_of_service.url` |

**Build:** `snippets/ka-policy-nav.liquid`, rendered from the layout on policy pages (§2), after the body and before the footer. Iterate the four (`shop.refund_policy`, `shop.shipping_policy`, `shop.privacy_policy`, `shop.terms_of_service`), skip any with a blank `body`, and mark the current one by comparing its `url` with `request.path` (render a `<span class="is-current" aria-current="page">` instead of an `<a>`). Markup expected by the CSS:
```html
<nav class="ka-policy-nav" aria-label="Store policies"><div class="ka-policy-nav__inner">
  <span class="eyebrow eyebrow--muted ka-policy-nav__label">Also in Our Policies</span>
  <ul class="ka-policy-nav__grid">
    <li class="ka-policy-nav__item"><a href="…"><span class="ka-policy-nav__title">Returns &amp; Refunds</span><span class="ka-policy-nav__desc">Exchanges, cancellations and our made-to-order terms</span></a></li>
    <li class="ka-policy-nav__item"><span class="is-current" aria-current="page"><span class="ka-policy-nav__title">Shipping</span><span class="ka-policy-nav__desc">You are here</span></span></li>
    …
  </ul></div></nav>
```
Labels/descriptions hard-coded in the snippet are fine (four short strings); if Suraj wants to edit them, put them in `settings_schema.json` as text settings. If only 3 policies exist the grid becomes 2 + 1, which is acceptable.

**5.4 Beyond this row (suggestion, separate small task):** because the refund policy says returns are not accepted (made-to-order), a plain-language "Made to order · exchanges only for genuine defects — see Returns & Refunds" line linked from the product page's shipping/craft accordion and from the cart page would set expectations at the moment the question arises. Copy to be agreed with Suraj; not part of this spec.

---

## 6. Content issues found in the live policies (for Suraj; not build work, not edited by me)

1. **Privacy Policy is an unfinished Shopify template.** 26 bracketed instructions are live and visible, e.g. `[INSERT AGE]`, `[ADD ANY OTHER VENDORS WITH WHOM YOU SHARE THIS INFORMATION]`, `[INCLUDE FOLLOWING SECTION IF YOUR STORE IS LOCATED IN OR IF YOU HAVE CUSTOMERS IN EUROPE]`, `[Be sure to check this list against Shopify's current list of cookies…]`, and the closing **"Last updated: [Date]"**. It also states, under "Selling Personal Information", **"Our Site sells Personal Information, as defined by the California Consumer Privacy Act"** followed by `[Insert: categories of information sold; …]` — an optional template clause that, as published, reads as a real statement. This needs completing (and ideally a lawyer's review) by Suraj/counsel; I have not touched the wording. It also refers to the site as `karishmaandashita.myshopify.com` (should be karishmaashita.com).
2. **Contact details disagree.** Contact information: 2A Ganga Building, Talmaki Road, Santacruz (West), Mumbai 400054, +91 9967 54 3087. Terms of Service §20: "Ground Floor, Parekh Apartments, Sarojini Rd, near Mc Donalds, Mumbai, Maharashtra 400056", +91 9930309017. Please confirm which is current and align all three (Contact, Terms, Privacy's "Mumbai. MH, India" line).
3. **Terms is one giant paragraph** (no headings/paragraph breaks). I have produced a **structure-only** version at `Docs/policy-terms-restructured-body.html`: 21 headings ("SECTION 1 - ONLINE STORE TERMS" becomes `<h1>Section 1 – Online Store Terms</h1>`), 60 paragraphs; **wording is unchanged** (verified programmatically: identical text apart from capitalisation of the heading lines and en-dash). It renders in the prototype under "Terms (restructured)". Paste into Admin → Settings → Policies → Terms of service (HTML view) only after Suraj/counsel is happy that capitalisation-only changes to headings are acceptable.
4. **Refund and Shipping use fake headings** (underlined bold / italic lead-ins). The CSS bridge in §3.3 makes them look right today; the tidy fix is to make "Returns", "Cancellations", "Disclaimer" real `<h2>` and "Shipping Time", "International Shipping" real `<h2>`/`<h3>` in the policy editor.
5. **Contact information:** phone and email are plain bold text; make them `tel:` / `mailto:` links, delete the empty trailing paragraph, and consider re-uploading the store photo at ~2000px (currently 1.5 MB).

Heading convention for any policy edited in Admin: use **h1 for sections, h2 for sub-sections, h3 for minor labels** so it maps identically to Shopify's Privacy template and to this CSS.

---

## 7. Feasibility flags

- **P1 — No policy template (verify).** As above; if wrong, simpler, if right, the layout-conditional approach is the only route. Risk: low.
- **P2 — Section groups in the layout for one page type.** Standard Liquid (`{% sections %}` is valid in `layout/`), but confirm both groups actually render `ka-nav` (its own `<link>`s/`<script>` tags and the search/currency overlays are inside the section) and that `ka-theme.js` behaviours (mobile drawer, currency) work on `/policies/*` exactly as elsewhere. QA item. Risk: low–moderate.
- **P3 — `:has()` bridge.** Used only for progressive enhancement of two pages' fake headings; unsupported browsers just see bold text. Risk: none.
- **P4 — Editor visibility.** Header/footer settings for policy pages are only in the group JSON files (see §2). Risk: none, note only.
- **P5 — Schema-name rule.** `CLAUDE.md`'s known issue (section/preset/block `name` ≤ 25 chars) applies to the two group files and any new section; there is no new section in this design (snippet + CSS only), so only the group JSONs need checking. Run `scripts/validate-theme-schema.ps1` before pushing.

## 8. Build complexity
**Simple–moderate.** New: `assets/ka-policy.css`, `snippets/ka-policy-nav.liquid`, two small section-group JSON files, ~8 lines in `layout/theme.liquid`. No new tokens, no JS required, no changes to `ka-nav` / `ka-footer` themselves.

## 9. QA checklist
For each of the five URLs at 1440 and 390px: header (utility bar, menu, currency chip, search, bag) and footer identical to other pages and working; title/eyebrow/rule; section hairlines; nested lists; Privacy cookie tables desktop + stacked at 390px (all 45 rows present); Refund/Shipping bridged headings; Contact photo crop; no horizontal scroll; related row correct current-page state and working links; `template-policy` pages do not load `ka-policy.css` anywhere else; welcome popup behaviour on policy pages as decided.
