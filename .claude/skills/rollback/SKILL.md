---
name: rollback
description: Undo something that is live on www.jhorro.com. Use when asked to roll back, revert, undo a change or a deploy, or put the site back to how it was at an earlier commit or date. Reverts with new commits and redeploys; never rewrites main.
---

# Roll back

A rollback is a new commit that undoes old ones, pushed like any other
change. Never `git reset --hard` plus `git push --force` on `main`: it erases
the record and breaks other clones.

1. **Find the target.** `git fetch origin` then
   `git log --oneline -15 origin/main`. Work out with the user which of these
   they mean:
   - **one commit** to undo, or
   - **a good commit** to return to, undoing everything after it.

   If they describe it ("before the Steam link change", "yesterday"), match
   it against the log and the dates (`git log --since`) and confirm the hash
   with them. For a merged pull request, the commit to undo is the merge
   commit (`Merge pull request #N ...`).

2. **Show what will change** before doing anything:
   - one commit: `git show --stat <hash>`
   - back to a good commit: `git diff --stat <good-hash> origin/main`

   Tell the user which pages this puts back, and ask to go ahead.

3. **Make the revert** on an up-to-date `main` (`git checkout main`,
   `git pull --rebase origin main`):
   - one commit: `git revert --no-edit <hash>`
   - a merge commit: `git revert --no-edit -m 1 <hash>`
   - back to a good commit, as one commit:
     ```bash
     git revert --no-commit <good-hash>..HEAD
     git commit -m "Roll back to <good-hash>: <why>"
     ```
     If that range holds merge commits and `git revert` refuses, use this
     instead, which gives the same result:
     ```bash
     git restore --source=<good-hash> --staged --worktree -- :/
     git commit -m "Roll back to <good-hash>: <why>"
     ```
     It also deletes files that were added after the good commit.

   If the revert stops on a conflict, show the user the conflicting files and
   resolve them with them. Do not guess at their content.

4. **Check and push.** `python tools/check_site.py`, then
   `git push origin main`.

5. **Follow the deploy** as in the `publish` skill (`gh run watch`), and
   confirm the rolled-back pages look right on https://www.jhorro.com.

A rollback of `deploy/Caddyfile` only changes the file in the repo. The live
routing has to be put back by the server admin.
