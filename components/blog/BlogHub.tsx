'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { playCrystalBowl } from '@/lib/utils/crystalSound'
import Home2Nav from '@/components/home2/Home2Nav'
import type { BlogPost } from '@/lib/data/blog'

const GOLD = '#c9973a'

const CATEGORIES = ['All', 'Lore Archive', 'Sacred Mythology', 'Character Files', 'Field Dispatch', 'Digital Archaeology', 'Spirit Lore', 'Shadow Studies']

interface Props {
  posts: BlogPost[]
  cardImages: Record<string, string | null>
}

// ── Featured hero post (largest) ─────────────────────────────────────────────
function HeroPost({ post, image }: { post: BlogPost; image: string | null }) {
  const color = post.color
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer flex flex-col"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${color}14, #06040c 70%)`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 40px ${color}12`,
        }}
        whileHover={{ borderColor: `${color}60`, y: -4, boxShadow: `0 8px 40px ${color}20` }}
        transition={{ duration: 0.25 }}
        onMouseEnter={() => playCrystalBowl(color, 0.022)}
      >
        {/* Image top */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {image ? (
            <motion.img
              src={image}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{ opacity: 0.6 }}
              whileHover={{ opacity: 0.78 }}
              transition={{ duration: 0.35 }}
            />
          ) : (
            <div className="w-full h-full"
              style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}25, #06040c 80%)` }} />
          )}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.92) 0%, rgba(6,4,12,0.15) 50%, transparent 100%)' }} />
          {/* Corner marks */}
          <div className="absolute top-3 left-3 w-6 h-6" style={{ borderTop: `1px solid ${color}60`, borderLeft: `1px solid ${color}60` }} />
          <div className="absolute top-3 right-3 w-6 h-6" style={{ borderTop: `1px solid ${color}30`, borderRight: `1px solid ${color}30` }} />
          {/* Featured + category badges */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-[9px] font-medium tracking-[0.3em] uppercase px-2.5 py-0.5 rounded"
              style={{ background: `${color}25`, color, border: `1px solid ${color}50` }}>
              {post.category}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded tracking-widest" style={{ background: `${GOLD}20`, color: `${GOLD}cc`, border: `1px solid ${GOLD}40` }}>
              Featured
            </span>
          </div>
        </div>

        {/* Text below */}
        <div className="p-5 flex flex-col">
          <span className="text-[9px] tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h2 className="font-cinzel text-xl md:text-2xl font-bold leading-tight tracking-wide mb-3"
            style={{ color: '#fff', textShadow: `0 0 20px ${color}40` }}>
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {post.excerpt}
          </p>
          <motion.span
            className="self-start inline-flex items-center gap-2 px-5 py-1.5 rounded-lg text-[10px] tracking-widest uppercase font-semibold"
            style={{
              background: 'linear-gradient(135deg, #2e1e06, #5a3a10, #7a5018)',
              border: `1px solid ${GOLD}55`,
              color: '#f0d08a',
            }}
            whileHover={{ boxShadow: `0 4px 22px ${GOLD}35` }}
            transition={{ duration: 0.15 }}
          >
            Read Dispatch →
          </motion.span>
        </div>
      </motion.div>
    </Link>
  )
}

// ── Standard post card ────────────────────────────────────────────────────────
function PostCard({ post, image }: { post: BlogPost; image: string | null }) {
  const color = post.color
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        className="relative rounded-xl overflow-hidden cursor-pointer h-full flex flex-col"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${color}14, #06040c 70%)`,
          border: `1px solid ${color}22`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
        whileHover={{ borderColor: `${color}55`, y: -4, boxShadow: `0 8px 32px ${color}18` }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => playCrystalBowl(color, 0.015)}
      >
        {/* Image panel */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
          {image ? (
            <motion.img
              src={image}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{ opacity: 0.55 }}
              whileHover={{ opacity: 0.72 }}
              transition={{ duration: 0.35 }}
            />
          ) : (
            <div className="w-full h-full"
              style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}20, #06040c 80%)` }} />
          )}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.9) 0%, rgba(6,4,12,0.2) 50%, transparent 100%)' }} />
          {/* Corner marks */}
          <div className="absolute top-2 left-2 w-4 h-4 pointer-events-none" style={{ borderTop: `1px solid ${color}50`, borderLeft: `1px solid ${color}50` }} />
          <div className="absolute top-2 right-2 w-4 h-4 pointer-events-none" style={{ borderTop: `1px solid ${color}25`, borderRight: `1px solid ${color}25` }} />
          {/* Category badge */}
          <div className="absolute bottom-2 left-2">
            <span className="text-[8px] tracking-[0.3em] uppercase px-2 py-0.5 rounded"
              style={{ background: `${color}22`, color, border: `1px solid ${color}40` }}>
              {post.category}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="p-4 flex flex-col flex-1">
          <span className="text-[8px] tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <h3 className="font-cinzel text-sm font-bold leading-snug tracking-wide mb-2 flex-1"
            style={{ color: 'rgba(255,255,255,0.9)', textShadow: `0 0 12px ${color}25` }}>
            {post.title}
          </h3>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + '…' : post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[9px] tracking-widest uppercase" style={{ color: `${color}80` }}>Read more →</span>
            {post.characters && (
              <span className="text-[8px] tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {post.characters.length} characters
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BlogHub({ posts, cardImages }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div style={{ background: '#08060e', minHeight: '100vh' }}>
      <Home2Nav />

      {/* ── Big panel hero header ── */}
      <section className="relative overflow-hidden px-8 py-8" style={{ background: '#08060e' }}>
        <div className="max-w-6xl mx-auto">

          {/* Title block */}
          <div className="text-center mb-8">
            <p className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: `${GOLD}80` }}>
              The Arcanum · Living Archive
            </p>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold tracking-[0.25em] mb-3"
              style={{
                background: 'linear-gradient(135deg, #8a6020 0%, #c9973a 30%, #f5d06e 55%, #c9973a 75%, #8a6020 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 22px rgba(201,151,58,0.45))',
              }}>
              Lore Archive
            </h1>
            {/* Gold rule */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50)` }} />
              <span style={{ color: `${GOLD}60`, fontSize: 8 }}>◆</span>
              <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${GOLD}50)` }} />
            </div>
            <p className="mt-3 text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Lore · Characters · Myth · Dispatches from the Realms
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1 mb-8 pb-3 border-b" style={{ borderColor: `${GOLD}18` }}>
            {categories.map(cat => {
              const isActive = activeCategory === cat
              return (
                <motion.button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); playCrystalBowl(GOLD, 0.018) }}
                  className="px-3 py-1.5 text-[10px] tracking-widest uppercase rounded transition-colors"
                  style={{
                    color: isActive ? GOLD : 'rgba(255,255,255,0.6)',
                    background: isActive ? `${GOLD}15` : 'transparent',
                    border: `1px solid ${isActive ? GOLD + '50' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  whileHover={{ color: isActive ? GOLD : '#e8dcc8' }}
                  transition={{ duration: 0.12 }}
                  onMouseEnter={() => !isActive && playCrystalBowl(GOLD, 0.012)}
                >
                  {cat}
                </motion.button>
              )
            })}
          </div>

          {/* Featured + grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {featured && (
                <div className="mb-8">
                  <HeroPost post={featured} image={cardImages[featured.realmSlug] ?? null} />
                </div>
              )}

              {/* 3-column card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(post => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    image={cardImages[post.realmSlug] ?? null}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm tracking-widest" style={{ color: 'rgba(255,255,255,0.85)' }}>
                No dispatches in this category yet.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-12 text-center" style={{ background: `radial-gradient(ellipse at 50% 50%, ${GOLD}08 0%, #08060e 65%)` }}>
        <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase mb-3" style={{ color: `${GOLD}70` }}>
          Enter the Mythos
        </p>
        <Link href="/realms">
          <motion.span
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-[11px] tracking-widest uppercase font-semibold cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #2e1e06, #5a3a10, #7a5018)',
              border: `1px solid ${GOLD}55`,
              color: '#f0d08a',
              boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
            }}
            whileHover={{ boxShadow: `0 4px 26px ${GOLD}30` }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => playCrystalBowl(GOLD, 0.022)}
          >
            Explore All Realms →
          </motion.span>
        </Link>
      </section>

    </div>
  )
}
