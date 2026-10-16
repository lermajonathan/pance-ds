# MetricCard

> A key figure with context: label, value, change, trend and state.

```tsx
import { MetricCard } from '@pance/react'
```

Source: [`src/components/data.tsx`](../../src/components/data.tsx) · Figma: `Metric card` · Tokens: `metric-card.*` in [tokens.md](../tokens.md)

## When to use

- Headline KPIs. Variants: default, compact, hero, goal, breakdown, comparison.

## When not to use

- Detailed series: use a chart.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `value` | `string` | **required** | Pre-formatted value, e.g. "18,204". Formatting stays with you, so locale and units are yours. |
| `unit` | `string` |  |  |
| `Icon` | `Icon` | `IconChart` |  |
| `delta` | `number` |  | Signed percentage change. |
| `upIsGood` | `boolean` | `true` |  |
| `trend` | `number[]` |  |  |
| `trendLabel` | `string` |  | Accessible description of the trend, e.g. "Streams per day, last 8 days". |
| `caption` | `string` |  |  |
| `variant` | `"default" \| "compact" \| "hero" \| "goal" \| "breakdown" \| "comparison"` | `'default'` |  |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | `'ready'` |  |
| `onRetry` | `(() => void)` |  |  |
| `accent` | `Severity` | `'primary'` | Colour of the hero card. |
| `goal` | `{ current: number; target: number; format?: (n: number) => string; }` |  | variant="goal" |
| `breakdown` | `{ label: string; value: string; share: number; }[]` |  | variant="breakdown": `share` is a percentage of the largest part. |
| `comparison` | `{ previous: string; currentLabel: string; previousLabel: string; }` |  | variant="comparison" |

## Accessibility

- Value, change and trend are text. `Delta` says "increase" or "decrease" and whether it is good. Loading, empty and error states are announced.

## Content

- Format the value yourself (`"12.4k"`). Set `upIsGood={false}` for error rate, churn, latency and cost.

## Related

[`Delta`](delta.md) · [`Sparkline`](sparkline.md) · [`Meter`](meter.md)

## Example

```tsx
<MetricCard label="Events" value="12.4k" delta={8.2} trend={[3, 5, 4, 8, 9]} trendLabel="Last 5 days" />
```
