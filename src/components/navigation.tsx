/* Pance · Navigation — Tabs, Breadcrumb, Steps, NavMenu */
import { useState } from 'react'
import { useI18n } from '../i18n'
import { IconAlert, IconCheck, IconChevronDown, type IconType } from '../icons'
import { focus, type Severity } from './shared'
import { Badge } from './badge'

/* ── Tabs ──────────────────────────────────────────────────────────────── */
/* ── Tabs ──────────────────────────────────────────────────────────────── */
export type TabItem = { key: string; label: string; Icon?: IconType; badge?: string | number; disabled?: boolean }
export type TabVariant = 'underline' | 'pills' | 'boxed'
export type TabSize = 'sm' | 'md' | 'lg'

const TAB_PAD: Record<TabSize, string> = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function Tabs({
  tabs,
  value,
  onChange,
  variant = 'underline',
  size = 'md',
}: {
  tabs: (TabItem | string)[]
  value: string
  onChange: (v: string) => void
  variant?: TabVariant
  size?: TabSize
}) {
  const items: TabItem[] = tabs.map((t) => (typeof t === 'string' ? { key: t, label: t } : t))
  const iconSz = size === 'sm' ? 14 : size === 'lg' ? 18 : 16

  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-1">
        {items.map(({ key, label, Icon, badge, disabled }) => {
          const active = key === value
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => !disabled && onChange(key)}
              className={`${focus} inline-flex items-center gap-1.5 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${TAB_PAD[size]} ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-ink-soft hover:bg-ground hover:text-ink'
              }`}
            >
              {Icon && <Icon size={iconSz} weight={active ? 'fill' : 'regular'} />}
              {label}
              {badge !== undefined && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${active ? 'bg-white/25 text-white' : 'bg-slate-200 text-ink-muted'}`}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'boxed') {
    return (
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="inline-flex rounded-xl border border-line bg-canvas p-1">
        {items.map(({ key, label, Icon, badge, disabled }) => {
          const active = key === value
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => !disabled && onChange(key)}
              className={`${focus} inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${TAB_PAD[size]} ${
                active
                  ? 'bg-surface text-brand-700 shadow-sm ring-1 ring-line'
                  : 'text-ink-muted hover:text-ink-soft'
              }`}
            >
              {Icon && <Icon size={iconSz} weight={active ? 'fill' : 'regular'} />}
              {label}
              {badge !== undefined && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${active ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-ink-muted'}`}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
      </div>
    )
  }

  /* underline (default) */
  return (
    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full gap-1 border-b border-line">
        {items.map(({ key, label, Icon, badge, disabled }) => {
          const active = key === value
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => !disabled && onChange(key)}
              className={`${focus} relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${TAB_PAD[size]} ${
                active ? 'text-brand-700' : 'text-ink-muted hover:text-ink-soft'
              }`}
            >
              {Icon && <Icon size={iconSz} weight={active ? 'fill' : 'regular'} />}
              {label}
              {badge !== undefined && (
                <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${active ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-ink-muted'}`}>
                  {badge}
                </span>
              )}
              <span className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-500 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Breadcrumb ────────────────────────────────────────────────────────── */
export type BreadcrumbItem = { label: string; href?: string; Icon?: IconType }

export function Breadcrumb({
  items,
  maxItems = 0,
}: {
  items: BreadcrumbItem[]
  maxItems?: number
}) {
  const { t: tt } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const shouldCollapse = maxItems > 0 && items.length > maxItems && !expanded
  const visible: (BreadcrumbItem | null)[] = shouldCollapse
    ? [items[0], null, ...items.slice(-(maxItems - 1))]
    : items

  return (
    <nav aria-label={tt('ui.breadcrumb')} className="flex flex-wrap items-center gap-1 text-sm">
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1
        if (item === null) {
          return (
            <span key="ellipsis" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className={`${focus} rounded px-1 font-mono text-xs text-ink-muted hover:bg-ground hover:text-ink`}
                aria-label={tt('ui.showFullPath')}
              >
                …
              </button>
              <IconChevronDown className="h-3.5 w-3.5 rotate-[-90deg] text-slate-300" />
            </span>
          )
        }
        return (
          <span key={item.label} className="flex items-center gap-1">
            {item.href ? (
              <a
                href={item.href}
                className={`pance-focus flex items-center gap-1 rounded px-1 py-0.5 transition-colors ${
                  isLast ? 'font-medium text-ink' : 'text-ink-muted hover:text-brand-700'
                }`}
              >
                {item.Icon && <item.Icon size={14} />}
                {item.label}
              </a>
            ) : (
              <span className={`flex items-center gap-1 px-1 py-0.5 ${isLast ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                {item.Icon && <item.Icon size={14} />}
                {item.label}
              </span>
            )}
            {!isLast && <IconChevronDown className="h-3.5 w-3.5 shrink-0 rotate-[-90deg] text-slate-300" />}
          </span>
        )
      })}
    </nav>
  )
}

/* ── Steps / Stepper ───────────────────────────────────────────────────── */
export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error'
export type StepItem = { label: string; description?: string; status?: StepStatus }

export function Steps({
  steps,
  current,
  orientation = 'horizontal',
}: {
  steps: StepItem[]
  current: number
  orientation?: 'horizontal' | 'vertical'
}) {
  const resolved: (StepItem & { status: StepStatus })[] = steps.map((s, i) =>
    s.status
      ? { ...s, status: s.status }
      : { ...s, status: i < current ? 'complete' : i === current ? 'current' : 'upcoming' },
  )

  if (orientation === 'vertical') {
    return (
      <ol className="flex flex-col gap-0">
        {resolved.map((s, i) => {
          const last = i === resolved.length - 1
          return (
            <li key={s.label} className="relative flex gap-4">
              {!last && (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${s.status === 'complete' ? 'bg-brand-400' : 'bg-line'}`}
                />
              )}
              <span className="relative z-10 mt-1.5 flex shrink-0 flex-col items-center">
                <StepDot status={s.status} index={i + 1} />
              </span>
              <div className={`pb-8 ${last ? 'pb-0' : ''}`}>
                <p className={`text-sm font-semibold ${s.status === 'current' ? 'text-brand-700' : s.status === 'complete' ? 'text-ink' : s.status === 'error' ? 'text-danger' : 'text-ink-muted'}`}>
                  {s.label}
                </p>
                {s.description && <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{s.description}</p>}
              </div>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol className="flex items-start gap-0 overflow-x-auto">
      {resolved.map((s, i) => {
        const last = i === resolved.length - 1
        return (
          <li key={s.label} className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              {i > 0 && (
                <span className={`h-0.5 flex-1 ${resolved[i - 1].status === 'complete' ? 'bg-brand-400' : 'bg-line'}`} />
              )}
              <StepDot status={s.status} index={i + 1} />
              {!last && (
                <span className={`h-0.5 flex-1 ${s.status === 'complete' ? 'bg-brand-400' : 'bg-line'}`} />
              )}
            </div>
            <div className="max-w-[100px] text-center">
              <p className={`text-xs font-semibold leading-snug ${s.status === 'current' ? 'text-brand-700' : s.status === 'complete' ? 'text-ink' : s.status === 'error' ? 'text-danger' : 'text-ink-muted'}`}>
                {s.label}
              </p>
              {s.description && <p className="mt-0.5 text-[10px] leading-snug text-ink-muted">{s.description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function StepDot({ status, index }: { status: StepStatus; index: number }) {
  const base = 'grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold transition-colors'
  if (status === 'complete') return <span className={`${base} bg-brand-500 text-white`}><IconCheck className="h-4 w-4" /></span>
  if (status === 'current') return <span className={`${base} border-2 border-brand-500 bg-brand-50 text-brand-700`}>{index}</span>
  if (status === 'error') return <span className={`${base} border-2 border-danger bg-rose-50 text-danger`}><IconAlert className="h-4 w-4" /></span>
  return <span className={`${base} border-2 border-line bg-surface text-ink-muted`}>{index}</span>
}

/* ── NavMenu — vertical navigation list ────────────────────────────────── */
export type NavMenuItem = {
  key: string
  label: string
  Icon?: IconType
  badge?: string | number
  badgeSev?: Severity
  disabled?: boolean
  children?: Omit<NavMenuItem, 'children'>[]
}

export function NavMenu({
  items,
  value,
  onChange,
  collapsed = false,
}: {
  items: NavMenuItem[]
  value: string
  onChange: (key: string) => void
  collapsed?: boolean
}) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggleOpen = (k: string) =>
    setOpen((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = value === item.key || (item.children?.some((c) => c.key === value) ?? false)
        const expanded = open.has(item.key)
        const hasChildren = (item.children?.length ?? 0) > 0

        return (
          <div key={item.key}>
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (hasChildren) toggleOpen(item.key)
                else onChange(item.key)
              }}
              title={collapsed ? item.label : undefined}
              className={`${focus} group relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                active ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-ground hover:text-ink'
              }`}
            >
              {item.Icon && (
                <item.Icon size={18} weight={active ? 'fill' : 'regular'} className={`shrink-0 ${active ? 'text-brand-600' : 'text-ink-muted group-hover:text-ink-soft'}`} />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge severity={item.badgeSev ?? 'secondary'} variant="soft">{item.badge}</Badge>
                  )}
                  {hasChildren && (
                    <IconChevronDown size={14} className={`shrink-0 text-ink-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                  )}
                </>
              )}
            </button>
            {hasChildren && expanded && !collapsed && (
              <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-line-soft pl-3">
                {item.children!.map((child) => {
                  const childActive = value === child.key
                  return (
                    <button
                      key={child.key}
                      type="button"
                      disabled={child.disabled}
                      onClick={() => onChange(child.key)}
                      className={`${focus} flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        childActive ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink-soft hover:bg-ground hover:text-ink'
                      }`}
                    >
                      {child.Icon && <child.Icon size={15} weight={childActive ? 'fill' : 'regular'} className="shrink-0 text-ink-muted" />}
                      <span className="flex-1 truncate text-left">{child.label}</span>
                      {child.badge !== undefined && (
                        <Badge severity={child.badgeSev ?? 'secondary'} variant="soft">{child.badge}</Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
