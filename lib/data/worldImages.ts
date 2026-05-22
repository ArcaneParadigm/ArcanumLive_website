/**
 * REALM IMAGE LIBRARY
 * ═══════════════════════════════════════════════════════════════════════
 *
 * HOW TO ADD ART
 * ──────────────
 * 1. Drop your image file into:
 *      public/realms/<realm-slug>/
 *    e.g.  public/realms/creatrix/hero.jpg
 *          public/realms/creatrix/lore-1.jpg
 *
 * 2. Add the path below under the matching realm slug.
 *    Paths start with /  (relative to public/)
 *    e.g.  src: '/realms/creatrix/hero.jpg'
 *
 * 3. Save — the gallery fills automatically. No other changes needed.
 *
 * USING EXTERNAL URLS
 * ───────────────────
 * You can also paste any full URL (Supabase, Cloudinary, etc.):
 *    src: 'https://your-bucket.supabase.co/storage/v1/object/public/...'
 *
 * IMAGE SLOTS
 * ───────────
 *  hero        — full-width banner at top of realm page (21:9)
 *  gallery     — main gallery system images (16:10 slots)
 *  lore[]      — arrays per lore chapter (index matches chapter order)
 *  characters  — character gallery images
 *  band        — images for the homepage Realms banner slideshow
 * ═══════════════════════════════════════════════════════════════════════
 */

export interface RealmImageSet {
  hero?: string
  gallery?: string[]
  lore?: string[][]     // lore[chapterIndex][imageIndex]
  characters?: string[]
  band?: string         // single image for the homepage band
}

export const realmImages: Record<string, RealmImageSet> = {

  'the-arcanum': {
    hero: undefined,              // e.g. '/realms/the-arcanum/hero.jpg'
    gallery: [],                  // e.g. ['/realms/the-arcanum/gal-1.jpg', ...]
    lore: [[], [], []],           // 3 chapters
    characters: [],
    band: undefined,
  },

  'mythmachine': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'soulblade': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'atlantis-nexus': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'gaia-heart-shard': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'aether': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'creatrix': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'raven': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'kali': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'coyote': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'dome-worlds': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

  'cosmic-surfer': {
    hero: undefined,
    gallery: [],
    lore: [[], [], []],
    characters: [],
    band: undefined,
  },

}

/**
 * Helper — build a GalleryImage array from a string[] of src paths.
 * Fills remaining slots as placeholders so the gallery always shows
 * something even when partially loaded.
 */
export function toGalleryImages(
  srcs: string[] | undefined,
  slug: string,
  label: string,
  minSlots = 6,
) {
  const filled = srcs ?? []
  const total = Math.max(filled.length, minSlots)
  return Array.from({ length: total }, (_, i) => ({
    id: `${slug}-${label}-${i}`,
    src: filled[i] ?? undefined,
    caption: `${label} · ${i + 1}`,
  }))
}
