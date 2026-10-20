/* Pance · Badges — Badge, CountBadge */
import { type ReactNode } from 'react'
import { useLabels } from './labels'
import { type IconType } from '../icons'
import { focus, type Severity, type SurfaceVariant, TONE } from './shared'
import { hitArea } from './a11y'

/* ── Badge / Tag ────────────────────────────────────────────────────────────
   Same severity × variant model as Button: severity carries meaning,
   variant controls emphasis (soft → solid → outlined). */

export type BadgeSize = 'sm' | 'md' | 'lg'

const BADGE_SIZE: Record<BadgeSize, { wrap: string; dot: string; icon: string }> = {
  sm: { wrap: 'px-(--pance-badge-size-sm-padding-x) py-(--pance-badge-size-sm-padding-y) text-10 gap-(--pance-badge-size-sm-gap)', dot: 'size-(--pance-badge-size-sm-dot)', icon: 'size-(--pance-badge-size-sm-icon)' },
  md: { wrap: 'px-(--pance-badge-size-md-padding-x) py-(--pance-badge-size-md-padding-y) text-xs gap-(--pance-badge-size-md-gap)', dot: 'size-(--pance-badge-size-md-dot)', icon: 'size-(--pance-badge-size-md-icon)' },
  lg: { wrap: 'px-(--pance-badge-size-lg-padding-x) py-(--pance-badge-size-lg-padding-y) text-sm gap-(--pance-badge-size-lg-gap)', dot: 'size-(--pance-badge-size-lg-dot)', icon: 'size-(--pance-badge-size-lg-icon)' },
}

// Component tokens (tokens/components.json → badge.color.*), aliasing semantic intents.
const BADGE_TONE: Record<Severity, Record<SurfaceVariant, string> & { dot: string }> = {
  primary: { soft: 'bg-(--pance-badge-color-primary-soft-bg) text-(--pance-badge-color-primary-soft-text) ring-(--pance-badge-color-primary-soft-ring)', solid: 'bg-(--pance-badge-color-primary-solid-bg) text-(--pance-badge-color-primary-solid-text) ring-(--pance-badge-color-primary-solid-bg)', outlined: 'bg-(--pance-badge-color-primary-outlined-bg) text-(--pance-badge-color-primary-outlined-text) ring-(--pance-badge-color-primary-outlined-ring)', dot: 'bg-(--pance-badge-color-primary-dot)' },
  secondary: { soft: 'bg-(--pance-badge-color-secondary-soft-bg) text-(--pance-badge-color-secondary-soft-text) ring-(--pance-badge-color-secondary-soft-ring)', solid: 'bg-(--pance-badge-color-secondary-solid-bg) text-(--pance-badge-color-secondary-solid-text) ring-(--pance-badge-color-secondary-solid-bg)', outlined: 'bg-(--pance-badge-color-secondary-outlined-bg) text-(--pance-badge-color-secondary-outlined-text) ring-(--pance-badge-color-secondary-outlined-ring)', dot: 'bg-(--pance-badge-color-secondary-dot)' },
  success: { soft: 'bg-(--pance-badge-color-success-soft-bg) text-(--pance-badge-color-success-soft-text) ring-(--pance-badge-color-success-soft-ring)', solid: 'bg-(--pance-badge-color-success-solid-bg) text-(--pance-badge-color-success-solid-text) ring-(--pance-badge-color-success-solid-bg)', outlined: 'bg-(--pance-badge-color-success-outlined-bg) text-(--pance-badge-color-success-outlined-text) ring-(--pance-badge-color-success-outlined-ring)', dot: 'bg-(--pance-badge-color-success-dot)' },
  info: { soft: 'bg-(--pance-badge-color-info-soft-bg) text-(--pance-badge-color-info-soft-text) ring-(--pance-badge-color-info-soft-ring)', solid: 'bg-(--pance-badge-color-info-solid-bg) text-(--pance-badge-color-info-solid-text) ring-(--pance-badge-color-info-solid-bg)', outlined: 'bg-(--pance-badge-color-info-outlined-bg) text-(--pance-badge-color-info-outlined-text) ring-(--pance-badge-color-info-outlined-ring)', dot: 'bg-(--pance-badge-color-info-dot)' },
  warning: { soft: 'bg-(--pance-badge-color-warning-soft-bg) text-(--pance-badge-color-warning-soft-text) ring-(--pance-badge-color-warning-soft-ring)', solid: 'bg-(--pance-badge-color-warning-solid-bg) text-(--pance-badge-color-warning-solid-text) ring-(--pance-badge-color-warning-solid-bg)', outlined: 'bg-(--pance-badge-color-warning-outlined-bg) text-(--pance-badge-color-warning-outlined-text) ring-(--pance-badge-color-warning-outlined-ring)', dot: 'bg-(--pance-badge-color-warning-dot)' },
  help: { soft: 'bg-(--pance-badge-color-help-soft-bg) text-(--pance-badge-color-help-soft-text) ring-(--pance-badge-color-help-soft-ring)', solid: 'bg-(--pance-badge-color-help-solid-bg) text-(--pance-badge-color-help-solid-text) ring-(--pance-badge-color-help-solid-bg)', outlined: 'bg-(--pance-badge-color-help-outlined-bg) text-(--pance-badge-color-help-outlined-text) ring-(--pance-badge-color-help-outlined-ring)', dot: 'bg-(--pance-badge-color-help-dot)' },
  danger: { soft: 'bg-(--pance-badge-color-danger-soft-bg) text-(--pance-badge-color-danger-soft-text) ring-(--pance-badge-color-danger-soft-ring)', solid: 'bg-(--pance-badge-color-danger-solid-bg) text-(--pance-badge-color-danger-solid-text) ring-(--pance-badge-color-danger-solid-bg)', outlined: 'bg-(--pance-badge-color-danger-outlined-bg) text-(--pance-badge-color-danger-outlined-text) ring-(--pance-badge-color-danger-outlined-ring)', dot: 'bg-(--pance-badge-color-danger-dot)' },
  contrast: { soft: 'bg-(--pance-badge-color-contrast-soft-bg) text-(--pance-badge-color-contrast-soft-text) ring-(--pance-badge-color-contrast-soft-ring)', solid: 'bg-(--pance-badge-color-contrast-solid-bg) text-(--pance-badge-color-contrast-solid-text) ring-(--pance-badge-color-contrast-solid-bg)', outlined: 'bg-(--pance-badge-color-contrast-outlined-bg) text-(--pance-badge-color-contrast-outlined-text) ring-(--pance-badge-color-contrast-outlined-ring)', dot: 'bg-(--pance-badge-color-contrast-dot)' },
}

export function Badge({
  severity = 'secondary',
  variant = 'soft',
  dot,
  rounded = true,
  size = 'md',
  Icon,
  onRemove,
  children,
}: {
  severity?: Severity
  variant?: SurfaceVariant
  dot?: boolean
  rounded?: boolean
  size?: BadgeSize
  Icon?: IconType
  onRemove?: () => void
  children: ReactNode
}) {
  const tt = useLabels()
  const t = BADGE_TONE[severity]
  const sz = BADGE_SIZE[size]
  return (
    <span className={`inline-flex items-center font-medium ring-1 ${sz.wrap} ${rounded ? 'rounded-full' : 'rounded-md'} ${t[variant]}`}>
      {dot && <span className={`shrink-0 rounded-full ${sz.dot} ${variant === 'solid' ? 'bg-current opacity-80' : t.dot}`} />}
      {Icon && !dot && <Icon className={`shrink-0 ${sz.icon}`} />}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`${focus} ${hitArea} -mr-0.5 ml-0.5 rounded-full p-0.5 transition-colors hover:bg-current/15`}
          aria-label={typeof children === 'string' ? `${tt.remove} ${children}` : tt.remove}
        >
          <svg className={sz.icon} viewBox="0 0 12 12" fill="none">
            <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  )
}

export function CountBadge({ count, max = 99, severity = 'danger' }: { count: number; max?: number; severity?: Severity }) {
  const t = TONE[severity]
  const label = count > max ? `${max}+` : String(count)
  return (
    <span className={`inline-flex min-w-(--pance-badge-count-min-width) items-center justify-center rounded-full px-1 py-0.5 font-mono text-10 font-bold leading-none ring-1 ${t.solid}`}>
      {label}
    </span>
  )
}
