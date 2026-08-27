/* HushGlow Design — shared behaviors (used on every page) */

/* mobile fullscreen menu */
function menuToggle () {
  var m = document.querySelector('.mobmenu');
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
  var d = document.querySelector('.cartdrawer');
  var o = document.querySelector('.cart-ovl');
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

  /* Payment icon rows. One builder for every row on the page: the element says which
     set it wants with data-payicons, so a snippet can be dropped anywhere and more than
     one row can live on a page. Shop Pay has no icon on that CDN, so it is inlined. */
  var PAY_CDN = 'https://merodacosmetics.com/cdn/shopifycloud/storefront/assets/payment_icons/';
  var PAY_SETS = {
    cart: ['visa-b614b878', 'master-f5a74105', 'american_express-2bdbf0e2', 'apple_pay-1721ebad', 'google_pay-34c30515'],
    footer: ['master-f5a74105', 'visa-b614b878', 'paypal-a7c68b85', 'apple_pay-1721ebad', 'google_pay-34c30515', 'american_express-2bdbf0e2', 'cartes_bancaires-208c079b', 'diners_club-678e3046', 'jcb-a0a4f44a', 'maestro-61c41725', 'v_pay-357b67f9', 'visaelectron-0283c8cd', 'discover-59880595', 'elo-2d6b82b5']
  };
  var SHOP_PAY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24"><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000"></path><path d="M35.889 0C37.05 0 38 .982 38 2.182v19.636c0 1.2-.95 2.182-2.111 2.182H2.11C.95 24 0 23.018 0 21.818V2.182C0 .982.95 0 2.111 0H35.89z" fill="#5A31F4"></path><path d="M9.35 11.368c-1.017-.223-1.47-.31-1.47-.705 0-.372.306-.558.92-.558.54 0 .934.238 1.225.704a.079.079 0 00.104.03l1.146-.584a.082.082 0 00.032-.114c-.475-.831-1.353-1.286-2.51-1.286-1.52 0-2.464.755-2.464 1.956 0 1.275 1.15 1.597 2.17 1.82 1.02.222 1.474.31 1.474.705 0 .396-.332.582-.993.582-.612 0-1.065-.282-1.34-.83a.08.08 0 00-.107-.035l-1.143.57a.083.083 0 00-.036.111c.454.92 1.384 1.437 2.627 1.437 1.583 0 2.539-.742 2.539-1.98s-1.155-1.598-2.173-1.82v-.003zM15.49 8.855c-.65 0-1.224.232-1.636.646a.04.04 0 01-.069-.03v-2.64a.08.08 0 00-.08-.081H12.27a.08.08 0 00-.08.082v8.194a.08.08 0 00.08.082h1.433a.08.08 0 00.081-.082v-3.594c0-.695.528-1.227 1.239-1.227.71 0 1.226.521 1.226 1.227v3.594a.08.08 0 00.081.082h1.433a.08.08 0 00.081-.082v-3.594c0-1.51-.981-2.577-2.355-2.577zM20.753 8.62c-.778 0-1.507.24-2.03.588a.082.082 0 00-.027.109l.632 1.088a.08.08 0 00.11.03 2.5 2.5 0 011.318-.366c1.25 0 2.17.891 2.17 2.068 0 1.003-.736 1.745-1.669 1.745-.76 0-1.288-.446-1.288-1.077 0-.361.152-.657.548-.866a.08.08 0 00.032-.113l-.596-1.018a.08.08 0 00-.098-.035c-.799.299-1.359 1.018-1.359 1.984 0 1.46 1.152 2.55 2.76 2.55 1.877 0 3.227-1.313 3.227-3.195 0-2.018-1.57-3.492-3.73-3.492zM28.675 8.843c-.724 0-1.373.27-1.845.746-.026.027-.069.007-.069-.029v-.572a.08.08 0 00-.08-.082h-1.397a.08.08 0 00-.08.082v8.182a.08.08 0 00.08.081h1.433a.08.08 0 00.081-.081v-2.683c0-.036.043-.054.069-.03a2.6 2.6 0 001.808.7c1.682 0 2.993-1.373 2.993-3.157s-1.313-3.157-2.993-3.157zm-.271 4.929c-.956 0-1.681-.768-1.681-1.783s.723-1.783 1.681-1.783c.958 0 1.68.755 1.68 1.783 0 1.027-.713 1.783-1.681 1.783h.001z" fill="#fff"></path></svg>';
  var payImg = function (name) { return '<img src="' + PAY_CDN + name + '.svg" alt="">'; };

  document.querySelectorAll('[data-payicons]').forEach(function (row) {
    var set = PAY_SETS[row.dataset.payicons] || PAY_SETS.footer;
    var html = set.map(payImg).join('');
    if (row.dataset.payicons === 'cart') html += SHOP_PAY + payImg('paypal-a7c68b85');
    row.innerHTML = html;
  });
})();

/* Cart drawer contents.

   The drawer markup is identical on every page; the line item, the free-gift progress
   and the totals are derived here from the product the visitor is actually looking at,
   so the prototype never shows someone a cushion in the bag while they are reading the
   blush page. Nine hand-kept copies used to drift apart instead.

   In the theme this whole block goes away: the cart section renders the real cart. */
(function () {
  var drawer = document.querySelector('.cartdrawer');
  var bar = document.querySelector('.satc');
  if (!drawer || !bar) return;

  var money = function (el) { return el ? parseFloat((el.textContent || '').replace(/[^0-9.]/g, '')) : NaN; };
  var name = (bar.querySelector('.smid b') || {}).textContent;
  var now = money(bar.querySelector('.sprice .pn'));
  var was = money(bar.querySelector('.sprice s'));
  if (!name || !now) return;

  /* the first gallery frame and the chosen swatch, so the row matches the page */
  var swatch = document.querySelector('.info .swrow .swb.on');
  var photo = document.querySelector('.gal .thumbs img');

  var item = drawer.querySelector('.item');
  if (item) {
    var ph = item.querySelector('.ph img');
    if (ph && photo) ph.src = (photo.dataset.full || photo.src).replace(/width=\d+/, 'width=300');
    var nm = item.querySelector('.name');
    if (nm) nm.textContent = name;
    var shade = item.querySelector('.shade');
    if (shade) {
      if (swatch) {
        shade.innerHTML = '<span class="sw" style="background:' + (swatch.style.background || swatch.style.backgroundColor) + '"></span>' + swatch.dataset.shade;
      } else {
        shade.remove();           /* products sold as a set carry no shade line */
      }
    }
    var right = item.querySelector('.right');
    if (right) {
      right.innerHTML = '<div class="price">$' + now.toFixed(2) + '</div>' +
        (was ? '<div class="was">$' + was.toFixed(2) + '</div>' : '');
    }
  }

  /* free gift at $80: message and bar both read off the same subtotal */
  var GIFT = 80;
  var left = Math.max(0, GIFT - now);
  var msg = drawer.querySelector('.gmsg');
  if (msg) {
    msg.innerHTML = left > 0
      ? 'Spend another <b>$' + left.toFixed(2) + '</b> for <b>Cosmetic Bag</b>'
      : 'Your <b>Cosmetic Bag</b> is unlocked';
  }
  var fill = drawer.querySelector('.g1bar div');
  if (fill) fill.style.width = Math.min(100, Math.round(now / GIFT * 100)) + '%';

  /* totals */
  var save = drawer.querySelector('.d-foot .tsave');
  if (save) {
    if (was > now) save.querySelector('.r').textContent = '$' + (was - now).toFixed(2);
    else save.remove();
  }
  var sub = drawer.querySelector('.d-foot .row:not(.ship):not(.tsave) .r');
  if (sub) sub.textContent = '$' + now.toFixed(2);
  var co = drawer.querySelector('.d-foot .co');
  if (co) co.lastChild.textContent = 'Secure Checkout \u00b7 $' + now.toFixed(2);

  /* Show the cross-sell that is not already in the bag. Both blocks ship in the markup
     so the slot is filled on every page and no page carries its own copy. */
  var hls = drawer.querySelectorAll('.hl[data-hl]');
  var shown = false;
  hls.forEach(function (h) {
    var mine = h.dataset.hl === name;
    h.hidden = mine || shown;
    if (!h.hidden) shown = true;
  });
  /* nor may "complete your look" list it */
  drawer.querySelectorAll('.cyl .ccard').forEach(function (c) {
    var t = (c.querySelector('.nm') || {}).textContent || '';
    if (t.trim() === name.trim()) c.remove();
  });
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


/* ================= PRODUCT PAGE BEHAVIORS ================= */
/* Moved out of the Foundation Cushion page file when the blush stick page was added.
   Every block guards on its own elements, so pages that lack a widget simply skip it. */
(function () {

  /* Gallery. The markup carries one <img> plus the thumb list; that image is replaced
     here by a track holding every photo, so changing frame is a slide rather than a src
     swap. The live theme's media gallery moves the same way, and a still swap reads as
     broken next to it. Markup is left alone so all product pages get this for free.

     Wired per .gal, not by id: a Shopify section can be placed twice on the same page
     (a quick-view beside the main gallery, two products on a landing page), and two
     galleries sharing one id would leave the second one dead. Everything below scopes
     to its own container for the same reason. */
  document.querySelectorAll('.gal').forEach(function (gal) {
    var main = gal.querySelector('.gmain img');
    var thumbs = Array.prototype.slice.call(gal.querySelectorAll('.thumbs img'));
    if (!main || !thumbs.length) return;
    var current = 0;

    /* A thumb carrying data-video builds a video slide instead of a photo one — the live
       galleries mix the two (the setting spray leads with a clip). The thumb itself stays
       a still with a play badge, exactly as the theme's media gallery does. */
    var track = document.createElement('div');
    track.className = 'gtrack';
    thumbs.forEach(function (t, i) {
      var slide = document.createElement('div');
      slide.className = 'gslide';
      if (t.dataset.video) {
        var vid = document.createElement('video');
        vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.setAttribute('playsinline', '');
        vid.preload = i === 0 ? 'metadata' : 'none';
        vid.poster = t.dataset.full;
        vid.dataset.gslideSrc = t.dataset.video;
        slide.appendChild(vid);
        /* img cannot carry a pseudo-element, so the badge rides on a wrapper */
        if (t.parentNode && !t.parentNode.classList.contains('thumbvid')) {
          var wrap = document.createElement('span');
          wrap.className = 'thumbvid';
          t.parentNode.insertBefore(wrap, t);
          wrap.appendChild(t);
        }
      } else {
        var im = document.createElement('img');
        im.src = t.dataset.full;
        im.alt = i === 0 ? (main.getAttribute('alt') || '') : '';
        im.decoding = 'async';
        if (i > 1) im.loading = 'lazy';
        slide.appendChild(im);
      }
      track.appendChild(slide);
    });
    main.parentNode.replaceChild(track, main);

    /* only the frame on screen plays: the others stay unloaded */
    var playFrame = function (i) {
      track.querySelectorAll('video').forEach(function (v, n) {
        if (n !== i) { v.pause(); return; }
        if (!v.getAttribute('src')) v.setAttribute('src', v.dataset.gslideSrc);
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      });
    };

    var show = function (i) {
      current = (i + thumbs.length) % thumbs.length;
      track.style.transform = 'translateX(' + (-current * 100) + '%)';
      thumbs.forEach(function (t, n) { t.classList.toggle('on', n === current); });
      var on = thumbs[current];
      if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      playFrame(current);
    };
    show(0);
    thumbs.forEach(function (t, n) { t.addEventListener('click', function () { show(n); }); });

    var gp = gal.querySelector('.galarrow.prev');
    var gn = gal.querySelector('.galarrow.next');
    if (gp) gp.addEventListener('click', function () { show(current - 1); });
    if (gn) gn.addEventListener('click', function () { show(current + 1); });

    /* Swipe the photo itself. Arrows alone are not what a thumb expects on a phone.
       Horizontal intent only: if the finger is travelling more vertically it is a page
       scroll and we stay out of the way. */
    var gmain = gal.querySelector('.gmain');
    if (gmain) {
      var sx = 0, sy = 0, tracking = false;
      gmain.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) { tracking = false; return; }
        sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
      }, { passive: true });
      gmain.addEventListener('touchend', function (e) {
        if (!tracking) return;
        tracking = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - sx, dy = t.clientY - sy;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        show(dx < 0 ? current + 1 : current - 1);
      }, { passive: true });
    }

    /* The shade swatches below need to repoint the first frame. Exposed on the element
       rather than kept in a page-level variable, so a page holding two galleries keeps
       them independent. */
    gal.hgGallery = {
      show: show,
      setFirstFrame: function (url) {
        thumbs[0].dataset.full = url;
        thumbs[0].src = url.replace('width=1200', 'width=200');
        var first = track.querySelector('.gslide img');
        if (first) first.src = url;
        show(0);
      }
    };
  });

  /* Shade swatches. Wired per row rather than across the page: the trio sells a
     foundation shade and a blush shade together, so it carries two rows, and a flat
     query would have cleared the other row's choice on every click. Each row writes
     into the description line that follows it. */
  document.querySelectorAll('.swrow').forEach(function (row) {
    var line = row.nextElementSibling;
    while (line && !line.classList.contains('swdesc')) line = line.nextElementSibling;
    var nameEl = line && line.querySelector('[data-sw-name]');
    var descEl = line && line.querySelector('[data-sw-desc]');
    var scope = row.closest('.pdp') || document;
    var galEl = scope.querySelector('.gal');

    row.querySelectorAll('.swb').forEach(function (b) {
      b.addEventListener('click', function () {
        row.querySelectorAll('.swb').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        if (nameEl) nameEl.textContent = b.dataset.shade;
        if (descEl) descEl.textContent = b.dataset.desc;
        /* Only products whose shades have their own photo swap the first frame. The kit
           and the trio sell a set in several shades and carry no per-shade image, so
           there the swatch changes the name and nothing else. */
        if (!b.dataset.img) return;
        if (galEl && galEl.hgGallery) galEl.hgGallery.setFirstFrame(b.dataset.img);
      });
    });
  });

  /* accordions (USP + bottom tabs): slide open/closed instead of snapping. The panel is
     measured on each toggle, so copy length never has to be guessed, and once open the
     height is released to none so reflow (font swap, orientation change) still fits. */
  document.querySelectorAll('.acc .acc-t').forEach(function (t) {
    t.addEventListener('click', function () {
      var acc = t.parentElement;
      var panel = acc.querySelector('.acc-c');
      /* measured per panel, so copy length never has to be guessed */
      if (panel) acc.style.setProperty('--acc-h', panel.scrollHeight + 'px');
      acc.classList.toggle('open');
    });
  });

  /* before / after slider: the range input covers the whole box, so dragging anywhere
     over the image moves the seam */
  document.querySelectorAll('.cmpbox').forEach(function (box) {
    var range = box.querySelector('input[type=range]');
    var before = box.querySelector('.beforewrap');
    var handle = box.querySelector('.cmphandle');
    if (!range || !before || !handle) return;
    var apply = function () {
      before.style.clipPath = 'inset(0 ' + (100 - range.value) + '% 0 0)';
      handle.style.left = range.value + '%';
    };
    range.addEventListener('input', apply);
    apply();
  });

  /* Travel Puff toggle: on by default, so the add-on is opted out of rather than into */
  document.querySelectorAll('.puff .ptoggle').forEach(function (t) {
    t.addEventListener('click', function () {
      var on = t.classList.toggle('on');
      t.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  });

  /* Countdowns. Every clock on the site runs to the end of the store day and restarts,
     so the prototype never sits on 00:00:00 the way the reference page does. An element
     marked data-countdown="hms" carries the whole clock (the bundle offer timer); "h",
     "m" and "s" each carry one unit (the sale bar). One timer drives them all — this was
     three separate copies across the cushion, blush and concealer page files. */
  var clocks = document.querySelectorAll('[data-countdown]');
  if (clocks.length) {
    var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var tickClocks = function () {
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      var d = Math.max(0, end - new Date());
      var u = {
        h: pad2(Math.floor(d / 3600000)),
        m: pad2(Math.floor(d / 60000) % 60),
        s: pad2(Math.floor(d / 1000) % 60)
      };
      clocks.forEach(function (el) {
        var f = el.dataset.countdown;
        el.textContent = f === 'hms' ? u.h + ':' + u.m + ':' + u.s : (u[f] || '');
      });
    };
    tickClocks();
    setInterval(tickClocks, 1000);
  }

  /* Per-unit shade pickers inside a bundle tier. On the live page this is the Kaching
     Bundles app; here each chip cycles the shades so the flow can be seen, because every
     unit in the tier is chosen separately and that is the part worth reviewing.

     The shade list is read off the buy box's own swatch row rather than repeated here:
     in the theme both come from the same variant loop, so they cannot drift apart. */
  document.querySelectorAll('.bundles').forEach(function (group) {
    var box = group.closest('.info') || document;
    var shades = Array.prototype.map.call(box.querySelectorAll('.swrow .swb'), function (b) {
      return [b.dataset.shade, b.style.background || b.style.backgroundColor];
    });
    if (!shades.length) return;
    group.querySelectorAll('.bun .bsel').forEach(function (chip) {
      var label = (chip.textContent || '').replace(/[#\d\u25be]/g, '').trim();
      var i = 0;
      shades.forEach(function (sh, n) {
        if (sh[0].indexOf(label) > -1 || label.indexOf(sh[0]) > -1) i = n;
      });
      chip.addEventListener('click', function (e) {
        /* the chip sits inside the tier's <label>: without this the click would also
           re-select the tier and swallow the change */
        e.preventDefault();
        e.stopPropagation();
        i = (i + 1) % shades.length;
        var unit = chip.dataset.unit || '';
        chip.innerHTML = '#' + unit + '<span class="bsw" style="background:' + shades[i][1] + '"></span>' + shades[i][0] + '<i>\u25be</i>';
      });
    });
  });

  /* bundle picker: radio behaviour within its own group, so a page carrying two bundle
     blocks does not clear the other one's choice */
  document.querySelectorAll('.bundles').forEach(function (group) {
    var tiers = group.querySelectorAll('.bun');
    tiers.forEach(function (b) {
      b.addEventListener('click', function () {
        tiers.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
  });

  /* add to cart opens the cart drawer prototype */
  var atc = document.querySelector('.atcbig');
  document.querySelectorAll('.atcbig, .satc .btn').forEach(function (b) {
    b.addEventListener('click', function () { cartToggle(true); });
  });

  /* sticky ATC bar: appears once the buy button scrolls out of view */
  var satc = document.querySelector('.satc');
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
  /* A page can carry its own line on the strip: the concealer runs three text-only
     claims, the other products run the brand's three icon claims. */
  /* Press marquee: two identical halves scrolling past each other, so the loop has no
     seam. Moved out of the home page file when the quiz hub page needed the same strip. */
  var PRESS = [
    ['https://hushglow.com/cdn/shop/files/Mask_group.png?width=300', 'Glamour'],
    ['https://hushglow.com/cdn/shop/files/2560px-Grazia-Logo_1.png?width=300', 'Grazia'],
    ['https://hushglow.com/cdn/shop/files/Elle_logo_1.png?width=300', 'Elle']
  ];
  document.querySelectorAll('.press .ticker .half').forEach(function (half) {
    half.innerHTML = '';
    for (var r = 0; r < 3; r++) {
      PRESS.forEach(function (l) {
        var img = document.createElement('img');
        img.src = l[0]; img.alt = l[1];
        half.appendChild(img);
      });
    }
  });

  var PS_DEFAULT = [
    [psIcons.leaf, 'Cruelty Free'],
    [psIcons.brush, 'Used by Makeup Artists'],
    [psIcons.drop, 'Skin Care-Infused']
  ];
  document.querySelectorAll('.pstrip').forEach(function (strip) {
    var own = strip.dataset.items ? strip.dataset.items.split('|') : null;
    var items = own ? own.map(function (t) { return ['', t.trim()]; }) : PS_DEFAULT;
    /* two identical halves scroll past each other, so the loop has no seam */
    strip.querySelectorAll('.ticker .half').forEach(function (half) {
      half.innerHTML = '';
      for (var r = 0; r < 3; r++) {
        items.forEach(function (it) {
          var sp = document.createElement('span');
          sp.className = 'pi';
          sp.innerHTML = it[0] + it[1];
          half.appendChild(sp);
        });
      }
    });
  });

  /* Paged rails: one step per card, dots and edge-disabled arrows. Marked with
     data-slider on the wrapper and data-slider-row on the track, so the same code drives
     the campaign banner slider and the product rail on the quiz page. Add
     data-slider-auto to the wrapper for the banners' 4s auto-advance; a rail of products
     someone is reading should not move on its own, so it is opt-in. */
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var bs = slider.querySelector('[data-slider-row]');
    var bp = slider.querySelector('.lookarrow.prev');
    var bn = slider.querySelector('.lookarrow.next');
    var bd = slider.querySelector('.bsdots');
    if (!bs || !bp || !bn) return;
    var slides = Array.prototype.slice.call(bs.children);
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
    if (!reduce && slider.hasAttribute('data-slider-auto')) {
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
  });

  /* Collection sort. Reorders the cards that are already on the page rather than
     pretending to fetch: the prototype has the whole collection in the markup, and a
     control that does nothing is worse than no control. Featured is the markup order,
     so it is remembered rather than recomputed. */
  document.querySelectorAll('[data-collection-sort]').forEach(function (sel) {
    var grid = sel.closest('.inner').querySelector('.collgrid');
    if (!grid) return;
    var featured = Array.prototype.slice.call(grid.children);
    sel.addEventListener('change', function () {
      var order = featured.slice();
      if (sel.value === 'price-asc') order.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
      else if (sel.value === 'price-desc') order.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
      else if (sel.value === 'name') order.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); });
      order.forEach(function (c) { grid.appendChild(c); });
    });
  });

  /* Testimonial rails. Wired per wrapper rather than by id: the concealer template
     carries two review rails, and the cards are .tcard on one page and .rcard on the
     others, so the step is measured from whichever card the rail actually holds. */
  document.querySelectorAll('.twrap').forEach(function (wrap) {
    var tr = wrap.querySelector('.trow');
    var tp = wrap.querySelector('.lookarrow.prev');
    var tn = wrap.querySelector('.lookarrow.next');
    if (!tr || !tp || !tn) return;
    var tstep = function () {
      var card = tr.querySelector('.tcard, .rcard');
      if (!card) return tr.clientWidth;
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
  });

  /* Read More expands a clamped testimonial, so every card starts the same height */
  document.querySelectorAll('.tcard .tmore').forEach(function (link) {
    var card = link.closest('.tcard');
    link.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      link.textContent = open ? 'Read Less' : 'Read More';
    });
  });

  /* upsell tabs: Often Bought With / Save with Bundles */
  document.querySelectorAll('.upsells').forEach(function (block) {
    var tabs = block.querySelectorAll('.uptabs b');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('on'); });
        tab.classList.add('on');
        block.querySelectorAll('.uppane').forEach(function (p) {
          p.classList.toggle('on', p.dataset.pane === tab.dataset.tab);
        });
      });
    });
  });

  /* the whole upsell row is the target, not just the button: on a phone people tap the
     photo or the name and expect the item to be added */
  document.querySelectorAll('.upcard').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.upbtn')) return;
      var btn = card.querySelector('.upbtn');
      if (btn) btn.click();
    });
  });

  /* upsell Add: the item is in the cart, so the button stays on Added.
     It must not fall back to its idle label: the idle label lives in two spans, a short
     one for desktop and a long one for mobile, and restoring it as text printed both. */
  document.querySelectorAll('.upbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('added')) return;
      b.classList.add('added');
      b.textContent = 'Added ✓';
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

})();
