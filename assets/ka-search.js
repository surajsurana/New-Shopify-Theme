/* ================================================================
   K&A SEARCH — assets/ka-search.js
   Vanilla JS only. No third-party libraries. Loaded defer from
   sections/ka-nav.liquid (renders sitewide, same as ka-theme.js).
   Spec: Docs/search-404-footer-build-spec.md, Section 1.5.

   Behavior ported from Prototypes/search-404-footer-v1.html's inline
   <script> (open/close, debounce, chip-fills-input), rewired from the
   prototype's static PRODUCTS array onto Shopify's real Predictive
   Search endpoint:

     /search/suggest.json?q=QUERY&resources[type]=product&resources[limit]=8
       &resources[options][unavailable_products]=last
       &section_id=ka-predictive-search

   --- 2026-07-12 fix (false "We couldn't find X" on real matches) ---
   This originally relied on Shopify's Section Rendering API: passing
   `section_id` was expected to make /search/suggest.json return the
   rendered HTML of sections/ka-predictive-search.liquid (real .ka-p-card
   markup, zero hand-built templating here) instead of raw resource JSON.

   Root cause, verified directly against production (not assumed):
   curled /search/suggest.json?q=chatak... on karishmaashita.com with
   section_id set to the real section, a bogus section name, and no
   section_id at all (with fresh cache-busting nonces, real browser
   session cookies, UA/Referer, and an explicit Accept: text/html
   header) — every variant returned byte-identical raw JSON
   (Content-Type: application/json), never rendered section HTML. The
   raw JSON itself was correct and DID contain real "chatak" matches
   (Chatak Chamkila Hara, Chatak Neela, etc.) — Shopify's underlying
   predictive-search resource lookup was right all along. The bug was
   purely in this file: it stuffed that raw JSON text into
   resultsContent.innerHTML, so querySelectorAll('.ka-p-card') always
   found 0 nodes and showNoResults() fired on every single query,
   regardless of whether real matches existed. section_id is a
   documented, standard part of this API (Dawn and most OS2.0 themes
   rely on it) and the section file here is correct and unchanged —
   but on this shop, right now, it is being ignored at the platform
   level, confirmed empirically rather than assumed. `section_id` is
   left in the request below as a harmless, forward-compatible no-op
   in case that ever starts working; the fetch below is written to
   accept the actual rendered-HTML path too if it ever appears (see
   parseSuggestResponse), so no further change would be needed here if
   Shopify's behavior changes.

   Fix: consume the endpoint's raw JSON directly (its own
   resources.results.products array is the reliable source of truth —
   it already agreed with /search's own results whenever query terms
   matched) and build the .ka-p-card markup client-side, matching
   sections/ka-predictive-search.liquid's structure field-for-field.
   One real gap versus that section: predictive search's own resource
   JSON does not include product.metafields, so the "fabric" line
   (ka-p-card__fabric) is not available here and is omitted — a small,
   deliberate, documented cosmetic difference from the Collection grid
   / full search page cards, not a functional one.

   Separately confirmed (not the same bug, real platform behavior):
   Shopify's predictive suggest.json resource lookup itself uses
   tighter matching than the full /search page's engine — e.g. "chamakk"
   returns zero products from suggest.json's own JSON, yet /search?q=
   chamakk fuzzy-matches "Chatak Chamkila Hara" correctly. This is a
   genuine difference in the two Shopify-side search implementations,
   not something resources[options][fields] or any other suggest.json
   parameter can bridge — the suggest endpoint deliberately trades
   recall for speed since it fires on every keystroke. Per Suraj's
   fallback instruction, the true zero-match case below no longer shows
   a hard "we couldn't find" dead end — it shows the same real, curated,
   theme-editor-editable popular-search suggestions as the empty state,
   plus a prominent link into the full (more forgiving) /search page,
   rather than a message with no way forward.

   Three states (#ka-search-empty / #ka-search-results / #ka-search-noresults)
   are toggled by the actual product count Shopify's own JSON reports —
   not by trusting a separate boolean — so the no-results branch can
   never drift out of sync with what Shopify actually found.
================================================================ */
(function () {
  'use strict';

  var overlay   = document.getElementById('ka-search-overlay');
  var trigger   = document.getElementById('ka-search-trigger');
  var closeBtn  = document.getElementById('ka-search-close');
  var input     = document.getElementById('ka-search-input');
  var emptyEl   = document.getElementById('ka-search-empty');
  var resultsEl = document.getElementById('ka-search-results');
  var resultsContent = document.getElementById('ka-search-results-content');
  var noResultsEl = document.getElementById('ka-search-noresults');
  var noResultsTitle = document.getElementById('ka-search-noresults-title');
  var noResultsViewAll = document.getElementById('ka-search-noresults-viewall');
  var viewAllLink = document.getElementById('ka-search-view-all');

  if (!overlay || !trigger || !input) return;

  var debounceTimer = null;
  var activeFetch = null;
  var MIN_CHARS = 2;
  var DEBOUNCE_MS = 250;

  function openSearch() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    /* Focus after the entrance transition completes (0.5s) so focus
       doesn't force a layout jump mid-animation (spec §1.5). */
    setTimeout(function () { input.focus(); }, 260);
  }
  function closeSearch() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
  });
  /* No click-outside-to-close by design (spec §1.5) — full-viewport
     takeover has no "outside" to click, same as the mobile drawer. */

  function showEmpty() {
    if (emptyEl) emptyEl.style.display = '';
    if (resultsEl) resultsEl.style.display = 'none';
    if (noResultsEl) noResultsEl.style.display = 'none';
  }
  function showResults() {
    if (emptyEl) emptyEl.style.display = 'none';
    if (resultsEl) resultsEl.style.display = '';
    if (noResultsEl) noResultsEl.style.display = 'none';
  }
  function showNoResults(query) {
    if (emptyEl) emptyEl.style.display = 'none';
    if (resultsEl) resultsEl.style.display = 'none';
    if (noResultsEl) noResultsEl.style.display = '';
    /* Soft, non-dead-end framing (2026-07-12 fix, per Suraj: show real
       suggestions rather than a hard "we couldn't find" stop-sign). The
       chip suggestions and "view all results" link that live inside
       #ka-search-noresults (snippets/ka-search-overlay.liquid) do the
       actual work; this just states the honest, narrower fact instead
       of implying the atelier has nothing to show. */
    if (noResultsTitle) noResultsTitle.textContent = 'No exact matches for "' + query + '"';
    if (noResultsViewAll) {
      noResultsViewAll.href = '/search?q=' + encodeURIComponent(query) + '&type=product';
    }
  }

  /* Shopify's raw predictive-search JSON (see file header) gives price
     as a decimal rupee string (e.g. "75000.00"), not the cents/paise
     integer the rest of the theme's [data-price] elements carry (see
     assets/ka-currency.js's own header comment on that contract). This
     converts once so ka-currency.js's sitewide sweep treats these
     client-built cards identically to server-rendered ones. */
  function toCents(decimalPriceString) {
    var n = parseFloat(decimalPriceString);
    if (isNaN(n)) return 0;
    return Math.round(n * 100);
  }

  /* Default paint before/without ka-currency.js (INR, en-IN grouping —
     e.g. "₹ 1,00,000") — mirrors the "₹ " + grouped-number pattern
     already used sitewide (money_without_trailing_zeros, 'Rs.' -> '₹').
     ka-currency.js's [data-price] sweep (if the currency module is on)
     overwrites this exactly the same way it overwrites server-rendered
     cards — this is only the pre-sweep default text. */
  function formatINR(decimalPriceString) {
    var n = parseFloat(decimalPriceString);
    if (isNaN(n)) return '';
    var hasFraction = Math.round((n % 1) * 100) !== 0;
    var grouped;
    try {
      grouped = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: hasFraction ? 2 : 0,
        maximumFractionDigits: hasFraction ? 2 : 0
      }).format(n);
    } catch (e) {
      grouped = n.toFixed(hasFraction ? 2 : 0);
    }
    return '₹ ' + grouped;
  }

  /* Shopify CDN accepts a ?width= (or &width=) param on any file URL
     for on-the-fly resizing — same mechanism image_url: width: 800
     uses server-side (sections/ka-predictive-search.liquid), applied
     here since the raw JSON gives the CDN URL without one. */
  function cdnWidth(url, width) {
    if (!url) return url;
    return url + (url.indexOf('?') === -1 ? '?' : '&') + 'width=' + width;
  }

  /* Builds one .ka-p-card node, field-for-field matching
     sections/ka-predictive-search.liquid's markup (image, name, price)
     via DOM APIs — not innerHTML string-building — so product titles
     with special characters (e.g. "K&A") can never be mis-parsed as
     markup. Omits the fabric line: predictive search's own JSON
     doesn't include product.metafields (see file header). */
  function buildCard(product) {
    var card = document.createElement('div');
    card.className = 'ka-p-card';

    var imageLink = document.createElement('a');
    imageLink.href = product.url;
    imageLink.className = 'ka-p-card__image';
    imageLink.setAttribute('aria-label', 'View ' + product.title);

    if (product.featured_image && product.featured_image.url) {
      var img = document.createElement('img');
      img.src = cdnWidth(product.featured_image.url, 800);
      img.alt = product.featured_image.alt || product.title || '';
      img.loading = 'lazy';
      img.width = 800;
      img.height = 1067;
      img.className = 'img-filter-coll-page';
      imageLink.appendChild(img);
    } else {
      var placeholder = document.createElement('div');
      placeholder.style.background = 'var(--c-smoke)';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      imageLink.appendChild(placeholder);
    }
    card.appendChild(imageLink);

    var info = document.createElement('div');
    info.className = 'ka-p-card__info';

    var name = document.createElement('p');
    name.className = 'ka-p-card__name';
    var nameLink = document.createElement('a');
    nameLink.href = product.url;
    nameLink.textContent = product.title;
    name.appendChild(nameLink);
    info.appendChild(name);

    var priceEl = document.createElement('p');
    priceEl.className = 'ka-p-card__price';
    var priceSpan = document.createElement('span');
    priceSpan.setAttribute('data-price', toCents(product.price));
    priceSpan.textContent = formatINR(product.price);
    priceEl.appendChild(priceSpan);
    info.appendChild(priceEl);

    card.appendChild(info);
    return card;
  }

  /* Handles both possible response shapes from /search/suggest.json:
     the documented rendered-HTML-fragment shape (if section_id is ever
     honored on this shop — see file header) and the raw-JSON shape it
     actually returns today. Either way this returns a real DOM
     fragment plus the product count actually found, so the caller
     never has to special-case which shape it got. */
  function parseSuggestResponse(contentType, bodyText) {
    var fragment = document.createDocumentFragment();
    var count = 0;

    if (contentType && contentType.indexOf('html') !== -1) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = bodyText;
      var cards = wrapper.querySelectorAll('.ka-p-card');
      count = cards.length;
      while (wrapper.firstChild) fragment.appendChild(wrapper.firstChild);
      return { fragment: fragment, count: count };
    }

    var data;
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      return { fragment: fragment, count: 0 };
    }
    var products = (data && data.resources && data.resources.results && data.resources.results.products) || [];
    var grid = document.createElement('div');
    grid.className = 'ka-search-results__grid';
    for (var i = 0; i < products.length; i++) {
      grid.appendChild(buildCard(products[i]));
    }
    count = products.length;
    fragment.appendChild(grid);
    return { fragment: fragment, count: count };
  }

  function runSearch(query) {
    query = (query || '').trim();

    if (viewAllLink) {
      viewAllLink.href = '/search?q=' + encodeURIComponent(query) + '&type=product';
    }

    if (query.length < MIN_CHARS) {
      showEmpty();
      return;
    }

    if (activeFetch && activeFetch.abort) activeFetch.abort();

    var controller = (window.AbortController) ? new AbortController() : null;
    activeFetch = controller;

    var url = '/search/suggest.json'
      + '?q=' + encodeURIComponent(query)
      + '&resources[type]=product'
      + '&resources[limit]=8'
      + '&resources[options][unavailable_products]=last'
      + '&section_id=ka-predictive-search';

    fetch(url, { credentials: 'same-origin', signal: controller ? controller.signal : undefined })
      .then(function (res) {
        if (!res.ok) throw new Error('Predictive search failed: ' + res.status);
        var contentType = res.headers.get('Content-Type') || '';
        return res.text().then(function (bodyText) {
          return { contentType: contentType, bodyText: bodyText };
        });
      })
      .then(function (res) {
        if (!resultsContent) return;
        var parsed = parseSuggestResponse(res.contentType, res.bodyText);
        resultsContent.innerHTML = '';
        if (parsed.count > 0) {
          /* Neither the predictive_search Liquid object nor the raw
             JSON expose the query string itself — so the "N pieces
             found for..." meta line is built here, client-side, from
             the query this file already sent. */
          var meta = document.createElement('p');
          meta.className = 'ka-search-results__meta';
          meta.textContent = parsed.count + (parsed.count === 1 ? ' piece' : ' pieces') + ' found for "' + query + '"';
          resultsContent.appendChild(meta);
          resultsContent.appendChild(parsed.fragment);
          showResults();
        } else {
          showNoResults(query);
        }
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return; /* superseded by a newer keystroke, ignore */
        /* Network/API failure — resolve to the same soft fallback
           rather than a silently broken/empty overlay (spec §1.5,
           "no dead end"). */
        showNoResults(query);
      });
  }

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    var val = input.value;
    debounceTimer = setTimeout(function () { runSearch(val); }, DEBOUNCE_MS);
  });

  /* Popular-search chips: fill the input and trigger the same search
     code path as typing (spec §1.5). Enter/native submit on the form
     itself is left alone — it navigates to /search?q=...&type=product
     with zero JS, the progressive-enhancement fallback. */
  document.querySelectorAll('[data-ka-search-chip]').forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      e.preventDefault();
      var q = chip.getAttribute('data-query') || chip.textContent.trim();
      input.value = q;
      input.focus();
      runSearch(q);
    });
  });
})();
