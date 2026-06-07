'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [soundOn, setSoundOn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
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
        {/* Corner cuts */}
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
        <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${GOLD}40 20%, ${GOLD}60 50%, ${GOLD}40 80%, transparent)` }} />

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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 z-10">
          {NAV_LINKS.map(link => (
            <Link key={link.label} href={link.href}>
              <motion.span
                className="text-[11px] tracking-[0.18em] uppercase whitespace-nowrap select-none cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.85)' }}
                whileHover={{ color: '#e8dcc8' }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
              >
                {link.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        {/* Desktop sound toggle */}
        <motion.button
          className="hidden md:flex items-center gap-1.5 z-10 select-none cursor-pointer"
          style={{ color: soundOn ? `${GOLD}cc` : 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: '0.15em' }}
          whileHover={{ color: soundOn ? GOLD : 'rgba(255,255,255,0.85)' }}
          transition={{ duration: 0.15 }}
          onClick={() => {
            const next = !soundOn; setSoundOn(next); unlockAudio()
            const el = document.querySelector('audio') as HTMLAudioElement | null
            if (el) { next ? el.play().catch(() => {}) : el.pause() }
          }}
          onMouseEnter={() => playCrystalBowl(GOLD, 0.015)}
        >
          <span style={{ fontSize: 14 }}>{soundOn ? '🔊' : '🔇'}</span>
          <span className="uppercase tracking-widest text-[9px]">{soundOn ? 'Sound On' : 'Sound Off'}</span>
        </motion.button>

        {/* Mobile right side: sound + hamburger */}
        <div className="flex md:hidden items-center gap-3 z-10">
          <motion.button
            className="flex items-center gap-1 select-none cursor-pointer"
            style={{ color: soundOn ? `${GOLD}cc` : 'rgba(255,255,255,0.6)', fontSize: 10 }}
            onClick={() => {
              const next = !soundOn; setSoundOn(next); unlockAudio()
              const el = document.querySelector('audio') as HTMLAudioElement | null
              if (el) { next ? el.play().catch(() => {}) : el.pause() }
            }}
          >
            <span style={{ fontSize: 14 }}>{soundOn ? '🔊' : '🔇'}</span>
          </motion.button>

          {/* Hamburger button */}
          <motion.button
            className="flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer select-none"
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale: 0.92 }}
          >
            <motion.span
              className="block h-[2px] rounded-full"
              style={{ background: GOLD }}
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[2px] rounded-full"
              style={{ background: GOLD }}
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block h-[2px] rounded-full"
              style={{ background: GOLD }}
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden fixed inset-x-0 z-40 overflow-y-auto"
            style={{
              top: 52,
              background: 'linear-gradient(180deg, rgba(12,8,22,0.99) 0%, rgba(8,5,15,0.98) 100%)',
              borderBottom: `1px solid ${GOLD}30`,
              boxShadow: `0 8px 40px rgba(0,0,0,0.8)`,
              maxHeight: 'calc(100vh - 52px)',
            }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* Gold top line */}
            <div className="h-px mx-4" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50, transparent)` }} />

            {/* Nav links grid */}
            <div className="grid grid-cols-3 gap-px p-4" style={{ borderBottom: `1px solid ${GOLD}15` }}>
              {NAV_LINKS.map(link => (
                <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                  <motion.div
                    className="flex items-center justify-center px-2 py-3 rounded-lg cursor-pointer"
                    style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}
                    whileHover={{ background: `${GOLD}18`, borderColor: `${GOLD}50` }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                    onTap={() => playCrystalBowl(GOLD, 0.015)}
                  >
                    <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-center"
                      style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {link.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Sound toggle row */}
            <div className="flex items-center justify-center p-4">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer select-none"
                style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, color: soundOn ? GOLD : 'rgba(255,255,255,0.7)', fontSize: 12 }}
                onClick={() => { setSoundOn(s => !s); unlockAudio() }}
                whileTap={{ scale: 0.96 }}
              >
                <span style={{ fontSize: 16 }}>{soundOn ? '🔊' : '🔇'}</span>
                <span className="uppercase tracking-widest text-[10px]">{soundOn ? 'Sound On' : 'Sound Off'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
