# DDR-DS-006: Contrast fixes change four tokens and the warning button

- **Status:** Accepted
- **Date:** 2026-10-14
- **Owner:** Design (Jonathan Lerma)

## Decision

Text and control colours that failed WCAG 2.2 AA were darkened at the token level, and the warning solid moved to amber-600. Components were not patched one by one.

## Consequences

Warning buttons and badges are a shade darker than before. A contrast check over every token pair runs in CI for light and dark.
