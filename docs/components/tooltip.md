# Tooltip

> A short label that appears on hover and keyboard focus.

```tsx
import { Tooltip } from '@pance/react'
```

Source: [`src/components/overlays.tsx`](../../src/components/overlays.tsx) · Figma: `Tooltip` · Tokens: `tooltip.*` in [tokens.md](../tokens.md)

## When to use

- Name icon-only buttons; add a short hint to a control.

## When not to use

- Essential information or interactive content: use `Popover`.
- Touch-only contexts: tooltips need hover or focus.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `children` | `ReactNode` | **required** |  |
| `placement` | `TooltipPlacement` | `'top'` |  |
| `description` | `string` |  |  |

## Accessibility

- `role="tooltip"` and `aria-describedby` on the child. Appears on focus, stays while hovered, Escape dismisses (WCAG 1.4.13).

## Related

[`Popover`](popover.md) · [`IconButton`](icon-button.md)

## Example

```tsx
<Tooltip label="Copy link"><IconButton Icon={IconCopy} label="Copy link" /></Tooltip>
```
