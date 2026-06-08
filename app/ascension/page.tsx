import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import AscensionChamberHub from '@/components/screensaver/AscensionChamberHub'
import { featuredWorlds } from '@/lib/data/worlds'
import { discoverRealmAudio, discoverRealmCardImage, discoverRealmSequence } from '@/lib/utils/realmImages'

export const metadata: Metadata = {
  title: 'Ascension Chamber — Living Visualizer & Immersive Portal',
  description: 'Enter the Ascension Chamber — choose a mythic realm, select a soundtrack, and immerse in a fullscreen living world of cinematic art and ambient motion. Arcanum.Live\'s living visualizer.',
  keywords: ['ascension chamber', 'living visualizer', 'immersive visual meditation', 'ambient visual art', 'fullscreen meditation', 'mythic ambient visuals', 'consciousness visualizer', 'dimensional portal meditation'],
  openGraph: {
    title: 'Ascension Chamber — Arcanum.Live',
    description: 'Choose a realm, select a soundtrack, enter a fullscreen living world of cinematic art and ambient motion.',
    url: 'https://arcanum.live/ascension',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Ascension Chamber — Arcanum.Live', description: 'Fullscreen living visuals — choose a mythic realm and ambient soundtrack.' },
  alternates: { canonical: 'https://arcanum.live/ascension' },
}

export default function ScreensaverPage() {
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

  const sequenceMap = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmSequence(w.slug!)])
  ) as Record<string, string[]>

  return (
    <PageShell noHeader>
      <AscensionChamberHub audioMap={audioMap} cardImages={cardImages} sequenceMap={sequenceMap} />
    </PageShell>
  )
}
