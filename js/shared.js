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
