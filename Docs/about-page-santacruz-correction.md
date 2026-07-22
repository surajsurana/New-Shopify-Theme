# About Page Correction — Santacruz Location (corrected against actual live template)
**Prepared by:** Website Engineering (Claude Code)
**Date:** 2026-07-22
**Status:** DRAFT — for SEO & Discoverability + Suraj review. Not yet built or staged.
**Supersedes:** SEO & Discoverability's `Docs/2026-07-22-about-page-rewrite.md`, which was written against a page structure that does not match what's actually live in this theme.

---

## Why this replaces the original diff

The original diff assumed a generic "Who we are / What K&A offers / Quick facts" page structure, formatted as a single paste-ready HTML blob for the Shopify Page's native `body_html` field. That structure doesn't exist here. The live About page (`templates/page.about-us.json`) is a fully custom-built theme page: Hero → Founders → Vision → Craft → Trust Strip → Stockists → Closing CTA, each section pulling copy from its own theme settings, not from the Page's body field — so the original "ready to paste into Shopify" block would have had **zero effect** on the live page even if pasted.

Two premises in the original diff also didn't hold up against the actual live content:
- **The founding year isn't missing.** The Hero section's eyebrow already reads "The House, Mumbai — Est. 2016."
- **There is no "Quick Facts" Q&A block on this page.** Adding one would be a new content structure, not a copy-only edit — out of scope here; flagged separately below.

What *is* real: **Santacruz is not named anywhere on the page** — three spots just say generic "Mumbai atelier." That gap is genuine and this diff fixes it, applied to the actual section settings.

---

## Corrected diff — `templates/page.about-us.json`

### 1. `ka-about-hero.settings.eyebrow`
**Before:** `The House, Mumbai — Est. 2016`
**After:** `The House, Santacruz, Mumbai — Est. 2016`

### 2. `ka-about-founders.settings.body`
**Before:**
> K&A began the way most quiet houses do — between two people who saw the same picture before either said it aloud. Karishma and Ashita built this atelier on a simple conviction: that a bride's clothing should be made with intention, considered stitch by stitch, rather than assembled off a rack. What started as an instinct between friends is now a Mumbai atelier, where every lehenga, every corset, every draped silhouette begins as a private conversation — long before it becomes a garment.

**After:**
> K&A began the way most quiet houses do — between two people who saw the same picture before either said it aloud. Karishma and Ashita built this atelier in 2016 on a simple conviction: that a bride's clothing should be made with intention, considered stitch by stitch, rather than assembled off a rack. What started as an instinct between friends is now a Santacruz, Mumbai atelier, where every lehenga, every corset, every draped silhouette begins as a private conversation — long before it becomes a garment.

### 3. `ka-about-trust-strip` block `atelier`, `settings.label`
**Before:** `Mumbai Atelier`
**After:** `Santacruz, Mumbai Atelier`
(sublabel "Private consultations, always by appointment" unchanged)

### 4. `ka-about-cta.settings.body`
**Before:**
> One conversation — in our Mumbai atelier, or virtually, wherever you are — is where every K&A garment begins. Tell us about your day. We'll take it from there.

**After:**
> One conversation — in our Santacruz, Mumbai atelier, or virtually, wherever you are — is where every K&A garment begins. Tell us about your day. We'll take it from there.

---

## Deliberately not touched

- **Footer address** (`sections.ka-footer.settings.address`: currently "Mumbai, India") — same gap exists here (site-wide, shared component), but wasn't part of the original ask and touching shared/global components gets its own sign-off in this project. Flagging for a separate decision, not changing it in this pass.
- **"Quick Facts" Q&A block** — doesn't exist on this page. If SEO/Suraj still want a fact-dense Q&A block on the About page specifically (distinct from the new FAQ page already in progress), that's a new content structure and would need to go through this project's Creative Director design pass, not a copy-only edit.
- **Price range** — original diff explicitly deferred this; still deferred here.

---

## Founders' names

Not touched — already correct and already present multiple times on the live page (Hero title, Founders section body and caption, CTA section implicitly). No gap here to begin with; matches what the original diff also (correctly) noted.
