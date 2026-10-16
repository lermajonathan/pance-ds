/* Pance · Theme — ThemeProvider, useTheme, ThemeToggle, themeInitScript.
   Dark mode is the `[data-theme="dark"]` block of the token CSS. This file only decides which
   value the attribute on <html> takes: the person's choice, or the system setting when the
   choice is "system". The choice is remembered in localStorage (and works without it). */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconDesktop, IconMoon, IconSun } from '../icons'
import { SegmentedControl } from './selection'

export type ThemeMode = 'light' | 'dark' | 'system'
type ThemeCtx = { mode: ThemeMode; resolved: 'light' | 'dark'; setMode: (m: ThemeMode) => void }

const DEFAULT_KEY = 'pance-theme'
const ThemeContext = createContext<ThemeCtx>({ mode: 'system', resolved: 'light', setMode: () => {} })

const systemDark = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
const isMode = (v: unknown): v is ThemeMode => v === 'light' || v === 'dark' || v === 'system'

/** Inline this in <head> (before your CSS) so the first paint already has the right theme:
 *  <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} /> */
export const themeInitScript = (storageKey = DEFAULT_KEY) =>
  `(function(){try{var m=localStorage.getItem(${JSON.stringify(storageKey)})||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.setAttribute('data-theme',d?'dark':'light');e.style.colorScheme=d?'dark':'light'}catch(e){}})()`

export function ThemeProvider({ defaultMode = 'system', storageKey = DEFAULT_KEY, children }: { defaultMode?: ThemeMode; storageKey?: string; children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [dark, setDark] = useState(false)

  // Read the stored choice after mount (keeps server and client markup identical).
  useEffect(() => {
    try { const s = localStorage.getItem(storageKey); if (isMode(s)) setModeState(s) } catch { /* storage blocked */ }
  }, [storageKey])

  useEffect(() => {
    const apply = () => {
      const d = mode === 'dark' || (mode === 'system' && systemDark())
      setDark(d)
      const el = document.documentElement
      el.setAttribute('data-theme', d ? 'dark' : 'light')
      el.style.colorScheme = d ? 'dark' : 'light'
    }
    apply()
    if (mode !== 'system') return
    const q = window.matchMedia('(prefers-color-scheme: dark)')
    q.addEventListener('change', apply)
    return () => q.removeEventListener('change', apply)
  }, [mode])

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m)
    try { localStorage.setItem(storageKey, m) } catch { /* storage blocked */ }
  }, [storageKey])

  const value = useMemo<ThemeCtx>(() => ({ mode, resolved: dark ? 'dark' : 'light', setMode }), [mode, dark, setMode])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

/** Light / Dark / System as a radio group (arrows move and select). Needs a ThemeProvider above it. */
export function ThemeToggle({ size = 'sm', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const tt = useLabels()
  const { mode, setMode } = useTheme()
  return (
    <span className={className}>
      <SegmentedControl<ThemeMode>
        label={tt.theme}
        size={size}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'light', label: tt.themeLight, Icon: IconSun },
          { value: 'dark', label: tt.themeDark, Icon: IconMoon },
          { value: 'system', label: tt.themeSystem, Icon: IconDesktop },
        ]}
      />
    </span>
  )
}
