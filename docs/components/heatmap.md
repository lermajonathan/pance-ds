# Heatmap

> A grid where cell intensity shows a value.

```tsx
import { Heatmap } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Heatmap` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Patterns across two categories, e.g. hour by weekday.

## When not to use

- Exact comparison.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `rows` | `string[]` | **required** |  |
| `cols` | `string[]` | **required** |  |
| `data` | `number[][]` | **required** |  |
| `format` | `ChartFormat` | `compact` |  |

## Accessibility

- Every chart has a text alternative: arrow keys move between points and read out names and values, and "View as table" shows the same data.
- Series are never told apart by colour alone: markers, patterns and labels repeat the meaning.
- Colours follow dark mode through `color.dataviz.series.1…8`.
- Each cell has a text value in the table view.

## Related

[`BarChart`](bar-chart.md)

## Example

```tsx
<Heatmap title="Traffic by hour" rows={days} cols={hours} data={grid} />
```
