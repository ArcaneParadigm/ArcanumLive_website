'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { YT_CHANNELS, type YTChannel } from '@/lib/data/channels'
import Home2Nav from '@/components/home2/Home2Nav'

const vp = { once: true, amount: 0.15 }

// ── Social media accounts ────────────────────────────────────────────────────

interface SocialAccount {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'x'
  handle: string
  name: string
  url: string
  color: string
  image?: string
}

const SOCIAL_ACCOUNTS: SocialAccount[] = [
  { platform: 'instagram', handle: '@arcaneparadigm',  name: 'Arcane Paradigm',    url: 'https://www.instagram.com/arcaneparadigm',  color: '#E1306C' },
  { platform: 'instagram', handle: '@aether_lotus',    name: 'Aether Lotus',        url: 'https://www.instagram.com/aether_lotus/',   color: '#c084fc' },
  { platform: 'facebook',  handle: 'ArcaneParadigm',   name: 'Glenn Grillo',        url: 'https://www.facebook.com/ArcaneParadigm',  color: '#1877f2' },
  { platform: 'tiktok',    handle: '@arcaneparadigm',  name: 'Arcane Paradigm',     url: 'https://www.tiktok.com/@arcaneparadigm',   color: '#ffffff' },
  { platform: 'x',         handle: '@HoneyVerseGirls', name: 'Honeyverse Girls',    url: 'https://x.com/HoneyVerseGirls',            color: '#ec4899' },
  { platform: 'x',         handle: '@Arcane_Paradigm', name: 'Arcane Paradigm',     url: 'https://x.com/Arcane_Paradigm',            color: '#c9973a' },
]

function PlatformIcon({ platform, size = 16 }: { platform: SocialAccount['platform']; size?: number }) {
  if (platform === 'instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
  if (platform === 'facebook') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
  if (platform === 'tiktok') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
  // X / Twitter
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const PLATFORM_LABELS: Record<SocialAccount['platform'], string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  x: 'X / Twitter',
}

const PLATFORM_BG: Record<SocialAccount['platform'], string> = {
  instagram: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  facebook: '#1877f2',
  tiktok: '#000000',
  x: '#000000',
}

function SocialCard({ acct, index }: { acct: SocialAccount; index: number }) {
  return (
    <motion.a
      href={acct.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer group"
      style={{
        background: '#0c0a14',
        border: `1px solid ${acct.color}25`,
        boxShadow: `0 0 30px ${acct.color}05`,
      }}
      whileHover={{ borderColor: `${acct.color}60`, boxShadow: `0 0 30px ${acct.color}18`, y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Platform icon circle */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: PLATFORM_BG[acct.platform], color: '#fff' }}
      >
        <PlatformIcon platform={acct.platform} size={18} />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-cinzel text-[11px] font-bold tracking-wide" style={{ color: acct.color }}>{acct.name}</p>
        <p className="text-[10px] tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{acct.handle}</p>
        <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: `${acct.color}60` }}>{PLATFORM_LABELS[acct.platform]}</p>
      </div>
      {/* Arrow */}
      <span className="text-xs transition-transform group-hover:translate-x-1" style={{ color: `${acct.color}60` }}>→</span>
    </motion.a>
  )
}

function YouTubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 24 17" fill="white">
      <path d="M23.5 2.6S23.2.8 22.4.1C21.4-.9 20.3-.9 19.8-.8 16.5 0 12 0 12 0s-4.5 0-7.8-.8C3.7-.9 2.6-.9 1.6.1.8.8.5 2.6.5 2.6S.2 4.7.2 6.8v2c0 2 .3 4.2.3 4.2s.3 1.8 1.1 2.5c1 1 2.4.9 3 1C6.6 16.7 12 16.7 12 16.7s4.5 0 7.8-.8c.5-.1 1.6-.1 2.6-1.1.8-.7 1.1-2.5 1.1-2.5s.3-2.1.3-4.2v-2C23.8 4.7 23.5 2.6 23.5 2.6zM9.7 11.5V5.2l6.6 3.2-6.6 3.1z" />
    </svg>
  )
}

function ChannelCard({ ch, index }: { ch: YTChannel; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.12, ease: 'easeOut' }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${ch.color}30`,
        background: '#0c0a14',
        boxShadow: `0 0 60px ${ch.color}08`,
      }}
    >
      {/* Banner image */}
      <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
        <img
          src={ch.image}
          alt={ch.name}
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.75) saturate(1.2)' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 30%, #0c0a14 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, ${ch.color}20 0%, transparent 60%)`,
          }}
        />
        {/* Channel handle badge */}
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(0,0,0,0.65)',
              border: `1px solid ${ch.color}50`,
              color: ch.accentColor,
              backdropFilter: 'blur(8px)',
            }}
          >
            <YouTubeIcon size={12} />
            {ch.handle}
          </div>
        </div>
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-8 h-8" style={{ borderTop: `1px solid ${ch.color}50`, borderRight: `1px solid ${ch.color}50` }} />
        <div className="absolute bottom-0 left-0 w-8 h-8" style={{ borderBottom: `1px solid ${ch.color}30`, borderLeft: `1px solid ${ch.color}30` }} />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-2">
        <h2
          className="font-cinzel text-xl font-bold mb-1"
          style={{
            background: `linear-gradient(135deg, ${ch.color}, ${ch.accentColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {ch.name}
        </h2>
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-3" style={{ color: `${ch.color}90` }}>
          {ch.tagline}
        </p>
        {/* Divider */}
        <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${ch.color}50, transparent)` }} />
        <p className="text-white/65 text-sm leading-relaxed mb-5">{ch.description}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Subscribe */}
          <motion.a
            href={ch.subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-[11px] tracking-wider uppercase text-white"
            style={{ background: '#FF0000', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(255,0,0,0.55)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <YouTubeIcon size={16} />
            Subscribe
          </motion.a>
          {/* Visit channel */}
          <motion.a
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2.5 rounded-lg font-semibold text-[11px] tracking-wider uppercase"
            style={{
              border: `1px solid ${ch.color}50`,
              color: ch.accentColor,
              background: `${ch.color}10`,
            }}
            whileHover={{ borderColor: ch.color, background: `${ch.color}20` }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Visit
          </motion.a>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${ch.color}60, transparent)` }} />
    </motion.div>
  )
}

export default function ChannelsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c9973a, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[9px] tracking-[0.6em] uppercase mb-3 font-medium" style={{ color: '#c9973a' }}>
            The Arcanum Universe
          </p>
          <h1
            className="font-cinzel text-4xl md:text-5xl font-bold tracking-wide mb-4"
            style={{
              background: 'linear-gradient(135deg, #c9973a 0%, #e8c96a 40%, #c9973a 70%, #a87828 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Channels
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            Explore the full Arcanum universe across YouTube. Subscribe to stay connected with new worlds, visuals, and cosmic transmissions.
          </p>
          {/* Gold divider */}
          <div className="flex items-center gap-4 mt-8 max-w-xs mx-auto">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.5))' }} />
            <span style={{ color: '#c9973a' }}>✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,151,58,0.5), transparent)' }} />
          </div>
        </motion.div>

        {/* Channel cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {YT_CHANNELS.map((ch, i) => (
            <ChannelCard key={ch.id} ch={ch} index={i} />
          ))}
        </div>

        {/* Social media section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.3))' }} />
            <span className="font-cinzel text-[11px] tracking-[0.4em] uppercase font-bold" style={{ color: 'rgba(201,151,58,0.7)' }}>◆ Find Us On Social ◆</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,151,58,0.3), transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SOCIAL_ACCOUNTS.map((acct, i) => (
              <SocialCard key={`${acct.platform}-${acct.handle}`} acct={acct} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-[9px] tracking-[0.4em] uppercase mt-12"
          style={{ color: 'rgba(201,151,58,0.35)' }}
        >
          Subscribe to unlock the full Arcanum experience
        </motion.p>

        {/* Back home */}
        <div className="flex justify-center mt-6">
          <Link href="/">
            <motion.span
              className="text-[10px] tracking-widest uppercase cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              whileHover={{ color: 'rgba(255,255,255,0.7)' }}
              transition={{ duration: 0.15 }}
            >
              ← Back to Arcanum
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  )
}
