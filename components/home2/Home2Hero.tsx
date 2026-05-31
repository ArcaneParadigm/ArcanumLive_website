'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { BtnOrnate } from '@/components/ui/BtnOrnate'

interface Home2HeroProps {
  heroImages: string[]
  uiOverlay?: string | null
}

const CYCLE_MS = 9000

// 4 portal buttons — centred as a row over the image's button zone
const HERO_BTNS = [
  { label: 'Watch VR Films',     href: '/vr-films'    },
  { label: 'Ascension\nChamber',  href: '/ascension'  },
  { label: 'Explore\nthe Realms', href: '/realms'      },
  { label: 'Watch AI Films',     href: '/ai-films'    },
]

// Tune these two values to align with your art's button positions
const BTN_W   = 220   // button width (px)
const BTN_Y   = 83    // % from top of hero — halfway to bottom

export default function Home2Hero({ heroImages, uiOverlay }: Home2HeroProps) {
  const images = heroImages.length > 0 ? heroImages : ['/images/arcanum-portal-v1.jpg']
  const prefersReducedMotionRaw = useReducedMotion()
  // Guard against SSR/client mismatch: treat as false until mounted on client
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const prefersReducedMotion = mounted ? prefersReducedMotionRaw : false
  const containerRef = useRef<HTMLDivElement>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

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

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-obsidian-200">

      {/* LAYER 1 — cycling backgrounds (fades on scroll, buttons do not) */}
      <motion.div className="absolute inset-0" style={{ opacity: fade, ...px(8) }} transition={{ type: 'spring', stiffness: 50, damping: 20 }}>
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

      {/* LAYER 2 — UI chrome overlay (also fades on scroll) */}
      {uiOverlay && (
        <motion.div className="absolute inset-0 pointer-events-none z-10"
          style={{ opacity: fade }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
        >
          <Image src={uiOverlay} alt="" fill className="object-cover object-center" priority style={{ mixBlendMode: 'screen' }} />
        </motion.div>
      )}

      {/* LAYER 3 — Title + subtitle just below the nav header */}
      <div className="absolute inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none"
        style={{ top: 32 }}>
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
              color: '#f0c050',
              textShadow: '0 2px 4px rgba(0,0,0,1), 0 0 20px rgba(201,151,58,0.8), 0 0 50px rgba(180,120,20,0.5)',
            }}>
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
              A cinematic universe of immersive domeshows &amp; forbidden archives
            </span>
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
              AI Films · mythic worlds · sacred products · dimensional media systems
            </span>
          </p>
        </motion.div>
      </div>

      {/* LAYER 4 — 4 ornate portal buttons centred over image button zone */}
      <div className="absolute inset-x-0 z-20 flex justify-center"
        style={{ top: `${BTN_Y}%`, transform: 'translateY(-50%)' }}>
        <div className="flex gap-4 items-start">
          {HERO_BTNS.map((btn, i) => (
            <motion.div
              key={btn.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.12, ease: 'easeOut' }}
            >
              <BtnOrnate label={btn.label} href={btn.href} width={BTN_W} height={88} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom page fade */}
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
