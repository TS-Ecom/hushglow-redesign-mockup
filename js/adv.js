/* HushGlow Design — advertorials.

   Both behaviours are ports of what the live sections do, not new code: the countdown in
   adv-header.liquid counts to the end of the store day, and adv-main renders its videos
   with autoplay/loop/muted. Here they load on approach instead, because these pages are
   paid mobile traffic and four autoplaying clips is data the visitor did not ask for. */

(function () {
  var timer = document.querySelector('[data-adv-timer]');
  if (timer) {
    var h = timer.querySelector('[data-adv-hours]');
    var m = timer.querySelector('[data-adv-minutes]');
    var s = timer.querySelector('[data-adv-seconds]');
    var pad = function (v) { return v < 10 ? '0' + v : String(v); };
    var tick = function () {
      var now = new Date();
      var end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      var left = Math.max(0, Math.floor((end - now) / 1000));
      h.textContent = pad(Math.floor(left / 3600));
      m.textContent = pad(Math.floor((left % 3600) / 60));
      s.textContent = pad(left % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  var vids = document.querySelectorAll('video[data-src]');
  if (!vids.length) return;
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) v.setAttribute('src', v.dataset.src);
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.25 });
  vids.forEach(function (v) { io.observe(v); });
})();
