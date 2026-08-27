/* HushGlow Design — advertorials.

   Two behaviours only: the countdown in the announcement bar, and lazy video that plays
   when it reaches the screen. Everything else on these pages is static. */

(function () {
  /* Counts down to the end of the day and restarts, so the prototype never sits on
     00:00:00. The live bar does the same. */
  var h = document.querySelector('[data-adv-h]');
  if (h) {
    var m = document.querySelector('[data-adv-m]');
    var s = document.querySelector('[data-adv-s]');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var tick = function () {
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      var d = Math.max(0, end - new Date());
      h.textContent = pad(Math.floor(d / 3600000));
      m.textContent = pad(Math.floor(d / 60000) % 60);
      s.textContent = pad(Math.floor(d / 1000) % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* The clips are the proof on these pages, so they load and play on arrival — but only
     the one on screen, because the visitor is on a phone and paying for the data. */
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
