# LineChart

> Trends over a continuous or ordered axis.

```tsx
import { LineChart } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Line` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Time series with up to about 5 series.

## When not to use

- Parts of a whole: use `DonutChart`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `labels` | `string[]` | **required** |  |
| `series` | `Series[]` | **required** |  |
| `height` | `number` | `260` |  |
| `format` | `ChartFormat` | `compact` |  |

## Accessibility

- Every chart has a text alternative: arrow keys move between points and read out names and values, and "View as table" shows the same data.
- Series are never told apart by colour alone: markers, patterns and labels repeat the meaning.
- Colours follow dark mode through `color.dataviz.series.1…8`.

## Related

[`BarChart`](bar-chart.md) · [`Sparkline`](sparkline.md) · [`ScatterChart`](scatter-chart.md)

## Example

```tsx
<LineChart title="Events" labels={days} series={[{ name: 'Events', data: values }]} />
```
