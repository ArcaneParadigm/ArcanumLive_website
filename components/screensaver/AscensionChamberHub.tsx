'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import { screensaverModes, featuredScreensaverPresets } from '@/lib/data/screensaver'
import { featuredWorlds } from '@/lib/data/worlds'
import { musicCategories, featuredAlbums } from '@/lib/data/music'
import { playCrystalBowl } from '@/lib/utils/crystalSound'
import type { DiscoveredTrack } from '@/components/realms/RealmsPlayer'

interface AscensionChamberHubProps {
  audioMap?: Record<string, DiscoveredTrack[]>
  cardImages?: Record<string, string | null>
}

const GOLD   = '#c9973a'
const PURPLE = '#7c3aed'

// ── Colour helpers ────────────────────────────────────────────────────────────

const modeAccent: Record<string, string> = {
  'gallery-drift': '#c9973a', 'video-temple': '#7c3aed',
  'music-reactor': '#00e5ff', 'fluid-oracle': '#06b6d4', 'mythmachine-shuffle': '#a78bfa',
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

// ── Realm card for Ascension Chamber ─────────────────────────────────────────

function AscensionRealmCard({
  world, isActive, onActivate, cardImage,
}: {
  world: { slug?: string; title?: string; color_primary?: string }
  isActive: boolean
  onActivate: () => void
  cardImage?: string | null
}) {
  const color = world.color_primary ?? GOLD
  const router = useRouter()
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="shrink-0 rounded-lg overflow-hidden flex flex-col cursor-pointer"
      style={{
        width: 168,
        aspectRatio: '2/3',
        border: `1px solid ${isActive ? color + 'cc' : color + '40'}`,
        boxShadow: isActive
          ? `0 0 20px ${color}70, 0 0 6px ${color}50`
          : hov
            ? `0 0 14px ${color}55`
            : 'none',
        background: `radial-gradient(ellipse at 50% 20%, ${color}22, #07050f 75%)`,
      }}
      animate={{ scale: hov || isActive ? 1.05 : 1, y: hov ? -4 : 0 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => { setHov(true); playCrystalBowl(color, 0.018) }}
      onMouseLeave={() => setHov(false)}
      onClick={onActivate}
    >
      {/* Image fills almost the whole card */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        {cardImage ? (
          <img src={cardImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}35, #07050f)` }} />
        )}
        <div className="absolute inset-0" style={{
          background: isActive
            ? `linear-gradient(to bottom, transparent 35%, ${color}50 100%)`
            : 'linear-gradient(to bottom, transparent 50%, rgba(7,5,15,0.75) 100%)',
        }} />
        {isActive && (
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span className="text-[7px] tracking-widest uppercase" style={{ color }}>▶ Active</span>
          </div>
        )}
        {hov && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-base">▶</span>
          </div>
        )}
        {/* Neon top edge when active */}
        {isActive && (
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}cc 40%, ${color}cc 60%, transparent)` }} />
        )}
        <div className="absolute top-1 left-1 w-2 h-2" style={{ borderTop: `1px solid ${color}70`, borderLeft: `1px solid ${color}70` }} />
      </div>

      {/* Title — 1 line, bright */}
      <div
        className="shrink-0 px-1 py-1"
        style={{ background: isActive ? `${color}28` : 'rgba(7,5,15,0.92)', borderTop: `1px solid ${color}35` }}
      >
        <p
          className="font-cinzel truncate text-center leading-none"
          style={{ fontSize: 11, color: isActive ? color : 'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}
        >
          {world.title}
        </p>
      </div>

      {/* Enter World button */}
      <button
        onClick={(e) => { e.stopPropagation(); router.push(`/realms/${world.slug}`) }}
        className="shrink-0 w-full text-center py-0.5 transition-colors"
        style={{
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
          fontFamily: 'Cinzel, serif', fontWeight: 600,
          borderTop: `1px solid ${color}25`,
          color: hov ? color : 'rgba(255,255,255,0.4)',
          background: 'transparent',
        }}
      >
        World →
      </button>
    </motion.div>
  )
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

// ── Orange slider bar with handle ─────────────────────────────────────────────

function SliderBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100
  return (
    <div className="relative h-0.5 rounded-full shrink-0 w-10" style={{ background: 'rgba(249,115,22,0.22)' }}>
      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: '#f97316' }} />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ left: `calc(${pct}% - 4px)`, background: '#f97316', boxShadow: '0 0 4px #f9731680' }}
      />
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
  preset: { id: string; title: string; slug?: string; description?: string; visual_mode?: string; color?: string; default_intensity?: number }
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
        <SliderBar value={preset.default_intensity ?? 5} />
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
        <SliderBar value={album.energy} />
      </div>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AscensionChamberHub({ audioMap, cardImages = {} }: AscensionChamberHubProps) {
  const [activeMode,   setActiveMode]   = useState<string | null>(null)
  const [activeAlbum,  setActiveAlbum]  = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string>('')
  const [activeRealm,  setActiveRealm]  = useState<string | null>(null)

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
    <div className="min-h-screen" style={{ background: '#07050f' }}>

      {/* ── Slim header ── */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1">
        <Link href="/home2"
          className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity flex-1"
          style={{ color: 'rgba(255,255,255,0.82)' }}>
          ← Home
        </Link>
        <h1 className="font-cinzel text-lg font-bold tracking-[0.25em] shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 30%, #f5d06e 50%, #c9973a 70%, #6b4411 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          The Ascension Chamber
        </h1>
        <span className="font-cinzel text-[10px] italic tracking-widest flex-1 text-right"
          style={{
            background: 'linear-gradient(135deg, #8a6020, #c9973a 40%, #f0c84a 60%, #c9973a 80%, #8a6020)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          Living Visualizer
        </span>
      </div>

      {/* ── Player ── */}
      <RealmsPlayer audioMap={audioMap} compact />

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
              <AscensionRealmCard
                key={w.slug}
                world={{ slug: w.slug, title: w.title ?? undefined, color_primary: w.color_primary ?? undefined }}
                isActive={activeRealm === w.slug}
                onActivate={() => setActiveRealm(w.slug ?? null)}
                cardImage={w.slug ? (cardImages[w.slug] ?? null) : null}
              />
            ))}
          </div>
        </div>
      </div>

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
          <Foldable title="Music" subtitle={`${allAlbums.length}`} defaultOpen={false}>
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
    </div>
  )
}
