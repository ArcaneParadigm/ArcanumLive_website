export interface YTChannel {
  id: string
  name: string
  handle: string
  tagline: string
  description: string
  url: string
  subscribeUrl: string
  color: string
  accentColor: string
  image: string
  /** slug keywords that map content to this channel */
  keywords: string[]
}

export const YT_CHANNELS: YTChannel[] = [
  {
    id: 'arcane-realities',
    name: 'Arcane Realities 360',
    handle: '@ArcaneRealities360',
    tagline: 'Immersive dome shows, realms & cosmic visuals',
    description:
      'Fulldome journeys, sacred geometry portals, and immersive 360° experiences from across the Arcanum multiverse. VR, dome theatres, and ambient screensavers.',
    url: 'https://www.youtube.com/@ArcaneRealities360',
    subscribeUrl: 'https://www.youtube.com/@ArcaneRealities360?sub_confirmation=1',
    color: '#c9973a',
    accentColor: '#e8c96a',
    image: '/art/home2/panels/watchdomeshow_panel.jpg',
    keywords: ['default', 'dome', 'ascension', 'screensaver', 'cosmic', 'realms'],
  },
  {
    id: 'multiverse-girls',
    name: 'Multiverse Girls',
    handle: '@MultiverseGirls',
    tagline: 'AI beauties from across dimensions',
    description:
      'The most stunning AI-generated women from every corner of the multiverse — fantasy goddesses, cyber queens, neon sirens, and interdimensional hotties.',
    url: 'https://www.youtube.com/@MultiverseGirls',
    subscribeUrl: 'https://www.youtube.com/@MultiverseGirls?sub_confirmation=1',
    color: '#ec4899',
    accentColor: '#f472b6',
    image: '/realms/girls-of-the-multiverse/card.png',
    keywords: ['girlsofthemultiverse', 'gotm', 'girls', 'multiverse-girls', 'cyber-geisha', 'sorceress', 'goddess', 'mermaids', 'fae-forever'],
  },
  {
    id: 'sacred-om-verse',
    name: 'Sacred Om Verse',
    handle: '@SacredOmVerse',
    tagline: 'Spiritually encoded sound & vision',
    description:
      'Frequency-encoded visuals, sacred geometry, solfeggio soundscapes, and meditative portals designed to expand consciousness and activate the inner realms.',
    url: 'https://www.youtube.com/@SacredOmVerse',
    subscribeUrl: 'https://www.youtube.com/@SacredOmVerse?sub_confirmation=1',
    color: '#a855f7',
    accentColor: '#c084fc',
    image: '/art/home2/panels/entersonic_panel.jpeg',
    keywords: ['sacred', 'spiritual', 'meditation', 'om', 'solfeggio', 'singularity'],
  },
]

/** Returns the best channel match for a given slug/keyword, defaults to ArcaneRealities360 */
export function getChannelForSlug(slug?: string): YTChannel {
  if (!slug) return YT_CHANNELS[0]
  const s = slug.toLowerCase()
  return (
    YT_CHANNELS.find(ch => ch.keywords.some(k => s.includes(k))) ?? YT_CHANNELS[0]
  )
}
