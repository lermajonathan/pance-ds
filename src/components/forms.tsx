/* Pance · Form inputs — Input, Field, Textarea, InputGroup, RangeSlider, FileDropzone, PinInput, InlineEdit, Combobox, Select, TagInput */
import { createContext, createElement, useContext, useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useLabels } from './labels'
import { IconAlert, IconCheck, IconCheckCircle, IconChevronDown, IconEdit, IconEye, IconEyeOff, IconSearch, IconX, type IconType } from '../icons'
import { focus } from './shared'
import { hitArea, listKeyNav } from './a11y'

/* ── Inputs ────────────────────────────────────────────────────────────── */
export const inputBase =
  `${focus} w-full rounded-(--pance-input-radius) border bg-surface text-ink placeholder:text-ink-subtle transition-colors duration-200`
export const inputNormal = 'border-line hover:border-line-strong'
export const inputError =
  'border-danger bg-danger-soft/40 focus-visible:shadow-[var(--pance-focus-ring-danger)]'
const inputSuccess =
  'border-success-border-strong bg-success-soft/30 focus-visible:shadow-[var(--pance-focus-ring-success)]'

/* Field ↔ control wiring. Any control rendered inside <Field> picks up the id the
   <label> points to, the ids of the hint/error text (aria-describedby) and the
   invalid/required state — no props needed at the call site. */
type FieldCtx = { id: string; labelId: string; describedBy?: string; invalid?: boolean; required?: boolean }
const FieldContext = createContext<FieldCtx | null>(null)
/** Id of the enclosing Field's label, for composite controls that need aria-labelledby. */
export const useFieldLabelId = () => useContext(FieldContext)?.labelId

export function useFieldControl(own: { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: React.AriaAttributes['aria-invalid']; required?: boolean; error?: boolean }) {
  const ctx = useContext(FieldContext)
  const describedBy = [own['aria-describedby'], ctx?.describedBy].filter(Boolean).join(' ') || undefined
  return {
    id: own.id ?? ctx?.id,
    'aria-describedby': describedBy,
    'aria-invalid': own['aria-invalid'] ?? (own.error || ctx?.invalid ? true : undefined),
    'aria-required': own.required || ctx?.required || undefined,
  }
}

export type InputSize = 'sm' | 'md' | 'lg'
// Dimensions come from component tokens (tokens/components.json → input.size.*).
const INPUT_SIZE: Record<InputSize, string> = {
  sm: 'h-(--pance-input-size-sm-height) px-(--pance-input-size-sm-padding-x) text-(length:--pance-input-size-sm-font-size)',
  md: 'h-(--pance-input-size-md-height) px-(--pance-input-size-md-padding-x) text-(length:--pance-input-size-md-font-size) leading-5',
  lg: 'h-(--pance-input-size-lg-height) px-(--pance-input-size-lg-padding-x) text-(length:--pance-input-size-lg-font-size)',
}

export function Input({
  Icon,
  TrailingIcon,
  error,
  success,
  inputSize = 'md',
  className = '',
  type,
  ref,
  ...rest
}: {
  ref?: Ref<HTMLInputElement>
  Icon?: IconType
  TrailingIcon?: IconType
  error?: boolean
  success?: boolean
  inputSize?: InputSize
} & InputHTMLAttributes<HTMLInputElement>) {
  const tt = useLabels()
  const [showPwd, setShowPwd] = useState(false)
  const a11y = useFieldControl({ ...rest, error })
  const isPwd = type === 'password'
  const resolvedType = isPwd ? (showPwd ? 'text' : 'password') : type
  const state = error ? inputError : success ? inputSuccess : inputNormal
  const iconSize = inputSize === 'sm' ? 'size-(--pance-input-size-sm-icon)' : inputSize === 'lg' ? 'size-(--pance-input-size-lg-icon)' : 'size-(--pance-input-size-md-icon)'
  const leftPad = Icon ? (inputSize === 'sm' ? 'pl-8' : inputSize === 'lg' ? 'pl-11' : 'pl-10') : ''
  const rightPad = (isPwd || TrailingIcon) ? (inputSize === 'sm' ? 'pr-8' : inputSize === 'lg' ? 'pr-11' : 'pr-10') : ''
  const iconLeft = inputSize === 'sm' ? 'left-2.5' : inputSize === 'lg' ? 'left-4' : 'left-3.5'
  const iconRight = inputSize === 'sm' ? 'right-2.5' : inputSize === 'lg' ? 'right-4' : 'right-3.5'

  return (
    <div className="relative">
      {Icon && <Icon aria-hidden="true" className={`pointer-events-none absolute ${iconLeft} top-1/2 -translate-y-1/2 text-ink-muted ${iconSize}`} />}
      <input
        ref={ref}
        type={resolvedType}
        className={`${inputBase} ${INPUT_SIZE[inputSize]} ${state} ${leftPad} ${rightPad} ${className}`}
        {...rest}
        {...a11y}
      />
      {isPwd ? (
        <button
          type="button"
          aria-label={tt.showPassword}
          aria-pressed={showPwd}
          onClick={() => setShowPwd((v) => !v)}
          className={`${focus} absolute ${iconRight} top-1/2 -mr-[3px] grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-ink-muted hover:text-ink-soft`}
        >
          {showPwd ? <IconEyeOff aria-hidden className={iconSize} /> : <IconEye aria-hidden className={iconSize} />}
        </button>
      ) : TrailingIcon ? (
        <TrailingIcon aria-hidden="true" className={`pointer-events-none absolute ${iconRight} top-1/2 -translate-y-1/2 text-ink-muted ${iconSize}`} />
      ) : null}
    </div>
  )
}

export function Field({
  label,
  hint,
  error,
  success,
  required,
  optional,
  charCount,
  maxChars,
  group,
  children,
}: {
  label: string
  /** Set when the field holds several controls (buttons, radios, chips). The label then names a role="group". */
  group?: boolean
  hint?: string
  error?: string
  success?: string
  required?: boolean
  optional?: boolean
  charCount?: number
  maxChars?: number
  children: ReactNode
}) {
  const tt = useLabels()
  const id = useId()
  const msgId = `${id}-msg`
  const countId = `${id}-count`
  const hasMsg = !!(error || success || hint)
  const hasCount = maxChars !== undefined && charCount !== undefined
  const labelId = `${id}-label`
  const ctx: FieldCtx = {
    id,
    labelId,
    describedBy: [hasMsg ? msgId : '', hasCount ? countId : ''].filter(Boolean).join(' ') || undefined,
    invalid: !!error,
    required,
  }
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        {createElement(
          group ? 'span' : 'label',
          { id: labelId, htmlFor: group ? undefined : id, className: 'text-sm font-medium text-ink-soft' },
          label,
          required && <span key="r" className="ml-0.5 text-danger" aria-hidden="true">*</span>,
          optional && <span key="o" className="ml-1.5 font-normal text-ink-muted">{tt.optional}</span>,
        )}
        {hasCount && (
          <span id={countId} className={`font-mono text-11 ${charCount! > maxChars! ? 'text-danger' : 'text-ink-muted'}`}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>
      <FieldContext.Provider value={ctx}>
        {group ? (
          <div role="group" aria-labelledby={labelId} aria-describedby={ctx.describedBy}>{children}</div>
        ) : (
          children
        )}
      </FieldContext.Provider>
      {error ? (
        <p id={msgId} className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <IconAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : success ? (
        <p id={msgId} className="flex items-center gap-1.5 text-xs font-medium text-success-fg">
          <IconCheckCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {success}
        </p>
      ) : hint ? (
        <p id={msgId} className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  )
}

/* ── Textarea ──────────────────────────────────────────────────────────── */
export function Textarea({
  error,
  success,
  className = '',
  ...rest
}: { error?: boolean; success?: boolean; className?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const a11y = useFieldControl({ ...rest, error })
  const state = error ? inputError : success ? inputSuccess : inputNormal
  return (
    <textarea
      className={`${inputBase} ${state} px-3.5 py-2.5 text-sm leading-relaxed resize-none min-h-(--pance-input-textarea-min-height) ${className}`}
      {...rest}
      {...a11y}
    />
  )
}

/* ── Input group (addons) ──────────────────────────────────────────────── */
export function InputGroup({
  prefix,
  suffix,
  prefixIcon: PrefixIcon,
  suffixIcon: SuffixIcon,
  suffixButton,
  children,
}: {
  prefix?: string
  suffix?: string
  prefixIcon?: IconType
  suffixIcon?: IconType
  suffixButton?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex items-stretch rounded-xl border border-line bg-surface transition-colors focus-within:border-line-focus focus-within:shadow-[var(--pance-focus-ring)]">
      {(prefix || PrefixIcon) && (
        <span className="flex shrink-0 items-center gap-1.5 rounded-l-xl border-r border-line bg-canvas px-3 text-sm text-ink-muted">
          {PrefixIcon && <PrefixIcon className="h-4 w-4" />}
          {prefix}
        </span>
      )}
      <div className="relative min-w-0 flex-1 [&>div]:flex-1 [&_input]:!rounded-none [&_input]:!border-0 [&_input]:!bg-transparent [&_input]:!shadow-none [&_input]:focus-visible:!shadow-none">
        {children}
      </div>
      {(suffix || SuffixIcon) && (
        <span className="flex shrink-0 items-center gap-1.5 rounded-r-xl border-l border-line bg-canvas px-3 text-sm text-ink-muted">
          {SuffixIcon && <SuffixIcon className="h-4 w-4" />}
          {suffix}
        </span>
      )}
      {suffixButton && (
        <div className="flex shrink-0 items-stretch border-l border-line [&>button]:h-full [&>button]:rounded-l-none [&>button]:rounded-r-xl [&>button]:border-0">{suffixButton}</div>
      )}
    </div>
  )
}

/* ── Range slider ──────────────────────────────────────────────────────── */
export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  severity = 'primary',
  label,
  valueText,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  severity?: 'primary' | 'success' | 'warning' | 'danger'
  /** Accessible name when the slider is not inside a Field. */
  label?: string
  /** Human-readable value, e.g. "40 %" or "3 replicas" (aria-valuetext). */
  valueText?: string
  disabled?: boolean
}) {
  const a11y = useFieldControl({})
  const pct = ((value - min) / (max - min)) * 100
  const trackColor: Record<string, string> = {
    primary: 'var(--pance-color-intent-primary-solid)',
    success: 'var(--pance-color-intent-success-solid)',
    warning: 'var(--pance-color-intent-warning-solid)',
    danger: 'var(--pance-color-intent-danger-solid)',
  }
  const thumb = trackColor[severity]
  return (
    <div className="relative flex flex-col gap-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={a11y.id ? undefined : label}
        aria-valuetext={valueText}
        {...a11y}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${focus} h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110`}
        style={{
          background: `linear-gradient(to right, ${thumb} ${pct}%, var(--pance-color-border-default) ${pct}%)`,
          ['--thumb' as string]: thumb,
        }}
      />
    </div>
  )
}

/* ── File drop zone ────────────────────────────────────────────────────── */
export function FileDropzone({
  accept,
  hint,
  onFiles,
  Icon: DropIcon,
}: {
  accept?: string
  hint?: string
  onFiles?: (files: FileList) => void
  Icon?: IconType
}) {
  const tt = useLabels()
  const [over, setOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const a11y = useFieldControl({})

  const handle = (f: FileList | null) => {
    if (!f) return
    const arr = Array.from(f)
    setFiles((prev) => [...prev, ...arr])
    onFiles?.(f)
  }

  return (
    <div className="space-y-3">
      {/* A <label> wrapping the native file input: click, Enter/Space and screen readers all work natively. */}
      <label
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files) }}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors has-[input:focus-visible]:border-line-focus has-[input:focus-visible]:shadow-[var(--pance-focus-ring)] ${over ? 'border-primary-border-strong bg-primary-soft' : 'border-line hover:border-primary-outline hover:bg-primary-soft/40'}`}
      >
        <input ref={inputRef} {...a11y} type="file" accept={accept} multiple className="sr-only" onChange={(e) => handle(e.target.files)} />
        {DropIcon && (
          <span className={`grid h-12 w-12 place-items-center rounded-xl transition-colors ${over ? 'bg-primary-soft-hover text-primary-fg' : 'bg-secondary-soft text-ink-muted'}`}>
            <DropIcon size={24} aria-hidden />
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-ink">
            <span className="text-primary-fg">{tt.clickToUpload}</span> {tt.orDrag}
          </p>
          {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
        </div>
      </label>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
              <span className="truncate text-ink-soft">{f.name}</span>
              <span className="ml-3 shrink-0 font-mono text-11 text-ink-muted">{(f.size / 1024).toFixed(1)} KB</span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="ml-3 shrink-0 text-ink-muted hover:text-danger"
                aria-label={tt.removeFile}
              >
                <IconX className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── PIN / OTP input ───────────────────────────────────────────────────── */
export function PinInput({
  length = 6,
  onComplete,
  error,
  label = 'Verification code',
  digitLabel = (n, total) => `Digit ${n} of ${total}`,
}: {
  length?: number
  onComplete?: (pin: string) => void
  error?: boolean
  /** Name of the group (translate it). */
  label?: string
  /** Name of each box (translate it). */
  digitLabel?: (n: number, total: number) => string
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const a11y = useFieldControl({ error })
  const labelId = useFieldLabelId()

  const update = (i: number, v: string) => {
    const char = v.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[i] = char
    setValues(next)
    if (char && i < length - 1) refs.current[i + 1]?.focus()
    if (next.every(Boolean)) onComplete?.(next.join(''))
  }

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); refs.current[i - 1]?.focus() }
    if (e.key === 'ArrowRight' && i < length - 1) { e.preventDefault(); refs.current[i + 1]?.focus() }
  }

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next = Array(length).fill('')
    pasted.split('').forEach((c, i) => { next[i] = c })
    setValues(next)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
    if (pasted.length === length) onComplete?.(pasted)
  }

  return (
    <div role="group" aria-labelledby={labelId} aria-label={labelId ? undefined : label} aria-describedby={a11y['aria-describedby']} className="flex gap-1.5 sm:gap-2">
      {values.map((v, i) => (
        <input
          key={i}
          id={i === 0 ? a11y.id : undefined}
          aria-label={digitLabel(i + 1, length)}
          aria-invalid={a11y['aria-invalid']}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={onPaste}
          className={`${focus} aspect-square w-0 min-w-0 flex-1 basis-0 max-w-(--pance-input-pin-max-size) rounded-xl border text-center font-mono text-base font-semibold text-ink transition-colors sm:text-lg ${
            error
              ? 'border-danger bg-danger-soft/40 text-danger'
              : v
              ? 'border-primary-border-strong bg-primary-soft text-primary-fg'
              : 'border-line bg-surface hover:border-line-strong'
          }`}
        />
      ))}
    </div>
  )
}

/* ── Inline edit ───────────────────────────────────────────────────────── */
export function InlineEdit({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const tt = useLabels()
  placeholder ??= tt.clickToEdit
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const commit = () => {
    onChange(draft || value)
    setEditing(false)
  }

  useEffect(() => {
    if (editing) {
      setDraft(value)
      setTimeout(() => inputRef.current?.select(), 0)
    }
  }, [editing, value])

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setDraft(value); setEditing(false) }
        }}
        className={`${focus} -mx-2 rounded-lg border border-primary-border-strong bg-primary-soft px-2 py-0.5 text-sm font-medium text-ink shadow-[var(--pance-focus-ring)]`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`${focus} group -mx-2 flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-sm font-medium text-ink transition-colors hover:bg-primary-soft`}
    >
      <span>{value || placeholder}</span>
      <IconEdit className="h-3.5 w-3.5 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}

/* ── Combobox ──────────────────────────────────────────────────────────────
   WAI-ARIA combobox (list autocomplete): role=combobox input with
   aria-activedescendant; ArrowUp/Down/Home/End move, Enter selects,
   Escape closes and returns focus to the trigger. */
export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  label,
}: {
  options: { value: string; label: string; meta?: string }[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  /** Accessible name when not inside a Field. */
  label?: string
}) {
  const tt = useLabels()
  placeholder ??= tt.search
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const a11y = useFieldControl({})
  const listId = useId()
  const optId = (i: number) => `${listId}-opt-${i}`

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const selected = options.find((o) => o.value === value)
  const filtered = query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()) || (o.meta ?? '').toLowerCase().includes(query.toLowerCase())) : options

  const open_ = () => { setOpen(true); setQuery(''); setActive(Math.max(0, options.findIndex((o) => o.value === value))) }
  const close = () => { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()) }
  const choose = (v: string) => { onChange(v); close() }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return }
    if (e.key === 'Enter') { e.preventDefault(); const o = filtered[active]; if (o) choose(o.value); return }
    if (e.key === 'Tab') { setOpen(false); return }
    const next = listKeyNav(e.key, active, filtered.length)
    if (next !== null) { e.preventDefault(); setActive(next) }
  }

  return (
    <div ref={ref} className="relative">
      {open ? (
        <div className={`${inputBase} ${inputNormal} flex items-center gap-2 h-10 px-3.5 focus-within:border-line-focus focus-within:shadow-[var(--pance-focus-ring)]`}>
          <IconSearch className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={filtered[active] ? optId(active) : undefined}
            aria-label={label ?? placeholder}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onInputKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-label={a11y.id ? undefined : label}
          {...a11y}
          onClick={open_}
          onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open_() } }}
          className={`${inputBase} ${inputNormal} flex h-10 items-center justify-between px-3.5 text-left`}
        >
          <span className={`truncate text-sm ${selected ? 'text-ink' : 'text-ink-subtle'}`}>{selected?.label ?? placeholder}</span>
          <IconChevronDown className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
        </button>
      )}
      {open && (
        <ul id={listId} role="listbox" aria-label={label ?? placeholder} className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-menu">
          {filtered.length === 0 ? (
            <li role="presentation" className="px-3 py-2 text-sm text-ink-muted">{tt.noResults(query)}</li>
          ) : (
            filtered.map((o, i) => (
              <li
                key={o.value}
                id={optId(i)}
                role="option"
                aria-selected={o.value === value}
                onMouseDown={(e) => { e.preventDefault(); choose(o.value) }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${o.value === value ? 'bg-primary-soft text-primary-fg' : 'text-ink-soft'} ${i === active ? 'ring-2 ring-inset ring-line-focus' : ''} ${o.value !== value ? 'hover:bg-ground' : ''}`}
              >
                <span>{o.label}</span>
                <span className="font-mono text-11 text-ink-muted">{o.meta}</span>
                {o.value === value && <IconCheck className="ml-2 h-4 w-4 shrink-0 text-primary-fg" aria-hidden="true" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

/* ── Select (custom dropdown) ──────────────────────────────────────────────
   WAI-ARIA select-only combobox: button + listbox. Enter/Space/Arrows open on
   the selected option; Arrows/Home/End move; type-ahead jumps by first letter;
   Enter/Space selects; Escape/Tab closes; focus returns to the button. */
export function Select({
  options,
  value,
  onChange,
  label,
  disabled,
  error,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  /** Accessible name when not inside a Field. */
  label?: string
  disabled?: boolean
  error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const a11y = useFieldControl({ error })
  const listId = useId()
  const optId = (i: number) => `${listId}-opt-${i}`
  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const openAt = (i: number) => { setActive(Math.max(0, i)); setOpen(true) }
  const close = () => { setOpen(false); btnRef.current?.focus() }
  const choose = (i: number) => { onChange(options[i]); close() }
  const current = options.indexOf(value)

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openAt(e.key === 'ArrowUp' && current < 0 ? options.length - 1 : current) }
  }
  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return }
    if (e.key === 'Tab') { setOpen(false); return }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); return }
    const next = listKeyNav(e.key, active, options.length)
    if (next !== null) { e.preventDefault(); setActive(next); return }
    if (e.key.length === 1) {
      const k = e.key.toLowerCase()
      const hit = options.findIndex((o, i) => i > active && o.toLowerCase().startsWith(k))
      const wrap = hit >= 0 ? hit : options.findIndex((o) => o.toLowerCase().startsWith(k))
      if (wrap >= 0) setActive(wrap)
    }
  }
  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={a11y.id ? undefined : label}
        {...a11y}
        onClick={() => (open ? close() : openAt(current))}
        onKeyDown={onButtonKey}
        className={`${inputBase} h-10 px-3.5 text-sm flex items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${error ? 'border-danger' : 'border-line hover:border-line-strong'} ${open ? 'border-line-focus shadow-[var(--pance-focus-ring)]' : ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary-dot" aria-hidden="true" />
          {value}
        </span>
        <IconChevronDown className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-labelledby={label ? undefined : a11y.id}
          aria-activedescendant={optId(active)}
          onKeyDown={onListKey}
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-menu outline-none"
        >
          {options.map((o, i) => (
            <li
              key={o}
              id={optId(i)}
              role="option"
              aria-selected={o === value}
              onMouseDown={(e) => { e.preventDefault(); choose(i) }}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${o === value ? 'bg-primary-soft text-primary-fg' : 'text-ink-soft'} ${i === active ? 'ring-2 ring-inset ring-line-focus' : ''} ${o !== value ? 'hover:bg-ground' : ''}`}
            >
              {o}
              {o === value && <IconCheck className="h-4 w-4 text-primary-fg" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── TagInput ───────────────────────────────────────────────────────────── */
export function TagInput({
  tags, onChange, placeholder, suggestions = [], label,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
  /** Accessible name when the input isn't inside a <Field>. */
  label?: string
}) {
  const tt = useLabels()
  placeholder ??= tt.addTag
  const a11y = useFieldControl({})
  const listId = useId()
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const add = (val: string) => {
    const v = val.trim().toLowerCase()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
    setActive(-1)
  }

  const remove = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
    inputRef.current?.focus()
  }

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)).slice(0, 6)
  const open = focused && filtered.length > 0

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      setActive((i) => listKeyNav(e.key, i < 0 ? (e.key === 'ArrowDown' ? -1 : 0) : i, filtered.length) ?? 0)
      return
    }
    if (e.key === 'Escape' && active >= 0) { setActive(-1); return }
    if (e.key === 'Enter' && open && active >= 0) {
      e.preventDefault()
      add(filtered[active])
    } else if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      add(input)
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex min-h-(--pance-tag-input-min-height) cursor-text flex-wrap items-center gap-1.5 rounded-xl border bg-surface px-3 py-2 transition-colors duration-200 ${focused ? 'border-line-focus shadow-[var(--pance-focus-ring)]' : 'border-line hover:border-line-strong'}`}
      >
        <ul className="contents">
          {tags.map((tag) => (
            <li key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2.5 pr-1 text-xs font-medium text-primary-fg ring-1 ring-primary-border">
              {tag}
              <button type="button" onClick={() => remove(tag)} aria-label={`${tt.remove} ${tag}`} className={`${focus} ${hitArea} grid h-5 w-5 place-items-center rounded-full hover:bg-primary-soft-hover`}>
                <IconX aria-hidden className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
        <input
          ref={inputRef}
          {...a11y}
          role="combobox"
          aria-label={a11y.id ? undefined : label ?? placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          value={input}
          onChange={(e) => { setInput(e.target.value); setActive(-1) }}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setActive(-1); if (input.trim()) add(input) }}
          placeholder={tags.length ? '' : placeholder}
          className="min-w-(--pance-tag-input-input-min-width) flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle outline-none"
        />
      </div>
      {open && (
        <ul id={listId} role="listbox" aria-label={label ?? placeholder} className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-popover">
          {filtered.map((s, i) => (
            <li
              key={s}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); add(s) }}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm ${i === active ? 'bg-ground text-ink ring-1 ring-line-focus' : 'text-ink-soft'}`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
