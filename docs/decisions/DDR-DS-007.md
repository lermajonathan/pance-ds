# DDR-DS-007: Components read semantic and component tokens only

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** Design (Jonathan Lerma)

## Decision

Components use semantic utilities and component tokens. Hex values, raw sizes and one-off radii are not allowed in component source.

## Consequences

`pnpm lint:tokens` fails CI when a component hard-codes a value. A new visual need becomes a token first.
