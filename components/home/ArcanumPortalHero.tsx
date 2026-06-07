'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { GatewayButton, HeroHotspot } from '@/types'

// Accent color per visualEffect
const EFFECT_COLOR: Record<string, string> = {
  'portal-pulse':     '#00e5ff',
  'dome-light-sweep': '#c9973a',
  'guardian-glow':    '#a855f7',
  'glyph-orbit':      '#00d4ff',
  'gold-sparks':      '#f5d06e',
}

// ── Invisible click zone — zero resting visibility, subtle glow on hover ──
function GlowHotspot({ spot, onEnter, onLeave }: {
  spot: HeroHotspot
  onEnter: () => void
  onLeave: () => void
}) {
  const color = EFFECT_COLOR[spot.visualEffect ?? ''] ?? '#c9973a'
  const [ripples, setRipples] = useState<number[]>([])
  const [hovered, setHovered] = useState(false)

  const addRipple = useCallback(() => {
    const id = Date.now()
    setRipples((r) => [...r, id])
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 900)
  }, [])

  return (
    <Link
      href={spot.href}
      className="absolute cursor-pointer"
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        width: `${spot.width}%`,
        height: `${spot.height}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => { setHovered(true); onEnter() }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      onClick={addRipple}
    >
      {/* Hover glow — completely invisible at rest */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}30 0%, transparent 70%)`,
          boxShadow: `0 0 30px 4px ${color}20`,
        }}
      />

      {/* Click ripple */}
      {ripples.map((id) => (
        <motion.div
          key={id}
          className="absolute inset-0 rounded-lg pointer-events-none border"
          style={{ borderColor: `${color}90` }}
          initial={{ scale: 0.8, opacity: 0.9 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </Link>
  )
}

interface ArcanumPortalHeroProps {
  buttons: GatewayButton[]
  hotspots: HeroHotspot[]
  heroImages?: string[]
  uiOverlay?: string | null
}

const CYCLE_MS = 9000

export default function ArcanumPortalHero({ buttons, hotspots, heroImages, uiOverlay }: ArcanumPortalHeroProps) {
  const images = heroImages && heroImages.length > 0 ? heroImages : ['/images/arcanum-portal-v1.jpg']
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [imgIdx, setImgIdx] = useState(0)

  // Cycle backgrounds
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setImgIdx((i) => (i + 1) % images.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [images.length])

  // Mouse parallax
  useEffect(() => {
    if (prefersReducedMotion) return
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [prefersReducedMotion])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const parallax = (depth: number) => ({
    x: prefersReducedMotion ? 0 : (mousePos.x - 0.5) * depth,
    y: prefersReducedMotion ? 0 : (mousePos.y - 0.5) * depth,
  })

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-obsidian-200">

      {/* ── LAYER 1: Cycling background art — Ken Burns + mouse parallax ── */}
      <motion.div
        className="absolute inset-0"
        style={{ ...parallax(8) }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={imgIdx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: prefersReducedMotion ? 1 : 1.06 }}
              transition={{ duration: CYCLE_MS / 1000 + 2, ease: 'linear' }}
            >
              <Image
                src={images[imgIdx]}
                alt="The Arcanum"
                fill
                priority={imgIdx === 0}
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── LAYER 2: UI chrome overlay — extracted PNG with transparency ──
           Drop public/art/home/ui-overlay.png to activate.
           Buttons/panels/type stay locked while backgrounds cycle behind them. */}
      {uiOverlay && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <Image src={uiOverlay} alt="" fill className="object-cover object-center" priority style={{ mixBlendMode: 'screen' }} />
        </motion.div>
      )}

      {/* ── LAYER 3: Invisible glow click zones — position over art's buttons ── */}
      <div className="absolute inset-0 z-20">
        {hotspots.map((spot) => (
          <GlowHotspot
            key={spot.id}
            spot={spot}
            onEnter={() => setActiveHotspot(spot.id)}
            onLeave={() => setActiveHotspot(null)}
          />
        ))}
      </div>

      {/* Hotspot hover label — bottom left, tiny, only on hover */}
      <div className="absolute bottom-8 left-6 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {activeHotspot && (() => {
            const spot = hotspots.find((s) => s.id === activeHotspot)
            if (!spot) return null
            const color = EFFECT_COLOR[spot.visualEffect ?? ''] ?? '#c9973a'
            return (
              <motion.p
                key={spot.id}
                className="font-cinzel tracking-[0.35em] uppercase"
                style={{ fontSize: 'clamp(7px, 1.5vw, 9px)', color, textShadow: `0 0 10px ${color}` }}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.15 }}
              >
                {spot.label}
              </motion.p>
            )
          })()}
        </AnimatePresence>
      </div>

      {/* Bottom fade into page */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: 'clamp(80px, 15vh, 160px)', background: 'linear-gradient(to top, var(--color-obsidian-200, #08060e), transparent)', opacity: heroOpacity }}
      />

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-px h-5 bg-gradient-to-b from-gold/50 to-transparent mx-auto"
          animate={{ scaleY: [0, 1, 0] }}
          style={{ originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}
