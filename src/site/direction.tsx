import { useEffect, useState } from 'react'
import { SegmentedControl } from '../components'
import { useI18n } from '../i18n'

/* Page direction switch for the docs (DDR-DS-031). Sets `dir` on <html> and remembers it.
   `?dir=rtl` in the address forces it, which is also how tests open a page right-to-left. */
type Dir = 'ltr' | 'rtl'
const KEY = 'pance-dir'

const initial = (): Dir => {
  try {
    const q = new URLSearchParams(window.location.search).get('dir')
    if (q === 'rtl' || q === 'ltr') return q
    return localStorage.getItem(KEY) === 'rtl' ? 'rtl' : 'ltr'
  } catch { return 'ltr' }
}

export function DirSwitch({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  const [dir, setDir] = useState<Dir>(initial)
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
    try { localStorage.setItem(KEY, dir) } catch { /* private mode: the choice just is not remembered */ }
  }, [dir])
  return (
    <div className={`shrink-0 ${className}`} dir="ltr">
      <SegmentedControl size="sm" label={t('shell.direction')} value={dir} onChange={(v) => setDir(v as Dir)} options={[{ value: 'ltr', label: 'LTR' }, { value: 'rtl', label: 'RTL' }]} />
    </div>
  )
}
