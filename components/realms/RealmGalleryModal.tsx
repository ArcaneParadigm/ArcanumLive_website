'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GOLD = '#c9973a'

type ViewMode = 'grid' | 'strip' | 'fullscreen'

interface Props {
  images: string[]
  title: string
  color: string
  onClose: () => void
  onEnterWorld: () => void
}

export default function RealmGalleryModal({ images, title, color, onClose, onEnterWorld }: Props) {
  const [mode, setMode] = useState<ViewMode>('grid')
  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  // Fallback: if no gallery images, show placeholder
  const imgs = images.length > 0 ? images : ['/art/home2/homepage2.jpeg']

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length])
  const next = useCallback(() => setActiveIdx(i => (i + 1) % imgs.length), [imgs.length])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev()
      if (e.key === 'f' || e.key === 'F') setMode('fullscreen')
      if (e.key === 'g' || e.key === 'G') setMode('grid')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, next, prev])

  // Slideshow
  useEffect(() => {
    if (!playing) return
    const id = setInterval(next, 3500)
    return () => clearInterval(id)
  }, [playing, next])

  function openFull(idx: number) {
    setActiveIdx(idx)
    setMode('fullscreen')
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(4,3,10,0.97)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${color}30` }}>
        <div className="flex items-center gap-4">
          <button onClick={onClose}
            className="text-white/50 hover:text-white text-sm tracking-widest uppercase transition-colors"
            style={{ fontFamily: 'Cinzel, serif' }}>
            ← Back
          </button>
          <div className="w-px h-4 bg-white/20" />
          <h2 className="font-cinzel text-sm font-bold tracking-widest" style={{ color }}>{title}</h2>
          <span className="text-white/30 text-xs">{imgs.length} images</span>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1">
          {(['grid', 'strip', 'fullscreen'] as ViewMode[]).map(m => (
            <button key={m}
              onClick={() => setMode(m)}
              className="px-3 py-1 rounded text-[10px] tracking-widest uppercase transition-all"
              style={{
                background: mode === m ? `${color}25` : 'transparent',
                border: `1px solid ${mode === m ? color + '60' : 'rgba(255,255,255,0.12)'}`,
                color: mode === m ? color : 'rgba(255,255,255,0.5)',
              }}>
              {m === 'grid' ? '⊞ Grid' : m === 'strip' ? '⊟ Strip' : '⛶ Full'}
            </button>
          ))}
        </div>

        {/* Playback + enter world */}
        <div className="flex items-center gap-3">
          <button onClick={() => setPlaying(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] tracking-widest uppercase transition-all"
            style={{
              background: playing ? `${color}30` : 'transparent',
              border: `1px solid ${playing ? color + '70' : 'rgba(255,255,255,0.2)'}`,
              color: playing ? color : 'rgba(255,255,255,0.6)',
            }}>
            {playing ? '⏸ Pause' : '▶ Slideshow'}
          </button>
          <button onClick={onEnterWorld}
            className="px-4 py-1.5 rounded text-[10px] font-semibold tracking-widest uppercase"
            style={{
              background: `linear-gradient(135deg, #2e1e06, #7a5018)`,
              border: `1px solid ${GOLD}55`,
              color: '#f0d08a',
              boxShadow: `0 2px 10px rgba(0,0,0,0.5)`,
            }}>
            Enter World →
          </button>
        </div>
      </div>

      {/* ── Gallery area ── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">

          {/* GRID MODE */}
          {mode === 'grid' && (
            <motion.div key="grid"
              className="absolute inset-0 overflow-y-auto p-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                {imgs.map((src, i) => (
                  <div key={i} onClick={() => openFull(i)}
                    className="break-inside-avoid rounded-lg overflow-hidden cursor-pointer group relative"
                    style={{ border: `1px solid ${color}20` }}>
                    <img src={src} alt="" className="w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xl transition-opacity">⛶</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STRIP MODE */}
          {mode === 'strip' && (
            <motion.div key="strip"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Main featured image */}
              <div className="flex-1 flex items-center justify-center px-16 py-4">
                <div className="relative max-h-full" style={{ maxWidth: '70vw' }}>
                  <img src={imgs[activeIdx]} alt="" className="max-h-full max-w-full object-contain rounded-xl"
                    style={{ maxHeight: 'calc(100vh - 220px)', border: `1px solid ${color}30` }} />
                </div>
              </div>
              {/* Thumbnail strip */}
              <div className="shrink-0 flex gap-2 overflow-x-auto px-6 py-3"
                style={{ borderTop: `1px solid ${color}20`, scrollbarWidth: 'none' }}>
                {imgs.map((src, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    className="shrink-0 rounded overflow-hidden transition-all"
                    style={{
                      width: 80, height: 54,
                      border: `2px solid ${i === activeIdx ? color : 'transparent'}`,
                      opacity: i === activeIdx ? 1 : 0.5,
                    }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {/* Arrows */}
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-8 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}40`, color }}>‹</button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-8 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}40`, color }}>›</button>
            </motion.div>
          )}

          {/* FULLSCREEN MODE */}
          {mode === 'fullscreen' && (
            <motion.div key="fullscreen"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnimatePresence mode="sync">
                <motion.img
                  key={activeIdx}
                  src={imgs[activeIdx]}
                  alt=""
                  className="absolute max-w-full max-h-full object-contain"
                  style={{ maxWidth: 'calc(100vw - 120px)', maxHeight: 'calc(100vh - 120px)' }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button onClick={prev} className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${color}50`, color }}>‹</button>
                <span className="text-[11px] tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {activeIdx + 1} / {imgs.length}
                </span>
                <button onClick={next} className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${color}50`, color }}>›</button>
              </div>
              {/* Back to grid */}
              <button onClick={() => setMode('grid')}
                className="absolute top-4 right-4 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded"
                style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(255,255,255,0.2)`, color: 'rgba(255,255,255,0.5)' }}>
                ⊞ Grid · ESC
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer hint ── */}
      <div className="shrink-0 px-6 py-2 flex items-center justify-center gap-6"
        style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        {[['← →', 'navigate'], ['G', 'grid'], ['F', 'fullscreen'], ['ESC', 'close']].map(([k, v]) => (
          <span key={k} className="text-[9px] tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</span> {v}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
