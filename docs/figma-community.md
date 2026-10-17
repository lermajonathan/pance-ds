# Figma Community listing

Text for publishing the file on Figma Community. Keep the numbers in sync with [figma.md](figma.md) and the README.

## Name

Pance Design System

## Tagline (up to 150 characters)

A token-driven design system for data-dense, social-impact products: 88 components, 878 variables, WCAG 2.2 AA. Open source, with React code.

## Description

Pance is a design system for products where complex data and human impact meet. The Figma file mirrors an open-source React library, so what you inspect here is what ships in code.

**What's inside**
- **878 variables** in three tiers (Primitives, Semantic with Light and Dark modes, Components). Components alias Semantic, never hex.
- **88 components, 987 variants**, one page per component. Each page has Overview, live Examples for every variant axis, Usage, API, Accessibility, every variant, a Tokens table and Related components.
- **70 icons** with semantic names, grouped in a gallery. They are a selection from Phosphor Icons, which has more than 1,000; any Phosphor icon works with Pance.
- **Foundations:** color ramps, intents, typography, spacing, radius and elevation, bound to variables and styles.
- **11 patterns** built only from instances: sign in, onboarding, forms, dashboards, filtered results, team list, analytics report, notifications, settings, destructive confirmation, and loading/empty/error states.
- **Decision records (DDR-DS):** the reasoning behind the system, one card per decision.

**Built for production**
- Every Figma component maps to a code component (`docs/figma-code-map.md`).
- WCAG 2.2 AA contrast checked on every token pair, light and dark.
- English and Spanish documentation.

**Links**
- Icons: https://phosphoricons.com (MIT)
- Code and tokens: https://github.com/lermajonathan/pance-ds
- Documentation site: https://pance-ds.jonathanlerma.com
- npm: `@pance/react`, `@pance/tokens`

Designed and built by Jonathan Lerma. MIT licensed; Phosphor Icons (MIT), Plus Jakarta Sans, Inter and JetBrains Mono (SIL OFL).

## Tags

design system, components, tokens, variables, accessibility, dashboard, data visualization, react, tailwind, ui kit

## Cover

The file's `Cover` page (1920 × 1080). Publish it as the thumbnail and export it at 2x.

## Before publishing

1. Run `pnpm docs:check` and confirm the counts above still match.
2. In Figma, publish the library first, then Share → Publish to Community, and choose "Free".
3. Add the license text (MIT) to the listing's "Terms" field.
