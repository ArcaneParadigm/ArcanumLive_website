import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import AlbumCard from '@/components/cards/AlbumCard'
import { featuredAlbums, musicCategories } from '@/lib/data/seed'

export const metadata: Metadata = {
  title: 'Enter the Sonic Realms',
  description: 'Explore music worlds built for goddesses, tricksters, cyber shamans, cosmic portals, Burning Man nights, and cinematic myth machines.',
}

export default function MusicPage() {
  return (
    <PageShell>
      <div className="pt-6 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">Sonic Realms</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Enter the <span className="text-gold-gradient">Music</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/50 text-base leading-relaxed">
              The Arcanum music library spans cosmic anthems, sacred downtempo, psytrance, cyber ritual, dark oracle chants, mythic goddess songs, and AI creation myths.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {musicCategories.map((cat) => (
              <a
                key={cat}
                href={`/music?category=${encodeURIComponent(cat)}`}
                className="px-3 py-1.5 text-xs tracking-wide border border-white/10 rounded-full text-white/40 hover:text-white/70 hover:border-gold/30 transition-all duration-200"
              >
                {cat}
              </a>
            ))}
          </div>

          {/* Albums grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
