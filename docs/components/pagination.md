# Pagination

> Page navigation for lists and tables.

```tsx
import { Pagination } from '@pance/react'
```

Source: [`src/components/table.tsx`](../../src/components/table.tsx) · Figma: `Pagination`

## When to use

- Lists too long for one page.

## When not to use

- Feeds: use "Load more".

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `page` | `number` | **required** |  |
| `pages` | `number` | **required** |  |
| `onChange` | `(page: number) => void` | **required** |  |
| `siblings` | `number` | `1` | Page buttons shown each side of the current page. |
| `compact` | `boolean` |  | "3 / 12" instead of numbered buttons. |
| `label` | `string` |  | Accessible name of the navigation landmark. Give each pagination on a page a different one. |

## Accessibility

- A named `<nav>`; the current page has `aria-current="page"`. Give each pagination on a page a different `label`.

## Related

[`DataTable`](data-table.md)

## Example

```tsx
<Pagination page={page} pages={12} onChange={setPage} label="Streams pages" />
```
