# DDR-DS-029: Agent access through llms.txt, a read-only MCP server and a skill

- **Status:** Proposed
- **Date:** 2026-11-02
- **Owner:** Design (Jonathan Lerma)

## Context

People now build interfaces with coding agents. Without a source they can trust, an agent guesses component names, invents props and writes raw colours instead of tokens. Pance already generates its component pages and token tables from the source (DDR-DS-002, DDR-DS-012), so the facts an agent needs exist and stay current. They are only published as human pages. Pance stays MIT with no paid tier, licence keys or seats, and every change is approved by Design.

## Decision

1. **`llms.txt` and `llms-full.txt`.** `scripts/build-docs.mjs` generates both from the same sources as the component pages: the TypeScript props, the guidance in `scripts/docs/` and the token files. `llms.txt` is the short index with links; `llms-full.txt` holds every component and token group in plain text. Both are served from the site root. `docs:check` fails when either is stale.
2. **`@pance/mcp`, a read-only MCP server.** A new package, run with `npx @pance/mcp` over stdio. It reads a JSON snapshot generated at build time and bundled in the package, so it needs no network, no key and no telemetry, and it writes no files. Tools: `list_components`, `get_component` (props, guidance, source path), `search_tokens`, `get_token`, `list_decisions` and `get_decision`.
3. **An agent skill.** `skills/pance/SKILL.md` holds the usage rules an agent must follow: import from `@pance/react`, use semantic tokens and never raw colours (DDR-DS-007), wrap controls in `Field`, give status an icon and a label, cap scatter charts at two series, and check the deprecation policy before using a deprecated API. It points to the MCP server and to `llms.txt` for facts instead of copying them. It ships in the repo and inside `@pance/mcp`.
4. **Versions move together.** `@pance/mcp` shares the version of `@pance/react` and `@pance/tokens`, so the snapshot always matches the library an agent is describing.
5. **No code installation.** The server describes and never installs. There is no command that copies component source into a project.

## Tests (written first)

- `tests/llms.mjs`: every exported component and every token group appears in `llms-full.txt`; every link in `llms.txt` points to a generated page.
- `tests/mcp.mjs`: starts the server over stdio, then checks `tools/list`, that `list_components` equals `extractComponents()`, that an unknown component returns an error and not a guess, and that a run leaves the working directory unchanged.
- `tests/skill.mjs`: every component and token named in `SKILL.md` exists.

## Consequences

Ships in 1.6.0 as a minor release; nothing in the existing API changes. It adds one package and one dependency, the MCP SDK, to `@pance/mcp` only, so `@pance/react` stays free of it. The first publish of `@pance/mcp` needs trusted publishing configured for the new package on npm (DDR-DS-009). The skill and the generated text must be kept in step with the library, which `docs:check` and the three tests enforce. Not covered here: agent interface blocks (Composer, Agent Progress and similar), which are a different project, and a Pro tier.
