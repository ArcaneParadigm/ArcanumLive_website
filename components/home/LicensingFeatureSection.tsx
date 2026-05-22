'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const inquiryTypes = [
  'Dome Shows',
  '360 Films',
  'Custom Visuals',
  'Projection Mapping',
  'Festival Content',
  'Installation Art',
  'Venue Licensing',
  'Collaboration',
]

export default function LicensingFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-obsidian-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">Section IX</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              License<br />
              <span className="text-transparent bg-clip-text bg-gold-gradient">the Worlds</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-4">
              Book immersive content, dome shows, custom visuals, AI cinema, projection-mapped experiences, and mythic media worlds for venues and events.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Arcane Realities creates cinematic immersive media for domes, VR, projection environments, music events, installations, and visionary brands. The Arcanum can be licensed, customized, or expanded for venues, festivals, museums, theaters, and special events.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {inquiryTypes.map((type) => (
                <span key={type} className="px-3 py-1 text-xs border border-gold/20 rounded-full text-white/40 tracking-wide">
                  {type}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <Link href="/contact" className="arcanum-btn-primary">Start a Licensing Inquiry</Link>
              <Link href="/contact" className="arcanum-btn-ghost">Work With Us</Link>
            </div>
          </motion.div>

          {/* Blueprint visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold/10 bg-obsidian-200 p-8 aspect-square">
              {/* Blueprint lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border-gold/10"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: 0,
                    bottom: 0,
                    borderLeftWidth: '1px',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border-gold/10"
                  style={{
                    top: `${15 + i * 12}%`,
                    left: 0,
                    right: 0,
                    borderTopWidth: '1px',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                />
              ))}
              {/* Center element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="w-20 h-20 rounded-full border-2 border-gold/30 mx-auto mb-4 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="text-gold/40 text-2xl">◈</span>
                  </motion.div>
                  <p className="text-white/30 text-xs tracking-widest uppercase">Arcane Realities</p>
                  <p className="text-gold/40 text-xs mt-1">Immersive Media Studio</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
