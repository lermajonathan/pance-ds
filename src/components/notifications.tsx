/* Pance · Notifications — NotificationCenter
   A bell button with an unread count that opens a non-modal dialog (Popover) listing notifications.
   Controlled: the app owns the list, the read state and what dismissing means. */
import { useId, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconAlert, IconBell, IconCheck, IconCheckCircle, IconInfo, IconX, type IconType } from '../icons'
import { focus, TONE } from './shared'
import { hitArea } from './a11y'
import { Popover } from './overlays'
import { CountBadge } from './badge'

export type NotificationSeverity = 'primary' | 'success' | 'warning' | 'danger'
export type NotificationItem = {
  id: string
  title: string
  body?: string
  /** Already formatted, e.g. "5 min ago". */
  time?: string
  read: boolean
  severity?: NotificationSeverity
}

const ICON: Record<NotificationSeverity, IconType> = { primary: IconInfo, success: IconCheckCircle, warning: IconAlert, danger: IconAlert }

export function NotificationCenter({
  items, onRead, onReadAll, onDismiss, footer, align = 'end',
}: {
  items: NotificationItem[]
  onRead: (id: string) => void
  onReadAll?: () => void
  onDismiss?: (id: string) => void
  /** Extra content under the list, such as a "View all" link. */
  footer?: ReactNode
  align?: 'start' | 'end'
}) {
  const l = useLabels()
  const unread = items.filter((n) => !n.read).length
  const listId = useId()
  return (
    <Popover
      align={align}
      title={l.notifications}
      trigger={
        <button type="button" aria-label={unread > 0 ? l.notificationsUnread(unread) : l.notifications}
          className={`${focus} relative grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-primary-border hover:text-primary-fg`}>
          <IconBell size={18} aria-hidden />
          {unread > 0 && <span aria-hidden className="absolute -right-1.5 -top-1.5"><CountBadge count={unread} max={9} /></span>}
        </button>
      }
    >
      <div className="-mx-1">
        {unread > 0 && onReadAll && (
          <div className="mb-1 flex justify-end px-1">
            <button type="button" onClick={(e) => { e.currentTarget.closest<HTMLElement>('[role="dialog"]')?.focus(); onReadAll() }} className={`${focus} ${hitArea} rounded px-1 text-xs font-medium text-ink-link hover:underline`}>{l.markAllRead}</button>
          </div>
        )}
        {items.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-ink-muted">{l.noNotifications}</p>
        ) : (
          <ul id={listId} className="m-0 max-h-80 list-none divide-y divide-line-soft overflow-y-auto p-0">
            {items.map((n) => {
              const sev = n.severity ?? 'primary'
              const t = TONE[sev]
              const Icon = ICON[sev]
              return (
                <li key={n.id} tabIndex={-1} className={`flex items-start gap-3 px-2 py-3 outline-none ${n.read ? '' : 'bg-primary-soft/40'}`}>
                  <span aria-hidden className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${t.bg} ${t.fg}`}><Icon className="size-3.5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug ${n.read ? 'font-medium text-ink-soft' : 'font-semibold text-ink'}`}>
                      {!n.read && <span className="sr-only">{l.unread}: </span>}{n.title}
                    </p>
                    {n.body && <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{n.body}</p>}
                    {n.time && <p className="mt-1 font-mono text-xs text-ink-muted">{n.time}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {!n.read && (
                      <button type="button" aria-label={l.markRead(n.title)} onClick={(e) => { e.currentTarget.closest('li')?.focus(); onRead(n.id) }} className={`${focus} grid size-7 place-items-center rounded text-ink-muted hover:bg-ground hover:text-ink`}>
                        <IconCheck aria-hidden className="size-4" />
                      </button>
                    )}
                    {onDismiss && (
                      <button type="button" aria-label={l.dismissNotification(n.title)} onClick={(e) => { e.currentTarget.closest<HTMLElement>('[role="dialog"]')?.focus(); onDismiss(n.id) }} className={`${focus} grid size-7 place-items-center rounded text-ink-muted hover:bg-ground hover:text-ink`}>
                        <IconX aria-hidden className="size-4" />
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        {footer && <div className="mt-1 border-t border-line-soft px-1 pt-2">{footer}</div>}
      </div>
    </Popover>
  )
}
