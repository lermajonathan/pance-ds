# Radio

> A single option in a set where exactly one can be chosen.

```tsx
import { Radio } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Radio` · Tokens: `radio.*` in [tokens.md](../tokens.md)

## When to use

- Only inside a `RadioGroup`, or when you build your own group.

## When not to use

- Standalone: use `Checkbox`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | **required** |  |
| `onChange` | `() => void` | **required** |  |
| `label` | `string` |  |  |
| `description` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `error` | `boolean` |  |  |
| `size` | `RadioSize` | `'md'` |  |
| `tabIndex` | `number` |  | Set by RadioGroup for roving focus. |
| `onKeyDown` | `((e: KeyboardEvent<HTMLButtonElement>) => void)` |  |  |
| `buttonRef` | `Ref<HTMLButtonElement>` |  |  |

## Accessibility

- Use `RadioGroup` to get one Tab stop and arrow-key movement.

## Related

[`RadioGroup`](radio-group.md) · [`RadioCard`](radio-card.md)

## Example

```tsx
<Radio checked={v === 'a'} onChange={() => setV('a')} label="Option A" />
```
