# cica-apply-web — Release & Deployment Guide

> **Status: DRAFT for team review.** Part 1 (Mechanics) is factual, derived from
> `.github/workflows/pipeline.yml` and `q-dev-utilities/deployment-scripts`. Part 2
> (Recommended workflow) and Part 3 (Open questions) contain **proposals**, not
> settled policy — they're here so the team can confirm or correct them. Nothing
> here changes how the pipeline works; it documents what already exists.

---

## Part 1 — How deployment actually works (factual)

### Trigger model
Deployments are triggered by **force-pushing a specific branch**, done via the helper
scripts in `q-dev-utilities/deployment-scripts` (run from the directory *above* the
`cica-web` checkout):

```bash
bash cw-dev.sh  <branch>    # deploys <branch>; defaults to master if omitted
bash cw-uat.sh  <branch>
bash cw-stag.sh <branch>
```

Each script resets the corresponding deploy branch to your chosen branch and
force-pushes it, which kicks off the pipeline. The scripts deploy **whatever branch
you name** — they do **not** require the code to be on `master` first.

### Branch → environment mapping (from `pipeline.yml`)

| Deploy branch | Environments it runs | Can reach prod? |
|---|---|---|
| `cw-deploy` | **dev → prod** (prod chained after dev) | **Yes** |
| `cw-deploy-to-uat` | uat only | No |
| `cw-deploy-to-staging` | staging only | No |

- `deploy-prod` has `needs: [publish, deploy-dev]` and is gated on `cw-deploy` — i.e.
  **prod is promoted from the same run that deployed dev**, using the same image.
- `deploy-dev` and `deploy-prod` run against GitHub **Environments** (`environment: dev` /
  `environment: prod`). Approval gates / required reviewers are configured there, in the
  repo's Environment settings — that's what makes each stage pause for a manual click.

### What the pipeline does on a deploy-branch push
```
ci  +  security   (always)
      → container
          → publish        (push image to ECR; only on the 3 deploy branches)
              → deploy-dev   (cw-deploy only; GitHub Environment "dev" gate)
                  → deploy-prod (cw-deploy only; GitHub Environment "prod" gate)
```
On a normal PR branch (e.g. a feature branch), `publish` and all `deploy-*` jobs are
**skipped** by design — only `ci`, `security`, `container` run. (This is why those jobs
show "Skipped" on a PR; it is not a failure.)

### Image identity
The image is tagged by **commit SHA**, not by a release tag or by `master`. Whatever
commit you deploy is the exact artifact that runs — so prod should be promoted from the
**same commit** you validated in dev, not a later/different one.

### Reusable workflows
All jobs call the shared `ministryofjustice/cica-devsecops-workflows` reusable workflows,
currently pinned at **`@v1.0.10`**.

---

## Part 2 — Recommended end-to-end workflow (proposal)

```
1. Branch from main/master
2. Make changes, open a PR
3. PR runs CI (ci + security + container); get it green + reviewed
4. Deploy the PR branch to a test environment:
   - Smoke test with no prod risk → cw-uat.sh <branch> or cw-stag.sh <branch>
     (UAT/STAG cannot reach prod)
   - If you need dev specifically → cw-dev.sh <branch>, then approve the DEV gate ONLY
5. Validate in the test environment
6. Promote to prod from the SAME tested commit:
   - On the cw-deploy run, approve the prod gate
7. Merge the PR to main/master (squash)
8. Tag the release on main/master and note what shipped
```

### Why this ordering (deploy/promote → then merge → then tag)
The image is **SHA-pinned**, and the deploy is driven by the **branch you push**, not by
`main`. So:
- Testing on dev then promoting prod **from the same run** guarantees prod runs the exact
  commit you validated.
- If you merged to `main` *first* and then deployed, you'd ship the **squash-merge commit**
  — a *different* SHA you never tested in dev. That reintroduces the risk the dev test was
  meant to remove.
- Therefore: **deploy & promote from the feature branch, then merge, then tag.** The merge
  and tag are the record-keeping that follows a validated deploy.

**Trade-off to be aware of:** between promoting prod and merging, `main` briefly lags
what's in prod. Keep the merge in the same session so `main` and the tag catch up promptly.

### Safer choice for "just test my branch"
If the goal is only to confirm a branch runs in a deployed environment, prefer **UAT or
STAG** — per the scripts README they *cannot* promote to prod, so there's no adjacent prod
gate to approve by mistake. Use **dev** only when you specifically intend to promote from
there.

---

## Part 3 — Open questions for the team (please confirm)

These are genuinely ambiguous today and aren't written down anywhere — flagging them so we
can agree a convention rather than leave it to habit:

1. **Deploy-then-merge vs merge-then-deploy.** Part 2 recommends deploy/promote first
   (SHA-pinning rationale above). Is that the agreed convention?
2. **Squash vs merge commit** on the PR into main/master.
3. **Release tag timing & format** — tag on `main` after merge? What version scheme?
4. **The `cw-*.sh` filename vs blast radius.** `cw-dev.sh` deploys **dev *and* prod**
   (its own echo says "DEV, and PROD!"), gated only by the prod approval. Worth a rename
   or a clearer warning so "dev" isn't mistaken for dev-only?
5. **Force-push to shared deploy branches.** The scripts `git reset --hard` + force-push
   `cw-deploy` etc. Two people deploying near-simultaneously can clobber each other — do we
   need any coordination/lock convention?

---

## Appendix — Future options (not for now)
Captured from recent experience; **additive ideas, not criticism of the current setup**
(which is based on a long-standing, working DevOps pattern):
- A `workflow_dispatch`-triggered deploy (environment dropdown + ref input + native GitHub
  Environments) would remove the force-push-a-branch ritual and make "deploy ref X to env Y"
  explicit and auditable. (Pattern already used by `cica-review-case-documents`.)
- Exit-code-aware Snyk gating (distinguish "vulnerabilities found" from "Snyk API error")
  and a retry/backoff on Snyk steps would stop transient Snyk outages from hard-failing
  pipelines — a real pain during the Oct 2026 Node.js security-release load.
- A committed repo-level release guide (this doc) so the process isn't only in scripts +
  tribal knowledge.
