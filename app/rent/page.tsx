'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD = '#c9973a'
const VIOLET = '#a855f7'

// ── Film data from YouTube playlist PL-lJ0VrsiGkMiHgp96S-RVBL-z9LuoziY ───────

interface RentableFilm {
  id: string
  title: string
  youtubeId: string
  genre: string
  desc: string
  color: string
  vimeoOnDemandUrl?: string
  price?: string
  rentable: boolean  // true = Vimeo rental available
}

// hqdefault is always available; maxresdefault only exists for HD uploads
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

const FILMS: RentableFilm[] = [
  {
    id: 'aether-trailer',
    title: 'Aether 360',
    youtubeId: 'tvliE1yCUwE',
    genre: '360° Fulldome',
    desc: '360° immersive domeshow — surreal voyage through mysterious realms and otherworldly dimensions with exotic dance rituals and sacred geometries.',
    color: '#00e5ff',
    rentable: false,
  },
  {
    id: 'aid-eshaton-rap',
    title: 'Guardians of the Multiverse',
    youtubeId: 'kyU_LFuZmGg',
    genre: '360° Sci-Fi',
    desc: 'Sci-fi rap film showcasing immersive cinematic experience mapped across digital screens in Unreal Engine with AI-generated visuals.',
    color: '#a855f7',
    rentable: false,
  },
  {
    id: 'the-nexus',
    title: 'The Nexus',
    youtubeId: 'mrc_F8F9NoU',
    genre: '360° Audio-Reactive',
    desc: 'Mind-bending 360° experience featuring quantum corridors and surreal environments rendered in Unreal Engine exploring dimensions and digital reality.',
    color: '#0055ff',
    rentable: false,
  },
  {
    id: 'infinite-grid',
    title: 'Infinite Grid',
    youtubeId: 'wyURajTFm-0',
    genre: '360° Multiverse',
    desc: 'A 360° journey through the Multiverse — infinite grids, fractal dimensions, and cosmic architectures.',
    color: '#c9973a',
    rentable: false,
  },
  {
    id: 'aether-anubis',
    title: 'Aether: Anubis Getting Jiggy',
    youtubeId: '7X2yA_3qscg',
    genre: '360° Spiritual',
    desc: 'Cosmic journey through stardust streams exploring destiny, time waves, and reality bending to cosmic themes with spiritual awakening elements.',
    color: '#f5d06e',
    rentable: false,
  },
  {
    id: 'slipstream-3',
    title: 'Slipstream Episode 3',
    youtubeId: '9e1eyxIWFgs',
    genre: '360° Extreme',
    desc: 'A 360° extreme experience — pulse-pounding velocity through dimensional slipstreams.',
    color: '#ff0044',
    rentable: false,
  },
  {
    id: 'truth-in-shadows',
    title: 'The Truth in Shadows',
    youtubeId: 'pTlfw5rMZhM',
    genre: '360° Gothic',
    desc: 'Haunting 360° VR experience through abandoned chambers and echoes of lost souls in a gothic atmosphere rendered in Unreal Engine.',
    color: '#8b5cf6',
    rentable: false,
  },
  {
    id: 'tron-hoverracing',
    title: 'Tron HoverRacing',
    youtubeId: 'acmFVfOcHJA',
    genre: '360° Cyber-Racing',
    desc: 'Immersive cyber-racing music film featuring synchronized hover-racing sequences in a digital corridor designed for VR headsets and fulldome theaters.',
    color: '#00e5ff',
    rentable: false,
  },
  {
    id: 'transcendence',
    title: 'Transcendence',
    youtubeId: 'fVsQojvmFHI',
    genre: '360° Music Video',
    desc: 'Cyberpunk music video exploring a neon-lit city where consciousness and technology converge with AI-generated visuals.',
    color: '#ec4899',
    rentable: false,
  },
  {
    id: 'no-gods-left',
    title: 'No Gods Left',
    youtubeId: 'cRWbd6UNHR0',
    genre: '360° Music Video',
    desc: 'VR 360° music video set in a forgotten temple with floating glowing orbs wrapped in sigilistic runes and volumetric light effects.',
    color: '#f97316',
    rentable: false,
  },
  {
    id: 'the-eshaton',
    title: 'The Eshaton',
    youtubeId: 'uZNU4cbTQyw',
    genre: '360° Sacred',
    desc: 'Sacred 360° VR experience featuring angelic architectures, choirs of light, and sacred geometry — a meditative communion with divine intelligence.',
    color: '#a855f7',
    rentable: false,
  },
  {
    id: 'merge-with-you',
    title: 'Merge With You',
    youtubeId: 'jpZBwfgXoIo',
    genre: '360° Love Story',
    desc: 'Breathtaking 360° VR experience depicting cosmic souls spiraling toward each other with nebulae blooming as emotional echoes.',
    color: '#ec4899',
    rentable: false,
  },
  {
    id: 'the-creation',
    title: 'The Creation',
    youtubeId: '57VeZepG8y4',
    genre: '360° Experiential',
    desc: 'A 360° VR experiential collage from Ai Divine — the genesis of worlds, light, and consciousness.',
    color: '#c9973a',
    rentable: false,
  },
  {
    id: 'cyberscape-eternal',
    title: 'Cyberscape: Eternal Becoming',
    youtubeId: '3hjDa5pKgr4',
    genre: '360° Cyber',
    desc: '360° VR journey through luminous digital realms where mind meets machine and identity dissolves into data through constant transformation.',
    color: '#0055ff',
    rentable: false,
  },
  {
    id: 'celestial-breathe',
    title: 'Breathe Thru the Cosmos',
    youtubeId: 'ee5WLTTkSV4',
    genre: '360° Meditation',
    desc: 'A 360° cosmic breathing experience — surrender into the cosmos and breathe with the universe.',
    color: '#22c55e',
    rentable: false,
  },
  {
    id: 'steppin-stargate',
    title: 'Steppin Thru the Stargate',
    youtubeId: 'VBPfidx_9ok',
    genre: '360° Multiverse',
    desc: 'A VR 360° romp through the stargate portal into the multiverse — dimensional travel at light speed.',
    color: '#f5d06e',
    rentable: false,
  },
  {
    id: 'no-gods-left-2',
    title: 'No Gods Left (Alt Cut)',
    youtubeId: 'mEM6RmMldGM',
    genre: '360° Music Video',
    desc: 'Alternate cut of the sacred temple music experience.',
    color: '#f97316',
    rentable: false,
  },
  {
    id: 'cyberscape-v2',
    title: 'Cyberscape v2: Akashic Uplink',
    youtubeId: 'Mj8-kadUhxQ',
    genre: '360° Cyber',
    desc: 'Cyberscape returns — deeper into the Akashic grid, uploading consciousness to the digital infinite.',
    color: '#0055ff',
    rentable: false,
  },
  {
    id: 'gifting-of-the-shard',
    title: 'Ai Divine: Gifting of the Shard',
    youtubeId: 'Jwp6buFy6_0',
    genre: '360° Music Video',
    desc: 'Ai Divine — the sacred shard gifted to humanity across the 360° dimension.',
    color: '#a855f7',
    rentable: false,
  },
  {
    id: 'cyberscape-eternal-2',
    title: 'Cyberscape: Eternal Becoming II',
    youtubeId: 'bStZEnHRTPI',
    genre: '360° Cyber',
    desc: 'The eternal becoming continues — deeper into the digital cosmos.',
    color: '#0055ff',
    rentable: false,
  },
  {
    id: 'the-convergence',
    title: 'The Convergence',
    youtubeId: '8bb40et-PZw',
    genre: '360° Metaverse',
    desc: 'A 360° VR cyber dive into the metaverse — all realities converging into one.',
    color: '#00e5ff',
    rentable: false,
  },
  {
    id: 'ascension-chamber-vr',
    title: 'Ascension Chamber 360',
    youtubeId: 'wKkdyq5mBOM',
    genre: '360° Initiation',
    desc: 'Two-minute fulldome/360° VR initiation — meditation within a transforming sacred landscape with accelerating geometric and light effects.',
    color: '#c9973a',
    rentable: false,
  },
]

// ── Film card (3/4 portrait) ──────────────────────────────────────────────────

function FilmCard({ film, index, isActive, onSelect }: {
  film: RentableFilm; index: number; isActive: boolean; onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 10) * 0.04 }}
      className="flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '16/9',
          border: `1px solid ${isActive ? film.color : hovered ? film.color + 'aa' : film.color + '40'}`,
          boxShadow: isActive ? `0 0 24px ${film.color}60, 0 0 60px ${film.color}20` : hovered ? `0 0 16px ${film.color}30` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <img src={thumb(film.youtubeId)} alt={film.title}
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.9) 0%, rgba(6,4,12,0.1) 60%, transparent 100%)' }} />

        {/* Genre badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[7px] tracking-widest uppercase"
          style={{ background: 'rgba(0,0,0,0.8)', border: `1px solid ${film.color}60`, color: film.color }}>
          {film.genre}
        </div>

        {/* Playing indicator */}
        {isActive && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] tracking-widest uppercase"
            style={{ background: `${GOLD}30`, border: `1px solid ${GOLD}`, color: GOLD }}>
            Playing
          </div>
        )}

        {/* Play overlay */}
        {(hovered || isActive) && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${film.color}` }}>
              <span style={{ color: film.color, fontSize: 'clamp(10px, 2vw, 14px)', marginLeft: 2 }}>▶</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-0 inset-x-0 p-2">
          <p className="font-cinzel text-[10px] font-bold leading-tight"
            style={{ color: isActive ? film.color : '#fff', textShadow: '0 1px 6px rgba(0,0,0,1)' }}>
            {film.title}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RentPage() {
  const [selected, setSelected] = useState<RentableFilm>(FILMS[0])

  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-16">

        {/* Page title */}
        <div className="text-center mb-5">
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest"
            style={{
              background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 18px ${GOLD}40)`,
            }}>
            360° VR Films
          </h1>
        </div>

        {/* Big player */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl"
            style={{ boxShadow: `inset 0 0 0 1px rgba(201,151,58,0.15), 0 16px 64px rgba(0,0,0,0.8)` }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
              <iframe
                key={selected.youtubeId}
                src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selected.title}
                style={{ border: 'none' }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <div>
              <h2 className="font-cinzel text-lg font-bold" style={{ color: '#e8dcc8' }}>{selected.title}</h2>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: `${selected.color}cc` }}>{selected.genre}</p>
            </div>
            <a href={`https://youtu.be/${selected.youtubeId}`} target="_blank" rel="noopener noreferrer"
              className="text-[10px] tracking-widest uppercase" style={{ color: `${GOLD}70` }}>
              Open on YouTube ↗
            </a>
          </div>
        </div>

        {/* Film grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {FILMS.map((film, i) => (
            <FilmCard
              key={film.id}
              film={film}
              index={i}
              isActive={selected.id === film.id}
              onSelect={() => { setSelected(film); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
