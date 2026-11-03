# DDR-DS-030: Motion system and reduced motion

- **Status:** Proposed
- **Date:** 2026-11-02
- **Owner:** Design (Jonathan Lerma)

## Context

Pance has four durations (`fast`, `base`, `slow`, `slower`), two easings, two keyframe animations and a `prefers-reduced-motion` rule that covers only `.pance-rise` and `.pance-fill`. Most components animate through Tailwind utilities (`transition-*`, `duration-*`, `animate-*`), and only some of them carry `motion-reduce`. A person who asks for reduced motion still gets most transitions, and the animated charts and live cards planned next would make that worse.

## Decision

1. **A global guard.** `src/styles/index.css` sets, under `prefers-reduced-motion: reduce`, `transition-duration`, `animation-duration` and `animation-iteration-count` to a near-zero value for every element and pseudo-element. State changes still happen; they just do not travel.
2. **Gated looping animation.** Every `animate-spin`, `animate-pulse` and similar utility in a component is `motion-safe:` or paired with `motion-reduce:animate-none`. A loading state keeps its label, so nothing depends on the motion to be understood (WCAG 2.2.2 and 2.3.3).
3. **Motion tokens.** The existing durations and easings stay. New: `motion.transition.count` (a value counting up, `slower`, `out-expo`). Chart entrance reuses the existing `motion.transition.enter`, so there is no second token for it. No new raw values in components.
4. **`useCountUp`.** A hook in `@pance/react` (with the framework-free `startCountUp` and `countUpValue` behind it) that animates a number to its target and returns the final value at once when reduced motion is set. The final value is what screen readers read.
5. **Charts animate on entrance and highlight only**, never to carry data. Static and animated states show the same information.

## Tests (written first)

- `tests/motion.mjs`: the global guard exists; every `animate-*` utility is gated.
- `tests/motion.mjs` also checks the `count` token, that the hook's default duration equals it, that the count ends exactly at the target and never goes backwards, that reduced motion sets the target at once, and that the server render shows the final value.
- Later step: chart entrance is off under reduced motion.

## Consequences

Minor release, additive. The guard changes behaviour only for people who set reduced motion. Not covered: the card gallery itself and RTL, which follow as separate steps.
