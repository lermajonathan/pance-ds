/* Pance · Badges — Badge, CountBadge */
import { type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { type IconType } from '../icons'
import { type Severity, type SurfaceVariant, TONE } from './shared'

/* ── Badge / Tag ────────────────────────────────────────────────────────────
   Same severity × variant model as Button: severity carries meaning,
   variant controls emphasis (soft → solid → outlined). */

export type BadgeSize = 'sm' | 'md' | 'lg'

const BADGE_SIZE: Record<BadgeSize, { wrap: string; dot: string; icon: string }> = {
  sm: { wrap: 'px-1.5 py-0.5 text-[10px] gap-1', dot: 'h-1.5 w-1.5', icon: 'h-2.5 w-2.5' },
  md: { wrap: 'px-2.5 py-1 text-xs gap-1.5', dot: 'h-1.5 w-1.5', icon: 'h-3 w-3' },
  lg: { wrap: 'px-3 py-1.5 text-sm gap-2', dot: 'h-2 w-2', icon: 'h-3.5 w-3.5' },
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
  const { t: tt } = useI18n()
  const t = TONE[severity]
  const sz = BADGE_SIZE[size]
  return (
    <span className={`inline-flex items-center font-medium ring-1 ${sz.wrap} ${rounded ? 'rounded-full' : 'rounded-md'} ${t[variant]}`}>
      {dot && <span className={`shrink-0 rounded-full ${sz.dot} ${variant === 'solid' ? 'bg-white/80' : t.dot}`} />}
      {Icon && !dot && <Icon className={`shrink-0 ${sz.icon}`} />}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`-mr-0.5 ml-0.5 rounded-full p-0.5 transition-colors ${variant === 'solid' ? 'hover:bg-white/20' : 'hover:bg-black/10'} focus:outline-none`}
          aria-label={tt('ui.remove')}
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
    <span className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1 py-0.5 font-mono text-[10px] font-bold leading-none ring-1 ${t.solid}`}>
      {label}
    </span>
  )
}
