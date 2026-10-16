/* Pance · Navigation — Tabs, Breadcrumb, Steps, NavMenu */
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconAlert, IconCheck, IconChevronDown, IconExternal, type IconType } from '../icons'
import { focus, type Severity } from './shared'
import { Badge } from './badge'
import { listKeyNav } from './a11y'

/* ── Tabs ──────────────────────────────────────────────────────────────
   WAI-ARIA tabs pattern with automatic activation: arrows move and select,
   Home/End jump, only the selected tab is in the Tab order. Pass `id` and
   render each panel with <TabPanel tabsId={id} tabKey=…> to link them. */
export type TabItem = { key: string; label: string; Icon?: IconType; badge?: string | number; disabled?: boolean }
export type TabVariant = 'underline' | 'pills' | 'boxed'
export type TabSize = 'sm' | 'md' | 'lg'

const TAB_PAD: Record<TabSize, string> = {
  sm: 'px-(--pance-tabs-size-sm-padding-x) py-(--pance-tabs-size-sm-padding-y) text-13',
  md: 'px-(--pance-tabs-size-md-padding-x) py-(--pance-tabs-size-md-padding-y) text-sm',
  lg: 'px-(--pance-tabs-size-lg-padding-x) py-(--pance-tabs-size-lg-padding-y) text-base',
}

const TAB_LOOK: Record<TabVariant, { list: string; tab: string; on: string; off: string; badgeOn: string; badgeOff: string }> = {
  pills: {
    list: 'flex flex-wrap gap-1',
    tab: 'rounded-xl',
    on: 'bg-(--pance-tabs-color-pill-active-bg) text-(--pance-tabs-color-pill-active-text) shadow-sm',
    off: 'text-ink-soft hover:bg-ground hover:text-ink',
    badgeOn: 'ml-0.5 bg-current/20 text-current',
    badgeOff: 'ml-0.5 bg-line text-ink-muted',
  },
  boxed: {
    list: 'inline-flex rounded-xl border border-line bg-canvas p-1',
    tab: 'shrink-0 whitespace-nowrap rounded-lg',
    on: 'bg-surface text-primary-fg shadow-sm ring-1 ring-line',
    off: 'text-ink-muted hover:text-ink-soft',
    badgeOn: 'ml-0.5 bg-primary-soft-hover text-primary-fg',
    badgeOff: 'ml-0.5 bg-line text-ink-muted',
  },
  underline: {
    list: 'flex w-max min-w-full gap-1 border-b border-line',
    tab: 'relative shrink-0 whitespace-nowrap',
    on: 'text-primary-fg',
    off: 'text-ink-muted hover:text-ink-soft',
    badgeOn: 'bg-primary-soft-hover text-primary-fg',
    badgeOff: 'bg-line text-ink-muted',
  },
}

export const tabId = (tabsId: string, key: string) => `${tabsId}-tab-${key}`
export const tabPanelId = (tabsId: string, key: string) => `${tabsId}-panel-${key}`

export function Tabs({
  tabs,
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  label,
  id,
}: {
  tabs: (TabItem | string)[]
  value: string
  onChange: (v: string) => void
  variant?: TabVariant
  size?: TabSize
  /** Accessible name of the tab list, e.g. "Report sections". */
  label?: string
  /** Set it to link tabs to <TabPanel>s with aria-controls. */
  id?: string
}) {
  const items: TabItem[] = tabs.map((t) => (typeof t === 'string' ? { key: t, label: t } : t))
  const iconSz = size === 'sm' ? 14 : size === 'lg' ? 18 : 16
  const look = TAB_LOOK[variant]
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selected = Math.max(0, items.findIndex((t) => t.key === value))

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = listKeyNav(e.key, i, items.length, (n) => !!items[n].disabled, 'horizontal')
    if (next === null) return
    e.preventDefault()
    refs.current[next]?.focus()
    onChange(items[next].key)
  }

  const list = (
    <div role="tablist" aria-label={label} aria-orientation="horizontal" className={look.list}>
      {items.map(({ key, label: text, Icon, badge, disabled }, i) => {
        const active = i === selected
        return (
          <button
            key={key}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="tab"
            id={id ? tabId(id, key) : undefined}
            aria-selected={active}
            aria-controls={id ? tabPanelId(id, key) : undefined}
            tabIndex={active ? 0 : -1}
            disabled={disabled}
            onClick={() => !disabled && onChange(key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`${focus} inline-flex items-center gap-1.5 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${look.tab} ${TAB_PAD[size]} ${active ? look.on : look.off}`}
          >
            {Icon && <Icon size={iconSz} weight={active ? 'fill' : 'regular'} aria-hidden />}
            {text}
            {badge !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 font-mono text-10 font-bold ${active ? look.badgeOn : look.badgeOff}`}>{badge}</span>
            )}
            {variant === 'underline' && (
              <span aria-hidden className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary-solid transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </button>
        )
      })}
    </div>
  )

  if (variant === 'pills') return list
  return <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{list}</div>
}

/** Panel linked to a tab of <Tabs id={tabsId}>. Render only the selected one. */
export function TabPanel({ tabsId, tabKey, className = '', children }: { tabsId: string; tabKey: string; className?: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={tabPanelId(tabsId, tabKey)} aria-labelledby={tabId(tabsId, tabKey)} tabIndex={0} className={`pance-focus rounded-lg ${className}`}>
      {children}
    </div>
  )
}

/* ── Breadcrumb ────────────────────────────────────────────────────────── */
export type BreadcrumbItem = { label: string; href?: string; Icon?: IconType }

export function Breadcrumb({
  items,
  maxItems = 0,
  label,
}: {
  items: BreadcrumbItem[]
  maxItems?: number
  /** Landmark name. Defaults to the translated "Breadcrumb"; make it unique when a page has several. */
  label?: string
}) {
  const tt = useLabels()
  const [expanded, setExpanded] = useState(false)
  const shouldCollapse = maxItems > 0 && items.length > maxItems && !expanded
  const visible: (BreadcrumbItem | null)[] = shouldCollapse
    ? [items[0], null, ...items.slice(-(maxItems - 1))]
    : items

  return (
    <nav aria-label={label ?? tt.breadcrumb} className="flex flex-wrap items-center gap-1 text-sm">
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1
        if (item === null) {
          return (
            <span key="ellipsis" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className={`${focus} rounded px-1 font-mono text-xs text-ink-muted hover:bg-ground hover:text-ink`}
                aria-label={tt.showFullPath}
              >
                …
              </button>
              <IconChevronDown aria-hidden className="h-3.5 w-3.5 rotate-[-90deg] text-line-strong" />
            </span>
          )
        }
        return (
          <span key={item.label} className="flex items-center gap-1">
            {item.href ? (
              <a
                href={item.href}
                aria-current={isLast ? 'page' : undefined}
                className={`pance-focus flex items-center gap-1 rounded px-1 py-0.5 transition-colors ${
                  isLast ? 'font-medium text-ink' : 'text-ink-muted hover:text-primary-fg'
                }`}
              >
                {item.Icon && <item.Icon size={14} />}
                {item.label}
              </a>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={`flex items-center gap-1 px-1 py-0.5 ${isLast ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                {item.Icon && <item.Icon size={14} />}
                {item.label}
              </span>
            )}
            {!isLast && <IconChevronDown aria-hidden className="h-3.5 w-3.5 shrink-0 rotate-[-90deg] text-line-strong" />}
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
  label,
  statusText = { complete: 'completed', error: 'has an error' },
}: {
  steps: StepItem[]
  current: number
  orientation?: 'horizontal' | 'vertical'
  /** Accessible name of the list, e.g. "Onboarding progress". */
  label?: string
  /** Screen-reader suffix for complete and error steps (translate it). */
  statusText?: { complete: string; error: string }
}) {
  const sr = (st: StepStatus) =>
    st === 'complete' || st === 'error' ? <span className="sr-only">, {statusText[st]}</span> : null
  const resolved: (StepItem & { status: StepStatus })[] = steps.map((s, i) =>
    s.status
      ? { ...s, status: s.status }
      : { ...s, status: i < current ? 'complete' : i === current ? 'current' : 'upcoming' },
  )

  if (orientation === 'vertical') {
    return (
      <ol aria-label={label} className="flex flex-col gap-0">
        {resolved.map((s, i) => {
          const last = i === resolved.length - 1
          return (
            <li key={s.label} aria-current={s.status === 'current' ? 'step' : undefined} className="relative flex gap-4">
              {!last && (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${s.status === 'complete' ? 'bg-(--pance-steps-color-connector-complete)' : 'bg-line'}`}
                />
              )}
              <span aria-hidden className="relative z-10 mt-1.5 flex shrink-0 flex-col items-center">
                <StepDot status={s.status} index={i + 1} />
              </span>
              <div className={`pb-8 ${last ? 'pb-0' : ''}`}>
                <p className={`text-sm font-semibold ${s.status === 'current' ? 'text-primary-fg' : s.status === 'complete' ? 'text-ink' : s.status === 'error' ? 'text-danger' : 'text-ink-muted'}`}>
                  {s.label}
                  {sr(s.status)}
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
    <ol aria-label={label} className="flex items-start gap-0 overflow-x-auto">
      {resolved.map((s, i) => {
        const last = i === resolved.length - 1
        return (
          <li key={s.label} aria-current={s.status === 'current' ? 'step' : undefined} className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
            <div aria-hidden className="flex w-full items-center">
              {i > 0 && (
                <span className={`h-0.5 flex-1 ${resolved[i - 1].status === 'complete' ? 'bg-(--pance-steps-color-connector-complete)' : 'bg-line'}`} />
              )}
              <StepDot status={s.status} index={i + 1} />
              {!last && (
                <span className={`h-0.5 flex-1 ${s.status === 'complete' ? 'bg-(--pance-steps-color-connector-complete)' : 'bg-line'}`} />
              )}
            </div>
            <div className="max-w-(--pance-steps-label-max-width) text-center">
              <p className={`text-xs font-semibold leading-snug ${s.status === 'current' ? 'text-primary-fg' : s.status === 'complete' ? 'text-ink' : s.status === 'error' ? 'text-danger' : 'text-ink-muted'}`}>
                {s.label}
                {sr(s.status)}
              </p>
              {s.description && <p className="mt-0.5 text-10 leading-snug text-ink-muted">{s.description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function StepDot({ status, index }: { status: StepStatus; index: number }) {
  const base = 'grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-13 font-bold transition-colors'
  if (status === 'complete') return <span className={`${base} bg-(--pance-steps-color-complete) text-primary-on-solid`}><IconCheck className="h-4 w-4" /></span>
  if (status === 'current') return <span className={`${base} border-2 border-primary-solid bg-primary-soft text-primary-fg`}>{index}</span>
  if (status === 'error') return <span className={`${base} border-2 border-danger bg-danger-soft text-danger`}><IconAlert className="h-4 w-4" /></span>
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
  label,
}: {
  items: NavMenuItem[]
  value: string
  onChange: (key: string) => void
  collapsed?: boolean
  /** Name of the navigation landmark, e.g. "Main". Needed when a page has more than one <nav>. */
  label?: string
}) {
  const uid = useId()
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggleOpen = (k: string) =>
    setOpen((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

  return (
    <nav aria-label={label} className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = value === item.key || (item.children?.some((c) => c.key === value) ?? false)
        const expanded = open.has(item.key)
        const hasChildren = (item.children?.length ?? 0) > 0

        return (
          <div key={item.key}>
            <button
              type="button"
              disabled={item.disabled}
              aria-expanded={hasChildren ? expanded : undefined}
              aria-controls={hasChildren && expanded && !collapsed ? `${uid}-${item.key}` : undefined}
              aria-current={!hasChildren && value === item.key ? 'page' : undefined}
              aria-label={collapsed ? item.label : undefined}
              onClick={() => {
                if (hasChildren) toggleOpen(item.key)
                else onChange(item.key)
              }}
              title={collapsed ? item.label : undefined}
              className={`${focus} group relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${
                active ? 'bg-primary-soft text-primary-fg' : 'text-ink-soft hover:bg-ground hover:text-ink'
              }`}
            >
              {item.Icon && (
                <item.Icon aria-hidden size={18} weight={active ? 'fill' : 'regular'} className={`shrink-0 ${active ? 'text-primary-fg' : 'text-ink-muted group-hover:text-ink-soft'}`} />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge severity={item.badgeSev ?? 'secondary'} variant="soft">{item.badge}</Badge>
                  )}
                  {hasChildren && (
                    <IconChevronDown aria-hidden size={14} className={`shrink-0 text-ink-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                  )}
                </>
              )}
            </button>
            {hasChildren && expanded && !collapsed && (
              <div id={`${uid}-${item.key}`} className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-line-soft pl-3">
                {item.children!.map((child) => {
                  const childActive = value === child.key
                  return (
                    <button
                      key={child.key}
                      type="button"
                      disabled={child.disabled}
                      aria-current={childActive ? 'page' : undefined}
                      onClick={() => onChange(child.key)}
                      className={`${focus} flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${
                        childActive ? 'bg-primary-soft font-medium text-primary-fg' : 'text-ink-soft hover:bg-ground hover:text-ink'
                      }`}
                    >
                      {child.Icon && <child.Icon aria-hidden size={15} weight={childActive ? 'fill' : 'regular'} className="shrink-0 text-ink-muted" />}
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

/* ── Link ──────────────────────────────────────────────────────────────
   An anchor styled as a link. It is always underlined, so it is not told apart by colour alone
   (WCAG 1.4.1). `external` opens a new tab with rel="noopener noreferrer", shows an icon and
   announces "opens in a new tab". Use `render` to hand the styles to your router's link. */
export function Link({
  variant = 'default', external, children, className = '', render, ...rest
}: {
  variant?: 'default' | 'subtle'
  external?: boolean
  render?: (props: { className: string; children: ReactNode }) => ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { children: ReactNode }) {
  const tt = useLabels()
  const cls = `${focus} rounded-sm underline decoration-1 underline-offset-4 ${variant === 'subtle' ? 'text-ink hover:text-link' : 'text-link hover:decoration-2'} ${className}`
  const content = (
    <>
      {children}
      {external && (
        <>
          <IconExternal aria-hidden className="ml-1 inline size-[1em] align-[-0.1em]" />
          <span className="sr-only"> ({tt.opensInNewTab})</span>
        </>
      )}
    </>
  )
  if (render) return <>{render({ className: cls, children: content })}</>
  return (
    <a className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {content}
    </a>
  )
}
