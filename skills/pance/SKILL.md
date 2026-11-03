---
name: pance
description: Use when building or changing React UI with the Pance design system (@pance/react, @pance/tokens): choosing components, props, tokens, forms, charts or dark mode. Look facts up in the Pance MCP server or llms-full.txt instead of guessing names.
---

# Pance

Pance is an accessible React design system (WCAG 2.2 AA, light and dark mode). Components are in `@pance/react` and design tokens in `@pance/tokens`.

## Work in this order

1. **Look it up, do not guess.** With the Pance MCP server (`npx -y @pance/mcp`): call `list_components`, then `get_component` for the exact props, accessibility notes and a working example. Without it, read https://pance-ds.jonathanlerma.com/llms-full.txt.
2. **Use an existing component** before building one. If `list_components` has nothing that fits, compose from tokens and say so.
3. **Find tokens** with `search_tokens` and `get_token`. Read semantic and component tokens; primitives are raw values.
4. **Check the reason** behind a rule with `list_decisions` and `get_decision` before working around it.

## Rules

- Import from `@pance/react`. Never copy component source into a project.
- Load the styles once: `import '@pance/react/styles.css'`, or with Tailwind v4 `@import "@pance/react/tailwind.css"`.
- Wrap the app in `PanceProvider` to translate built-in strings, and in `ThemeProvider` for dark mode. Inline `themeInitScript` in `<head>` to avoid a flash.
- Colours and sizes come from tokens: the utilities `bg-primary-solid`, `text-ink-muted` and `border-line`, or the CSS variables `--pance-*`. No hex values and no palette steps in product code.
- Severity says what a thing means (primary, secondary, success, info, warning, help, danger, contrast); variant says how loud it is; size is sm, md or lg. Pick severity by meaning, never for its colour.
- Wrap every form control in `Field` so it has a visible label, hint and error.
- Status always carries an icon and a label, never colour alone (`Badge`, `Alert`).
- Ask before a destructive action with `ConfirmDialog`. Use `Modal` for other dialogs, and `Toast` inside `ToastStack` for short messages.
- `DataTable` needs `caption`, `columns`, `rows`, `rowKey` and `rowLabel`.
- Charts: a series that means good or bad uses the status tokens (`color.dataviz.status.*`); any other series uses the categorical palette; never both in one chart. A scatter chart takes at most two series. Label the baseline of a diverging chart.
- Motion stops under `prefers-reduced-motion`.
- Deprecated APIs stay for two minor releases and 90 days. Do not use `color.viz.status.*`; use `color.dataviz.status.*`.

## Do not

- Do not invent components, props or tokens. If `get_component` or `get_token` does not return it, it does not exist.
- Do not override a component with raw values. If a token is missing, say so instead of hard-coding one.
- Do not add a dependency for something Pance already provides.
