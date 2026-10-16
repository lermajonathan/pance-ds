# DonutChart

> Shows parts of a whole.

```tsx
import { DonutChart } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Donut` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Up to about 5 slices that sum to a meaningful total.

## When not to use

- Many categories or comparing similar sizes: use `RankedBarChart`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `slices` | `{ label: string; value: number; }[]` | **required** |  |
| `format` | `ChartFormat` | `compact` |  |
| `size` | `number` | `180` |  |

## Accessibility

- Every chart has a text alternative: arrow keys move between points and read out names and values, and "View as table" shows the same data.
- Series are never told apart by colour alone: markers, patterns and labels repeat the meaning.
- Colours follow dark mode through `color.dataviz.series.1…8`.
- Every slice carries a text label with its value.

## Related

[`RankedBarChart`](ranked-bar-chart.md)

## Example

```tsx
<DonutChart title="Traffic by source" slices={[{ label: 'Direct', value: 60 }, { label: 'Search', value: 40 }]} />
```
