# DataTable

> A sortable, searchable, selectable table with pagination and a mobile card view.

```tsx
import { DataTable } from '@pance/react'
```

Source: [`src/components/table.tsx`](../../src/components/table.tsx) · Figma: `Data table`, `Data table row`, `Columns popover` · Tokens: `data-table.*` in [tokens.md](../tokens.md)

## When to use

- Records people scan, compare, sort or act on.
- Expandable rows (`renderExpanded`), column visibility (`columnToggle`), loading and empty states.

## When not to use

- Layout. Few simple rows: a plain list is lighter.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `Column<T>[]` | **required** |  |
| `rows` | `T[]` | **required** |  |
| `rowKey` | `(row: T) => string` | **required** |  |
| `rowLabel` | `(row: T) => string` | **required** | Name of a row for screen readers, e.g. "checkout-events". Used by the selection checkbox. |
| `caption` | `string` | **required** | Visible title; also the table's accessible name. |
| `sort` | `SortState` |  | Controlled sort. Omit to let the table sort by itself. |
| `onSortChange` | `((sort: SortState) => void)` |  |  |
| `selectable` | `boolean` |  |  |
| `selected` | `Set<string>` |  |  |
| `onSelectedChange` | `((selected: Set<string>) => void)` |  |  |
| `density` | `Density` | `'default'` |  |
| `pageSize` | `number` |  | Enables pagination. |
| `loading` | `boolean` |  |  |
| `search` | `string` |  | Controlled search text; the table does not filter, you pass the filtered `rows`. |
| `onSearchChange` | `((value: string) => void)` |  |  |
| `searchPlaceholder` | `string` |  |  |
| `actions` | `ReactNode` |  | Toolbar content shown when no rows are selected. |
| `rowActions` | `((row: T) => ReactNode)` |  | Per-row trailing cell, e.g. a DropdownMenu. |
| `empty` | `ReactNode` |  | Replaces the default "No results" state. |
| `renderExpanded` | `((row: T) => ReactNode)` |  | Adds an expand button to each row; its content renders in a full-width row below. |
| `columnToggle` | `boolean` |  | Adds a "Columns" menu to hide and show columns. The first column is the row header and always stays. |

## Accessibility

- A real `<table>` with a caption, column headers, `aria-sort`, a row header column and named selection checkboxes.
- Expand buttons have `aria-expanded` and `aria-controls` and are named by `rowLabel`.
- On small screens it becomes labelled cards with the same data and actions.
- It sorts and paginates the rows you pass; for server data control `sort` and pass the current page.

## Related

[`Pagination`](pagination.md) · [`EmptyState`](empty-state.md) · [`Checkbox`](checkbox.md) · [`Popover`](popover.md)

## Example

```tsx
<DataTable
  caption="Streams"
  rowLabel={(r) => r.name}
  rowKey={(r) => r.id}
  rows={rows}
  columns={[{ key: 'name', header: 'Name', sortable: true }, { key: 'events', header: 'Events', align: 'end' }]}
  columnToggle
/>
```
