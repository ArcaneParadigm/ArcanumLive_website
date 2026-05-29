'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AudioTrack {
  id: string
  title: string
  duration?: string
  url?: string // real URL when available
}

interface WorldAudioPlayerProps {
  tracks: AudioTrack[]
  accentColor: string
  worldTitle: string
  autoPlay?: boolean
}

export default function WorldAudioPlayer({
  tracks,
  accentColor,
  worldTitle,
  autoPlay = false,
}: WorldAudioPlayerProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const didAutoPlay = useRef(false)

  const activeTrack = tracks[activeIdx]

  // Autoplay on first mount if a real URL exists
  useEffect(() => {
    if (!autoPlay || didAutoPlay.current || !audioRef.current || !activeTrack.url) return
    didAutoPlay.current = true
    audioRef.current.play().catch(() => setPlaying(false))
  }, [autoPlay, activeTrack.url])

  // When track changes or play state changes, sync audio element
  useEffect(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [playing, activeIdx])

  useEffect(() => {
    if (playing) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const pct = audioRef.current.currentTime / (audioRef.current.duration || 1)
          setProgress(isNaN(pct) ? 0 : pct)
        }
      }, 250)
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
    return () => { if (progressInterval.current) clearInterval(progressInterval.current) }
  }, [playing])

  const selectTrack = (i: number) => {
    setActiveIdx(i)
    setProgress(0)
    setPlaying(true)
  }

  const togglePlay = () => setPlaying((p) => !p)

  const nextTrack = () => selectTrack((activeIdx + 1) % tracks.length)
  const prevTrack = () => selectTrack((activeIdx - 1 + tracks.length) % tracks.length)

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: `${accentColor}30`,
        background: `linear-gradient(160deg, ${accentColor}10 0%, #08060e 100%)`,
        boxShadow: `0 0 0 1px ${accentColor}18`,
      }}
    >
      {/* Hidden audio element */}
      {activeTrack.url && (
        <audio
          ref={audioRef}
          src={activeTrack.url}
          onEnded={nextTrack}
        />
      )}

      {/* Now playing bar */}
      <div className="px-5 py-4 border-b" style={{ borderColor: `${accentColor}20` }}>
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110"
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}50`,
              color: accentColor,
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-sm font-medium truncate">{activeTrack.title}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{worldTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={prevTrack} className="hover:text-white transition-colors text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>⏮</button>
            <button onClick={nextTrack} className="hover:text-white transition-colors text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>⏭</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-0.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: accentColor, width: `${progress * 100}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>

      {/* Track list — scrollable for 13+ tracks */}
      <div className="divide-y overflow-y-auto" style={{ borderColor: `${accentColor}15`, maxHeight: 420 }}>
        {tracks.map((track, i) => {
          const isActive = i === activeIdx
          return (
            <button
              key={track.id}
              onClick={() => selectTrack(i)}
              className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 hover:bg-white/4 group"
              style={{ background: isActive ? `${accentColor}12` : undefined }}
            >
              {/* Track number / playing indicator */}
              <div className="w-5 text-center shrink-0">
                {isActive && playing ? (
                  <span className="inline-flex gap-0.5">
                    {[0, 1, 2].map((j) => (
                      <motion.span
                        key={j}
                        className="inline-block w-0.5 rounded-full"
                        style={{ background: accentColor, height: 10 }}
                        animate={{ scaleY: [1, 1.8, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                      />
                    ))}
                  </span>
                ) : (
                  <span
                    className="text-xs"
                    style={{ color: isActive ? accentColor : 'rgba(255,255,255,0.65)' }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm truncate transition-colors"
                  style={{ color: isActive ? accentColor : 'rgba(255,255,255,0.65)' }}
                >
                  {track.title}
                </p>
              </div>

              {track.duration && (
                <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }}>{track.duration}</span>
              )}

              {!track.url && (
                <span className="text-[9px] tracking-widest uppercase shrink-0" style={{ color: `${accentColor}75` }}>
                  Soon
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
