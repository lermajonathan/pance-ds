/* Pance · built-in strings.
   Components never import an i18n library or a router. Their few built-in
   strings ("Close", "Remove"…) come from this context, in English by default.
   Translate them once at the root of your app:

     <PanceProvider labels={{ close: 'Cerrar', remove: 'Quitar' }}>…</PanceProvider>
*/
import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type PanceLabels = {
  close: string
  dismiss: string
  remove: string
  removeFile: string
  moreActions: string
  breadcrumb: string
  showFullPath: string
  showPassword: string
  optional: string
  clickToUpload: string
  orDrag: string
  clickToEdit: string
  search: string
  addTag: string
  /** Empty-state text for Combobox; receives what the user typed. */
  noResults: (query: string) => string
  /* Metrics and data */
  /** Spoken delta, e.g. "Up 12.4 percent". */
  deltaUp: (value: string) => string
  deltaDown: (value: string) => string
  deltaFlat: string
  /** Spoken meaning of the delta, e.g. "better" or "worse", so colour is never the only signal. */
  deltaBetter: string
  deltaWorse: string
  trend: string
  noData: string
  loading: string
  failedToLoad: string
  retry: string
  vsPrevious: string
  current: string
  target: string
  /** "72% of goal" */
  ofGoal: (percent: string) => string
  low: string
  high: string
  total: string
  /* Table and pagination */
  selectAllRows: string
  selectRow: (name: string) => string
  sortBy: (column: string) => string
  rowsSelected: (count: number) => string
  noRows: string
  clearSearch: string
  pagination: string
  previousPage: string
  nextPage: string
  page: (n: number) => string
  /** "1–5 of 42" */
  range: (from: number, to: number, total: number) => string
  /* Charts */
  viewAsTable: string
  viewAsChart: string
  chartKeyboardHint: string
}

export const defaultLabels: PanceLabels = {
  close: 'Close',
  dismiss: 'Dismiss',
  remove: 'Remove',
  removeFile: 'Remove file',
  moreActions: 'More actions',
  breadcrumb: 'Breadcrumb',
  showFullPath: 'Show full path',
  showPassword: 'Show password',
  optional: '(optional)',
  clickToUpload: 'Click to upload',
  orDrag: 'or drag and drop',
  clickToEdit: 'Click to edit',
  search: 'Search…',
  addTag: 'Add tag…',
  noResults: (query) => `No results for "${query}"`,
  deltaUp: (v) => `Up ${v}`,
  deltaDown: (v) => `Down ${v}`,
  deltaFlat: 'No change',
  deltaBetter: 'better',
  deltaWorse: 'worse',
  trend: 'Trend',
  noData: 'No data yet',
  loading: 'Loading',
  failedToLoad: 'Could not load',
  retry: 'Retry',
  vsPrevious: 'vs previous period',
  current: 'Current',
  target: 'Target',
  ofGoal: (p) => `${p} of goal`,
  low: 'Low',
  high: 'High',
  total: 'Total',
  selectAllRows: 'Select all rows',
  selectRow: (name) => `Select ${name}`,
  sortBy: (c) => `Sort by ${c}`,
  rowsSelected: (n) => `${n} selected`,
  noRows: 'No results',
  clearSearch: 'Clear search',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (n) => `Page ${n}`,
  range: (a, b, t) => `${a}–${b} of ${t}`,
  viewAsTable: 'View as table',
  viewAsChart: 'View as chart',
  chartKeyboardHint: 'Use the arrow keys to move between data points.',
}

const LabelsContext = createContext<PanceLabels>(defaultLabels)

/** Optional. Wrap your app to translate Pance's built-in strings. Unset keys fall back to English. */
export function PanceProvider({ labels, children }: { labels?: Partial<PanceLabels>; children: ReactNode }) {
  const value = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
}

export const useLabels = () => useContext(LabelsContext)
