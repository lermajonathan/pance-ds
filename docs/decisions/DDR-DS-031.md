# DDR-DS-031: Right-to-left support with logical properties

- **Status:** Accepted
- **Date:** 2026-11-02
- **Owner:** Design (Jonathan Lerma)

## Context

Components position and space themselves with physical Tailwind utilities (`pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `border-l`, `rounded-r-*`). In a right-to-left page (Arabic, Hebrew, Persian) icons, paddings, borders, drawers and tooltips stay on the wrong side. A check over `src/components` finds 98 such utilities in 13 files. Tailwind 4 has logical equivalents, so most of the work is a renaming that does not change how the components look in left-to-right pages.

## Decision

1. **Logical utilities by default.** Components use `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `text-start`, `text-end`, `border-s`, `border-e`, `rounded-s-*` and `rounded-e-*`. Physical ones are not allowed unless listed as an exception.
2. **Symmetric centering is allowed.** `left-1/2` and `right-1/2` look the same in both directions.
3. **Charts keep a left-to-right plot.** The plot area (axes, bars, lines, the diverging baseline) is wrapped in `dir="ltr"`; time and magnitude read the same in every language. Labels, values and legends follow the page direction.
4. **`Tooltip` and `Drawer` gain `'start'` and `'end'` placements.** `'left'` and `'right'` stay as they are, so no one breaks. `'start'` and `'end'` flip with the page direction.
5. **Direction-dependent pieces are fixed one by one.** The slider fill (`linear-gradient(to right…)`) and the toggle thumb (fixed `left-[…]` offsets) respond to direction. Directional icons (chevrons, arrows, "next" and "previous") mirror in RTL.
   Where a utility cannot follow direction (gradient angles, mirrored icons, off-canvas slides) the code uses the CSS variable `--pance-dir` (`1` in left-to-right, `-1` in right-to-left), defined in `components.css` and set by the nearest `dir` attribute. It is used instead of Tailwind's `rtl:` variant and `:dir()` because both fail inside a `dir="ltr"` island on an RTL page (`rtl:` matches any ancestor; `:dir()` is compiled down to `:lang()` lists). The `rtl-exempt:` comment marks the few physical values that stay, such as safe-area insets, which are physical.
6. **Exceptions are listed with a reason** in `tests/rtl.mjs`. `src/components/a11y.ts` is out of scope: its positioning works on screen geometry from `getBoundingClientRect`.
7. **Docs and tests.** A page on RTL under Foundations, a direction switch (LTR / RTL, also `?dir=rtl`) in the docs site, and `--dir=rtl` modes for the visual and axe tests, which CI runs. The docs site is held to the same rule as the library (`pnpm test:rtl` scans `src/components` and `src/site`).

## Tests (written first)

- `tests/rtl.mjs`: no physical utility in `src/components` outside the exception list (red today: 98 in 13 files).
- Later steps: slider fill and toggle thumb under `dir="rtl"`; `'start'` and `'end'` placements flip; visual regression with `dir="rtl"`; axe in RTL.

## Consequences

Minor release, additive. Pages in left-to-right look the same. `'left'` and `'right'` remain valid, so the API does not break. Not covered: translations of the docs into RTL languages, and automatic mirroring of every icon in the set (only directional ones).
