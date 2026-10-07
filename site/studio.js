// Shared by every studio page, and loaded in the head: the saved text size
// has to be on the page before anything is painted, or a returning visitor
// sees it jump. Everything else waits for the document.
(function () {
  var root = document.documentElement;
  var KEY = 'studio-text-size';
  var size = '1';

  // Storage throws in a private window and when site data is blocked. The
  // buttons still work there; the choice just lasts one page.
  try { size = localStorage.getItem(KEY) || '1'; } catch (e) { /* default size */ }
  if (size !== '2' && size !== '3') size = '1';

  function apply() {
    if (size === '1') root.removeAttribute('data-ts');
    else root.setAttribute('data-ts', size);
  }
  apply();
  // Shows the size buttons, which are no use without this script.
  root.className += ' js';

  // The A A A in the status bar, the period's own accessibility control.
  function textSize() {
    var btns = Array.prototype.slice.call(document.querySelectorAll('.textsize button'));
    function mark() {
      btns.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-ts') === size ? 'true' : 'false');
      });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        size = b.getAttribute('data-ts');
        apply();
        mark();
        try { localStorage.setItem(KEY, size); } catch (e) { /* not remembered */ }
      });
    });
    mark();
  }

  // Only what is on screen is allowed to decode, and anything scrolled away
  // is paused so it stops costing battery.
  function lazyVideos() {
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
  }

  document.addEventListener('DOMContentLoaded', function () {
    textSize();
    lazyVideos();
  });
})();
