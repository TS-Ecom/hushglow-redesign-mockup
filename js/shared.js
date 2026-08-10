/* HushGlow Design — shared behaviors (used on every page) */

/* mobile fullscreen menu */
function menuToggle () {
  var m = document.getElementById('mobmenu');
  if (!m) return;
  var open = !m.classList.contains('open');
  if (open) {
    var head = document.querySelector('.headwrap');
    m.style.paddingTop = (head.getBoundingClientRect().bottom + 12) + 'px';
  }
  m.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

/* cart drawer (visual prototype): open on bag icon, close on X / overlay / Esc */
function cartToggle (open) {
  var d = document.getElementById('cartDrawer');
  var o = document.getElementById('cartOvl');
  if (!d) return;
  if (typeof open === 'undefined') open = !d.classList.contains('open');
  d.classList.toggle('open', open);
  if (o) o.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
(function () {
  document.querySelectorAll('.bag').forEach(function (b) {
    b.style.cursor = 'pointer';
    b.addEventListener('click', function () { cartToggle(true); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cartToggle(false);
  });

  /* cart payment icons: Visa MC Amex ApplePay GPay ShopPay PayPal (approved set) */
  var row = document.getElementById('cartPayRow');
  if (row) {
    var cdn = ['visa-b614b878', 'master-f5a74105', 'american_express-2bdbf0e2', 'apple_pay-1721ebad', 'google_pay-34c30515'];
    var html = cdn.map(function (p) {
      return '<img src="https://merodacosmetics.com/cdn/shopifycloud/storefront/assets/payment_icons/' + p + '.svg" alt="">';
    }).join('');
    html += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24"><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000"></path><path d="M35.889 0C37.05 0 38 .982 38 2.182v19.636c0 1.2-.95 2.182-2.111 2.182H2.11C.95 24 0 23.018 0 21.818V2.182C0 .982.95 0 2.111 0H35.89z" fill="#5A31F4"></path><path d="M9.35 11.368c-1.017-.223-1.47-.31-1.47-.705 0-.372.306-.558.92-.558.54 0 .934.238 1.225.704a.079.079 0 00.104.03l1.146-.584a.082.082 0 00.032-.114c-.475-.831-1.353-1.286-2.51-1.286-1.52 0-2.464.755-2.464 1.956 0 1.275 1.15 1.597 2.17 1.82 1.02.222 1.474.31 1.474.705 0 .396-.332.582-.993.582-.612 0-1.065-.282-1.34-.83a.08.08 0 00-.107-.035l-1.143.57a.083.083 0 00-.036.111c.454.92 1.384 1.437 2.627 1.437 1.583 0 2.539-.742 2.539-1.98s-1.155-1.598-2.173-1.82v-.003zM15.49 8.855c-.65 0-1.224.232-1.636.646a.04.04 0 01-.069-.03v-2.64a.08.08 0 00-.08-.081H12.27a.08.08 0 00-.08.082v8.194a.08.08 0 00.08.082h1.433a.08.08 0 00.081-.082v-3.594c0-.695.528-1.227 1.239-1.227.71 0 1.226.521 1.226 1.227v3.594a.08.08 0 00.081.082h1.433a.08.08 0 00.081-.082v-3.594c0-1.51-.981-2.577-2.355-2.577zM20.753 8.62c-.778 0-1.507.24-2.03.588a.082.082 0 00-.027.109l.632 1.088a.08.08 0 00.11.03 2.5 2.5 0 011.318-.366c1.25 0 2.17.891 2.17 2.068 0 1.003-.736 1.745-1.669 1.745-.76 0-1.288-.446-1.288-1.077 0-.361.152-.657.548-.866a.08.08 0 00.032-.113l-.596-1.018a.08.08 0 00-.098-.035c-.799.299-1.359 1.018-1.359 1.984 0 1.46 1.152 2.55 2.76 2.55 1.877 0 3.227-1.313 3.227-3.195 0-2.018-1.57-3.492-3.73-3.492zM28.675 8.843c-.724 0-1.373.27-1.845.746-.026.027-.069.007-.069-.029v-.572a.08.08 0 00-.08-.082h-1.397a.08.08 0 00-.08.082v8.182a.08.08 0 00.08.081h1.433a.08.08 0 00.081-.081v-2.683c0-.036.043-.054.069-.03a2.6 2.6 0 001.808.7c1.682 0 2.993-1.373 2.993-3.157s-1.313-3.157-2.993-3.157zm-.271 4.929c-.956 0-1.681-.768-1.681-1.783s.723-1.783 1.681-1.783c.958 0 1.68.755 1.68 1.783 0 1.027-.713 1.783-1.681 1.783h.001z" fill="#fff"></path></svg>';
    html += '<img src="https://merodacosmetics.com/cdn/shopifycloud/storefront/assets/payment_icons/paypal-a7c68b85.svg" alt="">';
    row.innerHTML = html;
  }
})();

/* footer accordion groups (mobile only) */
(function () {
  var mq = window.matchMedia('(max-width: 749px)');
  document.querySelectorAll('.footer .acc-h').forEach(function (h) {
    h.addEventListener('click', function () {
      if (!mq.matches) return;
      var group = h.closest('.fgroup');
      if (group) group.classList.toggle('open');
    });
  });
})();

/* footer payment icons */
(function () {
  var payRow = document.getElementById('payRow');
  if (!payRow) return;
  var pay = ['master-f5a74105', 'visa-b614b878', 'paypal-a7c68b85', 'apple_pay-1721ebad', 'google_pay-34c30515', 'american_express-2bdbf0e2', 'cartes_bancaires-208c079b', 'diners_club-678e3046', 'jcb-a0a4f44a', 'maestro-61c41725', 'v_pay-357b67f9', 'visaelectron-0283c8cd', 'discover-59880595', 'elo-2d6b82b5'];
  pay.forEach(function (p) {
    var img = document.createElement('img');
    img.src = 'https://merodacosmetics.com/cdn/shopifycloud/storefront/assets/payment_icons/' + p + '.svg';
    img.alt = '';
    payRow.appendChild(img);
  });
})();

/* ================= PRODUCT PAGE BEHAVIORS ================= */
/* Moved out of the Foundation Cushion page file when the blush stick page was added.
   Every block guards on its own elements, so pages that lack a widget simply skip it. */
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
    t.addEventListener('click', function () { t.parentElement.classList.toggle('open'); });
  });

  /* bundle picker: radio behaviour */
  document.querySelectorAll('.bun').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.bun').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });

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
        var cell = v.closest('.vcell');
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.src = v.dataset.src; }
          var p = v.play();
          if (p && p.then) { p.then(function () { if (cell) cell.classList.add('playing'); }).catch(function () {}); }
        } else {
          v.pause();
          if (cell) cell.classList.remove('playing');
        }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vio.observe(v); });
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

  /* Read More expands a clamped testimonial, so every card starts the same height */
  document.querySelectorAll('.tcard .tmore').forEach(function (link) {
    var card = link.closest('.tcard');
    link.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      link.textContent = open ? 'Read Less' : 'Read More';
    });
  });

  /* upsell tabs: Often Bought With / Save with Bundles */
  var upTabs = document.getElementById('upTabs');
  if (upTabs) {
    upTabs.querySelectorAll('b').forEach(function (tab) {
      tab.addEventListener('click', function () {
        upTabs.querySelectorAll('b').forEach(function (x) { x.classList.remove('on'); });
        tab.classList.add('on');
        document.querySelectorAll('.uppane').forEach(function (p) {
          p.classList.toggle('on', p.dataset.pane === tab.dataset.tab);
        });
      });
    });
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
