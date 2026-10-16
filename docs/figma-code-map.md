# Figma to code map

Code Connect needs an Organization or Enterprise Figma plan, and this file lives on a Professional plan, so Dev Mode can't show code snippets yet. This table is the manual equivalent: each Figma component, the React export that implements it, and how its Figma properties map to props. Every component description in Figma also ends with its code name (`Code: <Button severity variant size>`).

When the file moves to an Organization plan, this table is the input for the `*.figma.tsx` Code Connect files.

Import everything from `@pance/react`.

| Figma component | React export | Figma property → prop |
|---|---|---|
| Button | `Button` | severity → `severity`, variant → `variant`, size → `size`, state → (interaction only; `disabled` for disabled), label → children, show icon / icon → `Icon` |
| IconButton | `IconButton` | same as Button; requires `aria-label` |
| Badge | `Badge` | severity, variant, size, label → children, dot → `dot`, removable → `onRemove` |
| Count badge | `CountBadge` | severity → `severity`; number → `count`; cap → `max` |
| Input | `Input` | size, state (error → `invalid` via `Field`, disabled → `disabled`), placeholder, value |
| Textarea | `Textarea` | as Input |
| Field | `Field` | label, hint, required → `required`, error message → `error`, status |
| Input group | `InputGroup` | prefix / trailing icon → `prefix`, `suffix` |
| Select | `Select` | value, state (disabled → `disabled`, error via `Field`) |
| Combobox | `Combobox` | open state is interaction only |
| Tag input | `TagInput` | chips → `value` |
| Checkbox | `Checkbox` | checked, indeterminate, size |
| Checkbox group | `CheckboxGroup` | legend → `legend` |
| Radio | `Radio` | checked, size |
| Radio group | `RadioGroup` | options → `options` |
| Radio card | `RadioCard` | checked is selection state |
| Toggle | `Toggle` | on → `checked`, size |
| SwitchRow | `SwitchRow` | label, description, on, disabled |
| Range slider | `RangeSlider` | value, label |
| File dropzone | `FileDropzone` | active is drag state |
| Pin input | `PinInput` | length → `length` |
| Inline edit | `InlineEdit` | display / editing is internal state |
| Date picker | `DatePicker` | state (disabled, error via `Field`) |
| Date picker panel, Calendar | `Calendar` | one month |
| Calendar / Range | `RangeCalendar` | range |
| Date range panel | `DateRangePicker` | presets → `presets` |
| Segmented control, Segment | `SegmentedControl` | size |
| Theme toggle | `ThemeToggle` | inside `ThemeProvider` |
| Button group | `ButtonGroup` | children |
| Split button | `SplitButton` | label, items → `items` |
| Toggle button | `ToggleButton` | on → `on` |
| Link | `Link` | variant (default, subtle), external → `external` |
| Alert | `Alert` | severity, variant, title, body → children, dismissible → `onClose` |
| Toast | `Toast` | severity |
| Tooltip | `Tooltip` | content |
| Modal | `Modal` | size, title, description |
| Drawer | `Drawer` | side, title |
| Popover | `Popover` | title |
| Menu, Menu item | `DropdownMenu` | items → `items` |
| Tabs, Tab | `Tabs` | active tab → `value` |
| Accordion item | `Accordion` | open state is interaction only |
| Breadcrumb | `Breadcrumb` | items → `items`, collapsed → `maxItems` |
| Nav menu item | `NavMenu` | active → `aria-current` via `active` |
| Steps, Step, Step connector | `Steps` | current step → `current` |
| Pagination, Pagination item | `Pagination` | page, pages |
| Card | `Card` | elevation |
| Panel | `Panel` | title, description, icon, collapsible |
| Divider | `Divider` | kind → `soft`, `label` |
| Avatar, Avatar group | `Avatar`, `AvatarGroup` | size, status, initials |
| Progress | `Progress` | value |
| Spinner | `Spinner` | size |
| Meter | `Meter` | severity → `severity` |
| Chart / Scatter | `ScatterChart` | points → `points` |
| Notification bell, Notification panel | `NotificationCenter` | unread is derived from `items` |
| Confirm dialog | `ConfirmDialog` | phrase → `requireText` |
| Toast / With action | `Toast` | action → `item.action` |
| Data table row / Expanded | `DataTable` | `renderExpanded` |
| Columns popover | `DataTable` | `columnToggle` |
| Skeleton | `Skeleton` | size by className |
| Empty state | `EmptyState` | title, description, action |
| Metric card (+ variants, states) | `MetricCard` and siblings | variant → component name |
| Delta | `Delta` | direction, value |
| Data table, Table row/cell/header cell | `DataTable` | columns, rows |
| Data table / Empty, / Loading | `DataTable` | empty, loading |
| Chart / Line, Bar grouped, Bar stacked, Ranked bar, Bar diverging, Heatmap, Donut | `LineChart`, `BarChart`, `Heatmap`, `DonutChart` | series, data; chart type → `variant` for bars |

Rows marked "interaction only" have a Figma variant for review purposes; the code derives that state from the user's input, so there is no prop to set.

Confirm exact prop names in `docs/components.md` and the exported types before wiring Code Connect; this table follows the public API as of 1.4.
