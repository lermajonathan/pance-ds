# Tabs

> Switches between related views of the same content without leaving the page.

```tsx
import { Tabs } from '@pance/react'
```

Source: [`src/components/navigation.tsx`](../../src/components/navigation.tsx) · Figma: `Tabs`, `Tab` · Tokens: `tabs.*` in [tokens.md](../tokens.md)

## When to use

- Peer sections of one object: Overview, Activity, Settings.

## When not to use

- Steps in order: use `Steps`.
- Changing how the same data is displayed: use `SegmentedControl`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tabs` | `(string \| TabItem)[]` | **required** |  |
| `value` | `string` | **required** |  |
| `onChange` | `(v: string) => void` | **required** |  |
| `variant` | `TabVariant` | `'underline'` |  |
| `size` | `TabSize` | `'md'` |  |
| `label` | `string` |  | Accessible name of the tab list, e.g. "Report sections". |
| `id` | `string` |  | Set it to link tabs to <TabPanel>s with aria-controls. |

## Accessibility

- WAI-ARIA tabs with automatic activation: one Tab stop, ←→ move and select, Home and End.
- Give `label` to name the tab list; pass `id` and wrap content in `TabPanel` to link panels with `aria-controls`.

## Content

- One or two words each. Do not wrap onto two lines.

## Related

[`TabPanel`](tab-panel.md) · [`SegmentedControl`](segmented-control.md) · [`NavMenu`](nav-menu.md)

## Example

```tsx
<Tabs id="stream" label="Stream sections" tabs={['Overview', 'Activity']} value={tab} onChange={setTab} />
<TabPanel tabsId="stream" tabKey="Overview">…</TabPanel>
```
