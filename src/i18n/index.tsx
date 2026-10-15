import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { shell } from './shell'
import { consoleDict } from './console'
import { ui } from './ui'
import { home } from './home'
import { colors } from './colors'
import { type } from './type'
import { spacing } from './spacing'
import { icons } from './icons'
import { layout } from './layout'
import { buttons } from './buttons'
import { forms } from './forms'
import { selection } from './selection'
import { badges } from './badges'
import { feedback } from './feedback'
import { navigation } from './navigation'
import { overlays } from './overlays'
import { table } from './table'
import { cards } from './cards'
import { content } from './content'
import { metrics } from './metrics'
import { dataviz } from './dataviz'
import { afterquake } from './afterquake'
import { release } from './release'
import { dashboardPage } from './dashboardPage'

export type Lang = 'en' | 'es'
export const LANGS: { code: Lang; short: string; name: string }[] = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'es', short: 'ES', name: 'Español' },
]

/* Register each domain dictionary here: add `...x.en` and `...x.es` (one line each). */
const DICT = {
  en: { ...shell.en, ...release.en, ...consoleDict.en, ...ui.en, ...home.en, ...colors.en, ...type.en, ...spacing.en, ...icons.en, ...layout.en, ...buttons.en, ...forms.en, ...selection.en, ...badges.en, ...feedback.en, ...navigation.en, ...overlays.en, ...table.en, ...cards.en, ...content.en, ...metrics.en, ...dataviz.en, ...afterquake.en, ...dashboardPage.en },
  es: { ...shell.es, ...release.es, ...consoleDict.es, ...ui.es, ...home.es, ...colors.es, ...type.es, ...spacing.es, ...icons.es, ...layout.es, ...buttons.es, ...forms.es, ...selection.es, ...badges.es, ...feedback.es, ...navigation.es, ...overlays.es, ...table.es, ...cards.es, ...content.es, ...metrics.es, ...dataviz.es, ...afterquake.es, ...dashboardPage.es },
}
export type Key = keyof typeof DICT.en

const STORAGE_KEY = 'pance-lang'
export const isLang = (v: unknown): v is Lang => v === 'en' || v === 'es'

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {}
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

type Vars = Record<string, string | number>
type Ctx = {
  lang: Lang
  t: (key: Key, vars?: Vars) => string
  /** Like t(), but `backticked` segments render as inline code. */
  tr: (key: Key, vars?: Vars) => ReactNode
  setLang: (l: Lang) => void
  /** Language-prefixed path for a page key ('home' → /en). */
  path: (page: string) => string
}
const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
  }, [lang])

  const t = useCallback<Ctx['t']>((key, vars) => {
    const s = DICT[lang][key] ?? DICT.en[key] ?? key
    return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s
  }, [lang])

  const tr = useCallback<Ctx['tr']>((key, vars) => (
    <>
      {t(key, vars).split('`').map((part, i) =>
        i % 2 ? <code key={i} className="rounded bg-ground px-1.5 py-0.5 font-mono text-[0.9em] text-ink">{part}</code> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  ), [t])

  const setLang = useCallback((next: Lang) => {
    if (next === lang) return
    const rest = location.pathname.replace(/^\/[^/]+/, '')
    navigate({ pathname: `/${next}${rest}`, search: location.search, hash: location.hash })
  }, [lang, location, navigate])

  const path = useCallback((page: string) => (page === 'home' ? `/${lang}` : `/${lang}/${page}`), [lang])

  const value = useMemo(() => ({ lang, t, tr, setLang, path }), [lang, t, tr, setLang, path])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useI18n must be used inside <LangProvider>')
  return ctx
}
