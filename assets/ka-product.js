/* ================================================================
   K&A PRODUCT PAGE JS — ka-product.js
   Vanilla, no dependencies. Scoped to the product template.
   (Sitewide reveals/nav/mobile-drawer are handled by ka-theme.js.)
================================================================ */
(function () {
  'use strict';

  /* ---------- gallery: thumbnail rail + stage ---------- */
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.ka-thumb'));
  var stage = document.getElementById('ka-stage');
  var stageIdx = document.getElementById('ka-stage-idx');
  var stageTag = document.getElementById('ka-stage-tag');
  var total = thumbs.length || 1;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  thumbs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      thumbs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var full = t.getAttribute('data-full');
      if (stage && full) { stage.style.backgroundImage = "url('" + full + "')"; }
      if (stageIdx) { stageIdx.textContent = pad(i + 1) + ' / ' + pad(total); }
      var tag = t.getAttribute('data-tag') || '';
      if (stageTag) { stageTag.textContent = tag; stageTag.style.opacity = tag ? 1 : 0; }
    });
  });

  /* ---------- size selection + made-to-measure reveal ---------- */
  var sizes = Array.prototype.slice.call(document.querySelectorAll('.ka-size'));
  var bespoke = document.getElementById('ka-bespoke');
  var mtm = document.getElementById('ka-mtm');

  /* ---------- Add to Bag state + real Ajax Cart wiring ----------
     Round 2 (Docs/cta-architecture-revision.md). selectedSizeLabel/
     selectedVariantId gate every Add to Bag button (desktop CTA stack,
     sticky minibar, mobile sticky bar — three buttons, one shared
     state). selectedVariantId is null for the bespoke path on purpose:
     "Made to my measurements" has no real variant to add (see the OPEN
     DECISION comment in ka-product-main.liquid) — choosing it routes
     to the WhatsApp/appointment flow instead of /cart/add.js. */
  var selectedSizeLabel = null;
  var selectedVariantId = null;
  var isBespokeSelected = false;
  var sizeHint = document.getElementById('ka-size-hint');
  var bagButtons = Array.prototype.slice.call(document.querySelectorAll('[data-ka-add-to-bag]'));

  function refreshBagButtons() {
    var ready = !!selectedVariantId || isBespokeSelected;
    bagButtons.forEach(function (btn) {
      if (ready) { btn.removeAttribute('aria-disabled'); }
      else { btn.setAttribute('aria-disabled', 'true'); }
    });
  }

  sizes.forEach(function (s) {
    s.addEventListener('click', function () {
      if (s.classList.contains('ka-size--oos') || s.getAttribute('aria-disabled') === 'true') return;
      sizes.forEach(function (x) { x.classList.remove('sel'); });
      if (bespoke) bespoke.classList.remove('sel');
      s.classList.add('sel');
      if (mtm) mtm.classList.remove('open');
      selectedSizeLabel = s.textContent.trim();
      selectedVariantId = s.getAttribute('data-variant-id') || null;
      isBespokeSelected = false;
      if (sizeHint) sizeHint.classList.remove('show');
      refreshBagButtons();
    });
  });

  if (bespoke) {
    bespoke.addEventListener('click', function () {
      sizes.forEach(function (x) { x.classList.remove('sel'); });
      bespoke.classList.add('sel');
      if (mtm) mtm.classList.add('open');
      selectedSizeLabel = 'Made to my measurements';
      selectedVariantId = null;
      isBespokeSelected = true;
      if (sizeHint) sizeHint.classList.remove('show');
      refreshBagButtons();
    });
  }

  /* "Book an Appointment" → TEMPORARY: routes to the same WhatsApp
     concierge destination as the Concierge button until a real
     appointment-booking flow/calendar exists. Flagged in
     Docs/cta-architecture-revision.md Round 2 — do not let this
     silently become permanent; wire a real booking flow when one
     is built.

     NOTE: the actual [data-ka-appt-link] click handler lives sitewide
     in ka-nav.liquid (a document-level delegated listener that already
     covers every element with this attribute, on every page, including
     these Product-page buttons). It is intentionally NOT duplicated
     here — binding a second listener on the same elements would open
     two WhatsApp tabs per click. ka-product.js only needs the shared
     WHATSAPP_URL constant for the bespoke add-to-bag redirect below. */
  var KA_WHATSAPP_URL = 'https://wa.me/919967543087';

  function addToBag() {
    if (isBespokeSelected) {
      /* Bespoke routes to the appointment/WhatsApp flow rather than a
         literal cart add — see the OPEN DECISION comment in
         ka-product-main.liquid for the reasoning. */
      window.open(KA_WHATSAPP_URL, '_blank');
      return;
    }
    if (!selectedVariantId) {
      if (sizeHint) sizeHint.classList.add('show');
      var sizesEl = document.getElementById('ka-sizes');
      if (sizesEl) sizesEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var productTitle = document.querySelector('.ka-p-title');
    var titleText = productTitle ? productTitle.textContent.trim() : 'Your piece';

    bagButtons.forEach(function (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Adding…'; });

    fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: selectedVariantId, quantity: 1 }] })
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw err; });
        return res.json();
      })
      .then(function () {
        if (window.kaShowToast) {
          window.kaShowToast(titleText + ' · ' + selectedSizeLabel);
        }
        return fetch('/cart.js', { credentials: 'same-origin' });
      })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (cart) {
        if (cart && window.kaUpdateBagCount) window.kaUpdateBagCount(cart.item_count);
      })
      .catch(function () {
        /* Ajax Cart API failure (sold out mid-request, network, etc.) —
           fail visibly rather than silently: re-enable the button and
           let the customer try again, no false "added" toast. */
        if (sizeHint) {
          sizeHint.textContent = 'Something went wrong — please try again, or message us on WhatsApp.';
          sizeHint.classList.add('show');
        }
      })
      .finally(function () {
        bagButtons.forEach(function (btn) { btn.textContent = 'Add to Bag'; });
        refreshBagButtons();
      });
  }

  bagButtons.forEach(function (btn) {
    btn.addEventListener('click', addToBag);
  });

  /* ---------- accordion ---------- */
  function toggleAcc(head) {
    var acc = head.parentElement;
    var body = acc.querySelector('.ka-acc__body');
    if (acc.classList.contains('open')) {
      acc.classList.remove('open');
      body.style.maxHeight = null;
    } else {
      acc.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  }
  function openAcc(name) {
    var acc = document.querySelector('.ka-acc[data-acc="' + name + '"]');
    if (!acc) return;
    if (!acc.classList.contains('open')) toggleAcc(acc.querySelector('.ka-acc__head'));
    acc.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  document.querySelectorAll('.ka-acc__head').forEach(function (h) {
    h.addEventListener('click', function () { toggleAcc(h); });
  });
  /* deep-link buttons → open the Size & Fit accordion panel */
  document.querySelectorAll('[data-open-acc]').forEach(function (btn) {
    btn.addEventListener('click', function () { openAcc(btn.getAttribute('data-open-acc')); });
  });

  /* ---------- grating → scroll to reviews ---------- */
  var grating = document.getElementById('ka-grating');
  if (grating) {
    grating.addEventListener('click', function () {
      var rev = document.getElementById('reviews');
      if (rev) rev.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- lightbox (desktop/tablet only) ---------- */
  var lb = document.getElementById('ka-lb');
  var lbFrame = document.getElementById('ka-lb-frame');
  if (stage && lb) {
    stage.addEventListener('click', function () {
      if (window.innerWidth <= 900) return;
      if (lbFrame) lbFrame.style.backgroundImage = stage.style.backgroundImage;
      lb.classList.add('show');
    });
    lb.addEventListener('click', function () { lb.classList.remove('show'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lb.classList.remove('show');
    });
  }

  /* ---------- sticky minibar — shows once the product hero scrolls past ---------- */
  var minibar = document.getElementById('ka-minibar');
  var hero = document.getElementById('ka-product');
  if (minibar && hero && 'IntersectionObserver' in window) {
    var mbObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting && en.boundingClientRect.top < 0) {
          minibar.classList.add('show');
        } else {
          minibar.classList.remove('show');
        }
      });
    }, { threshold: 0 });
    mbObs.observe(hero);
  }

})();
