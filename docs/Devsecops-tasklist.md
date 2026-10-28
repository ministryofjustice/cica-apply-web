# Devsecops tasklist

- Remove circle CI workflows
- Apply the OCTO [Github repository technical standards](https://octo-documentation.justice.gov.uk/docs/standards/github-repository-technical-standard.html#github-repository-technical-standard)
- Migrate to multistage dockerfile builds (reduces attack surface and snyk vulnerabilities to triage)
- Add github-actions, docker, node package-ecosystem to dependabot.yml, potentially store this a template with the devsecops repo.
- Migrate away from deployment scripts to github workflow artifact promotion and release tagging
- Introduce Automated UI Smoke tests
- Review Snyk and vulnerability remediation, can this process be improved/automated, agentic workflows?
- consider monorepos for dependencies where appropriate
- agentic devops, instructions, code review skills? Future enhancements?



## AI builders presentation notes

- deterministic and ai scans
- plug snyk into copilot advanced security
- attack path analysis
- Github repository rulesets
- custom skills
- Github Copilot modernization 