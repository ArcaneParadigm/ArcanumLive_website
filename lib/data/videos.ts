/**
 * VIDEO CONTENT — edit this file to add/remove/update any video.
 * Just add a new object to the right array. The UI rebuilds automatically.
 *
 * To get a Vimeo ID: open the video on vimeo.com — the number in the URL is the ID.
 * e.g. https://vimeo.com/123456789 → vimeoId: '123456789'
 *
 * For Vimeo On Demand rentals, use the full URL in rentUrl.
 */

export type VideoType = 'film' | '360-film' | 'trailer' | 'music-video' | 'premiere' | 'dome-trailer'

export interface VideoItem {
  id: string
  title: string
  /** Vimeo video ID (the number from the URL) */
  vimeoId: string
  type: VideoType
  /** Short description shown in the grid */
  description?: string
  /** Runtime e.g. "12:30" */
  duration?: string
  /** Optional thumbnail override — leave blank to use Vimeo's auto-thumbnail */
  thumbnailUrl?: string
  /** For rentable films — full Vimeo On Demand URL */
  rentUrl?: string
  /** Tag this video to a world slug */
  worldSlug?: string
  /** Pin to the top of the page as "Premiere" */
  isPremiere?: boolean
}

// ─── TRAILERS ────────────────────────────────────────────────────────────────
// One strip — add your trailer Vimeo IDs here

export const trailers: VideoItem[] = [
  {
    id: 'tr-aeon',
    title: 'Aeon — Official Trailer',
    vimeoId: '76979871', // ← replace with real ID
    type: 'trailer',
    description: 'A cosmic 360 journey through the eternal cycles of creation.',
    duration: '2:30',
    worldSlug: 'aeon',
  },
  {
    id: 'tr-gaia',
    title: 'Gaia Heart Shard — Trailer',
    vimeoId: '76979871', // ← replace with real ID
    type: 'trailer',
    description: 'Descend into the living crystal heart of the Earth goddess.',
    duration: '1:55',
    worldSlug: 'gaia-heart-shard',
  },
  {
    id: 'tr-atlantis',
    title: 'Atlantis Nexus — Trailer',
    vimeoId: '76979871', // ← replace with real ID
    type: 'trailer',
    description: 'Ancient aquatic technology awakens beneath the world ocean.',
    duration: '2:10',
    worldSlug: 'atlantis-nexus',
  },
  {
    id: 'tr-soulblade',
    title: 'SoulBlade: The Awakening — Trailer',
    vimeoId: '76979871', // ← replace with real ID
    type: 'trailer',
    duration: '2:45',
    worldSlug: 'soulblade',
  },
  {
    id: 'tr-aether',
    title: 'Aether Transmission — Trailer',
    vimeoId: '76979871', // ← replace with real ID
    type: 'trailer',
    duration: '1:40',
    worldSlug: 'aether',
  },
]

// ─── RENTABLE FILMS ───────────────────────────────────────────────────────────
// These appear on /watch and /dome-shows with a "Rent" button

export const rentalFilms: VideoItem[] = [
  {
    id: 'film-aeon',
    title: 'Aeon',
    vimeoId: '76979871', // ← full film preview/teaser Vimeo ID
    type: '360-film',
    description: 'A cosmic 360° journey through the eternal cycles of creation and destruction.',
    duration: '24:00',
    rentUrl: 'https://vimeo.com/ondemand/aeon', // ← your Vimeo On Demand URL
    worldSlug: 'aeon',
  },
  {
    id: 'film-gaia',
    title: 'Gaia Heart Shard',
    vimeoId: '76979871',
    type: '360-film',
    description: 'Descend into the living crystal heart of the Earth goddess.',
    duration: '18:00',
    rentUrl: 'https://vimeo.com/ondemand/gaia-heart-shard',
    worldSlug: 'gaia-heart-shard',
  },
  {
    id: 'film-atlantis',
    title: 'Atlantis Nexus',
    vimeoId: '76979871',
    type: '360-film',
    description: 'Immerse in the ancient-tech temples of the sunken civilization.',
    duration: '21:00',
    rentUrl: 'https://vimeo.com/ondemand/atlantis-nexus',
    worldSlug: 'atlantis-nexus',
  },
  {
    id: 'film-soulblade',
    title: 'SoulBlade: The Awakening',
    vimeoId: '76979871',
    type: '360-film',
    description: 'Enter the battlefield between stars where the SoulBlade was forged.',
    duration: '32:00',
    rentUrl: 'https://vimeo.com/ondemand/soulblade',
    worldSlug: 'soulblade',
  },
  {
    id: 'film-aether',
    title: 'Aether Transmission',
    vimeoId: '76979871',
    type: '360-film',
    description: 'Receive the transmission from the edge of the known universe.',
    duration: '16:00',
    rentUrl: 'https://vimeo.com/ondemand/aether-transmission',
    worldSlug: 'aether',
  },
]

// ─── MUSIC VIDEOS ─────────────────────────────────────────────────────────────
// Add new music videos here — they appear on /watch

export const musicVideos: VideoItem[] = [
  {
    id: 'mv-cosmic-anthem',
    title: 'Cosmic Anthem',
    vimeoId: '76979871', // ← replace with real ID
    type: 'music-video',
    description: 'Official music video — Cosmic genre.',
    duration: '4:22',
    worldSlug: 'the-arcanum',
  },
  {
    id: 'mv-sacred-downtempo',
    title: 'Sacred Downtempo',
    vimeoId: '76979871',
    type: 'music-video',
    description: 'Mystical · Sacred Downtempo',
    duration: '5:10',
  },
  {
    id: 'mv-cyber-ritual',
    title: 'Cyber Ritual',
    vimeoId: '76979871',
    type: 'music-video',
    description: 'Dark ritual electronic',
    duration: '3:55',
  },
]

// ─── PREMIERES ────────────────────────────────────────────────────────────────
// These appear as featured/pinned at top of /watch

export const premieres: VideoItem[] = [
  {
    id: 'premiere-aeon',
    title: 'Aeon — World Premiere',
    vimeoId: '76979871', // ← replace with real premiere vimeo ID
    type: 'premiere',
    description: 'The official world premiere screening of Aeon — a cosmic 360° fulldome journey.',
    isPremiere: true,
    worldSlug: 'aeon',
  },
]

// ─── ALL VIDEOS (for /watch page tabs) ───────────────────────────────────────
export const allVideos: VideoItem[] = [
  ...premieres,
  ...rentalFilms,
  ...trailers,
  ...musicVideos,
]
