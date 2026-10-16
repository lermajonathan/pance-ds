# Steps

> Shows progress through an ordered process.

```tsx
import { Steps } from '@pance/react'
```

Source: [`src/components/navigation.tsx`](../../src/components/navigation.tsx) · Figma: `Steps` · Tokens: `steps.*` in [tokens.md](../tokens.md)

## When to use

- Checkout, onboarding and other flows with a known number of steps.

## When not to use

- Switching views: use `Tabs`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `steps` | `StepItem[]` | **required** |  |
| `current` | `number` | **required** |  |
| `orientation` | `"horizontal" \| "vertical"` | `'horizontal'` |  |
| `label` | `string` |  | Accessible name of the list, e.g. "Onboarding progress". |
| `statusText` | `{ complete: string; error: string; }` | `{ complete: 'completed', error: 'has an error' }` | Screen-reader suffix for complete and error steps (translate it). |

## Accessibility

- The current step has `aria-current="step"` and each status is spoken ("completed", "error"), so it never relies on colour.

## Related

[`Progress`](progress.md) · [`Tabs`](tabs.md)

## Example

```tsx
<Steps current={1} steps={[{ label: 'Account' }, { label: 'Billing' }, { label: 'Confirm' }]} />
```
