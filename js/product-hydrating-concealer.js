/* HushGlow Design — Hydrating Concealer Stick page behaviors.

   Only the EIGHT SHADES gallery is specific to this template. Everything else — the
   buy box, bundle tiers with their offer timer and per-unit shade pickers, upsell tabs,
   sliders, sticky ATC, lazy videos, payment rows — comes from shared.js.
   The script tag sits at the end of <body>, so the DOM is already parsed. */
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
    gal.querySelectorAll('[data-shade-strip]').forEach((t, n) => {
      t.classList.toggle('is-selected', n === current);
      if (n === current) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }

  const strip = [...gal.querySelectorAll('[data-shade-strip]')];
  const detail = gal.querySelector('[data-shade-detail]');
  const backdrop = gal.querySelector('[data-shade-backdrop]');
  const phone = () => window.matchMedia('(max-width: 749px)').matches;

  /* On a phone the panel is a sheet: tapping a shade opens it over the grid, the way
     the live block behaves. On desktop the same panel is simply always in view. */
  /* The backdrop stays in the DOM and is transparent with pointer-events off when
     closed, so opening is a single synchronous class change: no waiting on a frame,
     which a throttled or background tab may not give us. */
  function openSheet () {
    if (!phone()) return;
    detail.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeSheet () {
    detail.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  thumbs.forEach((t, i) => t.addEventListener('click', () => { select(i); openSheet(); }));
  strip.forEach((t, i) => t.addEventListener('click', () => select(i)));
  gal.querySelector('[data-shade-prev]').addEventListener('click', () => select(current - 1));
  gal.querySelector('[data-shade-next]').addEventListener('click', () => select(current + 1));
  gal.querySelector('[data-shade-close]').addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  /* a rotation into desktop must not leave the page scroll-locked */
  window.addEventListener('resize', () => { if (!phone()) closeSheet(); });
})();
