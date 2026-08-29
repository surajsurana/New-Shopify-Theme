/* ================================================================
   K&A WISHLIST — assets/ka-wishlist.js
   Docs/account-wishlist-build-spec.md, Section 1 (data model) + 1.3
   (sync mechanism). Vanilla JS only, no third-party libraries — same
   IIFE pattern as ka-theme.js/ka-currency.js. Loaded defer, sitewide,
   unconditionally, from layout/theme.liquid.

   WHAT THIS IS: the single source of truth for the wishlist feature.
   localStorage-based, device-scoped, identical for guest and signed-in
   visitors (Section 1.1) — never branches on customer/login state. No
   other file in this theme is allowed to read/write the ka_wishlist
   key directly; every heart button and the nav badge/mobile-row count
   all go through window.kaWishlist below, so the saved-state and the
   visible count can never drift out of sync with each other.

   Public API (Section 1.2):
     window.kaWishlist.getAll()        -> array of saved product handles
     window.kaWishlist.has(handle)     -> boolean
     window.kaWishlist.add(handle)     -> void (idempotent)
     window.kaWishlist.remove(handle)  -> void (idempotent)
     window.kaWishlist.toggle(handle)  -> boolean, the new saved state

   Sync mechanism (Section 1.3): every mutating call dispatches a
   document-level CustomEvent, 'ka:wishlist:change', with
   { detail: { handles: [...] } }. Three things listen for it —
   1) this file's own nav-badge/mobile-row updater, 2) this file's own
   heart-button hydrator (every .ka-p-card__wish / .ka-stage__wish
   currently on the page), and 3) the Wishlist page's own grid renderer
   (sections/ka-wishlist-main.liquid's inline script), independently.

   This file also owns delegated click handling for every heart button
   on the page (event delegation from `document`, so it works uniformly
   whether a card was server-rendered or built client-side — e.g.
   assets/ka-search.js's predictive-search cards). The one exception is
   the Wishlist page's own cards: their heart doubles as a "remove from
   this page" control with its own fade/collapse animation, so that
   page wires a direct listener on each button and calls
   e.stopPropagation() to keep this file's generic handler from ALSO
   firing on the same click (see that section's inline script).
================================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'ka_wishlist';
  var WISH_SELECTOR = '.ka-p-card__wish, .ka-stage__wish';

  /* ---------------------------------------------------------------
     Storage — bare JSON array of product handles (Section 1.1). Every
     read/write is wrapped in try/catch (private browsing, storage
     disabled, quota edge cases) and fails silently, matching the same
     defensive pattern already used in ka-currency.js — a heart still
     visually toggles for that page view even if persistence fails,
     rather than throwing and breaking the click handler.
  --------------------------------------------------------------- */
  function readAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeAll(handles) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    } catch (e) { /* quota/private-mode/disabled — ignore, matches ka-currency.js */ }
  }

  function dispatchChange() {
    var handles = readAll();
    document.dispatchEvent(new CustomEvent('ka:wishlist:change', { detail: { handles: handles } }));
    return handles;
  }

  function has(handle) {
    if (!handle) return false;
    return readAll().indexOf(handle) !== -1;
  }

  function add(handle) {
    if (!handle) return;
    var handles = readAll();
    if (handles.indexOf(handle) !== -1) return; /* idempotent, no-op */
    handles.push(handle);
    writeAll(handles);
    dispatchChange();
  }

  function remove(handle) {
    if (!handle) return;
    var handles = readAll();
    var idx = handles.indexOf(handle);
    if (idx === -1) return; /* idempotent, no-op */
    handles.splice(idx, 1);
    writeAll(handles);
    dispatchChange();
  }

  function toggle(handle) {
    if (!handle) return false;
    if (has(handle)) {
      remove(handle);
      return false;
    }
    add(handle);
    return true;
  }

  window.kaWishlist = {
    getAll: readAll,
    has: has,
    add: add,
    remove: remove,
    toggle: toggle
  };

  /* ---------------------------------------------------------------
     Nav badge + mobile-row count — every [data-ka-wishlist-count] node
     sitewide (desktop icon badge + mobile drawer row), structurally
     identical to kaUpdateBagCount()'s [data-ka-bag-count] pattern in
     ka-theme.js. Additionally toggles .has-saved on every
     .ka-nav__wishlist so the heart glyph itself fills — the bag icon
     has no equivalent fill state, this is wishlist-specific (Section
     1.3 item 1).
  --------------------------------------------------------------- */
  function updateWishlistCount(count) {
    var nodes = document.querySelectorAll('[data-ka-wishlist-count]');
    nodes.forEach(function (el) {
      el.textContent = count > 0 ? count : '';
      el.setAttribute('data-count', count);
    });
    var icons = document.querySelectorAll('.ka-nav__wishlist');
    icons.forEach(function (el) { el.classList.toggle('has-saved', count > 0); });
  }

  /* ---------------------------------------------------------------
     Heart button state — shared by hydration and the click handler
     below, so both paths render the exact same aria/class contract.
  --------------------------------------------------------------- */
  function setButtonState(btn, saved) {
    btn.classList.toggle('is-saved', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    btn.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Save to wishlist');
  }

  function hydrateButtons(scope, handles) {
    var buttons = (scope || document).querySelectorAll(WISH_SELECTOR);
    buttons.forEach(function (btn) {
      var handle = btn.getAttribute('data-product-handle');
      setButtonState(btn, !!(handle && handles.indexOf(handle) !== -1));
    });
  }

  function syncAll() {
    var handles = readAll();
    updateWishlistCount(handles.length);
    hydrateButtons(document, handles);
  }

  /* Every heart button + the nav badge stay correct on any wishlist
     mutation, from anywhere on the page (Section 1.3 item 2) — e.g.
     unsaving from the Wishlist page also un-fills that same product's
     heart if it happens to also be visible in a Bestsellers strip
     lower on that same page. */
  document.addEventListener('ka:wishlist:change', function (e) {
    var handles = (e.detail && e.detail.handles) || readAll();
    updateWishlistCount(handles.length);
    hydrateButtons(document, handles);
  });

  /* ---------------------------------------------------------------
     Delegated click — every .ka-p-card__wish / .ka-stage__wish on the
     page, server-rendered or client-built, works uniformly (Section
     2 S2/S6). Instant local feedback via the returned toggle() boolean
     — no waiting on the event round-trip for the clicked button itself
     (the event round-trip is what keeps every OTHER instance of the
     same product's heart in sync, per Section 1.3 item 2).
  --------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest(WISH_SELECTOR);
    if (!btn) return;
    var handle = btn.getAttribute('data-product-handle');
    if (!handle) return;
    e.preventDefault();
    e.stopPropagation(); /* never let this trigger a card's own image-link navigation */
    var saved = window.kaWishlist.toggle(handle);
    setButtonState(btn, saved);
  });

  /* ---------------------------------------------------------------
     AJAX-appended cards (e.g. the Collection page's "Load More",
     assets/ka-collection.js) render real server-side markup — including
     the correct data-product-handle — but arrive after this file's own
     initial hydration pass already ran. Without this, a newly-loaded
     card for an already-saved product would show an unfilled heart
     until some unrelated wishlist mutation happened to re-sync it. A
     lightweight MutationObserver closes that gap: it only reacts to
     nodes actually being added (not the reveal-img fade-in's own class
     mutations, which this doesn't subscribe to), so it stays cheap.
  --------------------------------------------------------------- */
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function (mutations) {
      var handles = null;
      mutations.forEach(function (m) {
        if (!m.addedNodes) return;
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          var matchesSelf = node.matches && node.matches(WISH_SELECTOR);
          var hasDescendants = node.querySelectorAll && node.querySelectorAll(WISH_SELECTOR).length;
          if (!matchesSelf && !hasDescendants) return;
          if (!handles) handles = readAll();
          if (matchesSelf) {
            setButtonState(node, !!(node.getAttribute('data-product-handle') && handles.indexOf(node.getAttribute('data-product-handle')) !== -1));
          }
          if (hasDescendants) hydrateButtons(node, handles);
        });
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  /* ---------------------------------------------------------------
     Init — hydration has no excuse to flash the wrong state (unlike
     the bag-count pattern, which waits on a /cart.js fetch): the data
     is already sitting in localStorage with zero latency (Section
     1.3). Because this script is loaded `defer`, by the time it runs
     the document has already finished parsing (readyState is past
     'loading'), so this executes as early as physically possible
     without a separate synchronous pre-paint snippet — every
     server-rendered heart button already exists in the DOM at this
     point and gets its correct state in the very same tick.
  --------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncAll);
  } else {
    syncAll();
  }
})();
