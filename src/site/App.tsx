import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Link, Outlet, RouterProvider, createBrowserRouter, createHashRouter, redirect, useParams, useNavigate } from 'react-router'
import {
  IconArticle,
  IconBell,
  IconList,
  IconX,
  IconCards,
  IconCheckCircle,
  IconChevron,
  IconColumns,
  IconComponents,
  IconEdit,
  IconGripSquare,
  IconHome,
  IconLayers,
  IconPalette,
  IconRuler,
  IconStar,
  IconStream,
  IconTypography,
  IconUsers,
  IconWave,
  IconChart,
  IconMapPin,
  IconMoon,
  IconSun,
  type IconType as IconComp,
} from '../icons'
import { Badge, Button, PanceProvider, ThemeToggle, useTheme, type PanceLabels } from '../components'
import {
  BadgesPage,
  ButtonsPage,
  ColorsPage,
  DashboardPage,
  CardsPage,
  ContentPage,
  DataVizPage,
  FeedbackPage,
  FormsPage,
  IconsPage,
  LayoutPage,
  MetricsPage,
  NavigationPage,
  OverlaysPage,
  SelectionPage,
  SpacingPage,
  TablePage,
  TypographyPage,
  AfterQuakePage,
} from './showcase'
import { HomePage, NavContext } from './home'
import { LangProvider, detectLang, isLang, useI18n, type Key } from '../i18n'
import { LanguageSwitch } from './language-switch'
import { HeaderSearch } from './header-search'
import { NotificationsBell } from './notifications'
import { GithubLogo } from '@phosphor-icons/react'
import { LINKS, VERSION } from './version'

/* ═══════════════════════════════════════════════════════════════════════
   PANCE — design system explorer shell
   ═══════════════════════════════════════════════════════════════════════ */
type Entry = { key: string; labelKey: Key; Icon: IconComp; Page: () => ReactNode; topLevel?: boolean }
type Group = { titleKey?: Key; items: Entry[]; topLevel?: boolean }

const NAV: Group[] = [
  {
    topLevel: true,
    items: [
      { key: 'home', labelKey: 'nav.home', Icon: IconHome, Page: HomePage, topLevel: true },
    ],
  },
  {
    titleKey: 'nav.group.foundations',
    items: [
      { key: 'colors', labelKey: 'nav.colors', Icon: IconPalette, Page: ColorsPage },
      { key: 'type', labelKey: 'nav.type', Icon: IconTypography, Page: TypographyPage },
      { key: 'spacing', labelKey: 'nav.spacing', Icon: IconRuler, Page: SpacingPage },
      { key: 'icons', labelKey: 'nav.icons', Icon: IconGripSquare, Page: IconsPage },
      { key: 'layout', labelKey: 'nav.layout', Icon: IconColumns, Page: LayoutPage },
    ],
  },
  {
    titleKey: 'nav.group.components',
    items: [
      { key: 'buttons', labelKey: 'nav.buttons', Icon: IconComponents, Page: ButtonsPage },
      { key: 'forms', labelKey: 'nav.forms', Icon: IconEdit, Page: FormsPage },
      { key: 'selection', labelKey: 'nav.selection', Icon: IconCheckCircle, Page: SelectionPage },
      { key: 'badges', labelKey: 'nav.badges', Icon: IconUsers, Page: BadgesPage },
      { key: 'feedback', labelKey: 'nav.feedback', Icon: IconBell, Page: FeedbackPage },
      { key: 'navigation', labelKey: 'nav.navigation', Icon: IconChevron, Page: NavigationPage },
      { key: 'overlays', labelKey: 'nav.overlays', Icon: IconLayers, Page: OverlaysPage },
      { key: 'table', labelKey: 'nav.table', Icon: IconStream, Page: TablePage },
      { key: 'cards', labelKey: 'nav.cards', Icon: IconCards, Page: CardsPage },
      { key: 'content', labelKey: 'nav.content', Icon: IconArticle, Page: ContentPage },
    ],
  },
  {
    titleKey: 'nav.group.patterns',
    items: [
      { key: 'metrics', labelKey: 'nav.metrics', Icon: IconStar, Page: MetricsPage },
      { key: 'dataviz', labelKey: 'nav.dataviz', Icon: IconChart, Page: DataVizPage },
    ],
  },
  {
    titleKey: 'nav.group.examples',
    items: [
      { key: 'dashboard', labelKey: 'nav.dashboard', Icon: IconWave, Page: DashboardPage },
      { key: 'afterquake', labelKey: 'nav.afterquake', Icon: IconMapPin, Page: AfterQuakePage },
    ],
  },
]

const ALL = NAV.flatMap((g) => g.items)

function Sidebar({ collapsed, onToggle, active, mobileOpen, onCloseMobile }: { collapsed: boolean; onToggle: () => void; active: string; mobileOpen: boolean; onCloseMobile: () => void }) {
  const { t, path } = useI18n()
  // On mobile the sidebar is a fixed drawer (never "collapsed" to icon-only —
  // it slides fully off-canvas instead). On lg+ it is a sticky rail that can
  // collapse to an icon strip.
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] shrink-0 flex-col border-r border-line bg-surface transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:max-w-none lg:translate-x-0 lg:transition-[width] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'w-[86vw] max-w-[20rem] lg:w-20' : 'w-[86vw] max-w-[20rem] lg:w-72'}`}
    >
      <div className={`flex min-h-20 items-center gap-3 px-6 pt-[env(safe-area-inset-top)] lg:min-h-0 lg:h-20 lg:pt-0 ${collapsed ? 'lg:px-5' : ''}`}>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-[0_6px_16px_-4px_rgba(8,145,178,0.55)]">
          <IconWave size={22} weight="bold" />
        </div>
        <div className={`min-w-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-auto opacity-100 lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
          <p className="font-display text-lg font-extrabold leading-none tracking-tight text-ink">Pance</p>
          <p className="mt-1 truncate font-mono text-10 uppercase tracking-[0.2em] text-ink-muted">{t('shell.designSystem')}</p>
        </div>
        <button
          onClick={onCloseMobile}
          className="pance-focus ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-ground hover:text-ink lg:hidden"
          aria-label={t('shell.closeNav')}
        >
          <IconX size={20} />
        </button>
      </div>

      <nav aria-label={t('shell.designSystem')} className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4 pt-2">
        {NAV.map((group) => (
          <div key={group.titleKey ?? 'top'} className="mb-1">
            {!group.topLevel && group.titleKey && (
              <>
                <p className={`px-3 pb-1.5 pt-4 font-mono text-10 font-medium uppercase tracking-[0.18em] text-ink-muted ${collapsed ? 'block lg:hidden' : 'block'}`}>{t(group.titleKey)}</p>
                {collapsed && <div className="mx-3 my-3 hidden border-t border-line-soft lg:block" />}
              </>
            )}
            {group.items.map(({ key, labelKey, Icon }) => {
              const isActive = active === key
              const label = t(labelKey)
              return (
                <Link
                  key={key}
                  to={path(key)}
                  onClick={onCloseMobile}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? label : undefined}
                  className={`pance-focus group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${collapsed ? 'lg:justify-center lg:gap-0 lg:px-0' : ''} ${isActive ? 'bg-primary-soft text-primary-fg' : 'text-ink-soft hover:bg-ground hover:text-ink'}`}
                >
                  <Icon size={18} weight={isActive ? 'fill' : 'regular'} className={`shrink-0 ${isActive ? 'text-primary-fg' : 'text-ink-muted group-hover:text-ink-soft'}`} />
                  <span className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left transition-all duration-300 ${collapsed ? 'opacity-100 lg:w-0 lg:opacity-0' : 'opacity-100'}`}>{label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-line-soft p-4 lg:hidden">
        <LanguageSwitch variant="block" />
      </div>

      <div className="hidden border-t border-line-soft p-4 lg:block">
        <Button variant="outlined" severity="secondary" size="sm" onClick={onToggle} block>
          <IconChevron size={16} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          {!collapsed && <span>{t('shell.collapse')}</span>}
        </Button>
      </div>
    </aside>
  )
}

function Shell() {
  const { page } = useParams()
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = page ?? 'home'
  const entry = ALL.find((e) => e.key === active) ?? ALL[0]
  const CurrentPage = entry.Page
  const label = t(entry.labelKey)

  const isHome = active === 'home'

  const navigate = useNavigateTo()

  // Reset scroll when the page changes (not when only the language changes).
  const lastPage = useRef(active)
  useEffect(() => {
    if (lastPage.current !== active) window.scrollTo(0, 0)
    lastPage.current = active
    setMobileOpen(false)
  }, [active])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <NavContext.Provider value={navigate}>
      <div className="flex min-h-[100dvh] bg-ground text-ink">
        {/* Mobile drawer backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
        )}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          active={active}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar — always available so navigation is reachable.
              Safe-area padding keeps the hamburger clear of rounded corners /
              the status bar on notched devices. */}
          <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-line bg-ground/85 pb-2.5 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="pance-focus grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-soft"
              aria-label={t('shell.openNav')}
            >
              <IconList size={20} />
            </button>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 text-white">
              <IconWave size={16} weight="bold" />
            </div>
            <span className="min-w-0 truncate font-display text-base font-extrabold tracking-tight text-ink">{isHome ? 'Pance' : label}</span>
            <MobileThemeButton />
            <LanguageSwitch variant="icon" />
          </header>

          <header className="sticky top-0 z-20 hidden h-20 items-center justify-between gap-6 border-b border-line bg-ground/80 px-8 backdrop-blur-md lg:flex">
            {isHome ? (
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 font-mono text-11 font-semibold uppercase tracking-[0.12em] text-primary-fg ring-1 ring-inset ring-primary-border">
                  <IconCheckCircle size={14} weight="bold" />
                  {t('shell.openSource')}
                </span>
                <p className="min-w-0 truncate text-sm text-ink-muted">{t('shell.openSourceNote')}</p>
              </div>
            ) : (
              <div className="min-w-0">
                <p className="truncate font-mono text-11 uppercase tracking-[0.16em] text-ink-muted">{t('shell.breadcrumb')}</p>
                <h1 className="mt-0.5 truncate font-display text-2xl font-extrabold tracking-tight text-ink">{label}</h1>
              </div>
            )}
            <div className="flex shrink-0 items-center gap-3">
              <ThemeToggle className="hidden xl:inline-flex" />
              <span className="hidden lg:inline-flex xl:hidden"><MobileThemeButton /></span>
              <LanguageSwitch variant="header" />
              <HeaderSearch pages={ALL} className="hidden w-64 md:block" />
              <NotificationsBell />
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub ${t('home.links.newTab')}`}
                className="grid h-10 w-10 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-primary-soft hover:text-primary-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <GithubLogo size={20} />
              </a>
              <a href={LINKS.changelog} target="_blank" rel="noopener noreferrer" className="hidden rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:inline">
                <Badge severity="primary">v{VERSION}</Badge>
              </a>
            </div>
          </header>
          <main className={isHome ? 'flex-1 overflow-y-auto' : 'mx-auto w-full max-w-[1200px] flex-1 overflow-x-clip px-5 py-6 sm:px-8 sm:py-10'}>
            <CurrentPage />
          </main>
        </div>
      </div>
    </NavContext.Provider>
  )
}

/* Compact light/dark switch for the mobile header (the full Light / Dark / System toggle lives in the desktop header). */
function MobileThemeButton() {
  const { t } = useI18n()
  const { resolved, setMode } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={`${t('ui.theme')}: ${t(next === 'dark' ? 'ui.theme.dark' : 'ui.theme.light')}`}
      className="pance-focus grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-soft"
    >
      {resolved === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
    </button>
  )
}

function useNavigateTo() {
  const { path } = useI18n()
  const nav = useNavigate()
  return (k: string) => nav(path(k))
}

/* Feeds the docs site's EN/ES dictionary into the library's built-in strings. */
function SiteLabels({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const labels = useMemo<Partial<PanceLabels>>(() => ({
    close: t('ui.close'), dismiss: t('ui.dismiss'), remove: t('ui.remove'), removeFile: t('ui.removeFile'),
    moreActions: t('ui.moreActions'), breadcrumb: t('ui.breadcrumb'), showFullPath: t('ui.showFullPath'),
    showPassword: t('ui.showPassword'), optional: t('ui.optional'), clickToUpload: t('ui.clickToUpload'),
    orDrag: t('ui.orDrag'), clickToEdit: t('ui.clickToEdit'), search: t('ui.search'), addTag: t('ui.addTag'),
    noResults: (query: string) => t('ui.noResults', { query }),
    deltaUp: (value: string) => t('ui.data.deltaUp', { value }), deltaDown: (value: string) => t('ui.data.deltaDown', { value }),
    deltaFlat: t('ui.data.deltaFlat'), deltaBetter: t('ui.data.deltaBetter'), deltaWorse: t('ui.data.deltaWorse'), trend: t('ui.data.trend'),
    noData: t('ui.data.noData'), loading: t('ui.data.loading'), failedToLoad: t('ui.data.failedToLoad'), retry: t('ui.data.retry'),
    vsPrevious: t('ui.data.vsPrevious'), current: t('ui.data.current'), target: t('ui.data.target'),
    ofGoal: (percent: string) => t('ui.data.ofGoal', { percent }), low: t('ui.data.low'), high: t('ui.data.high'), total: t('ui.data.total'),
    selectAllRows: t('ui.data.selectAllRows'), selectRow: (name: string) => t('ui.data.selectRow', { name }),
    sortBy: (column: string) => t('ui.data.sortBy', { column }), rowsSelected: (count: number) => t('ui.data.rowsSelected', { count }),
    noRows: t('ui.data.noRows'), clearSearch: t('ui.data.clearSearch'), columns: t('ui.data.columns'), meterStatusWarning: t('ui.data.meterWarning'), cancel: t('ui.dialog.cancel'), typeToConfirm: (text) => t('ui.dialog.typeToConfirm', { text }), notifications: t('ui.notif.title'), notificationsUnread: (count) => t('ui.notif.unread', { count }), markAllRead: t('ui.notif.markAll'), markRead: (title) => t('ui.notif.markRead', { title }), dismissNotification: (title) => t('ui.notif.dismiss', { title }), noNotifications: t('ui.notif.empty'), unread: t('ui.notif.unreadWord'), undo: t('ui.undo'), meterStatusDanger: t('ui.data.meterDanger'), expandColumn: t('ui.data.expandColumn'), expandRow: (name) => t('ui.data.expandRow', { name }), collapseRow: (name) => t('ui.data.collapseRow', { name }), pagination: t('ui.data.pagination'),
    previousPage: t('ui.data.previousPage'), nextPage: t('ui.data.nextPage'), page: (n: number) => t('ui.data.page', { n }),
    range: (from: number, to: number, total: number) => t('ui.data.range', { from, to, total }),
    viewAsTable: t('ui.data.viewAsTable'), viewAsChart: t('ui.data.viewAsChart'), chartKeyboardHint: t('ui.data.chartKeyboardHint'),
    locale: t('ui.date.locale'), firstDayOfWeek: Number(t('ui.date.firstDay')), previousMonth: t('ui.date.previousMonth'),
    nextMonth: t('ui.date.nextMonth'), chooseDate: t('ui.date.chooseDate'), chooseDateRange: t('ui.date.chooseRange'),
    today: t('ui.date.today'), clearDate: t('ui.date.clear'), rangeStart: t('ui.date.rangeStart'), rangeEnd: t('ui.date.rangeEnd'),
    calendarKeyboardHint: t('ui.date.keyboardHint'), rangeValue: (from: string, to: string) => t('ui.date.rangeValue', { from, to }),
    opensInNewTab: t('ui.opensInNewTab'), theme: t('ui.theme'), themeLight: t('ui.theme.light'), themeDark: t('ui.theme.dark'), themeSystem: t('ui.theme.system'),
  }), [t])
  return <PanceProvider labels={labels}>{children}</PanceProvider>
}

function LangRoute() {
  const { lang } = useParams()
  return (
    <LangProvider lang={isLang(lang) ? lang : 'en'}>
      <SiteLabels>
        <Shell />
        <Outlet />
      </SiteLabels>
    </LangProvider>
  )
}

const PAGE_KEYS = new Set(ALL.map((e) => e.key))
const basename = import.meta.env.BASE_URL.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') : ''

// VITE_HASH_ROUTER=1 builds a preview that works from any static path (no server rewrites).
const router = (import.meta.env.VITE_HASH_ROUTER ? createHashRouter : createBrowserRouter)(
  [
    {
      path: '/:lang',
      loader: ({ params }) => {
        if (isLang(params.lang)) return null
        // /colors → /en/colors ; anything else → home in the detected language
        return redirect(PAGE_KEYS.has(params.lang ?? '') ? `/${detectLang()}/${params.lang}` : `/${detectLang()}`)
      },
      Component: LangRoute,
      children: [
        { index: true, element: null },
        {
          path: ':page',
          loader: ({ params }) => (!isLang(params.lang) || (PAGE_KEYS.has(params.page ?? '') && params.page !== 'home') ? null : redirect(`/${params.lang}`)),
          element: null,
        },
      ],
    },
    { path: '/', loader: () => redirect(`/${detectLang()}`) },
    { path: '*', loader: () => redirect(`/${detectLang()}`) },
  ],
  { basename },
)

export default function App() {
  return <RouterProvider router={router} />
}
