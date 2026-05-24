'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { featuredWorlds } from '@/lib/data/worlds'

export interface DiscoveredTrack {
  id: string
  title: string
  url: string
}

interface RealmsPlayerProps {
  audioMap?: Record<string, DiscoveredTrack[]>
  compact?: boolean
}

function buildPlaceholderTracks(title: string) {
  return [
    { id: '1', title: `${title} — Opening Theme`, duration: '4:22', url: undefined as string | undefined },
    { id: '2', title: `${title} — The Descent`, duration: '5:47', url: undefined as string | undefined },
    { id: '3', title: `${title} — Sacred Geometry`, duration: '6:14', url: undefined as string | undefined },
    { id: '4', title: `${title} — Convergence`, duration: '3:58', url: undefined as string | undefined },
    { id: '5', title: `${title} — Infinite Horizon`, duration: '7:03', url: undefined as string | undefined },
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

const BG_CYCLE_MS = 4200

export default function RealmsPlayer({ audioMap, compact }: RealmsPlayerProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const PLAYLISTS = useMemo(() => buildPlaylists(audioMap), [])

  const [worldIdx, setWorldIdx] = useState(0)
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [bgColorIdx, setBgColorIdx] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tabsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const t = setInterval(() => setBgColorIdx((i) => (i + 1) % PLAYLISTS.length), BG_CYCLE_MS)
    return () => clearInterval(t)
  }, [PLAYLISTS.length])

  const currentPlaylist = PLAYLISTS[worldIdx]
  const currentTrack = currentPlaylist.tracks[trackIdx]
  const accent = currentPlaylist.world.color_primary ?? '#c9973a'
  const bgAccent = PLAYLISTS[bgColorIdx].world.color_primary ?? '#c9973a'

  const nextTrack = useCallback(() => {
    const lastTrack = trackIdx >= currentPlaylist.tracks.length - 1
    if (lastTrack) {
      if (loop) { setTrackIdx(0); setProgress(0) }
      else { setWorldIdx((w) => (w + 1) % PLAYLISTS.length); setTrackIdx(0); setProgress(0) }
    } else { setTrackIdx((t) => t + 1); setProgress(0) }
  }, [trackIdx, worldIdx, loop, currentPlaylist.tracks.length, PLAYLISTS.length])

  const prevTrack = () => {
    if (progress > 0.05) { setProgress(0); if (audioRef.current) audioRef.current.currentTime = 0; return }
    if (trackIdx > 0) { setTrackIdx((t) => t - 1); setProgress(0) }
    else if (worldIdx > 0) {
      const prev = worldIdx - 1
      setWorldIdx(prev)
      setTrackIdx(PLAYLISTS[prev].tracks.length - 1)
      setProgress(0)
    }
  }

  const selectWorld = (i: number) => {
    setWorldIdx(i); setTrackIdx(0); setProgress(0)
    setTimeout(() => {
      tabsRef.current?.children[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }, 50)
  }

  useEffect(() => {
    if (playing) {
      progressRef.current = setInterval(() => {
        if (audioRef.current?.duration) {
          setProgress(audioRef.current.currentTime / audioRef.current.duration)
        } else {
          setProgress((p) => { if (p >= 1) { nextTrack(); return 0 } return p + 0.001 })
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

  const togglePlay = () => setPlaying((p) => !p)

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setProgress(pct)
    if (audioRef.current?.duration) audioRef.current.currentTime = pct * audioRef.current.duration
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#08060e' }}>

      {/* Audio element */}
      {currentTrack.url && <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} />}

      {/* ── Ambient bg color cycle ── */}
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

      {/* ── HEADER — centered, like DomeShows ── */}
      <div className={`relative z-10 ${compact ? 'pt-3 pb-3' : 'pt-8 pb-5'} text-center px-6`}>
        {!compact && (
          <>
            {/* Back link top-left */}
            <div className="absolute left-6 top-8">
              <Link href="/" className="text-[9px] tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors">← Home</Link>
            </div>
            {/* Ascension Chamber top-right */}
            <div className="absolute right-6 top-8">
              <Link href="/screensaver" className="text-[9px] tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors">Ascension Chamber</Link>
            </div>
            <p className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: `${accent}90` }}>The Arcanum</p>
          </>
        )}
        <h1
          className={`font-cinzel font-bold tracking-widest leading-none ${compact ? 'text-2xl mb-1' : 'text-3xl md:text-4xl mb-2'}`}
          style={{
            background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Realms
        </h1>
        <p className="text-white/70 text-xs">
          Choose a realm · Music plays continuously across all worlds
        </p>
      </div>

      {/* ── IMAGERY BAND — full width, realm color cycling ── */}
      <div className="relative z-10 w-full" style={{ aspectRatio: '21/7', minHeight: 240 }}>
        {/* Realm color gradient as the "image" until real images are dropped */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`img-${worldIdx}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              background: `linear-gradient(160deg, ${accent}35 0%, #08060e 50%, ${accent}12 100%)`,
            }}
          />
        </AnimatePresence>

        {/* Corner brackets — cinematic frame */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: `${accent}50` }} />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: `${accent}50` }} />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: `${accent}50` }} />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: `${accent}50` }} />

        {/* Realm name + track — centered overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <AnimatePresence mode="wait">
            <motion.div key={worldIdx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <p className="text-[9px] tracking-[0.45em] uppercase" style={{ color: `${accent}60` }}>
                {currentPlaylist.world.theme_style}
              </p>
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest" style={{ color: accent }}>
                {currentPlaylist.world.title}
              </h2>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p key={`${worldIdx}-${trackIdx}`}
              className="text-white/40 text-xs tracking-wide mt-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            >
              {currentTrack.title}
              {currentTrack.duration && <span className="text-white/20 ml-2">{currentTrack.duration}</span>}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #08060e, transparent)' }}
        />
      </div>

      {/* ── Realm tab chips — below image ── */}
      <div className="relative z-10 flex justify-center px-4 py-3">
        <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-none max-w-full pb-1">
          {PLAYLISTS.map((pl, i) => {
            const isActive = i === worldIdx
            const wAccent = pl.world.color_primary ?? '#c9973a'
            return (
              <button
                key={pl.world.id}
                onClick={() => selectWorld(i)}
                className="shrink-0 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase whitespace-nowrap transition-all duration-200 border"
                style={{
                  borderColor: isActive ? wAccent : 'rgba(255,255,255,0.1)',
                  color: isActive ? wAccent : 'rgba(255,255,255,0.3)',
                  background: isActive ? `${wAccent}18` : 'transparent',
                }}
              >
                {pl.world.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Player controls strip ── */}
      <div className="relative z-10 border-t px-6 pb-6"
        style={{ borderColor: `${accent}18`, background: 'rgba(8,6,14,0.6)', backdropFilter: 'blur(12px)' }}
      >
        {/* Progress bar */}
        <div className="w-full h-0.5 rounded-full bg-white/8 cursor-pointer overflow-hidden mt-4 mb-4"
          onClick={seekTo}
        >
          <motion.div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: accent }} transition={{ duration: 0.3 }} />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Playback */}
          <div className="flex items-center gap-3">
            <button onClick={prevTrack} className="text-white/35 hover:text-white transition-colors" title="Previous">⏮</button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: `${accent}28`, border: `1px solid ${accent}60`, color: accent, fontSize: 16 }}
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button onClick={nextTrack} className="text-white/35 hover:text-white transition-colors" title="Next">⏭</button>
          </div>

          {/* Track info */}
          <div className="flex-1 text-center min-w-0 hidden sm:block">
            <p className="text-white/40 text-[11px] tracking-wide truncate">
              {currentTrack.title}
              <span className="text-white/20 ml-2">{currentTrack.duration}</span>
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLoop((l) => !l)}
              className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border transition-all"
              style={{
                borderColor: loop ? `${accent}60` : 'rgba(255,255,255,0.12)',
                color: loop ? accent : 'rgba(255,255,255,0.28)',
                background: loop ? `${accent}15` : 'transparent',
              }}
            >↻ Loop</button>
            <button
              onClick={() => setShowPlaylist((s) => !s)}
              className="text-[10px] tracking-widest uppercase transition-colors"
              style={{ color: showPlaylist ? accent : 'rgba(255,255,255,0.28)' }}
            >≡ Tracks</button>
          </div>
        </div>
      </div>

      {/* ── Playlist panel ── */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl overflow-hidden"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ background: 'rgba(8,6,14,0.97)', backdropFilter: 'blur(20px)', border: `1px solid ${accent}25`, maxHeight: '60%' }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b sticky top-0"
              style={{ borderColor: `${accent}20`, background: 'rgba(8,6,14,0.99)' }}
            >
              <div>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: `${accent}70` }}>Now Playing</p>
                <p className="font-cinzel text-sm font-bold" style={{ color: accent }}>{currentPlaylist.world.title}</p>
              </div>
              <button onClick={() => setShowPlaylist(false)} className="text-white/30 hover:text-white text-lg w-8 h-8 flex items-center justify-center">↓</button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 60px)' }}>
              {currentPlaylist.tracks.map((track, i) => {
                const isActive = i === trackIdx
                return (
                  <button key={track.id} onClick={() => { setTrackIdx(i); setProgress(0) }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all hover:bg-white/4"
                    style={{ background: isActive ? `${accent}12` : undefined }}
                  >
                    <div className="w-5 text-center shrink-0">
                      {isActive && playing ? (
                        <span className="inline-flex gap-0.5 items-end">
                          {[0, 1, 2].map((j) => (
                            <motion.span key={j} className="inline-block w-0.5 rounded-full"
                              style={{ background: accent, height: 10 }}
                              animate={{ scaleY: [1, 1.8, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                            />
                          ))}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: isActive ? accent : 'rgba(255,255,255,0.25)' }}>{i + 1}</span>
                      )}
                    </div>
                    <p className="flex-1 text-sm truncate" style={{ color: isActive ? accent : 'rgba(255,255,255,0.6)' }}>{track.title}</p>
                    {track.duration && <span className="text-xs text-white/25 shrink-0">{track.duration}</span>}
                    {!track.url && <span className="text-[9px] tracking-widest uppercase shrink-0" style={{ color: `${accent}40` }}>Soon</span>}
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
