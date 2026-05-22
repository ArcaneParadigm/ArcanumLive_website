'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface MediaBandImage {
  src: string
  alt?: string
}

interface MediaBandProps {
  /** Pass a video URL to play video; omit for image slideshow */
  videoSrc?: string
  /** Array of images for slideshow mode */
  images?: MediaBandImage[]
  /** Interval in ms between image transitions (default 4500) */
  interval?: number
  /** Aspect ratio string e.g. "21/7" */
  aspectRatio?: string
  /** Overlay content rendered on top */
  children?: React.ReactNode
  /** Accent color for loading/placeholder glow */
  accentColor?: string
}

const FADE = { duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] as const }

export default function MediaBand({
  videoSrc,
  images = [],
  interval = 4500,
  aspectRatio = '21/7',
  children,
  accentColor = '#c9973a',
}: MediaBandProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Auto-cycle images
  useEffect(() => {
    if (videoSrc || images.length <= 1) return
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length)
    }, interval)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [videoSrc, images.length, interval])

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
      {/* ── Video mode ── */}
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ── Slideshow mode ── */}
      {!videoSrc && images.length > 0 && mounted && (
        <AnimatePresence mode="sync">
          <motion.img
            key={activeIdx}
            src={images[activeIdx].src}
            alt={images[activeIdx].alt ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={FADE}
          />
        </AnimatePresence>
      )}

      {/* ── Placeholder (no media yet) ── */}
      {!videoSrc && images.length === 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${accentColor}25 0%, #07050f 70%)`,
          }}
        />
      )}

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Slideshow dots */}
      {!videoSrc && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
          {images.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === activeIdx ? 18 : 5,
                height: 5,
                background: i === activeIdx ? accentColor : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      )}

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 h-full">{children}</div>
      )}
    </div>
  )
}
