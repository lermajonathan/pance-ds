# NavMenu

> A vertical app navigation with groups, badges and a collapsed icon-only mode.

```tsx
import { NavMenu } from '@pance/react'
```

Source: [`src/components/navigation.tsx`](../../src/components/navigation.tsx) · Figma: `Nav menu item` · Tokens: `nav-menu.*` in [tokens.md](../tokens.md)

## When to use

- Primary navigation in dashboards and consoles.

## When not to use

- Switching content on one page: use `Tabs`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `NavMenuItem[]` | **required** |  |
| `value` | `string` | **required** |  |
| `onChange` | `(key: string) => void` | **required** |  |
| `collapsed` | `boolean` | `false` |  |
| `label` | `string` |  | Name of the navigation landmark, e.g. "Main". Needed when a page has more than one <nav>. |

## Accessibility

- A named `<nav>`; the active item has `aria-current="page"`; groups expose `aria-expanded`.
- In collapsed mode, items keep their names for screen readers (and should have tooltips).

## Related

[`Tabs`](tabs.md) · [`Breadcrumb`](breadcrumb.md)

## Example

```tsx
<NavMenu label="Main" value={route} onChange={go} items={[{ key: 'home', label: 'Home', Icon: IconHome }]} />
```
