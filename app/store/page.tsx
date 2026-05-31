'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD = '#c9973a'

// ── External shop platforms ───────────────────────────────────────────────────

const PLATFORMS = [
  {
    name: 'Fine Art America',
    tag: 'Canvas · Metal · Framed Prints',
    desc: 'Museum-quality prints, canvas wraps, metal prints, and framed art — shipped worldwide from Glenn Grillo\'s official collection.',
    href: 'https://fineartamerica.com/profiles/glenn-grillo',
    color: '#8a9aaa',
    icon: '◉',
    cta: 'Shop Fine Art ↗',
  },
  {
    name: 'Amazon — Books',
    tag: 'Books · Sacred Texts · AI Lore',
    desc: 'The Arcanum universe in print — sacred texts, world-building lore, and visionary fiction from the multiverse.',
    href: 'https://www.amazon.com/stores/author/B0BWHLQ5T3/allbooks',
    color: '#f5a623',
    icon: '✦',
    cta: 'Browse the Books ↗',
  },
  {
    name: 'Etsy — Arcanum Mystica',
    tag: 'Prints · Altar Art · Downloads · Clothing',
    desc: 'Sacred art prints, digital downloads, ambient TV art, clothing, and altar pieces for your space.',
    href: 'https://www.etsy.com/shop/ArcanumMystica',
    color: '#f26522',
    icon: '◈',
    cta: 'Shop Etsy ↗',
  },
  {
    name: 'Clothing',
    tag: 'Coming Soon · Apparel · Merch',
    desc: 'Arcanum apparel — realm-branded tees, hoodies, and sacred geometry wearables. Shop opening soon via Printify.',
    href: '#',
    color: '#a855f7',
    icon: '◫',
    cta: 'Coming Soon',
    comingSoon: true,
  },
]

// ── Screensaver preset strips ─────────────────────────────────────────────────

const SCREENSAVERS = [
  {
    id: 'wonderland-drift',
    title: 'Wonderland Drift',
    subtitle: 'Gallery Drift',
    desc: 'Slow cinematic drift through the surreal landscapes of Wonderland — mirror pools, oversized flora, and shifting dimensions.',
    color: '#ec4899',
    accent: '#f472b6',
    bg: 'linear-gradient(135deg, #1a0a2e, #3d0a3f, #1a0a2e)',
  },
  {
    id: 'goddess-portal',
    title: 'Goddess Portal',
    subtitle: 'Fluid Oracle',
    desc: 'Liquid divine feminine energy — flowing portals of rose, violet, and gold light emanating from the goddess archetype.',
    color: '#f472b6',
    accent: '#ec4899',
    bg: 'linear-gradient(135deg, #1a0518, #3d0a2f, #1a0518)',
  },
  {
    id: 'cyber-geisha-ritual',
    title: 'Cyber Geisha Neon Ritual',
    subtitle: 'Fluid Oracle',
    desc: 'Neon cyber-shamanic ritual visuals — digital beats, electric sakura, and geisha warrior energy in full fluorescent bloom.',
    color: '#00e5ff',
    accent: '#0099cc',
    bg: 'linear-gradient(135deg, #001a2e, #003d4f, #001a2e)',
  },
  {
    id: 'sacred-temple-drift',
    title: 'Sacred Temple Drift',
    subtitle: 'Gallery Drift',
    desc: 'Slow cinematic movement through ancient-tech temples — sacred geometry corridors, golden altars, and divine light shafts.',
    color: '#c9973a',
    accent: '#f5d06e',
    bg: 'linear-gradient(135deg, #1a1000, #2e1f00, #1a1000)',
  },
  {
    id: 'mermaid-depths',
    title: 'Mermaid Depths',
    subtitle: 'Particle Cosmos',
    desc: 'Bioluminescent particle fields beneath the multiverse ocean — schools of light-fish, coral fractals, and deep sea portals.',
    color: '#0055ff',
    accent: '#4488ff',
    bg: 'linear-gradient(135deg, #000d1a, #001a3d, #000d1a)',
  },
  {
    id: 'fae-forest',
    title: 'Fae Forever Forest',
    subtitle: 'Gallery Drift',
    desc: 'Enchanted drift through the eternal fae forest — fireflies as portals, ancient trees breathing light, moon-drenched clearings.',
    color: '#22c55e',
    accent: '#4ade80',
    bg: 'linear-gradient(135deg, #001a0d, #003d1a, #001a0d)',
  },
  {
    id: 'cosmic-anthem',
    title: 'Cosmic Anthem Mode',
    subtitle: 'Music Reactor',
    desc: 'High-energy cosmic visuals that pulse and explode with orchestral anthem soundtrack — gold starfields and supernova bursts.',
    color: '#c9973a',
    accent: '#f5d06e',
    bg: 'linear-gradient(135deg, #0a0500, #1a0d00, #0a0500)',
  },
  {
    id: 'raven-oracle',
    title: 'Raven Oracle Shadows',
    subtitle: 'Gallery Drift',
    desc: 'Dark oracle shadow-play — trickster goddess energy through obsidian landscapes, moonlit ravens, and shadow portals.',
    color: '#8b5cf6',
    accent: '#a78bfa',
    bg: 'linear-gradient(135deg, #0a0014, #1a0028, #0a0014)',
  },
  {
    id: 'singularity-pulse',
    title: 'Singularity Pulse',
    subtitle: 'Particle Cosmos',
    desc: 'The technological singularity visualized — exponential particle expansion, data-stream auroras, and fractal intelligence fields.',
    color: '#00ff88',
    accent: '#00cc66',
    bg: 'linear-gradient(135deg, #001a0d, #00330d, #001a0d)',
  },
  {
    id: 'metaburn-crystal',
    title: 'Metaburn Crystal Fire',
    subtitle: 'Fluid Oracle',
    desc: 'Crystal lattices dissolving into fire — sacred geometry combustion, ember-gold fluid fields, and the burn of transformation.',
    color: '#f97316',
    accent: '#fb923c',
    bg: 'linear-gradient(135deg, #1a0500, #3d0a00, #1a0500)',
  },
]

// ── Components ────────────────────────────────────────────────────────────────

function PlatformCard({ p, i }: { p: typeof PLATFORMS[0]; i: number }) {
  return (
    <motion.a
      href={p.href}
      target={p.comingSoon ? undefined : '_blank'}
      rel={p.comingSoon ? undefined : 'noopener noreferrer'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="relative block rounded-2xl overflow-hidden p-6 cursor-pointer group"
      style={{
        border: `1px solid ${p.color}35`,
        background: `linear-gradient(135deg, ${p.color}10 0%, #0c0a14 60%)`,
        boxShadow: `0 0 40px ${p.color}08`,
        opacity: p.comingSoon ? 0.7 : 1,
      }}
      whileHover={p.comingSoon ? {} : {
        borderColor: `${p.color}80`,
        boxShadow: `0 0 40px ${p.color}20, 0 0 80px ${p.color}08`,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-3xl mb-4" style={{ color: p.color, filter: `drop-shadow(0 0 8px ${p.color}60)` }}>{p.icon}</div>
      <div className="mb-3">
        <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border"
          style={{ color: `${p.color}90`, borderColor: `${p.color}30`, background: `${p.color}0e` }}>
          {p.tag}
        </span>
      </div>
      <h3 className="font-cinzel text-white text-lg tracking-wide mb-2">{p.name}</h3>
      <p className="text-white/50 text-sm leading-relaxed mb-5">{p.desc}</p>
      <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: p.comingSoon ? `${p.color}50` : p.color }}>
        {p.cta}
      </span>
    </motion.a>
  )
}

function ScreensaverStrip({ ss, i }: { ss: typeof SCREENSAVERS[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: i * 0.04 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: ss.bg,
        border: `1px solid ${ss.color}40`,
      }}
      whileHover={{ borderColor: ss.color, boxShadow: `0 0 30px ${ss.color}25` }}
    >
      {/* Animated glow orb */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 120, height: 120, background: `radial-gradient(circle, ${ss.color}35, transparent 70%)`, filter: 'blur(20px)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
      />

      <div className="relative flex items-center gap-6 px-6 py-4">
        {/* Color accent bar */}
        <div className="shrink-0 w-1 h-12 rounded-full" style={{ background: `linear-gradient(to bottom, transparent, ${ss.color}, transparent)` }} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-cinzel text-sm font-bold" style={{ color: '#e8dcc8' }}>{ss.title}</h3>
            <span className="text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded"
              style={{ background: `${ss.color}20`, border: `1px solid ${ss.color}50`, color: ss.color }}>
              {ss.subtitle}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{ss.desc}</p>
        </div>

        {/* Coming Soon badge + action */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className="text-[8px] tracking-widest uppercase px-2 py-1 rounded"
            style={{ background: `${ss.color}15`, border: `1px solid ${ss.color}40`, color: `${ss.color}cc` }}>
            Coming Soon
          </span>
          <Link href="/ascension" onClick={e => e.stopPropagation()}
            className="text-[8px] tracking-widest uppercase" style={{ color: `${ss.color}60` }}>
            Preview →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StorePage() {
  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-10">
          <p className="text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: GOLD }}>The Arcanum</p>
          <h1 className="font-cinzel text-4xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 24px ${GOLD}40)`,
            }}>
            Sacred Products
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            Bring the visual worlds of The Arcanum into your home, studio, altar, screen, and wardrobe.
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {PLATFORMS.map((p, i) => <PlatformCard key={p.name} p={p} i={i} />)}
        </div>

        {/* Screensavers section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40)` }} />
            <span className="font-cinzel text-sm font-bold tracking-widest" style={{ color: '#e8dcc8' }}>◆ Screensaver Collection ◆</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}40, transparent)` }} />
          </div>
          <p className="text-white/40 text-sm text-center mb-8 max-w-lg mx-auto">
            Living visual portals for your screen — realm-specific presets launching soon as downloadable screensavers.
          </p>
          <div className="flex flex-col gap-2">
            {SCREENSAVERS.map((ss, i) => <ScreensaverStrip key={ss.id} ss={ss} i={i} />)}
          </div>
        </div>

      </div>
    </div>
  )
}
