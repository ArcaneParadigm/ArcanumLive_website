'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import AlbumCard from '@/components/cards/AlbumCard'
import SectionHeader from '@/components/ui/SectionHeader'
import { featuredAlbums, musicCategories } from '@/lib/data/seed'

const MUSIC_ORBS = Array.from({ length: 12 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 120 + 40,
  opacity: Math.random() * 0.12 + 0.04,
  duration: Math.random() * 5 + 4,
  delay: Math.random() * 4,
}))

export default function MusicRealmsFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-obsidian-100 overflow-hidden">
      {/* Gold sonic realm atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central gold bloom */}
        <div
          className="section-orb-pulse"
          style={{
            '--orb-opacity': '0.14',
            '--orb-duration': '7s',
            width: '70%', height: '80%',
            top: '10%', left: '15%',
            background: 'radial-gradient(ellipse, #c9973a 0%, #8a6520 35%, transparent 70%)',
          } as React.CSSProperties}
        />
        {/* Warm amber side glow */}
        <div
          className="section-orb"
          style={{
            '--orb-opacity': '0.1',
            '--orb-duration': '11s',
            '--orb-delay': '1.5s',
            width: '40%', height: '60%',
            top: '-10%', right: '0%',
            background: 'radial-gradient(ellipse, #f5d06e 0%, #c9973a 40%, transparent 70%)',
          } as React.CSSProperties}
        />
        {/* Floating gold motes */}
        {mounted && MUSIC_ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: orb.size,
              height: orb.size,
              opacity: orb.opacity,
              background: 'radial-gradient(circle, #f5d06e 0%, #c9973a 50%, transparent 70%)',
              filter: 'blur(30px)',
            }}
            animate={{ opacity: [orb.opacity, orb.opacity * 2.5, orb.opacity], scale: [1, 1.15, 1] }}
            transition={{ duration: orb.duration, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-obsidian-100 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian-100 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <SectionHeader
            eyebrow="Section VII"
            heading="Enter the"
            accent="Sonic Realms"
            subtitle="Explore music worlds built for goddesses, tricksters, cyber shamans, cosmic portals, Burning Man nights, and cinematic myth machines."
          />
        </motion.div>

        {/* Album cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
        >
          {featuredAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </motion.div>

        {/* Music category tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {musicCategories.map((cat) => (
            <Link
              key={cat}
              href={`/music?category=${encodeURIComponent(cat)}`}
              className="px-3 py-1.5 text-xs tracking-wide border border-white/10 rounded-full text-white/40 hover:text-white/70 hover:border-gold/30 transition-all duration-200"
            >
              {cat}
            </Link>
          ))}
        </motion.div>

        <div className="flex justify-center gap-4">
          <Link href="/music" className="arcanum-btn-primary">Explore Music</Link>
          <Link href="/ascension?mode=music-reactor" className="arcanum-btn-ghost">Launch Music Visualizer</Link>
        </div>
      </div>
    </section>
  )
}
