# Pipeline Review Notes — `CAPP-124-move-to-github`

Review of `pipeline.yml` on the `CAPP-124-move-to-github` branch.
These are issues to address before merging, ordered by risk.

---

## 1. `cancel-in-progress: true` will cancel in-flight deployments

**Risk: HIGH — can leave a Kubernetes namespace partially deployed**

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

The deploy steps (`kubectl set image` → `kubectl apply` → `kubectl apply -k` → `kubectl rollout restart`) are not atomic. If someone pushes to `cw-deploy` while a deployment is running, the in-progress run is cancelled mid-way. This can leave the namespace with mismatched manifests — e.g., the Deployment updated but the Ingress still pointing at the old config.

**Fix:** Either set `cancel-in-progress: false`, or use separate concurrency groups for the build and deploy phases:

```yaml
# On the build/scan jobs:
concurrency:
  group: build-${{ github.ref }}
  cancel-in-progress: true

# On the deploy jobs (no cancel):
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false
```

---

## 2. Shell injection in snyk-auth composite action

**Risk: MEDIUM — exploitable if `vars.SNYK_API_URL` is tampered with**

In `.github/actions/snyk-auth/action.yml`, the `api-url` input is interpolated directly into the shell:

```yaml
--url "${{ inputs.api-url }}/oauth2/token" \
```

If `vars.SNYK_API_URL` were set to a crafted value (e.g. by a compromised admin or a supply chain attack on org-level variables), it could execute arbitrary shell commands.

**Fix:** Assign inputs to environment variables and reference them with `$`:

```yaml
- id: auth
  shell: bash
  env:
    SNYK_API_URL: ${{ inputs.api-url }}
    SNYK_CLIENT_ID: ${{ inputs.client-id }}
    SNYK_CLIENT_SECRET: ${{ inputs.client-secret }}
  run: |
    set -euo pipefail
    if [ -z "$SNYK_CLIENT_ID" ]; then
      echo "::error::client-id input is empty"
      exit 1
    fi
    if [ -z "$SNYK_CLIENT_SECRET" ]; then
      echo "::error::client-secret input is empty"
      exit 1
    fi
    RESPONSE=$(curl --fail --silent --show-error \
      --request POST \
      --url "$SNYK_API_URL/oauth2/token" \
      --header "Content-Type: application/x-www-form-urlencoded" \
      --data-urlencode "grant_type=client_credentials" \
      --data-urlencode "client_id=$SNYK_CLIENT_ID" \
      --data-urlencode "client_secret=$SNYK_CLIENT_SECRET")
    ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
    if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
      echo "::error::Failed to retrieve Snyk OAuth access token"
      exit 1
    fi
    echo "::add-mask::$ACCESS_TOKEN"
    echo "token=$ACCESS_TOKEN" >> "$GITHUB_OUTPUT"
```

---

## 3. Kubernetes namespaces are hardcoded in deploy jobs

**Risk: LOW — maintenance burden, fragile to namespace changes**

Each deploy job hardcodes the namespace:

```yaml
kubectl --namespace=claim-criminal-injuries-compensation-dev get pods
```

```yaml
kubectl config set-context ... --namespace=claim-criminal-injuries-compensation-dev
```

This is repeated for each environment. If a namespace ever changes, the workflow file needs updating instead of just the secret.

**Fix:** Use `${{ secrets.KUBE_NAMESPACE }}` (environment-scoped secret) consistently, as done in the `cica-review-case-documents` reference repo:

```yaml
- name: Authenticate with cluster
  env:
    KUBE_CERT: ${{ secrets.KUBE_CERT }}
    KUBE_CLUSTER: ${{ secrets.KUBE_CLUSTER }}
    KUBE_NAMESPACE: ${{ secrets.KUBE_NAMESPACE }}
    KUBE_TOKEN: ${{ secrets.KUBE_TOKEN }}
  run: |
    echo "$KUBE_CERT" | base64 -d > ./ca.crt
    kubectl config set-cluster $KUBE_CLUSTER --certificate-authority=./ca.crt --server=https://$KUBE_CLUSTER
    kubectl config set-credentials deploy-user --token=$KUBE_TOKEN
    kubectl config set-context $KUBE_CLUSTER --cluster=$KUBE_CLUSTER --user=deploy-user --namespace=$KUBE_NAMESPACE
    kubectl config use-context $KUBE_CLUSTER
    kubectl -n $KUBE_NAMESPACE get pods

- name: Deploy to cluster
  env:
    ECR_REGISTRY: ${{ secrets.ECR_REGISTRY_URL }}
    ECR_REPOSITORY: ${{ vars.ECR_REPOSITORY }}
    KUBE_NAMESPACE: ${{ secrets.KUBE_NAMESPACE }}
  run: |
    kubectl set image -f kube_deploy/Dev/deploy.yml webapp=$ECR_REGISTRY/$ECR_REPOSITORY:${{ github.sha }} --local -o yaml \
      | kubectl apply -n $KUBE_NAMESPACE -f -
    kubectl apply -f kube_deploy/Dev/service.yml -f kube_deploy/Dev/ingress.yml
    kubectl apply -k kube_deploy/Dev
    kubectl rollout restart deployment/custom-errors -n $KUBE_NAMESPACE
    kubectl rollout status deployment/custom-errors -n $KUBE_NAMESPACE
```

This also moves secret values out of `${{ }}` expressions and into env vars, avoiding the same class of injection risk as issue #2.

---

## 4. Smoke test port mapping doesn't match the Dockerfile

**Risk: LOW — test passes silently even when container can't serve traffic**

The smoke test maps `3001:3001`:

```yaml
docker run -d -p 3001:3001 --restart=always --name cica-repo-dev cica/cica-repo-dev:latest
```

But the Dockerfile exposes port 3000, and the app starts on port 3000 (`node ./bin/www` defaults to 3000). The test "passes" because `docker ps` only checks the container exists, not that it's healthy.

**Fix:** Map the correct port and add a health check:

```yaml
- name: Smoke test container
  run: |
    docker run -d -p 3001:3000 --restart=always --name cica-repo-dev cica/cica-repo-dev:latest
    sleep 5
    # Verify container is running AND serving traffic
    docker ps | grep cica-repo-dev
    curl --fail --silent --max-time 10 http://localhost:3001/ || echo "::warning::Container is running but not responding on port 3001"
    docker stop cica-repo-dev
```

---

## 5. `SNYK_CLIENT_ID` exposed to all jobs unnecessarily

**Risk: LOW — widens surface for accidental logging**

`SNYK_CLIENT_ID` is set at the workflow-level `env` block:

```yaml
env:
  NODE_VERSION: '24.18.1'
  SNYK_VERSION: '1.1306.3'
  SNYK_CLIENT_ID: ${{ secrets.SNYK_CLIENT_ID }}
```

This makes it available to every job including `validate-action-pinning`, `secret-scan`, `test`, and `lint` which don't need it. While the client ID alone isn't a full credential, keeping it scoped reduces the blast radius if a step accidentally logs environment variables.

**Fix:** Remove from workflow-level `env` and set it only on the jobs that use Snyk:

```yaml
env:
  NODE_VERSION: '24.18.1'
  SNYK_VERSION: '1.1306.3'
  # SNYK_CLIENT_ID moved to individual Snyk jobs
```

---

## What we're adding alongside pipeline.yml

These files complement `pipeline.yml` without overlapping:

| File | Purpose | Why pipeline.yml doesn't cover this |
|---|---|---|
| `tests.yml` | PR-only checks: lint, test, gitleaks | pipeline.yml runs on push; this gives fast PR feedback with secret scanning |
| `sca.yml` | devsecops-actions/sca + npm audit with retry | Org-standard SCA tooling (Renovate-based), not in pipeline.yml |
| `codeql-analysis.yml` | GitHub-native SAST (CodeQL) | Not present in pipeline.yml at all |
| `dependabot.yml` | github-actions + docker + npm ecosystems | Branch version only covers npm; actions will drift without this |
| `CODEOWNERS` | PR review routing | Not present |
