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

  /* Cross-sell rows are checkboxes on the live page, not add buttons: tapping the row
     ticks it, which is what the merchant sees when the app adds the item to the order. */
  document.querySelectorAll('.upcard').forEach(function (card) {
    card.addEventListener('click', function () {
      var on = card.classList.toggle('on');
      var box = card.querySelector('.upbox');
      if (box) box.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  });

  /* Per-unit shade pickers inside a bundle. On the live page this is the Kaching Bundles
     app; here each chip cycles through the six shades so the flow can be seen: every unit
     in the tier is chosen separately, which is the part of the block worth reviewing. */
  var SHADES = [
    ['01 Vintage Red', '#d82d59'],
    ['02 Soft Rose', '#f38ca1'],
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
