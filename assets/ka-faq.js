/* ================================================================
   KA-FAQ — accordion, topic-nav jump/scroll-tracking, search filter.
   Spec: Docs/faq-build-spec.md §3 (S3/S4), §7 flag F5.
   Directly portable from Prototypes/faq-v1.html's vanilla JS — no
   Shopify API, no app, no server round-trip (F5: pure client-side
   text filtering over a small, fixed, page-local Q&A set).

   Reveal-on-scroll and mobile-nav open/close are already handled
   globally by assets/ka-theme.js (loaded sitewide in layout/theme.liquid)
   — not reimplemented here.
================================================================ */
(function () {
  'use strict';

  /* ---------- accordion — verbatim mechanics reused from the
     product-page accordion (assets/ka-product-main.css box model) ---------- */
  function toggleAcc(head) {
    var acc = head.closest('.ka-acc');
    if (!acc) return;
    var body = acc.querySelector('.ka-acc__body');
    if (acc.classList.contains('open')) {
      acc.classList.remove('open');
      body.style.maxHeight = null;
    } else {
      acc.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  }
  var heads = document.querySelectorAll('.faq-acc__head');
  heads.forEach(function (h) {
    h.addEventListener('click', function () { toggleAcc(h); });
  });
  // Pre-open the first question (rendered server-side with .open, see
  // snippets/ka-faq-acc.liquid `is_first`) so its max-height is measured
  // correctly on load rather than staying 0.
  var firstAccBody = document.querySelector('.ka-acc.open .ka-acc__body');
  if (firstAccBody) firstAccBody.style.maxHeight = firstAccBody.scrollHeight + 'px';

  /* ---------- topic chips — jump-to-section, NOT filter; active
     state tracks scroll position via IntersectionObserver ---------- */
  var chips = document.querySelectorAll('#topicChips .ka-chip');
  var groups = document.querySelectorAll('.faq-group');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      clearSearch(); // chips = browse mode; clear any active search first
      var target = document.getElementById(chip.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window && groups.length && chips.length) {
    var groupObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          chips.forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-target') === id); });
        }
      });
    }, { rootMargin: '-160px 0px -70% 0px', threshold: 0 });
    groups.forEach(function (g) { groupObserver.observe(g); });
  }

  /* ---------- search — true filter across the full Q&A set (F5) ---------- */
  var searchInput = document.getElementById('faqSearch');
  var searchClear = document.getElementById('faqSearchClear');
  var emptyState = document.getElementById('faqEmpty');
  var searchTimer;

  function runSearch(query) {
    var q = (query || '').trim().toLowerCase();
    if (searchClear) searchClear.classList.toggle('is-visible', q.length > 0);

    if (q.length === 0) {
      document.querySelectorAll('.ka-acc').forEach(function (a) { a.classList.remove('is-hidden'); });
      groups.forEach(function (g) { g.classList.remove('is-hidden'); });
      if (emptyState) emptyState.classList.remove('is-visible');
      return;
    }

    var totalVisible = 0;
    groups.forEach(function (group) {
      var groupVisible = 0;
      group.querySelectorAll('.ka-acc').forEach(function (acc) {
        var text = acc.textContent.toLowerCase();
        var match = text.indexOf(q) !== -1;
        acc.classList.toggle('is-hidden', !match);
        if (match) { groupVisible++; totalVisible++; }
      });
      group.classList.toggle('is-hidden', groupVisible === 0);
    });
    if (emptyState) emptyState.classList.toggle('is-visible', totalVisible === 0);
  }

  function clearSearch() {
    if (!searchInput) return;
    searchInput.value = '';
    runSearch('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      clearTimeout(searchTimer);
      var val = e.target.value;
      searchTimer = setTimeout(function () { runSearch(val); }, 150);
    });
    searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
  }
  if (searchClear) searchClear.addEventListener('click', clearSearch);
})();
