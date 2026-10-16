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
  columns: string
  expandColumn: string
  expandRow: (name: string) => string
  collapseRow: (name: string) => string
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
  meterStatusWarning: string
  /* Dialogs and notifications */
  cancel: string
  typeToConfirm: (text: string) => string
  notifications: string
  notificationsUnread: (count: number) => string
  markAllRead: string
  markRead: (title: string) => string
  dismissNotification: (title: string) => string
  noNotifications: string
  unread: string
  undo: string
  meterStatusDanger: string
  /* Dates */
  /** BCP 47 tag used to format month and weekday names (Intl). */
  locale: string
  /** 0 = Sunday … 6 = Saturday. */
  firstDayOfWeek: number
  previousMonth: string
  nextMonth: string
  chooseDate: string
  chooseDateRange: string
  today: string
  clearDate: string
  rangeStart: string
  rangeEnd: string
  calendarKeyboardHint: string
  /** Spoken value of a range picker, e.g. "Oct 1 to Oct 15". */
  rangeValue: (from: string, to: string) => string
  /* Links and theme */
  opensInNewTab: string
  theme: string
  themeLight: string
  themeDark: string
  themeSystem: string
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
  columns: 'Columns',
  expandColumn: 'Expand row',
  expandRow: (n) => `Show details for ${n}`,
  collapseRow: (n) => `Hide details for ${n}`,
  clearSearch: 'Clear search',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (n) => `Page ${n}`,
  range: (a, b, t) => `${a}–${b} of ${t}`,
  viewAsTable: 'View as table',
  viewAsChart: 'View as chart',
  chartKeyboardHint: 'Use the arrow keys to move between data points.',
  meterStatusWarning: 'Warning',
  cancel: 'Cancel',
  typeToConfirm: (t) => `Type ${t} to confirm`,
  notifications: 'Notifications',
  notificationsUnread: (n) => `Notifications, ${n} unread`,
  markAllRead: 'Mark all as read',
  markRead: (t) => `Mark "${t}" as read`,
  dismissNotification: (t) => `Dismiss "${t}"`,
  noNotifications: 'You are all caught up',
  unread: 'Unread',
  undo: 'Undo',
  meterStatusDanger: 'Critical',
  locale: 'en-US',
  firstDayOfWeek: 0,
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseDate: 'Choose date',
  chooseDateRange: 'Choose date range',
  today: 'Today',
  clearDate: 'Clear',
  rangeStart: 'start of range',
  rangeEnd: 'end of range',
  calendarKeyboardHint: 'Use the arrow keys to move between days, Page Up and Page Down to change month.',
  rangeValue: (from, to) => `${from} to ${to}`,
  opensInNewTab: 'opens in a new tab',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
}

const LabelsContext = createContext<PanceLabels>(defaultLabels)

/** Optional. Wrap your app to translate Pance's built-in strings. Unset keys fall back to English. */
export function PanceProvider({ labels, children }: { labels?: Partial<PanceLabels>; children: ReactNode }) {
  const value = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
}

export const useLabels = () => useContext(LabelsContext)
