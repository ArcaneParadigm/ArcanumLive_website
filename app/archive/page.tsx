import { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/layout/PageShell'
import { archiveCategories } from '@/lib/data/seed'

export const metadata: Metadata = {
  title: 'Enter the Archive',
  description: 'Browse the hidden galleries, AI films, lore fragments, visual relics, experiments, and dimensional media artifacts of The Arcanum.',
}

export default function ArchivePage() {
  return (
    <PageShell>
      <div className="pt-16 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">Dimensional Archive</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Enter <span className="text-gold-gradient">the Archive</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/50 text-base leading-relaxed">
              Browse the hidden galleries, AI films, lore fragments, visual relics, experiments, and dimensional media artifacts of The Arcanum.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {archiveCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/archive/${cat.slug}`}
                className="group p-5 rounded-xl border border-white/10 bg-obsidian-100 hover:border-gold/30 hover:bg-obsidian-100 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg border border-gold/20 flex items-center justify-center mb-4 group-hover:border-gold/50 transition-colors">
                  <span className="text-gold/40 group-hover:text-gold-bright transition-colors">◈</span>
                </div>
                <h3 className="text-white/80 font-semibold mb-1 group-hover:text-white transition-colors">{cat.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
