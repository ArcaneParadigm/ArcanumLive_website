'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD = '#c9973a'
const VIOLET = '#a855f7'

// ── Placeholder album data ────────────────────────────────────────────────────

interface Track {
  id: string
  title: string
  duration: string
  bpm?: number
  hz?: number
}

interface Album {
  id: string
  title: string
  artist: string
  year: string
  genre: string
  description: string
  color: string
  tracks: Track[]
}

const ALBUMS: Album[] = [
  {
    id: 'cosmic-anthems',
    title: 'Cosmic Anthems',
    artist: 'Arcane Realities',
    year: '2025',
    genre: 'Astral Ambient',
    description: 'High-frequency orchestral transmissions from beyond the veil. Each track encoded at solfeggio frequencies.',
    color: '#c9973a',
    tracks: [
      { id: 'ca-1', title: 'Portal One Awakening', duration: '6:33', hz: 396 },
      { id: 'ca-2', title: 'Stellar Gateway', duration: '8:12', hz: 417 },
      { id: 'ca-3', title: 'The Fracture Opens', duration: '5:44', hz: 528 },
      { id: 'ca-4', title: 'Dimensional Shift', duration: '7:21', hz: 639 },
      { id: 'ca-5', title: 'Cosmic Anthem Finale', duration: '11:06', hz: 963 },
    ],
  },
  {
    id: 'sacred-om',
    title: 'Sacred Om Sessions',
    artist: 'Sacred Om Verse',
    year: '2025',
    genre: 'Frequency Medicine',
    description: 'Deep meditative journeys through sacred geometry and encoded light frequencies. For expanded states.',
    color: '#a855f7',
    tracks: [
      { id: 'so-1', title: 'OM — The First Sound', duration: '12:00', hz: 136 },
      { id: 'so-2', title: 'Crystal Bowl Activation', duration: '9:18', hz: 174 },
      { id: 'so-3', title: 'Merkaba Spin', duration: '7:55', hz: 285 },
      { id: 'so-4', title: 'Third Eye Opening', duration: '14:22', hz: 741 },
    ],
  },
  {
    id: 'cyber-ritual',
    title: 'Cyber Ritual',
    artist: 'MythMachine',
    year: '2025',
    genre: 'Dark Electronic',
    description: 'Neon-coded transmissions from the edge of the digital-shamanic divide. Heavy beats. Neon ritual.',
    color: '#0055ff',
    tracks: [
      { id: 'cr-1', title: 'Digital Shaman', duration: '5:02', bpm: 128 },
      { id: 'cr-2', title: 'Neon Geisha Protocol', duration: '4:44', bpm: 140 },
      { id: 'cr-3', title: 'Cyber Oracle', duration: '6:18', bpm: 135 },
      { id: 'cr-4', title: 'Dark Matrix Drop', duration: '3:59', bpm: 150 },
      { id: 'cr-5', title: 'Ritual Override', duration: '7:30', bpm: 120 },
      { id: 'cr-6', title: 'System Gods', duration: '5:15', bpm: 145 },
    ],
  },
  {
    id: 'goddess-bloom',
    title: 'Goddess Bloom',
    artist: 'Multiverse Girls',
    year: '2025',
    genre: 'Divine Feminine',
    description: 'Lush, cinematic scores following the goddess archetype through myth, fire, and eternal bloom.',
    color: '#ec4899',
    tracks: [
      { id: 'gb-1', title: 'She Who Was Before Time', duration: '8:04' },
      { id: 'gb-2', title: 'Fae Emergence', duration: '5:50' },
      { id: 'gb-3', title: 'Mermaid Protocol', duration: '6:23' },
      { id: 'gb-4', title: 'Sorceress Rising', duration: '7:11' },
    ],
  },
]

// ── Track row ─────────────────────────────────────────────────────────────────

function TrackRow({ track, index, color, isPlaying, onPlay }: {
  track: Track; index: number; color: string; isPlaying: boolean; onPlay: () => void
}) {
  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group"
      style={{
        background: isPlaying ? `${color}18` : 'transparent',
        border: `1px solid ${isPlaying ? color + '40' : 'transparent'}`,
      }}
      whileHover={{ background: `${color}12`, borderColor: `${color}25` }}
      transition={{ duration: 0.12 }}
      onClick={onPlay}
    >
      <div className="w-5 text-center shrink-0">
        {isPlaying ? (
          <div className="flex items-end justify-center gap-px h-3">
            {[0, 0.15, 0.3].map(d => (
              <motion.div key={d} className="w-0.5 rounded-sm"
                style={{ background: color }}
                animate={{ height: ['4px', '10px', '4px'] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: d, ease: 'easeInOut' }} />
            ))}
          </div>
        ) : (
          <span className="text-[10px]" style={{ color: `${color}50` }}>{index + 1}</span>
        )}
      </div>
      <span className="flex-1 text-xs font-medium tracking-wide truncate"
        style={{ color: isPlaying ? color : 'rgba(255,255,255,0.8)' }}>
        {track.title}
      </span>
      {(track.hz || track.bpm) && (
        <span className="text-[9px] tracking-widest shrink-0" style={{ color: `${color}70` }}>
          {track.hz ? `${track.hz}Hz` : `${track.bpm}BPM`}
        </span>
      )}
      <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{track.duration}</span>
    </motion.div>
  )
}

// ── Album card ────────────────────────────────────────────────────────────────

function AlbumCard({ album, isOpen, onToggle, playingTrack, onPlayTrack }: {
  album: Album; isOpen: boolean; onToggle: () => void
  playingTrack: string | null; onPlayTrack: (id: string) => void
}) {
  const ICON = album.genre.includes('Ambient') || album.genre.includes('Frequency') ? '✦' :
               album.genre.includes('Electronic') ? '◈' :
               album.genre.includes('Divine') ? '✿' : '◎'
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${album.color}${isOpen ? '50' : '22'}`,
        background: isOpen ? `linear-gradient(135deg, ${album.color}0c, #0c0a14)` : '#0c0a14',
        boxShadow: isOpen ? `0 0 40px ${album.color}10` : 'none',
      }}
      layout
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header row */}
      <motion.div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
        whileHover={{ background: `${album.color}08` }}
        transition={{ duration: 0.12 }}
      >
        <div className="shrink-0 rounded-lg flex items-center justify-center"
          style={{ width: 'clamp(40px, 10vw, 56px)', height: 'clamp(40px, 10vw, 56px)', background: `radial-gradient(ellipse at 40% 40%, ${album.color}30, #08060e)`, border: `1px solid ${album.color}40` }}>
          <span style={{ fontSize: 'clamp(14px, 3vw, 22px)', filter: `drop-shadow(0 0 8px ${album.color})` }}>{ICON}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-cinzel text-sm font-bold tracking-wide truncate"
            style={{ color: isOpen ? album.color : 'rgba(255,255,255,0.9)' }}>{album.title}</p>
          <p className="text-[10px] tracking-widest truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {album.artist} · {album.year}
          </p>
          <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: `${album.color}80` }}>
            {album.genre} · {album.tracks.length} tracks
          </p>
        </div>
        <motion.span className="shrink-0 text-xs" style={{ color: `${album.color}80` }}
          animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>▼</motion.span>
      </motion.div>

      {/* Fold-out */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-3">
              <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${album.color}40, transparent)` }} />
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{album.description}</p>
            </div>
            <div className="px-3 pb-4 flex flex-col gap-0.5">
              {album.tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} color={album.color}
                  isPlaying={playingTrack === track.id}
                  onPlay={() => onPlayTrack(track.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Widgets ───────────────────────────────────────────────────────────────────

function FrequencyDial({ color }: { color: string }) {
  const [value, setValue] = useState(528)
  const FREQS = [174, 285, 396, 417, 528, 639, 741, 852, 963]
  return (
    <div className="rounded-xl p-4" style={{ background: '#0c0a14', border: `1px solid ${color}25` }}>
      <p className="text-[9px] tracking-[0.4em] uppercase mb-3 font-medium" style={{ color: `${color}90` }}>Solfeggio Tuner</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {FREQS.map(f => (
          <motion.button key={f}
            className="px-2 py-1 rounded text-[9px] font-bold tracking-wider"
            style={{
              background: value === f ? color : `${color}12`,
              color: value === f ? '#08060e' : `${color}cc`,
              border: `1px solid ${color}${value === f ? 'ff' : '28'}`,
            }}
            onClick={() => setValue(f)}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}
          >{f}Hz</motion.button>
        ))}
      </div>
      <div className="text-center">
        <span className="font-cinzel text-2xl font-bold" style={{ color }}>{value}</span>
        <span className="text-xs ml-1" style={{ color: `${color}60` }}>Hz</span>
      </div>
    </div>
  )
}

function GeometrySpinner({ color }: { color: string }) {
  const [speed, setSpeed] = useState(12)
  const pts = (n: number, r: number) => Array.from({ length: n }, (_, i) => ({
    x: 50 + r * Math.sin((i * 2 * Math.PI) / n),
    y: 50 - r * Math.cos((i * 2 * Math.PI) / n),
  }))
  const hex = pts(6, 40); const tri = pts(3, 28)
  return (
    <div className="rounded-xl p-4" style={{ background: '#0c0a14', border: `1px solid ${color}25` }}>
      <p className="text-[9px] tracking-[0.4em] uppercase mb-3 font-medium" style={{ color: `${color}90` }}>Sacred Geometry</p>
      <div className="flex justify-center mb-3">
        <motion.svg width="100" height="100" viewBox="0 0 100 100" fill="none"
          animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}>
          <polygon points={hex.map(p => `${p.x},${p.y}`).join(' ')} stroke={color} strokeWidth="1" strokeOpacity="0.8" />
          <polygon points={tri.map(p => `${p.x},${p.y}`).join(' ')} stroke={color} strokeWidth="1" strokeOpacity="0.7" />
          <circle cx="50" cy="50" r="5" fill={color} fillOpacity="0.8" />
          {hex.map((p, i) => <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke={color} strokeWidth="0.5" strokeOpacity="0.4" />)}
        </motion.svg>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px]" style={{ color: `${color}60` }}>Slow</span>
        <input type="range" min="3" max="30" value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="flex-1" style={{ accentColor: color }} />
        <span className="text-[9px]" style={{ color: `${color}60` }}>Fast</span>
      </div>
    </div>
  )
}

function ArchiveStats({ color }: { color: string }) {
  const stats = [
    { label: 'Albums', value: '4', sub: 'in the archive' },
    { label: 'Tracks', value: '24', sub: 'transmissions' },
    { label: 'Realms', value: '12', sub: 'worlds documented' },
    { label: 'Hz Codes', value: '9', sub: 'solfeggio keys' },
  ]
  return (
    <div className="rounded-xl p-4" style={{ background: '#0c0a14', border: `1px solid ${color}25` }}>
      <p className="text-[9px] tracking-[0.4em] uppercase mb-3 font-medium" style={{ color: `${color}90` }}>Archive Status</p>
      <div className="grid grid-cols-2 gap-2">
        {stats.map(s => (
          <div key={s.label} className="p-2 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
            <p className="font-cinzel text-xl font-bold" style={{ color }}>{s.value}</p>
            <p className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</p>
            <p className="text-[8px]" style={{ color: `${color}60` }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function CodexPage() {
  const [openAlbum, setOpenAlbum] = useState<string | null>('cosmic-anthems')
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
  const [activeColor, setActiveColor] = useState(GOLD)

  function handlePlayTrack(id: string) {
    setPlayingTrack(prev => prev === id ? null : id)
  }

  function handleToggleAlbum(id: string) {
    const album = ALBUMS.find(a => a.id === id)
    if (album) setActiveColor(album.color)
    setOpenAlbum(prev => prev === id ? null : id)
  }

  const allTracks = ALBUMS.flatMap(a => a.tracks)
  const currentTrack = allTracks.find(t => t.id === playingTrack)

  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      {/* ── Hero / main view ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(201,151,58,0.12) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 100%, rgba(168,85,247,0.08) 0%, transparent 50%)' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
            <defs>
              <pattern id="codex-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GOLD} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#codex-grid)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: GOLD }}>
              The Arcanum · Living Archive
            </p>
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4"
              style={{
                background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: `drop-shadow(0 0 24px ${GOLD}40)`,
              }}>
              The Codex
            </h1>
            <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed mb-8">
              Forbidden archives, sacred transmissions, and encoded audio from across the multiverse.
            </p>

            {/* Now playing display */}
            <AnimatePresence mode="wait">
              {currentTrack ? (
                <motion.div key={currentTrack.id}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
                  style={{ background: `${activeColor}18`, border: `1px solid ${activeColor}50`, boxShadow: `0 0 30px ${activeColor}20` }}
                >
                  <div className="flex items-end gap-px h-4">
                    {[0, 0.1, 0.2, 0.1].map((d, i) => (
                      <motion.div key={i} className="w-1 rounded-sm" style={{ background: activeColor }}
                        animate={{ height: ['3px', '14px', '6px', '14px', '3px'] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: d, ease: 'easeInOut' }} />
                    ))}
                  </div>
                  <span className="font-cinzel text-sm font-bold" style={{ color: activeColor }}>{currentTrack.title}</span>
                  <motion.button onClick={() => setPlayingTrack(null)}
                    className="text-xs cursor-pointer" style={{ color: `${activeColor}70` }}
                    whileHover={{ color: activeColor }}>✕</motion.button>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase"
                  style={{ color: `${GOLD}40` }}>
                  <span>◈</span> Select a track to activate
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #08060e)' }} />
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Albums (2/3) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40)` }} />
              <span className="text-[9px] tracking-[0.4em] uppercase font-medium" style={{ color: `${GOLD}90` }}>◆ Album Archive ◆</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}40, transparent)` }} />
            </div>
            <div className="flex flex-col gap-3">
              {ALBUMS.map(album => (
                <AlbumCard key={album.id} album={album}
                  isOpen={openAlbum === album.id}
                  onToggle={() => handleToggleAlbum(album.id)}
                  playingTrack={playingTrack}
                  onPlayTrack={handlePlayTrack} />
              ))}
            </div>
          </div>

          {/* Widgets (1/3) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${VIOLET}40)` }} />
              <span className="text-[9px] tracking-[0.4em] uppercase font-medium" style={{ color: `${VIOLET}90` }}>◆ Tools ◆</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${VIOLET}40, transparent)` }} />
            </div>
            <GeometrySpinner color={activeColor} />
            <FrequencyDial color={activeColor} />
            <ArchiveStats color={activeColor} />
          </div>

        </div>
      </div>
    </div>
  )
}
