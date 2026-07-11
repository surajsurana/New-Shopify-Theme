/* ================================================================
   K&A CART ("SELECTION") PAGE JS — ka-cart.js
   Vanilla JS only. No third-party libraries. Loaded ONLY from
   templates/cart.json (via ka-cart-summary.liquid) per the project's
   per-section/page CSS/JS scoping rule.

   Real Shopify cart AJAX — NOT the prototype's DOM-only demo logic
   (cart-page-v1.html's removeItem()/toggleState() are presentation
   scaffolding only and are intentionally not ported here; see
   Docs/cart-build-spec.md Section 3 §10 and F2/F3/F9).

   Responsibilities:
   1. Line-item remove (F2) — POST /cart/change.js with that line's key
      and quantity 0, await the response, then either reload the page
      (simplest, always-correct path: cart object, nav badge if one
      ever exists, empty-state transition, cross-link variant, mobile
      bar visibility all re-render correctly from the server) or, for
      felt responsiveness, fade the row out client-side first. The
      fade can run optimistically; the underlying state change is
      always the real AJAX call, never a DOM-only deletion.
   2. Notes persistence (F3) — debounced POST /cart/update.js with a
      `note` param whenever the textarea changes, so cart.note (and
      therefore order.note after checkout) reflects what the shopper
      typed without requiring a full form submit.

   No quantity stepper logic exists here by design (F4) — there is
   nothing to wire up for quantity beyond what remove already covers.
================================================================ */
(function () {
  'use strict';

  /* ---------- line-item remove: real /cart/change.js call (F2) ---------- */
  var removeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-ka-cart-remove]'));

  removeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-key');
      if (!key || btn.disabled) return;

      var card = btn.closest('[data-ka-cart-item]');
      btn.disabled = true;
      btn.textContent = 'Removing…';

      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Cart change failed: ' + res.status);
          return res.json();
        })
        .then(function () {
          /* Run the felt-responsiveness fade (spec: opacity, 0.4s
             var(--ease-luxury)), then reload so every dependent piece
             of the page — item count, summary totals, empty-state
             transition, cross-link copy variant, mobile bar — re-renders
             from the server with the real, current cart state. This is
             deliberately a full reload rather than a hand-rolled partial
             DOM patch: with multiple sections depending on cart state
             (items, summary, cross-link, mobile bar), a reload is the
             simplest implementation that cannot drift from the server's
             truth, at the cost of one extra page load on remove. */
          if (card) {
            card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 0.84, 0.44, 1)';
            card.style.opacity = '0';
            setTimeout(function () { window.location.reload(); }, 380);
          } else {
            window.location.reload();
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Remove';
          window.alert('We could not remove that piece just now — please try again, or refresh the page.');
        });
    });
  });

  /* ---------- notes field: debounced persistence via cart.note (F3) ---------- */
  var noteField = document.querySelector('[data-ka-cart-note]');
  var noteStatus = document.querySelector('[data-ka-notes-status]');
  var noteTimer = null;
  var noteSaving = false;
  var lastSavedValue = noteField ? noteField.value : null;

  function setStatus(text) {
    if (!noteStatus) return;
    noteStatus.textContent = text;
    noteStatus.classList.toggle('is-visible', !!text);
  }

  function saveNote() {
    if (!noteField) return;
    var value = noteField.value;
    if (value === lastSavedValue || noteSaving) return;

    noteSaving = true;
    setStatus('Saving your note…');

    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ note: value })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Cart note update failed: ' + res.status);
        return res.json();
      })
      .then(function () {
        lastSavedValue = value;
        noteSaving = false;
        setStatus('Saved.');
        setTimeout(function () { setStatus(''); }, 2200);
      })
      .catch(function () {
        noteSaving = false;
        setStatus('Could not save — please try again.');
      });
  }

  if (noteField) {
    noteField.addEventListener('input', function () {
      if (noteTimer) clearTimeout(noteTimer);
      noteTimer = setTimeout(saveNote, 900);
    });
    /* Also save immediately on blur, so navigating straight to checkout
       right after typing doesn't race the debounce timer. */
    noteField.addEventListener('blur', function () {
      if (noteTimer) clearTimeout(noteTimer);
      saveNote();
    });
  }

  /* Checkout (F7) needs no JS at all — both "Continue to Checkout" and the
     mobile bar's "Checkout" button are real <button name="checkout"> form
     submits to routes.cart_url, Shopify's own standard handoff to
     /checkout. Documented here only so it's clear the omission is
     deliberate, not a gap. */
})();
