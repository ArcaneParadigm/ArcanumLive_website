/**
 * Auto-discovers images AND audio from public/realms/[slug]/ and
 * public/audio/realms/[slug]/ at render time.
 * Drop files in — they appear. No config needed.
 *
 * Image folder layout (all optional):
 *   public/realms/raven/          ← any images here go to the main gallery
 *   public/realms/raven/gallery/  ← same
 *   public/realms/raven/lore/     ← split across lore chapters
 *   public/realms/raven/characters/ ← character gallery
 *
 * Audio folder layout:
 *   public/audio/realms/raven/    ← mp3/wav/ogg/flac files here → auto playlist
 *
 * Supported image formats: jpg jpeg png webp avif gif
 * Supported audio formats: mp3 wav ogg flac m4a
 */

import fs from 'fs'
import path from 'path'

const IMG_RE = /\.(jpg|jpeg|png|webp|avif|gif)$/i
const AUDIO_RE = /\.(mp3|wav|ogg|flac|m4a)$/i

function listImages(dir: string, urlBase: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => IMG_RE.test(f))
    .sort()
    .map((f) => `${urlBase}/${f}`)
}

function listAudio(dir: string, urlBase: string): DiscoveredAudioTrack[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => AUDIO_RE.test(f))
    .sort()
    .map((f, i) => ({
      id: `track-${i}`,
      // Strip extension and underscores/dashes for a readable title
      title: f.replace(AUDIO_RE, '').replace(/[-_]+/g, ' ').trim() || `Track ${i + 1}`,
      url: `${urlBase}/${f}`,
      filename: f,
    }))
}

export interface DiscoveredImages {
  gallery: string[]
  lore: string[]     // all lore images (page distributes across chapters)
  characters: string[]
  band?: string      // first gallery image, used in the homepage band
}

export interface DiscoveredAudioTrack {
  id: string
  title: string
  url: string
  filename: string
  duration?: string
}

// discoverRealmCardImage and discoverRealmHeroImage have moved to realmMeta.ts
// (fs-free module, safe to import in prerendered pages without bundle blowup)
export { discoverRealmCardImage, discoverRealmHeroImage } from '@/lib/utils/realmMeta'

export function discoverRealmImages(slug: string): DiscoveredImages {
  const base = path.join(process.cwd(), 'public', 'realms', slug)
  const urlBase = `/realms/${slug}`

  // Gallery: root + gallery/ subfolder combined
  const rootImgs = listImages(base, urlBase)
  const galleryImgs = listImages(path.join(base, 'gallery'), `${urlBase}/gallery`)
  const gallery = [...rootImgs, ...galleryImgs]

  // Lore images
  const lore = listImages(path.join(base, 'lore'), `${urlBase}/lore`)

  // Character images
  const characters = listImages(path.join(base, 'characters'), `${urlBase}/characters`)

  return {
    gallery,
    lore,
    characters,
    band: gallery[0],
  }
}

/**
 * Discovers a frame sequence from public/realms/[slug]/seq/
 * Returns sorted array of URLs — drop frames in, they appear automatically.
 */
export function discoverRealmSequence(slug: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'realms', slug, 'seq')
  return listImages(dir, `/realms/${slug}/seq`)
}

/**
 * Discovers audio tracks from public/audio/realms/[slug]/
 * Drop mp3/wav/ogg/flac/m4a files in → they appear as a playlist automatically.
 */
export function discoverRealmAudio(slug: string): DiscoveredAudioTrack[] {
  // Check both locations: public/audio/realms/[slug]/ and public/realms/[slug]/audio/
  const dir1 = path.join(process.cwd(), 'public', 'audio', 'realms', slug)
  const dir2 = path.join(process.cwd(), 'public', 'realms', slug, 'audio')
  if (fs.existsSync(dir1)) return listAudio(dir1, `/audio/realms/${slug}`)
  if (fs.existsSync(dir2)) return listAudio(dir2, `/realms/${slug}/audio`)
  return []
}

/**
 * Discovers 16:9 art for a given page from public/art/[page]/
 * Drop JPG/PNG/WEBP files in — they appear automatically.
 *
 * Folder layout:
 *   public/art/home/          ← hero background images, cycle on homepage
 *   public/art/worlds/        ← worlds page background
 *   public/art/dome-shows/    ← dome shows page
 *   public/art/watch/
 *   public/art/music/
 *   public/art/screensaver/
 *   public/art/realms/[slug]/ ← per-realm hero art (overrides gradient)
 *
 * Naming: prefix with 01-, 02- etc. to control display order.
 * Falls back to `fallback` array if the folder is empty or missing.
 */
export function discoverPageArt(page: string, fallback: string[] = []): string[] {
  const dir = path.join(process.cwd(), 'public', 'art', page)
  const urlBase = `/art/${page}`
  // Exclude ui-overlay.* — that's handled separately as a fixed UI layer
  const found = listImages(dir, urlBase).filter((f) => !f.includes('ui-overlay'))
  return found.length > 0 ? found : fallback
}

/**
 * Looks for a UI chrome overlay PNG in public/art/[page]/ui-overlay.png
 * Export your buttons/panels/type as a transparent-background PNG and drop it here.
 * It sits above the cycling background but below glow hotspots — background fades,
 * UI chrome stays locked.
 */
export function discoverPageOverlay(page: string): string | null {
  const exts = ['png', 'webp']
  for (const ext of exts) {
    const file = path.join(process.cwd(), 'public', 'art', page, `ui-overlay.${ext}`)
    if (fs.existsSync(file)) return `/art/${page}/ui-overlay.${ext}`
  }
  return null
}

/**
 * Splits a flat image array as evenly as possible across N buckets.
 * Used to distribute lore images across chapters.
 */
export function splitAcrossChapters(images: string[], chapters: number): string[][] {
  if (images.length === 0) return Array.from({ length: chapters }, () => [])
  const result: string[][] = Array.from({ length: chapters }, () => [])
  images.forEach((img, i) => result[i % chapters].push(img))
  return result
}

/**
 * Converts a string[] of paths into GalleryImage objects.
 * Pads with empty placeholder slots if fewer than minSlots real images.
 */
export function toGalleryImages(
  srcs: string[],
  slug: string,
  label: string,
  minSlots = 6,
) {
  const total = Math.max(srcs.length, minSlots)
  return Array.from({ length: total }, (_, i) => ({
    id: `${slug}-${label}-${i}`,
    src: srcs[i] ?? undefined,
    caption: srcs[i] ? undefined : `${label} · ${i + 1}`,
  }))
}
