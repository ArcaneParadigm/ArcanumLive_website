'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function StoreFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-obsidian-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Visual mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 md:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold/10 bg-obsidian-100 aspect-video">
              {/* TV art mockup */}
              <div className="absolute inset-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-deep to-obsidian-200 flex items-center justify-center border border-white/5">
                <div
                  className="w-24 h-24 rounded-full opacity-30 animate-glow-pulse"
                  style={{ background: 'radial-gradient(circle, #c9973a 0%, transparent 70%)' }}
                />
                <p className="absolute bottom-4 left-4 text-white/20 text-xs tracking-widest">TV Art Preview</p>
              </div>
              {/* Gold trim */}
              <div className="absolute inset-0 border border-gold/10 rounded-2xl pointer-events-none" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">Section VIII</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Sacred Products<br />
              <span className="text-transparent bg-clip-text bg-gold-gradient">&amp; TV Art</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-4">
              Bring the visual worlds of The Arcanum into your home, studio, altar, screen, or creative space.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Explore visual artifacts, TV art, sacred media pieces, and products connected to the worlds of The Arcanum. The store begins with external shop links and can expand into a fully integrated marketplace later.
            </p>

            <div className="flex gap-3">
              <a
                href="https://www.etsy.com/shop/ArcanumTvArt"
                target="_blank"
                rel="noopener noreferrer"
                className="arcanum-btn-primary"
              >
                Visit the Store ↗
              </a>
              <a
                href="https://www.etsy.com/shop/ArcanumTvArt"
                target="_blank"
                rel="noopener noreferrer"
                className="arcanum-btn-ghost"
              >
                Explore TV Art
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
