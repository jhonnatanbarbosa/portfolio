---
name: demo-progress
description: Update Dead Saints Parade's development status on the site, the demo percentage, the to-do and done lists, or the demo and release dates. Use when asked to change the demo progress, mark a task done, add a task, or move the demo or release date.
---

# Update the demo progress

The same facts are repeated across the studio pages and the portfolio. Change
every copy, then let `tools/check_site.py` confirm the percentage agrees.

## The percentage

Replace the old number everywhere it appears as demo progress (find them with
`grep -rn '<old>%' site/*.html site/jhonnatan/index.html` and
`grep -rn 'aria-valuenow="<old>"' site`):

- **Each of the four studio pages** (`index.html`, `dead-saints-parade.html`,
  `privacy-policy.html`, `404.html`): the Demo progress box in the right rail.
  Each bar carries the number three times: `<b>N%</b>`, `aria-valuenow="N"`
  and the fill's `style="width:N%"`.
- **`site/dead-saints-parade.html`**: the bar in the Development status panel
  (`#dsp-status`), same three spots.
- **`site/index.html`**: the home card's lead paragraph ("the demo is N%
  complete").
- **`site/jhonnatan/index.html`**: the portfolio's Currently Working On board,
  `<span class="pct">N%</span>` and `style="width:N%;"` on
  `.wip-progress-fill`.

Change only demo-progress numbers. Other percentages (analytics, tuning
values) are unrelated.

## The to-do and done lists

- **Studio:** `#dsp-status` on `site/dead-saints-parade.html`. To-do items are
  `<li class="board-item">` under "To do (N)". Done items are
  `<li class="chip">` under "Done (N)". Move an item between the lists and
  update both counts in the labels. The item being worked on now has
  `is-active`.
- **Portfolio:** the same board in `site/jhonnatan/index.html` is translated.
  To-do items are `<div class="wip-milestone">` under "On the Board" with keys
  `wip_t*`. Done items are `<span class="wip-chip">` with keys `wip_d*`, and
  their count is `<span class="ws-count">N</span>`. Every text there is four
  edits: the markup plus `en`, `pt` and `ja` in `i18n-data.js`. A new item
  needs a new key in all three languages. Keep the portfolio's own wording,
  which is more technical than the studio list's.
- The comment above the portfolio board mentions the number of finished
  systems ("the 22 finished systems"). Update it with the done count.
- If the status changed in a way worth saying (a milestone reached), also
  update the home card's lead paragraph, in studio voice (see CLAUDE.md), and
  run the humanizer pass on the new copy.

## The dates

The demo and release dates appear on all four studio pages:

- the Demo progress box (`Demo` and `Release` rows), on all four;
- the card's status line ("Demo Feb 2027 | Release Q2 2027") and facts table
  ("Demo February 2027, full release Q2 2027") on `index.html` and
  `dead-saints-parade.html`.

The portfolio repeats them in its Currently Working On section: the intro
paragraph (`wip_bridge`, "full release in Q2 2027") and the Target line
(`wip_target`), each in the markup and in `en`, `pt` and `ja`. `wip_badge`
carries the year in all three. The translations write the dates their own
way (`Fev 2027`, `2º Tri 2027`, `2027年2月`, `2027年第2四半期`), so search each
language separately.

Find every English copy with `grep -rn '<old date>' site`.

## Finish

1. `python tools/check_site.py` must report 0 problems. A "demo percentage
   differs" line names the file still holding the old number.
2. `python tools/preview.py` and look at `/`, `/dead-saints-parade` and
   `/jhonnatan/`.
3. Publish with the `publish` skill.
