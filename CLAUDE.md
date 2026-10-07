# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The source of www.jhorro.com, a hand-written static site holding two things:

- `/` is Jhorro Productions, the studio: Dead Saints Parade and the two released idle games.
- `/jhonnatan/` is Jhonnatan Barbosa's personal game-designer portfolio, which also covers work unrelated to the studio.

There is no build step, package manager or bundler. Files are served exactly as committed, so every edit is a production edit.

## Layout

- `site/` is the web root and the only folder the server can reach. Anything that should not be public stays out of it.
  - The studio has four pages, English only: `site/index.html` (the home), `site/dead-saints-parade.html` (the game), `site/privacy-policy.html` and `site/404.html`.
  - `site/studio.css` is the stylesheet those four share, and `site/studio.js` is the lazy-video script for the two that play clips. Each page keeps its markup, and any script of its own, inline.
  - `site/media/` and `site/brand/` hold the studio's clips and logo files.
  - `site/jhonnatan/` is the whole portfolio as one self-contained folder (page, stylesheet, scripts, `media/`, `docs/`). It references its own files with relative paths.
- `deploy/Caddyfile` is the server config.
- `tools/check_site.py` checks links and translation keys. `tools/preview.py` is the local preview server.
- `notes/` holds sources that are not pages: the CV and GDD in markdown, and `SKILL.md`.
- `archive/` holds retired pages and about 750 MB of media no current page uses. Nothing in it is served or maintained, and paths inside the archived pages are broken. To use a file again, move it back under `site/`.

## Commands

```
python tools/check_site.py                     # after any change to a link, path or translation key
python tools/preview.py                        # preview at http://localhost:8000
```

- A link to a file that is not written yet goes in `PENDING` at the top of `tools/check_site.py`, so the checker reports it without failing.
- `tools/preview.py` serves `/foo` as `foo.html` and answers a missing address with `404.html`, as Caddy does. It does not reproduce the redirects, which only work in production. `python -m http.server` does neither: there `/dead-saints-parade` is a 404 and the error page is Python's own.
- A page opened as a file, or from a server not rooted at `site/`, loses every root-absolute path. The 404 page uses nothing else, so it shows unstyled that way.
- `http://localhost:8000/jhonnatan/?dev` (or `#dev`) mounts the colour-tuning dock (`dev-palette.js` / `dev-palette.css`). Nothing is fetched without the flag.

## Deploying

The server's `/var/www/jhorro` is a git checkout of `main`, and Caddy serves `/var/www/jhorro/site`. A content change goes live with `git pull` on the server. `/etc/caddy/Caddyfile` is a copy of `deploy/Caddyfile`, so a routing change also needs the copy and a reload; the commands are at the top of that file.

## Routing

All of it is in `deploy/Caddyfile`:

- `/foo` serves `foo.html`, and a folder serves its `index.html`. The portfolio's canonical URL is `/jhonnatan/` with the trailing slash, and its relative paths depend on that.
- The portfolio used to be the root and the studio used to be `/productions`. The redirects for those old addresses, including the `@moved` rule that sends old root asset URLs into `/jhonnatan/`, must stay. A new file at the root must not take the name of one under `/jhonnatan/` (`style.css`, `index.js`), or that rule stops forwarding the old address.
- A fragment never reaches the server, so the studio home carries a small inline script that forwards old portfolio links such as `/#cyberpunk-analytics`. A new portfolio section id that old links might use goes in its list, and no section of the studio home may use an id from it. That is why the home's about panel is `#studio`, not `#about`.
- A missing address gets `site/404.html` with a 404 status, through `handle_errors`. Caddy serves that page at any depth, so every path inside it is root-absolute. It is `noindex` and stays out of the sitemap.

Addresses other parties hold, which must keep answering:

- `/privacy-policy` is registered in both Google Play listings. Its wording is a legal text: restyle it freely, reword it only when asked.
- `/google1551b97329f3afc5.html` is the Search Console verification file and has to be served directly, not redirected.
- `/jhonnatan/docs/*.pdf`, and the old `/docs/*.pdf` that redirects to it, are linked from CVs already sent out. Do not rename or remove a PDF.

Adding or renaming a page means its `<link rel="canonical">` (extensionless, `https://www.jhorro.com/...`), `site/sitemap.xml`, every inbound link, and a `redir` in the Caddyfile for the old address.

## Portfolio i18n

Only `site/jhonnatan/index.html` is translated. The studio pages and the case study are English only.

- `i18n-data.js` defines one global `const translations` with `en`, `pt` and `ja`, which must carry identical key sets. `tools/check_site.py` verifies that.
- Markup hooks: `data-i18n` (sets `textContent`), `data-i18n-html` (sets `innerHTML`, for strings with inline tags), `data-i18n-aria` (sets `aria-label`).
- The runtime is in `index.js`, a classic script reading `translations` off the global scope, so `i18n-data.js` must come first in document order.
- English exists twice: in the markup and in `translations.en`. A visitor sees the markup until they pick a language, then `translations.en` when they switch back. A copy edit is four edits: the markup plus `en`, `pt` and `ja`.
- The dashboard is a separate system. `cyberpunk-dashboard.html` carries its own inline `pt` and `ja` objects, uses the English literal passed to `t(key, fallback)` as the source text, reads the `portfolio-lang` localStorage key once at load and reloads on the `storage` event.

## Studio voice

The studio pages are for players, not a portfolio. Their copy is plain and short.

The home runs in this order: the studio, the card for the game in development, the released games, and last the about panel. The game page runs: the same card, the development status, then how it plays. Overviews come before details, so a new write-up of how the game works goes at the bottom of the game page.

- Say what a game is and how it plays, in the second person ("you take cover"). The studio itself is described in neutral sentences, with no "I" and no "we".
- Leave out the portfolio's material: design rationale, what was cut and why, tuning values, engine or code names, analytics findings, and claims about growth or marketing.
- After writing or rewriting visible copy on a studio page, run it through the humanizer skill. The owner asked for that in October 2026. On the privacy policy that pass may change wording, never what the policy states.
- The "Contact and follow" row on the home's studio card holds the Email button (`contact@jhorro.com`) and the studio's YouTube, LinkedIn, X and Instagram accounts, as text buttons with no icons. The same four URLs are in the footer of every studio page, in `sameAs` in the home's structured data, and in the `twitter:site` tags of the home and the game page.
- `support@jhorro.com` is the address for the Android games and the one the privacy policy names.
- The studio pages do not push the portfolio: it is linked from the nav and from the about panel, and has no button on the studio card and no footer link.
- No decorative characters in the visible text of the studio pages: no arrows, middle dots, triangles, bullets or check marks. Separate items with a comma, a pipe or a plain word, and write `1024x768` and `-30` with keyboard characters. The degree sign and the copyright sign stay. Code comments are not affected.

## Dead Saints Parade is written up twice

The studio (the card on `site/index.html`, and the card, Development status and "How it plays" panels on `site/dead-saints-parade.html`) and the portfolio (`site/jhonnatan/index.html`: the flagship card and the "Currently Working On" section) cover the same game from the same facts, and share the build footage.

- The portfolio has the long version, in first person and in three languages. The studio has a short plain version in English only, so the two are not word-for-word copies and the lists on the game page use simpler names.
- The card (clip, blurb, facts table) is on both studio pages. A change to it on one goes into the other.
- A status update goes into the game page's status panel, the home card's lead paragraph, and the portfolio markup plus `en`, `pt` and `ja`.
- The demo percentage appears in the home card's lead paragraph and in the game page's status panel, where the bar's `width` and `aria-valuenow` carry it too. The game page's own lead paragraph leaves it out. The to-do and done counts are in that panel's two labels.

## Analytics dashboard

`site/jhonnatan/cyberpunk-dashboard.html` is a single-file React app (React 18, Recharts and Babel-standalone from cdnjs) whose JSX is transpiled in the browser. All datasets are literals near the top of its `<script type="text/babel">`. It is iframed into `#cyberpunk-analytics` on the portfolio, so its `matchMedia` checks see the iframe's width, not the device's, and its layout is tuned for a short embed.

## Styling

- `site/jhonnatan/style.css` `:root` is the portfolio palette. Each accent is stored three ways (`--accent`, `--accent-dim`, `--accent-rgb`) so `rgba(var(--accent-rgb), a)` works; `--ov-*` drive the hue overlay on the project thumbnails.
- `DEFAULTS` in `dev-palette.js` must mirror those committed values: its Reset strips the inline overrides and lets the stylesheet show through.
- The palette is repeated as literals in the dashboard's `theme` object and in `dsp-case-study.html`'s own `:root` (which swaps in a gilt accent).
- The studio pages are an early-2000s fansite pastiche, and `notes/SKILL.md` is the design brief. Read it before changing a studio page. Its bans are the point of the skin: no `border-radius`, no blurred shadows, no modern icon sets, no hero sections, no reflow into a modern responsive stack.
- All four take their chrome and components from `site/studio.css`. A page's own `<style>` holds only what that page alone needs, and comes after the stylesheet link.
- The TRIAL blocks at the end of `studio.css` are experiments laid over the rules above them. Deleting a block puts that part of every studio page back. A rule a trial overrides has to stay above the trials in that file, not in a page's inline style.
- The banner, nav and footer markup is repeated in each studio page, so a change to it is four edits. On the home the lockup is the `h1`; on the other three it is a link home and the page's own title is the `h1`.
- `site/concept-jhorro-codex.html` is a noindex concept for a possible future studio skin, not a live page.

## Portfolio JS conventions

- Markup calls globals from inline `onclick=`: `openProjectModal`, `closeProjectModal`, `copyEmail`. Keep them as top-level declarations in a classic script; wrapping them in a module or IIFE breaks the page silently.
- Project modals are `.pd-overlay#pd-<id>`, opened by `.pd-trigger[href="#pd-<id>"]`. A closed overlay is `opacity: 0`, not `display: none`, so its videos always intersect the viewport. They are excluded from the lazy-video observer and played or paused by the open/close functions instead.
- Videos opt into lazy playback with `data-lazyvideo` and never autoplay under `prefers-reduced-motion`.
- Clips the studio home also plays live in `site/media/`, and the portfolio references them as `/media/...`. Everything else it uses is under `site/jhonnatan/media/`. A clip that starts being used on both pages moves to `site/media/`.
