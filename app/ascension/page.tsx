import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import AscensionChamberHub from '@/components/screensaver/AscensionChamberHub'
import { featuredWorlds } from '@/lib/data/worlds'
import { discoverRealmAudio } from '@/lib/utils/realmImages'

export const metadata: Metadata = {
  title: 'Ascension Chamber · The Arcanum',
  description: 'Pass through the portal. Choose a realm, select a soundtrack, and enter a fullscreen living world of cinematic art and ambient motion.',
}

export default function ScreensaverPage() {
  // Discover real audio for all realms server-side
  const audioMap = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmAudio(w.slug!)])
  )

  return (
    <PageShell noHeader>
      <AscensionChamberHub audioMap={audioMap} />
    </PageShell>
  )
}
