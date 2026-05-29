import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageShell from '@/components/layout/PageShell'
import { blogPosts } from '@/lib/data/blog'
import { discoverRealmCardImage, discoverRealmHeroImage } from '@/lib/utils/realmImages'
import { featuredWorlds } from '@/lib/data/worlds'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  if (!post) return { title: 'Not Found · The Arcanum' }
  return {
    title: `${post.title} · Arcanum Lore`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

const GOLD = '#c9973a'
const GOLD_GRADIENT = {
  background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  if (!post) notFound()

  const cardImage = discoverRealmCardImage(post.realmSlug)
  const heroImage = discoverRealmHeroImage(post.realmSlug)
  const world = featuredWorlds.find(w => w.slug === post.realmSlug)
  const accent = post.color

  // Related posts — same realm or shared tags
  const related = blogPosts
    .filter(p => p.slug !== post.slug && (
      p.realmSlug === post.realmSlug ||
      p.tags?.some(t => post.tags?.includes(t))
    ))
    .slice(0, 3)

  return (
    <PageShell noHeader>
      {/* ── Nav bar ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0" style={{ background: '#08060e' }}>
        <Link href="/blog" className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity flex-1"
          style={{ color: 'rgba(255,255,255,0.8)' }}>
          ← Lore Archive
        </Link>
        <span className="font-cinzel text-sm italic font-bold tracking-[0.22em] shrink-0"
          style={{
            background: 'linear-gradient(135deg, #8a6020 0%, #c9973a 35%, #f5d06e 55%, #c9973a 75%, #8a6020 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px rgba(201,151,58,0.45))',
          }}>
          The Arcanum · Lore
        </span>
        <Link href={`/realms/${post.realmSlug}`}
          className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity flex-1 text-right"
          style={{
            background: 'linear-gradient(135deg, #8a6020, #c9973a 40%, #f0c84a 60%, #c9973a 80%, #8a6020)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 8px rgba(201,151,58,0.35))',
          }}>
          Enter Realm →
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: '#08060e', minHeight: 340 }}>
        {/* Hero image */}
        {(heroImage || cardImage) && (
          <img
            src={heroImage ?? cardImage!}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            style={{ opacity: heroImage ? 0.32 : 0.22 }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, rgba(8,6,14,0.55) 0%, rgba(8,6,14,0.3) 40%, rgba(8,6,14,0.92) 100%)` }} />
        {/* Accent radial */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 60% 40%, ${accent}18 0%, transparent 60%)` }} />

        {/* Corner marks */}
        <div className="absolute top-4 left-6 w-6 h-6 pointer-events-none" style={{ borderTop: `1px solid ${accent}50`, borderLeft: `1px solid ${accent}50` }} />
        <div className="absolute top-4 right-6 w-6 h-6 pointer-events-none" style={{ borderTop: `1px solid ${accent}30`, borderRight: `1px solid ${accent}30` }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-10">
          {/* Category + date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-medium tracking-[0.35em] uppercase px-2.5 py-0.5 rounded"
              style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}45` }}>
              {post.category}
            </span>
            <span className="text-[9px] tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {world && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
                <Link href={`/realms/${post.realmSlug}`}
                  className="text-[9px] tracking-widest uppercase transition-opacity hover:opacity-100"
                  style={{ color: `${accent}80` }}>
                  {world.title}
                </Link>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-cinzel text-2xl md:text-4xl font-bold tracking-wide leading-tight mb-5"
            style={{ color: '#fff', textShadow: `0 0 30px ${accent}40, 0 2px 8px rgba(0,0,0,0.8)` }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* ── Article body ── */}
      <article className="max-w-3xl mx-auto px-6 py-12" style={{ background: '#08060e' }}>

        {/* Ornate divider */}
        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute inset-x-0 h-px" style={{ top: '44%', background: `linear-gradient(to right, transparent 0%, ${accent}40 15%, ${accent}40 85%, transparent 100%)` }} />
          <svg width="180" height="22" viewBox="0 0 180 22" fill="none" className="relative z-10">
            <rect x="83" y="4" width="14" height="14" transform="rotate(45 90 11)" fill="#08060e" stroke={`${accent}70`} strokeWidth="1"/>
            <rect x="86" y="7" width="8" height="8" transform="rotate(45 90 11)" fill={`${accent}20`} stroke={`${accent}45`} strokeWidth="0.5"/>
            <path d="M79 11 Q70 5, 61 11 Q52 17, 43 11" stroke={`${accent}45`} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            <circle cx="41" cy="11" r="1.8" fill="none" stroke={`${accent}50`} strokeWidth="0.8"/>
            <path d="M39 11 L24 11" stroke={`${accent}25`} strokeWidth="0.6" strokeLinecap="round"/>
            <path d="M101 11 Q110 5, 119 11 Q128 17, 137 11" stroke={`${accent}45`} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            <circle cx="139" cy="11" r="1.8" fill="none" stroke={`${accent}50`} strokeWidth="0.8"/>
            <path d="M141 11 L156 11" stroke={`${accent}25`} strokeWidth="0.6" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Body paragraphs */}
        <div className="space-y-6 mb-12">
          {post.body.map((para, i) => (
            <p key={i} className="text-[15px] leading-[1.9] tracking-wide"
              style={{ color: i === 0 ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.75)' }}>
              {i === 0 && (
                <span className="font-cinzel text-2xl font-bold float-left mr-3 mt-1 leading-none"
                  style={{ color: accent, filter: `drop-shadow(0 0 10px ${accent}60)` }}>
                  {para[0]}
                </span>
              )}
              {i === 0 ? para.slice(1) : para}
            </p>
          ))}
        </div>

        {/* ── Characters section ── */}
        {post.characters && post.characters.length > 0 && (
          <div className="mb-12">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent}35)` }} />
              <h2 className="font-cinzel text-xs tracking-[0.4em] uppercase font-bold" style={{ color: accent }}>
                ◆ Key Characters ◆
              </h2>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent}35)` }} />
            </div>

            <div className="grid gap-4">
              {post.characters.map((char, i) => (
                <div key={i} className="relative rounded-xl p-4 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20,14,32,0.95), rgba(8,6,14,0.98))',
                    border: `1px solid ${accent}22`,
                    boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
                  }}>
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                    style={{ background: `linear-gradient(to bottom, transparent, ${accent}80, transparent)` }} />
                  <div className="pl-3">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="font-cinzel text-sm font-bold tracking-wide" style={{ color: accent }}>
                        {char.name}
                      </span>
                      <span className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {char.role}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {char.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map(tag => (
              <span key={tag}
                className="text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 rounded"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Enter Realm CTA */}
        <div className="text-center py-8 rounded-2xl relative overflow-hidden mb-12"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${accent}12 0%, rgba(8,6,14,0.98) 70%)`, border: `1px solid ${accent}25` }}>
          <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${accent}35 30%, ${accent}35 70%, transparent)` }} />
          <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: `${accent}80` }}>
            Explore the Full Realm
          </p>
          <h3 className="font-cinzel text-xl font-bold mb-5 tracking-widest" style={GOLD_GRADIENT}>
            {world?.title ?? post.realmSlug}
          </h3>
          <Link href={`/realms/${post.realmSlug}`}>
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-[11px] tracking-widest uppercase font-semibold cursor-pointer transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #2e1e06, #5a3a10, #7a5018)',
                border: `1px solid ${GOLD}55`,
                color: '#f0d08a',
                boxShadow: `0 4px 18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}>
              Enter {world?.title ?? 'the Realm'} →
            </span>
          </Link>
        </div>

      </article>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="pb-16" style={{ background: '#08060e' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}25)` }} />
              <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: `${GOLD}80` }}>
                More from the Archive
              </span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}25)` }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(rp => {
                const rImg = discoverRealmCardImage(rp.realmSlug)
                return (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block rounded-xl overflow-hidden relative"
                    style={{ background: 'rgba(16,10,26,0.95)', border: `1px solid ${rp.color}22` }}>
                    {rImg && (
                      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
                        <img src={rImg} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ opacity: 0.65 }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,14,0.9) 0%, transparent 60%)' }} />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: rp.color }}>{rp.category}</span>
                      <p className="font-cinzel text-xs font-bold leading-snug mt-1 group-hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {rp.title}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

    </PageShell>
  )
}
