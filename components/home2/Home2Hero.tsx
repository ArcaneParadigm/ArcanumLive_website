'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface Home2HeroProps {
  heroImages: string[]
  uiOverlay?: string | null
}

// ── Hotspot positions — tune x/y/width/height to match your art's buttons ──
const HOTSPOTS = [
  { id: 'dome',      label: 'Watch Dome Shows',    href: '/dome-shows', x: 20,  y: 60, w: 18, h: 14, color: '#c9973a' },
  { id: 'ascension', label: 'Ascension Chamber',   href: '/screensaver', x: 42, y: 60, w: 18, h: 14, color: '#a855f7' },
  { id: 'worlds',    label: 'Explore the Worlds',  href: '/worlds',      x: 64, y: 60, w: 18, h: 14, color: '#00e5ff' },
  { id: 'films',     label: 'Watch Films',          href: '/watch',       x: 86, y: 60, w: 14, h: 14, color: '#f5d06e' },
]

const CYCLE_MS = 9000

function GlowZone({ spot, onHover }: {
  spot: typeof HOTSPOTS[0]
  onHover: (id: string | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [ripples, setRipples] = useState<number[]>([])

  const fire = useCallback(() => {
    const id = Date.now()
    setRipples((r) => [...r, id])
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 800)
  }, [])

  return (
    <Link
      href={spot.href}
      className="absolute cursor-pointer"
      style={{
        left: `${spot.x}%`, top: `${spot.y}%`,
        width: `${spot.w}%`, height: `${spot.h}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => { setHovered(true); onHover(spot.id) }}
      onMouseLeave={() => { setHovered(false); onHover(null) }}
      onClick={fire}
    >
      {/* Glow — invisible at rest */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: `radial-gradient(ellipse, ${spot.color}35 0%, transparent 70%)`, boxShadow: `0 0 24px ${spot.color}25` }}
      />
      {/* Click ripple */}
      {ripples.map((id) => (
        <motion.div key={id} className="absolute inset-0 rounded-lg pointer-events-none border"
          style={{ borderColor: `${spot.color}80` }}
          initial={{ scale: 0.85, opacity: 0.8 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      ))}
    </Link>
  )
}

export default function Home2Hero({ heroImages, uiOverlay }: Home2HeroProps) {
  const images = heroImages.length > 0 ? heroImages : ['/images/arcanum-portal-v1.jpg']
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setImgIdx((i) => (i + 1) % images.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [images.length])

  useEffect(() => {
    if (prefersReducedMotion) return
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX / innerWidth, y: e.clientY / innerHeight })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [prefersReducedMotion])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const px = (d: number) => ({
    x: prefersReducedMotion ? 0 : (mousePos.x - 0.5) * d,
    y: prefersReducedMotion ? 0 : (mousePos.y - 0.5) * d,
  })

  const active = HOTSPOTS.find((h) => h.id === activeHotspot)

  return (
    <motion.div ref={containerRef} style={{ opacity: fade }} className="relative min-h-screen overflow-hidden bg-obsidian-200">

      {/* LAYER 1 — cycling backgrounds */}
      <motion.div className="absolute inset-0" style={{ ...px(8) }} transition={{ type: 'spring', stiffness: 50, damping: 20 }}>
        <AnimatePresence mode="sync">
          <motion.div key={imgIdx} className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          >
            <motion.div className="absolute inset-0"
              initial={{ scale: 1 }} animate={{ scale: prefersReducedMotion ? 1 : 1.06 }}
              transition={{ duration: CYCLE_MS / 1000 + 2, ease: 'linear' }}
            >
              <Image src={images[imgIdx]} alt="The Arcanum" fill priority={imgIdx === 0} className="object-cover object-center" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* LAYER 2 — UI chrome overlay PNG (buttons/panels extracted from art) */}
      {uiOverlay && (
        <motion.div className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
        >
          <Image src={uiOverlay} alt="" fill className="object-cover object-center" priority />
        </motion.div>
      )}

      {/* LAYER 3 — invisible glow click zones */}
      <div className="absolute inset-0 z-20">
        {HOTSPOTS.map((spot) => (
          <GlowZone key={spot.id} spot={spot} onHover={setActiveHotspot} />
        ))}
      </div>

      {/* Hover label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {active && (
            <motion.p key={active.id}
              className="text-[10px] font-cinzel tracking-[0.4em] uppercase"
              style={{ color: active.color, textShadow: `0 0 10px ${active.color}` }}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              {active.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom page fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #08060e, transparent)' }} />

      {/* Scroll cue */}
      <motion.div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
        <motion.div className="w-px h-5 bg-gradient-to-b from-gold/50 to-transparent mx-auto"
          animate={{ scaleY: [0, 1, 0] }} style={{ originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </motion.div>
  )
}
