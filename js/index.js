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
  document.querySelectorAll('.press .ticker .half').forEach(function (half) {
    half.innerHTML = '';
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
  document.querySelectorAll('.look').forEach(function (look) {
    var row = look.querySelector('.lookrow');
    var prev = look.querySelector('.lookarrow.prev');
    var next = look.querySelector('.lookarrow.next');
    if (!row) return;
    var cards = Array.prototype.slice.call(row.children);
    var N = cards.length;
    cards.forEach(function (c) { row.appendChild(c.cloneNode(true)); });
    for (var i = N - 1; i >= 0; i--) { row.insertBefore(cards[i].cloneNode(true), row.firstChild); }

    var gapOf = function () { return parseFloat(getComputedStyle(row).gap) || 0; };
    var stepOf = function () { return row.children[0].getBoundingClientRect().width + gapOf(); };
    var setOf = function () { return stepOf() * N; };

    /* Plain scrollLeft assignment: the target is always exactly one set away,
       which lands on an identical snap offset. Toggling scroll-snap-type here
       makes WebKit re-snap to the start — never do that. */
    var jump = function (x) { row.scrollLeft = x; };
    jump(setOf());

    var normalize = function () {
      var w = setOf();
      if (row.scrollLeft < w * 0.5) { jump(row.scrollLeft + w); }
      else if (row.scrollLeft > w * 1.5) { jump(row.scrollLeft - w); }
    };
    var t;
    row.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(normalize, 200);
    }, { passive: true });
    if ('onscrollend' in window) { row.addEventListener('scrollend', normalize); }

    /* iOS fires resize when the URL bar collapses during page scroll — that is
       a height-only change and must not touch the carousel. */
    var lastVw = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastVw) return;
      lastVw = window.innerWidth;
      jump(setOf());
    });

    if (prev) prev.addEventListener('click', function () { row.scrollBy({ left: -stepOf() * 2, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { row.scrollBy({ left: stepOf() * 2, behavior: 'smooth' }); });
  });
})();
