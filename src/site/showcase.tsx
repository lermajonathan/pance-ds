import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { Delta, Sparkline as LibSparkline, MetricCard as LibMetricCard, DataTable as LibDataTable, Pagination as LibPagination, type Column, LineChart as LibLineChart, BarChart as LibBarChart, RankedBarChart, DivergingBarChart, Heatmap, DonutChart, ScatterChart, Meter, NotificationCenter, ConfirmDialog, type NotificationItem, DatePicker, DateRangePicker, Calendar, toISODate, type DateRange, Spinner, EmptyState, Link as LibLink } from '../components'
import { hitArea } from '../components/a11y'
import {
  Waveform,
  ChartLineUp,
  UsersThree,
  Database,
  Bell,
  MagnifyingGlass,
  GearSix,
  CloudArrowUp,
  Lightning,
  ShieldCheck,
  GitBranch,
  Pulse,
  Broadcast,
  Funnel,
  Gauge,
  Globe,
  Lock,
  Sparkle,
  ArrowUpRight,
  type Icon as PhosphorIcon,
  type IconWeight,
} from '@phosphor-icons/react'
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  CountBadge,
  Breadcrumb,
  Button,
  ButtonGroup,
  SplitButton,
  ToggleButton,
  type Severity,
  Card,
  Checkbox,
  CheckboxGroup,
  Combobox,
  Field,
  FileDropzone,
  IconButton,
  InlineEdit,
  Input,
  InputGroup,
  NavMenu,
  PinInput,
  Progress,
  Radio,
  RadioCard,
  RangeSlider,
  SegmentedControl,
  Select,
  Skeleton,
  Steps,
  SwitchRow,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
  Modal,
  Drawer,
  Popover,
  DropdownMenu,
  Toast,
  ToastStack,
  Accordion,
  Divider,
  TagInput,
  Panel,
  type DropdownItem,
  type ToastItem,
  type AccordionItem,
} from '../components'
import {
  IconAlert,
  IconArrowDown,
  IconBellRinging,
  IconCheckCircle,
  IconInfo,
  IconSpinner,
  IconArrowRight,
  IconArrowUp,
  IconAt,
  IconBell,
  IconCalendar,
  IconChart,
  IconChevron,
  IconChevronDown,
  IconCheck,
  IconFilter,
  IconCopy,
  IconCurrency,
  IconDatabase,
  IconDots,
  IconDownload,
  IconEdit,
  IconExternal,
  IconFolder,
  IconGauge,
  IconGear,
  IconGlobe,
  IconHeart,
  IconHome,
  IconLock,
  IconMail,
  IconPercent,
  IconPhone,
  IconPlus,
  IconPulse,
  IconSearch,
  IconShield,
  IconSparkle,
  IconStar,
  IconStream,
  IconTrash,
  IconUpload,
  IconUser,
  IconUsers,
  IconWave,
  IconX,
  IconMapPin,
  IconTent,
  IconBuildings,
  IconAmbulance,
  type IconType,
} from '../icons'
import { CO_DEPT_GEO } from './colombia-geo'
import { photo, scene } from './media'
import { TeamTable, InvoicesTable, LogTable } from './table-examples'
import ConsoleExample from './console-example'
import { useI18n, type Key } from '../i18n'

/* ═══════════════════════════════════════════════════════════════════════
   Documentation layout primitives
   ═══════════════════════════════════════════════════════════════════════ */
export function Page({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="font-mono text-11 font-medium uppercase tracking-[0.18em] text-primary-fg">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
        <p className="mt-3 text-15 leading-relaxed text-ink-muted">{lead}</p>
      </header>
      {children}
    </div>
  )
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line-soft pb-2">
        <h2 className="font-display text-base font-bold tracking-tight text-ink">{title}</h2>
        {hint && <span className="hidden font-mono text-11 text-ink-muted sm:inline">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function Demo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </Card>
  )
}

function Meta({ children }: { children: ReactNode }) {
  return <span className="font-mono text-11 uppercase tracking-wider text-ink-muted">{children}</span>
}

/* ═══════════════════════════════════════════════════════════════════════
   FOUNDATIONS
   ═══════════════════════════════════════════════════════════════════════ */
/* Ramps are driven by explicit hex so swatches render reliably (Tailwind can't
   see dynamically-composed class names) — this is also the token source of truth. */
type Step = { step: string; hex: string; base?: boolean }
const ramp = (hexes: [string, string][], base: string): Step[] =>
  hexes.map(([step, hex]) => ({ step, hex, base: step === base }))

const RAMPS: { name: string; role: Key; scale: string; steps: Step[] }[] = [
  {
    name: 'Aqua',
    role: 'colors.role.aqua',
    scale: 'brand',
    steps: ramp(
      [['50', '#ecfeff'], ['100', '#cffafe'], ['200', '#a5f3fc'], ['300', '#67e8f9'], ['400', '#22d3ee'], ['500', '#06b6d4'], ['600', '#0891b2'], ['700', '#0e7490'], ['800', '#155e75'], ['900', '#164e63'], ['950', '#083344']],
      '600',
    ),
  },
  {
    name: 'Slate',
    role: 'colors.role.slate',
    scale: 'slate',
    steps: ramp(
      [['50', '#f8fafc'], ['100', '#f1f5f9'], ['200', '#e2e8f0'], ['300', '#cbd5e1'], ['400', '#94a3b8'], ['500', '#64748b'], ['600', '#475569'], ['700', '#334155'], ['800', '#1e293b'], ['900', '#0f172a'], ['950', '#020617']],
      '500',
    ),
  },
  {
    name: 'Emerald',
    role: 'colors.role.emerald',
    scale: 'success',
    steps: ramp(
      [['50', '#ecfdf5'], ['100', '#d1fae5'], ['200', '#a7f3d0'], ['300', '#6ee7b7'], ['400', '#34d399'], ['500', '#10b981'], ['600', '#059669'], ['700', '#047857'], ['800', '#065f46'], ['900', '#064e3b'], ['950', '#022c22']],
      '600',
    ),
  },
  {
    name: 'Sky',
    role: 'colors.role.sky',
    scale: 'info',
    steps: ramp(
      [['50', '#f0f9ff'], ['100', '#e0f2fe'], ['200', '#bae6fd'], ['300', '#7dd3fc'], ['400', '#38bdf8'], ['500', '#0ea5e9'], ['600', '#0284c7'], ['700', '#0369a1'], ['800', '#075985'], ['900', '#0c4a6e'], ['950', '#082f49']],
      '600',
    ),
  },
  {
    name: 'Amber',
    role: 'colors.role.amber',
    scale: 'warning',
    steps: ramp(
      [['50', '#fffbeb'], ['100', '#fef3c7'], ['200', '#fde68a'], ['300', '#fcd34d'], ['400', '#fbbf24'], ['500', '#f59e0b'], ['600', '#d97706'], ['700', '#b45309'], ['800', '#92400e'], ['900', '#78350f'], ['950', '#451a03']],
      '600',
    ),
  },
  {
    name: 'Violet',
    role: 'colors.role.violet',
    scale: 'help',
    steps: ramp(
      [['50', '#f5f3ff'], ['100', '#ede9fe'], ['200', '#ddd6fe'], ['300', '#c4b5fd'], ['400', '#a78bfa'], ['500', '#8b5cf6'], ['600', '#7c3aed'], ['700', '#6d28d9'], ['800', '#5b21b6'], ['900', '#4c1d95'], ['950', '#2e1065']],
      '600',
    ),
  },
  {
    name: 'Rose',
    role: 'colors.role.rose',
    scale: 'danger',
    steps: ramp(
      [['50', '#fff1f2'], ['100', '#ffe4e6'], ['200', '#fecdd3'], ['300', '#fda4af'], ['400', '#fb7185'], ['500', '#f43f5e'], ['600', '#e11d48'], ['700', '#be123c'], ['800', '#9f1231'], ['900', '#881337'], ['950', '#4c0519']],
      '600',
    ),
  },
]

function Ramp({ name, role, scale, steps }: { name: string; role: Key; scale: string; steps: Step[] }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState('')
  const copy = (hex: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(hex).catch(() => fallbackCopy(hex))
      } else {
        fallbackCopy(hex)
      }
    } catch { fallbackCopy(hex) }
    setCopied(hex)
    setTimeout(() => setCopied(''), 1000)
  }
  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <Meta>{t(role)}</Meta>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-11">
        {steps.map((s) => {
          const light = Number(s.step) >= 400
          return (
            <button
              key={s.step}
              onClick={() => copy(s.hex)}
              title={`${scale}-${s.step} · ${s.hex}`}
              className="group text-left"
            >
              <div
                className="flex h-16 flex-col justify-between rounded-xl p-2 ring-1 ring-inset ring-black/5 transition-transform duration-200 group-hover:-translate-y-1"
                style={{ backgroundColor: s.hex, color: light ? '#fff' : '#0f172a' }}
              >
                {s.base && <span className="font-mono text-9 font-semibold uppercase tracking-wider">base</span>}
                <span className="mt-auto font-mono text-10 font-semibold opacity-0 transition-opacity group-hover:opacity-90">
                  {copied === s.hex ? t('colors.copied') : s.hex}
                </span>
              </div>
              <p className="mt-1.5 font-mono text-10 text-ink-muted">{s.step}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* Relative-luminance contrast ratio (WCAG) for the accessibility matrix. */
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
function rating(r: number) {
  if (r >= 7) return { grade: 'AAA' as const, tone: 'success' as const }
  if (r >= 4.5) return { grade: 'AA' as const, tone: 'success' as const }
  if (r >= 3) return { grade: 'colors.grade.large' as const, tone: 'warning' as const }
  return { grade: 'colors.grade.fail' as const, tone: 'danger' as const }
}

export function ColorsPage() {
  const { t } = useI18n()
  const surfaces = [
    { name: 'Background', hex: '#f1f5f9', token: '--color-ground', use: t('colors.use.ground') },
    { name: 'Canvas', hex: '#f8fafc', token: '--color-canvas', use: t('colors.use.canvas') },
    { name: 'Surface', hex: '#ffffff', token: '--color-surface', use: t('colors.use.surface') },
    { name: 'Border', hex: '#e2e8f0', token: '--color-line', use: t('colors.use.line') },
    { name: 'Ink', hex: '#0f172a', token: '--color-ink', use: t('colors.use.ink') },
    { name: 'Ink muted', hex: '#475569', token: '--color-ink-muted', use: t('colors.use.inkMuted') },
  ]
  const semantics = [
    { name: 'Primary', role: t('colors.sem.primary'), solid: '#0e7490', soft: '#ecfeff', text: '#0e7490', token: '--pance-color-intent-primary-solid' },
    { name: 'Success', role: t('colors.sem.success'), solid: '#047857', soft: '#ecfdf5', text: '#047857', token: '--pance-color-intent-success-solid' },
    { name: 'Info', role: t('colors.sem.info'), solid: '#0369a1', soft: '#f0f9ff', text: '#0369a1', token: '--pance-color-intent-info-solid' },
    { name: 'Warning', role: t('colors.sem.warning'), solid: '#b45309', soft: '#fffbeb', text: '#b45309', token: '--pance-color-intent-warning-solid' },
    { name: 'Help', role: t('colors.sem.help'), solid: '#7c3aed', soft: '#f5f3ff', text: '#6d28d9', token: '--pance-color-intent-help-solid' },
    { name: 'Danger', role: t('colors.sem.danger'), solid: '#e11d48', soft: '#fff1f2', text: '#be123c', token: '--pance-color-intent-danger-solid' },
    { name: 'Contrast', role: t('colors.sem.contrast'), solid: '#0f172a', soft: '#f1f5f9', text: '#0f172a', token: '--pance-color-intent-contrast-solid' },
  ]
  const pairs = [
    { label: t('colors.pair.inkOnBg'), fg: '#0f172a', bg: '#f1f5f9' },
    { label: t('colors.pair.mutedOnSurface'), fg: '#475569', bg: '#f1f5f9' },
    { label: t('colors.pair.whiteOnAqua'), fg: '#ffffff', bg: '#0e7490' },
    { label: t('colors.pair.aqua700OnAqua50'), fg: '#0e7490', bg: '#ecfeff' },
    { label: t('colors.pair.whiteOnRose'), fg: '#ffffff', bg: '#e11d48' },
    { label: t('colors.pair.aqua300OnAqua50'), fg: '#67e8f9', bg: '#ecfeff' },
  ]
  return (
    <Page
      eyebrow={t('nav.group.foundations')}
      title={t('nav.colors')}
      lead={t('colors.lead')}
    >
      <Section title={t('colors.ramps.title')} hint={t('colors.ramps.hint')}>
        <Card className="space-y-8 p-6">
          {RAMPS.map((r) => (
            <Ramp key={r.name} {...r} />
          ))}
        </Card>
      </Section>

      <Section title={t('colors.semantic.title')} hint={t('colors.semantic.hint')}>
        <Card className="divide-y divide-line-soft">
          {semantics.map((s) => (
            <div key={s.name} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
              <div className="flex w-44 max-w-full shrink-0 items-center gap-3">
                <span className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-inset ring-black/5" style={{ backgroundColor: s.solid }} />
                <div>
                  <p className="text-sm font-semibold text-ink">{s.name}</p>
                  <p className="text-11 text-ink-muted">{s.role}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: s.solid }}>
                  Solid <span className="font-mono font-normal">{s.solid}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold" style={{ backgroundColor: s.soft, color: s.text }}>
                  Soft <span className="font-mono font-normal">{s.soft}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold" style={{ color: s.text }}>
                  Text <span className="font-mono font-normal">{s.text}</span>
                </span>
              </div>
              <p className="font-mono text-10 text-ink-muted">{s.token}</p>
            </div>
          ))}
        </Card>
      </Section>

      <Section title={t('colors.surface.title')} hint={t('colors.surface.hint')}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {surfaces.map((s) => (
            <Card key={s.name} className="overflow-hidden">
              <div className="h-16 border-b border-line" style={{ backgroundColor: s.hex }} />
              <div className="p-3">
                <p className="text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-11 text-ink-muted">{s.use}</p>
                <p className="mt-1 font-mono text-10 text-ink-muted">{s.token}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t('colors.a11y.title')} hint={t('colors.a11y.hint')}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((p) => {
            const ratio = contrast(p.fg, p.bg)
            const r = rating(ratio)
            return (
              <div key={p.label} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg ring-1 ring-inset ring-black/5" style={{ backgroundColor: p.bg, color: p.fg }}>
                  <span className="font-display text-lg font-extrabold">Aa</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-13 font-medium text-ink">{p.label}</p>
                  <p className="font-mono text-11 text-ink-muted">{ratio.toFixed(2)} : 1</p>
                </div>
                <Badge severity={r.tone}>{r.grade === 'AAA' || r.grade === 'AA' ? r.grade : t(r.grade)}</Badge>
              </div>
            )
          })}
        </div>
      </Section>
    </Page>
  )
}

const TYPE_SCALE: { name: string; font: string; cls: string; size: string; sample: Key }[] = [
  { name: 'Display', font: 'Plus Jakarta Sans', cls: 'font-display text-5xl font-extrabold tracking-tight', size: '48 / 800', sample: 'type.sample.display' },
  { name: 'H1', font: 'Plus Jakarta Sans', cls: 'font-display text-3xl font-extrabold tracking-tight', size: '30 / 800', sample: 'type.sample.h1' },
  { name: 'H2', font: 'Plus Jakarta Sans', cls: 'font-display text-2xl font-bold tracking-tight', size: '24 / 700', sample: 'type.sample.h2' },
  { name: 'H3', font: 'Plus Jakarta Sans', cls: 'font-display text-xl font-bold', size: '20 / 700', sample: 'type.sample.h3' },
  { name: 'type.scale.bodyLarge', font: 'Inter', cls: 'text-15 leading-relaxed', size: '15 / 400', sample: 'type.sample.bodyLarge' },
  { name: 'type.scale.body', font: 'Inter', cls: 'text-sm', size: '14 / 400', sample: 'type.sample.body' },
  { name: 'type.scale.caption', font: 'Inter', cls: 'text-xs text-ink-muted', size: '12 / 400', sample: 'type.sample.caption' },
  { name: 'type.scale.monoLabel', font: 'JetBrains Mono', cls: 'font-mono text-11 uppercase tracking-[0.16em] text-ink-muted', size: '11 / 500', sample: 'type.sample.monoLabel' },
]
export function TypographyPage() {
  const { t } = useI18n()
  return (
    <Page
      eyebrow={t('nav.group.foundations')}
      title={t('nav.type')}
      lead={t('type.lead')}
    >
      <Section title={t('type.families.title')}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { fam: 'Plus Jakarta Sans', role: t('type.fam.display'), cls: 'font-display font-extrabold', sample: 'Aa' },
            { fam: 'Inter', role: t('type.fam.body'), cls: 'font-sans font-semibold', sample: 'Aa' },
            { fam: 'JetBrains Mono', role: t('type.fam.mono'), cls: 'font-mono font-semibold', sample: 'Aa' },
          ].map((f) => (
            <Card key={f.fam} className="p-6">
              <p className={`${f.cls} text-6xl leading-none text-ink`}>{f.sample}</p>
              <p className="mt-5 text-sm font-semibold text-ink">{f.fam}</p>
              <p className="text-xs text-ink-muted">{f.role}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title={t('type.scale.title')} hint={t('type.scale.hint')}>
        <Card className="divide-y divide-line-soft">
          {TYPE_SCALE.map((ts) => (
            <div key={ts.name} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 sm:flex-nowrap">
              <div className="w-28 shrink-0 sm:w-36">
                <p className="text-sm font-semibold text-ink">{ts.name.startsWith('type.') ? t(ts.name as Key) : ts.name}</p>
                <p className="font-mono text-10 text-ink-muted">{ts.size}</p>
              </div>
              <p className={`${ts.cls} min-w-0 basis-full truncate text-ink sm:flex-1 sm:basis-0`}>{t(ts.sample)}</p>
              <span className="hidden shrink-0 rounded-full border border-line bg-canvas px-2.5 py-1 font-mono text-10 text-ink-muted sm:inline">
                {ts.font}
              </span>
            </div>
          ))}
        </Card>
      </Section>

      <Section title={t('type.title.title')} hint={t('type.title.hint')}>
        <Card className="divide-y divide-line-soft">
          {[
            { role: 'Display', cls: 'font-display text-5xl font-extrabold tracking-tight text-ink', sample: t('type.tsample.display'), note: '48px · Plus Jakarta Sans · extrabold' },
            { role: 'H1', cls: 'font-display text-3xl font-extrabold tracking-tight text-ink', sample: t('type.tsample.h1'), note: '30px · Plus Jakarta Sans · extrabold' },
            { role: 'H2', cls: 'font-display text-2xl font-bold tracking-tight text-ink', sample: t('type.tsample.h2'), note: '24px · Plus Jakarta Sans · bold' },
            { role: 'H3', cls: 'font-display text-xl font-bold text-ink', sample: t('type.tsample.h3'), note: '20px · Plus Jakarta Sans · bold' },
            { role: 'H4', cls: 'font-display text-base font-bold text-ink', sample: t('type.tsample.h4'), note: '16px · Plus Jakarta Sans · bold' },
            { role: t('type.role.subheading'), cls: 'text-base font-semibold text-ink-soft', sample: t('type.tsample.subheading'), note: '16px · Inter · semibold' },
            { role: t('type.role.label'), cls: 'text-sm font-medium text-ink-muted', sample: t('type.tsample.label'), note: '14px · Inter · medium' },
            { role: 'Eyebrow', cls: 'font-mono text-11 font-semibold uppercase tracking-[0.18em] text-primary-fg', sample: t('type.tsample.eyebrow'), note: '11px · JetBrains Mono · semibold · ' + t('type.note.tracked') },
          ].map((r) => (
            <div key={r.role} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 sm:flex-nowrap">
              <span className="w-24 shrink-0 font-mono text-10 uppercase tracking-wider text-ink-muted sm:w-28">{r.role}</span>
              <p className={`min-w-0 basis-full truncate sm:flex-1 sm:basis-0 ${r.cls}`}>{r.sample}</p>
              <span className="hidden shrink-0 font-mono text-10 text-ink-muted lg:block">{r.note}</span>
            </div>
          ))}
        </Card>
      </Section>

      <Section title={t('type.context.title')} hint={t('type.context.hint')}>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-8">
            <p className="font-mono text-11 uppercase tracking-[0.18em] text-primary-fg">{t('type.ctx.eyebrow')}</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">{t('type.ctx.heading')}</h2>
            <p className="mt-4 text-15 leading-relaxed text-ink-soft">
              {t('type.ctx.p1')}
            </p>
            <h3 className="mt-6 font-display text-lg font-bold text-ink">{t('type.ctx.h3')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {(['type.ctx.li1', 'type.ctx.li2', 'type.ctx.li3'] as const).map((li) => (
                <li key={li} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {t(li)}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-muted">
              {t('type.ctx.readBefore').split('{link}').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && <a className="font-medium text-primary-fg underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600">{t('type.ctx.guide')}</a>}
                </React.Fragment>
              ))}
            </p>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="font-mono text-11 uppercase tracking-[0.16em] text-ink-muted">{t('type.ctx.throughput')}</p>
              <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
                2.9<span className="ml-1 font-mono text-lg font-semibold text-ink-muted">M/s</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">{t('type.ctx.peak')}</p>
            </Card>
            <Card className="p-6">
              <blockquote className="font-display text-lg font-medium leading-snug text-ink">
                {t('type.ctx.quote')}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <Avatar name="Devon Achebe" src={photo('photo-1500648767791-00dcc994a43e')} size={36} />
                <div>
                  <p className="text-sm font-semibold text-ink">Devon Achebe</p>
                  <p className="text-xs text-ink-muted">{t('type.ctx.role')}</p>
                </div>
              </figcaption>
            </Card>
          </div>
        </div>
      </Section>
    </Page>
  )
}

export function SpacingPage() {
  const { t } = useI18n()
  const steps = [
    { t: '0.5', px: 4 },
    { t: '1', px: 8 },
    { t: '2', px: 16 },
    { t: '3', px: 24 },
    { t: '4', px: 32 },
    { t: '6', px: 48 },
    { t: '8', px: 64 },
    { t: '10', px: 80 },
  ]
  const radii = [
    { name: 'sm', cls: 'rounded-md', px: '6' },
    { name: 'md', cls: 'rounded-xl', px: '12' },
    { name: 'lg', cls: 'rounded-2xl', px: '16' },
    { name: 'full', cls: 'rounded-full', px: '∞' },
  ]
  return (
    <Page
      eyebrow={t('nav.group.foundations')}
      title={t('nav.spacing')}
      lead={t('spacing.lead')}
    >
      <Section title={t('spacing.scale.title')} hint={t('spacing.scale.hint')}>
        <Card className="space-y-3 p-6">
          {steps.map((s) => (
            <div key={s.t} className="flex items-center gap-4">
              <span className="w-10 font-mono text-xs text-ink-muted">{s.t}</span>
              <div className="h-6 rounded-md bg-brand-500/85" style={{ width: s.px }} />
              <span className="font-mono text-11 text-ink-muted">{s.px}px</span>
            </div>
          ))}
        </Card>
      </Section>
      <Section title={t('spacing.radius.title')}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {radii.map((r) => (
            <Card key={r.name} className="p-6">
              <div className={`h-20 border-2 border-dashed border-primary-border bg-primary-soft ${r.cls}`} />
              <p className="mt-3 text-sm font-semibold text-ink">{r.name}</p>
              <p className="font-mono text-10 text-ink-muted">{r.px}px</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title={t('spacing.elev.title')} hint={t('spacing.elev.hint')}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { level: '0', name: t('spacing.elev.flat'), token: 'shadow-none', shadow: '', desc: t('spacing.elev.flatDesc') },
            { level: '1', name: t('spacing.elev.raised'), token: 'shadow-xs', shadow: 'shadow-[0_1px_2px_rgba(15,23,42,0.06)]', desc: t('spacing.elev.raisedDesc') },
            { level: '2', name: t('spacing.elev.card'), token: 'shadow-sm', shadow: 'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.18)]', desc: t('spacing.elev.cardDesc') },
            { level: '3', name: t('spacing.elev.popover'), token: 'shadow-md', shadow: 'shadow-[0_16px_40px_-16px_rgba(15,23,42,0.3)]', desc: t('spacing.elev.popoverDesc') },
            { level: '4', name: t('spacing.elev.modal'), token: 'shadow-lg', shadow: 'shadow-[0_24px_60px_-20px_rgba(15,23,42,0.5)]', desc: t('spacing.elev.modalDesc') },
            { level: '5', name: t('spacing.elev.glow'), token: 'shadow-brand', shadow: 'shadow-[0_18px_40px_-20px_rgba(8,145,178,0.55)]', desc: t('spacing.elev.glowDesc') },
          ].map((e) => (
            <div key={e.level} className={`flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 ${e.shadow}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft font-mono text-10 font-bold text-primary-fg">{e.level}</span>
                  <p className="text-sm font-semibold text-ink">{e.name}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{e.desc}</p>
              </div>
              <span className="mt-4 inline-block rounded-full border border-line bg-canvas px-2.5 py-1 font-mono text-10 text-ink-muted">{e.token}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('spacing.ctx.title')} hint={t('spacing.ctx.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: t('spacing.ctx.none'), shadow: '', hover: '' },
            { label: t('spacing.ctx.subtle'), shadow: 'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.18)]', hover: 'hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_32px_-16px_rgba(15,23,42,0.28)] hover:-translate-y-0.5' },
            { label: t('spacing.ctx.brand'), shadow: 'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.18)]', hover: 'hover:shadow-[0_18px_40px_-20px_rgba(8,145,178,0.55)] hover:border-primary-border hover:-translate-y-0.5' },
          ].map((e) => (
            <div key={e.label} className={`cursor-default rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ${e.shadow} ${e.hover}`}>
              <p className="text-sm font-semibold text-ink">{e.label}</p>
              <p className="mt-1 text-xs text-ink-muted">{t('spacing.ctx.hover')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('spacing.div.title')} hint={t('spacing.div.hint')}>
        <Card className="divide-y divide-line-soft">
          <div className="px-6 py-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('spacing.div.horizontal')}</p>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-ink-soft">{t('spacing.div.above')}</p>
                <div className="my-4 h-px bg-line" />
                <p className="text-sm text-ink-soft">{t('spacing.div.below')}</p>
              </div>
              <div>
                <p className="text-sm text-ink-soft">{t('spacing.div.soft')}</p>
                <div className="my-4 h-px bg-line-soft" />
                <p className="text-sm text-ink-soft">{t('spacing.div.barely')}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('spacing.div.withLabel')}</p>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="shrink-0 text-xs font-medium text-ink-muted">{t('spacing.div.or')}</span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="shrink-0 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('spacing.div.sectionB')}</span>
              <div className="h-px flex-1 bg-line" />
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('spacing.div.vertical')}</p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-ink-soft">{t('spacing.div.streams')}</span>
              <div className="h-5 w-px bg-line" />
              <span className="text-sm text-ink-soft">{t('spacing.div.schemas')}</span>
              <div className="h-5 w-px bg-line" />
              <span className="text-sm text-ink-soft">{t('spacing.div.connectors')}</span>
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  )
}

const PHOSPHOR_SAMPLE: { name: string; Cmp: PhosphorIcon }[] = [
  { name: 'Waveform', Cmp: Waveform },
  { name: 'ChartLineUp', Cmp: ChartLineUp },
  { name: 'UsersThree', Cmp: UsersThree },
  { name: 'Database', Cmp: Database },
  { name: 'Broadcast', Cmp: Broadcast },
  { name: 'GitBranch', Cmp: GitBranch },
  { name: 'Pulse', Cmp: Pulse },
  { name: 'Gauge', Cmp: Gauge },
  { name: 'CloudArrowUp', Cmp: CloudArrowUp },
  { name: 'Lightning', Cmp: Lightning },
  { name: 'ShieldCheck', Cmp: ShieldCheck },
  { name: 'Funnel', Cmp: Funnel },
  { name: 'Globe', Cmp: Globe },
  { name: 'GearSix', Cmp: GearSix },
  { name: 'Bell', Cmp: Bell },
  { name: 'MagnifyingGlass', Cmp: MagnifyingGlass },
  { name: 'Lock', Cmp: Lock },
  { name: 'Sparkle', Cmp: Sparkle },
]
const WEIGHTS: IconWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone']

export function IconsPage() {
  const { t } = useI18n()
  return (
    <Page
      eyebrow={t('nav.group.foundations')}
      title={t('nav.icons')}
      lead={t('icons.lead')}
    >
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{t('icons.lib.title')}</p>
          <p className="mt-1 text-sm text-ink-muted">{t('icons.lib.body')}</p>
          <code className="mt-3 inline-block max-w-full overflow-x-auto rounded-lg bg-canvas px-2.5 py-1 font-mono text-xs text-ink-soft ring-1 ring-line-soft">pnpm add @phosphor-icons/react</code>
        </div>
        <a
          href="https://phosphoricons.com"
          target="_blank"
          rel="noopener noreferrer"
          className="pance-focus inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-primary-border hover:text-primary-fg sm:self-center"
        >
          {t('icons.lib.cta')}
          <ArrowUpRight size={16} aria-hidden />
          <span className="sr-only">{t('home.links.newTab')}</span>
        </a>
      </Card>

      <Section title={t('icons.weights.title')} hint={t('icons.weights.hint')}>
        <Card className="flex flex-wrap items-end gap-x-8 gap-y-5 p-6">
          {WEIGHTS.map((w) => (
            <div key={w} className="flex flex-col items-center gap-2">
              <Waveform size={40} weight={w} className="text-primary-fg" />
              <span className="font-mono text-10 uppercase tracking-wider text-ink-muted">{w}</span>
            </div>
          ))}
        </Card>
      </Section>

      <Section title={t('icons.sample.title')} hint={t('icons.sample.hint')}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {PHOSPHOR_SAMPLE.map(({ name, Cmp }) => (
            <div
              key={name}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-line-soft bg-surface p-5 transition-colors hover:border-primary-border hover:bg-primary-soft/40"
            >
              <Cmp size={26} weight="regular" className="text-ink-soft transition-colors group-hover:text-primary-fg" />
              <span className="w-full truncate text-center font-mono text-10 text-ink-muted">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('icons.sizing.title')} hint={t('icons.sizing.hint')}>
        <Card className="flex flex-wrap items-center gap-10 p-6">
          {[20, 24, 32, 48].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Broadcast size={s} weight="regular" className="text-ink-soft" />
              <span className="font-mono text-10 text-ink-muted">{s}px</span>
            </div>
          ))}
        </Card>
      </Section>
    </Page>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */
const SEVERITIES: { key: Severity; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'success', label: 'Success' },
  { key: 'info', label: 'Info' },
  { key: 'warning', label: 'Warning' },
  { key: 'help', label: 'Help' },
  { key: 'danger', label: 'Danger' },
  { key: 'contrast', label: 'Contrast' },
]

export function ButtonsPage() {
  const [toggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()
  const run = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }
  return (
    <Page
      eyebrow={t('nav.group.components')}
      title={t('nav.buttons')}
      lead={t('buttons.lead')}
    >
      <Section title={t('buttons.severity.title')} hint="filled · 8 intents">
        <Demo>
          {SEVERITIES.map((s) => (
            <Button key={s.key} severity={s.key}>{s.label}</Button>
          ))}
        </Demo>
      </Section>

      <Section title={t('buttons.variants.title')} hint="filled · outlined · text · link">
        <Card className="divide-y divide-line-soft">
          {(['filled', 'outlined', 'text', 'link'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3 px-6 py-4">
              <span className="w-20 shrink-0 font-mono text-11 uppercase tracking-wider text-ink-muted">{v}</span>
              {SEVERITIES.map((s) => (
                <Button key={s.key} severity={s.key} variant={v} size="sm">{s.label}</Button>
              ))}
            </div>
          ))}
        </Card>
      </Section>

      <Section title={t('buttons.sizes.title')} hint="32 · 40 · 48px">
        <Demo>
          <Button size="sm" Icon={IconPlus}>{t('buttons.sizes.sm')}</Button>
          <Button size="md" Icon={IconPlus}>{t('buttons.sizes.md')}</Button>
          <Button size="lg" Icon={IconPlus}>{t('buttons.sizes.lg')}</Button>
          <span className="mx-2 h-8 w-px bg-line" />
          <Button size="sm" variant="outlined" Icon={IconPlus} aria-label={t('overlays.menu.newStream')} />
          <Button size="md" variant="outlined" Icon={IconPlus} aria-label={t('overlays.menu.newStream')} />
          <Button size="lg" variant="outlined" Icon={IconPlus} aria-label={t('overlays.menu.newStream')} />
        </Demo>
      </Section>

      <Section title={t('buttons.icon.title')} hint="left · right · top · bottom · only">
        <Demo>
          <Button Icon={IconDownload} iconPos="left">{t('buttons.icon.export')}</Button>
          <Button Icon={IconArrowRight} iconPos="right">{t('buttons.icon.continue')}</Button>
          <Button Icon={IconDownload} TrailingIcon={IconChevronDown}>{t('buttons.icon.download')}</Button>
          <Button Icon={IconStream} iconPos="top" variant="outlined">{t('buttons.icon.streams')}</Button>
          <Button Icon={IconChart} iconPos="bottom" variant="outlined">{t('buttons.icon.metrics')}</Button>
          <Button Icon={IconHeart} aria-label={t('buttons.icon.like')} />
          <Button Icon={IconStar} aria-label={t('buttons.icon.star')} rounded severity="warning" />
        </Demo>
      </Section>

      <Section title={t('buttons.shape.title')} hint="rounded · raised">
        <Demo>
          <Button rounded>{t('buttons.shape.rounded')}</Button>
          <Button rounded variant="outlined" severity="help">{t('buttons.shape.roundedOutlined')}</Button>
          <Button raised>{t('buttons.shape.raised')}</Button>
          <Button raised rounded severity="success" Icon={IconCheck}>{t('buttons.shape.raisedRounded')}</Button>
        </Demo>
      </Section>

      <Section title={t('buttons.states.title')} hint="default · disabled · loading">
        <Demo>
          <Button>{t('buttons.states.default')}</Button>
          <Button disabled>{t('buttons.states.disabled')}</Button>
          <Button variant="outlined" disabled>{t('buttons.states.disabledOutlined')}</Button>
          <Button loading>{t('buttons.states.saving')}</Button>
          <Button onClick={run} loading={loading} severity="success" Icon={IconCheck}>
            {loading ? t('buttons.states.provisioning') : t('buttons.states.provision')}
          </Button>
        </Demo>
      </Section>

      <Section title={t('buttons.badge.title')} hint={t('buttons.badge.hint')}>
        <Demo>
          <Button badge={12} Icon={IconStream}>{t('buttons.icon.streams')}</Button>
          <Button variant="outlined" badge={3} severity="warning" Icon={IconAlert}>{t('buttons.badge.alerts')}</Button>
          <Button variant="text" badge="99+" severity="secondary" Icon={IconMail}>{t('buttons.badge.inbox')}</Button>
        </Demo>
      </Section>

      <Section title={t('buttons.group.title')} hint={t('buttons.group.hint')}>
        <Demo>
          <div className="max-w-full overflow-x-auto">
            {/* Small size on phones so the whole group fits without scrolling. */}
            {(['sm', 'md'] as const).map((size) => (
              <span key={size} className={size === 'sm' ? 'inline-flex sm:hidden' : 'hidden sm:inline-flex'}>
                <ButtonGroup>
                  <Button size={size} variant="outlined" severity="secondary" Icon={IconEdit}>{t('buttons.group.edit')}</Button>
                  <Button size={size} variant="outlined" severity="secondary" Icon={IconCopy}>{t('buttons.group.duplicate')}</Button>
                  <Button size={size} variant="outlined" severity="secondary" Icon={IconTrash}>{t('buttons.group.delete')}</Button>
                </ButtonGroup>
              </span>
            ))}
          </div>
          <ButtonGroup>
            <Button Icon={IconArrowUp} aria-label={t('buttons.group.sortAsc')} />
            <Button Icon={IconArrowDown} aria-label={t('buttons.group.sortDesc')} />
          </ButtonGroup>
        </Demo>
      </Section>

      <Section title={t('buttons.split.title')} hint={t('buttons.split.hint')}>
        <Demo>
          <SplitButton
            label={t('buttons.split.save')}
            Icon={IconCheck}
            items={[
              { label: t('buttons.split.saveDeploy'), Icon: IconArrowRight },
              { label: t('buttons.split.saveDraft'), Icon: IconCopy },
              { label: t('buttons.split.discard'), Icon: IconTrash, danger: true },
            ]}
          />
          <SplitButton
            label={t('buttons.split.export')}
            severity="secondary"
            Icon={IconDownload}
            items={[{ label: t('buttons.split.csv') }, { label: t('buttons.split.json') }, { label: t('buttons.split.copy'), Icon: IconCopy }]}
          />
        </Demo>
      </Section>

      <Section title={t('buttons.toggle.title')} hint={t('buttons.toggle.hint')}>
        <Demo>
          <ToggleButton on={toggle} onChange={setToggle} onLabel={t('buttons.toggle.on')} offLabel={t('buttons.toggle.off')} OnIcon={IconCheck} OffIcon={IconPlus} />
          <span className="text-sm text-ink-muted">
            aria-pressed = <span className="font-mono text-ink-soft">{String(toggle)}</span>
          </span>
        </Demo>
      </Section>

      <Section title={t('buttons.full.title')} hint={t('buttons.full.hint')}>
        <Card className="space-y-3 p-6 sm:max-w-sm">
          <Button block Icon={IconLock}>{t('buttons.full.signIn')}</Button>
          <Button block variant="outlined" severity="secondary">{t('buttons.full.create')}</Button>
          <Button block variant="link" severity="secondary">{t('buttons.full.forgot')}</Button>
        </Card>
      </Section>
    </Page>
  )
}

function TagInputDemo() {
  const { t } = useI18n()
  const [tags, setTags] = useState(['streaming', 'kafka', 'avro'])
  return <TagInput tags={tags} onChange={setTags} placeholder={t('forms.tags.addPh')} />
}
function TagInputSuggestDemo() {
  const { t } = useI18n()
  const [tags, setTags] = useState(['react', 'typescript'])
  const suggestions = ['react', 'typescript', 'tailwind', 'vite', 'kafka', 'avro', 'protobuf', 'graphql', 'rest', 'grpc']
  return <TagInput tags={tags} onChange={setTags} suggestions={suggestions} placeholder={t('forms.tags.searchPh')} />
}

export function FormsPage() {
  const { t } = useI18n()
  /* — state for each section — */
  const [email, setEmail] = useState('maren@river.io')
  const [emailDraft, setEmailDraft] = useState('maren@')
  const emailError = emailDraft.includes('@') && emailDraft.split('@')[1]?.includes('.') ? undefined : t('forms.states.emailError')
  const [region, setRegion] = useState('us-east-1')
  const [tz, setTz] = useState('')
  const [bio, setBio] = useState('')
  const maxBio = 200
  const [slider, setSlider] = useState(42)
  const [sliderWarn, setSliderWarn] = useState(78)
  const [pinDone, setPinDone] = useState(false)
  const [pinError, setPinError] = useState(false)
  const [streamName, setStreamName] = useState('checkout-events')
  const [price, setPrice] = useState('49')
  const [pwd, setPwd] = useState('')
  const [deliver, setDeliver] = useState<string | null>('2026-10-15')
  const [period, setPeriod] = useState<DateRange>({ start: '2026-10-05', end: '2026-10-12' })
  const [inline, setInline] = useState<string | null>(null)
  const pwdStrength = pwd.length === 0 ? 0 : pwd.length < 6 ? 20 : pwd.length < 10 ? 55 : pwd.length < 14 ? 75 : 100
  const pwdSev: 'danger' | 'warning' | 'success' | 'primary' = pwdStrength < 25 ? 'danger' : pwdStrength < 60 ? 'warning' : pwdStrength < 80 ? 'primary' : 'success'
  const pwdLabel = pwdStrength < 25 ? t('forms.pwd.weak') : pwdStrength < 60 ? t('forms.pwd.fair') : pwdStrength < 80 ? t('forms.pwd.good') : t('forms.pwd.strong')

  /* invite form */
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [invitePerm, setInvitePerm] = useState('viewer')
  const [inviteNotify, setInviteNotify] = useState(true)
  const inviteEmailOk = inviteEmail.length === 0 || (inviteEmail.includes('@') && inviteEmail.split('@')[1]?.includes('.'))

  const REGIONS = [
    { value: 'us-east-1', label: 'N. Virginia', meta: 'us-east-1' },
    { value: 'us-west-2', label: 'Oregon', meta: 'us-west-2' },
    { value: 'eu-west-2', label: 'London', meta: 'eu-west-2' },
    { value: 'eu-central-1', label: 'Frankfurt', meta: 'eu-central-1' },
    { value: 'ap-south-1', label: 'Mumbai', meta: 'ap-south-1' },
    { value: 'ap-southeast-1', label: 'Singapore', meta: 'ap-southeast-1' },
    { value: 'sa-east-1', label: 'São Paulo', meta: 'sa-east-1' },
  ]

  return (
    <Page
      eyebrow={t('nav.group.components')}
      title={t('nav.forms')}
      lead={t('forms.lead')}
    >
      {/* ── 1. Input sizes ── */}
      <Section title={t('forms.sizes.title')} hint="sm · md · lg">
        <Card className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={t('forms.sizes.sm')}>
              <Input inputSize="sm" placeholder={t('forms.sizes.phSm')} />
            </Field>
            <Field label={t('forms.sizes.md')}>
              <Input inputSize="md" placeholder={t('forms.sizes.phMd')} />
            </Field>
            <Field label={t('forms.sizes.lg')}>
              <Input inputSize="lg" placeholder={t('forms.sizes.phLg')} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={t('forms.sizes.iconSm')}>
              <Input inputSize="sm" Icon={IconSearch} placeholder={t('forms.search')} />
            </Field>
            <Field label={t('forms.sizes.iconMd')}>
              <Input inputSize="md" Icon={IconSearch} placeholder={t('forms.search')} />
            </Field>
            <Field label={t('forms.sizes.iconLg')}>
              <Input inputSize="lg" Icon={IconSearch} placeholder={t('forms.search')} />
            </Field>
          </div>
        </Card>
      </Section>

      {/* ── 2. All field states ── */}
      <Section title={t('forms.states.title')} hint={t('forms.states.hint')}>
        <Card className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          <Field label={t('forms.states.default')} hint={t('forms.states.defaultHint')}>
            <Input placeholder={t('forms.states.defaultPh')} />
          </Field>
          <Field label={t('forms.states.filled')} hint={t('forms.states.filledHint')}>
            <Input defaultValue="checkout-events-prod" />
          </Field>
          <Field label={t('forms.states.focus')} hint={t('forms.states.focusHint')}>
            <Input
              defaultValue="river-events"
              className="border-brand-500 shadow-[var(--pance-focus-ring)]"
            />
          </Field>
          <Field label={t('forms.states.notifEmail')} error={emailError}>
            <Input
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              error={!!emailError}
              Icon={IconMail}
              placeholder="you@company.com"
            />
          </Field>
          <Field label={t('forms.states.emailOk')} success={t('forms.states.emailOkMsg')}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} success Icon={IconMail} />
          </Field>
          <Field label={t('forms.states.apiSecret')} hint={t('forms.states.apiSecretHint')}>
            <Input defaultValue="pk_live_9f2b…c41a" Icon={IconLock} readOnly className="bg-canvas text-ink-muted" />
          </Field>
          <Field label={t('forms.states.region')} hint={t('forms.states.regionHint')}>
            <Input defaultValue="us-east-1" disabled />
          </Field>
          <Field label={t('forms.states.password')} hint={t('forms.states.passwordHint')}>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} Icon={IconLock} placeholder={t('forms.states.passwordPh')} />
          </Field>
          <Field label={t('forms.states.trailing')}>
            <Input defaultValue="2026-08-13" TrailingIcon={IconCalendar} />
          </Field>
        </Card>
      </Section>

      {/* ── Date pickers ── */}
      <Section title={t('forms.date.title')} hint={t('forms.date.hint')}>
        <Card className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-4">
            <Field label={t('forms.date.single')} hint={t('forms.date.singleHint')}>
              <DatePicker value={deliver} onChange={setDeliver} placeholder={t('forms.date.singlePh')} />
            </Field>
            <Field label={t('forms.date.range')}>
              <DateRangePicker
                value={period}
                onChange={setPeriod}
                placeholder={t('forms.date.rangePh')}
                presets={[
                  { label: t('forms.date.last7'), range: { start: toISODate(new Date(Date.now() - 6 * 864e5)), end: toISODate(new Date()) } },
                  { label: t('forms.date.last30'), range: { start: toISODate(new Date(Date.now() - 29 * 864e5)), end: toISODate(new Date()) } },
                  { label: t('forms.date.thisMonth'), range: { start: toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), end: toISODate(new Date()) } },
                ]}
              />
            </Field>
          </div>
          <div>
            <p className="mb-2 font-medium text-sm text-ink">{t('forms.date.calendar')} · <span className="font-normal text-ink-muted">{t('forms.date.future')}</span></p>
            <div className="inline-block rounded-xl border border-line">
              <Calendar value={inline} onChange={setInline} min={toISODate(new Date())} />
            </div>
          </div>
        </Card>
      </Section>

      {/* ── 3. Password strength ── */}
      <Section title={t('forms.pwd.title')} hint={t('forms.pwd.hint')}>
        <Card className="max-w-md space-y-3 p-6">
          <Field label={t('forms.pwd.new')} hint={pwd.length > 0 ? t('forms.pwd.strength', { level: pwdLabel }) : t('forms.pwd.min')}>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} Icon={IconLock} placeholder={t('forms.pwd.ph')} />
          </Field>
          {pwd.length > 0 && (
            <div className="space-y-1.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pwdSev === 'danger' ? 'bg-rose-500' : pwdSev === 'warning' ? 'bg-amber-500' : pwdSev === 'primary' ? 'bg-brand-500' : 'bg-emerald-500'}`}
                  style={{ width: `${pwdStrength}%` }}
                />
              </div>
              <p className={`text-xs font-medium ${pwdSev === 'danger' ? 'text-danger-fg' : pwdSev === 'warning' ? 'text-warning-fg' : pwdSev === 'primary' ? 'text-primary-fg' : 'text-success-fg'}`}>
                {pwdLabel}
              </p>
            </div>
          )}
        </Card>
      </Section>

      {/* ── 4. Input addons ── */}
      <Section title={t('forms.addons.title')} hint={t('forms.addons.hint')}>
        <Card className="grid gap-6 p-6 md:grid-cols-2">
          <Field label={t('forms.addons.domain')} hint={t('forms.addons.domainHint')}>
            <InputGroup prefix="https://">
              <Input placeholder="yourapp.river.io" />
            </InputGroup>
          </Field>
          <Field label={t('forms.addons.price')} hint={t('forms.addons.priceHint')}>
            <InputGroup prefixIcon={IconCurrency} suffix="/mo">
              <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            </InputGroup>
          </Field>
          <Field label={t('forms.addons.discount')} hint={t('forms.addons.discountHint')}>
            <InputGroup suffix="%">
              <Input type="number" defaultValue="15" />
            </InputGroup>
          </Field>
          <Field label={t('forms.addons.handle')} hint={t('forms.addons.handleHint')}>
            <InputGroup prefixIcon={IconAt}>
              <Input placeholder="team-alerts" />
            </InputGroup>
          </Field>
          <Field label={t('forms.addons.searchAction')} hint={t('forms.addons.searchActionHint')}>
            <InputGroup suffixButton={<Button size="md" className="!h-full rounded-l-none rounded-r-xl">{t('forms.addons.searchBtn')}</Button>}>
              <Input placeholder={t('forms.addons.searchPh')} Icon={IconSearch} />
            </InputGroup>
          </Field>
          <Field label={t('forms.addons.phone')} hint={t('forms.addons.phoneHint')}>
            <InputGroup prefix="+1">
              <Input type="tel" placeholder="(555) 000-0000" Icon={IconPhone} />
            </InputGroup>
          </Field>
        </Card>
      </Section>

      {/* ── 5. Textarea ── */}
      <Section title={t('forms.textarea.title')} hint={t('forms.textarea.hint')}>
        <Card className="grid gap-6 p-6 md:grid-cols-2">
          <Field label={t('forms.textarea.desc')} hint={t('forms.textarea.descHint')}>
            <Textarea rows={4} placeholder={t('forms.textarea.descPh')} />
          </Field>
          <Field
            label={t('forms.textarea.bio')}
            hint={bio.length === 0 ? t('forms.textarea.bioHint') : undefined}
            charCount={bio.length}
            maxChars={maxBio}
            error={bio.length > maxBio ? t('forms.textarea.bioOver', { n: bio.length - maxBio }) : undefined}
          >
            <Textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              error={bio.length > maxBio}
              placeholder={t('forms.textarea.bioPh')}
            />
          </Field>
          <Field label={t('forms.textarea.errorState')} error={t('forms.textarea.errorMsg')}>
            <Textarea rows={3} defaultValue="<script>alert('oops')</script>" error />
          </Field>
          <Field label={t('forms.textarea.disabled')} hint={t('forms.textarea.disabledHint')}>
            <Textarea rows={3} defaultValue={t('forms.textarea.disabledValue')} disabled className="opacity-60" />
          </Field>
        </Card>
      </Section>

      {/* ── 6. Select & Combobox ── */}
      <Section title={t('forms.select.title')} hint={t('forms.select.hint')}>
        <Card className="grid gap-6 p-6 md:grid-cols-2">
          <Field label={t('forms.select.region')} hint={t('forms.select.regionHint')}>
            <Select
              value={region === 'us-east-1' ? 'us-east-1 · N. Virginia' : region}
              onChange={setRegion}
              options={['us-east-1 · N. Virginia', 'eu-west-2 · London', 'ap-south-1 · Mumbai', 'sa-east-1 · São Paulo']}
            />
          </Field>
          <Field label={t('forms.select.tz')} hint={t('forms.select.tzHint')}>
            <Combobox
              placeholder={t('forms.select.tzPh')}
              value={tz}
              onChange={setTz}
              options={REGIONS}
            />
          </Field>
        </Card>
      </Section>

      {/* ── 7. Range slider ── */}
      <Section title={t('forms.slider.title')} hint={t('forms.slider.hint')}>
        <Card className="space-y-8 p-6">
          {[
            { label: t('forms.slider.ingest'), sev: 'primary' as const, val: slider, set: setSlider, hint: t('forms.slider.ingestHint') },
            { label: t('forms.slider.disk'), sev: 'warning' as const, val: sliderWarn, set: setSliderWarn, hint: t('forms.slider.diskHint') },
          ].map((r) => (
            <div key={r.label} className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-soft">{r.label}</span>
                  <span className="font-mono font-semibold text-ink">{r.val}%</span>
                </div>
                <RangeSlider value={r.val} onChange={r.set} severity={r.sev} label={r.label} valueText={`${r.val}%`} />
                <p className="text-xs text-ink-muted">{r.hint}</p>
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink-soft">{t('forms.slider.danger')}</p>
            <RangeSlider value={94} onChange={() => {}} severity="danger" label={t('forms.slider.danger')} valueText="94%" />
            <p className="text-xs text-ink-muted">{t('forms.slider.static')}</p>
          </div>
        </Card>
      </Section>

      {/* ── 8. File drop zone ── */}
      <Section title={t('forms.upload.title')} hint={t('forms.upload.hint')}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <Field label={t('forms.upload.schema')} hint={t('forms.upload.schemaHint')}>
              <FileDropzone
                accept=".json,.avsc"
                hint={t('forms.upload.schemaDrop')}
                Icon={IconUpload}
              />
            </Field>
          </Card>
          <Card className="p-6">
            <Field label={t('forms.upload.bulk')} hint={t('forms.upload.bulkHint')}>
              <FileDropzone
                accept=".csv"
                hint={t('forms.upload.bulkDrop')}
                Icon={IconUpload}
              />
            </Field>
          </Card>
        </div>
      </Section>

      {/* ── 9. PIN / OTP input ── */}
      <Section title={t('forms.pin.title')} hint={t('forms.pin.hint')}>
        <Card className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Field label={t('forms.pin.code')} hint={t('forms.pin.codeHint')}>
                <PinInput
                  length={6}
                  onComplete={(pin) => { setPinDone(true); setPinError(false); console.log('PIN', pin) }}
                />
              </Field>
              {pinDone && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-success-fg">
                  <IconCheck className="h-4 w-4" /> {t('forms.pin.accepted')}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <Field label={t('forms.pin.invalid')} error={t('forms.pin.invalidMsg')}>
                <PinInput length={6} error onComplete={() => {}} />
              </Field>
              <p className="text-xs text-ink-muted">{t('forms.pin.note')}</p>
            </div>
          </div>
        </Card>
      </Section>

      {/* ── 10. Inline edit ── */}
      {/* ── Tag / Chip input ── */}
      <Section title={t('forms.tags.title')} hint={t('forms.tags.hint')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5 space-y-3">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('forms.tags.free')}</p>
            <Field label={t('forms.tags.freeLabel')} hint={t('forms.tags.freeHint')}>
              <TagInputDemo />
            </Field>
          </Card>
          <Card className="p-5 space-y-3">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('forms.tags.suggest')}</p>
            <Field label={t('forms.tags.tech')} hint={t('forms.tags.techHint')}>
              <TagInputSuggestDemo />
            </Field>
          </Card>
        </div>
      </Section>

      <Section title={t('forms.inline.title')} hint={t('forms.inline.hint')}>
        <Card className="p-6">
          <div className="space-y-6">
            <p className="text-sm text-ink-muted">{t('forms.inline.intro')}</p>
            <div className="divide-y divide-line-soft">
              {[
                { label: t('forms.inline.streamName'), value: streamName, set: setStreamName },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3.5">
                  <span className="w-40 shrink-0 text-sm text-ink-muted">{row.label}</span>
                  <InlineEdit value={row.value} onChange={row.set} />
                </div>
              ))}
              <div className="flex items-center justify-between py-3.5">
                <span className="w-40 shrink-0 text-sm text-ink-muted">{t('forms.states.notifEmail')}</span>
                <InlineEdit value={email} onChange={setEmail} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <span className="w-40 shrink-0 text-sm text-ink-muted">{t('forms.inline.priceSeat')}</span>
                <InlineEdit value={`$${price}/mo`} onChange={(v) => setPrice(v.replace(/[^0-9]/g, ''))} />
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* ── 11. Validation patterns ── */}
      <Section title={t('forms.val.title')} hint={t('forms.val.hint')}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="space-y-1 p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('forms.val.realtime')}</p>
            <Field
              label={t('forms.val.email')}
              error={emailDraft.length > 0 && !!emailError ? emailError : undefined}
              success={!emailError && emailDraft.length > 0 ? t('forms.val.emailOk') : undefined}
            >
              <Input value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} Icon={IconMail} error={!!emailError && emailDraft.length > 0} success={!emailError && emailDraft.length > 0} placeholder="you@company.com" />
            </Field>
          </Card>
          <Card className="space-y-1 p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('forms.val.required')}</p>
            <Field label={t('forms.val.fullName')} required hint={t('forms.val.fullNameHint')}>
              <Input Icon={IconUser} placeholder="Ines Halvorsen" />
            </Field>
          </Card>
          <Card className="space-y-1 p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('forms.val.optional')}</p>
            <Field label={t('forms.val.company')} optional hint={t('forms.val.companyHint')}>
              <Input placeholder="River Labs" />
            </Field>
          </Card>
        </div>
      </Section>

      {/* ── 12. Form layout patterns ── */}
      <Section title={t('forms.layout.title')} hint={t('forms.layout.hint')}>
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Stacked */}
          <Card className="overflow-hidden">
            <header className="border-b border-line-soft px-6 py-4">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('forms.layout.stacked')}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{t('forms.layout.stackedDesc')}</p>
            </header>
            <div className="space-y-5 p-6">
              <Field label={t('forms.layout.streamName')} required hint={t('forms.layout.streamNameHint')}>
                <Input defaultValue="checkout-events" />
              </Field>
              <Field label={t('forms.states.notifEmail')} required>
                <Input defaultValue="team@river.io" Icon={IconMail} />
              </Field>
              <Field label={t('forms.layout.description')} optional hint={t('forms.layout.descriptionHint')}>
                <Textarea rows={3} placeholder={t('forms.layout.descriptionPh')} />
              </Field>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outlined" severity="secondary">{t('forms.layout.cancel')}</Button>
                <Button>{t('forms.layout.create')}</Button>
              </div>
            </div>
          </Card>

          {/* Two-column */}
          <Card className="overflow-hidden">
            <header className="border-b border-line-soft px-6 py-4">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('forms.layout.twoCol')}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{t('forms.layout.twoColDesc')}</p>
            </header>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <Field label={t('forms.layout.first')} required>
                <Input placeholder="Ines" Icon={IconUser} />
              </Field>
              <Field label={t('forms.layout.last')} required>
                <Input placeholder="Halvorsen" />
              </Field>
              <Field label={t('forms.val.email')} required>
                <Input placeholder="ines@river.io" Icon={IconMail} />
              </Field>
              <Field label={t('forms.layout.phone')} optional>
                <InputGroup prefix="+1">
                  <Input type="tel" placeholder="(555) 000-0000" />
                </InputGroup>
              </Field>
              <div className="sm:col-span-2">
                <Field label={t('forms.layout.url')} optional>
                  <InputGroup prefix="https://">
                    <Input placeholder="yourcompany.com" />
                  </InputGroup>
                </Field>
              </div>
              <div className="flex justify-end gap-3 sm:col-span-2 pt-2">
                <Button variant="outlined" severity="secondary">{t('forms.layout.discard')}</Button>
                <Button>{t('forms.layout.saveProfile')}</Button>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 13. Complete form example — Invite teammate ── */}
      <Section title={t('forms.invite.title')} hint={t('forms.invite.hint')}>
        <Card className="overflow-hidden">
          <header className="flex flex-col gap-3 border-b border-line-soft px-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">{t('forms.invite.heading')}</h2>
              <p className="mt-1 text-sm text-ink-muted">{t('forms.invite.desc')}</p>
            </div>
            <span className="shrink-0"><Badge severity="info">{t('forms.invite.remaining')}</Badge></span>
          </header>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <Field label={t('forms.invite.name')} required hint={t('forms.invite.nameHint')}>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                Icon={IconUser}
                placeholder="Devon Achebe"
                success={inviteName.split(' ').length >= 2 && inviteName.length > 3}
              />
            </Field>
            <Field
              label={t('forms.invite.workEmail')}
              required
              error={inviteEmail.length > 0 && !inviteEmailOk ? t('forms.invite.emailError') : undefined}
              success={inviteEmailOk && inviteEmail.length > 4 ? t('forms.invite.emailOk') : undefined}
            >
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                Icon={IconMail}
                placeholder="devon@company.com"
                error={inviteEmail.length > 0 && !inviteEmailOk}
                success={inviteEmailOk && inviteEmail.length > 4}
              />
            </Field>

            <Field label={t('forms.invite.role')} hint={t('forms.invite.roleHint')}>
              <Select
                value={inviteRole || t('forms.invite.rolePh')}
                onChange={setInviteRole}
                options={[t('forms.invite.engineer'), t('forms.invite.analyst'), t('forms.invite.manager'), t('forms.invite.auditor'), t('forms.invite.support')]}
              />
            </Field>
            <Field label={t('forms.invite.perm')} group>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: 'viewer', label: t('forms.invite.viewer') },
                  { k: 'editor', label: t('forms.invite.editor') },
                  { k: 'admin', label: t('forms.invite.admin') },
                ].map(({ k, label }) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={invitePerm === k}
                    onClick={() => setInvitePerm(k)}
                    className={`pance-focus rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${invitePerm === k ? 'border-primary-border-strong bg-primary-soft text-primary-fg' : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:bg-canvas'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <label className="flex items-center justify-between rounded-xl border border-line-soft bg-canvas p-4 sm:col-span-2">
              <span>
                <span className="block text-sm font-medium text-ink">{t('forms.invite.welcome')}</span>
                <span className="text-xs text-ink-muted">{t('forms.invite.welcomeDesc')}</span>
              </span>
              <Toggle on={inviteNotify} onChange={setInviteNotify} label={t('forms.invite.welcome')} />
            </label>
          </div>

          <footer className="flex flex-col gap-3 border-t border-line-soft bg-canvas px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-xs text-ink-muted">{t('forms.invite.expires')}</p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
              <Button variant="outlined" severity="secondary" className="w-full sm:w-auto">{t('forms.layout.cancel')}</Button>
              <Button
                disabled={!inviteName || !inviteEmail || !inviteEmailOk || !inviteRole}
                Icon={IconMail}
                className="w-full sm:w-auto"
              >
                {t('forms.invite.send')}
              </Button>
            </div>
          </footer>
        </Card>
      </Section>
    </Page>
  )
}

export function SelectionPage() {
  const { t, tr } = useI18n()
  /* — checkbox states — */
  const [cbChecked, setCbChecked] = useState(true)
  const [cbUnchecked, setCbUnchecked] = useState(false)

  /* — checkbox group with indeterminate — */
  const [groupValues, setGroupValues] = useState<Set<string>>(new Set(['autoscale', 'compress']))

  /* — radio states — */
  const [tier, setTier] = useState('standard')
  const [plan, setPlan] = useState('growth')
  const [layout, setLayout] = useState('horizontal')

  /* — toggle states — */
  const [toggles, setToggles] = useState({ autoscale: true, alerts: false, compress: true, dedicate: false })

  /* — segmented control — */
  const [view, setView] = useState<'stream' | 'table' | 'graph'>('stream')
  const [period, setPeriod] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  return (
    <Page
      eyebrow={t('nav.group.components')}
      title={t('nav.selection')}
      lead={t('selection.lead')}
    >

      {/* ── 1. Checkbox — all states ── */}
      <Section title={t('selection.cb.title')} hint="unchecked · checked · indeterminate · error · disabled">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.states')}</p>
            <div className="flex flex-col gap-4">
              <Checkbox checked={cbChecked} onChange={setCbChecked} label={t('selection.cb.checked')} />
              <Checkbox checked={cbUnchecked} onChange={setCbUnchecked} label={t('selection.cb.unchecked')} />
              <Checkbox checked={true} indeterminate onChange={() => {}} label={t('selection.cb.indeterminate')} />
              <Checkbox checked={false} onChange={() => {}} label={t('selection.cb.error')} error />
              <Checkbox checked={true} onChange={() => {}} label={t('selection.cb.checkedError')} error />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.disabled')}</p>
            <div className="flex flex-col gap-4">
              <Checkbox checked={false} onChange={() => {}} label={t('selection.cb.unchecked')} disabled />
              <Checkbox checked={true} onChange={() => {}} label={t('selection.cb.checked')} disabled />
              <Checkbox checked={true} indeterminate onChange={() => {}} label={t('selection.cb.indeterminate')} disabled />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.sizes')}</p>
            <div className="flex flex-col gap-4">
              <Checkbox checked={true} onChange={() => {}} label={t('selection.cb.small')} size="sm" />
              <Checkbox checked={true} onChange={() => {}} label={t('selection.cb.medium')} size="md" />
              <Checkbox checked={true} onChange={() => {}} label={t('selection.cb.large')} size="lg" />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.withDesc')}</p>
            <div className="flex flex-col gap-5">
              <Checkbox
                checked={cbChecked}
                onChange={setCbChecked}
                label={t('selection.cb.autoscale')}
                description={t('selection.cb.autoscaleDesc')}
              />
              <Checkbox
                checked={false}
                onChange={() => {}}
                label={t('selection.cb.compress')}
                description={t('selection.cb.compressDesc')}
                disabled
              />
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 2. Checkbox group with select-all + indeterminate ── */}
      <Section title={t('selection.group.title')} hint={t('selection.group.hint')}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <CheckboxGroup
              title={t('selection.group.features')}
              values={groupValues}
              onChange={setGroupValues}
              options={[
                { value: 'autoscale', label: t('selection.group.autoscale'), description: t('selection.group.autoscaleDesc') },
                { value: 'compress', label: t('selection.group.compress'), description: t('selection.group.compressDesc') },
                { value: 'retain', label: t('selection.group.retain'), description: t('selection.group.retainDesc') },
                { value: 'deduplicate', label: t('selection.group.dedupe'), description: t('selection.group.dedupeDesc') },
              ]}
            />
          </Card>
          <Card className="space-y-4 p-5">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.group.horizontal')}</p>
            <div className="flex flex-wrap gap-5">
              {[
                { v: 'json', l: 'JSON' },
                { v: 'avro', l: 'Avro' },
                { v: 'proto', l: 'Protobuf' },
                { v: 'parquet', l: 'Parquet' },
              ].map(({ v, l }) => (
                <Checkbox
                  key={v}
                  checked={groupValues.has(v)}
                  onChange={() => {
                    const n = new Set(groupValues)
                    n.has(v) ? n.delete(v) : n.add(v)
                    setGroupValues(n)
                  }}
                  label={l}
                />
              ))}
            </div>
            <p className="text-xs text-ink-muted">{t('selection.group.formats')}</p>
          </Card>
        </div>
      </Section>

      {/* ── 3. Radio — all states ── */}
      <Section title={t('selection.radio.title')} hint={t('selection.radio.hint')}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.states')}</p>
            <div className="flex flex-col gap-4">
              <Radio checked={tier === 'standard'} onChange={() => setTier('standard')} label={t('selection.radio.standard')} />
              <Radio checked={tier === 'burst'} onChange={() => setTier('burst')} label={t('selection.radio.burst')} />
              <Radio checked={false} onChange={() => {}} label={t('selection.cb.error')} error />
              <Radio checked={true} onChange={() => {}} label={t('selection.radio.selectedError')} error />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.disabled')}</p>
            <div className="flex flex-col gap-4">
              <Radio checked={false} onChange={() => {}} label={t('selection.radio.unselected')} disabled />
              <Radio checked={true} onChange={() => {}} label={t('selection.radio.selected')} disabled />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.sizes')}</p>
            <div className="flex flex-col gap-4">
              <Radio checked={true} onChange={() => {}} label={t('selection.cb.small')} size="sm" />
              <Radio checked={true} onChange={() => {}} label={t('selection.cb.medium')} size="md" />
              <Radio checked={true} onChange={() => {}} label={t('selection.cb.large')} size="lg" />
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.withDesc')}</p>
            <div className="flex flex-col gap-5">
              {[
                { k: 'standard', l: t('selection.radio.standard'), d: t('selection.radio.standardDesc') },
                { k: 'burst', l: t('selection.radio.burst'), d: t('selection.radio.burstDesc') },
                { k: 'dedicated', l: t('selection.radio.dedicated'), d: t('selection.radio.dedicatedDesc') },
              ].map(({ k, l, d }) => (
                <Radio key={k} checked={tier === k} onChange={() => setTier(k)} label={l} description={d} />
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 4. Radio group — vertical and horizontal ── */}
      <Section title={t('selection.rg.title')} hint={t('selection.rg.hint')}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-4 p-5">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.rg.vertical')}</p>
            <div className="space-y-3">
              {[
                { k: 'hourly', l: t('selection.rg.hourly'), d: t('selection.rg.hourlyDesc') },
                { k: 'daily', l: t('selection.rg.daily'), d: t('selection.rg.dailyDesc') },
                { k: 'weekly', l: t('selection.rg.weekly'), d: t('selection.rg.weeklyDesc') },
              ].map(({ k, l, d }) => (
                <Radio key={k} checked={layout === k} onChange={() => setLayout(k)} label={l} description={d} />
              ))}
            </div>
          </Card>
          <Card className="space-y-4 p-5">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.rg.horizontal')}</p>
            <div className="flex flex-wrap gap-6">
              {['JSON', 'Avro', 'Protobuf', 'CSV'].map((f) => (
                <Radio key={f} checked={layout === f} onChange={() => setLayout(f)} label={f} />
              ))}
            </div>
            <div className="mt-2 border-t border-line-soft pt-4">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.rg.disabledGroup')}</p>
              <div className="mt-3 flex flex-wrap gap-6">
                {['JSON', 'Avro', 'Protobuf'].map((f) => (
                  <Radio key={f} checked={f === 'JSON'} onChange={() => {}} label={f} disabled />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 5. Radio card ── */}
      <Section title={t('selection.card.title')} hint={t('selection.card.hint')}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { k: 'starter', l: 'Starter', d: t('selection.card.starterDesc'), Icon: IconGauge, badge: t('selection.card.free') },
            { k: 'growth', l: 'Growth', d: t('selection.card.growthDesc'), Icon: IconPulse, badge: t('selection.card.popular') },
            { k: 'enterprise', l: 'Enterprise', d: t('selection.card.enterpriseDesc'), Icon: IconShield, badge: '' },
          ].map(({ k, l, d, Icon: I, badge }) => (
            <RadioCard key={k} checked={plan === k} onChange={() => setPlan(k)} label={l} description={d} Icon={I} badge={badge || undefined} />
          ))}
        </div>
      </Section>

      {/* ── 6. Toggle — all states ── */}
      <Section title={t('selection.toggle.title')} hint={t('selection.toggle.hint')}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="space-y-5 p-5">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.states')}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">{t('selection.toggle.off')}</span>
              <Toggle label={t('selection.toggle.off')} on={false} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">{t('selection.toggle.on')}</span>
              <Toggle label={t('selection.toggle.on')} on={true} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">{t('selection.toggle.disabledOff')}</span>
              <Toggle label={t('selection.toggle.disabledOff')} on={false} onChange={() => {}} disabled />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">{t('selection.toggle.disabledOn')}</span>
              <Toggle label={t('selection.toggle.disabledOn')} on={true} onChange={() => {}} disabled />
            </div>
          </Card>

          <Card className="space-y-5 p-5">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.sizes')}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-soft">{t('selection.toggle.small')}</span>
              <Toggle label={t('selection.toggle.small')} on={true} onChange={() => {}} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">{t('selection.toggle.medium')}</span>
              <Toggle label={t('selection.toggle.medium')} on={true} onChange={() => {}} size="md" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-ink-soft">{t('selection.toggle.large')}</span>
              <Toggle label={t('selection.toggle.large')} on={true} onChange={() => {}} size="lg" />
            </div>
          </Card>

          <Card className="space-y-4 p-5 md:col-span-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.toggle.interactive')}</p>
            <div className="space-y-2">
              <SwitchRow
                label={t('selection.toggle.autoscale')}
                description={t('selection.toggle.autoscaleDesc')}
                on={toggles.autoscale}
                onChange={(v) => setToggles({ ...toggles, autoscale: v })}
              />
              <SwitchRow
                label={t('selection.toggle.alerts')}
                description={t('selection.toggle.alertsDesc')}
                on={toggles.alerts}
                onChange={(v) => setToggles({ ...toggles, alerts: v })}
              />
              <SwitchRow
                label={t('selection.toggle.compress')}
                description={t('selection.toggle.compressDesc')}
                on={toggles.compress}
                onChange={(v) => setToggles({ ...toggles, compress: v })}
              />
              <SwitchRow
                label={t('selection.toggle.dedicated')}
                description={t('selection.toggle.dedicatedDesc')}
                on={false}
                onChange={() => {}}
                disabled
              />
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 7. Segmented control ── */}
      <Section title={t('selection.seg.title')} hint={t('selection.seg.hint')}>
        <Card className="space-y-8 p-6">
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.seg.withIcons')}</p>
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: 'stream', label: t('selection.seg.stream'), Icon: IconStream },
                { value: 'table', label: t('selection.seg.table'), Icon: IconDatabase },
                { value: 'graph', label: t('selection.seg.graph'), Icon: IconChart },
              ]}
            />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.seg.textOnly')}</p>
            <SegmentedControl
              value={period}
              onChange={setPeriod}
              options={[
                { value: '1h', label: '1h' },
                { value: '24h', label: '24h' },
                { value: '7d', label: '7d' },
                { value: '30d', label: '30d' },
              ]}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <div key={s} className="space-y-2">
                <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('selection.seg.size', { s })}</p>
                <SegmentedControl
                  size={s}
                  value={view}
                  onChange={setView}
                  options={[
                    { value: 'stream', label: t('selection.seg.stream') },
                    { value: 'table', label: t('selection.seg.table') },
                    { value: 'graph', label: t('selection.seg.graph') },
                  ]}
                />
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ── 8. Complete example — feature flags form ── */}
      <Section title={t('selection.flags.title')} hint={t('selection.flags.hint')}>
        <Card className="overflow-hidden">
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-8 py-6">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">{t('selection.flags.heading')}</h2>
              <p className="mt-1 text-sm text-ink-muted">{tr('selection.flags.desc', { name: '`checkout-events`' })}</p>
            </div>
            <Badge severity="secondary">{t('selection.flags.draft')}</Badge>
          </header>
          <div className="grid gap-8 p-8 md:grid-cols-2">
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold text-ink">{t('selection.flags.formats')}</p>
                <div className="space-y-3">
                  <Checkbox checked={groupValues.has('json')} onChange={() => { const n = new Set(groupValues); n.has('json') ? n.delete('json') : n.add('json'); setGroupValues(n) }} label="JSON" description={t('selection.flags.jsonDesc')} />
                  <Checkbox checked={groupValues.has('avro')} onChange={() => { const n = new Set(groupValues); n.has('avro') ? n.delete('avro') : n.add('avro'); setGroupValues(n) }} label="Avro" description={t('selection.flags.avroDesc')} />
                  <Checkbox checked={groupValues.has('parquet')} onChange={() => { const n = new Set(groupValues); n.has('parquet') ? n.delete('parquet') : n.add('parquet'); setGroupValues(n) }} label="Parquet" description={t('selection.flags.parquetDesc')} />
                </div>
              </div>
              <div className="border-t border-line-soft pt-5">
                <p className="mb-3 text-sm font-semibold text-ink">{t('selection.flags.retention')}</p>
                <div className="flex flex-col gap-4">
                  {[
                    { k: 'hourly', l: t('selection.flags.hourly'), d: t('selection.flags.hourlyDesc') },
                    { k: 'daily', l: t('selection.flags.daily'), d: t('selection.flags.dailyDesc') },
                    { k: 'weekly', l: t('selection.flags.weekly'), d: t('selection.flags.weeklyDesc') },
                  ].map(({ k, l, d }) => (
                    <Radio key={k} checked={layout === k} onChange={() => setLayout(k)} label={l} description={d} />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="mb-1 text-sm font-semibold text-ink">{t('selection.flags.runtime')}</p>
              <SwitchRow label={t('selection.toggle.autoscale')} description={t('selection.flags.autoscaleDesc')} on={toggles.autoscale} onChange={(v) => setToggles({ ...toggles, autoscale: v })} />
              <SwitchRow label={t('selection.toggle.alerts')} description={t('selection.flags.alertsDesc')} on={toggles.alerts} onChange={(v) => setToggles({ ...toggles, alerts: v })} />
              <SwitchRow label={t('selection.toggle.compress')} description={t('selection.flags.compressDesc')} on={toggles.compress} onChange={(v) => setToggles({ ...toggles, compress: v })} />
              <SwitchRow label={t('selection.toggle.dedicated')} description={t('selection.toggle.dedicatedDesc')} on={false} onChange={() => {}} disabled />
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-line-soft bg-canvas px-8 py-5">
            <Button variant="outlined" severity="secondary">{t('selection.flags.discard')}</Button>
            <Button>{t('selection.flags.save')}</Button>
          </footer>
        </Card>
      </Section>
    </Page>
  )
}

export function BadgesPage() {
  const { t } = useI18n()
  const [tags, setTags] = useState(['streaming', 'kafka', 'avro', 'json', 'real-time'])
  const removeTag = (tag: string) => setTags((prev) => prev.filter((x) => x !== tag))

  const people = [
    { name: 'Ines Halvorsen', avatar: 'photo-1438761681033-6461ffad8d80' },
    { name: 'Devon Achebe', avatar: 'photo-1500648767791-00dcc994a43e' },
    { name: 'Priya Ramanathan', avatar: 'photo-1544005313-94ddf0286df2' },
    { name: 'Kenji Mori', avatar: 'photo-1507003211169-0a1dd7228f2d' },
    { name: 'Saoirse Flynn', avatar: 'photo-1494790108377-be9c29b29330' },
    { name: 'Tariq Hassan', avatar: 'photo-1472099645785-5658abf4ff4e' },
  ]
  const toUrl = (id: string) => photo(id)

  return (
    <Page eyebrow={t('nav.group.components')} title={t('nav.badges')} lead={t('badges.lead')}>

      {/* 1. All severities × all variants */}
      <Section title={t('badges.variants.title')} hint="soft · solid · outlined">
        <Card className="divide-y divide-line-soft">
          {(['soft', 'solid', 'outlined'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-2.5 px-6 py-4">
              <span className="w-20 shrink-0 font-mono text-11 uppercase tracking-wider text-ink-muted">{v}</span>
              {SEVERITIES.map((s) => (
                <Badge key={s.key} severity={s.key} variant={v}>{s.label}</Badge>
              ))}
            </div>
          ))}
        </Card>
      </Section>

      {/* 2. Sizes */}
      <Section title={t('badges.sizes.title')} hint="sm · md · lg">
        <Card className="divide-y divide-line-soft">
          {(['sm', 'md', 'lg'] as const).map((sz) => (
            <div key={sz} className="flex flex-wrap items-center gap-2.5 px-6 py-4">
              <span className="w-20 shrink-0 font-mono text-11 uppercase tracking-wider text-ink-muted">{sz}</span>
              <Badge size={sz} severity="primary">Primary</Badge>
              <Badge size={sz} severity="success" dot>{t('badges.sizes.healthy')}</Badge>
              <Badge size={sz} severity="danger" variant="solid">{t('badges.sizes.failed')}</Badge>
              <Badge size={sz} severity="warning" rounded={false}>v4.2.0</Badge>
            </div>
          ))}
        </Card>
      </Section>

      {/* 3. Status dots & shape */}
      <Section title={t('badges.dots.title')} hint={t('badges.dots.hint')}>
        <Demo>
          <Badge severity="primary" dot>{t('badges.dots.flowing')}</Badge>
          <Badge severity="secondary" dot>{t('badges.dots.paused')}</Badge>
          <Badge severity="success" dot>{t('badges.sizes.healthy')}</Badge>
          <Badge severity="warning" dot>{t('badges.dots.draining')}</Badge>
          <Badge severity="danger" dot>{t('badges.sizes.failed')}</Badge>
          <span className="mx-2 h-6 w-px bg-line" />
          <Badge severity="primary" rounded={false}>v4.2.0</Badge>
          <Badge severity="contrast" rounded={false}>STR-4820</Badge>
          <Badge severity="info" variant="solid" dot>{t('badges.dots.live')}</Badge>
        </Demo>
      </Section>

      {/* 4. Icon badges */}
      <Section title={t('badges.icon.title')} hint={t('badges.icon.hint')}>
        <Demo>
          <Badge severity="success" Icon={IconCheckCircle}>{t('badges.icon.verified')}</Badge>
          <Badge severity="info" Icon={IconInfo}>{t('badges.icon.info')}</Badge>
          <Badge severity="warning" Icon={IconAlert}>{t('badges.icon.degraded')}</Badge>
          <Badge severity="danger" Icon={IconAlert} variant="solid">{t('badges.icon.critical')}</Badge>
          <Badge severity="primary" Icon={IconSpinner}>{t('badges.icon.processing')}</Badge>
          <Badge severity="help" Icon={IconShield}>{t('badges.icon.secure')}</Badge>
        </Demo>
      </Section>

      {/* 5. Removable / tag badges */}
      <Section title={t('badges.tags.title')} hint={t('badges.tags.hint')}>
        <Card className="px-6 py-5">
          <p className="mb-3 text-sm text-ink-muted">{t('badges.tags.intro')}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} severity="secondary" onRemove={() => removeTag(tag)}>{tag}</Badge>
            ))}
            {tags.length === 0 && <span className="text-sm italic text-ink-muted">{t('badges.tags.empty')}</span>}
          </div>
        </Card>
      </Section>

      {/* 6. Counter / notification badges */}
      <Section title={t('badges.count.title')} hint={t('badges.count.hint')}>
        <Demo>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-soft">{t('badges.count.exact')}</span>
            {[1, 5, 12, 42, 99].map((n) => <CountBadge key={n} count={n} />)}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-soft">{t('badges.count.overflow')}</span>
            <CountBadge count={100} max={99} />
            <CountBadge count={999} max={99} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-soft">{t('badges.count.severities')}</span>
            <CountBadge count={3} severity="primary" />
            <CountBadge count={7} severity="warning" />
            <CountBadge count={2} severity="danger" />
            <CountBadge count={14} severity="success" />
          </div>
        </Demo>
      </Section>

      {/* 7. Badge in context */}
      <Section title={t('badges.ctx.title')} hint={t('badges.ctx.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Button with badge */}
          <Card className="px-6 py-5 space-y-3">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('badges.ctx.buttonBadge')}</p>
            <div className="flex flex-col gap-2">
              <div className="relative inline-flex w-fit">
                <Button severity="secondary" variant="outlined" Icon={IconBell}>{t('badges.ctx.alerts')}</Button>
                <span className="absolute -right-1.5 -top-1.5"><CountBadge count={4} /></span>
              </div>
              <div className="relative inline-flex w-fit">
                <Button severity="secondary" variant="outlined" Icon={IconMail}>{t('badges.ctx.messages')}</Button>
                <span className="absolute -right-1.5 -top-1.5"><CountBadge count={12} /></span>
              </div>
            </div>
          </Card>
          {/* List rows */}
          <Card className="overflow-hidden">
            <p className="px-5 py-3 font-mono text-10 uppercase tracking-wider text-ink-muted border-b border-line-soft">{t('badges.ctx.streamList')}</p>
            {[
              { name: 'billing-webhooks', status: 'success', label: t('badges.sizes.healthy') },
              { name: 'user-events', status: 'warning', label: t('badges.dots.draining') },
              { name: 'ledger-sync', status: 'danger', label: t('badges.sizes.failed') },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between px-5 py-3 border-b border-line-soft last:border-0">
                <span className="font-mono text-sm text-ink">{r.name}</span>
                <Badge severity={r.status as any} dot size="sm">{r.label}</Badge>
              </div>
            ))}
          </Card>
          {/* Version/tag badges */}
          <Card className="px-6 py-5 space-y-3">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('badges.ctx.versionTags')}</p>
            <div className="flex flex-wrap gap-2">
              <Badge severity="primary" rounded={false} variant="soft">v2.0.0</Badge>
              <Badge severity="success" rounded={false} variant="soft">stable</Badge>
              <Badge severity="warning" rounded={false} variant="soft">beta</Badge>
              <Badge severity="danger" rounded={false} variant="soft">deprecated</Badge>
              <Badge severity="info" rounded={false} variant="outlined">RFC</Badge>
              <Badge severity="help" rounded={false} variant="outlined">preview</Badge>
            </div>
          </Card>
        </div>
      </Section>

      {/* 8. Avatar sizes */}
      <Section title={t('badges.avatar.title')} hint={t('badges.avatar.hint')}>
        <Card className="divide-y divide-line-soft">
          <div className="flex flex-wrap items-end gap-4 px-6 py-5">
            <span className="w-20 self-center shrink-0 font-mono text-11 uppercase tracking-wider text-ink-muted">{t('badges.avatar.photo')}</span>
            {[20, 28, 36, 44, 56, 72].map((sz) => (
              <Avatar key={sz} name="Ines Halvorsen" src={toUrl('photo-1438761681033-6461ffad8d80')} size={sz} />
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-4 px-6 py-5">
            <span className="w-20 self-center shrink-0 font-mono text-11 uppercase tracking-wider text-ink-muted">{t('badges.avatar.initials')}</span>
            {[20, 28, 36, 44, 56, 72].map((sz) => (
              <Avatar key={sz} name="Kai Fenwick" size={sz} />
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-4 px-6 py-5">
            <span className="w-20 self-center shrink-0 font-mono text-11 uppercase tracking-wider text-ink-muted">{t('badges.avatar.square')}</span>
            {[20, 28, 36, 44, 56, 72].map((sz) => (
              <Avatar key={sz} name="Devon Achebe" src={toUrl('photo-1500648767791-00dcc994a43e')} size={sz} square />
            ))}
          </div>
        </Card>
      </Section>

      {/* 9. Avatar status indicators */}
      <Section title={t('badges.status.title')} hint={t('badges.status.hint')}>
        <Demo>
          {(['online', 'away', 'busy', 'offline'] as const).map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Avatar name={people[i].name} src={toUrl(people[i].avatar)} size={44} status={s} />
              <span className="font-mono text-10 capitalize text-ink-muted">{s}</span>
            </div>
          ))}
          <span className="mx-2 h-16 w-px bg-line" />
          <div className="flex flex-col items-center gap-2">
            <Avatar name="Kai Fenwick" size={44} status="online" />
            <span className="font-mono text-10 text-ink-muted">initials</span>
          </div>
        </Demo>
      </Section>

      {/* 10. Avatar groups */}
      <Section title={t('badges.group.title')} hint={t('badges.group.hint')}>
        <Demo>
          <div className="flex flex-col gap-4">
            {[3, 5, 8].map((n) => (
              <div key={n} className="flex items-center gap-4">
                <AvatarGroup people={people.slice(0, n).map((p) => ({ name: p.name, src: toUrl(p.avatar) }))} max={4} />
                <span className="text-sm text-ink-muted">{t('badges.group.members', { n })}</span>
              </div>
            ))}
          </div>
        </Demo>
      </Section>

      {/* 11. Composed: team member card */}
      <Section title={t('badges.team.title')} hint={t('badges.team.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { person: people[0], role: t('badges.team.admin'), plan: 'Enterprise', status: 'online' as const, streams: 12 },
            { person: people[1], role: t('badges.team.editor'), plan: 'Pro', status: 'away' as const, streams: 5 },
            { person: people[2], role: t('badges.team.viewer'), plan: 'Starter', status: 'offline' as const, streams: 0 },
          ].map(({ person, role, plan, status, streams }) => (
            <Card key={person.name} className="px-5 py-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Avatar name={person.name} src={toUrl(person.avatar)} size={48} status={status} />
                <div className="relative">
                  <CountBadge count={streams} severity={streams > 0 ? 'primary' : 'secondary'} />
                </div>
              </div>
              <div>
                <p className="font-semibold text-ink leading-snug">{person.name}</p>
                <p className="text-sm text-ink-muted mt-0.5">data-platform-team</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge severity="secondary" size="sm" rounded={false}>{role}</Badge>
                <Badge severity="primary" size="sm" variant="soft">{plan}</Badge>
                <Badge severity={status === 'online' ? 'success' : status === 'away' ? 'warning' : 'secondary'} size="sm" dot>{status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

    </Page>
  )
}

export function FeedbackPage() {
  const { t } = useI18n()
  const [alerts, setAlerts] = useState({ brand: true, info: true, success: true, warning: true, help: true, danger: true })
  return (
    <Page eyebrow={t('nav.group.components')} title={t('nav.feedback')} lead={t('feedback.lead')}>
      <Section title={t('feedback.alerts.title')} hint={t('feedback.alerts.hint')}>
        <div className="space-y-3">
          {alerts.brand && <Alert severity="primary" title={t('feedback.alert.region.title')} onClose={() => setAlerts({ ...alerts, brand: false })}>{t('feedback.alert.region.body')}</Alert>}
          {alerts.info && <Alert severity="info" title={t('feedback.alert.maintenance.title')} onClose={() => setAlerts({ ...alerts, info: false })}>{t('feedback.alert.maintenance.body')}</Alert>}
          {alerts.success && <Alert severity="success" title={t('feedback.alert.saved.title')} onClose={() => setAlerts({ ...alerts, success: false })}>{t('feedback.alert.saved.body')}</Alert>}
          {alerts.warning && <Alert severity="warning" title={t('feedback.alert.drift.title')} onClose={() => setAlerts({ ...alerts, warning: false })}>{t('feedback.alert.drift.body')}</Alert>}
          {alerts.help && <Alert severity="help" title={t('feedback.alert.help.title')} onClose={() => setAlerts({ ...alerts, help: false })}>{t('feedback.alert.help.body')}</Alert>}
          {alerts.danger && (
            <Alert
              severity="danger"
              title={t('feedback.alert.disconnected.title')}
              onClose={() => setAlerts({ ...alerts, danger: false })}
              actions={
                <>
                  <Button size="sm" severity="danger">{t('feedback.alert.reconnect')}</Button>
                  <Button size="sm" severity="danger" variant="text">{t('feedback.alert.logs')}</Button>
                </>
              }
            >
              {t('feedback.alert.disconnected.body')}
            </Alert>
          )}
        </div>
      </Section>

      <Section title={t('feedback.variants.title')} hint="soft · solid · outlined">
        <div className="space-y-3">
          <Alert severity="info" variant="soft" title="Soft">{t('feedback.variants.soft')}</Alert>
          <Alert severity="info" variant="solid" title="Solid">{t('feedback.variants.solid')}</Alert>
          <Alert severity="info" variant="outlined" title="Outlined">{t('feedback.variants.outlined')}</Alert>
        </div>
      </Section>
      <Section title={t('feedback.progress.title')} hint={t('feedback.progress.hint')}>
        <Card className="space-y-5 p-6">
          {[
            { label: t('feedback.progress.ingest'), v: 34, sev: 'primary' as const },
            { label: t('feedback.progress.replication'), v: 72, sev: 'success' as const },
            { label: t('feedback.progress.index'), v: 58, sev: 'info' as const },
            { label: t('feedback.progress.disk'), v: 91, sev: 'warning' as const },
            { label: t('feedback.progress.retention'), v: 97, sev: 'danger' as const },
          ].map((p) => (
            <div key={p.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-ink-soft">{p.label}</span>
              </div>
              <Progress value={p.v} severity={p.sev} showValue label={p.label} />
            </div>
          ))}
        </Card>
      </Section>
      <Section title={t('feedback.inline.title')} hint={t('feedback.inline.hint')}>
        <div className="space-y-3">
          {([
            { severity: 'primary', icon: IconInfo, title: t('feedback.inline.partition.title'), body: t('feedback.inline.partition.body') },
            { severity: 'success', icon: IconCheckCircle, title: t('feedback.inline.schema.title'), body: t('feedback.inline.schema.body') },
            { severity: 'info', icon: IconInfo, title: t('feedback.inline.replay.title'), body: t('feedback.inline.replay.body') },
            { severity: 'warning', icon: IconAlert, title: t('feedback.inline.retention.title'), body: t('feedback.inline.retention.body') },
            { severity: 'danger', icon: IconAlert, title: t('feedback.inline.mismatch.title'), body: t('feedback.inline.mismatch.body') },
          ] as const).map(({ severity, icon: Icon, title, body }) => {
            const colors: Record<string, string> = {
              primary: 'bg-primary-soft border-primary-border text-primary-fg',
              success: 'bg-success-soft border-success-border text-success-fg',
              info: 'bg-info-soft border-info-border text-info-fg',
              warning: 'bg-warning-soft border-warning-border text-warning-fg',
              danger: 'bg-danger-soft border-danger-border text-danger-fg',
            }
            const iconColors: Record<string, string> = {
              primary: 'text-brand-500', success: 'text-emerald-500', info: 'text-sky-500', warning: 'text-amber-500', danger: 'text-rose-500',
            }
            return (
              <div key={severity} className={`flex gap-3 rounded-xl border px-4 py-3 ${colors[severity]}`}>
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColors[severity]}`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title={t('feedback.chat.title')} hint={t('feedback.chat.hint')}>
        <Card className="divide-y divide-line-soft">
          {[
            { name: 'Ines Halvorsen', avatar: 'photo-1438761681033-6461ffad8d80', time: t('feedback.chat.m1.time'), text: t('feedback.chat.m1.text'), own: false },
            { name: 'Devon Achebe', avatar: 'photo-1500648767791-00dcc994a43e', time: t('feedback.chat.m2.time'), text: t('feedback.chat.m2.text'), own: true },
            { name: 'Priya Ramanathan', avatar: 'photo-1544005313-94ddf0286df2', time: t('feedback.chat.m3.time'), text: t('feedback.chat.m3.text'), own: false },
          ].map((msg) => (
            <div key={msg.name + msg.time} className={`flex gap-3 px-5 py-4 ${msg.own ? 'flex-row-reverse' : ''}`}>
              <Avatar name={msg.name} src={photo(msg.avatar)} size={32} />
              <div className={`min-w-0 max-w-sm ${msg.own ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-ink">{msg.own ? t('feedback.chat.you') : msg.name}</span>
                  <span className="font-mono text-10 text-ink-muted">{msg.time}</span>
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.own ? 'rounded-tr-sm bg-brand-700 text-white' : 'rounded-tl-sm bg-ground text-ink'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </Section>

      <Section title={t('feedback.spinner.title')} hint={t('feedback.spinner.hint')}>
        <Card className="flex flex-wrap items-center gap-8 p-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" label={t('feedback.spinner.label')} />
          <p className="text-sm text-ink-muted">{t('feedback.spinner.note')}</p>
        </Card>
      </Section>

      <Section title={t('feedback.empty.title')} hint={t('feedback.empty.hint')}>
        <Card className="grid gap-6 p-6 md:grid-cols-2">
          <EmptyState Icon={IconSearch} title={t('feedback.empty.searchTitle')} description={t('feedback.empty.searchBody')} action={<Button variant="outlined" severity="secondary">{t('feedback.empty.searchAction')}</Button>} />
          <EmptyState Icon={IconChart} title={t('feedback.empty.dataTitle')} description={t('feedback.empty.dataBody')} action={<Button severity="primary">{t('feedback.empty.dataAction')}</Button>} />
        </Card>
      </Section>

      <Section title={t('feedback.skeleton.title')}>
        <Card className="flex items-center gap-4 p-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-9 w-24" />
        </Card>
      </Section>
    </Page>
  )
}

export function NavigationPage() {
  const { t, tr } = useI18n()
  /* tabs */
  const [tab1, setTab1] = useState('Overview')
  const [tab2, setTab2] = useState('metrics')
  const [tab3, setTab3] = useState('overview')
  const [tab4, setTab4] = useState('overview')
  const [tabSize, setTabSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [tabSizeVal, setTabSizeVal] = useState('Overview')

  /* breadcrumb */
  /* pagination */
  const [page1, setPage1] = useState(4)
  const [page2, setPage2] = useState(2)
  const [page3, setPage3] = useState(3)

  /* stepper */
  const [step, setStep] = useState(1)

  /* nav menu */
  const [navKey, setNavKey] = useState('streams')

  const NAV_ITEMS = [
    { key: 'dashboard', label: t('navigation.menu.dashboard'), Icon: IconWave },
    {
      key: 'streams', label: t('navigation.breadcrumb.streams'), Icon: IconStream, badge: 18, badgeSev: 'primary' as const,
      children: [
        { key: 'streams-live', label: t('navigation.menu.live'), Icon: IconPulse, badge: 12, badgeSev: 'success' as const },
        { key: 'streams-paused', label: t('navigation.menu.paused'), Icon: IconDatabase },
        { key: 'streams-archived', label: t('navigation.menu.archived'), Icon: IconFolder },
      ],
    },
    { key: 'metrics', label: t('navigation.tab.metrics'), Icon: IconChart },
    { key: 'alerts', label: t('navigation.tab.alerts'), Icon: IconBell, badge: 3, badgeSev: 'danger' as const },
    { key: 'settings', label: t('navigation.tab.settings'), Icon: IconGear, children: [
      { key: 'settings-general', label: t('navigation.menu.general'), Icon: IconGear },
      { key: 'settings-team', label: t('navigation.menu.team'), Icon: IconUsers },
      { key: 'settings-security', label: t('navigation.menu.security'), Icon: IconShield },
    ]},
  ]

  const tabItems = [
    { key: t('navigation.tab.overview'), label: t('navigation.tab.overview') },
    { key: t('navigation.tab.metrics'), label: t('navigation.tab.metrics') },
    { key: t('navigation.tab.consumers'), label: t('navigation.tab.consumers') },
    { key: t('navigation.tab.settings'), label: t('navigation.tab.settings') },
  ]

  const WIZARD_STEPS = [
    { label: t('navigation.wizard.workspace'), description: t('navigation.wizard.workspaceDesc') },
    { label: t('navigation.breadcrumb.schema'), description: t('navigation.wizard.schemaDesc') },
    { label: t('navigation.tab.consumers'), description: t('navigation.wizard.consumersDesc') },
    { label: t('navigation.wizard.review'), description: t('navigation.wizard.reviewDesc') },
  ]

  return (
    <Page
      eyebrow={t('nav.group.components')}
      title={t('nav.navigation')}
      lead={t('navigation.lead')}
    >

      {/* ── 1. Tabs — variants ── */}
      <Section title={t('navigation.tabs.variants.title')} hint={t('navigation.tabs.variants.hint')}>
        <div className="space-y-4">
          <Card className="p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.underline')}</p>
            <Tabs
              tabs={tabItems}
              value={tab1}
              onChange={setTab1}
            />
            <p className="mt-4 text-sm text-ink-muted">{t('navigation.tabs.activePanel')} <span className="font-medium text-ink">{tabItems.find((x) => x.key === tab1)?.label}</span></p>
          </Card>
          <Card className="p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.pills')}</p>
            <Tabs
              variant="pills"
              tabs={tabItems}
              value={tab1}
              onChange={setTab1}
            />
          </Card>
          <Card className="p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.boxed')}</p>
            <Tabs
              variant="boxed"
              tabs={tabItems}
              value={tab1}
              onChange={setTab1}
            />
          </Card>
        </div>
      </Section>

      {/* ── 2. Tabs — with icons, badges, disabled ── */}
      <Section title={t('navigation.tabs.api.title')} hint={t('navigation.tabs.api.hint')}>
        <div className="space-y-4">
          <Card className="p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.withIcons')}</p>
            <Tabs
              tabs={[
                { key: 'overview', label: t('navigation.tab.overview'), Icon: IconWave },
                { key: 'metrics', label: t('navigation.tab.metrics'), Icon: IconChart },
                { key: 'consumers', label: t('navigation.tab.consumers'), Icon: IconUsers },
                { key: 'settings', label: t('navigation.tab.settings'), Icon: IconGear },
              ]}
              value={tab2}
              onChange={setTab2}
            />
          </Card>
          <Card className="p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.withBadges')}</p>
            <Tabs
              tabs={[
                { key: 'overview', label: t('navigation.tab.overview') },
                { key: 'metrics', label: t('navigation.tab.metrics'), badge: t('navigation.tab.new') },
                { key: 'consumers', label: t('navigation.tab.consumers'), badge: 4 },
                { key: 'alerts', label: t('navigation.tab.alerts'), badge: 12 },
                { key: 'settings', label: t('navigation.tab.settings'), disabled: true },
              ]}
              value={tab3}
              onChange={setTab3}
            />
          </Card>
          <Card className="p-6">
            <p className="mb-4 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.pillsIconsBadges')}</p>
            <Tabs
              variant="pills"
              tabs={[
                { key: 'overview', label: t('navigation.tab.overview'), Icon: IconWave },
                { key: 'metrics', label: t('navigation.tab.metrics'), Icon: IconChart, badge: t('navigation.tab.new') },
                { key: 'consumers', label: t('navigation.tab.consumers'), Icon: IconUsers, badge: 4 },
                { key: 'settings', label: t('navigation.tab.settings'), Icon: IconGear, disabled: true },
              ]}
              value={tab4}
              onChange={setTab4}
            />
          </Card>
        </div>
      </Section>

      {/* ── 3. Tabs — sizes ── */}
      <Section title={t('navigation.tabs.sizes.title')} hint="sm · md · lg">
        <Card className="space-y-6 p-6">
          <div className="flex flex-wrap items-center gap-3">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button key={s} onClick={() => setTabSize(s)} className={`pance-focus rounded-lg border px-3 py-1.5 font-mono text-13 font-medium transition-colors ${tabSize === s ? 'border-primary-border-strong bg-primary-soft text-primary-fg' : 'border-line text-ink-muted hover:border-line-strong'}`}>{s}</button>
            ))}
          </div>
          <div>
            <Tabs tabs={tabItems} value={tabSizeVal} onChange={setTabSizeVal} size={tabSize} />
          </div>
          <div>
            <Tabs variant="pills" tabs={tabItems} value={tabSizeVal} onChange={setTabSizeVal} size={tabSize} />
          </div>
        </Card>
      </Section>

      {/* ── 4. Breadcrumb ── */}
      <Section title={t('navigation.breadcrumb.title')} hint={t('navigation.breadcrumb.hint')}>
        <div className="space-y-3">
          <Card className="space-y-5 p-6">
            <div className="space-y-1">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.breadcrumb.default')}</p>
              <Breadcrumb items={[
                { label: t('navigation.breadcrumb.console'), href: '#' },
                { label: t('navigation.breadcrumb.streams'), href: '#' },
                { label: 'checkout-events' },
              ]} />
            </div>
            <div className="space-y-1">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.tabs.withIcons')}</p>
              <Breadcrumb label={`${t('ui.breadcrumb')} · ${t('navigation.tabs.withIcons')}`} items={[
                { label: t('navigation.breadcrumb.console'), href: '#', Icon: IconHome },
                { label: t('navigation.breadcrumb.streams'), href: '#', Icon: IconStream },
                { label: 'checkout-events', Icon: IconDatabase },
              ]} />
            </div>
            <div className="space-y-1">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{tr('navigation.breadcrumb.collapsing')}</p>
              <Breadcrumb
                label={`${t('ui.breadcrumb')} · ${tr('navigation.breadcrumb.collapsing')}`}
                maxItems={2}
                items={[
                  { label: t('navigation.breadcrumb.console'), href: '#', Icon: IconHome },
                  { label: t('navigation.breadcrumb.streams'), href: '#' },
                  { label: 'checkout-events', href: '#' },
                  { label: t('navigation.breadcrumb.schema'), href: '#' },
                  { label: t('navigation.breadcrumb.fieldMapping') },
                ]}
              />
            </div>
            <div className="space-y-1">
              <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.breadcrumb.single')}</p>
              <Breadcrumb label={`${t('ui.breadcrumb')} · ${t('navigation.breadcrumb.single')}`} items={[{ label: t('navigation.breadcrumb.console'), Icon: IconHome }]} />
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 5. Stepper ── */}
      <Section title={t('navigation.stepper.title')} hint={t('navigation.stepper.hint')}>
        <div className="space-y-4">
          <Card className="space-y-6 p-6">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.stepper.horizontal')}</p>
            <Steps steps={WIZARD_STEPS} current={step} />
            <div className="flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
              <Button variant="outlined" severity="secondary" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>{t('navigation.stepper.back')}</Button>
              <Button disabled={step === WIZARD_STEPS.length - 1} onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}>{t('navigation.stepper.continue')}</Button>
              <span className="ml-auto font-mono text-xs text-ink-muted">{t('navigation.stepper.progress', { n: step + 1, total: WIZARD_STEPS.length })}</span>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <p className="mb-5 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.stepper.vertical')}</p>
              <Steps
                orientation="vertical"
                current={2}
                steps={[
                  { label: t('navigation.stepper.v1'), description: 'river-labs · us-east-1' },
                  { label: t('navigation.stepper.v2'), description: t('navigation.stepper.v2d') },
                  { label: t('navigation.stepper.v3'), description: t('navigation.stepper.v3d') },
                  { label: t('navigation.stepper.v4'), description: t('navigation.stepper.v4d') },
                ]}
              />
            </Card>
            <Card className="p-6">
              <p className="mb-5 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.stepper.errorMixed')}</p>
              <Steps
                orientation="vertical"
                current={1}
                steps={[
                  { label: t('navigation.stepper.v1'), status: 'complete', description: 'river-labs · us-east-1' },
                  { label: t('navigation.stepper.e2'), status: 'error', description: t('navigation.stepper.e2d') },
                  { label: t('navigation.stepper.e3'), status: 'upcoming', description: t('navigation.stepper.e3d') },
                  { label: t('navigation.stepper.v4'), status: 'upcoming' },
                ]}
              />
            </Card>
          </div>
        </div>
      </Section>

      {/* ── 6. Navigation menu ── */}
      <Section title={t('navigation.menu.title')} hint={t('navigation.menu.hint')}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <p className="mb-3 px-3 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.menu.expanded')}</p>
            <NavMenu items={NAV_ITEMS} value={navKey} onChange={setNavKey} label={`${t('navigation.menu.title')} · ${t('navigation.menu.expanded')}`} />
          </Card>
          <Card className="flex items-start gap-4 p-4">
            <div className="w-20 shrink-0">
              <p className="mb-3 px-1 font-mono text-10 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.menu.collapsed')}</p>
              <NavMenu items={NAV_ITEMS} value={navKey} onChange={setNavKey} collapsed label={`${t('navigation.menu.title')} · ${t('navigation.menu.collapsed')}`} />
            </div>
            <div className="min-w-0 flex-1 border-l border-line-soft pl-4">
              <p className="mb-2 font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.menu.active')} <span className="text-primary-fg">{navKey}</span></p>
              <p className="text-xs text-ink-muted">{t('navigation.menu.collapsedNote')}</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 7. Pagination ── */}
      <Section title={t('navigation.pagination.title')} hint={t('navigation.pagination.hint')}>
        <Card className="space-y-8 p-6">
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.pagination.default')}</p>
            <Pagination page={page1} pages={20} onChange={setPage1} />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.pagination.info')}</p>
            <Pagination page={page2} pages={12} onChange={setPage2} total={234} pageSize={20} />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.pagination.compact')}</p>
            <Pagination page={page3} pages={8} onChange={setPage3} compact />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.pagination.small')}</p>
            <Pagination page={1} pages={5} onChange={() => {}} />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.pagination.boundary')}</p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="mb-2 text-xs text-ink-muted">{t('navigation.pagination.first')}</p>
                <Pagination page={1} pages={6} onChange={() => {}} />
              </div>
              <div>
                <p className="mb-2 text-xs text-ink-muted">{t('navigation.pagination.last')}</p>
                <Pagination page={6} pages={6} onChange={() => {}} />
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* ── Navbar ── */}
      <Section title={t('navigation.navbar.title')} hint={t('navigation.navbar.hint')}>
        <div className="space-y-4">
          {/* Full navbar */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('navigation.navbar.full')}</p>
            <div className="overflow-hidden rounded-2xl border border-line">
              <header className="flex h-16 items-center justify-between gap-4 border-b border-line bg-surface px-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-white">
                    <IconWave size={16} weight="bold" />
                  </div>
                  <span className="font-display text-base font-extrabold tracking-tight text-ink">Pance</span>
                </div>
                <nav aria-label={t('navigation.navbar.full')} className="hidden items-center gap-1 md:flex">
                  {(['navigation.navbar.dashboard', 'navigation.navbar.streams', 'navigation.navbar.schemas', 'navigation.navbar.connectors'] as const).map((item, i) => (
                    <a key={item} href="#" className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${i === 0 ? 'bg-primary-soft text-primary-fg' : 'text-ink-soft hover:bg-ground hover:text-ink'}`}>{t(item)}</a>
                  ))}
                </nav>
                <div className="flex items-center gap-2">
                  <div className="hidden w-52 sm:block"><Input placeholder={t('navigation.navbar.search')} Icon={IconSearch} inputSize="sm" /></div>
                  <Tooltip label={t('shell.notifications')} placement="bottom"><IconButton Icon={IconBell} label={t('shell.notifications')} /></Tooltip>
                  <Avatar name="Ines Halvorsen" src={photo('photo-1438761681033-6461ffad8d80')} size={32} status="online" />
                </div>
              </header>
              <div className="bg-canvas px-6 py-4 text-sm text-ink-muted">{t('navigation.navbar.content')}</div>
            </div>
          </div>

          {/* Condensed / secondary navbar */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('navigation.navbar.condensed')}</p>
            <div className="overflow-hidden rounded-2xl border border-line">
              <header className="flex h-14 items-center justify-between gap-4 border-b border-line bg-surface px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button aria-label={t('navigation.navbar.back')} className="pance-focus shrink-0 rounded-lg p-1 text-ink-muted hover:text-ink"><IconChevron className="h-4 w-4 rotate-180" /></button>
                  <span className="truncate font-medium text-ink">checkout-events</span>
                  <Badge severity="success" dot size="sm">{t('navigation.navbar.flowing')}</Badge>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="sm" severity="secondary" variant="outlined" Icon={IconEdit}>{t('navigation.navbar.edit')}</Button>
                  <IconButton Icon={IconDots} label={t('navigation.navbar.more')} />
                </div>
              </header>
              <div className="bg-canvas px-5 py-4 text-sm text-ink-muted">{t('navigation.navbar.detail')}</div>
            </div>
          </div>

          {/* Transparent / landing navbar */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('navigation.navbar.transparent')}</p>
            <div className="overflow-hidden rounded-2xl border border-line">
              <header className="flex h-16 items-center justify-between gap-4 bg-gradient-to-r from-brand-900 to-brand-700 px-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white">
                    <IconWave size={16} weight="bold" />
                  </div>
                  <span className="font-display text-base font-extrabold tracking-tight text-white">Pance</span>
                </div>
                <nav aria-label={t('navigation.navbar.transparent')} className="hidden items-center gap-1 md:flex">
                  {(['navigation.landing.product', 'navigation.landing.pricing', 'navigation.landing.docs', 'navigation.landing.blog'] as const).map((item) => (
                    <a key={item} href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">{t(item)}</a>
                  ))}
                </nav>
                <div className="flex items-center gap-2">
                  <Button size="sm" severity="secondary" variant="outlined" className="border-white/30 text-white hover:bg-white/10">{t('navigation.landing.login')}</Button>
                  <Button size="sm" severity="primary">{t('navigation.landing.start')}</Button>
                </div>
              </header>
              <div className="bg-canvas px-6 py-4 text-sm text-ink-muted">{t('navigation.navbar.hero')}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 8. Link styles ── */}
      <Section title={t('navigation.link.title')} hint={t('navigation.link.hint')}>
        <Card className="space-y-6 p-6">
          <div className="space-y-3">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.link.inline')}</p>
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              {t('navigation.link.p1')}{' '}
              <LibLink href="#">{t('navigation.link.keyGuide')}</LibLink>
              {' '}{t('navigation.link.p2')}{' '}
              <LibLink href="#" external>{t('navigation.link.limits')}</LibLink>
              {' '}{t('navigation.link.p3')}
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.link.standalone')}</p>
            <div className="flex flex-wrap gap-6">
              <a href="#" className={`pance-focus ${hitArea} inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary-fg transition-colors hover:text-primary-fg`}>
                <IconArrowRight className="h-4 w-4" /> {t('navigation.link.docs')}
              </a>
              <a href="#" className={`pance-focus ${hitArea} inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary-fg transition-colors hover:text-primary-fg`}>
                <IconExternal className="h-4 w-4" /> {t('navigation.link.newTab')}
              </a>
              <a href="#" className={`pance-focus ${hitArea} inline-flex items-center gap-1.5 rounded text-sm font-medium text-danger transition-colors hover:text-danger-fg`}>
                <IconTrash className="h-4 w-4" /> {t('navigation.link.delete')}
              </a>
              <span className="inline-flex cursor-not-allowed items-center gap-1.5 text-sm font-medium text-ink-muted opacity-50">
                <IconLock className="h-4 w-4" /> {t('navigation.link.locked')}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-11 font-medium uppercase tracking-wider text-ink-muted">{t('navigation.link.external')}</p>
            <div className="flex flex-wrap gap-4">
              {(['navigation.link.changelog', 'navigation.link.api', 'navigation.link.sdks', 'navigation.link.status'] as const).map((l) => (
                <a key={l} href="#" className="pance-focus inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-soft shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-primary-border hover:text-primary-fg">
                  {t(l)}
                  <IconExternal className="h-3.5 w-3.5 text-ink-muted" />
                </a>
              ))}
            </div>
          </div>
        </Card>
      </Section>

    </Page>
  )
}

export function Pagination({ page, pages, onChange, total, pageSize, compact, siblings = 1 }: { page: number; pages: number; onChange: (p: number) => void; total?: number; pageSize?: number; compact?: boolean; siblings?: number }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap items-center gap-3">
      {total !== undefined && pageSize !== undefined && (
        <span className="text-sm text-ink-muted">{t('navigation.pagination.range', { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, total), total })}</span>
      )}
      <LibPagination page={page} pages={pages} onChange={onChange} compact={compact} siblings={siblings} label={`${t('navigation.pagination.title')} · ${page}/${pages}${total !== undefined ? ` · ${total}` : ''}${compact ? ' · compact' : ''}`} />
    </div>
  )
}

let _toastId = 0

function DestructiveRow({ name, region }: { name: string; region: string }) {
  const { t } = useI18n()
  const [confirming, setConfirming] = useState(false)
  const [deleted, setDeleted] = useState(false)
  if (deleted) return null
  return (
    <div className="group flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary-fg"><IconStream className="h-4 w-4" /></div>
        <div>
          <p className="font-mono text-sm font-medium text-ink">{name}</p>
          <p className="text-xs text-ink-muted">{region}</p>
        </div>
      </div>
      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">{t('overlays.destructive.confirmQ')}</span>
          <Button size="sm" severity="danger" onClick={() => setDeleted(true)}>{t('overlays.destructive.confirm')}</Button>
          <Button size="sm" severity="secondary" variant="outlined" onClick={() => setConfirming(false)}>{t('overlays.cancel')}</Button>
        </div>
      ) : (
        <button onClick={() => setConfirming(true)} className="pance-focus flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-muted opacity-0 transition-opacity hover:bg-danger-soft hover:text-danger group-hover:opacity-100 focus-visible:opacity-100">
          <IconTrash className="h-3.5 w-3.5" /> {t('overlays.delete')}
        </button>
      )}
    </div>
  )
}

function SoftDeleteDemo() {
  const { t } = useI18n()
  const [items, setItems] = useState(['checkout-events', 'auth-signals', 'ledger-sync'])
  const [trash, setTrash] = useState<string[]>([])
  const softDelete = (name: string) => { setItems((i) => i.filter((x) => x !== name)); setTrash((t) => [name, ...t]) }
  const restore = (name: string) => { setTrash((t) => t.filter((x) => x !== name)); setItems((i) => [...i, name]) }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="border-b border-line-soft px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink">{t('overlays.destructive.active')}</p>
          <Badge severity="primary" size="sm">{items.length}</Badge>
        </div>
        <div className="divide-y divide-line-soft">
          {items.map((name) => (
            <div key={name} className="flex items-center justify-between px-4 py-2.5">
              <span className="font-mono text-sm text-ink">{name}</span>
              <button onClick={() => softDelete(name)} aria-label={`${t('ui.remove')} ${name}`} className="pance-focus -my-[3px] grid h-7 w-7 place-items-center rounded-lg text-ink-muted hover:bg-danger-soft hover:text-danger"><IconTrash aria-hidden className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          {items.length === 0 && <p className="px-4 py-4 text-xs text-ink-muted italic">{t('overlays.destructive.noActive')}</p>}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-line-soft px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-muted">{t('overlays.destructive.trash')}</p>
          <Badge severity="secondary" size="sm">{trash.length}</Badge>
        </div>
        <div className="divide-y divide-line-soft">
          {trash.map((name) => (
            <div key={name} className="flex items-center justify-between px-4 py-2.5">
              <span className="font-mono text-sm text-ink-muted line-through">{name}</span>
              <button onClick={() => restore(name)} className="pance-focus rounded-lg px-2 py-1 text-xs font-medium text-primary-fg hover:bg-primary-soft">{t('overlays.destructive.restore')}</button>
            </div>
          ))}
          {trash.length === 0 && <p className="px-4 py-4 text-xs text-ink-muted italic">{t('overlays.destructive.trashEmpty')}</p>}
        </div>
      </Card>
    </div>
  )
}

const NOTIFS_INIT = [
  { id: 'n1', n: 1, read: false, severity: 'success' },
  { id: 'n2', n: 2, read: false, severity: 'warning' },
  { id: 'n3', n: 3, read: false, severity: 'danger' },
  { id: 'n4', n: 4, read: true, severity: 'primary' },
  { id: 'n5', n: 5, read: true, severity: 'success' },
] as const

function NotificationCenterDemo() {
  const { t } = useI18n()
  const [state, setState] = useState(() => NOTIFS_INIT.map((x) => ({ id: x.id, read: x.read })))
  const items: NotificationItem[] = state.map((x) => {
    const base = NOTIFS_INIT.find((n) => n.id === x.id)!
    return { id: x.id, read: x.read, severity: base.severity, title: t(`overlays.notif.n${base.n}.title` as Key), body: t(`overlays.notif.n${base.n}.body` as Key), time: t(`overlays.notif.n${base.n}.time` as Key) }
  })
  return (
    <NotificationCenter
      items={items}
      onRead={(id) => setState((s) => s.map((x) => (x.id === id ? { ...x, read: true } : x)))}
      onReadAll={() => setState((s) => s.map((x) => ({ ...x, read: true })))}
      onDismiss={(id) => setState((s) => s.filter((x) => x.id !== id))}
      footer={<button type="button" className="pance-focus w-full rounded text-center text-xs font-medium text-ink-link hover:underline">{t('overlays.notif.viewAll')}</button>}
    />
  )
}

export function OverlaysPage() {
  /* Modal state */
  const { t } = useI18n()
  const days = (n: number) => t('overlays.opt.days', { n })
  const [modalDelete, setModalDelete] = useState(false)
  const [modalForm, setModalForm]     = useState(false)
  const [modalInfo, setModalInfo]     = useState(false)
  const [modalXl, setModalXl]         = useState(false)

  /* Drawer state */
  const [drawerRight, setDrawerRight]   = useState(false)
  const [drawerLeft, setDrawerLeft]     = useState(false)
  const [drawerBottom, setDrawerBottom] = useState(false)

  /* Toast state */
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [scaleConfirm, setScaleConfirm] = useState<'simple' | null>(null)
  const addToast = (severity: ToastItem['severity'], title: string, description?: string, action?: ToastItem['action']) =>
    setToasts((t) => [...t, { id: String(++_toastId), severity, title, description, action }])
  const dismissToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id))

  /* Dropdown items */
  const streamMenuItems: DropdownItem[] = [
    { type: 'label', label: t('overlays.menu.stream') },
    { label: t('overlays.menu.editConfig'), Icon: IconEdit },
    { label: t('overlays.menu.duplicateStream'), Icon: IconCopy },
    { label: t('overlays.menu.viewLogs'), Icon: IconExternal },
    { type: 'separator' },
    { label: t('overlays.menu.pause'), Icon: IconDots },
    { type: 'separator' },
    { label: t('overlays.deleteStream'), Icon: IconTrash, danger: true },
  ]

  return (
    <Page eyebrow={t('nav.group.components')} title={t('nav.overlays')} lead={t('overlays.lead')}>

      {/* 1. Tooltip placements */}
      <Section title={t('overlays.tooltip.title')} hint={t('overlays.tooltip.hint')}>
        <Demo>
          <Tooltip label={t('overlays.tooltip.top')} placement="top"><Button variant="outlined" severity="secondary" size="sm">Top</Button></Tooltip>
          <Tooltip label={t('overlays.tooltip.bottom')} placement="bottom"><Button variant="outlined" severity="secondary" size="sm">Bottom</Button></Tooltip>
          <Tooltip label={t('overlays.tooltip.left')} placement="left"><Button variant="outlined" severity="secondary" size="sm">Left</Button></Tooltip>
          <Tooltip label={t('overlays.tooltip.right')} placement="right"><Button variant="outlined" severity="secondary" size="sm">Right</Button></Tooltip>
        </Demo>
        <Demo className="mt-3">
          <Tooltip label={t('overlays.tooltip.shortcut')} description={t('overlays.tooltip.shortcutDesc')} placement="top">
            <Button variant="outlined" severity="secondary" size="sm" Icon={IconSearch}>{t('overlays.tooltip.search')}</Button>
          </Tooltip>
          <Tooltip label={t('overlays.deleteStream')} description={t('overlays.tooltip.deleteDesc')} placement="top">
            <IconButton Icon={IconTrash} label={t('overlays.delete')} />
          </Tooltip>
          <Tooltip label={t('overlays.editStream')} placement="top"><IconButton Icon={IconEdit} label={t('overlays.edit')} /></Tooltip>
          <Tooltip label={t('overlays.duplicate')} placement="top"><IconButton Icon={IconCopy} label={t('overlays.duplicate')} /></Tooltip>
        </Demo>
      </Section>

      {/* 2. Modal — sizes */}
      <Section title={t('overlays.modal.title')} hint={t('overlays.modal.hint')}>
        <Demo>
          <Button severity="danger" Icon={IconTrash} onClick={() => setModalDelete(true)}>{t('overlays.deleteStream')}</Button>
          <Button severity="secondary" variant="outlined" Icon={IconInfo} onClick={() => setModalInfo(true)}>{t('overlays.modal.info')}</Button>
          <Button severity="primary" Icon={IconPlus} onClick={() => setModalForm(true)}>{t('overlays.modal.invite')}</Button>
          <Button severity="secondary" variant="outlined" onClick={() => setModalXl(true)}>{t('overlays.modal.large')}</Button>
        </Demo>
      </Section>

      {/* 3. Drawer */}
      <Section title={t('overlays.drawer.title')} hint={t('overlays.drawer.hint')}>
        <Demo>
          <Button severity="secondary" variant="outlined" onClick={() => setDrawerRight(true)}>{t('overlays.drawer.right')}</Button>
          <Button severity="secondary" variant="outlined" onClick={() => setDrawerLeft(true)}>{t('overlays.drawer.left')}</Button>
          <Button severity="secondary" variant="outlined" onClick={() => setDrawerBottom(true)}>{t('overlays.drawer.bottom')}</Button>
        </Demo>
      </Section>

      {/* 4. Popover */}
      <Section title={t('overlays.popover.title')} hint={t('overlays.popover.hint')}>
        <Demo>
          <Popover
            trigger={<Button variant="outlined" severity="secondary" Icon={IconFilter}>{t('overlays.popover.filters')}</Button>}
            title={t('overlays.popover.filterTitle')}
            description={t('overlays.popover.filterDesc')}
            align="start"
          >
            <div className="space-y-3">
              <Field label={t('overlays.region')}><Select value={t('overlays.opt.allRegions')} onChange={() => {}} options={[t('overlays.opt.allRegions'), 'us-east-1', 'eu-west-2', 'ap-south-1']} /></Field>
              <Field label={t('overlays.status')}><Select value={t('overlays.opt.anyStatus')} onChange={() => {}} options={[t('overlays.opt.anyStatus'), t('badges.dots.flowing'), t('badges.dots.paused'), t('badges.dots.draining')]} /></Field>
              <div className="flex gap-2 pt-1">
                <Button size="sm" severity="primary" block>{t('overlays.apply')}</Button>
                <Button size="sm" severity="secondary" variant="outlined" block>{t('overlays.reset')}</Button>
              </div>
            </div>
          </Popover>

          <Popover
            trigger={<Button variant="outlined" severity="secondary" Icon={IconGear}>{t('overlays.popover.settings')}</Button>}
            title={t('overlays.popover.retentionTitle')}
            description={t('overlays.popover.retentionDesc')}
            align="start"
          >
            <div className="space-y-3">
              <Field label={t('overlays.retentionWindow')}><Select value={days(30)} onChange={() => {}} options={[days(7), days(14), days(30), days(90), t('overlays.opt.year')]} /></Field>
              <Button size="sm" severity="primary" block>{t('overlays.popover.savePolicy')}</Button>
            </div>
          </Popover>

          <Popover
            trigger={<Button variant="outlined" severity="secondary" Icon={IconUsers}>{t('overlays.popover.team')}</Button>}
            title={t('overlays.popover.online', { n: 2 })}
            align="end"
          >
            <div className="space-y-2">
              {[
                { name: 'Ines Halvorsen', role: t('badges.team.admin'), avatar: 'photo-1438761681033-6461ffad8d80' },
                { name: 'Devon Achebe', role: t('badges.team.editor'), avatar: 'photo-1500648767791-00dcc994a43e' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2.5">
                  <Avatar name={p.name} src={photo(p.avatar)} size={28} status="online" />
                  <div>
                    <p className="text-sm font-medium text-ink leading-none">{p.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Popover>
        </Demo>
      </Section>

      {/* 5. Dropdown menu */}
      <Section title={t('overlays.menu.title')} hint={t('overlays.menu.hint')}>
        <Demo>
          <DropdownMenu trigger={<Button severity="secondary" variant="outlined" Icon={IconDots}>{t('overlays.menu.actions')}</Button>} items={streamMenuItems} align="start" />
          <DropdownMenu
            trigger={<IconButton Icon={IconDots} label={t('overlays.more')} />}
            align="end"
            items={[
              { label: t('overlays.edit'), Icon: IconEdit },
              { label: t('overlays.menu.copyId'), Icon: IconCopy, shortcut: '⌘C' },
              { type: 'separator' },
              { label: t('overlays.delete'), Icon: IconTrash, danger: true },
            ]}
          />
          <DropdownMenu
            trigger={<Button severity="primary" Icon={IconPlus}>{t('overlays.menu.newStream')}</Button>}
            align="start"
            items={[
              { type: 'label', label: t('overlays.menu.templates') },
              { label: t('overlays.menu.blank'), Icon: IconStream },
              { label: t('overlays.menu.fromSchema'), Icon: IconDatabase },
              { label: t('overlays.menu.clone'), Icon: IconCopy },
              { type: 'separator' },
              { label: t('overlays.menu.importCli'), Icon: IconDownload, shortcut: '⌘I' },
            ]}
          />
        </Demo>
      </Section>

      {/* 6. Notification center */}
      <Section title={t('overlays.notif.section')} hint={t('overlays.notif.hint')}>
        <Demo>
          <NotificationCenterDemo />
        </Demo>
        <p className="mt-2 text-xs text-ink-muted">{t('overlays.notif.help')}</p>
      </Section>

      {/* 7. Destructive actions */}
      <Section title={t('overlays.destructive.title')} hint={t('overlays.destructive.hint')}>
        <div className="space-y-4">
          {/* Affordance scale */}
          <Card className="p-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('overlays.destructive.scale')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button severity="danger" variant="text" Icon={IconTrash} onClick={() => addToast('info', t('overlays.destructive.moved'), undefined, { label: t('ui.undo'), onClick: () => addToast('success', t('overlays.destructive.restored')) })}>{t('overlays.delete')}</Button>
              <Button severity="danger" variant="outlined" Icon={IconTrash} onClick={() => setScaleConfirm('simple')}>{t('overlays.deleteStream')}</Button>
              <Button severity="danger" Icon={IconTrash} onClick={() => setModalDelete(true)}>{t('overlays.deleteStream')}</Button>
              <span className="mx-1 h-6 w-px bg-line" />
              <Tooltip label={t('overlays.destructive.deleteItem')} placement="top"><IconButton Icon={IconTrash} label={t('overlays.delete')} onClick={() => setScaleConfirm('simple')} /></Tooltip>
            </div>
            <p className="mt-3 text-xs text-ink-muted">{t('overlays.destructive.scaleNote')}</p>
          </Card>

          {/* Inline row delete */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('overlays.destructive.inline')}</p>
            <Card className="divide-y divide-line-soft overflow-hidden">
              {[
                { name: 'checkout-events', region: 'us-east-1' },
                { name: 'auth-signals', region: 'eu-west-2' },
                { name: 'ledger-sync', region: 'ap-south-1' },
              ].map((row) => (
                <DestructiveRow key={row.name} name={row.name} region={row.region} />
              ))}
            </Card>
          </div>

          {/* Soft delete / trash pattern */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('overlays.destructive.soft')}</p>
            <SoftDeleteDemo />
          </div>

          {/* Do / Don't */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-success-border bg-success-soft p-5">
              <p className="mb-3 font-mono text-10 font-semibold uppercase tracking-wider text-success-fg">{t('overlays.do.title')}</p>
              <div className="space-y-2 text-sm text-ink-soft">
                <div className="flex items-start gap-2"><IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" /><span>{t('overlays.do.name')} <em>"{t('overlays.do.nameEx')}"</em></span></div>
                <div className="flex items-start gap-2"><IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" /><span>{t('overlays.do.state')} <em>"{t('overlays.do.stateEx')}"</em></span></div>
                <div className="flex items-start gap-2"><IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" /><span>{t('overlays.do.order')}</span></div>
                <div className="flex items-start gap-2"><IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" /><span>{t('overlays.do.undo')}</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-danger-border bg-danger-soft p-5">
              <p className="mb-3 font-mono text-10 font-semibold uppercase tracking-wider text-danger-fg">{t('overlays.dont.title')}</p>
              <div className="space-y-2 text-sm text-ink-soft">
                <div className="flex items-start gap-2"><IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-fg" /><span>{t('overlays.dont.generic')} <em>"{t('overlays.dont.genericEx')}"</em></span></div>
                <div className="flex items-start gap-2"><IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-fg" /><span>{t('overlays.dont.ambiguous')} <em>"{t('overlays.dont.yes')}"</em> / <em>"{t('overlays.dont.no')}"</em>.</span></div>
                <div className="flex items-start gap-2"><IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-fg" /><span>{t('overlays.dont.red')}</span></div>
                <div className="flex items-start gap-2"><IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-fg" /><span>{t('overlays.dont.skip')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Toast */}
      <Section title={t('overlays.toast.title')} hint={t('overlays.toast.hint')}>
        <Demo>
          <Button size="sm" severity="success" variant="outlined" onClick={() => addToast('success', t('overlays.toast.saved.title'), t('overlays.toast.saved.body'))}>Success</Button>
          <Button size="sm" severity="info" variant="outlined" onClick={() => addToast('info', t('overlays.toast.maint.title'), t('overlays.toast.maint.body'))}>Info</Button>
          <Button size="sm" severity="warning" variant="outlined" onClick={() => addToast('warning', t('overlays.toast.drift.title'), t('overlays.toast.drift.body'))}>Warning</Button>
          <Button size="sm" severity="danger" variant="outlined" onClick={() => addToast('danger', t('overlays.toast.disc.title'), t('overlays.toast.disc.body'))}>Danger</Button>
          <Button size="sm" severity="primary" variant="outlined" onClick={() => addToast('primary', t('overlays.toast.region.title'), t('overlays.toast.region.body'))}>Brand</Button>
          <Button size="sm" severity="secondary" variant="outlined" onClick={() => addToast('info', t('overlays.destructive.moved'), undefined, { label: t('ui.undo'), onClick: () => addToast('success', t('overlays.destructive.restored')) })}>{t('ui.undo')}</Button>
        </Demo>
        <p className="mt-2 text-xs text-ink-muted">{t('overlays.toast.help')}</p>
      </Section>

      {/* — Modals rendered in portal — */}
      <ConfirmDialog
        open={scaleConfirm === 'simple'}
        onClose={() => setScaleConfirm(null)}
        onConfirm={() => { setScaleConfirm(null); addToast('success', t('overlays.destructive.deleted')) }}
        title={t('overlays.destructive.confirmQ')}
        description={t('overlays.destructive.simpleDesc')}
        confirmLabel={t('overlays.deleteStream')}
        cancelLabel={t('overlays.cancel')}
      />
      <ConfirmDialog
        open={modalDelete}
        onClose={() => setModalDelete(false)}
        onConfirm={() => { setModalDelete(false); addToast('success', t('overlays.destructive.deleted')) }}
        title={t('overlays.modal.deleteTitle')}
        description={t('overlays.modal.deleteDesc')}
        confirmLabel={t('overlays.deleteStream')}
        cancelLabel={t('overlays.cancel')}
        requireText="checkout-events"
      />

      <Modal
        open={modalInfo}
        onClose={() => setModalInfo(false)}
        title={t('overlays.modal.slaTitle')}
        description={t('overlays.modal.slaDesc')}
        icon={IconInfo}
        iconSeverity="info"
        footer={<Button severity="secondary" variant="outlined" onClick={() => setModalInfo(false)}>{t('overlays.modal.gotIt')}</Button>}
      >
        <div className="space-y-2 text-sm text-ink-muted">
          {[
            [t('overlays.sla.uptime'), t('overlays.sla.uptimeV')],
            [t('overlays.sla.retention'), t('overlays.sla.retentionV')],
            [t('overlays.sla.replay'), t('overlays.sla.replayV')],
            [t('overlays.sla.support'), t('overlays.sla.supportV')],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line-soft pb-2 last:border-0">
              <span className="font-medium text-ink">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modalForm}
        onClose={() => setModalForm(false)}
        title={t('overlays.modal.invite')}
        description={t('overlays.modal.inviteDesc')}
        size="md"
        footer={<>
          <Button variant="outlined" severity="secondary" onClick={() => setModalForm(false)}>{t('overlays.cancel')}</Button>
          <Button severity="primary" onClick={() => setModalForm(false)}>{t('overlays.modal.sendInvite')}</Button>
        </>}
      >
        <div className="space-y-4">
          <Field label={t('overlays.modal.email')}><Input placeholder="name@company.com" Icon={IconMail} /></Field>
          <Field label={t('overlays.modal.role')} hint={t('overlays.modal.roleHint')}><Select value={t('badges.team.editor')} onChange={() => {}} options={[t('badges.team.admin'), t('badges.team.editor'), t('badges.team.viewer')]} /></Field>
        </div>
      </Modal>

      <Modal
        open={modalXl}
        onClose={() => setModalXl(false)}
        title={t('overlays.modal.configTitle')}
        description={t('overlays.modal.configDesc')}
        size="xl"
        footer={<>
          <Button variant="outlined" severity="secondary" onClick={() => setModalXl(false)}>{t('overlays.cancel')}</Button>
          <Button severity="primary" onClick={() => setModalXl(false)}>{t('overlays.saveChanges')}</Button>
        </>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('overlays.modal.streamName')}><Input defaultValue="checkout-events" /></Field>
          <Field label={t('overlays.region')}><Select value="us-east-1 · N. Virginia" onChange={() => {}} options={['us-east-1 · N. Virginia', 'eu-west-2 · London', 'ap-south-1 · Mumbai']} /></Field>
          <Field label={t('overlays.retentionWindow')}><Select value={days(30)} onChange={() => {}} options={[days(7), days(14), days(30), days(90)]} /></Field>
          <Field label={t('overlays.modal.partitions')}><Input defaultValue="8" /></Field>
          <div className="sm:col-span-2"><Field label={t('overlays.modal.schemaFormat')}><Select value="Avro" onChange={() => {}} options={['Avro', 'JSON Schema', 'Protobuf', t('overlays.opt.none')]} /></Field></div>
        </div>
      </Modal>

      {/* — Drawers — */}
      <Drawer
        open={drawerRight}
        onClose={() => setDrawerRight(false)}
        title={t('overlays.drawer.details')}
        description="checkout-events · STR-4820"
        side="right"
        footer={<>
          <Button variant="outlined" severity="secondary" onClick={() => setDrawerRight(false)}>{t('overlays.close')}</Button>
          <Button severity="primary" onClick={() => setDrawerRight(false)}>{t('overlays.saveChanges')}</Button>
        </>}
      >
        <div className="space-y-4">
          <Field label={t('overlays.drawer.displayName')}><Input defaultValue="checkout-events" /></Field>
          <Field label={t('overlays.drawer.description')}><Textarea defaultValue={t('overlays.drawer.descriptionV')} /></Field>
          <Field label={t('overlays.drawer.retention')}><Select value={days(30)} onChange={() => {}} options={[days(7), days(14), days(30), days(90)]} /></Field>
          <Field label={t('overlays.drawer.owner')}><Input defaultValue="Ines Halvorsen" Icon={IconUser} /></Field>
        </div>
      </Drawer>

      <Drawer
        open={drawerLeft}
        onClose={() => setDrawerLeft(false)}
        title={t('overlays.drawer.nav')}
        side="left"
      >
        <nav className="space-y-1">
          {(['navigation.navbar.dashboard', 'navigation.navbar.streams', 'navigation.navbar.schemas', 'navigation.navbar.connectors', 'navigation.tab.settings'] as const).map((item) => (
            <button key={item} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-ground hover:text-ink">
              <IconStream className="h-4 w-4 text-ink-muted" />{t(item)}
            </button>
          ))}
        </nav>
      </Drawer>

      <Drawer
        open={drawerBottom}
        onClose={() => setDrawerBottom(false)}
        title={t('overlays.popover.filterTitle')}
        description={t('overlays.drawer.filterDesc')}
        side="bottom"
        footer={<>
          <Button variant="outlined" severity="secondary" onClick={() => setDrawerBottom(false)}>{t('overlays.reset')}</Button>
          <Button severity="primary" onClick={() => setDrawerBottom(false)}>{t('overlays.drawer.applyFilters')}</Button>
        </>}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t('overlays.region')}><Select value={t('overlays.opt.allRegions')} onChange={() => {}} options={[t('overlays.opt.allRegions'), 'us-east-1', 'eu-west-2', 'ap-south-1']} /></Field>
          <Field label={t('overlays.status')}><Select value={t('overlays.opt.anyStatus')} onChange={() => {}} options={[t('overlays.opt.anyStatus'), t('badges.dots.flowing'), t('badges.dots.paused'), t('badges.dots.draining')]} /></Field>
          <Field label={t('overlays.drawer.owner')}><Input placeholder={t('overlays.drawer.searchOwners')} Icon={IconSearch} /></Field>
        </div>
      </Drawer>

      {/* — Toast stack — */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

    </Page>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   METRIC CARDS — types, primitives, variants, compositions
   ═══════════════════════════════════════════════════════════════════════ */
type Metric = { label: string; value: string; unit?: string; delta: number; spark: number[]; Icon: IconType }

/* The docs site dogfoods the library: these adapters keep the specimen pages short and render the real components. */
function Sparkline({ data, positive, w = 96 }: { data: number[]; positive: boolean; w?: number; h?: number }) {
  return <LibSparkline data={data} tone={positive ? 'positive' : 'negative'} size={w <= 60 ? 'sm' : w >= 110 ? 'lg' : 'md'} />
}
function SparkBar({ data, positive }: { data: number[]; positive: boolean; w?: number; h?: number }) {
  return <LibSparkline data={data} tone={positive ? 'positive' : 'negative'} variant="bar" size="sm" />
}
function SparkFlat() { return <LibSparkline data={[1, 1]} tone="neutral" size="sm" /> }
function DeltaBadge({ delta, upIsGood = true }: { delta: number; upIsGood?: boolean }) { return <Delta value={delta} upIsGood={upIsGood} /> }

export function MetricCard({ m }: { m: Metric }) {
  return <LibMetricCard label={m.label} value={m.value} unit={m.unit} Icon={m.Icon} delta={m.delta} trend={m.spark} />
}
function MetricCardCompact({ label, value, unit, delta, upIsGood = true, spark }: { label: string; value: string; unit?: string; delta: number; upIsGood?: boolean; spark: number[] }) {
  return <LibMetricCard variant="compact" label={label} value={value} unit={unit} delta={delta} upIsGood={upIsGood} trend={spark} />
}
function MetricCardHero({ label, value, unit, delta, sub, spark, upIsGood = true, accent = 'primary' }: { label: string; value: string; unit?: string; delta: number; sub?: string; spark: number[]; upIsGood?: boolean; accent?: Severity | 'brand' }) {
  return <LibMetricCard variant="hero" label={label} value={value} unit={unit} delta={delta} caption={sub} trend={spark} upIsGood={upIsGood} accent={accent === 'brand' ? 'primary' : accent} />
}
function MetricCardGoal({ label, value, unit, current, target, delta, Icon, upIsGood = true }: { label: string; value: string; unit?: string; current: number; target: number; delta: number; Icon: IconType; upIsGood?: boolean }) {
  return <LibMetricCard variant="goal" label={label} value={value} unit={unit} Icon={Icon} delta={delta} upIsGood={upIsGood} goal={{ current, target }} />
}
function MetricCardBreakdown({ label, value, unit, delta, Icon, items, upIsGood = true }: { label: string; value: string; unit?: string; delta: number; Icon: IconType; items: { label: string; value: string; pct: number; color?: string }[]; upIsGood?: boolean }) {
  return <LibMetricCard variant="breakdown" label={label} value={value} unit={unit} Icon={Icon} delta={delta} upIsGood={upIsGood} breakdown={items.map((i) => ({ label: i.label, value: i.value, share: i.pct }))} />
}
function MetricCardComparison({ label, current, previous, unit, delta, Icon, periodA, periodB, upIsGood = true }: { label: string; current: string; previous: string; unit?: string; delta: number; Icon: IconType; periodA?: string; periodB?: string; upIsGood?: boolean }) {
  const { t } = useI18n()
  return <LibMetricCard variant="comparison" label={label} value={current} unit={unit} Icon={Icon} delta={delta} upIsGood={upIsGood} comparison={{ previous, currentLabel: periodA ?? t('metrics.thisMonth'), previousLabel: periodB ?? t('metrics.lastMonth') }} />
}
function MetricCardSkeleton() { return <LibMetricCard state="loading" label="" value="" /> }
function MetricCardEmpty({ label, Icon }: { label: string; Icon: IconType }) { return <LibMetricCard state="empty" label={label} value="" Icon={Icon} /> }
function MetricCardError({ label, onRetry }: { label: string; onRetry?: () => void }) { return <LibMetricCard state="error" label={label} value="" onRetry={onRetry} /> }

/* ── Severity variants data ─────────────────────────────────────────────── */
const MC_SEVERITIES: { label: Key; value: string; unit: string | undefined; delta: number; upIsGood: boolean; spark: number[] }[] = [
  { label: 'metrics.m.activeStreams',    value: '18,204', unit: undefined, delta: 12.4, upIsGood: true,  spark: [8,12,9,14,13,18,17,22]  },
  { label: 'metrics.m.schemaCompliance', value: '99.8',   unit: '%',       delta: 0.2,  upIsGood: true,  spark: [92,94,95,96,98,98,99,100] },
  { label: 'metrics.m.pendingBacklog',   value: '2,841',  unit: undefined, delta: 34.1, upIsGood: false, spark: [10,12,14,18,22,28,31,34] },
  { label: 'metrics.m.errorRate',        value: '0.42',   unit: '%',       delta: 18.6, upIsGood: false, spark: [4,3,4,5,6,8,9,10]       },
]

/* ── MetricsPage ────────────────────────────────────────────────────────── */
export function MetricsPage() {
  const { t } = useI18n()
  const [loadingDemo, setLoadingDemo] = useState(true)
  React.useEffect(() => { const id = setTimeout(() => setLoadingDemo(false), 1800); return () => clearTimeout(id) }, [])

  const METRICS: Metric[] = [
    { label: t('metrics.m.activeStreams'),  value: '18,204', delta: 12.4, spark: [8,12,9,14,13,18,17,22],   Icon: IconStream   },
    { label: t('metrics.m.flowThroughput'), value: '2.9',    unit: 'M/s', delta: 6.1,  spark: [14,13,15,12,16,15,19,21], Icon: IconWave     },
    { label: t('metrics.m.churnedVolume'),  value: '1.2',    unit: '%',   delta: -3.8, spark: [20,18,19,15,16,13,12,10], Icon: IconArrowDown },
  ]

  return (
    <Page eyebrow={t('nav.group.patterns')} title={t('nav.metrics')} lead={t('metrics.lead')}>

      {/* ── Anatomy ──────────────────────────────────────────────── */}
      <Section title={t('metrics.anatomy.title')}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <MetricCard m={METRICS[0]} />
          <div className="space-y-3 text-sm">
            {[
              { n: t('metrics.anatomy.iconBadge'), d: t('metrics.anatomy.iconBadgeD') },
              { n: t('metrics.anatomy.label'), d: t('metrics.anatomy.labelD') },
              { n: t('metrics.anatomy.delta'), d: t('metrics.anatomy.deltaD') },
              { n: t('metrics.anatomy.hero'), d: t('metrics.anatomy.heroD') },
              { n: t('metrics.anatomy.unit'), d: t('metrics.anatomy.unitD') },
              { n: t('metrics.anatomy.spark'), d: t('metrics.anatomy.sparkD') },
              { n: t('metrics.anatomy.compare'), d: t('metrics.anatomy.compareD') },
            ].map(({ n, d }, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0 grid place-items-center rounded-full bg-primary-soft font-mono text-9 font-bold text-primary-fg">→</span>
                <span><strong className="font-semibold text-ink">{n}</strong><span className="text-ink-muted"> — {d}</span></span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Sizes ────────────────────────────────────────────────── */}
      <Section title={t('metrics.sizes.title')} hint={t('metrics.sizes.hint')}>
        {/* Compact row */}
        <p className="mb-2 font-mono text-10 uppercase tracking-[0.14em] text-ink-muted">{t('metrics.sizes.compact')}</p>
        <div className="mb-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCardCompact label={t('metrics.m.activeStreams')}  value="18,204"  delta={12.4} upIsGood spark={[8,12,9,14,13,18,17,22]} />
          <MetricCardCompact label={t('metrics.m.flowThroughput')} value="2.9" unit="M/s" delta={6.1} upIsGood spark={[14,13,15,12,16,15,19,21]} />
          <MetricCardCompact label={t('metrics.m.churnedVolume')}  value="1.2" unit="%" delta={-3.8} upIsGood={false} spark={[20,18,19,15,16,13,12,10]} />
          <MetricCardCompact label={t('metrics.m.errorRate')}      value="0.42" unit="%" delta={18.6} upIsGood={false} spark={[4,3,4,5,6,8,9,10]} />
        </div>
        {/* Default row */}
        <p className="mb-2 font-mono text-10 uppercase tracking-[0.14em] text-ink-muted">{t('metrics.sizes.default')}</p>
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
        </div>
        {/* Hero */}
        <p className="mb-2 font-mono text-10 uppercase tracking-[0.14em] text-ink-muted">{t('metrics.sizes.hero')}</p>
        <MetricCardHero label={t('metrics.m.totalThroughput')} value="704" unit="K/s"
          delta={23.4} sub={t('metrics.sizes.heroSub')}
          spark={[180,195,210,225,240,280,310,295,320,340,365,392]} />
      </Section>

      {/* ── Sparkline types ───────────────────────────────────────── */}
      <Section title={t('metrics.spark.title')} hint={t('metrics.spark.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Line */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium text-ink-muted">{t('metrics.m.activeStreams')}</p>
            <p className="mt-1 font-display text-3xl font-extrabold leading-none text-ink">18,204</p>
            <div className="mt-4 flex items-end justify-between">
              <DeltaBadge delta={12.4} />
              <Sparkline data={[8,12,9,14,13,18,17,22]} positive w={80} h={32} />
            </div>
            <p className="mt-2 font-mono text-10 text-ink-muted">{t('metrics.spark.line')}</p>
          </div>
          {/* Bar */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium text-ink-muted">{t('metrics.m.weeklyEvents')}</p>
            <p className="mt-1 font-display text-3xl font-extrabold leading-none text-ink">1.4M</p>
            <div className="mt-4 flex items-end justify-between">
              <DeltaBadge delta={8.2} />
              <SparkBar data={[6,7,5,8,7,9,11,13]} positive w={72} h={28} />
            </div>
            <p className="mt-2 font-mono text-10 text-ink-muted">{t('metrics.spark.bar')}</p>
          </div>
          {/* Flat */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium text-ink-muted">{t('metrics.m.schemaVersion')}</p>
            <p className="mt-1 font-display text-3xl font-extrabold leading-none text-ink">v4.2</p>
            <div className="mt-4 flex items-end justify-between">
              <DeltaBadge delta={0} />
              <SparkFlat />
            </div>
            <p className="mt-2 font-mono text-10 text-ink-muted">{t('metrics.spark.flat')}</p>
          </div>
        </div>
      </Section>

      {/* ── Delta semantics ───────────────────────────────────────── */}
      <Section title={t('metrics.delta.title')} hint={t('metrics.delta.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{t('metrics.delta.upGood')}</p>
            <p className="mt-3 font-display text-3xl font-extrabold leading-none text-ink">18,204</p>
            <p className="mt-1 text-xs text-ink-muted">{t('metrics.m.activeStreams')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <DeltaBadge delta={12.4} upIsGood={true} />
              <DeltaBadge delta={-4.1} upIsGood={true} />
            </div>
            <p className="mt-3 text-xs text-ink-muted">{t('metrics.delta.upGoodNote')}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{t('metrics.delta.downGood')}</p>
            <p className="mt-3 font-display text-3xl font-extrabold leading-none text-ink">0.42%</p>
            <p className="mt-1 text-xs text-ink-muted">{t('metrics.m.errorRate')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <DeltaBadge delta={18.6} upIsGood={false} />
              <DeltaBadge delta={-6.2} upIsGood={false} />
            </div>
            <p className="mt-3 text-xs text-ink-muted">{t('metrics.delta.downGoodNote')}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{t('metrics.delta.neutral')}</p>
            <p className="mt-3 font-display text-3xl font-extrabold leading-none text-ink">v4.2</p>
            <p className="mt-1 text-xs text-ink-muted">{t('metrics.m.schemaVersion')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <DeltaBadge delta={0} />
            </div>
            <p className="mt-3 text-xs text-ink-muted">{t('metrics.delta.neutralNote')}</p>
          </div>
        </div>
      </Section>

      {/* ── Severity / accent ─────────────────────────────────────── */}
      <Section title={t('metrics.sev.title')} hint={t('metrics.sev.hint')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MC_SEVERITIES.map(s => <LibMetricCard key={s.label} label={t(s.label)} value={s.value} unit={s.unit} delta={s.delta} upIsGood={s.upIsGood} trend={s.spark} caption={' '} />)}
        </div>
      </Section>

      {/* ── With goal / target ────────────────────────────────────── */}
      <Section title={t('metrics.goal.title')} hint={t('metrics.goal.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCardGoal label={t('metrics.m.monthlyGoal')} value="9.8M" current={9800} target={10000}
            delta={18} Icon={IconStream} />
          <MetricCardGoal label={t('metrics.m.slaTarget')} value="99.1%" current={99.1} target={99.5}
            delta={0.4} Icon={IconWave} />
          <MetricCardGoal label={t('metrics.m.activationRate')} value="64%" current={64} target={80}
            delta={-8} Icon={IconArrowUp} upIsGood />
        </div>
      </Section>

      {/* ── With breakdown ────────────────────────────────────────── */}
      <Section title={t('metrics.breakdown.title')} hint={t('metrics.breakdown.hint')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCardBreakdown
            label={t('metrics.m.flowThroughput')} value="2.9" unit="M/s" delta={6.1}
            Icon={IconWave}
            items={[
              { label: 'US East',   value: '1.4 M/s', pct: 48, color: '#0891b2' },
              { label: 'EU West',   value: '0.9 M/s', pct: 31, color: '#0891b2' },
              { label: 'AP South',  value: '0.6 M/s', pct: 21, color: '#0891b2' },
            ]}
          />
          <MetricCardBreakdown
            label={t('metrics.m.activeStreams')} value="18,204" delta={12.4}
            Icon={IconStream}
            items={[
              { label: 'checkout',  value: '4,210', pct: 23, color: '#0891b2' },
              { label: 'telemetry', value: '3,880', pct: 21, color: '#0891b2' },
              { label: 'auth',      value: '2,940', pct: 16, color: '#0891b2' },
              { label: t('metrics.b.other'), value: '7,174', pct: 40, color: '#94a3b8' },
            ]}
          />
        </div>
      </Section>

      {/* ── Period comparison ─────────────────────────────────────── */}
      <Section title={t('metrics.period.title')} hint={t('metrics.period.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCardComparison label={t('metrics.m.activeStreams')} current="18,204" previous="16,189"
            delta={12.4} Icon={IconStream} />
          <MetricCardComparison label={t('metrics.m.flowThroughput')} current="2.9" previous="2.7" unit="M/s"
            delta={6.1} Icon={IconWave} />
          <MetricCardComparison label={t('metrics.m.errorRate')} current="0.42" previous="0.36" unit="%"
            delta={18.6} Icon={IconArrowUp} upIsGood={false} />
        </div>
      </Section>

      {/* ── States ────────────────────────────────────────────────── */}
      <Section title={t('metrics.states.title')} hint={t('metrics.states.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-[0.12em] text-ink-muted">{t('metrics.states.loading')}</p>
            <MetricCardSkeleton />
          </div>
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-[0.12em] text-ink-muted">{t('metrics.states.empty')}</p>
            <MetricCardEmpty label={t('metrics.m.archivedStreams')} Icon={IconStream} />
          </div>
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-[0.12em] text-ink-muted">{t('metrics.states.error')}</p>
            <MetricCardError label={t('metrics.m.billingThroughput')} onRetry={() => {}} />
          </div>
        </div>
        {/* Deferred load demo */}
        <div className="mt-4">
          <p className="mb-2 font-mono text-10 uppercase tracking-[0.12em] text-ink-muted">{t('metrics.states.deferred')}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {loadingDemo
              ? [1, 2, 3].map(i => <MetricCardSkeleton key={i} />)
              : METRICS.map(m => <MetricCard key={m.label} m={m} />)
            }
          </div>
        </div>
      </Section>

      {/* ── Hero + supporting grid composition ───────────────────── */}
      <Section title={t('metrics.comp.heroTitle')} hint={t('metrics.comp.heroHint')}>
        <div className="grid gap-4">
          <MetricCardHero label={t('metrics.m.totalThroughput')} value="704" unit="K/s"
            delta={23.4} sub={t('metrics.comp.heroSub')}
            spark={[180,195,210,225,240,280,310,295,320,340,365,392]} />
          <div className="grid gap-4 sm:grid-cols-3">
            {METRICS.map(m => <MetricCard key={m.label} m={m} />)}
          </div>
        </div>
      </Section>

      {/* ── 4-column KPI row ──────────────────────────────────────── */}
      <Section title={t('metrics.comp.kpiTitle')} hint={t('metrics.comp.kpiHint')}>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCardCompact label={t('metrics.m.activeStreams')}  value="18,204"      delta={12.4}   upIsGood spark={[8,12,9,14,13,18,17,22]} />
          <MetricCardCompact label={t('metrics.m.flowThroughput')} value="2.9" unit="M/s" delta={6.1} upIsGood spark={[14,13,15,12,16,15,19,21]} />
          <MetricCardCompact label={t('metrics.m.errorRate')}      value="0.42" unit="%" delta={18.6}  upIsGood={false} spark={[4,3,4,5,6,8,9,10]} />
          <MetricCardCompact label={t('metrics.m.avgP99')} value="38" unit="ms"  delta={-9.3} upIsGood={false} spark={[50,48,47,46,45,43,41,38]} />
        </div>
      </Section>

      {/* ── Mixed-density grid ────────────────────────────────────── */}
      <Section title={t('metrics.comp.mixedTitle')} hint={t('metrics.comp.mixedHint')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard m={{ label: t('metrics.m.activeStreams'), value: '18,204', delta: 12.4, spark: [8,12,9,14,13,18,17,22], Icon: IconStream }} />
          <MetricCardGoal label={t('metrics.m.monthlyGoal')} value="9.8M" current={9800} target={10000} delta={18} Icon={IconWave} />
          <MetricCardComparison label={t('metrics.m.errorRate')} current="0.42" previous="0.36" unit="%" delta={18.6} Icon={IconArrowUp} upIsGood={false} />
          <MetricCardBreakdown
            label={t('metrics.m.flowByRegion')} value="2.9" unit="M/s" delta={6.1} Icon={IconWave}
            items={[
              { label: 'US East',  value: '1.4 M/s', pct: 48, color: '#0891b2' },
              { label: 'EU West',  value: '0.9 M/s', pct: 31, color: '#0891b2' },
              { label: 'AP South', value: '0.6 M/s', pct: 21, color: '#0891b2' },
            ]}
          />
          <MetricCard m={{ label: t('metrics.m.flowThroughput'), value: '2.9', unit: 'M/s', delta: 6.1, spark: [14,13,15,12,16,15,19,21], Icon: IconWave }} />
          <MetricCard m={{ label: t('metrics.m.churnedVolume'), value: '1.2', unit: '%', delta: -3.8, spark: [20,18,19,15,16,13,12,10], Icon: IconArrowDown }} />
        </div>
      </Section>

    </Page>
  )
}

/* ── Data table ────────────────────────────────────────────────────────── */
type Row = { id: string; name: string; owner: string; avatar: string; region: string; status: 'Flowing' | 'Paused' | 'Draining'; throughput: string; updated: Key }
const ROWS: Row[] = [
  { id: 'STR-4820', name: 'checkout-events', owner: 'Ines Halvorsen', avatar: 'photo-1438761681033-6461ffad8d80', region: 'us-east-1', status: 'Flowing', throughput: '412 K/s', updated: 'table.upd.min2' },
  { id: 'STR-4819', name: 'auth-signals', owner: 'Devon Achebe', avatar: 'photo-1500648767791-00dcc994a43e', region: 'eu-west-2', status: 'Flowing', throughput: '388 K/s', updated: 'table.upd.min9' },
  { id: 'STR-4801', name: 'ledger-sync', owner: 'Priya Ramanathan', avatar: 'photo-1544005313-94ddf0286df2', region: 'ap-south-1', status: 'Paused', throughput: '0 K/s', updated: 'table.upd.hr1' },
  { id: 'STR-4795', name: 'telemetry-fleet', owner: 'Kai Fenwick', avatar: 'photo-1507003211169-0a1dd7228f2d', region: 'us-east-1', status: 'Flowing', throughput: '1.1 M/s', updated: 'table.upd.hr3' },
  { id: 'STR-4788', name: 'billing-webhooks', owner: 'Sofia Marchetti', avatar: 'photo-1534528741775-53994a69daeb', region: 'sa-east-1', status: 'Draining', throughput: '96 K/s', updated: 'table.upd.hr5' },
  { id: 'STR-4772', name: 'search-index', owner: 'Omar Haddad', avatar: 'photo-1506794778202-cad84cf45f1d', region: 'eu-west-2', status: 'Flowing', throughput: '204 K/s', updated: 'table.upd.yesterday' },
  { id: 'STR-4760', name: 'notification-fanout', owner: 'Lena Björk', avatar: 'photo-1517841905240-472988babdf9', region: 'us-east-1', status: 'Paused', throughput: '0 K/s', updated: 'table.upd.yesterday' },
  { id: 'STR-4741', name: 'clickstream-raw', owner: 'Tomas Nowak', avatar: 'photo-1519085360753-af0119f7cbe7', region: 'ap-south-1', status: 'Flowing', throughput: '2.4 M/s', updated: 'table.upd.days2' },
]
const rowTone: Record<Row['status'], Severity> = { Flowing: 'primary', Paused: 'secondary', Draining: 'warning' }
const STATUS_KEY: Record<Row['status'], Key> = { Flowing: 'badges.dots.flowing', Paused: 'badges.dots.paused', Draining: 'badges.dots.draining' }

function ActionMenu({ id }: { id: string }) {
  const { t } = useI18n()
  return (
    <DropdownMenu
      align="end"
      label={t('table.actionsFor', { id })}
      trigger={<IconButton Icon={IconDots} label={t('table.actionsFor', { id })}  />}
      items={[
        { label: t('table.action.edit'), Icon: IconEdit },
        { label: t('table.action.duplicate'), Icon: IconCopy },
        { type: 'separator' },
        { label: t('table.action.delete'), Icon: IconTrash, danger: true },
      ]}
    />
  )
}

function CardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm text-ink-soft">{children}</dd>
    </div>
  )
}

const avatarOf = (r: Row) => photo(r.avatar)
const speed = (s: string) => parseFloat(s) * (s.includes('M/s') ? 1000 : 1)

function useStreamColumns(): Column<Row>[] {
  const { t } = useI18n()
  return [
    { key: 'name', header: t('table.col.name'), sortable: true, render: (r) => <div className="flex flex-col"><span className="font-medium text-ink">{r.name}</span><span className="font-mono text-xs text-ink-muted">{r.id}</span></div> },
    { key: 'owner', header: t('table.col.owner'), sortable: true, render: (r) => <div className="flex items-center gap-2.5"><Avatar name={r.owner} src={avatarOf(r)} size={28} decorative /><span>{r.owner}</span></div> },
    { key: 'region', header: t('table.col.region'), sortable: true, render: (r) => <span className="font-mono text-13">{r.region}</span> },
    { key: 'status', header: t('table.col.status'), sortable: true, render: (r) => <Badge severity={rowTone[r.status]} dot>{t(STATUS_KEY[r.status])}</Badge> },
    { key: 'throughput', header: t('table.col.throughput'), align: 'end', sortable: true, sortValue: (r) => speed(r.throughput), render: (r) => <span className="font-mono text-13 font-medium text-ink">{r.throughput}</span> },
    { key: 'updated', header: t('table.col.updated'), render: (r) => t(r.updated) },
  ]
}

export function DataTable({ compact }: { compact?: boolean } = {}) {
  const { t } = useI18n()
  const columns = useStreamColumns()
  return (
    <div className={compact ? '' : 'max-h-[520px]'}>
      <LibDataTable caption={t('table.liveStreams')} columns={columns} rows={ROWS} rowKey={(r) => r.id} rowLabel={(r) => r.name} selectable pageSize={5}
        rowActions={(r) => <ActionMenu id={r.id} />} actions={<Button size="sm" Icon={IconPlus}>{t('table.newStream')}</Button>} />
    </div>
  )
}

function CbBox({ on, indeterminate, onClick, label }: { on: boolean; indeterminate?: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`pance-focus grid h-4 w-4 place-items-center rounded border transition-colors ${on || indeterminate ? 'border-brand-700 bg-brand-700 text-white' : 'border-line-strong bg-surface hover:border-primary-border-strong'}`}
    >
      {on ? <IconCheck className="h-3 w-3" /> : indeterminate ? <span className="block h-0.5 w-2 rounded-full bg-white" /> : null}
    </button>
  )
}

function FullDataTable() {
  const { t } = useI18n()
  const columns = useStreamColumns()
  const [search, setSearch] = useState('')
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default')
  const q = search.toLowerCase()
  const rows = ROWS.filter((r) => !q || r.name.includes(q) || r.owner.toLowerCase().includes(q) || r.region.includes(q))
  return (
    <LibDataTable caption={t('table.liveStreams')} columns={columns} rows={rows} rowKey={(r) => r.id} rowLabel={(r) => r.name} selectable pageSize={5} columnToggle
      density={density} search={search} onSearchChange={setSearch} searchPlaceholder={t('table.filter')}
      rowActions={(r) => <ActionMenu id={r.id} />}
      actions={<>
        <SegmentedControl label={t('table.density.default')} value={density} onChange={(v) => setDensity(v as typeof density)}
          options={(['compact', 'default', 'comfortable'] as const).map((d) => ({ value: d, label: t(DENSITY_LABEL[d].short) }))} />
        <Button size="sm" Icon={IconPlus}>{t('table.newStream')}</Button>
      </>} />
  )
}

const DENSITY_LABEL: Record<'compact' | 'default' | 'comfortable', { title: Key; short: Key }> = {
  compact: { title: 'table.density.compact', short: 'table.density.compact.short' },
  default: { title: 'table.density.default', short: 'table.density.default.short' },
  comfortable: { title: 'table.density.comfortable', short: 'table.density.comfortable.short' },
}

/* ── Expandable rows ── */
type EventRow = { id: string; event: string; source: string; ts: string; count: number; schema: string; payload: string; key: string; days: number }
const EVENTS: EventRow[] = [
  { id: 'EVT-001', event: 'checkout.completed', source: 'web-app', ts: '14:02:11', count: 2847, schema: 'checkout.v2', payload: '1.4 KB', key: 'user_id', days: 30 },
  { id: 'EVT-002', event: 'cart.abandoned', source: 'web-app', ts: '14:01:58', count: 412, schema: 'cart.v1', payload: '0.9 KB', key: 'session_id', days: 7 },
  { id: 'EVT-003', event: 'auth.login_failed', source: 'api-gateway', ts: '14:01:44', count: 93, schema: 'auth.v3', payload: '0.3 KB', key: 'ip_address', days: 90 },
  { id: 'EVT-004', event: 'payment.declined', source: 'payments', ts: '14:01:30', count: 28, schema: 'payment.v2', payload: '2.1 KB', key: 'account_id', days: 90 },
  { id: 'EVT-005', event: 'user.signup', source: 'identity', ts: '14:01:09', count: 154, schema: 'user.v4', payload: '1.8 KB', key: 'user_id', days: 365 },
]

function ExpandableTable() {
  const { t, lang } = useI18n()
  const num = (n: number) => n.toLocaleString(lang === 'es' ? 'es-419' : 'en-US')
  const columns: Column<EventRow>[] = [
    { key: 'event', header: t('table.ev.event'), render: (ev) => <span className="font-mono text-13 font-medium text-ink">{ev.event}</span> },
    { key: 'source', header: t('table.ev.source') },
    { key: 'ts', header: t('table.ev.time'), render: (ev) => <span className="font-mono text-13">{ev.ts}</span> },
    { key: 'count', header: t('table.ev.count'), align: 'end', sortable: true, render: (ev) => <span className="font-mono text-13 font-medium text-ink">{num(ev.count)}</span> },
  ]
  const detailOf = (ev: EventRow) => [
    { field: t('table.ev.schema'), value: ev.schema },
    { field: t('table.ev.payload'), value: ev.payload },
    { field: t('table.ev.key'), value: ev.key },
    { field: t('table.ev.retention'), value: t('table.ev.days', { n: ev.days }) },
  ]
  return (
    <LibDataTable caption={t('table.expand.header')} columns={columns} rows={EVENTS} rowKey={(ev) => ev.id} rowLabel={(ev) => ev.event}
      renderExpanded={(ev) => (
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
          {detailOf(ev).map((d) => (
            <div key={d.field}>
              <dt className="font-mono text-10 font-semibold uppercase tracking-wider text-ink-muted">{d.field}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">{d.value}</dd>
            </div>
          ))}
        </dl>
      )} />
  )
}

/* ── Loading skeleton table ── */
function SkeletonTable() {
  const { t } = useI18n()
  return (
    <Card className="relative overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line-soft px-6 py-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-44 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </header>
      <div tabIndex={0} className="pance-focus relative overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-canvas [&>th]:border-b [&>th]:border-line [&>th]:px-6 [&>th]:py-3">
            {['w-12', 'w-1/4', 'w-1/5', 'w-1/6', 'w-1/6', 'w-1/6', 'w-12'].map((w, i) => (
              <th key={i} className={`px-6 py-3 ${w}`}><Skeleton className="h-3 w-3/4 rounded" /><span className="sr-only">{t('cards.states.loading')}</span></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-line-soft last:border-0">
              <td className="px-6 py-3.5"><Skeleton className="h-4 w-4 rounded" /></td>
              <td className="px-6 py-3.5 space-y-1.5"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-20" /></td>
              <td className="px-6 py-3.5"><div className="flex items-center gap-2.5"><Skeleton className="h-7 w-7 rounded-full" /><Skeleton className="h-4 w-28" /></div></td>
              <td className="px-6 py-3.5"><Skeleton className="h-4 w-20" /></td>
              <td className="px-6 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
              <td className="px-6 py-3.5"><Skeleton className="ml-auto h-4 w-16" /></td>
              <td className="px-6 py-3.5"><Skeleton className="h-4 w-16" /></td>
              <td className="px-6 py-3.5"><Skeleton className="ml-auto h-8 w-8 rounded-lg" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <footer className="flex items-center justify-between border-t border-line-soft px-6 py-4">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-1"><Skeleton className="h-8 w-8 rounded-lg" />{[1,2,3].map(i=><Skeleton key={i} className="h-8 w-8 rounded-lg" />)}<Skeleton className="h-8 w-8 rounded-lg" /></div>
      </footer>
    </Card>
  )
}

/* ── Empty state (standalone specimen) ── */
function EmptyTable({ reason }: { reason: 'no-data' | 'filtered' | 'error' }) {
  const { t } = useI18n()
  const states = {
    'no-data': { Icon: IconStream, title: t('table.empty.noData.title'), body: t('table.empty.noData.body'), cta: t('table.empty.noData.cta'), ctaIcon: IconPlus },
    'filtered': { Icon: IconSearch, title: t('table.empty.filtered.title'), body: t('table.empty.filtered.body'), cta: t('table.empty.filtered.cta'), ctaIcon: IconX },
    'error': { Icon: IconAlert, title: t('table.empty.error.title'), body: t('table.empty.error.body'), cta: t('table.empty.error.cta'), ctaIcon: IconArrowRight },
  }
  const s = states[reason]
  const sev = reason === 'error' ? 'danger' : 'secondary'
  return (
    <Card className="overflow-hidden">
      <header className="border-b border-line-soft px-6 py-5">
        <div className="flex items-center justify-between">
          <div><h2 className="font-display text-base font-bold text-ink">{t('table.liveStreams')}</h2><p className="mt-0.5 text-sm text-ink-muted">{t('table.empty.subtitle')}</p></div>
          <Button size="sm" Icon={IconPlus} disabled={reason === 'error'}>{t('table.newStream')}</Button>
        </div>
      </header>
      <div tabIndex={0} className="pance-focus overflow-x-auto border-b border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-canvas [&>th]:border-b [&>th]:border-line [&>th]:px-6 [&>th]:py-3 [&>th]:font-mono [&>th]:text-11 [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-[0.12em] [&>th]:text-ink-muted">
              <th>{t('table.col.name')}</th><th>{t('table.col.owner')}</th><th>{t('table.col.region')}</th><th>{t('table.col.status')}</th><th className="text-right">{t('table.col.throughput')}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className={`grid h-14 w-14 place-items-center rounded-2xl ${reason === 'error' ? 'bg-danger-soft text-danger' : 'bg-canvas text-ink-muted'}`}>
          <s.Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="font-semibold text-ink">{s.title}</p>
          <p className="mt-1 max-w-xs text-sm text-ink-muted">{s.body}</p>
        </div>
        <Button severity={sev} variant={reason === 'error' ? 'filled' : 'outlined'} Icon={s.ctaIcon}>{s.cta}</Button>
      </div>
    </Card>
  )
}

/* ── Simple read-only table ── */
const REGION_DATA = [
  { region: 'us-east-1', location: 'N. Virginia', streams: 8, quota: 50, throughput: '2.1 M/s', latency: '4 ms' },
  { region: 'eu-west-2', location: 'London', streams: 4, quota: 20, throughput: '592 K/s', latency: '11 ms' },
  { region: 'ap-south-1', location: 'Mumbai', streams: 3, quota: 20, throughput: '2.4 M/s', latency: '18 ms' },
  { region: 'sa-east-1', location: 'São Paulo', streams: 2, quota: 10, throughput: '96 K/s', latency: '22 ms' },
]

function SimpleTable() {
  const { t } = useI18n()
  return (
    <Card className="overflow-hidden">
      <header className="border-b border-line-soft px-6 py-5">
        <h2 className="font-display text-base font-bold text-ink">{t('table.simple.header')}</h2>
        <p className="mt-0.5 text-sm text-ink-muted">{t('table.simple.sub')}</p>
      </header>
      {/* Mobile: card list */}
      <div className="space-y-3 p-4 md:hidden">
        {REGION_DATA.map((r) => (
          <div key={r.region} className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-13 font-medium text-ink">{r.region}</p>
                <p className="text-sm text-ink-muted">{r.location}</p>
              </div>
              <span className={`font-mono text-13 font-medium ${parseInt(r.latency) < 10 ? 'text-success-fg' : parseInt(r.latency) < 20 ? 'text-warning-fg' : 'text-danger-fg'}`}>{r.latency}</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line-soft pt-4">
              <CardField label={t('table.col.throughput')}><span className="font-mono text-13 font-medium text-ink">{r.throughput}</span></CardField>
              <CardField label={t('table.simple.streams')}>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-brand-400" style={{ width: `${(r.streams / r.quota) * 100}%` }} /></span>
                  <span className="font-mono text-13 text-ink-soft">{r.streams}/{r.quota}</span>
                </span>
              </CardField>
            </dl>
          </div>
        ))}
      </div>
      {/* md+: table */}
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="bg-canvas [&>th]:border-b [&>th]:border-line [&>th]:px-6 [&>th]:py-3 [&>th]:font-mono [&>th]:text-11 [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-[0.12em] [&>th]:text-ink-muted">
            <th>{t('table.col.region')}</th><th>{t('table.simple.location')}</th><th className="text-right">{t('table.simple.streams')}</th><th className="text-right">{t('table.simple.quota')}</th><th className="text-right">{t('table.col.throughput')}</th><th className="text-right">{t('table.simple.latency')}</th>
          </tr>
        </thead>
        <tbody>
          {REGION_DATA.map((r, i) => (
            <tr key={r.region} className={`border-b border-line-soft transition-colors last:border-0 hover:bg-canvas ${i % 2 === 1 ? 'bg-canvas/60' : ''}`}>
              <td className="px-6 py-3.5 font-mono text-13 font-medium text-ink">{r.region}</td>
              <td className="px-6 py-3.5 text-ink-soft">{r.location}</td>
              <td className="px-6 py-3.5 text-right font-mono text-13 text-ink">{r.streams}</td>
              <td className="px-6 py-3.5 text-right">
                <div className="inline-flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand-400 transition-all" style={{ width: `${(r.streams / r.quota) * 100}%` }} />
                  </div>
                  <span className="font-mono text-13 text-ink-soft">{r.streams}/{r.quota}</span>
                </div>
              </td>
              <td className="px-6 py-3.5 text-right font-mono text-13 font-medium text-ink">{r.throughput}</td>
              <td className="px-6 py-3.5 text-right">
                <span className={`font-mono text-13 font-medium ${parseInt(r.latency) < 10 ? 'text-success-fg' : parseInt(r.latency) < 20 ? 'text-warning-fg' : 'text-danger-fg'}`}>{r.latency}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

export function TablePage() {
  const { t } = useI18n()
  const [emptyState, setEmptyState] = useState<'no-data' | 'filtered' | 'error'>('no-data')

  return (
    <Page eyebrow={t('nav.group.components')} title={t('nav.table')} lead={t('table.lead')}>

      {/* ── 1. Full-featured table ── */}
      <Section title={t('table.full.title')} hint={t('table.full.hint')}>
        <FullDataTable />
      </Section>

      {/* ── Common arrangements ── */}
      <Section title={t('table.team.title')} hint={t('table.team.hint')}>
        <TeamTable />
      </Section>

      <Section title={t('table.inv.title')} hint={t('table.inv.hint')}>
        <InvoicesTable />
      </Section>

      <Section title={t('table.log.title')} hint={t('table.log.hint')}>
        <LogTable />
      </Section>

      {/* ── 2. Expandable rows ── */}
      <Section title={t('table.expand.title')} hint={t('table.expand.hint')}>
        <ExpandableTable />
      </Section>

      {/* ── 3. Loading skeleton ── */}
      <Section title={t('table.skeleton.title')} hint={t('table.skeleton.hint')}>
        <SkeletonTable />
      </Section>

      {/* ── 4. Empty states ── */}
      <Section title={t('table.empty.title')} hint={t('table.empty.hint')}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(['no-data', 'filtered', 'error'] as const).map(s => (
              <button key={s} onClick={() => setEmptyState(s)} className={`pance-focus rounded-lg border px-3 py-1.5 font-mono text-13 font-medium transition-colors ${emptyState === s ? 'border-primary-border-strong bg-primary-soft text-primary-fg' : 'border-line text-ink-muted hover:border-line-strong'}`}>{s}</button>
            ))}
          </div>
          <EmptyTable reason={emptyState} />
        </div>
      </Section>

      {/* ── 5. Simple read-only table ── */}
      <Section title={t('table.simple.title')} hint={t('table.simple.hint')}>
        <SimpleTable />
      </Section>

    </Page>
  )
}

/* ── Assembled dashboard ───────────────────────────────────────────────── */
export function DashboardPage() {
  const { t } = useI18n()
  return (
    <Page eyebrow={t('nav.group.patterns')} title={t('nav.dashboard')} lead={t('dashboardPage.lead')}>
      <ConsoleExample />
    </Page>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   LAYOUT PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export function LayoutPage() {
  const { t, tr } = useI18n()
  return (
    <Page eyebrow={t('nav.group.foundations')} title={t('nav.layout')} lead={t('layout.lead')}>

      <Section title={t('layout.bp.title')} hint="xs · sm · md · lg · xl · 2xl">
        <Card className="overflow-hidden">
          <div className="divide-y divide-line-soft">
            {[
              { name: 'xs', value: '< 640px', cols: '4', use: t('layout.bp.xs') },
              { name: 'sm', value: '640px', cols: '4', use: t('layout.bp.sm') },
              { name: 'md', value: '768px', cols: '8', use: t('layout.bp.md') },
              { name: 'lg', value: '1024px', cols: '12', use: t('layout.bp.lg') },
              { name: 'xl', value: '1280px', cols: '12', use: t('layout.bp.xl') },
              { name: '2xl', value: '1536px', cols: '12', use: t('layout.bp.2xl') },
            ].map((bp) => (
              <div key={bp.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-6 py-3.5">
                <span className="w-10 font-mono text-sm font-semibold text-primary-fg">{bp.name}</span>
                <span className="w-24 font-mono text-xs text-ink-muted">{bp.value}</span>
                <span className="w-14 text-xs text-ink-muted">{t('layout.bp.cols', { n: bp.cols })}</span>
                <span className="min-w-0 basis-full text-sm text-ink-soft sm:basis-0 sm:flex-1">{bp.use}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title={t('layout.cw.title')} hint={t('layout.cw.hint')}>
        <div className="space-y-3">
          {[
            { name: 'max-w-sm', px: '384px', pct: '30' },
            { name: 'max-w-md', px: '448px', pct: '36' },
            { name: 'max-w-lg', px: '512px', pct: '42' },
            { name: 'max-w-xl', px: '576px', pct: '48' },
            { name: 'max-w-2xl', px: '672px', pct: '56' },
            { name: 'max-w-4xl', px: '896px', pct: '74' },
            { name: 'max-w-6xl', px: '1152px', pct: '95' },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <span className="w-28 shrink-0 font-mono text-11 text-ink-muted">{c.name}</span>
              <div className="flex-1 rounded-full bg-ground">
                <div className="flex h-7 items-center justify-end rounded-full bg-primary-soft-hover pr-3 transition-all" style={{ width: `${c.pct}%` }}>
                  <span className="font-mono text-10 font-semibold text-primary-fg">{c.px}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('layout.grid.title')} hint={t('layout.grid.hint')}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.grid.equal')}</p>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex h-10 items-center justify-center rounded-lg bg-primary-soft-hover font-mono text-10 font-semibold text-primary-fg">{i + 1}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.grid.splits')}</p>
            <div className="space-y-2">
              {[
                { label: '1/2 + 1/2', cols: ['col-span-6', 'col-span-6'] },
                { label: '1/3 + 2/3', cols: ['col-span-4', 'col-span-8'] },
                { label: '1/4 + 3/4', cols: ['col-span-3', 'col-span-9'] },
                { label: '1/3 + 1/3 + 1/3', cols: ['col-span-4', 'col-span-4', 'col-span-4'] },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-12 gap-2">
                  {row.cols.map((cls, i) => (
                    <div key={i} className={`flex h-10 items-center justify-center rounded-lg bg-primary-soft border border-primary-border font-mono text-10 text-primary-fg ${cls}`}>{cls.replace('col-span-', '')} {t('layout.grid.col')}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title={t('layout.pat.title')} hint={t('layout.pat.hint')}>
        <div className="space-y-4">
          {/* Sidebar + main */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.pat.sidebarMain')}</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl border border-dashed border-primary-border bg-primary-soft p-4">
                <p className="font-mono text-10 font-semibold text-primary-fg">{t('layout.pat.sidebar')}</p>
                <div className="mt-3 space-y-2">
                  {[0, 1, 2].map((i) => <div key={i} className="h-7 rounded-lg bg-primary-soft-hover" />)}
                </div>
              </div>
              <div className="col-span-3 rounded-xl border border-dashed border-line-strong bg-canvas p-4">
                <p className="font-mono text-10 font-semibold text-ink-muted">{t('layout.pat.main')}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-16 rounded-lg bg-line" />)}
                </div>
                <div className="mt-2 h-24 rounded-lg bg-line" />
              </div>
            </div>
          </div>

          {/* Dashboard grid */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.pat.dashboard')}</p>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-20 rounded-xl border border-dashed border-primary-border bg-primary-soft p-3"><p className="font-mono text-10 text-primary-fg">{t('layout.pat.metric', { n: i + 1 })}</p></div>)}
            </div>
            <div className="mt-3 h-28 rounded-xl border border-dashed border-line-strong bg-canvas p-3">
              <p className="font-mono text-10 text-ink-muted">{t('layout.pat.table')}</p>
            </div>
          </div>

          {/* Form layout */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.pat.form')}</p>
            <div className="mx-auto max-w-lg rounded-xl border border-dashed border-line-strong bg-canvas p-5 space-y-3">
              <div className="h-8 w-1/2 rounded-lg bg-line" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded-lg bg-line" />
                <div className="h-10 rounded-lg bg-line" />
              </div>
              <div className="h-10 rounded-lg bg-line" />
              <div className="h-20 rounded-lg bg-line" />
              <div className="flex justify-end gap-2">
                <div className="h-9 w-20 rounded-xl bg-line-strong" />
                <div className="h-9 w-24 rounded-xl bg-primary-border" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t('layout.box.title')} hint={t('layout.box.hint')}>
        <div className="space-y-3">
          <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.box.intro')}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: 'surface', label: t('layout.box.surface'), cls: 'bg-surface border border-line rounded-2xl p-6', desc: t('layout.box.surfaceDesc') },
              { id: 'ground', label: t('layout.box.ground'), cls: 'bg-ground rounded-2xl p-6', desc: t('layout.box.groundDesc') },
              { id: 'canvas', label: t('layout.box.canvas'), cls: 'bg-canvas border border-line-soft rounded-2xl p-6', desc: t('layout.box.canvasDesc') },
              { id: 'tint', label: t('layout.box.tint'), cls: 'bg-primary-soft border border-primary-border rounded-2xl p-6', desc: t('layout.box.tintDesc') },
              { id: 'inset', label: t('layout.box.inset'), cls: 'bg-ground border border-line rounded-xl p-4', desc: t('layout.box.insetDesc') },
              { id: 'bleed', label: t('layout.box.bleed'), cls: 'bg-slate-950 ring-1 ring-slate-800 rounded-2xl p-6', desc: t('layout.box.bleedDesc') },
            ].map((b) => (
              <div key={b.label} className={b.cls}>
                <p className={`text-xs font-semibold ${b.id === 'bleed' ? 'text-white' : 'text-ink'}`}>{b.label}</p>
                <p className={`mt-1 font-mono text-10 ${b.id === 'bleed' ? 'text-white/60' : 'text-ink-muted'}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={t('layout.block.title')} hint={t('layout.block.hint')}>
        <div className="space-y-3">
          <p className="mb-1 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.block.intro')}</p>
          <div className="space-y-6">
            {/* Block with eyebrow */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="font-mono text-11 font-semibold uppercase tracking-[0.18em] text-primary-fg">{t('layout.block.eyebrow')}</p>
              <h3 className="mt-1 font-display text-xl font-bold text-ink">{t('layout.block.heading')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('layout.block.desc')}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label={t('layout.block.retention')}><Select value={t('layout.block.days', { n: 30 })} onChange={() => {}} options={[7, 14, 30, 90].map((n) => t('layout.block.days', { n }))} /></Field>
                <Field label={t('layout.block.compression')}><Select value="LZ4" onChange={() => {}} options={[t('layout.block.none'), 'LZ4', 'Snappy', 'Gzip']} /></Field>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-line-soft pt-4">
                <Button variant="outlined" severity="secondary">{t('layout.block.reset')}</Button>
                <Button severity="primary">{t('layout.block.save')}</Button>
              </div>
            </div>

            {/* Block with badge */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{t('layout.block.billing')}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{t('layout.block.billingDesc')}</p>
                </div>
                <span className="shrink-0"><Badge severity="primary" variant="soft">{t('layout.block.plan')}</Badge></span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-ground p-4">
                {[['18,204', t('layout.block.activeStreams')], ['2.9 M/s', t('layout.block.throughput')], ['$420', t('layout.block.monthlyCost')]].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="font-display text-xl font-extrabold text-ink">{v}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t('layout.content.title')} hint={t('layout.content.hint')}>
        <div className="space-y-3">
          <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{tr('layout.content.intro')}</p>
          <Card className="p-6 lg:p-8">
            <div className="mx-auto max-w-prose space-y-4">
              <p className="font-mono text-11 font-semibold uppercase tracking-[0.18em] text-primary-fg">{t('layout.content.eyebrow')}</p>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">{t('layout.content.heading')}</h2>
              <p className="text-15 leading-relaxed text-ink-soft">{t('layout.content.p1')}</p>
              <h3 className="font-display text-lg font-bold text-ink">{t('layout.content.h3')}</h3>
              <p className="text-15 leading-relaxed text-ink-soft">{tr('layout.content.p2', { a: '`user_id`', b: '`order_id`', c: '`device_id`' })}</p>
              <ul className="space-y-2 text-15 text-ink-soft">
                {(['layout.content.li1', 'layout.content.li2', 'layout.content.li3'] as const).map((li) => (
                  <li key={li} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {t(li)}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-warning-border bg-warning-soft px-4 py-3 text-sm text-warning-fg">
                <strong>{t('layout.content.avoid')}</strong> {t('layout.content.avoidText')}
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section title={t('layout.gap.title')} hint={t('layout.gap.hint')}>
        <Card className="p-6 space-y-6">
          <div>
            <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('layout.gap.label')}</p>
            <div className="flex flex-col gap-2">
              {[['gap-1', '4px'], ['gap-2', '8px'], ['gap-3', '12px'], ['gap-4', '16px'], ['gap-6', '24px'], ['gap-8', '32px']].map(([cls, val]) => (
                <div key={cls} className="flex items-center gap-4">
                  <span className="w-16 font-mono text-11 text-ink-muted">{cls}</span>
                  <div className={`flex ${cls}`}>
                    {[0, 1, 2].map((i) => <div key={i} className="h-6 w-12 rounded-md bg-primary-border" />)}
                  </div>
                  <span className="font-mono text-10 text-ink-muted">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Section>

    </Page>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CARDS PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export function CardsPage() {
  const { t, tr } = useI18n()
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  return (
    <Page eyebrow={t('nav.group.components')} title={t('nav.cards')} lead={t('cards.lead')}>

      <Section title={t('cards.anatomy.title')} hint={t('cards.anatomy.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('cards.anatomy.default')}</p>
            <p className="mt-3 text-sm font-semibold text-ink">{t('cards.anatomy.basic')}</p>
            <p className="mt-1 text-sm text-ink-muted">{tr('cards.anatomy.basicDesc')}</p>
          </Card>
          <Card className="p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.18)]">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('cards.anatomy.elevated')}</p>
            <p className="mt-3 text-sm font-semibold text-ink">{t('cards.anatomy.raised')}</p>
            <p className="mt-1 text-sm text-ink-muted">{t('cards.anatomy.raisedDesc')}</p>
          </Card>
          <div className="rounded-2xl border border-line bg-canvas p-6">
            <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{t('cards.anatomy.tinted')}</p>
            <p className="mt-3 text-sm font-semibold text-ink">{t('cards.anatomy.canvas')}</p>
            <p className="mt-1 text-sm text-ink-muted">{tr('cards.anatomy.tintedDesc')}</p>
          </div>
        </div>
      </Section>

      <Section title={t('cards.interactive.title')} hint={t('cards.interactive.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { id: 'checkout', name: 'checkout-events', region: 'us-east-1', status: 'Flowing', throughput: '412 K/s' },
            { id: 'auth', name: 'auth-signals', region: 'eu-west-2', status: 'Flowing', throughput: '388 K/s' },
            { id: 'ledger', name: 'ledger-sync', region: 'ap-south-1', status: 'Paused', throughput: '0 K/s' },
          ].map((stream) => {
            const selected = selectedCard === stream.id
            return (
              <button
                key={stream.id}
                onClick={() => setSelectedCard(selected ? null : stream.id)}
                className={`pance-focus group w-full rounded-2xl border p-5 text-left transition-all duration-200 ${selected ? 'border-primary-border-strong bg-primary-soft shadow-[0_0_0_3px_var(--color-primary-soft-hover)]' : 'border-line bg-surface hover:-translate-y-0.5 hover:border-primary-border hover:shadow-[0_8px_24px_-12px_rgba(8,145,178,0.3)]'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-fg group-hover:bg-primary-soft-hover">
                    <IconStream className="h-4 w-4" />
                  </div>
                  <Badge severity={stream.status === 'Flowing' ? 'success' : 'secondary'} dot size="sm">{t(stream.status === 'Flowing' ? 'badges.dots.flowing' : 'badges.dots.paused')}</Badge>
                </div>
                <p className="mt-3 font-mono text-sm font-semibold text-ink">{stream.name}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{stream.region}</p>
                <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                  <span className="font-mono text-xs text-ink-muted">{t('cards.stat.throughput')}</span>
                  <span className="font-mono text-xs font-semibold text-ink">{stream.throughput}</span>
                </div>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-ink-muted">{t('cards.interactive.help')}</p>
      </Section>

      <Section title={t('cards.media.title')} hint={t('cards.media.hint')}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: t('cards.media.t1'), tag: t('cards.media.guide'), img: 'photo-1518770660439-4636190af475' },
            { title: t('cards.media.t2'), tag: t('cards.media.tutorial'), img: 'photo-1558494949-ef010cbdcc31' },
            { title: t('cards.media.t3'), tag: t('cards.media.deepDive'), img: 'photo-1551288049-bebda4e38f71' },
          ].map((card) => (
            <div key={card.title} className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)]">
              <div className="h-36 overflow-hidden bg-ground">
                <img
                  src={scene(card.img)}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <Badge severity="primary" size="sm">{card.tag}</Badge>
                <p className="mt-2 font-display text-sm font-bold leading-snug text-ink">{card.title}</p>
                <p className="mt-1 text-xs text-ink-muted">{t('cards.media.meta')}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar name="Ines Halvorsen" src={photo('photo-1438761681033-6461ffad8d80')} size={22} decorative />
                    <span className="text-xs text-ink-muted">Ines Halvorsen</span>
                  </div>
                  <a href="#" className={`pance-focus ${hitArea} inline-flex items-center gap-1 text-xs font-medium text-primary-fg hover:text-primary-fg`}>
                    {t('cards.media.read')} <IconArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('cards.stat.title')} hint={t('cards.stat.hint')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t('cards.stat.active'), value: '18,204', delta: '+12%', up: true, Icon: IconStream },
            { label: t('cards.stat.throughput'), value: '2.9 M/s', delta: '+6%', up: true, Icon: IconWave },
            { label: t('cards.stat.latency'), value: '4.2ms', delta: '-18%', up: false, Icon: IconGauge },
            { label: t('cards.stat.errors'), value: '0.04%', delta: '-5%', up: false, Icon: IconAlert },
          ].map(({ label, value, delta, up, Icon }) => (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-fg"><Icon className="h-4 w-4" /></span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-11 font-semibold ${up ? 'bg-primary-soft text-primary-fg' : 'bg-success-soft text-success-fg'}`}>
                  {up ? <IconArrowUp className="h-3 w-3" /> : <IconArrowDown className="h-3 w-3" />}{delta}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">{value}</p>
              <p className="mt-1 text-xs text-ink-muted">{label}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t('cards.horizontal.title')} hint={t('cards.horizontal.hint')}>
        <div className="space-y-3">
          {[
            { name: 'checkout-events', desc: t('cards.horizontal.d1'), status: 'Flowing', throughput: '412 K/s', avatar: 'photo-1438761681033-6461ffad8d80', owner: 'Ines Halvorsen' },
            { name: 'auth-signals', desc: t('cards.horizontal.d2'), status: 'Flowing', throughput: '388 K/s', avatar: 'photo-1500648767791-00dcc994a43e', owner: 'Devon Achebe' },
            { name: 'ledger-sync', desc: t('cards.horizontal.d3'), status: 'Paused', throughput: '0 K/s', avatar: 'photo-1544005313-94ddf0286df2', owner: 'Priya Ramanathan' },
          ].map((row) => (
            <Card key={row.name} className="flex items-center gap-4 px-5 py-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-fg">
                <IconStream className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-semibold text-ink">{row.name}</p>
                  <Badge severity={row.status === 'Flowing' ? 'success' : 'secondary'} dot size="sm">{t(row.status === 'Flowing' ? 'badges.dots.flowing' : 'badges.dots.paused')}</Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-muted">{row.desc}</p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar name={row.owner} src={photo(row.avatar)} size={24} />
                <span className="text-xs text-ink-muted">{row.throughput}</span>
              </div>
              <IconButton Icon={IconDots} label={t('cards.horizontal.more')} />
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t('cards.panel.title')} hint={t('cards.panel.hint')}>
        <div className="space-y-4">
          {/* Basic panels */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Panel title={t('cards.panel.overview')} description="checkout-events · STR-4820" icon={IconStream} iconSeverity="primary"
              actions={<IconButton Icon={IconDots} label={t('cards.horizontal.more')} />}>
              <div className="space-y-2">
                {[[t('table.col.region'), 'us-east-1'], [t('table.col.throughput'), '412 K/s'], [t('overlays.drawer.retention'), t('overlays.opt.days', { n: 30 })], [t('cards.panel.partitions'), '8']].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-ink-muted">{k}</span>
                    <span className="font-medium text-ink">{v}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title={t('cards.panel.quota')} description={t('cards.panel.period')} icon={IconGauge} iconSeverity="warning"
              footer={<Button size="sm" severity="primary">{t('cards.panel.upgrade')}</Button>}>
              <div className="space-y-3">
                {[{ label: t('cards.panel.ingested'), v: 78 }, { label: t('cards.panel.storage'), v: 91 }, { label: t('cards.panel.connectors'), v: 40 }].map(({ label, v }) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-ink-muted">{label}</span>
                      <span className={`font-mono font-semibold ${v >= 90 ? 'text-danger' : v >= 75 ? 'text-warning-fg' : 'text-ink'}`}>{v}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ground">
                      <div className={`h-full rounded-full ${v >= 90 ? 'bg-danger' : v >= 75 ? 'bg-amber-400' : 'bg-brand-500'}`} style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Collapsible panels */}
          <div>
            <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('cards.panel.collapsible')}</p>
            <div className="space-y-2">
              <Panel title={t('cards.panel.advanced')} description={t('cards.panel.advancedDesc')} icon={IconGear} iconSeverity="secondary" collapsible
                actions={<Button size="sm" severity="secondary" variant="outlined" Icon={IconEdit}>{t('cards.panel.edit')}</Button>}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={t('cards.panel.compression')}><Select value="LZ4" onChange={() => {}} options={[t('overlays.opt.none'), 'LZ4', 'Snappy', 'Gzip']} /></Field>
                  <Field label={t('cards.panel.validation')}><Select value={t('cards.panel.strict')} onChange={() => {}} options={[t('cards.panel.strict'), t('cards.panel.permissive'), t('cards.panel.off')]} /></Field>
                </div>
              </Panel>
              <Panel title={t('cards.panel.danger')} description={t('cards.panel.dangerDesc')} icon={IconAlert} iconSeverity="danger" collapsible>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger-border bg-danger-soft px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-danger">{t('cards.panel.deleteThis')}</p>
                    <p className="text-xs text-danger-fg">{t('cards.panel.deleteWarn')}</p>
                  </div>
                  <Button size="sm" severity="danger">{t('cards.panel.delete')}</Button>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t('cards.states.title')} hint={t('cards.states.hint')}>
        <div className="grid gap-4 sm:grid-cols-5">
          {[
            { label: t('cards.anatomy.default'), cls: 'border-line bg-surface', content: t('cards.states.base') },
            { label: t('cards.states.hover'), cls: 'border-primary-border bg-surface -translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(8,145,178,0.3)]', content: t('cards.states.hovered') },
            { label: t('cards.states.selected'), cls: 'border-primary-border-strong bg-primary-soft shadow-[0_0_0_3px_var(--color-primary-soft-hover)]', content: t('cards.states.active') },
            { label: t('cards.states.disabled'), cls: 'border-line bg-ground opacity-50 cursor-not-allowed', content: t('cards.states.disabled') },
            { label: t('cards.states.loading'), cls: 'border-line bg-surface', content: null },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 transition-all ${s.cls}`}>
              <p className="font-mono text-10 uppercase tracking-wider text-ink-muted">{s.label}</p>
              {s.content ? (
                <p className="mt-2 text-sm text-ink-soft">{s.content}</p>
              ) : (
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

    </Page>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CONTENT PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export function ContentPage() {
  const { t } = useI18n()
  return (
    <Page eyebrow={t('nav.group.components')} title={t('nav.content')} lead={t('content.lead')}>

      <Section title="Accordion" hint={t('content.accordion.hint')}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.accordion.single')}</p>
            <Accordion items={[
              { id: 'a1', title: t('content.acc.a1.t'), content: t('content.acc.a1.c') },
              { id: 'a2', title: t('content.acc.a2.t'), description: t('content.acc.a2.d'), content: t('content.acc.a2.c') },
              { id: 'a3', title: t('content.acc.a3.t'), content: t('content.acc.a3.c') },
              { id: 'a4', title: t('content.acc.a4.t'), content: t('content.acc.a4.c') },
            ]} />
          </div>
          <div>
            <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.accordion.multi')}</p>
            <Accordion allowMultiple items={[
              { id: 'b1', title: t('content.acc.b1.t'), content: t('content.acc.b1.c') },
              { id: 'b2', title: t('content.acc.b2.t'), content: t('content.acc.b2.c') },
              { id: 'b3', title: t('content.acc.b3.t'), content: t('content.acc.b3.c') },
            ]} />
          </div>
        </div>
      </Section>

      <Section title="Image" hint={t('content.image.hint')}>
        <div className="grid gap-4 sm:grid-cols-3 sm:items-start">
          {[
            { ratio: 'aspect-video', label: '16:9', img: 'photo-1518770660439-4636190af475' },
            { ratio: 'aspect-square', label: '1:1', img: 'photo-1558494949-ef010cbdcc31' },
            { ratio: 'aspect-[4/3]', label: '4:3', img: 'photo-1551288049-bebda4e38f71' },
          ].map((im) => (
            <figure key={im.label} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className={`${im.ratio} overflow-hidden bg-ground`}>
                <img src={scene(im.img)} alt="" className="h-full w-full object-cover" />
              </div>
              <figcaption className="px-4 py-3">
                <p className="text-xs font-medium text-ink">{t('content.image.caption')}</p>
                <p className="mt-0.5 font-mono text-10 text-ink-muted">{im.label} · object-cover</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.image.placeholder')}</p>
            <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-ground flex items-center justify-center gap-2 text-ink-muted">
              <IconDownload className="h-5 w-5" />
              <span className="text-sm">{t('content.image.unavailable')}</span>
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.image.rounded')}</p>
            <div className="flex items-center gap-4">
              {[48, 64, 80, 96].map((sz) => (
                <div key={sz} className="overflow-hidden rounded-full border-2 border-line" style={{ width: sz, height: sz }}>
                  <img src={photo('photo-1438761681033-6461ffad8d80')} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Divider" hint={t('content.divider.hint')}>
        <Card className="divide-y divide-line-soft">
          <div className="px-6 py-5 space-y-6">
            <div>
              <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.divider.default')}</p>
              <p className="text-sm text-ink-soft">{t('content.divider.above')}</p>
              <Divider />
              <p className="text-sm text-ink-soft">{t('content.divider.below')}</p>
            </div>
            <div>
              <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.divider.soft')}</p>
              <p className="text-sm text-ink-soft">{t('content.divider.above')}</p>
              <Divider soft />
              <p className="text-sm text-ink-soft">{t('content.divider.below')}</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.divider.withLabel')}</p>
            <Divider label={t('content.divider.or')} />
            <Divider label={t('content.divider.secB')} />
          </div>
          <div className="px-6 py-5">
            <p className="mb-3 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.divider.vertical')}</p>
            <div className="flex items-center gap-4 text-sm text-ink-soft">
              <span>Streams</span>
              <div className="h-4 w-px bg-line" />
              <span>{t('content.divider.schemas')}</span>
              <div className="h-4 w-px bg-line" />
              <span>{t('content.divider.connectors')}</span>
            </div>
          </div>
        </Card>
      </Section>

      <Section title={t('content.it.title')} hint={t('content.it.hint')}>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Metadata row list */}
          <Card className="p-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.it.meta')}</p>
            <div className="space-y-3">
              {[
                { Icon: IconStream, label: t('content.it.streamName'), value: 'checkout-events' },
                { Icon: IconGlobe, label: t('content.it.region'), value: 'us-east-1 · N. Virginia' },
                { Icon: IconDatabase, label: t('content.it.retention'), value: t('content.it.days30') },
                { Icon: IconUsers, label: t('content.it.owner'), value: 'Ines Halvorsen' },
                { Icon: IconCheckCircle, label: t('content.it.status'), value: t('content.it.flowing') },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ground text-ink-muted"><Icon className="h-3.5 w-3.5" /></span>
                  <span className="w-24 shrink-0 text-xs text-ink-muted">{label}</span>
                  <span className="text-sm font-medium text-ink">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Feature list */}
          <Card className="p-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.it.features')}</p>
            <div className="space-y-3">
              {[
                { Icon: IconCheckCircle, text: t('content.it.f1'), color: 'text-success-fg bg-success-soft' },
                { Icon: IconCheckCircle, text: t('content.it.f2'), color: 'text-success-fg bg-success-soft' },
                { Icon: IconCheckCircle, text: t('content.it.f3'), color: 'text-success-fg bg-success-soft' },
                { Icon: IconCheckCircle, text: t('content.it.f4'), color: 'text-success-fg bg-success-soft' },
                { Icon: IconCheckCircle, text: t('content.it.f5'), color: 'text-success-fg bg-success-soft' },
              ].map(({ Icon, text, color }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${color}`}><Icon className="h-3 w-3" /></span>
                  <span className="text-sm text-ink-soft">{text}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Attribute grid */}
          <Card className="p-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.it.attrs')}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { Icon: IconGauge, label: t('content.it.throughput'), value: '412 K/s' },
                { Icon: IconPulse, label: t('content.it.latency'), value: '4.2ms' },
                { Icon: IconDatabase, label: t('content.it.partitions'), value: '8 shards' },
                { Icon: IconShield, label: t('content.it.encryption'), value: 'AES-256' },
                { Icon: IconGlobe, label: t('content.it.regions'), value: t('content.it.active3') },
                { Icon: IconStar, label: 'SLA', value: '99.95%' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-fg"><Icon className="h-3.5 w-3.5" /></span>
                  <div>
                    <p className="font-mono text-10 text-ink-muted">{label}</p>
                    <p className="text-sm font-semibold text-ink">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Inline icon+text pairs */}
          <Card className="p-5">
            <p className="mb-4 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.it.pairs')}</p>
            <div className="space-y-4">
              {(['sm', 'md', 'lg'] as const).map((sz) => {
                const cfg = { sm: { icon: 'h-3 w-3', text: 'text-xs', gap: 'gap-1.5' }, md: { icon: 'h-4 w-4', text: 'text-sm', gap: 'gap-2' }, lg: { icon: 'h-5 w-5', text: 'text-base', gap: 'gap-2.5' } }[sz]
                return (
                  <div key={sz} className="flex flex-wrap items-center gap-4">
                    <span className="w-6 font-mono text-10 text-ink-muted">{sz}</span>
                    <span className={`inline-flex items-center text-ink-soft ${cfg.gap}`}><IconStream className={cfg.icon} /><span className={cfg.text}>checkout-events</span></span>
                    <span className={`inline-flex items-center text-ink-muted ${cfg.gap}`}><IconGlobe className={cfg.icon} /><span className={cfg.text}>us-east-1</span></span>
                    <span className={`inline-flex items-center text-success-fg ${cfg.gap}`}><IconCheckCircle className={cfg.icon} /><span className={cfg.text}>{t('content.it.flowing')}</span></span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </Section>

      <Section title={t('content.dl.title')} hint={t('content.dl.hint')}>
        <div className="space-y-4">
          {/* Download cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { name: 'stream-schema-v2.avro', type: 'AVRO', size: '12 KB', severity: 'primary' as const, desc: t('content.dl.d1') },
              { name: 'events-export-jan.csv', type: 'CSV', size: '4.2 MB', severity: 'success' as const, desc: t('content.dl.d2') },
              { name: 'connector-config.json', type: 'JSON', size: '3 KB', severity: 'info' as const, desc: t('content.dl.d3') },
            ].map((file) => (
              <div key={file.name} className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 transition-all hover:border-primary-border hover:shadow-[0_4px_16px_-8px_rgba(8,145,178,0.2)]">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ground text-ink-muted">
                    <IconDownload className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{file.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge severity={file.severity} size="sm" rounded={false}>{file.type}</Badge>
                    <span className="font-mono text-11 text-ink-muted">{file.size}</span>
                  </div>
                  <Button size="sm" severity="secondary" variant="outlined" Icon={IconDownload}>{t('content.dl.button')}</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Inline download row */}
          <div>
            <p className="mb-2 font-mono text-10 uppercase tracking-wider text-ink-muted">{t('content.dl.inline')}</p>
            <Card className="divide-y divide-line-soft overflow-hidden">
              {[
                { name: t('content.dl.r1'), type: 'PDF', size: '840 KB' },
                { name: t('content.dl.r2'), type: 'CSV', size: '1.1 MB' },
                { name: t('content.dl.r3'), type: 'JSON', size: '22 KB' },
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-4 px-5 py-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ground text-ink-muted">
                    <IconDownload className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{file.name}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-10 text-ink-muted">{file.type}</span>
                      <span className="h-1 w-1 rounded-full bg-line" />
                      <span className="font-mono text-10 text-ink-muted">{file.size}</span>
                    </div>
                  </div>
                  <button aria-label={`${t('content.dl.title')} ${file.name}`} className="pance-focus grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-primary-soft hover:text-primary-fg">
                    <IconDownload aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </Section>

      <Section title={t('content.art.title')} hint={t('content.art.hint')}>
        <Card className="overflow-hidden lg:flex">
          <div className="h-52 lg:h-auto lg:w-72 shrink-0 overflow-hidden bg-ground">
            <img src={scene('photo-1518770660439-4636190af475')} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-between p-6">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge severity="primary" size="sm">{t('content.art.deep')}</Badge>
                <Badge severity="secondary" size="sm" rounded={false}>{t('content.art.partitioning')}</Badge>
                <Badge severity="secondary" size="sm" rounded={false}>{t('content.art.performance')}</Badge>
              </div>
              <h3 className="font-display text-xl font-bold leading-snug text-ink">{t('content.art.h')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('content.art.p')}</p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4">
              <div className="flex items-center gap-2">
                <Avatar name="Devon Achebe" src={photo('photo-1500648767791-00dcc994a43e')} size={28} />
                <div>
                  <p className="text-xs font-semibold text-ink">Devon Achebe</p>
                  <p className="font-mono text-10 text-ink-muted">{t('content.art.read')}</p>
                </div>
              </div>
              <Button size="sm" severity="primary" Icon={IconArrowRight}>{t('content.art.cta')}</Button>
            </div>
          </div>
        </Card>
      </Section>

    </Page>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   DATA VISUALIZATION — tokens · charts · page
   Palette validated: node validate_palette.js "#0891b2,#eb6834,#1baf7a,
   #eda100,#e87ba4,#008300,#4a3aa7,#e34948" --mode light
   All PASS. WARN on slots 3/4/5 contrast (<3:1) → direct labels required.
   Sequential hue: brand teal (#0891b2 ramp). Diverging: teal ↔ red.
   ═══════════════════════════════════════════════════════════════════════ */

/* — Categorical palette (8 slots, fixed order) — */
const VC = ['#0891b2','#eb6834','#1baf7a','#eda100','#e87ba4','#008300','#4a3aa7','#e34948'] as const

/* — Chart chrome (Pance surface tokens as literals) — */
const VS  = '#ffffff'   /* chart surface    */
const VG  = '#e2e8f0'   /* hairline grid    */
const VA  = '#64748b'   /* axis labels — dataviz.axis-label, 4.76:1 */
const VI  = '#0f172a'   /* primary ink      */
const VI2 = '#64748b'   /* secondary ink    */
const VB  = '#cbd5e1'   /* baseline / axis  */

/* — Fixed margins (t/r/b/l) for all cartesian charts — */
const VM = { t: 18, r: 20, b: 44, l: 56 }

/* Axis font-size hook — 12px rendered at ~900px container, floored at 10px.
   Ref goes on the existing outer card div; no new wrapper elements needed. */
function useAxisFontSize(W: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cw, setCw] = React.useState<number | null>(null)
  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    setCw(el.offsetWidth)
    const obs = new ResizeObserver(([e]) => setCw(e.contentRect.width))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const w = cw ?? W
  // max(minPx*W/w, targetPx*W/targetW) → max(6000/w, 8) for W=600, target=12px@900px
  const afs = Math.max(10 * W / w, 12 * W / 900)
  return { containerRef, afs }
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function niceTicks(dMin: number, dMax: number, n = 4): number[] {
  if (dMax <= dMin) return [dMin]
  const rawStep = (dMax - dMin) / n
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const norm = rawStep / mag
  const step = norm <= 1.5 ? mag : norm <= 3 ? 2 * mag : norm <= 7 ? 5 * mag : 10 * mag
  const start = Math.floor(dMin / step) * step
  const end   = Math.ceil(dMax / step) * step
  const out: number[] = []
  for (let v = start; v <= end + step * 0.01; v += step)
    out.push(parseFloat(v.toPrecision(10)))
  return out
}

function fv(n: number): string {
  const a = Math.abs(n)
  if (a >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (a >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toLocaleString()
}

/* ─── Charts: the docs site renders the library's accessible charts ───────────
   Series colours now come from `color.dataviz.series.*` tokens, so the per-series `color` that older
   specimens passed is ignored. */
type LSeries = { name: string; color?: string; data: number[] }
type BarDatum = { label: string; value: number; color?: string }
type GroupedSeries = { name: string; color?: string; data: number[] }
type StackSeries = { name: string; color?: string; data: number[] }
type DivDatum = { label: string; value: number }
type DonutSlice = { label: string; value: number; color?: string }

function VizLineChart({ series, labels, title, sub, H }: { series: LSeries[]; labels: string[]; title: string; sub?: string; W?: number; H?: number }) {
  return <LibLineChart title={title} subtitle={sub} labels={labels} series={series.map(({ name, data }) => ({ name, data }))} height={H} />
}
function VizBarChart({ data, title, sub }: { data: BarDatum[]; title: string; sub?: string; W?: number; H?: number; color?: string }) {
  return <LibBarChart title={title} subtitle={sub} labels={data.map((d) => d.label)} series={[{ name: title, data: data.map((d) => d.value) }]} />
}
function VizGroupedBar({ series, labels, title, sub }: { series: GroupedSeries[]; labels: string[]; title: string; sub?: string; W?: number; H?: number }) {
  return <LibBarChart title={title} subtitle={sub} labels={labels} series={series.map(({ name, data }) => ({ name, data }))} mode="grouped" />
}
function VizHBarChart({ data, title, sub }: { data: BarDatum[]; title: string; sub?: string; color?: string }) {
  return <RankedBarChart title={title} subtitle={sub} data={data} />
}
function VizStackedBar({ series, labels, title, sub }: { series: StackSeries[]; labels: string[]; title: string; sub?: string; W?: number; H?: number }) {
  return <LibBarChart title={title} subtitle={sub} labels={labels} series={series.map(({ name, data }) => ({ name, data }))} mode="stacked" />
}
function VizDivergingBar({ data, title, sub }: { data: DivDatum[]; title: string; sub?: string; posColor?: string; negColor?: string }) {
  return <DivergingBarChart title={title} subtitle={sub} data={data} />
}
function VizHeatmap({ data, rows, cols, title, sub }: { data: number[][]; rows: string[]; cols: string[]; title: string; sub?: string; color?: string }) {
  return <Heatmap title={title} subtitle={sub} rows={rows} cols={cols} data={data} />
}
function VizDonut({ slices, title, sub, size }: { slices: DonutSlice[]; title: string; sub?: string; size?: number }) {
  return <DonutChart title={title} subtitle={sub} slices={slices} size={size} />
}

/* ─── VizSparkline (inline trend) ─────────────────────────────────────── */
function VizSparkline({ data, color = VC[0] as string, width = 80, height = 28 }: {
  data: number[]; color?: string; width?: number; height?: number
}) {
  const uid = React.useId().replace(/:/g, 'x')
  const minV = Math.min(...data), maxV = Math.max(...data)
  const span = maxV - minV || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - minV) / span) * (height - 4) - 2,
  ] as [number, number])
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `M${pts[0][0]},${height} ${pts.map(([x, y]) => `L${x},${y}`).join(' ')} L${pts[pts.length-1][0]},${height} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`${uid}-spk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${uid}-spk)`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r={2.5} fill={color} />
    </svg>
  )
}

/* ─── KPI stat tile ────────────────────────────────────────────────────── */
function VizStatTile({ label, value, delta, deltaLabel, trend, trendColor = VC[0] as string, up = true }: {
  label: string; value: string; delta?: string; deltaLabel?: string;
  trend?: number[]; trendColor?: string; up?: boolean
}) {
  const deltaUp = delta && delta.startsWith('+')
  const isGood  = up ? deltaUp : !deltaUp
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-ink-muted">{label}</p>
        {trend && <VizSparkline data={trend} color={trendColor} />}
      </div>
      <div>
        <p className="text-3xl font-bold leading-none tracking-tight text-ink">{value}</p>
        {delta && (
          <p className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${isGood ? 'text-success-fg' : 'text-danger-fg'}`}>
            <span>{delta}</span>
            {deltaLabel && <span className="font-normal text-ink-muted">{deltaLabel}</span>}
          </p>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   DATA VISUALIZATION PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export function DataVizPage() {
  const { t, lang } = useI18n()
  const locale = lang === 'es' ? 'es-419' : 'en-US'
  /* ── Filter state ────────────────────────────────────────────────── */
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '12m'>('12m')

  /* ── Line chart data: monthly throughput (K events/s) by region ── */
  const monthFmt = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
  const dayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  const MONTHS   = Array.from({ length: 12 }, (_, m) => monthFmt.format(Date.UTC(2024, m, 1)).replace('.', ''))
  const lineSeries: LSeries[] = [
    { name: 'US East',   color: VC[0], data: [180,195,210,225,240,280,310,295,320,340,365,392] },
    { name: 'EU West',   color: VC[1], data: [90,95,100,110,120,130,145,140,155,165,175,190]   },
    { name: 'AP South',  color: VC[2], data: [45,50,55,60,70,75,85,90,95,100,110,122]          },
  ]

  /* ── Bar chart: top streams by event volume ──────────────────── */
  const barData: BarDatum[] = [
    { label: 'checkout', value: 2400 },
    { label: 'auth',     value: 1850 },
    { label: 'telemetry',value: 1640 },
    { label: 'billing',  value: 1200 },
    { label: 'ledger',   value: 980  },
    { label: 'search',   value: 760  },
    { label: 'notifs',   value: 620  },
    { label: 'clicks',   value: 580  },
  ]

  /* ── Grouped bar: throughput vs error rate by quarter ────────── */
  const groupedSeries: GroupedSeries[] = [
    { name: t('dataviz.bar.throughput'), color: VC[0], data: [320, 360, 390, 412] },
    { name: t('dataviz.bar.latency'), color: VC[1], data: [48, 52, 44, 39]     },
  ]
  const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

  /* ── Horizontal bar: streams by throughput ───────────────────── */
  const hbarData: BarDatum[] = [
    { label: 'checkout-events',  value: 412 },
    { label: 'auth-signals',     value: 388 },
    { label: 'telemetry-fleet',  value: 320 },
    { label: 'billing-webhooks', value: 245 },
    { label: 'ledger-sync',      value: 190 },
    { label: 'search-index',     value: 160 },
    { label: 'notif-fanout',     value: 118 },
    { label: 'clickstream',      value: 94  },
  ]

  /* ── Stacked bar: event type composition per month ───────────── */
  const stackSeries: StackSeries[] = [
    { name: t('dataviz.stack.data'),    color: VC[0], data: [1200,1350,1500,1650,1800,2100] },
    { name: t('dataviz.stack.control'), color: VC[1], data: [240,270,300,330,360,420]       },
    { name: t('dataviz.stack.schema'), color: VC[2], data: [80,90,100,110,120,140]         },
    { name: t('dataviz.stack.errors'), color: VC[3], data: [40,45,50,55,60,70]             },
  ]
  const HALFYEAR = MONTHS.slice(0, 6)

  /* ── Diverging bar: YoY growth by stream ────────────────────── */
  const divData: DivDatum[] = [
    { label: 'checkout-events',  value: +24 },
    { label: 'auth-signals',     value: +18 },
    { label: 'telemetry-fleet',  value: +31 },
    { label: 'billing-webhooks', value: -6  },
    { label: 'ledger-sync',      value: -12 },
    { label: 'search-index',     value: +9  },
    { label: 'notif-fanout',     value: +42 },
    { label: 'clickstream',      value: -3  },
  ]

  /* ── Heatmap: hourly event density (day × hour) ──────────────── */
  const DAYS  = Array.from({ length: 7 }, (_, d) => dayFmt.format(Date.UTC(2024, 0, 1 + d)).replace('.', ''))
  const HOURS = ['8','9','10','11','12','13','14','15','16','17','18','19','20','21']
  const heatData = DAYS.map((_, di) =>
    HOURS.map((_, hi) => {
      const base = di < 5 ? 800 : 250
      const peak = di < 5 && hi >= 2 && hi <= 9 ? 600 : 0
      return Math.round(base + peak * Math.sin((hi - 1) * 0.4) + Math.random() * 200)
    })
  )

  /* ── Donut: stream type distribution ─────────────────────────── */
  const donutSlices: DonutSlice[] = [
    { label: 'Kafka-native', value: 4200, color: VC[0] },
    { label: 'REST',         value: 2100, color: VC[1] },
    { label: 'gRPC',         value: 1800, color: VC[2] },
    { label: 'WebSocket',    value: 950,  color: VC[3] },
    { label: 'CDC',          value: 640,  color: VC[4] },
  ]

  /* ── Scatter: latency (ms) vs throughput (K/s) ───────────────── */
  const scatterData = [
    { x: 412, y: 36, label: 'checkout-events',  r: 8 },
    { x: 388, y: 41, label: 'auth-signals',      r: 7 },
    { x: 320, y: 29, label: 'telemetry-fleet',   r: 6 },
    { x: 245, y: 52, label: 'billing-webhooks',  r: 5 },
    { x: 190, y: 44, label: 'ledger-sync',       r: 5 },
    { x: 160, y: 33, label: 'search-index',      r: 4 },
    { x: 118, y: 28, label: 'notif-fanout',      r: 4 },
    { x: 94,  y: 61, label: 'clickstream',       r: 4 },
    { x: 72,  y: 22, label: 'audit-trail',       r: 3 },
    { x: 58,  y: 78, label: 'media-upload',      r: 3 },
    { x: 42,  y: 19, label: 'config-sync',       r: 3 },
    { x: 31,  y: 15, label: 'health-check',      r: 2 },
  ]

  /* ── Trend data for sparklines ───────────────────────────────── */
  const kpiTrend1 = [180,190,210,220,245,280,310,295,322,345,370,392]
  const kpiTrend2 = [2.1,2.3,2.0,1.9,1.8,1.7,1.6,1.8,1.5,1.4,1.3,1.2]
  const kpiTrend3 = [92,91,93,94,95,96,95,97,96,98,98,99]
  const kpiTrend4 = [42,45,48,46,52,55,58,60,62,65,68,72]

  return (
    <Page eyebrow={t('nav.group.patterns')} title={t('nav.dataviz')} lead={t('dataviz.lead')}>

      {/* ── Filter row (one row above everything it scopes) ─────── */}
      <Section title={t('dataviz.filter.title')} hint={t('dataviz.filter.hint')}>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-5 py-3.5">
          <span className="text-xs font-medium text-ink-muted">{t('dataviz.filter.timeRange')}</span>
          <div className="flex rounded-lg border border-line overflow-hidden">
            {(['7d','30d','90d','12m'] as const).map(r => (
              <button key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${range === r ? 'bg-brand-700 text-white' : 'text-ink-soft hover:bg-ground'}`}
              >{t(`dataviz.range.${r}`)}</button>
            ))}
          </div>
          <span className="ml-2 h-4 w-px bg-line" />
          <span className="text-xs text-ink-muted">{t('dataviz.filter.region')}</span>
          <div className="flex flex-wrap gap-1">
            {['All','US East','EU West','AP South'].map(r => (
              <span key={r} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft hover:border-primary-border hover:text-primary-fg cursor-pointer transition-colors">{r === 'All' ? t('dataviz.regionAll') : r}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Stat tiles / KPI row ──────────────────────────────────── */}
      <Section title={t('dataviz.stat.title')} hint={t('dataviz.stat.hint')}>
        {/* Hero figure */}
        <div className="mb-4 rounded-2xl border border-line bg-gradient-surface-soft p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-500">{t('dataviz.stat.heroLabel')}</p>
          <p className="mt-2 text-4xl font-bold leading-none tracking-tight text-ink sm:text-6xl">704<span className="text-2xl font-semibold text-ink-muted sm:text-3xl"> K/s</span></p>
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-success-fg">
            <span>+23.4%</span>
            <span className="font-normal text-ink-muted">{t('dataviz.stat.vsLastYear')}</span>
          </p>
        </div>
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <VizStatTile label={t('dataviz.stat.peak')} value="392 K/s" delta="+8.6%" deltaLabel={t('dataviz.stat.vsPrevMonth')}
            trend={kpiTrend1} trendColor={VC[0]} up />
          <VizStatTile label={t('dataviz.stat.p99')} value="38 ms" delta="-7.3%" deltaLabel={t('dataviz.stat.vsPrevMonth')}
            trend={kpiTrend2} trendColor={VC[1]} up={false} />
          <VizStatTile label={t('dataviz.stat.sla')} value="99.1%" delta="+0.4pp" deltaLabel={t('dataviz.stat.vsPrevMonth')}
            trend={kpiTrend3} trendColor={VC[2]} up />
          <VizStatTile label={t('dataviz.stat.activeStreams')} value="72" delta="+10" deltaLabel={t('dataviz.stat.vsPrevMonth')}
            trend={kpiTrend4} trendColor={VC[3]} up />
        </div>
      </Section>

      {/* ── Line chart (trend) ────────────────────────────────────── */}
      <Section title={t('dataviz.line.title')} hint={t('dataviz.line.hint')}>
        <VizLineChart series={lineSeries} labels={MONTHS} title={t('dataviz.line.chartTitle')} sub={t('dataviz.line.chartSub')} />
      </Section>

      {/* ── Bar charts ────────────────────────────────────────────── */}
      <Section title={t('dataviz.bar.title')} hint={t('dataviz.bar.hint')}>
        <div className="grid gap-4 lg:grid-cols-2">
          <VizBarChart data={barData} title={t('dataviz.bar.topTitle')} sub={t('dataviz.bar.topSub')} />
          <VizGroupedBar series={groupedSeries} labels={QUARTERS} title={t('dataviz.bar.groupTitle')} sub={t('dataviz.bar.groupSub')} />
        </div>
      </Section>

      {/* ── Horizontal bar (ranked) ───────────────────────────────── */}
      <Section title={t('dataviz.hbar.title')} hint={t('dataviz.hbar.hint')}>
        <div className="grid gap-4 lg:grid-cols-2">
          <VizHBarChart data={hbarData} title={t('dataviz.hbar.rankThroughput')} sub={t('dataviz.hbar.rankThroughputSub')} />
          <VizHBarChart data={hbarData.map(d => ({ ...d, value: Math.round(d.value * 0.09) })).sort((a,b)=>b.value-a.value)}
            title={t('dataviz.hbar.rankLatency')} sub={t('dataviz.hbar.rankLatencySub')} color={VC[1]} />
        </div>
      </Section>

      {/* ── Stacked bar ───────────────────────────────────────────── */}
      <Section title={t('dataviz.stack.title')} hint={t('dataviz.stack.hint')}>
        <VizStackedBar series={stackSeries} labels={HALFYEAR} title={t('dataviz.stack.chartTitle')} sub={t('dataviz.stack.chartSub')} />
      </Section>

      {/* ── Diverging bar ─────────────────────────────────────────── */}
      <Section title={t('dataviz.div.title')} hint={t('dataviz.div.hint')}>
        <VizDivergingBar data={divData} title={t('dataviz.div.chartTitle')} sub={t('dataviz.div.chartSub')} />
      </Section>

      {/* ── Heatmap ───────────────────────────────────────────────── */}
      <Section title={t('dataviz.heat.title')} hint={t('dataviz.heat.hint')}>
        <VizHeatmap data={heatData} rows={DAYS} cols={HOURS} title={t('dataviz.heat.chartTitle')} sub={t('dataviz.heat.chartSub')} />
      </Section>

      {/* ── Donut chart ───────────────────────────────────────────── */}
      <Section title={t('dataviz.donut.title')} hint={t('dataviz.donut.hint')}>
        <div className="grid gap-4 lg:grid-cols-2">
          <VizDonut slices={donutSlices} title={t('dataviz.donut.chartTitle')} sub={t('dataviz.donut.chartSub')} />
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="mb-4 text-sm font-semibold text-ink">{t('dataviz.donut.guideTitle')}</p>
            <div className="space-y-3 text-sm text-ink-soft">
              <div className="flex gap-3 rounded-xl bg-success-soft p-3">
                <span className="font-mono text-success-fg">✓</span>
                <span>{t('dataviz.donut.g1a')}<strong className="text-ink">{t('dataviz.donut.g1b')}</strong>{t('dataviz.donut.g1c')}<strong className="text-ink">{t('dataviz.donut.g1d')}</strong>{t('dataviz.donut.g1e')}</span>
              </div>
              <div className="flex gap-3 rounded-xl bg-danger-soft p-3">
                <span className="font-mono text-danger-fg">✗</span>
                <span>{t('dataviz.donut.g2a')}<strong className="text-ink">{t('dataviz.donut.g2b')}</strong>{t('dataviz.donut.g2c')}</span>
              </div>
              <div className="flex gap-3 rounded-xl bg-danger-soft p-3">
                <span className="font-mono text-danger-fg">✗</span>
                <span>{t('dataviz.donut.g3a')}<strong className="text-ink">{t('dataviz.donut.g3b')}</strong>{t('dataviz.donut.g3c')}</span>
              </div>
              <div className="flex gap-3 rounded-xl bg-danger-soft p-3">
                <span className="font-mono text-danger-fg">✗</span>
                <span>{t('dataviz.donut.g4a')}<strong className="text-ink">{t('dataviz.donut.g4b')}</strong>{t('dataviz.donut.g4c')}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Scatter plot ──────────────────────────────────────────── */}
      <Section title={t('dataviz.scatter.title')} hint={t('dataviz.scatter.hint')}>
        <ScatterChart points={scatterData} title={t('dataviz.scatter.chartTitle')} subtitle={t('dataviz.scatter.chartSub')}
          xLabel={t('dataviz.scatter.x')} yLabel={t('dataviz.scatter.y')} />
      </Section>

      {/* ── Meters / progress ─────────────────────────────────────── */}
      <Section title={t('dataviz.meter.title')} hint={t('dataviz.meter.hint')}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Meter label={t('dataviz.meter.cpu')} value={62}  max={100} unit="%" />
          <Meter label={t('dataviz.meter.registry')} value={78}  max={100} unit="%" severity="warning" />
          <Meter label={t('dataviz.meter.rebalance')} value={91}  max={100} unit="%" severity="danger" />
          <Meter label={t('dataviz.meter.daily')} value={4200} max={10000} unit=" K" />
          <Meter label={t('dataviz.meter.connections')} value={344}  max={500}   unit="" />
          <Meter label={t('dataviz.meter.storage')} value={2.1}  max={3}     unit=" TB" severity="warning" />
        </div>
      </Section>

      {/* ── Sparklines ────────────────────────────────────────────── */}
      <Section title={t('dataviz.spark.title')} hint={t('dataviz.spark.hint')}>
        <div tabIndex={0} className="pance-focus overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-line">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-ink-muted">{t('dataviz.spark.stream')}</th>
                <th className="px-4 py-3 font-medium text-ink-muted">{t('dataviz.spark.region')}</th>
                <th className="px-4 py-3 text-right font-medium text-ink-muted tabular-nums">{t('dataviz.spark.throughput')}</th>
                <th className="px-4 py-3 font-medium text-ink-muted">{t('dataviz.spark.trend')}</th>
                <th className="px-4 py-3 text-right font-medium text-ink-muted tabular-nums">{t('dataviz.spark.p99')}</th>
                <th className="px-4 py-3 font-medium text-ink-muted">{t('dataviz.spark.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                { name: 'checkout-events', region: 'US East', val: 412, trend: [340,355,380,390,395,400,392,405,410,408,415,412], lat: 36, ok: true  },
                { name: 'auth-signals',    region: 'US East', val: 388, trend: [320,330,345,360,370,375,380,382,385,388,390,388], lat: 41, ok: true  },
                { name: 'telemetry-fleet', region: 'EU West', val: 320, trend: [280,285,295,300,305,310,315,318,322,320,325,320], lat: 29, ok: true  },
                { name: 'billing-webhooks',region: 'EU West', val: 245, trend: [260,258,252,248,245,248,242,246,243,245,247,245], lat: 52, ok: false },
                { name: 'ledger-sync',     region: 'AP South',val: 190, trend: [200,198,195,192,190,188,191,190,192,190,189,190], lat: 44, ok: false },
                { name: 'search-index',    region: 'AP South',val: 160, trend: [140,145,148,152,155,158,160,162,160,158,161,160], lat: 33, ok: true  },
              ].map((row, i) => (
                <tr key={row.name} className="hover:bg-ground">
                  <td className="px-4 py-3 font-mono text-xs text-ink">{row.name}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{row.region}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-ink">{row.val}</td>
                  <td className="px-4 py-3"><VizSparkline data={row.trend} color={VC[i % 3]} width={72} height={24} /></td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-ink">{row.lat}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-11 font-medium ${row.ok ? 'bg-success-soft text-success-fg' : 'bg-warning-soft text-warning-fg'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${row.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {row.ok ? t('dataviz.spark.healthy') : t('dataviz.spark.degraded')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Color palette reference ───────────────────────────────── */}
      <Section title={t('dataviz.palette.title')} hint={t('dataviz.palette.hint')}>
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {VC.map((c, i) => (
              <div key={c} className="rounded-xl border border-line bg-surface p-3 text-center">
                <div className="mx-auto mb-2 h-8 w-full rounded-lg" style={{ backgroundColor: c }} />
                <p className="text-10 font-medium text-ink">{t('dataviz.palette.slot', { n: i + 1 })}</p>
                <p className="font-mono text-9 text-ink-muted">{c}</p>
              </div>
            ))}
          </div>
          {/* Sequential ramp */}
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="mb-3 text-sm font-semibold text-ink">{t('dataviz.palette.seqTitle')}</p>
            <div className="flex h-8 gap-0.5 overflow-hidden rounded-lg">
              {['#cde2fb','#b7d3f6','#9ec5f4','#86b6ef','#6da7ec','#5598e7','#3987e5','#2a78d6','#256abf','#1c5cab','#184f95','#104281','#0d366b'].map((c, i) => (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-muted">{t('dataviz.palette.seqNote')}</p>
          </div>
          {/* Diverging pair */}
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="mb-3 text-sm font-semibold text-ink">{t('dataviz.palette.divTitle')}</p>
            <div className="flex h-8 gap-0.5 overflow-hidden rounded-lg">
              {['#0891b2','#0e9aba','#14a4c3','#1aaecb','#7dc8d3','#e2e8f0','#f4a4a4','#f08080','#e95e5e','#e34948','#d03333'].map((c, i) => (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-muted">{t('dataviz.palette.divNote')}</p>
          </div>
          {/* Status palette */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { role: t('dataviz.palette.good'),     c: '#0ca30c', bg: '#f0fdf0', text: 'text-success-fg' },
              { role: t('dataviz.palette.warning'),  c: '#fab219', bg: '#fefce8', text: 'text-warning-fg'   },
              { role: t('dataviz.palette.serious'),  c: '#ec835a', bg: '#fff7ed', text: 'text-orange-700'  },
              { role: t('dataviz.palette.critical'), c: '#d03b3b', bg: '#fef2f2', text: 'text-danger-fg'    },
            ].map(({ role, c, bg, text }) => (
              <div key={role} className="rounded-xl border border-line bg-surface p-3">
                <div className="mb-2 h-6 w-full rounded-lg" style={{ backgroundColor: bg }}>
                  <div className="flex h-full items-center gap-2 px-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                    <span className={`text-xs font-medium ${text}`}>{role}</span>
                  </div>
                </div>
                <p className="font-mono text-9 text-ink-muted">{c}</p>
                <p className="mt-0.5 text-9 text-ink-muted">{t('dataviz.palette.statusNote')}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Chart form guide ──────────────────────────────────────── */}
      <Section title={t('dataviz.form.title')} hint={t('dataviz.form.hint')}>
        <div tabIndex={0} className="pance-focus overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-ink">{t('dataviz.form.job')}</th>
                <th className="px-4 py-3 font-semibold text-ink">{t('dataviz.form.form')}</th>
                <th className="px-4 py-3 font-semibold text-ink">{t('dataviz.form.color')}</th>
                <th className="px-4 py-3 font-semibold text-ink">{t('dataviz.form.anti')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {Array.from({ length: 10 }, (_, i) => i).map(i => (
                <tr key={i} className="hover:bg-ground">
                  <td className="px-4 py-3 text-ink-soft">{t(`dataviz.form.${i}.job` as Key)}</td>
                  <td className="px-4 py-3 font-medium text-ink">{t(`dataviz.form.${i}.form` as Key)}</td>
                  <td className="px-4 py-3 text-ink-muted">{t(`dataviz.form.${i}.color` as Key)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-danger-fg">{t(`dataviz.form.${i}.anti` as Key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Anti-patterns ─────────────────────────────────────────── */}
      <Section title={t('dataviz.anti.title')} hint={t('dataviz.anti.hint')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 12 }, (_, i) => i).map(i => (
            <div key={i} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-rose-500">✗</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t(`dataviz.anti.${i}.bad` as Key)}</p>
                  <p className="mt-1 text-xs text-ink-muted">{t(`dataviz.anti.${i}.fix` as Key)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Composed dashboard specimen ───────────────────────────── */}
      <Section title={t('dataviz.spec.title')} hint={t('dataviz.spec.hint')}>
        <div className="rounded-2xl border border-2 border-dashed border-primary-border bg-primary-soft/30 p-1">
          <div className="rounded-xl bg-surface p-5">
            {/* Specimen filter bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ink-muted">{t('dataviz.spec.scope')}</span>
                <span className="rounded-full bg-primary-soft-hover px-2 py-0.5 text-xs font-medium text-primary-fg">{t('dataviz.spec.last30')}</span>
                <span className="rounded-full bg-ground px-2 py-0.5 text-xs text-ink-muted">{t('dataviz.spec.allRegions')}</span>
              </div>
              <span className="text-10 text-ink-muted">{t('dataviz.spec.updated')}</span>
            </div>
            {/* KPI row */}
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <VizStatTile label={t('dataviz.spec.totalEvents')} value="9.8M" delta="+18%" deltaLabel={t('dataviz.spec.mom')} trend={kpiTrend1} trendColor={VC[0]} up />
              <VizStatTile label={t('dataviz.spec.avgLatency')}  value="41 ms" delta="-9%" deltaLabel={t('dataviz.spec.mom')} trend={kpiTrend2} trendColor={VC[1]} up={false} />
              <VizStatTile label={t('dataviz.spec.errorRate')}   value="0.12%" delta="-0.04pp" deltaLabel={t('dataviz.spec.mom')} trend={kpiTrend3.map(v => 100 - v)} trendColor={VC[7]} up={false} />
              <VizStatTile label={t('dataviz.spec.streams')}      value="72" delta="+10" deltaLabel={t('dataviz.spec.mom')} trend={kpiTrend4} trendColor={VC[2]} up />
            </div>
            {/* Main chart row */}
            <div className="mb-4 grid gap-3 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VizLineChart series={lineSeries} labels={MONTHS} title={t('dataviz.spec.trendTitle')} sub={t('dataviz.spec.trendSub')} />
              </div>
              <VizDonut slices={donutSlices} title={t('dataviz.spec.typesTitle')} sub={t('dataviz.spec.typesSub')} size={160} />
            </div>
            {/* Secondary row */}
            <div className="grid gap-3 lg:grid-cols-2">
              <VizStackedBar series={stackSeries} labels={HALFYEAR} title={t('dataviz.spec.compTitle')} sub={t('dataviz.spec.compSub')} />
              <VizHBarChart data={hbarData.slice(0, 6)} title={t('dataviz.spec.topTitle')} sub={t('dataviz.spec.topSub')} />
            </div>
          </div>
        </div>
      </Section>

    </Page>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   AFTERQUAKE — Simulated Earthquake Emergency Dashboard · Colombia
   ⚠️  ALL DATA IS SIMULATED — NOT REAL SEISMIC EVENT DATA ⚠️
   For educational and design system demonstration purposes only.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Data types ─────────────────────────────────────────────────────────── */
type AQSev = 'critical' | 'severe' | 'moderate' | 'minor' | 'unaffected'
type AQDept = {
  id: string; name: string
  cx: number; cy: number       // position on 300×420 SVG
  sev: AQSev
  deceased: number; severelyInjured: number; lightlyInjured: number
  missing: number; displaced: number; rescued: number
  buildingsCollapsed: number; buildingsAtRisk: number
  hospitalCapacity: number     // % full (0-100)
  population: number           // thousands
}

/* ── Severity config ────────────────────────────────────────────────────── */
const AQ_SEV: Record<AQSev, { key: Key; color: string; bg: string; text: string }> = {
  critical:   { key: 'aq.sev.critical',   color: '#e11d48', bg: '#fecdd3', text: '#9f1239' },
  severe:     { key: 'aq.sev.severe',     color: '#f97316', bg: '#fed7aa', text: '#c2410c' },
  moderate:   { key: 'aq.sev.moderate',   color: '#f59e0b', bg: '#fef9c3', text: '#92400e' },
  minor:      { key: 'aq.sev.minor',      color: '#0891b2', bg: '#cffafe', text: '#0e7490' },
  unaffected: { key: 'aq.sev.unaffected', color: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
}

const aqLocale = (lang: string) => (lang === 'es' ? 'es-419' : 'en-US')

/* ── Department data (positions: x = (77.5-lon)/10.5*300, y = (12.5-lat)/16.7*420) ─ */
const AQ_DEPTS: AQDept[] = [
  // Critical – epicenter zone
  // Coordinate system: x=(lon+79.0)/12.1*300, y=(12.5-lat)/16.7*420
  // Critical – epicenter zone (Eje Cafetero)
  { id: 'caldas',    name: 'Caldas',          cx: 86, cy: 187, sev: 'critical',
    deceased: 420, severelyInjured: 3800, lightlyInjured: 12400, missing: 890,  displaced: 48000, rescued: 2140,
    buildingsCollapsed: 2100, buildingsAtRisk: 8400, hospitalCapacity: 98, population: 1008 },
  { id: 'risaralda', name: 'Risaralda',        cx: 82, cy: 193, sev: 'critical',
    deceased: 380, severelyInjured: 3200, lightlyInjured: 10800, missing: 760,  displaced: 42000, rescued: 1980,
    buildingsCollapsed: 1840, buildingsAtRisk: 7200, hospitalCapacity: 97, population: 967  },
  { id: 'quindio',   name: 'Quindío',          cx: 82, cy: 200, sev: 'critical',
    deceased: 340, severelyInjured: 2900, lightlyInjured: 9600,  missing: 680,  displaced: 38000, rescued: 1740,
    buildingsCollapsed: 1680, buildingsAtRisk: 6800, hospitalCapacity: 96, population: 546  },
  // Severe
  { id: 'antioquia', name: 'Antioquia',        cx: 85, cy: 157, sev: 'severe',
    deceased: 480, severelyInjured: 2800, lightlyInjured: 8400,  missing: 620,  displaced: 36000, rescued: 2300,
    buildingsCollapsed: 980,  buildingsAtRisk: 4200, hospitalCapacity: 88, population: 6614 },
  { id: 'valle',     name: 'Valle del Cauca',  cx: 62, cy: 228, sev: 'severe',
    deceased: 420, severelyInjured: 2400, lightlyInjured: 7200,  missing: 540,  displaced: 32000, rescued: 2010,
    buildingsCollapsed: 840,  buildingsAtRisk: 3800, hospitalCapacity: 84, population: 4520 },
  { id: 'tolima',    name: 'Tolima',           cx: 93, cy: 203, sev: 'severe',
    deceased: 290, severelyInjured: 1900, lightlyInjured: 6400,  missing: 420,  displaced: 28000, rescued: 1420,
    buildingsCollapsed: 720,  buildingsAtRisk: 3200, hospitalCapacity: 82, population: 1408 },
  { id: 'cundinamarca', name: 'Cundinamarca',  cx: 124, cy: 189, sev: 'severe',
    deceased: 180, severelyInjured: 1400, lightlyInjured: 4800,  missing: 280,  displaced: 22000, rescued: 920,
    buildingsCollapsed: 420,  buildingsAtRisk: 2100, hospitalCapacity: 79, population: 2919 },
  // Moderate
  { id: 'bogota',    name: 'Bogotá D.C.',      cx: 122, cy: 196, sev: 'moderate',
    deceased: 120, severelyInjured: 980,  lightlyInjured: 3400,  missing: 190,  displaced: 14000, rescued: 620,
    buildingsCollapsed: 180,  buildingsAtRisk: 1200, hospitalCapacity: 74, population: 7743 },
  { id: 'huila',     name: 'Huila',            cx: 93, cy: 241, sev: 'moderate',
    deceased: 140, severelyInjured: 1100, lightlyInjured: 3800,  missing: 210,  displaced: 16000, rescued: 680,
    buildingsCollapsed: 320,  buildingsAtRisk: 1800, hospitalCapacity: 76, population: 1168 },
  { id: 'cauca',     name: 'Cauca',            cx: 60, cy: 253, sev: 'moderate',
    deceased: 130, severelyInjured: 980,  lightlyInjured: 3200,  missing: 190,  displaced: 14000, rescued: 640,
    buildingsCollapsed: 290,  buildingsAtRisk: 1600, hospitalCapacity: 72, population: 1379 },
  { id: 'choco',     name: 'Chocó',            cx: 59, cy: 171, sev: 'moderate',
    deceased: 90,  severelyInjured: 680,  lightlyInjured: 2200,  missing: 140,  displaced: 10000, rescued: 440,
    buildingsCollapsed: 240,  buildingsAtRisk: 1400, hospitalCapacity: 68, population: 534  },
  { id: 'narino',    name: 'Nariño',           cx: 43, cy: 284, sev: 'moderate',
    deceased: 80,  severelyInjured: 620,  lightlyInjured: 2000,  missing: 120,  displaced: 8400,  rescued: 380,
    buildingsCollapsed: 210,  buildingsAtRisk: 1200, hospitalCapacity: 66, population: 1744 },
  // Minor
  { id: 'boyaca',    name: 'Boyacá',           cx: 140, cy: 175, sev: 'minor',
    deceased: 40,  severelyInjured: 320,  lightlyInjured: 1100,  missing: 60,   displaced: 4200,  rescued: 190,
    buildingsCollapsed: 80,   buildingsAtRisk: 480,  hospitalCapacity: 55, population: 1217 },
  { id: 'santander', name: 'Santander',        cx: 146, cy: 135, sev: 'minor',
    deceased: 35,  severelyInjured: 280,  lightlyInjured: 940,   missing: 50,   displaced: 3600,  rescued: 170,
    buildingsCollapsed: 60,   buildingsAtRisk: 380,  hospitalCapacity: 52, population: 2047 },
  { id: 'cordoba',   name: 'Córdoba',          cx: 77, cy: 94,  sev: 'minor',
    deceased: 28,  severelyInjured: 210,  lightlyInjured: 720,   missing: 40,   displaced: 2800,  rescued: 130,
    buildingsCollapsed: 44,   buildingsAtRisk: 280,  hospitalCapacity: 48, population: 1729 },
  { id: 'bolivar',   name: 'Bolívar',          cx: 87, cy: 53,  sev: 'minor',
    deceased: 18,  severelyInjured: 140,  lightlyInjured: 480,   missing: 28,   displaced: 1800,  rescued: 84,
    buildingsCollapsed: 28,   buildingsAtRisk: 180,  hospitalCapacity: 46, population: 2070 },
  { id: 'atlantico', name: 'Atlántico',        cx: 105, cy: 38,  sev: 'minor',
    deceased: 10,  severelyInjured: 80,   lightlyInjured: 280,   missing: 16,   displaced: 1200,  rescued: 48,
    buildingsCollapsed: 16,   buildingsAtRisk: 100,  hospitalCapacity: 44, population: 2535 },
  { id: 'nsantander',name: 'Norte de Santander',cx: 161, cy: 116, sev: 'minor',
    deceased: 20,  severelyInjured: 160,  lightlyInjured: 540,   missing: 30,   displaced: 2100,  rescued: 96,
    buildingsCollapsed: 32,   buildingsAtRisk: 210,  hospitalCapacity: 42, population: 1355 },
  // Unaffected
  { id: 'meta',      name: 'Meta',             cx: 133, cy: 210, sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 12,    missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 12,   hospitalCapacity: 22, population: 1039 },
  { id: 'casanare',  name: 'Casanare',         cx: 164, cy: 180, sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 8,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 8,    hospitalCapacity: 18, population: 420  },
  { id: 'guajira',   name: 'La Guajira',       cx: 151, cy: 24,  sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 4,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 4,    hospitalCapacity: 15, population: 1028 },
  { id: 'cesar',     name: 'Cesar',            cx: 143, cy: 51,  sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 6,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 6,    hospitalCapacity: 20, population: 1029 },
  { id: 'magdalena', name: 'Magdalena',        cx: 120, cy: 51,  sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 8,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 8,    hospitalCapacity: 17, population: 1391 },
  { id: 'arauca',    name: 'Arauca',           cx: 204, cy: 136, sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 2,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 2,    hospitalCapacity: 12, population: 268  },
  { id: 'caqueta',   name: 'Caquetá',          cx: 84, cy: 274, sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 4,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 4,    hospitalCapacity: 14, population: 499  },
  { id: 'putumayo',  name: 'Putumayo',         cx: 59, cy: 285, sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 2,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 2,    hospitalCapacity: 11, population: 348  },
  { id: 'amazonas',  name: 'Amazonas',         cx: 196, cy: 403, sev: 'unaffected',
    deceased: 0,   severelyInjured: 0,    lightlyInjured: 0,     missing: 0,    displaced: 0,     rescued: 0,
    buildingsCollapsed: 0,    buildingsAtRisk: 0,    hospitalCapacity: 8,  population: 77   },
]

/* ── Derived totals ─────────────────────────────────────────────────────── */
const AQ_TOTALS = AQ_DEPTS.reduce((acc, d) => ({
  deceased:          acc.deceased          + d.deceased,
  severelyInjured:   acc.severelyInjured   + d.severelyInjured,
  lightlyInjured:    acc.lightlyInjured    + d.lightlyInjured,
  missing:           acc.missing           + d.missing,
  displaced:         acc.displaced         + d.displaced,
  rescued:           acc.rescued           + d.rescued,
  buildingsCollapsed:acc.buildingsCollapsed+ d.buildingsCollapsed,
  buildingsAtRisk:   acc.buildingsAtRisk   + d.buildingsAtRisk,
}), { deceased:0, severelyInjured:0, lightlyInjured:0, missing:0, displaced:0, rescued:0, buildingsCollapsed:0, buildingsAtRisk:0 })

/* ── Timeline events ────────────────────────────────────────────────────── */
const AQ_TIMELINE: { t: string; txt: Key; sev: AQSev }[] = [
  { t: 'T+0h', txt: 'aq.tl.0', sev: 'critical' },
  { t: 'T+0:15h', txt: 'aq.tl.1', sev: 'critical' },
  { t: 'T+0:30h', txt: 'aq.tl.2', sev: 'severe' },
  { t: 'T+1h', txt: 'aq.tl.3', sev: 'severe' },
  { t: 'T+2h', txt: 'aq.tl.4', sev: 'moderate' },
  { t: 'T+4h', txt: 'aq.tl.5', sev: 'moderate' },
  { t: 'T+6h', txt: 'aq.tl.6', sev: 'minor' },
  { t: 'T+8h', txt: 'aq.tl.7', sev: 'minor' },
  { t: 'T+12h', txt: 'aq.tl.8', sev: 'minor' },
  { t: 'T+18h', txt: 'aq.tl.9', sev: 'unaffected' },
]

/* ── Simulated update toasts ────────────────────────────────────────────── */
const AQ_UPDATE_COUNT = 8

/* ── Colombia Map SVG ───────────────────────────────────────────────────── */
function ColombiaMap({ depts, selected, onSelect, hoveredDept, onHover }: {
  depts: AQDept[]; selected: string | null
  onSelect: (id: string | null) => void
  hoveredDept: string | null
  onHover: (id: string | null) => void
}) {
  const { t, lang } = useI18n()
  const loc = aqLocale(lang)
  /* Real DANE department boundaries, projected to the 300×420 viewBox (see colombia-geo.ts). */
  const byId = new Map(depts.map(d => [d.id, d]))
  // Draw order: neutral/off-scope first, then affected, so colored borders sit on top.
  const geoEntries = Object.entries(CO_DEPT_GEO)
  const scoped = geoEntries.filter(([id]) => byId.has(id))
  const neutral = geoEntries.filter(([id]) => !byId.has(id))
  // Epicenter — Eje Cafetero, projected from (5.05N, 75.55W)
  const epi = { x: 89.2, y: 187.4 }

  const labelIds = ['caldas','antioquia','valle','bogota','santander','cordoba','atlantico','nsantander','guajira','meta','narino','choco','huila','cauca','boyaca','tolima','cundinamarca','magdalena','cesar','bolivar','arauca','casanare','caqueta','putumayo','amazonas','risaralda','quindio']

  return (
    <div className="relative select-none">
      <svg viewBox="0 0 300 420" className="w-full" style={{ height: 'auto', display: 'block', maxHeight: 480 }} role="group" aria-label={t('aq.map.aria')}
        onMouseLeave={() => onHover(null)}>
        <defs>
          <filter id="aqMapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
          <radialGradient id="aqOcean" cx="50%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e2eef6" />
          </radialGradient>
        </defs>

        {/* Ocean / canvas ground */}
        <rect width={300} height={420} fill="url(#aqOcean)" rx={14} />
        {/* Subtle graticule */}
        {[60, 120, 180, 240].map(x => <line key={'v'+x} x1={x} y1={0} x2={x} y2={420} stroke="#0f172a" strokeOpacity={0.03} strokeWidth={1} />)}
        {[70, 140, 210, 280, 350].map(y => <line key={'h'+y} x1={0} y1={y} x2={300} y2={y} stroke="#0f172a" strokeOpacity={0.03} strokeWidth={1} />)}

        {/* Country landmass drop shadow — union rendered via the neutral+scoped fills below */}
        <g filter="url(#aqMapShadow)">
          {geoEntries.map(([id, g]) => (
            <path key={'base'+id} d={g.d} fill="#ffffff" />
          ))}
        </g>

        {/* Off-scope departments (no incident data) */}
        {neutral.map(([id, g]) => (
          <path key={id} d={g.d} fill="#eef2f7" stroke="#ffffff" strokeWidth={0.8} strokeLinejoin="round" />
        ))}

        {/* Affected departments — choropleth by severity */}
        {scoped.map(([id, g]) => {
          const d = byId.get(id)!
          const s = AQ_SEV[d.sev]
          const isSelected = selected === d.id
          const isHovered = hoveredDept === d.id
          const active = isSelected || isHovered
          return (
            <path key={id} d={g.d}
              fill={s.color}
              fillOpacity={isSelected ? 1 : isHovered ? 0.95 : d.sev === 'unaffected' ? 0.55 : 0.82}
              stroke={active ? '#0f172a' : '#ffffff'}
              strokeOpacity={active ? 0.9 : 1}
              strokeWidth={active ? 1.4 : 0.8}
              strokeLinejoin="round"
              onClick={() => onSelect(isSelected ? null : d.id)}
              onMouseEnter={() => onHover(d.id)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 140ms ease, stroke-width 140ms ease' }} />
          )
        })}

        {/* Epicenter pulse rings */}
        {[10, 18, 28].map((r, i) => (
          <circle key={i} cx={epi.x} cy={epi.y} r={r} fill="none" stroke="#e11d48"
            strokeWidth={1.4 - i * 0.35} opacity={0.5 - i * 0.13}>
            <animate attributeName="r" values={`${r};${r + 6};${r}`} dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values={`${0.5 - i * 0.13};0;${0.5 - i * 0.13}`} dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Epicenter marker */}
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={epi.x} cy={epi.y} r={4.5} fill="#ffffff" stroke="#e11d48" strokeWidth={2} />
          <circle cx={epi.x} cy={epi.y} r={1.6} fill="#e11d48" />
        </g>

        {/* Department labels at real centroids */}
        {scoped.filter(([id]) => labelIds.includes(id)).map(([id, g]) => {
          const d = byId.get(id)!
          const short = d.name
            .replace('Valle del Cauca', 'Valle')
            .replace('Norte de Santander', 'N. Stder.')
            .replace('Atlántico', 'Atl.')
            .replace('Cundinamarca', 'Cund.')
            .replace('Bogotá D.C.', 'Bogotá')
            .replace('La Guajira', 'Guajira')
          return (
            <text key={id} x={g.cx} y={g.cy}
              fontSize={6.4} fontFamily="inherit" textAnchor="middle"
              style={{ pointerEvents: 'none', fontWeight: selected === id ? 700 : 500, paintOrder: 'stroke' }}
              stroke="#ffffff" strokeWidth={1.6} strokeLinejoin="round"
              fill={d.sev === 'critical' || d.sev === 'severe' ? '#1e293b' : '#334155'}>
              {short}
            </text>
          )
        })}

        {/* Legend */}
        <g transform="translate(8, 348)">
          <rect x={0} y={0} width={150} height={62} rx={8} fill="rgba(255,255,255,0.94)" stroke="#e2e8f0" strokeWidth={1} filter="url(#aqMapShadow)" />
          <text x={10} y={15} fontSize={7.5} fill="#64748b" fontFamily="inherit" fontWeight={700} letterSpacing={0.4}>{t('aq.map.legend')}</text>
          {(['critical','severe','moderate','minor','unaffected'] as AQSev[]).map((sev, i) => {
            const col = i % 3, row = Math.floor(i / 3)
            return (
              <g key={sev} transform={`translate(${10 + col * 46}, ${26 + row * 18})`}>
                <rect x={0} y={0} width={9} height={9} rx={2} fill={AQ_SEV[sev].color} fillOpacity={0.85} />
                <text x={12} y={8} fontSize={6} fill="#475569" fontFamily="inherit">{t(AQ_SEV[sev].key)}</text>
              </g>
            )
          })}
        </g>

        {/* SIMULACIÓN watermark */}
        <text x={205} y={300} fontSize={20} fill="#0f172a" fillOpacity={0.05} fontFamily="inherit" fontWeight={900}
          textAnchor="middle" transform="rotate(-32, 205, 300)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {t('aq.map.watermark')}
        </text>
      </svg>

      {/* Tooltip for hovered department */}
      {hoveredDept && (() => {
        const d = depts.find(x => x.id === hoveredDept)
        if (!d) return null
        const s = AQ_SEV[d.sev]
        return (
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 shadow-lg text-xs min-w-[180px]">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-semibold text-ink">{d.name}</span>
              <span className="rounded-full px-1.5 py-0.5 font-mono text-10 font-bold" style={{ backgroundColor: s.bg, color: s.text }}>{t(s.key)}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-10 text-ink-muted">
              <span>{t('aq.m.deceased')} <strong className="text-ink">{d.deceased.toLocaleString(loc)}</strong></span>
              <span>{t('aq.m.rescued')} <strong className="text-ink">{d.rescued.toLocaleString(loc)}</strong></span>
              <span>{t('aq.m.missing')} <strong className="text-ink">{d.missing.toLocaleString(loc)}</strong></span>
              <span>{t('aq.m.displaced')} <strong className="text-ink">{(d.displaced / 1000).toFixed(0)}K</strong></span>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

/* ── Department detail panel ────────────────────────────────────────────── */
function DeptPanel({ dept, onDetail, onClose }: { dept: AQDept; onDetail: () => void; onClose: () => void }) {
  const { t, lang } = useI18n()
  const loc = aqLocale(lang)
  const s = AQ_SEV[dept.sev]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold text-ink">{dept.name}</h3>
            <span className="rounded-full px-2 py-0.5 text-11 font-bold uppercase" style={{ backgroundColor: s.bg, color: s.text }}>{t(s.key)}</span>
          </div>
          <p className="text-xs text-ink-muted">{t('aq.panel.pop', { pop: dept.population.toLocaleString(loc), cap: dept.hospitalCapacity })}</p>
        </div>
        <button onClick={onClose} aria-label={t('aq.close')} title={t('aq.close')} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-ground hover:text-ink">
          <IconX size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: t('aq.m.deceased'),        val: dept.deceased.toLocaleString(loc),        color: '#e11d48' },
          { label: t('aq.m.severelyInjured'), val: dept.severelyInjured.toLocaleString(loc), color: '#f97316' },
          { label: t('aq.m.lightlyInjured'),  val: dept.lightlyInjured.toLocaleString(loc),  color: '#f59e0b' },
          { label: t('aq.m.missing'),         val: dept.missing.toLocaleString(loc),         color: '#7c3aed' },
          { label: t('aq.m.displaced'),       val: (dept.displaced / 1000).toFixed(0) + 'K', color: '#64748b' },
          { label: t('aq.m.rescued'),         val: dept.rescued.toLocaleString(loc),         color: '#0891b2' },
        ].map(({ label, val, color }) => (
          <div key={label} className="rounded-xl border border-line bg-canvas p-2.5">
            <p className="text-10 text-ink-muted">{label}</p>
            <p className="mt-0.5 font-mono text-base font-bold" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-ink">{t('aq.panel.buildings')}</p>
        <div className="space-y-1.5">
          <Meter label={t('aq.panel.collapsed')} value={dept.buildingsCollapsed} max={dept.buildingsCollapsed + dept.buildingsAtRisk} unit="" severity="danger" />
          <Meter label={t('aq.panel.atRisk')} value={dept.buildingsAtRisk} max={dept.buildingsCollapsed + dept.buildingsAtRisk + 10000} unit="" severity="warning" />
          <Meter label={t('aq.panel.hospCapShort')} value={dept.hospitalCapacity} max={100} unit="%" severity={dept.hospitalCapacity >= 95 ? 'danger' : dept.hospitalCapacity >= 80 ? 'warning' : 'default'} />
        </div>
      </div>

      <Button variant="outlined" severity="primary" size="sm" onClick={onDetail} block Icon={IconInfo}>
        {t('aq.panel.fullAnalysis')}
      </Button>
    </div>
  )
}

/* ── Department detail modal ────────────────────────────────────────────── */
function DeptModal({ dept, onClose }: { dept: AQDept; onClose: () => void }) {
  const { t, lang } = useI18n()
  const loc = aqLocale(lang)
  const s = AQ_SEV[dept.sev]
  const totalAffected = dept.deceased + dept.severelyInjured + dept.lightlyInjured + dept.missing
  const demoSlices: DonutSlice[] = [
    { label: t('aq.age.children'), value: Math.round(totalAffected * 0.22), color: '#0891b2' },
    { label: t('aq.age.youth'),    value: Math.round(totalAffected * 0.10), color: '#eb6834' },
    { label: t('aq.age.adults'),   value: Math.round(totalAffected * 0.48), color: '#1baf7a' },
    { label: t('aq.age.seniors'),  value: Math.round(totalAffected * 0.20), color: '#eda100' },
  ]
  return (
    <Modal
      open onClose={onClose}
      title={t('aq.modal.title', { name: dept.name })}
      description={t('aq.modal.desc', { sev: t(s.key), pop: dept.population.toLocaleString(loc) })}
      size="lg"
      icon={IconMapPin} iconSeverity="primary"
      footer={<Button severity="primary" onClick={onClose}>{t('aq.close')}</Button>}
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-warning-border bg-warning-soft px-4 py-2.5 text-sm text-warning-fg">
          {t('aq.modal.warn')}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { l: t('aq.m.deceased'),        v: dept.deceased.toLocaleString(loc),        c: '#e11d48' },
            { l: t('aq.m.severelyInjured'), v: dept.severelyInjured.toLocaleString(loc), c: '#f97316' },
            { l: t('aq.m.lightlyInjured'),  v: dept.lightlyInjured.toLocaleString(loc),  c: '#f59e0b' },
            { l: t('aq.m.missing'),         v: dept.missing.toLocaleString(loc),         c: '#7c3aed' },
            { l: t('aq.m.displaced'),       v: dept.displaced.toLocaleString(loc),       c: '#64748b' },
            { l: t('aq.m.rescued'),         v: dept.rescued.toLocaleString(loc),         c: '#0891b2' },
          ].map(({ l, v, c }) => (
            <div key={l} className="rounded-xl border border-line bg-canvas p-3 text-center">
              <p className="text-10 text-ink-muted">{l}</p>
              <p className="mt-1 font-mono text-xl font-bold" style={{ color: c }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">{t('aq.modal.buildings')}</p>
            <div className="space-y-1.5">
              <Meter label={t('aq.panel.collapsed')} value={dept.buildingsCollapsed} max={dept.buildingsCollapsed + dept.buildingsAtRisk + 5000} unit="" severity="danger" />
              <Meter label={t('aq.panel.atRisk')} value={dept.buildingsAtRisk} max={dept.buildingsCollapsed + dept.buildingsAtRisk + 5000} unit="" severity="warning" />
              <Meter label={t('aq.modal.hospitals')} value={dept.hospitalCapacity}   max={100} unit="%" severity={dept.hospitalCapacity >= 95 ? 'danger' : dept.hospitalCapacity >= 80 ? 'warning' : 'default'} />
            </div>
          </div>
          <VizDonut slices={demoSlices} title={t('aq.modal.ageTitle')} size={160} />
        </div>
      </div>
    </Modal>
  )
}

/* ── AfterQuakePage ─────────────────────────────────────────────────────── */
export function AfterQuakePage() {
  const { t, lang } = useI18n()
  const loc = aqLocale(lang)
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [hoveredDept, setHoveredDept]   = useState<string | null>(null)
  const [activeTab, setActiveTab]       = useState<'overview' | 'departments' | 'resources' | 'timeline'>('overview')
  const [detailModal, setDetailModal]   = useState<string | null>(null)
  const [elapsed, setElapsed]           = useState(1082) // minutes since event (T+18h02m)
  const [toasts, setToasts]             = useState<Array<{ id: string; msg: number; severity: 'warning' | 'primary' | 'danger' }>>([])
  const [updateIdx, setUpdateIdx]       = useState(0)
  const [sevFilter, setSevFilter]       = useState<string>('all')
  const [deptSearch, setDeptSearch]     = useState('')

  /* Live clock */
  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  /* Simulated live updates */
  useEffect(() => {
    const timer = setInterval(() => {
      const msg = updateIdx % AQ_UPDATE_COUNT
      const id = Date.now().toString()
      setToasts(prev => [...prev, { id, msg, severity: updateIdx % 3 === 0 ? 'warning' : 'primary' }])
      setUpdateIdx(i => i + 1)
    }, 28000)
    return () => clearInterval(timer)
  }, [updateIdx])

  const dismissToast = (id: string) => setToasts(prev => prev.filter(x => x.id !== id))

  const elapsedH = Math.floor(elapsed / 60)
  const elapsedM = elapsed % 60
  const selectedDeptData = selectedDept ? AQ_DEPTS.find(d => d.id === selectedDept) ?? null : null
  const detailDeptData   = detailModal   ? AQ_DEPTS.find(d => d.id === detailModal) ?? null : null

  /* Filtered departments for table */
  const filteredDepts = AQ_DEPTS.filter(d =>
    (sevFilter === 'all' || d.sev === sevFilter) &&
    d.name.toLowerCase().includes(deptSearch.toLowerCase())
  )

  /* Chart data */
  const top7Collapsed = [...AQ_DEPTS]
    .filter(d => d.buildingsCollapsed > 0)
    .sort((a, b) => b.buildingsCollapsed - a.buildingsCollapsed)
    .slice(0, 7)
    .map(d => ({ label: d.name.split(' ')[0], value: d.buildingsCollapsed, color: AQ_SEV[d.sev].color }))

  const rescueTimeline: LSeries[] = [{
    name: t('aq.chart.rescued'), color: '#0891b2',
    data: [0,120,380,740,1280,2200,3450,4890,6340,7800,9340,10880,12440,13820,15140,16380,17160,17820,18204],
  }]
  const TIMELINE_LABELS = ['T+0','T+1','T+2','T+3','T+4','T+5','T+6','T+7','T+8','T+9','T+10','T+11','T+12','T+13','T+14','T+15','T+16','T+17','T+18']

  const demographicsSlices: DonutSlice[] = [
    { label: t('aq.age.children'), value: 22, color: '#0891b2' },
    { label: t('aq.age.youth'),    value: 10, color: '#eb6834' },
    { label: t('aq.age.adults'),   value: 48, color: '#1baf7a' },
    { label: t('aq.age.seniors'),  value: 20, color: '#eda100' },
  ]

  const nf = (n: number) => n.toLocaleString(loc)
  const quakeDate = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 7, 14, 6, 14))

  const TABS = [
    { id: 'overview',     label: t('aq.tab.overview') },
    { id: 'departments',  label: t('aq.tab.departments') },
    { id: 'resources',    label: t('aq.tab.resources') },
    { id: 'timeline',     label: t('aq.tab.timeline') },
  ] as const

  return (
    <div className="space-y-0">

      {/* ── Simulation banner ───────────────────────────────────────── */}
      <div className="sticky top-0 z-40 flex items-center justify-center gap-3 bg-amber-700 px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm sm:text-sm">
        <IconAlert size={16} weight="fill" className="hidden shrink-0 sm:block" />
        <span>{t('aq.banner')}</span>
        <IconAlert size={16} weight="fill" className="hidden shrink-0 sm:block" />
      </div>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="border-b border-line bg-surface py-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mx-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-danger-soft-hover px-2.5 py-1 font-mono text-10 font-bold uppercase tracking-wide text-danger-fg">{t('aq.eyebrow')}</span>
              <Badge severity="danger" variant="solid">{t('aq.badge.quake')}</Badge>
              <Badge severity="secondary">{t('aq.badge.region')}</Badge>
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">{t('aq.title')}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {t('aq.epicenter', { date: quakeDate })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl border border-line bg-canvas px-5 py-3 text-center">
              <p className="font-mono text-10 uppercase tracking-[0.12em] text-ink-muted">{t('aq.elapsed')}</p>
              <p className="mt-0.5 font-display text-3xl font-extrabold text-danger">
                T+{elapsedH}h {String(elapsedM).padStart(2,'0')}m
              </p>
            </div>
            <p className="text-10 text-ink-muted">{t('aq.updated')}</p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="mt-5 flex gap-1 overflow-x-auto border-b border-line -mb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-brand-500 text-primary-fg'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6 space-y-6">

        {/* ══ TAB: RESUMEN GENERAL ══════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* KPI row */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                { label: t('aq.m.deceased'),        val: nf(AQ_TOTALS.deceased),                        color: '#e11d48', bg: '#fecdd3', Icon: IconAlert,    sub: t('aq.kpi.confirmed') },
                { label: t('aq.m.severelyInjured'), val: nf(AQ_TOTALS.severelyInjured),                 color: '#f97316', bg: '#fed7aa', Icon: IconAmbulance, sub: t('aq.kpi.inHospitals') },
                { label: t('aq.m.missing'),         val: nf(AQ_TOTALS.missing),                         color: '#7c3aed', bg: '#ede9fe', Icon: IconSearch,    sub: t('aq.kpi.beingSearched') },
                { label: t('aq.m.displaced'),       val: (AQ_TOTALS.displaced / 1000).toFixed(0) + 'K', color: '#64748b', bg: '#f1f5f9', Icon: IconTent,      sub: t('aq.kpi.inShelters') },
                { label: t('aq.m.rescued'),         val: nf(AQ_TOTALS.rescued),                         color: '#059669', bg: '#d1fae5', Icon: IconShield,    sub: t('aq.kpi.alive') },
                { label: t('aq.m.collapsedShort'),  val: nf(AQ_TOTALS.buildingsCollapsed),              color: '#b45309', bg: '#fef3c7', Icon: IconBuildings, sub: t('aq.kpi.collapsed') },
              ].map(({ label, val, color, bg, Icon: Ic, sub }) => (
                <div key={label} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 text-xs text-ink-muted">{label}</p>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: bg }}>
                      <Ic size={14} style={{ color }} />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold leading-none" style={{ color }}>{val}</p>
                  <p className="mt-1 text-10 text-ink-muted">{sub}</p>
                </div>
              ))}
            </div>

            {/* Map + dept panel */}
            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
              {/* Map */}
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{t('aq.mapCard.title')}</p>
                    <p className="text-xs text-ink-muted">{t('aq.mapCard.hint')}</p>
                  </div>
                  {selectedDept && (
                    <button onClick={() => setSelectedDept(null)} className="text-xs font-medium text-primary-fg hover:underline">{t('aq.mapCard.clear')}</button>
                  )}
                </div>
                <ColombiaMap
                  depts={AQ_DEPTS}
                  selected={selectedDept}
                  onSelect={setSelectedDept}
                  hoveredDept={hoveredDept}
                  onHover={setHoveredDept}
                />
              </div>

              {/* Right panel */}
              <div className="rounded-2xl border border-line bg-surface p-5">
                {selectedDeptData ? (
                  <DeptPanel
                    dept={selectedDeptData}
                    onDetail={() => setDetailModal(selectedDeptData.id)}
                    onClose={() => setSelectedDept(null)}
                  />
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-ink">{t('aq.top.title')}</p>
                    <p className="text-xs text-ink-muted">{t('aq.top.hint')}</p>
                    {AQ_DEPTS.filter(d => d.sev !== 'unaffected').sort((a, b) => b.deceased - a.deceased).slice(0, 8).map(d => {
                      const s = AQ_SEV[d.sev]
                      const pct = d.hospitalCapacity
                      return (
                        <button key={d.id} onClick={() => setSelectedDept(d.id)}
                          className="flex w-full items-center gap-3 rounded-xl border border-line bg-canvas px-3 py-2.5 text-left transition-colors hover:border-primary-border hover:bg-primary-soft/40">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium text-ink">{d.name}</span>
                              <span className="shrink-0 font-mono text-xs font-semibold text-danger">{nf(d.deceased)}</span>
                            </div>
                            <div className="mt-1 h-1 overflow-hidden rounded-full bg-ground">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 95 ? '#e11d48' : pct >= 80 ? '#f97316' : '#0891b2' }} />
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Secondary charts */}
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VizLineChart series={rescueTimeline} labels={TIMELINE_LABELS}
                  title={t('aq.chart.rescuedTitle')}
                  sub={t('aq.chart.rescuedSub')} />
              </div>
              <VizDonut slices={demographicsSlices} title={t('aq.chart.age')} sub={t('aq.chart.ageSub')} size={160} />
            </div>

            {/* Buildings bar */}
            <VizHBarChart
              data={top7Collapsed}
              title={t('aq.chart.bldgTitle')}
              sub={t('aq.chart.bldgSub')}
            />
          </>
        )}

        {/* ══ TAB: POR DEPARTAMENTO ════════════════════════════════════ */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-3.5">
              <span className="text-xs font-medium text-ink-muted">{t('aq.filter.label')}</span>
              <Input placeholder={t('aq.filter.search')} Icon={IconSearch} value={deptSearch} onChange={e => setDeptSearch(e.target.value)} />
              <div className="flex max-w-full overflow-x-auto rounded-lg border border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(['all','critical','severe','moderate','minor','unaffected'] as const).map(s => (
                  <button key={s} onClick={() => setSevFilter(s)}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-colors ${sevFilter === s ? 'bg-brand-500 text-white' : 'text-ink-soft hover:bg-ground'}`}>
                    {s === 'all' ? t('aq.all') : t(AQ_SEV[s].key)}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-xs text-ink-muted">{t(filteredDepts.length === 1 ? 'aq.count.one' : 'aq.count.other', { n: filteredDepts.length })}</span>
            </div>

            {/* Full table */}
            <div tabIndex={0} className="pance-focus overflow-x-auto rounded-2xl border border-line bg-surface">
              <table className="w-full min-w-[56rem] text-sm">
                <thead className="border-b border-line bg-canvas">
                  <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-mono [&>th]:text-10 [&>th]:uppercase [&>th]:tracking-[0.12em] [&>th]:text-ink-muted">
                    <th>{t('aq.th.department')}</th>
                    <th>{t('aq.th.severity')}</th>
                    <th className="text-right">{t('aq.m.deceased')}</th>
                    <th className="text-right">{t('aq.th.severelyInjured')}</th>
                    <th className="text-right">{t('aq.th.missing')}</th>
                    <th className="text-right">{t('aq.m.displaced')}</th>
                    <th className="text-right">{t('aq.m.rescued')}</th>
                    <th className="text-right">{t('aq.th.collapsed')}</th>
                    <th className="text-right">{t('aq.th.atRisk')}</th>
                    <th className="text-right">{t('aq.th.hosp')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredDepts.map(d => {
                    const s = AQ_SEV[d.sev]
                    return (
                      <tr key={d.id} className="hover:bg-canvas transition-colors">
                        <td className="px-4 py-3 font-medium text-ink">{d.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-11 font-semibold" style={{ backgroundColor: s.bg, color: s.text }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                            {t(s.key)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-semibold" style={{ color: d.deceased > 0 ? '#e11d48' : '#94a3b8' }}>{nf(d.deceased)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-ink-muted tabular-nums">{nf(d.severelyInjured)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-ink-muted tabular-nums">{nf(d.missing)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-ink-muted tabular-nums">{nf(d.displaced)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-medium" style={{ color: '#059669' }}>{nf(d.rescued)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-ink-muted tabular-nums">{nf(d.buildingsCollapsed)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-ink-muted tabular-nums">{nf(d.buildingsAtRisk)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="w-12 overflow-hidden rounded-full bg-ground" style={{ height: 6 }}>
                              <div className="h-full rounded-full"
                                style={{ width: `${d.hospitalCapacity}%`, backgroundColor: d.hospitalCapacity >= 95 ? '#e11d48' : d.hospitalCapacity >= 80 ? '#f97316' : '#0891b2' }} />
                            </div>
                            <span className="w-9 text-right font-mono text-10 tabular-nums text-ink-muted">{d.hospitalCapacity}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setDetailModal(d.id)} aria-label={t('aq.viewDetail', { name: d.name })} title={t('aq.viewDetail', { name: d.name })}
                            className="grid h-7 w-7 place-items-center rounded-lg text-ink-muted hover:bg-ground hover:text-primary-fg">
                            <IconInfo size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="border-t border-line bg-canvas/60">
                  <tr className="[&>td]:px-4 [&>td]:py-3 [&>td]:font-mono [&>td]:text-xs [&>td]:font-semibold">
                    <td className="text-ink">{t('aq.totals')}</td>
                    <td></td>
                    <td className="text-right text-danger">{nf(AQ_TOTALS.deceased)}</td>
                    <td className="text-right text-ink-muted tabular-nums">{nf(AQ_TOTALS.severelyInjured)}</td>
                    <td className="text-right text-ink-muted tabular-nums">{nf(AQ_TOTALS.missing)}</td>
                    <td className="text-right text-ink-muted tabular-nums">{nf(AQ_TOTALS.displaced)}</td>
                    <td className="text-right" style={{ color: '#059669' }}>{nf(AQ_TOTALS.rescued)}</td>
                    <td className="text-right text-ink-muted tabular-nums">{nf(AQ_TOTALS.buildingsCollapsed)}</td>
                    <td className="text-right text-ink-muted tabular-nums">{nf(AQ_TOTALS.buildingsAtRisk)}</td>
                    <td></td><td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ══ TAB: RECURSOS ═══════════════════════════════════════════ */}
        {activeTab === 'resources' && (
          <div className="space-y-5">
            {/* Hospitals */}
             <Panel title={t('aq.hosp.title')} icon={IconAmbulance} iconSeverity="danger">
              <div tabIndex={0} className="pance-focus overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-line-soft">
                    <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-mono [&>th]:text-10 [&>th]:uppercase [&>th]:tracking-[0.1em] [&>th]:text-ink-muted">
                      <th>{t('aq.hosp.hospital')}</th><th>{t('aq.hosp.city')}</th><th>{t('aq.hosp.type')}</th><th>{t('aq.hosp.capacity')}</th><th>{t('aq.hosp.occupancy')}</th><th>{t('aq.hosp.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {[
                      { name: 'Hospital Gral. de Manizales',  city: 'Manizales',  type: 'aq.hosp.level3' as Key, cap: 380, occ: 99, st: 'critical' as AQSev },
                      { name: 'Clínica Versalles',            city: 'Manizales',  type: 'aq.hosp.private' as Key, cap: 160, occ: 97, st: 'critical' as AQSev },
                      { name: 'Hospital San Jorge',           city: 'Pereira',    type: 'aq.hosp.level3' as Key, cap: 420, occ: 96, st: 'critical' as AQSev },
                      { name: 'Clínica Los Rosales',          city: 'Pereira',    type: 'aq.hosp.private' as Key, cap: 200, occ: 94, st: 'severe' as AQSev },
                      { name: 'Hospital del Quindío',        city: 'Armenia',    type: 'aq.hosp.level3' as Key, cap: 340, occ: 95, st: 'critical' as AQSev },
                      { name: 'Hospital Pablo Tobón Uribe',   city: 'Medellín',   type: 'aq.hosp.level3' as Key, cap: 490, occ: 88, st: 'severe' as AQSev },
                      { name: 'HUS Fundación Valle del Lili', city: 'Cali',       type: 'aq.hosp.level4' as Key, cap: 520, occ: 82, st: 'moderate' as AQSev },
                      { name: 'Hospital San Ignacio',         city: 'Bogotá',     type: 'aq.hosp.level3' as Key, cap: 460, occ: 74, st: 'moderate' as AQSev },
                      { name: 'Hospital Universitario San Vicente', city: 'Medellín', type: 'aq.hosp.level3' as Key, cap: 550, occ: 76, st: 'moderate' as AQSev },
                    ].map(h => {
                      const sevColor = h.occ >= 95 ? '#e11d48' : h.occ >= 85 ? '#f97316' : '#0891b2'
                      const sevBg = h.occ >= 95 ? '#fecdd3' : h.occ >= 85 ? '#fed7aa' : '#cffafe'
                      return (
                        <tr key={h.name} className="hover:bg-canvas">
                          <td className="px-4 py-3 font-medium text-ink">{h.name}</td>
                          <td className="px-4 py-3 text-ink-muted">{h.city}</td>
                          <td className="px-4 py-3 text-xs text-ink-muted">{t(h.type)}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-ink-muted">{h.cap}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 overflow-hidden rounded-full bg-ground" style={{ height: 6 }}>
                                <div className="h-full rounded-full" style={{ width: `${Math.min(100,h.occ)}%`, backgroundColor: sevColor }} />
                              </div>
                              <span className="w-8 text-right font-mono text-10 tabular-nums text-ink-muted">{h.occ}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="whitespace-nowrap rounded-full px-2 py-0.5 text-11 font-semibold" style={{ backgroundColor: sevBg, color: sevColor }}>{t(AQ_SEV[h.st].key)}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* Rescue teams */}
            <Panel title={t('aq.teams.title')} icon={IconShield} iconSeverity="primary">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'USAR Colombia Alpha',  loc: 'Manizales',  members: 24, status: 'active' as const, progress: 68 },
                  { name: 'USAR Colombia Bravo',  loc: 'Armenia',    members: 24, status: 'active' as const, progress: 54 },
                  { name: 'Cruz Roja Caldas',     loc: 'Manizales',  members: 48, status: 'active' as const, progress: 82 },
                  { name: 'Bomberos Pereira',     loc: 'Pereira',    members: 36, status: 'active' as const, progress: 71 },
                  { name: 'USAR México',          loc: 'Pereira',    members: 48, status: 'enRoute' as const, progress: 20 },
                  { name: 'USAR Ecuador',         loc: 'Armenia',    members: 36, status: 'active' as const, progress: 45 },
                  { name: 'Ejército Nacional',    loc: 'Caldas',     members: 200,status: 'active' as const, progress: 60 },
                  { name: 'Defensa Civil',        loc: 'Valle',      members: 80, status: 'active' as const, progress: 77 },
                  { name: 'USAR España',          loc: 'Bogotá',     members: 62, status: 'enRoute' as const, progress: 5  },
                ].map(tm => (
                  <div key={tm.name} className="rounded-xl border border-line bg-canvas p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{tm.name}</p>
                        <p className="text-xs text-ink-muted">{tm.loc} · {t('aq.team.people', { n: tm.members })}</p>
                      </div>
                      <Badge severity={tm.status === 'active' ? 'primary' : 'warning'} dot>{t(tm.status === 'active' ? 'aq.team.active' : 'aq.team.enRoute')}</Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-10 text-ink-muted mb-1">
                        <span>{t('aq.team.covered')}</span><span className="font-mono font-medium">{tm.progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ground">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${tm.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Shelters */}
            <Panel title={t('aq.shelters.title')} icon={IconTent} iconSeverity="warning">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Coliseo Mayor Manizales',  dept: 'Caldas',    cap: 2000, occ: 1840, supplies: 72 },
                  { name: 'Estadio Hernán Ramírez',   dept: 'Risaralda', cap: 3000, occ: 2680, supplies: 64 },
                  { name: 'Parque del Café Arena',    dept: 'Quindío',   cap: 1500, occ: 1320, supplies: 81 },
                  { name: 'Palacio de los Deportes',  dept: 'Antioquia', cap: 2500, occ: 1920, supplies: 88 },
                  { name: 'Estadio Pascual Guerrero', dept: 'Valle',     cap: 4000, occ: 2840, supplies: 93 },
                  { name: 'Aeropuerto El Dorado (acopio)', dept: 'Bogotá', cap: 0, occ: 0, supplies: 100 },
                ].map(sh => {
                  const occPct = sh.cap > 0 ? Math.round((sh.occ / sh.cap) * 100) : 0
                  return (
                    <div key={sh.name} className="rounded-xl border border-line bg-canvas p-4">
                      <p className="text-sm font-semibold text-ink">{sh.name}</p>
                      <p className="text-xs text-ink-muted mb-3">{sh.dept}</p>
                      {sh.cap > 0 && (
                        <div className="mb-2">
                          <div className="flex justify-between text-10 text-ink-muted mb-1">
                            <span>{t('aq.shelter.occupancy', { occ: nf(sh.occ), cap: nf(sh.cap) })}</span>
                            <span className="font-mono font-medium">{occPct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-ground">
                            <div className="h-full rounded-full" style={{ width: `${occPct}%`, backgroundColor: occPct >= 90 ? '#f97316' : '#0891b2' }} />
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between text-10 text-ink-muted mb-1">
                          <span>{t('aq.shelter.supplies')}</span><span className="font-mono font-medium">{sh.supplies}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-ground">
                          <div className="h-full rounded-full" style={{ width: `${sh.supplies}%`, backgroundColor: sh.supplies >= 80 ? '#059669' : sh.supplies >= 50 ? '#f59e0b' : '#e11d48' }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </div>
        )}

        {/* ══ TAB: LÍNEA DE TIEMPO ════════════════════════════════════ */}
        {activeTab === 'timeline' && (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-ink">{t('aq.timeline.events')}</p>
                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-px bg-line" />
                  <div className="space-y-4">
                    {AQ_TIMELINE.map((ev, i) => {
                      const s = AQ_SEV[ev.sev]
                      const isCurrent = i === AQ_TIMELINE.length - 1
                      return (
                        <div key={i} className="flex gap-4 relative">
                          <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${isCurrent ? 'border-brand-700 bg-brand-700 text-white' : 'border-line bg-surface'}`}>
                            {isCurrent
                              ? <IconMapPin size={14} weight="fill" />
                              : <span className="font-mono text-9 font-bold text-ink-muted">{String(i + 1).padStart(2,'0')}</span>
                            }
                          </div>
                          <div className="min-w-0 flex-1 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-10 font-bold text-ink-muted">{ev.t}</span>
                              <span className="rounded-full px-1.5 py-0.5 text-9 font-bold uppercase" style={{ backgroundColor: s.bg, color: s.text }}>{t(s.key)}</span>
                            </div>
                            <p className={`mt-0.5 text-sm ${isCurrent ? 'font-semibold text-primary-fg' : 'text-ink-soft'}`}>{t(ev.txt)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <VizLineChart series={rescueTimeline} labels={TIMELINE_LABELS}
                  title={t('aq.chart.curveTitle')} sub={t('aq.chart.curveSub')} />
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <p className="text-sm font-semibold text-ink mb-4">{t('aq.urgent.title')}</p>
                  <Accordion items={[
                    { id: 'aq-sar', title: t('aq.urgent.sar'), content: <div className="space-y-2 text-sm text-ink-soft"><p>{t('aq.urgent.sarBody')}</p><Badge severity="danger" dot>{t('aq.prio.high')}</Badge></div> },
                    { id: 'aq-med', title: t('aq.urgent.med'), content: <div className="space-y-2 text-sm text-ink-soft"><p>{t('aq.urgent.medBody')}</p><Badge severity="warning" dot>{t('aq.prio.medium')}</Badge></div> },
                    { id: 'aq-evac', title: t('aq.urgent.evac'), content: <div className="space-y-2 text-sm text-ink-soft"><p>{t('aq.urgent.evacBody')}</p><Badge severity="warning" dot>{t('aq.prio.medium')}</Badge></div> },
                    { id: 'aq-svc', title: t('aq.urgent.svc'), content: <div className="space-y-2 text-sm text-ink-soft"><p>{t('aq.urgent.svcBody')}</p><Badge severity="secondary" dot>{t('aq.prio.follow')}</Badge></div> },
                    { id: 'aq-comms', title: t('aq.urgent.comms'), content: <div className="space-y-2 text-sm text-ink-soft"><p>{t('aq.urgent.commsBody')}</p><Badge severity="secondary" dot>{t('aq.prio.follow')}</Badge></div> },
                  ]} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Disclaimer footer ───────────────────────────────────────── */}
        <Divider />
        <div className="rounded-2xl border border-warning-border bg-warning-soft p-5 text-sm text-warning-fg">
          <p className="font-semibold mb-1">{t('aq.disc.title')}</p>
          <p className="text-warning-fg leading-relaxed">{t('aq.disc.body', { sgc: '\u0001', ungrd: '\u0002' }).split(/(\u0001|\u0002)/).map((part, i) => part === '\u0001' ? <strong key={i}>{t('aq.disc.sgc')}</strong> : part === '\u0002' ? <strong key={i}>{t('aq.disc.ungrd')}</strong> : part)}</p>
        </div>

      </div>

      {/* ── Detail modal ─────────────────────────────────────────────── */}
      {detailDeptData && <DeptModal dept={detailDeptData} onClose={() => setDetailModal(null)} />}

      {/* ── Live update toasts ───────────────────────────────────────── */}
      <ToastStack toasts={toasts.map(x => ({ id: x.id, description: t(`aq.upd.${x.msg}` as Key), severity: x.severity, title: t('aq.toastTitle') }))} onDismiss={dismissToast} />
    </div>
  )
}
