/* Pance · Table — DataTable, Pagination */
import { Fragment, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconChevron, IconChevronDown, IconColumns, IconSearch } from '../icons'
import { focus } from './shared'
import { hitArea } from './a11y'
import { Checkbox } from './selection'
import { Skeleton } from './feedback'
import { Input } from './forms'
import { Button } from './button'
import { Popover } from './overlays'

/* ── Pagination ─────────────────────────────────────────────────────────── */
export function Pagination({
  page, pages, onChange, siblings = 1, compact, label,
}: {
  page: number
  pages: number
  onChange: (page: number) => void
  /** Page buttons shown each side of the current page. */
  siblings?: number
  /** "3 / 12" instead of numbered buttons. */
  compact?: boolean
  /** Accessible name of the navigation landmark. Give each pagination on a page a different one. */
  label?: string
}) {
  const l = useLabels()
  const btn = `${focus} grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-ground hover:text-ink disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled)`
  const range = (): (number | 'gap')[] => {
    if (pages <= 5 + siblings * 2) return Array.from({ length: pages }, (_, i) => i + 1)
    const left = Math.max(2, page - siblings), right = Math.min(pages - 1, page + siblings)
    return [1, ...(left > 2 ? ['gap' as const] : []), ...Array.from({ length: right - left + 1 }, (_, i) => left + i), ...(right < pages - 1 ? ['gap' as const] : []), pages]
  }
  const prev = <button type="button" aria-label={l.previousPage} disabled={page <= 1} onClick={() => onChange(page - 1)} className={btn}><IconChevron aria-hidden className="size-4 rotate-180" /></button>
  const next = <button type="button" aria-label={l.nextPage} disabled={page >= pages} onClick={() => onChange(page + 1)} className={btn}><IconChevron aria-hidden className="size-4" /></button>
  return (
    <nav aria-label={label ?? l.pagination} className="flex items-center gap-1">
      {prev}
      {compact ? (
        <span aria-current="page" className="px-2 font-mono text-sm text-ink-soft"><span className="font-semibold text-ink">{page}</span> / {pages}</span>
      ) : (
        range().map((p, i) => p === 'gap'
          ? <span key={`g${i}`} aria-hidden className="grid size-8 place-items-center font-mono text-sm text-ink-muted">…</span>
          : <button key={p} type="button" aria-label={l.page(p)} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}
              className={`${focus} h-8 min-w-8 rounded-lg px-2 font-mono text-13 font-medium transition-colors ${p === page ? 'bg-primary-solid text-primary-on-solid' : 'text-ink-soft hover:bg-ground'}`}>{p}</button>)
      )}
      {next}
    </nav>
  )
}

/* ── DataTable ──────────────────────────────────────────────────────────────
   A real <table> with column headers, sortable columns (aria-sort), optional row selection
   and pagination. Below the md breakpoint each row becomes a labelled card, so nothing scrolls sideways. */
export type SortState = { key: string; dir: 'asc' | 'desc' } | null
export type Density = 'compact' | 'default' | 'comfortable'

export type Column<T> = {
  key: string
  header: string
  /** Cell content. Defaults to `row[key]`. */
  render?: (row: T) => ReactNode
  align?: 'start' | 'end'
  sortable?: boolean
  /** Value used for sorting when it differs from `row[key]`. */
  sortValue?: (row: T) => string | number
  /** Hide this column in the mobile card list. */
  hideOnMobile?: boolean
}

const PAD_Y: Record<Density, string> = {
  compact: 'py-(--pance-data-table-cell-padding-y-compact)',
  default: 'py-(--pance-data-table-cell-padding-y-default)',
  comfortable: 'py-(--pance-data-table-cell-padding-y-comfortable)',
}

/* Gives a scroll container a tab stop only while it actually scrolls, so keyboard
   users can reach rows hidden below a max-height (WCAG 2.1.1) without adding a
   stop to every table. */
function useScrollFocusable<E extends HTMLElement>() {
  const ref = useRef<E>(null)
  const [scrolls, setScrolls] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const check = () => setScrolls(el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
    const ro = new ResizeObserver(check)
    ro.observe(el)
    Array.from(el.children).forEach((c) => ro.observe(c))
    check()
    return () => ro.disconnect()
  })
  return [ref, scrolls ? 0 : undefined] as const
}

export function DataTable<T>({
  columns, rows, rowKey, rowLabel, caption,
  sort: sortProp, onSortChange, selectable, selected: selectedProp, onSelectedChange,
  density = 'default', pageSize, loading, search, onSearchChange, searchPlaceholder, actions, rowActions, empty, renderExpanded, columnToggle,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  /** Name of a row for screen readers, e.g. "checkout-events". Used by the selection checkbox. */
  rowLabel: (row: T) => string
  /** Visible title; also the table's accessible name. */
  caption: string
  /** Controlled sort. Omit to let the table sort by itself. */
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  selectable?: boolean
  selected?: Set<string>
  onSelectedChange?: (selected: Set<string>) => void
  density?: Density
  /** Enables pagination. */
  pageSize?: number
  loading?: boolean
  /** Controlled search text; the table does not filter, you pass the filtered `rows`. */
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  /** Toolbar content shown when no rows are selected. */
  actions?: ReactNode
  /** Per-row trailing cell, e.g. a DropdownMenu. */
  rowActions?: (row: T) => ReactNode
  /** Replaces the default "No results" state. */
  empty?: ReactNode
  /** Adds an expand button to each row; its content renders in a full-width row below. */
  renderExpanded?: (row: T) => ReactNode
  /** Adds a "Columns" menu to hide and show columns. The first column is the row header and always stays. */
  columnToggle?: boolean
}) {
  const l = useLabels()
  const [tableScroll, tableTab] = useScrollFocusable<HTMLDivElement>()
  const [listScroll, listTab] = useScrollFocusable<HTMLUListElement>()
  const [innerSort, setInnerSort] = useState<SortState>(null)
  const [innerSel, setInnerSel] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const baseId = useId()
  const detailId = (id: string) => `${baseId}-detail-${id}`
  const toggleExpanded = (id: string) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const visible = columns.filter((c, i) => i === 0 || !hidden.has(c.key))
  const lead = (selectable ? 1 : 0) + (renderExpanded ? 1 : 0)
  const sort = sortProp !== undefined ? sortProp : innerSort
  const selected = selectedProp ?? innerSel
  const setSel = (s: Set<string>) => (onSelectedChange ? onSelectedChange(s) : setInnerSel(s))
  const setSort = (s: SortState) => (onSortChange ? onSortChange(s) : setInnerSort(s))

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort?.key)
    if (!sort || !col) return rows
    const val = (r: T) => (col.sortValue ? col.sortValue(r) : (r as Record<string, unknown>)[col.key]) as string | number
    return [...rows].sort((a, b) => {
      const x = val(a), y = val(b)
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })
      return sort.dir === 'asc' ? c : -c
    })
  }, [rows, columns, sort])

  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const current = Math.min(page, pages)
  const view = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted
  const allOn = view.length > 0 && view.every((r) => selected.has(rowKey(r)))
  const someOn = view.some((r) => selected.has(rowKey(r)))
  const toggle = (id: string) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSel(n) }
  const toggleAll = () => { const n = new Set(selected); view.forEach((r) => (allOn ? n.delete(rowKey(r)) : n.add(rowKey(r)))); setSel(n) }
  const cycle = (key: string) => setSort(sort?.key !== key ? { key, dir: 'asc' } : sort.dir === 'asc' ? { key, dir: 'desc' } : null)
  const px = 'px-(--pance-data-table-cell-padding-x)'
  const pad = PAD_Y[density]
  const emptyState = empty ?? (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-2 px-4 py-12 text-center">
      <span aria-hidden className="grid size-12 place-items-center rounded-xl bg-ground text-ink-muted"><IconSearch className="size-5" /></span>
      <p className="font-semibold text-ink">{l.noRows}</p>
      {onSearchChange && search && <button type="button" onClick={() => onSearchChange('')} className={`${focus} rounded-xl px-4 py-2 text-sm font-medium text-ink-link hover:bg-primary-soft`}>{l.clearSearch}</button>}
    </div>
  )

  return (
    <section className="flex max-h-[inherit] flex-col overflow-hidden rounded-(--pance-data-table-radius) border border-(--pance-data-table-border) bg-(--pance-data-table-bg) shadow-card-rest">
      <header className={`flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line-soft ${px} py-4`}>
        <div>
          <h3 className="font-display text-base font-bold tracking-tight text-ink">{caption}</h3>
          <p aria-live="polite" className="mt-0.5 text-sm text-ink-muted">{selected.size > 0 ? l.rowsSelected(selected.size) : l.range(sorted.length ? (current - 1) * (pageSize ?? sorted.length) + 1 : 0, pageSize ? Math.min(current * pageSize, sorted.length) : sorted.length, sorted.length)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onSearchChange && <Input inputSize="sm" Icon={IconSearch} aria-label={searchPlaceholder ?? l.search} placeholder={searchPlaceholder ?? l.search} value={search ?? ''} onChange={(e) => { onSearchChange(e.target.value); setPage(1) }} className="w-52" />}
          {columnToggle && columns.length > 1 && (
            <Popover align="end" title={l.columns} trigger={<Button size="sm" variant="outlined" severity="secondary" Icon={IconColumns}>{l.columns}</Button>}>
              <ul className="space-y-2">
                {columns.slice(1).map((c) => (
                  <li key={c.key}><Checkbox size="sm" label={c.header} checked={!hidden.has(c.key)} onChange={(on) => setHidden((p) => { const n = new Set(p); on ? n.delete(c.key) : n.add(c.key); return n })} /></li>
                ))}
              </ul>
            </Popover>
          )}
          {actions}
        </div>
      </header>

      {/* md and up: real table */}
      <div ref={tableScroll} tabIndex={tableTab} role={tableTab === 0 ? 'region' : undefined} aria-label={tableTab === 0 ? caption : undefined} className={`hidden min-h-0 overflow-auto md:block ${focus}`}>
        <table aria-label={caption} aria-busy={loading || undefined} className="w-full border-collapse whitespace-nowrap text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="[&>*]:border-b [&>*]:border-(--pance-data-table-border) [&>*]:bg-(--pance-data-table-header-bg)">
              {selectable && <th scope="col" className={`w-(--pance-data-table-select-column-width) ${px} py-(--pance-data-table-header-padding-y)`}><Checkbox checked={allOn} indeterminate={!allOn && someOn} onChange={toggleAll} ariaLabel={l.selectAllRows} /></th>}
              {renderExpanded && <td className={`w-(--pance-data-table-select-column-width) ${px}`}><span className="sr-only">{l.expandColumn}</span></td>}
              {visible.map((c) => {
                const active = sort?.key === c.key
                return (
                  <th key={c.key} scope="col" aria-sort={c.sortable ? (active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                    className={`${px} py-(--pance-data-table-header-padding-y) font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted ${c.align === 'end' ? 'text-right' : ''}`}>
                    {c.sortable ? (
                      <button type="button" onClick={() => cycle(c.key)} aria-label={l.sortBy(c.header)} className={`${focus} -mx-1 inline-flex items-center gap-1 rounded px-1 uppercase tracking-wider hover:text-ink ${active ? 'text-primary-fg' : ''}`}>
                        {c.header}
                        <IconChevronDown aria-hidden className={`size-3 transition-transform ${active ? (sort!.dir === 'asc' ? 'rotate-180' : '') : 'opacity-40'}`} />
                      </button>
                    ) : c.header}
                  </th>
                )
              })}
              {rowActions && <td className={`w-(--pance-data-table-select-column-width) ${px}`}><span className="sr-only">{l.moreActions}</span></td>}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: pageSize ?? 5 }, (_, i) => (
              <tr key={i} className="border-b border-(--pance-data-table-row-border) last:border-0">
                {[...(selectable ? [''] : []), ...(renderExpanded ? [''] : []), ...visible.map((c) => c.key), ...(rowActions ? [''] : [])].map((k, j) => <td key={j} className={`${px} ${pad}`}><Skeleton className="h-4 w-full max-w-32" /></td>)}
              </tr>
            )) : view.length === 0 ? (
              <tr><td colSpan={visible.length + lead + (rowActions ? 1 : 0)}>{emptyState}</td></tr>
            ) : view.map((r) => {
              const id = rowKey(r), on = selected.has(id), open = expanded.has(id)
              return (
                <Fragment key={id}>
                  <tr aria-selected={selectable ? on : undefined} className={`border-b border-(--pance-data-table-row-border) transition-colors last:border-0 ${on ? 'bg-(--pance-data-table-row-selected)' : 'hover:bg-(--pance-data-table-row-hover)'}`}>
                    {selectable && <td className={`${px} ${pad}`}><Checkbox checked={on} onChange={() => toggle(id)} ariaLabel={l.selectRow(rowLabel(r))} /></td>}
                    {renderExpanded && (
                      <td className={`${px} ${pad}`}>
                        <button type="button" aria-expanded={open} aria-controls={open ? detailId(id) : undefined} aria-label={open ? l.collapseRow(rowLabel(r)) : l.expandRow(rowLabel(r))} onClick={() => toggleExpanded(id)} className={`${focus} grid size-6 place-items-center rounded text-ink-muted hover:bg-ground hover:text-ink`}>
                          <IconChevronDown aria-hidden className={`size-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    )}
                    {visible.map((c, i) => {
                      const content = c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')
                      const cls = `${px} ${pad} ${c.align === 'end' ? 'text-right' : ''}`
                      return i === 0 ? <th key={c.key} scope="row" className={`${cls} font-medium text-ink`}>{content}</th> : <td key={c.key} className={`${cls} text-ink-soft`}>{content}</td>
                    })}
                    {rowActions && <td className={`${px} ${pad} text-right`}>{rowActions(r)}</td>}
                  </tr>
                  {renderExpanded && open && (
                    <tr id={detailId(id)} className="border-b border-(--pance-data-table-row-border) bg-(--pance-data-table-header-bg) last:border-0">
                      <td colSpan={visible.length + lead + (rowActions ? 1 : 0)} className={`${px} py-4 whitespace-normal`}>{renderExpanded(r)}</td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* below md: one labelled card per row */}
      <ul ref={listScroll} tabIndex={listTab} className={`min-h-0 space-y-3 overflow-auto p-4 md:hidden ${focus}`} aria-label={caption} aria-busy={loading || undefined}>
        {loading ? Array.from({ length: 3 }, (_, i) => <li key={i}><Skeleton className="h-28 w-full" /></li>) : view.length === 0 ? <li>{emptyState}</li> : view.map((r) => {
          const id = rowKey(r), on = selected.has(id), open = expanded.has(id)
          const [first, ...rest] = visible
          return (
            <li key={id} className={`rounded-xl border p-4 ${on ? 'border-primary-border bg-(--pance-data-table-row-selected)' : 'border-line bg-surface'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  {selectable && <Checkbox checked={on} onChange={() => toggle(id)} ariaLabel={l.selectRow(rowLabel(r))} />}
                  <div className="min-w-0 font-medium text-ink">{first.render ? first.render(r) : String((r as Record<string, unknown>)[first.key] ?? '')}</div>
                </div>
                {rowActions?.(r)}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line-soft pt-4">
                {rest.filter((c) => !c.hideOnMobile).map((c) => (
                  <div key={c.key} className="min-w-0">
                    <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">{c.header}</dt>
                    <dd className="mt-0.5 truncate text-sm text-ink-soft">{c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}</dd>
                  </div>
                ))}
              </dl>
              {renderExpanded && (
                <>
                  <button type="button" aria-expanded={open} aria-controls={open ? detailId(id) : undefined} onClick={() => toggleExpanded(id)} className={`${focus} ${hitArea} mt-3 inline-flex items-center gap-1 rounded text-sm font-medium text-ink-link`}>
                    {open ? l.collapseRow(rowLabel(r)) : l.expandRow(rowLabel(r))}
                    <IconChevronDown aria-hidden className={`size-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && <div id={detailId(id)} className="mt-3 border-t border-line-soft pt-3 text-sm">{renderExpanded(r)}</div>}
                </>
              )}
            </li>
          )
        })}
      </ul>

      {pageSize && pages > 1 && (
        <footer className={`flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line-soft ${px} py-3`}>
          <p className="text-sm text-ink-muted">{l.range((current - 1) * pageSize + 1, Math.min(current * pageSize, sorted.length), sorted.length)}</p>
          <Pagination page={current} pages={pages} onChange={setPage} label={`${l.pagination}: ${caption}`} />
        </footer>
      )}
    </section>
  )
}
