# DDR-DS-002: The repo JSON is the source of truth

- **Status:** Accepted
- **Date:** 2026-10-14
- **Owner:** Design (Jonathan Lerma)

## Decision

Design tokens are authored as W3C DTCG JSON in the repo (`tokens/*.json`). `pnpm tokens` builds CSS, TypeScript and JSON from them, and Figma variables mirror the result.

## Consequences

A change starts in the repo and is synced to Figma, never the other way round. A hand edit to a Figma variable is overwritten on the next sync.
