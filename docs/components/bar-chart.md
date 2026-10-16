# BarChart

> Compares values across categories, grouped or stacked.

```tsx
import { BarChart } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Bar` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Category comparisons and composition over categories (`mode="stacked"`).

## When not to use

- Trends over many points: use `LineChart`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `labels` | `string[]` | **required** |  |
| `series` | `Series[]` | **required** |  |
| `height` | `number` | `260` |  |
| `format` | `ChartFormat` | `compact` |  |
| `mode` | `"grouped" \| "stacked"` | `'grouped'` |  |

## Accessibility

- Every chart has a text alternative: arrow keys move between points and read out names and values, and "View as table" shows the same data.
- Series are never told apart by colour alone: markers, patterns and labels repeat the meaning.
- Colours follow dark mode through `color.dataviz.series.1…8`.

## Related

[`RankedBarChart`](ranked-bar-chart.md) · [`LineChart`](line-chart.md)

## Example

```tsx
<BarChart title="Events by region" labels={regions} series={[{ name: '2026', data: values }]} mode="grouped" />
```
