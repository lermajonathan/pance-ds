/* Pance · Buttons — Button, IconButton, ButtonGroup, SplitButton, ToggleButton */
import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { IconChevronDown, IconSpinner, type IconType } from '../icons'
import { focus, type Severity } from './shared'
import { DropdownMenu } from './overlays'

/* ── Button ────────────────────────────────────────────────────────────────
   Severity (what it means) is orthogonal to variant (how loud it is).
   Class strings are written out in full so Tailwind can statically see them. */

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type IconPos = 'left' | 'right' | 'top' | 'bottom'

// Every value is a component token (tokens/components.json → button.color.*), which aliases semantic intents.
const SEV: Record<Severity, Record<ButtonVariant, string> & { raised: string }> = {
  primary: {
    filled: 'bg-(--pance-button-color-primary-filled-bg) text-(--pance-button-color-primary-filled-text) hover:bg-(--pance-button-color-primary-filled-bg-hover) active:bg-(--pance-button-color-primary-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-primary-outlined-border) text-(--pance-button-color-primary-outlined-text) hover:border-(--pance-button-color-primary-outlined-border-hover) hover:bg-(--pance-button-color-primary-outlined-bg-hover) active:bg-(--pance-button-color-primary-outlined-bg-active)',
    text: 'text-(--pance-button-color-primary-text-text) hover:bg-(--pance-button-color-primary-text-bg-hover) active:bg-(--pance-button-color-primary-text-bg-active)',
    link: 'text-(--pance-button-color-primary-link-text) underline decoration-(--pance-button-color-primary-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-primary-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-primary)',
  },
  secondary: {
    filled: 'bg-(--pance-button-color-secondary-filled-bg) text-(--pance-button-color-secondary-filled-text) hover:bg-(--pance-button-color-secondary-filled-bg-hover) active:bg-(--pance-button-color-secondary-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-secondary-outlined-border) text-(--pance-button-color-secondary-outlined-text) hover:border-(--pance-button-color-secondary-outlined-border-hover) hover:bg-(--pance-button-color-secondary-outlined-bg-hover) active:bg-(--pance-button-color-secondary-outlined-bg-active)',
    text: 'text-(--pance-button-color-secondary-text-text) hover:bg-(--pance-button-color-secondary-text-bg-hover) active:bg-(--pance-button-color-secondary-text-bg-active)',
    link: 'text-(--pance-button-color-secondary-link-text) underline decoration-(--pance-button-color-secondary-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-secondary-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-secondary)',
  },
  success: {
    filled: 'bg-(--pance-button-color-success-filled-bg) text-(--pance-button-color-success-filled-text) hover:bg-(--pance-button-color-success-filled-bg-hover) active:bg-(--pance-button-color-success-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-success-outlined-border) text-(--pance-button-color-success-outlined-text) hover:border-(--pance-button-color-success-outlined-border-hover) hover:bg-(--pance-button-color-success-outlined-bg-hover) active:bg-(--pance-button-color-success-outlined-bg-active)',
    text: 'text-(--pance-button-color-success-text-text) hover:bg-(--pance-button-color-success-text-bg-hover) active:bg-(--pance-button-color-success-text-bg-active)',
    link: 'text-(--pance-button-color-success-link-text) underline decoration-(--pance-button-color-success-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-success-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-success)',
  },
  info: {
    filled: 'bg-(--pance-button-color-info-filled-bg) text-(--pance-button-color-info-filled-text) hover:bg-(--pance-button-color-info-filled-bg-hover) active:bg-(--pance-button-color-info-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-info-outlined-border) text-(--pance-button-color-info-outlined-text) hover:border-(--pance-button-color-info-outlined-border-hover) hover:bg-(--pance-button-color-info-outlined-bg-hover) active:bg-(--pance-button-color-info-outlined-bg-active)',
    text: 'text-(--pance-button-color-info-text-text) hover:bg-(--pance-button-color-info-text-bg-hover) active:bg-(--pance-button-color-info-text-bg-active)',
    link: 'text-(--pance-button-color-info-link-text) underline decoration-(--pance-button-color-info-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-info-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-info)',
  },
  warning: {
    filled: 'bg-(--pance-button-color-warning-filled-bg) text-(--pance-button-color-warning-filled-text) hover:bg-(--pance-button-color-warning-filled-bg-hover) active:bg-(--pance-button-color-warning-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-warning-outlined-border) text-(--pance-button-color-warning-outlined-text) hover:border-(--pance-button-color-warning-outlined-border-hover) hover:bg-(--pance-button-color-warning-outlined-bg-hover) active:bg-(--pance-button-color-warning-outlined-bg-active)',
    text: 'text-(--pance-button-color-warning-text-text) hover:bg-(--pance-button-color-warning-text-bg-hover) active:bg-(--pance-button-color-warning-text-bg-active)',
    link: 'text-(--pance-button-color-warning-link-text) underline decoration-(--pance-button-color-warning-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-warning-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-warning)',
  },
  help: {
    filled: 'bg-(--pance-button-color-help-filled-bg) text-(--pance-button-color-help-filled-text) hover:bg-(--pance-button-color-help-filled-bg-hover) active:bg-(--pance-button-color-help-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-help-outlined-border) text-(--pance-button-color-help-outlined-text) hover:border-(--pance-button-color-help-outlined-border-hover) hover:bg-(--pance-button-color-help-outlined-bg-hover) active:bg-(--pance-button-color-help-outlined-bg-active)',
    text: 'text-(--pance-button-color-help-text-text) hover:bg-(--pance-button-color-help-text-bg-hover) active:bg-(--pance-button-color-help-text-bg-active)',
    link: 'text-(--pance-button-color-help-link-text) underline decoration-(--pance-button-color-help-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-help-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-help)',
  },
  danger: {
    filled: 'bg-(--pance-button-color-danger-filled-bg) text-(--pance-button-color-danger-filled-text) hover:bg-(--pance-button-color-danger-filled-bg-hover) active:bg-(--pance-button-color-danger-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-danger-outlined-border) text-(--pance-button-color-danger-outlined-text) hover:border-(--pance-button-color-danger-outlined-border-hover) hover:bg-(--pance-button-color-danger-outlined-bg-hover) active:bg-(--pance-button-color-danger-outlined-bg-active)',
    text: 'text-(--pance-button-color-danger-text-text) hover:bg-(--pance-button-color-danger-text-bg-hover) active:bg-(--pance-button-color-danger-text-bg-active)',
    link: 'text-(--pance-button-color-danger-link-text) underline decoration-(--pance-button-color-danger-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-danger-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-danger)',
  },
  contrast: {
    filled: 'bg-(--pance-button-color-contrast-filled-bg) text-(--pance-button-color-contrast-filled-text) hover:bg-(--pance-button-color-contrast-filled-bg-hover) active:bg-(--pance-button-color-contrast-filled-bg-active)',
    outlined: 'border border-(--pance-button-color-contrast-outlined-border) text-(--pance-button-color-contrast-outlined-text) hover:bg-(--pance-button-color-contrast-outlined-bg-hover) hover:text-(--pance-button-color-contrast-outlined-text-hover)',
    text: 'text-(--pance-button-color-contrast-text-text) hover:bg-(--pance-button-color-contrast-text-bg-hover) active:bg-(--pance-button-color-contrast-text-bg-active)',
    link: 'text-(--pance-button-color-contrast-link-text) underline decoration-(--pance-button-color-contrast-link-underline) underline-offset-2 hover:decoration-(--pance-button-color-contrast-link-underline-hover)',
    raised: 'shadow-(--pance-button-raised-contrast)',
  },
}

// Dimensions come from component tokens (tokens/components.json → button.size.*).
const SIZE: Record<ButtonSize, { pad: string; icon: string; square: string; gap: string }> = {
  sm: { pad: 'h-(--pance-button-size-sm-height) px-(--pance-button-size-sm-padding-x) text-(length:--pance-button-size-sm-font-size)', icon: 'size-(--pance-button-size-sm-icon)', square: 'size-(--pance-button-size-sm-height)', gap: 'gap-(--pance-button-size-sm-gap)' },
  md: { pad: 'h-(--pance-button-size-md-height) px-(--pance-button-size-md-padding-x) text-(length:--pance-button-size-md-font-size) leading-5', icon: 'size-(--pance-button-size-md-icon)', square: 'size-(--pance-button-size-md-height)', gap: 'gap-(--pance-button-size-md-gap)' },
  lg: { pad: 'h-(--pance-button-size-lg-height) px-(--pance-button-size-lg-padding-x) text-(length:--pance-button-size-lg-font-size)', icon: 'size-(--pance-button-size-lg-icon)', square: 'size-(--pance-button-size-lg-height)', gap: 'gap-(--pance-button-size-lg-gap)' },
}
const STACK: Record<ButtonSize, string> = {
  sm: 'h-auto flex-col px-(--pance-button-size-sm-padding-x) py-2 text-(length:--pance-button-size-sm-font-size)',
  md: 'h-auto flex-col px-(--pance-button-size-md-padding-x) py-2.5 text-(length:--pance-button-size-md-font-size) leading-5',
  lg: 'h-auto flex-col px-(--pance-button-size-lg-padding-x) py-3 text-(length:--pance-button-size-lg-font-size)',
}

export function Button({
  severity = 'primary',
  variant = 'filled',
  size = 'md',
  Icon,
  iconPos = 'left',
  rounded,
  raised,
  loading,
  badge,
  block,
  children,
  className = '',
  disabled,
  ...rest
}: {
  severity?: Severity
  variant?: ButtonVariant
  size?: ButtonSize
  Icon?: IconType
  iconPos?: IconPos
  rounded?: boolean
  raised?: boolean
  loading?: boolean
  badge?: string | number
  block?: boolean
  children?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const s = SIZE[size]
  const iconOnly = !children && !!Icon
  const stacked = iconPos === 'top' || iconPos === 'bottom'
  const Glyph = loading ? IconSpinner : Icon

  const shape = rounded ? 'rounded-(--pance-button-radius-rounded)' : variant === 'link' ? 'rounded-lg' : 'rounded-(--pance-button-radius)'
  const geometry = iconOnly
    ? `${s.square} ${rounded ? 'rounded-(--pance-button-radius-rounded)' : 'rounded-(--pance-button-radius)'}`
    : stacked
      ? `${STACK[size]} ${shape}`
      : `${s.pad} ${shape}`
  const inset = variant === 'link' ? 'px-1' : ''

  const glyph = Glyph ? <Glyph weight="regular" aria-hidden className={`${s.icon} shrink-0 ${loading ? 'animate-spin' : ''}`} /> : null

  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${focus} relative inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-(--pance-button-disabled-opacity) ${
        stacked ? 'gap-(--pance-button-size-sm-gap)' : s.gap
      } ${SEV[severity][variant]} ${raised ? SEV[severity].raised : ''} ${geometry} ${inset} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {(iconPos === 'left' || iconPos === 'top') && glyph}
      {children}
      {(iconPos === 'right' || iconPos === 'bottom') && glyph}
      {badge !== undefined && (
        <span
          className={`ml-1 grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-10 font-bold ${
            variant === 'filled' ? 'bg-black/25 text-white' : 'bg-current/10 text-current'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

export function IconButton({ Icon, label, className = '', ...rest }: { Icon: IconType; label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      className={`${focus} grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-primary-border hover:text-primary-fg ${className}`}
      {...rest}
    >
      <Icon size={18} aria-hidden />
    </button>
  )
}

/* ── Button group ──────────────────────────────────────────────────────── */
export function ButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex -space-x-px [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl [&>button]:rounded-none [&>button]:focus-visible:z-10">
      {children}
    </div>
  )
}

/* ── Split button ──────────────────────────────────────────────────────
   Primary action + a menu button (WAI-ARIA menu pattern via DropdownMenu). */
export function SplitButton({
  label,
  Icon,
  severity = 'primary',
  size = 'md',
  items,
  onClick,
  menuLabel,
}: {
  label: string
  Icon?: IconType
  severity?: Severity
  size?: ButtonSize
  items: { label: string; Icon?: IconType; onSelect?: () => void; danger?: boolean; disabled?: boolean }[]
  /** Primary action. */
  onClick?: () => void
  /** Accessible name of the arrow button. Defaults to the translated "More actions". */
  menuLabel?: string
}) {
  const { t: tt } = useI18n()
  const name = menuLabel ?? tt('ui.moreActions')
  return (
    <div className="relative inline-flex -space-x-px">
      <Button severity={severity} size={size} Icon={Icon} onClick={onClick} className="rounded-r-none focus-visible:z-10">
        {label}
      </Button>
      <DropdownMenu
        align="end"
        label={name}
        items={items.map((it) => ({ label: it.label, Icon: it.Icon, danger: it.danger, disabled: it.disabled, onClick: it.onSelect }))}
        trigger={
          <Button severity={severity} size={size} aria-label={name} className="rounded-l-none px-2 focus-visible:z-10">
            <IconChevronDown size={16} aria-hidden />
          </Button>
        }
      />
    </div>
  )
}

/* ── Toggle button ─────────────────────────────────────────────────────── */
export function ToggleButton({
  on,
  onChange,
  onLabel,
  offLabel,
  OnIcon,
  OffIcon,
  size = 'md',
}: {
  on: boolean
  onChange: (v: boolean) => void
  onLabel: string
  offLabel: string
  OnIcon?: IconType
  OffIcon?: IconType
  size?: ButtonSize
}) {
  return (
    <Button
      aria-pressed={on}
      severity={on ? 'primary' : 'secondary'}
      variant={on ? 'filled' : 'outlined'}
      size={size}
      Icon={on ? OnIcon : OffIcon}
      onClick={() => onChange(!on)}
    >
      {on ? onLabel : offLabel}
    </Button>
  )
}
