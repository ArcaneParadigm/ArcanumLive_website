'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const finalButtons = [
  {
    label: 'Ascension Chamber',
    href: '/screensaver',
    color: '#00d4ff',
    icon: '◉',
    desc: 'Enter the living visualizer',
  },
  {
    label: 'Rent 360 Movies',
    href: '/films',
    color: '#c9973a',
    icon: '⬡',
    desc: 'Watch in VR headsets',
  },
  {
    label: 'Explore Worlds',
    href: '/worlds',
    color: '#7c3aed',
    icon: '✦',
    desc: 'Enter mythic realms',
  },
  {
    label: 'License Content',
    href: '/contact',
    color: '#f5d06e',
    icon: '◈',
    desc: 'Venues & events',
  },
]

const FINAL_PARTICLES = Array.from({ length: 20 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
}))

export default function FinalPortalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section ref={ref} className="py-24 md:py-32 bg-obsidian-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-arcanum-radial opacity-60 pointer-events-none" />
      {/* Portal convergence orbs — each matches a destination */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0% 0%, rgba(0,229,255,0.12) 0%, transparent 60%)', filter: 'blur(40px)' }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 100% 0%, rgba(201,151,58,0.1) 0%, transparent 60%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0% 100%, rgba(124,58,237,0.12) 0%, transparent 60%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 100% 100%, rgba(245,208,110,0.08) 0%, transparent 60%)', filter: 'blur(40px)' }} />
      {/* Central convergence beam */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,151,58,0.06) 0%, transparent 55%)' }} />
      {mounted && FINAL_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-gold/30"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-gold/55 text-xs tracking-[0.4em] uppercase mb-4">Choose Your Portal</p>
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-widest">
            The Arcanum
            <br />
            <span
              className="text-transparent bg-clip-text bg-gold-gradient"
              style={{ filter: 'drop-shadow(0 0 24px rgba(201,151,58,0.5))' }}
            >Is Open</span>
          </h2>
          <p className="text-silver-mid/60 text-sm mb-14 tracking-wide">
            Watch, rent, explore, license, or launch the living visualizer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {finalButtons.map((btn, i) => (
            <motion.div
              key={btn.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Link
                href={btn.href}
                className="group relative block p-6 rounded-2xl border border-white/10 bg-obsidian-100/40 backdrop-blur-sm hover:bg-obsidian-100/60 transition-all duration-500 text-center"
                style={{ boxShadow: `0 0 0 1px transparent` }}
              >
                {/* Ambient glow bg */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${btn.color}22 0%, transparent 70%)` }}
                />
                <div
                  className="text-4xl mb-3 transition-all duration-300 group-hover:scale-125"
                  style={{ color: btn.color, filter: `drop-shadow(0 0 0px ${btn.color})` }}
                >
                  <span
                    className="inline-block group-hover:drop-shadow-[0_0_12px_currentColor] transition-all duration-300"
                    style={{ color: btn.color }}
                  >
                    {btn.icon}
                  </span>
                </div>
                <p className="text-white/80 text-sm font-semibold tracking-wide mb-1">{btn.label}</p>
                <p className="text-white/30 text-xs">{btn.desc}</p>

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${btn.color}55, 0 0 30px ${btn.color}22` }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white/25 hover:text-white/50 text-xs tracking-[0.3em] uppercase transition-colors"
          >
            ↑ Return to Portal
          </button>
        </motion.div>
      </div>
    </section>
  )
}
