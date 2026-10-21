# Enquiry tracking: Shopify custom pixel -> GA4 `generate_lead`

Built 2026-10-21 (Technical Director). Source: SEO conversion report, section 6.

## What the theme now does

Every WhatsApp / appointment / concierge CTA on the site is a real
`<a href="https://wa.me/<number>?text=..." target="_blank" rel="noopener">` link
carrying two attributes:

- `data-ka-enquiry="whatsapp"` or `"appointment"`
- `data-ka-placement="<stable name>"` (full list in the commit message / change list)

On product pages the links also carry `data-ka-product="<handle>"`.

`assets/ka-theme.js` listens for clicks on any `[data-ka-enquiry]` element and calls

```js
Shopify.analytics.publish('ka_enquiry_click', {
  placement,       // e.g. "pdp-mobilebar-appointment"
  enquiry_type,    // "whatsapp" | "appointment"
  product_handle,  // product handle on product pages, "" elsewhere
  page_path        // window.location.pathname
});
```

The call is wrapped in try/catch and never calls `preventDefault`, so it cannot block or
delay the WhatsApp link opening. The theme itself sends nothing to GA4: the custom pixel
below does that.

## The custom pixel code

Replace `G-XXXXXXXXXX` with the real GA4 Measurement ID before saving.

```js
// K&A enquiry tracking: forwards the theme's 'ka_enquiry_click' event to GA4 as generate_lead.
const GA4_ID = 'G-XXXXXXXXXX'; // <-- REPLACE with the GA4 Measurement ID

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

const s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
document.head.appendChild(s);

gtag('js', new Date());
// send_page_view:false so this pixel does not double-count page views if GA4 is also
// installed via the Google & YouTube channel or another pixel.
gtag('config', GA4_ID, { send_page_view: false });

analytics.subscribe('ka_enquiry_click', (event) => {
  const d = event.customData || {};
  gtag('event', 'generate_lead', {
    lead_source: 'whatsapp',
    enquiry_type: d.enquiry_type || '',
    placement: d.placement || '',
    product_handle: d.product_handle || '',
    page_path: d.page_path || '',
    transport_type: 'beacon'
  });
});
```

Notes:

- `transport_type: 'beacon'` lets the hit survive the new tab opening.
- `enquiry_type`, `placement`, `product_handle`, `page_path` arrive in GA4 as event
  parameters. To report on them, register them once as custom dimensions
  (GA4 Admin > Custom definitions > Create custom dimension > scope: Event).
- Mark `generate_lead` as a key event (GA4 Admin > Events > toggle "Mark as key event").
- If GA4 is already loaded on the storefront through the Google & YouTube channel, keep the
  same Measurement ID so sessions stitch together; otherwise the pixel's events appear as a
  separate stream of hits under the same property.

## Steps for Suraj (cannot be created via the API)

1. Get the GA4 Measurement ID: GA4 Admin > Data streams > the web stream > "Measurement ID"
   (format `G-XXXXXXXXXX`).
2. Shopify Admin > Settings > Customer events.
3. Click "Add custom pixel". Name it `KA Enquiry Tracking (GA4)`. Click "Add pixel".
4. Paste the code above into the code box. Replace `G-XXXXXXXXXX` with the real ID.
5. Permissions: set "Required" is not needed if you only use this for analytics; the cleanest
   setting is Permission = "Not required" with Data sale = "Data collected does not qualify as
   data sale" (this pixel only reports anonymous enquiry clicks). If your consent policy
   requires it, choose "Marketing/Analytics" and the pixel only fires for visitors who
   consented.
6. Click "Save", then "Connect" (top right). The status must read "Connected".
7. Test: open GA4 > Admin > DebugView (or Reports > Realtime). On the storefront, open a
   product page and tap "Appointment" or "Concierge". Within about a minute a
   `generate_lead` event should appear with `placement` and `product_handle` filled in.
   (Shopify's "Test" button in the pixel editor only checks Shopify-standard events; test on
   the live storefront or the staging preview instead.)

## Meta

Nothing is sent to Meta by this build. Do not add a Meta (Pixel `Lead` / CAPI) subscription to
this custom pixel until the Meta Ads team has been consulted (dedupe with any existing
Facebook & Instagram channel events, event naming, and consent handling need agreeing first).
