'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, flyInBottom, wobbleIn, staggerContainer, viewport } from '@/lib/utils/motionVariants'

const MODES = [
  { id: 'cosmic',   label: 'Cosmic Anthem',   symbol: '✦', color: '#c9973a', desc: 'Gold orchestral pulses' },
  { id: 'void',     label: 'Void Drift',       symbol: '◈', color: '#a855f7', desc: 'Deep space ambient' },
  { id: 'crystal',  label: 'Crystal Grid',     symbol: '⬡', color: '#00e5ff', desc: 'Sacred geometry sync' },
  { id: 'fire',     label: 'Fire Ritual',      symbol: '⟁', color: '#f97316', desc: 'Burning rhythm mode' },
  { id: 'goddess',  label: 'Goddess Bloom',    symbol: '✿', color: '#ec4899', desc: 'Divine feminine flow' },
]

interface ModeChipProps {
  mode: typeof MODES[0]
}

function ModeChip({ mode }: ModeChipProps) {
  return (
    <motion.div
      variants={wobbleIn}
      whileHover={{
        y: -6,
        scale: 1.06,
        boxShadow: `0 8px 30px ${mode.color}40`,
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: 0.95 }}
      className="relative rounded-xl px-4 py-3 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${mode.color}12 0%, ${mode.color}06 100%)`,
        border: `1px solid ${mode.color}30`,
      }}
    >
      {/* Symbol */}
      <motion.div
        className="text-xl mb-1.5"
        style={{ color: mode.color }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
      >
        {mode.symbol}
      </motion.div>
      <p className="font-cinzel text-[11px] font-bold tracking-wide mb-0.5" style={{ color: mode.color }}>
        {mode.label}
      </p>
      <p className="text-[9px] tracking-wide text-white/50">{mode.desc}</p>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 inset-x-4 h-px rounded-full" style={{ background: `${mode.color}50` }} />
    </motion.div>
  )
}

export default function Home2AscensionSection() {
  return (
    <section className="relative px-4 md:px-8 py-16 overflow-hidden" style={{ background: '#08060e' }}>

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Section header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="max-w-7xl mx-auto mb-10 text-center"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase mb-2 font-medium" style={{ color: '#a855f780' }}>
          Living Visualizer
        </p>
        <h2
          className="font-cinzel text-2xl md:text-3xl font-bold tracking-wide mb-3"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #c084fc 60%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          The Ascension Chamber
        </h2>
        <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
          Music-reactive visuals that transform your screen into a living portal. Choose your realm and let the sound guide you.
        </p>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4 max-w-sm mx-auto">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4))' }} />
          <span className="text-[8px] tracking-[0.4em] uppercase" style={{ color: '#a855f750' }}>modes</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.4), transparent)' }} />
        </div>
      </motion.div>

      {/* Mode chips */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-10"
      >
        {MODES.map((mode) => (
          <ModeChip key={mode.id} mode={mode} />
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={flyInBottom}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="flex justify-center"
      >
        <Link href="/screensaver">
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border font-cinzel text-sm font-bold tracking-widest uppercase"
            style={{
              borderColor: '#a855f750',
              background: 'linear-gradient(135deg, #a855f712 0%, #7c3aed08 100%)',
              color: '#a855f7',
            }}
            whileHover={{
              borderColor: '#a855f7',
              background: 'linear-gradient(135deg, #a855f725 0%, #7c3aed18 100%)',
              boxShadow: '0 0 30px #a855f730',
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block' }}
            >
              ✦
            </motion.span>
            Enter the Chamber
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
