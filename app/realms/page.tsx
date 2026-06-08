import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import RealmsPageHub from '@/components/realms/RealmsPageHub'
import { featuredWorlds } from '@/lib/data/worlds'
import { discoverRealmAudio, discoverRealmCardImage, discoverRealmImages, discoverRealmSequence } from '@/lib/utils/realmImages'

export const metadata: Metadata = {
  title: 'Realms — Mythic IP Universes & Cinematic Worlds',
  description: 'Enter the mythic IP universes of Arcanum.Live — each a cinematic realm of characters, music, films, lore, and immersive media experiences. Explore Girls of the Multiverse, Metahub, and more.',
  keywords: ['mythic worlds', 'Arcanum realms', 'cinematic universe', 'Girls of the Multiverse', 'Metahub', 'immersive storytelling', 'mythic IP', 'Arcane Paradigm worlds', 'consciousness realms', 'AI world building'],
  openGraph: {
    title: 'Realms — Arcanum.Live Mythic Universes',
    description: 'Explore mythic IP universes — each a cinematic realm of characters, music, films, and immersive media.',
    url: 'https://arcanum.live/realms',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Realms — Arcanum.Live', description: 'Mythic IP universes — cinematic realms of characters, music, films, and immersive media.' },
  alternates: { canonical: 'https://arcanum.live/realms' },
}

export default function WorldsPage() {
  const audioMap = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmAudio(w.slug!)])
  )

  const cardImages = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmCardImage(w.slug!)])
  ) as Record<string, string | null>

  const galleryImages = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmImages(w.slug!).gallery])
  ) as Record<string, string[]>

  const sequenceMap = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmSequence(w.slug!)])
  ) as Record<string, string[]>

  return (
    <PageShell noHeader>
      <RealmsPageHub
        worlds={featuredWorlds}
        cardImages={cardImages}
        galleryImages={galleryImages}
        audioMap={audioMap}
        sequenceMap={sequenceMap}
      />
    </PageShell>
  )
}
