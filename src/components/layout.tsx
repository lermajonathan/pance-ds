/* Pance · Layout & containers — Card, Accordion, Divider, Panel */
import { createElement, useId, useState, type ReactNode } from 'react'
import { IconChevronDown, type IconType } from '../icons'
import { type Severity, TONE } from './shared'

/* ── Card ──────────────────────────────────────────────────────────────── */
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>{children}</div>
  )
}

/* ── Accordion ─────────────────────────────────────────────────────────── */
export type AccordionItem = { id: string; title: string; description?: string; content: ReactNode }

export function Accordion({
  items,
  allowMultiple = false,
  headingLevel = 3,
}: {
  items: AccordionItem[]
  allowMultiple?: boolean
  /** Heading level wrapping each trigger (WAI-ARIA accordion pattern). Match it to the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}) {
  const uid = useId()
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setOpen((prev) => {
    const next = allowMultiple ? new Set(prev) : new Set<string>()
    prev.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((item, index) => {
        const isOpen = open.has(item.id)
        const btnId = `${uid}-${index}-btn`
        const panelId = `${uid}-${index}-panel`
        return (
          <div key={item.id}>
            {createElement(
              `h${headingLevel}`,
              { className: 'm-0' },
            <button
              id={btnId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className={`pance-focus flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas ${index === 0 ? 'rounded-t-2xl' : ''} ${index === items.length - 1 && !isOpen ? 'rounded-b-2xl' : ''} ${isOpen ? 'bg-canvas' : ''}`}
            >
              <span className="block">
                <span className="block text-sm font-semibold text-ink">{item.title}</span>
                {item.description && <span className="mt-0.5 block text-xs font-normal text-ink-muted">{item.description}</span>}
              </span>
              <IconChevronDown aria-hidden className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-700' : ''}`} />
            </button>,
            )}
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={btnId} className="border-t border-line-soft px-5 py-4 text-sm leading-relaxed text-ink-soft">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Divider ────────────────────────────────────────────────────────────── */
export function Divider({ label, soft }: { label?: string; soft?: boolean }) {
  const line = `h-px flex-1 ${soft ? 'bg-line-soft' : 'bg-line'}`
  if (!label) return <div role="separator" className={`my-4 ${line}`} />
  return (
    <div role="separator" aria-label={label} className="my-4 flex items-center gap-3">
      <div className={line} />
      <span className="shrink-0 text-xs font-medium text-ink-muted">{label}</span>
      <div className={line} />
    </div>
  )
}

/* ── Panel ──────────────────────────────────────────────────────────────── */
export function Panel({
  title, description, icon, iconSeverity = 'primary', actions, footer, collapsible = false, children, className = '',
}: {
  title: string
  description?: string
  icon?: IconType
  iconSeverity?: Severity
  actions?: ReactNode
  footer?: ReactNode
  collapsible?: boolean
  children?: ReactNode
  className?: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  const bodyId = useId()
  const t = TONE[iconSeverity]
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-line-soft px-5 py-4 bg-surface">
        {icon && (
          <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${t.bg} ${t.fg}`}>
            {createElement(icon, { className: 'h-4 w-4' })}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink leading-none">{title}</p>
          {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-expanded={!collapsed}
              aria-controls={bodyId}
              aria-label={title}
              className="pance-focus rounded-lg p-1 text-ink-muted hover:bg-ground hover:text-ink"
            >
              <IconChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>
      <div id={bodyId} hidden={collapsed}>
        {children && <div className="px-5 py-4">{children}</div>}
        {footer && <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-line-soft px-5 py-3 bg-surface">{footer}</div>}
      </div>
    </div>
  )
}
