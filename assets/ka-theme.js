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

  /* --- Enquiry click tracking -------------------------------------
     WhatsApp / appointment CTAs are real <a href="https://wa.me/...">
     links tagged data-ka-enquiry="whatsapp|appointment" and
     data-ka-placement="<name>". On click we publish a Shopify customer
     event ('ka_enquiry_click') that a Customer Events custom pixel
     forwards to GA4 (Docs/enquiry-tracking-custom-pixel.md). Strictly
     fire-and-forget: wrapped in try/catch, never preventDefault, so
     navigation can never be blocked or delayed by tracking. */
  function kaTrackEnquiry(type, placement, handle) {
    try {
      if (!handle) {
        var m = window.location.pathname.match(/\/products\/([^\/?#]+)/);
        handle = m ? m[1] : '';
      }
      if (window.Shopify && Shopify.analytics && typeof Shopify.analytics.publish === 'function') {
        Shopify.analytics.publish('ka_enquiry_click', {
          placement: placement || '',
          enquiry_type: type || '',
          product_handle: handle || '',
          page_path: window.location.pathname
        });
      }
    } catch (err) { /* tracking must never affect the click */ }
  }
  window.kaTrackEnquiry = kaTrackEnquiry;
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-ka-enquiry]') : null;
    if (!el) return;
    kaTrackEnquiry(el.getAttribute('data-ka-enquiry'), el.getAttribute('data-ka-placement'), el.getAttribute('data-ka-product'));
  });

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

  /* --- Mobile drawer: Collections accordion (header-by-silhouette spec).
     `inert` keeps collapsed links out of the tab order; CSS also hides
     the collapsed block (visibility), so browsers without `inert` are
     still correct, and an open block never has inert set. ---------- */
  var mCollToggle = document.getElementById('ka-m-coll-toggle');
  var mCollSub    = document.getElementById('ka-m-coll-sub');
  if (mCollToggle && mCollSub) {
    var mCollInner = mCollSub.querySelector('.ka-mobile-nav__sub-inner');
    mCollToggle.addEventListener('click', function () {
      var open = mCollToggle.getAttribute('aria-expanded') !== 'true';
      mCollToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mCollSub.classList.toggle('is-open', open);
      if (mCollInner) {
        if (open) mCollInner.removeAttribute('inert'); else mCollInner.setAttribute('inert', '');
      }
    });
  }

  /* --- Desktop Collections panel (header-by-silhouette spec). Hover only
     on fine pointers (140ms intent delay); chevron button click / Enter /
     Space toggles; Esc closes and returns focus to the chevron; focus
     leaving item+panel or a scrim click closes. ---------------------- */
  var collItem   = document.getElementById('ka-coll-item');
  var collToggle = document.getElementById('ka-coll-toggle');
  var collPanel  = document.getElementById('ka-coll-panel');
  var collScrim  = document.getElementById('ka-nav-scrim');
  if (nav && collItem && collToggle && collPanel && collScrim) {
    var collTimer = null;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    var openPanel = function () {
      clearTimeout(collTimer);
      collPanel.classList.add('is-open');
      collScrim.classList.add('is-open');
      nav.classList.add('is-panel-open');
      collToggle.setAttribute('aria-expanded', 'true');
    };
    var closePanel = function (returnFocus) {
      clearTimeout(collTimer);
      collPanel.classList.remove('is-open');
      collScrim.classList.remove('is-open');
      nav.classList.remove('is-panel-open');
      collToggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) collToggle.focus();
    };
    collToggle.addEventListener('click', function () {
      if (collToggle.getAttribute('aria-expanded') === 'true') closePanel(false); else openPanel();
    });
    [collItem, collPanel].forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (!canHover.matches) return;
        clearTimeout(collTimer);
        if (!collPanel.classList.contains('is-open')) collTimer = setTimeout(openPanel, 140);
      });
      el.addEventListener('mouseleave', function () {
        if (!canHover.matches) return;
        clearTimeout(collTimer);
        collTimer = setTimeout(function () { closePanel(false); }, 140);
      });
    });
    document.addEventListener('focusin', function (e) {
      if (!collPanel.classList.contains('is-open')) return;
      if (!collItem.contains(e.target) && !collPanel.contains(e.target)) closePanel(false);
    });
    collScrim.addEventListener('click', function () { closePanel(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && collPanel.classList.contains('is-open')) closePanel(true);
    });
    /* Keyboard order fix: the panel is the last child of <nav> (after logo
       and icons), so natural Tab order from the chevron would leave the
       item and trigger focus-out close. While open, manage the three
       boundary moves explicitly. Each move closes/keeps the panel
       deliberately BEFORE focusing, so the focusin close rule never
       misfires (it only acts while the panel is open and focus is outside
       item+panel; managed targets are inside, or the panel is already
       closed). Shift+Tab on the chevron is left to the browser. */
    collItem.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || e.shiftKey || e.target !== collToggle) return;
      if (!collPanel.classList.contains('is-open')) return;
      var first = collPanel.querySelector('a[href]');
      if (!first) return;
      e.preventDefault();
      first.focus();
    });
    collPanel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !collPanel.classList.contains('is-open')) return;
      var links = collPanel.querySelectorAll('a[href]');
      if (!links.length) return;
      var firstLink = links[0], lastLink = links[links.length - 1];
      if (e.shiftKey && e.target === firstLink) {
        e.preventDefault();
        collToggle.focus();
      } else if (!e.shiftKey && e.target === lastLink) {
        e.preventDefault();
        var nextLi = collItem.nextElementSibling;
        var next = nextLi && nextLi.querySelector('a[href], button');
        closePanel(false);
        if (next) next.focus();
      }
    });
  }

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
