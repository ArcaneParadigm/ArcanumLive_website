'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { GatewayButton, HeroHotspot } from '@/types'

interface ArcanumPortalHeroProps {
  buttons: GatewayButton[]
  hotspots: HeroHotspot[]
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

export default function ArcanumPortalHero({ buttons, hotspots }: ArcanumPortalHeroProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

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
        <Image
          src="/images/arcanum-portal-v1.jpg"
          alt="The Arcanum Portal"
          fill
          priority
          className="object-cover object-center"
        />
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

      <div className="absolute inset-0">
        {hotspots.map((spot) => (
          <Link
            key={spot.id}
            href={spot.href}
            className="absolute cursor-pointer"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.width}%`,
              height: `${spot.height}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setActiveHotspot(spot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
          />
        ))}
      </div>

      {/* Single fixed info panel — bottom-left, above buttons */}
      <div className="absolute bottom-24 left-6 z-20 pointer-events-none w-56">
        {hotspots.map((spot) => (
          activeHotspot === spot.id && (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-obsidian-100/80 backdrop-blur-md border border-gold/30 rounded-lg px-4 py-3 shadow-gold-glow"
            >
              <p className="text-gold-bright text-xs font-semibold tracking-wider uppercase mb-0.5">{spot.label}</p>
              <p className="text-white/50 text-xs leading-relaxed">{spot.description}</p>
            </motion.div>
          )
        ))}
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

      {/* Bottom gateway buttons — sits over the image's label band */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute bottom-10 left-0 right-0 z-10 px-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-4xl mx-auto">
          {buttons.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className="group relative px-5 py-2 text-xs md:text-sm tracking-widest uppercase font-medium transition-all duration-300"
            >
              <div className="absolute inset-0 rounded border border-gold/20 bg-black/50 backdrop-blur-md group-hover:border-gold/60 group-hover:bg-black/70 transition-all duration-300" />
              <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-gold-glow" />
              <span className="relative text-gold-bright/80 group-hover:text-gold-bright">{btn.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

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
