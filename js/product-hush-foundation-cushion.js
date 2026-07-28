/* HushGlow Design — Foundation Cushion page behaviors */

(function () {
  /* gallery: thumbnails swap the main image, arrows walk the thumb list */
  var main = document.getElementById('galMain');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('#galThumbs img'));
  var current = 0;
  function show(i) {
    if (!thumbs.length) return;
    current = (i + thumbs.length) % thumbs.length;
    main.src = thumbs[current].dataset.full;
    thumbs.forEach(function (t, n) { t.classList.toggle('on', n === current); });
  }
  thumbs.forEach(function (t, n) { t.addEventListener('click', function () { show(n); }); });
  var gp = document.getElementById('galPrev');
  var gn = document.getElementById('galNext');
  if (gp) gp.addEventListener('click', function () { show(current - 1); });
  if (gn) gn.addEventListener('click', function () { show(current + 1); });

  /* shade swatches: highlight, swap main photo (per-shade), update texts + sticky bar */
  var swName = document.getElementById('swName');
  var swDesc = document.getElementById('swDesc');
  var satcMeta = document.getElementById('satcMeta');
  var satcImg = document.getElementById('satcImg');
  document.querySelectorAll('.swb').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.swb').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      swName.textContent = b.dataset.shade;
      swDesc.textContent = 'is ' + b.dataset.desc;
      main.src = b.dataset.img;
      thumbs.forEach(function (t) { t.classList.remove('on'); });
      if (satcMeta) satcMeta.textContent = b.dataset.shade + ' · $39.99';
      if (satcImg) satcImg.src = b.dataset.img;
    });
  });

  /* accordions (USP + bottom tabs) */
  document.querySelectorAll('.acc .acc-t').forEach(function (t) {
    t.addEventListener('click', function () { t.parentElement.classList.toggle('open'); });
  });

  /* bundle picker: radio behaviour */
  document.querySelectorAll('.bun').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.bun').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });
  var sub = document.querySelector('.subbox');
  if (sub) sub.addEventListener('click', function () { sub.classList.toggle('on'); });

  /* add to cart opens the cart drawer prototype */
  var atc = document.getElementById('atcBtn');
  if (atc) atc.addEventListener('click', function () { cartToggle(true); });
  var satcBtn = document.getElementById('satcBtn');
  if (satcBtn) satcBtn.addEventListener('click', function () { cartToggle(true); });

  /* sticky ATC bar: appears once the buy button scrolls out of view */
  var satc = document.getElementById('satc');
  if (satc && atc && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      satc.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(atc);
  }

  /* lazy videos: load + play when in view, pause when out */
  var vids = document.querySelectorAll('video[data-src]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.src = v.dataset.src; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { v.pause(); }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* before / after slider */
  var range = document.getElementById('cmpRange');
  var beforeWrap = document.getElementById('beforeWrap');
  var handle = document.getElementById('cmpHandle');
  if (range && beforeWrap && handle) {
    var apply = function () {
      var v = range.value;
      beforeWrap.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      handle.style.left = v + '%';
    };
    range.addEventListener('input', apply);
    apply();
  }

  /* banner slider arrows */
  var bs = document.getElementById('bsRow');
  var bp = document.getElementById('bsPrev');
  var bn = document.getElementById('bsNext');
  if (bs && bp && bn) {
    var step = function () {
      var img = bs.querySelector('img');
      var gap = parseFloat(getComputedStyle(bs).gap) || 0;
      return img.getBoundingClientRect().width + gap;
    };
    bp.addEventListener('click', function () { bs.scrollBy({ left: -step(), behavior: 'smooth' }); });
    bn.addEventListener('click', function () { bs.scrollBy({ left: step(), behavior: 'smooth' }); });
    var sync = function () {
      bp.toggleAttribute('disabled', bs.scrollLeft < 10);
      bn.toggleAttribute('disabled', bs.scrollLeft > bs.scrollWidth - bs.clientWidth - 10);
    };
    bs.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }
})();
