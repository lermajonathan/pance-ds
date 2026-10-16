# RangeSlider

> A native range input for picking a number in an interval.

```tsx
import { RangeSlider } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Range slider` · Tokens: `range-slider.*` in [tokens.md](../tokens.md)

## When to use

- Approximate values where precision is not critical: volume, thresholds.

## When not to use

- Exact values: add an `Input` or use steps. Do not use for two-handle ranges (not supported).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | **required** |  |
| `onChange` | `(v: number) => void` | **required** |  |
| `min` | `number` | `0` |  |
| `max` | `number` | `100` |  |
| `step` | `number` | `1` |  |
| `severity` | `"primary" \| "success" \| "warning" \| "danger"` | `'primary'` |  |
| `label` | `string` |  | Accessible name when the slider is not inside a Field. |
| `valueText` | `string` |  | Human-readable value, e.g. "40 %" or "3 replicas" (aria-valuetext). |
| `disabled` | `boolean` |  |  |

## Accessibility

- Native `<input type="range">`: arrows, Home, End and Page keys work.
- `label` is required outside a `Field`; `valueText` gives a readable value such as "40 percent".

## Related

[`Input`](input.md) · [`Meter`](meter.md)

## Example

```tsx
<RangeSlider label="Alert threshold" value={t} onChange={setT} min={0} max={100} valueText={`${t} percent`} />
```
