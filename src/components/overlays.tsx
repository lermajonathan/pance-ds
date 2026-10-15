/* Pance · Overlays — Tooltip, Modal, Drawer, Popover, DropdownMenu */
import { createElement, useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { IconX, type IconType } from '../icons'
import { type Severity, TONE } from './shared'

/* ── Tooltip ───────────────────────────────────────────────────────────── */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

const TT_PLACEMENT: Record<TooltipPlacement, { tip: string; arrow: string }> = {
  top:    { tip: 'bottom-full left-1/2 mb-2 -translate-x-1/2', arrow: 'absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink' },
  bottom: { tip: 'top-full left-1/2 mt-2 -translate-x-1/2', arrow: 'absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-ink' },
  left:   { tip: 'right-full top-1/2 mr-2 -translate-y-1/2', arrow: 'absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-ink' },
  right:  { tip: 'left-full top-1/2 ml-2 -translate-y-1/2', arrow: 'absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-ink' },
}

export function Tooltip({ label, children, placement = 'top', description }: { label: string; children: ReactNode; placement?: TooltipPlacement; description?: string }) {
  const p = TT_PLACEMENT[placement]
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover/tt:opacity-100 ${p.tip}`}>
        {label}
        {description && <span className="mt-0.5 block font-normal text-white/70">{description}</span>}
        <span className={p.arrow} />
      </span>
    </span>
  )
}

/* ── Modal ─────────────────────────────────────────────────────────────── */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
const MODAL_SIZE: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
}

export function Modal({
  open, onClose, title, description, size = 'md', icon, iconSeverity = 'danger', footer, children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: ModalSize
  icon?: IconType
  iconSeverity?: Severity
  footer?: ReactNode
  children?: ReactNode
}) {
  const { t: tt } = useI18n()
  if (!open) return null
  const t = TONE[iconSeverity]
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] items-center justify-center overflow-y-auto p-4">
      <div className="fixed inset-0 h-[100dvh] bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative my-auto w-full ${MODAL_SIZE[size]} rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-20px_rgba(15,23,42,0.5)]`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            {icon && (
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${t.bg} ${t.fg}`}>
                {createElement(icon, { className: 'h-5 w-5' })}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
              {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
            </div>
            <button onClick={onClose} aria-label={tt('ui.close')} className="pance-focus -m-1 shrink-0 rounded-lg p-1 text-ink-muted hover:bg-ground hover:text-ink">
              <IconX className="h-5 w-5" />
            </button>
          </div>
          {children && <div className="mt-5">{children}</div>}
        </div>
        {footer && <div className="flex justify-end gap-3 border-t border-line-soft px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

/* ── Drawer ────────────────────────────────────────────────────────────── */
export type DrawerSide = 'right' | 'left' | 'bottom'
const DRAWER_ENTER: Record<DrawerSide, string> = {
  right:  'right-0 inset-y-0 h-[100dvh]',
  left:   'left-0 inset-y-0 h-[100dvh]',
  bottom: 'bottom-0 left-0 w-full',
}
const DRAWER_WIDTH: Record<DrawerSide, string> = {
  right:  'w-full max-w-md',
  left:   'w-full max-w-md',
  bottom: 'max-h-[85dvh]',
}

export function Drawer({
  open, onClose, title, description, side = 'right', footer, children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  side?: DrawerSide
  footer?: ReactNode
  children?: ReactNode
}) {
  const { t: tt } = useI18n()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh]">
      <div className="fixed inset-0 h-[100dvh] bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute flex flex-col border-line bg-surface shadow-[0_24px_60px_-20px_rgba(15,23,42,0.5)] ${DRAWER_ENTER[side]} ${DRAWER_WIDTH[side]} ${side === 'bottom' ? 'rounded-t-2xl border-t pb-[env(safe-area-inset-bottom)]' : side === 'right' ? 'rounded-l-2xl border-l pb-[env(safe-area-inset-bottom)]' : 'rounded-r-2xl border-r pb-[env(safe-area-inset-bottom)]'}`}>
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-line-soft">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
            {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
          </div>
          <button onClick={onClose} aria-label={tt('ui.close')} className="pance-focus -m-1 rounded-lg p-1 text-ink-muted hover:bg-ground hover:text-ink">
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-line-soft px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

/* ── Popover ───────────────────────────────────────────────────────────── */
export function Popover({
  trigger, title, description, children, align = 'start',
}: {
  trigger: ReactNode
  title?: string
  description?: string
  children: ReactNode
  align?: 'start' | 'end' | 'center'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  const alignClass = align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className={`absolute top-full z-40 mt-2 w-72 rounded-xl border border-line bg-surface p-4 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.3)] ${alignClass}`}>
          {title && <p className="mb-1 font-semibold text-sm text-ink">{title}</p>}
          {description && <p className="mb-3 text-xs text-ink-muted">{description}</p>}
          {children}
        </div>
      )}
    </div>
  )
}

/* ── DropdownMenu ──────────────────────────────────────────────────────── */
export type DropdownItem =
  | { type?: 'item'; label: string; Icon?: IconType; shortcut?: string; danger?: boolean; disabled?: boolean; onClick?: () => void }
  | { type: 'separator' }
  | { type: 'label'; label: string }

export function DropdownMenu({
  trigger, items, align = 'start',
}: {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <ul className={`absolute top-full z-40 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.3)] ${align === 'end' ? 'right-0' : 'left-0'}`}>
          {items.map((item, i) => {
            if (item.type === 'separator') return <li key={i} className="my-1 border-t border-line-soft" />
            if (item.type === 'label') return (
              <li key={i} className="px-2.5 pb-1 pt-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{item.label}</li>
            )
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => { item.onClick?.(); setOpen(false) }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${item.danger ? 'text-danger hover:bg-rose-50' : 'text-ink-soft hover:bg-ground hover:text-ink'}`}
                >
                  {item.Icon && <item.Icon className="h-4 w-4 shrink-0 text-ink-muted" />}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && <kbd className="font-mono text-[10px] text-ink-muted">{item.shortcut}</kbd>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
