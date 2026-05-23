'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import { screensaverModes, featuredScreensaverPresets } from '@/lib/data/screensaver'
import { featuredWorlds } from '@/lib/data/worlds'
import type { DiscoveredTrack } from '@/components/realms/RealmsPlayer'

interface AscensionChamberHubProps {
  audioMap?: Record<string, DiscoveredTrack[]>
}

// ── Visual mode config ────────────────────────────────────────────────────
const modeAccent: Record<string, string> = {
  'gallery-drift': '#c9973a',
  'video-temple': '#7c3aed',
  'music-reactor': '#00e5ff',
  'fluid-oracle': '#06b6d4',
  'mythmachine-shuffle': '#a78bfa',
}

// ── Realm preset generator ────────────────────────────────────────────────
const realmModes = ['gallery_drift', 'video_temple', 'music_reactor', 'fluid_oracle', 'mythmachine_shuffle'] as const

function getRealmPresets() {
  return featuredWorlds.map((w, i) => ({
    id: `realm-${w.slug}`,
    title: w.title ?? w.slug ?? '',
    slug: `realm-${w.slug}`,
    description: w.short_description ?? '',
    visual_mode: realmModes[i % realmModes.length],
    color: w.color_primary ?? '#c9973a',
    is_featured: w.is_featured ?? false,
    realmSlug: w.slug,
  }))
}

// ── Preset card — uniform size ─────────────────────────────────────────────
const modeIcons: Record<string, string> = {
  gallery_drift: '◈',
  video_temple: '⬡',
  music_reactor: '◉',
  fluid_oracle: '⌘',
  mythmachine_shuffle: '⧉',
}
const modeLabel: Record<string, string> = {
  gallery_drift: 'Gallery Drift',
  video_temple: 'Video Temple',
  music_reactor: 'Music Reactor',
  fluid_oracle: 'Fluid Oracle',
  mythmachine_shuffle: 'MythMachine',
}

function PresetCard({ preset }: {
  preset: {
    id: string; title: string; slug?: string; description?: string
    visual_mode?: string; color?: string; is_featured?: boolean
    default_intensity?: number; audio_reactive?: boolean; realmSlug?: string
  }
}) {
  const mode = preset.visual_mode ?? 'gallery_drift'
  const color = preset.color ?? '#c9973a'
  const icon = modeIcons[mode] ?? '◈'
  const href = `/screensaver?preset=${preset.slug ?? preset.id}`

  return (
    <Link href={href} className="group block h-full">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl overflow-hidden border h-full flex flex-col"
        style={{
          background: `linear-gradient(140deg, ${color}14 0%, #07050f 100%)`,
          borderColor: `${color}22`,
          minHeight: 160,
        }}
      >
        {/* Top strip: mode label */}
        <div className="px-4 pt-3 pb-0 flex items-center justify-between">
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${color}80` }}>
            {modeLabel[mode] ?? mode}
          </span>
          {preset.audio_reactive && (
            <span className="text-[8px] tracking-widest uppercase" style={{ color: `${color}70` }}>Audio ⟳</span>
          )}
        </div>

        {/* Icon + title */}
        <div className="px-4 py-3 flex-1 flex flex-col justify-center">
          <span className="text-2xl mb-2 block" style={{ color }}>{icon}</span>
          <h3 className="text-white text-sm font-cinzel font-semibold leading-snug tracking-wide mb-1.5">
            {preset.title}
          </h3>
          {preset.description && (
            <p className="text-white/35 text-[11px] leading-relaxed line-clamp-2">{preset.description}</p>
          )}
        </div>

        {/* Intensity bar */}
        {preset.default_intensity && (
          <div className="px-4 pb-3 mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(preset.default_intensity / 10) * 100}%`, background: color }} />
              </div>
              <span className="text-[9px]" style={{ color: `${color}60` }}>{preset.default_intensity}/10</span>
            </div>
          </div>
        )}

        {/* Hover: launch label */}
        <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[10px] tracking-widest uppercase font-medium" style={{ color }}>Launch →</span>
        </div>

        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${color}55` }}
        />
      </motion.div>
    </Link>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AscensionChamberHub({ audioMap }: AscensionChamberHubProps) {
  const [activeMode, setActiveMode] = useState<string | null>(null)

  const realmPresets = getRealmPresets()
  // Featured curated first, then featured realms, then rest sorted by title
  const curatedPresets = featuredScreensaverPresets
  const allPresets = [
    ...curatedPresets.filter((p) => p.is_featured),
    ...realmPresets.filter((p) => p.is_featured),
    ...curatedPresets.filter((p) => !p.is_featured),
    ...realmPresets.filter((p) => !p.is_featured),
  ]

  const hoveredMode = activeMode
    ? screensaverModes.find((m) => m.href.includes(activeMode))
    : null

  return (
    <div className="min-h-screen" style={{ background: '#07050f' }}>

      {/* ══════════════════════════════════════════
          PORTAL HERO
      ══════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center"
        style={{ minHeight: '62vh', background: 'radial-gradient(ellipse at 50% 60%, #1a0a2e 0%, #07050f 65%)' }}
      >
        {/* Animated portal rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border"
              style={{
                width: `${ring * 18 + 20}vw`,
                height: `${ring * 10 + 12}vw`,
                borderColor: `rgba(139,92,246,${0.25 - ring * 0.05})`,
                boxShadow: ring === 1
                  ? '0 0 40px 8px rgba(139,92,246,0.18), inset 0 0 60px rgba(139,92,246,0.08)'
                  : undefined,
              }}
              animate={{ rotate: ring % 2 === 0 ? 360 : -360, scale: [1, 1.012, 1] }}
              transition={{
                rotate: { duration: ring * 22 + 30, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4 + ring, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ))}
          {/* Central glow */}
          <div className="absolute rounded-full" style={{
            width: '22vw', height: '13vw',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, rgba(88,28,135,0.12) 50%, transparent 70%)',
          }} />
          {/* Star particles */}
          {[...Array(18)].map((_, i) => (
            <motion.div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white/50"
              style={{
                left: `${20 + Math.sin(i * 1.4) * 38}%`,
                top: `${20 + Math.cos(i * 1.1) * 40}%`,
              }}
              animate={{ opacity: [0.15, 0.7, 0.15], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 px-6 pt-20 pb-10">
          <span className="inline-block text-[8px] font-medium tracking-[0.4em] uppercase px-2 py-0.5 rounded mb-4"
            style={{ background: '#000', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Living Visualizer
          </span>
          <h1
            className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest mb-4 leading-tight"
            style={{ color: '#a855f7', textShadow: '0 0 30px rgba(168,85,247,0.6), 0 0 80px rgba(139,92,246,0.3)' }}
          >
            The Ascension Chamber
          </h1>
          <p className="text-white/45 text-sm leading-relaxed max-w-lg mx-auto">
            Choose a realm, select a soundtrack, and pass through the portal into a fullscreen living world of cinematic art, music-reactive visuals, and ambient motion.
          </p>
        </div>

        {/* Bottom fade into modes */}
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #07050f, transparent)' }}
        />
      </div>

      {/* ══════════════════════════════════════════
          VISUAL MODES STRIP
      ══════════════════════════════════════════ */}
      <div className="px-6 pb-6" style={{ background: '#07050f' }}>
        {/* Description bar — shows hovered mode desc, or generic prompt */}
        <div className="text-center mb-3 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={hoveredMode?.title ?? 'default'}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-white text-[11px] tracking-widest"
            >
              {hoveredMode?.description ?? 'Select a visual mode to enter the chamber'}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {screensaverModes.map((mode) => {
            const modeKey = mode.href.split('mode=')[1] ?? ''
            const accent = modeAccent[modeKey] ?? '#a855f7'
            const isActive = activeMode === modeKey
            return (
              <Link
                key={mode.href}
                href={mode.href}
                onMouseEnter={() => setActiveMode(modeKey)}
                onMouseLeave={() => setActiveMode(null)}
                className="relative px-5 py-2 rounded-full border transition-all duration-200 text-center"
                style={{
                  borderColor: isActive ? `${accent}60` : 'rgba(255,255,255,0.18)',
                  background: isActive ? `${accent}18` : 'transparent',
                  color: 'rgba(255,255,255,0.92)',
                }}
              >
                <span className="text-xs font-medium tracking-widest uppercase">{mode.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="mode-underline"
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ boxShadow: `0 0 14px ${accent}40, inset 0 0 0 1px ${accent}50` }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FULL-WIDTH REALMS PLAYER (autoplay)
      ══════════════════════════════════════════ */}
      <RealmsPlayer audioMap={audioMap} />

      {/* ══════════════════════════════════════════
          PRESET LIBRARY
      ══════════════════════════════════════════ */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-1">Enter the Portal</p>
            <h2 className="font-cinzel text-lg font-bold tracking-widest"
              style={{ color: '#a855f7', textShadow: '0 0 16px rgba(168,85,247,0.4)' }}
            >
              Preset Library
            </h2>
          </div>
          <p className="text-white/25 text-xs">{allPresets.length} presets · curated + all realms</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {allPresets.map((preset) => (
            <PresetCard key={preset.id} preset={preset as Parameters<typeof PresetCard>[0]['preset']} />
          ))}
        </div>
      </div>

    </div>
  )
}
