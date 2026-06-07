'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AstrolabeTrack } from '@/lib/hooks/useAstrolabeAudio'

const GOLD = '#c9973a'
const BG   = 'rgba(8,6,14,0.88)'

interface Props {
  // Ring controls
  speedMult: number
  pulseMult: number
  glowStrength: number
  beatSensitivity: number
  onSpeed: (v: number) => void
  onPulse: (v: number) => void
  onGlow: (v: number) => void
  onBeatSensitivity: (v: number) => void
  // Audio
  playing: boolean
  volume: number
  currentTrack: AstrolabeTrack | null
  trackIdx: number
  tracks: AstrolabeTrack[]
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onVolume: (v: number) => void
}

function Slider({ label, value, min, max, step = 0.01, onChange }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
        <span className="text-[9px] font-mono" style={{ color: GOLD }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${GOLD} 0%, ${GOLD} ${((value-min)/(max-min))*100}%, rgba(255,255,255,0.12) ${((value-min)/(max-min))*100}%, rgba(255,255,255,0.12) 100%)`,
          accentColor: GOLD,
        }}
      />
    </div>
  )
}

export default function AstrolabeControls({
  speedMult, pulseMult, glowStrength, beatSensitivity,
  onSpeed, onPulse, onGlow, onBeatSensitivity,
  playing, volume, currentTrack, trackIdx, tracks,
  onPlay, onPause, onNext, onPrev, onVolume,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-4 right-4 z-30 select-none">
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] tracking-[0.25em] uppercase font-medium"
        style={{
          background: open ? `${GOLD}20` : 'rgba(8,6,14,0.7)',
          border: `1px solid ${open ? GOLD : 'rgba(201,151,58,0.3)'}`,
          color: GOLD,
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <span style={{ fontSize: 10 }}>⚙</span> Controls
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-10 right-0 w-64 rounded-xl p-4 flex flex-col gap-3"
            style={{
              background: BG,
              border: `1px solid ${GOLD}25`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 30px ${GOLD}10`,
            }}
          >
            {/* Header */}
            <p className="text-[8px] tracking-[0.4em] uppercase text-center" style={{ color: `${GOLD}80` }}>
              Astrolabe Controls
            </p>

            {/* Ring controls */}
            <div className="flex flex-col gap-2.5">
              <Slider label="Ring Speed" value={speedMult} min={0} max={4} onChange={onSpeed} />
              <Slider label="Pulse Intensity" value={pulseMult} min={0} max={3} onChange={onPulse} />
              <Slider label="Glow Strength" value={glowStrength} min={0.2} max={4} onChange={onGlow} />
              <Slider label="Beat Sensitivity" value={beatSensitivity} min={0.8} max={2.5} step={0.05} onChange={onBeatSensitivity} />
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: `${GOLD}20` }} />

            {/* Music player */}
            <div className="flex flex-col gap-2">
              <p className="text-[8px] tracking-[0.4em] uppercase text-center" style={{ color: `${GOLD}80` }}>
                Music
              </p>

              {currentTrack && (
                <p className="text-[9px] text-center truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {currentTrack.title}
                </p>
              )}

              {/* Transport */}
              <div className="flex items-center justify-center gap-3">
                <button onClick={onPrev}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: `1px solid ${GOLD}40`, color: GOLD }}
                >⏮</button>
                <button
                  onClick={playing ? onPause : onPlay}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: `${GOLD}25`,
                    border: `1px solid ${GOLD}`,
                    color: GOLD,
                    fontSize: 14,
                    boxShadow: playing ? `0 0 12px ${GOLD}60` : 'none',
                  }}
                >
                  {playing ? '⏸' : '▶'}
                </button>
                <button onClick={onNext}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: `1px solid ${GOLD}40`, color: GOLD }}
                >⏭</button>
              </div>

              {/* Volume */}
              <Slider label="Volume" value={volume} min={0} max={1} onChange={onVolume} />

              {/* Track list */}
              {tracks.length > 0 && (
                <div className="flex flex-col gap-0.5 max-h-28 overflow-y-auto">
                  {tracks.map((t, i) => (
                    <button key={i}
                      className="text-left text-[8px] px-2 py-1 rounded truncate transition-colors"
                      style={{
                        color: i === trackIdx ? GOLD : 'rgba(255,255,255,0.5)',
                        background: i === trackIdx ? `${GOLD}15` : 'transparent',
                      }}
                    >
                      {i === trackIdx && '▶ '}{t.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
