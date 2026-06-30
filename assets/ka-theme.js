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


})();
