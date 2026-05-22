'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Realms', href: '/worlds' },
  { label: 'Dome Shows', href: '/dome-shows' },
  { label: 'Watch', href: '/watch' },
  { label: 'Ascension Chamber', href: '/screensaver' },
  { label: 'Store', href: '/store' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-cinzel text-xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-gold-dim via-gold-bright to-gold-dim">
            Arcanum
          </span>
          <span className="text-gold/30 font-cinzel text-lg">·</span>
          <span
            className="font-cinzel text-lg italic tracking-[0.2em] uppercase transition-all duration-300"
            style={{
              color: '#00d4ff',
              textShadow: '0 0 10px rgba(0,212,255,0.8), 0 0 28px rgba(0,212,255,0.35)',
              WebkitTextStroke: '0px',
            }}
          >
            Live
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider uppercase text-white/60 hover:text-gold-bright transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-bright group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/60 hover:text-gold-bright transition-colors"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-obsidian-100/95 backdrop-blur-xl border-b border-gold/10 px-6 py-4"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-wider uppercase text-white/70 hover:text-gold-bright transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
