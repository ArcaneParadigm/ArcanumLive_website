import { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/layout/PageShell'
import SectionImage from '@/components/ui/SectionImage'
import GlassButton from '@/components/ui/GlassButton'
import TrailersStrip from '@/components/watch/TrailersStrip'
import { trailers, rentalFilms } from '@/lib/data/videos'

export const metadata: Metadata = {
  title: 'Watch · Dome Shows & 360° Cinema',
  description:
    'Immersive fulldome shows and 360° films from The Arcanum — trailers, previews, and Vimeo On Demand rentals.',
}

const domeShows = [
  {
    title: 'Aeon',
    slug: 'aeon',
    desc: 'A cosmic journey through the eternal cycles of creation and destruction.',
    color: '#00e5ff',
    glyph: '◉',
  },
  {
    title: 'Atlantis Nexus',
    slug: 'atlantis-nexus',
    desc: 'Ancient aquatic technology and the sunken civilizations.',
    color: '#0e7490',
    glyph: '⬡',
  },
  {
    title: 'Gaia Heart Shard',
    slug: 'gaia-heart-shard',
    desc: 'Descend into the living crystal heart of the Earth goddess.',
    color: '#22c55e',
    glyph: '✧',
  },
  {
    title: 'SoulBlade Journey',
    slug: 'soulblade',
    desc: 'The cosmic warrior saga across dimensional battlefields.',
    color: '#3b82f6',
    glyph: '✦',
  },
  {
    title: 'Dome Worlds Ambient',
    slug: 'dome-worlds',
    desc: 'Living atmospheric environments built for full-dome projection.',
    color: '#c9973a',
    glyph: '◈',
  },
]

export default function DomeShowsPage() {
  return (
    <PageShell>
      <div className="pt-16 pb-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">

          {/* ── Page header ── */}
          <div className="text-center mb-8">
            <p className="text-gold/55 text-xs tracking-[0.4em] uppercase mb-4">Fulldome Cinema & 360° Films</p>
            <h1 className="font-cinzel text-5xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-widest">
              Watch the
              <br />
              <span
                className="text-transparent bg-clip-text bg-gold-gradient"
                style={{ filter: 'drop-shadow(0 0 24px rgba(201,151,58,0.45))' }}
              >
                Arcanum
              </span>
            </h1>
            <p className="text-silver-mid/65 text-base leading-relaxed max-w-xl mx-auto">
              Trailers, dome show previews, and 360° films you can rent and watch without ever leaving this page.
            </p>
          </div>

          {/* ── Trailers strip ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cinzel text-xl text-white tracking-widest">Trailers</h2>
              <span className="text-silver-mid/40 text-xs tracking-widest uppercase">{trailers.length} films</span>
            </div>
            <TrailersStrip trailers={trailers} />
          </section>

          {/* ── Dome shows grid ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-gold/50 text-xs tracking-[0.3em] uppercase mb-1">Available for Venues</p>
                <h2 className="font-cinzel text-2xl text-white tracking-widest">Dome Shows</h2>
              </div>
              <Link href="/contact" className="text-gold/60 hover:text-gold text-xs tracking-widest uppercase transition-colors">
                License a Show →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domeShows.map((show) => (
                <div
                  key={show.slug}
                  className="group relative overflow-hidden rounded-2xl border transition-all duration-500"
                  style={{
                    borderColor: `${show.color}22`,
                    background: `linear-gradient(160deg, ${show.color}12 0%, #08060e 100%)`,
                  }}
                >
                  {/* Image slot */}
                  <SectionImage
                    glyph={show.glyph}
                    aspectRatio="16/9"
                    className="rounded-none rounded-t-2xl"
                    caption={show.title}
                  />

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border"
                        style={{ color: show.color, borderColor: `${show.color}40`, background: `${show.color}0f` }}
                      >
                        Dome
                      </span>
                      <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border border-gold/20 text-gold/60">
                        360°
                      </span>
                    </div>
                    <h3 className="font-cinzel text-white text-lg tracking-wide mb-2">{show.title}</h3>
                    <p className="text-silver-mid/55 text-sm leading-relaxed mb-4">{show.desc}</p>
                    <Link
                      href="/contact"
                      className="text-xs tracking-[0.2em] uppercase transition-colors"
                      style={{ color: show.color, opacity: 0.7 }}
                    >
                      License for Venue →
                    </Link>
                  </div>

                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px ${show.color}44` }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── 360° Films to Rent ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-gold/50 text-xs tracking-[0.3em] uppercase mb-1">Watch in VR or Browser</p>
                <h2 className="font-cinzel text-2xl text-white tracking-widest">360° Films</h2>
              </div>
              <Link
                href="/watch"
                className="text-gold/60 hover:text-gold text-xs tracking-widest uppercase transition-colors"
              >
                Open Watch Hub →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {rentalFilms.map((film) => (
                <div key={film.id} className="group">
                  {/* Poster slot */}
                  <SectionImage
                    glyph="◈"
                    aspectRatio="2/3"
                    className="mb-3"
                    caption={film.title}
                  />
                  <h4 className="font-cinzel text-white text-sm tracking-wide leading-tight mb-1">{film.title}</h4>
                  {film.duration && (
                    <p className="text-silver-mid/40 text-xs mb-3">{film.duration}</p>
                  )}
                  <div className="flex flex-col gap-1.5">
                    {film.rentUrl && (
                      <a
                        href={film.rentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-gold/70 hover:text-gold transition-colors"
                      >
                        Rent on Vimeo →
                      </a>
                    )}
                    <Link
                      href={`/watch?v=${film.id}`}
                      className="text-[10px] tracking-[0.2em] uppercase text-silver-mid/45 hover:text-silver transition-colors"
                    >
                      Watch Preview →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Watch Hub CTA ── */}
          <div
            className="relative text-center py-16 px-8 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(201,151,58,0.07) 0%, #08060e 50%, rgba(192,200,208,0.04) 100%)',
              boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.14)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,151,58,0.08) 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <p className="text-gold/50 text-xs tracking-[0.4em] uppercase mb-4">The Full Experience</p>
              <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-widest mb-4">
                Films · Music Videos · Premieres
              </h2>
              <p className="text-silver-mid/55 text-sm leading-relaxed max-w-md mx-auto mb-8">
                Watch everything embedded on this page — no redirects, no leaving. Films, music videos, trailers, and live premieres all in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <GlassButton href="/watch" variant="gold">Open Watch Hub</GlassButton>
                <GlassButton href="/contact" variant="silver">License Content</GlassButton>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageShell>
  )
}
