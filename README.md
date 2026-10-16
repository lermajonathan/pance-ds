# Pance Design System

A production-ready design system built for products where complex data and human impact meet. Pance is inspired by a river: a vibrant aquatic teal for every interactive moment, grounded by a high-contrast slate neutral and a strict 8pt grid.

**Live documentation:** [pance-ds.jonathanlerma.com](https://pance-ds.jonathanlerma.com/en) · English / Español  
**Figma library:** [Pance DS](https://www.figma.com/design/oU5j1pVQQZWGgZvTuW3IP1/Pance-DS): 878 variables, 87 components (952 variants) and 69 icons, mirrored from this repo ([details](docs/figma.md))

This repository contains:

| | What | Where |
|---|---|---|
| 🎨 | **Design tokens**: 855 tokens in three tiers (primitives → semantic → components), W3C DTCG format | [`tokens/`](tokens) |
| 🧩 | **React components**: 71 components, built with Tailwind CSS v4 | [`src/components/`](src/components) |
| 🔣 | **Iconography**: 67 semantic aliases over Phosphor Icons | [`src/icons.tsx`](src/icons.tsx) |
| 📖 | **Documentation site**: the bilingual explorer published at the URL above | [`src/site/`](src/site) |
| 📚 | **Reference docs**: token reference, one page per component, decision records, audit notes | [`docs/`](docs) · [components](docs/components/README.md) |

---

## Quick start

```bash
# Node 22+ and pnpm 10 (see .mise.toml)
pnpm install
pnpm dev          # documentation site at http://localhost:5173
pnpm build        # builds tokens, then the site into dist/
pnpm typecheck
pnpm preview --port 4173 &   # then, in another shell:
pnpm test:keyboard           # WAI-ARIA keyboard behaviour
pnpm test:axe                # axe-core, 20 pages × 2 viewports
pnpm build:packages          # build @pance/tokens and @pance/react
pnpm test:packages           # install both in a fresh project and smoke-test them
```

### Releasing

1. Bump `version` in `packages/tokens/package.json` and `packages/react/package.json` (same number) and move the CHANGELOG entries under it.
2. Create a GitHub release tagged `v<version>`. The [release workflow](.github/workflows/release.yml) runs every check and publishes both packages to npm with provenance.

## Token architecture

```
tokens/primitives.json   Raw values: 7 color ramps (50→950), type families, sizes, 8pt spacing,
        │                radius, durations, easings, breakpoints, data-viz palettes
        ▼
tokens/semantic.json     Purpose: bg / fg / border, 8 intents (primary · secondary · success ·
        │                info · warning · help · danger · contrast), elevation 0–5, focus ring,
        ▼                typography roles, motion. Light + draft dark ($extensions)
tokens/components.json   Decisions per component: button size × severity × variant, input sizes,
                         toggle tracks, modal widths, tooltip, toast…
```

`pnpm tokens` (run automatically by `pnpm build`) compiles them with a zero-dependency script, [`scripts/build-tokens.mjs`](scripts/build-tokens.mjs):

| Output | Use it for |
|---|---|
| `src/styles/tokens.css` | Every token as a CSS custom property, e.g. `--pance-color-intent-primary-solid`. Aliases stay live as `var()` |
| `src/styles/theme.css` | Tailwind v4 `@theme` mapping: intent utilities (`bg-primary-solid`, `text-danger-fg`, `ring-success-border`…), neutrals (`text-ink-muted`, `border-line-strong`…), shadows and the raw palettes (`bg-brand-600`) for the docs site |
| `src/tokens.ts` | Fully-resolved typed object for JavaScript (charts, canvas, tests) |
| `tokens/dist/tokens.json` | Flat resolved map for Figma plugins (Tokens Studio, etc.) or other platforms |
| `docs/tokens.md` | The human-readable [token reference](docs/tokens.md) |

> **How a change flows:** components read tokens, never palette steps. Shared styles use semantic utilities (`bg-primary-solid`, `text-danger-fg`, `border-line`, `text-ink-muted`…) and component-specific values use component tokens directly (`bg-(--pance-button-color-primary-filled-bg)`, `bg-(--pance-toggle-color-track-off)`). Editing a primitive, a semantic token or a component token in `tokens/*.json` restyles every component that uses it, and `data-theme="dark"` swaps the semantic layer. Dimensions work the same way: Tailwind's spacing, radius, type, weight and container scales are mapped onto Pance tokens (`p-4` = `space.2`, `rounded-xl` = `radius.12`, `text-sm` = `fontSize.14`), and component sizes read component tokens (`h-(--pance-button-size-md-height)`).
>
> Two checks keep it that way in CI: `pnpm lint:tokens` fails if a component hard-codes a colour or a pixel size, and `pnpm test:contrast` checks 147 token pairs against WCAG 2.2 in light and dark mode.

### Foundations at a glance

| | |
|---|---|
| **Brand** | Aqua `#0891b2` (aqua-600) · solid fills aqua-700 `#0e7490` for AA contrast · river dark `#08202e` |
| **Neutrals** | Slate 50→950 · ground `#f1f5f9` · canvas `#f8fafc` · surface `#ffffff` · ink `#0f172a` |
| **Intents** | success emerald · info sky · warning amber · help violet · danger rose · contrast slate-900 |
| **Type** | Plus Jakarta Sans (display) · Inter (body/UI) · JetBrains Mono (data/labels) |
| **Spacing** | 8pt base unit: 4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 |
| **Radius** | 6 (sm) · 12 (md / controls) · 16 (lg / containers) · full |
| **Elevation** | 6 levels: flat · raised · card · popover · modal · brand glow |
| **Icons** | Phosphor, `regular` weight at 16–24px, referenced by intent (`IconDanger`, not `Warning`) |

## Install

Pance ships as two npm packages, built from this repo:

| Package | What it is |
|---|---|
| [`@pance/react`](packages/react) | The components and icons, with a precompiled stylesheet (or a Tailwind v4 entry). React 19 |
| [`@pance/tokens`](packages/tokens) | The tokens alone: CSS variables, Tailwind theme, typed JS object, JSON |

```bash
npm install @pance/react
```

```tsx
import '@pance/react/styles.css'
import { Button, Badge, Field, Input, Alert, IconPlus } from '@pance/react'

<Button severity="primary" variant="filled" size="md" Icon={IconPlus}>New stream</Button>
<Badge severity="success" dot>Flowing</Badge>
<Field label="Email" hint="We never share it"><Input type="email" /></Field>
<Alert severity="warning" title="Retention window is ending" />
```

Every component shares one model: **severity** (what it means) is independent from **variant** (how loud it is) and **size** (`sm · md · lg`). See the full [component reference](docs/components.md) and the [package README](packages/react/README.md) for the Tailwind setup, fonts, dark mode and translations.

> The library has no router or i18n dependency. Its few built-in strings ("Close", "Remove"…) are English by default; translate them with `<PanceProvider labels={…}>`.

## Project structure

```
├── tokens/                  ← source of truth (edit these)
│   ├── primitives.json
│   ├── semantic.json
│   ├── components.json
│   └── dist/tokens.json     ← generated
├── scripts/
│   ├── build-tokens.mjs     ← tokens → CSS, Tailwind theme, TS, JSON, docs
│   └── build-packages.mjs   ← builds packages/*/dist for npm
├── packages/
│   ├── tokens/              ← @pance/tokens (package.json + README; dist is built)
│   └── react/               ← @pance/react
├── src/
│   ├── components/          ← the library (button, badge, avatar, forms, selection,
│   │                          feedback, navigation, overlays, layout, shared)
│   ├── icons.tsx
│   ├── lib.ts               ← @pance/react entry
│   ├── i18n/                ← EN / ES dictionaries (docs site only)
│   ├── styles/              ← index.css + generated tokens.css, theme.css
│   ├── tokens.ts            ← generated
│   ├── site/                ← documentation site (pages, showcase, examples)
│   └── main.tsx
└── docs/
    ├── tokens.md            ← generated reference
    ├── components.md        ← shared model, keyboard contract, strings
    ├── components/          ← one generated page per component (pnpm docs)
    ├── decisions/           ← design decision records (DDR-DS), append-only
    ├── deprecation.md       ← what is public API and how it is removed
    └── audit.md             ← inconsistencies found during extraction + roadmap
```

## Contributing

Full guide: [CONTRIBUTING.md](CONTRIBUTING.md). Removal of public API follows the [deprecation policy](docs/deprecation.md).

1. Change values in `tokens/*.json` and keep aliases (`{color.aqua.600}`) rather than duplicating hex.
2. Run `pnpm build` to regenerate CSS, TS, JSON and docs, then commit the generated files with your change.
3. New components go in the matching file under `src/components/` and get re-exported from `src/components/index.ts`.

## Accessibility

Target: **WCAG 2.2 AA**.

- **Contrast:** semantic text tokens reach 4.5:1 on the backgrounds they're meant for (each ratio is in the token description); solid fills with white text use step 700; control fills and the focus ring reach 3:1.
- **Keyboard and ARIA:** interactive components follow the WAI-ARIA Authoring Practices (dialog, menu button, combobox, tabs, radio group, tooltip, disclosure). See the [keyboard contract](docs/components.md#keyboard-and-screen-reader-contract).
- **Forms:** `Field` connects its label, hint, error and required state to the control automatically.
- **Evidence:** `pnpm test:keyboard` (32 behaviour checks) and `pnpm test:axe` (axe-core on 20 pages at desktop and mobile) run in CI. axe went from 975 violations to 36; the remaining 36 are disabled-state text, which WCAG exempts, and colour swatch labels. Details in [docs/audit.md](docs/audit.md).

Automated checks don't replace testing with a screen reader; NVDA and VoiceOver passes are on the roadmap.

## License

[MIT](LICENSE) © Jonathan Lerma. Typefaces are under the SIL Open Font License; icons by Phosphor (MIT).

## Credits

Designed and built by **Jonathan Lerma**. Icons by [Phosphor](https://phosphoricons.com). Typefaces: Plus Jakarta Sans, Inter, JetBrains Mono (SIL Open Font License).
