'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { unlockAudio, playCrystalBowl } from '@/lib/utils/crystalSound'

const GOLD   = '#c9973a'
const NAV_LINKS = [
  { label: 'Realms',      href: '/realms' },
  { label: 'Dome Shows',  href: '/dome-shows' },
  { label: '360 Movies',  href: '/vr-films' },
  { label: 'Ascension',   href: '/ascension' },
  { label: 'Altar',       href: '/altar' },
  { label: 'AI Films',    href: '/ai-films' },
  { label: 'Store',       href: '/store' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Contact',     href: '/contact' },
  { label: 'VR Play',     href: '/vr-play' },
  { label: 'Channels',    href: '/channels' },
]

export default function Home2Nav() {
  const [soundOn, setSoundOn] = useState(true)

  return (
    <motion.header
      className="relative flex items-center justify-between px-6 z-50"
      style={{
        height: 52,
        background: 'linear-gradient(180deg, rgba(18,13,28,0.98) 0%, rgba(10,7,18,0.96) 100%)',
        borderTop:    `1px solid ${GOLD}d9`,
        borderBottom: `1px solid ${GOLD}cc`,
        borderLeft:   `1px solid ${GOLD}d9`,
        borderRight:  `1px solid ${GOLD}d9`,
        boxShadow: `inset 0 1px 0 ${GOLD}cc, inset 0 -1px 0 ${GOLD}b3, inset 0 0 60px rgba(201,151,58,0.25), 0 2px 24px rgba(0,0,0,0.6)`,
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Angled corner cuts */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 22 L0 8 L8 0 L22 0" stroke={`${GOLD}cc`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute top-0 right-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 22 L22 8 L14 0 L0 0" stroke={`${GOLD}cc`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 0 L0 14 L8 22 L22 22" stroke={`${GOLD}b3`} strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 0 L22 14 L14 22 L0 22" stroke={`${GOLD}b3`} strokeWidth="1" fill="none"/>
      </svg>
      {/* Inner glow line */}
      <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}b3 20%, ${GOLD}d9 50%, ${GOLD}b3 80%, transparent)` }} />

      {/* Purple light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(139,46,226,0.8) 20%, rgba(139,46,226,1.0) 35%, rgba(0,0,0,0.95) 50%, rgba(139,46,226,1.0) 65%, rgba(139,46,226,0.8) 80%, transparent 100%)`,
          opacity: 1.0,
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 37.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo */}
      <Link href="/home2">
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

      {/* Nav */}
      <nav className="flex items-center gap-2 z-10">
        {NAV_LINKS.map((link, i) => (
          <div key={link.label} className="flex items-center gap-2">
            <Link href={link.href}>
              <motion.span
                className="text-[11px] tracking-[0.18em] uppercase whitespace-nowrap select-none cursor-pointer"
                style={{ color: i < 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}
                whileHover={{ color: '#e8dcc8' }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
              >
                {link.label}
              </motion.span>
            </Link>
            {i < NAV_LINKS.length - 1 && (
              <div className="h-3" style={{ width: '2px', background: `${GOLD}cc` }} />
            )}
          </div>
        ))}
      </nav>

      {/* Sound toggle */}
      <motion.button
        className="flex items-center gap-1.5 z-10 select-none cursor-pointer"
        style={{ color: soundOn ? `${GOLD}cc` : 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.15em' }}
        whileHover={{ color: soundOn ? GOLD : 'rgba(255,255,255,0.6)' }}
        transition={{ duration: 0.15 }}
        onClick={() => { setSoundOn(s => !s); unlockAudio() }}
        onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
      >
        <span style={{ fontSize: 14 }}>{soundOn ? '🔊' : '🔇'}</span>
        <span className="uppercase tracking-widest text-[9px]">{soundOn ? 'Sound On' : 'Sound Off'}</span>
      </motion.button>
    </motion.header>
  )
}
