import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import WorldCard from '@/components/cards/WorldCard'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import { featuredWorlds } from '@/lib/data/seed'
import { discoverRealmAudio } from '@/lib/utils/realmImages'

export const metadata: Metadata = {
  title: 'Realms · The Arcanum',
  description: 'Enter the mythic IP universes of The Arcanum — each a cinematic realm of characters, music, films, visuals, and immersive experiences.',
}

export default function WorldsPage() {
  // Discover audio for all realms at build/request time (server-side fs access)
  const audioMap = Object.fromEntries(
    featuredWorlds
      .filter((w) => w.slug)
      .map((w) => [w.slug, discoverRealmAudio(w.slug!)])
  )

  return (
    <PageShell noHeader>
      {/* Full-width player — has its own title + nav built in */}
      <RealmsPlayer audioMap={audioMap} />

      {/* Realm cards */}
      <div className="bg-obsidian-200 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold/40 text-[10px] tracking-[0.4em] uppercase mb-5">Select a Realm</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredWorlds.map((world) => (
              <WorldCard key={world.id} world={world} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
