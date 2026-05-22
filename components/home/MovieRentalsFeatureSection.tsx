'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { featuredFilms } from '@/lib/data/seed'
import GlassButton from '@/components/ui/GlassButton'

const filmAccents: Record<string, string> = {
  'aeon': '#00e5ff',
  'gaia-heart-shard': '#22c55e',
  'atlantis-nexus': '#0e7490',
  'soulblade-awakening': '#3b82f6',
  'aether-transmission': '#818cf8',
}

const filmSymbols: Record<string, string> = {
  'aeon': '◉',
  'gaia-heart-shard': '◈',
  'atlantis-nexus': '⬡',
  'soulblade-awakening': '✦',
  'aether-transmission': '✧',
}

export default function MovieRentalsFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-obsidian-100 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian-100 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian-100 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-3">Section III</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white leading-tight tracking-widest">
              360 Cinema<br />
              <span
                className="text-transparent bg-clip-text bg-gold-gradient"
                style={{ filter: 'drop-shadow(0 0 20px rgba(201,151,58,0.5))' }}
              >On Demand</span>
            </h2>
            <p className="hidden md:block text-white/35 text-sm max-w-xs text-right leading-relaxed">
              Immersive 360° films for VR headsets, spatial screens, and dome venues.
            </p>
          </div>
        </motion.div>

        {/* Film bands */}
        <div className="relative">
          {featuredFilms.map((film, i) => {
            const accent = filmAccents[film.slug ?? ''] ?? '#c9973a'
            const symbol = filmSymbols[film.slug ?? ''] ?? '◈'
            return (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Link
                  href={`/films/${film.slug}`}
                  className="group relative flex items-center gap-6 md:gap-10 py-7 border-t border-white/[0.06] hover:bg-white/[0.025] transition-all duration-500 pl-5"
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-4 bottom-4 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: accent }}
                  />

                  {/* Poster thumbnail slot */}
                  <div
                    className="shrink-0 hidden md:block relative overflow-hidden rounded-lg border"
                    style={{
                      width: 64, height: 80,
                      borderColor: `${accent}30`,
                      background: `linear-gradient(160deg, ${accent}18 0%, #08060e 100%)`,
                    }}
                  >
                    {film.poster_url ? (
                      <Image src={film.poster_url} alt={film.title ?? ''} fill className="object-cover opacity-70" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span style={{ color: accent, opacity: 0.25, fontSize: '1.5rem' }}>{symbol}</span>
                      </div>
                    )}
                    {/* Corner marks */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l" style={{ borderColor: `${accent}50` }} />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r" style={{ borderColor: `${accent}50` }} />
                  </div>

                  {/* Number */}
                  <div className="shrink-0 w-12 md:w-16 text-right select-none">
                    <span
                      className="font-cinzel font-bold leading-none"
                      style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        color: accent,
                        opacity: 0.07,
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {film.is_360 && (
                        <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase border rounded text-cyan-arcanum/70 border-cyan-arcanum/25">
                          360°
                        </span>
                      )}
                      {film.is_dome_available && (
                        <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase border rounded text-gold/70 border-gold/25">
                          Dome
                        </span>
                      )}
                    </div>
                    <h3 className="font-cinzel text-lg md:text-2xl text-white tracking-wide leading-tight mb-1.5 group-hover:text-white transition-colors">
                      {film.title}
                    </h3>
                    {film.short_description && (
                      <p className="text-white/35 text-sm leading-relaxed line-clamp-1 group-hover:text-white/55 transition-colors">
                        {film.short_description}
                      </p>
                    )}
                  </div>

                  {/* Right action */}
                  <div className="shrink-0 hidden md:flex flex-col items-end gap-2">
                    <span
                      className="text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 group-hover:tracking-[0.3em]"
                      style={{ color: accent }}
                    >
                      Rent on Vimeo →
                    </span>
                    <span className="text-white/20 text-xs">All VR platforms</span>
                  </div>

                  {/* Hover glow line at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }}
                  />
                </Link>
              </motion.div>
            )
          })}
          {/* Final divider */}
          <div className="border-t border-white/[0.06]" />
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-wrap gap-2">
            {['Meta Quest', 'Apple Vision Pro', 'PSVR2', 'Pico', 'Vimeo On Demand'].map((device) => (
              <span key={device} className="px-3 py-1 text-xs text-white/25 border border-white/[0.07] rounded-full tracking-wide">
                {device}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <GlassButton href="/films" variant="gold">Browse All Films</GlassButton>
            <GlassButton href="/films#how-to-watch" variant="silver">How to Watch in VR</GlassButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
