/* ================================================================
   K&A THEME JS — ka-theme.js
   Vanilla JS only. No third-party libraries.
   Loaded defer from theme.liquid.
================================================================ */
(function () {
  'use strict';

  /* --- Nav scroll crystallisation -------------------------------- */
  var nav = document.getElementById('ka-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* --- Hero bg entry zoom --------------------------------------- */
  var heroBg = document.getElementById('ka-hero-bg');
  if (heroBg) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroBg.classList.add('loaded');
      });
    });
  }

  /* --- Scroll-driven reveals (IntersectionObserver) ------------- */
  function kaRevealAll(scope) {
    var els = (scope || document).querySelectorAll('.reveal, .reveal-img');
    els.forEach(function (el) { el.classList.add('visible'); });
  }

  if (window.Shopify && window.Shopify.designMode) {
    /* In the theme editor: skip animation, show everything immediately.
       Without this, editing a section setting (e.g. swapping an image)
       causes Shopify to re-render the section — new .reveal elements
       start at opacity:0 and the IO never re-fires because the elements
       are already in the viewport when they're injected. */
    kaRevealAll();
    document.addEventListener('shopify:section:load', function (e) {
      kaRevealAll(e.target);
    });
  } else {
    var revealEls = document.querySelectorAll('.reveal, .reveal-img');
    if ('IntersectionObserver' in window && revealEls.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.10,
        rootMargin: '0px 0px -40px 0px'
      });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* --- Mobile nav ------------------------------------------------ */
  var navToggle = document.getElementById('ka-nav-toggle');
  var navClose  = document.getElementById('ka-nav-close');
  var mobileNav = document.getElementById('ka-mobile-nav');

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openNav);
  if (navClose)  navClose.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* --- Parallax on hero (desktop only, F8/spec) ----------------- */
  /* Only applies when min-width 900px — disabled on mobile to prevent jank */
  var heroBgEl = document.querySelector('.ka-hero__bg');
  var heroEl   = document.querySelector('.ka-hero');
  if (heroBgEl && heroEl && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var heroHeight = heroEl.offsetHeight;
      if (scrolled < heroHeight) {
        heroBgEl.style.transform = 'scale(1) translateY(' + (scrolled * 0.22) + 'px)';
      }
    }, { passive: true });
  }

  /* ================================================================
     BAG (CART) — global, sitewide. Add-to-Bag CTA architecture
     (Docs/cta-architecture-revision.md, Round 2). These two helpers
     live here, not in a per-page asset, because the header bag icon
     + mobile drawer "My Bag" row are part of ka-nav.liquid, which is
     rendered on every template (home/collection/product/cart) — the
     badge must stay correct no matter which page triggered the add.
  ================================================================ */

  /* --- Bag count badge: every .ka-nav__bag__count / .mn-bag-count
     node sitewide (desktop icon + mobile drawer row) gets kept in
     sync from one call. data-count drives the CSS empty-state hide
     (see ka-nav.css [data-count="0"] { display:none }). ----------- */
  function kaUpdateBagCount(count) {
    var nodes = document.querySelectorAll('[data-ka-bag-count]');
    nodes.forEach(function (el) {
      el.textContent = count > 0 ? count : '';
      el.setAttribute('data-count', count);
    });
  }
  window.kaUpdateBagCount = kaUpdateBagCount;

  /* On every page load, read the real cart state once so the badge is
     correct even if the visitor arrives with items already in their
     bag from a previous session (no add-to-bag action on this page
     view at all — e.g. browsing the homepage with 2 pieces already
     bagged from yesterday). */
  fetch('/cart.js', { credentials: 'same-origin' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (cart) { if (cart) kaUpdateBagCount(cart.item_count); })
    .catch(function () { /* fails silently — badge simply stays at its rendered default */ });

  /* --- Shared toast trigger -------------------------------------- */
  /* Each page renders its own #kaToast / #kaToastSub markup instance
     (see ka-base.css .ka-toast for the shared styling contract). This
     helper just finds whichever instance exists on the current page
     and drives it, so Product-page addToBag() and Collection-grid
     quick-add can both call the same function instead of duplicating
     the show/hide/timeout logic three times. */
  var kaToastTimer = null;
  function kaShowToast(message, opts) {
    var toast = document.getElementById('kaToast');
    var sub = document.getElementById('kaToastSub');
    if (!toast) return;
    if (sub && message) sub.textContent = message;
    toast.classList.add('show');
    clearTimeout(kaToastTimer);
    var duration = (opts && opts.duration) || 4200;
    kaToastTimer = setTimeout(function () { toast.classList.remove('show'); }, duration);
  }
  window.kaShowToast = kaShowToast;

})();
