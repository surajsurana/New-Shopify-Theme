/* ================================================================
   K&A WELCOME OFFER (KLP3000) — assets/ka-welcome-offer.js
   v2 — Docs/welcome-offer-popup-build-spec.md (version 2.0). Trigger/
   eligibility/interaction state machine, unchanged in scope from v1
   per the spec ("the trigger/eligibility engine remains the one
   genuinely stateful piece of logic, unchanged in scope from v1").

   What changed from the v1 file that was previously deployed here:
   the entire email-capture path is removed — emailToggle/emailForm/
   emailInput/emailSuccess element lookups and their listeners are
   gone, not just disabled, per build spec Section 9's explicit flag
   that this file was the most likely place to have dead code left
   behind from that feature. "Claimed" now has exactly two paths
   (copy the code, or click the CTA) instead of three.

   IIFE + 'use strict' + try/catch-wrapped storage access, matching
   this theme's established style (assets/ka-wishlist.js).
================================================================ */
(function () {
  'use strict';

  var scrim = document.getElementById('kaWelcomeScrim');
  if (!scrim) return; // snippet didn't render (ineligible customer, or blank discount code) — nothing to do.

  var KEY = 'ka_welcome_offer';
  var SESSION_KEY = 'ka_welcome_shown_session';

  var closeBtn = document.getElementById('kaWelcomeClose');
  var dismissBtn = document.getElementById('kaWelcomeDismiss');
  var ctaLink = document.getElementById('kaWelcomeCta');
  var copyBtn = document.getElementById('kaWelcomeCopy');
  var codeValueEl = document.getElementById('kaWelcomeCodeValue');

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

  /* Mutual exclusion with the other sitewide overlays (build spec
     Section 7: don't stack on top of an already-open search overlay or
     mobile drawer — wait and re-check instead). Class names confirmed
     directly against assets/ka-search.js (#ka-search-overlay toggles
     .open) and assets/ka-nav.css (.ka-mobile-nav.open) — same
     convention both places, not the .is-open convention this
     component's own CSS uses for itself. Unchanged from v1. */
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

  /* Copy-to-clipboard also counts as a claim — a visitor who copies the
     code has functionally taken the offer even if they paste it into
     checkout later rather than clicking through immediately. One of
     exactly two claim paths in v2 (the other is the CTA click above);
     v1's third path, email submission, no longer exists. */
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

  /* ---- Trigger: scroll depth OR dwell time, whichever comes first
     (build spec Section 2 — never on page-load, never exit-intent).
     Unchanged from v1. ---- */
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
