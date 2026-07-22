# The Journal — Blog Index + Article — Build Specification
**Document version:** 1.0
**Date:** 22 July 2026
**Prototype sources:** `Prototypes/journal-index-v1.html` (blog index / `/blogs/news`), `Prototypes/journal-article-v1.html` (article / `/blogs/news/corset-lehenga-reconsidered`)
**Status:** Ready for Suraj's review — Phase 4 (owner approval) not yet complete. Do not build in Liquid until approved.

---

## 0. Context and Origin of This Task

Routed from the SEO & Discoverability team: every `karishmaashita.com/blogs/news/...` URL currently 404s, including 3 articles published in 2024 that Shopify Admin shows as "published." Independently confirmed against this repo: no `blog.liquid`, `article.liquid`, or any blog/article section exists anywhere in the theme (`templates/blog*`, `templates/article*`, `sections/*blog*`, `sections/*article*` are all empty). This is a **missing-template problem, not a content or URL problem** — the 3 existing 2024 articles and their exact existing URLs are still sitting in Shopify, correctly published, simply unrendered. This matters for the business case below.

One new article is staged and ready in Shopify: **"The Corset Lehenga, Reconsidered: Structure as Bridal Statement"** (blog handle `news`, article handle `corset-lehenga-reconsidered`).

This is the first-ever blog/editorial surface for the from-scratch theme, so per CLAUDE.md's standard pipeline it received a full design pass — audit, redesign, prototype — before any Liquid is written. Design + prototyping only in this document; Technical Director builds after Suraj approves.

**Preparatory review performed before designing:** `Docs/homepage-build-spec.md`, `Docs/about-us-build-spec.md`, `Docs/client-diaries-build-spec.md`, `Docs/store-location-build-spec.md`, `Docs/search-404-footer-build-spec.md`; every prototype in `Prototypes/`; and — critically — the **actual live theme repo** (`assets/ka-base.css`, `sections/ka-nav.liquid`, `sections/ka-footer.liquid`, `assets/ka-collection-grid.css`, `assets/ka-page-generic.css`, `assets/ka-collection-refine-bar.css`, `assets/ka-manifesto.css`, `assets/ka-appointment.css`, `assets/ka-about-hero.css`), since `Docs/about-us-build-spec.md` flagged that `homepage-build-spec.md`'s own token table (Bodoni Moda, `#1A1714` charcoal, etc.) is **stale** and the live `assets/ka-base.css` is the real source of truth (Cormorant Garamond, `#2A2420` charcoal, etc.). Every token in this document and both prototypes is transcribed from the live CSS file, not the stale doc.

---

## 1. Audit Summary (Phase 1)

**Current state:** total absence. Not a weak blog — no blog at all. Three real, already-indexed 2024 URLs are dead links today; anyone who finds them via Google, an old social post, or a direct link gets a 404. For a luxury house this reads as neglect at exactly the kind of edge a bride or her family is likely to probe (a bride researching K&A will Google the brand name, and any indexed-then-broken URL erodes the trust this whole project exists to build).

**What K&A is missing that every benchmark house has:** Dior's "Le Mag," Chanel's "Inside Chanel" / "Chanel News," Hermès' "La Maison des Carrés" / craft journal features, and — most directly comparable — Sabyasachi and Gaurav Gupta's Instagram-led editorial storytelling (collection philosophy, craft process, styling point-of-view) all exist as a *distinct pillar from* their product catalogue and *distinct from* real-client/UGC content. K&A already has the second of those (Client Diaries, approved and built). It has nothing in the first category — no house voice, no craft essays, no styling guidance, no seasonal/occasion editorial. This is the single largest content-pillar gap left in the site's build order.

**Why this must not be built as a generic "blog":** the word itself, and the patterns that come with it (comment threads, tag clouds, "recent posts" sidebar widgets, social-share icon rows, pagination numbers, author avatar bubbles) are the exact e-commerce/WordPress register CLAUDE.md instructs against. Every one of those was deliberately excluded from this design. Named **"The Journal"** on-page — quiet, editorial, and consistent with the register "Client Diaries" already established — while the URL stays `/blogs/news` (see §7, Flag J8 — no reason to touch a working, already-indexed URL).

**Emotional audit of current state:** Confusion bordering on distrust (a 404 on a brand's own content is a small but real trust puncture). **Emotional audit of the redesigned pages:** Curiosity moving toward Trust — the Index invites unhurried browsing across the brand's full range (craft, style, occasion, house voice), and the Article delivers a genuinely well-written, structure-first piece of bridal editorial that closes, tastefully, into both a shoppable moment and an appointment invitation.

---

## 2. Redesign Concept (Phase 2)

**Naming:** "The Journal," not "Blog." Reinforces the same instinct that produced "Client Diaries" instead of "Testimonials" or "Reviews."

**Structural decision — Index is a magazine contents page, not a card wall:** The Index opens on a shorter, centred masthead (80svh, not the full 100svh brand-statement hero used on Home/About/Client Diaries — deliberately quieter, because this page's job is to invite browsing, not make the site's single biggest emotional claim). It then treats the one real, live article as a **Featured Story** — a full editorial spread (adapted from the homepage's own Collection Story component), not the first tile in a grid — exactly the way a print magazine gives its cover feature more room than its contents-page listings. Only below that does a browsable, filterable grid begin.

**Category taxonomy is content-type, not occasion** — deliberately distinct from Client Diaries' occasion-based filter (Bridal / Festive / Family / Reception), so the Journal doesn't read as a duplicate of that page under a different name. Four categories: **Craft & Atelier** (technique, process, savoir-faire), **Style Notes** (silhouette guidance, trend point-of-view — where the live article sits), **Occasion Edit** (Karva Chauth, Diwali, Ganpati, Rakhi, sangeet/reception styling — this is where the brief's "occasions beyond the wedding" instruction lives structurally, not decoratively), **The House** (founders' voice, collection notes, craft philosophy). Every category is represented today, even with only one real article live, via clearly-flagged placeholder cards (see §5) — this is the same technique already used and approved for Client Diaries' five sample spreads.

**"Design it to hold many":** the grid is a standard responsive 3-up card grid (2-up tablet, 1-up mobile) with a sticky filter bar and a native-pagination-ready structure (see §7, Flag J7) — there is no assumption anywhere in the layout that caps the article count. The one genuinely deliberate small-count design decision is the **empty-category state** (§3, Section 4): if a visitor filters to a category with zero articles, the grid quietly says "More stories are on their way" rather than showing a broken or empty grid — reusing the exact `.ka-collection-empty` pattern already approved elsewhere.

**Article page reads as a piece of writing, not a CMS record.** Full-bleed cinematic hero (matching the house's hero language used on Home/About/Client Diaries) → a genuine lede paragraph, sized up from body copy the way print magazines open a feature → H2 subheads in the site's existing italic Cormorant Garamond → **one full-width "breakout" image** that escapes the 720px text column, exactly the way Vogue/Dior features break their own text grid for a single dramatic image → a reused pull-quote component (verbatim adaptation of the homepage/About `.ka-manifesto` component) → closing thoughts. No comment section, no tag cloud, no tally of "likes" or view counts, no generic blue social-icon row. The one social affordance considered and deliberately **excluded** from this version: a WhatsApp share link — flagged as a possible future addition in Strategic Improvements, not included now, because a first version should prove the format works editorially before adding any secondary action to it.

**Buy path stays reachable, per standing principle:** every article closes into a **Shop the Story** section — 2-3 products tied to that specific article's subject, styled as a verbatim reuse of the homepage/Bestsellers `.ka-p-card` component (instant pattern recognition) — before a **More From the Journal** related-reading strip and the sitewide **Appointment CTA**. Commerce and concierge both stay present; neither is pushed harder than the editorial content itself.

**Pacing follows the established light/dark rhythm:** Masthead (dark) → Featured Story (light/paper-deep) → Filter bar (light) → Grid (light) → Appointment CTA (dark image) → Footer (dark) on the Index; Hero (dark) → Body (light) → breakout image (dark-toned photography on light ground) → pull-quote (light) → Shop the Story (light) → More From the Journal (light) → Appointment CTA (dark image) → Footer (dark) on the Article. Consistent with every approved page to date.

---

## 3. Section-by-Section Breakdown

### PAGE A — Journal Index (`/blogs/news`)

**A1 — Navigation.** Global nav, reused verbatim — see §7 Flag J1. **New:** a fourth desktop nav link, "Journal," added after "Client Diaries"; mirrored in the mobile drawer and in the footer's Maison column. Transparent-over-hero, crystallises on scroll (`.scrolled`) — same treatment as Home/About/Client Diaries, since this page opens on a hero (not the permanently-"settled" nav state used on Collection/Product/Cart, which have no hero).

**A2 — Masthead.** *Purpose:* quiet magazine-title opening; establishes this is a reading destination before any browsing UI appears. *Structure:* 80svh (vs. the sitewide 100svh hero) full-bleed image, gradient overlay, **centred** content block (not bottom-left, like every other hero on the site — a deliberate visual signal that this page is a contents page, not a brand statement): eyebrow "K&A —", two-line title ("The" small italic lead-in / "Journal" at full display scale — same small-word/big-word pattern already proven on Client Diaries' "Client / Diaries"), subtitle naming the full editorial scope (craft, style, occasion) in the first screen, scroll indicator. *Motion:* identical fadeUp/fadeIn staggered sequence and bg scale-in (1.05→1, 2.2s) used sitewide. *Responsive:* 80svh → 74svh at ≤600px.

**A3 — Featured Story.** *Purpose:* present the one live article as a magazine cover feature. *Structure:* adapted from the homepage Collection Story component — 1.05fr/0.95fr grid, image side with a small "Featured" tag chip, text side on `--c-paper-deep`: eyebrow (category), H2 title with the colon-split subtitle rendered as a smaller uppercase sub-line beneath it ("The Corset Lehenga, Reconsidered" / "Structure as Bridal Statement"), excerpt paragraph, meta row (date · read time), `.btn-dark` CTA. *Motion:* image `.reveal-img`, text staggered `.reveal`/`.reveal-delay-1/2/3`. *Responsive:* collapses to a single column ≤900px, image leads text.

**A4 — Filter Bar.** *Purpose:* makes the grid actively browsable by content type. *Structure:* sticky bar (`top: 84px`, same offset reasoning as Client Diaries' browse bar — sits directly under the fixed utility-bar+nav stack), label + 5 chips (All Stories / Craft & Atelier / Style Notes / Occasion Edit / The House) reusing `.ka-chip` **verbatim** from `assets/ka-collection-refine-bar.css` — same visual states (rest/hover/`.is-active`), new filter values only. *Motion/interaction:* click toggles `.is-active`, instant show/hide on the grid below (no crossfade — same calm-under-repeated-clicking reasoning already documented for Client Diaries' browse bar). *Responsive:* remains sticky at an adjusted `top: 78px` on mobile; chips wrap rather than horizontally scroll.

**A5 — Journal Grid.** *Purpose:* the browsable body of the page. *Structure:* new component `.ka-j-card`, a deliberate sibling of the proven `.ka-p-card` (product card) — same hover-scale image language, same padding rhythm — with editorial fields (category tag overlay, italic title, one-line dek, date · read-time meta) in place of fabric/price. 3-column grid, 2px–48px responsive gap. Each card carries `data-cat` for the filter bar to target. *Empty state:* `.j-empty`, reusing the exact `.ka-collection-empty` visual pattern (quiet italic headline + body, no CTA needed here since the filter bar itself is the way back to "All Stories"). *Responsive:* 3-col → 2-col (≤900px) → 1-col (≤600px), matching the sitewide product-grid breakpoint behaviour exactly.

**A6 — Appointment CTA.** Verbatim reuse of the sitewide `.appointment` component (see homepage-build-spec.md, About-us-build-spec.md — this is the third page to reuse it unchanged). New copy only: "Every Story Ends / With a Fitting."

**A7 — Footer.** Shared global footer, full spec in `Docs/homepage-build-spec.md` §13. New: "Journal" added to the Maison column, carrying `.is-current` state on this page per the existing pattern (`Docs/about-us-build-spec.md` §6 H3).

---

### PAGE B — Journal Article (`/blogs/news/corset-lehenga-reconsidered`)

**B1 — Navigation.** Identical to A1, "Journal" carries `.is-current`.

**B2 — Return link.** *Purpose:* wayfinding without a conventional e-commerce breadcrumb, which reads wrong sitting over a full-bleed magazine-style hero. *Structure:* small fixed-position "← Back to the Journal" text link, top-left, over the hero; switches from light to dark text (`.is-dark`) in sync with the nav's own scrolled-state colour change. *Rationale:* Vogue/Dior-style features use a return link or nothing at all, never a `Home / Blog / Category / Title` breadcrumb trail — that pattern was deliberately not carried over from the Collection page, where it is correct (`.ka-coll-breadcrumb`), because a shopping page and a reading page ask different things of a wayfinding element.

**B3 — Article Hero.** *Purpose:* full-bleed cinematic open matching the house's hero language. *Structure:* 84svh, gradient overlay, eyebrow (category · read time), H1 title, italic dek line ("Structure as Bridal Statement."), byline ("Words — The K&A Atelier · [date]"), scroll indicator. *Motion:* identical fadeUp/fadeIn stagger and bg scale-in to every other hero on the site. *Responsive:* 84svh → 78svh at ≤600px.

**B4 — Article Body.** *Purpose:* the read itself. *Structure:* extends `assets/ka-page-generic.css`'s existing body-copy pattern (max-width 720px, Jost 300, 1.85 line-height, italic Cormorant H2s) with one new additive element: `.a-body__lede`, a larger (1.28rem) opening paragraph, the way a print feature's first paragraph is set larger than its body. No new colour or font tokens — see §4.

**B5 — Pull-Quote.** *Purpose:* a single breath mid-article, same function as the homepage/About Manifesto. *Structure:* `.a-quote`, a scoped, verbatim adaptation of `.ka-manifesto` (identical hairline-rule `::before`/`::after` pattern, identical type scale) — reused, not reinvented.

**B6 — Breakout Image.** *Purpose:* the single dramatic image break that separates this from a flat text page — the one moment in the piece that escapes the 720px reading column. *Structure:* new component `.a-breakout`, max-width 1180px (new token — see §4), 62vh frame (min 380px, max 640px), small centred caption beneath. *Motion:* `.reveal-img`. *Responsive:* frame height reduces to 46vh (min 300px) ≤600px.

**B7 — Shop the Story.** *Purpose:* the tasteful commerce bridge, tied to this specific article's subject matter (corset lehengas). *Structure:* standard `.section-header` + 3-up `.ka-p-card` grid, verbatim reuse of the homepage Bestsellers card component. *Responsive:* 3-col → 2-col (drops 3rd card, ≤900px) → 1-col (all 3 return, ≤600px) — matching the exact breakpoint logic already used for the homepage Bestsellers grid.

**B8 — More From the Journal.** *Purpose:* keeps the visitor inside the editorial world rather than dead-ending. *Structure:* `.section-header` + 3-up `.ka-j-card` strip (verbatim reuse of the Index's own card component), pulling related articles — same-category first, per the standard "related content" convention.

**B9 — Appointment CTA.** Verbatim reuse, new copy identical to A6 (same component, same page-closing job as every other page in the build).

**B10 — Footer.** Same as A7.

---

## 4. New or Changed Design Tokens

**Deliberately minimal**, consistent with every prior page in this build.

| Token/value | Status | Justification |
|---|---|---|
| `--max-breakout: 1180px` | **New token** | The article breakout image (B6) needed a width between the 720px text column and the 1680px `--max-wide` site-wide container — an intentional "wider than the text, narrower than full-bleed" moment. Promoted to a `:root` token (not a one-off value) because any future long-form Journal article will need the identical breakout treatment repeatedly — this is exactly the kind of value CLAUDE.md's token system anticipates for a page type expected to recur. |
| `.j-mast`, `.j-mast__*` | **New component class set** | The Index masthead is a genuinely new pattern: shorter (80svh vs. 100svh) and **centred** rather than bottom-left, unlike every other hero on the site (Home, About, Client Diaries, this Article page). Kept as its own component rather than a modifier on the existing hero pattern because the alignment change is structural, not a simple override. |
| `.j-featured`, `.j-featured__*` | **New component class set** | Adapted variant of the homepage's Collection Story component (same grid ratio, same `--c-paper-deep` panel, same type scale) with editorial fields (excerpt, meta row) in place of collection-story fields. Same "adapt, don't fork the base component" discipline already used for `.founders` (About Us) and `.j-featured` follows that precedent exactly. |
| `.ka-j-card`, `.ka-j-card__*` | **New component class set — reused across both pages** | Deliberate sibling of `.ka-p-card` (same hover-scale image language, same padding rhythm) built specifically so a visitor's eye recognises "this is a card in this site's system" the instant they see one, whether it's a product or an article. This is the single most-reused new component in this spec (Index grid, Article's "More From the Journal"). |
| `.j-filter`, reusing `.ka-chip` **verbatim** | **No new token** | `.ka-chip` already exists in `assets/ka-collection-refine-bar.css` — used with zero visual changes, only new `data-filter` values. |
| `.a-quote`, `.a-quote__*` | **New component class set, but a verbatim adaptation** | Structurally and visually identical to `.ka-manifesto` (hairline rules, type scale) — scoped under new class names per the project's section-scoped CSS convention (CLAUDE.md "cheap habits worth keeping"), not a redesign. |
| `.a-body__lede` | **New — minor type addition** | 1.28rem vs. the existing 1.1rem `--t-body-l` body copy — one deliberate step up for the opening paragraph only, no new token registered since it's a single-use magazine-lede convention, same category as the About page's various one-off, documented type tweaks. |
| `.article-progress` (2px scroll-progress line, `var(--c-rosegold)`) | **New — small optional component** | A thin top-of-viewport line indicating reading progress through the article body — restrained (no percentage number, no chrome), similar to the quiet scroll-affordances Vogue/Dior use on long features. Flagged explicitly as **optional** in §9 (Quick Wins) — the page works completely without it; it is a nice-to-have reading aid, not a structural requirement. |

No new colours, base fonts, spacing-scale values, or motion durations/easings were introduced — every `--ease-luxury`, `--ease-soft`, `--dur-slow/med/fast`, and every colour token is used verbatim from the live `assets/ka-base.css`.

---

## 5. Content Requirements

### Photography

**Real, already-existing K&A photography was used throughout both prototypes** (per Creative Director standing instruction to prefer existing site imagery over placeholders) — every image referenced below already exists in `assets/` and is mirrored in `Prototypes/images/`:
- Masthead: `bloom-soiree-main.jpg`
- Featured Story / Article Hero: `product-ivory-column-corset.jpg` — a catalogue product shot elevated to an editorial hero, deliberately **not** reusing `about-craft-detail-1.jpg` (the obvious thematic match — "structured corsetry, cobalt silk") because that exact photo already carries a fixed caption/role in the About Us Craft & Process section ("Structured Corsetry / Boned and fitted, entirely by hand"). Reusing it a second time as this article's hero, under a *different* caption, would read as photo scarcity the moment a visitor sees both pages in one session — a small but real credibility cost this spec deliberately avoided.
- Breakout image: `about-craft-detail-2.jpg` (embellishment detail) — lower-risk reuse (a supporting image, not a page-defining hero), but still flagged below as something real, unique Journal photography should eventually replace.
- Shop the Story: `product-ivory-column-corset.jpg`, `product-snow-veil-corset.jpg`, `product-bloom-lehenga.jpg` (same three bestsellers already established as placeholder catalogue data on the homepage).
- Grid placeholder cards: `instagram-3.jpg`, `instagram-4.jpg`, `collection-indo-western.jpg`, `client-diaries-2.jpg`, `collection-festive.jpg`, `bloom-soiree-main.jpg`, `about-closing-cta.jpg`.

**Flagged as a genuine content gap, not blocking this prototype:** the Journal is a **net-new content pillar** and, like Client Diaries before it, will need its own continuously-growing library of real, dedicated photography over time — behind-the-scenes atelier process shots, craft close-ups shot specifically for editorial use (not repurposed product or About-page photography), and imagery for each of the Occasion Edit and The House placeholder topics once those articles are actually written. This is flagged the same way Client Diaries flagged its own photography gap in that page's build spec — a real dependency, not a launch blocker for the format itself.

### Copy

**The 7 placeholder Journal-grid article cards (titles, deks, categories, dates) are entirely invented, in K&A's house voice, for layout demonstration only** — per the brief's own instruction to "design it to hold many" despite only 1 real article existing today. These must **not** be treated as a content-production task list without Karishma & Ashita's explicit sign-off on which (if any) they actually want written — they exist to prove the grid, filter, and category system work at realistic scale, exactly the same placeholder discipline Client Diaries used for its 5 sample spreads.

**The live article's body copy (all of §3 B4-B7's actual sentences) is original Creative-Director-authored prose in K&A's established house voice**, built from the article's given title and the brand facts already verified and in use elsewhere on the site (hand-boning, zardozi, made-to-order philosophy — all previously verified in `Docs/about-us-build-spec.md` §5). **This is placeholder-for-tone, not the real article text** — the actual Shopify article record for "The Corset Lehenga, Reconsidered" was not supplied to this task and its real body content (if already written in Shopify Admin) should be checked against, and likely supersede, this prototype's copy before publish. If no real body copy exists yet in Shopify, this prototype's copy is offered as a ready-to-use draft, still subject to Karishma & Ashita's review per the same standard applied to every other page's original copy in this project.

**Read time (5 Min Read) and publish date (22 July 2026) are placeholder values** — see §7 Flag J4 for how these should be computed/sourced for real in the Shopify build.

### Not blocked / usable as-is
All motion timings, easings, and reused-component visual treatments (`.ka-p-card`, `.ka-chip`, `.appointment`, `.ka-manifesto`/`.a-quote`) are final — copied verbatim from already-approved prototypes and the live theme's own CSS.

---

## 6. Emotional Audit & Luxury Scorecard

**Dominant emotion — Index:** Curiosity, moving toward Trust (an unhurried, well-organised space that clearly has more to say than one article, even today). **Dominant emotion — Article:** Confidence/Trust (a genuinely well-argued piece of bridal editorial that treats the reader as someone making a considered decision, not someone being sold to).

**Luxury Score: 88/100.** Strong: full reuse of an already-approved design system (zero parallel visual language invented), the Featured-Story-not-grid-item treatment of the one real article, the deliberate avoidance of every generic blog convention (no comments, no share-icon row, no tag cloud, no view counts). Held below the low-90s achieved by About Us v1.2 only because — exactly as flagged in §5 — this page's photography is currently reused/adapted from other pages' assets rather than dedicated Journal photography, and the placeholder-article-count nature of the grid (necessary and correctly flagged, but still a placeholder) caps how "alive" the page can be judged until real content operations begin.

**Editorial Score: 90/100.** The Article's lede-paragraph/H2-subhead/breakout-image/pull-quote structure genuinely mirrors a Vogue or Dior feature rather than a CMS template rendering a rich-text field. The Index's magazine-contents-page framing (centred quiet masthead, Featured Story treatment, content-type taxonomy distinct from Client Diaries' occasion taxonomy) avoids the single biggest risk this task carried — that a "blog" would read as a lesser, e-commerce-adjacent afterthought next to the site's other editorial pages.

**Mobile Experience Score: 89/100.** Full breakpoint parity on every section — masthead height reduces, featured story stacks image-then-text, filter bar remains sticky with wrapping chips, grid steps 3→2→1 exactly matching the sitewide product-grid pattern, breakout image height reduces, Shop the Story and More From the Journal grids both restore their 3rd card at 1-column mobile rather than permanently hiding it.

**Brand Consistency Score: 95/100.** Every colour, type, spacing, and motion token is verbatim from the live `assets/ka-base.css`. Every reusable component (nav, footer, appointment CTA, manifesto/pull-quote, product card, filter chip) is a direct reuse, not a reinterpretation. The only deductions are for the small number of genuinely new components (masthead alignment, featured-story panel, journal card) — all justified, none accidental drift.

---

## 7. Shopify Platform Feasibility Flags

### J1 — Templates and sections needed
**Issue:** No `templates/blog.json` or `templates/article.json` exists.
**Recommendation:** Build `templates/blog.json` (Index) referencing new sections `ka-journal-masthead`, `ka-journal-featured`, `ka-journal-filter`, `ka-journal-grid`, plus reuse of the existing `ka-appointment`/equivalent and `ka-footer` sections; and `templates/article.json` (Article) referencing `ka-article-hero`, `ka-article-body`, `ka-article-shop-story`, `ka-article-related`, plus the same reused Appointment CTA and Footer. Standard Shopify pattern, same approach already used successfully for `templates/page.about-us.json` and `templates/page.client-diaries.json`.
**Risk:** Low.

### J2 — Category taxonomy via native article tags
**Issue:** The 4-category filter (Craft & Atelier / Style Notes / Occasion Edit / The House) needs a data source.
**Recommendation:** Use Shopify's native article **tags** — no app needed. Recommend a hybrid approach: render the filter chips' `href` to point at Shopify's own native `/blogs/news/tagged/{tag}` URLs (real, indexable, shareable category pages, zero extra build cost) while the *default* on-page interaction stays the calm client-side instant show/hide already proven on Client Diaries' browse bar (identical `data-cat` pattern, just reading from `article.tags` server-side instead of a hardcoded value). This gives both a good default UX and real SEO-visible category URLs for free.
**Risk:** Low.

### J3 — Featured Story selection
**Issue:** Section A3 needs to know which one article is "featured" and pin it above the filterable grid.
**Recommendation:** A merchant-applied tag (e.g., `featured`) that a human deliberately sets on exactly one live article at a time; Liquid picks `blog.articles | where: 'tags', 'featured' | first`, falling back to `blog.articles.first` (chronological) if nothing is tagged. Gives editorial control without a new metafield.
**Risk:** Low.

### J4 — Read time and excerpt
**Issue:** Shopify doesn't calculate reading time natively; excerpts need a source.
**Recommendation:** Read time — a small Liquid computation (`article.content | strip_html | split: ' ' | size`, divided by ~200 wpm, rounded up) — no app, no metafield. Excerpt/dek — use Shopify's **native `article.excerpt` field** (the "Excerpt" box already present in the Shopify Article editor), falling back to a truncated `article.content` if the merchant leaves it blank.
**Risk:** Low.

### J5 — "Shop the Story" product tie-in per article
**Issue:** Each article needs to reference specific, relevant products (§3 B7).
**Recommendation:** A `product` **list-reference metafield** on the Article resource (e.g., `article.metafields.custom.shop_the_story`, list of up to 3-4 products), editable per-article in Shopify Admin without a code change. Same pattern already recommended and low-risk-rated for Client Diaries' per-spread product tie-ins.
**Risk:** Low.

### J6 — Empty-category filter state
**Issue:** A visitor filtering to a category with zero live articles should see something considered, not a blank grid.
**Recommendation:** Reuse the exact `.ka-collection-empty` component and copy-tone pattern already built and approved elsewhere — zero new visual design needed, only wiring the visibility condition to "0 articles match this tag."
**Risk:** Low.

### J7 — Pagination at scale
**Issue:** The grid has no article-count ceiling by design (per the brief), but a 3-column card grid rendering 50+ articles unpaginated would be a real performance and scroll-length problem eventually.
**Recommendation:** Shopify's native `{% paginate %}` tag on `blog.articles`, surfaced via the same "Load More" pattern (`.ka-load-more`) already built for the Collection page, rather than numbered pagination — keeps the calm, load-more-not-page-2 browsing model consistent sitewide.
**Risk:** Low. Not needed at launch (8 articles total, including placeholders) but should be built in from the start rather than retrofitted.

### J8 — Blog handle stays `news`; do not rename
**Issue:** The brief and this spec's copy call the section "The Journal," but the underlying Shopify blog resource's handle is `news` (giving `/blogs/news/...` URLs) — and that handle is *exactly* what the 3 existing, already-indexed 2024 articles' URLs depend on.
**Recommendation:** **Do not rename the blog handle to `journal` or anything else.** "The Journal" is a display-name/copy decision (nav label, page H1, footer link text) that requires zero URL change. Renaming the handle would force a 301-redirect migration for 3 already-indexed URLs to preserve their existing SEO equity — real, avoidable risk for zero benefit, since the visible brand name is controlled entirely by on-page copy, not the URL slug. Flagging explicitly so this doesn't get "helpfully" done as a side effect of the rebuild — the entire point of fixing this bug is that those 3 old URLs start working again immediately, unchanged, the moment `blog.liquid`/`article.liquid` exist.
**Risk:** None if left alone; **real, unforced risk if the handle is renamed.**

### J9 — Global nav change (4th top-level link)
**Issue:** Adding "Journal" to the desktop nav (§3 A1) is a change to `sections/ka-nav.liquid`, which renders on every single template site-wide — not scoped to just these two new pages.
**Recommendation:** Low technical risk (the nav's `.ka-nav__links` is a simple flex row with gap — a 4th item does not break the existing 3-item layout or the grid's centred-logo mechanics at any breakpoint already tested), but flagging per this project's own standing convention (see `Docs/about-us-build-spec.md` §6 H3, which flagged its own smaller nav-adjacent change the same way) that any shared-component edit gets called out explicitly rather than made silently. If Suraj prefers a more conservative Phase 1 (prove the Journal format works before it earns permanent top-nav real estate), the fallback is a footer-only link (Maison column, already planned regardless) with no nav change — noted as an option, not the recommendation.
**Risk:** Low technically; the only real risk is process (an unreviewed sitewide change), which this flag exists to prevent.

---

## 8. Build Complexity Estimate

**Overall: Moderate.**

- **Heavily reuse-based:** nav, footer, appointment CTA, product card, filter chip, and manifesto/pull-quote components are all direct, verbatim reuses of already-approved, already-built patterns. This is not a page type inventing a new visual language.
- **Net-new complexity is concentrated in four places:** (1) two new blog/article Shopify templates and their section set (J1) — the first time this theme has needed Shopify's native blog resource at all, so there is real first-time plumbing here even though the visual components are largely reused; (2) the tag-based category/filter system spanning both pages (J2, J3); (3) the per-article "Shop the Story" product metafield (J5); (4) reading-time computation (J4) — small but genuinely new Liquid logic not present anywhere else in the theme yet.
- **Not complex:** no new apps, no checkout-adjacent logic, no customer-account logic, no third-party comment/review integrations (deliberately excluded per §2).
- **Comparable reference point:** similar overall scope to the Client Diaries build (block/tag-based repeatable content + client-side filtering), with the added first-time cost of standing up Shopify's blog/article resource type for the first time in this theme.

---

## 9. Top 5 Immediate Improvements
1. Confirm whether the real Shopify article record for "The Corset Lehenga, Reconsidered" already has body copy written — if so, this prototype's article text should be checked against it rather than assumed to be final (see §5).
2. Decide J9 now, before build: does "Journal" join the permanent top nav, or launch footer-only first? Both are low-risk technically; this is a merchandising/priority call for Suraj.
3. Confirm J8 explicitly with Technical Director before any implementation work begins — the blog handle must stay `news` so the 3 existing 2024 URLs resolve immediately and correctly once templates exist, with zero redirect work.
4. Decide, with Karishma & Ashita, which (if any) of the 7 placeholder article topics (§5) are worth actually commissioning first — they exist to prove the system holds many articles, not as an approved content calendar.
5. Confirm the appointment booking destination — same shared open item as every prior page (see homepage-build-spec.md §7/F5) — resolve once, reuse here too.

## Top 5 Strategic Improvements
1. Commission dedicated Journal photography (behind-the-scenes atelier/process shots) rather than continuing to lean on repurposed product/About-page imagery — the single biggest quality ceiling on this page type, same pattern already true of Client Diaries at launch.
2. Once several real articles exist, revisit whether the optional `.article-progress` scroll line (§4) earns its place — it's a nice-to-have, not proven yet with real long-form content.
3. Consider a very restrained "Share via WhatsApp" text link near the article byline once the format is proven — deliberately excluded from v1 (see §2) so a first version isn't judged on a feature nobody asked for.
4. Build a lightweight editorial calendar / content-ops habit (mirroring the Client Diaries "diary consent" workflow suggestion) so the Journal doesn't calcify at 1 real article the way an unmaintained blog typically does.
5. Once the Journal and Client Diaries both have meaningful content volume, consider a single shared "Stories" mega-menu grouping both under the nav, rather than two separate top-level links competing for the same limited nav real estate — not urgent, worth revisiting only once both pages are mature.

## Quick Wins (<1 hour)
- Wire the optional `.article-progress` scroll-progress line (§4) — small, self-contained JS, already prototyped.
- Add `loading="lazy"` to below-the-fold images (Journal grid cards, More From the Journal, Shop the Story) once implemented in Liquid.
- Add descriptive, accurate `alt` text per real image once dedicated Journal photography exists (prototype `alt` text is already accurate for the placeholder images used).

## Medium Projects (1 day)
- Build `templates/blog.json` + `templates/article.json` and their full new section set (J1).
- Wire the tag-based category filter across both pages, including the native `/tagged/` URL fallback (J2, J3).
- Build the reading-time Liquid snippet (J4) and the per-article "Shop the Story" metafield (J5).

## Major Projects (>1 week)
- None structurally required for launch. The single largest ongoing dependency (per Strategic Improvement 1) is a photography/content-operations effort, not an engineering one — same category as every prior page's largest open item in this project.
