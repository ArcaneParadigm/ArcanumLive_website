'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSharedAudioCtx, playCrystalBowl, getHoverVolumeMultiplier } from '@/lib/utils/crystalSound'
import { YT_CHANNELS } from '@/lib/data/channels'
import type { IpWorld } from '@/types'

const GOLD   = '#c9973a'
const VIOLET = '#a855f7'
const CYAN   = '#00aaff'
const PINK   = '#ec4899'
const ORANGE = '#f97316'

const vp = { once: true, amount: 0.12 }

// ── Crystal bowl synthesizer — uses crystalSound's shared AudioContext ───────
// Same inharmonic overtone series as crystalSound.ts — ratios 1x / 2.756x / 5.404x / 1.003x
// Different *patterns* per context: single strike, staggered triad, octave pair
function bowlStrike(hz: number, ctx: AudioContext, t: number, vol: number, dur = 3.0) {
  const partials = [
    { ratio: 1,     amp: 0.60 },
    { ratio: 2.756, amp: 0.22 },
    { ratio: 5.404, amp: 0.10 },
    { ratio: 1.003, amp: 0.08 },  // slow beat — the "singing" wobble
  ]
  const finalVol = vol * getHoverVolumeMultiplier()
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, t)
  master.gain.linearRampToValueAtTime(finalVol, t + 0.04)  // fast bowl attack
  master.gain.exponentialRampToValueAtTime(0.001, t + dur)
  master.connect(ctx.destination)

  // Short stone-room echo
  const delay = ctx.createDelay(0.4)
  delay.delayTime.setValueAtTime(0.18, t)
  const echoGain = ctx.createGain()
  echoGain.gain.setValueAtTime(finalVol * 0.18, t)
  echoGain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.5)
  master.connect(delay); delay.connect(echoGain); echoGain.connect(ctx.destination)

  partials.forEach(({ ratio, amp }) => {
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(hz * ratio, t)
    osc.frequency.linearRampToValueAtTime(hz * ratio * 1.0008, t + 0.3)
    g.gain.value = amp
    osc.connect(g); g.connect(master)
    osc.start(t); osc.stop(t + dur + 0.1)
  })
}

// Sound palettes — bowl timbre, different strike patterns
const S = {
  // Single bowl — pure solfeggio tone, long ring
  solfeggio: (hz: number) => {
    const ctx = getSharedAudioCtx(); if (!ctx) return
    try { bowlStrike(hz, ctx, ctx.currentTime, 0.0043, 3.2) } catch {}
  },
  // Staggered triad — three bowls, quick cascade (portal energy)
  portal: (root: number) => {
    const ctx = getSharedAudioCtx(); if (!ctx) return
    try {
      const t = ctx.currentTime
      ;[root, root * 1.26, root * 1.498].forEach((hz, i) => bowlStrike(hz, ctx, t + i * 0.065, 0.0043, 2.8))
    } catch {}
  },
  // Two bowls — root + perfect fifth, slight offset (realm depth)
  realm: (hz: number) => {
    const ctx = getSharedAudioCtx(); if (!ctx) return
    try {
      const t = ctx.currentTime
      bowlStrike(hz, ctx, t, 0.0043, 2.5)
      bowlStrike(hz * 1.5, ctx, t + 0.045, 0.0024, 2.2)
    } catch {}
  },
}
// Pentatonic notes for world cards (G major pentatonic across 2 octaves)
const PENTA = [196, 220, 247, 294, 330, 392, 440, 494, 587, 659, 784, 880]

// ── YouTube Subscribe Button ─────────────────────────────────────────────────

function SubscribeBtn({ subscribeUrl, color = '#FF0000' }: { subscribeUrl: string; color?: string }) {
  return (
    <a
      href={subscribeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold tracking-wide uppercase text-white cursor-pointer select-none"
      style={{ background: '#FF0000', boxShadow: `0 2px 10px rgba(255,0,0,0.5)`, whiteSpace: 'nowrap' }}
    >
      <svg width="11" height="8" viewBox="0 0 24 17" fill="white">
        <path d="M23.5 2.6S23.2.8 22.4.1C21.4-.9 20.3-.9 19.8-.8 16.5 0 12 0 12 0s-4.5 0-7.8-.8C3.7-.9 2.6-.9 1.6.1.8.8.5 2.6.5 2.6S.2 4.7.2 6.8v2c0 2 .3 4.2.3 4.2s.3 1.8 1.1 2.5c1 1 2.4.9 3 1C6.6 16.7 12 16.7 12 16.7s4.5 0 7.8-.8c.5-.1 1.6-.1 2.6-1.1.8-.7 1.1-2.5 1.1-2.5s.3-2.1.3-4.2v-2C23.8 4.7 23.5 2.6 23.5 2.6zM9.7 11.5V5.2l6.6 3.2-6.6 3.1z"/>
      </svg>
      Subscribe
    </a>
  )
}

// ── Shared button components ─────────────────────────────────────────────────

function BtnGold({ label, href = '#' }: { label: string; href?: string }) {
  return (
    <Link href={href}>
      <motion.span
        className="inline-flex w-full items-center justify-center px-4 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase text-white whitespace-nowrap cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
          border: '1px solid #9a7030',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
        onMouseEnter={() => playCrystalBowl(GOLD, 0.02)}
        whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(160,110,40,0.5)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
      >{label}</motion.span>
    </Link>
  )
}

function BtnGhost({ label, href = '#', color = GOLD }: { label: string; href?: string; color?: string }) {
  return (
    <Link href={href}>
      <motion.span
        className="inline-flex w-full items-center justify-center px-4 py-1 rounded-md text-[10px] font-medium tracking-wider uppercase text-white whitespace-nowrap cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${color}70`, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
        onMouseEnter={() => playCrystalBowl(color, 0.018)}
        whileHover={{ background: 'rgba(255,255,255,0.10)', borderColor: color, boxShadow: `0 0 16px ${color}40` }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
      >{label}</motion.span>
    </Link>
  )
}

// ── Corner accent marks ───────────────────────────────────────────────────────

function Corners({ color = GOLD }: { color?: string }) {
  return (
    <>
      <div className="absolute top-0 left-0 w-7 h-7" style={{ borderTop: `1px solid ${color}70`, borderLeft: `1px solid ${color}70` }} />
      <div className="absolute top-0 right-0 w-7 h-7" style={{ borderTop: `1px solid ${color}35`, borderRight: `1px solid ${color}35` }} />
      <div className="absolute bottom-0 left-0 w-7 h-7" style={{ borderBottom: `1px solid ${color}40`, borderLeft: `1px solid ${color}40` }} />
      <div className="absolute bottom-0 right-0 w-7 h-7" style={{ borderBottom: `1px solid ${color}25`, borderRight: `1px solid ${color}25` }} />
    </>
  )
}

function DoubleRule({ color = GOLD, width = 160 }: { color?: string; width?: number | string }) {
  return (
    <div className="flex flex-col gap-0.5 mb-3" style={{ width: typeof width === 'string' ? width : `${width}px` }}>
      <div className="h-px" style={{ background: `linear-gradient(to right, ${color}80, transparent)` }} />
      <div className="h-px" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1 — DOME SHOWS + 360 MOVIES
// ════════════════════════════════════════════════════════════════════════════

// Send a command to an embedded YouTube iframe via postMessage
function ytCmd(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
}

function PanelWithVideo({
  title, desc, btnA, btnB, color, image, images, video, youtube, subscribeUrl,
}: {
  title: string; desc: string;
  btnA: { label: string; href: string };
  btnB: { label: string; href: string };
  color: string; image?: string; images?: string[]; video?: string; youtube?: string; subscribeUrl?: string;
}) {
  const vidRef  = useRef<HTMLVideoElement>(null)
  const ytRef   = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(false)
  const allImages = images ?? (image ? [image] : [])
  const [imgIdx, setImgIdx] = useState(0)

  const handlePanelEnter = useCallback(() => {
    if (!youtube) return
    // Stop any other audio/music playing on the page
    document.dispatchEvent(new CustomEvent('arcanum:stop-all-audio'))
    // Unmute the YouTube iframe and raise volume
    ytCmd(ytRef.current, 'unMute')
    ytCmd(ytRef.current, 'setVolume', [60])
  }, [youtube])

  const handlePanelLeave = useCallback(() => {
    if (!youtube) return
    ytCmd(ytRef.current, 'mute')
  }, [youtube])

  useEffect(() => {
    if (allImages.length <= 1) return
    const id = setInterval(() => setImgIdx(i => (i + 1) % allImages.length), 6000)
    return () => clearInterval(id)
  }, [allImages.length])

  function toggle() {
    if (!vidRef.current) return
    playing ? vidRef.current.pause() : vidRef.current.play()
    setPlaying(p => !p)
  }

  return (
    <motion.div
      className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer"
      style={{ minHeight: 'clamp(200px, 40vh, 320px)', border: `1px solid ${color}30`, boxShadow: `0 0 40px ${color}10` }}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      whileHover={{ borderColor: `${color}60` }}
      onMouseEnter={handlePanelEnter}
      onMouseLeave={handlePanelLeave}
    >
      {allImages.length > 0
        ? (
          <AnimatePresence mode="sync">
            <motion.img
              key={imgIdx}
              src={allImages[imgIdx]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        )
        : <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${color}18 0%, #08060e 70%)` }} />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.73) 35%, rgba(6,4,12,0.63) 50%, rgba(6,4,12,0.33) 70%, transparent 100%)' }} />
      <Corners color={color} />

      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex gap-3 sm:gap-4 h-full flex-col sm:flex-row" style={{ minHeight: 'clamp(200px, 40vh, 320px)' }}>
        {/* Text */}
        <div className="flex flex-col justify-between" style={{ minWidth: 'clamp(150px, 20vw, 220px)', maxWidth: 'clamp(150px, 20vw, 220px)' }}>
          <div>
            <h2 className="font-cinzel text-xl font-bold leading-tight mb-2" style={{
              color: '#fff',
              textShadow: `0 0 18px ${color}80, 0 0 40px ${color}40, 0 1px 4px rgba(0,0,0,0.9)`,
            }}>{title}</h2>
            <DoubleRule color={color} width="clamp(100px, 15vw, 140px)" />
            <p className="text-xs leading-relaxed mb-5" style={{
              color: 'rgba(255,255,255,0.88)',
              textShadow: `0 0 14px ${color}60, 0 1px 3px rgba(0,0,0,0.9)`,
              fontSize: 'clamp(11px, 1.5vw, 13px)',
            }}>{desc}</p>
          </div>
          <div className="flex flex-col gap-2" style={{ width: 'clamp(150px, 20vw, 200px)' }}>
            <BtnGold label={btnA.label} href={btnA.href} />
            <BtnGhost label={btnB.label} href={btnB.href} color={color} />
          </div>
        </div>

        {/* Video / image frame — full width, 16:9 */}
        <div className="flex-1 flex items-center self-stretch">
          <div className="relative w-full rounded-xl overflow-hidden"
            style={{ aspectRatio: '16/9', border: `1px solid ${color}30`, background: '#0a0710' }}
            onClick={!youtube ? toggle : undefined}>
            {youtube ? (
              <>
                <iframe
                  ref={ytRef}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&mute=1&loop=1&playlist=${youtube}&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={title}
                  style={{ border: 'none' }}
                />
                <div className="absolute inset-0 z-10" style={{ pointerEvents: 'all', background: 'transparent' }} />
              </>
            ) : (
              <>
                {video && <video ref={vidRef} src={video} className="absolute inset-0 w-full h-full object-cover" loop muted playsInline />}
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}08 0%, transparent 70%)` }} />
                <motion.div className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: playing ? 0 : 1 }} transition={{ duration: 0.3 }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: `${color}30`, border: `1px solid ${color}60`, backdropFilter: 'blur(4px)' }}>
                    <span style={{ color, fontSize: 'clamp(14px, 3vw, 20px)' }}>▶</span>
                  </div>
                </motion.div>
              </>
            )}
            <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none" style={{ borderTop: `1px solid ${color}60`, borderLeft: `1px solid ${color}60` }} />
            <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" style={{ borderBottom: `1px solid ${color}40`, borderRight: `1px solid ${color}40` }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DomeSection() {
  return (
    <section className="px-8 py-2" style={{ background: '#08060e' }}>
      <div className="max-w-6xl mx-auto flex gap-4">
        <PanelWithVideo
          title="Immersive Dome Shows"
          desc="Cinematic journeys for domes and planetariums."
          btnA={{ label: 'Watch Dome Shows', href: '/dome-shows' }}
          btnB={{ label: 'License Dome Content', href: '/contact' }}
          color={GOLD}
          youtube="tvliE1yCUwE"
          images={[
            '/art/home2/panels/watchdomeshow_panel.jpg',
            '/art/home2/panels/immersivedome_p.jpg',
            '/art/home2/panels/immersivedome_p2.jpg',
            '/art/home2/panels/immersivedome_p3.jpg',
            '/art/home2/panels/immersivedome_p4.jpg',
            '/art/home2/panels/immersivedome_p5.jpg',
            '/art/home2/panels/immersivedome_p6.jpg',
            '/art/home2/panels/immersivedome_p7.jpg',
          ]}
        />
        <PanelWithVideo
          title="Rent 360 Movies for VR Headsets"
          desc="Step inside epic stories. Anytime, anywhere."
          btnA={{ label: 'Browse 360 Movies', href: '/watch' }}
          btnB={{ label: 'How to Watch in VR', href: '/watch#vr-guide' }}
          color={VIOLET}
          youtube="0fWRJaLLHxg"
          images={[
            '/art/home2/panels/vr360_panel.jpg',
            '/art/home2/panels/vr360_panel2.jpg',
            '/art/home2/panels/vr360_panel3.jpg',
            '/art/home2/panels/vr360_panel4.jpg',
            '/art/home2/panels/vr360_panel5.jpg',
            '/art/home2/panels/vr360_panel6.jpg',
          ]}
        />
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2 — WORLDS RAIL
// ════════════════════════════════════════════════════════════════════════════

function WorldPortraitCard({ world, cardImage, idx, href }: { world: Partial<IpWorld>; cardImage?: string | null; idx: number; href: string }) {
  const router = useRouter()
  const color = world.color_primary ?? GOLD
  return (
    <motion.div
      className="shrink-0 rounded-xl overflow-hidden cursor-pointer relative"
      style={{ width: 108, aspectRatio: '3/4', border: `1px solid ${color}30`, background: `radial-gradient(ellipse at 50% 30%, ${color}20, #06040c 80%)` }}
      whileHover={{ y: -4, borderColor: `${color}70`, boxShadow: `0 8px 24px ${color}20` }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => S.realm(PENTA[idx % PENTA.length])}
      onClick={() => router.push(href)}
    >
      {cardImage && (
        <img src={cardImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.85) 0%, rgba(6,4,12,0.2) 50%, transparent 100%)' }} />
      <div className="absolute inset-0 flex flex-col justify-end p-2">
        <p className="font-cinzel text-[8px] font-bold leading-tight" style={{ color, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{world.title}</p>
        <p className="text-white/50 text-[7px] mt-0.5 tracking-wider uppercase">Enter realm →</p>
      </div>
      <div className="absolute top-2 left-2 w-3 h-3" style={{ borderTop: `1px solid ${color}50`, borderLeft: `1px solid ${color}50` }} />
      <div className="absolute bottom-2 right-2 w-3 h-3" style={{ borderBottom: `1px solid ${color}30`, borderRight: `1px solid ${color}30` }} />
    </motion.div>
  )
}

function WorldsRail({ worlds, cardImages }: { worlds: Partial<IpWorld>[]; cardImages?: Record<string, string | null> }) {
  const railRef = useRef<HTMLDivElement>(null)
  function scroll(dir: 1 | -1) {
    railRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  }

  return (
    <section className="py-2" style={{ background: '#06040c' }}>
      <div className="max-w-6xl mx-auto px-8">
        {/* Title row */}
        <motion.div className="flex items-center gap-4 mb-3"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.5 }}>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}40)` }} />
          <h2 className="font-cinzel text-sm font-bold tracking-[0.35em] uppercase whitespace-nowrap" style={{ color: '#e8dcc8' }}>
            ◆ Explore the Realms ◆
          </h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD}40)` }} />
        </motion.div>

        {/* Rail + arrows */}
        <div className="relative">
          <button onClick={() => scroll(-1)}
            onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            style={{ background: '#12091e', border: `1px solid ${GOLD}40`, color: `${GOLD}90` }}>
            ‹
          </button>
          <div ref={railRef}
            className="flex gap-1.5 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {worlds.map((w, i) => (
              <WorldPortraitCard key={w.id} world={w} cardImage={w.slug ? cardImages?.[w.slug] : null} idx={i} href={`/realms/${w.slug ?? ''}`} />
            ))}
          </div>
          <button onClick={() => scroll(1)}
            onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            style={{ background: '#12091e', border: `1px solid ${GOLD}40`, color: `${GOLD}90` }}>
            ›
          </button>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-2 mb-3">
          <div style={{ width: 'fit-content' }}>
            <BtnGold label="View All Realms" href="/realms" />
          </div>
        </div>

        {/* Gold divider before next section */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50, ${GOLD}80, ${GOLD}50, transparent)` }} />
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3 — SCREENSAVER BANNER
// ════════════════════════════════════════════════════════════════════════════

const SCREENSAVER_MODES = [
  { label: 'Gallery\nDrift',       symbol: '⬡', color: GOLD,   hz: 396 },
  { label: 'Video\nTemple',        symbol: '◎', color: VIOLET, hz: 417 },
  { label: 'Music\nReactor',       symbol: '◈', color: CYAN,   hz: 528 },
  { label: 'Fluid\nOracle',        symbol: '✦', color: VIOLET, hz: 741 },
  { label: 'MythMachine\nShuffle', symbol: '⟁', color: GOLD,   hz: 963 },
]

function ScreensaverBanner() {
  const [active, setActive] = useState(0)
  const ytRef = useRef<HTMLIFrameElement>(null)

  function onVideoEnter() {
    document.dispatchEvent(new CustomEvent('arcanum:stop-all-audio'))
    ytCmd(ytRef.current, 'unMute')
    ytCmd(ytRef.current, 'setVolume', [60])
  }
  function onVideoLeave() {
    ytCmd(ytRef.current, 'mute')
  }

  return (
    <section className="px-8 py-2" style={{ background: '#08060e' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${VIOLET}30`, boxShadow: `0 0 60px ${VIOLET}08`, minHeight: 300 }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.55 }}
        >
          <img src="/art/home2/panels/launch_ascension_panel.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(160,50,255,0.6) 0%, rgba(120,30,220,0.3) 30%, transparent 50%)', mixBlendMode: 'screen' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,6,14,0.55) 0%, rgba(8,6,14,0.2) 30%, transparent 50%)' }} />
          <Corners color={VIOLET} />

          <div className="relative z-10 flex items-stretch gap-6 p-6" style={{ minHeight: 300 }}>
            {/* Left text */}
            <div className="flex flex-col justify-center" style={{ minWidth: 210 }}>
              <p className="text-[8px] tracking-[0.4em] uppercase mb-2" style={{ color: `${VIOLET}80` }}>Living Visualizer</p>
              <h2 className="font-cinzel text-base font-bold leading-tight mb-2" style={{ color: '#e8dcc8' }}>Launch Ascension Chamber</h2>
              <DoubleRule color={VIOLET} width={130} />
              <p className="text-white/90 text-xs leading-relaxed mb-4">Transform your screen into a living portal.</p>
              <div style={{ width: 180 }}>
                <BtnGold label="Enter the Chamber" href="/ascension" />
              </div>
            </div>

            {/* Center video — YouTube embed */}
            <div className="flex-1 flex items-center self-stretch">
              <div
                className="relative w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: '16/9', border: `1px solid ${VIOLET}35` }}
                onMouseEnter={onVideoEnter}
                onMouseLeave={onVideoLeave}
              >
                <iframe
                  ref={ytRef}
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/4MRrrkrBn_c?autoplay=1&mute=1&loop=1&playlist=4MRrrkrBn_c&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="Ascension Chamber Preview"
                  style={{ border: 'none' }}
                />
                <div className="absolute inset-0 z-10" style={{ pointerEvents: 'all', background: 'transparent' }} />
                <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none" style={{ borderTop: `1px solid ${VIOLET}60`, borderLeft: `1px solid ${VIOLET}60` }} />
                <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none" style={{ borderBottom: `1px solid ${VIOLET}40`, borderRight: `1px solid ${VIOLET}40` }} />
              </div>
            </div>

            {/* Right mode tiles */}
            <div className="flex flex-col gap-1.5 justify-center" style={{ minWidth: 220 }}>
              {SCREENSAVER_MODES.map((m, i) => (
                <motion.div key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer"
                  style={{
                    background: active === i ? `${m.color}CC` : `${m.color}30`,
                    border: `1px solid ${m.color}`,
                    boxShadow: active === i ? `0 0 12px ${m.color}80, inset 0 0 8px ${m.color}30` : `0 0 6px ${m.color}40`,
                  }}
                  onClick={() => setActive(i)}
                  onHoverStart={() => S.solfeggio(m.hz)}
                  whileHover={{ background: `${m.color}99`, boxShadow: `0 0 16px ${m.color}90, inset 0 0 10px ${m.color}40` }}
                  transition={{ duration: 0.15 }}>
                  <span style={{ color: active === i ? '#fff' : m.color, fontSize: 'clamp(12px, 2.5vw, 16px)', lineHeight: 1, filter: `drop-shadow(0 0 4px ${m.color})` }}>{m.symbol}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] tracking-wider uppercase whitespace-pre-line leading-tight font-semibold"
                      style={{ color: active === i ? '#fff' : '#e8dcc8', textShadow: `0 0 8px ${m.color}` }}>
                      {m.label}
                    </span>
                    <span className="text-[8px] tracking-widest font-mono mt-0.5" style={{ color: `${m.color}${active === i ? 'ff' : 'bb'}`, textShadow: `0 0 6px ${m.color}` }}>
                      {m.hz} Hz
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4 — ARCHIVE + SONIC REALMS
// ════════════════════════════════════════════════════════════════════════════

// ── Sacred Geometry SVGs (12D polytope projections) ──────────────────────────

function GeoCosmicSVG({ color }: { color: string }) {
  const ring = (n: number, r: number) =>
    Array.from({ length: n }, (_, i) => ({
      x: 50 + r * Math.sin((i * 2 * Math.PI) / n),
      y: 50 - r * Math.cos((i * 2 * Math.PI) / n),
    }))
  const r12 = ring(12, 44); const r6 = ring(6, 22)
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {[44, 34, 22, 12].map(r => <circle key={r} cx="50" cy="50" r={r} stroke={color} strokeWidth="0.9" strokeOpacity="0.85" />)}
      {r12.map((p, i) => <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke={color} strokeWidth="0.8" strokeOpacity="0.85" />)}
      {r12.map((p, i) => { const q = r12[(i+5)%12]; return <line key={`s${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth="0.7" strokeOpacity="0.65" /> })}
      {r6.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="22" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />)}
      <circle cx="50" cy="50" r="2.5" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

function GeoSacredSVG({ color }: { color: string }) {
  const tri = (r: number, flip: boolean, rot = 0) =>
    Array.from({ length: 3 }, (_, i) => {
      const a = (i * 2 * Math.PI / 3) + (flip ? Math.PI / 3 : 0) + rot
      return { x: 50 + r * Math.sin(a), y: 50 - r * Math.cos(a) }
    })
  const layers: [number, boolean, number][] = [[44,false,0],[44,true,0],[32,false,0.18],[32,true,0.18],[20,false,0.35],[20,true,0.35],[10,false,0]]
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="0.7" strokeOpacity="0.7" />
      {layers.map(([r, flip, rot], i) => {
        const pts = tri(r, flip, rot)
        return <polygon key={i} points={pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} stroke={color} strokeWidth="1.1" strokeOpacity={0.72 + i*0.04} />
      })}
      {[36,24].map(r => <circle key={r} cx="50" cy="50" r={r} stroke={color} strokeWidth="0.6" strokeOpacity="0.65" />)}
      <circle cx="50" cy="50" r="2.5" fill={color} fillOpacity="1" />
    </svg>
  )
}

function GeoCyberSVG({ color }: { color: string }) {
  const hex = (r: number, rot = 0) =>
    Array.from({ length: 6 }, (_, i) => ({
      x: 50 + r * Math.cos((i * Math.PI / 3) + rot),
      y: 50 + r * Math.sin((i * Math.PI / 3) + rot),
    }))
  const out = hex(40); const mid = hex(24, Math.PI/6); const inn = hex(10)
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <polygon points={out.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} stroke={color} strokeWidth="1.1" strokeOpacity="0.9" />
      <polygon points={mid.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} stroke={color} strokeWidth="1.0" strokeOpacity="0.85" />
      <polygon points={inn.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} stroke={color} strokeWidth="0.9" strokeOpacity="0.88" />
      {out.map((o,i) => <line key={i} x1={o.x} y1={o.y} x2={mid[i].x} y2={mid[i].y} stroke={color} strokeWidth="0.7" strokeOpacity="0.75" />)}
      {mid.map((m,i) => <line key={`m${i}`} x1={m.x} y1={m.y} x2={inn[i].x} y2={inn[i].y} stroke={color} strokeWidth="0.65" strokeOpacity="0.7" />)}
      {out.map((o,i) => <line key={`c${i}`} x1={o.x} y1={o.y} x2={50} y2={50} stroke={color} strokeWidth="0.55" strokeOpacity="0.6" />)}
      {out.map((o,i) => { const q=out[(i+3)%6]; return <line key={`x${i}`} x1={o.x} y1={o.y} x2={q.x} y2={q.y} stroke={color} strokeWidth="0.55" strokeOpacity="0.55" /> })}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="0.6" strokeOpacity="0.6" />
      <circle cx="50" cy="50" r="2" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

function GeoOracleSVG({ color }: { color: string }) {
  const pent = (r: number, rot = 0) =>
    Array.from({ length: 5 }, (_, i) => ({
      x: 50 + r * Math.sin((i * 2 * Math.PI / 5) + rot),
      y: 50 - r * Math.cos((i * 2 * Math.PI / 5) + rot),
    }))
  const starOf = (pts: {x:number;y:number}[]) => [0,2,4,1,3].map(i => pts[i])
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {[46,36].map(r => <circle key={r} cx="50" cy="50" r={r} stroke={color} strokeWidth="0.65" strokeOpacity="0.7" />)}
      {[44,30,18,10].map((r,ri) => {
        const pts = pent(r, ri * Math.PI/10); const sp = starOf(pts)
        return <g key={ri}>
          <polygon points={pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} stroke={color} strokeWidth="0.9" strokeOpacity={0.7+ri*0.06} />
          <polygon points={sp.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} stroke={color} strokeWidth="0.85" strokeOpacity={0.65+ri*0.06} />
        </g>
      })}
      {pent(44).map((p,i) => <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke={color} strokeWidth="0.8" strokeOpacity="0.8" />)}
      <circle cx="50" cy="50" r="2.5" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

function GeoMetaburnSVG({ color }: { color: string }) {
  const r6a = Array.from({length:6},(_,i)=>({ x:50+20*Math.sin(i*Math.PI/3), y:50-20*Math.cos(i*Math.PI/3) }))
  const r6b = Array.from({length:6},(_,i)=>({ x:50+40*Math.sin(i*Math.PI/3), y:50-40*Math.cos(i*Math.PI/3) }))
  const centers = [{x:50,y:50},...r6a]
  return (
    <svg viewBox="0 0 100 100" fill="none">
      {centers.map((c,i) => <circle key={i} cx={c.x} cy={c.y} r="20" stroke={color} strokeWidth="0.75" strokeOpacity="0.72" />)}
      {r6b.map((c,i) => <circle key={`b${i}`} cx={c.x} cy={c.y} r="8" stroke={color} strokeWidth="0.6" strokeOpacity="0.65" />)}
      {centers.map((a,i) => centers.slice(i+1).map((b,j) => <line key={`${i}${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="0.55" strokeOpacity="0.6" />))}
      {r6a.map((a,i) => <line key={`r${i}`} x1={a.x} y1={a.y} x2={r6b[i].x} y2={r6b[i].y} stroke={color} strokeWidth="0.55" strokeOpacity="0.6" />)}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="0.65" strokeOpacity="0.65" />
      <circle cx="50" cy="50" r="2" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

const SONIC_REALMS = [
  { label: 'Cosmic',       color: '#e8a800', Geo: GeoCosmicSVG   }, // deep neon gold
  { label: 'Sacred',       color: '#7000ff', Geo: GeoSacredSVG   }, // deep ultraviolet
  { label: 'Cyber Ritual', color: '#0055ff', Geo: GeoCyberSVG    }, // electric cobalt
  { label: 'Dark Oracle',  color: '#f97316', Geo: GeoOracleSVG   }, // ember orange
  { label: 'Metaburn',     color: '#ff0044', Geo: GeoMetaburnSVG }, // red-magenta
]

function FullBleedPanel({
  title, desc, btnA, btnB, color, accentColor, image, images, glowColor,
}: {
  title: string; desc: string;
  btnA: { label: string; href: string };
  btnB?: { label: string; href: string };
  color: string; accentColor?: string; image?: string; images?: string[]; glowColor?: string;
}) {
  const ac = accentColor ?? color
  const allImages = images ?? (image ? [image] : [])
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    if (allImages.length <= 1) return
    const id = setInterval(() => setImgIdx(i => (i + 1) % allImages.length), 6000)
    return () => clearInterval(id)
  }, [allImages.length])

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden flex-1"
      style={{ minHeight: 280, border: `1px solid ${color}30`, boxShadow: `0 0 40px ${color}08` }}
      initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {allImages.length > 0 && (
        <AnimatePresence mode="sync">
          <motion.img
            key={imgIdx}
            src={allImages[imgIdx]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      )}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 12% 50%, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.45) 0%, rgba(6,4,12,0.1) 22%, transparent 42%)' }} />
      <Corners color={color} />

      <div className="relative z-10 px-6 py-6 flex flex-col justify-between" style={{ minHeight: 280, width: 260 }}>
        <div>
          <h2 className="font-cinzel text-lg font-bold leading-tight mb-2" style={{ color: '#e8dcc8', textShadow: '0 0 24px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)' }}>{title}</h2>
          <DoubleRule color={color} width={140} />
          <p className="text-white/90 text-xs leading-relaxed mb-5" style={{ textShadow: '0 0 16px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,0.9)' }}>{desc}</p>
        </div>
        <div className="flex flex-col gap-2" style={{ width: 200 }}>
          <BtnGold label={btnA.label} href={btnA.href} />
          {btnB && <BtnGhost label={btnB.label} href={btnB.href} color={ac} />}
        </div>
      </div>
    </motion.div>
  )
}

function SonicCard({ realm, beat }: { realm: typeof SONIC_REALMS[0]; beat: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="flex-1 rounded-lg overflow-hidden cursor-pointer relative"
      animate={{
        boxShadow: hovered
          ? `0 0 28px ${realm.color}, 0 0 56px ${realm.color}80`
          : beat > 1
            ? `0 0 16px ${realm.color}cc`
            : `0 0 6px ${realm.color}70`,
      }}
      transition={{ boxShadow: { duration: 0.1 } }}
      style={{
        aspectRatio: '2/3',
        border: `1px solid ${realm.color}`,
        background: `radial-gradient(ellipse at 50% 50%, ${realm.color}18 0%, #09060f 70%)`,
        filter: hovered ? `drop-shadow(0 0 9px ${realm.color})` : `drop-shadow(0 0 3px ${realm.color}99)`,
        transition: 'filter 0.2s',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Pulsing rings — concentric energy waves from center */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none" style={{ paddingBottom: '28%' }}>
        {[0, 0.7, 1.4].map(d => (
          <motion.div
            key={d}
            className="absolute rounded-full"
            style={{ border: `1px solid ${realm.color}` }}
            animate={{
              width:   [4, beat > 1 ? 150 : 120],
              height:  [4, beat > 1 ? 150 : 120],
              opacity: [beat > 1 ? 1 : 0.75, 0],
            }}
            transition={{
              duration: beat > 1 ? 1.4 : 2.2,
              repeat: Infinity,
              delay: d,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Sacred geometry — symbol scales on beat; one-shot pop on hover */}
      <div className="absolute inset-x-1 top-2" style={{ bottom: '28%' }}>
        <motion.div
          animate={{ scale: hovered ? 1.2 : beat }}
          transition={hovered
            ? { type: 'spring', stiffness: 260, damping: 18 }
            : { duration: 0.1, ease: 'easeOut' }}
        >
          <motion.div
            style={{ opacity: 1 }}
            animate={{ rotate: hovered ? 360 : [0, 6, -6, 0] }}
            transition={hovered
              ? { duration: 8, repeat: Infinity, ease: 'linear' }
              : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <realm.Geo color={realm.color} />
          </motion.div>
        </motion.div>
      </div>

      {/* Label */}
      <div className="absolute bottom-0 inset-x-0 pb-2 flex items-center justify-center">
        <p className="font-cinzel font-bold text-center leading-tight"
          style={{
            fontSize: 'clamp(0.48rem, 1.05vw, 0.68rem)',
            letterSpacing: '0.08em',
            color: realm.color,
            textShadow: `0 0 ${hovered ? 16 : 8}px ${realm.color}`,
            wordBreak: 'break-word',
            transition: 'text-shadow 0.2s',
          }}>
          {realm.label}
        </p>
      </div>
    </motion.div>
  )
}

function SonicPanel() {
  const [beat, setBeat] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Simulated 120 BPM pulse — replace setBeat with audio analyser data when music is wired
  useEffect(() => {
    let high = false
    const id = setInterval(() => { high = !high; setBeat(high ? 1.038 : 1) }, 500)
    return () => clearInterval(id)
  }, [])

  // Stop preview audio when a video panel takes over
  useEffect(() => {
    const stop = () => audioRef.current?.pause()
    document.addEventListener('arcanum:stop-all-audio', stop)
    return () => document.removeEventListener('arcanum:stop-all-audio', stop)
  }, [])

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden flex-1"
      style={{ minHeight: 280, border: `1px solid ${VIOLET}30`, boxShadow: `0 0 40px ${VIOLET}08`, background: '#06040c' }}
      initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      onHoverStart={() => audioRef.current?.play().catch(() => {})}
    >
      <audio ref={audioRef} src="/audio/sonic-preview.mp3" loop preload="none" />
      <img src="/art/home2/panels/entersonic_panel.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 1 }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 12% 50%, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.45) 0%, rgba(6,4,12,0.1) 22%, transparent 42%)' }} />
      <Corners color={VIOLET} />

      <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
        <div>
          <h2 className="font-cinzel text-lg font-bold leading-tight mb-2" style={{ color: '#e8dcc8', textShadow: '0 0 24px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)' }}>Enter the Sonic Realms</h2>
          <DoubleRule color={VIOLET} width={150} />
          <p className="text-white/90 text-xs leading-relaxed mb-4" style={{ textShadow: '0 0 16px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,0.9)' }}>Immersive music for expanded states.</p>
          <div className="flex gap-2">
            {SONIC_REALMS.map(r => <SonicCard key={r.label} realm={r} beat={beat} />)}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div style={{ width: 'fit-content' }}>
            <BtnGold label="Listen to All Realms" href="/music" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ArchiveAndSonic() {
  return (
    <section className="px-8 py-2" style={{ background: '#06040c' }}>
      <div className="max-w-6xl mx-auto flex gap-4">
        <FullBleedPanel
          title="Enter the Codex"
          desc="Secrets, relics and forbidden archives from across the multiverse."
          btnA={{ label: 'Enter the Codex', href: '/codex' }}
          color={GOLD}
          images={[
            '/art/home2/panels/entercodex_panel.jpg',
            '/art/home2/panels/entercodex_panel1.jpg',
            '/art/home2/panels/entercodex_panel2.jpg',
            '/art/home2/panels/entercodex_panel4.jpg',
          ]}
        />
        <SonicPanel />
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5 — PRODUCTS + LICENSE
// ════════════════════════════════════════════════════════════════════════════

function ProductsSection() {
  const ROW1 = ['Apps', 'Merch']
  const ROW2 = ['Loops', 'TV Art']
  const ROW3 = ['Screensavers']

  function Pills({ items }: { items: string[] }) {
    return (
      <div className="flex gap-1.5 mb-1">
        {items.map(c => (
          <motion.span key={c}
            className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full cursor-pointer whitespace-nowrap"
            style={{ border: `1px solid ${ORANGE}50`, color: ORANGE, background: `${ORANGE}12` }}
            onMouseEnter={() => playCrystalBowl(ORANGE, 0.015)}
            whileHover={{ borderColor: ORANGE, color: '#fff', background: `${ORANGE}28` }}
            transition={{ duration: 0.15 }}>
            {c}
          </motion.span>
        ))}
      </div>
    )
  }

  return (
    <section className="px-8 py-2" style={{ background: '#08060e' }}>
      <div className="max-w-6xl mx-auto flex gap-4">

        {/* Products */}
        <motion.div
          className="relative rounded-2xl overflow-hidden flex-1 cursor-pointer"
          style={{ minHeight: 240, border: `1px solid ${GOLD}40`, boxShadow: `0 0 40px ${GOLD}12` }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.5 }}
          whileHover={{ borderColor: `${GOLD}80` }}
        >
          <img src="/art/home2/panels/sacredprod_panel.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 1 }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 12% 50%, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.45) 0%, rgba(6,4,12,0.1) 22%, transparent 42%)' }} />
          <Corners />
          <div className="relative z-10 px-6 py-2 flex flex-col justify-between" style={{ minHeight: 240, width: 280 }}>
            <div>
              <h3 className="font-cinzel text-base font-bold leading-tight mb-2 whitespace-nowrap" style={{ color: '#e8dcc8', textShadow: '0 0 24px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)' }}>Sacred Products</h3>
              <DoubleRule width={140} />
              <p className="text-white/90 text-xs leading-relaxed mb-3" style={{ textShadow: '0 0 16px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,0.9)' }}>Art, objects and digital experiences for your space.</p>
              <Pills items={ROW1} />
              <Pills items={ROW2} />
              <Pills items={ROW3} />
            </div>
            <div className="mt-3" style={{ width: 140 }}>
              <BtnGold label="Visit the Store" href="/store" />
            </div>
          </div>
        </motion.div>

        {/* License */}
        <motion.div
          className="relative rounded-2xl overflow-hidden flex-1 cursor-pointer"
          style={{ minHeight: 240, border: `1px solid ${GOLD}40`, boxShadow: `0 0 40px ${GOLD}12` }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ borderColor: `${GOLD}80` }}
        >
          <img src="/art/home2/panels/liscenceworlds_panel.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 1 }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 12% 50%, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.45) 0%, rgba(6,4,12,0.1) 22%, transparent 42%)' }} />
          <Corners />
          <div className="relative z-10 px-5 py-2 flex flex-col justify-between" style={{ minHeight: 240 }}>
            <div>
              <h3 className="font-cinzel text-base font-bold leading-tight mb-2" style={{ color: '#e8dcc8', textShadow: '0 0 24px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)' }}>License the Worlds</h3>
              <DoubleRule width={120} />
              <p className="text-white/90 text-xs leading-relaxed mb-4" style={{ textShadow: '0 0 16px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,0.9)' }}>Bring The Arcanum to your venue, event or platform.</p>
            </div>
            <div className="flex gap-2 mt-3">
              <div style={{ width: 148 }}><BtnGold label="Licensing Inquiry" href="/contact#license" /></div>
              <div style={{ width: 110 }}><BtnGhost label="Work With Us" href="/contact" /></div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6 — CHOOSE YOUR PORTAL
// ════════════════════════════════════════════════════════════════════════════

const PORTAL_ITEMS = [
  { label: 'Rent 360 Movies',    sub: '', color: GOLD,   glow: '#c9973a', href: '/dome-shows', image: '/art/home2/panels/watchdome_portal.jpg',          hz: 369 },
  { label: 'VR Films',           sub: '', color: VIOLET, glow: '#7c3aed', href: '/vr-films',   image: '/art/home2/panels/rent360mov_portal.jpg',         hz: 440 },
  { label: 'Launch Screensaver', sub: '', color: CYAN,   glow: '#00aaff', href: '/ascension',  image: '/art/home2/panels/launch_screensaver_portal.jpg', hz: 528 },
  { label: 'Explore the Worlds', sub: '', color: ORANGE, glow: '#f97316', href: '/realms',     image: '/art/home2/panels/exploreworlds_portal.jpg',      hz: 587 },
]

function ChoosePortal() {
  const router = useRouter()
  return (
    <section className="px-8 py-12" style={{ background: '#06040c' }}>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div className="flex items-center gap-4 mb-10 justify-center"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.5 }}>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}40)` }} />
          <h2 className="font-cinzel text-sm font-bold tracking-[0.35em] uppercase whitespace-nowrap" style={{ color: '#e8dcc8' }}>
            ◆ Choose Your Portal ◆
          </h2>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}40)` }} />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-4">
          {PORTAL_ITEMS.map((p, i) => (
            <motion.div key={p.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp}
              transition={{ duration: 0.5, delay: i * 0.07 }}>
              <motion.div
                  className="relative rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center py-6 px-3"
                  onHoverStart={() => S.portal(p.hz)}
                  onClick={() => router.push(p.href)}
                  style={{
                    border: `1px solid ${GOLD}90`,
                    background: `radial-gradient(ellipse at 50% 30%, ${p.color}10 0%, #06040c 70%)`,
                    clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)',
                  }}
                  whileHover={{ borderColor: `${p.color}60`, boxShadow: `0 0 30px ${p.glow}20`, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {p.image && <img src={p.image} alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 1 }} />}
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 62%, rgba(0,0,0,0.72) 0%, transparent 60%)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.5) 0%, transparent 38%)' }} />
                  {/* Portal orb */}
                  <div className="relative mb-4" style={{ width: 80, height: 80, zIndex: 10 }}>
                    <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${p.color}50`, boxShadow: `0 0 20px ${p.glow}30` }} />
                    <div className="absolute inset-3 rounded-full" style={{ border: `1px solid ${p.color}40`, background: `radial-gradient(circle, ${p.color}20, transparent 70%)` }} />
                    <motion.div className="absolute inset-6 rounded-full"
                      style={{ background: `radial-gradient(circle, ${p.glow}cc 0%, ${p.color}60 50%, transparent 80%)`, boxShadow: `0 0 16px ${p.glow}80` }}
                      animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${p.color}30, transparent)` }} />
                      <div className="absolute w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${p.color}30, transparent)` }} />
                    </div>
                  </div>
                  {/* Corner marks — double line with glow */}
                  {/* Top-left */}
                  <div className="absolute" style={{ zIndex: 10, top: 6, left: 6 }}>
                    <div style={{ position: 'absolute', width: 14, height: 14, borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}`, filter: `drop-shadow(0 0 4px ${GOLD}) drop-shadow(0 0 8px ${GOLD}aa)` }} />
                    <div style={{ position: 'absolute', top: 3, left: 3, width: 8, height: 8, borderTop: `1px solid ${GOLD}aa`, borderLeft: `1px solid ${GOLD}aa` }} />
                  </div>
                  {/* Top-right */}
                  <div className="absolute" style={{ zIndex: 10, top: 6, right: 6 }}>
                    <div style={{ position: 'absolute', width: 14, height: 14, borderTop: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, filter: `drop-shadow(0 0 4px ${GOLD}) drop-shadow(0 0 8px ${GOLD}aa)` }} />
                    <div style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderTop: `1px solid ${GOLD}aa`, borderRight: `1px solid ${GOLD}aa` }} />
                  </div>
                  {/* Bottom-left */}
                  <div className="absolute" style={{ zIndex: 10, bottom: 6, left: 6 }}>
                    <div style={{ position: 'absolute', width: 14, height: 14, borderBottom: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}`, filter: `drop-shadow(0 0 4px ${GOLD}) drop-shadow(0 0 8px ${GOLD}aa)` }} />
                    <div style={{ position: 'absolute', bottom: 3, left: 3, width: 8, height: 8, borderBottom: `1px solid ${GOLD}aa`, borderLeft: `1px solid ${GOLD}aa` }} />
                  </div>
                  {/* Bottom-right */}
                  <div className="absolute" style={{ zIndex: 10, bottom: 6, right: 6 }}>
                    <div style={{ position: 'absolute', width: 14, height: 14, borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, filter: `drop-shadow(0 0 4px ${GOLD}) drop-shadow(0 0 8px ${GOLD}aa)` }} />
                    <div style={{ position: 'absolute', bottom: 3, right: 3, width: 8, height: 8, borderBottom: `1px solid ${GOLD}aa`, borderRight: `1px solid ${GOLD}aa` }} />
                  </div>

                  <p className="relative font-cinzel text-[11px] font-bold tracking-widest uppercase text-center mb-0.5" style={{ zIndex: 10, color: '#fff', textShadow: '0 0 16px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)' }}>{p.label}</p>
                  <p className="relative text-white/80 text-[9px] tracking-widest uppercase" style={{ zIndex: 10, textShadow: '0 0 8px rgba(0,0,0,1)' }}>›</p>
                </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.p className="text-center text-[9px] tracking-[0.4em] uppercase mt-8" style={{ color: `${GOLD}50` }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp} transition={{ duration: 0.6, delay: 0.3 }}>
          The Arcanum Awaits
        </motion.p>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7 — FOOTER
// ════════════════════════════════════════════════════════════════════════════

const NAV_COLS = [
  ['WORLDS', 'DOME SHOWS', '360 MOVIES'],
  ['SCREENSAVER', 'STORE', 'CONTACT'],
  ['ABOUT', 'FAQ', 'LICENSE'],
]

const NAV_HREFS: Record<string, string> = {
  'WORLDS': '/realms', 'DOME SHOWS': '/dome-shows', '360 MOVIES': '/watch',
  'SCREENSAVER': '/ascension', 'STORE': '/store', 'CONTACT': '/contact',
  'ABOUT': '/about', 'FAQ': '/faq', 'LICENSE': '/contact#license',
}

const SOCIALS = [
  { label: 'Instagram', color: PINK,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label: 'YouTube', color: ORANGE,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
  { label: 'X', color: 'rgba(255,255,255,0.7)',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'Facebook', color: '#1877f2',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
]

function SiteFooter() {
  return (
    <footer style={{ background: '#06040c', borderTop: `1px solid ${GOLD}20` }}>
      <div className="max-w-6xl mx-auto px-8 py-2">
        <div className="grid" style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 220px', gap: '0 24px' }}>
          {/* Logo + tagline + socials */}
          <div>
            <Link href="/home2">
              <div className="mb-3 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ width: 130, height: 40, background: `${GOLD}12`, border: `1px solid ${GOLD}25` }}>
                <span className="font-cinzel text-xs font-bold tracking-widest" style={{ color: `${GOLD}80` }}>THE ARCANUM</span>
              </div>
            </Link>
            <p className="text-white/35 text-[10px] leading-relaxed mb-4">Mythic worlds. Immersive stories. Infinite portals.</p>
            <div className="flex gap-1.5">
              {SOCIALS.map(s => (
                <motion.div key={s.label}
                  className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ border: `1px solid ${s.color}40`, color: s.color, background: `${s.color}08` }}
                  onMouseEnter={() => playCrystalBowl(s.color, 0.015)}
                  whileHover={{ borderColor: `${s.color}90`, background: `${s.color}18`, scale: 1.08 }}
                  transition={{ duration: 0.15 }}>
                  {s.icon}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col, ci) => (
            <div key={ci}>
              {col.map((item, ii) => (
                <Link key={item} href={NAV_HREFS[item] ?? '#'}>
                  <motion.p
                    className={`text-[10px] tracking-widest uppercase cursor-pointer ${ii > 0 ? 'mt-2.5' : ''}`}
                    style={{ color: ii === 0 ? `${GOLD}90` : 'rgba(255,255,255,0.45)', fontWeight: ii === 0 ? 600 : 400 }}
                    onMouseEnter={() => playCrystalBowl(GOLD, 0.012)}
                    whileHover={{ color: '#e8dcc8' }} transition={{ duration: 0.15 }}>
                    {item}
                  </motion.p>
                </Link>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#e8dcc8' }}>Join the Sigil Newsletter</p>
            <p className="text-white/35 text-[9px] leading-relaxed mb-2.5">Updates, premieres and cosmic transmissions.</p>
            <div className="flex gap-1.5">
              <input type="email" placeholder="Your email address"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md outline-none text-white/70 placeholder-white/25"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${GOLD}30`, fontSize: 'clamp(8px, 1.5vw, 10px)' }} />
              <motion.button
                className="px-3 py-1.5 rounded-md text-[9px] font-semibold tracking-widest uppercase text-white whitespace-nowrap shrink-0"
                style={{ background: 'linear-gradient(135deg, #4a3008, #a87828, #4a3008)', border: '1px solid #9a7030' }}
                onMouseEnter={() => playCrystalBowl(GOLD, 0.02)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: `${GOLD}15` }}>
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <p className="text-white/25 text-[10px]">© 2025 Arcanum.Live. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use'].map(t => (
              <motion.a key={t} href="#" className="text-white/30 text-[10px] cursor-pointer"
                whileHover={{ color: 'rgba(255,255,255,0.6)' }}>{t}</motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════════════════

interface Home2ContentProps {
  worlds: Partial<IpWorld>[]
  cardImages?: Record<string, string | null>
}

export default function Home2Content({ worlds, cardImages }: Home2ContentProps) {
  return (
    <>
      <DomeSection />
      <WorldsRail worlds={worlds} cardImages={cardImages} />
      <ScreensaverBanner />
      <ArchiveAndSonic />
      <ProductsSection />
      <ChoosePortal />
      <SiteFooter />
    </>
  )
}
