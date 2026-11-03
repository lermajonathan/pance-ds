# @pance/mcp

A read-only [MCP](https://modelcontextprotocol.io) server for **[Pance](https://pance-ds.jonathanlerma.com)**, so a coding agent can look up the real components, props, tokens and design decisions instead of guessing them.

- **Read-only.** It reads a snapshot bundled in the package. No network, no API key, no telemetry, and it never writes a file.
- **Always matches the library.** `@pance/mcp` has the same version as `@pance/react` and `@pance/tokens`; the snapshot is generated from the same source as the docs.
- **MIT.** No paid tier, no licence keys.

## Use

Add it to any MCP client as a stdio server:

```json
{
  "mcpServers": {
    "pance": { "command": "npx", "args": ["-y", "@pance/mcp"] }
  }
}
```

Requires Node 22.

## Tools

| Tool | What it returns |
|---|---|
| `list_components` | Every component with its category and a one-line summary. Optional `category` filter. |
| `get_component` | One component: import line, source file, props (types and defaults generated from the TypeScript source), when to use it and when not, accessibility behaviour, related components and a working example. |
| `search_tokens` | Tokens whose name or description contain your words. Optional `tier` and `limit`. |
| `get_token` | One token by path or CSS variable: tier, type, resolved value, alias and dark-mode value. |
| `list_decisions` | The DDR-DS design decision register. |
| `get_decision` | The full text of one decision record. |

An unknown component or token returns an error with the closest names, never a guess.

Every component and token group is also in [`llms-full.txt`](https://pance-ds.jonathanlerma.com/llms-full.txt) for agents that read a file instead of calling a tool.
