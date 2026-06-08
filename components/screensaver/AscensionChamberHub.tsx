'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import RealmCard from '@/components/realms/RealmCard'
import { screensaverModes, featuredScreensaverPresets } from '@/lib/data/screensaver'
import { featuredWorlds } from '@/lib/data/worlds'
import { musicCategories, featuredAlbums } from '@/lib/data/music'
import { playCrystalBowl } from '@/lib/utils/crystalSound'
import type { DiscoveredTrack } from '@/components/realms/RealmsPlayer'

interface AscensionChamberHubProps {
  audioMap?: Record<string, DiscoveredTrack[]>
  cardImages?: Record<string, string | null>
  sequenceMap?: Record<string, string[]>
  imageMap?: Record<string, string[]>
}

const GOLD   = '#c9973a'
const PURPLE = '#7c3aed'

// ── Colour helpers ────────────────────────────────────────────────────────────

const modeAccent: Record<string, string> = {
  'gallery-drift': '#c9973a', 'video-temple': '#7c3aed',
  'music-reactor': '#00e5ff', 'fluid-oracle': '#06b6d4',
  'particle-cosmos': '#e879f9', 'mythmachine-shuffle': '#a78bfa',
}
const modeIcons: Record<string, string> = {
  gallery_drift: '◈', video_temple: '⬡', music_reactor: '◉', fluid_oracle: '⌘', mythmachine_shuffle: '⧉',
}
const modeLabel: Record<string, string> = {
  gallery_drift: 'Gallery Drift', video_temple: 'Video Temple',
  music_reactor: 'Music Reactor', fluid_oracle: 'Fluid Oracle', mythmachine_shuffle: 'MythMachine',
}

// Purple-family palette shifting ~15 deg per step, staying in violet range
function presetColor(index: number): string {
  const hue = Math.max(200, 278 - index * 13)
  const sat = 68 + (index % 3) * 5
  const lit = 63 - (index % 5) * 3
  return `hsl(${hue}, ${sat}%, ${Math.max(lit, 44)}%)`
}


// ── Foldable section wrapper ──────────────────────────────────────────────────

function Foldable({ title, subtitle, accent = GOLD, defaultOpen = true, children }: {
  title: string; subtitle?: string; accent?: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${PURPLE}80` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(76, 29, 149, 0.50)' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-sm font-bold tracking-widest" style={{ color: '#fff' }}>{title}</span>
          {subtitle && <span className="text-white/45 text-[10px]">{subtitle}</span>}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}
        >▼</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


// ── Preset row ────────────────────────────────────────────────────────────────

const realmModes = ['gallery_drift', 'video_temple', 'music_reactor', 'fluid_oracle', 'mythmachine_shuffle'] as const

function getRealmPresets() {
  return featuredWorlds.map((w, i) => ({
    id: `realm-${w.slug}`, title: w.title ?? w.slug ?? '',
    slug: `realm-${w.slug}`, description: w.short_description ?? '',
    visual_mode: realmModes[i % realmModes.length],
    color: w.color_primary ?? GOLD,
    is_featured: w.is_featured ?? false,
    default_intensity: 5 + (i % 5), audio_reactive: i % 3 !== 0,
  }))
}

function PresetRow({ preset, index, isActive, onClick }: {
  preset: { id: string; title: string; slug?: string; description?: string; visual_mode?: string; color?: string }
  index: number
  isActive?: boolean
  onClick?: () => void
}) {
  const mode     = preset.visual_mode ?? 'gallery_drift'
  const icon     = modeIcons[mode] ?? '◈'
  const label    = modeLabel[mode] ?? mode
  const rowColor = presetColor(index)

  return (
    <button
      className="group w-full block text-left"
      onClick={onClick}
    >
      <div
        className="relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all duration-200 group-hover:scale-[1.01]"
        style={{
          borderColor: isActive ? `${rowColor}80` : `${rowColor}28`,
          background: isActive
            ? `linear-gradient(90deg, ${rowColor}28 0%, #07050f 100%)`
            : `linear-gradient(90deg, ${rowColor}0c 0%, #07050f 100%)`,
          boxShadow: isActive ? `0 0 12px ${rowColor}25` : 'none',
        }}
      >
        {isActive && (
          <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ background: `linear-gradient(90deg, ${rowColor}18 0%, transparent 70%)` }}
          />
        )}
        <motion.div
          className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
          style={{ color: rowColor, background: `${rowColor}20`, border: `1px solid ${rowColor}${isActive ? '80' : '35'}` }}
          animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="leading-none mb-0.5 truncate">
            <span className="font-cinzel font-bold text-[10px]" style={{ color: rowColor }}>{preset.title}</span>
            <span className="text-[8px] tracking-wider uppercase ml-1.5" style={{ color: `${rowColor}80` }}>· {label}</span>
          </p>
          {preset.description && (
            <p className="text-[8px] text-white/55 leading-none truncate">{preset.description}</p>
          )}
        </div>
      </div>
    </button>
  )
}

// ── Music row (same style as PresetRow) ───────────────────────────────────────

function MusicRow({ album, index, isActive, onClick }: {
  album: { slug: string; title: string; energy: number; desc: string }
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const rowColor = presetColor(index)
  return (
    <button className="group w-full block text-left" onClick={onClick}>
      <div
        className="relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all duration-200 group-hover:scale-[1.01]"
        style={{
          borderColor: isActive ? `${rowColor}80` : `${rowColor}28`,
          background: isActive
            ? `linear-gradient(90deg, ${rowColor}28 0%, #07050f 100%)`
            : `linear-gradient(90deg, ${rowColor}0c 0%, #07050f 100%)`,
          boxShadow: isActive ? `0 0 12px ${rowColor}25` : 'none',
        }}
      >
        {isActive && (
          <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ background: `linear-gradient(90deg, ${rowColor}18 0%, transparent 70%)` }}
          />
        )}
        <motion.div
          className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
          style={{ color: rowColor, background: `${rowColor}20`, border: `1px solid ${rowColor}${isActive ? '80' : '35'}` }}
          animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
        >
          ♫
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="font-cinzel font-bold text-[10px] leading-none mb-0.5 truncate" style={{ color: rowColor }}>
            {album.title}
          </p>
          {album.desc && (
            <p className="text-[8px] text-white/55 leading-none truncate">{album.desc}</p>
          )}
        </div>
      </div>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AscensionChamberHub({ audioMap, cardImages = {}, sequenceMap = {}, imageMap = {} }: AscensionChamberHubProps) {
  const [activeMode,   setActiveMode]   = useState<string | null>(null)
  const [activeAlbum,  setActiveAlbum]  = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string>('')
  const [activeRealm,  setActiveRealm]  = useState<string | null>(null)
  const [hoveredRealm, setHoveredRealm] = useState<string | null>(null)

  const realmPresets   = getRealmPresets()
  const curatedPresets = featuredScreensaverPresets.map((p) => ({
    ...p,
    color: p.visual_mode
      ? ({ gallery_drift: '#c9973a', video_temple: '#7c3aed', music_reactor: '#00e5ff', fluid_oracle: '#06b6d4', mythmachine_shuffle: '#a78bfa' }[p.visual_mode] ?? '#c9973a')
      : '#c9973a',
  }))

  const allPresets = [
    ...curatedPresets.filter(p => p.is_featured),
    ...realmPresets.filter(p => p.is_featured),
    ...curatedPresets.filter(p => !p.is_featured),
    ...realmPresets.filter(p => !p.is_featured),
  ]

  const allAlbums = [
    ...featuredAlbums.map((a) => ({ slug: a.slug ?? '', title: a.title ?? '', energy: a.energy_level ?? 5, desc: a.description ?? '' })),
    ...musicCategories
      .filter((c) => !featuredAlbums.find((a) => a.title === c))
      .map((c, i) => ({ slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title: c, energy: 4 + (i % 6), desc: '' })),
  ]

  const hoveredMode = activeMode ? screensaverModes.find(m => m.href.includes(activeMode)) : null

  return (
    <div className="min-h-screen relative" style={{ background: '#07050f' }}>

      {/* ── Content ── */}
      <div className="relative z-10">

      {/* ── Slim header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-3 pb-1">
        <Link href="/home2"
          className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity md:flex-1 mb-1 md:mb-0"
          style={{ color: 'rgba(255,255,255,0.82)' }}>
          ← Home
        </Link>
        <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-[0.2em] md:shrink-0 text-center"
          style={{
            background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 30%, #f5d06e 50%, #c9973a 70%, #6b4411 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 18px rgba(201,151,58,0.45))',
          }}>
          The Ascension Chamber
        </h1>
        <span className="hidden md:block font-cinzel text-[10px] italic tracking-widest flex-1 text-right"
          style={{
            background: 'linear-gradient(135deg, #8a6020, #c9973a 40%, #f0c84a 60%, #c9973a 80%, #8a6020)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          Living Visualizer
        </span>
      </div>

      {/* ── Player ── */}
      <RealmsPlayer audioMap={audioMap} sequenceMap={sequenceMap} imageMap={imageMap} compact activeSlug={activeRealm ?? undefined} />

      {/* ── Visual modes ── */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(168,85,247,0.12)', background: '#07050f' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="font-cinzel text-sm font-bold tracking-widest" style={{ color: '#fff' }}>Select Visual Mode</p>
            <AnimatePresence mode="wait">
              <motion.p key={hoveredMode?.title ?? 'x'}
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="text-white/70 text-[11px] tracking-wide">
                {hoveredMode?.description ?? ''}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 flex-wrap">
            {screensaverModes.map((mode) => {
              const key = mode.href.split('mode=')[1] ?? ''
              const accent = modeAccent[key] ?? '#a855f7'
              const isActive = activeMode === key
              return (
                <Link key={mode.href} href={mode.href}
                  onMouseEnter={() => setActiveMode(key)}
                  onMouseLeave={() => setActiveMode(null)}
                  className="px-4 py-1.5 rounded-full border text-xs font-medium tracking-widest uppercase transition-all duration-150"
                  style={{
                    borderColor: isActive ? `${accent}70` : 'rgba(255,255,255,0.2)',
                    color: isActive ? accent : 'rgba(255,255,255,0.88)',
                    background: isActive ? `${accent}18` : 'transparent',
                    boxShadow: isActive ? `0 0 10px ${accent}30` : 'none',
                  }}>
                  {mode.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Realm cards grid ── */}
      <div className="px-6 py-4 border-b" style={{ borderColor: `${GOLD}15`, background: '#07050f' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${GOLD}70` }}>Select Realm</p>
            {activeRealm && (
              <span className="text-[9px] px-2 py-0.5 rounded"
                style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}50` }}>
                {featuredWorlds.find(w => w.slug === activeRealm)?.title ?? activeRealm}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 max-h-[560px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {featuredWorlds.map(w => (
              <RealmCard
                key={w.slug}
                world={{ slug: w.slug, title: w.title ?? undefined, short_description: w.short_description ?? undefined, color_primary: w.color_primary ?? undefined }}
                isActive={activeRealm === w.slug}
                onActivate={() => setActiveRealm(w.slug ?? null)}
                cardImage={w.slug ? (cardImages[w.slug] ?? null) : null}
                onHover={(slug) => setHoveredRealm(slug)}
              />
            ))}
          </div>

          {/* ── Detail bar — shows hovered or active realm info ── */}
          {(() => {
            const detailSlug = hoveredRealm ?? activeRealm
            const w = detailSlug ? featuredWorlds.find(fw => fw.slug === detailSlug) : null
            if (!w) return null
            const color = w.color_primary ?? GOLD
            return (
              <AnimatePresence mode="wait">
                <motion.div
                  key={detailSlug}
                  className="mt-3 flex items-center gap-4 px-4 py-2.5 rounded-xl"
                  style={{ background: 'rgba(7,5,15,0.85)', border: `1px solid ${color}30`, backdropFilter: 'blur(10px)' }}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Title */}
                  <span className="font-cinzel font-bold text-sm shrink-0" style={{ color }}>
                    {w.title}
                  </span>
                  {/* Theme badge */}
                  {w.theme_style && (
                    <span className="text-[8px] tracking-[0.3em] uppercase px-2 py-0.5 rounded shrink-0"
                      style={{ background: `${color}18`, color: `${color}cc`, border: `1px solid ${color}40` }}>
                      {w.theme_style}
                    </span>
                  )}
                  {/* Dot separator */}
                  <span className="text-white/20 shrink-0">·</span>
                  {/* Description */}
                  <p className="text-white/60 text-[11px] flex-1 truncate">{w.short_description}</p>
                  {/* Gold Enter button */}
                  <button
                    onClick={() => { if (w.slug) window.location.href = `/realms/${w.slug}` }}
                    className="shrink-0 px-4 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all"
                    style={{
                      fontFamily: 'Cinzel, serif',
                      background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 35%, #f5d06e 55%, #c9973a 75%, #6b4411 100%)',
                      color: '#07050f',
                      border: '1px solid #c9973a80',
                      boxShadow: '0 0 10px #c9973a40',
                    }}
                  >
                    Enter
                  </button>
                </motion.div>
              </AnimatePresence>
            )
          })()}

        </div>
      </div>

      {/* ── Presets + Music (side by side, matching width) ── */}
      <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 gap-5 items-start">

        {/* Presets */}
        <div>
          <Foldable title="Presets" subtitle={`${allPresets.length}`} defaultOpen>
            <div className="overflow-y-auto" style={{ maxHeight: 640, scrollbarWidth: 'thin' }}>
              <div className="space-y-1 px-3 pb-3 pt-1">
                {allPresets.map((preset, i) => (
                  <PresetRow
                    key={preset.id}
                    preset={preset as Parameters<typeof PresetRow>[0]['preset']}
                    index={i}
                    isActive={activePreset === preset.id}
                    onClick={() => setActivePreset(preset.id ?? '')}
                  />
                ))}
              </div>
            </div>
          </Foldable>
        </div>

        {/* Music */}
        <div>
          <Foldable title="Music" subtitle={`${allAlbums.length}`} defaultOpen>
            <div className="overflow-y-auto" style={{ maxHeight: 640, scrollbarWidth: 'thin' }}>
              <div className="space-y-1 px-3 pb-3 pt-1">
                {allAlbums.map((album, i) => (
                  <MusicRow
                    key={album.slug}
                    album={album}
                    index={i}
                    isActive={activeAlbum === album.slug}
                    onClick={() => setActiveAlbum(prev => prev === album.slug ? null : album.slug)}
                  />
                ))}
              </div>
            </div>
          </Foldable>
        </div>

      </div>

      </div>{/* end z-10 content wrapper */}
    </div>
  )
}
