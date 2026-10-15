/* Pance · accessibility primitives shared by every interactive component.
   - useDialogFocus: WAI-ARIA dialog behaviour (initial focus, Tab trap, Escape, focus return, scroll lock)
   - listKeyNav: arrow / Home / End navigation for listbox, menu, tablist and radiogroup patterns
   - mergeTriggerProps: adds ARIA + handlers to a caller-supplied trigger element */
import { cloneElement, isValidElement, useEffect, type ReactNode, type RefObject } from 'react'

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
