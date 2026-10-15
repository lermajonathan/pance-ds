import { SegmentedControl } from '../components'
import { IconGlobe } from '../icons'
import { LANGS, useI18n } from '../i18n'

export function LanguageSwitch({ variant }: { variant: 'header' | 'icon' | 'block' }) {
  const { lang, setLang, t } = useI18n()
  const other = LANGS.find((l) => l.code !== lang)!
  const current = LANGS.find((l) => l.code === lang)!

  if (variant === 'header') {
    return (
      <div className="shrink-0">
        <SegmentedControl size="sm" label={t('shell.language')} value={lang} onChange={setLang} options={LANGS.map((l) => ({ value: l.code, label: l.short }))} />
      </div>
    )
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => setLang(other.code)}
        aria-label={`${current.short} · ${t('shell.switchTo', { name: other.name })}`}
        className="pance-focus ml-auto inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-ink-soft"
      >
        <IconGlobe size={18} aria-hidden />
        <span className="font-mono text-xs font-semibold">{current.short}</span>
      </button>
    )
  }

  return (
    <div role="group" aria-label={t('shell.language')} className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-canvas p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-pressed={l.code === lang}
          onClick={() => setLang(l.code)}
          className={`pance-focus h-9 rounded-lg text-sm font-medium transition-colors ${l.code === lang ? 'bg-surface text-brand-700 shadow-sm ring-1 ring-line' : 'text-ink-muted hover:text-ink-soft'}`}
        >
          {l.name}
        </button>
      ))}
    </div>
  )
}
