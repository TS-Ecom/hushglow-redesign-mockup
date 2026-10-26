/* HushGlow Design — Build Your Own Set: behaviour.

   One state object drives everything on the page: the cards, the desktop set panel, the
   mobile bar and sheet, the cart drawer. Rules follow the Figma dev spec (task 869eukyhc):
   - every item counts toward the level, two of the same count as two:
     3 / 5 / 7 items give 10 / 15 / 20% off (Ivan, 26.10);
   - one product = one shade, nothing pre-selected; + adds another of the same shade;
   - the free Cosmetic Bag unlocks at $80 after the set discount;
   - the set is kept in sessionStorage until it goes to the cart.
   In the theme this file is replaced by the section's own script; prices and photos here
   come from the live store (products.json, 26.10). */
(function () {
  'use strict';
  const main = document.getElementById('bb');
  if (!main) return;

  /* ---------- data ---------- */
  const CDN = 'https://cdn.shopify.com/s/files/1/0727/1897/5233/files/';
  const src = (f, w) => f ? CDN + f + (f.indexOf('?') > -1 ? '&' : '?') + 'width=' + (w || 400) : '';
  const sh = (n, c, p) => ({ n, c, p });
  const PRODUCTS = [
    { id: 'foundation', name: 'Lines-Blurring Foundation Cushion', short: 'Foundation Cushion', price: 39.99, reviews: '1,321', group: 'face',
      photo: '1_1296_1296___Ivory_2.webp?v=1783946768',
      shades: [sh('Ivory', '#eaded0', '1_1296_1296___Ivory_2.webp?v=1783946768'), sh('Honey Almond', '#e4cfb3', '1_1296_1296___Almond_1.webp?v=1783951463'),
        sh('Warm', '#dabf9f', '1_1296_1296___Warm_1.webp?v=1783951463'), sh('Caramel Glow', '#cfad85', '1_1296_1296___Caramel_1.webp?v=1783951463'),
        sh('Brunet Brown', '#c3a486', '1_1296_1296___Brunet_1.webp?v=1783951463'), sh('Deep Mocha', '#96745b', '1_1296_1296___Deep_1.webp?v=1783951462')] },
    { id: 'concealer', name: 'Hydrating Concealer Stick', short: 'Concealer Stick', price: 37.99, reviews: '6', group: 'face',
      photo: 'Frame1707481341.webp?v=1783851683',
      shades: [sh('01 Soft Porcelain', '#eabd94', 'Soft_Porcelain.webp?v=1786025680'), sh('02 Light Apricot', '#d9ae8e', 'Light_Apricot.webp?v=1786025684'),
        sh('03 Natural Nude', '#d8a47c', 'Natural_Nude.webp?v=1786025690'), sh('04 Light Caramel', '#ab6c49', 'Light_Caramel.webp?v=1786025705'),
        sh('05 Warm Brown', '#9a552b', 'Warm_Brown.webp?v=1786025696'), sh('06 Cocoa Tan', '#743c23', 'Cocoa_Tan.webp?v=1786025709'),
        sh('07 Dark Mocha', '#74321a', 'Dark_Mocha.webp?v=1786025713'), sh('08 Deep Chocolate', '#562b1b', 'Deep_Chocolate.webp?v=1786025717')] },
    { id: 'blush', name: 'Multi-Effect Blush Stick', short: 'Blush Stick', price: 32.99, reviews: '23', group: 'face',
      photo: '1_1296_1296__1_f0399e93-04db-49d1-8887-d7e1110acf2e.webp?v=1783021817',
      shades: [sh('01 Vintage Red', '#d82d59', '1_1296_1296_Vintage_Red.webp?v=1783022115'), sh('02 Soft Rose', '#f38ca1', '1_1296_1296_Soft_Rose.webp?v=1783022143'),
        sh('03 Soft Peach', '#c9725f', '1_1296_1296_Soft_Peach.webp?v=1783022148'), sh('04 Nude Pink', '#cd6876', '1_1296_1296_Nude_Pink.webp?v=1783022152'),
        sh('05 Chestnut Rose', '#994044', '1_1296_1296_Chestnut_Rose.webp?v=1783022178'), sh('06 Vibrant Poppy', '#982e3a', '1_1296_1296___Vibrant_Poppy.webp?v=1783022181')] },
    { id: 'primer', name: 'Pore-Blurring Primer Stick', short: 'Primer Stick', price: 19.99, reviews: null, group: 'prep', photo: '38.jpg?v=1777287206' },
    { id: 'dual', name: 'Dual-Ended Cheek + Eye Brush', short: 'Dual-Ended Brush', price: 17.99, reviews: '5', group: 'prep', photo: 'ChatGPTImage20_.2026_._20_39_21.webp?v=1789929608' },
    { id: 'kabuki', name: 'Airbrush Kabuki Brush', short: 'Kabuki Brush', price: 19.99, reviews: null, group: 'prep', photo: '13be434c-f79b-422d-8aa6-38bff3de96eb.webp?v=1792244100' },
    { id: 'spray', name: 'Waterproof Setting Spray', short: 'Setting Spray', price: 21.99, reviews: null, group: 'prep', photo: '37.jpg?v=1777287210' }
  ];
  /* two made-up shade products, only to see how the grid behaves with 9 */
  const EXAMPLES = [
    { id: 'ex1', name: 'New Product 1 (Example)', short: 'New Product 1', price: 29.99, reviews: null, group: 'face', photo: null, example: true,
      shades: PRODUCTS[2].shades.map(s => sh(s.n, s.c, null)) },
    { id: 'ex2', name: 'New Product 2 (Example)', short: 'New Product 2', price: 24.99, reviews: null, group: 'face', photo: null, example: true,
      shades: PRODUCTS[0].shades.map(s => sh(s.n, s.c, null)) }
  ];
  const BAG = 'ChatGPT_Image_29_._2026_._12_15_06.png?v=1770072174';
  const TIERS = [{ n: 3, pct: 10 }, { n: 5, pct: 15 }, { n: 7, pct: 20 }];
  const TOP = TIERS[TIERS.length - 1].n;   /* the tracker has one place per item, up to the top level */
  const GIFT = 80;
  const STOCK = 6;           /* demo stock limit: + turns off at 6 units */
  const KEY = 'hg-bb-v1';

  const mqPhone = window.matchMedia('(max-width: 749px)');
  const mqWide = window.matchMedia('(min-width: 1100px)');
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- state ---------- */
  const S = { set: {}, order: [], pick: {}, err: {}, opt: { look: 'a', grid: 'type', count: '7', soldout: 'off' },
    cart: null, cartDone: false, busy: false, lastPct: 0, lastGift: false, lastDisc: 0, lastFrac: 0, lastGiftW: 0, moment: null, newSlot: -1, newBand: false, newGift: false };
  try {
    const d = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (d) { S.set = d.set || {}; S.order = d.order || []; Object.assign(S.opt, d.opt || {}); S.cart = d.cart || null; }
  } catch (e) { /* private mode: start empty */ }
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify({ set: S.set, order: S.order, opt: S.opt, cart: S.cart })); } catch (e) {} };

  const products = () => S.opt.count === '9' ? PRODUCTS.slice(0, 3).concat(EXAMPLES, PRODUCTS.slice(3)) : PRODUCTS.slice();
  const byId = id => PRODUCTS.concat(EXAMPLES).find(p => p.id === id);
  const soldOut = p => S.opt.soldout === 'on' && p.id === 'kabuki';
  const shadeOut = (p, i) => S.opt.soldout === 'on' && p.id === 'foundation' && i === 5;
  const r2 = n => Math.round(n * 100) / 100;
  const money = n => '$' + n.toFixed(2);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function calc () {
    const ids = S.order.filter(id => S.set[id] && byId(id));
    let count = 0, sub = 0;
    ids.forEach(id => { const e = S.set[id]; count += e.q; sub += byId(id).price * e.q; });
    sub = r2(sub);
    let tier = null; TIERS.forEach(t => { if (count >= t.n) tier = t; });
    const pct = tier ? tier.pct : 0;
    const disc = r2(sub * pct / 100);
    const total = r2(sub - disc);
    const next = TIERS.find(t => count < t.n) || null;
    const inCart = S.cart ? S.cart.total : 0;
    return { ids, count, sub, pct, disc, total, next, need: next ? next.n - count : 0,
      places: TOP, giftBase: r2(total + inCart), giftLeft: r2(Math.max(0, GIFT - total - inCart)) };
  }
  /* "4 of 7 products"; past the top level just the number */
  const ofLine = c => c.count > c.places ? c.count + ' products' : c.count + ' of ' + c.places + ' products';
  const fracOf = c => c.count > 1 ? Math.min(1, (c.count - 1) / (c.places - 1)) : 0;
  /* index of a product's first place on the tracker */
  const slotOf = id => { let n = 0; for (const x of S.order) { if (x === id) break; if (S.set[x] && byId(x)) n += S.set[x].q; } return n; };

  /* ---------- small builders ---------- */
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const ICON = {
    check: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3L15 6.5"/></svg>',
    plus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4.5v11M4.5 10h11"/></svg>',
    minus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10h11"/></svg>',
    trash: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 6V4.5h4V6M6 6l.7 9.5h6.6L14 6M8.6 9v4M11.4 9v4"/></svg>',
    alert: '<svg class="bb-alert" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 6.2v4.6M10 13.6v.2"/></svg>',
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h15M19 8l-3.5-3.5M19 8l-3.5 3.5M20 16H5M5 16l3.5-3.5M5 16l3.5 3.5"/></svg>',
    star: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/></svg>',
    /* the theme's #icon-refresh, the same one the PDP uses for "Wrong shade?" */
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12a9 9 0 0 1 15.7-6L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.7 6L3 16"/><path d="M3 21v-5h5"/></svg>'
  };
  const photoFor = (p, e) => { const i = e ? e.s : S.pick[p.id]; return (p.shades && i != null && p.shades[i].p) ? p.shades[i].p : p.photo; };
  const imgOrEmpty = (f, w, alt) => f ? '<img src="' + src(f, w) + '" alt="' + esc(alt || '') + '" loading="lazy" decoding="async">' : '<span class="bb-ph-empty" aria-hidden="true"></span>';

  /* ---------- the cards ---------- */
  const grid = document.getElementById('bb-grid');

  function cardEl (p) {
    const out = soldOut(p);
    const a = el('article', 'bb-card' + (out ? ' is-out' : ''));
    a.dataset.id = p.id;
    const rating = p.reviews ? '<div class="bb-rating" aria-label="Rated 5 out of 5 from ' + p.reviews + ' reviews"><span class="bb-stars">' + ICON.star.repeat(5) + '</span><span class="bb-count">(' + p.reviews + ')</span></div>' : '';
    let picker = '';
    if (p.shades && !out) {
      picker = '<div class="bb-pick" role="radiogroup" aria-label="Shade for ' + esc(p.short) + '"><div class="bb-pick-h">' + ICON.alert +
        '<span class="bb-pick-l">Choose your shade</span><span class="bb-pick-v"></span></div><div class="bb-sws">' +
        p.shades.map((s, i) => {
          const o = shadeOut(p, i);
          return '<button type="button" class="bb-sw' + (o ? ' is-out' : '') + '" role="radio" aria-checked="false" tabindex="-1" data-i="' + i + '" aria-label="' + esc(s.n) + (o ? ', sold out' : '') + '"' + (o ? ' aria-disabled="true"' : '') +
            ' style="--sw:' + s.c + '"><i></i><span class="bb-tip">' + esc(s.n) + (o ? ' · Sold out' : '') + '</span></button>';
        }).join('') + '</div></div>';
    }
    const action = out
      ? '<button type="button" class="bb-btn" disabled>Sold out</button>'
      : '<button type="button" class="bb-btn bb-add" aria-label="Add ' + esc(p.short) + ' to your set">Add to set</button>' +
        '<div class="bb-inset"><span class="bb-inset-l">' + ICON.check + 'In your set</span><div class="bb-stepper">' +
        '<button type="button" class="bb-step bb-dec"></button><span class="bb-qty">1</span>' +
        '<button type="button" class="bb-step bb-inc" aria-label="Add one more ' + esc(p.short) + '">' + ICON.plus + '</button></div></div>';
    a.innerHTML = '<div class="bb-top"><div class="bb-photo">' + imgOrEmpty(p.photo, 400, p.name) + '</div><div class="bb-info"><h3 class="bb-name">' + esc(p.name) + '</h3>' + rating +
      '<div class="bb-price">' + money(p.price) + '</div></div></div><div class="bb-controls">' + picker + action + '</div>';
    return a;
  }

  function updateCard (id) {
    const a = grid.querySelector('.bb-card[data-id="' + id + '"]');
    const p = byId(id);
    if (!a || !p || soldOut(p)) return;
    const e = S.set[id];
    const pick = e ? e.s : S.pick[id];
    const hasPick = pick != null;
    a.classList.toggle('is-added', !!e);
    a.classList.toggle('has-pick', hasPick);
    a.classList.toggle('is-error', !!S.err[id] && !e && !hasPick);
    if (p.shades) {
      const l = a.querySelector('.bb-pick-l'), v = a.querySelector('.bb-pick-v');
      if (S.err[id] && !e && !hasPick) { l.textContent = 'Please choose a shade first'; v.textContent = ''; }
      else if (hasPick) { l.textContent = 'Shade:'; v.textContent = p.shades[pick].n; }
      else { l.textContent = 'Choose your shade'; v.textContent = ''; }
      const sws = a.querySelectorAll('.bb-sw');
      const firstFree = [].findIndex.call(sws, b => !b.classList.contains('is-out'));
      sws.forEach((b, i) => {
        b.setAttribute('aria-checked', String(i === pick));
        b.tabIndex = (hasPick ? i === pick : i === firstFree) ? 0 : -1;
      });
    }
    /* the photo follows the chosen shade, like the PDP */
    const img = a.querySelector('.bb-photo img');
    const want = photoFor(p, e);
    if (img && want && img.dataset.f !== want) {
      if (img.dataset.f) {
        img.classList.add('is-swapping');
        img.onload = () => img.classList.remove('is-swapping');
      }
      img.dataset.f = want;
      img.src = src(want, 400);
    }
    if (e) {
      a.querySelector('.bb-qty').textContent = e.q;
      const dec = a.querySelector('.bb-dec');
      dec.innerHTML = e.q > 1 ? ICON.minus : ICON.trash;
      dec.setAttribute('aria-label', e.q > 1 ? 'Remove one ' + p.short : 'Remove ' + p.short + ' from your set');
      const inc = a.querySelector('.bb-inc');
      inc.disabled = e.q >= STOCK;
    }
  }

  function tileEl () {
    return el('div', 'bb-tile', ICON.swap + '<b>Not sure about your shade?</b><p>Pick the closest one. If it isn’t right, we’ll exchange it for free.</p>');
  }

  /* grid layouts: "type" = shade products left, the rest right (the approved one);
     "balanced" = order kept, the break point chosen so both columns end level;
     "groups" = two groups in even rows, a helper tile fills an odd slot */
  function layout () {
    const list = products();
    grid.innerHTML = '';
    const mode = S.opt.grid;
    if (mode === 'groups') {
      const face = list.filter(p => p.group === 'face'), prep = list.filter(p => p.group === 'prep');
      [['Face makeup · pick your shade', face], ['Prep, set & brushes', prep]].forEach(([t, ps], gi) => {
        const g = el('section', 'bb-group');
        g.appendChild(el('h3', 'bb-group-t', esc(t)));
        const rows = el('div', 'bb-rows');
        ps.forEach(p => rows.appendChild(cardEl(p)));
        if (gi === 0 && ps.length % 2) rows.appendChild(tileEl());
        g.appendChild(rows);
        grid.appendChild(g);
      });
    } else {
      const cols = el('div', 'bb-cols'), c1 = el('div', 'bb-col'), c2 = el('div', 'bb-col');
      cols.append(c1, c2);
      grid.appendChild(cols);
      if (mode === 'type') list.forEach(p => (p.shades ? c1 : c2).appendChild(cardEl(p)));
      else list.forEach(p => c1.appendChild(cardEl(p)));
    }
    list.forEach(p => updateCard(p.id));
    if (mode === 'balanced') balance();
    renderTiers();
  }

  function balance () {
    const cols = grid.querySelectorAll('.bb-col');
    if (cols.length < 2) return;
    const [c1, c2] = cols;
    [].slice.call(c2.children).forEach(c => c1.appendChild(c));
    if (!mqWide.matches) return;                 /* one column: display order as is */
    const cards = [].slice.call(c1.children);
    const hs = cards.map(c => c.getBoundingClientRect().height);
    const GAP = 24;
    const sum = (a, b) => hs.slice(a, b).reduce((x, y) => x + y, 0) + Math.max(0, b - a - 1) * GAP;
    let best = cards.length, diff = Infinity;
    for (let k = 1; k < cards.length; k++) {
      const d = Math.abs(sum(0, k) - sum(k, cards.length));
      if (d < diff) { diff = d; best = k; }
    }
    cards.slice(best).forEach(c => c2.appendChild(c));
  }

  function renderTiers () {
    const box = document.getElementById('bb-tiers');
    box.innerHTML = TIERS.map(t => '<div class="bb-tier"><b>' + t.pct + '% off</b><span><span class="bb-d">Add ' + t.n + ' products</span><span class="bb-m">' + t.n + ' products</span></span></div>').join('');
  }

  /* ---------- copy ---------- */
  function nextLine (c) {
    if (!c.next) return 'You’ve unlocked our best price.';
    if (c.count === 0) return 'Add any <em>' + c.next.n + ' products</em> to save <em>' + c.next.pct + '%</em>';
    if (c.need === 1) return 'Just <em>1 more product</em> to save <em>' + c.next.pct + '%</em>';
    return 'Add <em>' + c.need + ' more products</em> to save <em>' + c.next.pct + '%</em>';
  }
  function barLine (c) {
    const t = h => '<span class="bb-msg-t">' + h + '</span>';
    if (S.moment && S.moment.until > Date.now()) return { html: t(S.moment.html), moment: true };
    if (S.cartDone && c.count === 0) return { html: t('Your set is in your cart. <a class="bb-view" role="button" tabindex="0">View cart</a>') };
    if (!c.pct) {
      if (c.count === 0) return { html: t('Add any <em>' + c.next.n + ' products</em> to save <em>' + c.next.pct + '%</em>') };
      if (c.need === 1) return { html: t('Just <em>1 more product</em> to save <em>' + c.next.pct + '%</em>') };
      return { html: t('Add <em>' + c.need + ' more</em> to save <em>' + c.next.pct + '%</em>') };
    }
    const chip = '<span class="bb-chip">' + ICON.check + c.pct + '% off</span>';
    if (!c.next) return { html: chip + t('Best price unlocked') };
    return { html: chip + t((c.need === 1 ? 'Just <em>1 more</em>' : 'Add <em>' + c.need + ' more</em>') + ' for <em>' + c.next.pct + '%</em>') };
  }

  /* ---------- summary blocks shared by the panel and the sheet ---------- */
  function trackerHTML (c) {
    const n = c.places, filled = c.count;
    const items = [];
    c.ids.forEach(id => { const p = byId(id), e = S.set[id]; for (let k = 0; k < e.q; k++) items.push(photoFor(p, e)); });
    const more = Math.max(0, items.length - n);
    let slots = '';
    for (let i = 0; i < n; i++) {
      if (i < items.length) {
        const last = i === n - 1;
        const isNew = i === S.newSlot || (last && S.newSlot >= n);
        slots += '<span class="bb-slot is-on' + (isNew ? ' is-new' : '') + '">' + imgOrEmpty(items[i], 120, '') + (last && more ? '<b class="bb-more">+' + more + '</b>' : '') + '</span>';
      } else slots += '<span class="bb-slot"></span>';
    }
    let miles = '';
    for (let i = 0; i < n; i++) {
      const t = TIERS.find(x => x.n === i + 1);
      miles += '<span class="bb-mile' + (t && filled >= t.n ? ' is-on' : '') + '">' + (t ? t.pct + '%' : '') + '</span>';
    }
    return '<div class="bb-track" aria-hidden="true"><div class="bb-slots"><span class="bb-line"></span><span class="bb-line-f"></span>' + slots + '</div><div class="bb-miles">' + miles + '</div></div>';
  }
  function bandHTML (c) {
    if (!c.pct) return '';
    return '<div class="bb-band' + (S.newBand ? ' is-new' : '') + '"><span class="bb-band-t">' + ICON.check + c.pct + '% off unlocked</span><span class="bb-band-s">You’re saving <span class="bb-saving">' + money(c.disc) + '</span></span></div>';
  }
  function giftHTML (c) {
    const on = c.giftBase >= GIFT;
    const bag = '<span class="bb-gift-ph"><img src="' + src(BAG, 120) + '" alt="" loading="lazy">' + (on ? '<i class="bb-gift-ok">' + ICON.check + '</i>' : '') + '</span>';
    if (on) {
      return '<div class="bb-gift is-on' + (S.newGift ? ' is-new' : '') + '">' + bag + '<div class="bb-gift-tx"><b class="bb-gift-t">FREE Cosmetic&nbsp;Bag unlocked</b><span class="bb-gift-sub">We add it to your cart for free.</span></div></div>';
    }
    const msg = c.giftBase > 0
      ? 'Add <b>' + money(c.giftLeft) + '</b> more to get a <b>FREE</b> Cosmetic Bag'
      : 'Spend <b>' + money(GIFT).replace('.00', '') + '</b> and get a <b>FREE</b> Cosmetic Bag';
    return '<div class="bb-gift">' + bag + '<div class="bb-gift-tx"><span>' + msg + '</span><span class="bb-gift-bar"><i></i></span></div></div>';
  }
  function totalsHTML (c) {
    if (!c.count) return '';
    let h = '<div class="bb-row"><span>Subtotal</span><span class="bb-amt">' + (c.pct ? '<s class="bb-was">' + money(c.sub) + '</s>' : '') + '<b class="bb-total">' + money(c.total) + '</b></span></div>';
    if (c.pct) h += '<div class="bb-row bb-save"><span>Set discount (' + c.pct + '%)</span><b>−' + money(c.disc) + '</b></div>';
    return h;
  }
  function ctaHTML (c, where) {
    const btn = S.busy
      ? '<button type="button" class="bb-cta" disabled aria-busy="true" style="background:var(--berry-deep);color:var(--paper)"><span class="bb-spin" aria-hidden="true"></span>Adding your set…</button>'
      : '<button type="button" class="bb-cta bb-go"' + (c.count ? '' : ' disabled') + '>' + (c.count ? 'Add set to cart · ' + money(c.total) : 'Add set to cart') + '</button>';
    if (where === 'bar') return btn;
    const note = c.count ? 'Your discount applies automatically.'
      : S.cartDone ? 'Want another set? Add products from the list.'
      : where === 'sheet' ? 'Start by adding a product from the list.' : 'Start by adding a product on the left.';
    return btn + '<div class="bb-notes"><p class="bb-assure">' + ICON.refresh + '<span>Wrong shade? <b>We’ll replace it free.</b></span></p><p class="bb-note">' + note + '</p></div>';
  }
  const howHTML = '<div class="bb-how"><b>How it works</b><ol style="display:flex;flex-direction:column;gap:12px;padding:0"><li><i>1</i>Add any 3 or more products</li><li><i>2</i>Your discount grows: 10%, 15%, 20%</li><li><i>3</i>Add your set to the cart in one tap</li></ol></div>';
  const doneHTML = '<div class="bb-done"><span>Your set is in your cart.</span><a class="bb-view" role="button" tabindex="0">View cart</a></div>';

  /* ---------- desktop panel ---------- */
  const panel = document.getElementById('bb-panel');
  function renderPanel (c) {
    panel.innerHTML = '<div class="bb-panel-in"><div class="bb-sum-h"><b>Your set</b><span>' + ofLine(c) + '</span></div>' +
      (S.cartDone && !c.count ? doneHTML : '') + bandHTML(c) +
      '<div class="bb-prog"><p class="bb-next">' + nextLine(c) + '</p>' + trackerHTML(c) + '</div>' +
      (!c.count && !S.cartDone ? howHTML : '') +
      '<div class="bb-div"></div><div class="bb-giftw">' + giftHTML(c) + '</div><div class="bb-div"></div>' +
      '<div class="bb-tot">' + totalsHTML(c) + ctaHTML(c, 'panel') + '</div></div>';
  }

  /* ---------- mobile bar and sheet ---------- */
  const bar = document.getElementById('bb-bar');
  const sheet = document.getElementById('bb-sheet');
  const scrim = document.getElementById('bb-scrim');
  let sheetOpen = false;
  function renderBar (c) {
    let segs = '';
    for (let i = 0; i < c.places; i++) segs += '<span class="bb-seg' + (i < c.count ? ' is-on' : '') + '"></span>';
    const line = barLine(c);
    bar.innerHTML = '<div class="bb-segs" aria-hidden="true">' + segs + '</div><div class="bb-bar-c"><div class="bb-bar-r"><div class="bb-msg' + (line.moment ? ' is-moment' : '') + '">' + line.html + '</div>' +
      '<button type="button" class="bb-open" aria-label="Open your set" aria-expanded="' + sheetOpen + '" aria-controls="bb-sheet">' + ICON.up + '</button></div>' +
      (c.count || S.busy ? ctaHTML(c, 'bar') : '') + '</div>';
  }
  function itemsHTML (c) {
    return c.ids.map(id => {
      const p = byId(id), e = S.set[id];
      const shade = p.shades && e.s != null ? p.shades[e.s].n : '';
      const meta = [shade, e.q > 1 ? 'Qty ' + e.q : ''].filter(Boolean).join(' · ');
      return '<div class="bb-item"><span class="bb-item-ph">' + imgOrEmpty(photoFor(p, e), 120, '') + '</span><div class="bb-item-tx"><b>' + esc(p.name) + '</b>' + (meta ? '<span>' + esc(meta) + '</span>' : '') +
        '</div><div class="bb-item-r"><span>' + money(r2(p.price * e.q)) + '</span><button type="button" class="bb-rm" data-id="' + id + '" aria-label="Remove ' + esc(p.short) + ' from your set">Remove</button></div></div>';
    }).join('');
  }
  function renderSheet (c) {
    const scroller = sheet.querySelector('.bb-scroll');
    const top = scroller ? scroller.scrollTop : 0;
    sheet.innerHTML = '<div class="bb-grab" aria-hidden="true"><i></i></div><div class="bb-sum-h"><div><b>Your set</b><span>' + ofLine(c) + '</span></div>' +
      '<button type="button" class="bb-close" aria-label="Close your set">' + ICON.down + '</button></div><div class="bb-scroll">' +
      (S.cartDone && !c.count ? doneHTML : '') + bandHTML(c) +
      '<div class="bb-prog"><p class="bb-next">' + nextLine(c) + '</p>' + trackerHTML(c) + '</div>' +
      (!c.count && !S.cartDone ? howHTML : '') +
      (c.count ? '<div class="bb-items">' + itemsHTML(c) + '</div>' : '') +
      '<div class="bb-giftw">' + giftHTML(c) + '</div>' + (c.count ? '<div class="bb-tot">' + totalsHTML(c) + '</div>' : '') +
      '</div><div class="bb-sheet-f">' + ctaHTML(c, 'sheet') + '</div>';
    const sc = sheet.querySelector('.bb-scroll');
    if (sc) sc.scrollTop = top;
  }
  function openSheet () {
    if (!mqPhone.matches || sheetOpen) return;
    sheetOpen = true;
    sheet.hidden = false; scrim.hidden = false;
    renderSheet(calc()); afterRender(calc(), [sheet]);
    requestAnimationFrame(() => requestAnimationFrame(() => { sheet.classList.add('is-on'); scrim.classList.add('is-on'); }));
    document.body.style.overflow = 'hidden';
    const b = bar.querySelector('.bb-open'); if (b) b.setAttribute('aria-expanded', 'true');
    setTimeout(() => { const x = sheet.querySelector('.bb-close'); if (x) x.focus(); }, 320);
  }
  function closeSheet (silent) {
    if (!sheetOpen) return;
    sheetOpen = false;
    sheet.classList.remove('is-on'); scrim.classList.remove('is-on');
    document.body.style.overflow = '';
    setTimeout(() => { if (!sheetOpen) { sheet.hidden = true; scrim.hidden = true; } }, 320);
    const b = bar.querySelector('.bb-open');
    if (b) { b.setAttribute('aria-expanded', 'false'); if (!silent) b.focus(); }
  }

  /* ---------- after every render: line fill, gift bar, count-up ---------- */
  function afterRender (c, roots) {
    const frac = fracOf(c);
    const giftW = c.giftBase >= GIFT ? 100 : c.giftBase > 0 ? 50 : 0;     /* stepped like the cart drawer */
    roots.forEach(r => {
      const f = r.querySelector('.bb-line-f');
      if (f) {
        f.style.width = 'calc((100% - var(--slot)) * ' + S.lastFrac + ')';
        requestAnimationFrame(() => requestAnimationFrame(() => { f.style.width = 'calc((100% - var(--slot)) * ' + frac + ')'; }));
      }
      const g = r.querySelector('.bb-gift-bar i');
      if (g) {
        g.style.width = S.lastGiftW + '%';
        requestAnimationFrame(() => requestAnimationFrame(() => { g.style.width = giftW + '%'; }));
      }
      const sv = r.querySelector('.bb-saving');
      if (sv && c.disc > S.lastDisc && !mqReduce.matches) countUp(sv, S.lastDisc, c.disc);
    });
  }
  function countUp (node, from, to) {
    const t0 = performance.now(), D = 600;
    const step = t => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      node.textContent = money(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step); else node.textContent = money(to);
    };
    node.textContent = money(from);
    requestAnimationFrame(step);
  }

  /* ---------- one update after every change ---------- */
  const live = document.getElementById('bb-live');
  const say = t => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); };
  let momentT = null;
  function update (opts) {
    const c = calc();
    S.newBand = c.pct > S.lastPct;
    const giftOk = c.giftBase >= GIFT;
    S.newGift = giftOk && !S.lastGift;
    if (S.newBand) S.moment = { html: 'You unlocked <em>' + c.pct + '% off</em>!', until: Date.now() + 4000 };
    else if (giftOk && !S.lastGift && c.count) S.moment = { html: 'FREE bag unlocked!', until: Date.now() + 4000 };
    if (S.moment) { clearTimeout(momentT); momentT = setTimeout(() => { S.moment = null; renderBar(calc()); }, Math.max(0, S.moment.until - Date.now()) + 20); }
    renderPanel(c); renderBar(c);
    const roots = [panel];
    if (sheetOpen) { renderSheet(c); roots.push(sheet); }
    afterRender(c, roots);
    if (opts && opts.say) say(opts.say + ' ' + ofLine(c) + '.' + (S.newBand ? ' ' + c.pct + '% off unlocked.' : ''));
    S.lastPct = c.pct; S.lastGift = giftOk; S.lastDisc = c.disc;
    S.lastFrac = fracOf(c);
    S.lastGiftW = giftOk ? 100 : c.giftBase > 0 ? 50 : 0;
    S.newSlot = -1; S.newBand = false; S.newGift = false;
    save();
  }

  /* ---------- toast with undo ---------- */
  const toastEl = document.getElementById('bb-toast');
  let toastT = null;
  function toast (msg, action, fn) {
    toastEl.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button type="button">' + action + '</button>' : '');
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(hideToast, 5000);
    if (action) toastEl.querySelector('button').onclick = () => { hideToast(); fn(); };
  }
  function hideToast () { toastEl.classList.remove('is-on'); }

  /* ---------- actions ---------- */
  function pick (id, i) {
    const p = byId(id);
    if (!p || shadeOut(p, i)) return;
    const e = S.set[id];
    if (e) {
      if (e.s === i) return;
      const prev = e.s;
      e.s = i;
      toast('Shade changed to ' + p.shades[i].n, 'Undo', () => { if (S.set[id]) { S.set[id].s = prev; updateCard(id); update(); } });
      updateCard(id); update({ say: p.short + ' shade changed to ' + p.shades[i].n + '.' });
      return;
    }
    S.pick[id] = i; S.err[id] = false;
    updateCard(id);
  }
  function add (id) {
    const p = byId(id);
    if (p.shades && S.pick[id] == null) {
      S.err[id] = true; updateCard(id);
      const a = grid.querySelector('.bb-card[data-id="' + id + '"] .bb-sw:not(.is-out)');
      if (a) a.focus({ preventScroll: true });
      say('Please choose a shade first.');
      return;
    }
    S.set[id] = { s: p.shades ? S.pick[id] : null, q: 1 };
    S.order = S.order.filter(x => x !== id).concat(id);
    S.cartDone = false;
    S.newSlot = slotOf(id);
    updateCard(id);
    update({ say: p.short + ' added.' });
    const inc = grid.querySelector('.bb-card[data-id="' + id + '"] .bb-inc');
    if (inc && document.activeElement && document.activeElement.classList.contains('bb-add')) inc.focus({ preventScroll: true });
  }
  function remove (id) {
    const p = byId(id), e = S.set[id];
    if (!e) return;
    const at = S.order.indexOf(id);
    delete S.set[id];
    S.order.splice(at, 1);
    delete S.pick[id];
    updateCard(id);
    update({ say: p.short + ' removed.' });
    toast(p.short + ' removed', 'Undo', () => {
      S.set[id] = e; S.order.splice(Math.min(at, S.order.length), 0, id);
      updateCard(id); update({ say: p.short + ' is back in your set.' });
    });
  }
  function inc (id) { const e = S.set[id]; if (!e || e.q >= STOCK) return; e.q++; S.newSlot = slotOf(id) + e.q - 1; updateCard(id); update({ say: e.q + ' in your set.' }); }
  function dec (id) {
    const e = S.set[id]; if (!e) return;
    if (e.q > 1) { e.q--; updateCard(id); update({ say: e.q + ' in your set.' }); }
    else remove(id);
  }

  /* add to cart: the drawer gets the set, the builder clears */
  function toCart () {
    const c = calc();
    if (!c.count || S.busy) return;
    S.busy = true; update();
    setTimeout(() => {
      const lines = c.ids.map(id => { const p = byId(id), e = S.set[id]; return { id, s: e.s, q: e.q, pct: c.pct }; });
      const prev = S.cart || { lines: [], sub: 0, disc: 0, total: 0, units: 0 };
      S.cart = { lines: prev.lines.concat(lines), sub: r2(prev.sub + c.sub), disc: r2(prev.disc + c.disc), total: r2(prev.total + c.total), units: prev.units + c.count };
      S.set = {}; S.order = []; S.pick = {}; S.err = {};
      S.busy = false; S.cartDone = true;
      products().forEach(p => updateCard(p.id));
      closeSheet(true);
      update({ say: 'Your set is in your cart.' });
      fillDrawer();
      if (typeof window.cartToggle === 'function') window.cartToggle(true);
    }, 700);
  }

  function fillDrawer () {
    const d = document.querySelector('.cartdrawer');
    if (!d || !S.cart) return;
    d.querySelectorAll('.item').forEach(n => n.remove());
    const anchor = d.querySelector('.strip') || d.querySelector('.hl');
    const names = [];
    S.cart.lines.forEach(l => {
      const p = byId(l.id); if (!p) return;
      names.push(p.name);
      const full = r2(p.price * l.q), now = r2(full * (1 - l.pct / 100));
      const shade = p.shades && l.s != null ? p.shades[l.s] : null;
      const it = el('div', 'item');
      it.innerHTML = '<div class="ph">' + (photoFor(p, l) ? '<img src="' + src(photoFor(p, l), 300) + '" alt="">' : '') + '</div><div class="mid"><p class="name">' + esc(p.name) + '</p>' +
        (shade ? '<div class="shade"><span class="sw" style="background:' + shade.c + '"></span>' + esc(shade.n) + '</div>' : '') +
        '<span class="qty"><span>−</span><span class="n">' + l.q + '</span><span>+</span></span><span class="rm">Remove</span></div>' +
        '<div class="right"><div class="price">' + money(now) + '</div>' + (now < full ? '<div class="was">' + money(full) + '</div>' : '') + '</div>';
      if (anchor) anchor.parentNode.insertBefore(it, anchor); else d.querySelector('.d-body').appendChild(it);
    });
    const left = r2(Math.max(0, GIFT - S.cart.total));
    const msg = d.querySelector('.gmsg');
    if (msg) msg.innerHTML = left > 0 ? 'Spend another <b>' + money(left) + '</b> for <b>Cosmetic Bag</b>' : 'Your <b>Cosmetic Bag</b> is unlocked';
    const fill = d.querySelector('.g1bar div');
    if (fill) fill.style.width = Math.min(100, Math.round(S.cart.total / GIFT * 100)) + '%';
    const foot = d.querySelector('.d-foot');
    if (foot) {
      let save = foot.querySelector('.tsave');
      if (S.cart.disc > 0) {
        if (!save) { save = el('div', 'row tsave', '<span class="l">You’re saving</span><span class="r"></span>'); foot.insertBefore(save, foot.firstChild); }
        save.querySelector('.r').textContent = money(S.cart.disc);
      } else if (save) save.remove();
      const sub = foot.querySelector('.row:not(.ship):not(.tsave) .r');
      if (sub) sub.textContent = money(S.cart.total);
      const co = foot.querySelector('.co');
      if (co) co.lastChild.textContent = 'Secure Checkout · ' + money(S.cart.total);
    }
    d.querySelectorAll('.hl[data-hl]').forEach(h => { h.hidden = names.some(n => n.indexOf(h.dataset.hl) > -1); });
    d.querySelectorAll('.cyl .ccard').forEach(cc => { const t = (cc.querySelector('.nm') || {}).textContent || ''; if (names.indexOf(t.trim()) > -1) cc.hidden = true; });
    document.querySelectorAll('.bag i').forEach(i => { i.textContent = S.cart.units; });
  }

  /* ---------- events ---------- */
  grid.addEventListener('click', ev => {
    const card = ev.target.closest('.bb-card'); if (!card) return;
    const id = card.dataset.id;
    const sw = ev.target.closest('.bb-sw');
    if (sw) { if (!sw.classList.contains('is-out')) pick(id, +sw.dataset.i); return; }
    if (ev.target.closest('.bb-add')) return add(id);
    if (ev.target.closest('.bb-inc')) return inc(id);
    if (ev.target.closest('.bb-dec')) return dec(id);
  });
  /* swatches are a radio group: arrows move and select, like native radios */
  grid.addEventListener('keydown', ev => {
    const sw = ev.target.closest('.bb-sw'); if (!sw) return;
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(ev.key in keys)) return;
    ev.preventDefault();
    const all = [].slice.call(sw.parentNode.querySelectorAll('.bb-sw:not(.is-out)'));
    const next = all[(all.indexOf(sw) + keys[ev.key] + all.length) % all.length];
    next.focus();
    pick(sw.closest('.bb-card').dataset.id, +next.dataset.i);
  });
  const onSummaryClick = ev => {
    if (ev.target.closest('.bb-go')) return toCart();
    if (ev.target.closest('.bb-view')) { closeSheet(true); if (typeof window.cartToggle === 'function') window.cartToggle(true); return; }
    const rm = ev.target.closest('.bb-rm'); if (rm) return remove(rm.dataset.id);
    if (ev.target.closest('.bb-open')) return openSheet();
    if (ev.target.closest('.bb-close')) return closeSheet();
  };
  [panel, bar, sheet].forEach(n => n.addEventListener('click', onSummaryClick));
  [panel, bar, sheet].forEach(n => n.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList.contains('bb-view')) { ev.preventDefault(); onSummaryClick(ev); } }));
  scrim.addEventListener('click', () => closeSheet());
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && sheetOpen) closeSheet(); });

  /* FAQ accordion */
  document.querySelectorAll('.bb-q > button').forEach(b => b.addEventListener('click', () => {
    const q = b.parentNode, open = !q.classList.contains('is-open');
    q.classList.toggle('is-open', open);
    b.setAttribute('aria-expanded', String(open));
  }));

  /* bar height feeds the page padding and the toast position */
  const setBarH = () => document.body.style.setProperty('--bb-bar-h', mqPhone.matches ? bar.offsetHeight + 'px' : '0px');
  if ('ResizeObserver' in window) new ResizeObserver(setBarH).observe(bar);
  const onBp = () => { if (!mqPhone.matches) closeSheet(true); setBarH(); if (S.opt.grid === 'balanced') balance(); };
  mqPhone.addEventListener('change', onBp);
  mqWide.addEventListener('change', onBp);

  /* ---------- prototype options strip ---------- */
  const opts = document.getElementById('bbo');
  const applyLook = () => {
    document.body.classList.remove('bb-look-a', 'bb-look-b', 'bb-look-c', 'bb-look-d', 'bb-look-now');
    document.body.classList.add('bb-look-' + S.opt.look);
  };
  const syncOpts = () => opts.querySelectorAll('[data-opt]').forEach(g => g.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.opt[g.dataset.opt]))));
  opts.querySelector('.bbo-toggle').addEventListener('click', ev => {
    const b = ev.currentTarget, open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById('bbo-panel').hidden = !open;
  });
  opts.addEventListener('click', ev => {
    const b = ev.target.closest('[data-opt] button');
    if (b) {
      const k = b.closest('[data-opt]').dataset.opt;
      S.opt[k] = b.dataset.v;
      if (k === 'look') applyLook();
      else {
        if (k === 'count' && S.opt.count === '7') EXAMPLES.forEach(p => { delete S.set[p.id]; delete S.pick[p.id]; S.order = S.order.filter(x => x !== p.id); });
        if (k === 'soldout' && S.opt.soldout === 'on') { delete S.set.kabuki; S.order = S.order.filter(x => x !== 'kabuki'); if (S.set.foundation && S.set.foundation.s === 5) { delete S.set.foundation; S.order = S.order.filter(x => x !== 'foundation'); } if (S.pick.foundation === 5) delete S.pick.foundation; }
        layout();
        update();
      }
      syncOpts(); save();
      return;
    }
    if (ev.target.closest('.bbo-reset')) {
      S.set = {}; S.order = []; S.pick = {}; S.err = {}; S.cart = null; S.cartDone = false;
      products().forEach(p => updateCard(p.id)); update();
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    }
  });

  /* ---------- start ---------- */
  applyLook(); syncOpts();
  layout();
  const c0 = calc();
  S.lastPct = c0.pct; S.lastGift = c0.giftBase >= GIFT; S.lastDisc = c0.disc;
  S.lastFrac = fracOf(c0);
  S.lastGiftW = S.lastGift ? 100 : c0.giftBase > 0 ? 50 : 0;
  update();
  if (S.cart) fillDrawer();
  setBarH();
})();
