# DDR-DS-028: One status-colour system for charts and controls

- **Status:** Proposed
- **Date:** 2026-11-02
- **Owner:** Design (Jonathan Lerma)

## Context

Pance had two status-colour systems. The intent colours (success, warning, danger) drive buttons, badges, alerts and toasts. The data-viz status palette (`color.viz.status.*`, published in 1.5.0) had its own greens, ambers, oranges and reds in four levels, `good`, `warning`, `serious` and `critical`. The two did not match, so a chart and a button could disagree about what "good" looks like. The audit listed this as finding 5.4. No component uses the data-viz status tokens; they exist only as published tokens.

## Decision

1. Charts take their status colours from the intent colours. New semantic tokens `color.dataviz.status.good`, `.warning` and `.critical` point to the intent text colours (`success.fg`, `warning.fg`, `danger.fg`), which already have light and dark values and pass 3:1 on the chart surface in both modes.
2. The old `color.viz.status.*` tokens stay as **deprecated aliases** for the period set by DDR-DS-013 (at least two minor releases and 90 days), then go in 2.0.0. `good`, `warning` and `critical` point to the new tokens (`solid`) or to the intent soft fills (`soft`). Their colours change to the intent colours, listed in the changelog.
3. `serious` has no intent and gets **no replacement**. It is deprecated with its current value and removed in 2.0.0. For a middle level of severity use `warning` or `danger`.
4. A status in a chart still carries an icon and a label, as in DDR-DS-027.
5. The contrast test gains checks that the deprecated tokens are aliases of the intent colours (so a second system cannot come back) and that they are marked `$deprecated`, plus a 3:1 pair for each new token in both modes.

## Consequences

CSS custom property names do not change, so nothing breaks. Anyone using `--pance-color-viz-status-*` sees the intent colours (a darker green, amber and rose) in place of the old palette and a deprecation note in the docs and changelog. Tokens have no runtime, so the development-only `console.warn` of the deprecation policy does not apply; the warning lives in the token description and the changelog. The migration note for 2.0.0 is: replace `color.viz.status.{good,warning,critical}.solid` with `color.dataviz.status.*`, the `soft` ones with `color.intent.{success,warning,danger}.soft`, and `serious` with `warning` or `danger`.
