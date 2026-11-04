# Security Policy

## Supported Versions

Security updates are applied only to the most recent releases.

## Reporting a Vulnerability

To securely report a vulnerability, please [open an advisory on GitHub](https://github.com/CriminalInjuriesCompensationAuthority/cica-apply-web/security/advisories/new).

## Vulnerability Process

1. Your report will be acknowledged within two business days.
2. The team will investigate and update the issue with relevant information.
3. If the team does not confirm the report, no further action will be taken and the issue will be closed.
4. If the team confirms the report, the team will take action to fix it immediately:
    1. Commits will be handled in a privately for review and testing.
    2. Release a new patch version.
    3. Disclose details of the vulnerability in the release notes.

## Resolving Security Alerts

Open security alerts (GitHub Security tab: code scanning, secret scanning, Dependabot) must be resolved within these timescales, measured from detection:

| Alert type | Requirement |
| --- | --- |
| Secret scanning | No open alerts, regardless of age or validity |
| Dependabot — Critical | Resolve within 72 hours |
| Dependabot — High | Resolve within 7 days |
| Code scanning — Critical and High | Resolve within 14 days |

## Snyk Policy File (`.snyk`)

For how to review, justify, and set expiry dates on Snyk ignores in the `.snyk` file, see [docs/snyk-policy.md](docs/snyk-policy.md).
