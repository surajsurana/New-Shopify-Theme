/* ================================================================
   K&A SEARCH — assets/ka-search.js
   Vanilla JS only. No third-party libraries. Loaded defer from
   sections/ka-nav.liquid (renders sitewide, same as ka-theme.js).
   Spec: Docs/search-404-footer-build-spec.md, Section 1.5.

   Behavior ported from Prototypes/search-404-footer-v1.html's inline
   <script> (open/close, debounce, chip-fills-input), rewired from the
   prototype's static PRODUCTS array onto Shopify's real Predictive
   Search Section Rendering endpoint:

     /search/suggest.json?q=QUERY&resources[type]=product&resources[limit]=8
       &resources[options][unavailable_products]=last
       &section_id=ka-predictive-search

   Passing section_id makes Shopify return rendered HTML (from
   sections/ka-predictive-search.liquid) instead of raw JSON — that
   section reuses the real .ka-p-card markup verbatim (same component
   as the Collection grid), so results are pixel-identical with zero
   hand-built card templating here (spec S1/S3).

   Three states (#ka-search-empty / #ka-search-results / #ka-search-noresults)
   are toggled by inspecting the fetched fragment for at least one
   .ka-p-card — not by trusting a separate count field — so the no-
   results branch can never drift out of sync with what actually
   rendered.
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
    if (noResultsTitle) noResultsTitle.textContent = 'We couldn’t find "' + query + '"';
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
        return res.text();
      })
      .then(function (html) {
        if (!resultsContent) return;
        resultsContent.innerHTML = html;
        var count = resultsContent.querySelectorAll('.ka-p-card').length;
        if (count > 0) {
          /* The predictive_search Liquid object (sections/ka-predictive-
             search.liquid) doesn't expose the query string itself, only
             resources.results.* — so the "N pieces found for..." meta
             line is built here, client-side, from the query this file
             already sent, and prepended ahead of the fetched grid. */
          var meta = document.createElement('p');
          meta.className = 'ka-search-results__meta';
          meta.textContent = count + (count === 1 ? ' piece' : ' pieces') + ' found for "' + query + '"';
          resultsContent.insertBefore(meta, resultsContent.firstChild);
          showResults();
        } else {
          showNoResults(query);
        }
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return; /* superseded by a newer keystroke, ignore */
        /* Network/API failure — resolve to the concierge fallback rather
           than a silently broken/empty overlay (spec §1.5, "no dead end"). */
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
