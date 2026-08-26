/* HushGlow Design — Foundation Cushion page behaviors.

   Only the subscription row is specific to this template. The gallery, swatches,
   accordions, bundles, countdowns, sliders, sticky ATC and the rest come from shared.js. */

(function () {
  var sub = document.querySelector('.subbox');
  if (sub) sub.addEventListener('click', function () { sub.classList.toggle('on'); });
})();
