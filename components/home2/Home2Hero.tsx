'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { BtnOrnate } from '@/components/ui/BtnOrnate'
import { useAstrolabeAudio } from '@/lib/hooks/useAstrolabeAudio'
import type { AstrolabeTrack } from '@/lib/hooks/useAstrolabeAudio'
import { useImagePoint } from '@/lib/hooks/useImagePoint'

// No SSR — Three.js + Web Audio are client-only
const AstrolabeOrb      = dynamic(() => import('./AstrolabeOrb'),      { ssr: false })
const AstrolabeControls = dynamic(() => import('./AstrolabeControls'), { ssr: false })

// ── Front-page playlist — swap in real tracks when ready ──────────────────────
const FRONT_PAGE_TRACKS: AstrolabeTrack[] = [
  { title: 'BTTH Ascent', src: '/audio/home_main.wav' },
]

interface Home2HeroProps {
  heroImages: string[]
  uiOverlay?: string | null
}

const CYCLE_MS = 9000

const HERO_BTNS = [
  { label: 'Watch VR Films',     href: '/vr-films'   },
  { label: 'Ascension\nChamber', href: '/ascension'  },
  { label: 'Explore\nthe Realms',href: '/realms'     },
  { label: 'Watch AI Films',     href: '/ai-films'   },
]

const BTN_W = 220
const BTN_Y = 84

export default function Home2Hero({ heroImages, uiOverlay }: Home2HeroProps) {
  const images = heroImages.length > 0 ? heroImages : ['/images/arcanum-portal-v1.jpg']
  const prefersReducedMotionRaw = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const prefersReducedMotion = mounted ? prefersReducedMotionRaw : false
  const containerRef = useRef<HTMLDivElement>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  // Astrolabe controls
  const [speedMult,       setSpeedMult]       = useState(1.0)
  const [pulseMult,       setPulseMult]       = useState(1.0)
  const [glowStrength,    setGlowStrength]    = useState(1.6)
  const [beatSensitivity, setBeatSensitivity] = useState(1.4)

  // Audio
  const audio = useAstrolabeAudio(FRONT_PAGE_TRACKS, beatSensitivity)

  // Orb position locked to image content (arcanum-portal-v1.jpg is 1248×832)
  // fx=0.50, fy=0.247 = center of the arcanum circle in the image
  const orbPt = useImagePoint(1248, 832, 0.44, 0.48)

  // Sound On/Off nav button toggles music
  useEffect(() => {
    if (!mounted || FRONT_PAGE_TRACKS.length === 0) return
    const onToggle = (e: Event) => {
      const on = (e as CustomEvent).detail?.on
      const el = audio.audioRef.current
      if (!el) return
      if (on) el.play().catch(() => {}); else el.pause()
    }
    window.addEventListener('arcanum:music-toggle', onToggle)
    return () => window.removeEventListener('arcanum:music-toggle', onToggle)
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const parallax = (d: number) => ({
    x: prefersReducedMotion ? 0 : (mousePos.x - 0.5) * d,
    y: prefersReducedMotion ? 0 : (mousePos.y - 0.5) * d,
  })

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-obsidian-200">

      {/* LAYER 1 — cycling backgrounds */}
      <motion.div className="absolute inset-0" style={{ opacity: fade, ...parallax(8) }} transition={{ type: 'spring', stiffness: 50, damping: 20 }}>
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

      {/* LAYER 2 — UI chrome overlay */}
      {uiOverlay && (
        <motion.div className="absolute inset-0 pointer-events-none z-10"
          style={{ opacity: fade }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
        >
          <Image src={uiOverlay} alt="" fill className="object-cover object-center" priority style={{ mixBlendMode: 'screen' }} />
        </motion.div>
      )}

      {/* LAYER 2b — 3D Astrolabe Orb */}
      {mounted && (
        <div
          className="absolute pointer-events-none"
          style={{ left: orbPt.x, top: orbPt.y, transform: 'translate(-50%, -50%)', width: '29vw', height: '29vw', zIndex: 15 }}
        >
          <motion.div
            style={{ opacity: fade, width: '100%', height: '100%' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.8 }}
          >
            <AstrolabeOrb
              audio={audio.analysis}
              speedMult={speedMult}
              pulseMult={pulseMult}
              glowStrength={glowStrength}
              mousePos={mousePos}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        </div>
      )}

      {/* Hidden audio element */}
      <audio ref={audio.audioRef} crossOrigin="anonymous" preload="auto" loop style={{ display: 'none' }} />

      {/* LAYER 3 — Title + subtitle */}
      <div className="absolute inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none"
        style={{ top: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
        >
          <h1 className="font-cinzel font-bold leading-none mb-1"
            style={{
              fontSize: 'clamp(2.24rem, 5.6vw, 4.4rem)',
              background: 'linear-gradient(135deg, #8a6020 0%, #c9973a 30%, #f5d06e 55%, #c9973a 75%, #8a6020 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              WebkitTextStroke: '0.8px rgba(255,210,80,0.65)',
              filter: 'drop-shadow(0 0 50px rgba(210,140,0,1)) drop-shadow(0 0 100px rgba(190,110,0,0.75)) drop-shadow(0 0 160px rgba(150,80,0,0.55))',
            }}>
            Enter the Arcanum
          </h1>
          <p className="font-cinzel mx-auto"
            style={{
              fontSize: 'clamp(0.81rem, 1.35vw, 0.97rem)',
              letterSpacing: '0.12em',
              lineHeight: 1.8,
              color: '#f5d06e',
              textShadow: '0 2px 4px rgba(0,0,0,0.9)',
            }}>
            <span style={{ display: 'block' }}>
              A cinematic universe of immersive domeshows &amp; forbidden archives
            </span>
            <span style={{ display: 'block' }}>
              AI Films · mythic worlds · sacred products · dimensional media systems
            </span>
          </p>
        </motion.div>
      </div>

      {/* Music button — floating top-left, independent of portal buttons */}
      {mounted && (
        <motion.div
          className="absolute z-20"
          style={{ left: '12%', top: '72%' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
        >
          <motion.button
            onClick={() => { if (audio.playing) { audio.pause() } else { audio.play() } }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase text-white whitespace-nowrap cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
              border: '1px solid #9a7030',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
            whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(160,110,40,0.5)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <span>{audio.playing ? '⏸' : '♪'}</span>
            <span>{audio.playing ? 'Pause Music' : 'Play Music'}</span>
          </motion.button>
        </motion.div>
      )}

      {/* LAYER 4 — 4 ornate portal buttons */}
      <div className="absolute inset-x-0 z-20 flex justify-center"
        style={{ top: `${BTN_Y}%`, transform: 'translateY(-50%)' }}>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center w-full px-4 md:px-0 md:w-auto md:justify-center">

          {HERO_BTNS.map((btn, i) => (
            <motion.div
              key={btn.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.12, ease: 'easeOut' }}
            >
              <BtnOrnate label={btn.label} href={btn.href} width={BTN_W} height={72} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* LAYER 5 — Astrolabe hot controls */}
      {mounted && (
        <AstrolabeControls
          speedMult={speedMult} pulseMult={pulseMult}
          glowStrength={glowStrength} beatSensitivity={beatSensitivity}
          onSpeed={setSpeedMult} onPulse={setPulseMult}
          onGlow={setGlowStrength} onBeatSensitivity={setBeatSensitivity}
          playing={audio.playing} volume={audio.volume}
          currentTrack={audio.currentTrack}
          trackIdx={audio.trackIdx} tracks={FRONT_PAGE_TRACKS}
          onPlay={audio.play} onPause={audio.pause}
          onNext={audio.next} onPrev={audio.prev}
          onVolume={audio.setVolume}
        />
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #08060e, transparent)' }} />

      {/* Scroll cue */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
        <p className="text-[8px] tracking-[0.5em] uppercase" style={{ color: 'rgba(201,151,58,0.6)' }}>Scroll to Enter</p>
        <motion.div className="w-px h-5 mx-auto"
          style={{ background: 'linear-gradient(to bottom, rgba(201,151,58,0.5), transparent)', originY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </div>
  )
}
