# Figma library

**File:** [Pance DS](https://www.figma.com/design/oU5j1pVQQZWGgZvTuW3IP1/Pance-DS). **Community listing:** [Pance Design System](https://www.figma.com/community/file/1694091498392766646) (free, duplicate it to use it). The repo is the source of truth; Figma mirrors it.

## Pages

Pages are grouped by separator pages (`──  COMPONENTS  ──`) and sorted A–Z inside each group.

| Page or group | What's there |
|---|---|
| Cover | File cover with a live shader background ("Pance Streamlines") over component instances |
| Getting started | A visual start page: hero, a three-step quick start with live components, key numbers, the three token tiers, a map of the file, Light and Dark side by side, pattern thumbnails, how a change reaches Figma, and links |
| Foundations · Icons | Color ramps, intents, typography, spacing, radius and elevation specimens, bound to variables and styles; the 70 icon components (a selection from Phosphor Icons, which has 1,000+; any Phosphor icon works with Pance) |
| Components | **One page per component** (66 pages, 88 components, 1,027 variants) |
| Patterns | Compositions built only from instances: "Create a stream" form, "Streams dashboard", "Filtered results", "Settings", "Destructive confirm", "Sign in", "Onboarding", "Notifications and toasts", "Team members", "Traffic report", "Loading, empty and error", "Checkout", "Profile" and "Search results" (14 patterns) |
| Decisions | **DDR-DS**: the register of design decisions, one card per record. The master text is [`docs/decisions/`](decisions/README.md) |
| Internal | **Community previews** (eight 1920 × 1080 gallery frames and a 4-second Motion intro for the Community listing), **Doc templates** (status chip, header, section banner and token row used by every component page) and Archive (the previous file content, untouched) |

### Anatomy of a component page

1. **Header:** name, status (Stable, Beta or Deprecated), the version it first shipped in, the docs file in this repo and the number of variants in Figma.
2. **Overview:** when to use the component and when another one fits better.
3. **Examples:** every variant axis and option (and each on/off property) as live instances, so a page shows everything the component can look like.
4. **Usage:** the import and a typical snippet.
5. **API:** the props table (type, default, notes).
6. **Accessibility:** keyboard, roles and content guidance.
7. **Components:** the masters, every variant.
8. **Tokens:** the component tokens from `tokens/components.json`, resolved for light mode (token, type, value, reference). Colors are bound to the matching variable when one exists.
9. **Related:** components that usually sit next to this one.

Component pages are generated from the repo data (guidance, props and snippets from `docs/components/`, tokens from `tokens/`), so those sections are regenerated, not typed. Status is Beta for the data, chart and date components added in 1.2.0 and 1.3.0 and Stable for the rest.

## Variables

| Collection | Modes | Count | Notes |
|---|---|---|---|
| Primitives | Value | 224 | Ramps, type, space, radius, size, opacity, breakpoints. Colors are hidden from pickers (`scopes: []`) |
| Semantic | Light · Dark | 147 | `color/bg/*`, `color/fg/*`, `color/border/*`, `color/intent/{8}/*`, focus, status, dataviz (series 1–8, no-data), radius, icon. Dark values are complete and checked: 178 token pairs pass WCAG 2.2 AA in light and dark |
| Components | Value | 507 | Button, Badge, Input, Toggle, Checkbox… alias Semantic, never hex |

Every variable has a scope and WEB code syntax matching `src/styles/tokens.css` (`var(--pance-color-intent-primary-solid)`).

**Binding coverage.** In the component masters, colors and strokes are bound to variables (99%), and so are font sizes, spacing and radii wherever a matching variable exists. The remaining unbound values are intentional: the internal geometry of charts (1–3 px bar and marker radii) and 3 px optical alignments have no token because they are not system decisions. Do not tokenize them.

**Styles:** 14 text styles (`typography/*`, font size and family bound to variables) 13 effect styles (`shadow/*`, `focus/ring*`) and 6 fill styles (`gradient/*`: brand, hero light and dark, surface soft, fade light and dark). Figma variables cannot hold gradients, so each gradient token is a fill style; `brand` and `surface-soft` are bound to variables, the styles with a transparent stop (hero, fade) hold resolved values per mode.

## Components (v1 core)

Property names match the React props so a component reads the same in design and code.

| Component | Variants | Properties |
|---|---|---|
| Button | 480 | severity · variant · size · state · label · show leading icon · leading icon · show trailing icon · trailing icon |
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
| Accordion | 1 | rounded, bordered group of three items (radius from `accordion.radius`, last divider removed) |

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

## Components (v1.4 actions and layout, added Oct 15)

| Component | Variants | Properties |
|---|---|---|
| Skeleton | 1 | `skeleton/bg`, `skeleton/radius` |
| Divider | 3 | kind (default · soft · labeled) |
| Count badge | 6 | severity (danger · primary · success · warning · info · contrast) |
| Breadcrumb | 2 | kind (default · collapsed) |
| Button group | 1 | three Button instances, inner corners square |
| Split button | 1 | Button + chevron Button |
| Toggle button | 2 | state (off · on) |
| Panel | 1 | header with icon, title, description, collapse; body |
| Popover | 1 | `popover/*` tokens |
| Drawer | 1 | `drawer/*` tokens, `shadow/lg` |

These compose the existing Button and Icon components, so a change to Button flows through.

## Components (v1.4 data and flows, added Oct 15)

Section "Data and flow additions".

| Component | Variants | Properties |
|---|---|---|
| Meter | 3 | severity (default · warning · danger); status text for warning and danger |
| Chart / Scatter | 1 | uses `chart/*` and `color/dataviz/*` |
| Notification bell | 2 | unread (false · true), count badge |
| Notification panel | 1 | header, three items with Mark as read and Dismiss |
| Confirm dialog | 2 | state (empty · phrase-matches), built from Modal |
| Toast / With action | 1 | Undo action |
| Data table row / Expanded | 1 | expand cell + detail row |
| Columns popover | 1 | one checkbox per column |

New component tokens: `meter/*`. Dark values for `meter/color/*` live in the repo (`pance.modes`); the Components collection has one mode, so Figma shows the light value.

## Components (v1.4 forms and selection, added Oct 15)

| Component | Variants | Properties |
|---|---|---|
| Input group | 1 | prefix, value, trailing icon in one border |
| Range slider | 1 | `range-slider/*` tokens |
| File dropzone | 2 | state (idle · active) |
| Pin input | 1 | six cells, focus ring on the current one |
| Inline edit | 2 | state (display · editing) |
| Combobox | 2 | state (closed · open) with listbox |
| Tag input | 1 | `tag-input/*` chips |
| Radio group | 1 | uses `radio/color/*` |
| Radio card | 2 | checked (false · true), `radio/card/*` |
| Checkbox group | 1 | legend plus three options |
| Nav menu item | 3 | state (default · hover · active) |

Every library component now has a Figma counterpart, with interaction states (see below). Patterns are listed in the Pages table.

Component dimensions in Figma are bound to the same variables as code where a token exists (avatar sizes, steps dot and connector, progress height, segmented control heights, card padding and radius).

## Interaction states (added Oct 15)

The components added after the first library pass now have the same hover, focus and disabled states as Button and Input. Focus uses the `focus/ring` effect style plus a `color/border/focus` stroke, disabled is `opacity/disabled` (0.45), and hover darkens the border (control borders) or tints the fill.

| Component | Property | New values |
|---|---|---|
| Link | `kind` (default, subtle, external) and `state` | default · hover (thicker underline, or link colour for subtle) · focus |
| Toggle button | `pressed` (off, on) and `state` | default · hover · focus · disabled (the inner Button instance switches state) |
| File dropzone | `drag` (idle, active) and `state` | default · hover · focus · disabled (idle only) |
| Inline edit | `mode` (display, editing) and `state` | default · hover · focus (display only) |
| Combobox | `list` (closed, open) and `state` | default · hover · focus · disabled (closed only) |
| Radio card | `checked` and `state` | default · hover · focus · disabled |
| Notification bell | `unread` and `state` | default · hover · focus |
| Input group, Tag input | `state` (now variant sets) | default · hover · focus · disabled |
| Range slider | `state` (now a variant set) | default · focus (the thumb) · disabled |
| Pin input | `state` (now a variant set) | default · disabled |
| Date picker | `state` | added hover and focus |
| Nav menu item | `state` | added focus and disabled |
| Calendar day | `state` | added focus |

Where a component already used `state` for something else, that property was renamed (`kind`, `pressed`, `drag`, `mode`, `list`) so `state` always means the interaction state. Instances keep working. Breadcrumb, Split button and Theme toggle inherit their states from Link and Button.

## Keeping Figma in sync

1. Edit `tokens/*.json` and run `pnpm tokens`.
2. Push the change to Figma with one of these options:
   - **Tokens Studio** for Figma, pointed at `tokens/` (DTCG format; dark values live in `$extensions.pance.modes.dark`).
   - **Claude with the Figma connector**: ask it to "sync the Pance tokens to Figma". The sync updates variables by name, so bindings never break.
3. Never edit a variable value directly in Figma. Change it in the JSON, or the next sync overwrites it.
