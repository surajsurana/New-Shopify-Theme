/* ================================================================
   K&A COLLECTION PAGE JS — ka-collection.js
   Vanilla JS only. No third-party libraries.
   Loaded ONLY from templates/collection.json (not global ka-theme.js)
   per the project's per-section/page CSS/JS scoping rule — this code
   has no purpose on any page that isn't a collection template.

   Four responsibilities (the refine chips, added 2026-10-22, are the fourth), per Docs/collection-build-spec.md and the
   Round 2 CTA revision (Docs/cta-architecture-revision.md):
   1. Sort select (Section 5 / F4) — navigates to the collection URL
      with Shopify's native sort_by parameter appended. The refine
      chips themselves are real <a href> links to
      /collections/{handle}/{tag-handle} (Shopify's native tag-filter
      URL) and need no JS to function — this is intentional
      progressive enhancement, not a gap.
   2. AJAX "Load More" (Section 8 / F7) — fetches the next paginated
      page via the Section Rendering API (?section_id=) and appends
      the returned product-card markup to the grid, then updates the
      piece-count readout. Falls back to a real <a href> to
      paginate.next.url (traditional pagination) when JS is
      unavailable or the fetch fails.
   3. Quick-add (Round 2) — each card's "+ Add to Bag" veil button posts
      product.selected_or_first_available_variant's id to /cart/add.js
      (see the OPEN DECISION comment in ka-collection-grid.liquid for why
      that's the chosen variant), then shows the shared toast
      (window.kaShowToast, ka-theme.js) and refreshes the header bag
      count (window.kaUpdateBagCount). Delegated on the grid container so
      it keeps working after AJAX Load More appends new cards.
================================================================ */
(function () {
  'use strict';

  /* --- Quick-add: delegated so newly-appended (Load More) cards work --- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-ka-quickadd]');
    if (!btn) return;
    if (btn.getAttribute('aria-disabled') === 'true') return;

    var variantId = btn.getAttribute('data-variant-id');
    var title = btn.getAttribute('data-product-title') || 'Your piece';
    if (!variantId) return;

    var originalText = btn.textContent;
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = 'Adding…';

    fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw err; });
        return res.json();
      })
      .then(function () {
        if (window.kaShowToast) window.kaShowToast(title);
        return fetch('/cart.js', { credentials: 'same-origin' });
      })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (cart) {
        if (cart && window.kaUpdateBagCount) window.kaUpdateBagCount(cart.item_count);
      })
      .catch(function () {
        btn.textContent = 'Try Again';
        setTimeout(function () { btn.textContent = originalText; }, 2200);
      })
      .finally(function () {
        btn.removeAttribute('aria-disabled');
        if (btn.textContent === 'Adding…') btn.textContent = originalText;
      });
  });

  /* --- Sort select: navigate with sort_by param ------------------- */
  var sortSelect = document.querySelector('[data-ka-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      window.location.href = url.toString();
    });
  }

  /* --- Refine chips: filter by collection membership -------------------
     Each card carries data-ka-colls (handles of every collection it is in).
     A chip with data-ka-chip="lehengas" shows only cards that are also in the
     "lehengas" collection. Liquid only renders one page of the grid, so the
     first filter click fetches the remaining pages (Section Rendering API,
     same mechanism as Load More) and appends them, then filters locally. */
  (function () {
    var chipNav = document.querySelector('[data-ka-refine-chips]');
    var wrap = document.querySelector('[data-ka-load-more]');
    if (!chipNav) return;
    var grid = wrap ? document.getElementById('ka-product-grid-' + wrap.getAttribute('data-section-id')) : document.querySelector('[data-ka-product-grid]');
    if (!grid) return;
    var chips = chipNav.querySelectorAll('[data-ka-chip]');
    var allChip = chipNav.querySelector('[data-ka-chip-all]');
    var loadingAll = null;

    function cards() { return grid.querySelectorAll('.ka-p-card'); }

    function loadEverything() {
      if (loadingAll) return loadingAll;
      if (!wrap) { loadingAll = Promise.resolve(); return loadingAll; }
      var sectionId = wrap.getAttribute('data-section-id');
      var pages = parseInt(wrap.getAttribute('data-pages'), 10) || 1;
      var cur = parseInt(wrap.getAttribute('data-current-page'), 10) || 1;
      // Best-selling / price orderings are not stable between requests (ties and live sales
      // reshuffle them), so pages fetched separately overlap and drop pieces. In that case fetch
      // EVERY page, including the one already shown, in a deterministic title order, and de-duplicate
      // by product id against what is on the page.
      var unstable = wrap.getAttribute('data-sort-unstable') === 'true';
      var first = unstable ? 1 : cur + 1;
      var jobs = [];
      for (var n = first; n <= pages; n++) {
        (function (page) {
          var params = new URLSearchParams(window.location.search);
          params.set('page', page);
          params.set('section_id', sectionId);
          if (unstable) params.set('sort_by', 'title-ascending');
          jobs.push(fetch(window.location.pathname + '?' + params.toString(), { credentials: 'same-origin' })
            .then(function (r) { if (!r.ok) throw new Error('page ' + page); return r.text(); }));
        })(n);
      }
      loadingAll = Promise.all(jobs).then(function (htmls) {
        var have = {};
        Array.prototype.forEach.call(grid.querySelectorAll('.ka-p-card'), function (c) { have[c.getAttribute('data-ka-pid')] = true; });
        htmls.forEach(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var g = doc.getElementById('ka-product-grid-' + sectionId);
          if (!g) return;
          Array.prototype.forEach.call(g.querySelectorAll('.ka-p-card'), function (c) {
            var pid = c.getAttribute('data-ka-pid');
            if (pid && have[pid]) return;
            have[pid] = true;
            c.classList.add('visible');
            grid.appendChild(c);
          });
        });
        // Everything is on the page now: retire Load More for good.
        var btn = wrap.querySelector('[data-ka-load-more-btn]');
        if (btn) btn.remove();
      }).catch(function () { loadingAll = null; throw new Error('load'); });
      return loadingAll;
    }

    function setActive(el) {
      allChip && allChip.classList.remove('is-active');
      Array.prototype.forEach.call(chips, function (c) { c.classList.remove('is-active'); });
      el.classList.add('is-active');
    }

    function apply(handle) {
      var shown = 0;
      Array.prototype.forEach.call(cards(), function (c) {
        var has = !handle || (' ' + (c.getAttribute('data-ka-colls') || '') + ' ').indexOf(' ' + handle + ' ') !== -1;
        c.hidden = !has;
        if (has) { shown++; c.classList.add('visible'); }
      });
      grid.classList.toggle('is-filtered', !!handle);
      var countEl = wrap && wrap.querySelector('[data-ka-load-more-count]');
      if (countEl && (handle || loadingAll)) countEl.textContent = 'Showing ' + shown + ' of ' + shown + ' pieces';
      return shown;
    }

    function select(chip) {
      var handle = chip ? chip.getAttribute('data-ka-chip') : '';
      if (!handle) {
        setActive(allChip);
        apply('');
        if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
        return;
      }
      setActive(chip);
      loadEverything().then(function () {
        if (apply(handle) === 0) {
          // Nothing in this collection belongs to the silhouette: drop the chip, show everything.
          chip.parentNode && chip.parentNode.removeChild(chip);
          select(null);
          return;
        }
        if (history.replaceState) history.replaceState(null, '', '#' + handle);
        grid.scrollIntoView && chipNav.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }).catch(function () {
        // Fetch failed: fall back to the silhouette collection page the link points at.
        window.location.href = chip.getAttribute('href');
      });
    }

    chipNav.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a || !chipNav.contains(a)) return;
      if (a.hasAttribute('data-ka-chip')) { e.preventDefault(); select(a); }
      else if (a.hasAttribute('data-ka-chip-all')) { e.preventDefault(); select(null); }
    });

    var hash = window.location.hash.replace('#', '');
    if (hash) {
      var pre = chipNav.querySelector('[data-ka-chip="' + hash.replace(/[^a-z0-9-]/gi, '') + '"]');
      if (pre) select(pre);
    }
  })();

  /* --- AJAX Load More ---------------------------------------------- */
  var loadMoreWrap = document.querySelector('[data-ka-load-more]');
  if (!loadMoreWrap) return;

  var loadMoreBtn   = loadMoreWrap.querySelector('[data-ka-load-more-btn]');
  var countEl       = loadMoreWrap.querySelector('[data-ka-load-more-count]');
  var sectionId     = loadMoreWrap.getAttribute('data-section-id');
  var perPage       = parseInt(loadMoreWrap.getAttribute('data-per-page'), 10) || 9;
  var totalItems    = parseInt(loadMoreWrap.getAttribute('data-items'), 10) || 0;
  var currentPage   = parseInt(loadMoreWrap.getAttribute('data-current-page'), 10) || 1;
  var grid          = document.getElementById('ka-product-grid-' + sectionId);

  if (!loadMoreBtn || !grid) return;

  loadMoreBtn.addEventListener('click', function (e) {
    var nextPage = currentPage + 1;

    var currentPath = window.location.pathname;
    var currentParams = new URLSearchParams(window.location.search);
    currentParams.set('page', nextPage);
    var nextUrl = currentPath + '?' + currentParams.toString() + '&section_id=' + sectionId;

    e.preventDefault();
    loadMoreBtn.textContent = 'Loading…';

    fetch(nextUrl, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('Load more fetch failed: ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var newGrid = doc.getElementById('ka-product-grid-' + sectionId);
        var newLoadMore = doc.querySelector('[data-ka-load-more]');

        if (newGrid) {
          var haveIds = {};
          Array.prototype.forEach.call(grid.querySelectorAll('.ka-p-card'), function (c) { haveIds[c.getAttribute('data-ka-pid')] = true; });
          while (newGrid.firstChild) {
            var node = newGrid.firstChild;
            if (node.nodeType === 1 && node.classList.contains('ka-p-card') && haveIds[node.getAttribute('data-ka-pid')]) { newGrid.removeChild(node); continue; }
            grid.appendChild(node);
          }
          var newReveals = grid.querySelectorAll('.reveal:not(.visible), .reveal-img:not(.visible)');
          if ('IntersectionObserver' in window && newReveals.length) {
            var obs = new IntersectionObserver(function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
                  obs.unobserve(entry.target);
                }
              });
            }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
            newReveals.forEach(function (el) { obs.observe(el); });
          } else {
            newReveals.forEach(function (el) { el.classList.add('visible'); });
          }
        }

        currentPage = nextPage;
        var shownSoFar = Math.min(currentPage * perPage, totalItems);
        if (countEl) {
          countEl.textContent = 'Showing ' + shownSoFar + ' of ' + totalItems + ' pieces';
        }

        if (newLoadMore) {
          var newNextBtn = newLoadMore.querySelector('[data-ka-load-more-btn]');
          if (newNextBtn) {
            loadMoreBtn.setAttribute('href', newNextBtn.getAttribute('href'));
            loadMoreBtn.textContent = 'View More of the Collection';
          } else {
            loadMoreBtn.remove();
          }
        } else {
          loadMoreBtn.remove();
        }
      })
      .catch(function () {
        var fallbackHref = loadMoreBtn.getAttribute('href');
        if (fallbackHref) {
          window.location.href = fallbackHref;
        } else {
          loadMoreBtn.textContent = 'View More of the Collection';
        }
      });
  });
})();
