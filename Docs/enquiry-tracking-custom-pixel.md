# Enquiry tracking: Shopify custom pixel -> GA4 `generate_lead`

Built 2026-10-21 (Technical Director). Source: SEO conversion report, section 6.

## What the theme now does

Every WhatsApp / appointment / concierge CTA on the site is a real
`<a href="https://wa.me/<number>?text=..." target="_blank" rel="noopener">` link
carrying two attributes:

- `data-ka-enquiry="whatsapp"` or `"appointment"`
- `data-ka-placement="<stable name>"` (full list below)

On product pages the links also carry `data-ka-product="<handle>"`.

`assets/ka-theme.js` listens for clicks on any `[data-ka-enquiry]` element and calls

```js
Shopify.analytics.publish('ka_enquiry_click', {
  placement,       // e.g. "pdp-mobilebar-whatsapp"
  enquiry_type,    // "whatsapp" | "appointment"
  product_handle,  // product handle on product pages, "" elsewhere
  page_path        // window.location.pathname
});
```

The call is wrapped in try/catch and never calls `preventDefault`, so it cannot block or
delay the WhatsApp link opening. The theme itself sends nothing to GA4: the custom pixel
below does that.

### Placements (every `data-ka-placement` value in the theme)

`404-concierge`, `about-hero-appointment`, `appointment-instore`, `appointment-virtual`, `cart-empty-concierge`, `collection-concierge-enquire`, `collection-concierge-styling`, `collection-empty-first-to-know`, `diary-coming-soon-share`, `diary-more-share`, `diary-share`, `faq-empty-concierge`, `float-concierge`, `footer-appointment`, `footer-concierge`, `footer-contact-number`, `home-hero-appointment`, `home-loomiere-teaser`, `nav-drawer-appointment`, `nav-drawer-concierge`, `page-coming-soon-whatsapp`, `pdp-appointment`, `pdp-inline-whatsapp`, `pdp-invite-appointment`, `pdp-invite-concierge`, `pdp-minibar-appointment`, `pdp-mobilebar-whatsapp`, `pdp-styling-consultation`, `search-empty-concierge`, `search-overlay-concierge`, `visit-whatsapp`

(32 distinct values are present in the theme today, not 26; `home-loomiere-teaser` was added 2026-10-22 for the temporary Loomière teaser.)

## GA4 decision: custom pixel (cookie-stitched), not a theme-side gtag call

Checked the live storefront HTML (2026-10-21): the Google & YouTube app does target
`G-0JW62LQCS4` (plus Google Ads `AW-11384601460`), but it runs inside Shopify's web-pixel
sandbox. There is no `window.gtag` and no `googletagmanager.com` script on the storefront
itself, so a theme-side `gtag('event','generate_lead')` would silently do nothing. Making it
work would mean loading a second gtag.js in the theme (duplicate page_views, extra
third-party script, consent handled by us), which is worse. The custom pixel stays, and is
fixed to join the visitor's real GA4 session.

Problem found by QA: gtag loaded inside the sandbox cannot see the storefront's cookies, so it
mints its own client_id and `generate_lead` shows up as separate unattributed/direct sessions.
Fix: read the real `_ga` (client_id) and `_ga_0JW62LQCS4` (session_id, session number)
cookies with `browser.cookie.get()` and pass them to gtag, and stop the sandbox gtag writing
its own cookies (`client_storage: 'none'`).

## The custom pixel code

GA4 Measurement ID: `G-0JW62LQCS4` (account 325873901, property 454935652, web stream karishmaashita.com).

```js
// K&A enquiry tracking: forwards the theme's 'ka_enquiry_click' event to GA4 as generate_lead,
// stitched to the visitor's real GA4 session via the first-party _ga cookies.
const GA4_ID = 'G-0JW62LQCS4';
const SHOP_ORIGIN = 'https://karishmaashita.com';

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

const s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
document.head.appendChild(s);
gtag('js', new Date());

// _ga = GA1.1.<random>.<first-visit-timestamp>  -> client_id = last two parts
function parseClientId(v) {
  const p = (v || '').split('.');
  return p.length >= 4 ? p[p.length - 2] + '.' + p[p.length - 1] : '';
}
// _ga_<ID> = GS1.1.<session_id>.<session_number>.<...>   (older)
//          = GS2.1.s<session_id>$o<session_number>$g...   (newer)
function parseSession(v) {
  v = v || '';
  let m = v.match(/^GS1\.\d\.(\d+)\.(\d+)/);
  if (m) return { id: m[1], num: m[2] };
  m = v.match(/^GS2\.\d\.s(\d+)\$o(\d+)/);
  return m ? { id: m[1], num: m[2] } : { id: '', num: '' };
}

analytics.subscribe('ka_enquiry_click', async (event) => {
  try {
    const d = event.customData || {};
    const clientId = parseClientId(await browser.cookie.get('_ga'));
    const sess = parseSession(await browser.cookie.get('_ga_' + GA4_ID.replace('G-', '')));
    const ctx = (event.context && event.context.document) || {};
    const loc = ctx.location || {};
    const pagePath = d.page_path || loc.pathname || '';

    const cfg = {
      send_page_view: false,        // never double-count page views
      client_storage: 'none',       // sandbox gtag must not write its own _ga cookies
      page_location: loc.href || (SHOP_ORIGIN + pagePath),
      page_referrer: ctx.referrer || ''
    };
    if (clientId) cfg.client_id = clientId;        // if missing, GA4 falls back to a new id
    if (sess.id) cfg.session_id = sess.id;
    if (sess.num) cfg.session_number = sess.num;
    gtag('config', GA4_ID, cfg);

    gtag('event', 'generate_lead', {
      lead_source: 'whatsapp',
      enquiry_type: d.enquiry_type || '',
      placement: d.placement || '',
      product_handle: d.product_handle || '',
      page_path: pagePath,
      session_id: sess.id || undefined,
      engagement_time_msec: 1,      // lets GA4 attribute the event to an engaged session
      transport_type: 'beacon'
    });
  } catch (e) { /* tracking must never throw */ }
});
```

Notes:

- `transport_type: 'beacon'` lets the hit survive the new tab opening.
- `enquiry_type`, `placement`, `product_handle`, `page_path` arrive in GA4 as event
  parameters. To report on them, register them once as custom dimensions
  (GA4 Admin > Custom definitions > Create custom dimension > scope: Event).
- Mark `generate_lead` as a key event (GA4 Admin > Events > toggle "Mark as key event").
- Double-count safety: the pixel sends ONLY `generate_lead` (`send_page_view:false`, no
  ecommerce events) with the same Measurement ID the Google & YouTube app uses.
- Verification after connecting (Suraj/QA): in GA4 DebugView or Realtime, tap a CTA in a
  normal browsing session and confirm the `generate_lead` lands in the SAME session (same
  client, and the session's source/medium is the visitor's real one, not "(direct)/(none)"
  as a new user). If `_ga` is not readable by `browser.cookie.get` in the sandbox (it can
  only read cookies Shopify exposes to the pixel), `clientId` is empty and events fall back
  to unattributed sessions; report that back and we switch to a Measurement Protocol
  approach with a client_id captured by the theme.
- `session_number` is passed only for completeness; GA4 attributes by client_id + session_id.

## Consent (Shopify Customer privacy)

- Custom pixels run only according to their Permission setting. With "Not required" the
  pixel fires for every visitor regardless of their cookie choice, and it then reads the
  `_ga` identifiers and sends them to Google. That is not consent-respecting for visitors
  who declined analytics/marketing (relevant for EU/UK/CA traffic and good practice anywhere).
- Recommended setting: Permission = **Analytics** (the events are measurement of site usage),
  or **Marketing** if Google Ads uses `generate_lead` as a conversion; Data sale = "Data
  collected does not qualify as data sale" only if you do not use it for ad personalisation.
  With this, Shopify holds the pixel until the visitor grants that category (and
  `_ga` cookies are only present once Google & YouTube is itself allowed to run), so
  declined visitors send nothing. Cost: lead counts exclude visitors who declined, which is
  the correct and expected behaviour.
- If the store has no cookie banner and region-based privacy is off (India-only audience),
  Shopify treats consent as granted by default and the pixel behaves the same either way.

## Steps for Suraj (cannot be created via the API)

1. The GA4 Measurement ID is already filled in (`G-0JW62LQCS4`); nothing to look up.
2. Shopify Admin > Settings > Customer events.
3. Click "Add custom pixel". Name it `KA Enquiry Tracking (GA4)`. Click "Add pixel".
4. Paste the code above into the code box (the ID is already in it).
5. Permissions: set Permission = "Analytics" (or "Marketing" if used as a Google Ads conversion); see the Consent section above. Do not use "Not required".
6. Click "Save", then "Connect" (top right). The status must read "Connected".
7. Mark `generate_lead` as a key event in GA4 (Admin > Events / Key events; needs Editor
   access). The event only appears in that list after it has fired once, so do this after the
   test in step 8, or toggle it from Admin > Key events > New key event by name.
8. Test: open GA4 > Admin > DebugView (or Reports > Realtime). On the storefront, open a
   product page and tap "Appointment" or "Concierge". Within about a minute a
   `generate_lead` event should appear with `placement` and `product_handle` filled in.
   (Shopify's "Test" button in the pixel editor only checks Shopify-standard events; test on
   the live storefront or the staging preview instead.)

## Meta

Nothing is sent to Meta by this build. Do not add a Meta (Pixel `Lead` / CAPI) subscription to
this custom pixel until the Meta Ads team has been consulted (dedupe with any existing
Facebook & Instagram channel events, event naming, and consent handling need agreeing first).
