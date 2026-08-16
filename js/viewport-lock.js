/* HushGlow Design — fixed layout width on narrow phones.

   The pages are composed at 390px. On a narrower screen we do not want the layout to
   rearrange, we want the same composition, just smaller: the page is rendered at 390
   and the browser scales it down. A floor stops that from going too far, because below
   it the text would drop under the size this audience can comfortably read, and the
   normal responsive rules take over instead.

     375px  ->  rendered at 390, scale 0.96, body copy 15.4px
     360px  ->  rendered at 390, scale 0.92, body copy 14.8px
     320px  ->  rendered at 356, scale 0.90, body copy 14.4px

   This does nothing about the system font-size setting: Android scales text on top of
   any viewport, which is why the wrapping rules in shared.css still matter. The two
   work together, neither replaces the other. */

(function () {
  var meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;

  var BASE = 390;                                   // width the pages are designed at
  var MIN_SCALE = 0.9;                              // readability floor
  var DEFAULT = 'width=device-width, initial-scale=1';

  function lock (dw) {
    if (!dw || dw >= BASE) {
      meta.setAttribute('content', DEFAULT);
      return;
    }
    meta.setAttribute('content', 'width=' + Math.min(BASE, Math.round(dw / MIN_SCALE)));
  }

  // On first run the meta is still untouched, so the width we read is the device's own.
  lock(document.documentElement.clientWidth);

  // On rotation, hand the viewport back before measuring, otherwise we would be
  // measuring the width we set ourselves a moment ago.
  window.addEventListener('orientationchange', function () {
    meta.setAttribute('content', DEFAULT);
    setTimeout(function () { lock(document.documentElement.clientWidth); }, 300);
  });
})();
