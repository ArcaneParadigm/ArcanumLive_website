'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { featuredWorlds } from '@/lib/data/worlds'
import type { VisualMode } from '@/types'
import KenBurnsSlideshow from '@/components/screensaver/KenBurnsSlideshow'

export interface DiscoveredTrack {
  id: string
  title: string
  url: string
}

interface RealmsPlayerProps {
  audioMap?: Record<string, DiscoveredTrack[]>
  sequenceMap?: Record<string, string[]>
  imageMap?: Record<string, string[]>
  compact?: boolean
  activeSlug?: string
}

function buildPlaceholderTracks(title: string) {
  const u = undefined as string | undefined
  return [
    { id: '1',  title: `${title} — Opening Theme`,       duration: '4:22', url: u },
    { id: '2',  title: `${title} — The Descent`,          duration: '5:47', url: u },
    { id: '3',  title: `${title} — Sacred Geometry`,      duration: '6:14', url: u },
    { id: '4',  title: `${title} — Convergence`,          duration: '3:58', url: u },
    { id: '5',  title: `${title} — Infinite Horizon`,     duration: '7:03', url: u },
    { id: '6',  title: `${title} — Portal Sequence`,      duration: '5:31', url: u },
    { id: '7',  title: `${title} — The Awakening`,        duration: '4:55', url: u },
    { id: '8',  title: `${title} — Dark Meditation`,      duration: '6:40', url: u },
    { id: '9',  title: `${title} — Celestial Gate`,       duration: '5:12', url: u },
    { id: '10', title: `${title} — Field of Light`,       duration: '4:44', url: u },
    { id: '11', title: `${title} — The Return`,           duration: '6:08', url: u },
    { id: '12', title: `${title} — Ancient Transmission`, duration: '5:29', url: u },
    { id: '13', title: `${title} — Closing Ceremony`,     duration: '7:18', url: u },
  ]
}

function buildPlaylists(audioMap: Record<string, DiscoveredTrack[]> = {}) {
  return featuredWorlds.map((w) => {
    const discovered = audioMap[w.slug ?? '']
    return {
      world: w,
      tracks: discovered && discovered.length > 0
        ? discovered.map((t) => ({ id: t.id, title: t.title, url: t.url as string | undefined, duration: undefined as string | undefined }))
        : buildPlaceholderTracks(w.title ?? 'Unknown'),
    }
  })
}

// ── Visual mode config ────────────────────────────────────────────────────────

const VISUAL_MODES: VisualMode[] = [
  'gallery_drift', 'video_temple', 'music_reactor',
  'fluid_oracle', 'particle_cosmos', 'mythmachine_shuffle',
]

const MODE_ICON: Record<VisualMode, string> = {
  gallery_drift:      '◈',
  video_temple:       '▶',
  music_reactor:      '♫',
  fluid_oracle:       '≋',
  particle_cosmos:    '✦',
  mythmachine_shuffle:'⟳',
}

const MODE_SHORT: Record<VisualMode, string> = {
  gallery_drift:      'Gallery',
  video_temple:       'Video',
  music_reactor:      'Music',
  fluid_oracle:       'Fluid',
  particle_cosmos:    'Cosmos',
  mythmachine_shuffle:'Shuffle',
}

type SeqEntry = { id: string; worldIdx: number; visualMode: VisualMode }

function mkId() { return Math.random().toString(36).slice(2, 9) }

const BG_CYCLE_MS = 4200

// ── Main component ────────────────────────────────────────────────────────────

export default function RealmsPlayer({ audioMap, sequenceMap = {}, imageMap = {}, compact, activeSlug }: RealmsPlayerProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const PLAYLISTS = useMemo(() => buildPlaylists(audioMap), [])

  // Sequencer — ordered list of realm entries, each with its own visual mode
  const [sequence, setSequence] = useState<SeqEntry[]>(() =>
    PLAYLISTS.map((_, i) => ({ id: mkId(), worldIdx: i, visualMode: 'gallery_drift' as VisualMode }))
  )
  const [seqIdx, setSeqIdx] = useState(0)

  // Drag-and-drop state
  const [dragFrom, setDragFrom]   = useState<number | null>(null)
  const [dragOver, setDragOver]   = useState<number | null>(null)

  // + Add dropdown
  const [showAddMenu, setShowAddMenu] = useState(false)
  const addMenuRef = useRef<HTMLDivElement>(null)

  // External realm activation (from Ascension Chamber card click)
  useEffect(() => {
    if (!activeSlug) return
    const idx = sequence.findIndex(e => PLAYLISTS[e.worldIdx].world.slug === activeSlug)
    if (idx >= 0 && idx !== seqIdx) { setSeqIdx(idx); setTrackIdx(0); setProgress(0) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug])

  // Player state
  const [trackIdx, setTrackIdx]       = useState(0)
  const [playing, setPlaying]         = useState(false)
  const [loop, setLoop]               = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [progress, setProgress]       = useState(0)
  const [mounted, setMounted]         = useState(false)
  const [bgColorIdx, setBgColorIdx]   = useState(0)
  const [secPerImage, setSecPerImage] = useState(10)

  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const t = setInterval(() => setBgColorIdx(i => (i + 1) % PLAYLISTS.length), BG_CYCLE_MS)
    return () => clearInterval(t)
  }, [PLAYLISTS.length])

  // Close add-menu on outside click
  useEffect(() => {
    if (!showAddMenu) return
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) setShowAddMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAddMenu])

  // Derived from sequencer
  const currentEntry   = sequence[seqIdx] ?? sequence[0]
  const worldIdx       = currentEntry?.worldIdx ?? 0
  const currentPlaylist = PLAYLISTS[worldIdx]
  const currentTrack   = currentPlaylist.tracks[trackIdx]
  const accent         = currentPlaylist.world.color_primary ?? '#c9973a'
  const bgAccent       = PLAYLISTS[bgColorIdx].world.color_primary ?? '#c9973a'

  const nextTrack = useCallback(() => {
    const lastTrack = trackIdx >= currentPlaylist.tracks.length - 1
    if (lastTrack) {
      if (loop) { setTrackIdx(0); setProgress(0) }
      else { setSeqIdx(s => (s + 1) % sequence.length); setTrackIdx(0); setProgress(0) }
    } else { setTrackIdx(t => t + 1); setProgress(0) }
  }, [trackIdx, loop, currentPlaylist.tracks.length, sequence.length])

  const prevTrack = () => {
    if (progress > 0.05) { setProgress(0); if (audioRef.current) audioRef.current.currentTime = 0; return }
    if (trackIdx > 0) { setTrackIdx(t => t - 1); setProgress(0) }
    else if (seqIdx > 0) {
      const prev = seqIdx - 1
      const prevWorld = sequence[prev].worldIdx
      setSeqIdx(prev)
      setTrackIdx(PLAYLISTS[prevWorld].tracks.length - 1)
      setProgress(0)
    }
  }

  const selectSeqEntry = (i: number) => { setSeqIdx(i); setTrackIdx(0); setProgress(0) }

  useEffect(() => {
    if (playing) {
      progressRef.current = setInterval(() => {
        if (audioRef.current?.duration) {
          setProgress(audioRef.current.currentTime / audioRef.current.duration)
        } else {
          setProgress(p => { if (p >= 1) { nextTrack(); return 0 } return p + 0.001 })
        }
      }, 300)
    } else {
      if (progressRef.current) clearInterval(progressRef.current)
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [playing, nextTrack])

  useEffect(() => {
    if (!audioRef.current || !currentTrack.url) return
    if (playing) audioRef.current.play().catch(() => setPlaying(false))
    else audioRef.current.pause()
  }, [playing, worldIdx, trackIdx, currentTrack.url])

  const togglePlay = () => setPlaying(p => !p)
  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setProgress(pct)
    if (audioRef.current?.duration) audioRef.current.currentTime = pct * audioRef.current.duration
  }

  // ── Drag-and-drop handlers ──────────────────────────────────────────────────

  const handleDragStart = (i: number) => (e: React.DragEvent) => {
    setDragFrom(i)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOver !== i) setDragOver(i)
  }
  const handleDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (dragFrom === null || dragFrom === i) { setDragFrom(null); setDragOver(null); return }
    const newSeq = [...sequence]
    const [moved] = newSeq.splice(dragFrom, 1)
    newSeq.splice(i, 0, moved)
    let newSeqIdx = seqIdx
    if (seqIdx === dragFrom) newSeqIdx = i
    else if (dragFrom < seqIdx && i >= seqIdx) newSeqIdx = seqIdx - 1
    else if (dragFrom > seqIdx && i <= seqIdx) newSeqIdx = seqIdx + 1
    setSequence(newSeq)
    setSeqIdx(newSeqIdx)
    setDragFrom(null); setDragOver(null)
  }
  const handleDragEnd = () => { setDragFrom(null); setDragOver(null) }

  // ── Sequencer mutations ─────────────────────────────────────────────────────

  const cycleMode = (seqId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setSequence(seq => seq.map(entry => {
      if (entry.id !== seqId) return entry
      const mi = VISUAL_MODES.indexOf(entry.visualMode)
      return { ...entry, visualMode: VISUAL_MODES[(mi + 1) % VISUAL_MODES.length] }
    }))
  }

  const removeEntry = (i: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (sequence.length <= 1) return
    setSequence(seq => seq.filter((_, idx) => idx !== i))
    if (seqIdx >= i && seqIdx > 0) setSeqIdx(s => s - 1)
  }

  const addToSequence = (wi: number) => {
    setSequence(seq => [...seq, { id: mkId(), worldIdx: wi, visualMode: 'gallery_drift' }])
    setShowAddMenu(false)
  }

  const shuffleSequence = () => {
    const shuffled = [...sequence]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setSequence(shuffled)
    setSeqIdx(0); setTrackIdx(0); setProgress(0)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#08060e' }}>

      {/* Audio element */}
      {currentTrack.url && <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} />}

      {/* Ambient bg color cycle */}
      {mounted && (
        <>
          <AnimatePresence mode="sync">
            <motion.div key={`bg-${bgColorIdx}`} className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2.5 }}
              style={{ background: `radial-gradient(ellipse at 70% 40%, ${bgAccent}28 0%, transparent 60%)` }}
            />
          </AnimatePresence>
          <AnimatePresence mode="sync">
            <motion.div key={`active-${worldIdx}`} className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
              style={{ background: `radial-gradient(ellipse at 30% 60%, ${accent}18 0%, transparent 55%)` }}
            />
          </AnimatePresence>
        </>
      )}

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Header ── */}
      <div className={`relative z-10 ${compact ? 'pt-3 pb-3' : 'pt-4 pb-5'} text-center px-6`}>
        {!compact && (
          <div className="flex items-center justify-between mb-3">
            <Link href="/home2" className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.82)' }}>
              ← Home
            </Link>
            <Link href="/ascension" className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #8a6020, #c9973a 40%, #f0c84a 60%, #c9973a 80%, #8a6020)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(201,151,58,0.35))',
              }}>
              Ascension Chamber
            </Link>
          </div>
        )}
        {!compact && (
          <>
            <h1
              className="font-cinzel font-bold tracking-widest leading-none text-3xl md:text-4xl mb-2"
              style={{
                background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              Realms
            </h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.82)' }}>
              Choose a realm · Music plays continuously across all worlds
            </p>
          </>
        )}
      </div>

      {/* ── Imagery band ── */}
      <div className="relative z-10 w-full" style={{ aspectRatio: '21/7', minHeight: 240 }}>

        {/* Imagery: Ken Burns gallery → gradient fallback */}
        {(() => {
          const slug = currentPlaylist.world.slug ?? ''
          const galleryImgs = imageMap[slug] ?? []
          if (galleryImgs.length > 0) return (
            <div className="absolute inset-0">
              <KenBurnsSlideshow key={slug} images={galleryImgs} secPerImage={secPerImage} className="absolute inset-0" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 55%, #08060e 100%)' }} />
            </div>
          )
          return (
            <AnimatePresence mode="sync">
              <motion.div key={`img-${worldIdx}`} className="absolute inset-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
                style={{ background: `linear-gradient(160deg, ${accent}35 0%, #08060e 50%, ${accent}12 100%)` }}
              />
            </AnimatePresence>
          )
        })()}

        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: `${accent}50` }} />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: `${accent}50` }} />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: `${accent}50` }} />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: `${accent}50` }} />


        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #08060e, transparent)' }}
        />

        {/* Slide duration slider — bottom right */}
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2 select-none"
          style={{ opacity: 0.7 }}>
          <span className="text-[8px] tracking-widest uppercase" style={{ color: accent }}>Speed</span>
          <input
            type="range" min={5} max={30} step={1} value={secPerImage}
            onChange={e => setSecPerImage(Number(e.target.value))}
            className="w-20 h-1 cursor-pointer appearance-none rounded-full"
            style={{ accentColor: accent }}
          />
          <span className="text-[8px] font-mono" style={{ color: accent, minWidth: 24 }}>{secPerImage}s</span>
        </div>
      </div>

      {/* ── SEQUENCER ── */}
      <div className="relative z-10 px-4 pt-3 pb-1 border-t" style={{ borderColor: `${accent}18` }}>

        {/* Sequencer header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-[0.4em] uppercase font-semibold" style={{ color: `${accent}80` }}>
              Sequence
            </span>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {sequence.length} realm{sequence.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.75)' }}>· drag to reorder</span>
          </div>
          <button
            onClick={shuffleSequence}
            className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border transition-all hover:border-white/40 hover:text-white/70"
            style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.45)' }}
          >
            ⟳ Shuffle
          </button>
        </div>

        {/* Sequencer chips — multi-row wrapping */}
        <div className="flex flex-wrap gap-1.5 pb-3">
          {sequence.map((entry, i) => {
            const pl        = PLAYLISTS[entry.worldIdx]
            const wAccent   = pl.world.color_primary ?? '#c9973a'
            const isActive  = i === seqIdx
            const isDragging   = dragFrom === i
            const isDragTarget = dragOver === i && dragFrom !== null && dragFrom !== i

            return (
              <div
                key={entry.id}
                draggable
                onDragStart={handleDragStart(i)}
                onDragOver={handleDragOver(i)}
                onDrop={handleDrop(i)}
                onDragEnd={handleDragEnd}
                onClick={() => selectSeqEntry(i)}
                className="relative flex items-stretch rounded-lg overflow-hidden cursor-pointer group select-none transition-all duration-150"
                style={{
                  border: `1px solid ${isActive ? wAccent + '80' : isDragTarget ? wAccent + '50' : 'rgba(255,255,255,0.13)'}`,
                  background: isActive
                    ? `${wAccent}1a`
                    : isDragTarget
                      ? 'rgba(255,255,255,0.07)'
                      : 'rgba(255,255,255,0.04)',
                  opacity: isDragging ? 0.4 : 1,
                  boxShadow: isActive ? `0 0 14px ${wAccent}22` : 'none',
                  transform: isDragTarget ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                {/* Drag handle */}
                <div
                  className="flex items-center px-1 text-[10px] cursor-grab active:cursor-grabbing shrink-0"
                  style={{ color: 'rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
                >
                  ⠿
                </div>

                {/* Single-line: number + title + playing indicator */}
                <div className="flex items-center gap-1 px-1.5 py-1 min-w-0">
                  <span className="text-[7px] shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>{i + 1}</span>
                  <span
                    className="text-[9px] font-semibold tracking-wide whitespace-nowrap font-cinzel"
                    style={{ color: isActive ? wAccent : 'rgba(255,255,255,0.78)' }}
                  >
                    {pl.world.title}
                  </span>
                  {isActive && playing && (
                    <span className="inline-flex gap-0.5 items-end ml-0.5 shrink-0">
                      {[0, 1, 2].map(j => (
                        <motion.span key={j} className="inline-block w-0.5 rounded-full"
                          style={{ background: wAccent, height: 6 }}
                          animate={{ scaleY: [1, 1.8, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                        />
                      ))}
                    </span>
                  )}
                </div>

                {/* Remove button — appears on hover */}
                {sequence.length > 1 && (
                  <button
                    onClick={removeEntry(i)}
                    className="hidden group-hover:flex items-center px-1 text-[9px] transition-colors hover:text-red-400 shrink-0"
                    style={{ color: 'rgba(255,255,255,0.28)', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
                    title="Remove from sequence"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}

          {/* + Add realm button */}
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setShowAddMenu(v => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] tracking-widest uppercase border transition-all hover:border-white/30 hover:text-white/60"
              style={{
                borderColor: showAddMenu ? `${accent}50` : 'rgba(255,255,255,0.14)',
                color: showAddMenu ? accent : 'rgba(255,255,255,0.38)',
                background: showAddMenu ? `${accent}12` : 'rgba(255,255,255,0.03)',
              }}
            >
              + Add
            </button>

            {/* Dropdown */}
            {showAddMenu && (
              <div
                className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-y-auto border"
                style={{
                  background: 'rgba(8,6,14,0.98)',
                  borderColor: 'rgba(255,255,255,0.14)',
                  minWidth: 170,
                  maxHeight: 280,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <p className="px-3 pt-2 pb-1 text-[8px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Add to sequence
                </p>
                {PLAYLISTS.map((pl, wi) => (
                  <button
                    key={pl.world.id}
                    onClick={() => addToSequence(wi)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/6"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: pl.world.color_primary ?? '#c9973a' }}
                    />
                    <span className="font-cinzel text-[10px] font-semibold" style={{ color: pl.world.color_primary ?? '#c9973a' }}>
                      {pl.world.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Player controls strip ── */}
      <div className="relative z-10 border-t px-6 pb-6"
        style={{ borderColor: `${accent}18`, background: 'rgba(8,6,14,0.6)', backdropFilter: 'blur(12px)' }}
      >
        {/* Progress bar */}
        <div className="w-full h-0.5 rounded-full cursor-pointer overflow-hidden mt-4 mb-4"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          onClick={seekTo}
        >
          <motion.div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: accent }} transition={{ duration: 0.3 }} />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Playback */}
          <div className="flex items-center gap-3">
            <button onClick={prevTrack} className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }} title="Previous">⏮</button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: `${accent}28`, border: `1px solid ${accent}60`, color: accent, fontSize: 16 }}
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button onClick={nextTrack} className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }} title="Next">⏭</button>
          </div>

          {/* Track info */}
          <div className="flex-1 text-center min-w-0 hidden sm:block">
            <p className="text-[11px] tracking-wide truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {currentTrack.title}
              {currentTrack.duration && <span className="ml-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{currentTrack.duration}</span>}
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLoop(l => !l)}
              className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border transition-all"
              style={{
                borderColor: loop ? `${accent}70` : 'rgba(255,255,255,0.3)',
                color: loop ? accent : 'rgba(255,255,255,0.78)',
                background: loop ? `${accent}15` : 'transparent',
              }}
            >↻ Loop</button>
            <button
              onClick={() => setShowPlaylist(s => !s)}
              className="text-[10px] tracking-widest uppercase transition-colors"
              style={{ color: showPlaylist ? accent : 'rgba(255,255,255,0.78)' }}
            >≡ Tracks</button>
          </div>
        </div>
      </div>

      {/* ── Playlist panel (slide-up) ── */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl overflow-hidden"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ background: 'rgba(8,6,14,0.97)', backdropFilter: 'blur(20px)', border: `1px solid ${accent}25`, maxHeight: 480 }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b sticky top-0"
              style={{ borderColor: `${accent}20`, background: 'rgba(8,6,14,0.99)' }}>
              <div>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: `${accent}70` }}>Now Playing</p>
                <p className="font-cinzel text-sm font-bold" style={{ color: accent }}>{currentPlaylist.world.title}</p>
              </div>
              <button onClick={() => setShowPlaylist(false)} className="text-white/30 hover:text-white text-lg w-8 h-8 flex items-center justify-center">↓</button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
              {currentPlaylist.tracks.map((track, i) => {
                const isActive = i === trackIdx
                return (
                  <button key={track.id} onClick={() => { setTrackIdx(i); setProgress(0) }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all hover:bg-white/4"
                    style={{ background: isActive ? `${accent}12` : undefined }}>
                    <div className="w-5 text-center shrink-0">
                      {isActive && playing ? (
                        <span className="inline-flex gap-0.5 items-end">
                          {[0, 1, 2].map(j => (
                            <motion.span key={j} className="inline-block w-0.5 rounded-full"
                              style={{ background: accent, height: 10 }}
                              animate={{ scaleY: [1, 1.8, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                            />
                          ))}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: isActive ? accent : 'rgba(255,255,255,0.55)' }}>{i + 1}</span>
                      )}
                    </div>
                    <p className="flex-1 text-sm truncate" style={{ color: isActive ? accent : 'rgba(255,255,255,0.85)' }}>{track.title}</p>
                    {track.duration && <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }}>{track.duration}</span>}
                    {!track.url && <span className="text-[9px] tracking-widest uppercase shrink-0" style={{ color: `${accent}70` }}>Soon</span>}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
