'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface StoryFrame {
  id: string
  imageSrc?: string       // storyboard image
  storyText: string       // narration shown below image
  lyricLines?: string[]   // song lyrics shown over image (top right)
  durationMs: number      // how long to show this frame
}

export interface StoryGalleryProps {
  frames: StoryFrame[]
  audioSrc?: string       // song URL — plays with story
  title?: string
  accentColor?: string
  aspectRatio?: string
  autoPlay?: boolean
}

export default function StoryGallery({
  frames,
  audioSrc,
  title,
  accentColor = '#c9973a',
  aspectRatio = '16/9',
  autoPlay = false,
}: StoryGalleryProps) {
  const [playing, setPlaying] = useState(autoPlay)
  const [frameIdx, setFrameIdx] = useState(0)
  const [lyricIdx, setLyricIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const currentFrame = frames[frameIdx]

  // Main playback tick
  useEffect(() => {
    if (!playing || !mounted) {
      if (tickRef.current) clearInterval(tickRef.current)
      return
    }
    tickRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 100
        if (next >= currentFrame.durationMs) {
          // advance frame
          setFrameIdx((fi) => {
            const nextFi = fi + 1
            if (nextFi >= frames.length) {
              setPlaying(false)
              return fi
            }
            return nextFi
          })
          setLyricIdx(0)
          return 0
        }
        return next
      })
    }, 100)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [playing, frameIdx, currentFrame.durationMs, frames.length, mounted])

  // Lyric cycling — each lyric line shows for durationMs / lyricLines.length
  useEffect(() => {
    const lines = currentFrame.lyricLines ?? []
    if (lines.length <= 1) return
    const perLine = currentFrame.durationMs / lines.length
    const newIdx = Math.min(Math.floor(elapsed / perLine), lines.length - 1)
    setLyricIdx(newIdx)
  }, [elapsed, currentFrame])

  // Sync audio
  useEffect(() => {
    if (!audioRef.current) return
    if (playing) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }, [playing])

  const togglePlay = () => {
    if (frameIdx >= frames.length - 1 && elapsed >= currentFrame.durationMs - 100) {
      // restart
      setFrameIdx(0)
      setElapsed(0)
      setLyricIdx(0)
      if (audioRef.current) audioRef.current.currentTime = 0
    }
    setPlaying((p) => !p)
  }

  const progress = elapsed / currentFrame.durationMs

  if (!mounted) return null

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: `${accentColor}25` }}
    >
      {/* Audio */}
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} />
      )}

      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b text-xs"
        style={{ borderColor: `${accentColor}20`, background: 'rgba(8,6,14,0.8)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: `${accentColor}25`, border: `1px solid ${accentColor}50`, color: accentColor }}
          >
            {playing ? '⏸' : '▶'}
          </button>
          {title && (
            <span className="tracking-widest uppercase" style={{ color: `${accentColor}70` }}>
              {title}
            </span>
          )}
        </div>
        <span className="text-white/30">
          {frameIdx + 1} / {frames.length}
        </span>
      </div>

      {/* Main frame */}
      <div className="relative" style={{ aspectRatio }}>
        {/* Background / image */}
        <AnimatePresence mode="sync">
          {currentFrame.imageSrc ? (
            <motion.img
              key={currentFrame.id}
              src={currentFrame.imageSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            />
          ) : (
            <motion.div
              key={currentFrame.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: `radial-gradient(ellipse at ${(frameIdx % 3) * 33 + 17}% 40%, ${accentColor}20 0%, #08060e 75%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* ── LYRICS — top right animated ── */}
        <div className="absolute top-4 right-4 max-w-[45%] text-right">
          <AnimatePresence mode="wait">
            {currentFrame.lyricLines?.[lyricIdx] && (
              <motion.p
                key={`${frameIdx}-${lyricIdx}`}
                className="font-cinzel text-sm md:text-base leading-relaxed"
                style={{
                  color: accentColor,
                  textShadow: `0 0 12px ${accentColor}80, 0 2px 4px rgba(0,0,0,0.9)`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5 }}
              >
                {currentFrame.lyricLines[lyricIdx]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Frame number */}
        <div
          className="absolute top-4 left-4 text-[10px] tracking-widest uppercase"
          style={{ color: `${accentColor}50` }}
        >
          Frame {frameIdx + 1}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full transition-none"
            style={{ width: `${progress * 100}%`, background: accentColor }}
          />
        </div>
      </div>

      {/* ── STORY TEXT — below image ── */}
      <div
        className="px-5 py-4 border-t min-h-[4.5rem] flex items-center"
        style={{ borderColor: `${accentColor}15`, background: 'rgba(8,6,14,0.9)' }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentFrame.id}
            className="text-silver-mid/70 text-sm leading-relaxed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {currentFrame.storyText}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Frame thumbnails */}
      <div
        className="flex gap-1.5 px-4 py-2.5 overflow-x-auto border-t"
        style={{ borderColor: `${accentColor}15`, background: 'rgba(8,6,14,0.95)' }}
      >
        {frames.map((frame, i) => (
          <button
            key={frame.id}
            onClick={() => { setFrameIdx(i); setElapsed(0); setLyricIdx(0) }}
            className="shrink-0 rounded overflow-hidden transition-all"
            style={{
              width: 52,
              height: 34,
              border: i === frameIdx ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
              opacity: i === frameIdx ? 1 : 0.4,
              background: frame.imageSrc ? undefined : `${accentColor}12`,
            }}
          >
            {frame.imageSrc ? (
              <img src={frame.imageSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[8px]" style={{ color: `${accentColor}50` }}>{i + 1}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
