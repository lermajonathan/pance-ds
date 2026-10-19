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
- **14 patterns** built only from instances: sign in, onboarding, checkout, profile, search results, forms, dashboards, filtered results, team list, analytics report, notifications, settings, destructive confirmation, and loading/empty/error states.
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

Up to 5 tags, each up to 25 characters, and none should repeat the category.

`design tokens`, `react`, `dashboard`, `accessibility`, `data visualization`

## Category

Design systems.

## Cover and previews

- **Cover:** the file's `Cover` page (1920 × 1080). Right-click the Cover frame, choose "Set as thumbnail". It uses a fill shader ("Pance Streamlines") that lives in the author's account library, so the thumbnail is a static render.
- **Preview images:** the `Community previews` page has eight 1920 × 1080 frames (components, tokens, buttons, light and dark, data visualization, patterns, accessibility, component page). Export them as PNG at 1x and upload them as the listing's gallery, in that order.
- **Intro animation:** `Motion — Intro` on the same page is a 4-second Figma Motion clip. Community listings do not take video for files, so export it as MP4 for social posts.

## Setup and usage (listing "How to use" text)

1. Duplicate the file into your drafts.
2. Publish it as a team library (Assets → Publish).
3. In your project, enable the library and apply the Semantic variable collection; switch between Light and Dark with the collection mode.
4. Start from a pattern on the `Patterns` page, or drag components from the Assets panel.

## What's new (changelog for the listing)

1.4.0: second icon on Button, bordered calendars, 14 patterns, full dark mode, descriptions on every component and on every Semantic and Components variable, new Cover and Getting started, Community previews.

## Support

Issues and questions: https://github.com/lermajonathan/pance-ds/issues

## Before publishing

1. Run `pnpm docs:check` and confirm the counts above still match.
2. In Figma, publish the library first, then Share → Publish to Community, and choose "Free".
3. Confirm the license options offered in the publish dialog and choose the one that matches MIT as closely as possible. Link the full MIT text in the description (already above). Do not rely on a "Terms" field.
4. Create or confirm the Community profile (name, avatar) before publishing.
