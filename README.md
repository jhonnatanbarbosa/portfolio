# www.jhorro.com

The source of www.jhorro.com: the Jhorro Productions studio pages at `/` and
Jhonnatan Barbosa's portfolio at `/jhonnatan/`. It is a plain static site with
no build step. `site/` is the web root, and everything else stays private.
`CLAUDE.md` describes how the site is put together.

## With Claude Code

The repo ships Claude Code skills for the procedures below. Ask in plain
words or type the command:

| Command | What it does |
|---|---|
| `/publish` | checks the site, commits, pushes and follows the deploy |
| `/rollback` | undoes a change or goes back to an earlier version, then redeploys |
| `/deploy-status` | says whether the last change is live, explains a failed run, redeploys |
| `/demo-progress` | updates the Dead Saints Parade percentage, to-do list or dates on every page |

`/publish` and `/rollback` ask before they push.

## Publishing a change

Every push to `main` goes live on its own, usually within a minute.

```bash
python tools/check_site.py      # check links, translations and the demo percentage
python tools/preview.py         # look at it on http://localhost:8000
git add -A
git commit -m "what changed"
git push
```

The push starts the **Deploy** workflow (the repo's Actions tab). It:

1. runs `tools/check_site.py`. If that fails, nothing is deployed.
2. updates the server to the pushed commit.
3. checks that the main pages answer and that `/.git` stays hidden.

A green tick means the change is live. A red cross means it stopped at the
step shown in the log. GitHub also emails you when a run fails.

## Checking a deploy

```bash
gh run list -w Deploy -L 5      # the last five deploys and their result
gh run watch                    # follow the one running now (pick it from the list)
gh run view --log-failed        # pick a failed run and see why it failed
```

Or open the Actions tab on GitHub and click the run.

## When a deploy fails

- **The "check" job failed.** The site checker found a problem: a broken
  link, a missing translation key or a demo percentage that disagrees. The
  site is unchanged. Fix it, commit and push again.
- **The "Deploy" step failed with "Connection timed out".** The server could
  not be reached, even after the step's three tries. The site is unchanged.
  Re-run the failed job from the run's page (**Re-run failed jobs**). If it
  fails again, tell the server admin.
- **The "Deploy" step failed otherwise.** The server refused the key or did
  not match the pinned host key. The site is unchanged. This needs the server
  admin.
- **"Confirm the live site answers" failed.** The new version is live but a
  page is not answering, or `/.git` is reachable. Look at the site, then fix
  or roll back (below).

## Deploying again without a change

Actions tab, **Deploy**, **Run workflow**. Or:

```bash
gh workflow run Deploy
```

## Rolling back

A rollback is a new commit that undoes the old ones. Push it and it deploys
like any other change. Find the commit hashes with `git log --oneline` or on
GitHub's commits page.

Undo one commit:

```bash
git revert --no-edit <hash>
git push
```

Put the site back to how it was at an earlier commit (undoes everything after
it, in one commit):

```bash
git revert --no-commit <good-hash>..HEAD
git commit -m "Roll back to <good-hash>"
git push
```

Undo a merged pull request: open the PR on GitHub and press **Revert**. That
opens a new PR, and merging it deploys the rollback.

Do not use `git reset --hard` with `git push --force` on `main`. It erases the
history of what happened and breaks everyone else's copy of the repo. A revert
does the same job and keeps the record.

## Working on a branch

Pushing any branch other than `main` deploys nothing. To publish the work,
open a pull request into `main` and merge it, or merge locally and push.

## Changing the routing

Redirects, headers and error pages live in `deploy/Caddyfile`, but the
server's real config is separate and shared with other sites, so the Deploy
workflow does not change it. Commit the change to `deploy/Caddyfile` and ask
the server admin to apply it. Never copy that file over the server's.

## Things that must keep working

Some addresses are held by other parties: `/privacy-policy` (Google Play),
`/google1551b97329f3afc5.html` (Search Console) and the CV PDFs under
`/jhonnatan/docs/`. Do not rename or remove them. `CLAUDE.md` has the details.
