# Component reference

45 components in [`src/components`](../src/components), grouped as on the documentation site. Import everything from `src/components/index.ts`.

## Shared model

| Concept | Values | Applies to |
|---|---|---|
| `Severity` (meaning) | `primary` · `secondary` · `success` · `info` · `warning` · `help` · `danger` · `contrast` | Button, Badge, CountBadge, Alert, Progress, Modal icon, Panel icon, NavMenu badge |
| `ButtonVariant` (emphasis) | `filled` · `outlined` · `text` · `link` | Button |
| `SurfaceVariant` (emphasis) | `soft` · `solid` · `outlined` | Badge, Alert |
| Size | `sm` (32px) · `md` (40px) · `lg` (48px) | Button, Input, Toggle, Checkbox, Radio, Badge, Tabs, SegmentedControl |
| Focus | `.pance-focus` → 3px aqua-100 halo + 1.5px aqua-500 ring on `:focus-visible` | All interactive elements |
| Icons | Any Phosphor component passed as `Icon` (type `IconType`) | Most components |

Severity → color ramp: primary = aqua · secondary = slate · success = emerald · info = sky · warning = amber · help = violet · danger = rose · contrast = slate-900.

---


### Styling with tokens

Components never use palette steps. Use the same vocabulary in your own components:

| Need | Utility |
|---|---|
| Intent fills and text | `bg-{intent}-solid`, `hover:bg-{intent}-solid-hover`, `text-{intent}-on-solid`, `bg-{intent}-soft`, `text-{intent}-fg`, `ring-{intent}-border`, `bg-{intent}-dot` (intent = primary · secondary · success · info · warning · help · danger · contrast) |
| Neutrals | `bg-ground` (page) · `bg-canvas` (sunken) · `bg-surface` · `text-ink` / `-soft` / `-muted` / `-subtle` / `-disabled` · `border-line` / `-soft` / `-strong` / `-focus` |
| Elevation | `shadow-card-rest` · `shadow-raised` · `shadow-card` · `shadow-popover` · `shadow-menu` · `shadow-toast` · `shadow-modal` |
| Spacing, radius, type | The normal Tailwind scale, mapped to tokens: `p-4` = 16px (`space.2`), `gap-1.5` = 6px, `rounded-xl` = 12px, `text-sm` = 14px, `text-13` = 13px, `font-semibold`. No `[13px]`-style values |
| A component's own value | `bg-(--pance-toggle-color-track-off)`, `h-(--pance-button-size-md-height)`, `text-(length:--pance-input-size-sm-font-size)` and the other component tokens in [tokens.md](tokens.md) |

## Buttons · `button.tsx`

### `Button`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `severity` | `Severity` | `'primary'` | |
| `variant` | `'filled' \| 'outlined' \| 'text' \| 'link'` | `'filled'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | h 32/40/48 · px 12/16/24 · text 13/14/16 · icon 16/18/22 |
| `Icon` | `IconType` | | No children + Icon = square icon-only button |
| `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | top/bottom stack vertically |
| `rounded` | `boolean` | | Pill shape |
| `raised` | `boolean` | | Severity-tinted shadow |
| `loading` | `boolean` | | Spinner glyph, disables, `aria-busy` |
| `badge` | `string \| number` | | Inline counter |
| `block` | `boolean` | | Full width |
| …rest | `ButtonHTMLAttributes` | | |

States: hover (one step darker), active (two steps darker), disabled (`opacity .45`, not-allowed cursor), focus-visible.

### `IconButton`
`Icon` (required), `label` (required, becomes `aria-label`). 40×40, neutral bordered.

### `ButtonGroup`
Joins child buttons, collapsing inner radii and borders.

### `SplitButton`
`label`, `onClick?`, `Icon?`, `severity?`, `size?`, `menuLabel?`, `items: { label, Icon?, onSelect?, danger?, disabled? }[]`. Primary action + a menu button built on `DropdownMenu` (same keyboard model).

### `ToggleButton`
`on`, `onChange`, `onLabel`, `offLabel`, `OnIcon?`, `OffIcon?`, `size?`. Filled primary when on, outlined secondary when off. Sets `aria-pressed`.

---

## Badges · `badge.tsx`

### `Badge`
| Prop | Type | Default |
|---|---|---|
| `severity` | `Severity` | `'secondary'` |
| `variant` | `'soft' \| 'solid' \| 'outlined'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` (text 10/12/14) |
| `dot` | `boolean` | Status dot (replaces icon) |
| `Icon` | `IconType` | |
| `rounded` | `boolean` | `true` (pill); `false` gives 6px corners |
| `onRemove` | `() => void` | Adds a dismiss × (removable tag) |

### `CountBadge`
`count`, `max = 99` (shows `99+`), `severity = 'danger'`. Mono, solid.

## Avatars · `avatar.tsx`

### `Avatar`
`name` (required, initials fallback and accessible name), `src?`, `size = 36`, `ring?`, `square?` (12px radius), `status?: 'online' | 'away' | 'busy' | 'offline'`, `statusLabel?` (spoken status), `decorative?` (set when the name is already shown next to it).

### `AvatarGroup`
`people: { name, src? }[]`, `max = 4`. Overlapping 32px avatars plus a `+N` chip.

---

## Form inputs · `forms.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Input` | `inputSize: 'sm'\|'md'\|'lg'`, `Icon`, `TrailingIcon`, `error`, `success`, `ref`, …`InputHTMLAttributes` | `type="password"` adds a show/hide toggle (in the Tab order, `aria-pressed`) |
| `Field` | `label`, `hint`, `error`, `success`, `required`, `optional`, `charCount`, `maxChars`, `group` | Wires its control automatically: `id` for the label, `aria-describedby` (hint/error/count), `aria-invalid`, `aria-required`. Use `group` when it holds several buttons or chips. Custom controls can read the wiring with `useFieldControl()` |
| `Textarea` | `error`, `success` | min-height 80px, no resize |
| `InputGroup` | `prefix`, `suffix`, `prefixIcon`, `suffixIcon`, `suffixButton` | Add-ons share one focus ring |
| `RangeSlider` | `value`, `onChange`, `min`, `max`, `step`, `severity: 'primary'\|'success'\|'warning'\|'danger'`, `label`, `valueText`, `disabled` | Native range input; `label` is required outside a `Field` |
| `FileDropzone` | `accept`, `hint`, `onFiles`, `Icon` | A `<label>` around the native file input: drag-and-drop, click, Enter/Space |
| `PinInput` | `length = 6`, `onComplete`, `error`, `label`, `digitLabel` | `role="group"`; each box is named ("Digit 2 of 6"); arrows move; `autocomplete="one-time-code"` |
| `InlineEdit` | `value`, `onChange`, `placeholder` | Enter commits, Esc cancels |
| `Combobox` | `options: { value, label, meta? }[]`, `value`, `onChange`, `placeholder`, `label` | WAI-ARIA combobox with list autocomplete |
| `Select` | `options: string[]`, `value`, `onChange`, `label`, `disabled`, `error` | Select-only combobox: button + listbox, typeahead |
| `TagInput` | `tags`, `onChange`, `placeholder`, `suggestions`, `label` | Enter / comma adds, Backspace removes last; suggestions are a listbox reachable with arrows |

Input states: default · hover (`slate-300` border) · focus (focus ring) · error (rose border + rose-50/40 fill) · success (emerald-400 border) · disabled.

## Selection controls · `selection.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Toggle` | `on`, `onChange`, `disabled`, `size`, `label` / `labelledBy`, `describedBy` | `role="switch"`. Needs a name: `label`, or use `SwitchRow`. Track 36×20 / 44×24 / 52×28 |
| `SwitchRow` | `label`, `description`, `on`, `onChange`, `disabled`, `size` | Full-width labelled toggle |
| `Checkbox` | `checked`, `indeterminate`, `onChange`, `label`, `description`, `disabled`, `error`, `size` | `aria-checked="mixed"` when indeterminate |
| `Radio` | `checked`, `onChange`, `label`, `description`, `disabled`, `error`, `size` | Use inside `RadioGroup` for arrow-key behaviour |
| `RadioGroup<T>` | `label`, `options: { value, label, description?, disabled? }[]`, `value`, `onChange`, `size`, `orientation`, `error` | `role="radiogroup"`, one Tab stop, arrows move and select |
| `RadioCard` | `checked`, `onChange`, `label`, `description`, `Icon`, `badge`, `disabled` | Selectable card |
| `SegmentedControl<T>` | `options: { value, label, Icon? }[]`, `value`, `onChange`, `size`, `label` | `role="radiogroup"`, one Tab stop, arrows select |
| `CheckboxGroup` | `title`, `options`, `values: Set<string>`, `onChange` | Select-all with indeterminate parent |

---

## Feedback · `feedback.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Alert` | `severity = 'primary'`, `variant: 'soft'\|'solid'\|'outlined'`, `title`, `children`, `Icon`, `actions`, `onClose` | Each severity has a default glyph, so meaning never relies on color alone. `role="alert"` for danger/warning, `role="status"` otherwise |
| `Progress` | `value` (0–100), `severity`, `showValue`, `label`, `valueText` | `role="progressbar"`; pass `label` |
| `Skeleton` | `className` | Pulse placeholder (`aria-hidden`, no motion with reduced-motion). Set `aria-busy` on the loading container |
| `Toast` | `item: { id, severity, title, description? }`, `onDismiss` | severity: `success · info · warning · danger · primary`. `role="status"` (`alert` for danger) |
| `ToastStack` | `toasts`, `onDismiss`, `label = 'Notifications'` | Fixed bottom-right labelled landmark |

## Navigation · `navigation.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Tabs` | `tabs: (TabItem \| string)[]`, `value`, `onChange`, `variant: 'underline'\|'pills'\|'boxed'`, `size`, `label`, `id` | `TabItem = { key, label, Icon?, badge?, disabled? }`. WAI-ARIA tabs, automatic activation. Pass `id` and wrap content in `<TabPanel tabsId tabKey>` to link panels |
| `Breadcrumb` | `items: { label, href?, Icon? }[]`, `maxItems`, `label` | Collapses middle items into an expandable "…". Last item gets `aria-current="page"` |
| `Steps` | `steps: { label, description?, status? }[]`, `current`, `orientation: 'horizontal'\|'vertical'`, `label`, `statusText` | status: `complete · current · upcoming · error`. Current step has `aria-current="step"`; status is spoken |
| `NavMenu` | `items: NavMenuItem[]`, `value`, `onChange`, `collapsed`, `label` | One level of children, badges, icon-only collapsed mode. Groups expose `aria-expanded`; active item `aria-current="page"` |

## Overlays · `overlays.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Tooltip` | `label`, `description`, `placement: 'top'\|'bottom'\|'left'\|'right'`, `children` | Shows on hover and keyboard focus, Escape dismisses (WCAG 1.4.13). `role="tooltip"` + `aria-describedby` on the child |
| `Modal` | `open`, `onClose`, `title`, `description`, `size: 'sm'\|'md'\|'lg'\|'xl'\|'full'`, `icon`, `iconSeverity = 'danger'`, `footer` | Widths 384 / 448 / 512 / 672 / viewport. `role="dialog"` + `aria-modal`, focus trapped, Escape closes, focus returns |
| `Drawer` | `open`, `onClose`, `title`, `description`, `side: 'right'\|'left'\|'bottom'`, `footer` | 448px wide; bottom sheet max 85dvh. Same dialog behaviour as Modal |
| `Popover` | `trigger`, `title`, `description`, `align: 'start'\|'end'\|'center'` | 288px. Non-modal dialog: trigger gets `aria-expanded`, focus moves in, Escape or outside click closes |
| `DropdownMenu` | `trigger`, `items: DropdownItem[]`, `align`, `label` | Item types: `item` (Icon, shortcut, danger, disabled) · `separator` · `label`. WAI-ARIA menu button |

## Layout & containers · `layout.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Card` | `className` | 16px radius, hairline border, resting shadow |
| `Panel` | `title`, `description`, `icon`, `iconSeverity`, `actions`, `footer`, `collapsible` | Card with header/body/footer. Collapse button has `aria-expanded` |
| `Accordion` | `items: { id, title, description?, content }[]`, `allowMultiple`, `headingLevel = 3` | Triggers sit in headings, `aria-expanded` + `aria-controls`, panels are labelled regions |
| `Divider` | `label`, `soft` | Horizontal rule, optional centred label |

---

## Keyboard and screen-reader contract

Every interactive component follows the matching [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern. `tests/keyboard.mjs` checks the core ones in CI.

| Pattern | Components | Keys |
|---|---|---|
| Dialog (modal) | `Modal`, `Drawer` | Focus moves in on open · Tab / Shift+Tab cycle inside · Escape closes · focus returns to the opener |
| Dialog (non-modal) | `Popover` | Enter/Space opens and moves focus in · Escape closes and refocuses the trigger |
| Menu button | `DropdownMenu`, `SplitButton` | Enter/Space/↓ open on the first item, ↑ on the last · ↑↓ Home End move · Enter activates · Escape closes · Tab leaves |
| Select-only combobox | `Select` | Enter/Space/↑↓ open · ↑↓ Home End move · type to jump · Enter/Space choose · Escape closes |
| Combobox (autocomplete) | `Combobox`, `TagInput` | Type to filter · ↑↓ move the active option · Enter selects · Escape closes |
| Tabs | `Tabs` | One Tab stop · ←→ move and select · Home End |
| Radio group | `RadioGroup`, `SegmentedControl` | One Tab stop · arrows move and select |
| Switch / checkbox | `Toggle`, `SwitchRow`, `Checkbox` | Space toggles |
| Disclosure | `Accordion`, `Panel`, `NavMenu` groups | Enter/Space expand and collapse |
| Tooltip | `Tooltip` | Appears on focus · Escape hides it |

Helpers in `src/components/a11y.ts` (`useDialogFocus`, `listKeyNav`, `mergeTriggerProps`) implement these behaviours once, so new components can reuse them.

---

## Patterns (in the documentation site)

These are built from the components above and live in `src/site/showcase.tsx`. They're good candidates to move into the library:

| Pattern | Pieces |
|---|---|
| **Metric cards** | `MetricCard`, `MetricCardCompact`, `MetricCardHero`, `MetricCardGoal`, `MetricCardBreakdown`, `MetricCardComparison`, plus skeleton / empty / error states, `Sparkline`, `SparkBar`, `DeltaBadge` |
| **Data table** | `DataTable`, `FullDataTable` (sort, density, column visibility, selection), `ExpandableTable`, `SkeletonTable`, `EmptyTable`, `Pagination`, `StreamCard` (mobile card view) |
| **Data visualization** | `VizLineChart`, `VizBarChart`, `VizGroupedBar`, `VizHBarChart`, `VizStackedBar`, `VizDivergingBar`, `VizHeatmap`, `VizDonut`, `VizScatter`, `VizMeter`, `VizSparkline`, `VizStatTile`, all dependency-free SVG on the `color.viz.*` palettes |
| **Notifications** | `NotificationCenter`, `NotificationsBell` |
| **Destructive flows** | `DestructiveRow`, `SoftDeleteDemo` (type-to-confirm, undo) |

## Examples

- **Tendero console** (`src/site/console-example.tsx`): a full dashboard built only with Pance components.
- **AfterQuake** (`AfterQuakePage`): an emergency-response dashboard over a Colombia department map (`colombia-geo.ts`).
- **Dashboard** (`DashboardPage`).
