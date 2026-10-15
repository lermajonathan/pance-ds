/* Pance · Layout & containers — Card, Accordion, Divider, Panel */
import { createElement, useState, type ReactNode } from 'react'
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

export function Accordion({ items, allowMultiple = false }: { items: AccordionItem[]; allowMultiple?: boolean }) {
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
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={`pance-focus flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas ${index === 0 ? 'rounded-t-2xl' : ''} ${index === items.length - 1 && !isOpen ? 'rounded-b-2xl' : ''} ${isOpen ? 'bg-canvas' : ''}`}
            >
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                {item.description && <p className="mt-0.5 text-xs text-ink-muted">{item.description}</p>}
              </div>
              <IconChevronDown className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-700' : ''}`} />
            </button>
            {isOpen && (
              <div className="border-t border-line-soft px-5 py-4 text-sm leading-relaxed text-ink-soft">
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
  if (!label) return <div className={`my-4 ${line}`} />
  return (
    <div className="my-4 flex items-center gap-3">
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
  const t = TONE[iconSeverity]
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-line-soft px-5 py-4 bg-surface">
        {icon && (
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${t.bg} ${t.fg}`}>
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
              className="pance-focus rounded-lg p-1 text-ink-muted hover:bg-ground hover:text-ink"
            >
              <IconChevronDown className={`h-4 w-4 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>
      {!collapsed && children && <div className="px-5 py-4">{children}</div>}
      {!collapsed && footer && <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-line-soft px-5 py-3 bg-surface">{footer}</div>}
    </div>
  )
}
