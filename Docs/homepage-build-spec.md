# K&A Homepage — Build Specification
**Document version:** 1.0
**Date:** 29 June 2026
**Prototype source:** `Prototypes/homepage-v2.html`
**Status:** Approved by Creative Director — ready for Technical Director implementation

---

## 1. Design Tokens

All tokens live in `:root`. Technical Director should define these as a single global CSS file (e.g. `assets/tokens.css`) loaded by the theme layout, so every section inherits them without repetition.

### Colour Tokens

| Token | Value | Purpose |
|---|---|---|
| `--c-paper` | `#F8F4EF` | Primary page background (warm ecru) |
| `--c-paper-deep` | `#F0EAE1` | Secondary background — collection story right panel, lookbook text column |
| `--c-smoke` | `#EDE7DD` | Available; not used directly in homepage but part of the system |
| `--c-charcoal` | `#1A1714` | Near-black — product badges, dark section backgrounds, footer |
| `--c-charcoal-2` | `#2C2825` | Slightly lighter dark — Collections Directory background, Newsletter background |
| `--c-ink` | `#3D3730` | Body text default |
| `--c-ink-mid` | `#6B6259` | Secondary body text — collection story body, lookbook body |
| `--c-ink-muted` | `#9A9088` | Muted text — eyebrows on light ground, product fabric labels |
| `--c-rosegold` | `#C4A882` | Primary accent — voice-card quote mark, celebrity attribution, collection card arrow, newsletter submit, footer social hover |
| `--c-rosegold-2` | `#A8896A` | Deeper accent — eyebrow on light ground, btn-dark hover, product action link |
| `--c-rosegold-pale` | `#DDD0BC` | Hairline decorative rules — manifesto before/after, btn-dark border at rest |

### Line Tokens

| Token | Value | Purpose |
|---|---|---|
| `--line` | `rgba(26,23,20,0.10)` | Subtle dividers on light backgrounds — nav border after scroll |
| `--line-strong` | `rgba(26,23,20,0.18)` | Stronger dividers on light — nav WhatsApp button border when scrolled |
| `--line-light` | `rgba(196,168,130,0.25)` | Available in system |
| `--line-on-dark` | `rgba(196,168,130,0.20)` | Divider lines on dark grounds — voices section top rule, voices grid background, craft strip borders, voice card meta border, footer top border |

### Typography Tokens

| Token | Value | Purpose |
|---|---|---|
| `--f-display` | `'Bodoni Moda', Didot, 'Times New Roman', serif` | All headlines, display text, quote marks, logo wordmarks |
| `--f-sans` | `'Jost', 'Helvetica Neue', Arial, sans-serif` | All body text, navigation, labels, captions, CTAs |

**Google Fonts load string (exact):**
```
https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500&family=Jost:wght@200;300;400;500&display=swap
```
Both families must be preconnected before the stylesheet link:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### Type Scale Tokens

| Token | Value | Purpose |
|---|---|---|
| `--t-hero` | `clamp(3.6rem, 8vw, 8rem)` | Hero H1 |
| `--t-display` | `clamp(2.6rem, 5.5vw, 5.2rem)` | Collection story H2, Appointment H2 |
| `--t-h2` | `clamp(2rem, 3.5vw, 3.2rem)` | Bestsellers H2, Voices H2, Collections Dir H2, Newsletter H2, Client Diaries H2 |
| `--t-h3` | `clamp(1.4rem, 2.2vw, 2rem)` | Lookbook CTA title |
| `--t-eyebrow` | `0.66rem` | All `.eyebrow` labels |
| `--t-body-l` | `1.1rem` | Collection story body paragraph |
| `--t-body` | `1rem` | General body (base) |
| `--t-caption` | `0.76rem` | Available in system; not used directly on homepage |

### Spacing Tokens

| Token | Value | Purpose |
|---|---|---|
| `--s-xs` | `8px` | Micro-spacing |
| `--s-sm` | `16px` | Small gaps |
| `--s-md` | `32px` | Medium gaps |
| `--s-lg` | `64px` | Section internal rhythm — between header and grid |
| `--s-xl` | `96px` | Larger section padding |
| `--s-2xl` | `140px` | Primary section vertical padding (reduced to `80px` at ≤600px) |
| `--s-3xl` | `200px` | Available in system |

### Layout Tokens

| Token | Value | Purpose |
|---|---|---|
| `--max-wide` | `1680px` | Maximum content container for bestsellers, craft strip, collections directory |
| `--max-text` | `720px` | Maximum text column width (available, referenced but not applied as class) |
| `--gutter` | `clamp(20px, 5vw, 80px)` | Horizontal padding applied to all sections |

### Motion Tokens

| Token | Value | Purpose |
|---|---|---|
| `--ease-luxury` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary luxury ease — image reveals, reveal translateY, hover arrow slides |
| `--ease-soft` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Secondary ease — nav transition |
| `--dur-slow` | `1s` | Reveal animation duration |
| `--dur-med` | `0.65s` | Hover underlines, image hover scale, mobile nav, lookbook overlay |
| `--dur-fast` | `0.35s` | Colour transitions on hover |

---

## 2. Typography System

### Display / Headline Styles

**Hero Title**
- Family: `var(--f-display)` (Bodoni Moda)
- Size: `var(--t-hero)` = `clamp(3.6rem, 8vw, 8rem)`
- Weight: 400
- Style: italic
- Line height: 0.94
- Letter spacing: -0.01em
- Used: Hero H1. The word "Bridal" renders as the italic portion; the `<strong>` child "Couture" renders at `font-size: 0.6em` of the parent, `font-style: normal`, `letter-spacing: 0.1em`, `display: block`

**Display Headline (large italic serif)**
- Family: `var(--f-display)`
- Size: `var(--t-display)` = `clamp(2.6rem, 5.5vw, 5.2rem)`
- Weight: 400
- Style: italic
- Line height: 1.02 (Collection Story), 1.05 (Appointment)
- Used: Collection Story H2 ("The Bloom Soirée"), Appointment H2 ("Begin with a Conversation.")

**Section H2**
- Family: `var(--f-display)`
- Size: `var(--t-h2)` = `clamp(2rem, 3.5vw, 3.2rem)`
- Weight: 400
- Style: normal (Bestsellers section header title); italic (Voices title, Collections Dir title, Newsletter title, Client Diaries title inline override)
- Line height: 1.05
- Used: Bestsellers ("Signature Pieces"), Voices ("The words of our brides."), Collections Directory ("Our Collections"), Newsletter ("Receive our Correspondence"), Client Diaries lookbook header

**Section H3 / Lookbook CTA**
- Family: `var(--f-display)`
- Size: `var(--t-h3)` = `clamp(1.4rem, 2.2vw, 2rem)`
- Weight: 400
- Style: italic
- Line height: 1.3
- Used: Lookbook CTA title ("Every bride becomes part of our diary.")

**Manifesto**
- Family: `var(--f-display)`
- Size: `clamp(1.6rem, 3.2vw, 3rem)` (inline on element; mobile override: `clamp(1.3rem, 5vw, 2.2rem)` at ≤900px)
- Weight: 400
- Style: italic
- Line height: 1.35
- Letter spacing: 0.01em
- Used: Manifesto quote paragraph

**Celebrity / Quote**
- Family: `var(--f-display)`
- Size: `clamp(1.6rem, 3.2vw, 2.8rem)`
- Weight: 400
- Style: italic
- Line height: 1.3
- Used: Celebrity section blockquote

**Product Card Name**
- Family: `var(--f-display)`
- Size: `clamp(1rem, 1.6vw, 1.4rem)`
- Weight: 400
- Style: italic
- Line height: 1.25
- Used: Bestsellers product card H3

**Voice Card Quote**
- Family: `var(--f-display)`
- Size: `clamp(1rem, 1.4vw, 1.25rem)`
- Weight: 400
- Style: italic
- Line height: 1.65
- Used: Social proof review quotes

**Voice Card Quote Mark**
- Family: `var(--f-display)`
- Size: `3.5rem`
- Weight: 400
- Style: normal (it is the `"` character rendered in Bodoni)
- Line height: 0.8
- Color: `var(--c-rosegold)`, opacity 0.6
- Used: Decorative opening quotation mark in voice cards

**Collection Card Name**
- Family: `var(--f-display)`
- Size: `clamp(1.3rem, 2.2vw, 1.9rem)`
- Weight: 400
- Style: italic
- Line height: 1.05
- Used: Collections Directory card titles

**Craft Strip Label**
- Family: `var(--f-display)`
- Size: `clamp(1rem, 2.2vw, 1.6rem)`
- Weight: 400
- Style: italic
- Used: "Handcrafted", "Made to Order", "Worldwide Delivery", "Concierge"

**Lookbook Caption Name**
- Family: `var(--f-display)`
- Size: `1.1rem`
- Weight: 400
- Style: italic
- Used: Hover caption on lookbook images

**Footer Logo**
- Family: `var(--f-display)`
- Size: `1.5rem`
- Weight: 400
- Style: normal
- Letter spacing: 0.12em
- Text transform: uppercase
- Used: Footer brand name "K&A by Karishma & Ashita"

**Footer Tagline**
- Family: `var(--f-display)`
- Style: italic
- Size: `0.92rem`
- Line height: 1.65
- Used: "Bridal couture, handcrafted in Mumbai."

### Sans-Serif / UI Styles

**Navigation Logo**
- Family: `var(--f-display)` — note this uses display, not sans
- Size: `clamp(1rem, 2vw, 1.25rem)`
- Weight: 400
- Letter spacing: 0.16em
- Text transform: uppercase
- Color: white (transparent nav), `var(--c-charcoal)` (scrolled)

**Navigation Links**
- Family: `var(--f-sans)`
- Size: `0.68rem`
- Weight: 400
- Letter spacing: 0.16em
- Text transform: uppercase
- Color: white (transparent nav), `var(--c-charcoal)` (scrolled)
- Hover: rose-gold underline animates from 0 to 100% width

**Navigation WhatsApp / Concierge Button**
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.16em
- Text transform: uppercase
- Border: `1px solid rgba(255,255,255,0.4)` at rest; `var(--line-strong)` when scrolled
- Padding: `8px 18px`

**Eyebrow Labels (`.eyebrow`)**
- Family: `var(--f-sans)`
- Size: `var(--t-eyebrow)` = `0.66rem`
- Weight: 400
- Letter spacing: 0.24em
- Text transform: uppercase
- Variants:
  - Default / `--muted`: color `var(--c-ink-muted)`
  - `--light`: color `var(--c-rosegold)`
  - `--on-dark`: color `var(--c-rosegold)`

**Hero Eyebrow**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Weight: 400
- Letter spacing: 0.28em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.65)`

**Hero Subtitle**
- Family: `var(--f-sans)`
- Size: `0.78rem`
- Weight: 300
- Letter spacing: 0.1em
- Line height: 1.9
- Color: `rgba(255,255,255,0.7)`

**Hero Scroll Indicator Label**
- Family: `var(--f-sans)`
- Size: `0.55rem`
- Letter spacing: 0.22em
- Text transform: uppercase
- Writing mode: `vertical-rl`
- Color: `rgba(255,255,255,0.45)`

**Button Ghost (`.btn-ghost`)** — used on hero
- Family: `var(--f-sans)`
- Size: `0.68rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Border: `1px solid rgba(255,255,255,0.55)`
- Padding: `14px 36px`
- Hover: `background: white; color: var(--c-charcoal); border-color: white`

**Button Text (`.btn-text`)** — used on hero
- Family: `var(--f-sans)`
- Size: `0.68rem`
- Weight: 400
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.75)` at rest
- Pseudo-after: `width: 32px; height: 1px; background: rgba(255,255,255,0.5)`
- Hover: color white, line extends to `52px`

**Button Dark (`.btn-dark`)** — used on collection story, lookbook
- Family: `var(--f-sans)`
- Size: `0.68rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Color: `var(--c-charcoal)`
- Border bottom: `1px solid var(--c-rosegold-pale)`; padding-bottom `6px`
- Pseudo-after: `content: '→'`
- Hover: `color: var(--c-rosegold-2); border-color: var(--c-rosegold-2)`; arrow translates `+6px` on X

**Section Header Link**
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `var(--c-ink-muted)` at rest, `var(--c-charcoal)` on hover
- Pseudo-after: `content: '→'`

**Product Card Fabric**
- Family: `var(--f-sans)`
- Size: `0.7rem`
- Weight: 300
- Color: `var(--c-ink-muted)`
- Letter spacing: 0.06em

**Product Card Price**
- Family: `var(--f-sans)`
- Size: `0.78rem`
- Weight: 300
- Color: `var(--c-ink-mid)`
- Letter spacing: 0.08em

**Product Card Action (hover reveal)**
- Family: `var(--f-sans)`
- Size: `0.6rem`
- Weight: 400
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `var(--c-rosegold-2)`

**Product Card Badge**
- Family: `var(--f-sans)`
- Size: `0.56rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Color: `var(--c-charcoal)`
- Background: `var(--c-paper)`
- Padding: `5px 12px`

**Manifesto Attribution**
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.24em
- Text transform: uppercase
- Color: `var(--c-ink-muted)`

**Collection Story Body**
- Family: `var(--f-sans)` (inherits body)
- Size: `var(--t-body-l)` = `1.1rem`
- Weight: 300
- Line height: 1.85
- Color: `var(--c-ink-mid)`

**Celebrity Attribution**
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.22em
- Text transform: uppercase
- Color: `var(--c-rosegold)`

**Lookbook Caption Garment**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Weight: 300
- Letter spacing: 0.14em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.7)`

**Lookbook CTA Body**
- Family: `var(--f-sans)`
- Size: `0.88rem`
- Weight: 300
- Line height: 1.9
- Color: `var(--c-ink-mid)`

**Voice Card Name**
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.5)`

**Voice Card Occasion**
- Family: `var(--f-sans)`
- Size: `0.62rem`
- Weight: 300
- Letter spacing: 0.1em
- Color: `var(--c-rosegold)`

**Voices Rating Number**
- Family: `var(--f-display)`
- Size: `clamp(2rem, 4vw, 3.6rem)`
- Weight: 400
- Color: white

**Voices Rating Label**
- Family: `var(--f-sans)`
- Size: `0.62rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Color: `var(--c-rosegold)`

**Button Outline Rose (`.btn-outline-rose`)** — voices section
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Color: `var(--c-rosegold)`
- Border: `1px solid rgba(196,168,130,0.4)`
- Padding: `14px 36px`
- Hover: `background: var(--c-rosegold); color: var(--c-charcoal); border-color: var(--c-rosegold)`

**Collection Card Number**
- Family: `var(--f-sans)`
- Size: `0.56rem`
- Weight: 400
- Letter spacing: 0.22em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.4)`

**Collection Card Arrow (hover)**
- Family: `var(--f-sans)`
- Size: `0.6rem`
- Weight: 400
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `var(--c-rosegold)`

**Craft Strip Sub-label**
- Family: `var(--f-sans)`
- Size: `0.62rem`
- Weight: 300
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.35)`

**Appointment Body**
- Family: `var(--f-sans)`
- Size: `0.88rem`
- Weight: 300
- Line height: 1.9
- Letter spacing: 0.02em
- Color: `rgba(255,255,255,0.7)`

**Appointment Divider ("or")**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Letter spacing: 0.1em
- Color: `rgba(255,255,255,0.3)`

**Button Outline White (`.btn-outline-white`)** — appointment
- Family: `var(--f-sans)`
- Size: `0.66rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Color: white
- Border: `1px solid rgba(255,255,255,0.45)`
- Padding: `14px 36px`
- Hover: `background: white; color: var(--c-charcoal); border-color: white`

**Newsletter Body**
- Family: `var(--f-sans)`
- Size: `0.82rem`
- Weight: 300
- Line height: 1.9
- Letter spacing: 0.04em
- Color: `rgba(255,255,255,0.5)`

**Newsletter Input**
- Family: `var(--f-sans)`
- Size: `0.82rem`
- Weight: 300
- Letter spacing: 0.06em
- Color: white
- Placeholder: `color: rgba(255,255,255,0.28); letter-spacing: 0.1em; font-size: 0.72rem; text-transform: uppercase`

**Newsletter Submit Button**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Weight: 400
- Letter spacing: 0.2em
- Text transform: uppercase
- Color: `var(--c-rosegold)` at rest, white on hover

**Newsletter Note**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Weight: 300
- Letter spacing: 0.1em
- Color: `rgba(255,255,255,0.2)`

**Footer Column Title**
- Family: `var(--f-sans)`
- Size: `0.6rem`
- Weight: 500
- Letter spacing: 0.24em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.35)`

**Footer Links**
- Family: `var(--f-sans)`
- Size: `0.78rem`
- Weight: 300
- Letter spacing: 0.04em
- Color: `rgba(255,255,255,0.5)` at rest, white on hover

**Footer Contact Items**
- Family: `var(--f-sans)`
- Size: `0.78rem`
- Weight: 300
- Line height: 1.8
- Letter spacing: 0.04em
- Color: `rgba(255,255,255,0.42)` at rest; links hover to `var(--c-rosegold)`

**Footer Social Links**
- Family: `var(--f-sans)`
- Size: `0.6rem`
- Weight: 400
- Letter spacing: 0.18em
- Text transform: uppercase
- Color: `rgba(255,255,255,0.35)` at rest, `var(--c-rosegold)` on hover

**Footer Copyright**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Weight: 300
- Letter spacing: 0.1em
- Color: `rgba(255,255,255,0.18)`

**Footer Legal Links**
- Family: `var(--f-sans)`
- Size: `0.63rem`
- Weight: 300
- Letter spacing: 0.1em
- Color: `rgba(255,255,255,0.18)` at rest, `rgba(255,255,255,0.5)` on hover

**Mobile Nav Links**
- Family: `var(--f-display)`
- Size: `clamp(1.6rem, 6vw, 2.6rem)`
- Weight: 400
- Style: italic
- Letter spacing: 0.02em
- Color: white at rest, `var(--c-rosegold)` on hover

**Mobile Nav Footer Text**
- Family: `var(--f-sans)`
- Size: `0.7rem`
- Weight: 300
- Letter spacing: 0.1em
- Color: `rgba(255,255,255,0.3)`

**Mobile Nav Footer Phone Link**
- Family: `var(--f-sans)`
- Size: `0.82rem`
- Weight: 300
- Letter spacing: 0.06em
- Color: `var(--c-rosegold)`

---

## 3. Section-by-Section Breakdown

### Section 1 — Navigation

**Purpose:** Fixed global navigation. Transparent over hero; crystallises on scroll.

**Background:**
- At rest: fully transparent (no background colour)
- Scrolled state (`.scrolled`): `background: rgba(248,244,239,0.96)` with `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter: blur(12px)`. Bottom border: `1px solid var(--line)`. This matches `--c-paper` at 96% opacity.

**Layout:**
- `position: fixed; top: 0; left: 0; right: 0; z-index: 100`
- `display: flex; align-items: center; justify-content: space-between`
- Padding at rest: `24px var(--gutter)`
- Padding scrolled: `16px var(--gutter)`

**Desktop structure (left to right):**
1. Left: `<ul class="nav__links">` — three links: Bestsellers, Collections, Client Diaries
2. Centre: `<a class="nav__logo">` — text "K&A"
3. Right: `<div class="nav__actions">` — Concierge link + hamburger toggle (toggle hidden on desktop)

**Text elements:**
- Logo: "K&A" — nav logo style
- Nav links: "Bestsellers" / "Collections" / "Client Diaries" — nav link style
- WhatsApp button label: "Concierge" — nav whatsapp style

**CTA links:**
- Logo: href `/` (homepage root)
- Bestsellers: `/collections/bestsellers` (TBD — confirm with client)
- Collections: `/collections` (TBD)
- Client Diaries: `/pages/client-diaries` (TBD)
- Concierge: `https://wa.me/919967543087` (target `_blank`)

**Interactive states:**
- Nav links: rose-gold underline (`background: var(--c-rosegold)`) animates from `width: 0` to `width: 100%` on hover, `var(--dur-med) var(--ease-luxury)`
- Logo and links shift from white to `var(--c-charcoal)` on `.scrolled`
- WhatsApp button: hover fills white / charcoal text (transparent); hover fills charcoal / white text (scrolled)
- Toggle icon: background shifts white to charcoal on `.scrolled`

**JS:** Scroll listener. `window.scrollY > 60` triggers `.scrolled` class. See Section 6 for full JS details.

**Shopify note:** The logo should use `{{ shop.name }}` or a custom SVG/logo metafield rather than hardcoded text. See Section 8.

---

### Section 2 — Hero

**Purpose:** Full-viewport opening editorial image with brand statement and CTAs. The page opens in darkness.

**Background:**
- Full-bleed image: `https://karishmaashita.com/cdn/shop/files/KARISHMA_ASHITA_1_JUNE_2025_0968.jpg?v=1751529035&width=1800`
- This is the live CDN URL from the existing Shopify store — it should be referenced as a Shopify `{{ section.settings.hero_image | image_url: width: 1800 }}` in the theme, not hardcoded.
- Image CSS filter: `filter: sepia(0.10) saturate(0.90) brightness(0.96)` applied inline on the `<img>`
- `object-position: center 20%`
- Gradient overlay: `linear-gradient(to bottom, rgba(15,12,10,0.22) 0%, rgba(15,12,10,0.05) 40%, rgba(15,12,10,0.62) 100%)`

**Layout:**
- `position: relative; height: 100svh; min-height: 600px; overflow: hidden`
- `.hero__bg`: `position: absolute; inset: 0` — contains the image
- `.hero__content`: `position: absolute; bottom: var(--s-2xl); left: var(--gutter); right: var(--gutter); max-width: 900px`
- `.hero__scroll`: `position: absolute; bottom: 36px; right: var(--gutter)`

**Text elements:**
- Eyebrow: "Mumbai — Est. in Craft"
- H1: "Bridal" (italic, main) + "Couture" (`<strong>` child — normal weight, `font-size: 0.6em` of parent, `letter-spacing: 0.1em`, `display: block`)
- Subtitle: "Made-to-order bridal wear — corsets, lehengas, Indo-Western — conceived in Mumbai and worn across the world."

**CTAs:**
- Primary: "Explore Collections" — `.btn-ghost` → `/collections` (TBD)
- Secondary: "Book a Styling Appointment" — `.btn-text` → `/pages/appointments` (TBD)
- Both rendered inside `.hero__ctas` as `<a>` elements

**Scroll indicator:**
- `.hero__scroll` contains a vertical "Scroll" text (writing-mode vertical-rl) and a 48px line (`height: 48px`) with an infinite animated white drop using `::after` pseudo-element. Animation: `scrollDrop 1.8s ease-in-out infinite`.

**Image animations:**
- Hero bg entry: starts at `transform: scale(1.05)`, transitions to `scale(1)` over `2.2s var(--ease-luxury)` when `.loaded` class is added (added via double `requestAnimationFrame` in JS)
- Desktop parallax: on scroll, `translateY(scrollY * 0.22)px` applied to `.hero__bg` (only when `min-width: 900px`)

**Text animations (CSS `@keyframes fadeUp`):**
- Eyebrow: `animation: fadeUp 1s var(--ease-luxury) 0.6s forwards`
- H1: `animation: fadeUp 1.2s var(--ease-luxury) 0.9s forwards`
- Subtitle: `animation: fadeUp 1s var(--ease-luxury) 1.3s forwards`
- CTAs block: `animation: fadeUp 1s var(--ease-luxury) 1.6s forwards`
- Scroll indicator: `animation: fadeIn 1s var(--ease-luxury) 2.2s forwards`
- All start at `opacity: 0`

**Keyframe definitions:**
```
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scrollDrop { 0% { top: -100%; } 100% { top: 100%; } }
```

**Shopify flag:** Hero image should be a section setting (`image_picker`). The CDN URL above is an existing Shopify-hosted image and can be reassigned to the new section setting during setup.

---

### Section 3 — Manifesto

**Purpose:** A single editorial statement that lets the page breathe after the dark hero. Ecru background.

**Background:** `var(--c-paper)` (page default — no explicit background set on this element)

**Layout:**
- `padding: var(--s-2xl) var(--gutter); text-align: center; max-width: 1100px; margin: 0 auto`
- `::before` pseudo: `width: 40px; height: 1px; background: var(--c-rosegold-pale); margin: 0 auto; margin-bottom: 56px`
- `::after` pseudo: same, `margin-top: 56px`

**Text elements:**
- Quote: `"Every lehenga, every corset, every draped silhouette — handcrafted for the woman who wants her wedding to begin the moment she dresses."`
- Attribution: `Karishma & Ashita — Bridal Couture, Mumbai`

**Animations:**
- Quote: `.reveal` — opacity 0 → 1, translateY 28px → 0, `1s var(--ease-luxury)` on IntersectionObserver trigger
- Attribution: `.reveal.reveal-delay-2` — same, 0.22s delay

**Shopify flag:** This copy can be a section setting (`text` type). Two fields: `manifesto_quote` and `manifesto_attribution`.

---

### Section 4 — Collection Story (Bloom Soirée)

**Purpose:** Signature editorial moment — one featured collection with image+text split and two secondary detail images below.

**Background:**
- Left panel (image): no background
- Right panel: `var(--c-paper-deep)` = `#F0EAE1`

**Layout:**
- `display: grid; grid-template-columns: 1fr 1fr; min-height: 90vh; overflow: hidden`
- Right panel: `display: grid; grid-template-rows: 1fr auto`
- Text column: `padding: var(--s-2xl) clamp(32px, 5vw, 80px); display: flex; flex-direction: column; justify-content: center; max-width: 560px`
- Secondary images: `display: grid; grid-template-columns: 1fr 1fr; height: 280px`

**Image slots:**
1. Main left image: `images/bloom-soiree-main.jpg` — `object-position: center top`; filter `sepia(0.12) saturate(0.90) brightness(0.95)`; `min-height: 600px`
2. Secondary image 1: `images/collection-secondary-1.jpg` — filter same as above
3. Secondary image 2: `images/collection-secondary-2.jpg` — filter same as above

All three are `reveal-img` elements (see animation section).

**Text elements:**
- Eyebrow: "Introducing" — `.eyebrow.eyebrow--muted`
- H2: "The Bloom / Soirée" (line break after "Bloom")
- Body: "Blushing rose petals pressed into organza. Ivory silk worked by hand into structures that hold their shape across a twelve-hour celebration. The Bloom Soirée begins where traditional bridal ends — in the quiet confidence of craft that needs no introduction."
- CTA: "Explore the collection" — `.btn-dark` → `/collections/bloom-soiree` (TBD)

**Animations:**
- Main image: `.reveal-img` — scale 1.04 → 1 on enter, `1.4s var(--ease-luxury)`
- Eyebrow: `.reveal`
- H2: `.reveal.reveal-delay-1` (0.1s delay)
- Body: `.reveal.reveal-delay-2` (0.22s delay)
- CTA: `.reveal.reveal-delay-3` (0.38s delay)
- Secondary images: `.reveal-img` each

**Shopify flag:** This section maps naturally to a Shopify "featured collection" section. `collection_story_eyebrow`, `collection_story_title`, `collection_story_body`, `collection_story_cta_label`, `collection_story_cta_link` as text/url settings. Three images as `image_picker` settings. The featured collection can link to a real Shopify collection.

---

### Section 5 — Bestsellers (3 product cards)

**Purpose:** Three hero products displayed as a full-bleed editorial grid, not a catalogue.

**Background:** `var(--c-paper)` (page default)

**Layout:**
- Outer wrapper: `padding: var(--s-2xl) var(--gutter); max-width: var(--max-wide); margin: 0 auto`
- Section header: `display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: var(--s-lg); gap: 24px`
- Grid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px`

**Section header text:**
- Eyebrow: "Most Loved" — `.eyebrow.eyebrow--muted`
- H2: "Signature Pieces"
- "View all bestsellers" link → `/collections/bestsellers` (TBD)

**Product cards — all three follow identical structure:**

Card 1:
- Image: `images/product-snow-veil-corset.jpg`; filter `sepia(0.10) saturate(0.90) brightness(0.97)`
- Badge: "Made to Order" (only on card 1 in prototype — can be per-product)
- Name: "Snow Veil Corset / with Drape Skirt & Stole"
- Fabric: "Silk organza — Ivory"
- Price: "₹ 43,000"
- Action: "View piece →"
- Link: product page (TBD)

Card 2:
- Image: `images/product-bloom-lehenga.jpg`; same filter
- No badge
- Name: "Bloom Lehenga / Rose Blush"
- Fabric: "Georgette with hand embroidery"
- Price: "₹ 68,000"
- Action: "View piece →"

Card 3:
- Image: `images/product-ivory-column-corset.jpg`; same filter
- No badge
- Name: "Ivory Column Corset / with Organza Drape"
- Fabric: "Raw silk & tulle"
- Price: "₹ 56,000"
- Action: "View piece →"

**Product card structure:**
- `.product-card__image`: `aspect-ratio: 3/4; overflow: hidden`
- `.product-card__badge`: `position: absolute; top: 20px; left: 20px`
- `.product-card__info`: `padding: 20px 4px 36px`
- `.product-card__action`: `position: absolute; bottom: 36px; right: 4px` — hidden at rest, revealed on hover

**Interactive states:**
- Image: `transform: scale(1.04)` on card hover, `1.2s var(--ease-luxury)`
- Action link: `opacity: 0; transform: translateX(-8px)` at rest → `opacity: 1; transform: translateX(0)` on card hover, `--dur-fast` opacity / `--dur-med var(--ease-luxury)` transform

**Animations:** Each `.product-card` has `.reveal-img` — scale 1.04 → 1 on scroll entry

**Shopify flag:** In Shopify, this section should pull from a manually selected collection or list of product handles via a section schema. Use `{% for product in section.settings.featured_collection.products limit: 3 %}` or three individual `product` pickers. Prices must use `{{ product.price | money }}`. The "Made to Order" badge should be a product tag or metafield. The fabric description line should use a product metafield (`product.metafields.custom.fabric_description`). See Section 8.

---

### Section 6 — Celebrity Moment

**Purpose:** Full-bleed editorial image with a brand statement. Dark. Creates rhythm contrast after the light bestsellers.

**Background:**
- Full-bleed image: `images/celebrity-editorial.jpg`; filter `sepia(0.08) saturate(0.88) brightness(0.90)`, `object-position: center 20%`
- Overlay: `linear-gradient(105deg, rgba(15,12,10,0.75) 0%, rgba(15,12,10,0.2) 55%, rgba(15,12,10,0.05) 100%)`

**Layout:**
- `position: relative; height: 85vh; min-height: 500px; overflow: hidden`
- Content: `position: absolute; top: 50%; transform: translateY(-50%); left: var(--gutter); max-width: 580px`

**Text elements:**
- Eyebrow: "The House" — `.eyebrow.eyebrow--on-dark` with `margin-bottom: 24px` inline
- Quote: `"Worn by those who believe a garment / should tell a story."` (line break in prototype is `<br>`)

**No CTA** — this section is purely editorial. No link, no button.

**Animations:**
- Background image: `.reveal-img` — scale 1.04 → 1 on enter
- Eyebrow: `.reveal`
- Quote: `.reveal.reveal-delay-1`

**Shopify flag:** Quote and eyebrow text should be section settings. Image should be `image_picker`. This section has no Shopify-dynamic content by design.

---

### Section 7 — Client Diaries Lookbook

**Purpose:** Editorial grid of real client images — three columns with a text CTA column integrated into the grid.

**Background:** `var(--c-paper)` (page default). Section has `padding: var(--s-2xl) 0` (full width, no horizontal padding on the section itself — the header has `padding: 0 var(--gutter) var(--s-lg)`).

**Layout — header:**
- `padding: 0 var(--gutter) var(--s-lg)`
- Eyebrow: "Real Brides"
- H2: "Client Diaries" — uses inline style `font-family: var(--f-display); font-size: var(--t-h2); font-weight: 400; color: var(--c-charcoal); margin-top: 8px` (this should be a proper class in the build, not an inline style)

**Layout — grid:**
- `display: grid; grid-template-columns: 1.2fr 0.6fr 1fr; gap: 3px; min-height: 70vh`

**Column 1 — tall image:**
- `.lookbook__item.lookbook__item--tall`: `min-height: 600px; position: relative; overflow: hidden`
- Image: `images/client-diaries-1.jpg`; filter `sepia(0.12) saturate(0.88) brightness(0.96)`
- Hover overlay: `linear-gradient(to top, rgba(15,12,10,0.65) 0%, transparent 50%)` — opacity 0 → 1 on hover, `--dur-med`
- Hover caption: slides up `translateY(8px)` → 0, opacity 0 → 1, `--dur-med var(--ease-luxury)`
  - Name: "The Bloom Soirée Lehenga" — `.lookbook__caption-name`
  - Garment: "Blush & Gold — Made to Order" — `.lookbook__caption-garment`

**Column 2 — text CTA:**
- `.lookbook__text-col`: `display: flex; flex-direction: column; justify-content: center; padding: clamp(32px, 5vw, 64px); background: var(--c-paper-deep)`
- Eyebrow: "Stories" with `margin-bottom: 16px` inline
- H3: "Every bride becomes / part of our diary."
- Body: "From the first conversation to the last pin, we document the journey of every K&A bride. Each diary entry is a story of craft, emotion, and the precise moment a woman becomes a bride."
- CTA: "Read the diaries" → `/pages/client-diaries` (TBD)

**Column 3 — stacked two images:**
- `.lookbook__item.lookbook__item--mid`: `display: grid; grid-template-rows: 1fr 1fr; gap: 3px`
- Image slot 1: `images/client-diaries-2.jpg`; same filter; hover overlay + caption ("The Snow Veil Corset" / "Ivory Silk Organza — Made to Order")
- Image slot 2: `images/client-diaries-3.jpg`; same filter; hover overlay + caption ("The Column Corset" / "White & Ivory — Made to Order")

**Animations:**
- Header eyebrow and title: `.reveal`
- Large image: `.reveal-img`
- Text column content: `.reveal`, `.reveal-delay-1`, `.reveal-delay-2`, `.reveal-delay-3`
- Stacked images: each `.reveal-img`

**Shopify flag:** Images are currently static. In the Shopify build, these can be `image_picker` section settings (5 settings: header, large, small-1, small-2). Caption copy can be text settings. The "Read the diaries" link points to a static page.

---

### Section 8 — Voice of the Bride (Google Reviews)

**Purpose:** Editorial social proof panel on a dark ground. Three testimonial cards.

**BLOCKED — requires real client data before production use. Do not go live with placeholder content.**

**Background:**
- `var(--c-charcoal)` = `#1A1714`
- Top border: `height: 1px; background: var(--line-on-dark)` (pseudo `::before`)
- Subtle warm radial gradient in the newsletter (does not apply here — this section is clean dark)

**Layout:**
- `padding: var(--s-2xl) var(--gutter)`
- Inner container: `max-width: 1100px; margin: 0 auto`
- Header: `display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: var(--s-xl); gap: 24px`
- Grid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line-on-dark)` (the 1px grid gap filled with the line colour creates the hairline dividers between cards)
- CTA row: `margin-top: var(--s-lg); display: flex; align-items: center; justify-content: center`

**Header text:**
- Left column eyebrow: "What Brides Say" — `.eyebrow.eyebrow--on-dark`
- Left column H2: "The words of / our brides."
- Right column: Rating block — large number display + label

**Rating block (PLACEHOLDER — replace with real data):**
- Rating number/stars: `★★★★★` (or real numerical rating, e.g. "4.9")
- Rating label: e.g. "4.9 · 52 Google Reviews"

**Voice card structure:**
- Background: `var(--c-charcoal)` (each card individually, against the `var(--line-on-dark)` grid background)
- Padding: `40px 36px 44px`
- Quote mark: `"` character — 3.5rem Bodoni, `var(--c-rosegold)` at 0.6 opacity
- Quote text: italic Bodoni
- Meta row: `border-top: 1px solid var(--line-on-dark); padding-top: 20px; display: flex; align-items: center; justify-content: space-between`
  - Reviewer name (left) — `.voice-card__name`
  - Occasion (right) — `.voice-card__occasion`

**Placeholder content (DO NOT publish — for layout reference only):**
- Card 1: Quote "I felt completely taken care of..." / Name: Priya S. / Occasion: Bridal, 2024
- Card 2: Quote "The quality of the embroidery..." / Name: Anika R. / Occasion: Festive Wear, 2024
- Card 3: Quote "Karishma and Ashita understood exactly..." / Name: Meera K. / Occasion: Bridal, 2025

**CTA:**
- "Read all reviews on Google" → `https://g.page/r/[GOOGLE-MAPS-REVIEW-URL]` — **PLACEHOLDER, real URL needed**
- Button style: `.btn-outline-rose`

**Animations:**
- Header block: `.reveal`
- Card 1: `.reveal`
- Card 2: `.reveal.reveal-delay-1`
- Card 3: `.reveal.reveal-delay-2`
- CTA: `.reveal.reveal-delay-3`

**Shopify flag:** Review content should be managed as a Shopify section with up to 3 blocks (each block = one review: quote, name, occasion). The rating number and label should be text settings. This is preferable to a third-party review app for this use case — the editorial styling would be destroyed by most app widgets.

---

### Section 9 — Collections Directory

**Purpose:** Four collection categories displayed as tall editorial cards on a dark ground.

**Background:**
- `var(--c-charcoal-2)` = `#2C2825`
- Top border: `1px solid var(--line-on-dark)` (pseudo `::before`)

**Layout:**
- `padding: var(--s-2xl) var(--gutter)`
- Inner container: `max-width: var(--max-wide); margin: 0 auto`
- Header: `margin-bottom: var(--s-xl)`
- Grid: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px`

**Header:**
- Eyebrow: "The House" — `.eyebrow.eyebrow--on-dark`; `margin-bottom: 16px` inline
- H2: "Our Collections" — italic Bodoni, white

**Collection cards (4 cards):**

Card 1 — Bridal:
- Image: `images/collection-bridal.jpg`; filter `sepia(0.10) saturate(0.90) brightness(0.90)`
- Number: "01"
- Name: "Bridal"
- Link: `/collections/bridal` (TBD — {{ liquid }})

Card 2 — Lehengas:
- Image: `images/collection-lehengas.jpg`; same filter
- Number: "02"
- Name: "Lehengas"
- Link: `/collections/lehengas` (TBD)

Card 3 — Indo-Western:
- Image: `images/collection-indo-western.jpg`; same filter
- Number: "03"
- Name: "Indo-Western"
- Link: `/collections/indo-western` (TBD)

Card 4 — Festive:
- Image: `images/collection-festive.jpg`; same filter
- Number: "04"
- Name: "Festive"
- Link: `/collections/festive` (TBD)

**Card structure:**
- `.coll-card`: `position: relative; overflow: hidden; display: block` (the entire card is an `<a>`)
- `.coll-card__image`: `aspect-ratio: 2/3; overflow: hidden`
- `.coll-card__overlay`: `position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,23,20,0.80) 0%, rgba(26,23,20,0.15) 50%, transparent 100%)`
- `.coll-card__label`: `position: absolute; bottom: 28px; left: 24px; right: 24px`
- `.coll-card__arrow`: hidden at rest (`opacity: 0; transform: translateY(6px)`), revealed on hover (`opacity: 1; transform: translateY(0)`, `--dur-fast` / `--dur-med var(--ease-luxury)`)

**Interactive states:**
- Image: `transform: scale(1.05)` on card hover, `1.4s var(--ease-luxury)`
- Arrow text: "Explore →" slides up and fades in

**Animations:**
- Header: `.reveal`
- All four cards: `.reveal-img`

**Shopify flag:** Each card should be a block in the section schema with `image_picker`, `text` (name), `collection` (or `url`) settings. The collection handle maps to a Shopify collection URL.

---

### Section 10 — Craft Strip

**Purpose:** A horizontal strip of four brand pillars — craft credentials presented as editorial typography, not marketing bullets.

**Background:**
- `var(--c-charcoal)` = `#1A1714`
- Top border: `1px solid var(--line-on-dark)`
- Bottom border: `1px solid var(--line-on-dark)`

**Layout:**
- `padding: var(--s-xl) var(--gutter)`
- Inner: `display: flex; align-items: center; justify-content: center; gap: clamp(24px, 5vw, 80px); flex-wrap: wrap; max-width: var(--max-wide); margin: 0 auto`
- Four `.craft-strip__item` elements separated by three `.craft-strip__dot` dividers (3px × 3px circle, `var(--c-rosegold)`, opacity 0.4)

**Four items (in order):**
1. Label: "Handcrafted" / Sub: "Every stitch by hand"
2. Label: "Made to Order" / Sub: "Designed around you"
3. Label: "Worldwide Delivery" / Sub: "Free shipping, always"
4. Label: "Concierge" / Sub: "Personal styling, always available"

**Animations:**
- Item 1, Dot 1: `.reveal`
- Item 2, Dot 2: `.reveal.reveal-delay-1`
- Item 3, Dot 3: `.reveal.reveal-delay-2`
- Item 4: `.reveal.reveal-delay-3`

**Shopify flag:** Can be a static section with four blocks (each block has `label` and `sublabel` text settings). No dynamic content needed.

---

### Section 11 — Appointment CTA

**Purpose:** Full-bleed editorial image with invitation copy and two CTA buttons. The Atelier invitation — not a booking widget.

**Background:**
- Full-bleed image: `images/appointment-bg.jpg`; filter `sepia(0.10) saturate(0.85) brightness(0.88)`, `object-position: center 30%`
- Overlay: solid `rgba(26,23,20,0.60)`

**Layout:**
- `position: relative; min-height: 70vh; display: flex; align-items: center; overflow: hidden`
- Content: `position: relative; z-index: 1; padding: var(--s-2xl) var(--gutter); max-width: 680px; margin: 0 auto; text-align: center`

**Text elements:**
- Eyebrow: "The Atelier" — `.eyebrow.eyebrow--on-dark`
- H2: "Begin with a / Conversation."
- Body: "Every K&A bride begins with a private styling session — in our Mumbai atelier or virtually, wherever in the world you are. We listen before we design."

**CTAs:**
- "Book In-Store Appointment" → `/pages/book-appointment` or Shopify appointment app URL (TBD)
- "or" divider — `.appointment__divider`
- "Book Virtual Styling Session" → `/pages/book-virtual-appointment` or external booking link (TBD)
- Both `.btn-outline-white`; on mobile `flex-direction: column; align-items: stretch` with `text-align: center`

**Animations:**
- Background image: `.reveal-img`
- Eyebrow: `.reveal`
- H2: `.reveal.reveal-delay-1`
- Body: `.reveal.reveal-delay-2`
- CTA group: `.reveal.reveal-delay-3`

**Shopify flag:** Appointment booking destination must be confirmed. Options: (a) Shopify native `/apps/booking` if a booking app is used, (b) external Calendly/Typeform link, (c) a WhatsApp pre-filled message link. Both CTAs can be `url` type section settings. The background image is a section `image_picker` setting.

---

### Section 12 — Newsletter

**Purpose:** Quiet invitation to join the correspondence list. Positioned as editorial communication from the atelier, not a marketing sign-up.

**Background:**
- `var(--c-charcoal-2)` = `#2C2825`
- Decorative radial warm gradient pseudo `::before`: `position: absolute; top: -40%; left: 50%; transform: translateX(-50%); width: 70%; height: 200%; background: radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%); pointer-events: none`

**Layout:**
- `padding: var(--s-2xl) var(--gutter); text-align: center; position: relative; overflow: hidden`
- Inner: `position: relative; max-width: 560px; margin: 0 auto`

**Text elements:**
- Eyebrow: "From the Atelier" — `.eyebrow.eyebrow--on-dark`
- H2: "Receive our / Correspondence"
- Body: "Collection stories, styling notes, and invitations to our trunk shows — delivered quietly to your inbox. No promotions. Only beauty."
- Form note: "We send four letters a year. Unsubscribe at any time."

**Form:**
- `display: flex; max-width: 440px; margin: 0 auto; border-bottom: 1px solid rgba(255,255,255,0.2)`
- Input: email type, placeholder "Your email address" (displayed in uppercase via CSS on placeholder)
- Submit button text: "Subscribe"
- On successful submission: button text changes to "Thank you", input value clears, placeholder changes to "You are on the list."

**Animations:**
- Eyebrow: `.reveal`
- H2: `.reveal.reveal-delay-1`
- Body: `.reveal.reveal-delay-2`
- Form: `.reveal.reveal-delay-3`
- Note: `.reveal.reveal-delay-4`

**Shopify flag:** The newsletter form in Shopify submits to the `/contact#contact_form` or uses the Shopify Customer endpoint. The recommended approach for K&A is Klaviyo embed (if Klaviyo is the email provider) or Shopify's native customer email endpoint. The prototype's `onsubmit="return false;"` JS handler is prototype-only — real Shopify form action and method attributes required. The "Thank you" state can be handled via Liquid `{% form 'customer' %}` success parameter or JS after AJAX submission. Technical Director must confirm which email platform the client uses before building this.

---

### Section 13 — Footer

**Purpose:** The closing card of the atelier. Brand identity, navigation, contact, legal.

**Background:** `var(--c-charcoal)` = `#1A1714`; top border `1px solid var(--line-on-dark)`

**Layout:**
- `padding: var(--s-2xl) var(--gutter) var(--s-lg)`
- Top grid: `grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: var(--s-lg)` — 4 columns
- Bottom: `display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap`
- Top/bottom separator: `padding-bottom: var(--s-xl); border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: var(--s-lg)`

**Column 1 — Brand:**
- Logo: "K&A by Karishma & Ashita" — footer logo style
- Tagline: "Bridal couture, handcrafted / in Mumbai." — italic Bodoni
- Social links: "Instagram" → `https://instagram.com/karishmaashita`; "Concierge" → `https://wa.me/919967543087`; "Pinterest" → TBD

**Column 2 — Collections:**
- Title: "Collections"
- Links: Bridal / Lehengas / Indo-Western / Festive Wear / Bestsellers

**Column 3 — The House:**
- Title: "The House"
- Links: About Karishma & Ashita / Client Diaries / Book an Appointment / Concierge (wa.me link) / Press

**Column 4 — Contact:**
- Title: "Contact"
- Phone: `+91 99675 43087` → `https://wa.me/919967543087`
- Email: `hello@karishmaashita.com` → `mailto:hello@karishmaashita.com`
- Address text: "Mumbai, India / Free worldwide shipping" (not a link)

**Footer bottom:**
- Copyright: "© 2026 K&A by Karishma & Ashita. All rights reserved."
- Legal links: Privacy Policy / Terms of Service / Shipping & Returns

**Shopify flag:** Footer is typically a global section in Shopify theme layout (theme.liquid or sections/footer.liquid). Navigation links should use Shopify menus (linklist) rather than hardcoded `href="#"`. The WhatsApp number should be a theme setting so the client can update it without touching code.

---

### Mobile Navigation Drawer

**Purpose:** Full-screen slide-in navigation for screens ≤900px.

**Background:** `var(--c-charcoal)` = `#1A1714`

**Layout:**
- `position: fixed; inset: 0; z-index: 200`
- `padding: 80px var(--gutter) var(--s-lg)`
- `display: flex; flex-direction: column`
- At rest: `transform: translateX(100%)` — completely off screen right
- Open state: `transform: translateX(0)`; transition: `0.5s var(--ease-luxury)`
- Close button: `position: absolute; top: 24px; right: var(--gutter)`

**Content:**
- Close button text: "Close" — 0.63rem, letter-spacing 0.22em, uppercase
- Nav links list: Bestsellers / Collections / Client Diaries / About / Book an Appointment
  - Each item: Bodoni italic, `clamp(1.6rem, 6vw, 2.6rem)`; bordered bottom `1px solid rgba(255,255,255,0.07)`; padding `18px 0`; hover → `var(--c-rosegold)`
- Footer section: pushed to bottom via `margin-top: auto`
  - "Concierge" label in muted sans
  - Phone number as link: `+91 99675 43087` → `https://wa.me/919967543087` in rose-gold

**Body overflow:** `overflow: hidden` set on `<body>` when drawer opens; removed on close.

**Trigger:** Hamburger toggle — three `1px` horizontal lines (`.nav__toggle span`), `width: 24px`.

**Accessibility:** `aria-hidden="true"` on drawer at rest; `aria-hidden="false"` when open. Escape key closes drawer.

---

## 4. Interaction & Motion Inventory

### Page-Load Animations (CSS, not scroll-driven)

| Element | Trigger | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| Hero background image | Double `requestAnimationFrame` on page load | `transform: scale(1.05)` → `scale(1)` | 2.2s | `--ease-luxury` | ~2 frames |
| Hero eyebrow | CSS animation `fadeUp` on page load | `opacity` 0→1, `translateY` 24px→0 | 1s | `--ease-luxury` | 0.6s |
| Hero H1 | CSS animation `fadeUp` | same | 1.2s | `--ease-luxury` | 0.9s |
| Hero subtitle | CSS animation `fadeUp` | same | 1s | `--ease-luxury` | 1.3s |
| Hero CTA group | CSS animation `fadeUp` | same | 1s | `--ease-luxury` | 1.6s |
| Hero scroll indicator | CSS animation `fadeIn` | `opacity` 0→1 | 1s | `--ease-luxury` | 2.2s |
| Scroll line `::after` | CSS animation on page load | `top: -100%` → `top: 100%` | 1.8s | `ease-in-out` | 0s (infinite) |

### Scroll-Driven Reveals (IntersectionObserver)

**Observer settings:** `threshold: 0.10`, `rootMargin: '0px 0px -40px 0px'`

All `.reveal` elements start at `opacity: 0; transform: translateY(28px)`. On entering viewport:
- `opacity: 0` → `1`
- `transform: translateY(28px)` → `translateY(0)`
- Duration: `var(--dur-slow)` = 1s
- Easing: `var(--ease-luxury)`
- Observer unobserves each element after it has fired (one-shot, not repeated)

**Delay modifiers:**
- `.reveal-delay-1`: `transition-delay: 0.1s`
- `.reveal-delay-2`: `transition-delay: 0.22s`
- `.reveal-delay-3`: `transition-delay: 0.38s`
- `.reveal-delay-4`: `transition-delay: 0.52s`

All `.reveal-img` elements start with their `<img>` at `transform: scale(1.04)`. On entering viewport: `scale(1.04)` → `scale(1)`, duration `1.4s var(--ease-luxury)`. The container itself must have `overflow: hidden`.

### Scroll Behavior

| Trigger | Element | What changes | Duration | Easing |
|---|---|---|---|---|
| `scrollY > 60` | `.nav` | Gets `.scrolled` class | — | — |
| `.scrolled` applied | Nav background | `transparent` → `rgba(248,244,239,0.96)` + blur + border | `--dur-med` | `--ease-soft` |
| `.scrolled` applied | Nav padding | `24px` → `16px` | `--dur-med` | `--ease-soft` |
| `.scrolled` applied | Nav link/logo/toggle color | white → `var(--c-charcoal)` | `--dur-med` | `--ease-soft` |
| `scrollY < heroHeight` | `.hero__bg` | `translateY(scrollY * 0.22)px` applied | real-time (passive listener) | — |

Note: Parallax is only active when `window.matchMedia('(min-width: 900px)').matches`.

### Hover Animations

| Element | Property | From | To | Duration | Easing |
|---|---|---|---|---|---|
| Nav link underline | `width` of `::after` | `0` | `100%` | `--dur-med` | `--ease-luxury` |
| Nav WhatsApp button | `background`, `color` | transparent/white | white/charcoal (or charcoal/white) | `--dur-fast` | — |
| `.btn-ghost` | `background`, `color`, `border-color` | transparent/white | white/charcoal | `--dur-fast` | — |
| `.btn-text::after` | `width` | `32px` | `52px` | `--dur-med` | `--ease-luxury` |
| `.btn-dark::after` arrow | `transform` | `translateX(0)` | `translateX(6px)` | `--dur-med` | `--ease-luxury` |
| `.btn-dark` | `color`, `border-color` | charcoal/rosegold-pale | rosegold-2 | `--dur-fast` | — |
| Product card image | `transform` | `scale(1)` | `scale(1.04)` | `1.2s` | `--ease-luxury` |
| Product card action | `opacity`, `transform` | `0`, `translateX(-8px)` | `1`, `translateX(0)` | `--dur-fast` / `--dur-med` | — / `--ease-luxury` |
| Lookbook image | `transform` | `scale(1)` | `scale(1.03)` | `1.2s` | `--ease-luxury` |
| Lookbook overlay | `opacity` | `0` | `1` | `--dur-med` | — |
| Lookbook caption | `opacity`, `translateY` | `0`, `8px` | `1`, `0` | `--dur-med` | `--ease-luxury` |
| `.btn-outline-rose` | `background`, `color`, `border-color` | transparent/rosegold | rosegold/charcoal | `--dur-fast` | — |
| Collection card image | `transform` | `scale(1)` | `scale(1.05)` | `1.4s` | `--ease-luxury` |
| Collection card arrow | `opacity`, `translateY` | `0`, `6px` | `1`, `0` | `--dur-fast` / `--dur-med` | — / `--ease-luxury` |
| `.section-header__link` | `color` | `var(--c-ink-muted)` | `var(--c-charcoal)` | `--dur-fast` | — |
| Footer social links | `color` | `rgba(255,255,255,0.35)` | `var(--c-rosegold)` | `--dur-fast` | — |
| Footer links | `color` | `rgba(255,255,255,0.5)` | white | `--dur-fast` | — |
| Footer contact links | `color` | `rgba(255,255,255,0.42)` | `var(--c-rosegold)` | `--dur-fast` | — |
| Footer legal links | `color` | `rgba(255,255,255,0.18)` | `rgba(255,255,255,0.5)` | `--dur-fast` | — |
| Mobile nav links | `color` | white | `var(--c-rosegold)` | `--dur-fast` | — |
| Newsletter submit | `color` | `var(--c-rosegold)` | white | `--dur-fast` | — |
| `.btn-outline-white` | `background`, `color`, `border-color` | transparent/white | white/charcoal | `--dur-fast` | — |

---

## 5. Responsive Breakpoints

### Breakpoint: max-width 900px

| Change | Details |
|---|---|
| `nav__links` | `display: none` |
| `nav__toggle` | `display: flex` (hamburger appears) |
| `nav__whatsapp` | `display: none` |
| `.collection-story` | `grid-template-columns: 1fr` (stacks vertically) |
| `.collection-story__image-main` | `min-height: 480px` |
| `.collection-story__right` | `grid-template-rows: auto auto` |
| `.collection-story__text` | `padding: 48px var(--gutter); max-width: none` |
| `.collection-story__images-secondary` | `height: 200px` (reduced from 280px) |
| `.bestsellers__grid` | `grid-template-columns: 1fr 1fr` (2-column) |
| `.bestsellers__grid .product-card:last-child` | `grid-column: 1 / -1` (third card full width) |
| `.lookbook__grid` | `grid-template-columns: 1fr 1fr; grid-template-rows: auto` |
| `.lookbook__item--tall` | `min-height: 320px` (reduced) |
| `.lookbook__text-col` | `grid-column: 1 / -1; min-height: 240px` (full width) |
| `.voices__grid` | `grid-template-columns: 1fr` (stacked single column) |
| `.voices__header` | `flex-direction: column; align-items: flex-start; gap: 20px` |
| `.voices__rating-block` | `text-align: left` |
| `.collections-dir__grid` | `grid-template-columns: 1fr 1fr` (2×2) |
| `.footer__top` | `grid-template-columns: 1fr 1fr; gap: var(--s-md)` |
| `.footer__brand` | `grid-column: 1 / -1` (full width) |
| `.manifesto__line` | `font-size: clamp(1.3rem, 5vw, 2.2rem)` (reduced) |

### Breakpoint: max-width 600px

| Change | Details |
|---|---|
| `--s-2xl` | `80px` (reduced from 140px) |
| `--s-xl` | `60px` (reduced from 96px) |
| `.bestsellers__grid` | `grid-template-columns: 1fr` (single column) |
| `.bestsellers__grid .product-card:last-child` | `grid-column: auto` (reset) |
| `.lookbook__grid` | `grid-template-columns: 1fr` (single column) |
| `.collections-dir__grid` | `grid-template-columns: 1fr 1fr` (keeps 2-column at 600px) |
| `.section-header` | `flex-direction: column; align-items: flex-start; gap: 12px` |
| `.appointment__options` | `flex-direction: column; align-items: stretch` |
| `.btn-outline-white` | `text-align: center` |
| `.footer__top` | `grid-template-columns: 1fr` (single column) |
| `.craft-strip__inner` | `flex-direction: column; gap: 32px` |
| `.craft-strip__dot` | `display: none` |
| `.voice-card` | `padding: 28px 24px 32px` |

---

## 6. Navigation Behaviour

### Desktop (≥900px)

**Structure:** Three-column flex row — left links / centre logo / right actions (WhatsApp + hidden toggle)

**Scroll crystallisation:**
- Trigger: `window.scrollY > 60` pixels
- JS: passive scroll listener adds/removes class `.scrolled` on `#nav`
- `.scrolled` applies: background blur + ecru tint, reduced padding, dark text/icons, visible bottom border
- Transition on the `.nav` element itself: `background var(--dur-med) var(--ease-soft), padding var(--dur-med) var(--ease-soft), backdrop-filter var(--dur-med) var(--ease-soft)`

**Link underline hover:**
- Absolutely positioned `::after` pseudo, `height: 1px; background: var(--c-rosegold)`
- Starts `width: 0`, animates to `width: 100%` on hover, `var(--dur-med) var(--ease-luxury)`

### Mobile (<900px)

**Trigger:** Hamburger button `#navToggle` (three `1px` horizontal lines, `width: 24px`, gap `5px`)

**Drawer open (`openNav` function):**
- `.mobile-nav.open` applied → `transform: translateX(0)` (slides in from right)
- `aria-hidden="false"` set on drawer
- `document.body.style.overflow = 'hidden'` (prevents background scroll)
- Transition: `0.5s var(--ease-luxury)`

**Drawer close (`closeNav` function):**
- `.open` removed → `transform: translateX(100%)`
- `aria-hidden="true"` set
- Body overflow restored to `''`
- Triggers: Close button click (`#navClose`), Escape key press

**Drawer content:**
- Close label "Close" top-right
- Large italic Bodoni links (stacked, border-separated)
- Concierge footer section at bottom
- No overlay/backdrop behind the drawer in the prototype

---

## 7. Content Requirements

### BLOCKED — Required Before Launch

**Google Reviews (Voice of the Bride section):**
- Confirmed Google Business star rating (numerical, e.g. "4.9")
- Confirmed Google review count (e.g. "52 Google Reviews")
- Verbatim review excerpt #1: exact quote text, reviewer first name, occasion and year (e.g. "Bridal, Dec 2024")
- Verbatim review excerpt #2: same format
- Verbatim review excerpt #3: same format
- Confirmed Google Maps review page URL to replace `https://g.page/r/[GOOGLE-MAPS-REVIEW-URL]`
- Source: client must copy these from their Google Business Profile directly. Do not paraphrase or invent.

**Appointment booking links:**
- Confirmed destination URL or system for "Book In-Store Appointment"
- Confirmed destination URL or system for "Book Virtual Styling Session"
- These may be the same booking system with a parameter, or two separate links/apps

**Footer links:**
- Pinterest profile URL (currently `href="#"`)
- Confirmed Shopify collection handles for all four collections (Bridal, Lehengas, Indo-Western, Festive)
- Confirmed Shopify page slugs for: Client Diaries, About, Appointments, Press
- Real Privacy Policy, Terms of Service, Shipping & Returns page content and slugs

**Product data (for Bestsellers section):**
- Confirmed three product handles to feature
- Confirmed `fabric_description` metafield or equivalent for each product (the "Silk organza — Ivory" line under the name)
- Confirmed whether "Made to Order" is a product tag or a metafield, and on which products it appears

### Placeholder Copy (usable but review recommended)

The following copy in the prototype is editorial placeholder. It should be reviewed and confirmed by Karishma & Ashita before going live:
- Manifesto quote
- Collection Story (Bloom Soirée) body paragraph
- Celebrity / brand quote: "Worn by those who believe a garment should tell a story."
- Lookbook CTA body paragraph
- Appointment CTA body paragraph
- Newsletter body paragraph and note

---

## 8. Shopify Platform Feasibility Flags

### F1 — Hero Image: Shopify-hosted image via section setting
**Issue:** Prototype uses a hardcoded CDN URL from the existing Shopify store.
**Faithful implementation:** Add an `image_picker` setting in the hero section schema. The existing image is already in Shopify's file library and can be selected. Render with `{{ section.settings.hero_image | image_url: width: 1800 }}`.
**Risk:** Low.

### F2 — Product Cards: Dynamic Shopify product data
**Issue:** Product names, prices, fabric descriptions, and badges are all hardcoded in the prototype. In Shopify, these must pull from product data.
**Faithful implementation:**
- Use either a `collection` section setting or three individual `product` pickers
- Product name: `{{ product.title }}`
- Price: `{{ product.price | money }}`
- "Made to Order" badge: check for a product tag (`{% if product.tags contains 'made-to-order' %}`) or a boolean metafield
- Fabric description: a custom metafield `product.metafields.custom.fabric` (Technical Director to set up metafield definition in Shopify admin)
- Product image: `{{ product.featured_image | image_url: width: 800 }}`
**Risk:** Low–medium. Requires metafield setup and client confirmation of product handles.

### F3 — Newsletter Form: Email platform integration
**Issue:** The prototype has a static form with a JS-only "Thank you" state. Shopify needs a real form submission.
**Faithful implementation:** Technical Director must confirm which email platform the client uses.
- If Klaviyo: use a Klaviyo embed form styled to match the prototype's visual (requires careful CSS override to match the borderless underline design). This is doable but Klaviyo's embed JS tends to inject its own wrappers — test carefully.
- If Shopify native (customers/newsletter): use `{% form 'customer' %}` with a hidden `contact[tags]` field. Success state handled via Liquid `{% if form.posted_successfully? %}`.
- The "Thank you" state in the prototype (button text change, placeholder change) is a nice micro-interaction — replicate via JS after confirmed form submission, not just after any submit click.
**Risk:** Medium. Choose the platform before building. Do not use a popup-based Klaviyo widget — the form must remain inline.

### F4 — WhatsApp Concierge Number
**Issue:** Hardcoded as `+919967543087` in multiple locations (nav, mobile nav footer, footer column, footer social).
**Faithful implementation:** Define as a single theme setting (`theme_settings.whatsapp_number`) so the client can update it in one place. Construct `https://wa.me/{{ settings.whatsapp_number }}` wherever needed.
**Risk:** Low.

### F5 — Appointment Booking CTAs
**Issue:** Both appointment buttons link to `#` (undefined destination).
**Faithful implementation:** These should be `url` type section settings so the client controls the destination. Options: an internal Shopify page with an embedded booking form, a Calendly link, a Typeform, or a WhatsApp pre-filled message. The destination affects the user experience significantly — confirm before building.
**Risk:** Low technically; medium strategically (wrong destination damages the premium feel).

### F6 — Collection Card URLs
**Issue:** All four collection card links are `#`.
**Faithful implementation:** Each card in the Collections Directory section should be a block with a `collection` type picker, or a `url` type setting. Map to the real Shopify collection handles.
**Risk:** Low. Requires confirmed collection handles from client.

### F7 — Google Reviews CTA URL
**Issue:** Link is `https://g.page/r/[GOOGLE-MAPS-REVIEW-URL]` — a placeholder.
**Faithful implementation:** Should be a section setting (`url` type) so the client provides the real Google Maps review URL. This is a simple external link — no platform complexity.
**Risk:** Low. Blocked on client data.

### F8 — CSS backdrop-filter on Nav (Safari support)
**Issue:** `backdrop-filter: blur(12px)` requires `-webkit-backdrop-filter` prefix — already in the prototype. Older Safari versions (pre-iOS 15.4) may not support it.
**Faithful implementation:** The prototype already includes the `-webkit-` prefix. The fallback is the `rgba(248,244,239,0.96)` background which is already opaque enough to remain usable. No extra work needed.
**Risk:** Low.

### F9 — IntersectionObserver and Parallax JS in Shopify asset pipeline
**Issue:** The prototype has all JS in a single inline `<script>` block. Shopify themes must reference JS as assets.
**Faithful implementation:** Split into `assets/homepage.js` (or `assets/section-[name].js` per section if following scoped architecture). Load via `<script src="{{ 'homepage.js' | asset_url }}" defer></script>` in the section's Liquid file or the layout. The parallax and reveal logic are vanilla JS with no dependencies — no conflicts expected with Shopify's asset pipeline.
**Risk:** Low. No third-party library dependencies.

### F10 — `100svh` unit support
**Issue:** The hero uses `height: 100svh` (small viewport height — prevents mobile browser chrome from cutting off the hero). Safari 15.4+ and modern Chrome/Firefox support this. Older devices may not.
**Faithful implementation:** Include a fallback: `height: 100vh; height: 100svh;` — the second declaration overrides on supporting browsers.
**Risk:** Low. Add the fallback line.

### F11 — Image filter (sepia/saturate/brightness) applied inline
**Issue:** All images have inline `style="filter: sepia(...) saturate(...) brightness(...);"`. In Shopify, images are often rendered via `img` tags from Liquid — the filter must be applied via a CSS class, not inline, since Liquid-generated img tags don't accept arbitrary inline styles easily.
**Faithful implementation:** Create a CSS class (e.g. `.img-editorial`) in the section's CSS: `filter: sepia(0.10) saturate(0.90) brightness(0.96);`. Apply the correct class variant per image context. Use different class names for the slightly different filter values used in different sections (hero, collection story, celebrity, lookbook, product cards, collection directory). See exact values in each section's image slot specification above.
**Risk:** Low. Simple CSS class extraction.

### F12 — Footer navigation from Shopify menus (linklists)
**Issue:** Footer links are hardcoded as `href="#"` in the prototype.
**Faithful implementation:** Use Shopify navigation menus (`linklists`). Create four menus in Shopify Admin: "Footer Collections", "Footer The House", and "Footer Contact" (contact items can remain as theme settings rather than a linklist since they include phone/email). Render with `{% for link in linklists['footer-collections'].links %}`. The footer section schema should reference these menus by handle.
**Risk:** Low.

---

## 9. Creative Director Notes — Handle With Care

These are implementation risks to the premium feel. Technical Director must treat these as design-critical, not cosmetic.

**1. The CSS image filter is non-negotiable.**
Every image carries `sepia(0.10) saturate(0.90) brightness(0.96)` (or a close variant). This is what makes the colour palette feel editorial and cohesive — it pulls the photography's colour temperature toward the warm ecru of the page. If Technical Director removes the filter for any reason (performance, CMS convenience), the site will immediately feel like a generic Shopify store. The filter must be applied. The exact values vary slightly by section and are documented above — use the correct value for each context.

**2. Never replace `backdrop-filter` blur with a solid background on the nav.**
The frosted ecru nav on scroll is a signature detail of the scroll experience. A solid white or solid ecru nav would feel heavy and magazine-generic. If `backdrop-filter` is unavailable in a browser, the fallback opacity is sufficient — but do not intentionally replace the blur with a solid for "simplicity."

**3. The lookbook grid column ratio is deliberate: `1.2fr 0.6fr 1fr`.**
The narrower text column (0.6fr) creates asymmetric tension. Equal thirds would look like a grid template. Do not normalise to `1fr 1fr 1fr` for responsive tidiness — the asymmetry is the point.

**4. The Bestsellers grid gap is `2px`, not `0` and not `8px`.**
The hairline 2px gap between product cards reads as an editorial device — a shadow joint between frames. Zero gap makes it a collage. Eight pixels makes it a product listing. Two pixels is the precise value. Hold it.

**5. Mobile nav links must be large Bodoni italic, not Jost.**
The mobile drawer is a brand moment — the large italic serif links fill the screen with authority. If Jost is used instead (perhaps due to a Shopify theme default applying body font to all `a` elements), the drawer loses its luxury character entirely. The font-family must be explicitly set on `.mobile-nav__links a`.

**6. The scrollDrop animation on the hero scroll indicator must loop infinitely.**
It is a small detail but it is alive. If it fires once and stops, the page feels static. The CSS animation `scrollDrop 1.8s ease-in-out infinite` must be preserved exactly.

**7. The voice cards section must go live with real review data or must not go live at all.**
Do not publish placeholder review content. The section should be conditionally rendered — if no real reviews have been provided by the client, the section must not appear in the published theme. An empty or placeholder social proof section is worse than none. Consider building this section so it is hidden by default and only shown when the section settings contain actual review data.

**8. The hero parallax effect must be disabled below 900px.**
The prototype already does this via `window.matchMedia('(min-width: 900px)').matches`. On mobile, scroll-triggered transform on the hero background causes jank and repaints. The check must be preserved in the Shopify JS implementation — do not simplify by applying parallax globally.

**9. `font-weight: 300` on body text is intentional and must not be overridden.**
Shopify themes sometimes set body `font-weight: 400` in their base CSS. Jost at weight 300 is what gives the body text its quiet luxury — at 400 it reads heavier and more generic. The `font-weight: 300` declaration on `body` in the tokens/reset CSS must not be overridden by any Dawn remnant, normalise stylesheet, or Shopify base style.

**10. Do not introduce any box-shadow on product cards, buttons, or nav.**
Shadows do not exist in this design system. They would immediately cheapen the aesthetic — shadows are a conversion-optimisation reflex from e-commerce design, not a luxury couture instinct. If Shopify's base theme introduces any `box-shadow`, remove it explicitly.

**11. The Hero title "Bridal / Couture" split is structural — not optional.**
"Bridal" is the large italic serif (the emotion). "Couture" is the `<strong>` child at 0.6em, normal weight, widely tracked — it is the house's authority statement. This typographic relationship — large italic / small roman — is central to the K&A visual identity. It must not be simplified to a single line or a single font treatment.

**12. Section rhythm: light → dark → light → dark alternation.**
The page moves: Hero (dark) → Manifesto (light) → Collection Story (light) → Bestsellers (light) → Celebrity (dark) → Lookbook (light) → Voices (dark) → Collections Directory (dark) → Craft Strip (dark) → Appointment (dark image) → Newsletter (dark) → Footer (dark). This rhythm creates cinematic pacing. If sections are reordered, or if a new section is inserted without considering this rhythm, the page will lose its editorial flow. Any future additions must respect this light/dark cadence.
