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
}

const GOLD = '#c9973a'

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

function gradientColor(index: number, total: number): string {
  const stops = ['#7c3aed', '#a855f7', '#d946ef', '#f97316', '#c9973a']
  const t = index / Math.max(total - 1, 1)
  const seg = (stops.length - 1) * t
  const i = Math.min(Math.floor(seg), stops.length - 2)
  const f = seg - i
  const hex = (s: string) => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)]
  const a = hex(stops[i]), b = hex(stops[i+1])
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*f)},${Math.round(a[1]+(b[1]-a[1])*f)},${Math.round(a[2]+(b[2]-a[2])*f)})`
}

// ── Skinny realm card for Ascension Chamber ───────────────────────────────────
// Top image area → activates realm in player window
// Bottom strip   → navigate to /realms/[slug]

function AscensionRealmCard({
  world, isActive, onActivate,
}: {
  world: { slug?: string; title?: string; color_primary?: string; card?: string | null }
  isActive: boolean
  onActivate: () => void
}) {
  const color = world.color_primary ?? GOLD
  const router = useRouter()
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="shrink-0 rounded-lg overflow-hidden flex flex-col"
      style={{
        width: 76,
        aspectRatio: '2/3',
        border: `1px solid ${isActive ? color + '90' : color + '25'}`,
        boxShadow: isActive ? `0 0 14px ${color}50` : 'none',
        background: `radial-gradient(ellipse at 50% 20%, ${color}18, #07050f 75%)`,
      }}
      animate={{ scale: hov || isActive ? 1.04 : 1, y: hov ? -3 : 0 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => { setHov(true); playCrystalBowl(color, 0.018) }}
      onMouseLeave={() => setHov(false)}
    >
      {/* Top image — click to activate in player */}
      <div
        className="flex-1 relative cursor-pointer"
        onClick={onActivate}
        style={{ minHeight: 0 }}
      >
        {world.card && (
          <img src={world.card} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        )}
        <div className="absolute inset-0" style={{
          background: isActive
            ? `linear-gradient(to bottom, transparent 40%, ${color}40 100%)`
            : 'linear-gradient(to bottom, transparent 50%, rgba(7,5,15,0.7) 100%)',
        }} />
        {isActive && (
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span className="text-[7px] tracking-widest uppercase" style={{ color }}>▶ Active</span>
          </div>
        )}
        {hov && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/70 text-base">▶</span>
          </div>
        )}
        <div className="absolute top-1 left-1 w-2 h-2" style={{ borderTop: `1px solid ${color}55`, borderLeft: `1px solid ${color}55` }} />
      </div>

      {/* Title label */}
      <div className="px-1 py-0.5" style={{ background: isActive ? `${color}20` : 'rgba(7,5,15,0.9)' }}>
        <p className="font-cinzel truncate text-center leading-none"
          style={{ fontSize: 7, color: isActive ? color : 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
          {world.title}
        </p>
      </div>

      {/* Enter World button */}
      <button
        onClick={() => router.push(`/realms/${world.slug}`)}
        className="shrink-0 w-full text-center py-0.5 transition-colors"
        style={{
          fontSize: 6.5, letterSpacing: '0.12em', textTransform: 'uppercase',
          fontFamily: 'Cinzel, serif', fontWeight: 600,
          borderTop: `1px solid ${color}20`,
          color: hov ? color : 'rgba(255,255,255,0.3)',
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
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accent}25` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5"
        style={{ background: `${accent}10` }}>
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-sm font-bold tracking-widest" style={{ color: accent }}>{title}</span>
          {subtitle && <span className="text-white/40 text-[10px]">{subtitle}</span>}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: `${accent}80`, fontSize: 12 }}>
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}>
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

function PresetRow({ preset, index, total, isActive, onClick }: {
  preset: { id: string; title: string; slug?: string; description?: string; visual_mode?: string; color?: string; default_intensity?: number; audio_reactive?: boolean }
  index: number; total: number; isActive?: boolean; onClick?: () => void
}) {
  const mode = preset.visual_mode ?? 'gallery_drift'
  const icon = modeIcons[mode] ?? '◈'
  const label = modeLabel[mode] ?? mode
  const rowColor = gradientColor(index, total)
  const href = `/screensaver?preset=${preset.slug ?? preset.id}`

  return (
    <Link href={href} className="group block" onClick={onClick}>
      <div
        className="relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all duration-200 group-hover:scale-[1.01]"
        style={{
          borderColor: isActive ? `${rowColor}70` : `${rowColor}25`,
          background: isActive
            ? `linear-gradient(90deg, ${rowColor}22 0%, #07050f 100%)`
            : `linear-gradient(90deg, ${rowColor}0a 0%, #07050f 100%)`,
          boxShadow: isActive ? `0 0 12px ${rowColor}20` : 'none',
        }}>
        {isActive && (
          <motion.div className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ background: `linear-gradient(90deg, ${rowColor}15 0%, transparent 70%)` }} />
        )}
        <motion.div
          className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
          style={{ color: rowColor, background: `${rowColor}20`, border: `1px solid ${rowColor}${isActive ? '70' : '35'}` }}
          animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}>
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="leading-none mb-0.5 truncate">
            <span className="font-cinzel font-bold text-[11px]" style={{ color: rowColor }}>{preset.title}</span>
            <span className="text-[9px] tracking-wider uppercase ml-1.5" style={{ color: `${rowColor}80` }}>· {label}</span>
          </p>
          <p className="text-[9px] text-white/60 leading-none truncate">{preset.description}</p>
        </div>
        <div className="shrink-0 w-10 hidden sm:block">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${((preset.default_intensity ?? 5) / 10) * 100}%`, background: rowColor }} />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Music panel ───────────────────────────────────────────────────────────────
function MusicPanel({ activeAlbum, onSelect }: { activeAlbum: string | null; onSelect: (slug: string) => void }) {
  const allTitles = [
    ...featuredAlbums.map((a) => ({ slug: a.slug ?? '', title: a.title ?? '', energy: a.energy_level ?? 5, desc: a.description ?? '' })),
    ...musicCategories
      .filter((c) => !featuredAlbums.find((a) => a.title === c))
      .map((c, i) => ({ slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title: c, energy: 4 + (i % 6), desc: '' })),
  ]
  return (
    <div className="py-2 px-2 max-h-72 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'none' }}>
      {allTitles.map((album, i) => {
        const isActive = activeAlbum === album.slug
        const col = gradientColor(i, allTitles.length)
        return (
          <button key={album.slug} onClick={() => onSelect(album.slug)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
            style={{ background: isActive ? `${col}15` : 'transparent' }}>
            <div className="shrink-0 w-1 h-5 rounded-full" style={{ background: isActive ? col : `${col}35` }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium leading-none truncate" style={{ color: isActive ? col : 'rgba(255,255,255,0.6)' }}>{album.title}</p>
              {album.desc && <p className="text-[8px] text-white/40 truncate mt-0.5">{album.desc}</p>}
            </div>
            <div className="shrink-0 flex gap-0.5">
              {[...Array(5)].map((_, d) => (
                <div key={d} className="w-1 h-1 rounded-full" style={{ background: d < Math.round(album.energy / 2) ? col : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </button>
        )
      })}
      {activeAlbum && (
        <div className="px-2 py-1.5 border-t mt-1" style={{ borderColor: `${GOLD}20` }}>
          <p className="text-[9px] text-white/50 tracking-widest uppercase">Overriding →</p>
          <p className="text-[11px] font-cinzel truncate" style={{ color: GOLD }}>
            {allTitles.find(a => a.slug === activeAlbum)?.title}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AscensionChamberHub({ audioMap }: AscensionChamberHubProps) {
  const [activeMode,   setActiveMode]   = useState<string | null>(null)
  const [activeAlbum,  setActiveAlbum]  = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string>('1')
  const [activeRealm,  setActiveRealm]  = useState<string | null>(null)

  const realmPresets  = getRealmPresets()
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

  // Realm cards with card images
  const realmCards = featuredWorlds.map(w => ({
    slug: w.slug, title: w.title, color_primary: w.color_primary ?? undefined,
    card: w.slug ? `/realms/${w.slug}/card.jpg` : null,
  }))

  const hoveredMode = activeMode ? screensaverModes.find(m => m.href.includes(activeMode)) : null

  return (
    <div className="min-h-screen" style={{ background: '#07050f' }}>

      {/* ── Slim header ── */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1">
        <Link href="/home2" className="font-cinzel text-[10px] italic tracking-widest hover:opacity-100 transition-opacity flex-1"
          style={{ color: 'rgba(255,255,255,0.82)' }}>← Home</Link>
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
          }}>Living Visualizer</span>
      </div>

      {/* ── Player ── */}
      <RealmsPlayer audioMap={audioMap} compact />

      {/* ── Realm cards grid ── */}
      <div className="px-6 py-4 border-b" style={{ borderColor: `${GOLD}15`, background: '#07050f' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${GOLD}70` }}>Select Realm</p>
            {activeRealm && (
              <span className="text-[9px] px-2 py-0.5 rounded" style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}40` }}>
                {realmCards.find(r => r.slug === activeRealm)?.title ?? activeRealm}
              </span>
            )}
          </div>
          {/* Horizontal scrolling rail, multi-row via flex-wrap */}
          <div className="flex flex-wrap gap-2 max-h-[260px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {realmCards.map(r => (
              <AscensionRealmCard
                key={r.slug}
                world={r}
                isActive={activeRealm === r.slug}
                onActivate={() => setActiveRealm(r.slug ?? null)}
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
                className="text-white/70 text-[11px] tracking-wide">{hoveredMode?.description ?? ''}</motion.p>
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

      {/* ── Preset library + music (foldable) ── */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex gap-5 items-start">

        {/* Preset library — foldable, shows 6, scrollable */}
        <div className="flex-1 min-w-0">
          <Foldable title="Preset Library" subtitle={`${allPresets.length} presets`} accent={GOLD}>
            <div className="overflow-y-auto" style={{ maxHeight: 320, scrollbarWidth: 'thin' }}>
              <div className="space-y-1 px-3 pb-3 pt-1">
                {allPresets.map((preset, i) => (
                  <PresetRow
                    key={preset.id}
                    preset={preset as Parameters<typeof PresetRow>[0]['preset']}
                    index={i}
                    total={allPresets.length}
                    isActive={activePreset === preset.id}
                    onClick={() => setActivePreset(preset.id ?? '')}
                  />
                ))}
              </div>
            </div>
          </Foldable>
        </div>

        {/* Music override — foldable */}
        <div className="w-64 shrink-0">
          <Foldable title="Music Library" subtitle="Override soundtrack" accent="#f97316" defaultOpen={false}>
            <MusicPanel activeAlbum={activeAlbum} onSelect={setActiveAlbum} />
          </Foldable>
        </div>

      </div>
    </div>
  )
}
