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
| Primitives | Value | 220 | Ramps, type, space, radius, size, opacity, breakpoints. Colors are hidden from pickers (`scopes: []`) |
| Semantic | Light · Dark | 138 | `color/bg/*`, `color/fg/*`, `color/border/*`, `color/intent/{8}/*`, focus, status, dataviz, radius, icon. Dark is a draft (ships v1.1) |
| Components | Value | 434 | Button, Badge, Input, Toggle, Checkbox… alias Semantic, never hex |
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

Not yet in Figma (P2/P3): ButtonGroup, SplitButton, ToggleButton, CountBadge, InputGroup, RangeSlider, FileDropzone, PinInput, InlineEdit, Combobox, TagInput, RadioCard, CheckboxGroup, Skeleton, Breadcrumb, NavMenu, Drawer, Popover, Panel, Divider, RadioGroup, and charts.

Component dimensions in Figma are bound to the same variables as code where a token exists (avatar sizes, steps dot and connector, progress height, segmented control heights, card padding and radius).

## Keeping Figma in sync

1. Edit `tokens/*.json` and run `pnpm tokens`.
2. Push the change to Figma with one of these options:
   - **Tokens Studio** for Figma, pointed at `tokens/` (DTCG format; dark values live in `$extensions.pance.modes.dark`).
   - **Claude with the Figma connector**: ask it to "sync the Pance tokens to Figma". The sync updates variables by name, so bindings never break.
3. Never edit a variable value directly in Figma. Change it in the JSON, or the next sync overwrites it.
