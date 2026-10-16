# Components

71 components, one page each. Every page has a short summary, when to use it and when not to, props (generated from the TypeScript source, so they cannot drift), accessibility behaviour, content guidance, related components and a working example.

Cross-cutting reference stays in [components.md](../components.md) (shared model, keyboard contract, built-in strings) and [tokens.md](../tokens.md). Figma component names and prop mapping are in [figma-code-map.md](../figma-code-map.md).

## Layout

| Component | Use it for |
|---|---|
| [`Accordion`](accordion.md) | Stacked sections that expand and collapse. |
| [`Card`](card.md) | A bordered surface with a resting shadow for grouping content. |
| [`Divider`](divider.md) | A horizontal rule, optionally with a centred label. |
| [`Panel`](panel.md) | A card with header, body, footer and optional collapse. |

## Feedback

| Component | Use it for |
|---|---|
| [`Alert`](alert.md) | An inline message about the state of the page or a form, in context. |
| [`EmptyState`](empty-state.md) | Explains why there is nothing to show and offers one next step. |
| [`Progress`](progress.md) | A bar showing how far a task has got. |
| [`Skeleton`](skeleton.md) | A pulsing placeholder that holds the shape of content while it loads. |
| [`Spinner`](spinner.md) | An indeterminate loading indicator with a text name. |
| [`Toast`](toast.md) | A short, temporary message about something that just happened, with an optional follow-up action such as Undo. |
| [`ToastStack`](toast-stack.md) | The fixed bottom-right container that stacks toasts as a labelled landmark. |

## Display

| Component | Use it for |
|---|---|
| [`Avatar`](avatar.md) | A person or entity as an image or initials, with an optional presence status. |
| [`AvatarGroup`](avatar-group.md) | Overlapping avatars with a +N chip for the rest. |
| [`Badge`](badge.md) | A small label for status, category or a removable tag. |
| [`CountBadge`](count-badge.md) | A compact numeric counter, capped at `max` (shows `99+`). |

## Charts

| Component | Use it for |
|---|---|
| [`BarChart`](bar-chart.md) | Compares values across categories, grouped or stacked. |
| [`DivergingBarChart`](diverging-bar-chart.md) | Bars growing left and right of a zero line for positive and negative values. |
| [`DonutChart`](donut-chart.md) | Shows parts of a whole. |
| [`Heatmap`](heatmap.md) | A grid where cell intensity shows a value. |
| [`LineChart`](line-chart.md) | Trends over a continuous or ordered axis. |
| [`Meter`](meter.md) | One measurement against a known maximum, such as storage used. |
| [`RankedBarChart`](ranked-bar-chart.md) | Horizontal bars sorted by value, for rankings. |
| [`ScatterChart`](scatter-chart.md) | Two numeric measures per point, to show correlation or outliers. |

## Navigation

| Component | Use it for |
|---|---|
| [`Breadcrumb`](breadcrumb.md) | Shows where the current page sits in a hierarchy. |
| [`NavMenu`](nav-menu.md) | A vertical app navigation with groups, badges and a collapsed icon-only mode. |
| [`Steps`](steps.md) | Shows progress through an ordered process. |
| [`TabPanel`](tab-panel.md) | The content region linked to a tab. |
| [`Tabs`](tabs.md) | Switches between related views of the same content without leaving the page. |

## Actions

| Component | Use it for |
|---|---|
| [`Button`](button.md) | The primary way to trigger an action. |
| [`ButtonGroup`](button-group.md) | Joins related buttons into one control by collapsing inner borders and radii. |
| [`IconButton`](icon-button.md) | A square, bordered button that shows only an icon. |
| [`Link`](link.md) | An inline navigation link that is always underlined, so it never depends on colour alone. |
| [`SplitButton`](split-button.md) | A primary action with a menu of alternatives attached. |
| [`ToggleButton`](toggle-button.md) | A button that stays pressed: filled when on, outlined when off. |

## Dates

| Component | Use it for |
|---|---|
| [`Calendar`](calendar.md) | A month grid for picking one date. |
| [`DatePicker`](date-picker.md) | A button that opens a calendar and shows the chosen date. |
| [`DateRangePicker`](date-range-picker.md) | A button that opens a two-month calendar with optional presets. |
| [`RangeCalendar`](range-calendar.md) | A calendar for picking a start and end date, with one or two months. |

## Selection

| Component | Use it for |
|---|---|
| [`Checkbox`](checkbox.md) | Selects zero or more items, with an indeterminate state for partial groups. |
| [`CheckboxGroup`](checkbox-group.md) | A titled list of checkboxes with a select-all parent. |
| [`Radio`](radio.md) | A single option in a set where exactly one can be chosen. |
| [`RadioCard`](radio-card.md) | A selectable card for choices that need more room than a radio row. |
| [`RadioGroup`](radio-group.md) | A labelled set of options where exactly one is selected. |
| [`SegmentedControl`](segmented-control.md) | A compact single-choice control for switching a view or a mode. |
| [`SwitchRow`](switch-row.md) | A full-width row with a title, description and a switch. |
| [`Toggle`](toggle.md) | An on/off switch for a setting that applies immediately. |

## Forms

| Component | Use it for |
|---|---|
| [`Combobox`](combobox.md) | A text field with an autocomplete list of options. |
| [`Field`](field.md) | Labels a control and connects its hint, error and character count to it for assistive technology. |
| [`FileDropzone`](file-dropzone.md) | A drag-and-drop area built on a native file input. |
| [`InlineEdit`](inline-edit.md) | Text that turns into an input on click and commits on Enter. |
| [`Input`](input.md) | A single-line text field in three sizes, with optional leading and trailing icons and error or success states. |
| [`InputGroup`](input-group.md) | An input with attached prefix, suffix, icons or a button that share one focus ring. |
| [`PinInput`](pin-input.md) | A row of single-character boxes for one-time codes. |
| [`RangeSlider`](range-slider.md) | A native range input for picking a number in an interval. |
| [`Select`](select.md) | A select-only dropdown built as a button plus listbox, with typeahead. |
| [`TagInput`](tag-input.md) | Collects a list of short values as removable chips, with optional suggestions. |
| [`Textarea`](textarea.md) | A multi-line text field with a fixed 80px minimum height. |

## Overlays

| Component | Use it for |
|---|---|
| [`ConfirmDialog`](confirm-dialog.md) | A modal for decisions that are hard to undo, with optional type-to-confirm. |
| [`Drawer`](drawer.md) | A side or bottom sheet for secondary tasks that keep context behind them. |
| [`DropdownMenu`](dropdown-menu.md) | A menu of actions opened from a button. |
| [`Modal`](modal.md) | A dialog that blocks the page until the person responds. |
| [`NotificationCenter`](notification-center.md) | A bell with an unread count that opens a list of notifications. |
| [`Popover`](popover.md) | A small non-modal panel anchored to a trigger. |
| [`Tooltip`](tooltip.md) | A short label that appears on hover and keyboard focus. |

## Data

| Component | Use it for |
|---|---|
| [`DataTable`](data-table.md) | A sortable, searchable, selectable table with pagination and a mobile card view. |
| [`Delta`](delta.md) | A change between two values with direction and good/bad colour. |
| [`MetricCard`](metric-card.md) | A key figure with context: label, value, change, trend and state. |
| [`Pagination`](pagination.md) | Page navigation for lists and tables. |
| [`Sparkline`](sparkline.md) | A tiny line or bar chart for trends inside other components. |

## Theme

| Component | Use it for |
|---|---|
| [`ThemeProvider`](theme-provider.md) | Chooses light, dark or system and sets `data-theme` on the document. |
| [`ThemeToggle`](theme-toggle.md) | A Light / Dark / System radio group wired to `ThemeProvider`. |
