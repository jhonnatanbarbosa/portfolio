/* ══════════════════════════════════════════════════════════
   i18n — language runtime.
   The dictionary it reads used to be inlined above, and a byte-identical
   copy sat inside index.html as well. Both now load i18n-data.js, so the
   ~136 KB of strings exists once, is cached across both pages, and no
   longer has to be parsed before either page can finish rendering.
   Load i18n-data.js first: `translations` comes from there.
   ══════════════════════════════════════════════════════════ */

// ── LANGUAGE RUNTIME ────────────────────────────────────────
// Every DOM lookup below is null-guarded: the two pages that share this file
// draw their switchers differently, and the retro page has no dropdown at all.
let currentLang = 'en';
const langMeta = {
  en: { code: 'EN', htmlLang: 'en',    native: 'English'  },
  pt: { code: 'PT', htmlLang: 'pt-BR', native: 'Português' },
  ja: { code: 'JA', htmlLang: 'ja',    native: '日本語'    },
};

function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;
  currentLang = lang;

  // Keys a dictionary hasn't translated yet fall back to the English source
  // captured on load, so a partial pass can't leave the previous language behind.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const text = dict[el.getAttribute('data-i18n')] || el.dataset.i18nDefault;
    if (text) el.textContent = text;
  });
  // A few strings carry inline <code>/<strong> that textContent would strip.
  // These are authored here, never user input, so innerHTML is safe.
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const html = dict[el.getAttribute('data-i18n-html')] || el.dataset.i18nHtmlDefault;
    if (html) el.innerHTML = html;
  });
  // The system diagrams describe themselves to screen readers through
  // aria-label, which is an attribute rather than a text node.
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const text = dict[el.getAttribute('data-i18n-aria')] || el.dataset.i18nAriaDefault;
    if (text) el.setAttribute('aria-label', text);
  });

  const meta = langMeta[lang] || langMeta.en;
  document.documentElement.lang = meta.htmlLang;

  const code = document.getElementById('langCode');
  if (code) code.textContent = meta.code;
  const navFlag = document.querySelector('#langFlag use');
  if (navFlag) navFlag.setAttribute('href', '#flag-' + lang);

  document.querySelectorAll('.lang-option').forEach(opt => {
    const on = opt.dataset.lang === lang;
    opt.setAttribute('aria-checked', String(on));
    opt.classList.toggle('is-current', on);
  });
}

function setLanguage(lang) {
  try { localStorage.setItem('portfolio-lang', lang); } catch (e) { /* private mode */ }
  applyLanguage(lang);
}

document.addEventListener('DOMContentLoaded', function () {
  // Snapshot the authored English before any dictionary can overwrite it.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.dataset.i18nDefault = el.textContent;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.dataset.i18nHtmlDefault = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.dataset.i18nAriaDefault = el.getAttribute('aria-label') || '';
  });

  // English-first: a visitor stays in English until they pick otherwise.
  let saved = null;
  try { saved = localStorage.getItem('portfolio-lang'); } catch (e) { /* private mode */ }
  applyLanguage(saved && langMeta[saved] ? saved : 'en');

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => setLanguage(opt.dataset.lang));
  });
});
