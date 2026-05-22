'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import SectionImage from '@/components/ui/SectionImage'
import GlassButton from '@/components/ui/GlassButton'
import { screensaverModes } from '@/lib/data/seed'

const SCREENSAVER_PARTICLES = Array.from({ length: 25 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  scale: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
}))

const WAVEFORM_SCALES = [3, 5, 4, 7, 3, 5, 8, 4, 6, 3].map(() => Math.random() * 1.5 + 0.5)

export default function ScreensaverFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-obsidian-100 overflow-hidden">
      {/* Silver + gold ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="section-orb"
          style={{
            '--orb-opacity': '0.09',
            '--orb-duration': '12s',
            width: '60%', height: '60%',
            top: '10%', right: '-10%',
            background: 'radial-gradient(ellipse, rgba(192,200,208,0.5) 0%, transparent 70%)',
          } as React.CSSProperties}
        />
        <div
          className="section-orb-pulse"
          style={{
            '--orb-opacity': '0.08',
            '--orb-duration': '7s',
            width: '40%', height: '40%',
            bottom: '10%', left: '5%',
            background: 'radial-gradient(ellipse, rgba(201,151,58,0.4) 0%, transparent 70%)',
          } as React.CSSProperties}
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-obsidian-100 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-obsidian-100 to-transparent" />
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
            eyebrow="Section V"
            heading="Enter the"
            accent="Ascension Chamber"
            subtitle="Choose a realm, select a soundtrack, and let The Arcanum become a fullscreen ambient visualizer of animated art, music-reactive particles, and cinematic motion."
          />
        </motion.div>

        {/* Preview panel — animated mockup inside SectionImage frame */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-10 relative"
        >
          {/* We build the live preview inside the frame */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              aspectRatio: '21/9',
              boxShadow: 'inset 0 0 0 1px rgba(0,229,255,0.15), 0 12px 48px rgba(0,0,0,0.7)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-cosmic to-obsidian-300">
              {mounted && SCREENSAVER_PARTICLES.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full bg-cyan-arcanum"
                  style={{ left: `${p.left}%`, top: `${p.top}%` }}
                  animate={{ scale: [0, p.scale, 0], opacity: [0, 0.6, 0] }}
                  transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div className="w-28 h-28 rounded-full border border-cyan-arcanum/20"
                  animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute w-18 h-18 rounded-full border border-gold/20"
                  style={{ width: 72, height: 72 }}
                  animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute w-7 h-7 rounded-full bg-cyan-arcanum/20"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }} />
              </div>
            </div>

            {/* Overlay info */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="text-white/30 text-xs">MythMachine Preview</p>
                <p className="text-cyan-arcanum/60 text-xs">Music Reactor · Cosmic Mode</p>
              </div>
              <div className="flex gap-1">
                {[3, 5, 4, 7, 3, 5, 8, 4, 6, 3].map((h, i) => (
                  <motion.div key={i} className="w-1 rounded-full bg-cyan-arcanum/40"
                    style={{ height: `${h * 3}px` }}
                    animate={{ scaleY: [1, WAVEFORM_SCALES[i], 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} />
                ))}
              </div>
            </div>

            {/* LIVE badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-cyan-arcanum/35 bg-obsidian-300/60 backdrop-blur-sm">
              <span className="text-cyan-arcanum text-[10px] tracking-[0.3em] uppercase">Live</span>
            </div>

            {/* Inner rim */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(0,229,255,0.1)' }} />
          </div>
        </motion.div>

        {/* Mode pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {screensaverModes.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className="group px-4 py-2 text-xs tracking-widest uppercase border border-silver/10 rounded-full text-silver-mid/60 hover:text-silver/90 hover:border-silver/30 hover:bg-silver/5 transition-all duration-300"
            >
              {mode.title}
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
          <GlassButton href="/screensaver" variant="gold">Enter Ascension Chamber</GlassButton>
          <GlassButton href="/screensaver#modes" variant="silver">Preview Visual Modes</GlassButton>
        </motion.div>
      </div>
    </section>
  )
}
