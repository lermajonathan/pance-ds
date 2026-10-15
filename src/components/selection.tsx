/* Pance · Selection controls — Toggle, SwitchRow, Checkbox, Radio, RadioCard, SegmentedControl, CheckboxGroup */
import { useId, useRef, type KeyboardEvent, type Ref } from 'react'
import { IconCheck, type IconType } from '../icons'
import { focus } from './shared'
import { listKeyNav } from './a11y'

/* ── Selection controls ────────────────────────────────────────────────── */
/* ── Toggle / Switch ───────────────────────────────────────────────────── */
export type ToggleSize = 'sm' | 'md' | 'lg'

const TOGGLE_TRACK: Record<ToggleSize, string> = {
  sm: 'h-(--pance-toggle-size-sm-track-height) w-(--pance-toggle-size-sm-track-width)',
  md: 'h-(--pance-toggle-size-md-track-height) w-(--pance-toggle-size-md-track-width)',
  lg: 'h-(--pance-toggle-size-lg-track-height) w-(--pance-toggle-size-lg-track-width)',
}
const TOGGLE_THUMB: Record<ToggleSize, { size: string; on: string; off: string }> = {
  sm: { size: 'size-(--pance-toggle-size-sm-thumb)', on: 'left-[18px]', off: 'left-0.5' },
  md: { size: 'size-(--pance-toggle-size-md-thumb)', on: 'left-[22px]', off: 'left-0.5' },
  lg: { size: 'size-(--pance-toggle-size-lg-thumb)', on: 'left-[26px]', off: 'left-[3px]' },
}

export function Toggle({
  on,
  onChange,
  disabled,
  size = 'md',
  label,
  labelledBy,
  describedBy,
}: {
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  size?: ToggleSize
  /** Accessible name. Required unless the switch sits inside a <label> or SwitchRow. */
  label?: string
  labelledBy?: string
  describedBy?: string
}) {
  const t = TOGGLE_THUMB[size]
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`${focus} relative shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${TOGGLE_TRACK[size]} ${on ? 'bg-(--pance-toggle-color-track-on)' : 'bg-(--pance-toggle-color-track-off)'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-(--pance-toggle-color-thumb) shadow-sm transition-all duration-300 ${t.size} ${on ? t.on : t.off}`}
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
  const id = useId()
  return (
    <label className={`flex items-center justify-between gap-4 rounded-xl border border-line-soft bg-canvas p-4 transition-colors ${disabled ? 'opacity-(--pance-opacity-disabled)' : 'cursor-pointer hover:border-line-strong hover:bg-ground'}`}>
      <span className="min-w-0">
        <span id={`${id}-l`} className="block text-sm font-medium text-ink">{label}</span>
        {description && <span id={`${id}-d`} className="mt-0.5 block text-xs text-ink-muted">{description}</span>}
      </span>
      <Toggle on={on} onChange={onChange} disabled={disabled} size={size} labelledBy={`${id}-l`} describedBy={description ? `${id}-d` : undefined} />
    </label>
  )
}

/* ── Checkbox ──────────────────────────────────────────────────────────── */
export type CheckboxSize = 'sm' | 'md' | 'lg'
const CB_SIZE: Record<CheckboxSize, { box: string; icon: string; text: string; gap: string }> = {
  sm: { box: 'size-(--pance-checkbox-size-sm-box) rounded-(--pance-checkbox-size-sm-radius)', icon: 'size-(--pance-checkbox-size-sm-icon)', text: 'text-xs', gap: 'gap-2' },
  md: { box: 'size-(--pance-checkbox-size-md-box) rounded-(--pance-checkbox-size-md-radius)', icon: 'size-(--pance-checkbox-size-md-icon)', text: 'text-sm', gap: 'gap-2.5' },
  lg: { box: 'size-(--pance-checkbox-size-lg-box) rounded-(--pance-checkbox-size-lg-radius)', icon: 'size-(--pance-checkbox-size-lg-icon)', text: 'text-base', gap: 'gap-3' },
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
  const uid = useId()
  const boxState = indeterminate || checked
    ? error ? 'border-(--pance-checkbox-color-error) bg-(--pance-checkbox-color-error) text-danger-on-solid' : 'border-(--pance-checkbox-color-checked) bg-(--pance-checkbox-color-checked) text-primary-on-solid'
    : error ? 'border-danger bg-surface hover:border-danger' : 'border-(--pance-checkbox-color-border) bg-surface hover:border-(--pance-checkbox-color-border-hover)'

  return (
    <label className={`inline-flex items-start ${s.gap} ${disabled ? 'cursor-not-allowed opacity-(--pance-opacity-disabled)' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-labelledby={label ? `${uid}-l` : undefined}
        aria-describedby={description ? `${uid}-d` : undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`${focus} mt-0.5 grid shrink-0 place-items-center border transition-colors ${s.box} ${boxState}`}
      >
        {indeterminate
          ? <span className="block h-0.5 w-[55%] rounded-full bg-current" />
          : checked
          ? <IconCheck className={s.icon} />
          : null}
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span id={`${uid}-l`} className={`block font-medium ${s.text} ${disabled ? 'text-ink-muted' : error ? 'text-danger' : 'text-ink-soft'}`}>{label}</span>}
          {description && <span id={`${uid}-d`} className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  )
}

/* ── Radio ─────────────────────────────────────────────────────────────── */
export type RadioSize = 'sm' | 'md' | 'lg'
const RD_SIZE: Record<RadioSize, { dot: string; ring: string; text: string; gap: string; inner: string }> = {
  sm: { dot: 'size-(--pance-radio-size-sm-control)', ring: 'h-2 w-2', text: 'text-xs', gap: 'gap-2', inner: 'size-(--pance-radio-size-sm-dot)' },
  md: { dot: 'size-(--pance-radio-size-md-control)', ring: 'h-2.5 w-2.5', text: 'text-sm', gap: 'gap-2.5', inner: 'size-(--pance-radio-size-md-dot)' },
  lg: { dot: 'size-(--pance-radio-size-lg-control)', ring: 'h-3 w-3', text: 'text-base', gap: 'gap-3', inner: 'size-(--pance-radio-size-lg-dot)' },
}

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled,
  error,
  size = 'md',
  tabIndex,
  onKeyDown,
  buttonRef,
}: {
  checked: boolean
  onChange: () => void
  label?: string
  description?: string
  disabled?: boolean
  error?: boolean
  size?: RadioSize
  /** Set by RadioGroup for roving focus. */
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  buttonRef?: Ref<HTMLButtonElement>
}) {
  const s = RD_SIZE[size]
  const descId = useId()
  const ringState = checked
    ? error ? 'border-danger' : 'border-(--pance-radio-color-checked)'
    : error ? 'border-danger hover:border-danger' : 'border-(--pance-radio-color-border) hover:border-(--pance-radio-color-border-hover)'

  return (
    <label className={`inline-flex items-start ${s.gap} ${disabled ? 'cursor-not-allowed opacity-(--pance-opacity-disabled)' : 'cursor-pointer'}`}>
      <button
        type="button"
        ref={buttonRef}
        role="radio"
        aria-checked={checked}
        aria-describedby={description ? descId : undefined}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        disabled={disabled}
        onClick={() => !disabled && onChange()}
        className={`${focus} mt-0.5 grid shrink-0 place-items-center rounded-full border transition-colors ${s.dot} ${ringState}`}
      >
        <span
          className={`rounded-full transition-transform duration-200 ${s.inner} ${checked ? (error ? 'bg-danger scale-100' : 'bg-(--pance-radio-color-checked) scale-100') : 'scale-0 bg-(--pance-radio-color-checked)'}`}
        />
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className={`block font-medium ${s.text} ${disabled ? 'text-ink-muted' : error ? 'text-danger' : 'text-ink-soft'}`}>{label}</span>}
          {description && <span id={descId} className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  )
}

/* ── RadioGroup — WAI-ARIA radiogroup ──────────────────────────────────────
   One Tab stop for the whole group; arrows move AND select (native radio
   behaviour); the group is named by its visible legend. */
export function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  orientation = 'vertical',
  error,
}: {
  label: string
  options: { value: T; label: string; description?: string; disabled?: boolean }[]
  value: T | null
  onChange: (v: T) => void
  size?: RadioSize
  orientation?: 'vertical' | 'horizontal'
  error?: boolean
}) {
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selected = options.findIndex((o) => o.value === value)
  const focusIdx = selected >= 0 ? selected : options.findIndex((o) => !o.disabled)
  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = listKeyNav(e.key, i, options.length, (j) => !!options[j].disabled, 'both')
    if (next === null) return
    e.preventDefault()
    onChange(options[next].value)
    refs.current[next]?.focus()
  }
  return (
    <div role="radiogroup" aria-labelledby={`${id}-legend`} aria-invalid={error || undefined} className="flex flex-col gap-2">
      <span id={`${id}-legend`} className="text-sm font-medium text-ink-soft">{label}</span>
      <div className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-5' : 'flex-col gap-3'}`}>
        {options.map((o, i) => (
          <Radio
            key={o.value}
            checked={o.value === value}
            onChange={() => onChange(o.value)}
            label={o.label}
            description={o.description}
            disabled={o.disabled}
            error={error}
            size={size}
            tabIndex={i === focusIdx ? 0 : -1}
            onKeyDown={onKey(i)}
            buttonRef={(el) => { refs.current[i] = el }}
          />
        ))}
      </div>
    </div>
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
  const uid = useId()
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-labelledby={`${uid}-l`}
      aria-describedby={description ? `${uid}-d` : undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange()}
      className={`${focus} w-full rounded-xl border p-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${
        checked
          ? 'border-primary-border-strong bg-primary-soft shadow-[0_0_0_1px_var(--color-primary-border-strong)]'
          : 'border-line bg-surface hover:border-line-strong hover:bg-canvas'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {CardIcon && (
            <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${checked ? 'bg-primary-soft-hover text-primary-fg' : 'bg-secondary-soft text-ink-muted'}`}>
              <CardIcon size={16} />
            </span>
          )}
          <span className="min-w-0">
            <span id={`${uid}-l`} className={`block text-sm font-semibold ${checked ? 'text-primary-fg' : 'text-ink'}`}>{label}</span>
            {description && <span id={`${uid}-d`} className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge && <span className="rounded-full bg-primary-soft-hover px-2 py-0.5 font-mono text-10 font-semibold text-primary-fg">{badge}</span>}
          <span className={`grid h-5 w-5 place-items-center rounded-full border transition-colors ${checked ? 'border-primary-solid' : 'border-secondary-border-strong'}`}>
            <span className={`h-2.5 w-2.5 rounded-full bg-primary-solid transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
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
  label,
}: {
  options: { value: T; label: string; Icon?: IconType }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md' | 'lg'
  /** Accessible name for the group, e.g. "View". */
  label?: string
}) {
  const pad = size === 'sm' ? 'h-8 px-3 text-13' : size === 'lg' ? 'h-11 px-5 text-base' : 'h-10 px-4 text-sm'
  const iconSz = size === 'sm' ? 14 : size === 'lg' ? 20 : 16
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl border border-line bg-canvas p-1">
      {options.map((opt, i) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => {
              const next = listKeyNav(e.key, i, options.length, () => false, 'both')
              if (next === null) return
              e.preventDefault()
              onChange(options[next].value)
              refs.current[next]?.focus()
            }}
            onClick={() => onChange(opt.value)}
            className={`${focus} inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 ${pad} ${
              active
                ? 'bg-surface text-primary-fg shadow-sm ring-1 ring-line'
                : 'text-ink-muted hover:text-ink-soft'
            }`}
          >
            {opt.Icon && <opt.Icon size={iconSz} weight={active ? 'fill' : 'regular'} aria-hidden="true" />}
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
    <div role="group" aria-label={title} className="space-y-3">
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
