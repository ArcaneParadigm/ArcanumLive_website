'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { playCrystalBowl } from '@/lib/utils/crystalSound'

const GOLD = '#c9973a'

interface RealmCardProps {
  world: { slug?: string; title?: string; short_description?: string; color_primary?: string }
  isActive: boolean
  onActivate: () => void
  cardImage?: string | null
  onHover?: (slug: string | null) => void
}

export default function RealmCard({ world, isActive, onActivate, cardImage, onHover }: RealmCardProps) {
  const color = world.color_primary ?? GOLD
  const router = useRouter()
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="shrink-0 rounded-lg overflow-hidden flex flex-col"
      style={{
        width: 168,
        aspectRatio: '2/3',
        border: `1px solid ${isActive ? color + 'ee' : color + '40'}`,
        boxShadow: isActive
          ? `0 0 40px ${color}90, 0 0 16px ${color}70, 0 0 4px ${color}cc, inset 0 0 20px ${color}18`
          : hov
            ? `0 0 18px ${color}55, 0 0 6px ${color}30`
            : 'none',
        background: `radial-gradient(ellipse at 50% 20%, ${color}${isActive ? '30' : '22'}, #07050f 75%)`,
      }}
      animate={{ scale: hov || isActive ? 1.05 : 1, y: hov ? -4 : 0 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => {
        setHov(true)
        playCrystalBowl(color, 0.018)
        onHover?.(world.slug ?? null)
      }}
      onMouseLeave={() => {
        setHov(false)
        onHover?.(null)
      }}
    >
      {/* Image area — click activates player */}
      <div className="flex-1 relative cursor-pointer" style={{ minHeight: 0 }} onClick={onActivate}>
        {cardImage ? (
          <img src={cardImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}35, #07050f)` }} />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: isActive
            ? `linear-gradient(to bottom, transparent 30%, ${color}55 100%)`
            : 'linear-gradient(to bottom, transparent 50%, rgba(7,5,15,0.75) 100%)',
        }} />

        {/* Active neon top edge */}
        {isActive && (
          <div className="absolute inset-x-0 top-0 h-px" style={{
            background: `linear-gradient(to right, transparent, ${color}ff 40%, ${color}ff 60%, transparent)`,
            boxShadow: `0 0 8px ${color}`,
          }} />
        )}

        {/* Active pulse ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ border: `2px solid ${color}80` }}
          />
        )}

        {/* Active label */}
        {isActive && (
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase font-cinzel"
              style={{ color, textShadow: `0 0 12px ${color}` }}>▶ Active</span>
          </div>
        )}

        {/* Hover activate hint */}
        {hov && !isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-white/80 text-xl">▶</span>
            <span className="text-[7px] tracking-widest uppercase" style={{ color: `${color}cc` }}>Activate</span>
          </div>
        )}

        {/* Corner mark */}
        <div className="absolute top-1 left-1 w-2 h-2" style={{ borderTop: `1px solid ${color}70`, borderLeft: `1px solid ${color}70` }} />
      </div>

      {/* Bottom bar — title + gold Enter button */}
      <div
        className="shrink-0 px-2 pt-1 pb-1.5"
        style={{ background: isActive ? `${color}28` : 'rgba(7,5,15,0.92)', borderTop: `1px solid ${color}35` }}
      >
        <p
          className="font-cinzel truncate text-center leading-none mb-1"
          style={{ fontSize: 11, color: isActive ? color : 'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}
        >
          {world.title}
        </p>
        {hov && world.short_description && (
          <p className="text-[7px] text-white/40 leading-tight text-center truncate mb-1.5" style={{ lineHeight: 1.3 }}>
            {world.short_description}
          </p>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/realms/${world.slug}`) }}
          className="w-full text-center py-0.5 rounded transition-all"
          style={{
            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: 'Cinzel, serif', fontWeight: 700,
            background: hov
              ? 'linear-gradient(135deg, #6b4411 0%, #c9973a 35%, #f5d06e 55%, #c9973a 75%, #6b4411 100%)'
              : `${color}18`,
            color: hov ? '#07050f' : `${color}80`,
            border: `1px solid ${hov ? '#c9973a' : color + '30'}`,
            boxShadow: hov ? '0 0 8px #c9973a50' : 'none',
          }}
        >
          Enter
        </button>
      </div>
    </motion.div>
  )
}
