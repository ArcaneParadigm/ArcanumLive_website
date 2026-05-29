'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import { screensaverModes, featuredScreensaverPresets } from '@/lib/data/screensaver'
import { featuredWorlds } from '@/lib/data/worlds'
import { musicCategories, featuredAlbums } from '@/lib/data/music'
import type { DiscoveredTrack } from '@/components/realms/RealmsPlayer'

interface AscensionChamberHubProps {
  audioMap?: Record<string, DiscoveredTrack[]>
}

// ── Mode config ───────────────────────────────────────────────────────────
const modeAccent: Record<string, string> = {
  'gallery-drift': '#c9973a',
  'video-temple': '#7c3aed',
  'music-reactor': '#00e5ff',
  'fluid-oracle': '#06b6d4',
  'mythmachine-shuffle': '#a78bfa',
}
const modeIcons: Record<string, string> = {
  gallery_drift: '◈', video_temple: '⬡', music_reactor: '◉',
  fluid_oracle: '⌘', mythmachine_shuffle: '⧉',
}
const modeLabel: Record<string, string> = {
  gallery_drift: 'Gallery Drift', video_temple: 'Video Temple',
  music_reactor: 'Music Reactor', fluid_oracle: 'Fluid Oracle',
  mythmachine_shuffle: 'MythMachine',
}

// ── Realm presets ─────────────────────────────────────────────────────────
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
    default_intensity: 5 + (i % 5),
    audio_reactive: i % 3 !== 0,
  }))
}

// ── Interpolate purple→gold across N presets ──────────────────────────────
function gradientColor(index: number, total: number): string {
  // purple #7c3aed → violet #a855f7 → magenta #d946ef → orange #f97316 → gold #c9973a
  const stops = ['#7c3aed', '#a855f7', '#d946ef', '#f97316', '#c9973a']
  const t = index / Math.max(total - 1, 1)
  const seg = (stops.length - 1) * t
  const i = Math.min(Math.floor(seg), stops.length - 2)
  const f = seg - i
  const hex = (s: string) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]
  const a = hex(stops[i]), b = hex(stops[i + 1])
  const r = Math.round(a[0] + (b[0] - a[0]) * f)
  const g = Math.round(a[1] + (b[1] - a[1]) * f)
  const bl = Math.round(a[2] + (b[2] - a[2]) * f)
  return `rgb(${r},${g},${bl})`
}

// ── Thin preset row ───────────────────────────────────────────────────────
function PresetRow({ preset, index, total, isActive, onClick }: {
  preset: { id: string; title: string; slug?: string; description?: string; visual_mode?: string; color?: string; default_intensity?: number; audio_reactive?: boolean }
  index: number; total: number; isActive?: boolean; onClick?: () => void
}) {
  const mode = preset.visual_mode ?? 'gallery_drift'
  const icon = modeIcons[mode] ?? '◈'
  const label = modeLabel[mode] ?? mode
  const rowColor = gradientColor(index, total)
  const href = `/screensaver?preset=${preset.slug ?? preset.id}`
  const typeTag = `${label}${preset.audio_reactive ? ' · Audio' : ''}`

  return (
    <Link href={href} className="group block" onClick={onClick}>
      <div
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300 group-hover:scale-[1.01]"
        style={{
          borderColor: isActive ? `${rowColor}70` : `${rowColor}30`,
          background: isActive
            ? `linear-gradient(90deg, ${rowColor}28 0%, ${rowColor}10 60%, #07050f 100%)`
            : `linear-gradient(90deg, ${rowColor}12 0%, #07050f 100%)`,
          boxShadow: isActive ? `0 0 18px ${rowColor}22, inset 0 0 0 1px ${rowColor}40` : 'none',
        }}
      >
        {/* Active sweep overlay */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0.4, 0.7, 0.4], x: 0 }}
            transition={{ opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0.4 } }}
            style={{ background: `linear-gradient(90deg, ${rowColor}18 0%, transparent 70%)` }}
          />
        )}

        {/* Symbol — pulses when active */}
        <motion.div
          className="shrink-0 w-8 h-8 rounded flex items-center justify-center text-base font-bold"
          style={{ color: rowColor, background: `${rowColor}25`, border: `1px solid ${rowColor}${isActive ? '80' : '40'}` }}
          animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
        >
          {icon}
        </motion.div>

        {/* 2 lines: title + type tag / description */}
        <div className="flex-1 min-w-0">
          {/* Line 1: title · type */}
          <p className="leading-snug mb-0.5 truncate">
            <span className="font-cinzel font-bold tracking-wide text-[13px]" style={{ color: rowColor }}>
              {preset.title}
            </span>
            <span className="text-[11px] tracking-widest uppercase ml-2" style={{ color: `${rowColor}90` }}>
              · {typeTag}
            </span>
          </p>
          {/* Line 2: description */}
          <p className="text-[10px] text-white/80 leading-none truncate">{preset.description}</p>
        </div>

        {/* Intensity bar */}
        <div className="shrink-0 w-12 hidden sm:block">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${((preset.default_intensity ?? 5) / 10) * 100}%`, background: rowColor }} />
          </div>
          <p className="text-[9px] text-right mt-0.5" style={{ color: `${rowColor}70` }}>{preset.default_intensity ?? 5}/10</p>
        </div>
      </div>
    </Link>
  )
}

// ── Music player panel ────────────────────────────────────────────────────
function MusicPanel({ activeAlbum, onSelect }: { activeAlbum: string | null; onSelect: (slug: string) => void }) {
  const allTitles = [
    ...featuredAlbums.map((a) => ({ slug: a.slug ?? '', title: a.title ?? '', energy: a.energy_level ?? 5, desc: a.description ?? '' })),
    ...musicCategories
      .filter((c) => !featuredAlbums.find((a) => a.title === c))
      .map((c, i) => ({ slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title: c, energy: 4 + (i % 6), desc: '' })),
  ]

  return (
    <div className="flex flex-col" style={{ background: 'rgba(7,5,15,0.8)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(201,151,58,0.15)' }}>
        <p className="text-[8px] tracking-[0.4em] uppercase text-white/60 mb-0.5">Soundtrack</p>
        <h3
          className="font-cinzel text-sm font-bold tracking-widest italic"
          style={{ color: '#f97316', textShadow: '0 0 12px rgba(249,115,22,0.5)' }}
        >
          Music Library
        </h3>
        <p className="text-white/70 text-[10px] mt-0.5">Override realm soundtrack</p>
      </div>

      {/* Album list */}
      <div className="py-2 px-2 space-y-1 scrollbar-none">
        {allTitles.map((album, i) => {
          const isActive = activeAlbum === album.slug
          const col = gradientColor(i, allTitles.length)
          return (
            <button
              key={album.slug}
              onClick={() => onSelect(album.slug)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group"
              style={{ background: isActive ? `${col}18` : 'transparent' }}
            >
              {/* Energy pip */}
              <div className="shrink-0 w-1.5 h-6 rounded-full" style={{ background: isActive ? col : `${col}40` }} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] font-medium leading-none mb-0.5 truncate transition-colors"
                  style={{ color: isActive ? col : 'rgba(255,255,255,0.65)' }}
                >
                  {album.title}
                </p>
                {album.desc && (
                  <p className="text-[9px] text-white/60 leading-none truncate">{album.desc}</p>
                )}
              </div>
              {/* Energy dots */}
              <div className="shrink-0 flex gap-0.5">
                {[...Array(5)].map((_, d) => (
                  <div key={d} className="w-1 h-1 rounded-full" style={{ background: d < Math.round(album.energy / 2) ? col : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Now playing */}
      {activeAlbum && (
        <div className="px-4 py-2 border-t" style={{ borderColor: 'rgba(201,151,58,0.1)' }}>
          <p className="text-[9px] tracking-widest uppercase text-white/60">Now overriding →</p>
          <p className="text-gold text-xs font-cinzel truncate">
            {allTitles.find((a) => a.slug === activeAlbum)?.title}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Section title helper ──────────────────────────────────────────────────
function SectionTitle({ children, variant = 'gold' }: { children: React.ReactNode; variant?: 'gold' | 'white' | 'orange' | 'neon' }) {
  const styles: Record<string, React.CSSProperties> = {
    gold: {
      background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 40%, #f5d06e 60%, #c9973a 80%, #6b4411 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    },
    white: { color: '#fff' },
    orange: { color: '#f97316', fontStyle: 'italic', textShadow: '0 0 12px rgba(249,115,22,0.5)' },
    neon: { color: '#000', WebkitTextStroke: '1px #a855f7', textShadow: '0 0 10px #a855f7, 0 0 24px #a855f780' },
  }
  return (
    <h2 className="font-cinzel text-base font-bold tracking-widest" style={styles[variant]}>
      {children}
    </h2>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function AscensionChamberHub({ audioMap }: AscensionChamberHubProps) {
  const [activeMode, setActiveMode] = useState<string | null>(null)
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string>('1')

  const realmPresets = getRealmPresets()
  const curatedPresets = featuredScreensaverPresets.map((p) => ({
    ...p,
    color: p.visual_mode
      ? ({ gallery_drift: '#c9973a', video_temple: '#7c3aed', music_reactor: '#00e5ff', fluid_oracle: '#06b6d4', mythmachine_shuffle: '#a78bfa' }[p.visual_mode] ?? '#c9973a')
      : '#c9973a',
  }))

  const allPresets = [
    ...curatedPresets.filter((p) => p.is_featured),
    ...realmPresets.filter((p) => p.is_featured),
    ...curatedPresets.filter((p) => !p.is_featured),
    ...realmPresets.filter((p) => !p.is_featured),
  ]

  const hoveredMode = activeMode ? screensaverModes.find((m) => m.href.includes(activeMode)) : null

  return (
    <div className="min-h-screen" style={{ background: '#07050f' }}>

      {/* ── SLIM TOP HEADER ── */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1">
        <Link href="/home2" className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity flex-1"
          style={{ color: 'rgba(255,255,255,0.82)' }}>
          ← Home
        </Link>
        <h1
          className="font-cinzel text-lg font-bold tracking-[0.25em] shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 30%, #f5d06e 50%, #c9973a 70%, #6b4411 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
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

      {/* ── REALMS PLAYER (viewing panel) ── */}
      <RealmsPlayer audioMap={audioMap} compact />

      {/* ── VISUAL MODES ── */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(168,85,247,0.12)', background: '#07050f' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <SectionTitle variant="white">Select Visual Mode</SectionTitle>
            <AnimatePresence mode="wait">
              <motion.p key={hoveredMode?.title ?? 'x'}
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="text-white/80 text-[11px] tracking-wide"
              >
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
                  }}
                >
                  {mode.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── PRESET LIBRARY + MUSIC PLAYER ── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-4">
          <SectionTitle variant="gold">Choose Realm</SectionTitle>
          <p className="text-white/70 text-xs mt-1">Select a realm preset to enter its visual world</p>
        </div>
        <div className="flex gap-5 items-start">

          {/* LEFT: Preset library — half width */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle variant="gold">Preset Library</SectionTitle>
              <p className="text-white/60 text-[10px]">{allPresets.length} presets</p>
            </div>
            <div className="space-y-1 pr-1">
              {allPresets.map((preset, i) => (
                <PresetRow
                  key={preset.id}
                  preset={preset as Parameters<typeof PresetRow>[0]['preset']}
                  index={i}
                  total={allPresets.length}
                  isActive={activePreset === preset.id}
                  onClick={() => setActivePreset(preset.id)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Music player — fixed width */}
          <div
            className="w-72 shrink-0 rounded-xl overflow-hidden border self-stretch"
            style={{ borderColor: 'rgba(201,151,58,0.15)', background: 'rgba(7,5,15,0.9)' }}
          >
            <MusicPanel activeAlbum={activeAlbum} onSelect={setActiveAlbum} />
          </div>
        </div>
      </div>

    </div>
  )
}
