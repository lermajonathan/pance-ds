import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Badge, Button, type Severity } from '../components'
import { IconArrowRight, IconChart, IconColumns, IconGlobe, IconGripSquare, IconHeart, IconPalette, IconShield, IconWave } from '../icons'
import { useI18n } from '../i18n'
import type { Key } from '../i18n'

/* ─── Pillars: tabbed showcase ─────────────────────────────────────────── */
const ROTATE_MS = 7000
const SEVERITIES: Severity[] = ['primary', 'success', 'warning', 'danger', 'info', 'help', 'secondary', 'contrast']

function Frame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-surface/80 p-4 ring-1 ring-line shadow-[0_1px_2px_color-mix(in_srgb,var(--color-slate-950)_4%,transparent),0_24px_48px_-28px_color-mix(in_srgb,var(--color-slate-950)_28%,transparent)] backdrop-blur-sm sm:p-6 ${className}`}>
      {children}
    </div>
  )
}

function HumanArt() {
  const tiles = [
    { cls: 'bg-brand-700 text-white', ratio: '5.4:1', grade: 'AA' },
    { cls: 'bg-slate-900 text-white ring-1 ring-slate-700', ratio: '17.9:1', grade: 'AAA' },
    { cls: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200', ratio: '5.1:1', grade: 'AA' },
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((x, i) => (
        <div key={i} className={`pance-rise flex aspect-[4/5] flex-col justify-between rounded-2xl p-3 shadow-sm sm:p-4 ${x.cls}`} style={{ animationDelay: `${i * 90}ms` }}>
          <span className="font-display text-3xl font-extrabold leading-none sm:text-5xl">Aa</span>
          <div>
            <p className="font-mono text-11">{x.ratio}</p>
            <p className="mt-1 inline-block rounded-full ring-1 ring-current px-2 py-0.5 font-mono text-10 font-bold">{x.grade}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DataArt() {
  const bars = [38, 56, 44, 72, 63, 88, 76]
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-10 uppercase tracking-[0.16em] text-ink-muted">KPI</p>
          <p className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">12,480</p>
        </div>
        <Badge severity="success" variant="soft">+12.4%</Badge>
      </div>
      <div className="mt-5 flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="pance-rise flex-1 rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-300" style={{ height: `${h}%`, animationDelay: `${i * 60}ms`, opacity: i === 5 ? 1 : 0.7 }} />
        ))}
      </div>
    </div>
  )
}

function OpenArt() {
  const { t } = useI18n()
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-line bg-ground px-4 py-2">
          <IconGlobe size={14} className="text-ink-brand" />
          <span className="min-w-0 truncate font-mono text-11 text-ink-muted">pance / design-system</span>
          <span className="ml-auto shrink-0"><Badge severity="success" variant="soft" size="sm">{t('shell.openSource')}</Badge></span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-ink-soft">{'<Button severity="primary">\n  Ship it\n</Button>'}</pre>
      </div>
      <div className="pance-rise flex items-center gap-3 pl-4">
        <span aria-hidden className="h-6 w-px bg-line" />
        <Button severity="primary" size="sm">Ship it</Button>
      </div>
    </div>
  )
}

function SeverityArt() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {SEVERITIES.map((s, i) => (
        <div key={s} className="pance-rise flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-3 shadow-sm" style={{ animationDelay: `${i * 50}ms` }}>
          <Badge severity={s} variant="solid" dot>{s}</Badge>
          <div className="h-1.5 w-full rounded-full bg-line-soft"><div className="h-full rounded-full bg-ink/70" style={{ width: `${30 + ((i * 17) % 60)}%` }} /></div>
        </div>
      ))}
    </div>
  )
}

const PILLARS: { id: string; Icon: typeof IconHeart; title: Key; body: Key; Art: () => ReactNode }[] = [
  { id: 'human', Icon: IconHeart, title: 'home.pillar.human.title', body: 'home.pillar.human.body', Art: HumanArt },
  { id: 'data', Icon: IconChart, title: 'home.pillar.data.title', body: 'home.pillar.data.body', Art: DataArt },
  { id: 'open', Icon: IconGlobe, title: 'home.pillar.open.title', body: 'home.pillar.open.body', Art: OpenArt },
  { id: 'severity', Icon: IconShield, title: 'home.pillar.severity.title', body: 'home.pillar.severity.body', Art: SeverityArt },
]

export function PillarsSection() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const auto = !paused && !manual && !reduced

  useEffect(() => {
    if (!auto) return
    const id = setTimeout(() => setActive((a) => (a + 1) % PILLARS.length), ROTATE_MS)
    return () => clearTimeout(id)
  }, [auto, active])

  const current = PILLARS[active]
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + PILLARS.length) % PILLARS.length
    setManual(true)
    setActive(n)
    document.getElementById(`pillar-tab-${PILLARS[n].id}`)?.focus()
  }

  return (
    <section className="border-b border-line bg-surface px-5 py-14 sm:px-8 sm:py-32" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="mx-auto max-w-[1120px]">
        <div role="tablist" className="grid grid-cols-2 gap-1.5 rounded-3xl border border-line bg-canvas p-1.5 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const on = i === active
            return (
              <button
                key={p.id}
                id={`pillar-tab-${p.id}`}
                role="tab"
                aria-selected={on}
                aria-controls="pillar-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => { setManual(true); setActive(i) }}
                onKeyDown={(e) => onKey(e, i)}
                className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-[1.25rem] px-3 py-3 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-4 ${on ? 'bg-surface shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-slate-950)_35%,transparent)] ring-1 ring-line' : 'text-ink-muted hover:bg-surface/60 hover:text-ink'}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${on ? 'bg-primary-solid text-primary-on-solid' : 'bg-primary-soft text-primary-fg'}`}>
                  <p.Icon size={18} weight="duotone" />
                </span>
                <span className={`min-w-0 text-13 font-semibold leading-snug sm:text-sm ${on ? 'text-ink' : ''}`}>{t(p.title)}</span>
                {on && auto && <span key={`${active}-bar`} aria-hidden className="pance-fill absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" style={{ ['--pance-dur' as string]: `${ROTATE_MS}ms` }} />}
              </button>
            )
          })}
        </div>

        <div id="pillar-panel" role="tabpanel" aria-labelledby={`pillar-tab-${current.id}`} key={current.id} className="mt-8 grid items-center gap-8 lg:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div className="grid">
            {PILLARS.map((p, i) => {
              const on = i === active
              return (
                <div key={p.id} aria-hidden={!on} inert={!on} className={`col-start-1 row-start-1 ${on ? 'pance-rise' : 'invisible'}`}>
                  <p className="font-mono text-11 tracking-[0.18em] text-ink-brand">{String(i + 1).padStart(2, '0')} / {String(PILLARS.length).padStart(2, '0')}</p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{t(p.title)}</h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">{t(p.body)}</p>
                </div>
              )
            })}
          </div>
          {/* All frames stack in one cell so the section reserves the tallest height; each frame keeps its natural height. */}
          <div className="grid items-center">
            {PILLARS.map((p, i) => (
              <Frame key={p.id} className={`col-start-1 row-start-1 ${i === active ? '' : 'invisible'}`}>
                <div aria-hidden={i !== active}><p.Art /></div>
              </Frame>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Coverage: expanding chart panels ─────────────────────────────────── */
type Tone = { accent: string; text: string; glow: string; pill: string }
const TONES: Record<string, Tone> = {
  brand: { accent: 'text-primary-fg', text: 'text-primary-fg', glow: 'from-primary-soft', pill: 'bg-primary-soft text-primary-fg ring-primary-border' },
  violet: { accent: 'text-help-fg', text: 'text-help-fg', glow: 'from-help-soft', pill: 'bg-help-soft text-help-fg ring-help-border' },
  emerald: { accent: 'text-success-fg', text: 'text-success-fg', glow: 'from-success-soft', pill: 'bg-success-soft text-success-fg ring-success-border' },
  amber: { accent: 'text-warning-fg', text: 'text-warning-fg', glow: 'from-warning-soft', pill: 'bg-warning-soft text-warning-fg ring-warning-border' },
}

type Kind = 'line' | 'bars' | 'donut' | 'graph'
const COVERAGE: { group: Key; tone: keyof typeof TONES; kind: Kind; items: Key[] }[] = [
  { group: 'home.viz.trends', tone: 'brand', kind: 'line', items: ['home.viz.trends.1', 'home.viz.trends.2', 'home.viz.trends.3', 'home.viz.trends.4'] },
  { group: 'home.viz.compare', tone: 'violet', kind: 'bars', items: ['home.viz.compare.1', 'home.viz.compare.2', 'home.viz.compare.3', 'home.viz.compare.4'] },
  { group: 'home.viz.parts', tone: 'emerald', kind: 'donut', items: ['home.viz.parts.1', 'home.viz.parts.2', 'home.viz.parts.3', 'home.viz.parts.4'] },
  { group: 'home.viz.links', tone: 'amber', kind: 'graph', items: ['home.viz.links.1', 'home.viz.links.2', 'home.viz.links.3', 'home.viz.links.4'] },
]

/* Small live chart previews — the content replaces the icon. */
function ChartArt({ kind, on }: { kind: Kind; on: boolean }) {
  const ease = 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
  if (kind === 'line') {
    const d = 'M0 70 C30 64 45 40 75 46 S120 72 150 50 S200 14 240 22 S290 40 320 12'
    return (
      <svg viewBox="0 0 320 90" className="h-full w-full overflow-visible" preserveAspectRatio="none">
        <defs><linearGradient id="pz-l" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".22" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
        <path d={`${d} L320 90 L0 90Z`} fill="url(#pz-l)" className={`${ease} ${on ? 'opacity-100' : 'opacity-40'}`} />
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 0.35} className={ease} />
      </svg>
    )
  }
  if (kind === 'bars') {
    const v = [42, 68, 54, 88, 36, 74, 60, 96]
    return (
      <div className="flex h-full items-end gap-[6%]">
        {v.map((n, i) => (
          <span key={i} className={`flex-1 rounded-t-md bg-current ${ease}`} style={{ height: `${on ? n : n * 0.45}%`, opacity: i === 7 ? 1 : 0.28 + i * 0.06, transitionDelay: `${i * 40}ms` }} />
        ))}
      </div>
    )
  }
  if (kind === 'donut') {
    const segs = [0.42, 0.26, 0.18, 0.14]
    let acc = 0
    return (
      <svg viewBox="0 0 100 100" className="mx-auto h-full -rotate-90">
        {segs.map((s, i) => {
          const el = <circle key={i} cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="11" pathLength={1} strokeDasharray={`${on ? s - 0.015 : 0.0001} 1`} strokeDashoffset={-acc} opacity={1 - i * 0.22} className={ease} style={{ transitionDelay: `${i * 80}ms` }} />
          acc += s
          return el
        })}
      </svg>
    )
  }
  const n = [[20, 60], [70, 20], [120, 70], [170, 30], [230, 62], [290, 24], [150, 10]]
  const e = [[0, 1], [1, 2], [1, 6], [2, 3], [3, 4], [4, 5], [3, 6], [2, 4]]
  return (
    <svg viewBox="0 0 310 90" className="h-full w-full overflow-visible">
      {e.map(([a, b], i) => <line key={i} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} stroke="currentColor" strokeWidth="1.5" className={ease} opacity={on ? 0.4 : 0.15} />)}
      {n.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={on ? (i === 3 ? 7 : 4.5) : 3} fill="currentColor" className={ease} opacity={i === 3 ? 1 : 0.7} />)}
    </svg>
  )
}

export function CoverageSection({ onOpen }: { onOpen: () => void }) {
  const { t } = useI18n()
  const [active, setActive] = useState(0)

  return (
    <section className="relative overflow-hidden bg-surface px-5 pb-24 pt-16 sm:px-8 sm:pb-48 sm:pt-36">
      <ParticleField />
      <div className="relative mx-auto max-w-[1120px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 sm:mb-16">
          <div className="min-w-0 max-w-xl">
            <p className="font-mono text-11 uppercase tracking-[0.18em] text-ink-brand">{t('home.coverage.eyebrow')}</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t('home.coverage.title')}</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">{t('home.coverage.lede')}</p>
          </div>
          <Button severity="primary" onClick={onOpen}>
            {t('home.coverage.cta')}
            <IconArrowRight size={14} className="ml-1" />
          </Button>
        </div>

        <div className="flex flex-col gap-3 lg:h-[24rem] lg:flex-row">
          {COVERAGE.map(({ group, tone, kind, items }, i) => {
            const on = i === active
            const c = TONES[tone]
            return (
              <div
                key={group}
                role="group"
                aria-label={t(group)}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative flex min-w-0 cursor-default flex-col overflow-hidden rounded-[28px] bg-surface/80 p-6 ring-1 outline-none backdrop-blur-sm transition-[flex-grow,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-brand-500 lg:basis-0 ${on ? 'ring-line shadow-[0_1px_2px_color-mix(in_srgb,var(--color-slate-950)_4%,transparent),0_24px_48px_-28px_color-mix(in_srgb,var(--color-slate-950)_28%,transparent)] lg:flex-[3.2]' : 'ring-line lg:flex-1'}`}
              >
                <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${c.glow} to-transparent transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`} />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-11 tracking-[0.14em] text-ink-muted">0{i + 1}</span>
                  <span className={`h-2 w-2 rounded-full bg-current ${c.accent} transition-transform duration-500 ${on ? 'scale-100' : 'scale-75 opacity-50'}`} />
                </div>

                <h3 className={`relative mt-3 font-display text-xl font-bold tracking-tight text-ink lg:min-w-[16rem] ${on ? '' : 'lg:hidden'}`}>{t(group)}</h3>
                <ul className={`relative mt-4 flex flex-wrap gap-1.5 transition-all duration-500 lg:min-w-[16rem] ${on ? 'lg:opacity-100' : 'lg:pointer-events-none lg:opacity-0'}`}>
                  {items.map((item, k) => (
                    <li key={item} className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${c.pill} ${on ? 'lg:animate-[pance-rise_0.5s_both]' : ''}`} style={on ? { animationDelay: `${k * 50 + 100}ms` } : undefined}>
                      {t(item)}
                    </li>
                  ))}
                </ul>

                {!on && (
                  <p aria-hidden className="absolute left-6 top-16 hidden font-display text-lg font-bold tracking-tight text-ink-soft [writing-mode:vertical-rl] lg:block">{t(group)}</p>
                )}

                <div className={`relative mt-6 h-24 lg:mt-auto ${c.accent} ${on ? 'lg:h-36' : 'lg:h-20'} transition-[height] duration-500`}>
                  <ChartArt kind={kind} on={on} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Ambient particle field: drifting data points ─────────────────────── */
function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const COLORS = ['8,145,178', '8,145,178', '8,145,178', '139,92,246', '16,185,129']
    const dots = Array.from({ length: 300 }, (_, i) => ({
      x: Math.random(), y: Math.random(), r: 1.2 + Math.random() * 2,
      a: 0.45 + Math.random() * 0.4, sp: 0.3 + Math.random() * 0.9, ph: Math.random() * 6.28,
      c: COLORS[i % COLORS.length], ring: i % 12 === 0,
    }))
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      const t = time / 1000
      for (const d of dots) {
        const x = ((d.x + t * 0.006 * d.sp) % 1) * w
        const y = (d.y + Math.sin(t * 0.3 * d.sp + d.ph) * 0.012) * h
        const o = d.a * (0.65 + 0.35 * Math.sin(t * 0.6 * d.sp + d.ph))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${d.c},${o})`
        ctx.arc(x, y, d.r, 0, 6.283)
        ctx.fill()
        if (d.ring) {
          const p = (t * 0.25 * d.sp + d.ph) % 1
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${d.c},${0.5 * (1 - p)})`
          ctx.lineWidth = 1.25
          ctx.arc(x, y, 2 + p * 12, 0, 6.283)
          ctx.stroke()
        }
      }
    }
    const loop = (time: number) => {
      if (visible) draw(time)
      raf = requestAnimationFrame(loop)
    }
    resize()
    draw(0)
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    if (!still) raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 85%, transparent)' }}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
