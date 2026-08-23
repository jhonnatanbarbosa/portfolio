// ══════════════════════════════════════════════════════════
//  index.html behaviour — language switcher, project modals,
//  lazy video, scroll state.
//
//  Was two inline <script> blocks at the bottom of index.html. Both are
//  loaded with `defer` now, so they run after parsing rather than blocking
//  it, and the browser can cache them between visits.
//
//  Depends on `translations` from i18n-data.js, which is deferred ahead of
//  this file. Functions called from inline onclick= handlers in the markup
//  (openProjectModal, closeProjectModal, copyEmail, setLanguage) are declared
//  at top level and stay global.
// ══════════════════════════════════════════════════════════


// ── LANGUAGE STATE ──────────────────────────────────────
let currentLang = 'en';
const langMeta = {
  en: { code: 'EN', htmlLang: 'en' },
  pt: { code: 'PT', htmlLang: 'pt-BR' },
  ja: { code: 'JA', htmlLang: 'ja' },
};

function applyLanguage(lang) {
  currentLang = lang;
  const dict = translations[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    // Keys a dictionary hasn't translated yet fall back to the English source
    // captured on load, so a partial pass can't leave the previous language behind.
    const text = dict[key] || el.dataset.i18nDefault;
    if (text) el.textContent = text;
  });
  // A few strings carry inline <code>/<strong> that textContent would strip.
  // These are authored here, never user input, so innerHTML is safe.
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const html = dict[key] || el.dataset.i18nHtmlDefault;
    if (html) el.innerHTML = html;
  });
  // The two system diagrams describe themselves to screen readers through
  // aria-label, which is an attribute rather than a text node. Same lookup,
  // different sink.
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const text = dict[key] || el.dataset.i18nAriaDefault;
    if (text) el.setAttribute('aria-label', text);
  });
  const meta = langMeta[lang] || langMeta.en;
  document.documentElement.lang = meta.htmlLang;
  document.getElementById('langCode').textContent = meta.code;
  const navFlag = document.querySelector('#langFlag use');
  if (navFlag) navFlag.setAttribute('href', '#flag-' + lang);
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.setAttribute('aria-checked', String(opt.dataset.lang === lang));
  });
}

function setLanguage(lang) {
  localStorage.setItem('portfolio-lang', lang);
  applyLanguage(lang);
}

// ── Language menu (open/close, keyboard, outside click) ──
function openLangMenu() {
  const menu = document.getElementById('langMenu');
  const trigger = document.getElementById('langTrigger');
  if (!menu || !trigger) return;
  // A close still animating has a pending timer that would re-hide the menu
  // right after we reopen it.
  clearTimeout(menu._hideTimer);
  menu.hidden = false;
  menu.offsetHeight;  // force layout so the transition has a start state to animate from
  menu.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');
}

function closeLangMenu(refocus) {
  const menu = document.getElementById('langMenu');
  const trigger = document.getElementById('langTrigger');
  if (!menu || !trigger) return;
  menu.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  clearTimeout(menu._hideTimer);
  menu._hideTimer = setTimeout(() => { menu.hidden = true; }, 180);
  if (refocus) trigger.focus();
}

function langMenuIsOpen() {
  const trigger = document.getElementById('langTrigger');
  return !!trigger && trigger.getAttribute('aria-expanded') === 'true';
}

// ── COPY EMAIL TO CLIPBOARD ──────────────────────────────
function copyEmail(btn) {
  const email = btn.dataset.email;
  const label = btn.querySelector('.copy-label');
  const dict = translations[currentLang] || translations.en;

  // The dock's copy button is icon-only (no .copy-label) — it says "copied"
  // by swapping the icon, so the label update has to be optional.
  const done = () => {
    btn.classList.add('copied');
    if (label) label.textContent = dict.contact_copied || 'Copied!';
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.textContent = dict.contact_copy || 'Copy address';
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(done).catch(() => fallbackCopy(email, done));
  } else {
    fallbackCopy(email, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { /* clipboard unavailable */ }
  document.body.removeChild(ta);
}

// ── PROJECT DETAIL MODALS ────────────────────────────────
let activeModal = null;
// Keyboard users need focus to follow the modal in and back out again, the
// same way it already follows the language menu.
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
let modalReturnFocus = null;

function focusablesIn(overlay) {
  return Array.from(overlay.querySelectorAll(FOCUSABLE))
              .filter(el => el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

// A closed .pd-overlay keeps its box — it is only opacity:0, never
// display:none — so its videos sit permanently inside the viewport and the
// lazy-video observer used to autoplay all six of them at load, decoding
// H.264 nobody could see. Gallery playback is driven from open/close instead.
function setModalVideos(overlay, playing) {
  // Same bargain the in-page videos strike: someone who asked for reduced
  // motion gets the first frame and nothing else.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  overlay.querySelectorAll('video').forEach(v => {
    if (playing && !still) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  });
}

function openProjectModal(id) {
  const overlay = document.getElementById('pd-' + id);
  if (!overlay) return;
  if (activeModal) {
    activeModal.classList.remove('open');
    setModalVideos(activeModal, false);
  }
  // Only remember the trigger when no modal was already open, so switching
  // between modals still returns focus to the card that started it.
  if (!activeModal) modalReturnFocus = document.activeElement;
  overlay.classList.add('open');
  setModalVideos(overlay, true);
  activeModal = overlay;
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
  const first = overlay.querySelector('.pd-close button') || focusablesIn(overlay)[0];
  if (first) requestAnimationFrame(() => first.focus());
}
function closeProjectModal() {
  if (activeModal) {
    activeModal.classList.remove('open');
    setModalVideos(activeModal, false);
    activeModal = null;
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    if (modalReturnFocus && document.contains(modalReturnFocus)) modalReturnFocus.focus();
    modalReturnFocus = null;
  }
}

// Tab cycles inside the open modal instead of walking the page behind it.
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !activeModal) return;
  const items = focusablesIn(activeModal);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  } else if (!activeModal.contains(document.activeElement)) {
    e.preventDefault(); first.focus();
  }
});

// ── INIT: Store English defaults, then check saved lang ──
document.addEventListener('DOMContentLoaded', function() {
  // Save original English text as data attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.dataset.i18nDefault = el.textContent;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.dataset.i18nHtmlDefault = el.innerHTML;
  });

  // The site is English-first: nothing is shown on load, and a visitor stays in
  // English until they pick otherwise. Only a stored choice changes that.
  const saved = localStorage.getItem('portfolio-lang');
  if (saved && langMeta[saved]) applyLanguage(saved);

  const langSwitch = document.getElementById('langSwitch');
  const langTrigger = document.getElementById('langTrigger');
  const langMenu = document.getElementById('langMenu');

  if (langSwitch && langTrigger && langMenu) {
    langTrigger.addEventListener('click', e => {
      e.stopPropagation();
      langMenuIsOpen() ? closeLangMenu(false) : openLangMenu();
    });

    const options = Array.from(langMenu.querySelectorAll('.lang-option'));

    options.forEach((opt, i) => {
      opt.addEventListener('click', () => {
        setLanguage(opt.dataset.lang);
        closeLangMenu(true);
      });
      // Arrow keys walk the menu; Home/End jump to either end.
      opt.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const step = e.key === 'ArrowDown' ? 1 : -1;
          options[(i + step + options.length) % options.length].focus();
        } else if (e.key === 'Home') {
          e.preventDefault(); options[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault(); options[options.length - 1].focus();
        }
      });
    });

    // Down-arrow on the closed trigger opens the menu and lands on the first item.
    langTrigger.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!langMenuIsOpen()) openLangMenu();
        const target = e.key === 'ArrowDown' ? options[0] : options[options.length - 1];
        requestAnimationFrame(() => target && target.focus());
      }
    });

    document.addEventListener('click', e => {
      if (langMenuIsOpen() && !langSwitch.contains(e.target)) closeLangMenu(false);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && langMenuIsOpen()) closeLangMenu(true);
    });

    // Tabbing out of the menu should close it the same way clicking away does.
    langSwitch.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (langMenuIsOpen() && !langSwitch.contains(document.activeElement)) closeLangMenu(false);
      });
    });

    // A menu left hanging open while the page scrolls away looks broken.
    window.addEventListener('scroll', () => {
      if (langMenuIsOpen()) closeLangMenu(false);
    }, { passive: true });
  }

  // Project thumbnails open the same modal as the "View details" link.
  document.querySelectorAll('.project-card').forEach(card => {
    const trigger = card.querySelector('.pd-trigger');
    const thumb = card.querySelector('.project-thumb');
    if (!trigger || !thumb) return;
    const id = (trigger.getAttribute('href') || '').replace('#pd-', '');
    if (!id) return;

    const name = card.querySelector('.project-name');
    thumb.classList.add('is-clickable');
    thumb.setAttribute('role', 'button');
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('aria-label', name ? 'View details: ' + name.textContent.trim() : 'View project details');

    thumb.addEventListener('click', () => openProjectModal(id));
    thumb.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(id);
      }
    });
  });

  // Hide the swipe hint on each modal gallery after the user first scrolls it.
  document.querySelectorAll('.pd-gallery').forEach(gallery => {
    const wrap = gallery.closest('.pd-gallery-wrap');
    if (!wrap) return;
    if (gallery.scrollWidth <= gallery.clientWidth + 4) {
      wrap.classList.add('scrolled');
      return;
    }
    gallery.addEventListener('scroll', () => {
      if (gallery.scrollLeft > 8) wrap.classList.add('scrolled');
    }, { once: true, passive: true });
  });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjectModal(); });

// Every project thumbnail is a looping video. Decoding all seventeen at once
// spins the fan and stutters the scroll during exactly the thirty seconds this
// page most needs to look composed, so they stay paused until they are on
// screen. preload="metadata" keeps a first frame painted either way.
(function () {
  // Modal gallery videos are excluded: their overlay is fixed and inset:0
  // even while closed, so they always "intersect" and would play forever
  // behind an opacity:0 layer. openProjectModal drives those instead.
  const vids = Array.prototype.slice
    .call(document.querySelectorAll('video[data-lazyvideo]'))
    .filter(v => !v.closest('.pd-overlay'));
  if (!vids.length) return;

  if (!('IntersectionObserver' in window)) {
    vids.forEach(v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
    return;
  }
  // Someone who asked for reduced motion gets the first frame and nothing else.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.1 });

  vids.forEach(v => io.observe(v));
})();

// ── Nav scroll state ─────────────────────────────────────
const nav = document.querySelector('nav');
const progressBar = document.querySelector('.scroll-progress');

// ── Floating contact dock ────────────────────────────────
// Shows once the intro is behind you, hides again over #contact so the dock
// and the full contact panel never make the same pitch at the same time.
const contactDock = document.getElementById('contactDock');
const contactSection = document.getElementById('contact');
let contactInView = false;

// scrollHeight used to be read inside the scroll handler, which forced a
// synchronous layout on every event and then invalidated it again by writing
// the bar's width. It only changes when the document resizes, so it is cached
// and the work is batched into one animation frame.
let docHeight = 0;
let scrollQueued = false;

const measure = () => {
  docHeight = document.documentElement.scrollHeight - window.innerHeight;
};

const update = () => {
  scrollQueued = false;
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  // ── Scroll progress bar ──
  // scaleX rather than width: the bar rides the compositor instead of
  // relaying out the page behind it on every frame.
  if (progressBar && docHeight > 0) {
    progressBar.style.transform = 'scaleX(' + Math.min(y / docHeight, 1) + ')';
  }
  if (contactDock) {
    contactDock.classList.toggle('show', y > 460 && !contactInView);
  }
};

const onScroll = () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(update);
  }
};

measure();
window.addEventListener('resize', measure, { passive: true });
// The page grows and shrinks without a resize event too — the shipped-systems
// <details> toggling open, or a modal locking body scroll.
if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
window.addEventListener('scroll', onScroll, { passive: true });
update();

// A closed <details> doesn't print its contents — expand the shipped-systems
// list for the print pass, then put it back the way the reader left it.
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details.wip-shipped').forEach(d => {
    d.dataset.printWasOpen = d.open ? '1' : '';
    d.open = true;
  });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details.wip-shipped').forEach(d => {
    d.open = d.dataset.printWasOpen === '1';
  });
});

if (contactDock && contactSection && 'IntersectionObserver' in window) {
  const dockIO = new IntersectionObserver((entries) => {
    contactInView = entries[0].isIntersecting;
    onScroll();
  }, { rootMargin: '0px 0px -25% 0px' });
  dockIO.observe(contactSection);
}

// ── Scroll reveal (IntersectionObserver) ─────────────────
const reveals = document.querySelectorAll('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// ── Nav active state on scroll ───────────────────────────
const navLinks = document.querySelectorAll('nav .nav-links a[href^="#"]');
const trackedSections = [];
navLinks.forEach(link => {
  const id = link.getAttribute('href').slice(1);
  const sec = document.getElementById(id);
  if (sec) trackedSections.push({ el: sec, link: link });
});

if (trackedSections.length && 'IntersectionObserver' in window) {
  let currentActive = null;
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = trackedSections.find(s => s.el === entry.target);
        if (match) {
          if (currentActive) currentActive.classList.remove('active');

          match.link.classList.add('active');
          currentActive = match.link;
        }
      }
    });
  }, { threshold: 0.05, rootMargin: '-80px 0px -50% 0px' });
  trackedSections.forEach(s => navIO.observe(s.el));
}
