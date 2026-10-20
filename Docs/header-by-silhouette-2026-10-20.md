# Header: By Silhouette moves into the Collections panel (2026-10-20)

Prototype: `Prototypes/header-by-silhouette-v1.html` (real nav CSS copied from `assets/ka-nav.css`; viewport switcher 1470 / 1024 / 390; hover, click, keyboard and the drawer accordion all work).
Overrides the earlier "Primary nav: leave it alone" call in `Docs/category-pages-and-owned-fixes-design-2026-10-20.md`, per Suraj, 2026-10-20.

## 1. Decision

Option chosen: **a slim "Collections" panel** with two short columns, The Collections | By Silhouette. Not a separate "By Silhouette" nav item, not flat items.

Why, as Creative Director:
- Three top-level words (Signature, Collections, Client Diaries) is the quietest header in the category. A fourth item, or flat items, adds clutter and starts to read as a marketplace menu. A panel keeps the bar at three words and puts nine destinations one gesture away.
- Silhouette is a way of browsing Collections, not a peer of Collections. Putting it inside the Collections panel keeps that hierarchy honest.
- It is the same pattern the houses use (a hairline panel under the bar, serif links, no imagery, no promos). No images: nothing to load, nothing to crop, no aspect-ratio grid anywhere (Safari-safe).
- Bridesmaid, mother and sister shoppers arrive thinking "a lehenga" or "a saree" before they think "a capsule". Silhouettes in the header serves them directly.

Footer: **Collections column keeps the five capsules only. No "Shop by silhouette" link, nothing.** Reasons: the footer link would point at the same /collections the column title already covers; any substitute re-adds a row to the column Suraj wants shorter; the header now owns silhouette browsing and the search chips already carry the same four. Footer ends up exactly: First Love, The Festive Edit, The Bloom Soirée, Chamakk, Barre Oblique (Loomière first, later).

## 2. Behaviour

Desktop (above 900px):
- "Collections" stays a real link to /collections. Next to it is a small chevron `<button>` (this is the disclosure control, so the link never has to be hijacked). Click, tap, Enter or Space on the chevron toggles the panel. Tapping the word itself navigates, so touch and iPad-landscape users are never trapped behind a hover.
- Hover opens it only when `(hover:hover) and (pointer:fine)`, 140ms intent delay on open and on close (so crossing from link to panel does not flicker). Touch devices never rely on hover.
- Panel is a child of `<nav class="ka-nav">`, positioned `top:100%`, full width, solid `--c-paper`, one hairline bottom border, soft shadow, inner content max 720px centred. Fade plus 6px rise, `--dur-fast`, `--ease-luxury`. Page behind dims very slightly (scrim, rgba(29,25,22,.22)); clicking it closes.
- While open the nav gets `.is-panel-open`, which forces the settled look (paper background, charcoal text). Needed on the homepage, where the nav is otherwise transparent with white text over the hero and would be unreadable above a paper panel.
- Esc closes and returns focus to the chevron. Focus leaving the item plus panel closes it. Links in the panel are plain tabbable anchors. `aria-expanded` and `aria-controls` on the chevron; panel is `role="region" aria-label="Collections"`; hidden state uses `visibility:hidden` so it is not tabbable when closed.
- Panel content: eyebrow title (Jost 0.58rem, 0.24em, antique gold, hairline under), links in Cormorant Garamond 1.22rem, hover gold plus underline draw (same as the nav links). Bottom hairline plus a centred "View all collections" in small caps. Order: The Collections left, By Silhouette right.
- Loomière is NOT shown. When it launches it becomes the first item of the The Collections list and of the drawer list; nothing else changes.

Mobile / drawer (900px and below): the panel and scrim are `display:none`.
- Drawer "Collections" row becomes link plus a 48x48 "+" button (rotates to x). Tapping the word navigates; tapping "+" expands an inline list: eyebrow "The Collections" + 5, eyebrow "By Silhouette" + 4, then "View all collections". Collapsed by default. The collapsed drawer looks exactly as today.
- Sub-links are Jost 0.8rem uppercase (not the large italic serif) so nine rows do not push the drawer into a wall of display type.
- Accordion uses `grid-template-rows: 0fr -> 1fr` (Safari 16+; no aspect-ratio anywhere), inner wrapper has `inert` while collapsed so collapsed links are not tabbable.
- Drawer needs `overflow-y:auto` (it has none today, and expanded it is taller than a short phone). Prototype CSS shows it.

Width check (measured in headless Chrome, logo stays centred, offset 0px at every width): space between the last nav word and the logo is 192px at 1470, 106px at 1280, 62px at 1181, 36px at 1024, 38px at 901. The chevron plus tighter spacing is what makes 1024 and below fit, so the two small media blocks below are required, not optional.

## 3. Exact TD instructions

### 3.1 `sections/ka-nav.liquid`

Menu approach: **read a menu by fixed handle, no section picker.** Reason: ka-nav is placed separately in every template JSON plus `ka-policy-header-group.json`; a link_list picker would need wiring in each, and any that is missed silently shows a different menu. A fixed handle is one source of truth. Admin menu handle: `header-collections` (new menu; live theme does not read it, so creating it is safe). Structure: 5 top-level capsule items, then one top-level item titled "By Silhouette" whose 4 children are Lehengas, Drape Sarees, Indo-Western, Corsets. Keep a hardcoded fallback in the Liquid identical to the prototype so the header is correct with the menu absent or empty.

Liquid logic (render the same data in two places, desktop panel and drawer):

```liquid
{%- liquid
  assign hc = linklists['header-collections']
  assign hc_has = false
  if hc.links.size > 0
    assign hc_has = true
  endif
-%}
```
- Top-level links with `link.links.size == 0` go to the The Collections column (title "The Collections", hardcoded text).
- The first top-level link with children supplies the second column: title = `link.title`, items = `link.links`.
- If `hc_has` is false, render the hardcoded fallback: First Love /collections/first-love, The Festive Edit /collections/the-festive-edit, The Bloom Soirée /collections/the-bloom-soiree, Chamakk /collections/chamak, Barre Oblique /collections/barre-oblique; By Silhouette: Lehengas /collections/lehengas, Drape Sarees /collections/drapes, Indo-Western /collections/indo-western, Corsets /collections/corsets. "View all collections" links to `section.settings.link_collections` (fallback `/collections`), same value as the Collections link.
- Loomière: when it launches, add it as the first item of the Admin menu AND first fallback link. Not before.

Markup (copy exactly from the prototype, `#page`): replace the Collections `<li>` in `.ka-nav__links` with the `li.ka-nav__item` (link + `button.ka-nav__panel-toggle`); add `div.ka-nav__panel#ka-coll-panel` as the last child of `<nav class="ka-nav">`; add `div.ka-nav-scrim#ka-nav-scrim` immediately after that `</nav>`; replace the Collections `<li>` in `.ka-mobile-nav__links` with the row plus accordion block. Keep the existing `is-active` on the Collections link when `template contains 'collection'`. Optional: on a collection template whose handle is one of the four silhouettes, add `is-current` to that panel link (`collection.handle` compare); not needed for launch.

Schema: **no new settings are required.** Labels and URLs for the three top-level items stay as they are. Do not add a url setting with a default. If any new setting is added later keep `name`/`label`/preset names at 25 characters or fewer and header `content` at 50 or fewer. Strings "The Collections" and "View all collections" are hardcoded (no schema).

Existing `.ka-nav__links` currently has one `<a>` per `<li>`; the CSS change below assumes `align-items:center` on the `ul`.

### 3.2 `assets/ka-nav.css`
Copy from the prototype's `<style>`, only the blocks marked NEW or touched:
- `.ka-nav.is-panel-open` added to the three existing selector lists that define the settled look (background, `.ka-nav__links a` colour, `.ka-nav__logo` and `small`, `.ka-nav__icon-btn`).
- `.ka-nav__links{align-items:center}`.
- The `.ka-nav__item`, `.ka-nav__panel-toggle`, `.ka-nav__panel*`, `.ka-nav-scrim` blocks.
- Drawer: `overflow-y:auto` on `.ka-mobile-nav`; `.ka-mobile-nav__links > li` (child combinator, since the Collections li now contains nested lists); the `.ka-mobile-nav__row`, `__sub-toggle`, `__sub`, `__sub-inner`, `__sub-title`, `__sub-all` blocks.
- Two new media blocks: `@media (max-width:1180px)` (gap 22px, letter-spacing .14em, chevron width 18px, actions gap 18px) and `@media (max-width:1000px) and (min-width:901px)` (gap 16px, 0.62rem, letter-spacing .1em, actions gap 12px, logo letter-spacing .06em).
- Inside the existing `@media (max-width:900px)` add `.ka-nav__panel,.ka-nav-scrim{display:none}`.
- Add the `prefers-reduced-motion` rule from the prototype.
- Z-index: scrim 99 (under nav 100), panel inherits nav (100). No clash with the stack documented at the top of the file.

### 3.3 `assets/ka-theme.js`
Add the panel logic (prototype section "Desktop Collections panel") and the accordion toggle (prototype "Mobile drawer + accordion", only the `ka-m-coll-toggle` part; open/close drawer already exists in this file). Guard everything with null checks (nav JS runs on pages where the elements exist, but follow the file's existing style). The existing Escape handler in this file is separate; the new Escape branch only needs to close the panel and return focus to the chevron. Also close the panel on `scroll` past 8px is NOT needed; the scrim already covers it.

### 3.4 `sections/ka-footer.liquid` and the Admin menu
- Edit the Admin menu `footer-collections-2026` so it contains only the 5 capsules (delete the "By Silhouette" item with its 4 children). Loomière first, later.
- In the hardcoded fallback (lines ~105-109) delete the `ka-footer__sublabel` "By Silhouette" `<li>` and the four silhouette `<li>`s.
- The `link.links.size > 0` branch and `.ka-footer__sublabel` CSS can stay (harmless, still supports a grouped menu); delete only if TD wants zero dead code.
- Optional footer cleanup not asked for: none.

### 3.5 Feasibility notes for TD
- Reading `linklists['header-collections']` with nested children via `link.links` is supported in Liquid; menu children nest one level deep here, which Shopify supports. Test with menu present and absent (same as the footer).
- Nothing here needs server code or the checkout boundary.
- Staging checksum verify is mandatory after deploy (header is in the silent-drop list: do not exceed schema limits, no url defaults; no schema is changing so risk is low).

### 3.6 QA checks to request
- 1470x771, 1280, 1181, 1024, 960, 901: logo centred, no nav-word collision.
- Homepage (transparent nav): open panel, nav turns paper, text legible, closes cleanly back to transparent. Scrolled and interior pages likewise.
- Keyboard: Tab to chevron, Enter opens, Tab through links, Esc returns focus. Screen reader announces expanded/collapsed.
- Touch (iPad landscape at 1024): tap word navigates; tap chevron opens; tap scrim closes.
- Mobile 390 and 360: drawer collapsed identical to today; expand shows 9 links plus "View all"; scrolling works with the drawer expanded; the "+" hit area is 48px.
- Safari desktop and iOS (known testing gap): panel transition, `inert`, grid-rows accordion, no aspect-ratio used.
- Footer: Collections column is exactly the 5 capsules, shorter than before.

## 4. Build complexity
Moderate (about a day: one section, one CSS file, one JS block, one Admin menu, one footer deletion). Risk is the 1024 width and the transparent-nav homepage state, both already solved in the prototype.

## 5. Luxury board check
Does it make K&A feel more exclusive and desirable? Yes: three-word header preserved, nine destinations behind one quiet gesture, no imagery, no promo, no badge, serif links on paper, the same hairline and gold language as the rest of the site. Rejected as ordinary: flat items (clutter), separate dropdown for silhouette (equal rank to Collections, wrong hierarchy), image-led mega menu (loud, aspect-ratio risk, more photography to maintain).

## 6. Amendment (2026-10-20, Suraj)
The first panel/drawer column, originally titled "Capsules", is labelled **"The Collections"** (Suraj's choice). Applied to this spec and the prototype; built that way in `sections/ka-nav.liquid`.
