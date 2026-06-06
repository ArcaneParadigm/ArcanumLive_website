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
}

const FILMS: Film[] = [
  { id: 'infinite-recursion', title: 'Infinite Recursion', youtubeId: 'jNcOT5fKMQk', desc: 'Each layer of consciousness reflecting all others endlessly.' },
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
  { id: 'whisker-wings', title: 'Whisker Wings Episode 1', youtubeId: 'wn55IMZeT24', desc: 'Dragon kitten Whisker Wings journeys through a magical realm discovering dragonflies and mythical creatures.' },
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

const PREMIERE_FILMS: Film[] = [
  { id: 'premiere-1', title: 'Singularity 2026 Trailer', youtubeId: 'f08oGGZbyyc', desc: 'A mythic, glitchcore fever dream rendered with AI visuals, pushing into new dimensions of speed and surreal clarity.' },
  { id: 'premiere-2', title: 'Galactika', youtubeId: 'P0uVoINJNPc', desc: 'A journey through the cosmic architecture of galactic consciousness.' },
  { id: 'premiere-3', title: 'Sacred Transmissions', youtubeId: 'VwTlGogpQ04', desc: 'Divine frequencies encoded in light and sound.' },
  { id: 'premiere-4', title: 'Ascension Chamber', youtubeId: '4MRrrkrBn_c', desc: 'Entry gateway into the mystical chambers of consciousness.' },
  { id: 'premiere-5', title: 'The Descent', youtubeId: 'lcn9DCqwA5U', desc: 'A dive into the depths of the underworld\'s mysteries.' },
  { id: 'premiere-6', title: 'Ethereal Dance', youtubeId: '9lQpOu5Rm1E', desc: 'Movement through dimensions of pure energy and form.' },
  { id: 'premiere-7', title: 'The Convergence', youtubeId: 'ONLCEq7HXSA', desc: 'All timelines intersect at the eternal now.' },
  { id: 'premiere-8', title: 'Quantum Convergence', youtubeId: 'dmifMUZyEm4', desc: 'Where all possibilities collapse into singular moments of creation.' },
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
              <span style={{ color: GOLD, fontSize: 'clamp(10px, 2vw, 14px)', marginLeft: 2 }}>▶</span>
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
  const [selected, setSelected] = useState<Film>(PREMIERE_FILMS[0])

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

        {/* ═══ PREMIERE SECTION ═══ */}
        <div className="mb-10">
          <h2 className="font-cinzel text-lg tracking-widest mb-4 text-center" style={{ color: `${GOLD}cc` }}>PREMIERE</h2>

          {/* Premier player */}
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
            <div className="flex items-center justify-between mt-3 px-1">
              <div>
                <h3 className="font-cinzel text-lg font-bold" style={{ color: '#e8dcc8' }}>{selected.title}</h3>
                <p className="text-xs mt-0.5 max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>{selected.desc}</p>
              </div>
              <a href={`https://youtu.be/${selected.youtubeId}`} target="_blank" rel="noopener noreferrer"
                className="text-[10px] tracking-widest uppercase shrink-0 ml-4" style={{ color: `${GOLD}70` }}>
                Open on YouTube ↗
              </a>
            </div>
          </div>

          {/* Premier grid — 2 rows of 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 mb-8">
            {PREMIERE_FILMS.map((film, i) => (
              <FilmCard
                key={film.id}
                film={film}
                isActive={selected.id === film.id}
                onSelect={() => { setSelected(film); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}cc, transparent)` }} />
            <div className="text-center mt-4">
              <span className="font-cinzel text-sm tracking-widest" style={{ color: `${GOLD}cc` }}>AI FILMS</span>
            </div>
          </div>
        </div>

        {/* All Films Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {FILMS.map((film, i) => (
            <FilmCard
              key={film.id}
              film={film}
              isActive={selected.id === film.id}
              onSelect={() => { setSelected(film); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
