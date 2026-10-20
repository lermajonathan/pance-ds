# DDR-DS-019: Four gradient tokens, decorative only

- **Status:** Accepted
- **Date:** 2026-10-20
- **Owner:** Design (Jonathan Lerma)

## Context

The system had no gradients as tokens. The docs site wrote them as one-off Tailwind classes, and the home hero used a fixed dark background that ignored the theme.

## Decision

Gradients are tokens, four in total, in `semantic.json` under `gradient`: `brand` (logo marks and icon tiles), `hero` (page heroes and closing bands), `surface-soft` (a highlighted card or panel) and `fade` (edge fades). They are decorative: never the only carrier of information, no text on `brand` or `fade`, and text on `hero` and `surface-soft` uses `fg.default` or `fg.soft`.

A gradient is a list of linear or radial layers, with an optional `opacity` per stop. It resolves per theme like any semantic token, and `hero` has its own dark value. The contrast test checks every stop of `hero` and `surface-soft` against the text colours in light and dark.

Figma variables cannot hold gradients, so the tokens are fill styles with the same names (`hero` and `fade` have a light and a dark style, `brand` and `surface-soft` are bound to variables). Product code does not write gradients of its own; a new one is proposed as a token.

## Consequences

Additive, ships in 1.5.0. New CSS variables `--pance-gradient-*` and Tailwind utilities `bg-gradient-brand`, `bg-gradient-hero`, `bg-gradient-surface-soft` and `bg-gradient-fade`. The docs site gets a Gradients page under Foundations and its loose gradients are replaced by the tokens. The Brand gradient starts at aqua 500 where the logo used aqua 400, a small visible change.
