/* Demo photos (Unsplash License) are self-hosted under public/img so the
   docs never depend on a third-party CDN. `photo` = square avatar crop,
   `scene` = 3:2 landscape. */
const IMG_BASE = `${import.meta.env.BASE_URL}img/`
export const photo = (id: string) => `${IMG_BASE}av-${id.replace('photo-', '')}.webp`
export const scene = (id: string) => `${IMG_BASE}ph-${id.replace('photo-', '')}.webp`
