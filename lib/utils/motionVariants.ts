/**
 * Shared Framer Motion variants used across home2 sections.
 * Spring physics with low damping creates natural overshoot = wobble feel.
 */

import type { Variants } from 'framer-motion'

// ── Entry variants ────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  show:   { opacity: 1, x: 0,  transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  show:   { opacity: 1, x: 0,  transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

// ── Wobble card — low damping makes it overshoot and oscillate into place ──
export const wobbleIn: Variants = {
  hidden: { opacity: 0, scale: 0.65, y: 40, rotate: -5 },
  show:   {
    opacity: 1, scale: 1, y: 0, rotate: 0,
    transition: { type: 'spring', stiffness: 220, damping: 11 },
  },
}

// Stagger container — wraps a list of wobbleIn children
export const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

// ── Panel fly-in (whole section panels) ──────────────────────────────────

export const flyInLeft: Variants = {
  hidden: { opacity: 0, x: -120, rotateY: 8 },
  show:   { opacity: 1, x: 0,   rotateY: 0,
    transition: { type: 'spring', stiffness: 100, damping: 16 } },
}

export const flyInRight: Variants = {
  hidden: { opacity: 0, x: 120, rotateY: -8 },
  show:   { opacity: 1, x: 0,  rotateY: 0,
    transition: { type: 'spring', stiffness: 100, damping: 16 } },
}

export const flyInBottom: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring', stiffness: 140, damping: 18 } },
}

// ── Hover states ─────────────────────────────────────────────────────────

// Card lift + wobble on hover (spring into new position)
export const cardHover = {
  y: -8, scale: 1.05, rotate: 1.2,
  transition: { type: 'spring' as const, stiffness: 400, damping: 10 },
}

export const cardTap = {
  scale: 0.97,
  transition: { type: 'spring' as const, stiffness: 500, damping: 20 },
}

// Portal glow card hover
export const portalCardHover = {
  y: -10, scale: 1.04,
  transition: { type: 'spring' as const, stiffness: 300, damping: 12 },
}

// ── Viewport config ──────────────────────────────────────────────────────
export const viewport = { once: true, margin: '-80px' }
