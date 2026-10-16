# Meter

> One measurement against a known maximum, such as storage used.

```tsx
import { Meter } from '@pance/react'
```

Source: [`src/components/charts.tsx`](../../src/components/charts.tsx) · Figma: `Meter` · Tokens: `meter.*` in [tokens.md](../tokens.md)

## When to use

- Quotas and capacity, with warning and danger thresholds.

## When not to use

- Progress that only goes up: use `Progress`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `value` | `number` | **required** |  |
| `max` | `number` | `100` |  |
| `unit` | `string` | `''` |  |
| `severity` | `MeterSeverity` | `'default'` |  |
| `format` | `((n: number) => string)` |  |  |

## Accessibility

- `role="meter"` with `aria-valuetext`; warning and danger also print "Warning" or "Critical", so colour is never the only cue.

## Related

[`Progress`](progress.md) · [`MetricCard`](metric-card.md)

## Example

```tsx
<Meter label="Storage" value={82} unit="%" severity="warning" />
```
