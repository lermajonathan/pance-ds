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
}

const LabelsContext = createContext<PanceLabels>(defaultLabels)

/** Optional. Wrap your app to translate Pance's built-in strings. Unset keys fall back to English. */
export function PanceProvider({ labels, children }: { labels?: Partial<PanceLabels>; children: ReactNode }) {
  const value = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
}

export const useLabels = () => useContext(LabelsContext)
