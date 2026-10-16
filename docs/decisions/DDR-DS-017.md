# DDR-DS-017: Decisions are recorded as DDR-DS

- **Status:** Accepted
- **Date:** 2026-10-16
- **Owner:** Design (Jonathan Lerma)

## Decision

Design decisions about the system are written as short records with an ID, date, status, decision and consequences. They are append-only: a reversed decision gets a new record that supersedes the old one.

## Consequences

The master text is `docs/decisions/` in the repo. Figma shows one card per record. Cite them as "per DDR-DS-012".
