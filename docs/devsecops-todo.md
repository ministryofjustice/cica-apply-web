# CICA deploy, snyk follow-ups 

1. **Pipeline resilience (devsecops):** retry/backoff on Snyk steps in
   `reusable-security.yml` / `reusable-container.yml` + the SBOM step (runs under `bash -e`,
   no retry). Retry only transient (5xx/network); keep "vulns found" (exit 1) a hard fail.
   Ship as `v1.0.11`.
2. **Self-ref guard (devsecops):** CI job that fails a `v*` tag build if `snyk-auth`
   self-refs don't match the tag (drafted + de-bugged; stripped from the v1.0.10 PR to keep
   it tight). Fold into the `v1.0.11` PR.
3. **Deeper self-ref fix:** derive the ref from `github.job_workflow_sha` to remove the
   version-duplication entirely (verify against the action-pinning check first).
4. **DCS audit CVEs:** Express 5 / multer / proxy-addr upgrades + full test run — returning
   dev. Resolve suppress-vs-upgrade.
5. **web + notify-gateway `.snyk` reconciliation:** base-image-pinned ignores vs 24.22.1.
6. **CircleCI retirement (proper):** disconnect the project in the CircleCI UI first, THEN
   remove the config (deleting config alone → "no configuration found" red check).
7. **Deploy-workflow modernisation (staged):** bring the `workflow_dispatch` + GitHub
   Environments model (as in `cica-review-case-documents/.github/workflows/deploy.yml`) and
   exit-code-aware Snyk gating into the shared reusable deploy workflow — in stages, additive,
   per-repo. The current reusable workflows inherit a ~7-year-old deploy pattern; this is the
   modernisation direction. See `docs/RELEASE.md` appendix.

## Exploitability triage detail (cica-web) — engineering opinion, needs security sign-off
- **Brotli RCE (CVE-2026-111497, HIGH):** likely **not reachable** — no compression deps, no
  inbound decompression code. _Confirm nothing upstream (ingress/proxy) decompresses Brotli._
- **TLS hostname bypass (CVE-2026-105483 / -106069 / -106072):** applies to server-side
  `got@11` calls to backends; needs MITM → defence-in-depth. No `rejectUnauthorized:false` found.
- **Keep-alive desync (CVE-2026-105481, MEDIUM):** situational, proxy-dependent.
- **randomUUID snapshot / permission-model / dns.resolve:** likely **not applicable**
  (normal containerised node process; no SEA; no `--permission`).
- `proxy-addr`/`qs`/`multer` are **separate npm-dependency CVEs** (the DCS audit-gate issue),
  not part of the Node advisory.

## People / process note
Improvements here are being staged deliberately and framed as **additive** (document what
exists, propose options for the team to confirm) rather than replacing a long-standing,
working DevOps setup. `docs/RELEASE.md` Part 3 lists the open questions for the team to agree.
