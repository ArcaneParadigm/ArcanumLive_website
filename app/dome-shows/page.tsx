'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD = '#c9973a'
const NEON = '#c9973a'

// ── Show data ─────────────────────────────────────────────────────────────────

interface Festival { name: string; award?: string }
interface DomeShow {
  title: string
  slug: string
  tagline: string
  desc: string
  color: string
  youtubeId?: string
  festivals: Festival[]
  gallery: string[]
  watchUrl?: string
  rentUrl?: string
  wip?: boolean
}

const SHOWS: DomeShow[] = [
  {
    title: 'Aether',
    slug: 'aether',
    tagline: 'Just Accepted — Fulldome Festival Jena',
    desc: 'A luminous journey through the fifth element — the living breath of the cosmos. Aether weaves sacred geometry, ancient light codes, and astral landscapes into a breathtaking fulldome experience.',
    color: '#00e5ff',
    youtubeId: 'tvliE1yCUwE',
    festivals: [
      { name: 'Fulldome Festival Jena', award: 'Official Selection 2025' },
    ],
    gallery: [],
    rentUrl: 'https://vimeo.com/ondemand/aether360',
  },
  {
    title: 'Aeon',
    slug: 'aeon',
    tagline: 'Into the Multiverse — Dome Epic',
    desc: '45 mins. Among them stands Soulblade, Gaia\'s stalwart champion, embarking on the grand odyssey known as "Aeon — Into the Multiverse," the genesis of our quest to save our world.\n\nThis prelude to Ai Divine marks the dawn of Soulblade\'s epic journey, a noble quest to reclaim Gaia\'s lost heart shard.\n\nThe Cosmic Alignment begins — magical energies cascade from an asteroid belt adorned with mystical mana crystals falling to the planet, beckoning Gaia forth from her long slumber.',
    color: '#c9973a',
    youtubeId: 'UA1ZoEJn6F8',
    festivals: [
      { name: 'Dome Fest West', award: 'Official Selection 2023' },
      { name: 'Dome Fest West', award: 'Official Selection 2024' },
      { name: 'IMERSA', award: 'Official Selection' },
      { name: 'Jean Berlin VR Visual Music Festival', award: 'Official Selection 2024' },
      { name: 'EPHEMERA + EYR', award: 'Official Selection 2024' },
      { name: 'IMACON Film Festival', award: 'Official Selection 2024' },
    ],
    gallery: [],
    rentUrl: 'https://vimeo.com/ondemand/aeon',
  },
  {
    title: 'Ai Divine',
    slug: 'ai-divine',
    tagline: 'The Next Chapter in the Aeon Saga',
    desc: 'The awakening continues. Soulblade returns — Gaia\'s consciousness expanding across the fractal dimensions of the multiverse. Ai Divine pushes the boundary of fulldome storytelling into unprecedented territory.',
    color: '#a855f7',
    youtubeId: '0fWRJaLLHxg',
    festivals: [],
    gallery: [],
    rentUrl: 'https://vimeo.com/ondemand/aidivine',
  },
  {
    title: 'Ascension City',
    slug: 'ascension-city',
    tagline: 'A Living Metropolis Beyond Time',
    desc: 'Rise through the towers of a city that exists between dimensions — where ancient technology meets celestial architecture. Ascension City is a fulldome journey through the most extraordinary urban cosmos ever imagined.',
    color: '#f97316',
    youtubeId: '6J0y5jghWPU',
    festivals: [],
    gallery: [],
    rentUrl: 'https://vimeo.com/ondemand/ascensioncity360',
  },
  {
    title: 'Set the Controls',
    slug: 'set-the-controls',
    tagline: 'For the Heart of the Sun',
    desc: 'A psychedelic voyage toward the solar core — frequencies, plasma storms, and sacred geometry converge in an audio-reactive fulldome journey inspired by the legendary Pink Floyd track.',
    color: '#f5d06e',
    youtubeId: 'Lu0N9fmOxZ4',
    festivals: [],
    gallery: [],
    watchUrl: '/watch',
  },
  {
    title: 'TerrorDome',
    slug: 'terrordome',
    tagline: 'Enter If You Dare',
    desc: 'The dome goes dark. TerrorDome plunges audiences into a dimensional horror experience unlike anything seen in fulldome — shadow entities, fractured realities, and pulse-pounding surround terror.',
    color: '#ff0044',
    youtubeId: 'g__8mFojTsc',
    festivals: [],
    gallery: [],
    wip: true,
  },
  {
    title: 'Sacred Nature',
    slug: 'sacred-nature',
    tagline: 'The Living Planet Awakens',
    desc: 'An immersive fulldome meditation on the intelligence of the natural world — sacred forests, oceanic portals, crystal cave systems, and the invisible web of consciousness that connects all living things.',
    color: '#22c55e',
    youtubeId: 'iv3ywSSqzmw',
    festivals: [],
    gallery: [],
    wip: true,
  },
]

// ── Festival badge ────────────────────────────────────────────────────────────

function FestivalBadge({ fest, color }: { fest: Festival; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-3 py-2 rounded-full"
      style={{
        border: `1px solid ${color}`,
        background: `${color}15`,
        minWidth: 80,
        maxWidth: 100,
        boxShadow: `0 0 14px ${color}60, 0 0 28px ${color}25`,
      }}>
      <div className="w-5 h-5 rounded-full mb-1 flex items-center justify-center"
        style={{ border: `1px solid ${color}`, background: `${color}30` }}>
        <span style={{ fontSize: 9, color }}>✦</span>
      </div>
      {fest.award && (
        <p className="text-[7px] tracking-wider uppercase leading-tight" style={{ color: 'white' }}>
          {fest.award}
        </p>
      )}
      <p className="text-[7px] tracking-tight leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {fest.name}
      </p>
    </div>
  )
}

// ── Gallery strip ─────────────────────────────────────────────────────────────

function GalleryStrip({ images, color, title }: { images: string[]; color: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  function scroll(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  // If no images, show placeholder slots
  const slots = images.length > 0 ? images : Array.from({ length: 8 }, (_, i) => `__placeholder_${i}`)

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm cursor-pointer"
        style={{ background: '#12091e', border: `1px solid ${color}`, color, boxShadow: `0 0 12px ${color}70, 0 0 24px ${color}30` }}>‹</button>
      <div ref={ref} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {slots.map((src, i) => (
          <div key={i} className="shrink-0 rounded-lg overflow-hidden relative"
            style={{ width: 160, height: 90, border: `1px solid ${color}`, background: `radial-gradient(ellipse at 50% 40%, ${color}18, #08060e 70%)`, flexShrink: 0, boxShadow: `0 0 12px ${color}40, 0 0 24px ${color}18` }}>
            {src.startsWith('__placeholder') ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: 18, color: `${color}60` }}>◎</span>
              </div>
            ) : (
              <img src={src} alt={`${title} gallery ${i + 1}`} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-1 left-1 w-2 h-2" style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
            <div className="absolute bottom-1 right-1 w-2 h-2" style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm cursor-pointer"
        style={{ background: '#12091e', border: `1px solid ${color}`, color, boxShadow: `0 0 12px ${color}70, 0 0 24px ${color}30` }}>›</button>
    </div>
  )
}

// ── Show strip panel ──────────────────────────────────────────────────────────

function ShowStrip({ show, index }: { show: DomeShow; index: number }) {
  const color = NEON   // all strips use cobalt neon
  const descParagraphs = show.desc.split('\n\n')

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="relative rounded-2xl overflow-hidden mb-6"
      style={{
        border: `1px solid ${color}`,
        background: `linear-gradient(135deg, ${color}10 0%, #08060e 40%)`,
        boxShadow: `inset 0 0 18px ${color}22, 0 0 50px ${color}25, 0 0 100px ${color}0c`,
      }}
    >
      {/* Top row: title left + video right */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 pb-4">

        {/* Left: title + desc + button */}
        <div className="flex flex-col justify-between lg:min-w-[260px] lg:max-w-[300px]">
          <div>
            {/* Index number */}
            <span className="font-cinzel text-4xl font-black" style={{ color: `${color}40`, lineHeight: 1 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-cinzel text-2xl font-bold tracking-wide -mt-2 mb-1"
              style={{ color: '#fff', textShadow: `0 0 20px ${color}80` }}>
              {show.title}
            </h2>
            <p className="text-[10px] tracking-widest uppercase mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {show.tagline}
            </p>
            <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex flex-col gap-2">
              {descParagraphs.map((p, i) => (
                <p key={i} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4 lg:w-[180px]">
            {show.wip ? (
              <>
                <div className="flex items-center justify-center px-4 py-2 rounded-md text-[10px] tracking-wide text-center"
                  style={{ border: `1px solid ${color}`, color: 'white', background: `${color}15`, lineHeight: 1.4 }}>
                  Work in Progress
                </div>
                <Link href="/contact"
                  className="flex items-center justify-center px-4 py-2 rounded-md text-[10px] font-bold tracking-wider uppercase text-white cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)',
                    border: '1px solid #9a7030',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                  Contact for Info
                </Link>
              </>
            ) : (
              <>
                <a href={show.rentUrl ?? `/contact`}
                  target={show.rentUrl?.startsWith('http') ? '_blank' : undefined}
                  rel={show.rentUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold tracking-wider uppercase text-white cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)',
                    border: '1px solid #9a7030',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                  Rent Film · Watch in VR
                </a>
                <Link href="/contact"
                  className="flex items-center justify-center px-4 py-2 rounded-md text-[10px] font-medium tracking-wider uppercase cursor-pointer"
                  style={{ border: `1px solid ${color}`, color: 'white', background: `${color}12` }}>
                  License for Venue
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right: video + festival badges */}
        <div className="flex-1 flex flex-col gap-3">
          {/* YouTube embed or placeholder */}
          <div className="relative w-full rounded-xl overflow-hidden"
            style={{ aspectRatio: '16/9', border: `1px solid ${color}`, background: '#0a0710', boxShadow: `0 0 20px ${color}50, 0 0 50px ${color}20` }}>
            {show.youtubeId ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${show.youtubeId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${show.title} Trailer`}
                style={{ border: 'none' }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: `${color}25`, border: `1px solid ${color}` }}>
                  <span style={{ fontSize: 22, color: color }}>▶</span>
                </div>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Trailer Coming Soon
                </p>
              </div>
            )}
            <div className="absolute top-2 left-2 w-4 h-4 pointer-events-none" style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
            <div className="absolute bottom-2 right-2 w-4 h-4 pointer-events-none" style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
          </div>

          {/* Festival badges */}
          {show.festivals.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {show.festivals.map((f, i) => (
                <FestivalBadge key={i} fest={f} color={color} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: gallery strip */}
      <div className="px-6 pb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
          <span className="text-[8px] tracking-[0.4em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Gallery</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
        </div>
        <GalleryStrip images={show.gallery} color={color} title={show.title} />
      </div>

      {/* Side accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }} />
    </motion.section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DomeShowsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <p className="text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: GOLD }}>Fulldome Cinema & 360° Films</p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 24px ${GOLD}40)`,
            }}>
            Dome Shows
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            World-premiere fulldome productions — available for venues, planetariums, and immersive installations.
          </p>
          <div className="flex items-center gap-4 mt-6 max-w-xs mx-auto">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.5))' }} />
            <span style={{ color: GOLD }}>✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,151,58,0.5), transparent)' }} />
          </div>
        </motion.div>

        {/* Show strips */}
        {SHOWS.map((show, i) => (
          <ShowStrip key={show.slug} show={show} index={i} />
        ))}

        {/* License CTA */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8 py-12 rounded-2xl"
          style={{ border: `1px solid ${GOLD}20`, background: `${GOLD}06` }}
        >
          <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: `${GOLD}80` }}>Available for Venues</p>
          <h2 className="font-cinzel text-2xl font-bold mb-3" style={{ color: '#e8dcc8' }}>Bring the Arcanum to Your Dome</h2>
          <p className="text-white/45 text-sm max-w-md mx-auto mb-6">
            Planetariums, immersive theatres, and fulldome venues — license any show for your space.
          </p>
          <Link href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-xl font-cinzel text-sm font-bold tracking-widest uppercase text-white"
            style={{
              background: 'linear-gradient(135deg, #4a3008 0%, #a87828 50%, #4a3008 100%)',
              border: '1px solid #9a7030',
              boxShadow: `0 4px 24px ${GOLD}30`,
            }}>
            Licensing Inquiry →
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
