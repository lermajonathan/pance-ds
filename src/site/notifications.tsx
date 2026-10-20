import { useState } from 'react'
import { IconButton, Popover, Tooltip } from '../components'
import { IconBell } from '../icons'
import { useI18n, type Key } from '../i18n'

const NOTES = [1, 2, 3, 4, 5, 6, 7] as const
const SEEN = 'pance-notes-seen-1.5.0'

export function NotificationsBell() {
  const { t } = useI18n()
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem(SEEN) === '1' } catch { return false }
  })
  const markSeen = () => {
    setSeen(true)
    try { localStorage.setItem(SEEN, '1') } catch { /* storage unavailable */ }
  }
  return (
    <span className="relative inline-flex">
    <Popover
      align="end"
      title={t('release.title')}
      description={t('release.subtitle')}
      trigger={
        <Tooltip label={t('shell.notifications')} placement="bottom">
          <IconButton Icon={IconBell} label={t('shell.notifications')} onClick={markSeen} />
        </Tooltip>
      }
    >
      <ul className="-mx-1 max-h-[min(22rem,60vh)] space-y-1 overflow-y-auto">
        {NOTES.map((n) => (
          <li key={n} className="rounded-lg px-2 py-2 hover:bg-brand-50/60">
            <p className="font-mono text-10 tracking-[0.1em] text-brand-700">{t(`release.${n}.version` as Key)}</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">{t(`release.${n}.title` as Key)}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{t(`release.${n}.body` as Key)}</p>
          </li>
        ))}
      </ul>
    </Popover>
      {!seen && <span role="status" aria-label={t('release.unread')} className="pointer-events-none absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-surface" />}
    </span>
  )
}
