# Kiro summary of recommended actions (from review)

Review of `pipeline.yml` on `CAPP-124-move-to-github`, compared against the `cica-review-case-documents` reference repo patterns.

---

- **Fix `cancel-in-progress: true` on deploy branches** — a push during an active deployment cancels the in-flight `kubectl` steps, which aren't atomic. This can leave a namespace with partially-applied manifests. Either set `cancel-in-progress: false` or use separate concurrency groups for build vs deploy phases.

- **Fix shell injection in the snyk-auth composite action** — `api-url` input is interpolated directly into the shell via `${{ inputs.api-url }}`. Assign all inputs to environment variables and reference them with `$` instead.

- **Remove `SNYK_CLIENT_ID` from the top-level `env` block** — it's available to every job including `validate-action-pinning`, `secret-scan`, `test`, and `lint` which don't need it. Scope it to the jobs that actually call the snyk-auth action, matching how `SNYK_CLIENT_SECRET` is already handled.

- **Replace hardcoded Kubernetes namespaces with `${{ secrets.KUBE_NAMESPACE }}`** — every deploy job has the namespace string baked in (e.g. `claim-criminal-injuries-compensation-dev`). Use an environment-scoped secret instead, which also moves secret values out of `${{ }}` expressions.

- **Fix the smoke test port mapping** — maps `3001:3001` but the Dockerfile exposes 3000 and the app listens on 3000. Should be `3001:3000`, and ideally add a `curl --fail` health check since `docker ps` only confirms the container exists, not that it's serving traffic.

- **Add complementary CI workflows** — `tests.yml` (PR-only: gitleaks + lint + test), `sca.yml` (org-standard devsecops-actions/sca + npm audit with retry), `codeql-analysis.yml` (GitHub-native SAST). None of these overlap with `pipeline.yml`.

- **Update `dependabot.yml` to cover `github-actions` and `docker` ecosystems** — without this, the 10+ SHA-pinned actions will drift silently.

- **Plan for `.circleci/config.yml` removal** once GHA is validated in all environments.

---

The first two items (cancel-in-progress and shell injection) should be addressed before production. The rest are improvements that can be addressed in follow-up commits.
