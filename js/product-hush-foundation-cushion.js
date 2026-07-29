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

  /* trust ticker: two identical halves for a seamless loop */
  var psIcons = {
    leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c0 9.5-4.5 15.5-11.5 16C8 14.5 11.5 6.5 20 4z"/><path d="M4 20C8 14 12 10 17 7"/></svg>',
    brush: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 3.5l6 6L12 18l-6-6z"/><path d="M6 12l-2.6 2.6a2.4 2.4 0 0 0 3.4 3.4L9.4 15.4"/></svg>',
    drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5s5.8 6.3 5.8 10.4a5.8 5.8 0 0 1-11.6 0C6.2 9.8 12 3.5 12 3.5z"/></svg>'
  };
  var psItems = [
    [psIcons.leaf, 'Cruelty Free'],
    [psIcons.brush, 'Used by Makeup Artists'],
    [psIcons.drop, 'Skin Care-Infused']
  ];
  ['psHalf1', 'psHalf2'].forEach(function (id) {
    var half = document.getElementById(id);
    if (!half) return;
    for (var r = 0; r < 3; r++) {
      psItems.forEach(function (it) {
        var sp = document.createElement('span');
        sp.className = 'pi';
        sp.innerHTML = it[0] + it[1];
        half.appendChild(sp);
      });
    }
  });

  /* banner slider: square cards, paged one card per step, dots + edge-disabled arrows */
  var bs = document.getElementById('bsRow');
  var bp = document.getElementById('bsPrev');
  var bn = document.getElementById('bsNext');
  var bd = document.getElementById('bsDots');
  if (bs && bp && bn) {
    var slides = Array.prototype.slice.call(bs.querySelectorAll('img'));
    var dots = [];
    var stepB = function () {
      var gap = parseFloat(getComputedStyle(bs).gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    };
    var maxLeft = function () { return bs.scrollWidth - bs.clientWidth; };
    var idxB = function () { return Math.round(bs.scrollLeft / stepB()); };
    var goTo = function (i) {
      bs.scrollTo({ left: Math.min(i * stepB(), maxLeft()), behavior: 'smooth' });
    };
    if (bd) {
      slides.forEach(function (s, n) {
        var d = document.createElement('i');
        if (n === 0) d.classList.add('on');
        d.addEventListener('click', function () { goTo(n); });
        bd.appendChild(d); dots.push(d);
      });
    }
    bp.addEventListener('click', function () { goTo(idxB() - 1); });
    bn.addEventListener('click', function () { goTo(idxB() + 1); });
    var sync = function () {
      bp.toggleAttribute('disabled', bs.scrollLeft < 10);
      bn.toggleAttribute('disabled', bs.scrollLeft > maxLeft() - 10);
      var i = idxB();
      dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
    };
    bs.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* testimonials slider arrows */
  var tr = document.getElementById('tRow');
  var tp = document.getElementById('tPrev');
  var tn = document.getElementById('tNext');
  if (tr && tp && tn) {
    var tstep = function () {
      var card = tr.querySelector('.tcard');
      var gap = parseFloat(getComputedStyle(tr).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    tp.addEventListener('click', function () { tr.scrollBy({ left: -tstep(), behavior: 'smooth' }); });
    tn.addEventListener('click', function () { tr.scrollBy({ left: tstep(), behavior: 'smooth' }); });
    var tsync = function () {
      tp.toggleAttribute('disabled', tr.scrollLeft < 10);
      tn.toggleAttribute('disabled', tr.scrollLeft > tr.scrollWidth - tr.clientWidth - 10);
    };
    tr.addEventListener('scroll', tsync, { passive: true });
    window.addEventListener('resize', tsync);
    tsync();
  }
})();
