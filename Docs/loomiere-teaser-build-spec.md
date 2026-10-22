# Loomière teaser: build spec for Technical Director

**Author:** Creative Director · **Date:** 2026-10-22 · **Status:** Prototype ready for Suraj's pick (headline A or B, name styling). No theme files touched.
**Prototype:** `Docs/prototypes/loomiere-teaser/index.html` (open it; the control bar bottom-right toggles headline A/B, teaser/live state, and the backup photos; add `?clean=1` to hide the bar, `?v=b`, `?s=live`, `?i=b`, `?p=b` to preset).
**Screenshots:** `Docs/review-assets/loomiere-teaser/contact-sheet.png` plus the individual PNGs (1470x771, 390x844, 430x932, 390x660). Captured in Chrome only; Safari check by Suraj/QA is still needed.

## 1. What it is, and where it goes

Temporary. Two pieces, one essential.

| Piece | Essential? | What |
|---|---|---|
| **A. Homepage hero takeover** | **Yes** | While the teaser is on, a new section `ka-loomiere-teaser` renders in the hero's position and the existing `ka-hero` does not render. Single full-viewport frame, one photo, one message, one soft CTA. |
| **B. Utility-bar phrase** | Optional, zero code | Set the existing nav setting `utility_1` to "Loomière, launching soon" so visitors who land on a product or collection page from Instagram still see it. Content only. Restore the old `utility_1` ("Complimentary Worldwide Delivery") when the teaser comes down. |

Not recommended: a popup, a separate holding page, a new announcement-bar component, a nav entry. The homepage is where Instagram sends people; the hero is the one place that feels like a launch rather than a banner.

Why a takeover and not a slide: the two-slide hero slider (prototype `Prototypes/homepage-hero-slider-v1.html`) is not built in the theme. Building a slider for a temporary message is wrong. The teaser simply takes the hero's place and the rest of the homepage is unchanged below it.

## 2. States and how it comes down

One setting, three values. Put the settings in **theme settings** (`config/settings_schema.json`, new group "Loomière teaser") so `ka-hero`, the teaser section and the optional utility phrase all read the same switch. A hero-section-only setting would not reach `ka-hero`.

| `loomiere_state` | Homepage |
|---|---|
| **Off** (default after takedown) | `ka-hero` renders as today. Teaser section renders nothing. |
| **Teaser** | Teaser renders; `ka-hero` does not. CTA = WhatsApp appointment enquiry. |
| **Live** | Teaser renders; `ka-hero` does not. Headline = `headline_live`, CTA = "Explore the collection" to `/collections/loomiere`. |

Guard: if state is Live but `collections['loomiere'].products_count == 0` (or the collection is missing), behave as Teaser. This prevents a link to an empty page.

Handover to the real collection: flip the one setting to Live once the collection has published products. Then, when the launch has settled, set Off and the normal hero returns. The teaser section can stay in the theme dormant; or TD deletes it later. When Live, the collection should also be added to the footer menu and the cross-link list per `loomiere-launch-creative-brief.md`; that is separate from this spec.

Implementation of "ka-hero does not render": in `sections/ka-hero.liquid` wrap the body in `{% unless settings.loomiere_state != 'off' and settings.loomiere_state != blank %}`. Teaser section: `{% if settings.loomiere_state == 'off' or blank %}{% else %}...{% endif %}`. Default value of the setting must be **Off** in the schema, so merging to Live never shows the teaser by accident; Suraj/TD flips it on in the editor at launch.

Flag for TD: `index.json` section order must keep `ka-loomiere-teaser` directly above `ka-hero` (or in its place), and the transparent-over-hero nav treatment (utility bar 34px, nav 64px) must work with the new section exactly as with `ka-hero`. The nav has no scroll listener per its own comment, so this should need no change; please confirm.

## 3. Settings

All under one theme-settings group, "Loomière teaser".

| id | Type | Default | Notes |
|---|---|---|---|
| `loomiere_state` | select: off / teaser / live | **off** | The on/off switch and the handover. |
| `loomiere_eyebrow` | text | `Karishma & Ashita · Mumbai, India` | Hidden on phones by design. |
| `loomiere_headline_teaser` | text | `Launching soon` | Alternative Suraj may pick: `Introducing`. Shown above the name. |
| `loomiere_headline_live` | text | `Introducing` | Used in Live state. |
| `loomiere_name` | text | `Loomière` | The large name; this is the H1. Styling (italic vs roman, caps) pending with Suraj: the default is the prototype's Cormorant italic. Keep the name in the setting so spelling/case can change without code. Note: collection title is being changed from "LOOMIÈRE" to "Loomière" in Admin. |
| `loomiere_line` | text | `Rich textures. Fluid drapes. Playful shimmer.` | |
| `loomiere_cta_teaser` | text | `Book a styling appointment to see it first` | Appointment wording, per Suraj. Do not add or reference any walk-ins line from the Visit page. |
| `loomiere_cta_live` | text | `Explore the collection` | |
| `loomiere_more_label` | text | `Explore our collections` | Quiet link; hidden on short phones. |
| `loomiere_more_url` | url (no default, per schema rule) | blank, falls back to `/collections` in Liquid | |
| `loomiere_image_desktop` | image_picker | none; fallback `assets/loomiere-teaser-desktop.jpg` | **Setting, not hard-coded** (Suraj: the Instagram intro-video cover frame arrives later and will replace it). |
| `loomiere_image_phone` | image_picker | none; fallback `assets/loomiere-teaser-phone.jpg` | Same. |
| `loomiere_focal_desktop` | select: preset "70% 88%" (default), "50% 12%", "50% 50%", "30% 50%", "70% 50%" | 70% 88% | Written as CSS `--fx`/`--fy`. Keep as two selects (x: 30/50/70, y: 12/50/88) if easier. |
| `loomiere_focal_phone` | select, same pattern | x 52%, y 0% | Written as `--pfx`/`--pfy`. |
| `loomiere_alt_desktop` / `loomiere_alt_phone` | text | `A model in a crimson couture gown by Karishma & Ashita, reclining, in warm studio light` / `A model in a fuchsia couture corset and drape skirt by Karishma & Ashita` | Alt text with each photo swap. |

Cover-frame swap: when the video cover arrives, upload it, pick it in both image settings (or only the one that suits), adjust focal selects, and update alt. If the cover frame is a different composition, text placement may need a check; the desktop text sits top-left over empty backdrop and the phone text sits in a separate panel, so a swap of any similar studio frame is safe. A frame with a face in the top-left will collide with the text; then choose focal "70% 50%" or tell CD.

No prices, no dates, no piece names anywhere. Do not add a countdown.

## 4. Copy (exact, defaults)

| Element | Teaser state | Live state |
|---|---|---|
| Eyebrow (desktop only) | Karishma & Ashita · Mumbai, India | same |
| Headline above name | **A: Launching soon** / **B: Introducing** (Suraj to pick; default A) | Introducing |
| Name (H1) | Loomière | Loomière |
| Line | Rich textures. Fluid drapes. Playful shimmer. | same |
| CTA | Book a styling appointment to see it first | Explore the collection |
| Quiet link | Explore our collections | same |
| Utility bar phrase (optional) | Loomière, launching soon | Loomière, now at Karishma & Ashita |
| Browser tab / meta | Leave the homepage meta as is. Do not change the `<title>`. | |

CTA link (teaser state), same pattern as the existing hero appointment link in `ka-hero.liquid`:

```
https://wa.me/{{ settings.whatsapp_number }}?text={{ "Hello K&A, I'd like to book a styling appointment to see Loomière first" | url_encode }}
```
with `target="_blank" rel="noopener" data-ka-enquiry="appointment" data-ka-placement="home-loomiere-teaser"`. `settings.whatsapp_number` is 919967543087. In the prefill text use the name setting rather than the literal word, so a changed spelling follows. In Live state the CTA is a plain internal link to `/collections/loomiere` with no `data-ka-enquiry` attribute.

Location rule: the only location mention is "Mumbai, India". No Santacruz (it is not a postal address).

## 5. Component breakdown and behaviour

`sections/ka-loomiere-teaser.liquid` + `assets/ka-loomiere-teaser.css` (CSS scoped to `.lt`). Complexity: **simple**. No new JS.

Markup order: `section.lt` > `.lt__media` (`<picture>`: `<source media="(max-width:700px)">` phone image, `<img>` desktop image) > `.lt__scrim` > `.lt__content` (eyebrow p, kicker p, `h1.lt__name`, line p, CTA a, more a). The prototype's CSS is the reference; copy it. Tokens are all existing (`--f-display` Cormorant Garamond, `--f-sans` Jost, `--c-charcoal-2`, `--ease-luxury`); the only new value is the gold kicker colour `#D9BE8C`, used only here (it is a lightened `--c-rosegold` for contrast on the photo). No new fonts.

Desktop (>700px): full-bleed image, `height:100svh`, `min-height:560px`, `object-fit:cover` with the focal point from settings. Text block top-left, left-aligned, max-width `min(560px,46vw)`, starting 34px + 64px + clamp(40px,10vh,110px) from the top (below the utility bar and nav). Soft left-to-right scrim only; no heavy overlay. At 1470x771 the model sits bottom-right and the text sits in empty backdrop: no overlap (see screenshots).

Phones (<=700px): the image sits on top; below it a charcoal panel carries the text, so the garment is never covered. Image is `flex:1 1 auto; min-height:0` in a flex column with an explicit viewport height. Panel is centred text. Eyebrow hidden. At `max-height:720px` (Instagram in-app 390x660) name is 3.1rem and the quiet link is hidden. Panel respects `env(safe-area-inset-bottom)`.

Motion: staggered fadeUp (eyebrow, headline, name, line, CTA, link) and a 2.4s image settle (scale 1.04 to 1), same easing as the existing hero. `prefers-reduced-motion`: everything static. No parallax, no autoplay video.

Safari-safe: no `aspect-ratio` anywhere; the image is absolutely positioned inside a container that has an explicit height (desktop) or flex height (phone); no grid. CTA underline is a border, not a pseudo-element with a percentage height. TD to run the 1470x771 Safari check and also WebKit on iOS (390x844, 430x932, 390x660). `100svh` has a `100vh` fallback.

## 6. Photos (images needed)

Chosen after viewing full-size 2400px downloads. Both are K&A's own Loomière edits.

| Use | Frame | Why | Crop / focal |
|---|---|---|---|
| Desktop hero | **KA0184 1** (crimson, reclining, landscape 4:3, 2400x1800) | The only frame with real empty backdrop for text, the face is sharp and the whole dress and jewellery are in view. Face and outfit together. Cinematic, calm. | `object-position: 70% 88%` at 1470x771 (shows from about 30% of the height down; the face is at about x 78%, y 60%). On 16:10 and 16:9 screens the same focal works. |
| Phone hero | **KA0600** (fuchsia cage corset, drape in motion, 3:4) | Clear face with headroom, corset, drape and the movement all in one frame; sits well above a text panel. | Phone container is about 3:4 to 1:1 depending on height; `object-position: 52% 0%`. On 390x660 the hem is cropped at the skirt, face and corset fully visible. |
| Backup desktop | KA1035 (chocolate + emerald pair) | Beautiful but the two figures fill the left half, so the left-aligned text collides with the chocolate figure (see `alt-chocolate-1470x771.png`). Use only with a right-aligned text variant; not built. | `50% 12%` |
| Backup phone | KA0151 (gold) | Strong, but the head sits tight to the top edge and the eyes are closed; less direct than KA0600. | `40% 6%` |

Not used: KA0127 (two-model, needs backdrop extension), KA0911 (same), KA0595 (figure too small on a phone), KA0722 (red, feet and hem dominate), KA0986 (not needed).

### Upload list (Drive id to Shopify Files)

High-resolution source per Suraj's note: `curl -sL "https://drive.google.com/thumbnail?id=<ID>&sz=w2400" -o <file>`. Full-size downloads are saved already in `Docs/review-assets/loomiere-teaser/`. Export at 2400 px long edge, JPEG quality about 82, under about 450 KB. Prototype copies (2000 / 1800 px) are in `Docs/prototypes/loomiere-teaser/img/`.

| Drive id | Source file | Shopify Files filename | Use |
|---|---|---|---|
| `1hfdb-aJttLLLlMeOyM8llC4SlcfNPemR` | KA0184 1.jpg | `loomiere-teaser-desktop-crimson.jpg` | `loomiere_image_desktop` |
| `16GjZErJ3KEjQwGX8118UMNSrqjh2Sanc` | KA0600.jpg | `loomiere-teaser-phone-fuchsia.jpg` | `loomiere_image_phone` |
| `1bUhRJtSI1Ny4XrV3KobVQedyAyPxNgWp` | KA1035.jpg | `loomiere-teaser-desktop-alt-chocolate-emerald.jpg` | backup only |
| `10jEzNj3fuIVPT2mnYInWNY3ZgxB5h7R-` | KA0151.jpg | `loomiere-teaser-phone-alt-gold.jpg` | backup only |

Also commit the two primary files as `assets/loomiere-teaser-desktop.jpg` and `assets/loomiere-teaser-phone.jpg` as the fallback, so the section works before anyone picks an image. Note: the source filename "KA0184 1" has a space; use the hyphenated names above. Do not retouch or regenerate; garment fidelity is unchanged.

## 7. Platform feasibility flags (one line each)

- Theme settings accept `image_picker`, `select`, `text`, `url`; all used here are supported. `url` settings cannot carry a `default` (known silent-drop), so the "explore" link falls back in Liquid.
- Schema `name` fields must be 25 characters or fewer; suggested group name "Loomière teaser" is fine.
- A settings-driven `ka-hero` suppression means the homepage `<h1>` moves to the teaser while it is on; that is intended (name as H1). No SEO change beyond that for a few days.
- WhatsApp click tracking relies on `data-ka-enquiry` / `data-ka-placement`; the new placement `home-loomiere-teaser` must be registered wherever placements are listed in the tracking doc (`Docs/enquiry-tracking-custom-pixel.md`) if it is whitelisted.
- The teaser state needs no Shopify collection. The live switch needs the `loomiere` collection to have published products; the guard in section 2 handles an empty collection.

## 8. Complexity and impact

- Build: **simple** (one section, one CSS file, one global settings group, one conditional in `ka-hero`). The settings group is the largest part.
- Expected impact: Instagram arrivals see Loomière at once; appointment-led WhatsApp enquiries are captured with their own placement tag; the page stays calm, one message, no urgency language.
- Priority: High, needed the day the Instagram video posts.

## 9. Open questions for Suraj

1. Headline: A "Launching soon" or B "Introducing" (both in prototype; one setting).
2. Name styling: Cormorant italic (default, matches the hero) or roman/caps.
3. Whether to also use the utility-bar phrase on other pages.
