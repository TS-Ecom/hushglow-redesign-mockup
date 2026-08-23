document.addEventListener('DOMContentLoaded', function () {
/* ---- Shade gallery (EIGHT SHADES) ---- */
(function () {
  const gal = document.querySelector('.shgal');
  if (!gal) return;

  const CDN = 'https://hushglow.com/cdn/shop/files/';
  const shades = [
    ['01 Soft Porcelain', 'HUSH1183_1.webp?v=1783879856'],
    ['02 Light Apricot', 'HUSH0201_1.webp?v=1783879621'],
    ['03 Natural Nude', 'HUSH1377_1.webp?v=1783879320'],
    ['04 Light Caramel', 'HUSH1716_1.webp?v=1783879463'],
    ['05 Warm Brown', 'HUSH0544_1.webp?v=1783880177'],
    ['06 Cocoa Tan', 'HUSH0642_1.webp?v=1783880385'],
    ['07 Dark Mocha', 'HUSH1129_1.webp?v=1783880551'],
    ['08 Deep Chocolate', 'HUSH1350_1.webp?v=1783880660']
  ];

  const thumbs = [...gal.querySelectorAll('.shgal__thumb')];
  const photo = gal.querySelector('[data-shade-photo]');
  const name = gal.querySelector('[data-shade-name]');
  let current = 0;

  function select(i) {
    current = (i + shades.length) % shades.length;
    const [label, file] = shades[current];
    photo.src = CDN + file + '&width=900';
    photo.alt = label;
    name.textContent = label;
    thumbs.forEach((t, n) => {
      const on = n === current;
      t.classList.toggle('is-selected', on);
      if (on) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    });
  }

  thumbs.forEach((t, i) => t.addEventListener('click', () => select(i)));
  gal.querySelector('[data-shade-prev]').addEventListener('click', () => select(current - 1));
  gal.querySelector('[data-shade-next]').addEventListener('click', () => select(current + 1));
})();

/* ---- Upsell tabs: Often bought with / Save with bundles ---- */
(function () {
  const tabs = document.querySelectorAll('.uptabs [data-uptab]');
  if (!tabs.length) return;
  const panes = document.querySelectorAll('.uppane[data-uppane]');
  tabs.forEach(t => t.addEventListener('click', () => {
    const i = t.dataset.uptab;
    tabs.forEach(x => x.classList.toggle('on', x === t));
    panes.forEach(p => p.classList.toggle('on', p.dataset.uppane === i));
  }));
})();

});

/* HushGlow Design — Multi-Effect Blush Stick page behaviors (page-specific only;
   gallery, swatches, accordions, bundle selection, sliders, sticky ATC, lazy videos and
   the payment rows all live in shared.js) */

(function () {
  /* Mix & match offer timer. Counts down to the end of the store day and restarts, so the
     prototype never sits on 00:00:00 the way the reference page does. */
  var t = document.getElementById('bundleTimer');
  if (t) {
    var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var tick = function () {
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      var d = Math.max(0, end - new Date());
      t.textContent = pad2(Math.floor(d / 3600000)) + ':' + pad2(Math.floor(d / 60000) % 60) + ':' + pad2(Math.floor(d / 1000) % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Per-unit shade pickers inside a bundle. On the live page this is the Kaching Bundles
     app; here each chip cycles through the six shades so the flow can be seen: every unit
     in the tier is chosen separately, which is the part of the block worth reviewing. */
  var SHADES = [
    ['01 Soft Porcelain', '#eabd94'],
    ['02 Light Apricot', '#d9ae8e'],
    ['03 Natural Nude', '#d8a47c'],
    ['04 Light Caramel', '#ab6c49'],
    ['05 Warm Brown', '#9a552b'],
    ['06 Cocoa Tan', '#743c23'],
    ['07 Dark Mocha', '#74321a'],
    ['08 Deep Chocolate', '#562b1b']
    ['03 Soft Peach', '#c9725f'],
    ['04 Nude Pink', '#cd6876'],
    ['05 Chestnut Rose', '#994044'],
    ['06 Vibrant Poppy', '#982e3a']
  ];
  document.querySelectorAll('.bun .bsel').forEach(function (chip) {
    var name = (chip.textContent || '').replace(/[#\d▾]/g, '').trim();
    var i = 0;
    SHADES.forEach(function (s, n) { if (s[0].indexOf(name) > -1 || name.indexOf(s[0]) > -1) i = n; });
    chip.addEventListener('click', function (e) {
      /* the chip sits inside the tier's <label>: without this the click would also
         re-select the tier and swallow the change */
      e.preventDefault();
      e.stopPropagation();
      i = (i + 1) % SHADES.length;
      var unit = chip.dataset.unit || '';
      chip.innerHTML = '#' + unit + '<span class="bsw" style="background:' + SHADES[i][1] + '"></span>' + SHADES[i][0] + '<i>▾</i>';
    });
  });
})();

