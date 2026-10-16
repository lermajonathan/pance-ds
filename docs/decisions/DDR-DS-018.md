# DDR-DS-018: Button can show a leading and a trailing icon

- **Status:** Proposed
- **Date:** 2026-10-16
- **Owner:** Design (Jonathan Lerma)

## Decision

`Button` gains `TrailingIcon` next to `Icon`, so one button can show both (for example "Download" with a chevron). Existing `Icon` and `iconPos` keep working.

## Consequences

Additive change for 1.4.0. Figma gets `show leading icon` and `show trailing icon` on the 480 Button variants. Becomes Accepted when it ships.
