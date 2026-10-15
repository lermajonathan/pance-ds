/* Pance · Buttons — Button, IconButton, ButtonGroup, SplitButton, ToggleButton */
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { IconChevronDown, IconSpinner, type IconType } from '../icons'
import { focus, type Severity } from './shared'

/* ── Button ────────────────────────────────────────────────────────────────
   Severity (what it means) is orthogonal to variant (how loud it is).
   Class strings are written out in full so Tailwind can statically see them. */

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type IconPos = 'left' | 'right' | 'top' | 'bottom'

const SEV: Record<Severity, Record<ButtonVariant, string> & { raised: string }> = {
  primary: {
    filled: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
    outlined: 'border border-brand-300 text-brand-700 hover:border-brand-500 hover:bg-brand-50 active:bg-brand-100',
    text: 'text-brand-700 hover:bg-brand-50 active:bg-brand-100',
    link: 'text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(8,145,178,0.7)]',
  },
  secondary: {
    filled: 'bg-slate-600 text-white hover:bg-slate-700 active:bg-slate-800',
    outlined: 'border border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50 active:bg-slate-100',
    text: 'text-slate-700 hover:bg-slate-100 active:bg-slate-200',
    link: 'text-slate-700 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(71,85,105,0.55)]',
  },
  success: {
    filled: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900',
    outlined: 'border border-emerald-300 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 active:bg-emerald-100',
    text: 'text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100',
    link: 'text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(5,150,105,0.6)]',
  },
  info: {
    filled: 'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-900',
    outlined: 'border border-sky-300 text-sky-700 hover:border-sky-500 hover:bg-sky-50 active:bg-sky-100',
    text: 'text-sky-700 hover:bg-sky-50 active:bg-sky-100',
    link: 'text-sky-700 underline decoration-sky-300 underline-offset-2 hover:decoration-sky-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(2,132,199,0.6)]',
  },
  warning: {
    filled: 'bg-amber-700 text-white hover:bg-amber-800 active:bg-amber-900',
    outlined: 'border border-amber-300 text-amber-700 hover:border-amber-500 hover:bg-amber-50 active:bg-amber-100',
    text: 'text-amber-700 hover:bg-amber-50 active:bg-amber-100',
    link: 'text-amber-700 underline decoration-amber-300 underline-offset-2 hover:decoration-amber-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(245,158,11,0.6)]',
  },
  help: {
    filled: 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
    outlined: 'border border-violet-300 text-violet-700 hover:border-violet-500 hover:bg-violet-50 active:bg-violet-100',
    text: 'text-violet-700 hover:bg-violet-50 active:bg-violet-100',
    link: 'text-violet-700 underline decoration-violet-300 underline-offset-2 hover:decoration-violet-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(124,58,237,0.6)]',
  },
  danger: {
    filled: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
    outlined: 'border border-rose-300 text-rose-700 hover:border-rose-500 hover:bg-rose-50 active:bg-rose-100',
    text: 'text-rose-700 hover:bg-rose-50 active:bg-rose-100',
    link: 'text-rose-700 underline decoration-rose-300 underline-offset-2 hover:decoration-rose-600',
    raised: 'shadow-[0_6px_16px_-6px_rgba(225,29,72,0.6)]',
  },
  contrast: {
    filled: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950',
    outlined: 'border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
    text: 'text-slate-900 hover:bg-slate-200 active:bg-slate-300',
    link: 'text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900',
    raised: 'shadow-[0_6px_16px_-6px_rgba(15,23,42,0.7)]',
  },
}

const SIZE: Record<ButtonSize, { pad: string; icon: number; square: string; gap: string }> = {
  sm: { pad: 'h-8 px-3 text-[13px]', icon: 16, square: 'h-8 w-8', gap: 'gap-1.5' },
  md: { pad: 'h-10 px-4 text-sm', icon: 18, square: 'h-10 w-10', gap: 'gap-2' },
  lg: { pad: 'h-12 px-6 text-base', icon: 22, square: 'h-12 w-12', gap: 'gap-2.5' },
}
const STACK: Record<ButtonSize, string> = {
  sm: 'h-auto flex-col px-3 py-2 text-[13px]',
  md: 'h-auto flex-col px-4 py-2.5 text-sm',
  lg: 'h-auto flex-col px-6 py-3 text-base',
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

  const shape = rounded ? 'rounded-full' : variant === 'link' ? 'rounded-lg' : 'rounded-xl'
  const geometry = iconOnly
    ? `${s.square} ${rounded ? 'rounded-full' : 'rounded-xl'}`
    : stacked
      ? `${STACK[size]} ${shape}`
      : `${s.pad} ${shape}`
  const inset = variant === 'link' ? 'px-1' : ''

  const glyph = Glyph ? <Glyph size={s.icon} weight="regular" className={loading ? 'animate-spin' : ''} /> : null

  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${focus} relative inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${
        stacked ? 'gap-1.5' : s.gap
      } ${SEV[severity][variant]} ${raised ? SEV[severity].raised : ''} ${geometry} ${inset} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {(iconPos === 'left' || iconPos === 'top') && glyph}
      {children}
      {(iconPos === 'right' || iconPos === 'bottom') && glyph}
      {badge !== undefined && (
        <span
          className={`ml-1 grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-[10px] font-bold ${
            variant === 'filled' ? 'bg-white/25 text-white' : 'bg-current/10 text-current'
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
      className={`${focus} grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-brand-200 hover:text-brand-700 ${className}`}
      {...rest}
    >
      <Icon size={18} />
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

/* ── Split button ──────────────────────────────────────────────────────── */
export function SplitButton({
  label,
  Icon,
  severity = 'primary',
  size = 'md',
  items,
}: {
  label: string
  Icon?: IconType
  severity?: Severity
  size?: ButtonSize
  items: { label: string; Icon?: IconType; onSelect?: () => void; danger?: boolean }[]
}) {
  const { t: tt } = useI18n()
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
      <div className="inline-flex -space-x-px">
        <Button severity={severity} size={size} Icon={Icon} className="rounded-r-none">
          {label}
        </Button>
        <Button severity={severity} size={size} aria-label={tt('ui.moreActions')} onClick={() => setOpen((o) => !o)} className="rounded-l-none px-2">
          <IconChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)]">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                it.onSelect?.()
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                it.danger ? 'text-danger hover:bg-danger-soft' : 'text-ink-soft hover:bg-ground'
              }`}
            >
              {it.Icon && <it.Icon size={16} />}
              {it.label}
            </button>
          ))}
        </div>
      )}
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
