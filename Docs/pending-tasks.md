# Pending Tasks

Running backlog across staging and Live. Each entry notes where it was found/who
flagged it, current verified status, and what's needed next. Remove an entry once
it's fixed and QA-verified; don't just mark it done inline -- move it to a "done"
note in the relevant build spec instead, so this file stays a live backlog, not a
changelog.

Last reconciled against actual project state: 2026-09-04.

---

## Resolved 2026-08-29 -- confirmed live, checksum-verified

- **Customer account section (login, order history, wishlist)** -- fully live.
  All 15 changed theme files promoted to Live (`188751446306`) and post-live
  verified checksum-match against approved staging state; final Live<->Staging
  drift check came back 0 differences. Wishlist page (`/pages/wishlist`,
  handle `wishlist`, template `wishlist`) created and confirmed working.
  Suraj tested a real login on the live storefront (2026-08-29) -- signed-in
  state, Profile, and Orders pages all confirmed rendering correctly with
  on-brand logo. Checkout/customer-accounts branding also completed manually
  by Suraj in Shopify Admin: logo, accent `#9A7B4F`, button `#000000`
  (explicit, matches sitewide black CTAs), typography set to Jost for both
  headings and body. Nothing outstanding on this feature except item 15 below
  (optional scope extension) and the customer-accounts custom-domain CNAME,
  which Suraj is handling himself outside of git/theme scope.

## Resolved today (2026-08-11) -- confirmed via live checksum, not assumed

These were on Suraj's own recollection of the backlog but are now actually done,
verified by comparing Live's deployed `checksumMd5` against the repo:

- **Client Diaries build** -- fully built and live, including Simran Bandukwalla's
  real first entry (blog, article, 3 looks, real photography, real copy). Was
  listed as "from the Simran Bandukwalla docx, not opened yet" -- that's no longer
  accurate as of today's promotion.
- **Journal dek line** (`sections/ka-article-hero.liquid`) -- the `article.excerpt`
  Liquid bug fix is live (checksum-confirmed on the Live theme). No merge-to-main
  go-ahead is outstanding; it already happened as part of today's release.
- **FAQPage structured data** (`sections/ka-faq-main.liquid`) -- live (checksum-
  confirmed). Same as above, no longer awaiting a merge.
- **Breakout image metafield definition** (`custom.breakout_image`, Article
  resource, file reference) -- confirmed to already exist on the store (checked
  live via `metafieldDefinitions(ownerType: ARTICLE)`, 2026-08-11). The *definition*
  gap from `Docs/journal-build-spec.md`'s F2 note is closed. Not yet checked:
  whether any real breakout images have actually been populated on existing
  Journal articles -- that's a separate, smaller content task if wanted (see below).

---

## Still open

### 1. Celebrity & Influencer section -- ON HOLD, Suraj undecided whether to proceed at all
**Source:** `Docs/about-us-build-spec.md`, Strategic Improvements #2 + Suraj (2026-08-11).
**Status (2026-08-11): ON HOLD.** Suraj said "im not sure if i want to go ahead
with this or no" -- not rejected, not approved, paused pending his own decision.
All work below is preserved and ready to resume from exactly this point whenever
he decides -- nothing needs to be redone.

**Work completed so far, preserved:**
- **Prototype:** `Prototypes/celebrity-influencer-v1.html` -- a dedicated
  editorial page (CD's format decision: not the existing commerce collection,
  not folded deeper into About), one real populated entry (Palak Tiwari, using
  her actual product photography/copy from K&A's own live product page), built
  as a genuinely repeatable block for future entries. Currently titled **"As
  Worn"** (CD's revised top recommendation after Suraj rejected the original
  "Film & Fashion" name). Open the file directly in a browser to review.
- **Naming alternatives** (CD's full list, if "As Worn" isn't preferred either):
  **On Loan**, **The Occasion**, **Quiet Company**, **By Name** -- rationale for
  each is in the CD session transcript; ask me to re-summarize if needed when
  this resumes.
- **Data-model recommendation (Technical Director):** blog articles + metafields,
  mirroring the proven Client Diaries pattern exactly -- NOT Shopify Products.
  TD's reasoning: a Product resource still carries commerce schema.org markup
  and can surface in connected sales channels (Google/Meta) as sellable
  inventory even with "Add to Bag" hidden, which recreates the exact risk this
  whole redesign exists to remove, just less visibly; it would also leave a real
  person's Shopify Admin edit screen cluttered with meaningless price/SKU/
  variant fields. Blog articles give each entry a real indexed URL, reuse a
  workflow the team already knows, and avoid dangling commerce fields. TD's
  proposed shape: new blog, one article per person, custom alternate template
  (`article.moment.json`-style, matching the `article.diaryentry.json`
  convention), `product_reference` metafield linking out to the real product
  page (no duplication), and reusing the `client_diary_look` metaobject pattern
  if a person is ever styled in more than one K&A piece.
- **Suraj's open review questions from CD** (still unanswered, revisit when
  resuming): (1) final name choice; (2) comfortable unpublishing/reworking the
  existing commerce collection page (see urgent finding below), handled
  separately from this page's timeline regardless; (3) any pullback/push-further
  on the deliberately restrained tone (no invented quote attributed to Palak
  Tiwari, no second name added without verification).
- **More names, if available:** if Suraj can confirm 2-3 more names from the
  Content Library's "INFLUENCERS , CELEBS" folder as genuine, consented,
  official styling relationships (not just tagged/reposted content), a second
  entry can be added later without a redesign. Never a name without a specific,
  checkable source.

**URGENT, separate finding -- NOT on hold, needs Suraj's attention regardless of
whether the new page ever gets built:** the *existing*, live, published
`/collections/celebrities-influencers` page presents 6 real named individuals
(including Palak Tiwari) as commerce products with "Add to Bag" buttons -- CD
scored this the single largest luxury-perception liability found on the entire
site during this audit, and flagged it as a reputational/consent exposure
independent of any redesign decision. Recommends unpublishing or removing the
commerce framing for the 5 unverified names immediately. This is a live,
real-world exposure sitting on the actual site right now -- worth deciding on
its own timeline, separate from whether "As Worn" (or anything else) ever ships.

### 2. Abandoned-cart & checkout emails -- Email 1 DONE, Email 2 pending
**Source:** Suraj (2026-08-11). Approved for work 2026-08-29: Shopify native
platform (no third-party app), house voice tone.

**Status (2026-08-29): Email 1 built and live-configured.** Suraj found the
store already had native "Abandoned checkout" and "Abandoned cart" Flow
automations active (Marketing > Automations, via the Shopify Messaging app)
-- more capable than TD's API-only investigation could see (genuine
pre-checkout cart recovery IS natively possible here, correcting an earlier
assumption). Built Email 1 ("We Kept This For You") directly inside the
existing "Abandoned checkout" flow using a **Custom Liquid** code block (full
HTML/CSS in `Docs/abandoned-cart-checkout-emails-build-spec.md` SS10) --
matches CD's design spec (rosegold eyebrow, serif heading, black primary
button, outlined secondary button). One real snag found and fixed: the
Custom Liquid button's `{{ checkout.abandoned_checkout_url }}` link didn't
resolve in testing -- fixed by restyling Shopify's own native "Continue
checkout" button (guaranteed-working, part of the tested default template)
instead of debugging the custom merge field, and trimming the duplicate
button out of the Custom Liquid code. Old default template blocks (generic
heading, duplicate "Continue checkout", unrelated "Visit our store") were
cleaned out. A test-send showed a broken checkout link, but confirmed
expected/harmless -- Shopify's "Send test" always substitutes a mock URL
since no real abandoned checkout exists behind a test send; real sends will
use the actual native recovery link.

**Deferred to later, explicitly by Suraj:** Email 2 ("No Rush. We're Here
When You Are.") -- code is already written and ready in SS10.2 of the same
doc, just not yet pasted in. Also still open: applying the same Custom
Liquid design treatment to the separate native "Abandoned cart" automation
(true pre-checkout recovery) -- not started.

### 3. Google Reviews live-sync -- IN PROGRESS (2026-08-29)
**Source:** Suraj said "not syncing automatically -- needs investigation" (originally
just static placeholder data, per `sections/ka-voice-of-bride.liquid` / homepage
Section 8). On 2026-08-29 Suraj decided explicitly: real live-sync, direct via
Google's Business Profile API, no third-party embed widget/app (rejected
Elfsight/EmbedSocial/etc. -- doesn't want a permanent external-app dependency).

**Status:**
- Google Business Profile API access application **submitted** 2026-08-29,
  case ID `2-4183000041674`, via Google's official request form. Review window
  7-10 business days per Google (real-world reports run longer). This is the
  long pole -- pure external wait, nothing actionable until Google responds.
- **Staging scaffolding: DONE, QA-passed (2026-08-29).** Metafield
  `custom.google_reviews` (Shop-level JSON) created; `ka-voice-of-bride.liquid`
  now reads it when populated, falls back to editor blocks otherwise, visual
  design untouched; droplet sync script at `scripts/google-reviews-sync/`
  built and Shopify-write-half tested live, Google-auth half intentionally
  stubbed pending Suraj's API access. Checksum-verified deployed to staging.
- **Remaining once Google approves access:** OAuth consent flow (steps in
  `scripts/google-reviews-sync/google_business_client.py` docstring + its
  README), drop credentials into env vars, run `sync.py` once, re-QA the
  section with real data rendering, wire into a systemd timer on the
  stocktradingbot droplet, then normal release approval before Live.
- **Finding worth Suraj's attention, unrelated to this build:** QA noticed
  Live's current copy of this section is already switched ON with real
  curated reviews from an earlier manual release Suraj made directly in
  Shopify Admin -- not the placeholder described above. Untouched by this
  work. Worth confirming with Suraj what's actually showing on Live right now
  before assuming it's still placeholder content.

See memory `ka_google_reviews_livesync_status` for full detail if resuming
this in a future session.

### 5. Footer legal-entity line has a double period ("Ltd..")
**Source:** QA Reviewer, 2026-08-11. Sitewide (`sections/ka-footer.liquid`), now
on both staging and Live. Root cause: the `legal_entity_name` schema default
already ends in a period and the template appends its own. **Deferred by Suraj**
-- small Technical Director fix, no Creative Director needed.

### 6. Client Diaries entry template naming is stale in docs
**Source:** Technical Director, drift check, 2026-08-11. `templates/article.json`'s
header comment and `Docs/client-diaries-handoff-2026-08-11.md` still say the
alternate template is "diary" (`article.diary.json`); the real, correctly-deployed
file is `templates/article.diaryentry.json`, suffix **"diaryentry"**. Low severity
(doesn't affect Simran's already-correct entry) but will confuse whoever assigns
the template to the *next* new entry if left stale. Doc-only fix.

### 7. Mobile nav: "Back to Client Diaries" merges with other nav text -- RESOLVED and LIVE 2026-08-29
**Source:** Suraj, 2026-08-11; approved for work 2026-08-29.

**Status:** First CD spec attempt overlapped the nav (QA caught it via box-model
math, confirmed by a second CD pass reading the real files fresh). Real root
cause: the nav's actual mobile breakpoint is `900px`, not `600px`, and its
opaque bottom edge sits at a near-constant ~96-102px across mobile through
wide desktop (nav padding + `.ka-nav__logo`'s `clamp()`-sized height) --
`.entry-return`'s old target values (`top:92px` desktop, `top:76px` mobile)
never actually cleared it at ANY real width, not just mobile.

**Corrected spec (2026-08-29), ready for TD:** `assets/ka-diary-entry-hero.css`
-- base `.entry-return` rule: `top: 92px` -> **`top: 120px`** (z-index stays
`90`). Remove the `@media (max-width: 600px) { .entry-return { top: 76px } }`
override entirely (keep that block's `left: 20px` -- unrelated, correct,
stays). A single unified `top: 120px` clears the nav at every width with
real margin, and sits well clear of the hero's bottom-anchored content
below. z-index left alone deliberately -- CD's reasoning: raising it above
the nav instead would put the link visually on top of the nav, recreating
the original crowding complaint in reverse, not fixing it.

**New finding, needs Suraj's go-ahead separately (see #23 below):** the
identical bug, byte-for-byte the same values, already exists on
`.article-return` in `assets/ka-article-hero.css` -- used on regular Journal
Article pages, which are already live, not staging. Not in scope for #7
specifically; tracked separately since Suraj didn't ask for this one yet.

### 13. Journal blog images are badly cropped (half-cut, faces not visible) -- RESOLVED and LIVE 2026-08-29
**Source:** Suraj, 2026-08-27, reported directly from the live page.
**First fix (shipped, later found incomplete):** `assets/ka-journal-card.css`'s
`.ka-j-card__image img` set to `object-position: center 22%;`, promoted live
2026-08-29 after a math-only QA pass (no browser/screenshot tool available)
sampled only 3 grid images.

**Suraj caught a real remaining bug the same day**, looking at the actual
staging preview himself: the "What Makes a Corset 'Structured'" grid card has
its face genuinely cropped off (eyes/forehead cut) -- its featured image is a
high-headroom editorial shot (face at 2.75-12.5% down the source), and `22%`
crops away everything above 9.82%, the wrong side of that image entirely.
Confirmed via pixel-accurate crop simulation, not estimation. The earlier fix
worked for the specific images it was checked against but wasn't validated
against the full set of published articles -- exactly the kind of gap a
math-only, small-sample check can miss.

**Second-pass investigation (2026-08-29):** queried the Shopify Admin API for
every article in the `news` blog (11 total, confirmed the blog that powers
`sections/ka-journal-grid.liquid` via `templates/blog.json`). Publish status
turned out narrower than expected: only **4 articles are actually
`isPublished: true` today** (`electric-blue-victorian-corset-with-drape-saree`,
`corset-lehenga-reconsidered`, `what-makes-a-corset-structured`,
`corset-lehenga-reception`); 4 more are scheduled for future publish dates
between 2026-09-02 and 2026-10-14 (`indo-western-defined`,
`dressing-for-every-wedding-event`, `pant-drape-saree-modern-read`,
`festive-season-structured-navratri-diwali`); the remaining 3 are true drafts
with no publish date, 2 of which have no featured image at all (no crop risk)
and 1 (`the-role-of-traditional-indian-designer-wear...`) has a landscape
2048x1152 image that gets zero vertical crop regardless of `object-position`
Y (its aspect ratio is wider than the 4:3 card box, so `object-fit:cover`
crops it horizontally, not vertically). Swept all 9 articles with a real
image anyway (published + scheduled + the 1 image-bearing draft), not just
the 4 currently live, to avoid a third instance of this exact bug when the
scheduled articles go live over the next 6 weeks. Downloaded every real
`article.image`, measured real pixel dimensions via the Shopify CDN response,
and visually measured face position with a pixel-gridded overlay (PowerShell
`System.Drawing`, 1% gridlines on the top 25% of each image) rather than
estimating from filenames/alt text.

Re-verified `.ka-j-card__image`'s real `aspect-ratio` is `4/3` (confirmed by
reading the CSS directly). Crop math (`object-fit:cover` visible-band
formula against the 4:3 box): for a source image narrower/taller than the
box, visible height fraction `vf = image_aspect / (4/3)`; visible band top %
= `(1-vf) * Y`, bottom % = top + `vf*100`. For 2100x2850 images (7 of the 9),
`vf = 0.5526`; for 2606x3047 (`corset-lehenga-reception`), `vf = 0.6415`; for
the one landscape 2048x1152 draft, `vf = 1.0` (no vertical crop, any Y is
safe).

**Full per-article table** (face position = forehead-to-chin span, % down
the source image; "visible band @ 8%" = the crop math above applied to that
image's real aspect ratio):

| Article | Status | Image px | Face zone (top hair - chin) | Visible band @ Y=8% | Result |
|---|---|---|---|---|---|
| electric-blue-victorian-corset-with-drape-saree | Published 2024-04-28 | 2100x2850 | ~2-15% | 3.58-58.84% | Clean (only bare hair-top sliver above band) |
| corset-lehenga-reconsidered | Published 2026-07-22 | 2100x2850 | ~1-18% | 3.58-58.84% | Clean |
| what-makes-a-corset-structured | Published 2026-08-05 (the confirmed-broken one) | 2100x2850 | ~2-15% | 3.58-58.84% | Clean -- full face in frame |
| corset-lehenga-reception | Published 2026-08-19 | 2606x3047 | ~0-15% | 2.87-67.01% | Clean |
| indo-western-defined | Scheduled 2026-09-02 | 2100x2850 | ~3-16% | 3.58-58.84% | Clean, comfortable margin |
| dressing-for-every-wedding-event | Scheduled 2026-09-16 | 2100x2850 | ~0-35% (tighter close-up crop) | 3.58-58.84% | Clean |
| pant-drape-saree-modern-read | Scheduled 2026-09-30 | 2100x2850 | ~2-20% | 3.58-58.84% | Clean |
| festive-season-structured-navratri-diwali (known #22 outlier -- different section, `.a-breakout__frame`, not this one) | Scheduled 2026-10-14 | 2100x2850 | ~18-38% (large headroom, face sits low) | 3.58-58.84% | Clean -- well inside band |
| the-role-of-traditional-indian-designer-wear-in-the-in... | Draft, no publish date | 2048x1152 (landscape) | n/a -- full height always visible | vf=1.0, no vertical crop | Not applicable, safe at any Y |
| the-significance-of-the-indian-festive-season | Draft, no publish date | no image | n/a | n/a | n/a |
| top-10-bridal-wear-designers-in-mumbai... | Draft, no publish date | no image | n/a | n/a | n/a |

**Result: `object-position: center 8%` is clean against all 9 real images
with zero exceptions** -- no article needed a documented accepted-gap
exception the way #22's `festive-season-structured-navratri-diwali` did for
the breakout-image frame. Every image's forehead-to-chin span sits inside
the 8% visible band with margin; only bare hair/background above the
forehead gets trimmed on the tightest cases (`what-makes-a-corset-structured`,
`corset-lehenga-reception`), never the face itself.

**Deployed:** `assets/ka-journal-card.css` updated (`object-position: center
8%`), `scripts/validate-theme-schema.ps1` PASS, committed
(`6cf942c`) + pushed to `origin/staging`, deployed to the live staging theme
(`gid://shopify/OnlineStoreTheme/189829808418`, re-verified live before
deploy) via `themeFilesUpsert` with zero `userErrors`, and independently
confirmed present via `get-staging-verification-query.ps1` +
`compare-staging-verification.ps1` -> **PASS**. One environment note for
whoever reruns that verification from this same local clone: this clone's
git `core.autocrlf` is `true`, which checks the working-tree file out with
CRLF even though `.gitattributes` pins `*.css` to `eol=lf` -- so the raw
working-tree MD5 the script computes by default gave a false `CONTENT
MISMATCH` against Shopify's checksum. The actual git-committed blob (`git
show HEAD:assets/ka-journal-card.css`, LF) byte-matches exactly what's live
on staging -- confirmed directly. Not a deployment failure, a local-clone
line-ending quirk; worth fixing this clone's git config at some point
(not done here -- config changes weren't in scope and weren't requested).

**QA independent re-verification (2026-08-29): PASS.** Redone from scratch --
own Shopify queries, own image downloads, own pixel-gridded face measurements,
own crop-math derivation (formula independently validated by re-applying it
against the old `22%` value and confirming it correctly predicts the real bug
Suraj found). Confirms `center 8%` clears the full forehead-to-chin span on
all 9 real images, zero exceptions. Flagged honestly: `what-makes-a-corset-
structured` (the one that broke) and `corset-lehenga-reception` pass with
the tightest margins (~40-50px of real slack) of the set -- not a problem
today, but the two to watch first if either photo is ever swapped for one
with the face positioned even slightly higher.

**Status:** Staging-verified, QA-clean by two independent passes. **Still
broken on Live** -- awaiting Suraj's explicit release approval before
promoting, same as any other release, no shortcut just because it's a fix.

### 14. Product page: thumbnail images sit above the main image on mobile -- RESOLVED 2026-08-29
**Source:** Suraj, 2026-08-27, from the live product page.
**Fix:** `.ka-stage` reordered before `.ka-thumbs` in `sections/ka-product-main.liquid`'s
source; `assets/ka-product-main.css` given explicit `grid-column` values so
desktop layout stays pixel-identical regardless of source order. QA traced
the full CSS cascade, confirmed the `<=900px` breakpoint now stacks correctly,
and confirmed `ka-product.js`'s click-to-swap/lightbox logic is unaffected
(never relied on DOM position). QA-clean. **Live as of 2026-08-29.**

### 15. Wishlist coverage -- extend to Bestsellers, "Continue the Collection", cart upsell
**Source:** QA finding, 2026-08-29, carried over from the (now-resolved) account/
wishlist item. 3 places on the site have their own product-card-style markup
that weren't in the original build's scope -- homepage Bestsellers section
(`sections/ka-bestsellers.liquid`), the product page's "Continue the
Collection" section (`ka-product-related.liquid`), and cart upsell products
(`ka-cart-cross-link.liquid`). Customers might expect to save a piece from any
of these too. Not a bug -- a scope question for Suraj on whether to extend
wishlist-heart coverage here, reusing the pattern already proven on the
collection grid/search results/product page.

**Minor FYI, unrelated to the above:** two old, unrelated Shopify pages ("My
Wishlist" handle `vertex`, "My Shared Wishlist" handle `vertex-share`) exist
from what looks like a previously-installed third-party wishlist app --
unconnected to this build; the real wishlist page uses handle `wishlist`.

---

## Smaller/lower-priority items noted in build specs, not yet actioned

Surfaced while reconciling this list against the repo (2026-08-11) -- not raised
by Suraj directly, included for completeness:

### 16. Appointment booking destination -- RESOLVED 2026-08-29
Suraj confirmed WhatsApp (the existing interim routing already built into
`sections/ka-appointment.liquid` -- both "Book In-Store Appointment" and
"Book Virtual Styling Session" CTAs open a pre-filled WhatsApp message
distinguishing in-store vs. virtual) is fine as the actual, permanent
destination, not just a stopgap. No further build needed. The section's
`{%- comment -%}` block still frames this as "TEMPORARY interim WhatsApp
routing" -- stale wording, could be updated for accuracy next time that file
is touched, but not functionally blocking anything.

### 17. `.is-current` nav-state pattern not extended sitewide
Only implemented for the About page; not yet extended to Collection/Product/
Cart nav links (`Docs/about-us-build-spec.md` Quick Wins).

### 18. Founders section second image
Optional future two-image treatment, not urgent (`Docs/about-us-build-spec.md`
Strategic Improvements #1).

### 19. Short atelier/fitting video moment for About page
Flagged as the single biggest quality delta available for the About page, not
represented in the current HTML/CSS/JS prototype (`Docs/about-us-build-spec.md`
Strategic Improvements #3). Needs a real video asset (sourcing/shooting/
editing), not just code -- a content-production dependency, not a pure build.

### 20. Two unpopped git stashes sitting in the repo -- RESOLVED 2026-09-04 (pending final drop)
Suraj decided 2026-09-04 to just clear these out rather than review them
(neither had anything uniquely needed -- one was mostly leftover binaries
with its one real file already recovered as part of #6, the other an early
Cart/Collection/Product draft clearly superseded by what's live today).
`git stash drop` was attempted but blocked by Claude Code's own safety
guardrails (destructive git commands are auto-denied in this mode) --
harmless either way, the stashes just sit unused on disk. Whenever Suraj
approves the drop (or runs `git stash drop stash@{1}` then
`stash@{0}` himself), this closes out for good. Off the active backlog
either way per his instruction not to keep tracking things he's already
decided on.

### 21. AggregateRating JSON-LD (Organization schema) -- DONE and LIVE 2026-08-29
**Source:** SEO & Discoverability's Technical SEO Specialist, spec handed off
2026-08-29 via cross-session message (`Docs/specs/2026-08-28-aggregaterating-schema.md`
in that project), approved by Suraj 2026-08-24. Adds `aggregateRating`
(4.7/64/bestRating 5) to the existing Organization JSON-LD block in
`layout/theme.liquid` only -- explicitly NOT on the per-product schema in
`sections/ka-product-main.liquid` (sitewide rating attached to every product
would misrepresent each as having 64 of its own reviews -- real Google
structured-data policy risk). Technical Director implementing now, staging +
QA per standing pipeline, no live push without Suraj's separate approval.

### 22. Journal article breakout-image crop cuts off faces -- RESOLVED and LIVE 2026-08-29
**Source:** Flagged by SEO & Discoverability 2026-08-07 (their CLAUDE.md),
surfaced to this backlog 2026-08-29 during the #21 handoff. Approved for work
2026-08-29 ("#22 begin").

**CD investigation (2026-08-29):** real frame aspect ratio is `vh`-driven,
swinging ~1.6:1 to ~2.7:1 (wider range than the original "~2.36:1" estimate),
`overflow:hidden` with no `object-position` override anywhere -- confirmed
root cause. Fetched and inspected real images across all 7 currently-published
articles with a `custom.breakout_image` set: **4 of them
(`corset-lehenga-reconsidered`, `what-makes-a-corset-structured`,
`corset-lehenga-reception`, `indo-western-defined`) have faces sitting very
high in the source image (2-30% down) that a dead-center crop would very
likely already be cutting into on the live/staging site right now** -- not
just a future risk. One outlier (`festive-season-structured-navratri-diwali`)
has unusually large headroom and is a known, accepted gap the fix below won't
fully solve.

**Decision:** ship a global `object-position: center 10%;` fix on
`.a-breakout__frame img` in `assets/ka-article-body.css` now. Explicitly
rejected building a per-article focal-point metafield for now -- real
recurring workflow cost, this fix covers the dominant case. Documented
image-selection guidance (prefer faces in top ~25% of source, minimal
headroom) noted as a companion, no-code follow-up for whoever picks future
breakout images.

**Status:** Fixed and deployed to staging (`object-position: center 10%;` on
`.a-breakout__frame img` in `assets/ka-article-body.css`), QA-verified with
real crop math against actual image dimensions at both aspect-ratio extremes
the frame can hit. **Confirmed: this was already a live-visible bug, not just
a future risk** -- all 4 flagged articles had faces entirely cropped out of
the visible frame at every realistic viewport size before this fix. Post-fix,
all 4 show the face fully in-frame (one, `corset-lehenga-reconsidered`, has a
tight tall-window margin worth knowing about). The known outlier
(`festive-season-structured-navratri-diwali`) still fails in the flattest/
widest-window case as expected -- accepted gap, not a regression. Pushed
live 2026-08-29 (bundled with #13's promotion).

### 23. "Back to Journal Article" return link also hidden behind nav -- RESOLVED and LIVE 2026-08-29
**Source:** Discovered 2026-08-29 by Creative Director while re-speccing #7.
`assets/ka-article-hero.css`'s `.article-return` has byte-for-byte the same
`top:92px`/`top:76px` values as #7's `.entry-return` did before the fix --
same root cause (nav's real opaque-bottom-edge is ~96-102px at every width,
not just mobile), same result: the "back to article" link on regular Journal
Article pages likely renders hidden behind the nav. **This is currently live
on production**, not just staging -- CD flagged it as arguably higher
priority than #7 for that reason. Same fix as #7: `top: 92px` -> `top: 120px`
in the base rule, remove the `top: 76px` mobile override, keep any `left`
value as-is. **Approved 2026-08-29** -- Suraj said yes when asked, bundled into the same
TD implementation pass as #7.

### 24. Collection page: single click/tap on product card not opening product page -- RESOLVED and LIVE 2026-09-04
**Source:** Suraj, 2026-09-04: "on collection page a single click on the photo
or product or anything is not opening the product page."

**Root cause confirmed (not the initially-suspected wishlist click-guard,
which was checked and ruled out with hard evidence):** the Collection grid's
product cards (`sections/ka-collection-grid.liquid`) reveal a quick-add
veil/button purely via `.ka-p-card:hover .ka-p-card__veil { opacity: 1; }` --
an ancestor `:hover` rule. On mobile WebKit browsers this is a well-known
trigger for "first tap only simulates `:hover`, a second tap is needed to
actually click" -- explaining why a single tap on the photo wasn't
navigating. Confirmed specific to the Collection grid: `ka-search-results.liquid`
and `ka-article-shop-story.liquid` reuse the same card markup but never
render a `.ka-p-card__veil`, so they don't have this pattern (flagged, not
touched -- no evidence they're actually broken).

**Fix:** gated all `.ka-p-card:hover` reveal rules in
`assets/ka-collection-grid.css` behind `@media (hover: hover) and
(pointer: fine)`, so touch devices skip the ambiguous hover-reveal state
entirely and a tap anywhere on the card navigates on the first tap. QA's own
pass caught a real follow-up bug during verification -- the quick-add
button's `pointer-events` had been left ungated, so on touch it stayed
invisible but still clickable dead-center in the photo, reproducing the same
symptom for part of the card. Fixed (`pointer-events: none` by default,
`auto` only inside the same desktop-only media query), redeployed,
re-verified clean.

**QA:** independently traced all 4 click scenarios by hand (card body/photo
on desktop and mobile; wishlist heart on desktop and mobile) -- PASS.
Confirmed the wishlist heart's own click behavior is unaffected. **Pushed
live 2026-09-04**, final drift check confirmed 235/235 files identical
between Live and Staging post-promotion.

### 25. Product URL handles don't match titles across the catalog -- 21 of 22 sitewide fixes RESOLVED and LIVE, 1 needs Suraj's call
**Source:** Suraj, 2026-09-06, from the live "Bloom Soirée" collection: product
titled "Rosy Fantasy Corset & Drape" lives at `/products/pelatine` -- no
relation to the title.

**Bloom Soirée specifically (IN PROGRESS):** TD audited all 25 products in the
collection. **16 have genuinely gibberish, unrelated handles**
(`pelatine`, `bloom-sonata`, `emblisse`, `flonament`, `mintara`, `jasmin`,
`auravine`, `twilight`, `glimsera`, `luna`, `dessert-rose`, `zestelle`,
`crimona`, `bellisse`, `rosanova`, `wild-bloom`) -- looks like a bad import
batch for this collection specifically, not typos. One case is actively
misleading: the product titled "Dessert Rose Corset & Drape" sits at
`/auravine` while a *different* product ("Satin Rose Bustier & Drape") sits
at `/dessert-rose`. The other 9 products in the collection have honest,
if abbreviated, slugs of their real titles -- left untouched. Fix mechanism
confirmed safe: Shopify's `productUpdate` with `redirectNewHandle: true`
renames the handle AND auto-creates a 301 from the old URL in one atomic
call, protecting existing bookmarks/links. Suraj approved proceeding
2026-09-06; **all 16 renamed and live**, each individually verified
(fresh handle confirmed, redirect confirmed real, old URL 301s correctly,
new URL loads). QA independently re-checked a 7-product sample (including
deep verification of the #7/#11 swap pair specifically, to rule out
cross-contamination) plus a batched liveness check confirming all 16 old
handles are now `null` as products (redirect-only, no orphaned duplicates)
-- PASS. Old URLs were sent to the K&A Meta Ads session as a precaution;
Suraj said 2026-09-06 not to bother checking -- closed, no further action.

**Sitewide pattern, separate and NOT yet scoped/fixed:** while auditing
Bloom Soirée, TD sampled 50 unrelated products elsewhere and found a
*different* mismatch flavor in ~7 of them -- the handle references an old
color/descriptor that no longer matches the current title (e.g. title
"Midnight Blue Cut Out Corset..." but handle `classic-blue-cut-out-corset-...`),
suggesting the product was renamed after creation without updating the
handle.

**Full sitewide audit completed 2026-09-07:** TD checked all 307 products
in the catalog (confirmed exact count, no sampling). **22 genuine
mismatches found (7.2% of catalog)**, 20 clear-cut + 2 borderline
(Ivory vs. buttercream/white -- a closer color-family call than the rest).
Heavily concentrated in one sequential product-ID batch (16 of 22),
same root-cause shape as Bloom Soirée -- one bad edit round, not scattered
typos. One swapped pair found (like the earlier Dessert Rose/Satin Rose
case): products 10361363136802 ("Peach Muted Gold...") and 10361814024482
("Blush Hand Embellished...") currently sit on each other's handles, needs
sequential handling. No gibberish-handle bug (Bloom Soirée's other pattern)
found anywhere else sitewide -- the short handles elsewhere checked out as
legitimate Hindi/Sanskrit/Latin color and gem names matching their titles.
**Suraj approved fixing all 22, including the 2 borderline ones, 2026-09-07.**
**21 of 22 renamed and live**, each individually verified (6 of the 22 are
still-draft products, correctly not live yet -- their handle/redirect data
is set and will take effect automatically if/when published). The #18/#19
swap pair was handled cleanly via a temp-handle sequencing step -- both now
resolve directly with zero stray redirects, QA-confirmed no
cross-contamination. QA independently sampled 8 of the 22 -- PASS.

**1 skipped, needs Suraj's decision:** product 8353793540386 ("Crimson Red
Cut Out Corset With Pleated Drape Saree") couldn't take its proposed handle
`crimson-red-cut-out-corset-with-pleated-drape-saree` -- it's already owned
by a different, unrelated live product: "Nidhi Shah in Crimson Red Cut Out
Corset With Pleated Drape Saree" (an editorial/celebrity-styling page, ID
8576643367202). Left untouched at its old handle
(`power-red-cut-out-corset-with-gathered-skirt-and-drape`) rather than
guessing a substitute. Needs Suraj to pick: append a disambiguator (e.g.
`-2`) or a different new handle entirely.

### 26. Two stale-personalization handles + two typo handles -- found during #25's audit
**Source:** Surfaced 2026-09-07 while auditing #25, not part of that fix.
Suraj said yes to tracking separately, 2026-09-07.
- Two products still carry old influencer-personalization text in their
  handle even though the title was later genericized: product
  9297156342050 ("Stone Hand Embellished Victorian Corset with Fishcut
  Skirt", handle still `sukhmani-gambhir-in-our-enso-stone-...`) and
  9297262182690 ("Stone Victorian Corset with Heavily Embellished Skirt &
  Dupatta.", handle still `malaika-chheda-absolutely-dazzling-in-our-
  victorian-corset`).
- Two handles have plain typos unrelated to color: `rashi-dongre-in-our-
  black-embellished-drale-saree` ("drale" for "drape") and `kritika-
  kaurani-in-our-cherry-red-corset-drape-saree` ("kaurani" for "khurana").
Not yet scoped for exact new-handle values or executed.

### 27. Product page main image crops off heads -- thumbnail layout CONFIRMED FIXED by Suraj 2026-09-07; face-crop and spacing still open
**Source:** Suraj, 2026-09-07, reported as a thumbnail/desktop layout question; TD's
investigation found the real bug is different and more severe than reported.

**Confirmed:** the thumbnail rail is clean (checked 20 real images, no cropping).
**The actual bug is in `.ka-stage` (the main product image)** in
`sections/ka-product-main.liquid`/`assets/ka-product-main.css` -- a fixed
`min-height:640px` with no matching width constraint or `aspect-ratio`, so
the crop gets WORSE as the browser gets wider, not better. Simulated and
visually confirmed on real photos: at a normal 1920px desktop, the entire
head is cropped off at the shoulders -- worse than the narrow-window
screenshot that prompted the report. Affects essentially every portrait
product photo sitewide except a narrow ~900-1244px viewport band. Not a
simple `object-position` nudge like the Journal fixes -- the box's aspect
ratio changes continuously with viewport width and the crop direction
itself flips (horizontal in one band, vertical everywhere else), so it
needs a structural fix (sizing the box to match the real photography's
proportions, e.g. `aspect-ratio` matched to studio photography's actual
ratio) rather than a single crop-position value.

**Fix:** `.ka-stage` in `assets/ka-product-main.css` changed from a flat
`min-height:640px` to `aspect-ratio:3/4; max-height:90vh` (desktop), and
`min-height:480px` to `max-height:80vh; min-height:380px` at `<=900px`
(aspect-ratio inherited) -- matches the sitewide `3/4` standard already used
one section below on the same page. QA independently re-derived real crop
math at 375px/768px/1440px/1920px against real sampled product images:
worst-case crop dropped from 36-52% off-top to single-digit/low-teens at
every width -- e.g. the tightest-ratio photo went from 36.1% cropped at
1920px to 8.3%. Two honest minor exceptions at the extreme ratio ends
(where the old fixed box happened to coincidentally fit one specific case)
now crop a few points more than before, but stay in the same 8-18% range
every other `aspect-ratio:3/4` box on the site already lives with --
nowhere near the original 36-52% severe crops. `.ka-thumbs` confirmed
unaffected.

**Regression found and fixed before release (2026-09-07):** Suraj caught, via
actual staging preview, that the fix broke `.ka-media`'s grid layout at real
desktop widths (thumbnails collapsed below the image instead of beside it)
and shifted the stage image left with a gap on narrower screens. Root cause:
`.ka-stage` is a `<div>` with a CSS `background-image` (no intrinsic size),
and `aspect-ratio` + `max-height` with no explicit `width` let the browser
shrink width instead of just capping height once the aspect-derived height
exceeded max-height -- confirmed with real math (e.g. a 47px shortfall at
1920px, worse on short-viewport mobile browsers). Fixed by adding
`width:100%` to `.ka-stage`, which doesn't touch the crop fix itself
(aspect-ratio/max-height values byte-identical). QA independently
re-verified with hand-derived box-model math at 1920px/1440px/390px --
PASS, both symptoms resolved, original crop fix confirmed intact.

**Separate finding, not a bug:** the large gap Suraj also flagged before
"The Designers' Note" is intentional, already-shipped spacing (two padding
tokens stacking to ~280px, same tokens used identically elsewhere on the
page) -- TD did not change it, since altering deliberate design spacing
needs a real design call, not a guess. Flagged for Suraj/CD if he wants it
tightened.

**Suraj checked the actual staging preview again (2026-09-07) and confirmed
this is still visibly broken** -- two rounds of "fixed, QA-verified" reports
(both purely code/math-based, no real browser check) turned out wrong once
checked against a real screenshot. Real symptoms from his screenshots: the
thumbnail rail still stacks vertically BELOW the main image at genuine wide
desktop widths (not beside it in a slim side column as intended), making the
media column far taller than the info column next to it; two of the four
thumbnails appear to render in an inconsistent 2-column pairing further
down; face-cropping may still be present (unconfirmed which image); and the
Designer's Note gap, while confirmed intentional, is too large in his
judgment and he wants it reduced. **Escalated to Creative Director for a
real design review** (not just another code-only TD pass) plus a deeper TD
re-investigation that starts by re-verifying the actual deployed CSS content
matches what was claimed fixed, given the deployment-sync flakiness this
project has hit before. Not resolved -- do not report this fixed again
without real visual confirmation.

**Third pass (2026-09-07):** deployment confirmed genuinely correct (checksum-
matched, ruling out the sync-flakiness theory), real root cause found (the
top-level page columns were never height-linked, and the crop fix made that
gap far more visible; separately, `.ka-thumbs` was being stretched to match
`.ka-stage`'s height inside a CSS Grid with nothing to fill that stretch).
CD replaced the vertical thumbnail rail entirely with a horizontal filmstrip
below the stage image (`assets/ka-product-main.css`) -- removes the root
mechanism rather than patching it, and unifies desktop with the pattern
mobile already used. Designer's Note top padding reduced from 200px to 96px
(176px total gap, down from 280px), via a scoped override, `--s-3xl` token
and its other uses left untouched. The "2 thumbnails pairing" symptom was
never traceable to any thumbnail-rail code in any version -- likely
candidate found instead: `ka-product-desc`'s own 2-column description-image
grid, which sits directly below and shares the same crop ratio/visual
treatment. Face-crop math re-confirmed clean on this exact product's real
images. Staging-verified, QA-passed -- **but QA explicitly flagged this
verification is still code/math-based only, same limitation that made the
first two "PASS" verdicts wrong. Needs Suraj's real visual check on the
actual staging preview before this is trusted as closed.**

**Suraj's real check (2026-09-07): thumbnail layout confirmed genuinely
fixed.** Two things still open, both re-escalated:
- **Face-cropping** -- still visible on at least one thumbnail on this exact
  product page per Suraj's direct observation, despite TD/QA's "clean" math
  finding. Possible explanation not yet ruled out: that finding described
  all 4 of this product's images as "full-length portrait with generous
  headroom," but one of the real thumbnails visible in Suraj's screenshot
  looks like a closer/medium shot (hand at neck, jewelry) -- a
  fundamentally different headroom situation than a full-length shot, which
  may have been mischaracterized rather than actually inspected. Also,
  Creative Director's earlier investigation (item #27 origin) already noted
  the real catalog's aspect ratios range 0.6875-0.9158 -- a single global
  `3/4` crop box was always going to crop MORE on some products than the
  one spot-checked. Needs a real, skeptical re-investigation, not another
  math-only pass that trusts an earlier description of the images.
- **Designer's Note spacing** -- still too much even after the 280px->176px
  reduction. Suraj specifically flagged it gets visibly worse on products
  whose description has NO embedded gallery images (nothing to break up the
  space before the note) -- a real case the last spacing pass didn't
  separately check.

**Spacing: DONE (2026-09-07).** CD confirmed via real code (not assumption)
that the no-gallery case doesn't reserve empty space -- the section just
shrinks -- so one shared fix covers both cases, calibrated against the
harder no-gallery case. Both sides of the gap reduced this time (not just
the one already touched): `.ka-note` top padding 96px->64px, AND
`.ka-product-desc` bottom padding 80px->64px (moved onto the same
`var(--s-lg)` token), grounded in a real precedent already live elsewhere
on the site (Journal article body->next-section transitions use the
identical 64px/64px pairing). New worst-case combined gap: **128px**, down
from 176px. Deployed to staging, QA-verified. Incidental finding during
deploy: Ashita had made a direct edit to this same file in Shopify's theme
editor -- diffed and confirmed it was pure line-ending noise, zero real
content conflict, handled safely. **Still needs Suraj's real visual check.**

**Face-cropping: Suraj was right, confirmed 2026-09-07.** Re-investigation
found image 3 of Electric Blue Victorian Corset's 4 photos is a medium/bust
shot (hand at neck/jewelry, no feet in frame), misgrouped with the other 3
full-length shots in the earlier pass -- which is why that pass's crop math
came back "clean." The crop math itself was technically non-zero-margin
(~2.76% headroom vs. ~0.88% crop), but at the actual on-screen thumbnail
size (150px desktop, 64px mobile) that margin is only 2-4 physical pixels
-- reads as flush/cropped to the eye even though no pixel is technically
removed. Broadened to a 24-product catalog sample (covering the real ratio
range 0.68-1.15): **no other genuine face-crop case found** -- this looks
like a real, isolated outlier from an older/legacy-tier shoot, not a
systemic problem. TD's options, none implemented (content decisions, not
code): (1) reorder/drop this specific image in Admin -- zero-code fix, (2)
replace the source image with one that has real headroom, (3) build a
per-image crop-position override -- real added complexity for what appears
to be a single confirmed case. Awaiting Suraj's call.

**Full catalog audit completed 2026-09-07** (Suraj asked for this after the
photography-standard discussion). Covered all 307 products, computed real
pixel aspect ratio for all 809 images, and actually visually inspected
~125 distinct images across ~110+ products -- targeted at the highest-risk
populations (all 41 images from the non-uniform "raw studio" tier, all
worst-ratio legacy classes, all 23 single-image editorial/personalization
pages, plus a stratified sample of the dominant image class) rather than a
random sample. **Zero new genuine face-crop cases found.** Electric Blue's
image 3 remains the only confirmed case in the entire investigation --
this is now a well-evidenced isolated outlier, not a sampling gap. Two
unrelated minor notes: one corrupted/missing media record (product
10382229668130, data-quality issue, not a crop bug) and one product whose
single photo has no head in frame at all (nothing to crop). Fix path
unchanged: reorder, replace, or (not recommended for one case) build a
per-image override -- ready for Suraj's decision.

**Suraj's decision (2026-09-10): leave image 3 as-is for now.** Considered and
ruled out re-exporting the product's 4 images at 2100x2850 as a fix -- checked
directly and all 4 are already stored at exactly that resolution (0.7368
ratio), so re-exporting at the same size would be a byte-identical no-op.
The real limitation is that image 3's headroom is baked into the original
photography (braid/hairline starts ~3% down from the top edge of the source
file itself, a tight bust/close-up framing choice) -- no crop-box or resize
change can recover margin that was never captured in the shot. Accepted as
the sole known outlier from the 2026-09-07 full-catalog audit (307 products,
809 images); no code or content change made at the time. Superseded below --
this is no longer the final state of item #27.

**Native-ratio experiment approved and generalized site-wide (2026-09-10/11).**
Suraj asked (2026-09-10) to test bringing back Dawn's "box adapts to the
photo's own real aspect ratio, zero cropping" behavior, scoped at first to
ONLY Electric Blue Victorian Corset so he could visually judge it on staging.
Built and deployed to staging (`ka-stage--native-ratio` / `ka-thumb--native-ratio`
modifier classes + a `--ratio` custom property from each image's real
`image.aspect_ratio`, gated by `product.handle` in `sections/ka-product-main.liquid`).
First round surfaced a real bug Suraj caught on staging (box rendered far
taller than expected, requiring extensive scrolling): root cause was
`.ka-stage` forcing `width:100%` while using the real (near-3:4) ratio,
so the aspect-ratio-derived height (~950-1100px at real desktop widths)
exceeded the existing `max-height:90vh` cap and, since width never
narrowed, the clamp silently reintroduced cropping instead of shrinking
the box. Fixed in `assets/ka-product-main.css` with an explicit width
formula -- `width: min(100%, 90vh * var(--ratio, 0.75))` -- so width
narrows instead of height cropping whenever needed; verified via real
headless-Chrome measurement, not assumption (byte-identical to the old
behavior when there's no height pressure, correctly narrower with the
ratio preserved exactly when there is). Suraj re-checked and approved.

**Generalized to the standard, permanent product-page behavior (2026-09-11),**
per Suraj's explicit instruction -- no longer a single-product trial. Scope,
confirmed with him: product page only (main stage image + thumbnail rail).
Collection grid cards and search results are explicitly OUT of scope and
keep the fixed 3:4 box untouched. Applies automatically to every product,
including any added later -- the `product.handle` gate was removed entirely
from `sections/ka-product-main.liquid`; the modifier classes and `--ratio`
property are now applied unconditionally, gated only on an image actually
being present (the pre-existing `first_image` / images-loop guards), same
as every other product-page image render.

Before rollout, re-verified against the full catalog's real ratio range
(0.6875-0.9158, per the 2026-09-07 audit) rather than assuming the Electric
Blue fix generalized cleanly:
- Ratio math at both extremes confirmed correct via real headless-Chrome
  measurement (not just algebra) at spacious and cramped desktop viewports.
- Found and fixed a second real bug specific to the mobile breakpoint:
  `.ka-stage--native-ratio`'s width formula was keyed to `90vh` (matching
  desktop's `max-height`), but the `@media (max-width:900px)` block
  overrides the ACTIVE `max-height` to `80vh` without touching the width
  formula -- at the catalog's most extreme ratio (0.6875) this produced a
  real mismatch (width computed from 90vh, height clamped from 80vh),
  rendering a 0.7734 box instead of 0.6875 and reintroducing cropping.
  Fixed with a mobile-scoped override, `width: min(100%, 80vh * var(--ratio, 0.75))`,
  inside the same media query -- reverified at the same extreme ratio and
  viewport: aspect ratio now preserved exactly, zero cropping.
- No-image placeholder case (`ka-stage--ph` / `ka-thumb--ph`) confirmed
  unaffected -- the modifier classes and `--ratio` property are gated on
  the same `first_image` / images-loop conditionals that already control
  the placeholder path, so a product with no image can never receive them.
  No genuinely image-less product currently exists in the active catalog
  to test end-to-end (confirmed via a full product query), so this is
  verified by code inspection of the (deterministic) Liquid conditionals,
  not a live render -- flagged here in case that ever changes.
- Spot-checked a handful of other real products spanning different ratios
  against the actual deployed staging render (not assumed) for regressions.

As a side effect, image 3's headroom problem (the original outlier this
whole investigation started from) should now actually be resolved --
without a fixed 3:4 crop box, there is nothing left to clip that thin
margin. **Suraj should still visually confirm this himself on staging --
not being asserted as fixed here**, since every prior "fixed" claim on this
specific image turned out to need his direct visual check before it could
be trusted (see the multiple rounds above).

Deployed to staging only, following the full validate/push/themeFilesUpsert/
checksum-verify procedure. Live/main untouched, no promotion approval
sought or in scope for this change.

### 28. Homepage Google Reviews -- manual refresh, blocked on Suraj
**Source:** Suraj, 2026-09-07: wants to bring in new/current real Google
reviews and update the homepage section now (separate from the automated
live-sync in #3, which stays deferred until the Google API access is
actually approved).

**Status:** Investigated whether Gmail's review-notification emails could
supply this without needing Suraj to open Google Business Profile directly
-- they can't. Checked several: reviews with written text are truncated
("...") in the email, not full quotes, and the site's standing rule is
verbatim-only (never invented/completed). One complete short quote found
(Sakshi, 4-star: "Good design love the outfit") but no current overall
rating/review count is available from email data either.

**Blocked on Suraj:** needs to open Google Business Profile directly and
copy-paste (a) the current star rating + review count, and (b) full text of
whichever 2-3 reviews he wants featured. Candidates flagged from truncated
previews, if he wants a starting point: Arushi, Trina, and Rajdeep (all
5-star, strong positive openers, just need the complete text pulled).
