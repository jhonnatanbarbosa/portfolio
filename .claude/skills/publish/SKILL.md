---
name: publish
description: Put the current changes live on www.jhorro.com. Use when asked to publish, deploy, ship, push or "put it live", or after finishing an edit the user wants online. Checks the site, commits, pushes to main and follows the Deploy run to the end.
---

# Publish a change

A push to `main` deploys on its own (`.github/workflows/deploy.yml`). Every
push is a production edit, so the user confirms before anything is pushed.

1. **Look at what changed.** Run `git status` and `git diff --stat`. If there
   is nothing to commit and nothing unpushed (`git log origin/main..HEAD`),
   say so and stop. If you are not on `main`, ask whether to merge the branch
   into `main` or open a pull request instead (`gh pr create`). A pushed
   branch deploys nothing.

2. **Check the site.** Run `python tools/check_site.py`. Fix any problem it
   reports before going on. "pending, not uploaded yet" lines are not
   problems. If a page's visible copy changed, follow the rules in CLAUDE.md
   (studio voice, the four-edit rule for translations, the humanizer pass).

3. **Show the user** the list of changed files and a one-line summary of each,
   and the commit message you plan to use. Ask to go ahead. Stage files by
   name, never `git add -A` blindly: nothing outside the intended change goes
   in, and `.claude/settings.local.json` never does.

4. **Commit and push.**
   ```bash
   git pull --rebase origin main
   git commit -m "<message>"
   git push origin main
   ```
   Keep the repo's message style: a capitalised verb such as ADDED, MODIFIED
   or FIX, then what changed.

5. **Follow the deploy.**
   ```bash
   gh run list -w Deploy -L 1 --json databaseId,headSha,status
   gh run watch <id> --exit-status
   ```
   Make sure the run's `headSha` is the commit you pushed. If it passes, say
   the change is live and give the run's URL. If it fails, use the
   `deploy-status` skill to find out why.

6. If `deploy/Caddyfile` was part of the change, tell the user that the
   routing does not go live with the push: the server admin has to apply it
   by hand (see "Changing the routing" in README.md).
