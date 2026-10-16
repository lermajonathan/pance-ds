# DDR-DS-004: Breakpoint `sm` stays at 640px

- **Status:** Accepted
- **Date:** 2026-10-14
- **Owner:** Design (Jonathan Lerma)

## Decision

Tokens record the behaviour that ships: Tailwind's `sm` at 640px. The 480px value in the old docs is not adopted.

## Consequences

Layouts do not change. Adopting 480px later means adding `--breakpoint-sm: 480px` and re-checking every layout, so it needs its own record.
