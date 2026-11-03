/* Pance · motion primitives (DDR-DS-030).
   - countUpValue / startCountUp: framework-free counting logic, testable with a fake clock
   - useCountUp: React hook; shows the final value at once on the server, with reduced motion, and on the first render
   - prefersReducedMotion: the user's setting, read once per call */
import { useEffect, useRef, useState } from 'react'

/** Same as `motion.transition.count` (duration.slower). `tests/motion.mjs` keeps them in step. */
export const COUNT_UP_MS = 500

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// easing.out-expo is cubic-bezier(0.22, 1, 0.36, 1); a quintic ease-out gives the same feel without a solver.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 5)

/** Value between `from` and `to` after `elapsed` ms; exact at both ends and clamped outside. */
export function countUpValue(from: number, to: number, elapsed: number, duration: number) {
  if (duration <= 0 || elapsed >= duration) return to
  if (elapsed <= 0) return from
  return from + (to - from) * easeOut(elapsed / duration)
}

export interface CountUpOptions {
  duration?: number
  reduced?: boolean
  now?: () => number
  raf?: (cb: () => void) => number
  caf?: (id: number) => void
  onFrame: (value: number) => void
}

/** Runs the count and returns a function that cancels it. With `reduced` it reports the target once and stops. */
export function startCountUp(from: number, to: number, { duration = COUNT_UP_MS, reduced = false, now = () => performance.now(), raf = (cb) => requestAnimationFrame(cb), caf = (id) => cancelAnimationFrame(id), onFrame }: CountUpOptions) {
  if (reduced || from === to) { onFrame(to); return () => {} }
  const start = now()
  let id = 0
  let stopped = false
  const tick = () => {
    if (stopped) return
    const elapsed = now() - start
    onFrame(countUpValue(from, to, elapsed, duration))
    if (elapsed < duration) id = raf(tick)
  }
  onFrame(from)
  id = raf(tick)
  return () => { stopped = true; caf(id) }
}

/** Animates a number to `target`. The first render, the server render and reduced motion all give the final value, so what a screen reader reads never depends on the animation. */
export function useCountUp(target: number, duration: number = COUNT_UP_MS) {
  const [value, setValue] = useState(target)
  const shown = useRef(target)
  shown.current = value
  useEffect(() => startCountUp(shown.current, target, { duration, reduced: prefersReducedMotion(), onFrame: setValue }), [target, duration])
  return value
}
