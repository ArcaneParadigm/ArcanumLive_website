'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { GatewayButton, HeroHotspot } from '@/types'

// Accent color per visualEffect
const EFFECT_COLOR: Record<string, string> = {
  'portal-pulse':      '#00e5ff',
  'dome-light-sweep':  '#c9973a',
  'guardian-glow':     '#a855f7',
  'glyph-orbit':       '#00d4ff',
  'gold-sparks':       '#f5d06e',
}

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
      {/* Resting glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.65 : 0.22 }}
        transition={{ duration: 0.35 }}
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}55 0%, ${color}22 40%, transparent 70%)`,
          boxShadow: hovered ? `0 0 40px 8px ${color}30` : 'none',
        }}
      />

      {/* Breathing pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none border"
        style={{ borderColor: `${color}40` }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Click ripples */}
      {ripples.map((id) => (
        <motion.div
          key={id}
          className="absolute inset-0 rounded-full pointer-events-none border-2"
          style={{ borderColor: `${color}80` }}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      ))}

      {/* Hover label — small, bottom edge */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] uppercase font-cinzel whitespace-nowrap pointer-events-none"
            style={{ color, textShadow: `0 0 8px ${color}` }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            {spot.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

interface ArcanumPortalHeroProps {
  buttons: GatewayButton[]
  hotspots: HeroHotspot[]
  heroImages?: string[]
}

const PORTAL_PARTICLES = Array.from({ length: 30 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  yEnd: -(Math.random() * 60 + 20),
  xEnd: (Math.random() - 0.5) * 30,
  scale: Math.random() * 2 + 0.5,
  duration: Math.random() * 5 + 4,
  delay: Math.random() * 6,
}))

function PortalParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PORTAL_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-cyan-arcanum/60"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          animate={{
            y: [0, p.yEnd],
            x: [0, p.xEnd],
            opacity: [0, 0.8, 0],
            scale: [0, p.scale, 0],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function PortalRing() {
  const prefersReducedMotion = useReducedMotion()
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          border: '1px solid rgba(0, 229, 255, 0.15)',
          boxShadow: '0 0 60px rgba(0, 229, 255, 0.08), inset 0 0 60px rgba(0, 229, 255, 0.04)',
        }}
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{
          border: '1px solid rgba(201, 151, 58, 0.2)',
          boxShadow: '0 0 40px rgba(201, 151, 58, 0.06)',
        }}
        animate={prefersReducedMotion ? {} : { rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{ border: '1px solid rgba(0, 229, 255, 0.25)' }}
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.05, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, transparent 70%)',
          boxShadow: '0 0 30px rgba(0,229,255,0.4)',
        }}
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

const CYCLE_MS = 9000 // how long each image shows before crossfading

export default function ArcanumPortalHero({ buttons, hotspots, heroImages }: ArcanumPortalHeroProps) {
  const images = heroImages && heroImages.length > 0 ? heroImages : ['/images/arcanum-portal-v1.jpg']
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [imgIdx, setImgIdx] = useState(0)

  // Cycle through images when multiple are present
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setImgIdx((i) => (i + 1) % images.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [images.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const portalScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -40])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [prefersReducedMotion])

  const parallax = (depth: number) => ({
    x: prefersReducedMotion ? 0 : (mousePos.x - 0.5) * depth,
    y: prefersReducedMotion ? 0 : (mousePos.y - 0.5) * depth,
  })

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-obsidian-200">
      <motion.div
        className="absolute inset-0"
        style={{ ...parallax(8) }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        {/* Cycling hero art — crossfades every 9s, Ken Burns slow zoom */}
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
              animate={{ scale: prefersReducedMotion ? 1 : 1.07 }}
              transition={{ duration: CYCLE_MS / 1000 + 1.8, ease: 'linear' }}
            >
              <Image
                src={images[imgIdx]}
                alt="The Arcanum Portal"
                fill
                priority={imgIdx === 0}
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-cosmic/40 via-obsidian-200/30 to-obsidian-200" />
        <div className="absolute inset-0 bg-arcanum-radial opacity-40" />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ ...parallax(12) }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-obsidian-200/50 via-purple-cosmic/20 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ scale: portalScale, ...parallax(6) }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      >
        <PortalRing />
      </motion.div>

      {mounted && !prefersReducedMotion && <PortalParticles />}

      {/* Glow hotspots — transparent click zones with radial glow over baked-in art */}
      <div className="absolute inset-0 z-10">
        {hotspots.map((spot) => (
          <GlowHotspot
            key={spot.id}
            spot={spot}
            onEnter={() => setActiveHotspot(spot.id)}
            onLeave={() => setActiveHotspot(null)}
          />
        ))}
      </div>

      {/* Hover description — bottom-left corner */}
      <div className="absolute bottom-20 left-6 z-20 pointer-events-none w-60">
        <AnimatePresence mode="wait">
          {activeHotspot && (() => {
            const spot = hotspots.find((s) => s.id === activeHotspot)
            if (!spot) return null
            const color = EFFECT_COLOR[spot.visualEffect ?? ''] ?? '#c9973a'
            return (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="rounded-lg px-4 py-3 border backdrop-blur-md"
                style={{ background: 'rgba(7,5,15,0.75)', borderColor: `${color}40` }}
              >
                <p className="text-xs font-cinzel font-semibold tracking-widest uppercase mb-0.5" style={{ color }}>{spot.label}</p>
                <p className="text-white/70 text-xs leading-relaxed">{spot.description}</p>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>

      {/* Top: title + subtitle */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute top-0 left-0 right-0 z-10 pt-16 px-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.14em] uppercase leading-none mb-2"
        >
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #8a6520 0%, #f5d06e 40%, #e8b84b 60%, #8a6520 100%)' }}
          >
            Enter the
          </span>
          {' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #c9973a 0%, #f5d06e 50%, #c9973a 100%)' }}
          >
            Arcanum
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/55 text-sm md:text-base font-light tracking-wide max-w-xl mx-auto"
        >
          A cinematic universe of immersive dome shows, 360 movies, AI films, mythic worlds, sacred media systems, and dimensional archives.
        </motion.p>
      </motion.div>

      {/* Left side vertical links */}
      <motion.div
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 hidden md:flex flex-col gap-5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        {[
          { label: 'Archive', href: '/archive' },
          { label: 'Store', href: '/store' },
          { label: 'Licensing', href: '/contact' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white/25 hover:text-white/60 transition-colors text-xs tracking-[0.3em] uppercase"
            style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
          >
            {link.label}
          </Link>
        ))}
      </motion.div>

      {/* Bottom fade — page transitions cleanly into sections below */}

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          className="w-px h-6 bg-gradient-to-b from-gold/40 to-transparent mx-auto"
          animate={{ scaleY: [0, 1, 0] }}
          style={{ originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-obsidian-200 to-transparent pointer-events-none" />
    </div>
  )
}
