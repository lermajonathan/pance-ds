# RankedBarChart

> Horizontal bars sorted by value, for rankings.

```tsx
import { RankedBarChart } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Ranked` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Top-N lists with long labels.

## When not to use

- Time series.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `data` | `{ label: string; value: number; }[]` | **required** |  |
| `format` | `ChartFormat` | `compact` |  |
| `unit` | `string` |  |  |

## Accessibility

- Every chart has a text alternative: arrow keys move between points and read out names and values, and "View as table" shows the same data.
- Series are never told apart by colour alone: markers, patterns and labels repeat the meaning.
- Colours follow dark mode through `color.dataviz.series.1…8`.

## Related

[`BarChart`](bar-chart.md)

## Example

```tsx
<RankedBarChart title="Top endpoints" data={[{ label: '/checkout', value: 420 }]} />
```
