'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import SectionImage from '@/components/ui/SectionImage'
import GlassButton from '@/components/ui/GlassButton'

const domeShows = [
  { title: 'Aeon', slug: 'aeon' },
  { title: 'Atlantis Nexus', slug: 'atlantis-nexus' },
  { title: 'Gaia Heart Shard', slug: 'gaia-heart-shard' },
  { title: 'SoulBlade Journey', slug: 'soulblade' },
  { title: 'Dome Worlds Ambient', slug: 'dome-worlds' },
]

export default function DomeShowsFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-obsidian-200 overflow-hidden">
      {/* Gold vault atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="section-orb-pulse"
          style={{
            '--orb-opacity': '0.12',
            '--orb-duration': '8s',
            width: '80%', height: '55%',
            top: '-20%', left: '10%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(201,151,58,0.5) 0%, rgba(139,101,32,0.2) 40%, transparent 70%)',
          } as React.CSSProperties}
        />
        <div
          className="section-orb"
          style={{
            '--orb-opacity': '0.07',
            '--orb-duration': '14s',
            '--orb-delay': '2s',
            width: '50%', height: '50%',
            bottom: '-10%', right: '5%',
            background: 'radial-gradient(ellipse, rgba(192,200,208,0.4) 0%, transparent 70%)',
          } as React.CSSProperties}
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-obsidian-200 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-obsidian-200 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <SectionHeader
            eyebrow="Section II"
            heading="Immersive"
            accent="Dome Shows"
            subtitle="Cinematic fulldome experiences for planetariums, immersive venues, festivals, museums, and next-generation projection environments."
          />
        </motion.div>

        {/* Image panel */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-10"
        >
          <SectionImage
            glyph="◉"
            caption="Dome Show Preview"
            aspectRatio="21/9"
          />
        </motion.div>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-silver-mid text-sm leading-relaxed max-w-2xl mx-auto mb-8"
        >
          Large-format visual journeys built to wrap audiences inside mythic worlds, cosmic architecture, sacred geometry, AI cinema, and visionary science-fantasy landscapes.
        </motion.p>

        {/* Show tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {domeShows.map((show) => (
            <Link
              key={show.slug}
              href={`/dome-shows#${show.slug}`}
              className="px-4 py-1.5 text-xs tracking-widest uppercase border rounded-full text-gold/55 border-gold/20 hover:text-gold/90 hover:border-gold/45 hover:bg-gold/5 transition-all duration-300"
            >
              {show.title}
            </Link>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <GlassButton href="/dome-shows" variant="gold">Watch Dome Shows</GlassButton>
          <GlassButton href="/watch" variant="silver">Watch Films & Music</GlassButton>
        </motion.div>
      </div>
    </section>
  )
}
