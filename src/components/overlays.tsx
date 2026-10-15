/* Pance · Overlays — Tooltip, Modal, Drawer, Popover, DropdownMenu */
import { createElement, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconX, type IconType } from '../icons'
import { focusableIn, listKeyNav, mergeTriggerProps, useDialogFocus } from './a11y'
import { type Severity, TONE } from './shared'

/* Closes a floating layer on outside pointer-down. */
function useOutsideClose(ref: React.RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close()
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}

/* ── Tooltip ───────────────────────────────────────────────────────────────
   Shows on hover AND keyboard focus (WCAG 1.4.13: hoverable, dismissible with
   Escape, persistent). The child receives aria-describedby. */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

const TT_PLACEMENT: Record<TooltipPlacement, { tip: string; arrow: string }> = {
  top:    { tip: 'bottom-full left-1/2 mb-2 -translate-x-1/2', arrow: 'absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-(--pance-tooltip-bg)' },
  bottom: { tip: 'top-full left-1/2 mt-2 -translate-x-1/2', arrow: 'absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-(--pance-tooltip-bg)' },
  left:   { tip: 'right-full top-1/2 mr-2 -translate-y-1/2', arrow: 'absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-(--pance-tooltip-bg)' },
  right:  { tip: 'left-full top-1/2 ml-2 -translate-y-1/2', arrow: 'absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-(--pance-tooltip-bg)' },
}

export function Tooltip({
  label,
  children,
  placement = 'top',
  description,
  ...forward
}: {
  label: string
  children: ReactNode
  placement?: TooltipPlacement
  description?: string
} & Record<string, unknown>) {
  const p = TT_PLACEMENT[placement]
  const id = useId()
  const [dismissed, setDismissed] = useState(false)
  // Extra props (e.g. ARIA added by a Popover or DropdownMenu using this Tooltip as its trigger)
  // are forwarded to the child, so the real control receives them.
  const child = mergeTriggerProps(children, { ...forward, 'aria-describedby': id })
  return (
    <span
      className="group/tt relative inline-flex"
      onKeyDown={(e) => e.key === 'Escape' && setDismissed(true)}
      onMouseLeave={() => setDismissed(false)}
      onBlur={() => setDismissed(false)}
    >
      {child}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-lg bg-(--pance-tooltip-bg) px-2.5 py-1.5 text-xs font-medium text-(--pance-tooltip-text) opacity-0 shadow-lg transition-all duration-200 ${dismissed ? '' : 'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100'} ${p.tip}`}
      >
        {label}
        {description && <span className="mt-0.5 block font-normal text-ink-inverse opacity-70">{description}</span>}
        <span className={p.arrow} aria-hidden="true" />
      </span>
    </span>
  )
}

/* ── Modal ─────────────────────────────────────────────────────────────────
   role="dialog" + aria-modal, labelled by its title, focus trapped while open,
   Escape closes, focus returns to the element that opened it. */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
const MODAL_SIZE: Record<ModalSize, string> = {
  sm:   'max-w-(--pance-modal-width-sm)',
  md:   'max-w-(--pance-modal-width-md)',
  lg:   'max-w-(--pance-modal-width-lg)',
  xl:   'max-w-(--pance-modal-width-xl)',
  full: 'max-w-(--pance-modal-width-full)',
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
  const tt = useLabels()
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useDialogFocus(panel, open, onClose)
  if (!open) return null
  const t = TONE[iconSeverity]
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] items-center justify-center overflow-y-auto p-4">
      <div className="fixed inset-0 h-[100dvh] bg-scrim backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`relative my-auto w-full ${MODAL_SIZE[size]} rounded-2xl border border-line bg-surface shadow-modal outline-none`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {icon && (
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${t.bg} ${t.fg}`} aria-hidden="true">
                {createElement(icon, { className: 'h-5 w-5' })}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h2 id={titleId} className="font-display text-lg font-bold text-ink">{title}</h2>
              {description && <p id={descId} className="mt-1 text-sm text-ink-muted">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label={tt.close} className="pance-focus -m-1 shrink-0 rounded-lg p-1 text-ink-muted hover:bg-ground hover:text-ink">
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
  right:  'w-full max-w-(--pance-drawer-width)',
  left:   'w-full max-w-(--pance-drawer-width)',
  bottom: 'max-h-(--pance-drawer-max-height-bottom)',
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
  const tt = useLabels()
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useDialogFocus(panel, open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh]">
      <div className="fixed inset-0 h-[100dvh] bg-scrim backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`absolute flex flex-col border-line bg-surface shadow-modal outline-none ${DRAWER_ENTER[side]} ${DRAWER_WIDTH[side]} ${side === 'bottom' ? 'rounded-t-2xl border-t pb-[env(safe-area-inset-bottom)]' : side === 'right' ? 'rounded-l-2xl border-l pb-[env(safe-area-inset-bottom)]' : 'rounded-r-2xl border-r pb-[env(safe-area-inset-bottom)]'}`}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-line-soft">
          <div>
            <h2 id={titleId} className="font-display text-lg font-bold text-ink">{title}</h2>
            {description && <p id={descId} className="mt-0.5 text-sm text-ink-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label={tt.close} className="pance-focus -m-1 rounded-lg p-1 text-ink-muted hover:bg-ground hover:text-ink">
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-line-soft px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

/* ── Popover ───────────────────────────────────────────────────────────────
   Non-modal dialog: trigger gets aria-expanded/aria-controls, Escape closes
   and returns focus to the trigger. */
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
  const panel = useRef<HTMLDivElement>(null)
  const id = useId()
  const titleId = useId()
  useOutsideClose(ref, open, () => setOpen(false))
  useEffect(() => {
    if (open) panel.current?.focus()
  }, [open])
  const close = () => {
    setOpen(false)
    focusableIn(ref.current)[0]?.focus()
  }
  const alignClass = align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
  return (
    <div ref={ref} className="relative inline-flex" onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); close() } }}>
      {mergeTriggerProps(trigger, { 'aria-expanded': open, 'aria-haspopup': 'dialog', 'aria-controls': open ? id : undefined, onClick: () => setOpen((o) => !o) })}
      {open && (
        <div
          ref={panel}
          id={id}
          role="dialog"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          className={`absolute top-full z-40 mt-2 w-(--pance-popover-width) rounded-(--pance-popover-radius) border border-line bg-surface p-(--pance-popover-padding) shadow-popover outline-none ${alignClass}`}
        >
          {title && <p id={titleId} className="mb-1 font-semibold text-sm text-ink">{title}</p>}
          {description && <p className="mb-3 text-xs text-ink-muted">{description}</p>}
          {children}
        </div>
      )}
    </div>
  )
}

/* ── DropdownMenu ──────────────────────────────────────────────────────────
   WAI-ARIA menu button: Enter/Space/ArrowDown opens and focuses the first item,
   ArrowUp opens on the last; arrows/Home/End move; Escape or Tab closes and
   returns focus to the trigger. */
export type DropdownItem =
  | { type?: 'item'; label: string; Icon?: IconType; shortcut?: string; danger?: boolean; disabled?: boolean; onClick?: () => void }
  | { type: 'separator' }
  | { type: 'label'; label: string }

type ActionItem = Extract<DropdownItem, { label: string; type?: 'item' }>
const isAction = (i: DropdownItem): i is ActionItem => i.type === undefined || i.type === 'item'

export function DropdownMenu({
  trigger, items, align = 'start', label,
}: {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  /** Accessible name for the menu; defaults to the trigger's text. */
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const actions = items.filter(isAction)
  useOutsideClose(ref, open, () => setOpen(false))
  useEffect(() => {
    if (open) itemRefs.current[active]?.focus()
  }, [open, active])

  const openAt = (i: number) => {
    setActive(i)
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) focusableIn(ref.current)[0]?.focus()
  }
  const firstEnabled = () => listKeyNav('Home', 0, actions.length, (i) => !!actions[i].disabled) ?? 0
  const lastEnabled = () => listKeyNav('End', 0, actions.length, (i) => !!actions[i].disabled) ?? 0

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); openAt(firstEnabled()) }
    if (e.key === 'ArrowUp') { e.preventDefault(); openAt(lastEnabled()) }
  }
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() ; return }
    if (e.key === 'Tab') { close(false); return }
    const next = listKeyNav(e.key, active, actions.length, (i) => !!actions[i].disabled)
    if (next !== null) { e.preventDefault(); setActive(next) }
  }

  let actionIndex = -1
  return (
    <div ref={ref} className="relative inline-flex">
      {mergeTriggerProps(trigger, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: () => (open ? close(false) : openAt(firstEnabled())),
        onKeyDown: onTriggerKey,
      })}
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className={`absolute top-full z-40 mt-1.5 min-w-(--pance-dropdown-menu-min-width) overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-popover ${align === 'end' ? 'right-0' : 'left-0'}`}
        >
          {items.map((item, i) => {
            if (item.type === 'separator') return <li key={i} role="separator" className="my-1 border-t border-line-soft" />
            if (item.type === 'label') return (
              <li key={i} role="presentation" className="px-2.5 pb-1 pt-2 font-mono text-10 font-semibold uppercase tracking-wider text-ink-muted">{item.label}</li>
            )
            const idx = ++actionIndex
            return (
              <li key={i} role="none">
                <button
                  ref={(el) => { itemRefs.current[idx] = el }}
                  type="button"
                  role="menuitem"
                  tabIndex={idx === active ? 0 : -1}
                  disabled={item.disabled}
                  aria-disabled={item.disabled || undefined}
                  onMouseEnter={() => !item.disabled && setActive(idx)}
                  onClick={() => { item.onClick?.(); close() }}
                  className={`pance-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${item.danger ? 'text-danger hover:bg-danger-soft focus-visible:bg-danger-soft' : 'text-ink-soft hover:bg-ground hover:text-ink focus-visible:bg-ground'}`}
                >
                  {item.Icon && <item.Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && <kbd className="font-mono text-10 text-ink-muted">{item.shortcut}</kbd>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
