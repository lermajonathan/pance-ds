/* Pance · accessibility primitives shared by every interactive component.
   - useDialogFocus: WAI-ARIA dialog behaviour (initial focus, Tab trap, Escape, focus return, scroll lock)
   - listKeyNav: arrow / Home / End navigation for listbox, menu, tablist and radiogroup patterns
   - mergeTriggerProps: adds ARIA + handlers to a caller-supplied trigger element
   - useKeepInView: keeps a floating panel inside the viewport and any clipping ancestor */
import { cloneElement, isValidElement, useEffect, useLayoutEffect, useState, type ReactNode, type RefObject } from 'react'

/** Grows a small control's pointer target to at least 24 × 24 px (WCAG 2.5.8)
 *  with an invisible centred ::before, so the visual size stays the same. */
export const hitArea = "relative before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-6 before:min-w-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

export const focusableIn = (root: HTMLElement | null) =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('inert') && el.offsetParent !== null) : []

/** Modal dialog focus management. Call with the dialog panel ref while `open` is true. */
export function useDialogFocus(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const panel = ref.current
    const first = focusableIn(panel)[0]
    ;(first ?? panel)?.focus()

    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = focusableIn(panel)
      if (items.length === 0) {
        e.preventDefault()
        panel.focus()
        return
      }
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === firstEl || document.activeElement === panel)) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
    // onClose is intentionally excluded: callers usually pass an inline function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ref])
}

/** Returns the next index for a list navigated with arrows/Home/End, skipping disabled items. */
export function listKeyNav(
  key: string,
  index: number,
  count: number,
  isDisabled: (i: number) => boolean = () => false,
  orientation: 'vertical' | 'horizontal' | 'both' = 'vertical',
): number | null {
  const next = orientation === 'horizontal' ? ['ArrowRight'] : orientation === 'vertical' ? ['ArrowDown'] : ['ArrowDown', 'ArrowRight']
  const prev = orientation === 'horizontal' ? ['ArrowLeft'] : orientation === 'vertical' ? ['ArrowUp'] : ['ArrowUp', 'ArrowLeft']
  const step = (from: number, dir: 1 | -1) => {
    for (let n = 1; n <= count; n++) {
      const i = (from + dir * n + count) % count
      if (!isDisabled(i)) return i
    }
    return null
  }
  if (next.includes(key)) return step(index, 1)
  if (prev.includes(key)) return step(index, -1)
  if (key === 'Home') return step(-1, 1)
  if (key === 'End') return step(count, -1)
  return null
}

/** Clones a trigger element, merging ARIA attributes and chaining its onClick / onKeyDown. */
export function mergeTriggerProps(
  trigger: ReactNode,
  props: Record<string, unknown> & { onClick?: (e: React.MouseEvent) => void; onKeyDown?: (e: React.KeyboardEvent) => void },
) {
  if (!isValidElement(trigger)) return trigger
  const own = trigger.props as Record<string, unknown> & { onClick?: (e: React.MouseEvent) => void; onKeyDown?: (e: React.KeyboardEvent) => void }
  return cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
    ...props,
    onClick: (e: React.MouseEvent) => {
      own.onClick?.(e)
      props.onClick?.(e)
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      own.onKeyDown?.(e)
      props.onKeyDown?.(e)
    },
  })
}

/* Floating panels (Popover, DropdownMenu, date pickers) open below their trigger,
   aligned to one edge. When that would cut them off, shift them sideways so they
   stay inside the viewport and any ancestor that clips overflow, and open them
   upwards when there is no room below but there is above. Returns `dx` (px, apply
   as a translateX) and `up` (place the panel above the trigger). */
const GUTTER = 8
export function useKeepInView(panel: RefObject<HTMLElement | null>, open: boolean) {
  const [pos, setPos] = useState({ dx: 0, up: false })
  useLayoutEffect(() => {
    if (!open) { setPos({ dx: 0, up: false }); return }
    const el = panel.current
    const anchor = el?.parentElement
    if (!el || !anchor) return
    const measure = () => {
      const prev = el.style.transform
      el.style.transform = 'none'
      const r = el.getBoundingClientRect()
      el.style.transform = prev
      let left = GUTTER, right = window.innerWidth - GUTTER
      for (let a: HTMLElement | null = anchor; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).overflowX !== 'visible') {
          const ar = a.getBoundingClientRect()
          left = Math.max(left, ar.left + GUTTER / 2)
          right = Math.min(right, ar.right - GUTTER / 2)
        }
      }
      let dx = 0
      if (r.right > right) dx = right - r.right
      if (r.left + dx < left) dx = left - r.left
      const a = anchor.getBoundingClientRect()
      const below = window.innerHeight - a.bottom
      const up = r.height + GUTTER > below && a.top > r.height + GUTTER * 2 && a.top > below
      setPos((p) => (p.dx === dx && p.up === up ? p : { dx, up }))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open, panel])
  return pos
}
