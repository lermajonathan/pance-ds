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
`label`, `Icon?`, `severity?`, `size?`, `items: { label, Icon?, onSelect?, danger? }[]`. Primary action + chevron menu. Closes on outside click.

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
`name` (required, initials fallback), `src?`, `size = 36`, `ring?`, `square?` (12px radius), `status?: 'online' | 'away' | 'busy' | 'offline'`.

### `AvatarGroup`
`people: { name, src? }[]`, `max = 4`. Overlapping 32px avatars plus a `+N` chip.

---

## Form inputs · `forms.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Input` | `inputSize: 'sm'\|'md'\|'lg'`, `Icon`, `TrailingIcon`, `error`, `success`, `ref`, …`InputHTMLAttributes` | `type="password"` adds a show/hide toggle |
| `Field` | `label`, `hint`, `error`, `success`, `required`, `optional`, `charCount`, `maxChars` | Wraps any control; error/success messages carry an icon |
| `Textarea` | `error`, `success` | min-height 80px, no resize |
| `InputGroup` | `prefix`, `suffix`, `prefixIcon`, `suffixIcon`, `suffixButton` | Add-ons share one focus ring |
| `RangeSlider` | `value`, `onChange`, `min`, `max`, `step`, `severity: 'primary'\|'success'\|'warning'\|'danger'` | Filled track gradient |
| `FileDropzone` | `accept`, `hint`, `onFiles`, `Icon` | Drag-and-drop + click, lists files with remove |
| `PinInput` | `length = 6`, `onComplete`, `error` | Numeric, auto-advance, paste support |
| `InlineEdit` | `value`, `onChange`, `placeholder` | Enter commits, Esc cancels |
| `Combobox` | `options: { value, label, meta? }[]`, `value`, `onChange`, `placeholder` | Type-to-filter |
| `Select` | `options: string[]`, `value`, `onChange` | Custom dropdown |
| `TagInput` | `tags`, `onChange`, `placeholder`, `suggestions` | Enter / comma adds, Backspace removes last |

Input states: default · hover (`slate-300` border) · focus (focus ring) · error (rose border + rose-50/40 fill) · success (emerald-400 border) · disabled.

## Selection controls · `selection.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Toggle` | `on`, `onChange`, `disabled`, `size` | `role="switch"`. Track 36×20 / 44×24 / 52×28 |
| `SwitchRow` | `label`, `description`, `on`, `onChange`, `disabled`, `size` | Full-width labelled toggle |
| `Checkbox` | `checked`, `indeterminate`, `onChange`, `label`, `description`, `disabled`, `error`, `size` | `aria-checked="mixed"` when indeterminate |
| `Radio` | `checked`, `onChange`, `label`, `description`, `disabled`, `error`, `size` | |
| `RadioCard` | `checked`, `onChange`, `label`, `description`, `Icon`, `badge`, `disabled` | Selectable card |
| `SegmentedControl<T>` | `options: { value, label, Icon? }[]`, `value`, `onChange`, `size` | Single-select strip |
| `CheckboxGroup` | `title`, `options`, `values: Set<string>`, `onChange` | Select-all with indeterminate parent |

---

## Feedback · `feedback.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Alert` | `severity = 'primary'`, `variant: 'soft'\|'solid'\|'outlined'`, `title`, `children`, `Icon`, `actions`, `onClose` | Each severity has a default glyph, so meaning never relies on color alone. `role="alert"` |
| `Progress` | `value` (0–100), `severity`, `showValue` | `role="progressbar"` |
| `Skeleton` | `className` | Pulse placeholder, size via classes |
| `Toast` | `item: { id, severity, title, description? }`, `onDismiss` | severity: `success · info · warning · danger · primary` |
| `ToastStack` | `toasts`, `onDismiss` | Fixed bottom-right stack |

## Navigation · `navigation.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Tabs` | `tabs: (TabItem \| string)[]`, `value`, `onChange`, `variant: 'underline'\|'pills'\|'boxed'`, `size` | `TabItem = { key, label, Icon?, badge?, disabled? }`. Active icon switches to `fill` weight |
| `Breadcrumb` | `items: { label, href?, Icon? }[]`, `maxItems` | Collapses middle items into an expandable "…" |
| `Steps` | `steps: { label, description?, status? }[]`, `current`, `orientation: 'horizontal'\|'vertical'` | status: `complete · current · upcoming · error` |
| `NavMenu` | `items: NavMenuItem[]`, `value`, `onChange`, `collapsed` | One level of children, badges, icon-only collapsed mode |

## Overlays · `overlays.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Tooltip` | `label`, `description`, `placement: 'top'\|'bottom'\|'left'\|'right'`, `children` | Ink background, CSS-only on hover |
| `Modal` | `open`, `onClose`, `title`, `description`, `size: 'sm'\|'md'\|'lg'\|'xl'\|'full'`, `icon`, `iconSeverity = 'danger'`, `footer` | Widths 384 / 448 / 512 / 672 / viewport. Blurred ink scrim |
| `Drawer` | `open`, `onClose`, `title`, `description`, `side: 'right'\|'left'\|'bottom'`, `footer` | 448px wide; bottom sheet max 85dvh |
| `Popover` | `trigger`, `title`, `description`, `align: 'start'\|'end'\|'center'` | 288px, closes on outside click |
| `DropdownMenu` | `trigger`, `items: DropdownItem[]`, `align` | Item types: `item` (Icon, shortcut, danger, disabled) · `separator` · `label` |

## Layout & containers · `layout.tsx`

| Component | Key props | Notes |
|---|---|---|
| `Card` | `className` | 16px radius, hairline border, resting shadow |
| `Panel` | `title`, `description`, `icon`, `iconSeverity`, `actions`, `footer`, `collapsible` | Card with header/body/footer |
| `Accordion` | `items: { id, title, description?, content }[]`, `allowMultiple` | |
| `Divider` | `label`, `soft` | Horizontal rule, optional centred label |

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
