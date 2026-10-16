# DropdownMenu

> A menu of actions opened from a button.

```tsx
import { DropdownMenu } from '@pance/react'
```

Source: [`src/components/overlays.tsx`](../../src/components/overlays.tsx) · Figma: `Menu`, `Menu item` · Tokens: `dropdown-menu.*` in [tokens.md](../tokens.md)

## When to use

- Row actions, overflow menus, account menus.

## When not to use

- Choosing a value: use `Select`.
- Navigation: use links.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `ReactNode` | **required** |  |
| `items` | `DropdownItem[]` | **required** |  |
| `align` | `"start" \| "end"` | `'start'` |  |
| `label` | `string` |  | Accessible name for the menu; defaults to the trigger's text. |

## Accessibility

- WAI-ARIA menu button: Enter, Space or ↓ opens on the first item, ↑ on the last; arrows and Home/End move; Enter activates; Escape closes; Tab leaves.

## Content

- Items are verbs. Put destructive items last and mark them `danger`.

## Related

[`SplitButton`](split-button.md) · [`Popover`](popover.md) · [`Select`](select.md)

## Example

```tsx
<DropdownMenu label="Row actions" trigger={<IconButton Icon={IconDots} label="More actions" />} items={[{ type: 'item', label: 'Rename' }, { type: 'item', label: 'Delete', danger: true }]} />
```
