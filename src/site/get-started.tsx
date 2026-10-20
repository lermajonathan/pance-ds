import { useState } from 'react'
import { GithubLogo, Package, FigmaLogo, ClockCounterClockwise, Copy, Check, ArrowUpRight } from '@phosphor-icons/react'
import { useI18n, type Key } from '../i18n'
import { LINKS, VERSION } from './version'

/* ─── Copyable code block ──────────────────────────────────────────────── */
function Snippet({ code, label }: { code: string; label: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }).catch(() => {})
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="font-mono text-11 uppercase tracking-[0.16em] text-slate-400">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
        >
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
          <span aria-live="polite">{copied ? t('home.install.copied') : t('home.install.copy')}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed text-slate-200"><code>{code}</code></pre>
    </div>
  )
}

/* ─── Small external links used in the hero ────────────────────────────── */
export function HeroLinks() {
  const { t } = useI18n()
  const items = [
    { href: LINKS.github, label: t('home.links.github'), Icon: GithubLogo },
    { href: LINKS.npmReact, label: t('home.links.npm'), Icon: Package },
    { href: LINKS.figma, label: t('home.links.figma'), Icon: FigmaLogo },
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
      {items.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400"
        >
          <Icon size={16} />
          {label}
          <span className="sr-only">{t('home.links.newTab')}</span>
        </a>
      ))}
    </div>
  )
}

/* ─── Get started: install + resources ─────────────────────────────────── */
const RESOURCES: { key: string; href: string; Icon: typeof GithubLogo; meta?: string }[] = [
  { key: 'github', href: LINKS.github, Icon: GithubLogo },
  { key: 'npm', href: LINKS.npmReact, Icon: Package, meta: `v${VERSION}` },
  { key: 'figma', href: LINKS.figma, Icon: FigmaLogo },
  { key: 'changelog', href: LINKS.changelog, Icon: ClockCounterClockwise },
]

export function GetStartedSection() {
  const { t } = useI18n()
  return (
    <section id="get-started" className="border-t border-line bg-ground px-8 py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <p className="font-mono text-11 uppercase tracking-[0.18em] text-brand-700">{t('home.install.eyebrow')}</p>
        <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">{t('home.install.title')}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('home.install.lede')}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {([
            ['1', 'home.install.s1', 'home.install.s1.body', 'Terminal', 'pnpm add @pance/react @pance/tokens'],
            ['2', 'home.install.s2', 'home.install.s2.body', 'main.tsx', "import '@pance/react/styles.css'"],
            ['3', 'home.install.s3', 'home.install.s3.body', 'App.tsx', "import { Button } from '@pance/react'\n\n<Button severity=\"primary\">\n  New stream\n</Button>"],
          ] as const).map(([n, title, body, label, code]) => (
            <div key={n} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-brand-700">{n}</span>
                <h3 className="text-base font-semibold text-ink">{t(title as Key)}</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{t(body as Key)}</p>
              <Snippet label={label} code={code} />
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map(({ key, href, Icon, meta }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-sm transition-colors hover:border-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon size={22} /></span>
                <ArrowUpRight size={16} className="text-ink-muted transition-colors group-hover:text-brand-700" />
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {t(`home.res.${key}.title` as Key)}
                  {meta && <span className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-10 text-brand-700">{meta}</span>}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{t(`home.res.${key}.body` as Key)}</p>
              </div>
              <span className="sr-only">{t('home.links.newTab')}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
