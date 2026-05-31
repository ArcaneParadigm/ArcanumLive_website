'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { playCrystalBowl } from '@/lib/utils/crystalSound'
import YouTubePlayer from '@/components/ui/YouTubePlayer'
import type { VideoItem, VideoType } from '@/lib/data/videos'

interface WatchHubProps {
  videos: VideoItem[]
  featuredVideo: VideoItem
}

const GOLD = '#c9973a'

const TAB_LABELS: { key: VideoType | 'all'; label: string }[] = [
  { key: 'all',         label: 'All'          },
  { key: '360-film',    label: '360 Films'    },
  { key: 'film',        label: 'Films'        },
  { key: 'music-video', label: 'Music Videos' },
  { key: 'trailer',     label: 'Trailers'     },
]

const typeAccent: Record<string, string> = {
  '360-film':    '#c9973a',
  film:          '#c9973a',
  trailer:       '#8a9aaa',
  'music-video': '#f5d06e',
  premiere:      '#e8edf2',
  'dome-trailer':'#c9973a',
}

// ── Ornate gold divider (reused from portal aesthetic) ────────────────────────
function OrnateRule() {
  return (
    <div className="relative flex items-center justify-center py-1 mb-0">
      <div className="absolute inset-x-0 h-px" style={{ top: '44%', background: `linear-gradient(to right, transparent 0%, ${GOLD}50 15%, ${GOLD}50 85%, transparent 100%)` }} />
      <div className="absolute inset-x-0 h-px" style={{ top: '58%', background: `linear-gradient(to right, transparent 0%, ${GOLD}22 20%, ${GOLD}22 80%, transparent 100%)` }} />
      <svg width="260" height="28" viewBox="0 0 260 28" fill="none" className="relative z-10">
        <rect x="123" y="7" width="14" height="14" transform="rotate(45 130 14)" fill="#08060e" stroke={`${GOLD}80`} strokeWidth="1"/>
        <rect x="126" y="10" width="8" height="8" transform="rotate(45 130 14)" fill={`${GOLD}25`} stroke={`${GOLD}50`} strokeWidth="0.5"/>
        <path d="M118 14 Q108 7, 98 14 Q88 21, 78 14 Q68 7, 58 14" stroke={`${GOLD}55`} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <circle cx="56" cy="14" r="2.2" fill="none" stroke={`${GOLD}60`} strokeWidth="0.9"/>
        <circle cx="42" cy="14" r="1.2" fill={`${GOLD}50`}/>
        <path d="M39 14 L20 14" stroke={`${GOLD}30`} strokeWidth="0.7" strokeLinecap="round"/>
        <circle cx="17" cy="14" r="1.5" fill="none" stroke={`${GOLD}35`} strokeWidth="0.7"/>
        <path d="M142 14 Q152 7, 162 14 Q172 21, 182 14 Q192 7, 202 14" stroke={`${GOLD}55`} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <circle cx="204" cy="14" r="2.2" fill="none" stroke={`${GOLD}60`} strokeWidth="0.9"/>
        <circle cx="218" cy="14" r="1.2" fill={`${GOLD}50`}/>
        <path d="M221 14 L240 14" stroke={`${GOLD}30`} strokeWidth="0.7" strokeLinecap="round"/>
        <circle cx="243" cy="14" r="1.5" fill="none" stroke={`${GOLD}35`} strokeWidth="0.7"/>
        <rect x="74" y="11" width="6" height="6" transform="rotate(45 77 14)" fill="#08060e" stroke={`${GOLD}40`} strokeWidth="0.6"/>
        <rect x="177" y="11" width="6" height="6" transform="rotate(45 180 14)" fill="#08060e" stroke={`${GOLD}40`} strokeWidth="0.6"/>
      </svg>
    </div>
  )
}

// Fill order: visual positions [0,1,2,3,4] map to premiere array indices [3,1,0,2,4]
// meaning slot 3 fills first, then 2, then 4, then 1, then 5
const VISUAL_TO_IDX = [3, 1, 0, 2, 4]
const PREMIERE_SLOTS = 5

// ── Premiere card in the top band ─────────────────────────────────────────────
function PremiereCard({ video, isSelected, onClick }: { video: VideoItem; isSelected: boolean; onClick: () => void }) {
  return (
    <motion.button
      className="shrink-0 text-left rounded-xl overflow-hidden relative"
      style={{
        width: 220,
        background: isSelected
          ? `linear-gradient(135deg, ${GOLD}20, rgba(8,6,14,0.95))`
          : 'linear-gradient(135deg, rgba(20,14,32,0.95), rgba(8,6,14,0.98))',
        border: `1px solid ${isSelected ? GOLD + '70' : GOLD + '25'}`,
        boxShadow: isSelected ? `0 0 22px ${GOLD}30, 0 6px 24px rgba(0,0,0,0.7)` : '0 4px 14px rgba(0,0,0,0.5)',
      }}
      onClick={() => { onClick(); playCrystalBowl(GOLD, 0.025) }}
      whileHover={{ scale: 1.02, borderColor: `${GOLD}60` }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => playCrystalBowl(GOLD, 0.018)}
    >
      {/* Thumbnail area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div style={{ background: `radial-gradient(ellipse at 40% 40%, ${GOLD}18, #08060e 70%)`, position: 'absolute', inset: 0 }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(8,6,14,0.7)', border: `1px solid ${GOLD}50`, backdropFilter: 'blur(4px)' }}>
            <span className="text-gold/80 text-sm" style={{ marginLeft: 2 }}>▶</span>
          </div>
        </div>
        <div className="absolute top-2 left-2 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid ${GOLD}50`, borderLeft: `1px solid ${GOLD}50` }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 pointer-events-none" style={{ borderBottom: `1px solid ${GOLD}30`, borderRight: `1px solid ${GOLD}30` }} />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] tracking-widest uppercase"
          style={{ background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}50` }}>
          Premiere
        </div>
      </div>
      <div className="p-3">
        <p className="font-cinzel text-[11px] font-bold tracking-wide leading-snug mb-0.5"
          style={{ color: isSelected ? GOLD : 'rgba(255,255,255,0.88)', textShadow: isSelected ? `0 0 12px ${GOLD}40` : 'none' }}>
          {video.title}
        </p>
        {video.description && (
          <p className="text-[9px] leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {video.description}
          </p>
        )}
      </div>
    </motion.button>
  )
}

// ── Empty premiere placeholder slot ──────────────────────────────────────────
function PremiereSlotEmpty({ slotNum }: { slotNum: number }) {
  return (
    <div
      className="shrink-0 rounded-xl overflow-hidden relative"
      style={{
        width: 220,
        background: 'linear-gradient(135deg, rgba(12,9,20,0.9), rgba(8,6,14,0.95))',
        border: `1px solid ${GOLD}12`,
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div style={{ background: `radial-gradient(ellipse at 50% 50%, ${GOLD}06, transparent 70%)`, position: 'absolute', inset: 0 }} />
        {/* Slot number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="font-cinzel text-2xl font-bold" style={{ color: `${GOLD}15` }}>{slotNum}</span>
          <div className="w-8 h-px" style={{ background: `${GOLD}15` }} />
        </div>
        <div className="absolute top-2 left-2 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid ${GOLD}20`, borderLeft: `1px solid ${GOLD}20` }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 pointer-events-none" style={{ borderBottom: `1px solid ${GOLD}12`, borderRight: `1px solid ${GOLD}12` }} />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] tracking-widest uppercase"
          style={{ background: `${GOLD}08`, color: `${GOLD}35`, border: `1px solid ${GOLD}15` }}>
          Coming Soon
        </div>
      </div>
      <div className="p-3">
        <div className="h-2.5 rounded-sm mb-2" style={{ background: `${GOLD}10`, width: '70%' }} />
        <div className="h-2 rounded-sm" style={{ background: `${GOLD}07`, width: '45%' }} />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WatchHub({ videos, featuredVideo }: WatchHubProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<VideoType | 'all'>('all')
  const [selected, setSelected] = useState<VideoItem>(featuredVideo)

  // Support ?v=id deep link
  useEffect(() => {
    const id = searchParams.get('v')
    if (id) {
      const found = videos.find((v) => v.id === id)
      if (found) setSelected(found)
    }
  }, [searchParams, videos])

  const premieres = videos.filter(v => v.type === 'premiere' || v.isPremiere)
  const nonPremieres = videos.filter(v => v.type !== 'premiere' && !v.isPremiere)
  const filtered = activeTab === 'all'
    ? nonPremieres
    : nonPremieres.filter((v) => v.type === activeTab)

  return (
    <div className="pb-12 min-h-screen" style={{ background: '#08060e' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Page title ── */}
        <div className="text-center pt-8 pb-4">
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 18px ${GOLD}40)`,
            }}>
            Watch
          </h1>
        </div>

        {/* ── Main player ── */}
        <div className="mt-5 mb-6">
          <div
            className="relative overflow-hidden rounded-2xl mb-5"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.15), 0 16px 64px rgba(0,0,0,0.8)' }}
          >
            {selected.youtubeId ? (
              <YouTubePlayer
                key={selected.youtubeId}
                videoId={selected.youtubeId}
                title={selected.title}
                className="rounded-2xl"
              />
            ) : (
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  key={selected.vimeoId}
                  src={`https://player.vimeo.com/video/${selected.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{ border: 0 }}
                  title={selected.title}
                />
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.12)' }} />
          </div>

          {/* Player info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border"
                  style={{
                    color: typeAccent[selected.type] ?? GOLD,
                    borderColor: `${typeAccent[selected.type] ?? GOLD}40`,
                    background: `${typeAccent[selected.type] ?? GOLD}0f`,
                  }}
                >
                  {selected.type.replace('-', ' ')}
                </span>
                {selected.duration && (
                  <span className="text-silver-mid/55 text-xs">{selected.duration}</span>
                )}
                {selected.isPremiere && (
                  <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border border-silver/20 text-silver/70">
                    Premiere
                  </span>
                )}
              </div>
              <h2 className="font-cinzel text-white text-xl md:text-2xl tracking-wide mb-1">{selected.title}</h2>
              {selected.description && (
                <p className="text-silver-mid/70 text-sm leading-relaxed">{selected.description}</p>
              )}
            </div>
            {selected.rentUrl && (
              <a href={selected.rentUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 arcanum-btn-primary text-xs whitespace-nowrap">
                Rent Full Film →
              </a>
            )}
          </div>
        </div>

        {/* ── Premieres band — always 5 slots, fills center-out (3→2→4→1→5) ── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}30)` }} />
            <span className="text-[9px] tracking-[0.4em] uppercase font-medium" style={{ color: `${GOLD}90` }}>◆ Premieres ◆</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}30)` }} />
          </div>
          <div className="flex gap-4 pb-2">
            {Array.from({ length: PREMIERE_SLOTS }, (_, visualPos) => {
              const video = premieres[VISUAL_TO_IDX[visualPos]]
              return video ? (
                <PremiereCard
                  key={video.id}
                  video={video}
                  isSelected={selected.id === video.id}
                  onClick={() => { setSelected(video); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                />
              ) : (
                <PremiereSlotEmpty key={`empty-${visualPos}`} slotNum={visualPos + 1} />
              )
            })}
          </div>
          <OrnateRule />
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-0.5 mb-6 border-b pb-0" style={{ borderColor: `${GOLD}18` }}>
          {TAB_LABELS.map((tab) => {
            const count = tab.key === 'all'
              ? nonPremieres.length
              : nonPremieres.filter((v) => v.type === tab.key).length
            if (count === 0 && tab.key !== 'all') return null
            const isActive = activeTab === tab.key
            return (
              <motion.button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); playCrystalBowl(GOLD, 0.02) }}
                className="relative px-4 py-2.5 text-xs tracking-widest uppercase -mb-px transition-colors duration-200"
                style={{
                  color: isActive ? GOLD : 'rgba(255,255,255,0.65)',
                  borderBottom: isActive ? `2px solid ${GOLD}80` : '2px solid transparent',
                }}
                whileHover={{
                  color: isActive ? GOLD : '#e8dcc8',
                  filter: isActive ? undefined : 'drop-shadow(0 0 6px rgba(201,151,58,0.3))',
                }}
                transition={{ duration: 0.12 }}
                onMouseEnter={() => !isActive && playCrystalBowl(GOLD, 0.012)}
              >
                {tab.label}
                <span className="ml-1.5 text-[9px] opacity-45">({count})</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-glow"
                    className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(to right, transparent, ${GOLD}70 30%, ${GOLD}70 70%, transparent)` }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* ── Video grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((video) => {
            const isActive = selected.id === video.id
            const accent = typeAccent[video.type] ?? GOLD
            return (
              <motion.button
                key={video.id}
                onClick={() => { setSelected(video); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="group text-left"
                onMouseEnter={() => playCrystalBowl(accent, 0.012)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden rounded-xl mb-2.5 border transition-all duration-300"
                  style={{
                    aspectRatio: '16/9',
                    borderColor: isActive ? `${accent}55` : `${GOLD}14`,
                    background: `linear-gradient(160deg, ${accent}12 0%, #08060e 100%)`,
                    boxShadow: isActive ? `0 0 20px ${accent}22` : 'none',
                  }}
                >
                  <div className="absolute top-2 left-2 w-3 h-3" style={{ borderTop: `1px solid ${GOLD}20`, borderLeft: `1px solid ${GOLD}20` }} />
                  <div className="absolute bottom-2 right-2 w-3 h-3" style={{ borderBottom: `1px solid ${GOLD}20`, borderRight: `1px solid ${GOLD}20` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100 group-hover:scale-105'
                    }`} style={{ background: 'rgba(8,6,14,0.75)', backdropFilter: 'blur(6px)', border: `1px solid ${accent}50` }}>
                      <span className="text-gold/80 text-xs" style={{ marginLeft: 1 }}>▶</span>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] tracking-widest uppercase"
                      style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
                      Playing
                    </div>
                  )}
                  {video.duration && (
                    <div className="absolute bottom-1.5 left-2 text-[9px] tracking-wide" style={{ color: `${GOLD}55` }}>
                      {video.duration}
                    </div>
                  )}
                </div>
                <h4 className={`font-cinzel text-xs tracking-wide leading-tight mb-0.5 transition-colors ${
                  isActive ? 'text-gold' : 'text-white/75 group-hover:text-white/95'
                }`}>
                  {video.title}
                </h4>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: `${accent}75` }}>
                  {video.type.replace('-', ' ')}
                  {video.rentUrl && ' · Rentable'}
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-silver-mid/35 text-xs tracking-widest">
            All content streams via Vimeo ·{' '}
            <Link href="/dome-shows" className="hover:text-gold/70 transition-colors" style={{ color: `${GOLD}45` }}>
              Dome Shows &amp; 360° Films
            </Link>
            {' · '}
            <Link href="/music" className="hover:text-gold/70 transition-colors" style={{ color: `${GOLD}45` }}>
              Music
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
