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

  /* press marquee: two identical halves for a seamless loop */
  var logos = [
    ['https://hushglow.com/cdn/shop/files/Mask_group.png?width=300', 'Glamour'],
    ['https://hushglow.com/cdn/shop/files/2560px-Grazia-Logo_1.png?width=300', 'Grazia'],
    ['https://hushglow.com/cdn/shop/files/Elle_logo_1.png?width=300', 'Elle']
  ];
  ['pressHalf1', 'pressHalf2'].forEach(function (id) {
    var half = document.getElementById(id);
    if (!half) return;
    for (var r = 0; r < 3; r++) {
      logos.forEach(function (l) {
        var img = document.createElement('img');
        img.src = l[0]; img.alt = l[1];
        half.appendChild(img);
      });
    }
  });

  /* get the look slider: infinite loop via one cloned set on each side.
     After scrolling settles, the position is silently normalized back into
     the middle set (sets are identical, so the jump is invisible). */
  var row = document.getElementById('lookRow');
  var prev = document.getElementById('lookPrev');
  var next = document.getElementById('lookNext');
  if (row) {
    var cards = Array.prototype.slice.call(row.children);
    var N = cards.length;
    cards.forEach(function (c) { row.appendChild(c.cloneNode(true)); });
    for (var i = N - 1; i >= 0; i--) { row.insertBefore(cards[i].cloneNode(true), row.firstChild); }

    var gapOf = function () { return parseFloat(getComputedStyle(row).gap) || 0; };
    var stepOf = function () { return row.children[0].getBoundingClientRect().width + gapOf(); };
    var setOf = function () { return stepOf() * N; };

    var jump = function (x) {
      row.style.scrollSnapType = 'none';
      row.scrollLeft = x;
      row.offsetHeight; /* flush so the snap re-enable doesn't move us */
      row.style.scrollSnapType = '';
    };
    jump(setOf());

    var t;
    row.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var w = setOf();
        if (row.scrollLeft < w * 0.5) { jump(row.scrollLeft + w); }
        else if (row.scrollLeft > w * 1.5) { jump(row.scrollLeft - w); }
      }, 150);
    }, { passive: true });
    window.addEventListener('resize', function () { jump(setOf()); });

    if (prev) prev.addEventListener('click', function () { row.scrollBy({ left: -stepOf() * 2, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { row.scrollBy({ left: stepOf() * 2, behavior: 'smooth' }); });
  }
})();
