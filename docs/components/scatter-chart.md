# ScatterChart

> Two numeric measures per point, to show correlation or outliers.

```tsx
import { ScatterChart } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Chart / Scatter` · Tokens: `chart.*` in [tokens.md](../tokens.md)

## When to use

- Relationship between two variables for a handful to a few dozen points.

## When not to use

- Thousands of points.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `subtitle` | `string` |  |  |
| `points` | `ScatterPoint[]` | **required** |  |
| `xLabel` | `string` | **required** |  |
| `yLabel` | `string` | **required** |  |
| `formatX` | `ChartFormat` | `compact` |  |
| `formatY` | `ChartFormat` | `compact` |  |
| `height` | `number` | `280` |  |

## Accessibility

- Arrow keys move between points and read the name with both values; hover targets are 24px; "View as table" lists all points.

## Related

[`LineChart`](line-chart.md)

## Example

```tsx
<ScatterChart title="Latency vs load" xLabel="Requests/s" yLabel="p95 ms" points={[{ label: 'api-1', x: 120, y: 80 }]} />
```
