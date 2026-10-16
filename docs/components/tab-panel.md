# TabPanel

> The content region linked to a tab.

```tsx
import { TabPanel } from '@pance/react'
```

Source: [`src/components/navigation.tsx`](../../src/components/navigation.tsx) · Tokens: `tabs.*` in [tokens.md](../tokens.md)

## When to use

- Wrap each tab's content so it is labelled by its tab.

## When not to use

- Using it without `Tabs`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tabsId` | `string` | **required** |  |
| `tabKey` | `string` | **required** |  |
| `className` | `string` | `''` |  |
| `children` | `ReactNode` | **required** |  |

## Accessibility

- `role="tabpanel"` labelled by the tab; hidden when inactive.

## Related

[`Tabs`](tabs.md)

## Example

```tsx
<TabPanel tabsId="stream" tabKey="Activity">…</TabPanel>
```
