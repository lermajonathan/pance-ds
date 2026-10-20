# Popover

> A small non-modal panel anchored to a trigger.

```tsx
import { Popover } from '@pance/react'
```

Source: [`src/components/overlays.tsx`](../../src/components/overlays.tsx) · Figma: `Popover` · Tokens: `popover.*` in [tokens.md](../tokens.md)

## When to use

- Extra controls or information that do not need the whole page.

## When not to use

- Actions in a list: use `DropdownMenu`.
- Tasks that need full attention: use `Modal`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `ReactNode` | **required** |  |
| `title` | `string` |  |  |
| `description` | `string` |  |  |
| `children` | `ReactNode` | **required** |  |
| `align` | `"start" \| "end" \| "center"` | `'start'` |  |

## Accessibility

- The trigger gets `aria-expanded`; focus moves in on open; Escape or an outside click closes and refocuses the trigger.
- The panel stays on screen: it shifts sideways to fit the viewport or a clipping container, and opens upwards when there is no room below.

## Related

[`DropdownMenu`](dropdown-menu.md) · [`Tooltip`](tooltip.md) · [`Modal`](modal.md)

## Example

```tsx
<Popover trigger={<Button variant="outlined">Columns</Button>} title="Columns">…</Popover>
```
