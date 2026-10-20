# Category pages + owned fixes: RELEASE CHECKLIST (store data to change at release time)

Rule: store data is shared by LIVE and STAGING. Nothing below may be applied before the staging -> main release is approved by Suraj. Apply immediately after (or together with) the `main` push.

## A. Data changes to APPLY AT RELEASE
| # | Item | Change | Why deferred |
|---|---|---|---|
| 1 | D1 collection titles (Admin > Collections; handles unchanged) | `Drapes` (gid 446985011490, handle `drapes`) -> `Drape Sarees`; `Indo Western` (446985044258, `indo-western`) -> `Indo-Western`; `Lehengas` (447410176290) and `Corsets` (670715281698) already read correctly, no change | Live hero H1s print `collection.title`; renaming now changes Live pages |
| 2 | Collection descriptions | Review the list in the release report. Clear (or approve) any description Suraj does not want visible; the new "About this Collection" block prints every non-empty description. Corsets' ~450-word description is intended. | New block makes existing descriptions visible only after release |
| 3 | First Love facts strip (#27) - REQUIRED | Update First Love (gid 666638811426) metafields: `custom.lead_time` `8-10 weeks, Made to Order` -> `40–45 working days`; `custom.price_range_display` `₹1,70,000 - ₹4,80,000` -> `₹1,70,000 – ₹4,80,000+` (verified against published products: min 1,70,000, max 4,80,000). NOT previewable on staging: First Love uses the default collection.json (its templateSuffix is empty), so the metafields are the only source | Live reads these metafields now; Suraj may choose to apply it early |
| 4 | Search overlay image tiles | Set the three tile URLs in Theme editor (blank today, every tile goes to /collections). Chip labels ship in code (Lehengas, Drape Sarees, Indo-Western, Corsets; chip 5 empty) | Admin/theme-editor task, not code |
| 5 | Footer menu | Menu `footer-collections-2026` already exists (created in the store; Live never reads that handle). Release templates select it via the section setting. Do NOT create a menu with handle `footer-collections` | Live reads `footer-collections` |
| 6 | Homepage meta description (#6) | Manual, Suraj: Admin > Preferences | Not a theme file |

## B. Already applied (safe, Live does not read these)
- Metafield definitions `custom.hero_eyebrow`, `custom.hero_focus`, `custom.hero_image` (Collection).
- Values on lehengas / drapes / indo-western / corsets (hero_image file, eyebrow, focus).
- Menu `footer-collections-2026` (nested: 5 capsules, "By Silhouette" with 4 children).
- Four hero image files in Admin > Content > Files (`ka-hero-*.jpg|png`).

## C. Loomiere (not launched) - when it launches
- Collections page: add `loomiere` as the first block of chapter one (list-collections.json).
- Cross-link: put `loomiere` first in `cl_capsule_handles` (sections/ka-collection-cross-link.liquid).
- Footer: add Loomiere as the first item in menu `footer-collections-2026`; add as first hardcoded fallback link.
- Search chip 5 label: Loomiere. Create a `collection.loomiere.json` template only if it needs one (the generic `collection.json` already works).
- Do not give it a numbered eyebrow.
