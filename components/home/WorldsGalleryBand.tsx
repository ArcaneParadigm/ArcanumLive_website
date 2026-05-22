'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { featuredWorlds } from '@/lib/data/worlds'

// Only show featured worlds in the band
const galleryWorlds = featuredWorlds.filter((w) => w.is_featured)

const CYCLE_MS = 3800
const TRANSITION = { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const }

export default function WorldsGalleryBand() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Auto-cycle unless hovered
  useEffect(() => {
    if (hovered) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % galleryWorlds.length)
    }, CYCLE_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [hovered])

  const active = galleryWorlds[activeIdx]

  return (
    <section className="relative w-full overflow-hidden" style={{ height: hovered ? 'auto' : undefined }}>
      {/* ── Default state: full-width ambient crossfade ── */}
      <div
        className="relative w-full"
        style={{ aspectRatio: '21/7', minHeight: 320 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Background crossfade layers */}
        {mounted && (
          <AnimatePresence mode="sync">
            <motion.div
              key={active.slug}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={TRANSITION}
              style={{
                background: active.color_primary
                  ? `radial-gradient(ellipse at 50% 30%, ${active.color_primary}55 0%, ${active.color_primary}18 40%, #08060e 80%)`
                  : 'radial-gradient(ellipse at 50% 30%, #1a0a3a 0%, #08060e 80%)',
              }}
            />
          </AnimatePresence>
        )}

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(201,151,58,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,58,0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Image slot — placeholder until real art is loaded */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {mounted && (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8 }}
              >
                <div
                  className="w-20 h-20 rounded-full border flex items-center justify-center text-3xl"
                  style={{
                    borderColor: `${active.color_primary ?? '#c9973a'}60`,
                    color: active.color_primary ?? '#c9973a',
                    background: `${active.color_primary ?? '#c9973a'}12`,
                    boxShadow: `0 0 40px ${active.color_primary ?? '#c9973a'}30`,
                  }}
                >
                  ✦
                </div>
                <h2
                  className="font-cinzel text-4xl md:text-5xl font-bold tracking-widest text-white text-center"
                  style={{ textShadow: `0 0 30px ${active.color_primary ?? '#c9973a'}50` }}
                >
                  {active.title}
                </h2>
                <p className="text-white/40 text-sm tracking-widest uppercase">{active.theme_style}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
          {galleryWorlds.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === activeIdx ? 20 : 6,
                height: 6,
                background: i === activeIdx
                  ? (active.color_primary ?? '#c9973a')
                  : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Hover prompt */}
        {!hovered && (
          <div className="absolute bottom-5 right-6 text-white/20 text-xs tracking-widest uppercase pointer-events-none">
            Hover to explore →
          </div>
        )}

        {/* ── Hover state: full row grid overlaid ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Dark scrim */}
              <div className="absolute inset-0 bg-obsidian-300/80 backdrop-blur-sm" />

              {/* World cards row */}
              <div className="relative w-full overflow-x-auto px-6">
                <div className="flex gap-3 py-6" style={{ minWidth: 'max-content', margin: '0 auto', maxWidth: '100%', justifyContent: 'center' }}>
                  {galleryWorlds.map((world, i) => (
                    <motion.div
                      key={world.slug}
                      initial={{ opacity: 0, y: 20, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.045 }}
                    >
                      <Link
                        href={`/worlds/${world.slug}`}
                        className="group relative block rounded-xl overflow-hidden border transition-all duration-300"
                        style={{
                          width: 160,
                          height: 220,
                          borderColor: `${world.color_primary ?? '#c9973a'}35`,
                          background: `radial-gradient(ellipse at 50% 0%, ${world.color_primary ?? '#c9973a'}28 0%, #0a0a14 80%)`,
                          flexShrink: 0,
                        }}
                        onMouseEnter={() => setActiveIdx(i)}
                      >
                        {/* Hover glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                          style={{ boxShadow: `inset 0 0 0 1px ${world.color_primary ?? '#c9973a'}60, 0 0 20px ${world.color_primary ?? '#c9973a'}25` }}
                        />

                        {/* Image placeholder (swap for real <Image> later) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-10 h-10 rounded-full border flex items-center justify-center text-base transition-transform duration-300 group-hover:scale-125"
                            style={{
                              borderColor: `${world.color_primary ?? '#c9973a'}50`,
                              color: world.color_primary ?? '#c9973a',
                            }}
                          >
                            ✦
                          </div>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="font-cinzel text-white text-sm tracking-wide leading-tight mb-0.5">{world.title}</p>
                          <p
                            className="text-[9px] tracking-widest uppercase"
                            style={{ color: `${world.color_primary ?? '#c9973a'}90` }}
                          >
                            {world.theme_style}
                          </p>
                        </div>

                        {/* "Enter →" on hover */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span
                            className="text-[10px] tracking-widest"
                            style={{ color: world.color_primary ?? '#c9973a' }}
                          >
                            Enter →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top / bottom fade-to-page edges */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-obsidian-200 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-obsidian-200 to-transparent pointer-events-none" />
      </div>

      {/* Section label outside the hover area */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-gold/40 text-xs tracking-[0.5em] uppercase">The Realms of The Arcanum</p>
      </div>
    </section>
  )
}
