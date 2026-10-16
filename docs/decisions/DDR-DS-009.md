# DDR-DS-009: Publish to npm with trusted publishing

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** Design (Jonathan Lerma)

## Decision

`@pance/react` and `@pance/tokens` are published from GitHub Actions with OIDC trusted publishing and provenance. No long-lived npm token is stored.

## Consequences

A release is a tag equal to the package versions. Both packages move together.
