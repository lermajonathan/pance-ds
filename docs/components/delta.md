# Delta

> A change between two values with direction and good/bad colour.

```tsx
import { Delta } from '@pance/react'
```

Source: [`src/components/data.tsx`](../../src/components/data.tsx) · Tokens: `metric-card.*` in [tokens.md](../tokens.md)

## When to use

- Next to a metric, in tables and cards.

## When not to use

- Absolute values.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | **required** | Signed change, e.g. 12.4 or -3.8. |
| `upIsGood` | `boolean` | `true` | Set to false when an increase is bad (error rate, churn, cost). |
| `format` | `((n: number) => string)` | `(n) => `${Math.abs(n)}%`` |  |

## Accessibility

- Direction is written as text and an arrow, not colour alone.

## Related

[`MetricCard`](metric-card.md)

## Example

```tsx
<Delta value={-3.1} upIsGood={false} />
```
