'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { setHoverVolumeMultiplier, getHoverVolumeMultiplier } from '@/lib/utils/crystalSound'

const GOLD = '#c9973a'
const LS_KEY = 'arcanum_dev_hover_vol'

export default function DevControls() {
  const [open, setOpen] = useState(false)
  const [hoverVol, setHoverVol] = useState(1.0)

  // Load persisted value on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    const v = saved !== null ? parseFloat(saved) : 1.0
    setHoverVol(v)
    setHoverVolumeMultiplier(v)
  }, [])

  function handleVolChange(v: number) {
    setHoverVol(v)
    setHoverVolumeMultiplier(v)
    localStorage.setItem(LS_KEY, String(v))
  }

  const pct = Math.round(hoverVol * 100)

  return (
    <div className="fixed bottom-5 right-5 z-[9999] select-none">
      {/* Gear button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-base cursor-pointer"
        style={{
          background: open ? `${GOLD}30` : 'rgba(10,7,18,0.85)',
          border: `1px solid ${open ? GOLD + '70' : GOLD + '30'}`,
          color: open ? GOLD : `${GOLD}80`,
          backdropFilter: 'blur(8px)',
          boxShadow: open ? `0 0 16px ${GOLD}30` : '0 2px 12px rgba(0,0,0,0.6)',
        }}
        whileHover={{ scale: 1.08, borderColor: `${GOLD}70` }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.15 }}
        title="Dev Controls"
      >
        ⚙
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-11 right-0 w-72 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(16,10,26,0.98) 0%, rgba(8,6,14,0.99) 100%)',
              border: `1px solid ${GOLD}40`,
              boxShadow: `0 8px 40px rgba(0,0,0,0.8), inset 0 1px 0 ${GOLD}20`,
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${GOLD}20` }}>
              <div>
                <p className="font-cinzel text-[11px] font-bold tracking-widest" style={{ color: GOLD }}>Dev Controls</p>
                <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Arcanum · Internal</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            </div>

            {/* Controls */}
            <div className="px-4 py-4 flex flex-col gap-5">

              {/* Hover tone volume */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] tracking-widest uppercase font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Hover Tone Volume
                  </label>
                  <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: GOLD }}>
                    {pct}%
                  </span>
                </div>

                {/* Slider track */}
                <div className="relative h-6 flex items-center">
                  <div className="absolute inset-x-0 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="absolute left-0 h-1.5 rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${GOLD}80, ${GOLD})` }} />
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.01}
                    value={hoverVol}
                    onChange={e => handleVolChange(parseFloat(e.target.value))}
                    className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-6"
                    style={{ zIndex: 10 }}
                  />
                  {/* Thumb */}
                  <div
                    className="absolute w-4 h-4 rounded-full pointer-events-none"
                    style={{
                      left: `calc(${pct / 2}% - 8px)`,
                      background: GOLD,
                      boxShadow: `0 0 8px ${GOLD}80`,
                      border: '2px solid rgba(255,255,255,0.9)',
                    }}
                  />
                </div>

                {/* Tick labels */}
                <div className="flex justify-between mt-1">
                  {['0%', '50%', '100%', '150%', '200%'].map(l => (
                    <span key={l} className="text-[8px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</span>
                  ))}
                </div>

                {/* Quick presets */}
                <div className="flex gap-2 mt-3">
                  {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <button
                      key={v}
                      onClick={() => handleVolChange(v)}
                      className="flex-1 py-1 rounded text-[9px] tracking-widest uppercase transition-all"
                      style={{
                        background: Math.abs(hoverVol - v) < 0.02 ? `${GOLD}25` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${Math.abs(hoverVol - v) < 0.02 ? GOLD + '60' : 'rgba(255,255,255,0.12)'}`,
                        color: Math.abs(hoverVol - v) < 0.02 ? GOLD : 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {v === 0 ? 'Off' : `${Math.round(v * 100)}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}25, transparent)` }} />

              <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Settings persist across pages via localStorage. More controls coming soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
