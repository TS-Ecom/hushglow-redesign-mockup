/* HushGlow Design — home page behaviors */

(function () {
  /* hero video: pick the file for the current viewport, re-pick on breakpoint change */
  var video = document.querySelector('.hero video');
  if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var mq = window.matchMedia('(min-width: 750px)');
    var apply = function () {
      var src = mq.matches ? video.dataset.srcDesktop : video.dataset.srcMobile;
      if (!src || video.getAttribute('src') === src) return;
      video.setAttribute('src', src);
      video.muted = true;
      video.load();
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    };
    apply();
    if (mq.addEventListener) { mq.addEventListener('change', apply); } else { mq.addListener(apply); }
  }

  /* get the look slider */
  var row = document.getElementById('lookRow');
  var prev = document.getElementById('lookPrev');
  var next = document.getElementById('lookNext');
  if (row && prev && next) {
    var step = function () {
      var gap = parseFloat(getComputedStyle(row).gap) || 0;
      return row.querySelector('.l-card').getBoundingClientRect().width + gap;
    };
    prev.addEventListener('click', function () { row.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
    next.addEventListener('click', function () { row.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
    var sync = function () {
      prev.toggleAttribute('disabled', row.scrollLeft < 10);
      next.toggleAttribute('disabled', row.scrollLeft > row.scrollWidth - row.clientWidth - 10);
    };
    row.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }
})();
