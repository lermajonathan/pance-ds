# DDR-DS-012: One generated documentation page per component

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** Design (Jonathan Lerma)

## Decision

Each component has a page in `docs/components/`. Props, types and defaults are generated from the TypeScript source. Guidance (when to use, accessibility, content) is written by hand. Examples are type-checked.

## Consequences

CI fails if a page is stale, a component has no guidance, or an example no longer compiles. Docs are in English.
