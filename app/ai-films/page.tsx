'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD = '#c9973a'

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

interface Film {
  id: string
  title: string
  desc: string
  youtubeId: string
  premiere?: boolean
}

const FILMS: Film[] = [
  { id: 'singularity-2026', title: 'Singularity 2026 Trailer', youtubeId: 'f08oGGZbyyc', desc: 'A mythic, glitchcore fever dream rendered with AI visuals, pushing into new dimensions of speed and surreal clarity.', premiere: true },
  { id: 'galactika', title: 'Galactika: War for the Living Stars', youtubeId: 'P0uVoINJNPc', desc: 'An epic multiversal conflict unfolds across living star systems — AI cinema at cosmic scale.', premiere: true },
  { id: 'ascension-chamber-1', title: 'Ascension Chamber 1', youtubeId: '4MRrrkrBn_c', desc: 'Enter the first chamber — a portal through sacred geometry and dimensional light fields.', premiere: true },
  { id: 'ai-film-demo', title: 'AI Film Demo: New Clips', youtubeId: 'HKzHmsS6Q3w', desc: 'A showcase of next-generation AI cinema clips pushing the boundary of immersive visual storytelling.', premiere: true },
  { id: 'ascension-chamber-2', title: 'Ascension Chamber 2: Keys to the Multiverse', youtubeId: 'jNcOT5fKMQk', desc: 'The second chamber reveals the keys — frequencies, codes, and dimensional keys to the multiverse.', premiere: true },
  { id: 'battle-thru-heavens', title: 'Battle Thru the Heavens: The 3 Year Agreement Part 1', youtubeId: 'VwTlGogpQ04', desc: 'A fan film epic — celestial warriors bound by a sacred three-year agreement fight through the heavens.', premiere: true },
  { id: 'hawaiian-dreams-1', title: 'Hawaiian Dreams 1: Journey Thru the Portal', youtubeId: 'ONLCEq7HXSA', desc: 'A journey through the portal to the magical side of Hawaii — ancient myth rendered in AI.', premiere: true },
  { id: 'ai-divine-1000-year', title: 'Ai Divine: The 1000 Year War', youtubeId: '9lQpOu5Rm1E', desc: 'Soulblade and Gaia\'s forces engage in a thousand-year multiversal conflict rendered in Ai Divine.', premiere: true },
  { id: 'metaburn-party', title: 'Metaburn 777: The Party at the End of Time', youtubeId: 'lcn9DCqwA5U', desc: 'The ultimate metaverse party — Metaburn 777 throws down at the edge of time and reality.', premiere: true },
  { id: 'ascension-city-future', title: 'Ascension City: The Future is Now', youtubeId: 'mJlxIIaEMps', desc: 'An anthem launching viewers into a multiversal dreamworld where ancient magic meets futuristic sound.' },
  { id: 'eshaton-rap-2025', title: 'The Eshaton Rap 2025', youtubeId: '14W5znwK4OU', desc: 'A sci-fi rap saga depicting a multiversal last stand between annihilation and infinity.' },
  { id: 'queen-of-the-infernals', title: 'Queen of the Infernals', youtubeId: 'xTmergUXPtc', desc: 'A seductress forged from smoke, bone, and screams emerges as a gothic horror anthem.' },
  { id: 'whispers-of-the-fae', title: 'Girls of the Multiverse: Whispers of the Fae', youtubeId: 'p9bNH9wDDrY', desc: 'The Fae Realms whisper as divine feminine chaos skips through an enchanted apocalypse.' },
  { id: 'infinite-horizons', title: 'Infinite Horizons feat. the Fly Girls', youtubeId: '6ZBV-xhfCkA', desc: 'An animated sonic voyage across space, soul, and sound for dreamers and starborn wanderers.' },
  { id: 'kumulipo', title: 'Kumulipo: The Age of Creation', youtubeId: 'AY7B9pXHShY', desc: 'A cosmic spectacle unveiling Hawaiian mythology through celestial visuals and mystical narrative.' },
  { id: 'merge-with-you', title: 'Merge With You', youtubeId: '1IqX2ZyU2jM', desc: 'A devotional love song depicting soul fusion across lifetimes through music, motion, and mystic fire.' },
  { id: 'galaxies-colliding', title: 'Galaxies Colliding', youtubeId: 'smUpSci0wmk', desc: 'Two mirrored worlds melt into one, swirling like liquid paint through transformation and distortion.' },
  { id: 'metaburn-horizon', title: 'Metaburn777: Chasing the Horizon', youtubeId: 'dGwX8Dfm7Qw', desc: 'A soul-scorching odyssey across galaxies where futurepunk druid witches dance in celestial ember-light.' },
  { id: 'singularity-part1', title: 'Singularity Part 1: Dawning of the Sixth Age', youtubeId: 'vpdODmduicM', desc: 'Explores the technological singularity hypothesis and superintelligence development implications.' },
  { id: 'cyber-geisha-ep3', title: 'Cyber Shamanic Ninja Geishas — Episode 3', youtubeId: 'e7QXdwy0n_Y', desc: 'Ancient arts meet futuristic fury as cyber shamanic geishas battle malevolent forces toward singularity.' },
  { id: 'whisker-wings', title: 'Adventures of Whisker Wings Dragon Cat Extraordinaire: In the Great Zoomie Caper', youtubeId: 'wn55IMZeT24', desc: 'Dragon kitten Whisker Wings embarks on the Great Zoomie Caper — a magical chase through enchanted realms.' },
  { id: 'pudgy-penguins', title: 'Pudgy Penguins', youtubeId: 'TdzqvQXM1ro', desc: 'A creative work featuring whimsical penguin characters in a magical world.' },
  { id: 'gypsey-feather', title: 'Gypsey Feather', youtubeId: 'UBDCrXvuVt0', desc: 'A sacred meditation exploring the spiritual essence of feather spirits.' },
  { id: 'metaburn-crystal', title: 'Metaburn the Crystal', youtubeId: 'm8_lXeufQzI', desc: 'Crystal energy, sacred geometry, and the Metaburn universe collide.' },
  { id: 'red-butterfly', title: 'The Red Butterfly', youtubeId: '5am7vTqwdbI', desc: 'A sensuous fashion film depicting imagery and aesthetics from an otherworldly realm.' },
  { id: 'azure-and-gold', title: 'Azure and Gold — AI Fashion Film', youtubeId: 'YEcf4iN8Ir4', desc: 'An AI-generated fashion film blending visual artistry with electronic music composition.' },
  { id: 'samurai-geishas', title: 'Samurai Geishas', youtubeId: 'OFXLC3wi6Ug', desc: 'A geisha warrior narrative enhanced through advanced animation and visual processing.' },
  { id: 'sunbathe', title: 'SunBathe', youtubeId: 'NhMjlZO_fdk', desc: 'An AI music video featuring tantra-inspired visual aesthetics and electronic music.' },
  { id: 'wheel-of-eternity', title: 'The Wheel of Eternity', youtubeId: 'qlYMAoUhnyQ', desc: 'A rough-cut epic fantasy story spanning generations inspired by classic mythological themes.' },
  { id: 'cyber-geisha-pt1', title: 'Cyber Shamanic Ninja Geishas — Part 1', youtubeId: 'YG9C7uuedec', desc: 'Cyber shamanic ninja geishas navigate digital realms blending ancient and algorithmic storytelling.' },
  { id: 'hare-david-starfire', title: 'Hare — Music by David Starfire', youtubeId: 'v4HHD14b93g', desc: 'Part of the Cyber Shamanic Ninja Geisha narrative set to David Starfire\'s composition.' },
  { id: 'cyber-geisha-ep1', title: 'CyberShamanic Ninja Geishas Episode 1 — Metaverse', youtubeId: 'bcxaF5umSPw', desc: 'Geishas battle evil forces while riding ascension waves toward the singularity.' },
  { id: 'singularity-ep1', title: 'Singularity Episode 1', youtubeId: '8ydaApH6_a4', desc: 'As civilization rides toward the singularity, the world transforms in unprecedented ways.' },
]

function FilmCard({ film, isActive, onSelect }: { film: Film; isActive: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div className="relative rounded-lg overflow-hidden"
        style={{
          aspectRatio: '16/9',
          border: `1px solid ${isActive ? GOLD : hovered ? GOLD + '80' : GOLD + '30'}`,
          boxShadow: isActive ? `0 0 20px ${GOLD}50, 0 0 50px ${GOLD}18` : hovered ? `0 0 12px ${GOLD}25` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}>
        <img src={thumb(film.youtubeId)} alt={film.title}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,4,12,0.88) 0%, transparent 60%)' }} />

        {isActive && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] tracking-widest uppercase"
            style={{ background: `${GOLD}30`, border: `1px solid ${GOLD}`, color: GOLD }}>
            Playing
          </div>
        )}
        {hovered && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD}80` }}>
              <span style={{ color: GOLD, fontSize: 14, marginLeft: 2 }}>▶</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-2">
          <p className="font-cinzel text-[9px] font-bold leading-tight"
            style={{ color: isActive ? GOLD : '#fff', textShadow: '0 1px 6px rgba(0,0,0,1)' }}>
            {film.title}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AiFilmsPage() {
  const [selected, setSelected] = useState<Film>(FILMS[0])

  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      <div className="max-w-7xl mx-auto px-2 pt-6 pb-16">

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest"
            style={{
              background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 18px ${GOLD}40)`,
            }}>
            AI Films
          </h1>
        </div>

        {/* Big player */}
        <div className="mb-5 px-2">
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
          <div className="flex items-start justify-between mt-3 px-1">
            <div>
              {selected.premiere && (
                <span className="inline-block text-[8px] tracking-[0.35em] uppercase font-medium px-2 py-0.5 rounded mb-1.5"
                  style={{ color: GOLD, background: `${GOLD}18`, border: `1px solid ${GOLD}50` }}>
                  ● Premiere
                </span>
              )}
              <h2 className="font-cinzel text-lg font-bold" style={{ color: '#f5ede0' }}>{selected.title}</h2>
              <p className="text-xs mt-0.5 max-w-2xl" style={{ color: 'rgba(255,255,255,0.82)' }}>{selected.desc}</p>
            </div>
          </div>
        </div>

        {/* Grid — Premieres then More Films */}
        {(() => {
          const premieres = FILMS.filter(f => f.premiere)
          const others = FILMS.filter(f => !f.premiere)
          const onSelect = (film: Film) => { setSelected(film); window.scrollTo({ top: 0, behavior: 'smooth' }) }
          const Divider = ({ label }: { label: string }) => (
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}40)` }} />
              <span className="text-[9px] tracking-[0.4em] uppercase font-medium" style={{ color: GOLD }}>{label}</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}40)` }} />
            </div>
          )
          return (
            <>
              <Divider label="Premieres" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 mb-6">
                {premieres.map((film, i) => (
                  <FilmCard key={film.id} film={film} isActive={selected.id === film.id} onSelect={() => onSelect(film)} />
                ))}
              </div>
              <Divider label="More Films" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                {others.map((film, i) => (
                  <FilmCard key={film.id} film={film} isActive={selected.id === film.id} onSelect={() => onSelect(film)} />
                ))}
              </div>
            </>
          )
        })()}

      </div>
    </div>
  )
}
