# Bot / automated checkout sessions: investigation

**Prepared by:** Conversion Analyst (SEO & Discoverability), for Website Engineering
**Date:** 2026-10-21
**Approved by:** Suraj, 2026-10-21 (read-only investigation)
**Sources:** Shopify Analytics (ShopifyQL, `sessions` table) and the Shopify Admin API (abandoned checkouts, shop plan and features, sales channels). Everything here was read-only. I changed nothing in Shopify.
**Follows up:** Finding 2 of `SEO & Discoverability/Docs/conversion/2026-10-conversion-report.md`

Times are IST (the store's timezone, Asia/Kolkata). "Last 30 days" here means 21 Sep to 21 Oct 2026, which is Shopify's `-30d` window today, so it's one day off the 20 Oct report.

---

## Summary

1. **The 9–11 Sep burst was almost certainly Meta's own servers, not shoppers.** About 70 desktop sessions **started directly on a checkout page** (`/checkouts/cn/<token>/en-us`) without visiting the shop first. Every one geolocates to a city where Meta runs a data centre: Prineville, Forest City, Fort Worth, Altoona, Springfield NE (Sarpy County), Gallatin (US), Luleå (Sweden) and Clonee (Ireland). They ran around the clock for about 48 hours, averaged 15 seconds each, and none left contact details. The store has the Facebook & Instagram sales channel connected, and about a third of these sessions carry a "facebook" referrer. The most likely explanation is a Meta crawler testing checkout links, for example to validate the catalogue, review an ad, or check a Shop's checkout link. What triggered it on 9 Sep is unconfirmed.
2. **There are two smaller automated patterns in the last 30 days, and neither is a real shopper:**
   - **"San Jose, no source", 7 sessions (2, 4 and 11 Oct).** Each one is US desktop with no referrer at all (not even "direct"), and each went bag → checkout → stop. Shopify records them with **0 seconds and 0 page views**: a cart and a checkout were created without any page being loaded. People don't do that. It points to a script or app creating carts directly.
   - **A weekly checkout probe, about 9 sessions since August.** One US desktop session a week (Ashburn VA / Washington DC, later San Jose) lands directly on a checkout page. These fell every Monday IST from 3 Aug to 21 Sep, drifting from about 10:00 to exactly 00:00 IST, plus one on Wed 7 Oct. None has appeared since 7 Oct.
3. **They distort the report a lot at the checkout step, and hardly at all for visits.** In the last 30 days, 9 of the 22 "reached checkout" sessions (41%) and 9 of the 57 bag additions (16%) are automated. Over 90 days it's about 86 of 133 checkouts (65%). Corrected funnel below.
4. **There's no harm beyond the numbers.** No fake orders, no fake customer records, and only 1 abandoned-checkout record in the burst window, which was a real shopper. Nothing needs to be blocked urgently. The fix is mainly in reporting, plus a couple of checks only Suraj (or Meta Ads) can do in Admin.
5. **Shopify's checkout bot protection (hCaptcha/reCAPTCHA) isn't available on this plan.** The store is on **Basic** (`shopifyPlus: false`). Shopify's help centre says checkout bot protection is a Shopify Plus feature that you request through Plus support. It also wouldn't stop these sessions, because they never try to pay.

---

## 1. What these sessions look like

### 1a. The 9–11 Sep burst (desktop)

| Day | Desktop visits | Added to bag | Reached checkout | Completed |
|---|---|---|---|---|
| Mon 7 Sep (normal) | 34 | 2 | 1 | 0 |
| Tue 8 Sep (normal) | 38 | 0 | 0 | 0 |
| **Wed 9 Sep** | 67 | 9 | 9 | 0 |
| **Thu 10 Sep** | 73 | 31 | 36 | 0 |
| **Fri 11 Sep** | 68 | 25 | 27 | 0 |
| Sat 12 Sep (normal) | 39 | 2 | 1 | 0 |

Mobile was normal throughout: 0 to 5 bag additions a day.

**Where they started.** Of the 72 desktop checkouts on 9–11 Sep, **69 came from sessions whose landing page was the checkout itself** (`/checkouts/cn/<random token>/en-us`), each with its own token. No storefront page came first. All were set to US English (`en-us`), including those from Sweden and Ireland. The other 3 checkouts were one real US shopper on `/products/chokletii` (see 1d).

**Cities.** The checkout-landing sessions on 9–11 Sep (IST), by city:

| City (Shopify geolocation) | Visits | Bag | Checkout | What's there |
|---|---|---|---|---|
| Prineville, Oregon | 25 | 17 | 19 | Meta data centre |
| Luleå, Sweden | 13 | 9 | 11 | Meta data centre |
| Forest City, North Carolina | 12 | 9 | 9 | Meta data centre |
| Fort Worth, Texas | 11 | 7 | 8 | Meta data centre |
| Clonee, Ireland | 10 | 7 | 7 | Meta data centre |
| Springfield, Nebraska (Sarpy County) | 9 | 8 | 8 | Meta data centre (Papillion/Sarpy) |
| Altoona, Iowa | 7 | 5 | 5 | Meta data centre |
| Gallatin, Tennessee | 4 | 1 | 1 | Meta data centre |
| Chicago, Illinois | 5 | 2 | 4 | Mixed: includes the real Chokletii shopper |

These are all-session counts for those cities on 9–11 Sep. A few sessions per city landed on product pages instead of checkout, which is normal Meta crawler behaviour after an ad or catalogue update. Data-centre locations are from public directories ([datacentermap.com, Meta](https://www.datacentermap.com/c/meta/datacenters/)), which are third-party listings, not Meta's own pages. **The "Sweden and Ireland" visits are Meta's European data centres, not European shoppers.**

**Source.** 25 US, 3 Ireland and 2 Sweden checkout-landing sessions carry a "facebook" referrer. The rest show as "direct" (no referrer).

**Timing.** The sessions start around 19:00 IST on 9 Sep, run at 1 to 6 per hour through the night and the next day, and stop around 17:00 IST on 11 Sep (one straggler at 02:00 IST on 12 Sep). There's no human day/night rhythm.

**Behaviour.** Checkout-landing sessions averaged **15 seconds** and 1.7 page views, with 0% "bounce", because the checkout counts as an action. For comparison, normal desktop visits in the last 30 days average 115 seconds and 4.9 page views.

### 1b. The weekly checkout probe (Aug → Oct)

| Date (IST) | Time (IST) | City | Bag | Checkout |
|---|---|---|---|---|
| Mon 3 Aug | ~10:00 | Ashburn, VA | 1 | 1 |
| Mon 10 Aug | ~08:00 | Washington, DC | 1 | 1 |
| Mon 17 Aug | ~07:00 | Ashburn, VA | 1 | 1 |
| Mon 24 Aug | ~05:00 | Ashburn, VA | 1 | 1 |
| Mon 31 Aug | ~04:00 | Washington, DC | 1 | 1 |
| Mon 7 Sep | ~02:00 | Ashburn, VA | 1 | 1 |
| Mon 14 Sep | ~00:00 | Ashburn, VA | 1 | 1 |
| Mon 21 Sep | ~00:00 | Ashburn, VA | 1 | 1 |
| Wed 7 Oct | ~23:00 | San Jose, CA | 1 | 1 |

Each one is a single desktop "direct" session that lands on a checkout URL. Ashburn is a cloud-hosting hub (AWS and others), so the city doesn't identify the owner. The steady weekly Monday cadence, settling at midnight IST, looks like a scheduled job. **I couldn't identify whose job it is.** I searched the K&A Marketing, Website Engineering and SEO folders for anything that opens cart or checkout URLs (scripts, routines, agent docs) and found nothing. The theme's own scripts and the Google Reviews sync don't touch checkout. It stopped after 7 Oct.

### 1c. "San Jose, no source" (Oct)

| Date (IST) | Time (IST) | Visits | Bag | Checkout | Landing page |
|---|---|---|---|---|---|
| Fri 2 Oct | ~15:00 | 3 | 3 | 3 | Homepage |
| Fri 2 Oct | ~21:00 | 1 | 1 | 1 | Homepage |
| Sun 4 Oct | ~23:00 | 1 | 1 | 1 | Homepage |
| Sun 11 Oct | ~17:00 | 1 | 1 | 1 | Homepage |
| Sun 11 Oct | ~22:00 | 1 | 1 | 1 | Homepage |

All 7 are US desktop sessions from San Jose, CA. The referrer source is **null**, which Shopify shows differently from "direct". Average duration is **0 seconds** and **0 page views**, yet each has a bag addition and a checkout. No session in the 90 days before 2 Oct has this signature, and none since 11 Oct. It's consistent with something creating carts and checkouts through an API or script (an app's health check, a feed or checkout validator, or a monitoring tool), not a person using the site. The owner is unidentified.

### 1d. The one real shopper in the burst window

Shopify's abandoned-checkout list has exactly **2 records** from 8–12 Sep:
- 8 Sep, US, Jacqueline Fernandes in our Olive Green Drape, ₹30,000. This is before the burst.
- 10–11 Sep, US, Chokletii Corset and Drape, ₹42,000. This matches the 3 desktop sessions landing on `/products/chokletii`, a genuine shopper.

None of the roughly 70 Meta-data-centre checkouts produced an abandoned-checkout record. That fits automated sessions that never entered an email or phone number.

---

## 2. Verdict: bots, tests, real people, or artefacts?

| Pattern | Sessions (bag / checkout) | Verdict | Confidence |
|---|---|---|---|
| 9–11 Sep checkout-landing burst | ~70 (≈64 / ≈70) | **Automated, from Meta's infrastructure** (crawler or validator opening checkout links) | High that it's Meta-origin automation. Medium on the exact trigger. |
| Weekly Monday checkout probe | 9 (9 / 9), Aug–Oct | **Automated scheduled job**, owner unknown | High that it's automated |
| San Jose null-source | 7 (7 / 7), Oct | **Automated or measurement artefact** (cart + checkout with no page view) | High that it's not a person |
| Chokletii sessions 10–11 Sep | 3 (2 / 3) | **Real shopper** | High (matches an abandoned-checkout record) |

**Why Meta and not a generic scraper:** every burst city is a Meta data-centre location, including both European ones. A third of the sessions carry a facebook referrer, and the store's **Facebook & Instagram** sales channel is connected (confirmed via the Admin API publications list). A generic scraper or uptime monitor would normally run from one or two cloud regions, not from eight Meta sites at once.

**Why checkout links:** a session can only *start* on `/checkouts/cn/<token>` if it opened a link that creates a cart and redirects to checkout, such as a cart permalink (`/cart/<variant>:<qty>`). Shopify then logs the cart addition and the checkout in the same instant. That matches the bag ≈ checkout counts. Meta sends crawlers to links held in its systems: catalogue product links, ad destination links, and checkout links used for Shops. Which one caused this on 9 Sep **is not visible in Shopify data.** The Meta Ads learning log has no entry for 8–11 Sep.

**What I could NOT check:** Shopify analytics has no user-agent, IP or bot-flag field for sessions (I tested `session_browser` and `session_os`, and they don't exist). So the "Meta" attribution is based on geography and referrer, not on a user-agent string.

---

## 3. Corrected funnel

### Last 30 days (21 Sep – 21 Oct 2026)

Excluded: 7 San Jose null-source sessions, plus 2 weekly-probe checkout-landing sessions (Ashburn 21 Sep, San Jose 7 Oct). That's **9 sessions, 9 bag additions, 9 checkouts, 0 orders.** The 30 Sep Honolulu checkout-landing session reached neither bag nor checkout, so it's left in. It changes nothing.

| Step | As reported by Shopify | Corrected | Corrected rate |
|---|---|---|---|
| Visits | 11,066 | **11,057** | |
| Added to bag | 57 | **48** | 0.43% of visits |
| Reached checkout | 22 | **13** | 27% of bag-adders (13/48) |
| Completed checkout | 2 | **2** | 15% of checkouts (2/13) |
| Conversion (orders ÷ visits) | 0.018% | 0.018% | |

**By device (last 30 days, corrected):**

| Device | Visits | Bag | Checkout | Completed |
|---|---|---|---|---|
| Mobile | 10,031 | 38 (0.38%) | 9 | 1 |
| Desktop | 966 (was 975) | **10 (1.0%)**, was 19 | **4**, was 13 | 1 |
| Tablet / other / unknown | 60 | 0 | 0 | 0 |

**By source (last 30 days, corrected):**

| Source | Visits | Bag | Checkout | Completed |
|---|---|---|---|---|
| Social | 7,466 | 25 | 6 | 0 |
| Direct | 2,369 (was 2,371) | 12 (was 14) | 4 (was 6) | 1 |
| Search | 1,182 | 11 | 3 | 1 |
| Unknown | 40 | 0 | 0 | 0 |
| (null source) | 0 (was 7) | 0 (was 7) | 0 (was 7) | 0 |

**What changes in the report's reading:**
- The desktop advantage over mobile is smaller than reported: **about 2.7× mobile (1.0% vs 0.38%)**, not 5×. The report's own estimate after removing suspects (1.2%) was close.
- **Mobile now has more real checkouts (9) than desktop (4).**
- Real checkouts in 30 days: **13**, which fits the 4 distinct abandoned-checkout shoppers (several with repeat attempts) plus 2 orders.
- Sample-size warning: 13 checkouts and 2 orders are too few to compare checkout completion by device or source.

### Previous 30 days and 90 days (approximate)

| Window | Checkouts reported | Automated (this investigation) | Real checkouts | Orders |
|---|---|---|---|---|
| 90 days (22 Jul – 20 Oct) | 133 | ≈86 (≈79 checkout-landing + 7 San Jose) | **≈47** | 11 |
| Previous 30 days (≈21 Aug – 19 Sep) | 94 | ≈74 (burst ≈70 + weekly ≈4) | **≈20** | 5 |

These are approximate because the report's windows differ from mine by about a day. Bag additions in these windows are *also* inflated by the pre-4-Sep accidental-tap bug (report Finding 1), so don't reuse them as a baseline.

**Going forward, the simplest reliable filter for monthly reports:** exclude sessions where `landing_page_type = 'Checkout'`, or where `referrer_source IS NULL` and the session has a bag addition with 0 page views. In 90 days the only checkout-landing session that might be human was one mobile session in Mumbai on 28 Jul.

---

## 4. What can be checked or changed

### What the Admin API showed (read-only)
- **Plan:** Basic (`shopifyPlus: false`).
- **`shop.features.captcha`: false.** Shopify describes this as "whether a shop's online store *can* have CAPTCHA protection". It's a capability flag, not the on/off state of a setting, and it doesn't describe checkout. I wouldn't read it as "spam protection is off" without Suraj checking the screen below.
- **Sales channels:** Online Store, Point of Sale, **Facebook & Instagram**, Google & YouTube, Shop.
- **Abandoned checkouts:** readable. That's how the real Chokletii shopper was confirmed.

### What the API could NOT show (access denied to this connection)
- **Installed apps** (`appInstallations`): access denied.
- **Web pixels and server pixels / Customer events** (`webPixel`, `serverPixel`): need the `read_pixels` scope, which this connection doesn't have.
- **Checkout bot-protection settings:** not exposed in the Admin API at all.
- **Session user agents or IPs:** not in Shopify analytics.

### What Suraj should check in Shopify Admin (5–10 minutes)
1. **Settings → Apps and sales channels:** list every installed app. Look for anything that monitors the store, validates checkout, syncs feeds or "tests" the store (uptime or checkout monitors, feed or catalogue apps, review or upsell apps). Note anything installed or updated around **2 Oct** (when the San Jose pattern began) or **3 Aug** (first weekly probe).
2. **Settings → Customer events:** list app pixels and custom pixels. A pixel can't create checkouts by itself, but this shows which apps have event access, and Website Engineering needs it anyway for the enquiry-tracking spec.
3. **Settings → Online Store → Preferences → Spam protection:** confirm whether hCaptcha is on for contact, login and account forms. Shopify says it's on by default. This protects forms, **not checkout**, and wouldn't have stopped these sessions.
4. **Checkout bot protection:** this sits under Settings → Checkout ("bot protection") only on **Shopify Plus**, enabled through Plus support ([Shopify help: bot protection](https://help.shopify.com/de/manual/checkout-settings/bot-protection); English page not retrieved, localised copies say the same). **It isn't available on the Basic plan, and it isn't needed here:** it's designed to stop bots *buying* limited stock, and these sessions never attempt payment.
5. **Sales channels → Facebook & Instagram → Settings / Overview:** check for any catalogue re-sync, Shop or checkout change, or an error or warning around 9–11 Sep.

### What the K&A Meta Ads team should check (via SEO Director)
- **Commerce Manager / Events Manager around 9–11 Sep:** a catalogue re-upload, a new product set, a Shops checkout-link change, or a new catalogue (DPA) ad. Any of these would explain Meta's crawlers opening checkout links from eight data centres.
- **Pixel and Conversions API signal quality:** if the Facebook & Instagram channel's pixel fired AddToCart / InitiateCheckout for these ~70 sessions, Meta may have counted about 70 extra checkout events on 9–11 Sep. Those would come from Meta's own crawler, so they're unlikely to match real people. Still worth a glance at Events Manager for an InitiateCheckout spike on those days, and making sure no "Initiated Checkout" custom audience treats them as shoppers.

### What Website Engineering should do (nothing urgent)
- **No blocking or theme change is recommended.** The sessions caused no orders, no customer records and no payment attempts. Blocking Meta's crawlers would risk hurting ads and catalogue review.
- **Technical Director:** once Suraj supplies the app list from step 1, check whether any app creates carts through the API (the San Jose 0-page-view pattern) or runs a weekly checkout check (the Ashburn pattern), and report back. Don't uninstall anything without Suraj's approval.
- **Reporting:** future conversion reports apply the exclusion filter in section 3. SEO & Discoverability's Conversion Analyst will do this from the November report.

---

## Sample-size and confidence notes
- The 9–11 Sep conclusion rests on about 70 sessions with a consistent signature, so it's strong.
- The two smaller patterns (9 and 7 sessions) are clearly non-human by their signatures. Their *owners* are unknown.
- All order-level comparisons stay too small to judge: 2 orders in 30 days, 11 in 90.

## Sources
- Shopify Analytics (ShopifyQL `sessions`) and Shopify Admin GraphQL, store d21bac.myshopify.com, queried 2026-10-21.
- [Data Center Map: Meta data centres](https://www.datacentermap.com/c/meta/datacenters/) (third-party directory).
- [Shopify Help Centre: protecting your store from bots (localised copy)](https://help.shopify.com/de/manual/checkout-settings/bot-protection), [Shopify Help Centre: online store preferences (spam protection)](https://help.shopify.com/manual/online-store/setting-up/preferences).

---

## Meta-side check (K&A Meta Ads, 2026-10-21)

No impact on Meta ads. Ads were credited with 0 InitiateCheckout on 9–11 Sep (2 in all of September). No active ad set optimises on a website event (all optimise for conversations or reach). No remarketing or lookalike audience is seeded from InitiateCheckout, and the existing Add to Cart audiences aren't used by any active ad set. Not checked: raw pixel totals for those days (Events Manager only).
