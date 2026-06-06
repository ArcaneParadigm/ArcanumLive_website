'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD   = '#c9973a'
const VIOLET = '#a855f7'
const CYAN   = '#00e5ff'

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

// ── Anuhazi Light Code videos ─────────────────────────────────────────────────

interface LightCode {
  id: string
  title: string
  desc: string
  youtubeId: string
}

const LIGHT_CODES: LightCode[] = [
  {
    id: 'spirit-grids',
    title: 'Anuhazi Spirit Grids',
    desc: 'Luminal Field Activation & Energy Alignment — step into the living architecture of the Spirit Grid.',
    youtubeId: 'YciEwOrj-Ek',
  },
  {
    id: 'sacred-grids',
    title: 'Sacred Grids',
    desc: 'Luminal Field Activation & Energy Alignment — enter the sacred geometric grid of consciousness.',
    youtubeId: 'YVHZ-HNs1Kc',
  },
  {
    id: 'maharata',
    title: 'Anuhazi: Maharata',
    desc: 'Journey Through the Light Temples — Sacred Sound Transmission from the higher harmonic realms.',
    youtubeId: 'SXmc_ZgXdIw',
  },
  {
    id: 'spirit-grids-2',
    title: 'Anuhazi Spirit Grids',
    desc: 'Advanced spirit grid architecture — luminous reclamation and field stabilization.',
    youtubeId: 'zHoVohX87Dk',
  },
  {
    id: 'grid-tech',
    title: 'Anuhazi Grid Tech',
    desc: 'Luminal Reclamation Systems Activation — enter the architecture of light.',
    youtubeId: '1rXmZhepMnY',
  },
  {
    id: 'the-key',
    title: 'Anuhazi: THE Key',
    desc: 'The Secret Unlocking Song — Luminal Reclamation transmission to unlock the hidden gateway within.',
    youtubeId: 'b0S9UsozHD0',
  },
  {
    id: 'angelics-2',
    title: 'Angelics 2: Celestial Realms',
    desc: 'Sacred Frequency Transmission — enter the higher harmonic fields of the Angelic realms.',
    youtubeId: '1jGdoXtpBec',
  },
  {
    id: 'hierarchy-soul',
    title: 'Anuhazi Hierarchy & Soul Divinity',
    desc: 'Cosmic Ommm Unveiled — the Anuhazi Divine Hierarchy and Soul Divinity transmission.',
    youtubeId: 'oMLzu6Ixspo',
  },
  {
    id: '12d-temple',
    title: '12D Temple Fly-Through',
    desc: 'Step into the 12th-Dimensional Maharata Current — Project Anuhazi Activation.',
    youtubeId: 'wTk_qK_xmaM',
  },
  {
    id: 'ascension-chamber-2',
    title: 'Ascension Chamber 2: Keys to the Multiverse',
    desc: 'Sacred mandalas mutate continuously around a meditating figure — inside the Ascension Chamber.',
    youtubeId: 'jNcOT5fKMQk',
  },
]

// ── Video card ────────────────────────────────────────────────────────────────

function LightCodeCard({ lc, isActive, onSelect }: { lc: LightCode; isActive: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}>
      <div className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '16/9',
          border: `1px solid ${isActive ? VIOLET : hovered ? VIOLET + '80' : VIOLET + '30'}`,
          boxShadow: isActive ? `0 0 24px ${VIOLET}60, 0 0 60px ${VIOLET}20` : hovered ? `0 0 14px ${VIOLET}30` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}>
        <img src={thumb(lc.youtubeId)} alt={lc.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.92) 0%, transparent 55%)' }} />

        {isActive && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] tracking-widest uppercase"
            style={{ background: `${VIOLET}30`, border: `1px solid ${VIOLET}`, color: VIOLET }}>
            Playing
          </div>
        )}
        {hovered && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${VIOLET}80` }}>
              <span style={{ color: VIOLET, fontSize: 14, marginLeft: 2 }}>▶</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-2">
          <p className="font-cinzel text-[9px] font-bold leading-tight"
            style={{ color: isActive ? VIOLET : '#e8dcc8', textShadow: '0 1px 6px rgba(0,0,0,1)' }}>
            {lc.title}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Sacred geometry pulse orb ─────────────────────────────────────────────────

function PulseOrb({ color, size = 200, delay = 0, responsive = false }: { color: string; size?: number; delay?: number; responsive?: boolean }) {
  const actualSize = responsive ? `clamp(${size * 0.5}px, ${size * 12.5}vw, ${size}px)` : size
  return (
    <div className="relative flex items-center justify-center" style={{ width: actualSize, height: actualSize }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ border: `1px solid ${color}`, width: responsive ? `calc(${actualSize} - ${i * 30}px)` : size - i * 30, height: responsive ? `calc(${actualSize} - ${i * 30}px)` : size - i * 30 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6 - i * 0.15, 0.9 - i * 0.15, 0.6 - i * 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: delay + i * 0.4 }} />
      ))}
      <motion.div className="rounded-full"
        style={{ width: size * 0.25, height: size * 0.25, background: `radial-gradient(circle, ${color}cc, ${color}33)`, boxShadow: `0 0 30px ${color}80` }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay }} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AltarPage() {
  const [selectedCode, setSelectedCode] = useState<LightCode>(LIGHT_CODES[0])

  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      {/* ── Hero ── */}
      <div className="relative pt-6 pb-4 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.1) 0%, transparent 70%)' }} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative inline-flex items-center justify-center gap-8">
          {/* Left orb */}
          <PulseOrb color={VIOLET} size={64} delay={0} responsive />

          {/* Title block */}
          <div className="text-center">
            <p className="text-[9px] tracking-[0.6em] uppercase mb-1.5" style={{ color: VIOLET }}>
              Sacred Transmissions
            </p>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold"
              style={{
                background: `linear-gradient(135deg, #4a1a8a 0%, ${VIOLET} 30%, #c084fc 55%, ${VIOLET} 75%, #4a1a8a 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: `drop-shadow(0 0 20px ${VIOLET}60)`,
              }}>
              The Altar
            </h1>
          </div>

          {/* Right orb */}
          <PulseOrb color={VIOLET} size={64} delay={1.2} />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">

        {/* ── Anuhazi Light Codes section ── */}
        <div className="mb-16">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${VIOLET}50)` }} />
            <div className="flex items-center gap-3">
              <motion.span style={{ fontSize: 18, color: VIOLET, filter: `drop-shadow(0 0 8px ${VIOLET})` }}
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>✦</motion.span>
              <h2 className="font-cinzel text-xl font-bold tracking-widest" style={{ color: '#e8dcc8' }}>
                Anuhazi Light Codes
              </h2>
              <motion.span style={{ fontSize: 18, color: VIOLET, filter: `drop-shadow(0 0 8px ${VIOLET})` }}
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.25 }}>✦</motion.span>
            </div>
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${VIOLET}50, transparent)` }} />
          </div>
          <p className="text-center text-white/40 text-xs tracking-widest mb-6">
            Luminal field activations · Sacred frequency transmissions · 12D temple meditations
          </p>

          {/* Player */}
          <div className="mb-5">
            <div className="relative overflow-hidden rounded-2xl"
              style={{ boxShadow: `inset 0 0 0 1px ${VIOLET}25, 0 16px 64px rgba(0,0,0,0.8), 0 0 80px ${VIOLET}10` }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                <iframe
                  key={selectedCode.youtubeId}
                  src={`https://www.youtube.com/embed/${selectedCode.youtubeId}?rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedCode.title}
                  style={{ border: 'none' }}
                />
              </div>
            </div>
            <div className="flex items-start justify-between mt-3 px-1">
              <div>
                <h3 className="font-cinzel text-lg font-bold" style={{ color: '#e8dcc8' }}>{selectedCode.title}</h3>
                <p className="text-xs mt-1 max-w-2xl" style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedCode.desc}</p>
              </div>
              <a href={`https://youtu.be/${selectedCode.youtubeId}`} target="_blank" rel="noopener noreferrer"
                className="text-[10px] tracking-widest uppercase shrink-0 ml-4" style={{ color: `${VIOLET}70` }}>
                Open on YouTube ↗
              </a>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {LIGHT_CODES.map((lc) => (
              <LightCodeCard key={lc.id} lc={lc}
                isActive={selectedCode.id === lc.id}
                onSelect={() => { setSelectedCode(lc); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
            ))}
          </div>
        </div>

        {/* ── More sections placeholder ── */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Sacred Sound', icon: '◎', color: GOLD, desc: 'Crystal bowl frequencies, solfeggio meditations, and sacred mantras.' },
            { title: 'Light Language', icon: '✦', color: CYAN, desc: 'Transmissions in Anuhazi and other light languages from the higher dimensions.' },
            { title: 'Activation Tools', icon: '⬡', color: VIOLET, desc: 'Sacred geometry activators, merkaba meditations, and frequency tools.' },
          ].map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl p-6 text-center"
              style={{ border: `1px solid ${s.color}25`, background: `${s.color}08` }}>
              <div className="text-2xl mb-3" style={{ color: s.color, filter: `drop-shadow(0 0 8px ${s.color}60)` }}>{s.icon}</div>
              <h3 className="font-cinzel text-sm font-bold mb-2" style={{ color: '#e8dcc8' }}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
              <p className="text-[9px] tracking-widest uppercase mt-3" style={{ color: `${s.color}50` }}>Coming Soon</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
