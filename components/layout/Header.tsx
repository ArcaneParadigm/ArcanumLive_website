'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { unlockAudio, playCrystalBowl } from '@/lib/utils/crystalSound'

const GOLD = '#c9973a'

const NAV_LINKS = [
  { label: 'Realms',      href: '/realms'     },
  { label: 'Dome Shows',  href: '/dome-shows'  },
  { label: '360 Movies',  href: '/vr-films'   },
  { label: 'Ascension',   href: '/ascension'  },
  { label: 'Altar',       href: '/altar'      },
  { label: 'AI Films',    href: '/ai-films'   },
  { label: 'Store',       href: '/store'      },
  { label: 'Blog',        href: '/blog'       },
  { label: 'Contact',     href: '/contact'    },
  { label: 'VR Play',     href: '/vr-play'   },
  { label: 'Channels',    href: '/channels'  },
]

function NavItem({ link, showPipe }: { link: { label: string; href: string }; showPipe: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <span className="flex items-center">
      {showPipe && <div style={{ width: 2, height: 20, background: `${GOLD}77`, flexShrink: 0, alignSelf: 'center' }} />}
      <Link href={link.href}>
        <motion.span
          className="text-[11px] tracking-[0.18em] uppercase whitespace-nowrap select-none cursor-pointer px-2 py-3.5 mx-[1px] flex items-center rounded relative overflow-hidden"
          style={{
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid transparent',
          }}
          whileHover={{
            color: '#f0d878',
            background: 'linear-gradient(180deg, rgba(201,151,58,0.45) 0%, rgba(201,151,58,0.15) 18%, rgba(201,151,58,0.10) 45%, rgba(201,151,58,0.04) 70%, rgba(0,0,0,0.20) 100%)',
            boxShadow: `inset 0 1px 0 rgba(201,151,58,0.90), inset 0 2px 6px rgba(201,151,58,0.18), inset 0 -1px 0 rgba(0,0,0,0.40), inset 0 -3px 6px rgba(0,0,0,0.18), inset 1px 0 0 rgba(201,151,58,0.18), inset -1px 0 0 rgba(201,151,58,0.18), 0 0 12px rgba(201,151,58,0.15)`,
            border: '1px solid rgba(201,151,58,0.35)',
          }}
          transition={{ duration: 0.15 }}
          onMouseEnter={() => { setHov(true); playCrystalBowl(GOLD, 0.015) }}
          onMouseLeave={() => setHov(false)}
        >
          {hov && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(160,8,8,0.0) 15%, rgba(200,15,15,0.45) 40%, rgba(220,25,25,0.55) 50%, rgba(200,15,15,0.45) 60%, rgba(160,8,8,0.0) 85%, transparent 100%)',
                filter: 'blur(14px)',
              }}
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
            />
          )}
          <span className="relative z-10">{link.label}</span>
        </motion.span>
      </Link>
    </span>
  )
}

export default function Header() {
  const [soundOn, setSoundOn] = useState(true)

  return (
    <motion.header
      className="relative flex items-center justify-between px-6 z-50"
      style={{
        height: 52,
        background: 'linear-gradient(180deg, rgba(18,13,28,0.98) 0%, rgba(10,7,18,0.96) 100%)',
        borderTop:    `1px solid ${GOLD}55`,
        borderBottom: `1px solid ${GOLD}30`,
        borderLeft:   `1px solid ${GOLD}40`,
        borderRight:  `1px solid ${GOLD}40`,
        boxShadow: `inset 0 1px 0 ${GOLD}18, inset 0 -1px 0 ${GOLD}10, inset 0 0 60px rgba(201,151,58,0.06), 0 2px 24px rgba(0,0,0,0.6)`,
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Angled corner cuts */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 22 L0 8 L8 0 L22 0" stroke={`${GOLD}70`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute top-0 right-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 22 L22 8 L14 0 L0 0" stroke={`${GOLD}70`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 0 L0 14 L8 22 L22 22" stroke={`${GOLD}45`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 0 L22 14 L14 22 L0 22" stroke={`${GOLD}45`} strokeWidth="1" fill="none"/>
      </svg>
      {/* Inner glow line */}
      <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}40 20%, ${GOLD}60 50%, ${GOLD}40 80%, transparent)` }} />

      {/* Purple light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(72,20,120,0.35) 20%, rgba(72,20,120,0.5) 35%, rgba(0,0,0,0.4) 50%, rgba(72,20,120,0.5) 65%, rgba(72,20,120,0.35) 80%, transparent 100%)`,
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 37.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo → home2 */}
      <Link href="/">
        <motion.span
          className="font-cinzel text-lg font-bold tracking-wider select-none z-10 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, #8a6020, ${GOLD} 45%, #f0d878 60%, ${GOLD} 75%, #8a6020)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 8px rgba(201,151,58,0.4))',
          }}
          whileHover={{ filter: 'drop-shadow(0 0 14px rgba(201,151,58,0.7))' }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => playCrystalBowl(GOLD, 0.025)}
        >
          Arcanum.Live
        </motion.span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center z-10">
        {NAV_LINKS.map((link, i) => (
          <NavItem key={link.label} link={link} showPipe={i > 0} />
        ))}
      </nav>

      {/* Sound toggle */}
      <motion.button
        className="flex items-center gap-1.5 z-10 select-none cursor-pointer"
        style={{ color: soundOn ? `${GOLD}cc` : 'rgba(255,255,255,0.35)', fontSize: 'clamp(8px, 1.5vw, 11px)', letterSpacing: '0.15em' }}
        whileHover={{ color: soundOn ? GOLD : 'rgba(255,255,255,0.6)' }}
        transition={{ duration: 0.15 }}
        onClick={() => { setSoundOn(s => !s); unlockAudio() }}
        onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
      >
        <span style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>{soundOn ? '🔊' : '🔇'}</span>
        <span className="uppercase tracking-widest text-[9px] hidden sm:inline">
          {soundOn ? 'Sound On' : 'Sound Off'}
        </span>
      </motion.button>
    </motion.header>
  )
}
