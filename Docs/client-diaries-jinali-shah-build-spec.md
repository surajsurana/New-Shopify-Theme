# Client Diaries — Jinali Shah Entry — Copy & Creative Direction
**Document version:** 1.0
**Date:** 5 September 2026
**Status:** Copy and creative direction only — no Shopify write performed. Ready for Technical Director to create the article, metaobject, and metafield values exactly as specified below. Matches the standing pattern of `Docs/abandoned-cart-checkout-emails-build-spec.md` (copy/decisions document, no code or Admin writes by Creative Director).

---

## 0. What was read before writing this

Per this project's Client Diaries precedent, nothing below was drafted from the build spec alone — the actual live entry was read directly via Shopify Admin API before writing a word:

- **`.claude/agents/creative-director.md`** and this project's `CLAUDE.md` standing rules (voice, occasion-breadth principle, pipeline/QA gates).
- **`Docs/client-diaries-build-spec.md`** — the original page concept (spreads-as-editorial, occasion breadth as structural, buy-path-stays-reachable).
- **`Docs/client-diaries-handoff-2026-08-11.md`** — the real field/metaobject architecture as actually implemented.
- **The live Simran Bandukwalla entry, fetched directly from Shopify Admin**, not summarized from docs:
  - `article.summary`: *"My experience was so so good!! I truly loved all my outfits. I think my most favourite would be the red outfit. It made me feel like a total princess!!"* — **kept verbatim**, including the double exclamation marks and informal "so so good." This is the single most important calibration finding below (see §2).
  - `custom.client_diary_atelier_note`: *"It was such a pleasure being a part of her bridal journey! She initially came in looking for the perfect red outfit — and we're so happy she ended up falling in love with our designs and choosing three outfits for her wedding functions."* — two sentences, ~50 words, K&A's own voice narrating the client's arc, not restating the review.
  - All three `client_diary_look` metaobjects (`look_name`, `look_description`, `look_images` order, `category_link`, `cta_label`, `product_link`) — see §5 for how these calibrated Jinali's fields directly.
  - `article.tags`: `["Sangeet & Cocktail"]` — confirming occasion is stored as a tag, one value.
  - `custom.client_diary_year`: `"2025"` (single line text, set independently of the article's actual publish date of 2026-08-11) — confirms this field is an editorial "year of the event," not a publish-date mirror.
  - The article's featured image (`cd-simran-maroon-3.jpg`) is the **third and final image** in the primary look's `look_images` list — the most editorial, full-length, environmental shot of the set, not the first or a close-up. This is the load-bearing precedent for Jinali's hero choice in §4.
  - **`product_link` is blank (`null`) on all three of Simran's looks.** All three instead carry a populated `category_link` pointing to the same real collection (`/collections/lehengas`) plus a distinct `cta_label` per look. **No live example of the "leave both blank" path exists** — every real look built so far uses the soft category CTA. This is decisive for §6 below.
- **All four real Jinali photos**, viewed directly (not from the docx description alone) — confirms and extends the docx's descriptions; see §3.

---

## 1. Source facts (given, not re-litigated)

- **Client:** Jinali Shah. Consent for name + photos: **explicitly confirmed by the client, cleared to publish.**
- **Occasion:** Welcome Event — the client's own name for it is **"Saanjh Swagat."** Per Suraj: a distinct occasion type from destination-wedding functions proper — "a small lunch or a welcome event at the time of check-in... to keep guests busy" while rooms aren't ready, after travel. Technical Director is adding "Welcome Event" as a genuine fifth occasion tag in parallel with this document — used as the occasion label throughout.
- **Year:** 2026.
- **Garment (source docx string):** "Sage Green Jacquard Butti Corset With Drape Skirt & Stole."
- **Client's testimonial (verbatim, real):** *"Hello, Thank you for such a lovely outfit! The color was beautiful, and the fit was absolutely perfect. It was just right for the Welcome event, Saanjh Swagat. I received so many compliments and truly loved wearing it!"*
- **Confirmed by Technical Director:** this is a genuine one-off custom piece with **no matching product anywhere in the Shopify catalogue.** Not treated as a gap — see §6.

---

## 2. `article.summary` — decision and reasoning

**Calibration finding:** Simran's live `article.summary` is her review **essentially verbatim** — house style does not smooth a real client's voice into brand-copy register. Double exclamation marks, casual phrasing ("so so good"), and superlative-adjacent language a normal Creative Director pass would flag as generic ("total princess") are all left standing, because in a testimonial field the client's own voice *is* the content, not something to be edited toward house restraint. Restraint in this project governs K&A's own copy (headlines, CTAs, atelier notes) — it does not govern what a real client is quoted as having said.

**Applying that to Jinali's quote, one edit only:** her testimonial opens with **"Hello, Thank you for such a lovely outfit!"** — the word "Hello," is a salutation addressed to K&A directly, an artifact of it originally being a thank-you message rather than a testimonial written for publication. Simran's quote has no equivalent salutation scaffolding to compare against, but a "Hello," at the top of a pull-quote that will sit under the client's name and photo on the page reads as a stray fragment of correspondence, not a spoken testimonial — the one place a light edit is warranted, distinct from smoothing her actual sentiment or word choices. Everything else — including the exclamation marks — is kept exactly as she wrote it, per the Simran precedent.

**Final `article.summary` value:**

> Thank you for such a lovely outfit! The color was beautiful, and the fit was absolutely perfect. It was just right for the Welcome Event, Saanjh Swagat. I received so many compliments and truly loved wearing it!

(One capitalization normalization only: "Welcome event" → "Welcome Event," matching the occasion tag's own capitalization. No other word changed, added, or removed.)

---

## 3. The four real photos — what they actually show

Viewed directly (not inferred from the docx description alone):

| File | Confirmed content |
|---|---|
| `image3.jpeg` | Solo, close/mid portrait. Warm, candid smile, looking down-and-away rather than at camera. Mehndi clearly visible on both hands and forearms. Close enough to read the corset's jacquard ridge-texture and the sweetheart neckline construction in detail. Backdrop: cream haveli/palace wall, bougainvillea in hot pink just visible at frame edge. |
| `image4.jpeg` | Couple portrait — Jinali with a man (cream/ivory suit, sage-green shirt underneath, matching her palette) in front of a palace facade with potted bougainvillea either side. Both facing camera, easy, unposed-feeling smile from Jinali. |
| `image5.jpeg` | Solo, full-length, wide environmental shot — small figure against a genuinely grand yellow-and-white haveli facade (arched balconies, carved jharokhas), shot through a foreground frame of blurred bougainvillea. Candid over-the-shoulder smile, mid-turn. |
| `image6.jpeg` | Solo, full-length, seated on the palace's front steps directly beneath an ornate scalloped archway and a pair of carved wooden doors, floral arrangements flanking the steps either side. The single most deliberately composed, editorial frame of the four — symmetrical architecture, direct-to-camera gaze, skirt fanned out fully visible. |

All four share one continuous location (a Rajasthani-style palace/haveli, bougainvillea throughout) — no city or property name is asserted anywhere in this document, since none was confirmed in source; "palace courtyard" is used descriptively only.

---

## 4. Article title, handle, and hero image — decision and reasoning

- **Title:** `Jinali Shah` — matches the Simran precedent exactly (name only, no occasion or garment appended to the title itself; the occasion/garment context lives in the tag, hero image, and body fields instead).
- **Handle:** `jinali-shah` (standard slug of the title, same pattern as `simran-bandukwalla`).
- **Tags:** `["Welcome Event"]` — the new occasion tag, single value, matching the one-tag-per-entry pattern Simran's entry uses.
- **Hero / featured image: `image6.jpeg`** (seated on the palace steps, ornate doorway).
  **Reasoning:** Simran's featured image is not her first or most intimate photo — it's the **last, most editorial, full-length, environmental** shot in her primary look's image list (`cd-simran-maroon-3.jpg`, "walking a red candlelit aisle"). `image6` is the direct equivalent for Jinali: full-length, alone in frame, the most deliberately composed of the four, and — critically — a shot that reads correctly as a stand-alone cover image at hero-banner width without needing a companion (unlike the couple shot, which loses meaning cropped tight, or the close-up, which is too intimate/small-scale to anchor a full-bleed hero). It is placed last in the `look_images` order below, consistent with where Simran's hero sits in her own look's list.

---

## 5. `custom.client_diary_atelier_note` — decision and reasoning

**Calibration finding:** Simran's real note is short — two sentences, ~50 words — and does not restate her review. It's K&A's own voice narrating a specific, concrete fact about her arc (came in for one thing, left with three). It is not generic ("we loved working with her") — it's specific to what actually happened.

Jinali's note follows the same shape: short, specific, and built around the one genuinely distinctive fact of this entry — that "Welcome Event" is a new kind of occasion for this section, and the note should show K&A understood the brief precisely (a garment that performs through a long, informal hosting window, not a ceremonial peak moment), rather than defaulting to generic bridal language the occasion doesn't call for.

**Final value:**

> A Saanjh Swagat is the very first hour of hosting a wedding — guests arriving off long journeys, rooms not yet ready, introductions still being made. It calls for a piece with enough presence to greet a full room and enough ease to wear straight through an afternoon of it. The sage green corset was built with exactly that hour in mind — and by every account, it held up through all of it.

(Three sentences, ~72 words — slightly longer than Simran's two-sentence note because it's carrying one additional job Simran's didn't need to: introducing a genuinely new occasion type to a reader encountering it for the first time on this page. Still well within the same register — no superlatives, no exclamation marks, specific rather than generic.)

**`custom.client_diary_year`:** `2026` (single line text field, per source).

**`custom.client_diary_consent`:** `true` (explicit client consent confirmed).

---

## 6. The `client_diary_look` metaobject — full field values

**One look only** (this entry has a single garment, unlike Simran's three).

### `look_name`
> The Sage Green Jacquard Corset with Drape Skirt & Stole

**Reasoning:** Simran's three `look_name` values are all clean, garment-only labels ("The Maroon Corset with Fishcut Lehenga," "The Pink Embroidered Lehenga with Blouse," "The Golden Blouse & Fishcut Lehenga") — never carrying secondary craft/motif detail, which instead lives in `look_description`. The docx's literal string ("Sage Green Jacquard **Butti** Corset With Drape Skirt & Stole") puts the motif detail ("Butti," a small repeating weave motif) inside the name itself — inconsistent with how the shipped precedent actually separates these two fields. Rephrased to match: the name stays a clean garment label ("The [colour] [fabric] Corset with [detail] & [detail]," mirroring Simran's "with X" / "& Y" conjunction pattern exactly), and the "butti" motif detail is moved into `look_description` below, where Simran's own craft/setting specifics live.

### `look_description`
> A sage green jacquard corset with a butti motif, paired with a drape skirt and stole, worn through an afternoon of welcoming guests amid palace courtyards and bougainvillea.

**Reasoning:** Matches Simran's `look_description` pattern precisely — one sentence, restates the garment in slightly more descriptive/tactile language than the name (this is where "butti" belongs), then names the occasion/setting concretely (hers: "worn across the couple portrait, cake table, and the candlelit aisle walk" / "worn for a daylight garden celebration"). Word count (~27) sits within the range of her three (13–25 words), on the higher end because this entry carries three garment components (corset, skirt, stole) where hers carry two.

### `look_images` — order and reasoning

| Order | File → suggested asset filename | Alt text |
|---|---|---|
| 1 | `image4.jpeg` → `cd-jinali-sagegreen-1.jpg` | Jinali Shah in a sage green jacquard corset with drape skirt, couple portrait at a palace courtyard |
| 2 | `image3.jpeg` → `cd-jinali-sagegreen-2.jpg` | Jinali Shah in a sage green jacquard corset with drape skirt, close portrait with mehndi detail against a bougainvillea backdrop |
| 3 | `image5.jpeg` → `cd-jinali-sagegreen-3.jpg` | Jinali Shah in a sage green jacquard corset with drape skirt, candid full-length moment in a palace garden |
| 4 | `image6.jpeg` → `cd-jinali-sagegreen-4.jpg` | Jinali Shah in a sage green jacquard corset with drape skirt and stole, seated on palace steps before an ornate doorway |

**Reasoning:** Mirrors Simran's maroon-look ordering rhythm exactly — hers runs couple portrait → candid in-the-moment shot → editorial full-length closer (which then doubles as the article hero). Jinali's has no candid-action equivalent of a cake-table moment, so the middle slot goes to the wide environmental candid (`image5`) instead, then closes on the most composed, full-length editorial frame (`image6`) — same shape: open on relationship/context, move through a candid or detail beat, close on the strongest standalone image, which is also the hero. Filenames follow the existing repo convention (`cd-simran-maroon-1.jpg`, `cd-simran-pink.jpg`, etc.) — `cd-jinali-sagegreen-1.jpg` through `-4.jpg`.

### `cta_label`
> Explore Welcome Event Pieces

**Reasoning:** Simran's first (primary) look uses her occasion tag directly in the label ("Explore Sangeet & Cocktail Pieces"); her other two use category/craft-forward labels instead ("Explore Festive Lehengas," "Explore Signature Pieces"). Since "Welcome Event" is a brand-new occasion this entry is introducing, reinforcing it in the CTA label — the same choice Simran's primary look made with her own occasion tag — does double duty: it reads naturally as an invitation, and it repeats the new occasion name a second time on the page, helping it register as a real, named category rather than a one-off phrase.

### `category_link` and `product_link` — decision

**Decision: set `category_link`, leave `product_link` blank. Same pattern as all three of Simran's looks — do not use the "leave both blank" path.**

**Reasoning:**
1. **This is the proven pattern, not a fallback one.** Every look on the one real Client Diaries entry that has ever shipped uses a populated `category_link`; the "leave both blank, hide the block" path is a theoretical alternative confirmed to exist in the Liquid, but it has never actually been exercised on a live entry. Absent a specific reason to deviate, matching the pattern that's actually shipped is the safer and more consistent choice.
2. **A genuinely relevant real collection exists.** `/collections/corsets` is a real, live, populated Shopify collection (153 products, confirmed via `search_collections`) built specifically around the garment's own construction type — a more direct category match than Simran's `/collections/lehengas` link is to her fishcut-lehenga-plus-blouse looks, if anything. There is no ambiguity about which collection is the honest "explore similar craft" destination here.
3. **The "hide the block entirely" path is the right call when no relevant category exists at all** — that's not this case. Blanking the CTA here would be a worse reader experience for no reason: a visitor reading about a bespoke corset who wants to see more corsetry has somewhere real and specific to go.

**Final values:**
- `category_link`: `https://karishmaashita.com/collections/corsets`
- `product_link`: blank (no matching product exists — confirmed, not re-litigated per the task brief)

### Suggested metaobject handle
`sage-green-jacquard-corset-with-drape-skirt-stole` (auto-slug of `look_name`, consistent with how Simran's three looks were handled — e.g. `the-maroon-corset-with-fishcut-lehenga`).

---

## 7. Full field summary (for direct entry, no further judgment calls needed)

**Article**
| Field | Value |
|---|---|
| Title | Jinali Shah |
| Handle | jinali-shah |
| Blog | Client Diaries (`client-diaries`) — existing blog, reuse |
| Tags | Welcome Event |
| Theme template | `diaryentry` (same alternate template Simran's entry uses) |
| Featured image | `image6.jpeg` → `cd-jinali-sagegreen-4.jpg` (seated on palace steps, ornate doorway) |
| `article.summary` | *"Thank you for such a lovely outfit! The color was beautiful, and the fit was absolutely perfect. It was just right for the Welcome Event, Saanjh Swagat. I received so many compliments and truly loved wearing it!"* |
| `custom.client_diary_consent` | `true` |
| `custom.client_diary_atelier_note` | *"A Saanjh Swagat is the very first hour of hosting a wedding — guests arriving off long journeys, rooms not yet ready, introductions still being made. It calls for a piece with enough presence to greet a full room and enough ease to wear straight through an afternoon of it. The sage green corset was built with exactly that hour in mind — and by every account, it held up through all of it."* |
| `custom.client_diary_year` | 2026 |
| `custom.client_diary_looks` | 1 reference → the metaobject below |

**`client_diary_look` metaobject**
| Field | Value |
|---|---|
| `look_name` | The Sage Green Jacquard Corset with Drape Skirt & Stole |
| `look_description` | A sage green jacquard corset with a butti motif, paired with a drape skirt and stole, worn through an afternoon of welcoming guests amid palace courtyards and bougainvillea. |
| `look_images` (in order) | 1. `image4.jpeg` (couple) → 2. `image3.jpeg` (close portrait) → 3. `image5.jpeg` (candid full-length) → 4. `image6.jpeg` (seated, editorial — also article hero) |
| `category_link` | `https://karishmaashita.com/collections/corsets` |
| `cta_label` | Explore Welcome Event Pieces |
| `product_link` | *(blank — no matching product exists)* |

---

## 8. What Technical Director still needs to do (not part of this document)

1. Confirm the "Welcome Event" occasion tag has actually landed as a real, filterable value on the Client Diaries index/filter logic (parallel work, referenced but not owned by this document).
2. Upload the four photos as theme/file assets under the suggested filenames, or Shopify's own generated filenames if preferred — the filenames above are a suggestion for repo-naming consistency with the existing `cd-simran-*` convention, not a hard requirement.
3. Create the article, the metaobject, and set all fields per §7 — no further copy or ordering decisions required.
4. Standard QA gate applies once live on staging: independent verification against this document (not just "fields were entered"), per this project's standing QA rule. This is a content/metafield change to the live theme's data, not a code change, but the same never-skip-QA principle applies before anything is reported "done" to Suraj.
5. `git commit`/push is not applicable to this deliverable (metaobject/article content lives in Shopify's database, not theme files) — no theme files changed by this document.

---

## 9. Build complexity

**Simple.** No new metaobject definition, no new metafield definition, no new Liquid — the entire schema (`client_diary_look`, the four article metafields, the `diaryentry` template) already exists and is already proven live with Simran's entry. This document is pure content population against an existing, working system. The only genuinely new structural element (the "Welcome Event" tag value) is explicitly Technical Director's parallel work, not something this document's content depends on being built in a new way — it's a new value in an existing field, not a new field.
