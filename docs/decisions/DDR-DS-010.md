# DDR-DS-010: Built-in strings are props, with no i18n or router dependency

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** Design (Jonathan Lerma)

## Decision

Every built-in string is a `PanceLabels` entry with an English default. Links accept a `render` prop instead of importing a router.

## Consequences

The library works in any app. Translating is the consumer's job through `PanceProvider`.
