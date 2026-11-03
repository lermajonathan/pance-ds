# Use Pance with coding agents

Coding agents write better UI when they can look up the real components, props and tokens instead of guessing. Pance gives them three ways to do it. All three are generated from the source, so they match the published version.

| Way | What it is | Use it when |
|---|---|---|
| [`llms.txt`](https://pance-ds.jonathanlerma.com/llms.txt) and [`llms-full.txt`](https://pance-ds.jonathanlerma.com/llms-full.txt) | Plain text at the site root. `llms.txt` is a short index with links; `llms-full.txt` has every component, every token group, the usage rules and the decision register. | Your agent can read a URL or a file |
| [`@pance/mcp`](../packages/mcp/README.md) | A read-only MCP server with six tools: `list_components`, `get_component`, `search_tokens`, `get_token`, `list_decisions`, `get_decision`. | Your agent supports MCP servers |
| [Agent skill](../skills/pance/SKILL.md) | A short file of rules for using Pance. It sends the agent to the sources above for facts. | Your agent reads skills, or you want the rules in its context |

## MCP server

Add it to any MCP client as a stdio server. It needs Node 22. It makes no network calls, uses no key and writes no files.

```json
{
  "mcpServers": {
    "pance": { "command": "npx", "args": ["-y", "@pance/mcp"] }
  }
}
```

An unknown component or token returns an error with the closest names, never a guess.

## Skill

Copy [`skills/pance/`](../skills/pance/SKILL.md) to the folder where your agent reads skills. The same file ships in `@pance/mcp` as `dist/skills/pance/SKILL.md`.

## Why they stay correct

`pnpm docs` regenerates the text files, and CI fails when they are stale. `pnpm test:llms`, `pnpm test:mcp` and `pnpm test:skill` check that every component and token group is covered, that the server answers from the sources and that the skill only names things that exist. See DDR-DS-029.
