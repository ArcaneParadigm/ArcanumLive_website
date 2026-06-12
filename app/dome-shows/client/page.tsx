'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Home2Nav from '@/components/home2/Home2Nav'
import GallerySystem from '@/components/ui/GallerySystem'
import type { GalleryImage } from '@/components/ui/GallerySystem'

const GOLD = '#c9973a'
const NEON = '#c9973a'
const PASSWORD = process.env.NEXT_PUBLIC_CLIENT_DOME_PASSWORD ?? 'arcanum'

// ── Show data ─────────────────────────────────────────────────────────────────

interface Festival { name: string; award?: string }
interface DomeShow {
  title: string
  slug: string
  tagline: string
  desc: string
  color: string
  trailerYoutubeId?: string
  fullMovieYoutubeId?: string
  festivals: Festival[]
  laurelImages?: string[]
  gallery: string[]
  watchUrl?: string
  rentUrl?: string
  wip?: boolean
  trailerText?: string
}

const SHOWS: DomeShow[] = [
  {
    title: 'Aether',
    slug: 'aether',
    tagline: 'Just Accepted — Fulldome Festival Jena',
    desc: 'A luminous journey through the fifth element — the living breath of the cosmos. Aether weaves sacred geometry, ancient light codes, and astral landscapes into a breathtaking fulldome experience.',
    color: '#00e5ff',
    trailerYoutubeId: 'tvliE1yCUwE',
    fullMovieYoutubeId: undefined,
    festivals: [
      { name: 'Fulldome Festival Jena', award: 'Official Selection 2025' },
    ],
    gallery: [
      ...Array.from({ length: 12 }, (_, i) => `/images/dome-shows/aether/Aether_equirec__${String(i * 2).padStart(3, '0')}.jpg`),
      ...Array.from({ length: 21 }, (_, i) => `/images/dome-shows/aether/Aether_dome_${String(i).padStart(3, '0')}.jpg`),
    ],
    rentUrl: 'https://vimeo.com/ondemand/aether360',
  },
  {
    title: 'Aeon',
    slug: 'aeon',
    tagline: 'Into the Multiverse — Dome Epic',
    desc: '45 mins. Among them stands Soulblade, Gaia\'s stalwart champion, embarking on the grand odyssey known as "Aeon — Into the Multiverse," the genesis of our quest to save our world.\n\nThe Cosmic Alignment begins — magical energies cascade from an asteroid belt adorned with mystical mana crystals falling to the planet, beckoning Gaia forth from her long slumber.',
    trailerText: 'This prelude to Ai Divine marks the dawn of Soulblade\'s epic journey, a noble quest to reclaim Gaia\'s lost heart shard.',
    color: '#c9973a',
    trailerYoutubeId: 'UA1ZoEJn6F8',
    fullMovieYoutubeId: undefined,
    festivals: [],
    laurelImages: [
      '/images/laurels/aeon-dome-fest-west.png',
      '/images/laurels/dome-fest-west-audience-choice-2022.png',
      '/images/laurels/imersa-2022.png',
      '/images/laurels/jena-official-selection.png',
      '/images/laurels/macon-2024.png',
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
    trailerYoutubeId: '0fWRJaLLHxg',
    fullMovieYoutubeId: undefined,
    festivals: [],
    laurelImages: [
      '/images/laurels/dome-fest-west-2022.png',
      '/images/laurels/fulldome-uk-2023.png',
      '/images/laurels/efemera-uvm-2024.png',
      '/images/laurels/jena-official-selection.png',
    ],
    gallery: [],
    rentUrl: 'https://vimeo.com/ondemand/aidivine',
  },
  {
    title: 'Ascension City',
    slug: 'ascension-city',
    tagline: 'A Living Metropolis Beyond Time',
    desc: 'Rise through the towers of a city that exists between dimensions — where ancient technology meets celestial architecture. Ascension City is a fulldome journey through the most extraordinary urban cosmos ever imagined.',
    color: '#f97316',
    trailerYoutubeId: '6J0y5jghWPU',
    fullMovieYoutubeId: undefined,
    festivals: [],
    gallery: [],
    rentUrl: 'https://vimeo.com/ondemand/ascensioncity360',
  },
  {
    title: 'Set the Controls',
    slug: 'set-the-controls',
    tagline: 'For the Heart of the Sun',
    desc: 'A psychedelic voyage toward the solar core — frequencies, plasma storms, and sacred geometry converge in an audio-reactive fulldome journey inspired by the legendary Pink Floyd track.',
    trailerText: 'Set the Controls completed a 3-month run at Area 15 in Las Vegas — the leading immersive venue in the United States — installed in its dedicated immersive room. Audiences experienced the film as a continuous ambient installation, the solar core pulsing through the space in an unending loop.',
    color: '#f5d06e',
    trailerYoutubeId: 'Lu0N9fmOxZ4',
    fullMovieYoutubeId: undefined,
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
    trailerYoutubeId: 'g__8mFojTsc',
    fullMovieYoutubeId: undefined,
    festivals: [],
    gallery: [
      '/images/dome-shows/terrordome/dungeon_0.jpg',
      '/images/dome-shows/terrordome/dungeon_1.jpg',
      '/images/dome-shows/terrordome/dungeon_2.jpg',
      '/images/dome-shows/terrordome/dungeon_3.jpg',
      '/images/dome-shows/terrordome/horror_4.jpg',
      '/images/dome-shows/terrordome/horror_5.jpg',
      '/images/dome-shows/terrordome/horror_6.jpg',
      '/images/dome-shows/terrordome/horror_7.jpg',
    ],
    wip: true,
  },
  {
    title: 'Sacred Nature',
    slug: 'sacred-nature',
    tagline: 'The Living Planet Awakens',
    desc: 'An immersive fulldome meditation on the intelligence of the natural world — sacred forests, oceanic portals, crystal cave systems, and the invisible web of consciousness that connects all living things.',
    color: '#22c55e',
    trailerYoutubeId: 'iv3ywSSqzmw',
    fullMovieYoutubeId: undefined,
    festivals: [],
    gallery: [],
    wip: true,
  },
]

// ── Password Gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function attempt() {
    if (value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
      try { sessionStorage.setItem('dome-client-auth', '1') } catch {}
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setValue('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#08060e' }}>
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 p-8 rounded-2xl max-w-sm w-full mx-4"
        style={{
          border: `1px solid ${GOLD}30`,
          background: `linear-gradient(135deg, ${GOLD}08 0%, #08060e 60%)`,
          boxShadow: `0 0 60px ${GOLD}15, inset 0 0 30px ${GOLD}08`,
        }}
      >
        {/* Emblem */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ border: `1px solid ${GOLD}50`, background: `${GOLD}12`, boxShadow: `0 0 20px ${GOLD}30` }}>
            <span style={{ fontSize: 20, color: GOLD }}>✦</span>
          </div>
          <p className="text-[9px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}80` }}>
            Client Access
          </p>
          <h2 className="font-cinzel text-xl font-bold text-center" style={{ color: '#e8dcc8' }}>
            Arcanum Dome Shows
          </h2>
          <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Private screening room — enter your access code
          </p>
        </div>

        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40)` }} />
          <span style={{ color: `${GOLD}60`, fontSize: 8 }}>✦</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}40, transparent)` }} />
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2 w-full">
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Access code"
            autoFocus
            className="w-full px-4 py-3 rounded-lg text-sm text-center tracking-[0.25em] outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? '#ff4466' : `${GOLD}30`}`,
              color: '#e8dcc8',
              boxShadow: error ? '0 0 12px rgba(255,68,102,0.3)' : 'none',
            }}
          />
          {error && (
            <p className="text-[9px] tracking-wider text-center" style={{ color: '#ff4466' }}>
              Incorrect access code
            </p>
          )}
        </div>

        <button
          onClick={attempt}
          className="w-full py-2.5 rounded-lg font-cinzel text-sm font-bold tracking-widest uppercase text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #4a3008 0%, #a87828 50%, #4a3008 100%)',
            border: '1px solid #9a7030',
            boxShadow: `0 4px 20px ${GOLD}20`,
          }}
        >
          Enter
        </button>
      </motion.div>
    </div>
  )
}

// ── Festival badge ────────────────────────────────────────────────────────────

function FestivalBadge({ fest, color }: { fest: Festival; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-full"
      style={{
        border: `1px solid ${color}`,
        background: `${color}15`,
        minWidth: 72,
        maxWidth: 90,
        padding: 4,
        boxShadow: `0 0 10px ${color}50, 0 0 20px ${color}20`,
      }}>
      <div className="w-4 h-4 rounded-full mb-0.5 flex items-center justify-center"
        style={{ border: `1px solid ${color}`, background: `${color}30` }}>
        <span style={{ fontSize: 6, color }}>✦</span>
      </div>
      {fest.award && (
        <p className="text-[6px] tracking-wider uppercase leading-tight" style={{ color: 'white' }}>
          {fest.award}
        </p>
      )}
      <p className="text-[6px] tracking-tight leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {fest.name}
      </p>
    </div>
  )
}

// ── Video slot ────────────────────────────────────────────────────────────────

function VideoSlot({ youtubeId, label, color, size }: {
  youtubeId?: string
  label: string
  color: string
  size: 'small' | 'large'
}) {
  const isSmall = size === 'small'
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function goFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen()
  }

  return (
    <div className={`flex flex-col gap-1 ${isSmall ? 'w-full' : 'flex-1'}`}>
      <p className="text-[8px] tracking-[0.35em] uppercase text-center" style={{ color: `${color}90` }}>
        {label}
      </p>
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          aspectRatio: '16/9',
          border: `1px solid ${color}`,
          background: '#0a0710',
          boxShadow: `0 0 ${isSmall ? 12 : 20}px ${color}${isSmall ? '40' : '50'}, 0 0 ${isSmall ? 30 : 50}px ${color}${isSmall ? '15' : '20'}`,
        }}
      >
        {youtubeId ? (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={label}
            style={{ border: 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="rounded-full flex items-center justify-center"
              style={{
                width: isSmall ? 32 : 56,
                height: isSmall ? 32 : 56,
                background: `${color}25`,
                border: `1px solid ${color}`,
              }}>
              <span style={{ fontSize: isSmall ? 12 : 20, color }}>▶</span>
            </div>
            <p className="text-[9px] tracking-widest uppercase text-center px-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Full Film Coming Soon
            </p>
          </div>
        )}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 pointer-events-none" style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
        {/* Fullscreen button — large slots only */}
        {!isSmall && youtubeId && (
          <button
            onClick={goFullscreen}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded text-[8px] tracking-widest uppercase font-bold transition-all"
            style={{
              background: 'rgba(8,6,14,0.75)',
              border: `1px solid ${color}50`,
              color,
              backdropFilter: 'blur(6px)',
            }}
          >
            ⛶ Fullscreen
          </button>
        )}
      </div>
    </div>
  )
}

// ── Show strip panel ──────────────────────────────────────────────────────────

function ShowStrip({ show, index }: { show: DomeShow; index: number }) {
  const color = NEON
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
      {/* Main row: left col desc+buttons, right col videos */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 p-4 lg:p-5 pb-4">

        {/* Left: title/desc top, buttons bottom */}
        <div className="flex flex-col justify-between shrink-0 gap-3 lg:w-[280px]">
          <div>
            <span className="font-cinzel text-4xl font-black" style={{ color: `${color}40`, lineHeight: 1 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-cinzel text-2xl font-bold tracking-wide -mt-2 mb-1"
              style={{ color: '#fff', textShadow: `0 0 20px ${color}80` }}>
              {show.title}
            </h2>
            <p className="text-[10px] tracking-widest uppercase mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {show.tagline}
            </p>
            <div className="h-px mb-2" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="flex flex-col gap-1.5">
              {descParagraphs.map((p, i) => (
                <p key={i} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</p>
              ))}
            </div>
          </div>

          {/* Bottom: buttons */}
          <div className="flex flex-col gap-2 w-full">
            {show.wip ? (
              <>
                <div className="flex items-center justify-center px-4 py-2 rounded-md text-[10px] tracking-wide text-center"
                  style={{ border: `1px solid ${color}`, color: 'white', background: `${color}15` }}>
                  Work in Progress
                </div>
                <Link href="/contact"
                  className="flex items-center justify-center px-4 py-2 rounded-md text-[10px] font-bold tracking-wider uppercase text-white"
                  style={{
                    background: 'linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)',
                    border: '1px solid #9a7030', boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                  Contact for Info
                </Link>
              </>
            ) : (
              <>
                <a href={show.rentUrl ?? `/contact`}
                  target={show.rentUrl?.startsWith('http') ? '_blank' : undefined}
                  rel={show.rentUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold tracking-wider uppercase text-white"
                  style={{
                    background: 'linear-gradient(135deg, #4a3008 0%, #7a5518 30%, #a87828 55%, #7a5518 75%, #4a3008 100%)',
                    border: '1px solid #9a7030', boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                  Rent Film · Watch in VR
                </a>
                <Link href="/contact"
                  className="flex items-center justify-center px-4 py-2 rounded-md text-[10px] font-medium tracking-wider uppercase"
                  style={{ border: `1px solid ${color}`, color: 'white', background: `${color}12`, marginTop: 4 }}>
                  License for Venue
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right: trailer (1/3) + full film (2/3) — fixed for all shows */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full sm:w-[33%] shrink-0 flex flex-col">
              {show.trailerText && (
                <p className="hidden sm:block text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {show.trailerText}
                </p>
              )}
              <VideoSlot youtubeId={show.trailerYoutubeId} label="Trailer" color={color} size="small" />
            </div>
            <div className="w-full sm:flex-1">
              <VideoSlot youtubeId={show.fullMovieYoutubeId} label="Full Film" color={color} size="large" />
            </div>
          </div>
        </div>
      </div>

      {/* Laurel band — between main and gallery */}
      {(show.laurelImages?.length || show.festivals.length > 0) && (
        <div className="flex items-center gap-4 px-5 py-3" style={{ borderTop: `1px solid ${color}20`, borderBottom: `1px solid ${color}20` }}>
          <div className="h-px flex-1 shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${color}50)` }} />
          <div className="flex gap-3 flex-wrap justify-center items-center">
            {show.laurelImages?.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="Festival Laurel" style={{ height: 72, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.15))' }} />
            ))}
            {show.festivals.map((f, i) => (
              <FestivalBadge key={i} fest={f} color={color} />
            ))}
          </div>
          <div className="h-px flex-1 shrink-0" style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }} />
        </div>
      )}

      {/* Gallery */}
      <div className="px-6 pb-5 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
          <span className="text-[8px] tracking-[0.4em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Gallery</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
        </div>
        {show.gallery.length > 0 ? (
          <GallerySystem
            images={show.gallery.map((src, i): GalleryImage => ({ id: String(i), src, alt: `${show.title} ${i + 1}` }))}
            accentColor={color}
            aspectRatio="16/9"
            label={`${show.title} Gallery`}
          />
        ) : (
          <div className="flex gap-2 overflow-x-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shrink-0 rounded-lg flex items-center justify-center"
                style={{ width: 'clamp(120px,20vw,160px)', aspectRatio: '16/9', border: `1px solid ${color}40`, background: `radial-gradient(ellipse at 50% 40%, ${color}10, #08060e 70%)` }}>
                <span style={{ color: `${color}40`, fontSize: 16 }}>◎</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }} />
    </motion.section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ClientDomeShowsPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('dome-client-auth') === '1') setUnlocked(true)
    } catch {}
    setChecking(false)
  }, [])

  if (checking) return null

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      <div className="max-w-6xl mx-auto px-6 pt-3 pb-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center mb-4">
          <p className="text-[9px] tracking-[0.6em] uppercase mb-1" style={{ color: GOLD }}>Client Screening Room</p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-1"
            style={{
              background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 24px ${GOLD}40)`,
            }}>
            Dome Shows
          </h1>
          <p className="text-white/50 text-xs max-w-lg mx-auto leading-relaxed">
            Full films available for venue licensing — trailers and complete features below.
          </p>
          <div className="flex items-center gap-4 mt-2 max-w-xs mx-auto">
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
