import type { ReactNode } from 'react'
import { Check, X } from '@phosphor-icons/react'
import { Card } from '../components'
import { IconWave } from '../icons'
import { useI18n, type Key } from '../i18n'
import { Page, Section } from './showcase'

/* ─── Foundations › Gradients ─────────────────────────────────────────────
   The four gradient tokens (gradient.brand, .hero, .surface-soft, .fade), live in the current theme. */

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 font-mono text-10 uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="min-w-0 truncate font-mono text-11 text-ink">{children}</dd>
    </div>
  )
}

function GradientCard({ name, desc, token, preview }: { name: string; desc: string; token: string; preview: ReactNode }) {
  const { t } = useI18n()
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="relative h-44 overflow-hidden rounded-xl border border-line">{preview}</div>
      <div>
        <h3 className="font-display text-base font-bold tracking-tight text-ink">{name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{desc}</p>
      </div>
      <dl className="mt-auto space-y-1.5 border-t border-line-soft pt-3">
        <Fact label={t('gradients.token')}>gradient.{token}</Fact>
        <Fact label={t('gradients.utility')}>bg-gradient-{token}</Fact>
        <Fact label={t('gradients.css')}>--pance-gradient-{token}</Fact>
      </dl>
    </Card>
  )
}

function Rule({ ok, children }: { ok: boolean; children: ReactNode }) {
  const Icon = ok ? Check : X
  return (
    <li className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
      <Icon size={16} weight="bold" aria-hidden className={`mt-0.5 shrink-0 ${ok ? 'text-success' : 'text-danger'}`} />
      <span>{children}</span>
    </li>
  )
}

function Code({ children }: { children: string }) {
  return <pre className="whitespace-pre-wrap break-words rounded-xl border border-line bg-canvas p-4 font-mono text-xs leading-relaxed text-ink"><code>{children}</code></pre>
}

export function GradientsPage() {
  const { t } = useI18n()
  return (
    <Page eyebrow={t('nav.group.foundations')} title={t('nav.gradients')} lead={t('gradients.lead')}>
      <Section title={t('gradients.set.title')} hint={t('gradients.set.hint')}>
        <div className="grid gap-6 md:grid-cols-2">
          <GradientCard
            name={t('gradients.brand.name')}
            desc={t('gradients.brand.desc')}
            token="brand"
            preview={
              <div className="grid h-full place-items-center bg-surface">
                <div className="flex items-end gap-4">
                  {[56, 40, 28].map((px) => (
                    <div key={px} className="grid place-items-center rounded-xl bg-gradient-brand text-white" style={{ width: px, height: px }}>
                      <IconWave size={Math.round(px * 0.45)} weight="bold" />
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <GradientCard
            name={t('gradients.hero.name')}
            desc={t('gradients.hero.desc')}
            token="hero"
            preview={
              <div className="flex h-full flex-col justify-center bg-gradient-hero px-6">
                <p className="font-display text-2xl font-extrabold tracking-tight text-ink">{t('gradients.hero.title')}</p>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink-soft">{t('gradients.hero.body')}</p>
              </div>
            }
          />
          <GradientCard
            name={t('gradients.soft.name')}
            desc={t('gradients.soft.desc')}
            token="surface-soft"
            preview={
              <div className="grid h-full place-items-center bg-canvas p-5">
                <div className="w-full max-w-xs rounded-2xl border border-line bg-gradient-surface-soft p-5">
                  <p className="text-sm font-semibold text-ink">{t('gradients.soft.title')}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t('gradients.soft.body')}</p>
                </div>
              </div>
            }
          />
          <GradientCard
            name={t('gradients.fade.name')}
            desc={t('gradients.fade.desc')}
            token="fade"
            preview={
              <div className="relative h-full bg-canvas">
                <ul aria-hidden className="space-y-2 p-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                      <span className="size-5 shrink-0 rounded-full bg-primary-soft" />
                      <span className="text-xs text-ink-soft">{t('gradients.fade.row')} {i + 1}</span>
                    </li>
                  ))}
                </ul>
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-fade" />
              </div>
            }
          />
        </div>
      </Section>

      <Section title={t('gradients.rules.title')} hint={t('gradients.rules.hint')}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-mono text-11 uppercase tracking-wider text-ink-muted">{t('gradients.rules.do')}</h3>
            <ul className="mt-3 space-y-3">
              {(['gradients.do.1', 'gradients.do.2', 'gradients.do.3'] as Key[]).map((k) => <Rule key={k} ok>{t(k)}</Rule>)}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="font-mono text-11 uppercase tracking-wider text-ink-muted">{t('gradients.rules.dont')}</h3>
            <ul className="mt-3 space-y-3">
              {(['gradients.dont.1', 'gradients.dont.2', 'gradients.dont.3'] as Key[]).map((k) => <Rule key={k} ok={false}>{t(k)}</Rule>)}
            </ul>
          </Card>
        </div>
      </Section>

      <Section title={t('gradients.use.title')} hint={t('gradients.use.hint')}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="font-mono text-11 uppercase tracking-wider text-ink-muted">{t('gradients.use.css')}</p>
            <Code>{`.hero {\n  background-image: var(--pance-gradient-hero);\n}`}</Code>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-11 uppercase tracking-wider text-ink-muted">{t('gradients.use.tw')}</p>
            <Code>{`<section className="bg-gradient-hero">…</section>\n<span className="bg-gradient-brand">…</span>`}</Code>
          </div>
        </div>
      </Section>

      <Section title={t('gradients.figma.title')}>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{t('gradients.figma.body')}</p>
      </Section>
    </Page>
  )
}
