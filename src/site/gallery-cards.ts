// The twelve live cards of the gallery (DDR-DS-030). Each one is built only from @pance/react components.
// Kept free of imports so tests/gallery.mjs can read it directly.
export type GalleryCardMeta = { id: string; uses: string[] }

export const GALLERY_CARDS: GalleryCardMeta[] = [
  { id: 'metric', uses: ['MetricCard'] },
  { id: 'line', uses: ['LineChart'] },
  { id: 'bar', uses: ['BarChart'] },
  { id: 'donut', uses: ['DonutChart'] },
  { id: 'diverging', uses: ['DivergingBarChart'] },
  { id: 'scatter', uses: ['ScatterChart'] },
  { id: 'progress', uses: ['Progress', 'Steps'] },
  { id: 'table', uses: ['DataTable', 'Badge'] },
  { id: 'calendar', uses: ['Calendar'] },
  { id: 'notifications', uses: ['NotificationCenter'] },
  { id: 'confirm', uses: ['ConfirmDialog', 'Button'] },
  { id: 'loading', uses: ['Button'] },
]
