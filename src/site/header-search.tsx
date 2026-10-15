import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Input } from '../components'
import { IconSearch } from '../icons'
import { SECTIONS } from './search-index'
import { useI18n, type Key } from '../i18n'

type Result = { id: string; page: string; label: string; context?: string; section?: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function scrollToSection(title: string) {
  let tries = 0
  const go = () => {
    const h = Array.from(document.querySelectorAll('main h2')).find((el) => el.textContent === title)
    if (h) {
      window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' })
      return
    }
    if (++tries < 15) setTimeout(go, 60)
  }
  setTimeout(go, 120)
}

export function HeaderSearch({ pages, className = '' }: { pages: { key: string; labelKey: Key }[]; className?: string }) {
  const { t, path } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const { pageResults, sectionResults } = useMemo(() => {
    const labels = new Map(pages.map((p) => [p.key, t(p.labelKey)]))
    const needle = norm(q.trim())
    if (!needle) return { pageResults: [] as Result[], sectionResults: [] as Result[] }
    const pageResults: Result[] = pages
      .filter((p) => norm(labels.get(p.key)!).includes(needle))
      .map((p) => ({ id: `p-${p.key}`, page: p.key, label: labels.get(p.key)! }))
    const sectionResults: Result[] = SECTIONS.filter((s) => labels.has(s.page))
      .map((s, i) => ({ id: `s-${i}`, page: s.page, label: s.key ? t(s.key) : s.text, context: labels.get(s.page)!, section: s.key ? t(s.key) : s.text }))
      .filter((r) => norm(r.label).includes(needle))
      .slice(0, 12)
    return { pageResults, sectionResults }
  }, [q, pages, t])

  const flat = [...pageResults, ...sectionResults]

  useEffect(() => setActive(0), [q])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !(e.target as HTMLElement).isContentEditable) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const choose = (r: Result) => {
    setOpen(false)
    setQ('')
    input.current?.blur()
    navigate(path(r.page))
    if (r.section) scrollToSection(r.section)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, flat.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && flat[active]) { e.preventDefault(); choose(flat[active]) }
    else if (e.key === 'Escape') { setOpen(false); input.current?.blur() }
  }

  const showPanel = open && q.trim().length > 0
  const row = (r: Result) => {
    const i = flat.indexOf(r)
    return (
      <li key={r.id} role="option" id={`hs-${r.id}`} aria-selected={i === active}>
        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => choose(r)}
          onMouseEnter={() => setActive(i)}
          className={`flex w-full min-w-0 items-baseline gap-2 rounded-lg px-3 py-2 text-left text-sm ${i === active ? 'bg-brand-50 text-brand-700' : 'text-ink'}`}
        >
          <span className="min-w-0 truncate font-medium">{r.label}</span>
          {r.context && <span className="min-w-0 shrink-0 truncate font-mono text-11 text-ink-muted">{r.context}</span>}
        </button>
      </li>
    )
  }

  return (
    <div ref={box} className={`relative ${className}`}>
      <Input
        ref={input}
        placeholder={t('shell.search')}
        Icon={IconSearch}
        aria-label={t('shell.search')}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="hs-list"
        aria-autocomplete="list"
        aria-activedescendant={showPanel && flat[active] ? `hs-${flat[active].id}` : undefined}
        autoComplete="off"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showPanel && (
        <div className="absolute right-0 top-full z-40 mt-2 max-h-[min(24rem,70vh)] w-[min(24rem,90vw)] overflow-y-auto rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.3)]">
          <ul id="hs-list" role="listbox">
            {flat.length === 0 && <li className="px-3 py-3 text-sm text-ink-muted">{t('shell.search.empty', { q: q.trim() })}</li>}
            {pageResults.length > 0 && (
              <li role="presentation" className="px-3 pb-1 pt-2 font-mono text-10 uppercase tracking-[0.16em] text-ink-muted">{t('shell.search.pages')}</li>
            )}
            {pageResults.map(row)}
            {sectionResults.length > 0 && (
              <li role="presentation" className="px-3 pb-1 pt-2 font-mono text-10 uppercase tracking-[0.16em] text-ink-muted">{t('shell.search.sections')}</li>
            )}
            {sectionResults.map(row)}
          </ul>
        </div>
      )}
    </div>
  )
}
