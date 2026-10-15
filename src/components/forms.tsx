/* Pance · Form inputs — Input, Field, Textarea, InputGroup, RangeSlider, FileDropzone, PinInput, InlineEdit, Combobox, Select, TagInput */
import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useI18n } from '../i18n'
import { IconAlert, IconCheck, IconCheckCircle, IconChevronDown, IconEdit, IconEye, IconEyeOff, IconSearch, IconX, type IconType } from '../icons'
import { focus } from './shared'

/* ── Inputs ────────────────────────────────────────────────────────────── */
const inputBase =
  `${focus} w-full rounded-xl border bg-surface text-ink placeholder:text-ink-muted transition-colors duration-200`
const inputNormal = 'border-line hover:border-slate-300'
const inputError =
  'border-danger bg-rose-50/40 focus-visible:shadow-[0_0_0_3px_var(--color-danger-soft),0_0_0_1.5px_var(--color-danger)]'
const inputSuccess =
  'border-emerald-400 bg-emerald-50/30 focus-visible:shadow-[0_0_0_3px_rgba(5,150,105,0.1),0_0_0_1.5px_rgba(5,150,105,0.7)]'

export type InputSize = 'sm' | 'md' | 'lg'
const INPUT_SIZE: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-3.5 text-sm',
  lg: 'h-12 px-4 text-base',
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
  const { t: tt } = useI18n()
  const [showPwd, setShowPwd] = useState(false)
  const isPwd = type === 'password'
  const resolvedType = isPwd ? (showPwd ? 'text' : 'password') : type
  const state = error ? inputError : success ? inputSuccess : inputNormal
  const iconSize = inputSize === 'sm' ? 'h-4 w-4' : inputSize === 'lg' ? 'h-5 w-5' : 'h-[18px] w-[18px]'
  const leftPad = Icon ? (inputSize === 'sm' ? 'pl-8' : inputSize === 'lg' ? 'pl-11' : 'pl-10') : ''
  const rightPad = (isPwd || TrailingIcon) ? (inputSize === 'sm' ? 'pr-8' : inputSize === 'lg' ? 'pr-11' : 'pr-10') : ''
  const iconLeft = inputSize === 'sm' ? 'left-2.5' : inputSize === 'lg' ? 'left-4' : 'left-3.5'
  const iconRight = inputSize === 'sm' ? 'right-2.5' : inputSize === 'lg' ? 'right-4' : 'right-3.5'

  return (
    <div className="relative">
      {Icon && <Icon className={`pointer-events-none absolute ${iconLeft} top-1/2 -translate-y-1/2 text-ink-muted ${iconSize}`} />}
      <input
        ref={ref}
        type={resolvedType}
        className={`${inputBase} ${INPUT_SIZE[inputSize]} ${state} ${leftPad} ${rightPad} ${className}`}
        {...rest}
      />
      {isPwd ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={showPwd ? tt('ui.hidePassword') : tt('ui.showPassword')}
          onClick={() => setShowPwd((v) => !v)}
          className={`absolute ${iconRight} top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-soft`}
        >
          {showPwd ? <IconEyeOff className={iconSize} /> : <IconEye className={iconSize} />}
        </button>
      ) : TrailingIcon ? (
        <TrailingIcon className={`pointer-events-none absolute ${iconRight} top-1/2 -translate-y-1/2 text-ink-muted ${iconSize}`} />
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
  children,
}: {
  label: string
  hint?: string
  error?: string
  success?: string
  required?: boolean
  optional?: boolean
  charCount?: number
  maxChars?: number
  children: ReactNode
}) {
  const { t: tt } = useI18n()
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
          {optional && <span className="ml-1.5 font-normal text-ink-muted">{tt('ui.optional')}</span>}
        </label>
        {maxChars !== undefined && charCount !== undefined && (
          <span className={`font-mono text-[11px] ${charCount > maxChars ? 'text-danger' : 'text-ink-muted'}`}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <IconAlert className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : success ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <IconCheckCircle className="h-3.5 w-3.5 shrink-0" />
          {success}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
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
  const state = error ? inputError : success ? inputSuccess : inputNormal
  return (
    <textarea
      className={`${inputBase} ${state} px-3.5 py-2.5 text-sm leading-relaxed resize-none min-h-[80px] ${className}`}
      {...rest}
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
    <div className="flex items-stretch rounded-xl border border-line bg-surface transition-colors focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_var(--color-brand-100),0_0_0_1.5px_var(--color-brand-500)]">
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
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  severity?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const pct = ((value - min) / (max - min)) * 100
  const trackColor: Record<string, string> = {
    primary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#e11d48',
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&:focus]:outline-none"
        style={{
          background: `linear-gradient(to right, ${thumb} ${pct}%, #e2e8f0 ${pct}%)`,
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
  const { t: tt } = useI18n()
  const [over, setOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = (f: FileList | null) => {
    if (!f) return
    const arr = Array.from(f)
    setFiles((prev) => [...prev, ...arr])
    onFiles?.(f)
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files) }}
        className={`${focus} flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${over ? 'border-brand-400 bg-brand-50' : 'border-line hover:border-brand-300 hover:bg-brand-50/40'}`}
      >
        <input ref={inputRef} type="file" accept={accept} multiple className="sr-only" onChange={(e) => handle(e.target.files)} />
        {DropIcon && (
          <span className={`grid h-12 w-12 place-items-center rounded-xl transition-colors ${over ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-ink-muted'}`}>
            <DropIcon size={24} />
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-ink">
            <span className="text-brand-600">{tt('ui.clickToUpload')}</span> {tt('ui.orDrag')}
          </p>
          {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
        </div>
      </div>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
              <span className="truncate text-ink-soft">{f.name}</span>
              <span className="ml-3 shrink-0 font-mono text-[11px] text-ink-muted">{(f.size / 1024).toFixed(1)} KB</span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="ml-3 shrink-0 text-ink-muted hover:text-danger"
                aria-label={tt('ui.removeFile')}
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
}: {
  length?: number
  onComplete?: (pin: string) => void
  error?: boolean
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])

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
    <div className="flex gap-1.5 sm:gap-2">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={onPaste}
          className={`${focus} aspect-square w-0 min-w-0 flex-1 basis-0 max-w-[3rem] rounded-xl border text-center font-mono text-base font-semibold text-ink transition-colors sm:text-lg ${
            error
              ? 'border-danger bg-rose-50/40 text-danger'
              : v
              ? 'border-brand-400 bg-brand-50 text-brand-700'
              : 'border-line bg-surface hover:border-slate-300'
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
  const { t: tt } = useI18n()
  placeholder ??= tt('ui.clickToEdit')
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
        className={`${focus} -mx-2 rounded-lg border border-brand-400 bg-brand-50 px-2 py-0.5 text-sm font-medium text-ink shadow-[0_0_0_3px_var(--color-brand-100)]`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`${focus} group -mx-2 flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-sm font-medium text-ink transition-colors hover:bg-brand-50`}
    >
      <span>{value || placeholder}</span>
      <IconEdit className="h-3.5 w-3.5 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}

/* ── Combobox ──────────────────────────────────────────────────────────── */
export function Combobox({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string; meta?: string }[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const { t: tt } = useI18n()
  placeholder ??= tt('ui.search')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const selected = options.find((o) => o.value === value)
  const filtered = query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()) || (o.meta ?? '').toLowerCase().includes(query.toLowerCase())) : options

  const open_ = () => { setOpen(true); setQuery('') }

  return (
    <div ref={ref} className="relative">
      {open ? (
        <div className={`${inputBase} ${inputNormal} flex items-center gap-2 h-10 px-3.5`}>
          <IconSearch className="h-4 w-4 shrink-0 text-ink-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={open_}
          className={`${inputBase} ${inputNormal} flex h-10 items-center justify-between px-3.5 text-left`}
        >
          <span className={`truncate text-sm ${selected ? 'text-ink' : 'text-ink-muted'}`}>{selected?.label ?? placeholder}</span>
          <IconChevronDown className="h-4 w-4 shrink-0 text-ink-muted" />
        </button>
      )}
      {open && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)]">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-muted">{tt('ui.noResults', { query })}</li>
          ) : (
            filtered.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${o.value === value ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-ground'}`}
                >
                  <span>{o.label}</span>
                  <span className="font-mono text-[11px] text-ink-muted">{o.meta}</span>
                  {o.value === value && <IconCheck className="ml-2 h-4 w-4 shrink-0 text-brand-600" />}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

/* ── Select (custom dropdown) ──────────────────────────────────────────── */
export function Select({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputBase} h-10 px-3.5 text-sm flex items-center justify-between border-line text-left hover:border-slate-300 ${open ? 'border-brand-500 shadow-[0_0_0_3px_var(--color-brand-100),0_0_0_1.5px_var(--color-brand-500)]' : ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
          {value}
        </span>
        <IconChevronDown className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)]">
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${o === value ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-ground'}`}
              >
                {o}
                {o === value && <IconCheck className="h-4 w-4 text-brand-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── TagInput ───────────────────────────────────────────────────────────── */
export function TagInput({
  tags, onChange, placeholder, suggestions = [],
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
}) {
  const { t: tt } = useI18n()
  placeholder ??= tt('ui.addTag')
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const add = (val: string) => {
    const v = val.trim().toLowerCase()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
  }

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag))

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      add(input)
    } else if (e.key === 'Backspace' && !input && tags.length) {
      remove(tags[tags.length - 1])
    }
  }

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s))

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={`${focus} flex min-h-[42px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border bg-surface px-3 py-2 transition-colors duration-200 ${focused ? 'border-brand-500 shadow-[0_0_0_3px_var(--color-brand-100),0_0_0_1.5px_var(--color-brand-500)]' : 'border-line hover:border-slate-300'}`}
      >
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
            {tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`${tt('ui.remove')} ${tag}`} className="rounded-full hover:bg-brand-100">
              <IconX className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) add(input) }}
          placeholder={tags.length ? '' : placeholder}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted outline-none"
        />
      </div>
      {focused && filtered.length > 0 && (
        <ul className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.3)]">
          {filtered.slice(0, 6).map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(s) }}
                className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-ground hover:text-ink"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
