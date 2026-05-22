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
 * Discovers audio tracks from public/audio/realms/[slug]/
 * Drop mp3/wav/ogg/flac/m4a files in → they appear as a playlist automatically.
 */
export function discoverRealmAudio(slug: string): DiscoveredAudioTrack[] {
  const dir = path.join(process.cwd(), 'public', 'audio', 'realms', slug)
  const urlBase = `/audio/realms/${slug}`
  return listAudio(dir, urlBase)
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
