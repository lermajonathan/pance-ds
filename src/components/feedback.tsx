/* Pance · Feedback — Alert, Progress, Skeleton, Toast, ToastStack */
import { type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { IconAlert, IconCheck, IconCheckCircle, IconInfo, IconQuestion, IconSparkle, IconX, type IconType } from '../icons'
import { focus, type Severity, type SurfaceVariant, TONE } from './shared'

/* ── Alert ──────────────────────────────────────────────────────────────────
   Shares the severity × variant model. Each severity owns a default glyph
   so meaning is carried by icon and text, not colour alone. */
const ALERT_ICON: Record<Severity, IconType> = {
  primary: IconInfo,
  secondary: IconInfo,
  success: IconCheckCircle,
  info: IconInfo,
  warning: IconAlert,
  help: IconQuestion,
  danger: IconAlert,
  contrast: IconInfo,
}

export function Alert({
  severity = 'primary',
  variant = 'soft',
  title,
  Icon,
  children,
  actions,
  onClose,
}: {
  severity?: Severity
  variant?: SurfaceVariant
  title: string
  Icon?: IconType
  children?: ReactNode
  actions?: ReactNode
  onClose?: () => void
}) {
  const { t: tt } = useI18n()
  const t = TONE[severity]
  const Glyph = Icon ?? ALERT_ICON[severity]
  const solid = variant === 'solid'
  const shell =
    variant === 'solid'
      ? `${t.solid} ${t.borderSolid} border`
      : variant === 'outlined'
        ? `border bg-surface ${t.borderStrong}`
        : `border ${t.bg} ${t.border}`

  return (
    <div
      role={severity === 'danger' || severity === 'warning' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl p-4 ${shell}`}
    >
      <Glyph size={20} weight="regular" aria-hidden className={`mt-0.5 shrink-0 ${solid ? 'text-white' : t.fg}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${solid ? 'text-white' : 'text-ink'}`}>{title}</p>
        {children && <p className={`mt-0.5 text-sm ${solid ? 'text-white/85' : 'text-ink-soft'}`}>{children}</p>}
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label={tt('ui.dismiss')}
          className={`${focus} -m-1 rounded-lg p-1 transition-colors ${solid ? 'text-white/80 hover:bg-white/20 hover:text-white' : 'text-ink-muted hover:bg-black/5 hover:text-ink'}`}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  )
}

/* ── Progress ──────────────────────────────────────────────────────────── */
export function Progress({
  value,
  severity = 'primary',
  showValue,
  label,
  valueText,
}: {
  value: number
  severity?: Severity
  showValue?: boolean
  /** Accessible name, e.g. "Upload progress". Required by WCAG 4.1.2 when there is no visible label. */
  label?: string
  /** Human-readable value for screen readers, e.g. "3 of 8 files". */
  valueText?: string
}) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        aria-valuetext={valueText}
      >
        <div className={`h-full rounded-full transition-all duration-500 ${TONE[severity].dot}`} style={{ width: `${pct}%` }} />
      </div>
      {showValue && <span aria-hidden className="w-9 shrink-0 text-right font-mono text-[11px] text-ink-muted">{pct}%</span>}
    </div>
  )
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */
/** Decorative placeholder. Mark the container that is loading with `aria-busy="true"`. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-slate-200/70 motion-reduce:animate-none ${className}`} />
}

/* ── Toast ─────────────────────────────────────────────────────────────── */
export type ToastSeverity = 'success' | 'info' | 'warning' | 'danger' | 'primary'
export type ToastItem = { id: string; severity: ToastSeverity; title: string; description?: string }

const TOAST_ICON: Record<ToastSeverity, IconType> = {
  success: IconCheck,
  info:    IconInfo,
  warning: IconAlert,
  danger:  IconAlert,
  primary: IconSparkle,
}

export function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const { t: tt } = useI18n()
  const t = TONE[item.severity]
  const Icon = TOAST_ICON[item.severity]
  return (
    <div
      role={item.severity === 'danger' ? 'alert' : 'status'}
      aria-atomic="true"
      className={`flex w-80 items-start gap-3 rounded-xl border p-4 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)] ${t.bg} ${t.border}`}>
      <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.solid} text-white`} aria-hidden>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${t.fg}`}>{item.title}</p>
        {item.description && <p className="mt-0.5 text-xs text-ink-muted">{item.description}</p>}
      </div>
      <button onClick={() => onDismiss(item.id)} aria-label={tt('ui.dismiss')} className="pance-focus -m-1 rounded-lg p-1 text-ink-muted hover:text-ink">
        <IconX className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastStack({
  toasts,
  onDismiss,
  label = 'Notifications',
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  /** Name of the notifications landmark. */
  label?: string
}) {
  // Each Toast is its own status/alert live region, so the stack is a plain labelled landmark.
  return (
    <section aria-label={label} className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => <Toast key={t.id} item={t} onDismiss={onDismiss} />)}
    </section>
  )
}
