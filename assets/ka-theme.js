/* ================================================================
   K&A SITEWIDE THEME JS — ka-theme.js
   Loaded on every template (layout/theme.liquid). Vanilla JS only.

   Responsibilities:
   1. Homepage scroll → .scrolled toggle on #ka-nav (crystallise on scroll)
   2. Mobile nav drawer open/close
   3. Sitewide reveal-on-scroll animation (.reveal / .reveal-img)
   4. Bag count badge sync — window.kaUpdateBagCount(count) updates every
      [data-ka-bag-count] node (desktop nav icon + mobile drawer row).
      Fetches /cart.js on every page load so the badge is correct even
      after a customer navigates away and back (e.g. browser back button
      after an Ajax cart add elsewhere).
   5. Toast helper — window.kaShowToast(message, opts) drives whichever
      #kaToast/#kaToastSub markup exists on the current page (Product page
      and Collection grid both have their own toast markup/CSS, this just
      supplies one shared driver function so neither page has to duplicate
      the show/hide timing logic).
================================================================ */
(function () {
  'use strict';

  /* ---------- bag count sync (sitewide) ---------- */
  window.kaUpdateBagCount = function (count) {
    var nodes = document.querySelectorAll('[data-ka-bag-count]');
    nodes.forEach(function (el) {
      el.setAttribute('data-count', count);
      el.textContent = count > 0 ? count : '';
    });
  };

  fetch('/cart.js', { credentials: 'same-origin' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (cart) {
      if (cart) window.kaUpdateBagCount(cart.item_count);
    })
    .catch(function () { /* non-fatal: badge just stays at server-rendered count */ });

  /* ---------- toast helper (sitewide) ---------- */
  window.kaShowToast = function (message, opts) {
    opts = opts || {};
    var toast = document.getElementById('kaToast');
    if (!toast) return;
    var sub = document.getElementById('kaToastSub');
    if (sub) sub.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__kaToastTimer);
    window.__kaToastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, opts.duration || 2600);
  };

  /* ---------- nav: scroll crystallise (homepage only) ---------- */
  var nav = document.getElementById('ka-nav');
  if (nav && nav.classList.contains('ka-nav') && !nav.classList.contains('ka-nav--settled')) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav drawer ---------- */
  var toggle = document.getElementById('ka-nav-toggle');
  var closeBtn = document.getElementById('ka-nav-close');
  var drawer = document.getElementById('ka-mobile-nav');
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  /* ---------- sitewide reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-img');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }
})();
