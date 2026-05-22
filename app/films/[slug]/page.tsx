import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageShell from '@/components/layout/PageShell'
import { featuredFilms } from '@/lib/data/seed'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = featuredFilms.find((f) => f.slug === slug)
  if (!film) return { title: 'Film Not Found' }
  return { title: film.title, description: film.short_description ?? undefined }
}

export async function generateStaticParams() {
  return featuredFilms.map((f) => ({ slug: f.slug }))
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params
  const film = featuredFilms.find((f) => f.slug === slug)
  if (!film) notFound()

  return (
    <PageShell>
      <div className="pt-16 pb-12 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex gap-2 text-xs text-white/30 mb-5">
            <Link href="/films" className="hover:text-white/60 transition-colors">360 Movies</Link>
            <span>/</span>
            <span className="text-white/60">{film.title}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-obsidian-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-deep to-obsidian-200 flex items-center justify-center">
                <span className="text-white/10 text-6xl">◈</span>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                {film.is_360 && (
                  <span className="px-2 py-1 text-xs bg-cyan-arcanum/20 border border-cyan-arcanum/40 text-cyan-arcanum rounded-full">360°</span>
                )}
                {film.is_dome_available && (
                  <span className="px-2 py-1 text-xs bg-gold/20 border border-gold/40 text-gold-bright rounded-full">Dome</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{film.title}</h1>
              {film.short_description && (
                <p className="text-white/60 text-lg leading-relaxed mb-6">{film.short_description}</p>
              )}

              <div className="flex flex-col gap-3">
                {film.vimeo_on_demand_url ? (
                  <a
                    href={film.vimeo_on_demand_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcanum-btn-primary text-center justify-center"
                  >
                    Rent 360 Movie on Vimeo ↗
                  </a>
                ) : (
                  <a href="https://vimeo.com/ondemand" target="_blank" rel="noopener noreferrer"
                    className="arcanum-btn-primary text-center justify-center">
                    Rent on Vimeo On Demand ↗
                  </a>
                )}
                <Link href="/contact" className="arcanum-btn-ghost text-center justify-center">
                  License for Dome
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 text-xs text-white/30">
                {film.is_360 && <span>360° Film</span>}
                {film.is_dome_available && <span>· Dome Available</span>}
                {film.runtime_minutes && <span>· {film.runtime_minutes} min</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
