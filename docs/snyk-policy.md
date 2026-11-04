# Handling the Snyk policy file (`.snyk`)

This document describes how we add, justify, review, and expire ignore entries
in the repository's `.snyk` file. It complements [SECURITY.md](../SECURITY.md),
which defines the resolution timescales for GitHub security alerts.

## What the `.snyk` file is (and is not)

The `.snyk` file is **Snyk's** ignore policy. An ignore entry suppresses a
finding **in Snyk** until its `expires` date.

It is a separate system from **GitHub's** Security tab (code scanning, secret
scanning, Dependabot). A Snyk ignore does **not** dismiss, suppress, or pause
any GitHub alert, and it does **not** stop the GitHub resolution SLA clock.

> **Key rule:** a Snyk `expires` date is a *review cadence* for a risk
> acceptance. It is **not** grace time against the GitHub SLA. If the same
> vulnerability is an open GitHub Dependabot/code-scanning alert, the SLA in
> [SECURITY.md](../SECURITY.md) still applies regardless of the `.snyk` entry.

## When an ignore is appropriate

Prefer fixing over ignoring. Only add an ignore when **all** of these hold:

- There is no available fix (no patched release), or the only fix is a larger,
  deliberately-scheduled migration (not a point fix); **and**
- The vulnerability has been assessed and is either not reachable in this
  application, or the residual risk is understood and accepted; **and**
- The acceptance has a clear re-check trigger.

Do **not** use a Snyk ignore for a secret-scanning finding. Exposed credentials
have zero tolerance (see [SECURITY.md](../SECURITY.md)) — rotate the secret and
purge it from history; do not suppress it.

## Required content of an ignore entry

Each ignore's `reason` must record enough for a reviewer to re-validate it
without re-doing the original investigation. Include:

1. **What** the vulnerable component is and **how** it is introduced (direct
   dependency, transitive, base-OS package, etc.).
2. **Root cause / nature** of the vulnerability in one or two lines.
3. **Reachability / impact assessment** — why it is or is not exploitable in
   this app (e.g. "no call site enables the affected code path").
4. **Why it is not being fixed now** — no patched release, or fix requires a
   separate migration (name it).
5. **Re-check trigger** — the concrete condition that would change the
   decision (e.g. "recheck on base-image bump", "when the ESM migration lands").
6. **Re-verified `YYYY-MM-DD`** stamp each time the entry is reviewed, with a
   one-line note confirming the premise still holds.

## Choosing the `expires` date

Set `expires` to the next point at which the premise could realistically
change — bounded by how often we can review. Guidance:

- Default to a **short review cadence (about 30 days)**. This keeps accepted
  risks actively managed and visible, consistent with our SLA posture.
- Base-OS / upstream-fix-pending items: ~30 days is usually right — an upstream
  fix can appear in any point release.
- Reachability-based ignores (accepted because a code path is not exercised):
  keep the cadence short, because a code change can silently make the finding
  reachable again. Re-confirm reachability at each review.
- **Avoid long expiries (6–12 months).** They read as "set and forget", which
  is the posture this process exists to prevent.

Do not pick an `expires` to "buy time" against a GitHub SLA — the two are
unrelated (see the key rule above).

## Reviewing on (or before) expiry

When an entry is at or near `expires`, do not reflexively bump the date.
Instead:

1. **Re-validate the premise** — is there now a fix? Is it still unreachable?
   Is the blocking migration still outstanding?
2. **Remove** the ignore if the premise no longer holds (fix exists, or it is
   now reachable) and resolve the finding properly.
3. **Only if the premise still holds**, bump `expires` to the next review
   horizon and add a `Re-verified YYYY-MM-DD` note to the `reason`.
4. **Cross-check GitHub** — confirm whether the same vulnerability is an open
   Dependabot/code-scanning alert. If so, resolve it within the SLA; the Snyk
   ignore does not cover it.

## Example entry

```yaml
ignore:
  SNYK-EXAMPLE-12345:
    - '*':
        reason: >
          <component>, introduced via <path>. <root cause>. <reachability
          assessment>. No fix available without <migration>; tracked
          separately, not a point fix. Recheck on <trigger>.
          Re-verified 2026-11-03: premise holds.
        expires: '2026-12-03T00:00:00.000Z'
```
