'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { VideoItem, VideoType } from '@/lib/data/videos'

interface WatchHubProps {
  videos: VideoItem[]
  featuredVideo: VideoItem
}

const TAB_LABELS: { key: VideoType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'premiere', label: 'Premieres' },
  { key: 'film', label: 'Films' },
  { key: 'music-video', label: 'Music Videos' },
  { key: 'trailer', label: 'Trailers' },
]

const typeAccent: Record<string, string> = {
  film: '#c9973a',
  trailer: '#8a9aaa',
  'music-video': '#f5d06e',
  premiere: '#e8edf2',
  'dome-trailer': '#c9973a',
}

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

  const filtered = activeTab === 'all' ? videos : videos.filter((v) => v.type === activeTab)

  return (
    <div className="pt-16 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        {/* Page label */}
        <div className="text-center mb-5">
          <span className="inline-block text-[8px] font-medium tracking-[0.35em] uppercase px-2 py-0.5 rounded mb-2" style={{ background: '#000', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.28)' }}>The Arcanum</span>
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest mb-1.5 block" style={{ background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Watch</h1>
          <p className="text-silver-mid/50 text-xs">Films · Music Videos · Trailers · Premieres</p>
        </div>

        {/* ── Main player ── */}
        <div className="mb-10">
          <div
            className="relative overflow-hidden rounded-2xl mb-5"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.15), 0 16px 64px rgba(0,0,0,0.8)' }}
          >
            {/* Vimeo embed */}
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

            {/* Inner rim */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.12)' }}
            />
          </div>

          {/* Player info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border"
                  style={{
                    color: typeAccent[selected.type] ?? '#c9973a',
                    borderColor: `${typeAccent[selected.type] ?? '#c9973a'}40`,
                    background: `${typeAccent[selected.type] ?? '#c9973a'}0f`,
                  }}
                >
                  {selected.type.replace('-', ' ')}
                </span>
                {selected.duration && (
                  <span className="text-silver-mid/40 text-xs">{selected.duration}</span>
                )}
                {selected.isPremiere && (
                  <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase rounded border border-silver/20 text-silver/60">
                    Premiere
                  </span>
                )}
              </div>
              <h2 className="font-cinzel text-white text-xl md:text-2xl tracking-wide mb-1">{selected.title}</h2>
              {selected.description && (
                <p className="text-silver-mid/55 text-sm leading-relaxed">{selected.description}</p>
              )}
            </div>

            {/* Rent button if available */}
            {selected.rentUrl && (
              <a
                href={selected.rentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 arcanum-btn-primary text-xs whitespace-nowrap"
              >
                Rent Full Film →
              </a>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 mb-6 border-b border-gold/10 pb-0">
          {TAB_LABELS.map((tab) => {
            const count = tab.key === 'all' ? videos.length : videos.filter((v) => v.type === tab.key).length
            if (count === 0 && tab.key !== 'all') return null
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'text-gold border-gold/60'
                    : 'text-silver-mid/40 border-transparent hover:text-silver-mid/70'
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-[9px] opacity-50">({count})</span>
              </button>
            )
          })}
        </div>

        {/* ── Video grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((video) => {
            const isActive = selected.id === video.id
            const accent = typeAccent[video.type] ?? '#c9973a'
            return (
              <button
                key={video.id}
                onClick={() => {
                  setSelected(video)
                  window.scrollTo({ top: 80, behavior: 'smooth' })
                }}
                className="group text-left"
              >
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden rounded-xl mb-2.5 border transition-all duration-300"
                  style={{
                    aspectRatio: '16/9',
                    borderColor: isActive ? `${accent}55` : 'rgba(201,151,58,0.1)',
                    background: `linear-gradient(160deg, ${accent}12 0%, #08060e 100%)`,
                    boxShadow: isActive ? `0 0 20px ${accent}22` : 'none',
                  }}
                >
                  {/* Corner marks */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold/20" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold/20" />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                      style={{
                        background: 'rgba(8,6,14,0.75)',
                        backdropFilter: 'blur(6px)',
                        border: `1px solid ${accent}50`,
                      }}
                    >
                      <span className="text-gold/70 text-xs" style={{ marginLeft: 1 }}>
                        {isActive ? '▶' : '▶'}
                      </span>
                    </div>
                  </div>

                  {/* Now playing badge */}
                  {isActive && (
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] tracking-widest uppercase"
                      style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
                    >
                      Playing
                    </div>
                  )}

                  {/* Duration */}
                  {video.duration && (
                    <div
                      className="absolute bottom-1.5 left-2 text-[9px] text-gold/40 tracking-wide"
                      style={{ background: 'transparent' }}
                    >
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4
                  className={`font-cinzel text-xs tracking-wide leading-tight mb-0.5 transition-colors ${
                    isActive ? 'text-gold' : 'text-white/70 group-hover:text-white'
                  }`}
                >
                  {video.title}
                </h4>
                <p
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: `${accent}70` }}
                >
                  {video.type.replace('-', ' ')}
                  {video.rentUrl && ' · Rentable'}
                </p>
              </button>
            )
          })}
        </div>

        {/* Music video note */}
        <div className="mt-8 text-center">
          <p className="text-silver-mid/30 text-xs tracking-widest">
            All content streams via Vimeo ·{' '}
            <Link href="/dome-shows" className="text-gold/40 hover:text-gold/70 transition-colors">
              Dome Shows & 360° Films
            </Link>
            {' · '}
            <Link href="/music" className="text-gold/40 hover:text-gold/70 transition-colors">
              Music
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
