# Automated Snyk Remediation, Expiration Pruning & Dependabot Sync

This guide provides end-to-end automation patterns for managing Snyk failures, temporary ignores, expiration pruning, and synchronizing `.snyk` policy files with Dependabot PRs.

---

## Architecture Overview

```
                      +-------------------+
                      |   CI / Cron Run   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      | snyk test --json  |
                      +---------+---------+
                                |
                +---------------+---------------+
                |                               |
       (No Vulnerabilities)           (Vulnerabilities Found)
                |                               |
                v                               v
             [Pass]                    [Run Package Updates]
                                                |
                                                v
                                   [Filter Unfixable Vulns]
                                                |
                                                v
                                    [Append to .snyk with]
                                    [     --expiry       ]
                                                |
                                                v
                                    [Open Fix/Ignore PR]
```

### The Snyk Policy File (`.snyk`)

Under the hood, `.snyk` is standard YAML:

```yaml
version: v1.25.0
ignore:
  'SNYK-JS-LODASH-567746':
    - '*':
        reason: 'No fix available; auto-ignored by CI pipeline for 30 days.'
        expires: 2026-11-20T12:00:00.000Z
```

Because Snyk lacks a native `snyk unignore` CLI command, policy maintenance relies on inspecting the JSON results of `snyk test --ignore-policy --json` and pruning YAML entries programmatically.

---

## 1. Initial Failure Interception & Auto-Ignore Workflow

This pipeline:
1. Runs `snyk test --json`.
2. Intercepts failures.
3. Attempts native dependency updates (e.g., `npm update`, `pip-compile`, `poetry update`).
4. Extracts vulnerabilities where `isUpgradable == false` and `isPatchable == false`.
5. Adds temporary 30-day exemptions using `snyk ignore`.
6. Opens an automated remediation pull request.

Create `.github/workflows/snyk-auto-remediation.yml`:

```yaml
name: Snyk Auto-Remediation

on:
  pull_request:
  schedule:
    - cron: '0 4 * * 1' # Weekly on Monday at 04:00 UTC
  workflow_dispatch:

jobs:
  security-remediation:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Snyk & JQ
        run: |
          npm install -g snyk
          sudo apt-get install -y jq

      - name: Run Initial Snyk Test
        id: snyk_scan
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: |
          # Snyk returns exit code 1 when vulnerabilities are present
          snyk test --json > snyk_results.json || echo "vulnerabilities_found=true" >> "$GITHUB_OUTPUT"

      - name: Automated Fix & Ignore
        if: steps.snyk_scan.outputs.vulnerabilities_found == 'true'
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: |
          echo "Attempting automated package updates..."
          npm update || true

          # Extract IDs that cannot be upgraded or patched
          jq -r '.vulnerabilities[]? | select(.isUpgradable == false and .isPatchable == false) | .id' snyk_results.json | sort -u > unfixable_ids.txt

          echo "Found unfixable IDs:"
          cat unfixable_ids.txt

          # Set 30-day expiry to prevent permanent blind spots
          EXPIRY_DATE=$(date -d "+30 days" --iso-8601=seconds 2>/dev/null || date -v+30d -u +"%Y-%m-%dT%H:%M:%SZ")

          while IFS= read -r vuln_id; do
            if [ -n "$vuln_id" ]; then
              echo "Ignoring unfixable vulnerability: $vuln_id"
              snyk ignore --id="$vuln_id" --expiry="$EXPIRY_DATE" --reason="No fix available; auto-ignored by CI pipeline for 30 days." || true
            fi
          done < unfixable_ids.txt

      - name: Verify Clean State
        if: steps.snyk_scan.outputs.vulnerabilities_found == 'true'
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: |
          snyk test

      - name: Create Remediation Pull Request
        if: steps.snyk_scan.outputs.vulnerabilities_found == 'true'
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "chore(security): apply snyk auto-updates and temporary ignores"
          title: "Automated Security Remediation: Dependency Updates & Snyk Ignores"
          body: |
            This PR was automatically generated by CI after finding unhandled security issues.
            
            - **Dependency Updates:** Attempted automated upgrades for fixable dependencies.
            - **Unfixable CVEs:** Added 30-day temporary ignores in `.snyk` for packages without an upstream fix.
          branch: snyk-auto-remediation
          base: main
          delete-branch: true
```

---

## 2. Automated Expiry Pruning & Upstream Fix Adoption

When a package maintainer eventually releases a fix, or when an ignore period lapses, the policy must be cleared and packages bumped.

### Python Pruning Script (`scripts/prune_snyk.py`)

Save this file in `scripts/prune_snyk.py`:

```python
#!/usr/bin/env python3
import json
import sys
from datetime import datetime, timezone
import yaml

SNYK_FILE = ".snyk"
RESULTS_FILE = "snyk_results.json"

def clean_snyk(output_env_path=None):
    try:
        with open(SNYK_FILE, "r") as f:
            policy = yaml.safe_load(f) or {}
    except FileNotFoundError:
        print("No .snyk file found.")
        return False

    ignores = policy.get("ignore", {})
    if not ignores:
        print("No ignores found in .snyk.")
        return False

    now = datetime.now(timezone.utc)
    modified = False

    # 1. Prune expired entries
    for vuln_id in list(ignores.keys()):
        rules = ignores[vuln_id]
        active_rules = []
        for rule in rules:
            for path, details in rule.items():
                expires_str = details.get("expires")
                if expires_str:
                    try:
                        exp_dt = datetime.fromisoformat(expires_str.replace("Z", "+00:00"))
                        if exp_dt <= now:
                            print(f"[EXPIRED] Removing rule for {vuln_id} (expired on {expires_str})")
                            modified = True
                            continue
                    except ValueError:
                        pass
                active_rules.append(rule)

        if not active_rules:
            del ignores[vuln_id]
            modified = True
        else:
            ignores[vuln_id] = active_rules

    # 2. Prune entries if an upstream fix/upgrade path has become available
    try:
        with open(RESULTS_FILE, "r") as f:
            data = json.load(f)
            vulns = []
            if isinstance(data, dict):
                vulns = data.get("vulnerabilities", [])
            elif isinstance(data, list):
                for item in data:
                    vulns.extend(item.get("vulnerabilities", []))

            for v in vulns:
                vid = v.get("id")
                if vid in ignores and (v.get("isUpgradable") or v.get("isPatchable")):
                    print(f"[FIX AVAILABLE] Removing {vid} from ignore list as an upstream fix is available.")
                    del ignores[vid]
                    modified = True
    except FileNotFoundError:
        print(f"{RESULTS_FILE} not found; skipping upstream fix checks.")

    if modified:
        policy["ignore"] = ignores
        with open(SNYK_FILE, "w") as f:
            yaml.dump(policy, f, default_flow_style=False, sort_keys=False)
        print("Updated .snyk successfully.")
    else:
        print("No updates required for .snyk.")

    if output_env_path:
        with open(output_env_path, "a") as gh_env:
            gh_env.write(f"snyk_modified={'true' if modified else 'false'}\n")

    return modified

if __name__ == "__main__":
    env_file = sys.argv[1] if len(sys.argv) > 1 else None
    clean_snyk(env_file)
```

### GitHub Actions Maintenance Workflow (`.github/workflows/snyk-policy-maintenance.yml`)

```yaml
name: Snyk Policy Maintenance

on:
  schedule:
    - cron: '0 3 * * *' # Daily at 03:00 UTC
  workflow_dispatch:

jobs:
  prune-and-update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install PyYAML & Snyk
        run: |
          pip install pyyaml
          npm install -g snyk

      - name: Run Snyk Test (Bypassing Current Policy)
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: |
          # --ignore-policy ensures Snyk reports all vulnerabilities regardless of .snyk rules
          snyk test --ignore-policy --json > snyk_results.json || true

      - name: Prune Expired & Upgradable Ignores
        id: prune
        run: |
          python scripts/prune_snyk.py "$GITHUB_OUTPUT"

      - name: Apply Package Updates
        if: steps.prune.outputs.snyk_modified == 'true'
        run: |
          npm update || true

      - name: Open Fix Pull Request
        if: steps.prune.outputs.snyk_modified == 'true'
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "chore(security): prune expired ignores and pull new security patches"
          title: "Security: Clean Up .snyk Ignores & Update Dependencies"
          body: |
            Automated maintenance check:
            - Pruned expired entries from `.snyk`.
            - Removed ignored vulnerabilities that now provide an upgrade or patch path.
            - Updated package manifests and lockfiles.
          branch: snyk-policy-maintenance
          base: main
          delete-branch: true
```

---

## 3. Auto-Remove Ignores on Dependabot Pull Requests

When Dependabot updates a package, the old CVE is resolved. This workflow triggers on Dependabot PRs, checks if any ignored vulnerability is no longer present in the dependency tree, removes it from `.snyk`, and commits directly back to the Dependabot branch.

Create `.github/workflows/dependabot-snyk-clean.yml`:

```yaml
name: Clean .snyk on Dependabot PR

on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  clean-dependabot-snyk:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout PR Branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Python & Snyk
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Tooling
        run: |
          pip install pyyaml
          npm install -g snyk

      - name: Scan PR State with Snyk
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: |
          snyk test --ignore-policy --json > pr_snyk_results.json || true

      - name: Remove Resolved Vulnerabilities from .snyk
        run: |
          python3 - << 'EOF'
          import json, yaml

          try:
              with open(".snyk", "r") as f:
                  policy = yaml.safe_load(f) or {}
          except FileNotFoundError:
              exit(0)

          ignores = policy.get("ignore", {})
          if not ignores:
              exit(0)

          try:
              with open("pr_snyk_results.json", "r") as f:
                  data = json.load(f)
          except FileNotFoundError:
              exit(0)

          vulns = []
          if isinstance(data, dict):
              vulns = data.get("vulnerabilities", [])
          elif isinstance(data, list):
              for item in data:
                  vulns.extend(item.get("vulnerabilities", []))

          current_vuln_ids = {v.get("id") for v in vulns}

          modified = False
          for vuln_id in list(ignores.keys()):
              # If the vulnerability ID is no longer present in the scan,
              # Dependabot has fixed it: prune it from .snyk
              if vuln_id not in current_vuln_ids:
                  print(f"Dependabot resolved {vuln_id}. Pruning from .snyk.")
                  del ignores[vuln_id]
                  modified = True

          if modified:
              policy["ignore"] = ignores
              with open(".snyk", "w") as f:
                  yaml.dump(policy, f, default_flow_style=False, sort_keys=False)
              print(".snyk updated successfully.")
          EOF

      - name: Commit Changes to Dependabot Branch
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .snyk
          if ! git diff --staged --quiet; then
            git commit -m "chore(security): remove resolved vulnerabilities from .snyk policy"
            git push
          else
            echo "No stale .snyk rules found."
          fi
```

---

## Production Recommendations

1. **Always Enforce `--expiry`:** Automated CLI ignores should always specify `--expiry`. Permanent ignores without expiration dates lead to unmonitored security debt.
2. **Always Use `--ignore-policy` When Checking for Fixes:** By default, `snyk test` hides ignored vulnerabilities from the JSON output. Supplying `--ignore-policy` exposes the full list so your scripts can inspect `.isUpgradable` and `.isPatchable` on ignored findings.
3. **Isolate Remediation Workflows:** Run full auto-ignore and remediation scripts in scheduled maintenance workflows or dedicated PRs rather than inline developer feature PRs.