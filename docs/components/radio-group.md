# RadioGroup

> A labelled set of options where exactly one is selected.

```tsx
import { RadioGroup } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Radio group` · Tokens: `radio.*` in [tokens.md](../tokens.md)

## When to use

- 2 to 5 mutually exclusive options that should all be visible.

## When not to use

- More than about 5 options: use `Select`.
- Compact toolbars: use `SegmentedControl`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `options` | `{ value: T; label: string; description?: string; disabled?: boolean; }[]` | **required** |  |
| `value` | `T \| null` | **required** |  |
| `onChange` | `(v: T) => void` | **required** |  |
| `size` | `RadioSize` | `'md'` |  |
| `orientation` | `"horizontal" \| "vertical"` | `'vertical'` |  |
| `error` | `boolean` |  |  |

## Accessibility

- `role="radiogroup"`, one Tab stop; arrows move and select; Home and End jump.
- The `label` names the group; `error` should come with a message.

## Related

[`SegmentedControl`](segmented-control.md) · [`Select`](select.md) · [`RadioCard`](radio-card.md)

## Example

```tsx
<RadioGroup label="Plan" value={plan} onChange={setPlan} options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro', description: 'Billed monthly' }]} />
```
