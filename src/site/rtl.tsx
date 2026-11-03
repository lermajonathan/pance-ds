import { useState } from 'react'
import { Button, Card, Input, Pagination, RangeSlider, Tabs, Toggle, Tooltip } from '../components'
import { IconSearch } from '../icons'
import { useI18n } from '../i18n'
import { Page } from './showcase'

/* ═════════════════════════════════════════════════════════════════
   Right-to-left support (DDR-DS-031)
   The demo renders the same components twice; only `dir` differs.
   Arabic strings are demo content, like the names in other pages.
   ═════════════════════════════════════════════════════════════════ */

const AR = {
  search: 'بحث',
  tabs: ['الكل', 'النشطة', 'المؤرشفة'],
  alerts: 'التنبيهات',
  volume: 'مستوى الصوت',
}

function Sample({ dir }: { dir: 'ltr' | 'rtl' }) {
  const { t } = useI18n()
  const ar = dir === 'rtl'
  const tabs = ar ? AR.tabs : ['All', 'Active', 'Archived']
  const [tab, setTab] = useState(tabs[0])
  const [on, setOn] = useState(true)
  const [vol, setVol] = useState(40)
  const [page, setPage] = useState(2)
  const alerts = ar ? AR.alerts : t('rtl.try.alerts')
  const volume = ar ? AR.volume : t('rtl.try.volume')
  return (
    <div dir={dir} lang={ar ? 'ar' : 'en'} className="flex min-w-0 flex-col gap-5 rounded-xl border border-line bg-canvas p-5">
      <p className="font-mono text-11 font-medium uppercase tracking-[0.18em] text-ink-muted">{t(ar ? 'rtl.try.rtl' : 'rtl.try.ltr')}</p>
      <Input Icon={IconSearch} placeholder={ar ? AR.search : t('rtl.try.search')} aria-label={ar ? AR.search : t('rtl.try.search')} />
      <Tabs tabs={tabs} value={tab} onChange={setTab} label={ar ? AR.search : t('rtl.try.search')} />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-ink">{alerts}</span>
        <Toggle on={on} onChange={setOn} label={alerts} />
      </div>
      <div>
        <p className="mb-2 text-sm text-ink">{volume}</p>
        <RangeSlider value={vol} onChange={setVol} label={volume} valueText={`${vol}%`} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Tooltip label={t('rtl.try.tooltipStart')} placement="start"><Button variant="outlined" severity="secondary" size="sm">{t('rtl.try.start')}</Button></Tooltip>
        <Tooltip label={t('rtl.try.tooltipEnd')} placement="end"><Button variant="outlined" severity="secondary" size="sm">{t('rtl.try.end')}</Button></Tooltip>
      </div>
      <Pagination page={page} pages={5} onChange={setPage} compact label={t(ar ? 'rtl.try.paginationRtl' : 'rtl.try.pagination')} />
    </div>
  )
}

// rtl-exempt: the table documents the physical names, so they appear as text
const MAP: [string, string][] = [
  ['pl-4 · pr-4', 'ps-4 · pe-4'], // rtl-exempt: documentation text, not a class
  ['ml-2 · mr-2', 'ms-2 · me-2'], // rtl-exempt: documentation text, not a class
  ['left-0 · right-0', 'start-0 · end-0'], // rtl-exempt: documentation text, not a class
  ['text-left · text-right', 'text-start · text-end'], // rtl-exempt: documentation text, not a class
  ['border-l · border-r', 'border-s · border-e'], // rtl-exempt: documentation text, not a class
  ['rounded-l-xl · rounded-r-xl', 'rounded-s-xl · rounded-e-xl'], // rtl-exempt: documentation text, not a class
]

const SNIPPETS = [
  { key: 'rtl.use.page', code: '<html lang="ar" dir="rtl">' },
  { key: 'rtl.use.scope', code: '<section dir="rtl">\n  <Input Icon={IconSearch} />\n</section>' },
] as const

export function RtlPage() {
  const { t } = useI18n()
  const mirrors = ['m1', 'm2', 'm3', 'm4', 'm5'] as const
  const stays = ['s1', 's2', 's3', 's4'] as const
  return (
    <Page eyebrow={t('nav.group.foundations')} title={t('nav.rtl')} lead={t('rtl.lead')}>
      <section aria-labelledby="rtl-try" className="space-y-4">
        <div>
          <h2 id="rtl-try" className="font-display text-xl font-bold tracking-tight text-ink">{t('rtl.try.title')}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('rtl.try.desc')}</p>
        </div>
        <div dir="ltr" className="grid gap-6 lg:grid-cols-2">
          <Sample dir="ltr" />
          <Sample dir="rtl" />
        </div>
      </section>

      <section aria-labelledby="rtl-use" className="space-y-4">
        <div>
          <h2 id="rtl-use" className="font-display text-xl font-bold tracking-tight text-ink">{t('rtl.use.title')}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('rtl.use.desc')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {SNIPPETS.map((s) => (
            <Card key={s.key} className="min-w-0 p-5">
              <p className="mb-2 text-sm font-semibold text-ink">{t(s.key)}</p>
              <pre dir="ltr" className="overflow-x-auto rounded-lg bg-ground p-3 text-start font-mono text-xs leading-relaxed text-ink-soft">{s.code}</pre>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="rtl-rules" className="space-y-4">
        <div>
          <h2 id="rtl-rules" className="font-display text-xl font-bold tracking-tight text-ink">{t('rtl.rules.title')}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('rtl.rules.desc')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink">{t('rtl.rules.mirrors')}</h3>
            <ul className="space-y-2 ps-5 text-sm leading-relaxed text-ink-soft [list-style:disc]">
              {mirrors.map((k) => <li key={k}>{t(`rtl.rules.${k}`)}</li>)}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink">{t('rtl.rules.stays')}</h3>
            <ul className="space-y-2 ps-5 text-sm leading-relaxed text-ink-soft [list-style:disc]">
              {stays.map((k) => <li key={k}>{t(`rtl.rules.${k}`)}</li>)}
            </ul>
          </Card>
        </div>
      </section>

      <section aria-labelledby="rtl-map" className="space-y-4">
        <div>
          <h2 id="rtl-map" className="font-display text-xl font-bold tracking-tight text-ink">{t('rtl.map.title')}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('rtl.map.desc')}</p>
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-4 py-3 text-start font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('rtl.map.physical')}</th>
                <th scope="col" className="px-4 py-3 text-start font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('rtl.map.logical')}</th>
              </tr>
            </thead>
            <tbody>
              {MAP.map(([from, to]) => (
                <tr key={from} className="border-b border-line-soft last:border-0">
                  <td dir="ltr" className="px-4 py-2.5 text-start font-mono text-ink-muted">{from}</td>
                  <td dir="ltr" className="px-4 py-2.5 text-start font-mono font-medium text-ink">{to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section aria-labelledby="rtl-contrib" className="space-y-3">
        <h2 id="rtl-contrib" className="font-display text-xl font-bold tracking-tight text-ink">{t('rtl.contrib.title')}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{t('rtl.contrib.desc')}</p>
      </section>
    </Page>
  )
}
