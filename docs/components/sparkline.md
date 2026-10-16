# Sparkline

> A tiny line or bar chart for trends inside other components.

```tsx
import { Sparkline } from '@pance/react'
```

Source: [`src/components/data.tsx`](../../src/components/data.tsx) · Figma: `Sparkline` · Tokens: `sparkline.*` in [tokens.md](../tokens.md)

## When to use

- Show direction at a glance in cards and table cells.

## When not to use

- Reading exact values.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `number[]` | **required** |  |
| `tone` | `"positive" \| "negative" \| "neutral"` | `'positive'` |  |
| `size` | `SparkSize` | `'md'` |  |
| `variant` | `"line" \| "bar"` | `'line'` |  |
| `label` | `string` |  | Accessible name. Defaults to "Trend: from X to Y". |

## Accessibility

- `label` is the text alternative; summarise the trend in words ("Up 12% over 30 days").

## Related

[`MetricCard`](metric-card.md) · [`LineChart`](line-chart.md)

## Example

```tsx
<Sparkline data={[3, 5, 4, 8, 9]} tone="positive" label="Events, last 5 days, rising" />
```
