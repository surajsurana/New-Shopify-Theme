# LOOMIÈRE — Launch Creative Brief (first pass, pre-photography)

**Author:** Creative Director · **Date:** 2026-10-19 · **Status:** Draft for Suraj's direction. No theme, Shopify or asset changes made. Revised 2026-10-19: FirstLove stays as the homepage "Introducing" block; Loomière goes into a new two-slide hero (Section 8, prototype built).

Facts below marked (code) were read directly from the theme files in this folder. Anything about Shopify Admin state comes from Suraj's brief.

---

## 1. Launch recommendation

### Top recommendation (one line)
Launch Loomière as a **full-chapter collection in the Bloom Soirée pattern**, announced **once** on the homepage as the second slide of the main hero (revised 2026-10-19: FirstLove keeps the "Introducing" story block), with a footer link and no nav change. This is a content-led launch with one small code item (below).

### Why this, and not something bigger
Loomière is a festive capsule of a handful of pieces. A bespoke microsite or a new landing template would be louder than the collection deserves. What makes a launch luxurious is not new machinery. It is one strong image, one considered paragraph, and restraint everywhere else. The Bloom Soirée template already gives the collection its own chapter (breadcrumb, full-bleed hero, editorial intro with facts strip, 3-chip refine bar, grid with an editorial insert, cross-link strip, concierge band). Reuse it.

### Surface by surface

| Surface | Recommendation | Code or content? |
|---|---|---|
| **Collection page** | New alternate template `collection.loomiere.json`, cloned from `collection.bloom-soiree.json`, assigned to the collection (templateSuffix `loomiere`). Hero, intro copy, facts strip, and editorial-insert images are all set as section settings (the hero and grid sections accept image pickers). This avoids the hard-coded `case handle` image lookups that Bloom Soirée relies on. | New JSON template file only. No new section code. |
| **Collection title** | Change Admin title from "LOOMIÈRE" to "Loomière". The title feeds the hero H1, the breadcrumb, the WhatsApp pre-fill text and the concierge sentence. All-caps in the data reads as shouting and cannot be undone by CSS elsewhere. Matches how "Chamakk" and "Barre Oblique" are written. Keep handle `loomiere`. | Content (Admin) |
| **Collection image (Admin)** | Upload the collection card image as the Shopify collection's own image. The cross-link strip and All Collections page both use `collection.image` first, so this makes Loomière appear correctly there without new image cases. | Content (Admin) |
| **Concierge band** | Title has no "The", so the default sentence reads correctly: "Every piece in the Loomière collection is a starting point...". No short_name metafield needed. | None |
| **Editorial insert caption** | Set metafield `custom.editorial_caption` on the collection (see copy). Otherwise the grid shows the placeholder "Caption pending...". Same for `custom.intro_copy` etc. if we prefer metafields over section settings. Recommend section settings, as Bloom Soirée's template does not need either. | Content (Admin) |
| **Homepage** | **Revised 2026-10-19 (Suraj).** FirstLove is NOT replaced: the `ka-collection-story` "Introducing" block stays FirstLove (this year's collection). Loomière is announced in the main hero instead, which becomes a two-slide slider (see Section 8). One announcement on the page, in the most prominent place. | Content + the hero slider build (Section 8). |
| **Homepage Collections Directory** | The block has `"limit": 5` and the CSS is `repeat(5, 1fr)`, and the five slots are already full. A sixth card needs a small code change (raise the limit, decide the grid), or Loomière takes a slot and one older card is retired. See Decision A below. | **Small code** (or a content swap) |
| **Nav / menu** | **No top-nav entry.** The nav has four deliberate items; a fifth for one capsule would crowd it and date quickly. Loomière is reachable through Collections and through the homepage story. | None |
| **"New" signal** | The word "Introducing" in the homepage eyebrow is the signal. No badge, ribbon, "New In" tag or banner. If a quieter second touch is wanted: set search-overlay tile 1 (currently "The Bloom Soirée") to Loomière. It is a nav setting with an image picker, content only. | Content only |
| **Footer** | Add Loomière to the Admin navigation menu `footer-collections` (placed first or second). If that menu is empty the code fallback ignores it, so Technical Director must confirm the menu exists before relying on it. | Content (Admin Navigation) |
| **Cross-link strip on other collections** | The strip is fixed in code to four handles (`the-festive-edit|the-bloom-soiree|chamak|barre-oblique`). To show Loomière on those pages, add `loomiere` to the handle list. Recommended, but not launch-critical. | **One-line code**, optional |
| **Collection hero "position" number** | Eyebrow reads "The Collections — 0X". Set to match directory order. | Content |
| **Product pages** | No template change. See naming conventions below. | Content |
| **Journal / Client Diaries** | Not for launch. Revisit when a Loomière piece has a real client story. | n/a |

### Decision A for Suraj (homepage Collections Directory)
- **A1 (my recommendation): raise to six, and make the grid read as 3 x 2** at desktop, so each card is larger. This is a modest CSS change and makes the directory feel calmer than five tight columns. Loomière takes position 01 while new.
- **A2:** content swap only. Loomière replaces the weakest existing card (Festive Edit currently uses a stand-in image). Zero code, but removes a collection from the homepage.
- **A3:** do not add Loomière to the directory at launch. Rely on the homepage "Introducing" block. Lowest risk, but less discoverable after the Introducing block rotates out.

### Collection page structure (final, as it will read)
1. Nav
2. Breadcrumb
3. Hero: full-bleed image, "The Collections — 0X", title "Loomière", piece count
4. Intro: editorial paragraph plus facts strip (Silhouettes / Made to Order / Price Range / Sizing)
5. Refine bar: chips by silhouette (tag-matched, see section 3)
6. Grid with one editorial insert after the 6th piece
7. Cross-link strip
8. Concierge band
9. Footer

**Piece count caveat:** the hero prints the live product count. With only 2 to 6 pieces, "4 Pieces in this collection" reads as intimate and exclusive if the number is honest and the collection is complete at launch. Do not launch with 1 or 2 pieces showing; rather wait for a complete capsule (see Question 3). The editorial insert after the 6th piece will not appear on a small collection, which is fine: with fewer than 7 pieces the page is short and the insert is not needed. The refine bar with chips is also unnecessary below roughly 6 pieces. Recommend hiding or leaving the chips blank if the capsule is small. **Flag for Technical Director:** confirm how the refine bar behaves when the chip blocks are removed from the template.

### Product naming conventions (for the pieces)
- Follow the house pattern already in the catalogue: **Colour + silhouette (+ "with" for the drape/stole)**, Title Case, no collection name inside the product title. Examples consistent with the two drafts: "Snow White Corset with Drape Skirt and Stole", "Burgundy Scalloped Corset with Drape Skirt".
- Use "and", not "&", and lowercase "with" for consistency with each other. Existing catalogue is mixed ("Sapphire Corset and Pants"; "Deep Purple cutout corset with pre-stitched drape"). Not asking to rename existing products; apply this to new ones. I will not rename the two drafts without Suraj's say-so.
- Descriptions: two or three sentences, lead with the fabric or the silhouette, and mention the statement tassel where it applies. No superlatives.
- Product page fabric line (`custom.fabric_description`) is shown on collection cards. Fill it for every piece, short form, e.g. "Handwoven brocade, hand-finished tassel".
- Tags per product: `made-to-order` (the card badge depends on it) and one silhouette tag per chip (exact spelling match, see section 3).
- Add pieces to the collection manually (it is a manual collection). No automated "Loomière" tag is needed, but use `loomiere` as a tag anyway for internal filtering, ads and reporting.
- Each piece should carry a one-line occasion cue in the description (Diwali evening, Karva Chauth, sangeet guest, and so on). This speaks to the bridesmaid, mother and sister, not only the bride.

---

## 2. Copy drafts (house voice: restrained, present tense, no exclamation marks, no urgency)

Grounded in the brand brief (craft, made to order, occasion relevance) and the homepage "First Love" and Bloom Soirée register: short declaratives, one image-led sentence, then the craft. Your supplied description is kept in substance.

**Assumption to confirm:** the name reads as *loom* + *lumière* (light). It fits "handwoven" plus "shimmer". If the name has a different origin story, tell me and I will rewrite line 1 of the intro.

### Collection hero
- Eyebrow (system-generated): `The Collections — 0X`
- H1: `Loomière`
- The hero has no subtitle slot (title and piece count only). The three-phrase line is therefore used as the editorial-insert caption and the homepage teaser.
- **Tagline / insert caption:** *Rich textures. Fluid drapes. Playful shimmer.*

### Collection intro paragraph (section setting `intro_copy`)
> Loomière takes its name from the loom and from light. Pure handwoven brocades, sculpted corsets and fluid draped skirts, kept in solid colour and finished with statement tassels. Made for the evenings of a festive season, and for every woman who is celebrating in them: the host, the guest, the bride's family.

Shorter alternate (about 28 words):
> Rich textures, fluid drapes and a quiet shimmer. Handwoven brocades, sculpted corsets and draped skirts, finished with statement tassels.

### Facts strip
- Silhouettes: *Corsets · Drape Skirts · Brocade* (exact list depends on final pieces)
- Made to Order: *[lead time, see questions]*
- Price Range: *[to confirm, e.g. "From ₹xx,000"]* Maintained manually by design (CD Note 4)
- Sizing: *Made to Measure*

### SEO
- **SEO title (55 chars):** `Loomière | Festive Couture by Karishma & Ashita, Mumbai`
- **Meta description (145 chars):** `Loomière: handwoven brocades, sculpted corsets and fluid drapes in solid colour with statement tassels. Festive couture, made to order in Mumbai.`
- Collection image alt text: `Loomière festive collection by Karishma & Ashita`

### Homepage teaser (superseded: now the hero slide 2 copy in Section 8; the Introducing block stays FirstLove. Text kept for reuse elsewhere)
- Eyebrow: `Introducing`
- Title: `Loomière`
- Body: *Rich textures, fluid drapes and a little shimmer. Loomière is our festive collection of handwoven brocades, sculpted corsets and draped skirts in solid colour, finished with statement tassels. Made to order, for every evening of the season.*
- CTA: `Explore the collection`

### Directory card / search tile
- Name: `Loomière`. No further copy. Cards carry only a number, a name and "Explore".

### Concierge band
Unchanged. The default copy already reads correctly.

### What I will not write
No "limited edition", "selling fast", "shop the drop", "festive sale", emoji, or exclamation marks. Festival names (Diwali, Karva Chauth, Rakhi) are used sparingly, in product descriptions rather than in headlines, so the collection stays wearable beyond one calendar window.

---

## 3. Asset checklist for Suraj (hand over the shoot in one go)

### General
- Original, un-retouched RAW or full-resolution JPEG for everything. Final retouch can happen on our side, but the Creative Director must see the colour-accurate files first.
- Colour accuracy matters more than mood grading. Brocade and solid colours must read true to the garment (Docs/product-photography-standard.md and the AI-creative fidelity rule).
- Please do not send images already compressed by WhatsApp.
- Please label files with the piece name where known.

### A. Product photography (per piece), the standard
**3000 x 4000 px, exactly 3:4 portrait, no exceptions** (Docs/product-photography-standard.md). Leave visible headroom above the head. Full-length shots are safer than tight crops.

Per piece, minimum **5 images**:
1. Front, full length (this is the grid card image, so it must be the strongest)
2. Back, full length
3. Side or three-quarter, full length (shows drape movement)
4. Detail 1: fabric and weave close-up (the brocade, tassel or shimmer), kept slightly loose per the standard
5. Detail 2: construction (corset boning/neckline, hem, tassel)
Optional 6 to 8: second angle, styled with stole or dupatta, flat lay of the tassel.
The second image on a collection card swaps on hover, so image 2 should be as beautiful as image 1. Order matters. Tell me the intended order.

### B. Collection hero (page banner)
- **Landscape, minimum 3600 x 2200 px (about 1.64:1)**, ideally wider so it can crop. The hero is a flexible-height frame (78vh desktop, 64vh tablet, 58vh mobile) with `object-fit: cover` anchored near the upper third, so side and bottom margins crop on different screens.
- **Composition:** model and garment in the central 60% of the frame, face and the garment's signature detail well inside the upper-middle. Keep the **bottom-left and bottom-right 20% quiet**, because the title and piece count sit over them on a soft dark gradient.
- Calm, textured background. No logos, props with branding, or visible crew.
- 1 hero required, 1 alternate welcome.

### C. Collection card (homepage directory, All Collections page, search tile, Shopify collection image)
- **Portrait 2:3, minimum 2000 x 3000 px.** Used at 700 x 1050.
- Keep the subject centred with a clear face and a clear view of the dominant colour. White text is overlaid at the bottom, so the lower third should not be a busy detail.
- If the card image is the same photograph as another surface, say so.
- 1 required.

### D. Homepage "Introducing" block (3 images)
- **Main: portrait 3:4, minimum 2400 x 3200** (shown at 1200 x 1600). This is the emotional image. Prefer a single figure in motion with the drape in air.
- **Two secondary details: landscape 3:2, minimum 1800 x 1200** (shown 600 x 400, in a 280 px high strip). Fabric weave close-up and tassel close-up. These are the "craftsmanship visibility" images, and macro texture is exactly right.

### E. Collection-page editorial insert (appears after the 6th piece, if the collection is large enough)
- **Landscape, minimum 3600 x 2000 (about 1.8:1).** A wider, more cinematic frame than the hero. A group or movement shot works well (two women in coordinated Loomière pieces suits the "family and friends" brief).

### F. Search overlay tile (optional)
- Can reuse the card image (C). No separate shoot needed.

### G. Optional, high value
- **Short vertical video (9:16, 10 to 20 seconds, no audio dependency)** of drape and tassel movement for Instagram and a later hero upgrade. Not needed for launch; flag if one exists.
- **A behind-the-scenes or weaving detail image** (a loom, a craftsperson's hands, brocade up close). One image like this lifts the whole collection from "new stock" to "made". Uses the same macro format as D.
- **Two or three occasion shots** (festive table, diya, family gathering) for the journal, ads and a later Client Diaries entry.

### Models and styling
- A mix of silhouettes wins: at least one body-skimming corset look and one flowing drape look.
- Consistent location and light across all pieces for one cohesive chapter.

### Product information needed per piece (a spreadsheet is ideal)

| Field | Notes |
|---|---|
| Product name | Colour + silhouette per convention above |
| Price (INR) | Per piece. Entry price across the house is ₹30,000, so confirm where these sit |
| Lead time | Brand brief ranges: drape and corset saree about 20 to 25 working days, Indo-Western 30 to 35, lehenga 40 to 45. Confirm for each piece, do not assume |
| Fabric | e.g. type of brocade, lining, tassel material |
| Embellishment | Any hand embroidery, tassel, crystal or zari detail |
| Construction | Pre-stitched drape? Corset boning? Detachable stole? Dupatta included? |
| What is included | Corset, skirt, stole, pants. List every item sold as one price |
| Colour name | One clear, editorial colour name |
| Variants | Sizes offered (made to measure or standard sizes?), colour options, any customisation allowed |
| Customisation | Which of colour, embellishment and fit can be changed |
| Care | Dry clean only? Any handling note |
| Ready-to-ship or made to order | Rare to have ready stock; tell us if any is |
| Silhouette tag | One tag per piece for the refine chips (max 3 chips) |
| Occasion line | e.g. Diwali, Karva Chauth, sangeet guest, wedding family |
| Inventory | Whether any stock is held, and how many |
| SKU / reference | Matches the garment tag and the Stitchflow record |

### Collection-level information
- Final collection description approved (your supplied text, or my intro above)
- Collection price range string for the facts strip
- Silhouette list for the facts strip and the refine chips
- Final piece list, and the order you want them to appear (manual sort)
- Which of the two draft products, if either, belong to Loomière

---

## 4. Open questions only Suraj can answer

1. **Launch date and time**, and whether it is tied to a specific festival (Karva Chauth, Diwali), because it sets the shoot-to-live timeline and our copy emphasis.
2. **Is the empty public page a problem?** `/collections/loomiere` is live (200) on 5 channels and will be in the sitemap, so search engines or a stray link can reach an empty "Loomière" page. **My recommendation: unpublish it from all sales channels now and republish at launch.** Alternative: leave it, but add no links to it anywhere. Which do you prefer? (This is an Admin action, not a theme change, and I have not done it.)
3. **Which pieces are in the collection, and how many?** In particular, do "Snow White Corset With Drape Skirt & Stole" and "Burgundy Scalloped Corset With Drape Skirt" belong to Loomière? What is the complete piece count at launch? Do we launch together or stagger?
4. **Where are the shoot images**, and in what state (edited, unedited, RAW)? Do they follow the 3000 x 4000 portrait standard, or are some landscape or other ratios (which change what the hero, card and insert can use)?
5. **Is the name spelled and styled "Loomière"** (Title Case with the accent) everywhere, and do you approve changing the Admin title from "LOOMIÈRE"? Does the name have an origin story I should use?
6. **Prices and lead times**, per piece and for the facts strip.
7. **Homepage directory:** A1 (six cards, 3 x 2), A2 (swap) or A3 (leave it off)? ~~Replace FirstLove?~~ Answered 2026-10-19: no, FirstLove stays as the "Introducing" block. New question: how long should Loomière hold a hero slide (see Section 8, decision H4)?
8. **Who is Loomière for?** The brief says festive. Is it also positioned as a bridal-party and family collection (bridesmaids, mothers, sisters), or festive-only? That decides how much wedding language I use.
9. **Customisation:** can colours or fabrics be changed on Loomière pieces, or is each look fixed? This changes the concierge copy and the product notes.
10. **Wishlist, email and social:** do you want an Inner Circle (newsletter) preview to subscribers before public launch? That is a content decision for the marketing side; flagging only so we do not forget it. No popup, no countdown.
11. **Existing live nav and footer menu:** can you confirm the Admin menu `footer-collections` exists and has content? Technical Director will check, but you may know.

---

## 5. For Technical Director (feasibility notes, pre-build)

- New `templates/collection.loomiere.json` cloned from `collection.bloom-soiree.json`; set `hero_image`, `intro_copy`, `silhouettes`, `lead_time`, `price_range_display`, `sizing_note` and `insert_image` in section settings. Confirm the `insert_image` and hero image pickers work from a hand-written JSON template; Shopify image-picker values must use `shopify://shop_images/<filename>` after the file is uploaded to Admin > Content > Files. This pattern is already used in `templates/collection.json`.
- Assigning the template (templateSuffix `loomiere`) is an Admin action on the collection.
- Directory section: `limit: 5` and `repeat(5, 1fr)` in `assets/ka-collections-directory.css`. Required only for Decision A1.
- `ka-collection-cross-link` handle list: add `loomiere` (optional).
- `ka-collections-list`: `list-collections.json` uses explicit collection handles in blocks; adding `loomiere` there is JSON-only. Image fallback uses `collection.image` first (confirm).
- Refine bar behaviour with zero or few chips on a small collection, and grid editorial insert when there are fewer than 7 pieces: please verify.
- All hard-coded `case handle` image lookups would need a new branch **only** if we skip the settings-based images. Do not add them; use settings so content stays editable without code.
- Platform limit worth noting: none that blocks this plan. Everything above is within Liquid and JSON templates. There is no scheduled go-live inside the theme, so launch timing is a manual publish step; avoid planning a "reveal at midnight" unless Suraj does it manually.
- Estimated build complexity: **simple** (template clone, settings, content). Directory 3 x 2 change: **simple to moderate**.

---

## 6. Scorecard-lite on the current Loomière state (what exists today)
Emotional read of `/collections/loomiere` as it stands: **Confusion / Indifference** (an empty page with no hero image and the placeholder intro text). It should not be publicly reachable until it is dressed. After launch, the target emotion is **Desire**, with **Confidence** for the family shopper.

---

## 8. Hero slider (added 2026-10-19)

**Prototype:** `Prototypes/homepage-hero-slider-v1.html` (open in a browser; Desktop/Mobile switcher, one-slide degrade toggle, overlay toggle for slide 2). Its CSS block "PART 2" is the proposed production `assets/ka-hero.css`, and "PART 4" the proposed `assets/ka-hero.js`. Slide 1 is the live hero exactly (same image file, copy, CTAs). Slide 2 is a labelled placeholder frame with drafted copy: no photograph exists yet.

### 8.1 Design decisions (and why a luxury house would make them)

| Question | Decision | Rationale |
|---|---|---|
| Transition | **Slow cross-fade, 1.4 s**, soft ease. Incoming image settles from 1.05 to 1.0 scale over 2.2 s (the same breath the hero has on first load). Outgoing text fades in 0.5 s; incoming text re-uses the existing fadeUp stagger, starting sooner (0.5 s / 0.7 / 0.95 / 1.2 s) because the image is already arriving. | No sliding, no drag-following, no carousel mechanics: those read as a retail banner. A dissolve reads as a film cut. It also reuses the motion the hero already has. |
| Autoplay | **Yes, slowly: 8 s per slide, one pass only.** Slide 1 plays, slide 2 plays, then it returns to slide 1 and rests there for good. Autoplay also ends permanently the moment the visitor uses an arrow, tick or swipe. | Two slides is a reveal, not a loop. The house always ends on itself ("Bridal Couture"). A restless loop cheapens the first screen; a static first screen would hide Loomière from most visitors. 8 s lets the text finish its entrance (about 2.6 s) and be read. |
| Pause rules | Paused while the pointer is over the text or controls (mouse only), while anything in the hero has keyboard focus, while the tab is hidden, and while less than 40% of the hero is on screen. A visible **Pause / Play** control is always present (WCAG 2.2.2). | Never moves the CTA the visitor is about to click. |
| Reduced motion | `prefers-reduced-motion`: **no autoplay**, no zoom, no fade-up (text simply present), cross-fade shortened to instant. Arrows, ticks and swipe still work. Pause button hidden because nothing moves. | Accessibility and calm. |
| Controls | **Bottom left, a quiet counter and two hairline ticks**: `01 / 02  ---- ----  PAUSE`. The current tick fills left to right over the 8 s as the progress marker (1 px line, white). On desktop, two thin chevrons appear at mid-height left and right **only on hover or keyboard focus**. No dots, no big arrows, no coloured buttons. Scroll cue stays bottom right, unchanged. | Dior-style hairlines: information without ornament. Bottom-left is the free corner (content sits above it, scroll cue is right). |
| Mobile | **Swipe** left or right (48 px threshold, horizontal intent only; vertical scroll stays native). Arrows hidden. Ticks (34 px wide, 30 px tall hit area) and Pause remain. A swipe advances with the same cross-fade; it does not drag the image. | Touch convention without a gimmick. |
| Legibility | White text always, over the existing bottom gradient. Each slide has an **Overlay strength** setting: Soft / Standard (today's gradient, default) / Deep (adds a left-edge scrim and a darker base). A light photograph such as slide 1 uses Standard; a pale or busy one uses Deep. Image focal point (set by the editor in the image picker) drives `object-position`, defaulting to today's `center 20%`. No text-shadow, no boxes behind text. | One rule across slides, tuned per photograph, never a different typographic treatment. |
| LCP / first paint | **Slide 1 image is the LCP**: `loading="eager"`, `fetchpriority="high"`, sized via srcset, identical to today. Slide 2+ images are not in the initial HTML as `src`; they are hydrated from `data-srcset` after `window.load` (so they can never compete with slide 1) and autoplay starts only after `load`. Cross-fade never reveals an unloaded image: slide 2 is only activated once its image has `complete` (otherwise it waits, and autoplay skips ahead to resting on slide 1). | Slider must not slow the first impression. Because slide 1 is exactly today's hero, LCP is unchanged. |
| One slide | With one slide (or all others blank) the section renders **today's hero**: no controls, no wrapper roles, no JS timers or listeners, no extra requests. Pure fallback, also what no-JS visitors get (slide 2 simply stays hidden). | A feature that disappears gracefully, and a safe rollback: remove the Loomière block after the season and the page is the original. |
| Headings | First slide's title is the page `<h1>`; later slides use `<h2>` styled identically. | One h1 per page for SEO and screen readers. |
| Slide order | Prototype shows today's hero first (as briefed). **Open decision H1.** | See Section 8.5. |

### 8.2 Slide 2 copy (house voice, no urgency)
- Eyebrow: `Introducing`
- Title line 1 (italic): `Loomière`
- Title line 2 (roman, small): `The Festive Collection`
- Subtitle: `Rich textures, fluid drapes and a little shimmer. Handwoven brocades, sculpted corsets and draped skirts, made to order in Mumbai.`
- Primary CTA: `Explore Loomière` to `/collections/loomiere`
- Secondary CTA: `Book a Styling Appointment` (same temporary WhatsApp routing as slide 1; see feasibility note 3)
- Alt text of image: written when the photograph exists, describes the garment, not the mood.

### 8.3 Build specification (platform-agnostic, then Shopify notes)

**Component: Hero slider (replaces `ka-hero`)**
1. Section wrapper (full viewport height, `100svh`, min 600 px, overflow hidden, dark ground `#1D1916` behind slides).
2. Slides container (carries the desktop parallax, translateY at 0.22 x scroll, only at 900 px and up, and not under reduced motion).
3. Slide (one per block, stacked absolutely): background image, overlay, content (eyebrow, title, subtitle, two CTAs).
4. Controls (rendered only if more than one slide): counter, ticks, pause/play, desktop arrows, visually hidden live region.
5. Scroll cue (unchanged).

**Behaviour**: as Section 8.1 and the prototype JS. Key rules: autoplay dwell is a section setting (6 to 12 s, default 8); the progress tick's `animationend` is the timer, so pausing is simply pausing the animation; one pass then rest on slide 1; manual action ends autoplay; entry zoom (`.loaded`) is applied per slide when activated and removed when it leaves; keyboard left/right arrows move slides while focus is inside the hero; inactive slides get `inert` and `aria-hidden`; slides use `role="group"`, `aria-roledescription="slide"`, `aria-label="n of N"`; the container is `role="region" aria-roledescription="carousel"`; the live region is `off` while autoplaying and `polite` once resting or manual.

**Section settings (global)**
| id | type | label (max 25 chars shown in editor is not limited, schema NAMES are) | default |
|---|---|---|---|
| `autoplay` | checkbox | Autoplay (one pass) | true |
| `dwell` | range 6 to 12 step 1, unit s | Seconds per slide | 8 |

**Block type `slide`, max 4 blocks** (a hard cap in the schema, so an editor cannot build a banner carousel; recommended in practice: 2, never above 3). Block name: `Slide` (5 chars). Per-slide settings:
| id | type | label | notes |
|---|---|---|---|
| `image` | image_picker | Desktop image | required for the slide; 2400 x 1500 recommended |
| `image_mobile` | image_picker | Mobile image | optional; 1080 x 1620. If blank, desktop image is used with its focal point |
| `overlay` | select: soft / standard / deep | Overlay strength | default standard |
| `eyebrow` | text | Eyebrow | |
| `title_line1` | text | Title line 1 (italic) | |
| `title_line2` | text | Title line 2 (roman) | |
| `subtitle` | textarea | Subtitle | |
| `cta_primary_label` | text | Primary CTA label | |
| `cta_primary_url` | url | Primary CTA link | **no default** |
| `cta_secondary_label` | text | Secondary CTA label | blank hides the CTA |
| `cta_secondary_url` | url | Secondary CTA link | **no default** |
| `appt_whatsapp` | checkbox | Secondary opens WhatsApp | true while no booking page exists; keeps the `data-ka-appt-link` interception from `ka-nav.liquid` per slide |

Schema naming (CLAUDE.md rules): section name `Hero` (unchanged, 4 chars) or `Hero slider` (11); block name `Slide`; preset name `Hero`; every name at or under 25 characters; **no `default` key on either `url` setting**. Setting labels are not subject to the 25 character limit as far as known, but keep them short anyway.

**Migration:** the existing single-image settings (`hero_image`, `eyebrow`, `title_line1/2`, `subtitle`, CTA pairs) currently feed `templates/index.json`. Technical Director to move them into block 1 in the template JSON so the live page does not change on deploy. Also keep section-level fallback rendering for the case where the section has zero blocks (old data), so a half-migrated state still shows today's hero.

**Image sizes (render via Shopify `image_url` with srcset)**
| | Desktop | Mobile |
|---|---|---|
| Source upload | 2400 x 1500 (16:10), min 2000 px wide | 1080 x 1620 (2:3), min 900 px wide |
| srcset widths | 1200, 1800, 2400 | 540, 810, 1080 |
| sizes | `100vw` | `100vw` |
| Breakpoint | `min-width: 900px` desktop `<source>` | below 900 px mobile `<source>` |
| Safe zones | Text sits bottom-left (about 900 px wide, lower 45%): keep the garment and face out of the lower-left quarter, or use Deep overlay | Text sits in the lower 45%: face and garment top at upper 55%. Keep important content within the central 80% (focal crop) |
| Weight target | under 350 KB at 1800 wide | under 180 KB at 810 wide |
| Alt | per image, required | inherits |
Slide 1 existing image is 1800 x 1276 (aspect 1.41), so it is served as today. Optionally upload a 2:3 portrait crop from the same shoot for mobile: the current landscape image crops hard on a phone (see prototype mobile view), which is acceptable today but not ideal.

**Shopify-platform feasibility notes (one line each, for Technical Director)**
1. Blocks with image_picker and a `max_blocks` cap are standard. Focal point: `image.presentation.focal_point` is available when set in the editor; verify it appears for `image_picker` settings and fall back to `center 20%` if not.
2. Deferred hydration of slide 2+ uses a plain `data-srcset` swap in JS. No platform issue. `<noscript>` shows only slide 1, which is the desired no-JS state.
3. The secondary CTA WhatsApp interception (`data-ka-appt-link`, delegated handler in `ka-nav.liquid`) currently targets one link per section; confirm the handler is delegated sitewide (it is described as delegated) so cloned links inside slide blocks work.
4. Theme editor: the existing `Shopify.designMode` branch in `ka-theme.js` skips reveal animations. In design mode, the slider should stop autoplay and show the block being edited (listen to `shopify:block:select`) so editors can see each slide; otherwise editing slide 2 is impossible.
5. Parallax currently targets `.ka-hero__bg` in `ka-theme.js`; it moves to `.ka-hero__slides`. Remove the old handler to avoid double motion.
6. No server-side logic needed anywhere; no scheduled go-live. Taking Loomière off the hero after the season is manual (remove or hide the block). Do not rely on a date-based auto-expiry (not possible in Liquid without a manual edit; theme cannot read "today" reliably for caching reasons).

**Build complexity:** moderate (new schema with blocks plus migration, about 150 lines of JS, CSS revision, editor-mode handling). Design risk low because slide 1 is unchanged.

### 8.4 Luxury review (what I rejected)
Dots as big pills, arrows always visible, slide-in or Ken Burns pan between slides, autoplay faster than 6 s, looping forever, text boxes or colour plates behind copy, a "NEW" tag or countdown on the slide, a third slide for generic promotion, and any sale or urgency copy.

### 8.5 Decisions for Suraj
- **H1. Slide order during launch.** Prototype has the current hero first (as you specified). My recommendation: for the first 2 to 3 weeks, put **Loomière first** (it is the news, and the LCP image becomes the Loomière photograph, so it must be properly optimised), then swap back. Either order works technically; only the block order changes.
- **H2. Slide 2 photograph.** Which frame, and does it work with text at bottom-left (see safe zones)? Needs a desktop crop and a mobile crop; I will review once supplied.
- **H3. Slide 1 mobile image.** Optional portrait crop of the current red lehenga shot for phones (otherwise the landscape is cropped by the browser).
- **H4. Duration.** How long does Loomière hold a hero slide before returning to a single hero? (Suggest one season, removed by hand.)
- **H5. Eight seconds per slide.** Comfortable default; say if you want it slower.
- **H6. Slide 2 secondary CTA.** Keep "Book a Styling Appointment", or leave it off so Loomière has one decisive action?

---

## 9. Next step
On Suraj's answers to Questions 2, 3, 4 and 7, and receipt of the images, I will (1) review the photography against the standard, (2) build the HTML prototype of the Loomière collection page and homepage block, and (3) issue the build specification for Technical Director after approval.

---

## 10. SEO & Discoverability review (2026-10-19) -- for Creative Director to adopt or adjust in the photo pass

- **SEO title:** suggest `Loomière Brocade Corsets | K&A by Karishma and Ashita` (53) instead of the draft. Reason: "Loomière" is a new name nobody searches yet, "brocade corset" is the term every candidate piece uses, and the `| K&A by Karishma and Ashita` suffix matches the other capsules (Bloom Soirée, Chamakk). Re-pick the keyword if the final pieces aren't mostly brocade.
- **Meta description:** the draft is fine. Optional: `Loomière by K&A: handwoven brocade corsets and fluid drape skirts in solid colour, finished with statement tassels. Festive couture, made to order in Mumbai.` (157)
- **Collection image alt text:** describe the image, not just the name, e.g. "Model in a burgundy scalloped brocade corset with drape skirt, Loomière collection". SEO will write the final per-image alt text once the photos exist.
- **Handle `loomiere` (no accent) and the Title Case "Loomière" title:** agreed.
- **Festival names** (Karva Chauth, Diwali) belong in product descriptions, not headlines: agreed.
- **Empty public page:** SEO would unpublish it until launch (empty, crawlable, in the sitemap, no SEO title). Suraj decided 2026-10-19 to leave it as is.
- **Candidate pieces found 2026-10-19 (DRAFT, not yet in the collection, unconfirmed):** Rust Orange, Navy (flared), Rose, Metallic Lavender Brocade Corsets with Drape Skirt (2026-08-29); Metallic Emerald Brocade Corset with Drape Saree (2026-09-05); Snow White Corset with Drape Skirt & Stole and Burgundy Scalloped Corset with Drape Skirt (2026-10-15).
