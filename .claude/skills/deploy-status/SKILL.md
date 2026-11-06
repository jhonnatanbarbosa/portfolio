---
name: deploy-status
description: Check whether the latest change on www.jhorro.com is live, explain why a deploy failed, or redeploy without a new commit. Use when asked "is it live?", "did the deploy work?", about a red/failed GitHub Actions run, or to redeploy or re-run the deploy.
---

# Deploy status

1. **What is live.** Compare the newest `main` commit with the last Deploy
   run:
   ```bash
   git fetch origin && git log -1 --oneline origin/main
   gh run list -w Deploy -L 5
   ```
   The change is live when the newest run for that commit shows `success`.
   A run still `in_progress` or `queued` can be followed with
   `gh run watch <id> --exit-status`.

2. **A failed run.** Read only the failing step:
   ```bash
   gh run view <id> --log-failed
   ```
   Then tell the user which case it is:

   - **`check` job failed.** `tools/check_site.py` found a problem. The site
     did not change. Run the checker locally, fix what it reports, then
     publish again (`publish` skill).
   - **`Deploy` step failed with `Connection timed out`** after three
     "could not reach the server" warnings. The site did not change. The
     step already retries one-off network drops, so re-run the failed job
     once (`gh run rerun <id> --failed`). If it times out again, the server
     admin should check the VPS and Hostinger's firewall.
   - **`Deploy` step failed otherwise** (`Permission denied`, `Host key
     verification failed`). The site did not change. The server or its key
     needs the server admin: the secrets are `DEPLOY_SSH_KEY` and
     `DEPLOY_KNOWN_HOSTS`. Do not create, replace or print keys or secrets.
     Do not touch the server.
   - **`Confirm the live site answers` failed.** The new version is live but
     a page did not answer 200, or `/.git/config` did not answer 404. Open the
     failing address on https://www.jhorro.com to see what is wrong. If a page
     is broken by the change, offer the `rollback` skill. If `/.git` is
     reachable, tell the user straight away that the server admin must fix
     it: that exposes the server's checkout.

3. **Redeploy without a change**, for example after the server admin fixed
   something:
   ```bash
   gh workflow run Deploy
   ```
   Or re-run a failed run with `gh run rerun <id>`. Then follow it as in
   step 1.
