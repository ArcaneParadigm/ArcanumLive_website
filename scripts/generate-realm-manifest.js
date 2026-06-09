/**
 * Scans public/realms/ and public/audio/realms/ at build time and writes
 * lib/data/realms-manifest.json — a static lookup used by realmImages.ts
 * instead of runtime fs.readdirSync calls (which cause Next.js to bundle
 * all realm images into every serverless function, blowing past 2GB limits).
 *
 * Run via: node scripts/generate-realm-manifest.js
 * Hooked into: "prebuild" in package.json
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const REALMS_DIR = path.join(ROOT, 'public', 'realms')
const AUDIO_DIR = path.join(ROOT, 'public', 'audio', 'realms')
const OUT = path.join(ROOT, 'lib', 'data', 'realms-manifest.json')

const IMG_RE = /\.(jpg|jpeg|png|webp|avif|gif)$/i
const AUDIO_RE = /\.(mp3|wav|ogg|flac|m4a)$/i

function listDir(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).sort()
}

function listImages(dir, urlBase) {
  return listDir(dir).filter(f => IMG_RE.test(f)).map(f => `${urlBase}/${f}`)
}

function listAudio(dir, urlBase) {
  return listDir(dir).filter(f => AUDIO_RE.test(f)).map((f, i) => ({
    id: `track-${i}`,
    title: f.replace(AUDIO_RE, '').replace(/[-_]+/g, ' ').trim() || `Track ${i + 1}`,
    url: `${urlBase}/${f}`,
    filename: f,
  }))
}

const manifest = { realms: {}, audio: {} }

// Scan each realm slug
if (fs.existsSync(REALMS_DIR)) {
  for (const slug of fs.readdirSync(REALMS_DIR).sort()) {
    const base = path.join(REALMS_DIR, slug)
    if (!fs.statSync(base).isDirectory()) continue

    const urlBase = `/realms/${slug}`
    const rootImgs = listImages(base, urlBase)
    const galleryImgs = listImages(path.join(base, 'gallery'), `${urlBase}/gallery`)
    const gallery = [...rootImgs, ...galleryImgs]
    const lore = listImages(path.join(base, 'lore'), `${urlBase}/lore`)
    const characters = listImages(path.join(base, 'characters'), `${urlBase}/characters`)

    // Audio inside realm folder
    const realmAudio = listAudio(path.join(base, 'audio'), `${urlBase}/audio`)

    manifest.realms[slug] = { gallery, lore, characters, audio: realmAudio }
  }
}

// Legacy audio path: public/audio/realms/[slug]/
if (fs.existsSync(AUDIO_DIR)) {
  for (const slug of fs.readdirSync(AUDIO_DIR).sort()) {
    const dir = path.join(AUDIO_DIR, slug)
    if (!fs.statSync(dir).isDirectory()) continue
    manifest.audio[slug] = listAudio(dir, `/audio/realms/${slug}`)
  }
}

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2))
console.log(`[realm-manifest] wrote ${OUT}`)
console.log(`  ${Object.keys(manifest.realms).length} realms, ${Object.keys(manifest.audio).length} legacy audio slugs`)
