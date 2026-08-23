// ══════════════════════════════════════════════════════════
//  DEV PALETTE PICKER — colour-tuning dock, dev only.
//
//  Was ~18 KB of inline <style>, markup and script in index.html, shipped to
//  every visitor so that a gate could delete it again before paint. It lives
//  here now and is only requested when the URL carries ?dev (or #dev):
//    https://www.jhorro.com/?dev   ← picker on
//    https://www.jhorro.com/       ← nothing fetched, committed palette wins
//
//  TO REMOVE FOR GOOD: delete this file, dev-palette.css, and the loader
//  block at the bottom of index.html, after locking colours into :root.
// ══════════════════════════════════════════════════════════

var MARKUP = "<div class=\"palette-dock\" id=\"paletteDock\">\n  <button class=\"palette-fab\" id=\"paletteFab\" aria-label=\"Open palette picker\" title=\"Palette picker\">\n    <span class=\"palette-fab-swatch\" aria-hidden=\"true\"></span>\n  </button>\n  <div class=\"palette-panel\" id=\"palettePanel\" hidden>\n    <div class=\"palette-head\">\n      <span class=\"palette-title\">Palette \u00b7 dev</span>\n      <button class=\"palette-x\" id=\"paletteClose\" aria-label=\"Close\">\u2715</button>\n    </div>\n    <label class=\"palette-row\">\n      <span class=\"palette-label\">Accent 1</span>\n      <input type=\"color\" id=\"paletteInput\" value=\"#ffccec\">\n    </label>\n    <div class=\"palette-presets\" data-target=\"paletteInput\">\n      <button class=\"palette-swatch\" data-color=\"#ffccec\" style=\"--sw:#ffccec\" title=\"Pink (default)\"></button>\n      <button class=\"palette-swatch\" data-color=\"#a8b87a\" style=\"--sw:#a8b87a\" title=\"Sage (previous)\"></button>\n      <button class=\"palette-swatch\" data-color=\"#e0a458\" style=\"--sw:#e0a458\" title=\"Amber\"></button>\n      <button class=\"palette-swatch\" data-color=\"#5fb0c9\" style=\"--sw:#5fb0c9\" title=\"Cyan\"></button>\n      <button class=\"palette-swatch\" data-color=\"#8a9be0\" style=\"--sw:#8a9be0\" title=\"Periwinkle\"></button>\n      <button class=\"palette-swatch\" data-color=\"#d17a5f\" style=\"--sw:#d17a5f\" title=\"Terracotta\"></button>\n    </div>\n\n    <label class=\"palette-row\">\n      <span class=\"palette-label\">Accent 2</span>\n      <input type=\"color\" id=\"paletteInput2\" value=\"#b78ed2\">\n    </label>\n    <div class=\"palette-presets\" data-target=\"paletteInput2\">\n      <button class=\"palette-swatch\" data-color=\"#b78ed2\" style=\"--sw:#b78ed2\" title=\"Lilac (default)\"></button>\n      <button class=\"palette-swatch\" data-color=\"#c97fb0\" style=\"--sw:#c97fb0\" title=\"Magenta\"></button>\n      <button class=\"palette-swatch\" data-color=\"#8a9be0\" style=\"--sw:#8a9be0\" title=\"Periwinkle\"></button>\n      <button class=\"palette-swatch\" data-color=\"#5fb0c9\" style=\"--sw:#5fb0c9\" title=\"Cyan\"></button>\n      <button class=\"palette-swatch\" data-color=\"#a8b87a\" style=\"--sw:#a8b87a\" title=\"Sage\"></button>\n      <button class=\"palette-swatch\" data-color=\"#e0a458\" style=\"--sw:#e0a458\" title=\"Amber\"></button>\n    </div>\n\n    <hr class=\"palette-sep\">\n    <span class=\"palette-title\">Hue overlay</span>\n\n    <div class=\"palette-ctl\">\n      <label class=\"palette-sub\" for=\"huePair\">How the two mix</label>\n      <select id=\"huePair\">\n        <option value=\"gradient\">Gradient across each thumb</option>\n        <option value=\"alternate\">Alternate: one colour per card</option>\n      </select>\n    </div>\n\n    <div class=\"palette-ctl\" id=\"hueAngleCtl\">\n      <label class=\"palette-sub\" for=\"hueAngle\">Gradient angle <span class=\"palette-val\" id=\"hueAngleVal\">135\u00b0</span></label>\n      <input type=\"range\" id=\"hueAngle\" min=\"0\" max=\"360\" value=\"135\">\n    </div>\n\n    <div class=\"palette-ctl\">\n      <label class=\"palette-sub\" for=\"hueTint\">Tint strength <span class=\"palette-val\" id=\"hueTintVal\">69%</span></label>\n      <input type=\"range\" id=\"hueTint\" min=\"0\" max=\"100\" value=\"69\">\n    </div>\n\n    <div class=\"palette-ctl\">\n      <label class=\"palette-sub\" for=\"hueSat\">At-rest saturation <span class=\"palette-val2\" id=\"hueSatVal\">67%</span></label>\n      <input type=\"range\" id=\"hueSat\" min=\"0\" max=\"100\" value=\"67\">\n    </div>\n\n    <div class=\"palette-ctl\">\n      <label class=\"palette-sub\" for=\"hueBlend\">Blend mode</label>\n      <select id=\"hueBlend\">\n        <option value=\"color\">color \u2014 recolor to accent hue</option>\n        <option value=\"hue\">hue</option>\n        <option value=\"saturation\">saturation</option>\n        <option value=\"luminosity\">luminosity</option>\n        <option value=\"soft-light\">soft-light</option>\n        <option value=\"overlay\">overlay</option>\n        <option value=\"multiply\">multiply</option>\n        <option value=\"normal\">normal \u2014 flat colour wash</option>\n      </select>\n    </div>\n\n    <label class=\"palette-check\"><input type=\"checkbox\" id=\"hueHover\" checked> reveal true colour on hover</label>\n\n    <hr class=\"palette-sep\">\n    <div class=\"palette-hexrow\">\n      <code class=\"palette-hex\" id=\"paletteHex\">#ffccec \u2192 #b78ed2</code>\n    </div>\n    <button class=\"palette-copy\" id=\"paletteCopy\">Copy CSS for style.css</button>\n    <button class=\"palette-reset\" id=\"paletteReset\">Reset to defaults</button>\n    <a class=\"palette-link\" id=\"paletteDemoLink\" href=\"old_pages/color-overlay-demo.html\" target=\"_blank\" rel=\"noopener\">Standalone demo page \u2192</a>\n    <p class=\"palette-note\">Applies to the 5 Selected Projects thumbs.<br>Testing tool \u2014 remove before launch</p>\n  </div>\n</div>";

(function () {
  // These must mirror the committed values in style.css :root — Reset works by
  // stripping the inline overrides and letting the stylesheet show through.
  var DEFAULTS = {
    accent: '#ffccec', accent2: '#b78ed2',
    pair: 'gradient', angle: 135, tint: 69, sat: 67,
    blend: 'color', hover: true
  };
  var STORE = 'portfolio-hue-v1';
  var LEGACY = 'portfolio-accent';   // single-accent key from the sage-era picker

  // The ?dev gate lives in index.html now - this file is only fetched when
  // it passes, so reaching here means the dock is wanted. Stylesheet and
  // markup are injected here so neither costs a visitor anything.
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'dev-palette.css';
  document.head.appendChild(link);

  var host = document.createElement('div');
  host.innerHTML = MARKUP;
  while (host.firstChild) document.body.appendChild(host.firstChild);

  var dock = document.getElementById('paletteDock');
  if (dock) dock.classList.add('dev-on');

  var root = document.documentElement;
  var fab = document.getElementById('paletteFab');
  var panel = document.getElementById('palettePanel');
  var input = document.getElementById('paletteInput');
  var input2 = document.getElementById('paletteInput2');
  var pair = document.getElementById('huePair');
  var angle = document.getElementById('hueAngle');
  var angleCtl = document.getElementById('hueAngleCtl');
  var angleVal = document.getElementById('hueAngleVal');
  var tint = document.getElementById('hueTint');
  var tintVal = document.getElementById('hueTintVal');
  var sat = document.getElementById('hueSat');
  var satVal = document.getElementById('hueSatVal');
  var blend = document.getElementById('hueBlend');
  var hover = document.getElementById('hueHover');
  var hexEl = document.getElementById('paletteHex');
  var copyBtn = document.getElementById('paletteCopy');
  var resetBtn = document.getElementById('paletteReset');
  var closeBtn = document.getElementById('paletteClose');
  var demoLink = document.getElementById('paletteDemoLink');
  if (!fab) return;

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function toHex(n) { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'); }
  function darken(hex, f) { var c = hexToRgb(hex); return '#' + toHex(c[0] * f) + toHex(c[1] * f) + toHex(c[2] * f); }

  function readUI() {
    return {
      accent: input.value, accent2: input2.value,
      pair: pair.value, angle: +angle.value, tint: +tint.value, sat: +sat.value,
      blend: blend.value, hover: hover.checked
    };
  }
  function writeUI(s) {
    input.value = s.accent; input2.value = s.accent2;
    pair.value = s.pair; angle.value = s.angle;
    tint.value = s.tint; sat.value = s.sat;
    blend.value = s.blend; hover.checked = s.hover;
  }

  function apply(s) {
    var r1 = hexToRgb(s.accent).join(',');
    var r2 = hexToRgb(s.accent2).join(',');
    var gradient = s.pair === 'gradient';
    var tintF = (s.tint / 100).toFixed(2);
    var ovA = gradient
      ? 'linear-gradient(' + s.angle + 'deg, rgb(' + r1 + '), rgb(' + r2 + '))'
      : 'rgb(' + r1 + ')';

    root.style.setProperty('--accent', s.accent);
    root.style.setProperty('--accent-rgb', r1);
    root.style.setProperty('--accent-dim', darken(s.accent, 0.72));
    root.style.setProperty('--accent2', s.accent2);
    root.style.setProperty('--accent2-rgb', r2);
    root.style.setProperty('--accent2-dim', darken(s.accent2, 0.72));
    root.style.setProperty('--ov-angle', s.angle + 'deg');
    root.style.setProperty('--ov-a', ovA);
    root.style.setProperty('--ov-b', gradient ? ovA : 'rgb(' + r2 + ')');
    root.style.setProperty('--ov-tint', tintF);
    root.style.setProperty('--ov-sat', (s.sat / 100).toFixed(2));
    root.style.setProperty('--ov-blend', s.blend);
    root.style.setProperty('--ov-hover-tint', s.hover ? '0' : tintF);

    readouts(s);
  }

  // Readouts only — no custom properties touched, so this can run on the
  // default path where we deliberately let style.css drive.
  function readouts(s) {
    angleCtl.hidden = s.pair !== 'gradient';
    angleVal.textContent = s.angle + '°';
    tintVal.textContent = s.tint + '%';
    satVal.textContent = s.sat + '%';
    hexEl.textContent = s.accent + ' → ' + s.accent2;
    if (demoLink) {
      demoLink.href = 'color-overlay-demo.html?accent=' + encodeURIComponent(s.accent) +
                      '&accent2=' + encodeURIComponent(s.accent2);
    }
  }

  function buildCss(s) {
    var r1 = hexToRgb(s.accent).join(',');
    var r2 = hexToRgb(s.accent2).join(',');
    var gradient = s.pair === 'gradient';
    var tintF = (s.tint / 100).toFixed(2);
    var L = [];
    L.push(':root {');
    L.push('  --accent: ' + s.accent + ';');
    L.push('  --accent-dim: ' + darken(s.accent, 0.72) + ';');
    L.push('  --accent-rgb: ' + r1 + ';');
    L.push('  --accent2: ' + s.accent2 + ';');
    L.push('  --accent2-dim: ' + darken(s.accent2, 0.72) + ';');
    L.push('  --accent2-rgb: ' + r2 + ';');
    L.push('');
    L.push('  --ov-angle: ' + s.angle + 'deg;');
    L.push('  --ov-tint: ' + tintF + ';');
    L.push('  --ov-hover-tint: ' + (s.hover ? '0' : tintF) + ';');
    L.push('  --ov-sat: ' + (s.sat / 100).toFixed(2) + ';');
    L.push('  --ov-blend: ' + s.blend + ';');
    if (gradient) {
      L.push('  --ov-a: linear-gradient(var(--ov-angle), rgb(var(--accent-rgb)), rgb(var(--accent2-rgb)));');
      L.push('  --ov-b: var(--ov-a);');
    } else {
      L.push('  --ov-a: rgb(var(--accent-rgb));');
      L.push('  --ov-b: rgb(var(--accent2-rgb));');
    }
    L.push('}');
    return L.join('\n');
  }

  function sync() { var s = readUI(); apply(s); save(s); }
  function save(s) { try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {} }

  // Load saved tuning. On a first run under the new panel, drop the legacy
  // single-accent key so the page opens on the committed style.css palette
  // rather than resurrecting whatever accent was last tested.
  (function restore() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) {}
    if (!saved) { try { localStorage.removeItem(LEGACY); } catch (e) {} }
    var s = {};
    Object.keys(DEFAULTS).forEach(function (k) {
      s[k] = (saved && saved[k] !== undefined) ? saved[k] : DEFAULTS[k];
    });
    writeUI(s);
    if (saved) apply(s); else readouts(s);
  })();

  fab.addEventListener('click', function () { panel.hidden = !panel.hidden; });
  closeBtn.addEventListener('click', function () { panel.hidden = true; });

  [input, input2, pair, angle, tint, sat, blend, hover].forEach(function (el) {
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);
  });

  document.querySelectorAll('.palette-presets[data-target]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-color]'); if (!btn) return;
      document.getElementById(group.getAttribute('data-target')).value = btn.getAttribute('data-color');
      sync();
    });
  });

  var copyLabel = copyBtn.textContent;   // captured once, so a double-click can't stick on "Copied"
  copyBtn.addEventListener('click', function () {
    var text = buildCss(readUI());
    var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = copyLabel; }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done).catch(done); }
    else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t); done(); }
  });

  resetBtn.addEventListener('click', function () {
    try { localStorage.removeItem(STORE); localStorage.removeItem(LEGACY); } catch (e) {}
    ['--accent', '--accent-rgb', '--accent-dim', '--accent2', '--accent2-rgb', '--accent2-dim',
     '--ov-angle', '--ov-a', '--ov-b', '--ov-tint', '--ov-hover-tint', '--ov-sat', '--ov-blend']
      .forEach(function (p) { root.style.removeProperty(p); });
    writeUI(DEFAULTS);
    readouts(DEFAULTS);
  });
})();
