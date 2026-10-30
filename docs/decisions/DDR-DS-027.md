# DDR-DS-027: Data palettes: orange diverging pole and dark categorical steps

- **Status:** Proposed
- **Date:** 2026-10-29
- **Owner:** Design (Jonathan Lerma)

## Context

The diverging ramp runs aqua to red, and its red pole sits at ΔE 5.5 from `rose-600`, the danger colour. Status colours are reserved, so a chart that only means "below the baseline" reads as "bad". In dark mode three categorical steps (slots 2, 4 and 5) are lighter than the dark lightness band (OKLCH L 0.48 to 0.67). The dark chart surface is `slate-900`.

## Decision

1. The diverging ramp becomes aqua to orange, in `viz.diverging`. The orange pole is `#c2410c`, the centre stays `#e2e8f0`, and each arm has five steps with matching lightness. Diverging charts also carry a sign or a label at the baseline.
2. In dark mode, categorical slots 2, 4 and 5 use `#e5632e`, `#c87f00` and `#d36891`. The other five dark slots and all light slots do not change.
3. Chart forms where any two marks can touch (scatter, bubble, maps, small multiples) take at most two series. Beyond two, fold into "Other" or use facets.
4. A series that means good or bad uses the status tokens. Any other series uses a categorical slot. A chart never mixes both, and status always has an icon and a label.

The contrast test gains two checks: the dark lightness band for the categorical slots, and monotone lightness along the diverging ramp.

## Consequences

Visible change, ships in a minor release with a changelog note. Existing diverging charts change colour, and three dark-mode series get slightly darker. Checked with the validation script: both modes pass the adjacent-pair checks (worst colour-blind ΔE 9.2 light and 9.1 dark, normal vision 18.8 and 16.7), the orange pole is ΔE 29.0 from the aqua pole, 5.18:1 on white and 3.45:1 on `slate-900`, and ΔE 9.2 from `rose-600`. The duplicated `viz.status` tokens are not part of this record; they are unified separately under the deprecation policy of DDR-DS-013.
