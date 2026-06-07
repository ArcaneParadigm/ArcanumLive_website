'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD  = '#c9973a'
const CYAN  = '#00e5ff'
const RED   = '#ff3344'

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

interface VRClip {
  id: string
  title: string
  desc: string
  youtubeId: string
  game: 'elven' | 'indeath'
}

const CLIPS: VRClip[] = [
  // ── Elven Assassin ────────────────────────────────────────────────────────
  { id: 'ea-pvp-7min', game: 'elven', title: 'Elven Assassin — 7 Min PvP Match #1', youtubeId: '8-Fu19BLKOw', desc: 'Raw 7-minute PvP match featuring fast teleport plays and precision headshots.' },
  { id: 'ea-pvp-1', game: 'elven', title: 'Elven Assassin PvP #1', youtubeId: 'cLYRWMJvvnw', desc: 'Competitive PvP gameplay — aggressive plays and clean kills.' },
  { id: 'ea-scores', game: 'elven', title: 'Arcane Elven Scores', youtubeId: 'cNkstUiatsM', desc: 'Competitive scoring showcase — dominating the leaderboard.' },
  { id: 'ea-pvp-2', game: 'elven', title: 'Elven Assassin PvP #2', youtubeId: 'hChXFa9zkco', desc: 'Another clutch PvP match from the archives.' },
  { id: 'ea-pvp-7min-2', game: 'elven', title: 'Elven Assassin — 7 Min PvP Match #2', youtubeId: 'tRUVpmH42cU', desc: 'Teleport control and precision headshots — 7-minute showdown.' },
  // ── In Death ──────────────────────────────────────────────────────────────
  { id: 'id-abyss-pit', game: 'indeath', title: 'Abyss v7 — Pit of Death', youtubeId: '69WiXKqXLHs', desc: 'Pit combat in the Abyss — navigating one of the hardest arenas in VR archery.' },
  { id: 'id-speedrun', game: 'indeath', title: 'In Death Speed Run', youtubeId: 'GaVaTFqnwzY', desc: 'Full speed run — clearing the gauntlet as fast as mechanically possible.' },
  { id: 'id-90k-bow', game: 'indeath', title: 'Trial Run — 90k Power Bow', youtubeId: '-9TXF4FznBs', desc: 'Trial run using the 90k power bow — pure destruction.' },
  { id: 'id-lev11', game: 'indeath', title: 'In Death Level 11', youtubeId: '1nAr1wQK6gw', desc: 'Reached the boss level — pushing the limits of the run.' },
  { id: 'id-runner', game: 'indeath', title: 'In Death — No Death Run', youtubeId: '3Q7Y7h2QwXY', desc: 'Flawless no-death run — precision archery from start to finish.' },
  { id: 'id-fierce', game: 'indeath', title: 'In Death — Fierce Difficulty', youtubeId: '3q_NBzIcIPA', desc: 'Fierce difficulty — the arrows fly faster, the enemies hit harder.' },
  { id: 'id-sesh1', game: 'indeath', title: 'In Death Session', youtubeId: '92dHIZSyUbs', desc: 'Full gaming session — methodical clearing through the cathedral and beyond.' },
  { id: 'id-levelx', game: 'indeath', title: 'In Death — Level X', youtubeId: 'N2hIt_0txa4', desc: 'Attempting to beat a high score of 4,646,000 — elite-level run.' },
  { id: 'id-abyss-full', game: 'indeath', title: 'In Death Abyss — Full Run', youtubeId: 'aF7JdVha6Zc', desc: 'Complete Abyss mode playthrough — the full gauntlet from entry to end.' },
  { id: 'id-156k', game: 'indeath', title: 'Trials — 156k Score', youtubeId: 'f__PRmwAzR8', desc: 'Trial run with regular arrows scoring 156k — clean and efficient.' },
  { id: 'id-pit-aug20', game: 'indeath', title: 'Pit Contest — Aug 2020', youtubeId: 'hkDdXc6oS0M', desc: 'Competitive pit contest entry from August 2020.' },
  { id: 'id-orphan', game: 'indeath', title: 'In Death — Orphan Hunt', youtubeId: 'jVqGlMHlai8', desc: 'VR journey to save the divine Orphan — deep lore run.' },
  { id: 'id-lev1', game: 'indeath', title: 'In Death Level 1-2', youtubeId: 'nClJ3YSWSqc', desc: 'Early level gameplay showing clean fundamentals and arrow economy.' },
  { id: 'id-mainrun', game: 'indeath', title: 'In Death — Main Campaign Run', youtubeId: 'udYU6cjuXFY', desc: 'Full main campaign run — cathedral, abyss, purgatory.' },
  { id: 'id-unchained', game: 'indeath', title: 'In Death Unchained — Quest', youtubeId: 'wCLqr3v5Whc', desc: 'In Death Unchained on Meta Quest — untethered archery mastery.' },
  { id: 'id-purist-pit', game: 'indeath', title: 'v7 Purist Pit', youtubeId: 'a3rDwAvYhD8', desc: 'Purist pit difficulty — no power-ups, raw skill only.' },
  { id: 'id-v7-abyss', game: 'indeath', title: 'v7 Abyss Mode', youtubeId: 'it_PIDL-kUA', desc: 'Version 7 Abyss mode — the toughest iteration of the legendary gauntlet.' },
  { id: 'id-157k', game: 'indeath', title: 'Trials — Vanilla Arrows 157k', youtubeId: 'Qai0Cm9OBjU', desc: 'Vanilla arrows only, 157k — proof that fundamentals beat gear.' },
  { id: 'id-top3', game: 'indeath', title: '20 Min Challenge to #3', youtubeId: 'grDxr8bWuu4', desc: '20-minute speed run pushing for the #3 leaderboard rank.' },
  { id: 'id-session2', game: 'indeath', title: 'In Death Session 2', youtubeId: 'T0FTBw00EK8', desc: 'Another session in the cathedral — sharpening the edge.' },
]

const ELVEN  = CLIPS.filter(c => c.game === 'elven')
const INDEATH = CLIPS.filter(c => c.game === 'indeath')

// ── Video card ────────────────────────────────────────────────────────────────

function ClipCard({ clip, isActive, onSelect, color }: {
  clip: VRClip; isActive: boolean; onSelect: () => void; color: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}>
      <div className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '16/9',
          border: `1px solid ${isActive ? color : hovered ? color + '80' : color + '35'}`,
          boxShadow: isActive ? `0 0 20px ${color}60, 0 0 50px ${color}18` : hovered ? `0 0 12px ${color}30` : 'none',
          transition: 'all 0.15s',
        }}>
        <img src={thumb(clip.youtubeId)} alt={clip.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.9) 0%, transparent 55%)' }} />
        {isActive && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] tracking-widest uppercase"
            style={{ background: `${color}30`, border: `1px solid ${color}`, color }}>Playing</div>
        )}
        {hovered && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${color}` }}>
              <span style={{ color, fontSize: 'clamp(10px, 2vw, 14px)', marginLeft: 2 }}>▶</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-2">
          <p className="font-cinzel text-[9px] font-bold leading-tight"
            style={{ color: isActive ? color : '#fff', textShadow: '0 1px 6px rgba(0,0,0,1)' }}>
            {clip.title}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Game section ──────────────────────────────────────────────────────────────

function GameSection({ title, tagline, clips, color, accentBg, selected, onSelect }: {
  title: string; tagline: string; clips: VRClip[]; color: string; accentBg: string;
  selected: VRClip; onSelect: (c: VRClip) => void;
}) {
  return (
    <div className="mb-14">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-1">
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}50)` }} />
        <div className="flex items-center gap-3">
          <motion.div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <h2 className="font-cinzel text-xl font-bold tracking-widest" style={{ color: '#e8dcc8' }}>{title}</h2>
          <motion.div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }} />
        </div>
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }} />
      </div>
      <p className="text-center text-[10px] tracking-widest uppercase mb-5" style={{ color: `${color}70` }}>{tagline}</p>

      {/* Player */}
      <div className="mb-4">
        <div className="relative overflow-hidden rounded-2xl"
          style={{ boxShadow: `inset 0 0 0 1px ${color}20, 0 16px 60px rgba(0,0,0,0.8), 0 0 60px ${color}10` }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
            <iframe
              key={selected.youtubeId}
              src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title={selected.title} style={{ border: 'none' }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <div>
            <h3 className="font-cinzel text-base font-bold" style={{ color: '#e8dcc8' }}>{selected.title}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{selected.desc}</p>
          </div>
          <a href={`https://youtu.be/${selected.youtubeId}`} target="_blank" rel="noopener noreferrer"
            className="text-[10px] tracking-widest uppercase shrink-0 ml-4" style={{ color: `${color}70` }}>
            YouTube ↗
          </a>
        </div>
      </div>

      {/* Clip grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {clips.map(clip => (
          <ClipCard key={clip.id} clip={clip} color={color}
            isActive={selected.id === clip.id}
            onSelect={() => { onSelect(clip); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VRPlayPage() {
  const [elvenSel,   setElvenSel]   = useState<VRClip>(ELVEN[0])
  const [indeathSel, setIndeathSel] = useState<VRClip>(INDEATH[0])

  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      {/* ── Hero ── */}
      <div className="relative pt-6 pb-5 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[9px] tracking-[0.6em] uppercase mb-1.5" style={{ color: CYAN }}>
            ArcaneParadigm · Meta Quest
          </p>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold mb-2"
            style={{
              background: `linear-gradient(135deg, #004466 0%, ${CYAN} 30%, #88eeff 55%, ${CYAN} 75%, #004466 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 20px ${CYAN}50)`,
            }}>
            VR Play
          </h1>
          <p className="text-white/45 text-sm max-w-md mx-auto">
            Elite VR archery gameplay — precision headshots, speed runs, and competitive PvP dominance.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center gap-8 mb-10 py-4 rounded-xl"
          style={{ border: `1px solid ${CYAN}20`, background: `${CYAN}06` }}>
          {[
            { label: 'Games', value: '2' },
            { label: 'Clips', value: `${CLIPS.length}` },
            { label: 'Specialty', value: 'VR Archery' },
            { label: 'Platform', value: 'Meta Quest' },
            { label: 'Rank', value: 'Elite' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-cinzel text-lg font-bold" style={{ color: CYAN }}>{s.value}</p>
              <p className="text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Elven Assassin */}
        <GameSection
          title="Elven Assassin"
          tagline={`PvP Archery Battles · ${ELVEN.length} clips`}
          clips={ELVEN}
          color={CYAN}
          accentBg="#001a2e"
          selected={elvenSel}
          onSelect={setElvenSel}
        />

        {/* In Death */}
        <GameSection
          title="In Death: Unchained"
          tagline={`Solo Archery Roguelite · ${INDEATH.length} clips`}
          clips={INDEATH}
          color={RED}
          accentBg="#1a0005"
          selected={indeathSel}
          onSelect={setIndeathSel}
        />

      </div>
    </div>
  )
}
