# Design Decision Records (DDR-DS)

Owned by Design (Jonathan Lerma). The DDR-DS series records decisions about the Pance Design System: tokens, Figma variables, the build, release and deprecation policy, and how the Figma file is organised.

- **Repo (master text):** this folder.
- **Figma (register):** the `DDR-DS` page has one card per record.
- Records are append-only. A reversed decision gets a new record that supersedes the old one. Cite a record as "per DDR-DS-012".

## Writing a record

1. Copy the last file, increment the number and set the status to `Proposed`.
2. Write the decision in one short paragraph and the consequences in another. Say what changes and what it costs.
3. When it is agreed, set the status to `Accepted` and add the card to the Figma page.
4. To reverse a decision, write a new record, set the old one to `Superseded by DDR-DS-0XX` and leave its text alone.

## Register

| ID | Title | Date | Status |
|---|---|---|---|
| [DDR-DS-001](DDR-DS-001.md) | Three-tier token architecture | 2026-10-14 | Accepted |
| [DDR-DS-002](DDR-DS-002.md) | The repo JSON is the source of truth | 2026-10-14 | Accepted |
| [DDR-DS-003](DDR-DS-003.md) | Brand colour is Aqua | 2026-10-14 | Accepted |
| [DDR-DS-004](DDR-DS-004.md) | Breakpoint `sm` stays at 640px | 2026-10-14 | Accepted |
| [DDR-DS-005](DDR-DS-005.md) | Heading 3 is 20px | 2026-10-14 | Accepted |
| [DDR-DS-006](DDR-DS-006.md) | Contrast fixes change four tokens and the warning button | 2026-10-14 | Accepted |
| [DDR-DS-007](DDR-DS-007.md) | Components read semantic and component tokens only | 2026-10-15 | Accepted |
| [DDR-DS-008](DDR-DS-008.md) | Dark mode is a semantic layer | 2026-10-15 | Accepted |
| [DDR-DS-009](DDR-DS-009.md) | Publish to npm with trusted publishing | 2026-10-15 | Accepted |
| [DDR-DS-010](DDR-DS-010.md) | Built-in strings are props, with no i18n or router dependency | 2026-10-15 | Accepted |
| [DDR-DS-011](DDR-DS-011.md) | One mature release instead of many small ones | 2026-10-15 | Accepted |
| [DDR-DS-012](DDR-DS-012.md) | One generated documentation page per component | 2026-10-15 | Accepted |
| [DDR-DS-013](DDR-DS-013.md) | Deprecation takes two minor releases and 90 days | 2026-10-15 | Accepted |
| [DDR-DS-014](DDR-DS-014.md) | Visual regression without committed screenshots | 2026-10-15 | Accepted |
| [DDR-DS-015](DDR-DS-015.md) | The Figma Code Connect map is kept by hand | 2026-10-15 | Accepted |
| [DDR-DS-016](DDR-DS-016.md) | One Figma page per component | 2026-10-16 | Accepted |
| [DDR-DS-017](DDR-DS-017.md) | Decisions are recorded as DDR-DS | 2026-10-16 | Accepted |
| [DDR-DS-018](DDR-DS-018.md) | Button can show a leading and a trailing icon | 2026-10-16 | Proposed |
