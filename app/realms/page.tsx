import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import RealmsPortraitGrid from '@/components/realms/RealmsPortraitGrid'
import { featuredWorlds } from '@/lib/data/worlds'
import { discoverRealmAudio, discoverRealmCardImage } from '@/lib/utils/realmImages'

export const metadata: Metadata = {
  title: 'Realms · The Arcanum',
  description: 'Enter the mythic IP universes of The Arcanum — each a cinematic realm of characters, music, films, visuals, and immersive experiences.',
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

  return (
    <PageShell noHeader>
      <RealmsPlayer audioMap={audioMap} />
      <RealmsPortraitGrid worlds={featuredWorlds} cardImages={cardImages} />
    </PageShell>
  )
}
