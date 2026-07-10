/* ================================================================
   K&A CURRENCY MODULE — ka-currency.js
   Task 86. Vanilla JS only, no third-party libraries — matches the
   ka-theme.js IIFE pattern. Loaded defer from layout/theme.liquid,
   ONLY when settings.enable_currency_converter is on.

   WHAT THIS IS: a display-only price converter. It rewrites the text
   content of every [data-price] element on the page into a target
   currency (INR/USD/GBP/CAD/AED). It NEVER touches Shopify's cart,
   checkout, cart.total_price, line-item prices or any Ajax Cart API
   call — those all remain in INR, exactly as Shopify processes them.
   This module only ever changes what is painted on screen.
   (Docs/currency-module-build-spec.md, Feasibility Flag F1.)

   [data-price] elements carry Shopify's raw integer price (the same
   cents/paise integer the `money` Liquid filters consume — see each
   section's Liquid for `{{ product.price }}` etc. used verbatim as
   the attribute value). This script divides by 100 to get the
   INR-rupee amount before converting.

   Detection order (identical to the anti-flash pre-paint script in
   layout/theme.liquid — the two MUST stay in lock-step or the F2
   no-flash guarantee breaks):
     1. Manual override cached in localStorage (ka_currency_override).
     2. Server-rendered visitor country (`{{ localization.country.iso_code }}`,
        rendered into <html data-ka-country="…">) mapped through a
        fixed country → currency table.
     3. Default: INR (no conversion, no chip menu entry disabled —
        INR is a first-class option all its own).

   Exchange rates: fetched from open.er-api.com/v6/latest/INR (free,
   keyless) and cached in localStorage for 24h. Swappable later for
   exchangerate-api.com with a Suraj-owned key if preferred — only
   fetchRates() below would need to change.
================================================================ */
(function () {
  'use strict';

  var CURRENCIES = {
    INR: { code: 'INR', name: 'Indian Rupee',    symbol: '₹',  symbolIsCode: false, round: 100 },
    USD: { code: 'USD', name: 'US Dollar',       symbol: '$',  symbolIsCode: false, round: 5   },
    GBP: { code: 'GBP', name: 'British Pound',   symbol: '£',  symbolIsCode: false, round: 5   },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', symbolIsCode: false, round: 5   },
    AED: { code: 'AED', name: 'UAE Dirham',      symbol: 'AED', symbolIsCode: true, round: 25  }
  };
  var CURRENCY_ORDER = ['INR', 'USD', 'GBP', 'CAD', 'AED'];
  var COUNTRY_CURRENCY_MAP = { US: 'USD', GB: 'GBP', CA: 'CAD', AE: 'AED' };

  var OVERRIDE_KEY = 'ka_currency_override';
  var RATE_CACHE_KEY = 'ka_currency_rates_v1';
  var RATE_TTL_MS = 24 * 60 * 60 * 1000; /* 24h, per CLAUDE.md backlog note + spec F3 */
  var RATE_ENDPOINT = 'https://open.er-api.com/v6/latest/INR';
  /* Static fallback rates (approx, mid-2026) — used only if the live
     fetch fails AND no cached rate exists yet (e.g. first visit, API
     down). Keeps the module functional rather than silently INR-only. */
  var FALLBACK_RATES = { INR: 1, USD: 1 / 87, GBP: 1 / 110, CAD: 1 / 63, AED: 1 / 24 };

  var activeCode = 'INR';
  var currentRates = null;
  var lastFocusedTrigger = null;

  /* ---------------------------------------------------------------
     Detection — must mirror layout/theme.liquid's inline pre-paint
     script exactly, or the anti-flash guarantee (F2) breaks.
  --------------------------------------------------------------- */
  function detectCurrency() {
    try {
      var override = localStorage.getItem(OVERRIDE_KEY);
      if (override && CURRENCIES[override]) return override;
    } catch (e) { /* localStorage unavailable — fall through to detection */ }

    var country = document.documentElement.getAttribute('data-ka-country');
    if (country && COUNTRY_CURRENCY_MAP[country]) return COUNTRY_CURRENCY_MAP[country];

    return 'INR';
  }

  /* ---------------------------------------------------------------
     Rate fetch + daily cache
  --------------------------------------------------------------- */
  function getCachedRates() {
    try {
      var raw = localStorage.getItem(RATE_CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.rates || !parsed.fetchedAt) return null;
      /* Daily cache — a visitor with a cart open overnight won't see
         her total's currency math shift mid-session (spec F3): the
         cache only refreshes once it's >24h old, not on every visit. */
      if (Date.now() - parsed.fetchedAt > RATE_TTL_MS) return null;
      return parsed.rates;
    } catch (e) {
      return null;
    }
  }

  function setCachedRates(rates) {
    try {
      localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rates: rates, fetchedAt: Date.now() }));
    } catch (e) { /* storage unavailable/full — rates just re-fetch next load */ }
  }

  function fetchRates() {
    var cached = getCachedRates();
    if (cached) return Promise.resolve(cached);

    return fetch(RATE_ENDPOINT)
      .then(function (res) {
        if (!res.ok) throw new Error('Currency rate fetch failed: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || data.result !== 'success' || !data.rates) throw new Error('Unexpected rate payload');
        var rates = {
          INR: 1,
          USD: data.rates.USD,
          GBP: data.rates.GBP,
          CAD: data.rates.CAD,
          AED: data.rates.AED
        };
        setCachedRates(rates);
        return rates;
      })
      .catch(function () {
        return FALLBACK_RATES;
      });
  }

  /* ---------------------------------------------------------------
     Conversion + formatting
  --------------------------------------------------------------- */
  function roundForCurrency(amount, code) {
    var cur = CURRENCIES[code];
    if (!cur || !cur.round) return Math.round(amount);
    return Math.round(amount / cur.round) * cur.round;
  }

  /* rupees -> converted whole-number amount in `code`, rounded per
     Section 3 §5's per-currency increments. */
  function convertRupees(rupees, code, rates) {
    if (code === 'INR') return Math.round(rupees); /* INR source prices are already round (spec §3.5) */
    var rate = rates && rates[code];
    if (!rate) return rupees; /* defensive: no rate available, don't misrepresent — show INR value */
    return roundForCurrency(rupees * rate, code);
  }

  function formatAmount(amount, code) {
    var cur = CURRENCIES[code];
    if (!cur) return String(amount);
    var locale = code === 'INR' ? 'en-IN' : 'en-US';
    var formatted = Math.round(amount).toLocaleString(locale);
    if (code === 'INR') return '₹' + formatted;
    return cur.symbolIsCode ? cur.symbol + ' ' + formatted : cur.symbol + formatted;
  }

  function chipLabel(code) {
    var cur = CURRENCIES[code];
    if (!cur) return code;
    return cur.symbolIsCode ? cur.symbol : cur.symbol + ' ' + cur.code;
  }

  /* ---------------------------------------------------------------
     DOM rendering
  --------------------------------------------------------------- */
  function applyCurrency(code, rates, opts) {
    opts = opts || {};
    var animate = opts.animate !== false;

    var priceEls = document.querySelectorAll('[data-price]');
    priceEls.forEach(function (el) {
      if (el.id === 'ka-currency-bridge') return; /* handled separately below */
      var cents = parseFloat(el.getAttribute('data-price'));
      if (isNaN(cents)) return;
      var rupees = cents / 100;
      var amount = convertRupees(rupees, code, rates);
      var text = formatAmount(amount, code);
      if (animate) {
        el.style.opacity = '0';
        setTimeout(function () { el.textContent = text; el.style.opacity = ''; }, 160);
      } else {
        el.textContent = text;
      }
    });

    updateBridge(code, rates, animate);
    updateChipLabels(code, animate);
    updateMenuSelection(code);
    document.documentElement.setAttribute('data-ka-active-currency', code);
  }

  /* The one sanctioned exception to "replace, never append" — the
     cart's conversion bridge line (Section 2.5). Only rendered when
     active currency isn't INR; an Indian visitor never sees it. */
  function updateBridge(code, rates, animate) {
    var bridge = document.getElementById('ka-currency-bridge');
    if (!bridge) return;

    if (code === 'INR') {
      bridge.classList.remove('show');
      return;
    }

    var cents = parseFloat(bridge.getAttribute('data-price'));
    var rate = rates && rates[code];
    if (isNaN(cents) || !rate) {
      bridge.classList.remove('show');
      return;
    }

    var rupees = cents / 100;
    var convertedAmt = convertRupees(rupees, code, rates);
    var displayRate = Math.round(1 / rate);
    var convertedLabel = formatAmount(convertedAmt, code);
    var inrLabel = '₹' + Math.round(rupees).toLocaleString('en-IN');

    var amtEl = bridge.querySelector('.ka-currency-bridge__amt');
    var rateEl = bridge.querySelector('.ka-currency-bridge__rate');
    var inrEl = bridge.querySelector('.ka-currency-bridge__inr');

    function render() {
      if (amtEl) amtEl.textContent = convertedLabel;
      if (rateEl) rateEl.textContent = displayRate;
      if (inrEl) inrEl.textContent = inrLabel;
      bridge.classList.add('show');
    }

    if (animate) {
      bridge.style.opacity = '0';
      setTimeout(function () { render(); bridge.style.opacity = ''; }, 160);
    } else {
      render();
    }
  }

  function updateChipLabels(code, animate) {
    var label = chipLabel(code);
    var labels = document.querySelectorAll('[data-ka-currency-chip-label]');
    labels.forEach(function (el) {
      if (animate) {
        el.style.opacity = '0';
        setTimeout(function () { el.textContent = label; el.style.opacity = ''; }, 160);
      } else {
        el.textContent = label;
      }
    });
  }

  function updateMenuSelection(code) {
    var rows = document.querySelectorAll('.ka-currency-menu__row');
    rows.forEach(function (r) {
      r.setAttribute('aria-selected', r.getAttribute('data-code') === code ? 'true' : 'false');
    });
  }

  function renderMenu() {
    var list = document.getElementById('ka-currency-menu-list');
    if (!list) return;
    list.innerHTML = '';
    CURRENCY_ORDER.forEach(function (code) {
      var cur = CURRENCIES[code];
      var li = document.createElement('li');
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'ka-currency-menu__row';
      row.setAttribute('role', 'option');
      row.setAttribute('data-code', code);
      row.setAttribute('aria-selected', code === activeCode ? 'true' : 'false');
      var codeLabel = cur.symbolIsCode ? cur.symbol : cur.symbol + ' ' + cur.code;
      var dot = document.createElement('span');
      dot.className = 'ka-currency-menu__dot';
      dot.setAttribute('aria-hidden', 'true');
      var codeSpan = document.createElement('span');
      codeSpan.className = 'ka-currency-menu__code';
      codeSpan.textContent = codeLabel;
      var nameSpan = document.createElement('span');
      nameSpan.className = 'ka-currency-menu__name';
      nameSpan.textContent = cur.name;
      row.appendChild(dot);
      row.appendChild(codeSpan);
      row.appendChild(nameSpan);
      row.addEventListener('click', function () { selectCurrency(code); });
      li.appendChild(row);
      list.appendChild(li);
    });
  }

  function selectCurrency(code) {
    if (!CURRENCIES[code]) return;

    try { localStorage.setItem(OVERRIDE_KEY, code); } catch (e) { /* ignore */ }

    updateMenuSelection(code);

    /* Section 3 §4: dot moves instantly (immediate feedback via
       updateMenuSelection above), menu closes ~240ms later, THEN the
       chip + every price cross-fades to the new currency — one
       settled moment, not a scattered flicker down the page. */
    setTimeout(function () {
      closeMenu();
      activeCode = code;
      applyCurrency(code, currentRates, { animate: true });
    }, 240);
  }

  /* ---------------------------------------------------------------
     Menu open/close — one shared element, two triggers (utility-bar
     chip + mobile-drawer row), per Section 2.3.
  --------------------------------------------------------------- */
  var menu, scrim, chipDesktop, chipMobile, menuClose;

  function openMenu(trigger) {
    if (!menu) return;
    lastFocusedTrigger = trigger || null;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    if (scrim) scrim.classList.add('show');
    if (chipDesktop) chipDesktop.setAttribute('aria-expanded', 'true');
    if (chipMobile) chipMobile.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    if (scrim) scrim.classList.remove('show');
    if (chipDesktop) chipDesktop.setAttribute('aria-expanded', 'false');
    if (chipMobile) chipMobile.setAttribute('aria-expanded', 'false');
    /* Standard disclosure-pattern behaviour: focus returns to whichever
       trigger opened the menu (Section 3 §7). */
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  function toggleMenu(trigger) {
    if (!menu) return;
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu(trigger);
    }
  }

  function wireMenuInteractions() {
    menu = document.getElementById('ka-currency-menu');
    scrim = document.getElementById('ka-currency-scrim');
    chipDesktop = document.getElementById('ka-currency-chip');
    chipMobile = document.getElementById('ka-currency-chip-mobile');
    menuClose = document.getElementById('ka-currency-menu-close');

    if (!menu) return; /* markup not present — feature likely disabled server-side */

    if (chipDesktop) chipDesktop.addEventListener('click', function () { toggleMenu(chipDesktop); });
    if (chipMobile) chipMobile.addEventListener('click', function () { toggleMenu(chipMobile); });
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (scrim) scrim.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target)) return;
      if (chipDesktop && chipDesktop.contains(e.target)) return;
      if (chipMobile && chipMobile.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------------------------------------------------------------
     Init
  --------------------------------------------------------------- */
  function revealPrices() {
    /* Removes the anti-flash gate set by layout/theme.liquid's inline
       pre-paint script (F2) — safe to call even if the attribute was
       never set (INR visitors never had it in the first place). */
    document.documentElement.removeAttribute('data-ka-currency-pending');
  }

  function init() {
    activeCode = detectCurrency();
    wireMenuInteractions();
    renderMenu();

    fetchRates()
      .then(function (rates) {
        currentRates = rates;
        applyCurrency(activeCode, rates, { animate: false });
        revealPrices();
      })
      .catch(function () {
        revealPrices();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
