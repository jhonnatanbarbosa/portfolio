---
name: early-2000s-gaming-web
description: Design and build websites in the authentic early-2000s gaming/fansite aesthetic — dark tiled backgrounds, fixed-width table chrome, 10px Verdana, sliced headers, 88x31 buttons, sidebar box stacks, newswire front pages. Use this skill whenever the user wants a site, page, portfolio, or component that looks retro, old-web, Y2K, GeoCities, Neocities, webcore, "like 2003", or like an old fansite, clan site, shrine, or forum — even if they only say "make it look old" or "retro website" without naming an era. Also use it when diagnosing why a retro attempt reads as a broken modern site instead of a period artifact, or when sourcing period-correct fonts, graphics, palettes, and archives.
---

# Early-2000s Gaming Web

Build pages that read as **a genuine artifact from 2002**, not as a badly-made modern site.

## The core principle

Retro attempts fail when they read as incompetence rather than as period. The two failure modes look completely different:

| | Bad modern site-builder | Authentic early-2000s |
|---|---|---|
| Cause | Nobody made a decision | One person made a thousand decisions, all enthusiastic |
| Layout | Full-bleed sections, each a screenful | Fixed 760px column on visible background texture |
| Type | 16–48px, generous line-height | 10–11px Verdana, tight leading |
| Density | Sparse, scroll-to-reveal | Everything above the fold |
| Structure | Invisible (whitespace separates) | Visible (1px borders, boxes inside boxes) |
| Graphics | Stock photos, icon sets | Hand-drawn, hand-sliced, faintly crunchy |

**The single strongest signal is a hard-edged fixed-width column sitting on a tiled background.** No modern builder produces that — they are all fluid and full-bleed. If wallpaper is visible to the left and right of the content, viewers file the page as "old," not "broken."

**Recreate the constraints, not just the decorations.** The look came from real limits: 800×600 screens, dial-up filesizes, 256-color GIFs, and no usable CSS layout until ~2002–2004. Honor the limits and the aesthetic falls out for free. Bolt flame GIFs onto a modern layout and it reads as costume.

## Step 1 — Pick one era and one subgenre, and say which

Blending 1998 GeoCities with 2005 glossy forums reads as generic "retro" = accidental. Commit to one and state the choice to the user up front. If they haven't specified, default to **2002 network fansite** — it is the most legible and the most flattering for portfolios.

- **1997–1999 — Free-host shrine.** GeoCities/Angelfire/Tripod. Frames, MIDI autoplay, guestbook, webring, under-construction GIF, tiled starfield, Comic Sans, `<center>` everything. Amateur and joyful.
- **2000–2003 — Network fansite.** ← default. Dark tiled bg, 760px table shell, gunmetal-and-orange, sliced header image, newswire front page, sidebar box stack, 468×60 banner, staff page, affiliates row. Reads as *competent enthusiast*.
- **2003–2006 — Forum/portal.** phpBB2 subSilver blue, vBulletin, 1px grids, early gloss gradients, orange-and-black portal chrome, 500×100 signature banners.

## Step 2 — Build the shell

Use CSS grid/flex **styled to look like tables** for the interior; keep one real fixed-width container for the shell. This gives period appearance without genuine breakage. Only hand-write real nested `<table>` layout if the user explicitly wants the authenticity of the markup itself.

```css
body {
  background: #0a0a0a url(img/bg_tile.gif) repeat;
  color: #c0c0c0;
  font: 11px Verdana, Tahoma, Geneva, sans-serif;
  margin: 0;
  padding: 10px 0;
  text-align: center;          /* period-correct centering idiom */
}
#shell {
  width: 760px;
  margin: 0 auto;
  text-align: left;
  background: #0d0d0d;
}
```

The 1px-grid trick — the era's signature. A wrapper with 1px of padding in the border color, an inner block in the fill color:

```css
.panel        { background: #333333; padding: 1px; margin-bottom: 6px; }
.panel .inner { background: #111111; padding: 6px 8px; }
.panel .title {
  background: #ff6600; color: #000000;
  font: bold 10px Tahoma, sans-serif;
  text-transform: uppercase; letter-spacing: 1px;
  padding: 3px 6px;
}
```

Real table version, if requested:

```html
<table width="760" border="0" cellpadding="0" cellspacing="0" align="center">
  <tr><td colspan="2"><img src="img/header.gif" width="760" height="120" alt="SITE NAME"></td></tr>
  <tr>
    <td width="160" valign="top" bgcolor="#111111"><!-- sidebar boxes --></td>
    <td width="600" valign="top" bgcolor="#0d0d0d"><!-- newswire --></td>
  </tr>
  <tr><td colspan="2" bgcolor="#000000"><!-- footer --></td></tr>
</table>
```

## Step 3 — Type

- Body: `11px Verdana, Tahoma` — never larger. Line-height ~1.35.
- Headings: `Arial Black`, `Impact`, or a sliced image. Uppercase, letter-spaced.
- Nav labels: 9–10px, ALL CAPS.
- Pixel fonts (04b03, Silkscreen, Visitor) only at exact multiples of their design size, with smoothing off:

```css
.pixel {
  font-family: 'PixelFont', monospace;
  font-size: 8px;              /* or 16px, 24px — never 11px */
  -webkit-font-smoothing: none;
  image-rendering: pixelated;
}
```

Comic Sans belongs to the 1998 shrine subgenre only. Gaming sites of 2002 used Verdana, Tahoma, Arial, Impact.

## Step 4 — Color

Pick one palette and stay inside it. Roughly eight colors total.

**Gunmetal / Orange** (network fansite, 2002)
`bg #0a0a0a` · `panel #141414` · `border #333333` · `accent #ff6600` · `text #c0c0c0` · `link #ff9933` · `heading #ffffff`

**Toxic** (Quake/mod site, 2000)
`bg #000000` · `panel #0d0d0d` · `border #1f3d1f` · `accent #00ff00` · `text #99cc99` · `link #ccff00`

**subSilver** (phpBB2 forum, 2003)
`bg #e5e5e5` · `panel #ffffff` · `border #98aab1` · `header #006699` · `alt-row #dee3e7` · `text #000000`

Tile behind everything: brushed metal, carbon fiber, starfield, diamond plate, faint grid. Keep the tile under ~8KB.

## Step 5 — Graphics

Use the Photoshop 6/7 vocabulary deliberately: bevel & emboss, drop shadow, outer glow, lens flare, chrome gradient text, plastic wrap, 1px cut-corner frames. A sliced header where the logo bleeds into the nav strip is the highest-value single asset.

Save graphics as GIF at 32–64 colors so dithering and banding actually appear. Keep every image under ~30KB. Perfectly clean vectors read as modern.

Rollovers — the modern equivalent of the era's `onmouseover` image swap:

```css
.nav a       { display:block; width:140px; height:18px;
               background:url(img/nav.gif) 0 0; text-indent:-9999px; }
.nav a:hover { background-position: 0 -18px; }
```

Show the literal period version only if the user wants authentic markup:

```html
<a href="news.html"
   onmouseover="document.nav_news.src='img/nav_news_on.gif'"
   onmouseout="document.nav_news.src='img/nav_news_off.gif'">
  <img name="nav_news" src="img/nav_news_off.gif" width="140" height="18" border="0" alt="News">
</a>
```

## Step 6 — Furniture

This is what makes it a *gaming* site rather than merely an old site. Include most of these:

- **Newswire front page**: dated posts with author handle, timestamp, and "Comments (37)".
- **Sidebar box stack**: Navigation / Search / Poll / Affiliates / Shoutbox / Staff Online / Ad — each its own titled panel.
- **Ad slots**: 468×60 leaderboard up top, 120×600 skyscraper at right. Fake ads are period-perfect and funny.
- **Update log**: `05.14.03 — updated the media section. —Webmaster`
- **Poll widget** with a result bar made from a stretched 1px GIF.
- **Files section**: mirrors, filesize, "downloaded 4,281 times".
- **Media gallery**: thumbnails in a rigid grid.
- **Staff page**: handles, roles, AIM/ICQ/MSN numbers.
- **Affiliates row** of 88×31 buttons.
- **"Link to Us" page** offering your own 88×31 and 468×60 banners.
- **Guestbook**, **hit counter** (`You are visitor #00012847`), **marquee ticker**.
- **Badges**: "Best viewed at 1024×768 in IE6", "Made with Notepad".
- **Disclaimer**: "This site is not affiliated with… All images property of their respective owners."

Newswire markup shape:

```html
<div class="newspost">
  <div class="newshead">SITE REDESIGN v4 IS LIVE
    <span class="meta">— posted by webmaster @ 05.14.03 · 11:47pm</span></div>
  <div class="newsbody">…</div>
  <div class="newsfoot"><a href="#">Comments (37)</a> | <a href="#">Permalink</a></div>
</div>
```

## Step 7 — If it's a portfolio, give it an in-fiction premise

The strongest move: **the portfolio *is* a fansite — for the person.** This turns a skin into a coherent joke, and it is what people remember. Map the sections:

| Portfolio section | Fansite equivalent |
|---|---|
| About | Staff / Webmaster's Bio |
| Projects | Files & Downloads / Media |
| Case study | Walkthrough / FAQ v1.3 |
| Skills | Stats table with bar graphs |
| Contact | Guestbook / Link to Us |
| Resume | Plain-text FAQ, "last updated 08.23.03" |
| Blog | News archive |

Overstuff it with real, opinionated writing. Period sites were dense with actual prose. Sparse content is the single fastest way to read as an unfinished template.

## Step 8 — The modern layer (invisible, but it's what makes it look intentional)

Do these quietly. They separate craft from pastiche.

- **Make the gimmicks work.** A guestbook that accepts entries, a counter that counts, a poll that tallies. Functional beats decorative.
- **Load instantly.** A retro-looking page with a 4-second paint destroys the illusion.
- **Mobile**: do not reflow into a modern responsive stack — that reintroduces exactly the look being avoided. Either set `<meta name="viewport" content="width=760">` so phones zoom out to the whole fixed shell (period-correct and legible), or ship a "Lo-Fi / Text Version" link that renders as a stripped WAP-era page.
- **Never autoplay audio.** Put the MIDI or tracker loop behind a Winamp-styled play button.
- **Accessibility**: real `alt` text, visible keyboard focus, sufficient contrast on the accent color, and:

```css
@media (prefers-reduced-motion: reduce) {
  .blink, .marquee, marquee { animation: none !important; }
}
```

- **Text-size widget (A A A)** — genuinely period-correct *and* an accessibility escape hatch.
- Keep one plain-HTML resume or summary link for anyone who needs to skim.
- **Easter eggs**: Konami code, a "right-click protected!" alert that is obviously a gag, a secret page linked from a 1px transparent GIF, a fake browser-detect congratulating Netscape users.

## Anti-patterns — any one of these breaks the era

Ban outright:

- `border-radius`, blurred `box-shadow`, glassmorphism, gradient meshes
- `system-ui` / Inter / Helvetica Neue; a `rem` type scale; line-height 1.6
- Lucide / Feather / Font Awesome / any modern icon set
- Hero sections, scroll-triggered animation, sticky headers, hamburger menus
- Even, generous padding and perfect optical alignment — the era had none
- A dark-mode toggle with a moon icon (a JS **stylesheet swapper** labeled "Night Mode" is period-correct; the modern pattern is not)
- Lorem ipsum or "Project Title / Description goes here"
- **The 2020s "Y2K aesthetic"** — chrome bubbles, iridescent holographic gradients, blobs, pastel. That is a recent reinvention. Real 2000s gaming sites were dark, dense, gunmetal and orange.
- The same five over-used GifCities GIFs. Draw original graphics instead; reused stock assets are a tell that a vibe was downloaded rather than built.

## Sourcing references and assets

For visual research, point to archives rather than guessing:

- **Wayback Machine** (`archive.org/web`) — paste a URL, pick a 2001–2003 snapshot.
- **gamespy-archives.quaddicted.com** — browsable mirror of the GameSpy Planet Network fansites. Richest vein for the default subgenre.
- **webdesignmuseum.org** — curated screenshots and videos, 1990s–late 2000s.
- **oldweb.today** — opens archived sites inside period browsers. Best way to feel the constraints.
- **theoldnet.com** — proxies Wayback with incompatible JS stripped.
- **oocities.org** — GeoCities pages archived before the 2009 shutdown.
- **oneterabyteofkilobyteage.tumblr.com** — endless auto-generated GeoCities screenshots.
- **GifCities** (Internet Archive) — animated GIF search, filterable by size.
- **wiby.me** — still-live old-style sites; has a "Surprise Me" button.
- **Neocities** tags `2000s`, `retro`, `webcore`, `88x31` — see what is current and what has become cliché.
- 88×31 button archives: A.N. Lucas's collection, neonaut's archive, sadgrl.online's button maker.

Sites worth pulling up in Wayback for the default subgenre: PlanetQuake, PlanetHalfLife, PlanetDeusEx, Massassi Temple, Blue's News, Voodoo Extreme, Shacknews, Adrenaline Vault, Daily Radar, Team Xbox, Zophar's Domain, Home of the Underdogs, The Mushroom Kingdom, RPGamer, Starmen.net, Something Awful, Old Man Murray, 3D Realms, Newgrounds, FilePlanet.

## Final checklist

Before shipping, confirm:

- [ ] Fixed-width shell with tiled background visible on both sides
- [ ] Body text at 10–11px Verdana or Tahoma
- [ ] Visible 1px borders; boxes inside boxes; no soft edges anywhere
- [ ] Everything important above the fold
- [ ] One committed era and subgenre, stated to the user
- [ ] At least five pieces of period furniture (newswire, poll, counter, affiliates, badges…)
- [ ] Original graphics, not downloaded stock GIFs
- [ ] No border-radius, no box-shadow blur, no modern icons, no hero section
- [ ] Gimmicks actually function
- [ ] Loads instantly; no autoplaying audio; reduced-motion respected
- [ ] Real content, densely written — zero placeholder text
