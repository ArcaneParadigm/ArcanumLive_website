'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ALBUMS } from '@/lib/data/albums'
import { useLandscapeMobile } from '@/lib/hooks/useLandscapeMobile'
import { featuredWorlds } from '@/lib/data/worlds'
import manifest from '@/lib/data/realms-manifest.json'

const AlbumPlayer = dynamic(() => import('@/components/music/AlbumPlayer'), { ssr: false })
const KenBurnsSlideshow = dynamic(() => import('@/components/screensaver/KenBurnsSlideshow'), { ssr: false })

// ─── Data ─────────────────────────────────────────────────────────────────────

const EMPTY_SLUGS = new Set(['metahub','jabberwocky','kitsune','mermaids','dominion','glyphs','nyx-arcana','temples'])
const CARD_REALMS = featuredWorlds.filter(w => w.slug && !EMPTY_SLUGS.has(w.slug))

// Which realm slug maps to which albumId (for auto-play on card click)
const REALM_TO_ALBUM: Record<string, string> = {
  'beyond-the-rim':  'songs-from-the-rim-1',
  'fae-forever':     'sidhe-fairy-songs-1',
  'ai-divine':       'songs-from-the-rim-ai-divine',
  'ascension':       'songs-from-the-rim-ascension-city',
  'galactica':       'movie-aether-into-the-multiverse',
}
// Reverse: albumId → realm slug
const ALBUM_TO_REALM: Record<string, string> = Object.fromEntries(
  Object.entries(REALM_TO_ALBUM).map(([r, a]) => [a, r])
)

type ManifestType = { realms: Record<string, { gallery: string[] }> }

// ─── Lyrics overlay ───────────────────────────────────────────────────────────

interface LyricsOverlayProps {
  lyricsUrl: string | null
  duration: number
  currentTime: number
  offset?: number
  className?: string
}

function LyricsOverlay({ lyricsUrl, duration, currentTime, offset = 0, className = '' }: LyricsOverlayProps) {
  const [lines, setLines] = useState<string[]>([])
  const innerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lyricsUrl) { setLines([]); return }
    fetch(lyricsUrl)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const promptIdx = text.indexOf('--- Prompt ---')
        const raw = promptIdx >= 0 ? text.slice(promptIdx + 14) : text
        const cleaned = raw
          .replace(/^Title:.*$/gim, '')
          .replace(/^ID:.*$/gim, '')
          .replace(/^Tags:.*$/gim, '')
          .replace(/^---.*$/gm, '')
          .replace(/^\[.*?\]$/gm, '')
          .trim()
        setLines(cleaned.split('\n').map(l => l.trim()).filter(Boolean))
      })
      .catch(() => setLines([]))
  }, [lyricsUrl])

  useEffect(() => {
    const inner = innerRef.current
    const outer = outerRef.current
    if (!inner || !outer || !duration || lines.length === 0) return
    const overflow = inner.scrollHeight - outer.clientHeight
    if (overflow <= 0) return
    const adj = Math.max(0, currentTime - offset)
    const effective = Math.max(1, duration - offset)
    inner.style.transform = `translateY(-${Math.min(adj / effective, 1) * overflow}px)`
  }, [currentTime, duration, lines, offset])

  if (!lyricsUrl || lines.length === 0) return null

  return (
    <div ref={outerRef} className={`overflow-hidden pointer-events-none ${className}`}>
      <div ref={innerRef} className="px-5 py-6 space-y-2"
        style={{ transition: 'transform 0.6s linear', willChange: 'transform' }}>
        {lines.map((line, i) => {
          const isNote = /^\(\*.*\*\)$/.test(line.trim())
          return isNote ? (
            <p key={i} className="text-amber-400/60 text-xs leading-snug text-right italic font-light drop-shadow-[0_1px_6px_rgba(0,0,0,1)] ml-auto" style={{ maxWidth: '50%' }}>
              {line}
            </p>
          ) : (
            <p key={i} className="text-white text-sm leading-relaxed text-right drop-shadow-[0_1px_6px_rgba(0,0,0,1)]">
              {line}
            </p>
          )
        })}
        <div className="h-16" />
      </div>
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function mkId() { return Math.random().toString(36).slice(2, 9) }

export default function MusicPageClient() {
  const landscapeMobile = useLandscapeMobile()

  // ── Realm sequence (draggable ordered list of slugs) ──
  const [sequence, setSequence] = useState(() => CARD_REALMS.map(w => ({ id: mkId(), slug: w.slug! })))
  const [seqIdx, setSeqIdx] = useState(() => {
    const slug = ALBUM_TO_REALM[ALBUMS[0].id] ?? CARD_REALMS[0]?.slug
    const idx = CARD_REALMS.findIndex(w => w.slug === slug)
    return idx >= 0 ? idx : 0
  })
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  // ── Screensaver + playback command ──
  // Start with album 1 → its matching realm for screensaver (fall back to first card)
  const firstAlbum = ALBUMS[0]
  const firstSlug = ALBUM_TO_REALM[firstAlbum.id] ?? CARD_REALMS[0]?.slug ?? null
  const [activeSlug, setActiveSlug] = useState<string | null>(firstSlug)
  const [lyricsOpen, setLyricsOpen] = useState(true)
  const [lyricsUrl, setLyricsUrl] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [lyricsOffset, setLyricsOffset] = useState(0)
  const [playCommand, setPlayCommand] = useState<{ albumId: string; trackIdx: number; token: number }>(
    { albumId: firstAlbum.id, trackIdx: 0, token: Date.now() }
  )

  const screensaverImages: string[] = activeSlug
    ? ((manifest as ManifestType).realms[activeSlug]?.gallery ?? [])
    : []

  const activeRealmData = activeSlug ? CARD_REALMS.find(w => w.slug === activeSlug) : null

  // ── Activate a realm by sequence index ──
  const activateSeq = useCallback((idx: number) => {
    const entry = sequence[idx]
    if (!entry) return
    setSeqIdx(idx)
    setActiveSlug(entry.slug)
    // visuals only — do NOT interrupt music
  }, [sequence])

  // ── When album ends, advance to next album (loops forever) ──
  const handleAlbumEnd = useCallback((albumId: string) => {
    const idx = ALBUMS.findIndex(a => a.id === albumId)
    const nextAlbum = ALBUMS[(idx + 1) % ALBUMS.length]
    setPlayCommand({ albumId: nextAlbum.id, trackIdx: 0, token: Date.now() })
    // Also switch screensaver to the matching realm if one exists
    const nextSlug = ALBUM_TO_REALM[nextAlbum.id]
    if (nextSlug) {
      setActiveSlug(nextSlug)
      const nextSeqIdx = sequence.findIndex(e => e.slug === nextSlug)
      if (nextSeqIdx >= 0) setSeqIdx(nextSeqIdx)
    }
  }, [sequence])

  // ── Drag handlers ──
  const handleDragStart = (i: number) => (e: React.DragEvent) => {
    setDragFrom(i); e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    if (dragOver !== i) setDragOver(i)
  }
  const handleDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (dragFrom === null || dragFrom === i) { setDragFrom(null); setDragOver(null); return }
    const newSeq = [...sequence]
    const [moved] = newSeq.splice(dragFrom, 1)
    newSeq.splice(i, 0, moved)
    let newIdx = seqIdx
    if (seqIdx === dragFrom) newIdx = i
    else if (dragFrom < seqIdx && i >= seqIdx) newIdx = seqIdx - 1
    else if (dragFrom > seqIdx && i <= seqIdx) newIdx = seqIdx + 1
    setSequence(newSeq)
    setSeqIdx(newIdx)
    setDragFrom(null); setDragOver(null)
  }
  const handleDragEnd = () => { setDragFrom(null); setDragOver(null) }

  return (
    <div className="pb-8 min-h-screen" style={{ paddingTop: 6 }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <p className="text-gold/50 text-[10px] tracking-[0.4em] uppercase">Sonic Realms</p>
          <span className="text-white/20 text-xs">·</span>
          <h1 className="text-lg font-bold text-white">Enter the <span className="text-gold-gradient">Music</span></h1>
          <button
            onClick={() => setLyricsOpen(v => !v)}
            className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] tracking-widest uppercase transition-opacity"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              opacity: lyricsUrl ? 1 : 0.3,
            }}
          >
            <span>{lyricsOpen ? '▲' : '▼'}</span>
            <span>Lyrics</span>
          </button>
        </div>

        {/* ── Screensaver panel ── */}
        <div className="px-1 py-1 mb-3">
        <div className="rounded-2xl overflow-hidden border border-white/10 relative mx-auto"
          style={landscapeMobile
            ? { height: 'calc(100vh - 72px)', width: '100%' }
            : { aspectRatio: '16/9', width: 'min(100%, calc((100vh - 165px) * 16 / 9))', minHeight: 200 }
          }>

          {activeSlug && screensaverImages.length > 0 ? (
            <>
              <KenBurnsSlideshow images={screensaverImages} secPerImage={12} className="w-full h-full" />
              <div className="absolute bottom-4 left-5 text-white/50 text-xs tracking-widest uppercase pointer-events-none">
                {activeRealmData?.title}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full border border-gold/20 animate-glow-pulse flex items-center justify-center text-gold/30 text-3xl">◈</div>
              <p className="text-white/25 text-xs tracking-widest uppercase">Select a realm to launch visuals</p>
            </div>
          )}

          {/* Lyrics overlay — right 1/3 desktop, 40% landscape mobile, hidden portrait mobile */}
          {lyricsUrl && lyricsOpen && (
            <div
              className={`absolute inset-y-0 right-0 z-10 pointer-events-none ${landscapeMobile ? 'block' : 'hidden sm:block'}`}
              style={{ width: landscapeMobile ? '40%' : '33.333%' }}>
              <LyricsOverlay lyricsUrl={lyricsUrl} duration={duration} currentTime={currentTime} offset={lyricsOffset} className="absolute inset-0" />
            </div>
          )}
        </div>
        </div>

        {/* ── Lyrics sync controls — desktop only, right of screensaver ── */}
        {lyricsUrl && lyricsOpen && (
          <div className="hidden sm:flex items-center justify-end gap-1 mb-1 px-1">
            <span className="text-white/30 text-[10px] mr-1">sync</span>
            <button onClick={() => setLyricsOffset(o => Math.max(0, o - 15))} className="text-white/40 hover:text-white/80 text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors">-15s</button>
            <button onClick={() => setLyricsOffset(o => Math.max(0, o - 5))}  className="text-white/40 hover:text-white/80 text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors">-5s</button>
            {lyricsOffset !== 0 && <span className="text-white/30 text-[10px] w-7 text-center">+{lyricsOffset}s</span>}
            <button onClick={() => setLyricsOffset(o => o + 5)}  className="text-white/40 hover:text-white/80 text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors">+5s</button>
            <button onClick={() => setLyricsOffset(o => o + 15)} className="text-white/40 hover:text-white/80 text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors">+15s</button>
          </div>
        )}

        {/* ── Mobile lyrics panel (below screensaver, sm and under) ── */}
        {lyricsUrl && lyricsOpen && (
          <div className="sm:hidden rounded-xl border border-white/10 mb-2 overflow-hidden relative"
            style={{ maxHeight: 160, background: 'rgba(0,0,0,0.6)' }}>
            <LyricsOverlay lyricsUrl={lyricsUrl} duration={duration} currentTime={currentTime} className="absolute inset-0" />
          </div>
        )}

        {/* ── Card hint ── */}
        <div className="mb-1 px-0.5">
          <span className="hidden sm:inline text-white/80 text-[9px] tracking-widest uppercase">drag cards to reorder</span>
          <span className="sm:hidden text-white/80 text-[9px] tracking-widest uppercase">tap card · launch visuals</span>
        </div>

        {/* ── Realm card sequence — draggable ── */}
        <div className="flex flex-wrap gap-1 mb-3">
          {sequence.map((entry, i) => {
            const world = CARD_REALMS.find(w => w.slug === entry.slug)
            if (!world) return null
            const isActive = seqIdx === i && activeSlug === entry.slug
            const isDragging = dragFrom === i
            const isDragTarget = dragOver === i && dragFrom !== null && dragFrom !== i
            const accent = world.color_primary ?? '#c9973a'
            const hasAlbum = !!REALM_TO_ALBUM[entry.slug]

            return (
              <div
                key={entry.id}
                draggable
                onDragStart={handleDragStart(i)}
                onDragOver={handleDragOver(i)}
                onDrop={handleDrop(i)}
                onDragEnd={handleDragEnd}
                onClick={() => activateSeq(i)}
                className="relative rounded-lg overflow-hidden cursor-pointer group select-none transition-all duration-150
                  w-[calc(100%/8-4px)] sm:w-[calc(100%/12-4px)] md:w-[calc(100%/16-4px)] lg:w-[calc(100%/21-4px)]"
                style={{
                  aspectRatio: '3/4',
                  border: `1px solid ${isActive ? accent + '80' : isDragTarget ? accent + '40' : 'rgba(255,255,255,0.1)'}`,
                  opacity: isDragging ? 0.4 : 1,
                  transform: isDragTarget ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 12px ${accent}30` : 'none',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/realms/${entry.slug}/card.jpg`}
                  alt={world.title ?? ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Sequence number */}
                <div className="absolute top-1 left-1 text-[7px] font-bold tabular-nums"
                  style={{ color: isActive ? accent : 'rgba(255,255,255,0.3)' }}>
                  {i + 1}
                </div>

                {/* Music note if has album */}
                {hasAlbum && (
                  <div className="absolute top-1 right-1 text-[8px]" style={{ color: accent + 'cc' }}>♪</div>
                )}

                {/* Title */}
                <div className="absolute bottom-0 inset-x-0 px-1 pb-1">
                  <p className={`text-[7px] font-medium truncate leading-tight transition-colors
                    ${isActive ? 'text-gold' : 'text-white/60 group-hover:text-white'}`}>
                    {world.title}
                  </p>
                </div>

                {/* Active glow border */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px ${accent}80` }} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Music player ── */}
        <div className="max-w-3xl mx-auto">
          <AlbumPlayer
            albums={ALBUMS}
            command={playCommand}
            onAlbumEnd={handleAlbumEnd}
            onProgress={({ lyricsUrl: url, currentTime: t, duration: d }) => {
              if (url !== lyricsUrl) setLyricsOffset(0)
              setLyricsUrl(url)
              setCurrentTime(t)
              setDuration(d)
            }}
          />
        </div>

      </div>
    </div>
  )
}
