/* Pance · Selection controls — Toggle, SwitchRow, Checkbox, Radio, RadioCard, SegmentedControl, CheckboxGroup */
import { IconCheck, type IconType } from '../icons'
import { focus } from './shared'

/* ── Selection controls ────────────────────────────────────────────────── */
/* ── Toggle / Switch ───────────────────────────────────────────────────── */
export type ToggleSize = 'sm' | 'md' | 'lg'

const TOGGLE_TRACK: Record<ToggleSize, string> = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
  lg: 'h-7 w-[52px]',
}
const TOGGLE_THUMB: Record<ToggleSize, { size: string; on: string; off: string }> = {
  sm: { size: 'h-3.5 w-3.5', on: 'left-[18px]', off: 'left-0.5' },
  md: { size: 'h-5 w-5', on: 'left-[22px]', off: 'left-0.5' },
  lg: { size: 'h-[22px] w-[22px]', on: 'left-[26px]', off: 'left-[3px]' },
}

export function Toggle({
  on,
  onChange,
  disabled,
  size = 'md',
}: {
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  size?: ToggleSize
}) {
  const t = TOGGLE_THUMB[size]
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`${focus} relative shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${TOGGLE_TRACK[size]} ${on ? 'bg-brand-700' : 'bg-slate-400'}`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-300 ${t.size} ${on ? t.on : t.off}`}
      />
    </button>
  )
}

/* ── SwitchRow — full-width labeled toggle row ─────────────────────────── */
export function SwitchRow({
  label,
  description,
  on,
  onChange,
  disabled,
  size = 'md',
}: {
  label: string
  description?: string
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  size?: ToggleSize
}) {
  return (
    <label className={`flex items-center justify-between gap-4 rounded-xl border border-line-soft bg-canvas p-4 transition-colors ${disabled ? 'opacity-45' : 'cursor-pointer hover:border-slate-300 hover:bg-ground'}`}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-ink-muted">{description}</span>}
      </span>
      <Toggle on={on} onChange={onChange} disabled={disabled} size={size} />
    </label>
  )
}

/* ── Checkbox ──────────────────────────────────────────────────────────── */
export type CheckboxSize = 'sm' | 'md' | 'lg'
const CB_SIZE: Record<CheckboxSize, { box: string; icon: string; text: string; gap: string }> = {
  sm: { box: 'h-4 w-4 rounded', icon: 'h-3 w-3', text: 'text-xs', gap: 'gap-2' },
  md: { box: 'h-5 w-5 rounded-md', icon: 'h-3.5 w-3.5', text: 'text-sm', gap: 'gap-2.5' },
  lg: { box: 'h-6 w-6 rounded-lg', icon: 'h-4 w-4', text: 'text-base', gap: 'gap-3' },
}

export function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  description,
  disabled,
  error,
  size = 'md',
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (v: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  error?: boolean
  size?: CheckboxSize
}) {
  const s = CB_SIZE[size]
  const boxState = indeterminate || checked
    ? error ? 'border-danger bg-danger text-white' : 'border-brand-700 bg-brand-700 text-white'
    : error ? 'border-danger bg-surface hover:border-danger' : 'border-slate-400 bg-surface hover:border-brand-600'

  return (
    <label className={`inline-flex items-start ${s.gap} ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`${focus} mt-0.5 grid shrink-0 place-items-center border transition-colors ${s.box} ${boxState}`}
      >
        {indeterminate
          ? <span className="block h-0.5 w-[55%] rounded-full bg-white" />
          : checked
          ? <IconCheck className={s.icon} />
          : null}
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className={`block font-medium ${s.text} ${disabled ? 'text-ink-muted' : error ? 'text-danger' : 'text-ink-soft'}`}>{label}</span>}
          {description && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  )
}

/* ── Radio ─────────────────────────────────────────────────────────────── */
export type RadioSize = 'sm' | 'md' | 'lg'
const RD_SIZE: Record<RadioSize, { dot: string; ring: string; text: string; gap: string; inner: string }> = {
  sm: { dot: 'h-4 w-4', ring: 'h-2 w-2', text: 'text-xs', gap: 'gap-2', inner: 'h-1.5 w-1.5' },
  md: { dot: 'h-5 w-5', ring: 'h-2.5 w-2.5', text: 'text-sm', gap: 'gap-2.5', inner: 'h-2.5 w-2.5' },
  lg: { dot: 'h-6 w-6', ring: 'h-3 w-3', text: 'text-base', gap: 'gap-3', inner: 'h-3 w-3' },
}

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled,
  error,
  size = 'md',
}: {
  checked: boolean
  onChange: () => void
  label?: string
  description?: string
  disabled?: boolean
  error?: boolean
  size?: RadioSize
}) {
  const s = RD_SIZE[size]
  const ringState = checked
    ? error ? 'border-danger' : 'border-brand-700'
    : error ? 'border-danger hover:border-danger' : 'border-slate-400 hover:border-brand-600'

  return (
    <label className={`inline-flex items-start ${s.gap} ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange()}
        className={`${focus} mt-0.5 grid shrink-0 place-items-center rounded-full border transition-colors ${s.dot} ${ringState}`}
      >
        <span
          className={`rounded-full transition-transform duration-200 ${s.inner} ${checked ? (error ? 'bg-danger scale-100' : 'bg-brand-700 scale-100') : 'scale-0 bg-brand-700'}`}
        />
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className={`block font-medium ${s.text} ${disabled ? 'text-ink-muted' : error ? 'text-danger' : 'text-ink-soft'}`}>{label}</span>}
          {description && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  )
}

/* ── RadioCard — full-width selectable card ────────────────────────────── */
export function RadioCard({
  checked,
  onChange,
  label,
  description,
  disabled,
  Icon: CardIcon,
  badge,
}: {
  checked: boolean
  onChange: () => void
  label: string
  description?: string
  disabled?: boolean
  Icon?: IconType
  badge?: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange()}
      className={`${focus} w-full rounded-xl border p-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${
        checked
          ? 'border-brand-400 bg-brand-50 shadow-[0_0_0_1px_var(--color-brand-400)]'
          : 'border-line bg-surface hover:border-slate-300 hover:bg-canvas'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {CardIcon && (
            <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${checked ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-ink-muted'}`}>
              <CardIcon size={16} />
            </span>
          )}
          <span className="min-w-0">
            <span className={`block text-sm font-semibold ${checked ? 'text-brand-700' : 'text-ink'}`}>{label}</span>
            {description && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge && <span className="rounded-full bg-brand-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-700">{badge}</span>}
          <span className={`grid h-5 w-5 place-items-center rounded-full border transition-colors ${checked ? 'border-brand-700' : 'border-slate-400'}`}>
            <span className={`h-2.5 w-2.5 rounded-full bg-brand-700 transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
          </span>
        </div>
      </div>
    </button>
  )
}

/* ── SegmentedControl — single-select button strip ─────────────────────── */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: {
  options: { value: T; label: string; Icon?: IconType }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const pad = size === 'sm' ? 'h-8 px-3 text-[13px]' : size === 'lg' ? 'h-11 px-5 text-base' : 'h-10 px-4 text-sm'
  const iconSz = size === 'sm' ? 14 : size === 'lg' ? 20 : 16
  return (
    <div className="inline-flex rounded-xl border border-line bg-canvas p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`${focus} inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 ${pad} ${
              active
                ? 'bg-surface text-brand-700 shadow-sm ring-1 ring-line'
                : 'text-ink-muted hover:text-ink-soft'
            }`}
          >
            {opt.Icon && <opt.Icon size={iconSz} weight={active ? 'fill' : 'regular'} />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── CheckboxGroup — select-all with indeterminate state ───────────────── */
export function CheckboxGroup({
  title,
  options,
  values,
  onChange,
}: {
  title?: string
  options: { value: string; label: string; description?: string }[]
  values: Set<string>
  onChange: (values: Set<string>) => void
}) {
  const allChecked = options.every((o) => values.has(o.value))
  const someChecked = options.some((o) => values.has(o.value))

  const toggleAll = () => {
    const next = new Set(values)
    if (allChecked) options.forEach((o) => next.delete(o.value))
    else options.forEach((o) => next.add(o.value))
    onChange(next)
  }

  const toggle = (v: string) => {
    const next = new Set(values)
    next.has(v) ? next.delete(v) : next.add(v)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2.5 border-b border-line-soft pb-3">
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            onChange={toggleAll}
            label={title}
          />
        </div>
      )}
      <div className="space-y-3 pl-1">
        {options.map((o) => (
          <Checkbox
            key={o.value}
            checked={values.has(o.value)}
            onChange={() => toggle(o.value)}
            label={o.label}
            description={o.description}
          />
        ))}
      </div>
    </div>
  )
}
