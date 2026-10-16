# DivergingBarChart

> Bars growing left and right of a zero line for positive and negative values.

```tsx
import { DivergingBarChart } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Diverging` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Change versus a baseline, surplus and deficit.

## When not to use

- Values that are all positive.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `data` | `{ label: string; value: number; }[]` | **required** |  |
| `format` | `ChartFormat` | `compact` |  |

## Accessibility

- Every chart has a text alternative: arrow keys move between points and read out names and values, and "View as table" shows the same data.
- Series are never told apart by colour alone: markers, patterns and labels repeat the meaning.
- Colours follow dark mode through `color.dataviz.series.1…8`.

## Related

[`BarChart`](bar-chart.md)

## Example

```tsx
<DivergingBarChart title="Change vs last month" data={[{ label: 'Bogotá', value: 12 }, { label: 'Cali', value: -4 }]} />
```
