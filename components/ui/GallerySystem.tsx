'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KenBurnsSlideshow from '@/components/screensaver/KenBurnsSlideshow'
import { playDeepGong } from '@/lib/utils/crystalSound'

export interface GalleryImage {
  id: string
  src?: string          // real URL — undefined = placeholder
  alt?: string
  caption?: string
}

interface GallerySystemProps {
  images: GalleryImage[]
  accentColor?: string
  aspectRatio?: string  // for the main slot, e.g. "16/9" or "21/9"
  label?: string        // e.g. "Lore Gallery"
  fullWidth?: boolean   // removes rounded corners + max-width for edge-to-edge use
  kenBurns?: boolean    // use Ken Burns animated slideshow for main display
  isStatic?: boolean    // no auto-morph, no thumbnail strip (lore/character panels)
  secPerImage?: number  // Ken Burns speed in seconds (default 10)
}

const MORPH_INTERVAL = 3800

export default function GallerySystem({
  images,
  accentColor = '#c9973a',
  aspectRatio = '16/9',
  label,
  fullWidth = false,
  kenBurns = false,
  isStatic = false,
  secPerImage = 10,
}: GallerySystemProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [isPanelHovered, setIsPanelHovered] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null) // index or null
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const panelTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const thumbStripRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Auto-morph when not hovered (disabled for kenBurns and isStatic modes)
  useEffect(() => {
    if (kenBurns || isStatic || hovered || images.length <= 1) return
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length)
    }, MORPH_INTERVAL)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [kenBurns, isStatic, hovered, images.length])

  // isStatic panel: auto-cycle while hovered
  useEffect(() => {
    if (!isStatic) return
    if (isPanelHovered && images.length > 1) {
      panelTimerRef.current = setInterval(() => {
        setActiveIdx(i => (i + 1) % images.length)
      }, 2400)
    } else {
      if (panelTimerRef.current) { clearInterval(panelTimerRef.current); panelTimerRef.current = null }
    }
    return () => { if (panelTimerRef.current) clearInterval(panelTimerRef.current) }
  }, [isStatic, isPanelHovered, images.length])

  // Scroll active thumbnail into view in strip
  useEffect(() => {
    if (!isPanelHovered || !thumbStripRef.current) return
    const strip = thumbStripRef.current
    const btn = strip.children[activeIdx] as HTMLElement | undefined
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeIdx, isPanelHovered])

  // Keyboard nav for lightbox
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (lightbox === null) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setLightbox((i) => ((i ?? 0) + 1) % images.length)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setLightbox((i) => ((i ?? 0) - 1 + images.length) % images.length)
    } else if (e.key === 'Escape') {
      setLightbox(null)
    }
  }, [lightbox, images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const active = images[activeIdx]
  const lbImage = lightbox !== null ? images[lightbox] : null

  // Collect real image URLs for Ken Burns
  const realImageUrls = images.map(img => img.src).filter(Boolean) as string[]

  return (
    <>
      <div
        className={`${fullWidth ? '' : 'rounded-xl'} ${isStatic ? '' : 'relative overflow-hidden'} group`}
        onMouseEnter={() => {
          setHovered(true)
          if (isStatic) {
            setIsPanelHovered(true)
            playDeepGong()
          }
        }}
        onMouseLeave={() => {
          setHovered(false)
          if (isStatic) setIsPanelHovered(false)
        }}
      >
        {/* ── Main display ── */}
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{
            aspectRatio,
            borderRadius: fullWidth ? undefined : 12,
            transform: isStatic && isPanelHovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
            boxShadow: isStatic && isPanelHovered
              ? `0 0 0 1px ${accentColor}60, 0 0 28px ${accentColor}45, 0 0 60px ${accentColor}20`
              : `inset 0 0 0 1px ${accentColor}20`,
          }}
          onClick={() => setLightbox(activeIdx)}
        >
          {/* Ken Burns mode */}
          {kenBurns && realImageUrls.length > 0 && (
            <KenBurnsSlideshow
              images={realImageUrls}
              secPerImage={secPerImage}
              showControls
              accentColor={accentColor}
              className="absolute inset-0 w-full h-full"
            />
          )}

          {/* Standard morph / static mode */}
          {!kenBurns && mounted && (
            <AnimatePresence mode="sync">
              {active.src ? (
                <motion.img
                  key={active.id}
                  src={active.src}
                  alt={active.alt ?? ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: isStatic ? 0.6 : 1.2 }}
                />
              ) : (
                <motion.div
                  key={active.id}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  style={{
                    background: `radial-gradient(ellipse at ${(activeIdx % 3) * 33 + 17}% 40%, ${accentColor}20 0%, #08060e 70%)`,
                  }}
                >
                  <div className="text-center">
                    <p className="text-xs tracking-widest uppercase" style={{ color: `${accentColor}45` }}>
                      {active.caption ?? `Image ${activeIdx + 1}`}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Caption bottom-left */}
          {active && active.caption && (
            <div className="absolute bottom-3 left-4 text-white/40 text-xs tracking-widest uppercase pointer-events-none">
              {active.caption}
            </div>
          )}

        </div>

        {/* ── isStatic panel: thumbnail strip below image, visible on hover ── */}
        {isStatic && images.length > 1 && (
          <AnimatePresence>
            {isPanelHovered && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.28 }}
                style={{ background: 'rgba(8,6,14,0.88)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${accentColor}20` }}
                className="rounded-b-xl overflow-hidden px-2 py-2"
              >
                <div
                  ref={thumbStripRef}
                  className="flex gap-1.5 overflow-x-auto scrollbar-none"
                >
                  {images.filter(img => img.src).map((img, i) => {
                    const realIdx = images.indexOf(img)
                    const isActive = realIdx === activeIdx
                    return (
                      <button
                        key={img.id}
                        onClick={(e) => { e.stopPropagation(); setActiveIdx(realIdx) }}
                        className="shrink-0 rounded overflow-hidden transition-all duration-300"
                        style={{
                          width: 54,
                          height: 36,
                          border: isActive ? `1.5px solid ${accentColor}` : `1px solid rgba(255,255,255,0.08)`,
                          boxShadow: isActive ? `0 0 10px ${accentColor}70, 0 0 4px ${accentColor}40` : 'none',
                          opacity: isActive ? 1 : 0.48,
                          transform: isActive ? 'scale(1.08)' : 'scale(1)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Hover thumbnail strip (non-isStatic, non-kenBurns mode) ── */}
        {!isStatic && !kenBurns && (
          <AnimatePresence>
            {hovered && images.length > 1 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 z-20"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="flex gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none"
                  style={{ background: 'rgba(8,6,14,0.85)', backdropFilter: 'blur(8px)' }}
                >
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={(e) => { e.stopPropagation(); setActiveIdx(i); setLightbox(i) }}
                      className="shrink-0 rounded overflow-hidden transition-all duration-200"
                      style={{
                        width: 56,
                        height: 38,
                        border: i === activeIdx ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                        opacity: i === activeIdx ? 1 : 0.55,
                        background: img.src
                          ? undefined
                          : `${accentColor}15`,
                      }}
                    >
                      {img.src ? (
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[8px]" style={{ color: `${accentColor}60` }}>{i + 1}</span>
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Open all button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(0) }}
                    className="shrink-0 rounded flex items-center justify-center text-[9px] tracking-widest uppercase transition-all duration-200 hover:opacity-100 opacity-70"
                    style={{
                      width: 56,
                      height: 38,
                      border: `1px solid ${accentColor}30`,
                      color: accentColor,
                      background: `${accentColor}10`,
                    }}
                  >
                    All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Label */}
        {label && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <span
              className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded"
              style={{
                background: 'rgba(8,6,14,0.7)',
                color: `${accentColor}80`,
                border: `1px solid ${accentColor}25`,
              }}
            >
              {label}
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          FULLSCREEN LIGHTBOX
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox !== null && lbImage && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                {label && (
                  <span className="text-xs tracking-widest uppercase" style={{ color: `${accentColor}70` }}>
                    {label}
                  </span>
                )}
                <span className="text-white/30 text-xs">
                  {(lightbox ?? 0) + 1} / {images.length}
                </span>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/40 hover:text-white text-xl transition-colors w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center relative px-16 py-6 overflow-hidden">
              {/* Prev */}
              <button
                onClick={() => setLightbox((i) => ((i ?? 0) - 1 + images.length) % images.length)}
                className="absolute left-4 z-10 w-10 h-10 rounded-full border flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
                style={{ borderColor: `${accentColor}40`, background: 'rgba(8,6,14,0.7)' }}
              >
                ‹
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lightbox}
                  className="max-w-5xl w-full max-h-full flex items-center justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {lbImage.src ? (
                    <img
                      src={lbImage.src}
                      alt={lbImage.alt ?? ''}
                      className="max-w-full max-h-[70vh] object-contain rounded-xl"
                      style={{ boxShadow: `0 0 60px ${accentColor}20` }}
                    />
                  ) : (
                    <div
                      className="w-full rounded-xl flex items-center justify-center"
                      style={{
                        aspectRatio: '16/9',
                        background: `radial-gradient(ellipse at 50% 40%, ${accentColor}20 0%, #08060e 70%)`,
                        border: `1px solid ${accentColor}25`,
                      }}
                    >
                      <div className="text-center">
                        <p className="text-white/20 text-xs tracking-widest uppercase mb-2">Image {(lightbox ?? 0) + 1}</p>
                        {lbImage.caption && (
                          <p className="text-white/40 text-sm">{lbImage.caption}</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next */}
              <button
                onClick={() => setLightbox((i) => ((i ?? 0) + 1) % images.length)}
                className="absolute right-4 z-10 w-10 h-10 rounded-full border flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
                style={{ borderColor: `${accentColor}40`, background: 'rgba(8,6,14,0.7)' }}
              >
                ›
              </button>
            </div>

            {/* Caption */}
            {lbImage.caption && (
              <div className="text-center pb-3 text-white/40 text-sm tracking-wide">
                {lbImage.caption}
              </div>
            )}

            {/* Thumbnail rail */}
            <div className="border-t border-white/8 px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none justify-center">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setLightbox(i)}
                  className="shrink-0 rounded overflow-hidden transition-all duration-200"
                  style={{
                    width: 72,
                    height: 46,
                    border: i === lightbox ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
                    opacity: i === lightbox ? 1 : 0.45,
                    background: img.src ? undefined : `${accentColor}12`,
                  }}
                >
                  {img.src ? (
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[9px]" style={{ color: `${accentColor}50` }}>{i + 1}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Keyboard hint */}
            <div className="text-center pb-4 text-white/15 text-[10px] tracking-widest uppercase">
              ← → arrow keys to navigate · ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
