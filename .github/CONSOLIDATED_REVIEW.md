# Consolidated Review — `CAPP-124-move-to-github`

Review of `pipeline.yml` migration from CircleCI to GitHub Actions.
Findings from Neil McGonigle (operational/governance focus) and Adrian Roworth (implementation/pattern comparison against `cica-review-case-documents`).

---

## Pre-production fixes

These should be addressed before the pipeline is used for production deployments.

### 1. Remove `SNYK_CLIENT_ID` from the top-level `env` block (security hygiene)

**Found by: Neil, Adrian**

`SNYK_CLIENT_ID` is set at the workflow-level `env` block, which hoists it into the environment of every job and every step — including user-controlled steps (checkout, npm scripts, etc). While the client ID alone isn't as sensitive as the client secret, it's still a credential half that shouldn't be globally available.

Scope it to the individual jobs that call the snyk-auth composite action, matching how `SNYK_CLIENT_SECRET` is already handled.

### 2. Fix `cancel-in-progress: true` on deploy branches

**Found by: Neil, Adrian**

The deploy steps (`kubectl set image` → `kubectl apply` → `kubectl apply -k` → `kubectl rollout restart`) are not atomic. A push during an active deployment cancels the in-flight run, potentially leaving a Kubernetes namespace with partially-applied manifests.

Either set `cancel-in-progress: false`, or use separate concurrency groups for the build and deploy phases so that build cancellation is safe but deploy cancellation is blocked.

### 3. Fix shell injection in the snyk-auth composite action

**Found by: Adrian**

In `.github/actions/snyk-auth/action.yml`, the `api-url`, `client-id`, and `client-secret` inputs are interpolated directly into the shell via `${{ inputs.* }}`. If `vars.SNYK_API_URL` were set to a crafted value, it could execute arbitrary shell commands.

Fix: assign all inputs to environment variables in the `env` block and reference them with `$` in the script body.

### 4. Confirm GitHub Environment protection rules are configured

**Found by: Neil** (confirmed done)

All four environments (dev, uat, staging, prod) need required reviewers configured as protection rules. These replace CircleCI's approval jobs. Neil confirmed this is already in place.

---

## Recommended improvements

These aren't blockers but improve correctness, maintainability, and security posture.

### 5. Fix the smoke test port mapping

**Found by: Adrian**

The smoke test maps `3001:3001` but the Dockerfile exposes port 3000 and the app listens on 3000. The test passes silently because `docker ps` only confirms the container exists, not that it's serving traffic.

Fix: change to `3001:3000` and add a `curl --fail` health check to verify the container is actually responding.

### 6. Replace hardcoded Kubernetes namespaces with `${{ secrets.KUBE_NAMESPACE }}`

**Found by: Adrian**

Every deploy job hardcodes the namespace string (e.g. `claim-criminal-injuries-compensation-dev`). Use an environment-scoped secret instead. This reduces maintenance burden, avoids namespace drift across the workflow, and moves secret values out of `${{ }}` expressions (same class of injection risk as issue 3).

### 7. Improve the container smoke test with an actual HTTP health check

**Found by: Neil, Adrian**

Beyond the port mapping fix, the smoke test should verify the app is responding to HTTP requests, not just that the Docker container process is running. A `curl --fail` against the mapped port after a short sleep would catch startup failures that `docker ps` misses.

### 8. Consider extending the action pinning validator to cover `.github/actions/` too

**Found by: Neil**

The `validate-action-pinning` job scans `.github/workflows/` for unpinned actions. The composite action in `.github/actions/snyk-auth/` isn't covered by this check. If composite actions ever reference other actions, they'd bypass the pinning enforcement.

### 9. Update `dependabot.yml` to cover `github-actions` and `docker` ecosystems

**Found by: Adrian**

The current `dependabot.yml` on the branch only covers npm. With 10+ SHA-pinned actions in the workflow files, the `github-actions` ecosystem entry is needed to keep those pins current. The `docker` ecosystem entry keeps the Dockerfile base image tracked too.

### 10. Add complementary CI workflows

**Found by: Adrian**

`pipeline.yml` covers the build/scan/deploy lifecycle but doesn't include:
- **CodeQL** (GitHub-native SAST) — runs on push to main, PRs, and daily schedule
- **SCA via `ministryofjustice/devsecops-actions/sca`** — org-standard tooling (Renovate-based) with npm audit retry logic
- **PR-only checks** — fast feedback with gitleaks secret scanning, lint, and tests without waiting for the full pipeline

Draft workflow files (`tests.yml`, `sca.yml`, `codeql-analysis.yml`) have been prepared and can be added alongside `pipeline.yml` without overlap.

### 11. Add CODEOWNERS

**Found by: Adrian**

No CODEOWNERS file exists. Adding one routes PR reviews to the correct team automatically and is referenced in the cutover checklist under "Required checks and CODEOWNERS active".

---

## Post-merge / Phase 1 close-out

### 12. Plan for `.circleci/config.yml` removal

**Found by: Neil, Adrian**

Once GHA is validated in all environments, the CircleCI config should be removed. Neil noted this is likely already in the plan.

### 13. Validate deliberate failure scenarios

**Found by: Neil (cutover checklist)**

Before signing off Phase 1, intentionally trigger failures to confirm the gates hold:
- A failing test should block the pipeline
- A Snyk SCA finding above threshold should block
- A container scan finding above threshold should block
- A build failure should prevent ECR push

### 14. Review AWS permissions for least privilege

**Found by: Neil (cutover checklist)**

The OIDC role assumed for ECR access should be reviewed to confirm it only grants the permissions needed (ecr:GetAuthorizationToken, ecr:BatchGetImage, ecr:PutImage, etc.) and is scoped to the correct repositories.

### 15. Verify immutable artefact promotion

**Found by: Neil (cutover checklist)**

Confirm that the same Docker image (tagged by SHA) built and scanned in the `build` phase is the exact image deployed to each environment — no rebuild between environments.

---

## Summary

| # | Finding | Found by | Priority |
|---|---------|----------|----------|
| 1 | SNYK_CLIENT_ID scoping | Neil, Adrian | Pre-prod |
| 2 | cancel-in-progress on deploy branches | Neil, Adrian | Pre-prod |
| 3 | Shell injection in snyk-auth | Adrian | Pre-prod |
| 4 | Environment protection rules | Neil | Done |
| 5 | Smoke test port mapping | Adrian | Improvement |
| 6 | Hardcoded Kubernetes namespaces | Adrian | Improvement |
| 7 | HTTP health check in smoke test | Neil, Adrian | Improvement |
| 8 | Action pinning for .github/actions/ | Neil | Improvement |
| 9 | dependabot.yml coverage | Adrian | Improvement |
| 10 | Complementary CI workflows | Adrian | Improvement |
| 11 | CODEOWNERS | Adrian | Improvement |
| 12 | CircleCI config removal | Neil, Adrian | Post-merge |
| 13 | Deliberate failure validation | Neil | Post-merge |
| 14 | AWS least privilege review | Neil | Post-merge |
| 15 | Immutable artefact promotion check | Neil | Post-merge |
