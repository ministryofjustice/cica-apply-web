# CircleCI to GitHub Actions migration for cica-web

This change migrates the cica-web CI/CD pipeline from CircleCI to GitHub Actions. The migration is split across two workflow files: `pipeline.yml` (on the `CAPP-124-move-to-github` branch) handles validation, testing, security scanning, Docker build, ECR push, and Kubernetes deployment; `deploy.yml` (local, untracked) is an alternative implementation that consolidates the same pipeline into a single workflow with a monolithic `build-and-scan` job. Both preserve the existing branch-driven deployment model (`cw-deploy` to dev/prod, `cw-deploy-to-uat`, `cw-deploy-to-staging`). The Snyk authentication model changes from a static `SNYK_TOKEN` in `deploy.yml` to an OAuth client-credentials flow via a custom composite action in `pipeline.yml`. CircleCI approval gates are replaced by GitHub Environment protection rules.

Watch for: the two workflow files are structurally inconsistent and would conflict if both shipped (confirmed); `deploy.yml` has Snyk authentication that will fail at runtime because it uses `SNYK_TOKEN` env var but never invokes the OAuth composite action (confirmed); `pipeline.yml`'s Snyk auth composite action is vulnerable to shell injection via the `api-url` input (confirmed); the `deploy.yml` smoke test maps port 3001:3000 which silently changes the original CircleCI behavior of 3001:3001 (confirmed); `cancel-in-progress: true` on deploy branches will cancel in-flight deployments on new pushes, which may leave environments in a partially-deployed state (confirmed).

**Verdict**: NEEDS_CHANGES

## High-level view

Two competing workflow implementations exist in the workspace. `pipeline.yml` is the committed file on the migration branch, structured as a many-job DAG that mirrors CircleCI's job topology. `deploy.yml` is an untracked local file that collapses build, scan, and push into a single job. Only one should ship. They disagree on Snyk auth strategy, action pin versions, Node version, and Docker image tagging, so merging both would create contradictory pipelines.

The branch-driven deployment model is preserved in both files. CircleCI approval gates become GitHub Environment protection rules, which are functionally equivalent but surface in a different UI (pending deployments panel vs. a CircleCI workflow hold). `deploy.yml` restricts its trigger to deploy branches only, which drops the Docker build and container scan coverage that CircleCI ran on every branch — a regression unless a separate CI workflow handles feature branches.

Snyk authentication diverges between the two files. `pipeline.yml` uses a composite action that exchanges OAuth client credentials for a short-lived token, masking it from logs. `deploy.yml` sets `SNYK_TOKEN` as an env var, relying on the CLI's legacy token detection. These strategies are mutually exclusive: if the team provisions OAuth credentials, `deploy.yml`'s Snyk steps will fail.

Security posture improves in several ways — SHA-pinned actions with an enforcement job, OIDC for AWS instead of static credentials, short-lived Snyk tokens. But the composite action's shell script interpolates the `api-url` input directly into a curl command, creating a shell injection vector. The deploy jobs also write Kubernetes CA certs to disk without cleanup.

The `cancel-in-progress: true` concurrency setting is appropriate for CI branches but dangerous on deploy branches: a push during an active deployment cancels the in-flight deploy, potentially leaving a Kubernetes namespace in an inconsistent state with partially-applied manifests.

<details>
<summary>Issues (8)</summary>

1. **Two conflicting workflow files** — `pipeline.yml` and `deploy.yml` implement the same pipeline with incompatible assumptions (different Snyk auth, different Node versions, different action pins). Ship one, delete the other.
2. **`deploy.yml` Snyk auth will fail at runtime** — Sets `SNYK_TOKEN` env var but doesn't use the OAuth composite action. If the team uses OAuth credentials, every Snyk step in `deploy.yml` will error. Either add the composite action or remove `deploy.yml`.
3. **Shell injection in Snyk auth composite action** — The `api-url` input is interpolated directly into the shell script via `${{ inputs.api-url }}`. A malicious or misconfigured value could execute arbitrary commands. Use an environment variable instead of direct interpolation.
4. **`deploy.yml` smoke test port mismatch** — Maps `3001:3000` instead of the original `3001:3001`. If the container listens on 3001, the smoke test connects to nothing on port 3000 and silently passes because `docker run -d` doesn't wait for health.
5. **`cancel-in-progress` on deploy branches** — Both workflow files cancel in-progress runs on deploy branches. A push during an active deployment cancels the running deploy job, potentially leaving the Kubernetes namespace in a half-applied state. Use `cancel-in-progress: false` for deploy branches.
6. **Node version inconsistency** — `pipeline.yml` uses Node 24.18.1; `deploy.yml` uses 24.15.0. The CircleCI config on the migration branch also uses 24.18.1. `deploy.yml` is stale.
7. **Kubernetes cert file not cleaned up** — Deploy jobs write `ca.crt` to disk and never remove it. Low risk on GitHub-hosted runners (ephemeral), but would leak cluster CA certs between jobs on self-hosted runners.
8. **Missing `dependabot.yml` for GitHub Actions on migration branch** — The committed `dependabot.yml` on the migration branch only covers npm. The local workspace version also covers `github-actions` and `docker` ecosystems. Without the `github-actions` entry, the 10+ SHA-pinned actions will drift.

</details>

<details>
<summary>Details</summary>

## Two workflow files with incompatible assumptions

`pipeline.yml` (committed on `CAPP-124-move-to-github`) defines a multi-job DAG: separate jobs for npm-audit, test, lint, multiple Snyk scan flavors, Docker build, container smoke test, SBOM generation, ECR publish, artifact attestation, and per-environment deploys. `deploy.yml` (untracked) collapses build, scan, and push into a single `build-and-scan` job, then fans out to deploy jobs.

```
Concern                  pipeline.yml              deploy.yml
─────────────────────────────────────────────────────────────────
Snyk auth                OAuth composite action     SNYK_TOKEN env var
Node version             24.18.1                   24.15.0
Snyk CLI version         1.1306.3                  1.1304.0
Docker image tag         cica/cica-repo-dev        $REGISTRY/$REPOSITORY:$SHA
Actions checkout         v4.4.0 (SHA-pinned)       v7.0.1 (SHA-pinned, different)
Trigger scope            on: push (all branches)   on: push (deploy branches only)
Smoke test port          3001:3001                 3001:3000
```

`pipeline.yml` runs on every push to every branch, gating deploy jobs with `if` conditions — matching CircleCI's "run everything, filter with `branches.only`" model. `deploy.yml` only triggers on the three deploy branches, which drops the "scan on every branch" coverage that CircleCI provided.

`pipeline.yml` also introduces several jobs that CircleCI didn't have: `validate-action-pinning`, `secret-scan` (TruffleHog), `snyk-code`, `snyk-iac`, `sbom-generate`, and `artifact-attestation`. The `continue-on-error: true` on the new Snyk flavors is a sensible way to introduce them without blocking the pipeline until findings are triaged.

## Snyk authentication gap in `deploy.yml`

`deploy.yml` sets `SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}` as a job-level env var and calls `snyk test` / `snyk monitor` / `snyk container test` directly. This works only if `SNYK_TOKEN` contains a valid legacy API token.

`pipeline.yml` uses a custom composite action (`.github/actions/snyk-auth`) that exchanges OAuth client credentials (`SNYK_CLIENT_ID` + `SNYK_CLIENT_SECRET`) for a short-lived access token passed as `SNYK_OAUTH_TOKEN`.

These two auth strategies are mutually exclusive. If the team provisions OAuth credentials (which the composite action's existence implies is the plan), the `SNYK_TOKEN` secret either won't exist or won't work, and `deploy.yml`'s Snyk steps will fail. If the team provisions a legacy token, `pipeline.yml`'s OAuth flow won't have the right secrets.

## Shell injection in the Snyk OAuth composite action

In `.github/actions/snyk-auth/action.yml`, inputs are interpolated directly into the shell:

```yaml
--url "${{ inputs.api-url }}/oauth2/token" \
...
--data-urlencode "client_id=${{ inputs.client-id }}" \
--data-urlencode "client_secret=${{ inputs.client-secret }}"
```

The `client-id` and `client-secret` come from secrets controlled by repository admins, so the injection risk is low. But `api-url` has a default and can be overridden via `vars.SNYK_API_URL` — if that variable were set to a crafted value, it would execute arbitrary shell commands.

The fix: assign inputs to environment variables and reference them with `$` instead of `${{ }}`:

```yaml
- id: auth
  shell: bash
  env:
    SNYK_CLIENT_ID: ${{ inputs.client-id }}
    SNYK_CLIENT_SECRET: ${{ inputs.client-secret }}
    SNYK_API_URL: ${{ inputs.api-url }}
  run: |
    set -euo pipefail
    curl ... --url "$SNYK_API_URL/oauth2/token" \
      --data-urlencode "client_id=$SNYK_CLIENT_ID" \
      --data-urlencode "client_secret=$SNYK_CLIENT_SECRET"
```

## Deployment model fidelity

The CircleCI config defines this deployment topology:

```
Every push:
  build-for-test → test + lint + snyk_app_scan
                 → build → publish_latest → push_image (deploy branches only)

cw-deploy:         push_image → [approval] → dev → [approval] → prod
cw-deploy-to-uat:  push_image → [approval] → uat
cw-deploy-to-staging: push_image → [approval] → staging
                   snyk_monitor + snyk_container_monitor (cw-deploy only)
```

`pipeline.yml`'s DAG structure differs in shape (npm-audit is a separate gate, build/scan/push are separate jobs linked by artifact upload) but the behavioral outcome is equivalent. `deploy.yml` restricts triggers to deploy branches, losing the build-and-scan coverage on feature branches.

Both files correctly chain `cw-deploy` through dev-then-prod with `needs: deploy-dev` / `needs: deploy-to-dev`, and let UAT and staging deploy independently after build. The Snyk monitor jobs are gated to `cw-deploy` only, matching CircleCI.

`pipeline.yml` exposes `SNYK_CLIENT_ID` at the workflow-level `env` block, making it available to every job including `validate-action-pinning` and `secret-scan` that don't need it. The client secret is correctly scoped to individual steps — the inconsistency isn't dangerous but widens the surface for accidental logging.

## `cancel-in-progress` on deploy branches

Both files set `cancel-in-progress: true`. For feature branches, this is fine — a new push supersedes the old CI run. For deploy branches, canceling an in-progress run means:

A deployment to dev is in progress → someone pushes a new commit to `cw-deploy` → the in-progress run is canceled mid-deploy → the new run starts from scratch.

The canceled deploy may have applied some Kubernetes manifests but not others. The `kubectl set image` + `kubectl apply` + `kubectl apply -k` + `kubectl rollout restart` sequence is not atomic — cancellation between any of these commands produces a partial deployment.

`pipeline.yml` uses `group: ${{ github.workflow }}-${{ github.ref }}`, meaning deploy jobs share a concurrency group with build jobs. If a push arrives during build, cancellation is safe. If it arrives during deploy, it's destructive. A safer pattern: `cancel-in-progress: false` for deploy-branch runs, or separate concurrency groups for build vs. deploy phases.

## Smoke test port mismatch in `deploy.yml`

CircleCI and `pipeline.yml` both run:

```yaml
docker run -d -p 3001:3001 --restart=always --name cica-repo-dev cica/cica-repo-dev:latest
```

`deploy.yml` maps a different port:

```yaml
docker run -d -p 3001:3000 --restart=always --name cica-web-test $REGISTRY/$REPOSITORY:${{ github.sha }}
```

If the container listens on 3001 (which the CircleCI config and Dockerfile history indicate), the `-p 3001:3000` mapping routes host port 3001 to container port 3000 where nothing is listening. The smoke test still "passes" because `docker run -d` returns immediately and `docker ps | grep cica-web-test` only checks that the container exists, not that it's healthy.

</details>

<details>
<summary>File map</summary>

- `.github/workflows/pipeline.yml` — New: complete CI/CD pipeline (506 lines) with test, lint, multi-flavor Snyk scans, Docker build, ECR push, artifact attestation, SBOM generation, and per-environment Kubernetes deploys. On the `CAPP-124-move-to-github` branch.
- `.github/workflows/deploy.yml` — New (untracked): alternative consolidated pipeline with monolithic build-and-scan job and per-environment deploy jobs. Local file only, not yet committed.
- `.github/actions/snyk-auth/action.yml` — New: composite action that exchanges Snyk OAuth client credentials for a short-lived access token. Used by `pipeline.yml`.
- `.circleci/config.yml` — Modified: Node image version bumped from 24.15.0 to 24.18.1 across all jobs.
- `.github/dependabot.yml` — Unchanged on migration branch. Local workspace version adds `github-actions` and `docker` ecosystems.

Full diff: `git diff master..remotes/origin/CAPP-124-move-to-github`

</details>
