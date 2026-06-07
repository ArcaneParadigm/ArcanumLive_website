'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { BtnOrnate } from '@/components/ui/BtnOrnate'
import { useAstrolabeAudio } from '@/lib/hooks/useAstrolabeAudio'
import type { AstrolabeTrack } from '@/lib/hooks/useAstrolabeAudio'

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

  // Hover fade
  const [hoverFade, setHoverFade] = useState(false)

  // Astrolabe controls
  const [speedMult,       setSpeedMult]       = useState(1.0)
  const [pulseMult,       setPulseMult]       = useState(1.0)
  const [glowStrength,    setGlowStrength]    = useState(1.6)
  const [beatSensitivity, setBeatSensitivity] = useState(1.4)

  // Audio
  const audio = useAstrolabeAudio(FRONT_PAGE_TRACKS, beatSensitivity)

  // Play/pause music via SOUND ON nav button
  useEffect(() => {
    if (!mounted || FRONT_PAGE_TRACKS.length === 0) return
    const onToggle = (e: Event) => {
      const on = (e as CustomEvent).detail?.on
      if (on) audio.play(); else audio.pause()
    }
    window.addEventListener('arcanum:music-toggle', onToggle)
    return () => window.removeEventListener('arcanum:music-toggle', onToggle)
  }, [mounted, audio.play, audio.pause]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fade audio when other panels signal hover (fire 'arcanum:audiofade' custom event)
  useEffect(() => {
    const on  = () => { setHoverFade(true);  audio.setVolume(0.08) }
    const off = () => { setHoverFade(false); audio.setVolume(0.5)  }
    window.addEventListener('arcanum:audiofade:on',  on)
    window.addEventListener('arcanum:audiofade:off', off)
    return () => {
      window.removeEventListener('arcanum:audiofade:on',  on)
      window.removeEventListener('arcanum:audiofade:off', off)
    }
  }, [audio.setVolume]) // eslint-disable-line react-hooks/exhaustive-deps

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
        <motion.div
          className="absolute pointer-events-none"
          style={{
            opacity: fade,
            left: 'calc(35% + 9px)', top: '23%',
            width: '29%', height: '29vw',
            zIndex: 15,
          }}
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
