/* K&A collection description: collapse/expand toggle.
   The full text is always in the DOM. We only add .is-collapsed (a CSS
   max-height + fade) when the measured height shows a real overflow, so
   with JS off the whole note simply shows. */
(function () {
  var body = document.getElementById('ka-coll-desc-body');
  if (!body || !body.hasAttribute('data-collapsible')) return;
  var btn = document.querySelector('.ka-coll-desc__toggle');
  if (!btn) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var collapsedPx = 0;
  function collapse() {
    body.classList.add('is-js');
    body.classList.add('is-collapsed');
    // 15.5em in px at the body's computed font size
    collapsedPx = parseFloat(getComputedStyle(body).fontSize) * 15.5;
    body.style.maxHeight = collapsedPx + 'px';
  }

  var fullHeight = body.scrollHeight;
  var fontPx = parseFloat(getComputedStyle(body).fontSize);
  // Only collapse if the note is meaningfully longer than the collapsed height
  if (fullHeight <= fontPx * 15.5 + fontPx * 3) return;

  collapse();
  btn.hidden = false;

  body.addEventListener('transitionend', function () {
    if (btn.getAttribute('aria-expanded') === 'true') body.style.maxHeight = 'none';
  });

  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    if (!reduce) body.classList.add('is-animating');
    if (expanded) {
      collapsedPx = parseFloat(getComputedStyle(body).fontSize) * 15.5;
      body.style.maxHeight = body.scrollHeight + 'px';
      void body.offsetHeight; // reflow so the transition starts from the full height
      body.style.maxHeight = collapsedPx + 'px';
      body.classList.add('is-collapsed');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = btn.getAttribute('data-label-more');
    } else {
      body.style.maxHeight = body.scrollHeight + 'px';
      body.classList.remove('is-collapsed');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = btn.getAttribute('data-label-less');
    }
  });
})();
