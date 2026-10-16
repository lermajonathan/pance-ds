# RadioCard

> A selectable card for choices that need more room than a radio row.

```tsx
import { RadioCard } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Radio card` · Tokens: `radio.*` in [tokens.md](../tokens.md)

## When to use

- Plans, delivery options, templates with a title, description and badge.

## When not to use

- Simple labels: use `RadioGroup`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | **required** |  |
| `onChange` | `() => void` | **required** |  |
| `label` | `string` | **required** |  |
| `description` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `Icon` | `Icon` |  |  |
| `badge` | `string` |  |  |

## Accessibility

- Behaves as a radio; place cards inside a group labelled for assistive tech.
- Selected state is shown by border and indicator, not colour alone.

## Related

[`RadioGroup`](radio-group.md)

## Example

```tsx
<RadioCard checked={plan === 'pro'} onChange={() => setPlan('pro')} label="Pro" description="For teams" badge="Popular" />
```
