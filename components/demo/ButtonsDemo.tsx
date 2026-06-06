'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { playCrystalBowl, unlockAudio } from '@/lib/utils/crystalSound'
import { BtnOrnate, MerkabaSpin } from '@/components/ui/BtnOrnate'

const GOLD   = '#c9973a'
const VIOLET = '#a855f7'
const CYAN   = '#00aaff'
const PINK   = '#ec4899'
const ORANGE = '#f97316'

// ─── Reusable label ──────────────────────────────────────────────────────────
function Label({ text }: { text: string }) {
  return (
    <p className="text-[9px] tracking-[0.4em] uppercase mb-3 font-medium text-white/40">{text}</p>
  )
}
function SectionTitle({ text }: { text: string }) {
  return (
    <h2 className="font-cinzel text-lg font-bold tracking-widest uppercase mb-8 pb-3 border-b"
      style={{ color: GOLD, borderColor: `${GOLD}30` }}>
      {text}
    </h2>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// BUTTONS
// ════════════════════════════════════════════════════════════════════════════

// 1 — Primary CTA (gold filled)
function BtnPrimary({ label = 'Watch Dome Shows', color = GOLD }) {
  return (
    <motion.button
      className="inline-flex items-center w-fit px-4 py-1.5 rounded-lg border text-xs font-medium tracking-widest uppercase"
      style={{ borderColor: color, background: `${color}28`, color }}
      whileHover={{ background: `${color}48`, boxShadow: `0 0 24px ${color}60`, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => playCrystalBowl(color)}
    >
      {label}
    </motion.button>
  )
}

// 1b — Panel primary — antique gold gradient fill, white text
function BtnPanelGold({ label = 'Watch Now', color = GOLD }: { label?: string; color?: string }) {
  return (
    <motion.button
      className="inline-flex w-full items-center justify-center px-4 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase text-white whitespace-nowrap"
      style={{
        background: `linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)`,
        boxShadow: `0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`,
        border: `1px solid #9a7030`,
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
      }}
      whileHover={{ scale: 1.03, boxShadow: `0 4px 20px rgba(160,110,40,0.5), inset 0 1px 0 rgba(255,255,255,0.18)` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => playCrystalBowl(color)}
    >
      {label}
    </motion.button>
  )
}

// 1c — Panel ghost — thin gold border, white text, no fill
function BtnPanelGhost({ label = 'Learn More', color = GOLD }: { label?: string; color?: string }) {
  return (
    <motion.button
      className="inline-flex w-full items-center justify-center px-4 py-1 rounded-md text-[10px] font-medium tracking-wider uppercase text-white/80 whitespace-nowrap"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}60`,
      }}
      whileHover={{ background: 'rgba(255,255,255,0.09)', borderColor: `${color}cc`, color: '#fff', boxShadow: `0 0 16px ${color}30` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => playCrystalBowl(color, 0.06)}
    >
      {label}
    </motion.button>
  )
}

// 1d — Ornate button — imported from @/components/ui/BtnOrnate

// 2 — Ghost (no fill, thin border)
function BtnGhost({ label = 'Learn More', color = GOLD }) {
  return (
    <motion.button
      className="inline-flex items-center w-fit px-4 py-1.5 rounded-lg border text-xs font-medium tracking-widest uppercase"
      style={{ borderColor: `${color}60`, background: `${color}10`, color: `${color}90` }}
      whileHover={{ borderColor: color, color, boxShadow: `0 0 20px ${color}40` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => playCrystalBowl(color, 0.07)}
    >
      {label}
    </motion.button>
  )
}

// 3 — Pill gradient (purple → gold)
function BtnPill({ label = 'Enter the Worlds' }) {
  return (
    <motion.button
      className="inline-flex items-center w-fit px-5 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase text-white"
      style={{ background: `linear-gradient(135deg, #6d28d9, ${VIOLET}, ${GOLD})`, boxShadow: `0 4px 24px ${VIOLET}60` }}
      whileHover={{ scale: 1.04, boxShadow: `0 8px 36px ${VIOLET}80` }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onMouseEnter={() => { playCrystalBowl(VIOLET, 0.09); setTimeout(() => playCrystalBowl(GOLD, 0.06), 80) }}
    >
      {label}
    </motion.button>
  )
}

// 4 — Cinematic bar (underline only, wide)
function BtnCinematic({ label = 'Explore Archive', color = GOLD }) {
  return (
    <motion.button
      className="inline-flex items-center w-fit gap-3 px-2 py-1.5 text-xs font-medium tracking-[0.5em] uppercase relative"
      style={{ color: `${color}80` }}
      whileHover={{ color }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => playCrystalBowl(color, 0.06)}
    >
      {label}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
        initial={{ scaleX: 0.4, opacity: 0.4 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

// 5 — Symbol + text (icon CTA)
function BtnSymbol({ label = 'Ascension Chamber', symbol = '✦', color = VIOLET }) {
  return (
    <motion.button
      className="inline-flex items-center w-fit gap-2 px-4 py-1.5 rounded-xl border font-cinzel text-xs font-bold tracking-widest uppercase"
      style={{ borderColor: `${color}60`, background: `${color}20`, color }}
      whileHover={{ borderColor: color, background: `${color}38`, boxShadow: `0 0 28px ${color}55` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => playCrystalBowl(color)}
    >
      <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        {symbol}
      </motion.span>
      {label}
    </motion.button>
  )
}

// 6 — Crystalline / geometric border
function BtnCrystal({ label = 'Browse 360 Movies', color = CYAN }) {
  return (
    <motion.button
      className="inline-flex items-center w-fit px-4 py-1.5 text-xs font-medium tracking-widest uppercase relative"
      style={{ color }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => playCrystalBowl(color, 0.08)}
    >
      {/* Diamond-cut border via clip-path */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `1px solid ${color}70`,
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          background: `${color}18`,
        }}
        whileHover={{ borderColor: color, background: `${color}35`, boxShadow: `0 0 22px ${color}50` } as never}
        transition={{ duration: 0.2 }}
      />
      <span className="relative z-10">{label}</span>
    </motion.button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// PANELS
// ════════════════════════════════════════════════════════════════════════════

// 7A — Section panel — full-bleed background image, gradient overlay left
function PanelSectionFullBleed({ title, desc, color, btnA = 'Watch Now', btnB = 'Learn More', image, gallery }: {
  title: string; desc: string; color: string; btnA?: string; btnB?: string; image?: string; gallery?: string[]
}) {
  const GALLERY_WORLDS = [
    { color: GOLD }, { color: VIOLET }, { color: CYAN },
    { color: PINK }, { color: ORANGE }, { color: GOLD },
  ]

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border flex-1 cursor-pointer"
      style={{ minHeight: 'clamp(180px, 45vh, 280px)', borderColor: `${color}40`, boxShadow: `0 0 40px ${color}12` }}
      whileHover={{ borderColor: `${color}80`, boxShadow: `0 8px 48px ${color}28`, transition: { duration: 0.2 } }}
      onMouseEnter={() => playCrystalBowl(color, 0.07)}
    >
      {/* Full-bleed art */}
      {image ? (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${color}22 0%, #08060e 65%)` }} />
      )}
      {/* Left gradient overlay */}
      <div className="absolute inset-0"
        style={{ background: gallery
          ? 'linear-gradient(to right, rgba(6,4,12,0.97) 38%, rgba(6,4,12,0.55) 55%, transparent 100%)'
          : 'linear-gradient(to right, rgba(6,4,12,0.95) 40%, rgba(6,4,12,0.6) 65%, transparent 100%)' }} />
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-7 h-7 pointer-events-none"
        style={{ borderTop: `1px solid ${color}70`, borderLeft: `1px solid ${color}70` }} />
      <div className="absolute top-0 right-0 w-7 h-7 pointer-events-none"
        style={{ borderTop: `1px solid ${color}35`, borderRight: `1px solid ${color}35` }} />
      <div className="absolute bottom-0 left-0 w-7 h-7 pointer-events-none"
        style={{ borderBottom: `1px solid ${color}40`, borderLeft: `1px solid ${color}40` }} />
      <div className="absolute bottom-0 right-0 w-7 h-7 pointer-events-none"
        style={{ borderBottom: `1px solid ${color}25`, borderRight: `1px solid ${color}25` }} />

      {/* Content row */}
      <div className="relative z-10 flex items-stretch" style={{ minHeight: 'clamp(200px, 45vh, 320px)' }}>
        {/* Text column */}
        <div className="flex flex-col justify-between p-6" style={{ minWidth: 'clamp(220px, 35vw, 340px)', maxWidth: 'clamp(220px, 35vw, 340px)' }}>
          <div>
            <h3 className="font-cinzel text-2xl font-bold leading-tight mb-2" style={{ color: '#e8dcc8' }}>{title}</h3>
            {/* Double rule lines */}
            <div className="flex flex-col gap-0.5 mb-3" style={{ width: 'clamp(120px, 25vw, 160px)' }}>
              <div className="h-px" style={{ background: `linear-gradient(to right, ${color}80, transparent)` }} />
              <div className="h-px" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-6">{desc}</p>
          </div>
          <div className="flex flex-col gap-2" style={{ width: 'clamp(180px, 30vw, 240px)' }}>
            <BtnPanelGold label={btnA} color={color} />
            <BtnPanelGhost label={btnB} color={color} />
          </div>
        </div>

        {/* Gallery — 9:16 cards filling panel height */}
        {gallery !== undefined && (
          <div className="flex-1 flex flex-row gap-1.5 pr-4 py-3 pl-2 self-stretch">
            {(gallery.length ? gallery.map((src, i) => ({ src, color: GALLERY_WORLDS[i % 6].color })) : GALLERY_WORLDS).map((item, i) => (
              <motion.div key={i}
                className="relative rounded-lg overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '9/16',
                  height: '100%',
                  flexShrink: 0,
                  border: `1px solid ${'src' in item && item.src ? `${GOLD}50` : `${GALLERY_WORLDS[i % 6].color}35`}`,
                  background: `radial-gradient(ellipse at 50% 30%, ${GALLERY_WORLDS[i % 6].color}22, #06040c)`,
                  boxShadow: `0 0 8px ${GALLERY_WORLDS[i % 6].color}10`,
                }}
                whileHover={{ scale: 1.04, borderColor: `${GOLD}80`, boxShadow: `0 4px 20px ${GOLD}30`, transition: { duration: 0.15 } }}
                onMouseEnter={() => playCrystalBowl(GALLERY_WORLDS[i % 6].color, 0.06)}
              >
                {'src' in item && (item as { src: string }).src && (
                  <img src={(item as { src: string }).src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ color: GALLERY_WORLDS[i % 6].color, opacity: 0.18, fontSize: 'clamp(14px, 3vw, 18px)' }}>✦</span>
                </div>
                <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: `1px solid ${GOLD}60`, borderLeft: `1px solid ${GOLD}60` }} />
                <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: `1px solid ${GOLD}40`, borderRight: `1px solid ${GOLD}40` }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// 7B — Section panel — left text, right framed video/image
function PanelSection({ title, desc, color, btnA = 'Watch Now', btnB = 'Learn More', image, video, subtitle }: {
  title: string; desc: string; color: string; btnA?: string; btnB?: string; image?: string; video?: string; subtitle?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border flex-1 cursor-pointer flex"
      style={{ minHeight: 'clamp(160px, 35vh, 260px)', borderColor: `${color}35`, background: 'linear-gradient(135deg, #0d0a18 0%, #08060e 100%)', boxShadow: `0 0 40px ${color}10` }}
      whileHover={{ borderColor: `${color}65`, boxShadow: `0 8px 48px ${color}20`, transition: { duration: 0.2 } }}
      onMouseEnter={() => playCrystalBowl(color, 0.07)}
    >
      {/* Subtle ambient glow top-left */}
      <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}12 0%, transparent 70%)` }} />

      {/* LEFT — text */}
      <div className="flex-1 flex flex-col justify-between p-6 pr-4 relative z-10">
        <div>
          <h3 className="font-cinzel text-2xl font-bold leading-tight mb-3" style={{ color: '#e8dcc8' }}>
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed mb-6">{desc}</p>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <BtnPanelGold label={btnA} color={color} />
          <BtnPanelGhost label={btnB} color={color} />
        </div>
      </div>

      {/* RIGHT — framed image */}
      <div className="shrink-0 flex items-center pr-4 py-4" style={{ width: '44%' }}>
        <div className="relative w-full h-full rounded-xl overflow-hidden"
          style={{ border: `1px solid ${color}40`, boxShadow: `0 0 24px ${color}20, inset 0 0 0 1px rgba(255,255,255,0.04)`, minHeight: 'clamp(120px, 25vh, 180px)' }}>
          {video ? (
            <video
              ref={videoRef}
              src={video}
              poster={image}
              className="w-full h-full object-cover object-center"
              style={{ minHeight: 'clamp(120px, 25vh, 180px)' }}
              loop
              playsInline
            />
          ) : image ? (
            <img src={image} alt="" className="w-full h-full object-cover object-center" style={{ minHeight: 'clamp(120px, 25vh, 180px)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 'clamp(120px, 25vh, 180px)', background: `radial-gradient(ellipse at 50% 40%, ${color}18, #08060e)` }}>
              <span className="text-white/10 text-xs tracking-widest uppercase">Drop trailer</span>
            </div>
          )}
          {/* Play / pause button overlay */}
          <div className="absolute inset-0 flex items-center justify-center" onClick={video ? togglePlay : undefined}>
            <motion.div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.55)', border: `1px solid ${color}70`, backdropFilter: 'blur(4px)' }}
              whileHover={{ scale: 1.12, background: 'rgba(0,0,0,0.75)', borderColor: color }}
              animate={{ opacity: playing ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <span style={{ color: '#e8dcc8', fontSize: 'clamp(12px, 2vw, 16px)', marginLeft: 3 }}>▶</span>
            </motion.div>
          </div>
          {/* Corner accent lines on image frame */}
          <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
            style={{ borderTop: `1px solid ${color}80`, borderLeft: `1px solid ${color}80` }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
            style={{ borderBottom: `1px solid ${color}80`, borderRight: `1px solid ${color}80` }} />
        </div>
      </div>

      {/* Pagination dots — bottom right */}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className="rounded-full" style={{ width: i === 0 ? 'clamp(12px, 2vw, 16px)' : 'clamp(4px, 1vw, 6px)', height: 'clamp(4px, 1vw, 6px)', background: i === 0 ? color : `${color}35` }} />
        ))}
      </div>

      {/* Gold corner accents on outer panel */}
      <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none"
        style={{ borderTop: `1px solid ${color}60`, borderLeft: `1px solid ${color}60` }} />
      <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
        style={{ borderBottom: `1px solid ${color}40`, borderLeft: `1px solid ${color}40` }} />
    </motion.div>
  )
}

// 8 — World card (16:9)
function PanelWorldCard({ title, tag, color }: { title: string; tag: string; color: string }) {
  return (
    <motion.div className="rounded-xl overflow-hidden border cursor-pointer"
      style={{ borderColor: `${color}20`, background: `radial-gradient(ellipse at 50% 30%, ${color}25 0%, #08060e 80%)` }}
      whileHover={{ y: -6, scale: 1.03, boxShadow: `0 12px 40px ${color}30`, transition: { type: 'spring', stiffness: 350, damping: 12 } }}
      onMouseEnter={() => playCrystalBowl(color, 0.08)}>
      <div className="relative" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl opacity-20" style={{ color }}>✦</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ background: 'rgba(8,6,14,0.8)', color: `${color}cc`, border: `1px solid ${color}30` }}>
            {tag}
          </span>
        </div>
        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ boxShadow: `inset 0 0 0 1px ${color}70` }} />
      </div>
      <div className="p-3">
        <h4 className="font-cinzel text-sm font-bold tracking-wide" style={{ color }}>{title}</h4>
        <p className="text-white/50 text-[11px] mt-1 leading-relaxed">Enter this mythic realm →</p>
      </div>
    </motion.div>
  )
}

// 9 — Mode chip (Ascension Chamber)
function PanelModeChip({ label, symbol, desc, color }: { label: string; symbol: string; desc: string; color: string }) {
  return (
    <motion.div className="rounded-xl px-4 py-3 cursor-pointer relative"
      style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, border: `1px solid ${color}30` }}
      whileHover={{ y: -5, scale: 1.05, boxShadow: `0 8px 28px ${color}35`, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
      onMouseEnter={() => playCrystalBowl(color)}>
      <motion.div className="text-xl mb-1.5" style={{ color }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        {symbol}
      </motion.div>
      <p className="font-cinzel text-[11px] font-bold tracking-wide mb-0.5" style={{ color }}>{label}</p>
      <p className="text-[9px] tracking-wide text-white/50">{desc}</p>
      <div className="absolute bottom-0 inset-x-4 h-px rounded-full" style={{ background: `${color}50` }} />
    </motion.div>
  )
}

// 10 — Portal nav card (4-up)
function PanelPortalCard({ title, subtitle, symbol, color }: { title: string; subtitle: string; symbol: string; color: string }) {
  return (
    <motion.div className="rounded-2xl border p-5 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
      style={{ borderColor: `${color}25`, background: `radial-gradient(ellipse at 50% 0%, ${color}10, rgba(8,6,14,0.95) 70%)`, minHeight: 'clamp(120px, 25vh, 180px)' }}
      whileHover={{ y: -8, scale: 1.03, borderColor: `${color}70`, boxShadow: `0 16px 48px ${color}25`, transition: { type: 'spring', stiffness: 350, damping: 12 } }}
      onMouseEnter={() => playCrystalBowl(color, 0.09)}>
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${color}15, transparent)` }} />
      <motion.div className="text-2xl mb-2 relative z-10" style={{ color }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        {symbol}
      </motion.div>
      <p className="text-[8px] tracking-[0.4em] uppercase mb-1 relative z-10" style={{ color: `${color}70` }}>{subtitle}</p>
      <h4 className="font-cinzel text-sm font-bold tracking-wide relative z-10" style={{ color }}>{title}</h4>
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
    </motion.div>
  )
}

// 12 — Portrait realm card (3:4) — tall with art fill + text footer
function PanelPortraitCard({ title, tag, desc, color }: { title: string; tag: string; desc: string; color: string }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border-2 cursor-pointer flex flex-col"
      style={{ aspectRatio: '3/4', borderColor: `${color}55`, background: `radial-gradient(ellipse at 50% 25%, ${color}28 0%, #08060e 70%)`, boxShadow: `0 0 12px ${color}20` }}
      whileHover={{ y: -8, scale: 1.03, borderColor: `${color}cc`, boxShadow: `0 20px 60px ${color}40, 0 0 20px ${color}30`, transition: { type: 'spring', stiffness: 300, damping: 14 } }}
      onMouseEnter={() => playCrystalBowl(color)}
    >
      {/* Art area — top 65% */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Ambient glow orb */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}20 0%, transparent 65%)` }} />
        {/* Symbol placeholder */}
        <motion.span
          className="text-5xl opacity-25 relative z-10"
          style={{ color }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className="text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ background: 'rgba(8,6,14,0.85)', color: `${color}cc`, border: `1px solid ${color}30` }}>
            {tag}
          </span>
        </div>
        {/* Hover border glow */}
        <motion.div className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ boxShadow: `inset 0 0 0 1px ${color}60` }} />
      </div>

      {/* Text footer — bottom 35% */}
      <div className="relative px-4 pt-3 pb-4" style={{ background: `linear-gradient(to bottom, transparent, rgba(6,4,12,0.97))` }}>
        <div className="absolute top-0 inset-x-0 h-8" style={{ background: `linear-gradient(to bottom, transparent, rgba(6,4,12,0.97))` }} />
        <h4 className="font-cinzel text-sm font-bold tracking-wide leading-snug mb-1.5 relative z-10" style={{ color }}>{title}</h4>
        <p className="text-white/50 text-[10px] leading-relaxed line-clamp-2 relative z-10">{desc}</p>
        <motion.div
          className="mt-3 text-[9px] tracking-[0.3em] uppercase font-medium relative z-10"
          style={{ color: `${color}60` }}
          whileHover={{ color } as never}
        >
          Enter realm →
        </motion.div>
        {/* Bottom accent line */}
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}70, transparent)` }} />
      </div>
    </motion.div>
  )
}

// 12b — Portrait realm card — white text + gold edges variant
function PanelPortraitCardWG({ title, tag, desc }: { title: string; tag: string; desc: string }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border-2 cursor-pointer flex flex-col"
      style={{ aspectRatio: '3/4', borderColor: `${GOLD}55`, background: `radial-gradient(ellipse at 50% 25%, ${GOLD}18 0%, #08060e 70%)`, boxShadow: `0 0 12px ${GOLD}20` }}
      whileHover={{ y: -8, scale: 1.03, borderColor: `${GOLD}cc`, boxShadow: `0 20px 60px ${GOLD}40, 0 0 20px ${GOLD}30`, transition: { type: 'spring', stiffness: 300, damping: 14 } }}
      onMouseEnter={() => playCrystalBowl(GOLD)}
    >
      {/* Art area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className="text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ background: 'rgba(8,6,14,0.85)', color: 'rgba(255,255,255,0.9)', border: `1px solid ${GOLD}40` }}>
            {tag}
          </span>
        </div>
        <motion.div className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ boxShadow: `inset 0 0 0 1px ${GOLD}70` }} />
      </div>

      {/* Text footer */}
      <div className="relative px-4 pt-3 pb-4" style={{ background: `linear-gradient(to bottom, transparent, rgba(6,4,12,0.97))` }}>
        <div className="absolute top-0 inset-x-0 h-8" style={{ background: `linear-gradient(to bottom, transparent, rgba(6,4,12,0.97))` }} />
        <h4 className="font-cinzel text-sm font-bold tracking-wide leading-snug mb-1.5 relative z-10 text-white">{title}</h4>
        <p className="text-white/50 text-[10px] leading-relaxed line-clamp-2 relative z-10">{desc}</p>
        <motion.div
          className="mt-3 text-[9px] tracking-[0.3em] uppercase font-medium relative z-10 text-white/50"
          whileHover={{ color: 'rgba(255,255,255,0.9)' } as never}
        >
          Enter realm →
        </motion.div>
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}70, transparent)` }} />
      </div>
    </motion.div>
  )
}

// 13 — Portrait character/product card (3:4) — darker, more editorial
function PanelPortraitCardAlt({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden border-2 cursor-pointer"
      style={{ aspectRatio: '3/4', borderColor: `${color}50`, background: '#06040c', boxShadow: `0 0 10px ${color}18` }}
      whileHover={{ y: -6, borderColor: `${color}cc`, boxShadow: `0 16px 48px ${color}35, 0 0 18px ${color}28`, transition: { type: 'spring', stiffness: 300, damping: 14 } }}
      onMouseEnter={() => playCrystalBowl(color, 0.08)}
    >
      {/* Art zone */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${color}15 0%, transparent 50%, rgba(6,4,12,0.9) 100%)` }} />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20"
        style={{ background: `radial-gradient(circle at top right, ${color}20 0%, transparent 70%)` }} />

      {/* Symbol — large, centred */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span className="text-7xl" style={{ color, opacity: 0.12 }}
          animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
          ◎
        </motion.span>
      </div>

      {/* Bottom text block */}
      <div className="absolute bottom-0 inset-x-0 p-4"
        style={{ background: 'linear-gradient(to top, rgba(6,4,12,1) 60%, transparent)' }}>
        <p className="text-[8px] tracking-[0.4em] uppercase mb-1" style={{ color: `${color}70` }}>{subtitle}</p>
        <h4 className="font-cinzel text-base font-bold tracking-wide" style={{ color }}>{title}</h4>
        {/* Thin divider */}
        <div className="mt-2 h-px" style={{ width: 'clamp(20px, 5vw, 32px)', background: `${color}50` }} />
      </div>
    </motion.div>
  )
}

// 11 — Info/stat card (small)
function PanelInfoCard({ title, value, sub, color }: { title: string; value: string; sub: string; color: string }) {
  return (
    <motion.div className="rounded-xl border p-4 relative overflow-hidden"
      style={{ borderColor: `${color}25`, background: `rgba(8,6,14,0.96)` }}
      whileHover={{ borderColor: `${color}60`, boxShadow: `0 0 24px ${color}15`, transition: { duration: 0.2 } }}>
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)` }} />
      <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-2">{title}</p>
      <p className="font-cinzel text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-white/50 mt-1">{sub}</p>
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SCREENSAVER LAUNCHER BANNER
// ════════════════════════════════════════════════════════════════════════════

const SCREENSAVER_MODES = [
  { label: 'Gallery\nDrift',         symbol: '⬡', color: GOLD   },
  { label: 'Video\nTemple',          symbol: '◎', color: VIOLET },
  { label: 'Music\nReactor',         symbol: '◈', color: CYAN   },
  { label: 'Fluid\nOracle',          symbol: '✦', color: VIOLET },
  { label: 'MythMachine\nShuffle',   symbol: '⟁', color: GOLD   },
]

function ScreensaverBanner({ image, video }: { image?: string; video?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  const [activeMode, setActiveMode] = useState(0)

  return (
    <div className="relative rounded-2xl overflow-hidden flex items-stretch"
      style={{
        background: 'linear-gradient(135deg, #0c0916 0%, #07050e 100%)',
        border: `1px solid ${GOLD}35`,
        boxShadow: `0 0 40px ${GOLD}0a`,
        minHeight: 148,
      }}>

      {/* Corner accents */}
      {[['top-0 left-0','borderTop borderLeft'],['top-0 right-0','borderTop borderRight'],['bottom-0 left-0','borderBottom borderLeft'],['bottom-0 right-0','borderBottom borderRight']].map(([pos, _], i) => (
        <div key={i} className={`absolute ${pos} w-6 h-6 pointer-events-none`} style={{
          borderTop:    (i < 2)  ? `1px solid ${GOLD}70` : undefined,
          borderBottom: (i >= 2) ? `1px solid ${GOLD}50` : undefined,
          borderLeft:   (i % 2 === 0) ? `1px solid ${GOLD}70` : undefined,
          borderRight:  (i % 2 === 1) ? `1px solid ${GOLD}50` : undefined,
        }} />
      ))}

      {/* LEFT — title + desc */}
      <div className="flex flex-col justify-center px-7 py-5" style={{ minWidth: 200, maxWidth: 230 }}>
        <h3 className="font-cinzel text-base font-bold leading-tight mb-2" style={{ color: '#e8dcc8' }}>
          Enter the<br />Ascension Chamber
        </h3>
        <p className="text-white/45 text-xs leading-relaxed">Transform your screen into a living sacred space.</p>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch my-5" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}40, transparent)` }} />

      {/* CENTER — video/image frame */}
      <div className="flex items-center justify-center px-5 py-4" style={{ width: 220 }}>
        <div className="relative w-full rounded-xl overflow-hidden cursor-pointer"
          style={{ aspectRatio: '16/9', border: `1px solid ${GOLD}40`, boxShadow: `0 0 20px ${GOLD}15` }}
          onClick={video ? togglePlay : undefined}>
          {video ? (
            <video ref={videoRef} src={video} poster={image} className="w-full h-full object-cover" loop playsInline />
          ) : image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `radial-gradient(ellipse at 50% 40%, ${GOLD}18, #06040c)` }} />
          )}
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}70`, backdropFilter: 'blur(4px)' }}
              whileHover={{ scale: 1.1, borderColor: GOLD }}
              animate={{ opacity: playing ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <span style={{ color: '#e8dcc8', fontSize: 'clamp(10px, 2vw, 14px)', marginLeft: 2 }}>▶</span>
            </motion.div>
          </div>
          {/* Corner accents on frame */}
          <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none" style={{ borderTop: `1px solid ${GOLD}80`, borderLeft: `1px solid ${GOLD}80` }} />
          <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none" style={{ borderBottom: `1px solid ${GOLD}80`, borderRight: `1px solid ${GOLD}80` }} />
        </div>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch my-5" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}40, transparent)` }} />

      {/* RIGHT — mode selector */}
      <div className="flex-1 flex items-center justify-around px-4 py-4 gap-2">
        {SCREENSAVER_MODES.map((m, i) => (
          <motion.button
            key={m.label}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => { setActiveMode(i); playCrystalBowl(m.color) }}
            onMouseEnter={() => playCrystalBowl(m.color, 0.06)}
            whileHover={{ scale: 1.06, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Icon tile */}
            <div className="relative flex items-center justify-center rounded-xl"
              style={{
                width: 'clamp(50px, 12vw, 60px)', height: 'clamp(50px, 12vw, 60px)',
                background: activeMode === i
                  ? `radial-gradient(ellipse at 50% 30%, ${m.color}35, ${m.color}10)`
                  : `radial-gradient(ellipse at 50% 30%, ${m.color}18, #08060e)`,
                border: `1px solid ${activeMode === i ? `${m.color}80` : `${m.color}35`}`,
                boxShadow: activeMode === i ? `0 0 20px ${m.color}40, inset 0 0 12px ${m.color}15` : 'none',
                transition: 'all 0.2s',
              }}>
              <motion.span
                style={{ color: m.color, fontSize: 'clamp(16px, 3vw, 22px)' }}
                animate={{ scale: activeMode === i ? [1, 1.15, 1] : 1, opacity: activeMode === i ? [0.8, 1, 0.8] : 0.6 }}
                transition={{ duration: 2.5, repeat: activeMode === i ? Infinity : 0, ease: 'easeInOut' }}
              >{m.symbol}</motion.span>
            </div>
            {/* Label */}
            <p className="text-center font-medium leading-tight whitespace-pre-line"
              style={{ fontSize: 'clamp(7px, 1.5vw, 9px)', letterSpacing: '0.05em', color: activeMode === i ? '#e8dcc8' : 'rgba(255,255,255,0.4)' }}>
              {m.label}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SONIC REALMS PANEL
// ════════════════════════════════════════════════════════════════════════════

const SONIC_REALMS = [
  { label: 'Cosmic Anthem',       color: GOLD   },
  { label: 'Sacred Downtempo',    color: VIOLET },
  { label: 'Cyber Ritual',        color: CYAN   },
  { label: 'Dark Oracle',         color: ORANGE },
  { label: 'Festival / Burning Man', color: PINK },
]

function SonicRealmsPanel() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="relative rounded-2xl overflow-hidden p-6"
      style={{ background: 'linear-gradient(135deg, #0c0916 0%, #07050e 100%)', border: `1px solid ${GOLD}35` }}>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-7 h-7 pointer-events-none" style={{ borderTop: `1px solid ${GOLD}70`, borderLeft: `1px solid ${GOLD}70` }} />
      <div className="absolute top-0 right-0 w-7 h-7 pointer-events-none" style={{ borderTop: `1px solid ${GOLD}40`, borderRight: `1px solid ${GOLD}40` }} />
      <div className="absolute bottom-0 left-0 w-7 h-7 pointer-events-none" style={{ borderBottom: `1px solid ${GOLD}40`, borderLeft: `1px solid ${GOLD}40` }} />
      <div className="absolute bottom-0 right-0 w-7 h-7 pointer-events-none" style={{ borderBottom: `1px solid ${GOLD}30`, borderRight: `1px solid ${GOLD}30` }} />

      {/* Header */}
      <h3 className="font-cinzel text-2xl font-bold leading-tight mb-1" style={{ color: '#e8dcc8' }}>Enter the Sonic Realms</h3>
      <div className="flex flex-col gap-0.5 mb-4" style={{ width: 200 }}>
        <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD}80, transparent)` }} />
        <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD}40, transparent)` }} />
      </div>
      <p className="text-white/45 text-sm mb-6">Immersive music for expanded states.</p>

      {/* Card row — each card + label button aligned below */}
      <div className="flex gap-3 mb-6">
        {SONIC_REALMS.map((r, i) => (
          <div key={r.label} className="flex-1 flex flex-col gap-2">
            {/* 2:3 portrait card */}
            <motion.div
              className="relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                aspectRatio: '2/3',
                border: `1px solid ${active === i ? `${r.color}aa` : `${r.color}35`}`,
                background: `radial-gradient(ellipse at 50% 30%, ${r.color}25, #06040c)`,
                boxShadow: active === i ? `0 0 20px ${r.color}35, 0 8px 32px ${r.color}20` : `0 0 8px ${r.color}10`,
              }}
              whileHover={{ scale: 1.03, borderColor: `${r.color}99`, boxShadow: `0 8px 28px ${r.color}30`, transition: { type: 'spring', stiffness: 320, damping: 14 } }}
              onClick={() => { setActive(i); playCrystalBowl(r.color) }}
              onMouseEnter={() => playCrystalBowl(r.color, 0.06)}
            >
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${r.color}20 0%, transparent 65%)` }} />
              {/* Play overlay on hover */}
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${r.color}80`, backdropFilter: 'blur(4px)' }}>
                  <span style={{ color: '#e8dcc8', fontSize: 'clamp(9px, 1.8vw, 13px)', marginLeft: 2 }}>▶</span>
                </div>
              </motion.div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: `1px solid ${GOLD}60`, borderLeft: `1px solid ${GOLD}60` }} />
              <div className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: `1px solid ${GOLD}40`, borderRight: `1px solid ${GOLD}40` }} />
            </motion.div>

            {/* Label button — same width as card above */}
            <motion.button
              className="w-full inline-flex items-center justify-center py-1.5 rounded-lg text-[10px] font-medium tracking-widest uppercase"
              style={{
                background: active === i ? `${r.color}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active === i ? `${r.color}70` : `${GOLD}25`}`,
                color: active === i ? '#e8dcc8' : 'rgba(255,255,255,0.5)',
              }}
              whileHover={{ borderColor: `${r.color}60`, color: '#e8dcc8', background: `${r.color}15` }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setActive(i); playCrystalBowl(r.color) }}
            >
              {r.label}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Listen to All Realms CTA */}
      <div className="flex justify-center">
        <div style={{ width: 'fit-content' }}>
          <BtnPanelGold label="Listen to All Realms" color={GOLD} />
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// WORLDS EXPLORE RAIL
// ════════════════════════════════════════════════════════════════════════════

const WORLDS_DATA = [
  { title: 'Girls of the Multiverse', color: PINK   },
  { title: 'Metahub',                 color: CYAN   },
  { title: 'Goddess',                 color: GOLD   },
  { title: 'Metaburn',                color: ORANGE },
  { title: 'Asian Future Fashion',    color: VIOLET },
  { title: 'JabberWocky',             color: CYAN   },
  { title: 'Ascension',               color: GOLD   },
  { title: 'Kitsune',                 color: ORANGE },
  { title: 'Mermaids',                color: CYAN   },
  { title: 'Nyx Arcana',              color: VIOLET },
  { title: 'Anuhazi Light Codes',     color: GOLD   },
  { title: 'Dominion',                color: PINK   },
]

function WorldsExploreRail() {
  const railRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    railRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  }

  return (
    <div className="relative py-10 px-0"
      style={{ background: 'linear-gradient(180deg, #06040c 0%, #08060e 100%)', border: `1px solid ${GOLD}25`, borderRadius: 4 }}>

      {/* Section title */}
      <div className="flex items-center justify-center gap-4 mb-8 px-6">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50)` }} />
        <div className="flex items-center gap-3">
          <span style={{ color: GOLD, fontSize: 'clamp(9px, 1.8vw, 12px)' }}>◆</span>
          <h2 className="font-cinzel text-lg font-bold tracking-[0.35em] uppercase" style={{ color: '#e8dcc8' }}>
            Explore the Worlds
          </h2>
          <span style={{ color: GOLD, fontSize: 'clamp(9px, 1.8vw, 12px)' }}>◆</span>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD}50)` }} />
      </div>

      {/* Rail + arrows */}
      <div className="relative">
        {/* Left arrow */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
          style={{ width: 'clamp(28px, 8vw, 36px)', height: 'clamp(28px, 8vw, 36px)', background: 'rgba(8,6,14,0.85)', border: `1px solid ${GOLD}40`, color: '#e8dcc8', fontSize: 'clamp(12px, 2.5vw, 16px)' }}
          onClick={() => scroll(-1)}
        >‹</button>

        {/* Cards */}
        <div
          ref={railRef}
          className="flex gap-1.5 overflow-x-auto px-10 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.worlds-rail::-webkit-scrollbar{display:none}`}</style>
          {WORLDS_DATA.map((w) => (
            <motion.div
              key={w.title}
              className="shrink-0 relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                width: 'clamp(80px, 18vw, 108px)',
                aspectRatio: '3/4',
                border: `1px solid ${GOLD}45`,
                background: `radial-gradient(ellipse at 50% 30%, ${w.color}20, #06040c 70%)`,
                boxShadow: `0 0 10px ${GOLD}10`,
              }}
              whileHover={{
                scale: 1.04,
                borderColor: `${GOLD}aa`,
                boxShadow: `0 8px 32px ${GOLD}30, 0 0 16px ${w.color}20`,
                transition: { type: 'spring', stiffness: 320, damping: 14 },
              }}
              onMouseEnter={() => playCrystalBowl(w.color, 0.07)}
            >
              {/* Art placeholder — image will fill this */}
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 35%, ${w.color}25 0%, transparent 65%)` }} />
              {/* Bottom gradient + title */}
              <div className="absolute bottom-0 inset-x-0 p-3"
                style={{ background: 'linear-gradient(to top, rgba(4,3,10,0.97) 50%, transparent)' }}>
                <p className="font-cinzel text-[10px] font-bold tracking-wide leading-tight text-center" style={{ color: '#e8dcc8' }}>
                  {w.title}
                </p>
              </div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
                style={{ borderTop: `1px solid ${GOLD}60`, borderLeft: `1px solid ${GOLD}60` }} />
              <div className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
                style={{ borderTop: `1px solid ${GOLD}60`, borderRight: `1px solid ${GOLD}60` }} />
            </motion.div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
          style={{ width: 'clamp(28px, 8vw, 36px)', height: 'clamp(28px, 8vw, 36px)', background: 'rgba(8,6,14,0.85)', border: `1px solid ${GOLD}40`, color: '#e8dcc8', fontSize: 'clamp(12px, 2.5vw, 16px)' }}
          onClick={() => scroll(1)}
        >›</button>

        {/* Left / right edge fades */}
        <div className="absolute left-8 top-0 bottom-2 w-12 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #07050d 30%, transparent)' }} />
        <div className="absolute right-8 top-0 bottom-2 w-12 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #07050d 30%, transparent)' }} />
      </div>

      {/* View All Worlds CTA */}
      <div className="flex justify-center mt-7">
        <div style={{ width: 'fit-content' }}>
          <BtnPanelGold label="View All Worlds" color={GOLD} />
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// PRODUCTS / STORE PANEL
// ════════════════════════════════════════════════════════════════════════════

function ProductsPanel({ image }: { image?: string }) {
  const STORE_ROW1 = ['Apps', 'Merch']
  const STORE_ROW2 = ['Loops', 'TV Art']
  const STORE_ROW3 = ['Screensavers']

  function PillRow({ items }: { items: string[] }) {
    return (
      <div className="flex gap-1.5 mb-1 flex-nowrap">
        {items.map(c => (
          <motion.span key={c}
            className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full cursor-pointer whitespace-nowrap"
            style={{ border: `1px solid ${ORANGE}50`, color: ORANGE, background: `${ORANGE}12` }}
            whileHover={{ borderColor: ORANGE, color: '#fff', background: `${ORANGE}28` }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => playCrystalBowl(ORANGE, 0.05)}>
            {c}
          </motion.span>
        ))}
      </div>
    )
  }

  return (
    <motion.div className="relative rounded-2xl overflow-hidden h-full cursor-pointer"
      style={{ minHeight: 240, border: `1px solid ${GOLD}40`, boxShadow: `0 0 40px ${GOLD}12` }}
      whileHover={{ borderColor: `${GOLD}80`, transition: { duration: 0.2 } }}
      onMouseEnter={() => playCrystalBowl(GOLD, 0.06)}>
      {image
        ? <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        : <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${GOLD}20 0%, #08060e 65%)` }} />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.97) 30%, rgba(6,4,12,0.80) 42%, rgba(6,4,12,0.20) 58%, transparent 100%)' }} />
      <div className="absolute top-0 left-0 w-7 h-7" style={{ borderTop: `1px solid ${GOLD}70`, borderLeft: `1px solid ${GOLD}70` }} />
      <div className="absolute top-0 right-0 w-7 h-7" style={{ borderTop: `1px solid ${GOLD}35`, borderRight: `1px solid ${GOLD}35` }} />
      <div className="absolute bottom-0 left-0 w-7 h-7" style={{ borderBottom: `1px solid ${GOLD}40`, borderLeft: `1px solid ${GOLD}40` }} />
      <div className="absolute bottom-0 right-0 w-7 h-7" style={{ borderBottom: `1px solid ${GOLD}25`, borderRight: `1px solid ${GOLD}25` }} />
      <div className="relative z-10 px-6 py-5 flex flex-col justify-between" style={{ minHeight: 240, width: 280 }}>
        <div>
          <h3 className="font-cinzel text-base font-bold leading-tight mb-2 whitespace-nowrap" style={{ color: '#e8dcc8' }}>Sacred Products</h3>
          <div className="flex flex-col gap-0.5 mb-3" style={{ width: 140 }}>
            <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD}80, transparent)` }} />
            <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD}40, transparent)` }} />
          </div>
          <p className="text-white/50 text-xs leading-relaxed mb-3">Art, objects and digital experiences for your space.</p>
          <PillRow items={STORE_ROW1} />
          <PillRow items={STORE_ROW2} />
          <PillRow items={STORE_ROW3} />
        </div>
        <div className="mt-3" style={{ width: 140 }}>
          <BtnPanelGold label="Visit the Store" color={GOLD} />
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// LICENSE PANEL
// ════════════════════════════════════════════════════════════════════════════

function LicensePanel({ image }: { image?: string }) {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden flex-1 cursor-pointer"
      style={{ minHeight: 240, border: `1px solid ${GOLD}40`, boxShadow: `0 0 40px ${GOLD}12` }}
      whileHover={{ borderColor: `${GOLD}80`, transition: { duration: 0.2 } }}
      onMouseEnter={() => playCrystalBowl(GOLD, 0.06)}>
      {image
        ? <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        : <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${VIOLET}20 0%, #08060e 65%)` }} />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,4,12,0.97) 30%, rgba(6,4,12,0.80) 42%, rgba(6,4,12,0.20) 58%, transparent 100%)' }} />
      <div className="absolute top-0 left-0 w-7 h-7" style={{ borderTop: `1px solid ${GOLD}70`, borderLeft: `1px solid ${GOLD}70` }} />
      <div className="absolute top-0 right-0 w-7 h-7" style={{ borderTop: `1px solid ${GOLD}35`, borderRight: `1px solid ${GOLD}35` }} />
      <div className="absolute bottom-0 left-0 w-7 h-7" style={{ borderBottom: `1px solid ${GOLD}40`, borderLeft: `1px solid ${GOLD}40` }} />
      <div className="absolute bottom-0 right-0 w-7 h-7" style={{ borderBottom: `1px solid ${GOLD}25`, borderRight: `1px solid ${GOLD}25` }} />
      <div className="relative z-10 px-5 py-5 flex flex-col justify-between" style={{ minHeight: 240 }}>
        <div>
          <h3 className="font-cinzel text-base font-bold leading-tight mb-2" style={{ color: '#e8dcc8' }}>License the Worlds</h3>
          <div className="flex flex-col gap-0.5 mb-3" style={{ width: 120 }}>
            <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD}80, transparent)` }} />
            <div className="h-px" style={{ background: `linear-gradient(to right, ${GOLD}40, transparent)` }} />
          </div>
          <p className="text-white/50 text-xs leading-relaxed mb-4">Bring The Arcanum to your venue, event or platform.</p>
        </div>
        <div className="flex gap-2 mt-3">
          <div style={{ width: 148 }}><BtnPanelGold label="Licensing Inquiry" color={GOLD} /></div>
          <div style={{ width: 110 }}><BtnPanelGhost label="Work With Us" color={GOLD} /></div>
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// CHOOSE YOUR PORTAL
// ════════════════════════════════════════════════════════════════════════════

const PORTAL_ITEMS = [
  { label: 'Gallery',                       sub: '',                        color: VIOLET, glow: '#7c3aed' },
  { label: 'Channels',                      sub: '',                        color: CYAN,   glow: '#00aaff' },
  { label: 'Blog',                          sub: '',                        color: '#14b8a6', glow: '#14b8a6' },
  { label: 'Explore',                       sub: 'The After Dark Collection', color: GOLD, glow: '#c9973a' },
]

function ChoosePortalSection() {
  return (
    <div className="py-10 px-6"
      style={{ background: 'linear-gradient(180deg, #06040c 0%, #08060e 100%)', border: `1px solid ${GOLD}25`, borderRadius: 4 }}>
      {/* Title */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50)` }} />
        <div className="flex items-center gap-3">
          <span style={{ color: GOLD, fontSize: 'clamp(9px, 1.8vw, 12px)' }}>◆</span>
          <h2 className="font-cinzel text-lg font-bold tracking-[0.35em] uppercase" style={{ color: '#e8dcc8' }}>Choose Your Portal</h2>
          <span style={{ color: GOLD, fontSize: 'clamp(9px, 1.8vw, 12px)' }}>◆</span>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD}50)` }} />
      </div>

      {/* Portal cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {PORTAL_ITEMS.map((p) => (
          <motion.div key={p.label}
            className="relative flex flex-col items-center cursor-pointer"
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 320, damping: 14 } }}
            onMouseEnter={() => playCrystalBowl(p.color)}>
            {/* Geometric diamond frame card */}
            <div className="relative w-full rounded-xl flex flex-col items-center justify-center py-6 px-4 mb-3"
              style={{
                border: `1px solid ${GOLD}40`,
                background: `radial-gradient(ellipse at 50% 30%, ${p.color}15 0%, #06040c 70%)`,
                boxShadow: `0 0 20px ${p.glow}10`,
                clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)',
              }}>
              {/* Glowing portal orb */}
              <div className="relative mb-2" style={{ width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)' }}>
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${p.color}50`, boxShadow: `0 0 20px ${p.glow}30` }} />
                {/* Middle ring */}
                <div className="absolute inset-3 rounded-full"
                  style={{ border: `1px solid ${p.color}40`, background: `radial-gradient(circle, ${p.color}20, transparent 70%)` }} />
                {/* Inner glow orb */}
                <motion.div className="absolute inset-6 rounded-full"
                  style={{ background: `radial-gradient(circle, ${p.glow}cc 0%, ${p.color}60 50%, transparent 80%)`, boxShadow: `0 0 16px ${p.glow}80` }}
                  animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
                {/* Decorative cross lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${p.color}30, transparent)` }} />
                  <div className="absolute w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${p.color}30, transparent)` }} />
                </div>
              </div>
              {/* Corner accent marks */}
              <div className="absolute top-2 left-2 w-3 h-3" style={{ borderTop: `1px solid ${GOLD}60`, borderLeft: `1px solid ${GOLD}60` }} />
              <div className="absolute top-2 right-2 w-3 h-3" style={{ borderTop: `1px solid ${GOLD}60`, borderRight: `1px solid ${GOLD}60` }} />
              <div className="absolute bottom-2 left-2 w-3 h-3" style={{ borderBottom: `1px solid ${GOLD}40`, borderLeft: `1px solid ${GOLD}40` }} />
              <div className="absolute bottom-2 right-2 w-3 h-3" style={{ borderBottom: `1px solid ${GOLD}40`, borderRight: `1px solid ${GOLD}40` }} />
            </div>
            {/* Label */}
            <p className="font-cinzel text-xs font-bold tracking-widest uppercase text-center" style={{ color: '#e8dcc8' }}>{p.label}</p>
            {p.sub && <p className="text-[9px] tracking-widest uppercase text-center mt-0.5" style={{ color: GOLD }}>{p.sub}</p>}
            <p className="mt-1 text-white/40" style={{ fontSize: 'clamp(9px, 1.8vw, 12px)' }}>›</p>
          </motion.div>
        ))}
      </div>

      {/* Tagline */}
      <p className="text-center text-[9px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}50` }}>The Arcanum Awaits</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SITE HEADER
// ════════════════════════════════════════════════════════════════════════════

function SiteHeader() {
  const [soundOn, setSoundOn] = useState(true)
  const NAV = ['Realms', 'Dome Shows', '360 Movies', 'Ascension', 'Store', 'Blog', 'Contact']

  return (
    <motion.header
      className="relative flex items-center justify-between px-6"
      style={{
        height: 52,
        background: 'linear-gradient(180deg, rgba(18,13,28,0.98) 0%, rgba(10,7,18,0.96) 100%)',
        borderTop:    `1px solid ${GOLD}55`,
        borderBottom: `1px solid ${GOLD}30`,
        borderLeft:   `1px solid ${GOLD}40`,
        borderRight:  `1px solid ${GOLD}40`,
        boxShadow: `inset 0 1px 0 ${GOLD}18, inset 0 -1px 0 ${GOLD}10, inset 0 0 60px rgba(201,151,58,0.06), 0 2px 24px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Angled corner cuts — top-left */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 22 L0 8 L8 0 L22 0" stroke={`${GOLD}70`} strokeWidth="1" fill="none"/>
      </svg>
      {/* top-right */}
      <svg className="absolute top-0 right-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 22 L22 8 L14 0 L0 0" stroke={`${GOLD}70`} strokeWidth="1" fill="none"/>
      </svg>
      {/* bottom-left */}
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 0 L0 14 L8 22 L22 22" stroke={`${GOLD}45`} strokeWidth="1" fill="none"/>
      </svg>
      {/* bottom-right */}
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 0 L22 14 L14 22 L0 22" stroke={`${GOLD}45`} strokeWidth="1" fill="none"/>
      </svg>

      {/* Inner horizontal glow line under top border */}
      <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}40 20%, ${GOLD}60 50%, ${GOLD}40 80%, transparent)` }} />

      {/* Logo */}
      <motion.a href="#" className="font-cinzel text-lg font-bold tracking-wider select-none z-10"
        style={{
          background: `linear-gradient(135deg, #8a6020, ${GOLD} 45%, #f0d878 60%, ${GOLD} 75%, #8a6020)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 8px rgba(201,151,58,0.4))',
        }}
        whileHover={{ filter: 'drop-shadow(0 0 14px rgba(201,151,58,0.7))' }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => playCrystalBowl(GOLD, 0.07)}
      >
        Arcanum.Live
      </motion.a>

      {/* Nav items */}
      <nav className="flex items-center gap-6 z-10">
        {NAV.map(item => (
          <motion.a key={item} href="#"
            className="text-[11px] tracking-[0.18em] uppercase whitespace-nowrap select-none"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            whileHover={{ color: '#e8dcc8' }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => playCrystalBowl(GOLD, 0.04)}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      {/* Sound toggle */}
      <motion.button
        className="flex items-center gap-1.5 z-10 select-none"
        style={{ color: soundOn ? `${GOLD}cc` : 'rgba(255,255,255,0.35)', fontSize: 'clamp(8px, 1.5vw, 11px)', letterSpacing: '0.15em' }}
        whileHover={{ color: soundOn ? GOLD : 'rgba(255,255,255,0.6)' }}
        transition={{ duration: 0.15 }}
        onClick={() => setSoundOn(s => !s)}
        onMouseEnter={() => playCrystalBowl(GOLD, 0.04)}
      >
        <span style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>{soundOn ? '🔊' : '🔇'}</span>
        <span className="uppercase tracking-widest text-[9px]">{soundOn ? 'Sound On' : 'Sound Off'}</span>
      </motion.button>
    </motion.header>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SITE FOOTER
// ════════════════════════════════════════════════════════════════════════════

function SiteFooter() {
  const NAV_COLS = [
    ['WORLDS', 'DOME SHOWS', '360 MOVIES'],
    ['SCREENSAVER', 'STORE', 'CONTACT'],
    ['ABOUT', 'FAQ', 'LICENSE'],
  ]
  const SOCIALS = [
    {
      label: 'Instagram', color: PINK,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      label: 'YouTube', color: ORANGE,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
        </svg>
      ),
    },
    {
      label: 'X', color: 'rgba(255,255,255,0.7)',
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook', color: '#1877f2',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#06040c', border: `1px solid ${GOLD}25` }}>
      <div className="grid px-8 py-10 border-b" style={{ borderColor: `${GOLD}15`, gridTemplateColumns: '150px 1fr 1fr 1fr 220px', gap: '0 24px' }}>
        {/* Logo + tagline + socials */}
        <div>
          <div className="mb-3 rounded-lg flex items-center justify-center"
            style={{ width: 130, height: 40, background: `${GOLD}12`, border: `1px solid ${GOLD}25` }}>
            <span className="font-cinzel text-xs font-bold tracking-widest" style={{ color: `${GOLD}80` }}>THE ARCANUM</span>
          </div>
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">Mythic worlds. Immersive stories. Infinite portals.</p>
          <div className="flex gap-1.5">
            {SOCIALS.map(s => (
              <motion.div key={s.label}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                style={{ border: `1px solid ${s.color}40`, color: s.color, background: `${s.color}08` }}
                whileHover={{ borderColor: `${s.color}90`, background: `${s.color}18`, scale: 1.08 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => playCrystalBowl(s.color, 0.05)}>
                {s.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {NAV_COLS.map((col, ci) => (
          <div key={ci}>
            {col.map((item, ii) => (
              <motion.p key={item}
                className={`text-[10px] tracking-widest uppercase cursor-pointer ${ii > 0 ? 'mt-2.5' : ''}`}
                style={{ color: ii === 0 ? `${GOLD}90` : 'rgba(255,255,255,0.45)', fontWeight: ii === 0 ? 600 : 400 }}
                whileHover={{ color: '#e8dcc8' }}
                transition={{ duration: 0.15 }}>
                {item}
              </motion.p>
            ))}
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#e8dcc8' }}>Join the Sigil Newsletter</p>
          <p className="text-white/35 text-[9px] leading-relaxed mb-2.5">Updates, premieres and cosmic transmissions.</p>
          <div className="flex gap-1.5">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md outline-none text-white/70 placeholder-white/25"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${GOLD}30`, fontSize: 'clamp(8px, 1.5vw, 10px)' }}
            />
            <motion.button
              className="px-3 py-1.5 rounded-md text-[9px] font-semibold tracking-widest uppercase text-white whitespace-nowrap shrink-0"
              style={{ background: `linear-gradient(135deg, #4a3008, #a87828, #4a3008)`, border: `1px solid #9a7030` }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Subscribe
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 py-4">
        <p className="text-white/25 text-[10px]">© 2025 Arcanum.Live. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Use'].map(t => (
            <motion.p key={t} className="text-white/30 text-[10px] cursor-pointer" whileHover={{ color: 'rgba(255,255,255,0.6)' }}>{t}</motion.p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DEMO PAGE
// ════════════════════════════════════════════════════════════════════════════

export default function ButtonsDemo() {
  // Unlock AudioContext on first click anywhere (browser autoplay policy)
  useEffect(() => {
    const unlock = () => { unlockAudio(); window.removeEventListener('click', unlock) }
    window.addEventListener('click', unlock)
    return () => window.removeEventListener('click', unlock)
  }, [])

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: '#08060e', fontFamily: 'sans-serif' }}>
      <div className="max-w-5xl mx-auto">

        {/* ── SITE HEADER ─────────────────────────────────── */}
        <Label text="00 · Site Header — gold antique edge, internal glow, sound toggle" />
        <div className="mb-12">
          <SiteHeader />
        </div>

        {/* Page title */}
        <div className="mb-14 text-center">
          <h1 className="font-cinzel text-3xl font-bold tracking-[0.3em] uppercase mb-2"
            style={{ background: `linear-gradient(135deg, #6b4411, ${GOLD}, #f5d06e, ${GOLD}, #6b4411)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Component Library
          </h1>
          <p className="text-white/30 text-xs tracking-widest uppercase">Arcanum · Buttons & Panels</p>
          <p className="text-white/20 text-[9px] tracking-widest uppercase mt-2">
            ✦ Click anywhere to unlock · Hover elements to hear crystal bowl tones ✦
          </p>
        </div>

        {/* ── ORNATE BEVEL BUTTON ─────────────────────────────── */}
        <SectionTitle text="Buttons" />
        <Label text="01d · Ornate Bevel Frame — multi-layer stone/bronze octagonal" />
        <div className="flex flex-col items-start gap-4 mb-12">
          <BtnOrnate label="Enter the Arcanum" />
          <BtnOrnate label="Watch Dome Shows" width={300} height={100} />
          <BtnOrnate label="Explore the Worlds" width={420} height={126} />
        </div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-10 mb-16">
          <div>
            <Label text="01 · Primary CTA — Gold" />
            <div className="flex flex-col gap-3">
              <BtnPrimary label="Watch Dome Shows" color={GOLD} />
              <BtnPrimary label="Browse 360 Movies" color={VIOLET} />
              <BtnPrimary label="Explore the Worlds" color={CYAN} />
            </div>
          </div>
          <div>
            <Label text="02 · Ghost — Secondary action" />
            <div className="flex flex-col gap-3">
              <BtnGhost label="License Dome Content" color={GOLD} />
              <BtnGhost label="How to Watch in VR" color={VIOLET} />
              <BtnGhost label="View All Realms" color={CYAN} />
            </div>
          </div>
          <div>
            <Label text="03 · Pill Gradient — Hero CTA" />
            <div className="flex flex-col gap-3">
              <BtnPill label="Enter the Arcanum" />
            </div>
          </div>
          <div>
            <Label text="04 · Cinematic Bar — Minimal" />
            <div className="flex flex-col gap-3">
              <BtnCinematic label="Explore the Archive" color={GOLD} />
              <BtnCinematic label="View All Worlds" color={VIOLET} />
            </div>
          </div>
          <div>
            <Label text="05 · Symbol + Text — Mystical" />
            <div className="flex flex-col gap-3">
              <BtnSymbol label="Ascension Chamber" symbol="✦" color={VIOLET} />
              <BtnSymbol label="Enter the Portal" symbol="◎" color={GOLD} />
              <BtnSymbol label="Crystal Grid" symbol="⬡" color={CYAN} />
            </div>
          </div>
          <div>
            <Label text="06 · Crystalline — Geometric cut" />
            <div className="flex flex-col gap-3">
              <BtnCrystal label="Browse 360 Movies" color={CYAN} />
              <BtnCrystal label="Dome Shows" color={GOLD} />
              <BtnCrystal label="Sacred Archive" color={PINK} />
            </div>
          </div>
        </div>

        {/* ── PANELS ──────────────────────────────────────────── */}
        <SectionTitle text="Panels" />

        {/* Section panels — 07A full-bleed */}
        <Label text="07A · Section Panel — full-bleed background image" />
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <PanelSectionFullBleed
              title="Immersive Dome Shows"
              desc="Cinematic journeys for domes and planetariums."
              color={GOLD}
              btnA="Watch Dome Shows"
              btnB="License Dome Content"
            />
            <PanelSectionFullBleed
              title="Rent 360 Movies for VR"
              desc="Step inside epic stories. Stream directly to your VR headset."
              color={VIOLET}
              btnA="Browse 360 Movies"
              btnB="How to Watch in VR"
            />
          </div>
          {/* Full-width codex panel */}
          <PanelSectionFullBleed
            title="Enter the Codex"
            desc="Secrets, relics and forbidden archives from across the multiverse."
            color={GOLD}
            btnA="Enter the Codex"
            btnB="Explore the Vault"
            gallery={[]}
          />
        </div>

        {/* Section panels — 07B left text / right video */}
        <Label text="07B · Section Panel — left text, right framed trailer" />
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <PanelSection
            title="Immersive Dome Shows"
            desc="Cinematic journeys for domes and planetariums."
            color={GOLD}
            btnA="Watch Dome Shows"
            btnB="License Dome Content"
          />
          <PanelSection
            title="Rent 360 Movies for VR"
            desc="Step inside epic stories. Stream directly to your VR headset."
            color={VIOLET}
            btnA="Browse 360 Movies"
            btnB="How to Watch in VR"
          />
        </div>

        {/* World cards */}
        <Label text="08 · World Card — 16:9 realm card" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <PanelWorldCard title="Girls of the Multiverse" tag="Multiversal" color={PINK} />
          <PanelWorldCard title="Metahub" tag="Digital Nexus" color={CYAN} />
          <PanelWorldCard title="Goddess" tag="Divine Feminine" color={GOLD} />
          <PanelWorldCard title="Metaburn" tag="Fire Festival" color={ORANGE} />
        </div>

        {/* Mode chips */}
        <Label text="09 · Mode Chip — Ascension Chamber modes" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
          <PanelModeChip label="Cosmic Anthem" symbol="✦" desc="Gold orchestral" color={GOLD} />
          <PanelModeChip label="Void Drift" symbol="◈" desc="Deep space" color={VIOLET} />
          <PanelModeChip label="Crystal Grid" symbol="⬡" desc="Sacred geometry" color={CYAN} />
          <PanelModeChip label="Fire Ritual" symbol="⟁" desc="Burning rhythm" color={ORANGE} />
          <PanelModeChip label="Goddess Bloom" symbol="✿" desc="Divine flow" color={PINK} />
        </div>

        {/* Portal nav cards */}
        <Label text="10 · Portal Nav Card — 4-up navigation" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <PanelPortalCard title="Dome Shows" subtitle="Fulldome Cinema" symbol="◎" color={GOLD} />
          <PanelPortalCard title="360 Films" subtitle="VR Streaming" symbol="◉" color={VIOLET} />
          <PanelPortalCard title="The Worlds" subtitle="IP Universe" symbol="✦" color={CYAN} />
          <PanelPortalCard title="Ascension" subtitle="Visualizer" symbol="⬡" color={PINK} />
        </div>

        {/* Sonic Realms panel */}
        <Label text="18 · Sonic Realms Panel — portrait cards + aligned label buttons" />
        <div className="mb-12">
          <SonicRealmsPanel />
        </div>

        {/* Screensaver launcher banner */}
        <Label text="17 · Screensaver Launcher Banner — title / video / mode selector" />
        <div className="mb-12">
          <ScreensaverBanner />
        </div>

        {/* Worlds explore rail */}
        <Label text="16 · Worlds Explore Rail — full section with nav arrows" />
        <div className="mb-12">
          <WorldsExploreRail />
        </div>

        {/* Portrait realm cards — 3:4 */}
        <Label text="12 · Portrait Realm Card — 3:4 with art fill + footer" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <PanelPortraitCard title="Girls of the Multiverse" tag="Multiversal" desc="Multidimensional women warriors navigating parallel universes." color={PINK} />
          <PanelPortraitCard title="Metahub" tag="Digital Nexus" desc="The nexus where all digital realities converge — a living city of data." color={CYAN} />
          <PanelPortraitCard title="Goddess" tag="Divine Feminine" desc="Ancient divine archetypes reimagined through AI and sacred geometry." color={GOLD} />
          <PanelPortraitCard title="Metaburn" tag="Fire Festival" desc="A burning man for the digital age — radical art in infinite deserts." color={ORANGE} />
        </div>

        {/* Portrait editorial cards — 3:4 alt style */}
        <Label text="13 · Portrait Editorial Card — 3:4 darker / character style" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <PanelPortraitCardAlt title="Girls of the Multiverse" subtitle="Multiversal" color={PINK} />
          <PanelPortraitCardAlt title="Metahub" subtitle="Digital Nexus" color={CYAN} />
          <PanelPortraitCardAlt title="Goddess" subtitle="Divine Feminine" color={GOLD} />
          <PanelPortraitCardAlt title="Asian Future Fashion" subtitle="Cyberpunk Couture" color={VIOLET} />
        </div>

        {/* ── FULL-WIDTH REALM RAIL ─────────────────────────── */}
      </div>

      {/* Rail — full viewport width */}
      <div className="mt-4 mb-2 px-8">
        <Label text="14 · Full-Width Realm Rail — horizontal scroll" />
      </div>

      {/* Beveled gold frame — outer layer */}
      <div className="relative mx-6 mb-12"
        style={{
          padding: 2,
          background: `linear-gradient(135deg, ${GOLD}cc 0%, ${GOLD}40 30%, ${GOLD}20 50%, ${GOLD}40 70%, ${GOLD}cc 100%)`,
          clipPath: 'polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)',
          boxShadow: `0 0 32px ${GOLD}25, inset 0 0 20px ${GOLD}08`,
        }}>

        {/* Inner dark background — same bevel clip */}
        <div style={{
          background: '#08060e',
          clipPath: 'polygon(17px 0%, calc(100% - 17px) 0%, 100% 17px, 100% calc(100% - 17px), calc(100% - 17px) 100%, 17px 100%, 0% calc(100% - 17px), 0% 17px)',
        }}>

          {/* Left / right edge fades */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-4 w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #08060e 30%, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-4 w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #08060e 30%, transparent)' }} />

            {/* Scroll rail with gold scrollbar */}
            <div
              className="realm-rail flex gap-3 overflow-x-auto px-8 pt-5 pb-3"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `${GOLD}60 ${GOLD}12`,
              }}
            >
              {/* WebKit scrollbar styles injected via a style tag */}
              <style>{`
                .realm-rail::-webkit-scrollbar { height: 4px; }
                .realm-rail::-webkit-scrollbar-track { background: ${GOLD}12; border-radius: 2px; }
                .realm-rail::-webkit-scrollbar-thumb { background: linear-gradient(90deg, ${GOLD}40, ${GOLD}90, ${GOLD}40); border-radius: 2px; }
                .realm-rail::-webkit-scrollbar-thumb:hover { background: ${GOLD}cc; }
              `}</style>
              {[
                { title: 'Girls of the Multiverse', tag: 'Multiversal',          desc: 'Multidimensional women warriors navigating parallel universes.',                        color: PINK   },
                { title: 'Metahub',                 tag: 'Digital Nexus',        desc: 'The nexus where all digital realities converge.',                                        color: CYAN   },
                { title: 'Goddess',                 tag: 'Divine Feminine',      desc: 'Ancient divine archetypes reimagined through AI and sacred geometry.',                   color: GOLD   },
                { title: 'Metaburn',                tag: 'Fire Festival',        desc: 'A burning man for the digital age — radical art in infinite deserts.',                   color: ORANGE },
                { title: 'Asian Future Fashion',    tag: 'Cyberpunk Couture',    desc: 'Cyberpunk couture meets ancient textile traditions.',                                    color: VIOLET },
                { title: 'JabberWocky',             tag: 'Dream Logic',          desc: 'Nonsense logic, dream physics, and Lewis Carroll chaos.',                                color: CYAN   },
                { title: 'Ascension',               tag: 'Consciousness',        desc: 'Consciousness expansion mapped as architecture, music, and geometric passage.',          color: GOLD   },
                { title: 'Kitsune',                 tag: 'Fox Spirit',           desc: 'Nine-tailed fox spirits weaving illusion and wisdom across shadow dimensions.',          color: PINK   },
                { title: 'Mermaids',                tag: 'Ocean Mythology',      desc: 'Aquatic goddesses of the deep — bioluminescent beauty and the song beneath the surface.',color: CYAN   },
                { title: 'Nyx Arcana',              tag: 'Shadow Arcana',        desc: 'The goddess of night reveals her secret arcana — shadow magic and lunar cycles.',       color: VIOLET },
                { title: 'Anuhazi Light Codes',     tag: 'Light Language',       desc: 'Ancient light language transmission encoded in color, sound, and sacred form.',         color: GOLD   },
                { title: 'Dominion',                tag: 'Celestial Empire',     desc: 'Empires of light and shadow competing across celestial territories.',                   color: ORANGE },
              ].map((w) => (
                <div key={w.title} className="shrink-0" style={{ width: 155 }}>
                  <PanelPortraitCard title={w.title} tag={w.tag} desc={w.desc} color={w.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rail B — white text + gold edges */}
      <div className="mt-4 mb-2 px-8">
        <Label text="14B · Realm Rail — white text / gold edges" />
      </div>

      {/* Beveled gold frame — outer layer */}
      <div className="relative mx-6 mb-12"
        style={{
          padding: 2,
          background: `linear-gradient(135deg, ${GOLD}cc 0%, ${GOLD}40 30%, ${GOLD}20 50%, ${GOLD}40 70%, ${GOLD}cc 100%)`,
          clipPath: 'polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)',
          boxShadow: `0 0 32px ${GOLD}25, inset 0 0 20px ${GOLD}08`,
        }}>
        <div style={{
          background: '#08060e',
          clipPath: 'polygon(17px 0%, calc(100% - 17px) 0%, 100% 17px, 100% calc(100% - 17px), calc(100% - 17px) 100%, 17px 100%, 0% calc(100% - 17px), 0% 17px)',
        }}>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-4 w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #08060e 30%, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-4 w-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #08060e 30%, transparent)' }} />
            <div
              className="realm-rail flex gap-3 overflow-x-auto px-8 pt-5 pb-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: `${GOLD}60 ${GOLD}12` }}
            >
              {[
                { title: 'Girls of the Multiverse', tag: 'Multiversal',       desc: 'Multidimensional women warriors navigating parallel universes.'                        },
                { title: 'Metahub',                 tag: 'Digital Nexus',     desc: 'The nexus where all digital realities converge.'                                        },
                { title: 'Goddess',                 tag: 'Divine Feminine',   desc: 'Ancient divine archetypes reimagined through AI and sacred geometry.'                   },
                { title: 'Metaburn',                tag: 'Fire Festival',     desc: 'A burning man for the digital age — radical art in infinite deserts.'                   },
                { title: 'Asian Future Fashion',    tag: 'Cyberpunk Couture', desc: 'Cyberpunk couture meets ancient textile traditions.'                                    },
                { title: 'JabberWocky',             tag: 'Dream Logic',       desc: 'Nonsense logic, dream physics, and Lewis Carroll chaos.'                                },
                { title: 'Ascension',               tag: 'Consciousness',     desc: 'Consciousness expansion mapped as architecture, music, and geometric passage.'          },
                { title: 'Kitsune',                 tag: 'Fox Spirit',        desc: 'Nine-tailed fox spirits weaving illusion and wisdom across shadow dimensions.'          },
                { title: 'Mermaids',                tag: 'Ocean Mythology',   desc: 'Aquatic goddesses of the deep — bioluminescent beauty and the song beneath the surface.'},
                { title: 'Nyx Arcana',              tag: 'Shadow Arcana',     desc: 'The goddess of night reveals her secret arcana — shadow magic and lunar cycles.'       },
                { title: 'Anuhazi Light Codes',     tag: 'Light Language',    desc: 'Ancient light language transmission encoded in color, sound, and sacred form.'         },
                { title: 'Dominion',                tag: 'Celestial Empire',  desc: 'Empires of light and shadow competing across celestial territories.'                   },
              ].map((w) => (
                <div key={w.title} className="shrink-0" style={{ width: 155 }}>
                  <PanelPortraitCardWG title={w.title} tag={w.tag} desc={w.desc} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8">
        {/* Info/stat cards */}
        <Label text="11 · Info Card — Stats / metadata" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <PanelInfoCard title="Dome Shows" value="12+" sub="Fulldome films available" color={GOLD} />
          <PanelInfoCard title="VR Films" value="360°" sub="Stream to any headset" color={VIOLET} />
          <PanelInfoCard title="Worlds" value="14" sub="Mythic IP universes" color={CYAN} />
          <PanelInfoCard title="Presets" value="5" sub="Ascension modes" color={PINK} />
        </div>


        {/* ── PRODUCTS / STORE PANEL ──────────────────────── */}
        <Label text="19 · Products & Store Panel — full-bleed, side-by-side buttons, category pills" />
        <div className="flex gap-4 mb-12">
          <div style={{ flex: 1 }}><ProductsPanel /></div>
          <div style={{ flex: 1 }}><LicensePanel /></div>
        </div>

        {/* ── CHOOSE YOUR PORTAL ──────────────────────────── */}
        <Label text="20 · Choose Your Portal — glowing orb nav" />
        <div className="mb-12">
          <ChoosePortalSection />
        </div>

        {/* ── SITE FOOTER ─────────────────────────────────── */}
        <Label text="21 · Site Footer — logo / nav / newsletter / social" />
        <div className="mb-12">
          <SiteFooter />
        </div>

        {/* ── FLY-IN ANIMATION DEMO ────────────────────────── */}
        <div className="mt-4 mb-10">
          <SectionTitle text="Card Entrance Animation" />
          <Label text="15 · Portrait Cards — fly in from distance on scroll" />
          <p className="text-white/30 text-[10px] tracking-widest uppercase mb-8">
            ↓ scroll this section into view to trigger · each card launches from distance with spring physics
          </p>

          {/* Row 1 — all fly up from far below, staggered */}
          <p className="text-[9px] tracking-[0.3em] uppercase mb-4 text-white/25">Row A — Rise from below</p>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              { title: 'Girls of the Multiverse', tag: 'Multiversal',     desc: 'Multidimensional women warriors navigating parallel universes.',                  color: PINK   },
              { title: 'Metahub',                 tag: 'Digital Nexus',   desc: 'The nexus where all digital realities converge.',                                  color: CYAN   },
              { title: 'Goddess',                 tag: 'Divine Feminine', desc: 'Ancient divine archetypes reimagined through AI and sacred geometry.',             color: GOLD   },
              { title: 'Metaburn',                tag: 'Fire Festival',   desc: 'A burning man for the digital age — radical art in infinite deserts.',             color: ORANGE },
            ].map((w) => (
              <motion.div key={w.title}
                variants={{
                  hidden: { opacity: 0, y: 280, scale: 0.55, rotate: -6 },
                  show:   { opacity: 1, y: 0,   scale: 1,    rotate: 0,
                    transition: { type: 'spring', stiffness: 160, damping: 14, mass: 1.1 } },
                }}
              >
                <PanelPortraitCard title={w.title} tag={w.tag} desc={w.desc} color={w.color} />
              </motion.div>
            ))}
          </motion.div>

          {/* Row 2 — scatter from all 4 corners */}
          <p className="text-[9px] tracking-[0.3em] uppercase mb-4 text-white/25">Row B — Scatter from corners</p>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              { title: 'Asian Future Fashion', tag: 'Cyberpunk Couture', color: VIOLET, ix: [-320, -240] },
              { title: 'Kitsune',              tag: 'Fox Spirit',        color: ORANGE, ix: [320,  -240] },
              { title: 'Nyx Arcana',           tag: 'Shadow Arcana',     color: VIOLET, ix: [-320,  240] },
              { title: 'Ascension',            tag: 'Consciousness',     color: CYAN,   ix: [320,   240] },
            ].map((w) => (
              <motion.div key={w.title}
                variants={{
                  hidden: { opacity: 0, x: w.ix[0], y: w.ix[1], scale: 0.4, rotate: w.ix[0] > 0 ? 12 : -12 },
                  show:   { opacity: 1, x: 0,        y: 0,        scale: 1,   rotate: 0,
                    transition: { type: 'spring', stiffness: 130, damping: 16, mass: 1.3 } },
                }}
              >
                <PanelPortraitCard
                  title={w.title}
                  tag={w.tag}
                  desc="Enter this mythic realm and discover what lies beyond."
                  color={w.color}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Row 3 — cascade drop, tight stagger, heavy spin */}
          <p className="text-[9px] tracking-[0.3em] uppercase mb-4 text-white/25">Row C — Cascade drop with spin</p>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          >
            {[
              { title: 'Mermaids',         tag: 'Ocean Mythology',    color: CYAN   },
              { title: 'Dominion',         tag: 'Celestial Empire',   color: GOLD   },
              { title: 'JabberWocky',      tag: 'Dream Logic',        color: ORANGE },
              { title: 'Anuhazi Light Codes', tag: 'Light Language',  color: VIOLET },
            ].map((w) => (
              <motion.div key={w.title}
                variants={{
                  hidden: { opacity: 0, y: -380, scale: 0.3, rotate: 25 },
                  show:   { opacity: 1, y: 0,     scale: 1,   rotate: 0,
                    transition: { type: 'spring', stiffness: 200, damping: 18, mass: 0.9 } },
                }}
              >
                <PanelPortraitCard
                  title={w.title}
                  tag={w.tag}
                  desc="A realm unlike any other — awaiting those who dare to enter."
                  color={w.color}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  )
}
