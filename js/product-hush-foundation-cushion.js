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

  /* Shade swatches: the shade photo becomes the first slide, the way a variant image does
     on a real product page. Previously it was dropped straight into the main <img> while
     the thumb list kept its own position, so the next arrow jumped to an unrelated photo
     and no thumb stayed marked. */
  var swName = document.getElementById('swName');
  var swDesc = document.getElementById('swDesc');
  document.querySelectorAll('.swb').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.swb').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      swName.textContent = b.dataset.shade;
      swDesc.textContent = 'is ' + b.dataset.desc;
      if (thumbs.length) {
        thumbs[0].dataset.full = b.dataset.img;
        thumbs[0].src = b.dataset.img.replace('width=1200', 'width=200');
        show(0);
      } else {
        main.src = b.dataset.img;
      }
    });
  });

  /* accordions (USP + bottom tabs): slide open/closed instead of snapping. The panel is
     measured on each toggle, so copy length never has to be guessed, and once open the
     height is released to none so reflow (font swap, orientation change) still fits. */
  document.querySelectorAll('.acc .acc-t').forEach(function (t) {
    var acc = t.parentElement;
    var body = acc.querySelector('.acc-c');
    t.addEventListener('click', function () {
      if (!body) { acc.classList.toggle('open'); return; }
      var open = acc.classList.contains('open');
      if (open) {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(function () {
          acc.classList.remove('open');
          body.style.maxHeight = '0px';
        });
      } else {
        acc.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        /* release the cap once open so later reflow (font swap, rotation) still fits.
           transitionend is the trigger, with a timer behind it in case the event never
           lands — otherwise the panel would stay pinned to a stale height. */
        var release = function () {
          if (!acc.classList.contains('open')) return;
          body.style.maxHeight = 'none';
          body.removeEventListener('transitionend', done);
          clearTimeout(fallback);
        };
        var done = function (e) { if (e.propertyName === 'max-height') release(); };
        var fallback = setTimeout(release, 420);
        body.addEventListener('transitionend', done);
      }
    });
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

    /* auto-advance every 4s, loops back at the end; pauses on hover, on touch and while
       the slider is off screen */
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      var timer = null;
      var paused = false;
      var visible = true;
      var advance = function () {
        if (paused || !visible) return;
        if (bs.scrollLeft >= maxLeft() - 10) { bs.scrollTo({ left: 0, behavior: 'smooth' }); }
        else { goTo(idxB() + 1); }
      };
      var start = function () { if (!timer) timer = setInterval(advance, 4000); };
      var stop = function () { clearInterval(timer); timer = null; };
      ['mouseenter', 'touchstart', 'pointerdown'].forEach(function (ev) {
        bs.addEventListener(ev, function () { paused = true; }, { passive: true });
      });
      bs.addEventListener('mouseleave', function () { paused = false; });
      [bp, bn].forEach(function (b) {
        b.addEventListener('click', function () { paused = true; setTimeout(function () { paused = false; }, 8000); });
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.2 }).observe(bs);
      }
      start();
    }
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

  /* sale countdown bar: ticks to the end of the day (placeholder logic for the prototype) */
  var cdH = document.getElementById('cdH');
  var cdM = document.getElementById('cdM');
  var cdS = document.getElementById('cdS');
  if (cdH && cdM && cdS) {
    var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var cdTick = function () {
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      var d = Math.max(0, end - new Date());
      cdH.textContent = pad2(Math.floor(d / 3600000));
      cdM.textContent = pad2(Math.floor(d / 60000) % 60);
      cdS.textContent = pad2(Math.floor(d / 1000) % 60);
    };
    cdTick();
    setInterval(cdTick, 1000);
  }

  /* upsell Add: confirm the tap, then return to idle */
  document.querySelectorAll('.upbtn').forEach(function (b) {
    var idle = b.textContent;
    var timer = null;
    b.addEventListener('click', function () {
      b.classList.add('added');
      b.textContent = 'Added ✓';
      clearTimeout(timer);
      timer = setTimeout(function () {
        b.classList.remove('added');
        b.textContent = idle;
      }, 1600);
    });
  });

  /* section reveal: opacity + transform only, one observer, disconnected as it goes.
     Skipped entirely for reduced motion or without IntersectionObserver, in which case
     the page renders exactly as it does today. */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var reveals = document.querySelectorAll('.pstrip, .section, .benef, .iwt, .cmp, .bslider, .steps, .ibar');
    if (reveals.length) {
      document.documentElement.classList.add('js-reveal');
      reveals.forEach(function (el) { el.classList.add('reveal'); });
      var rio = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          obs.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
      reveals.forEach(function (el) { rio.observe(el); });

      /* Failsafe. This effect hides content until the observer says it is on screen, so a
         browser where callbacks never arrive would leave the whole page below the fold
         blank. A sentinel that is unquestionably in view proves the observer actually
         fires; if it hasn't within a second, the effect is torn down and everything shows. */
      var sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
      document.body.appendChild(sentinel);
      var alive = false;
      var probe = new IntersectionObserver(function () { alive = true; probe.disconnect(); });
      probe.observe(sentinel);
      setTimeout(function () {
        sentinel.remove();
        if (alive) return;
        probe.disconnect();
        rio.disconnect();
        document.documentElement.classList.remove('js-reveal');
      }, 1000);
    }
  }

  /* muted payment icons under the shipping bar */
  var payMini = document.getElementById('payMini');
  if (payMini) {
    ['visa-b614b878', 'master-f5a74105', 'american_express-2bdbf0e2', 'paypal-a7c68b85', 'apple_pay-1721ebad', 'google_pay-34c30515', 'maestro-61c41725', 'discover-59880595'].forEach(function (pIcon) {
      var img = document.createElement('img');
      img.src = 'https://merodacosmetics.com/cdn/shopifycloud/storefront/assets/payment_icons/' + pIcon + '.svg';
      img.alt = '';
      payMini.appendChild(img);
    });
  }
})();
