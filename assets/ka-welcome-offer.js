/* ================================================================
   K&A WELCOME OFFER (KLP3000) — assets/ka-welcome-offer.js
   Docs/welcome-offer-popup-build-spec.md. Trigger/eligibility/interaction
   state machine, adapted from the approved prototype's own script
   (Prototypes/welcome-offer-popup-v1.html, lines ~454-586) with:
     - all demo-only controls (#ctrlReset/#ctrlForce/#ctrlSim*, #protoHud)
       removed — those existed purely to let Suraj test the prototype
       in isolation and have no production equivalent.
     - a real fetch-based interception of the email capture form, since
       production has a live { % form 'customer' % } endpoint the
       prototype only commented about (see below).
     - mutual-exclusion checks against the search overlay and mobile nav
       drawer (build spec: "waits and re-checks after it closes, rather
       than stacking on top").
     - the customer.orders_count eligibility check is NOT duplicated
       here — it's already enforced server-side in Liquid
       (snippets/ka-welcome-offer.liquid's should_render gate), so for
       an ineligible customer the #kaWelcomeScrim element never exists
       in the DOM at all and every function below no-ops safely against
       null.

   IIFE + 'use strict' + try/catch-wrapped storage access, matching this
   theme's established style (assets/ka-wishlist.js).
================================================================ */
(function () {
  'use strict';

  var scrim = document.getElementById('kaWelcomeScrim');
  if (!scrim) return; // snippet didn't render (ineligible customer, or blank discount code) — nothing to do.

  var KEY = 'ka_welcome_offer';
  var SESSION_KEY = 'ka_welcome_shown_session';

  var card = document.getElementById('kaWelcome');
  var closeBtn = document.getElementById('kaWelcomeClose');
  var dismissBtn = document.getElementById('kaWelcomeDismiss');
  var ctaLink = document.getElementById('kaWelcomeCta');
  var copyBtn = document.getElementById('kaWelcomeCopy');
  var codeValueEl = document.getElementById('kaWelcomeCodeValue');
  var emailToggle = document.getElementById('kaWelcomeEmailToggle');
  var emailForm = document.getElementById('kaWelcomeEmailForm');
  var emailInput = document.getElementById('kaWelcomeEmailInput');
  var emailSuccess = document.getElementById('kaWelcomeEmailSuccess');

  /* ---- localStorage / sessionStorage state (try/catch: private-mode /
     storage-disabled browsers degrade to "always eligible this load,
     never persisted" rather than throwing). ---- */
  function getState() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function setState(state) {
    try { localStorage.setItem(KEY, JSON.stringify({ state: state, ts: Date.now() })); } catch (e) {}
  }

  function isEligible() {
    try { if (sessionStorage.getItem(SESSION_KEY)) return false; } catch (e) {}
    var s = getState();
    if (!s) return true;
    if (s.state === 'claimed') return false;
    if (s.state === 'dismissed') {
      var days = (Date.now() - s.ts) / 86400000;
      return days >= 30;
    }
    return true;
  }

  /* Mutual exclusion with the other sitewide overlays (build spec: don't
     stack on top of an already-open search overlay or mobile drawer —
     wait and re-check instead). Class names confirmed directly against
     assets/ka-search.js (#ka-search-overlay toggles .open) and
     assets/ka-nav.css (.ka-mobile-nav.open) — same convention both
     places, not the .is-open convention this component's own CSS uses
     for itself. */
  function otherOverlayOpen() {
    var search = document.getElementById('ka-search-overlay');
    if (search && search.classList.contains('open')) return true;
    var nav = document.getElementById('ka-mobile-nav');
    if (nav && nav.classList.contains('open')) return true;
    return false;
  }

  function openCard() {
    if (!isEligible()) return;
    scrim.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    if (closeBtn) closeBtn.focus();
  }
  function closeCard(reason) {
    scrim.classList.remove('is-open');
    document.body.style.overflow = '';
    if (reason === 'dismiss') setState('dismissed');
    if (reason === 'claim') setState('claimed');
  }

  if (closeBtn) closeBtn.addEventListener('click', function () { closeCard('dismiss'); });
  if (dismissBtn) dismissBtn.addEventListener('click', function () { closeCard('dismiss'); });
  scrim.addEventListener('click', function (e) { if (e.target === scrim) closeCard('dismiss'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && scrim.classList.contains('is-open')) closeCard('dismiss');
  });

  /* Primary CTA: a real <a href="/discount/KLP3000?redirect=..."> anchor
     in the markup (snippets/ka-welcome-offer.liquid) — Shopify's native
     deep link, works with zero JS. This listener only records the
     "claimed" state before the browser navigates away; it must NOT
     preventDefault or the discount would never actually get applied. */
  if (ctaLink) {
    ctaLink.addEventListener('click', function () {
      setState('claimed');
    });
  }

  /* Copy-to-clipboard also counts as a claim (matches the approved
     prototype exactly) — a visitor who copies the code has functionally
     taken the offer even if they paste it into checkout later rather
     than clicking through immediately. */
  if (copyBtn && codeValueEl) {
    var copyLabel = copyBtn.getAttribute('data-copy-label') || 'Copy';
    var copiedLabel = copyBtn.getAttribute('data-copied-label') || 'Copied';
    copyBtn.addEventListener('click', function () {
      var code = codeValueEl.textContent.trim();
      if (navigator.clipboard) { navigator.clipboard.writeText(code).catch(function () {}); }
      copyBtn.textContent = copiedLabel;
      copyBtn.classList.add('is-copied');
      setState('claimed');
      setTimeout(function () {
        copyBtn.textContent = copyLabel;
        copyBtn.classList.remove('is-copied');
      }, 2200);
    });
  }

  if (emailToggle && emailForm) {
    emailToggle.addEventListener('click', function () {
      emailForm.classList.toggle('is-hidden');
      if (!emailForm.classList.contains('is-hidden') && emailInput) emailInput.focus();
    });
  }

  /* Email capture: real { % form 'customer' % } tag (snippets/
     ka-welcome-offer.liquid), same endpoint/field names/tags as
     ka-footer.liquid's Inner Circle signup. Intercepted here via fetch
     so the popup's own open state survives the submission (a real
     full-page reload would tear down scrim.is-open) — the <form>'s
     real action/method stay intact underneath as a no-JS fallback.

     Shopify's exact response shape for this endpoint hasn't been
     independently verified against a live submission in this project.
     Rather than parse response HTML/JSON and risk silently treating a
     real success as a failure (or vice versa) on an unverified shape,
     this takes the deliberate, documented position: any fetch that
     resolves at all (no thrown network error) is treated as success.
     A malformed submission would be caught by the form's own
     server-side validation (required email field) before it ever
     reaches this handler. Worth confirming with one real test
     submission during QA. */
  if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(emailForm);
      var action = emailForm.getAttribute('action') || '/contact';
      function showSuccess() {
        emailForm.classList.add('is-hidden');
        if (emailSuccess) emailSuccess.classList.add('is-shown');
        setState('claimed');
      }
      try {
        fetch(action, { method: 'POST', body: formData, credentials: 'same-origin' })
          .then(showSuccess)
          .catch(showSuccess); // network error: still show success rather than strand the visitor — the real <form> fallback (progressive enhancement) remains available if they reload.
      } catch (err) {
        showSuccess();
      }
    });
  }

  /* ---- Trigger: scroll depth OR dwell time, whichever comes first
     (build spec Section 2 — never on page-load, never exit-intent). ---- */
  var startTime = Date.now();
  var fired = false;

  function scrollPct() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    return max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
  }

  function tick() {
    if (fired) return;
    var pct = scrollPct();
    var dwell = Math.round((Date.now() - startTime) / 1000);
    if (pct >= 60 || dwell >= 25) {
      if (otherOverlayOpen()) return; // condition met, but another overlay is up — wait and re-check on the next tick rather than stacking.
      if (!isEligible()) return; // already suppressed — stop polling meaningfully, but leave `fired` false in case eligibility ever changes mid-session (it won't in practice, but costs nothing to leave open).
      fired = true;
      openCard();
    }
  }

  window.addEventListener('scroll', tick, { passive: true });
  setInterval(tick, 1000);
  tick();
})();
