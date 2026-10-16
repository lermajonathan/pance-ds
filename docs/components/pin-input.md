# PinInput

> A row of single-character boxes for one-time codes.

```tsx
import { PinInput } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Pin input` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Verification and one-time codes.

## When not to use

- Free text or long values.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `length` | `number` | `6` |  |
| `onComplete` | `((pin: string) => void)` |  |  |
| `error` | `boolean` |  |  |
| `label` | `string` | `'Verification code'` | Name of the group (translate it). |
| `digitLabel` | `((n: number, total: number) => string)` | `(n, total) => `Digit ${n} of ${total}`` | Name of each box (translate it). |

## Accessibility

- `role="group"` with a name; each box is named "Digit 2 of 6".
- Arrow keys move between boxes; paste fills them; `autocomplete="one-time-code"` lets phones fill it.

## Related

[`Input`](input.md) · [`Field`](field.md)

## Example

```tsx
<PinInput length={6} label="Verification code" onComplete={verify} />
```
