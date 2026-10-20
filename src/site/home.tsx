import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Badge, Button } from '../components'
import { Code as CodeIcon } from '@phosphor-icons/react'
import type { IconType } from '../icons'
import ConsoleExample from './console-example'
import { CoverageSection, PillarsSection } from './home-sections'
import { GetStartedSection, HeroLinks } from './get-started'
import { VERSION } from './version'
import { useI18n } from '../i18n'
import type { Key } from '../i18n'
import {
  IconArrowRight,
  IconPalette,
  IconTypography,
  IconColumns,
  IconGripSquare,
  IconRuler,
  IconComponents,
  IconEdit,
  IconCheckCircle,
  IconUsers,
  IconBell,
  IconChevron,
  IconLayers,
  IconStream,
  IconCards,
  IconArticle,
  IconStar,
  IconChart,
  IconWave,
  IconMapPin,
  IconShield,
  IconGlobe,
  IconHeart,
} from '../icons'

/* ─── Navigation context ────────────────────────────────────────────────── */
export const NavContext = createContext<(key: string) => void>(() => {})
export const useNav = () => useContext(NavContext)

/* ─── Console preview ───────────────────────────────────────────────────── */
const PREVIEW_W = 1280
const PREVIEW_H = 640
const PREVIEW_W_SM = 480
const PREVIEW_H_SM = 600

function ConsolePreview({ onOpen }: { onOpen: () => void }) {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 0.8, w: PREVIEW_W, h: PREVIEW_H })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const cw = e.contentRect.width
      const small = cw < 640
      const w = small ? PREVIEW_W_SM : PREVIEW_W
      setBox({ scale: Math.min(1, cw / w), w, h: small ? PREVIEW_H_SM : PREVIEW_H })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_2px_16px_-4px_color-mix(in_srgb,var(--color-slate-950)_8%,transparent)]">
      <div className="flex items-center gap-3 border-b border-line-soft bg-canvas px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <span className="mx-auto truncate rounded-md bg-surface px-3 py-1 font-mono text-11 text-ink-muted">pance / patterns / console-dashboard</span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-10 text-ink-muted">LIVE</span>
        </span>
      </div>

      <div ref={ref} className="relative w-full overflow-hidden bg-canvas" style={{ height: box.h * box.scale }}>
        <div
          aria-hidden
          inert
          className="pointer-events-none absolute left-0 top-0 origin-top-left select-none p-6"
          style={{ width: box.w, transform: `scale(${box.scale})` }}
        >
          <ConsoleExample />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-fade" />
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <Button severity="primary" onClick={onOpen}>
            {t('home.preview.open')}
            <IconArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const CHIPS: { key: Key; severity: 'primary' | 'help' | 'success' | 'info'; Icon: IconType }[] = [
  { key: 'home.chip.components', severity: 'primary', Icon: IconComponents },
  { key: 'home.chip.severity', severity: 'help', Icon: IconPalette },
  { key: 'home.chip.wcag', severity: 'success', Icon: IconShield },
  { key: 'home.chip.tailwind', severity: 'info', Icon: CodeIcon },
]

/* ══════════════════════════════════════════════════════════════════════════
   HomePage
   ══════════════════════════════════════════════════════════════════════════ */
export function HomePage() {
  const navigate = useNav()
  const { t } = useI18n()

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="pance-hero relative overflow-hidden bg-gradient-hero px-8 py-24 md:py-32">
        {/* Background texture: subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(color-mix(in srgb, var(--hero-grid) 40%, transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb, var(--hero-grid) 40%, transparent) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative mx-auto max-w-[1120px]">
          <div className="flex flex-col gap-6 lg:max-w-[680px]">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-brand shadow-[0_4px_12px_-2px_color-mix(in_srgb,var(--color-brand-600)_60%,transparent)]">
                <IconWave size={14} weight="bold" className="text-white" />
              </div>
              <span className="font-mono text-11 uppercase tracking-[0.22em] text-(--hero-eyebrow)">{t('home.eyebrow')} · v{VERSION}</span>
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-(--hero-fg) md:text-6xl lg:text-7xl">
              {t('home.h1.pre')}{' '}
              <span className="bg-[linear-gradient(to_right,var(--hero-em-from),var(--hero-em-to))] bg-clip-text text-transparent">
                {t('home.h1.em')}
              </span>{' '}
              {t('home.h1.post')}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-(--hero-soft)">
              {t('home.lede')}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button severity="primary" size="lg" onClick={() => navigate('colors')}>
                {t('home.cta.explore')}
                <IconArrowRight size={16} className="ml-1" />
              </Button>
              <button
                onClick={() => navigate('afterquake')}
                className="inline-flex items-center gap-2 rounded-xl border border-(--hero-border) px-5 py-2.5 text-sm font-semibold text-(--hero-soft) transition-colors hover:border-(--hero-border-hover) hover:text-(--hero-fg)"
              >
                {t('home.cta.action')}
              </button>
            </div>
            <HeroLinks />
          </div>

          {/* Floating badges */}
          <div className="absolute right-0 top-8 hidden flex-col gap-2 lg:flex">
            {CHIPS.map(({ key, severity, Icon }) => (
              <span key={key} className="flex justify-end"><Badge size="md" severity={severity} Icon={Icon}>{t(key)}</Badge></span>
            ))}
          </div>
        </div>
      </section>

      <PillarsSection />

      {/* ── Live composition ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-ground from-55% to-surface px-8 pt-16 pb-8 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-11 uppercase tracking-[0.18em] text-ink-brand">{t('home.context.eyebrow')}</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">{t('home.context.title')}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
                {t('home.context.body')}
              </p>
            </div>
            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft shadow-sm transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {t('home.context.full')} <IconArrowRight size={14} />
            </button>
          </div>

          <ConsolePreview onOpen={() => navigate('dashboard')} />
        </div>
      </section>

      <CoverageSection onOpen={() => navigate('dataviz')} />

      <GetStartedSection />

      {/* ── CTA strip ─────────────────────────────────────────────────── */}
      <section className="pance-cta border-t border-line px-8 py-16">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-11 uppercase tracking-[0.2em] text-(--band-eyebrow)">{t('home.start.eyebrow')}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-(--band-fg)">{t('home.start.title')}</h2>
            <p className="mt-1.5 text-sm text-(--band-soft)">{t('home.start.body')}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button severity="primary" onClick={() => navigate('colors')}>
              {t('home.start.color')}
              <IconArrowRight size={14} className="ml-1" />
            </Button>
            <button
              onClick={() => navigate('afterquake')}
              className="inline-flex items-center gap-2 rounded-xl border border-(--band-border) px-4 py-2 text-sm font-semibold text-(--band-soft) transition-colors hover:border-(--band-border-hover) hover:text-(--band-fg)"
            >
              {t('home.start.demo')}
            </button>
          </div>
        </div>
      </section>

      {/* ── Copyright ─────────────────────────────────────────────────── */}
      <section className="pance-foot border-t px-8 py-5">
        <div className="mx-auto flex max-w-[1120px] items-center justify-center">
          <p className="text-center font-mono text-11 text-(--band-soft)">
            © {new Date().getFullYear()} · {t('home.credit.by')}{' '}
            <a
              href="https://ux.jonathanlerma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--band-soft) underline underline-offset-2 transition-colors hover:text-(--band-eyebrow)"
            >
              Jonathan Lerma
            </a>
            {' '}{t('home.credit.post')}
          </p>
        </div>
      </section>

    </div>
  )
}
