# Progress

> A bar showing how far a task has got.

```tsx
import { Progress } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Progress` · Tokens: `progress.*` in [tokens.md](../tokens.md)

## When to use

- Uploads, imports and multi-step jobs where you know the percentage.

## When not to use

- Unknown duration: use `Spinner`.
- A measurement against a limit: use `Meter`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | **required** |  |
| `severity` | `Severity` | `'primary'` |  |
| `showValue` | `boolean` |  |  |
| `label` | `string` |  | Accessible name, e.g. "Upload progress". Required by WCAG 4.1.2 when there is no visible label. |
| `valueText` | `string` |  | Human-readable value for screen readers, e.g. "3 of 8 files". |

## Accessibility

- `role="progressbar"` with `aria-valuenow`. Pass `label` to name it; `valueText` for a readable value such as "Step 2 of 5".

## Related

[`Spinner`](spinner.md) · [`Meter`](meter.md) · [`Steps`](steps.md)

## Example

```tsx
<Progress label="Uploading report.csv" value={64} showValue />
```
