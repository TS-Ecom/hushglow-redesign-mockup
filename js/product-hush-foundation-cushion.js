/* HushGlow Design — Foundation Cushion page behaviors (page-specific only;
   gallery, swatches, accordions, bundles, sliders and the rest live in shared.js) */

(function () {
  /* subscription row (this page only) */
  var sub = document.querySelector('.subbox');
  if (sub) sub.addEventListener('click', function () { sub.classList.toggle('on'); });

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

})();
