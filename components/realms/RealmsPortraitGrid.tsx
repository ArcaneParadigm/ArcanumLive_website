'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { IpWorld } from '@/types'
import { playCrystalBowl } from '@/lib/utils/crystalSound'
import RealmGalleryModal from '@/components/realms/RealmGalleryModal'

const GOLD = '#c9973a'
const COLS = 7

// ── Ornate divider ────────────────────────────────────────────────────────────

function OrnateRule() {
  return (
    <div className="relative flex items-center justify-center py-1 mb-5">
      <div className="absolute inset-x-0 h-px" style={{ top: '44%', background: `linear-gradient(to right, transparent 0%, ${GOLD}50 15%, ${GOLD}50 85%, transparent 100%)` }} />
      <div className="absolute inset-x-0 h-px" style={{ top: '58%', background: `linear-gradient(to right, transparent 0%, ${GOLD}22 20%, ${GOLD}22 80%, transparent 100%)` }} />
      <svg width="260" height="28" viewBox="0 0 260 28" fill="none" className="relative z-10">
        <rect x="123" y="7" width="14" height="14" transform="rotate(45 130 14)" fill="#08060e" stroke={`${GOLD}80`} strokeWidth="1"/>
        <rect x="126" y="10" width="8" height="8" transform="rotate(45 130 14)" fill={`${GOLD}25`} stroke={`${GOLD}50`} strokeWidth="0.5"/>
        <path d="M118 14 Q108 7, 98 14 Q88 21, 78 14 Q68 7, 58 14" stroke={`${GOLD}55`} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <circle cx="56" cy="14" r="2.2" fill="none" stroke={`${GOLD}60`} strokeWidth="0.9"/>
        <circle cx="42" cy="14" r="1.2" fill={`${GOLD}50`}/>
        <path d="M39 14 L20 14" stroke={`${GOLD}30`} strokeWidth="0.7" strokeLinecap="round"/>
        <circle cx="17" cy="14" r="1.5" fill="none" stroke={`${GOLD}35`} strokeWidth="0.7"/>
        <path d="M142 14 Q152 7, 162 14 Q172 21, 182 14 Q192 7, 202 14" stroke={`${GOLD}55`} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <circle cx="204" cy="14" r="2.2" fill="none" stroke={`${GOLD}60`} strokeWidth="0.9"/>
        <circle cx="218" cy="14" r="1.2" fill={`${GOLD}50`}/>
        <path d="M221 14 L240 14" stroke={`${GOLD}30`} strokeWidth="0.7" strokeLinecap="round"/>
        <circle cx="243" cy="14" r="1.5" fill="none" stroke={`${GOLD}35`} strokeWidth="0.7"/>
        <rect x="74" y="11" width="6" height="6" transform="rotate(45 77 14)" fill="#08060e" stroke={`${GOLD}40`} strokeWidth="0.6"/>
        <rect x="177" y="11" width="6" height="6" transform="rotate(45 180 14)" fill="#08060e" stroke={`${GOLD}40`} strokeWidth="0.6"/>
      </svg>
    </div>
  )
}

// ── Portrait card — top area opens gallery, bottom button enters world ─────────

function RealmCard({
  world, cardImage, galleryImages, hovered, onEnter, onOpenGallery,
}: {
  world: Partial<IpWorld>
  cardImage?: string | null
  galleryImages?: string[]
  hovered: boolean
  onEnter: () => void
  onOpenGallery: () => void
}) {
  const color = world.color_primary ?? GOLD
  const router = useRouter()

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shrink-0 flex flex-col w-[calc(50vw-2rem)] sm:w-[163px]"
      style={{
        maxWidth: 163,
        aspectRatio: '3/4',
        background: `radial-gradient(ellipse at 50% 30%, ${color}28, #06040c 80%)`,
        border: `1px solid ${hovered ? color + 'cc' : color + '45'}`,
        boxShadow: hovered
          ? `0 0 28px ${color}60, 0 0 8px ${color}40, 0 12px 40px rgba(0,0,0,0.75)`
          : `0 0 8px ${color}20, 0 4px 16px rgba(0,0,0,0.5)`,
      }}
      animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.04 : 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseEnter={() => { onEnter(); playCrystalBowl(color, 0.025) }}
    >
      {/* Neon top edge on hover */}
      {hovered && (
        <div className="absolute inset-x-0 top-0 z-10 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${color}ee 30%, ${color}ee 70%, transparent)` }} />
      )}

      {/* Ground glow */}
      <motion.div
        className="absolute inset-x-2 pointer-events-none"
        style={{ bottom: -14, height: 22, background: `radial-gradient(ellipse at 50% 0%, ${color}cc, transparent 70%)`, filter: 'blur(7px)' }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* TOP ZONE — click to navigate to full realm page */}
      <div
        className="relative flex-1 cursor-pointer"
        style={{ minHeight: 0 }}
        onClick={() => router.push(`/realms/${world.slug}`)}
      >
        {cardImage && (
          <img src={cardImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        )}
        <div className="absolute inset-0" style={{
          background: hovered
            ? 'linear-gradient(to bottom, rgba(6,4,12,0.0) 30%, rgba(6,4,12,0.82) 100%)'
            : 'linear-gradient(to bottom, rgba(6,4,12,0.0) 40%, rgba(6,4,12,0.78) 100%)',
        }} />
        {/* Corner marks */}
        <div className="absolute top-2 left-2 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid ${color}80`, borderLeft: `1px solid ${color}80` }} />
        <div className="absolute top-2 right-2 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid ${color}60`, borderRight: `1px solid ${color}60` }} />
        {/* Title */}
        <div className="absolute bottom-0 inset-x-0 px-2.5 pb-1.5">
          <p
            className="font-cinzel text-[10px] font-bold leading-snug"
            style={{ color, textShadow: `0 0 12px ${color}80, 0 1px 6px rgba(0,0,0,0.95)` }}
          >
            {world.title}
          </p>
        </div>
      </div>

      {/* BOTTOM ZONE — Enter World button */}
      <button
        onClick={() => router.push(`/realms/${world.slug}`)}
        className="shrink-0 w-full flex items-center justify-center gap-1 py-1.5 transition-all"
        style={{
          background: hovered ? `${color}28` : 'rgba(6,4,12,0.9)',
          borderTop: `1px solid ${color}45`,
          color: hovered ? color : 'rgba(255,255,255,0.65)',
          fontSize: 8,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'Cinzel, serif',
          fontWeight: 600,
        }}
      >
        Enter World →
      </button>
    </motion.div>
  )
}

// ── Info strip ────────────────────────────────────────────────────────────────

function InfoStrip({ world }: { world: Partial<IpWorld> | null }) {
  const color = world?.color_primary ?? GOLD
  return (
    <div
      className="relative w-full flex items-center gap-4 px-5 my-2 rounded-lg overflow-hidden"
      style={{
        height: 54,
        background: 'linear-gradient(90deg, rgba(16,10,26,0.98) 0%, rgba(10,7,18,0.97) 100%)',
        border: `1px solid ${GOLD}40`,
        boxShadow: `inset 0 1px 0 ${GOLD}18, inset 0 -1px 0 ${GOLD}08, 0 4px 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}45 30%, ${GOLD}45 70%, transparent)` }} />
      <svg className="absolute top-0 left-0 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M0 14 L0 5 L5 0 L14 0" stroke={`${GOLD}55`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute top-0 right-0 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M14 14 L14 5 L9 0 L0 0" stroke={`${GOLD}55`} strokeWidth="1" fill="none"/>
      </svg>
      <div className="shrink-0 w-0.5 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, transparent, ${color}90, transparent)` }} />
      {world ? (
        <>
          <p className="font-cinzel text-sm font-bold tracking-widest shrink-0 whitespace-nowrap" style={{ color, textShadow: `0 0 18px ${color}50` }}>{world.title}</p>
          {world.theme_style && (
            <span className="shrink-0 text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded whitespace-nowrap hidden sm:inline font-medium"
              style={{ background: `${color}22`, color, border: `1px solid ${color}50` }}>
              {world.theme_style}
            </span>
          )}
          <span className="shrink-0 text-[8px]" style={{ color: `${GOLD}50` }}>◆</span>
          <p className="flex-1 text-xs truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>{world.short_description}</p>
        </>
      ) : (
        <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Hover a realm · click image to open gallery · Enter World to explore
        </p>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  worlds: Partial<IpWorld>[]
  cardImages: Record<string, string | null>
  galleryImages?: Record<string, string[]>
}

export default function RealmsPortraitGrid({ worlds, cardImages, galleryImages = {} }: Props) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [gallerySlug, setGallerySlug]   = useState<string | null>(null)
  const router = useRouter()

  const rows: Partial<IpWorld>[][] = []
  for (let i = 0; i < worlds.length; i += COLS) rows.push(worlds.slice(i, i + COLS))

  const hoveredRowIdx = rows.findIndex(row => row.some(w => w.slug === hoveredSlug))
  const hoveredWorld  = worlds.find(w => w.slug === hoveredSlug) ?? null
  const galleryWorld  = gallerySlug ? worlds.find(w => w.slug === gallerySlug) : null

  return (
    <div className="px-6 pt-6 pb-10" style={{ background: '#08060e' }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-2">
          <p className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: `${GOLD}90` }}>Select a Realm</p>
          <h2 className="font-cinzel text-2xl font-bold tracking-[0.3em]"
            style={{
              background: 'linear-gradient(135deg, #8a6020 0%, #c9973a 30%, #f5d06e 55%, #c9973a 75%, #8a6020 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 18px rgba(201,151,58,0.4))',
            }}>
            The Realms
          </h2>
        </div>

        <OrnateRule />

        {rows.map((row, rowIdx) => {
          const rowHovered = hoveredRowIdx === rowIdx ? hoveredWorld : null
          return (
            <div key={rowIdx}>
              <div className="flex flex-wrap gap-3 justify-center mb-1">
                {row.map(w => (
                  <RealmCard
                    key={w.id}
                    world={w}
                    cardImage={w.slug ? cardImages[w.slug] : null}
                    galleryImages={w.slug ? galleryImages[w.slug] : undefined}
                    hovered={hoveredSlug === w.slug}
                    onEnter={() => setHoveredSlug(w.slug ?? null)}
                    onOpenGallery={() => setGallerySlug(w.slug ?? null)}
                  />
                ))}
              </div>
              <InfoStrip world={rowHovered} />
            </div>
          )
        })}
      </div>

      {/* Gallery modal */}
      <AnimatePresence>
        {galleryWorld && (
          <RealmGalleryModal
            key={galleryWorld.slug}
            images={gallerySlug ? (galleryImages[gallerySlug] ?? []) : []}
            title={galleryWorld.title ?? ''}
            color={galleryWorld.color_primary ?? GOLD}
            onClose={() => setGallerySlug(null)}
            onEnterWorld={() => { setGallerySlug(null); router.push(`/realms/${galleryWorld.slug}`) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
