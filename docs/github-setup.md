# GitHub repository setup

Settings that live in GitHub, not in files. Do them once so the rules in [GOVERNANCE.md](../GOVERNANCE.md) are enforced by the platform.

## 1. Branch protection (Settings → Rules → Rulesets → New branch ruleset)

- Target: default branch (`main`).
- Require a pull request before merging; require **1 approval** and **review from Code Owners** (`.github/CODEOWNERS`).
- Require status checks to pass: the CI job(s) from `ci.yml`.
- Block force pushes and deletions.
- Bypass list: you only, so you can still push small docs changes. Prefer PRs for everything else.

## 2. Who can do what (Settings → Collaborators and teams)

- Keep access to **Read** for everyone; do not add write collaborators unless you decide to.
- Settings → Actions → General → "Require approval for all outside collaborators" so forks cannot run workflows unreviewed.
- Release workflow: protect tag creation (ruleset on `v*` tags, bypass only you) so only you can publish to npm.

## 3. Features (Settings → General)

- Turn on **Discussions**; create categories Q&A, Ideas and Show and tell.
- Turn on **private vulnerability reporting** (Settings → Code security).
- Turn on Dependabot alerts and security updates.
- Issues: keep on. Wikis and Projects: off.

## 4. Labels

Create: `proposal`, `bug`, `needs-triage`, `needs-info`, `approved`, `later`, `declined`, `good first issue`, `help wanted`, `a11y`, `docs`.

## 5. Profile and discoverability

- Description: `Open-source, token-driven design system for data-dense products. React 19, Tailwind v4, W3C tokens, WCAG 2.2 AA. Figma library included.`
- Website: https://pance-ds.jonathanlerma.com
- Topics: `design-system`, `design-tokens`, `react`, `tailwindcss`, `typescript`, `accessibility`, `wcag`, `figma`, `ui-components`, `component-library`
- Social preview (Settings → General): upload the Cover exported at 1280 × 640.
- Pin the repository on your profile and add the Figma Community link to the README once published.
