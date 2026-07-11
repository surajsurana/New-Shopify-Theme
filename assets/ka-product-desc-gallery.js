/*
  ka-product-desc-gallery.js
  K&A · Product Description · Compact Image Gallery + Lightbox

  Extracts <img> tags from {{ product.description }} output inside
  #ka-desc-root, removes their now-empty <p>/<figure> wrappers, builds a
  2-column .ka-desc-gallery grid, and appends it at the bottom of
  the description. Text content (headings, paragraphs, lists) stays
  in place above. Click any image to open a fullscreen lightbox.

  Before extracting images, also sweeps #ka-desc-root for editor-inserted
  "empty" block elements (e.g. <p>&nbsp;</p>, <p></p>) that Shopify's
  rich-text editor commonly leaves behind and that aren't tied to any
  image — left alone, these render as blank space via their own
  margin/line-height even though they carry no visible content.

  CSS lives in ka-product-desc.css. No dependencies.
*/
(function () {
  'use strict';

  var root = document.getElementById('ka-desc-root');
  if (!root) return;

  /* An element counts as "empty" if it has no embeddable media and no
     real text once non-breaking spaces are treated as whitespace.
     String.prototype.trim() strips U+00A0 (non-breaking space) per the
     ECMAScript WhiteSpace production, so an editor-inserted
     "<p>&nbsp;</p>" correctly trims down to an empty string here. */
  function isEmptyNode(el) {
    if (el.querySelector('img, video, iframe')) return false;
    var text = el.textContent.trim();
    return text === '';
  }

  /* Walk up from el, removing each ancestor that has become empty,
     stopping at root (never remove root itself). */
  function removeIfEmpty(el) {
    while (el && el !== root && el.parentElement) {
      if (!isEmptyNode(el)) break;
      var parent = el.parentElement;
      parent.removeChild(el);
      el = parent;
    }
  }

  /* ── Sweep: drop stray empty paragraphs/wrappers not tied to any
     image (e.g. a leftover <p>&nbsp;</p> before/after an image block).
     Runs first so it never touches elements that still contain media. */
  Array.prototype.forEach.call(root.querySelectorAll('p, div, figure'), function (el) {
    if (el.parentElement && isEmptyNode(el)) {
      el.parentElement.removeChild(el);
    }
  });

  var rawImgs = root.querySelectorAll('img');
  if (!rawImgs.length) return;

  /* ── Collect image data and remove from inline positions ───────── */
  var galleryItems = [];

  rawImgs.forEach(function (img) {
    var caption = '';
    var figure = img.closest('figure');
    var inFigure = figure && root.contains(figure);
    if (inFigure) {
      var fc = figure.querySelector('figcaption');
      if (fc) caption = fc.textContent.trim();
    }

    galleryItems.push({
      src:     img.src,
      srcset:  img.srcset || '',
      sizes:   img.sizes  || '',
      alt:     img.alt    || '',
      caption: caption
    });

    if (inFigure) {
      // The figure's whole job (image + caption) has been captured above —
      // remove it outright. Leaving it in place (even once the <img> is
      // gone) still renders an orphaned figcaption plus the figure's own
      // block margin, i.e. more unwanted empty-looking space.
      if (figure.parentElement) {
        figure.parentElement.removeChild(figure);
      }
    } else {
      var parent = img.parentElement;
      parent.removeChild(img);
      // Climb up removing now-empty wrappers (e.g. <p></p>, or nested
      // <div><p><img></p></div>), not just the immediate parent.
      removeIfEmpty(parent);
    }
  });

  if (!galleryItems.length) return;

  /* ── Build gallery ─────────────────────────────────────────────── */
  var galleryEl = document.createElement('div');
  galleryEl.className = 'ka-desc-gallery';
  if (galleryItems.length === 1) {
    galleryEl.classList.add('ka-desc-gallery--single');
  }

  var headerEl = document.createElement('div');
  headerEl.className = 'ka-desc-gallery__header';
  var labelSpan = document.createElement('span');
  labelSpan.className = 'ka-desc-gallery__header-label';
  labelSpan.textContent = 'Atelier Details';
  headerEl.appendChild(labelSpan);
  galleryEl.appendChild(headerEl);

  var gridEl = document.createElement('div');
  gridEl.className = 'ka-desc-gallery__grid';

  galleryItems.forEach(function (item, idx) {
    var cell = document.createElement('div');
    cell.className = 'ka-desc-gallery__item';
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label',
      'View full image' + (item.alt ? ': ' + item.alt : ' ' + (idx + 1))
    );

    var img = document.createElement('img');
    img.src      = item.src;
    img.alt      = item.alt;
    img.loading  = 'lazy';
    img.decoding = 'async';
    if (item.srcset) img.srcset = item.srcset;
    if (item.sizes)  img.sizes  = item.sizes;

    var iconEl = document.createElement('span');
    iconEl.className = 'ka-desc-gallery__expand-icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.innerHTML =
      '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5"' +
        ' stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    cell.appendChild(img);
    cell.appendChild(iconEl);

    cell.addEventListener('click', function () { openLightbox(idx); });
    cell.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });

    gridEl.appendChild(cell);
  });

  galleryEl.appendChild(gridEl);
  root.appendChild(galleryEl);

  /* ── Build lightbox ────────────────────────────────────────────── */
  var lbEl = document.createElement('div');
  lbEl.className = 'ka-lightbox-desc';
  lbEl.setAttribute('role', 'dialog');
  lbEl.setAttribute('aria-modal', 'true');
  lbEl.setAttribute('aria-label', 'Image viewer');

  lbEl.innerHTML = [
    '<div class="ka-lightbox-desc__stage">',
      '<button class="ka-lightbox-desc__prev" aria-label="Previous image">',
        '<svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M16 20L9 13L16 6" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>',
        '</svg>',
      '</button>',
      '<div class="ka-lightbox-desc__frame">',
        '<img class="ka-lightbox-desc__img" src="" alt="" loading="eager">',
        '<p class="ka-lightbox-desc__caption"></p>',
        '<p class="ka-lightbox-desc__counter"></p>',
      '</div>',
      '<button class="ka-lightbox-desc__next" aria-label="Next image">',
        '<svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M10 6L17 13L10 20" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>',
        '</svg>',
      '</button>',
      '<button class="ka-lightbox-desc__close" aria-label="Close image viewer">',
        '<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/>',
        '</svg>',
        '<span>Close</span>',
      '</button>',
    '</div>'
  ].join('');

  document.body.appendChild(lbEl);

  var lbImg     = lbEl.querySelector('.ka-lightbox-desc__img');
  var lbCaption = lbEl.querySelector('.ka-lightbox-desc__caption');
  var lbCounter = lbEl.querySelector('.ka-lightbox-desc__counter');
  var lbPrev    = lbEl.querySelector('.ka-lightbox-desc__prev');
  var lbNext    = lbEl.querySelector('.ka-lightbox-desc__next');
  var lbClose   = lbEl.querySelector('.ka-lightbox-desc__close');

  var currentIdx = 0;
  var prevFocus  = null;

  function updateLightbox() {
    var item = galleryItems[currentIdx];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.caption || item.alt || '';
    lbCounter.textContent = (currentIdx + 1) + ' — ' + galleryItems.length;
    var showNav = galleryItems.length > 1;
    lbPrev.style.visibility = showNav ? 'visible' : 'hidden';
    lbNext.style.visibility = showNav ? 'visible' : 'hidden';
  }

  function openLightbox(idx) {
    prevFocus  = document.activeElement;
    currentIdx = idx;
    updateLightbox();
    lbEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { lbClose.focus(); }, 50);
  }

  function closeLightbox() {
    lbEl.classList.remove('is-open');
    document.body.style.overflow = '';
    if (prevFocus) setTimeout(function () { prevFocus.focus(); }, 50);
  }

  function prevImage() {
    currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  function nextImage() {
    currentIdx = (currentIdx + 1) % galleryItems.length;
    updateLightbox();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); prevImage(); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); nextImage(); });

  lbEl.addEventListener('click', function (e) {
    if (e.target === lbEl || e.target.classList.contains('ka-lightbox-desc__stage')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lbEl.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  /* Touch swipe on mobile */
  var touchStartX = 0;
  var touchStartY = 0;

  lbEl.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lbEl.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].screenX - touchStartX;
    var dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      if (dx < 0) nextImage();
      else        prevImage();
    }
  }, { passive: true });

})();
