'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface GlassButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'gold' | 'silver'
  className?: string
  onClick?: () => void
}

const variants = {
  gold: {
    text: '#e8b84b',
    hoverText: '#f5d06e',
    swirlA: 'rgba(201,151,58,0.45)',
    swirlB: 'rgba(245,208,110,0.25)',
    border: 'rgba(201,151,58,0.3)',
    hoverBorder: 'rgba(201,151,58,0.65)',
    glow: 'rgba(201,151,58,0.12)',
  },
  silver: {
    text: '#c0c8d0',
    hoverText: '#e8edf2',
    swirlA: 'rgba(192,200,208,0.35)',
    swirlB: 'rgba(232,237,242,0.2)',
    border: 'rgba(192,200,208,0.2)',
    hoverBorder: 'rgba(192,200,208,0.45)',
    glow: 'rgba(192,200,208,0.08)',
  },
}

export default function GlassButton({ href, children, variant = 'gold', className = '' }: GlassButtonProps) {
  const c = variants[variant]

  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl overflow-hidden text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-300 ${className}`}
      style={{ color: c.text }}
    >
      {/* Glass body */}
      <div
        className="absolute inset-0 rounded-xl transition-all duration-500"
        style={{
          background: 'rgba(6, 4, 10, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${c.border}`,
        }}
      />

      {/* Swirling conic gradient — primary arm */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <motion.div
          className="absolute"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${c.swirlA} 45deg, transparent 90deg, ${c.swirlB} 180deg, transparent 270deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Counter-rotating secondary shimmer */}
        <motion.div
          className="absolute"
          style={{
            width: '160%',
            height: '160%',
            top: '-30%',
            left: '-30%',
            background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, ${c.swirlB} 30deg, transparent 60deg)`,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Hover glow bloom */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${c.glow} 0%, transparent 70%)`,
          boxShadow: `inset 0 0 0 1px ${c.hoverBorder}, 0 0 30px ${c.glow}`,
        }}
      />

      {/* Label */}
      <span
        className="relative z-10 transition-colors duration-300 group-hover:text-[var(--hover-text)]"
        style={{ '--hover-text': c.hoverText } as React.CSSProperties}
      >
        {children}
      </span>
    </Link>
  )
}
