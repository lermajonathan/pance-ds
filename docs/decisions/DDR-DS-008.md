# DDR-DS-008: Dark mode is a semantic layer

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** Design (Jonathan Lerma)

## Decision

Dark values are declared next to each semantic token (`pance.modes`). `ThemeProvider` switches a `data-theme` attribute and follows the system setting.

## Consequences

Every contrast pair must pass in both modes before a release. Component tokens in Figma have a single mode for now, so dark previews use the Semantic collection.
