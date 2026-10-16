# DDR-DS-001: Three-tier token architecture

- **Status:** Accepted
- **Date:** 2026-10-14
- **Owner:** Design (Jonathan Lerma)

## Decision

Tokens live in three tiers: primitives (raw scales), semantic (meaning, with a dark override) and component (what each component reads). Dark mode is a thin override on the semantic tier, never a duplicated set.

## Consequences

Figma has three collections (Primitives, Semantic with Light and Dark modes, Components). Every token name is unique across tiers. References point one way only: component to semantic to primitives.
