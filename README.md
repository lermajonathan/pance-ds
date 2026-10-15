# Pance Design System

A production-ready design system built for products where complex data and human impact meet. Pance is inspired by a river: a vibrant aquatic teal for every interactive moment, grounded by a high-contrast slate neutral and a strict 8pt grid.

**Live documentation:** [pance-ds.jonathanlerma.com](https://pance-ds.jonathanlerma.com/en) · English / Español

This repository contains:

| | What | Where |
|---|---|---|
| 🎨 | **Design tokens**: 838 tokens in three tiers (primitives → semantic → components), W3C DTCG format | [`tokens/`](tokens) |
| 🧩 | **React components**: 45 components, built with Tailwind CSS v4 | [`src/components/`](src/components) |
| 🔣 | **Iconography**: 67 semantic aliases over Phosphor Icons | [`src/icons.tsx`](src/icons.tsx) |
| 📖 | **Documentation site**: the bilingual explorer published at the URL above | [`src/site/`](src/site) |
| 📚 | **Reference docs**: token reference, component API, audit notes | [`docs/`](docs) |

---

## Quick start

```bash
# Node 22+ and pnpm 10 (see .mise.toml)
pnpm install
pnpm dev          # documentation site at http://localhost:5173
pnpm build        # builds tokens, then the site into dist/
pnpm typecheck
```

## Token architecture

```
tokens/primitives.json   Raw values: 7 color ramps (50→950), type families, sizes, 8pt spacing,
        │                radius, durations, easings, breakpoints, data-viz palettes
        ▼
tokens/semantic.json     Purpose: bg / text / border, 8 intents (primary · secondary · success ·
        │                info · warning · help · danger · contrast), elevation 0–5, focus ring,
        ▼                typography roles, motion
tokens/components.json   Decisions per component: button size × severity × variant, input sizes,
                         toggle tracks, modal widths, tooltip, toast…
```

`pnpm tokens` (run automatically by `pnpm build`) compiles them with a zero-dependency script, [`scripts/build-tokens.mjs`](scripts/build-tokens.mjs):

| Output | Use it for |
|---|---|
| `src/styles/tokens.css` | Every token as a CSS custom property, e.g. `--pance-color-intent-primary-solid`. Aliases stay live as `var()` |
| `src/styles/theme.css` | Tailwind v4 `@theme` mapping, so utilities like `bg-brand-600`, `text-ink-muted` and `border-line` resolve to tokens |
| `src/tokens.ts` | Fully-resolved typed object for JavaScript (charts, canvas, tests) |
| `tokens/dist/tokens.json` | Flat resolved map for Figma plugins (Tokens Studio, etc.) or other platforms |
| `docs/tokens.md` | The human-readable [token reference](docs/tokens.md) |

> **How a change flows today:** editing a **primitive** (e.g. `color.aqua.600`) updates every component, because Tailwind's `brand-*`, `slate-*`, `emerald-*`… utilities point at the primitives. Components don't read **semantic/component** tokens directly yet; they use Tailwind palette classes. Those tiers are documented and available as CSS variables, and wiring components to them is the main item in the [roadmap](docs/audit.md#roadmap).

### Foundations at a glance

| | |
|---|---|
| **Brand** | Aqua `#0891b2` (aqua-600) · river dark `#08202e` |
| **Neutrals** | Slate 50→950 · ground `#f1f5f9` · canvas `#f8fafc` · surface `#ffffff` · ink `#0f172a` |
| **Intents** | success emerald · info sky · warning amber · help violet · danger rose · contrast slate-900 |
| **Type** | Plus Jakarta Sans (display) · Inter (body/UI) · JetBrains Mono (data/labels) |
| **Spacing** | 8pt base unit: 4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 |
| **Radius** | 6 (sm) · 12 (md / controls) · 16 (lg / containers) · full |
| **Elevation** | 6 levels: flat · raised · card · popover · modal · brand glow |
| **Icons** | Phosphor, `regular` weight at 16–24px, referenced by intent (`IconDanger`, not `Warning`) |

## Using the components

```tsx
import { Button, Badge, Field, Input, Alert } from './components'
import { IconPlus } from './icons'

<Button severity="primary" variant="filled" size="md" Icon={IconPlus}>New stream</Button>
<Badge severity="success" dot>Flowing</Badge>
<Field label="Email" hint="We never share it"><Input type="email" /></Field>
<Alert severity="warning" title="Retention window is ending" />
```

Every component shares one model: **severity** (what it means) is independent from **variant** (how loud it is) and **size** (`sm · md · lg`). See the full [component reference](docs/components.md).

> Components read their built-in strings ("Close", "Remove"…) from the i18n context, so render them inside `<LangProvider>` (see `src/i18n`).

## Project structure

```
├── tokens/                  ← source of truth (edit these)
│   ├── primitives.json
│   ├── semantic.json
│   ├── components.json
│   └── dist/tokens.json     ← generated
├── scripts/build-tokens.mjs
├── src/
│   ├── components/          ← the library (button, badge, avatar, forms, selection,
│   │                          feedback, navigation, overlays, layout, shared)
│   ├── icons.tsx
│   ├── i18n/                ← EN / ES dictionaries
│   ├── styles/              ← index.css + generated tokens.css, theme.css
│   ├── tokens.ts            ← generated
│   ├── site/                ← documentation site (pages, showcase, examples)
│   └── main.tsx
└── docs/
    ├── tokens.md            ← generated reference
    ├── components.md
    └── audit.md             ← inconsistencies found during extraction + roadmap
```

## Contributing

1. Change values in `tokens/*.json` and keep aliases (`{color.aqua.600}`) rather than duplicating hex.
2. Run `pnpm build` to regenerate CSS, TS, JSON and docs, then commit the generated files with your change.
3. New components go in the matching file under `src/components/` and get re-exported from `src/components/index.ts`.

## Credits

Designed and built by **Jonathan Lerma**. Icons by [Phosphor](https://phosphoricons.com). Typefaces: Plus Jakarta Sans, Inter, JetBrains Mono (SIL Open Font License).
