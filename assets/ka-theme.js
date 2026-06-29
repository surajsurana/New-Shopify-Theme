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

  /* --- Newsletter form ------------------------------------------ */
  /*
   * Default: submits to Shopify native customer endpoint via
   * Liquid form tag. The JS below handles the Thank you micro-
   * interaction after confirmed submission (Shopify posts back
   * with ?customer_posted=true on the contact form, or the
   * {% form 'customer' %} sets form.posted_successfully? in Liquid.
   * If Klaviyo is connected later, replace the form action and
   * remove this JS handler — the Klaviyo embed handles success state.
   */
  var newsletterForm = document.querySelector('.ka-newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      /* Only intercept if the form is the JS prototype version (no action attr set).
         The real Shopify form has action=/contact#contact_form and is handled server-side. */
      var input = newsletterForm.querySelector('input[type=email]');
      var btn   = newsletterForm.querySelector('.ka-newsletter__submit');
      /* If native Shopify form, let it submit normally.
         If this is called after AJAX (future Klaviyo integration), update UI. */
      if (input && btn && !newsletterForm.hasAttribute('action')) {
        e.preventDefault();
        if (input.value) {
          btn.textContent = 'Thank you';
          input.value = '';
          input.placeholder = 'You are on the list.';
        }
      }
    });
  }

})();
