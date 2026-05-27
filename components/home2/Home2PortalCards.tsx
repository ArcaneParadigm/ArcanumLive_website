'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { staggerContainer, viewport } from '@/lib/utils/motionVariants'

const PORTALS = [
  {
    id: 'dome',
    title: 'Dome Shows',
    subtitle: 'Fulldome Cinema',
    symbol: '◎',
    href: '/dome-shows',
    color: '#c9973a',
    desc: 'Immersive planetarium & festival content',
  },
  {
    id: 'watch',
    title: '360 Films',
    subtitle: 'VR Streaming',
    symbol: '◉',
    href: '/watch',
    color: '#a855f7',
    desc: 'Step inside epic cinematic worlds',
  },
  {
    id: 'worlds',
    title: 'The Worlds',
    subtitle: 'IP Universe',
    symbol: '✦',
    href: '/worlds',
    color: '#00e5ff',
    desc: 'Mythic realms of characters & lore',
  },
  {
    id: 'ascension',
    title: 'Ascension',
    subtitle: 'Living Visualizer',
    symbol: '⬡',
    href: '/screensaver',
    color: '#ec4899',
    desc: 'Music-reactive portal meditation',
  },
]

interface PortalCardProps {
  portal: typeof PORTALS[0]
  index: number
}

function PortalCard({ portal, index }: PortalCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.85 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 180,
            damping: 14,
            delay: index * 0.08,
          },
        },
      }}
    >
      <Link href={portal.href} className="group block h-full">
        <motion.div
          className="relative h-full rounded-2xl overflow-hidden border p-6 flex flex-col items-center text-center"
          style={{
            borderColor: `${portal.color}25`,
            background: `radial-gradient(ellipse at 50% 0%, ${portal.color}10 0%, rgba(8,6,14,0.95) 70%)`,
            minHeight: 180,
          }}
          whileHover={{
            y: -10,
            scale: 1.03,
            borderColor: `${portal.color}70`,
            boxShadow: `0 16px 48px ${portal.color}25, 0 0 0 1px ${portal.color}40`,
            transition: { type: 'spring', stiffness: 350, damping: 12 },
          }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Ambient top glow */}
          <div
            className="absolute top-0 inset-x-0 h-16 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${portal.color}15, transparent)` }}
          />

          {/* Spinning symbol */}
          <motion.div
            className="text-3xl mb-3 relative z-10"
            style={{ color: portal.color }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20 + index * 4, repeat: Infinity, ease: 'linear' }}
          >
            {portal.symbol}
          </motion.div>

          {/* Text */}
          <p
            className="text-[8px] tracking-[0.4em] uppercase mb-1 font-medium relative z-10"
            style={{ color: `${portal.color}70` }}
          >
            {portal.subtitle}
          </p>
          <h3
            className="font-cinzel text-base font-bold tracking-wide mb-2 relative z-10"
            style={{ color: portal.color }}
          >
            {portal.title}
          </h3>
          <p className="text-white/50 text-[10px] leading-relaxed relative z-10 group-hover:text-white/70 transition-colors">
            {portal.desc}
          </p>

          {/* Bottom border glow */}
          <div
            className="absolute bottom-0 inset-x-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${portal.color}60, transparent)` }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Home2PortalCards() {
  return (
    <section className="relative px-4 md:px-8 py-16" style={{ background: '#06040c' }}>

      {/* Divider */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.8 } },
        }}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="flex items-center gap-4 mb-10 max-w-7xl mx-auto"
      >
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.3))' }} />
        <span className="text-[9px] tracking-[0.5em] uppercase font-cinzel" style={{ color: 'rgba(201,151,58,0.4)' }}>
          Enter a Portal
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,151,58,0.3), transparent)' }} />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto"
      >
        {PORTALS.map((portal, i) => (
          <PortalCard key={portal.id} portal={portal} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
