// Shared by the studio pages that play clips: the home and the game page.
// Only what is on screen is allowed to decode, and anything scrolled away
// is paused so it stops costing battery.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-lazyvideo]'));
  if (!vids.length) return;

  // Same bargain the portfolio page strikes: someone who asked for reduced
  // motion gets the first frame and a play button, and nothing moves until
  // they ask for it. Browsers without IntersectionObserver land here too,
  // since a clip that can never autoplay has no use for a loop either.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) {
    vids.forEach(function (v) { v.controls = true; v.loop = false; });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        v.play().catch(function () { /* autoplay blocked; the first frame stands in */ });
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '120px 0px', threshold: 0.15 });
  vids.forEach(function (v) { io.observe(v); });
})();
