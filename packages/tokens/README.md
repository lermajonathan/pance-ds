# @pance/tokens

Design tokens for **[Pance](https://pance-ds.jonathanlerma.com)**: 943 tokens in three tiers (primitives → semantic → components), in the W3C DTCG format, with light and dark values. Every text and control pair is checked against WCAG 2.2 AA.

```bash
npm install @pance/tokens
```

| Import | What you get |
|---|---|
| `@pance/tokens/tokens.css` | Every token as a CSS custom property, e.g. `var(--pance-color-intent-primary-solid)`. Dark values under `[data-theme="dark"]` |
| `@pance/tokens/theme.css` | Tailwind v4 `@theme` mapping (`bg-primary-solid`, `text-ink-muted`, `p-4` = `space.2`…). Import after `tokens.css` |
| `@pance/tokens` | Typed, fully resolved JS object for charts, canvas and tests: `tokens.color.intent.primary.solid` |
| `@pance/tokens/tokens.json` | Flat resolved map for Figma plugins and other platforms |
| `@pance/tokens/json/*.json` | The DTCG source files (`primitives.json`, `semantic.json`, `components.json`) for Tokens Studio or Style Dictionary |

```css
@import "tailwindcss";
@import "@pance/tokens/tokens.css";
@import "@pance/tokens/theme.css";
```

```ts
import { tokens } from '@pance/tokens'
chart.color = tokens.color.intent.primary.solid
```

MIT © Jonathan Lerma
