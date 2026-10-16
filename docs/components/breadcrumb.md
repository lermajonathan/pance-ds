# Breadcrumb

> Shows where the current page sits in a hierarchy.

```tsx
import { Breadcrumb } from '@pance/react'
```

Source: [`src/components/navigation.tsx`](../../src/components/navigation.tsx) · Figma: `Breadcrumb`

## When to use

- Deep hierarchies where people need to go up a level.

## When not to use

- Flat sites; the main navigation is enough.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `BreadcrumbItem[]` | **required** |  |
| `maxItems` | `number` | `0` |  |
| `label` | `string` |  | Landmark name. Defaults to the translated "Breadcrumb"; make it unique when a page has several. |

## Accessibility

- A `<nav>` with a name; the last item has `aria-current="page"`.
- Long paths collapse into an expandable "…" button that is named.

## Related

[`NavMenu`](nav-menu.md) · [`Link`](link.md)

## Example

```tsx
<Breadcrumb items={[{ label: 'Streams', href: '/streams' }, { label: 'checkout-events' }]} />
```
