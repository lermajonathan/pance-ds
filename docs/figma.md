# Figma library

**File:** [Pance DS](https://www.figma.com/design/oU5j1pVQQZWGgZvTuW3IP1/Pance-DS). The repo is the source of truth; Figma mirrors it.

## Pages

| Page | What's there |
|---|---|
| Cover | File cover built from live component instances |
| Foundations | Color ramps, intents, typography, spacing, radius and elevation specimens, all bound to variables and styles |
| Components | 67 icons + 34 components (29 component sets, 840 variants), one section per component |
| Patterns | Compositions built only from instances: "Create a stream" form and "Streams dashboard" (metric cards + data table) |
| Archive | The previous file content (site captures, August docs, legacy Button), untouched |

## Variables

| Collection | Modes | Count | Notes |
|---|---|---|---|
| Primitives | Value | 224 | Ramps, type, space, radius, size, opacity, breakpoints. Colors are hidden from pickers (`scopes: []`) |
| Semantic | Light · Dark | 147 | `color/bg/*`, `color/fg/*`, `color/border/*`, `color/intent/{8}/*`, focus, status, dataviz (series 1–8, no-data), radius, icon. Dark is a draft (ships v1.1) |
| Components | Value | 501 | Button, Badge, Input, Toggle, Checkbox… alias Semantic, never hex |
| Legacy · Primitives / Legacy · Semantic | — | 405 | Old collections, hidden from publishing. Safe to delete once nothing in Archive needs them |

Every variable has a scope and WEB code syntax matching `src/styles/tokens.css` (`var(--pance-color-intent-primary-solid)`).

**Styles:** 14 text styles (`typography/*`, font size and family bound to variables) and 13 effect styles (`shadow/*`, `focus/ring*`).

## Components (v1 core)

Property names match the React props so a component reads the same in design and code.

| Component | Variants | Properties |
|---|---|---|
| Button | 480 | severity · variant · size · state · label · show icon · icon |
| IconButton | 4 | state · icon |
| Badge | 72 | severity · variant · size · label · dot · removable |
| Input | 21 | size · state · placeholder (default/hover/disabled) · value (focus/filled/error/success) · leading icon · leading glyph · trailing icon |
| Textarea | 5 | state · value |
| Field | 3 | status · label · required · hint · error message · success message · show message. The control is an exposed nested instance (Input, swap for Select or Textarea) |
| Checkbox | 45 | checked · state · size · label · description · show description · show label |
| Radio | 30 | checked · state · size · label · description · show description |
| Toggle | 18 | on · state · size |
| SwitchRow | 4 | on · disabled · label · description |
| Select | 5 | state · value |
| Menu item | 7 | kind · state · label · icon · shortcut |
| Menu | 1 | composed of Menu items |
| Alert | 24 | severity · variant · title · body · show body · dismissible |
| Toast | 5 | severity · title · description · show description |
| Tooltip | 4 | placement · label · description |
| Tab | 36 | variant · state · size · label · icon |
| Modal | 3 | size · title · description · show icon · show body · show footer |
| Card | 3 | elevation |
| Accordion item | 4 | open · state · title · description |

## Components (v1 data set, added Oct 15)

| Component | Variants | Properties |
|---|---|---|
| Avatar | 20 | size (xs 24 · sm 32 · md 36 · lg 48) · status (none · online · away · busy · offline) · initials |
| Avatar group | 1 | 4 nested Avatars · overflow · show overflow |
| Progress | 4 | severity · value · show value |
| Segment / Segmented control | 6 / 1 | size · active · label |
| Step / Step connector / Steps | 8 / 2 / 1 | status (complete · current · upcoming · error) · layout · label · description · number |
| Delta | 3 | trend (up · down · flat) · delta |
| Metric card | 3 | trend · label · value · unit · caption · show unit · show sparkline (Delta exposed) |
| Table header cell | 6 | align · sort · label |
| Table cell | 7 | kind (text · mono · number · badge · person · checkbox · actions) · value · identifier · number · name |
| Table row | 3 | state (default · hover · selected) |
| Data table | 1 | toolbar, sortable header, 5 rows, pagination |

## Components (v1.2 data visualization, added Oct 15)

| Component | Variants | Properties |
|---|---|---|
| Metric card variants | 5 | variant (compact · hero · goal · breakdown · comparison) |
| Metric card states | 3 | state (loading · empty · error) |
| Pagination item / Pagination | 3 / 1 | state (default · current · disabled) |
| Data table row | 9 | density (compact · default · comfortable) × state (default · hover · selected) |
| Data table / Empty, Data table / Loading | 1 / 1 | static states |
| Chart / Line, Bar grouped, Bar stacked, Ranked bar, Bar diverging, Heatmap, Donut | 7 | static references, one component each |

Charts in Figma are reference drawings, not data-driven. Series fills, strokes, grid, axis labels and the surface are bound to `color/dataviz/*` and `chart/*`, so they follow Light and Dark. Each legend repeats the marker shape used in the plot (WCAG 1.4.1). New component tokens: `sparkline/*`, `metric-card/*`, `data-table/*`, `chart/*`. The existing Metric card now binds its padding, radius, fill and border to `metric-card/*`.

## Components (v1.3 dates, added Oct 15)

| Component | Variants | Properties |
|---|---|---|
| Calendar day | 8 | state (default · hover · today · selected · range · range-start · range-end · disabled) |
| Calendar | 1 | one month, built from Calendar day instances (today ring, one selected day) |
| Calendar / Range | 1 | range-start, range and range-end cells forming a continuous band |
| Date picker | 5 | state (empty · filled · open · error · disabled): the trigger of DatePicker and DateRangePicker |
| Date picker panel | 1 | Calendar + Today / Clear |
| Date range panel | 1 | presets + two months + Clear (one month below `md`) |

New component tokens: `calendar/*` and `date-picker/*`. The today ring uses `color/intent/primary/fg` (3:1 on white); `border-strong` measured 1.81:1.

## Components (v1.4 feedback and theme, added Oct 15)

| Component | Variants | Properties |
|---|---|---|
| Spinner | 3 | size (sm · md · lg); track plus a quarter arc, both stroked from `spinner/*` |
| Empty state | 1 | icon chip, title, description, one action |
| Link | 3 | variant (default · subtle · external); always underlined |
| Theme toggle | 1 | Light / Dark / System segmented radio group, with new Sun and Desktop icons |

New component tokens: `spinner/*` and `empty-state/*`.

Not yet in Figma (P2/P3): ButtonGroup, SplitButton, ToggleButton, CountBadge, InputGroup, RangeSlider, FileDropzone, PinInput, InlineEdit, Combobox, TagInput, RadioCard, CheckboxGroup, Skeleton, Breadcrumb, NavMenu, Drawer, Popover, Panel, Divider, RadioGroup.

Component dimensions in Figma are bound to the same variables as code where a token exists (avatar sizes, steps dot and connector, progress height, segmented control heights, card padding and radius).

## Keeping Figma in sync

1. Edit `tokens/*.json` and run `pnpm tokens`.
2. Push the change to Figma with one of these options:
   - **Tokens Studio** for Figma, pointed at `tokens/` (DTCG format; dark values live in `$extensions.pance.modes.dark`).
   - **Claude with the Figma connector**: ask it to "sync the Pance tokens to Figma". The sync updates variables by name, so bindings never break.
3. Never edit a variable value directly in Figma. Change it in the JSON, or the next sync overwrites it.
