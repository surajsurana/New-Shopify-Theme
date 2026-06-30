/* ================================================================
   K&A COLLECTION PAGE JS — ka-collection.js
   Vanilla JS only. No third-party libraries.
   Loaded ONLY from templates/collection.json (not global ka-theme.js)
   per the project's per-section/page CSS/JS scoping rule — this code
   has no purpose on any page that isn't a collection template.

   Three responsibilities, per Docs/collection-build-spec.md and the
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
          while (newGrid.firstChild) {
            grid.appendChild(newGrid.firstChild);
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
