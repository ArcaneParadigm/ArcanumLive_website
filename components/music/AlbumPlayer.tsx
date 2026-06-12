'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Album, AlbumTrack } from '@/lib/data/albums'
import { AUDIO_CDN } from '@/lib/data/audioCdnUrls'

interface NowPlaying {
  albumId: string
  trackIdx: number
}

interface AlbumPlayerProps {
  albums: Album[]
  /** Called whenever lyricsUrl, currentTime, or duration changes — for external overlays */
  onProgress?: (info: { lyricsUrl: string | null; currentTime: number; duration: number }) => void
  /** External play command — change token to force re-trigger even for same albumId/trackIdx */
  command?: { albumId: string; trackIdx: number; token: number }
  /** Fires when the last track of an album ends naturally */
  onAlbumEnd?: (albumId: string) => void
  /** Called when album audio starts playing — lets parent stop other audio sources */
  onPlay?: () => void
  /** Increment to pause album playback from outside */
  stopToken?: number
}

// ─── Spectrum colors ─────────────────────────────────────────────────────────
// Magenta → violet → blue → cyan → green (5 album anchors, cycles)
const SPECTRUM: [number, number, number][] = [
  [217,  70, 239], // magenta   #d946ef
  [139,  92, 246], // violet    #8b5cf6
  [ 59, 130, 246], // blue      #3b82f6
  [  6, 182, 212], // cyan      #06b6d4
  [ 34, 197,  94], // green     #22c55e
]

function spectrumColor(slotIdx: number): [number,number,number] {
  return SPECTRUM[((slotIdx % SPECTRUM.length) + SPECTRUM.length) % SPECTRUM.length] ?? SPECTRUM[0]
}

/** Returns a 6-digit hex string so ${color}AA alpha-suffix works in CSS */
function lerpRgb(
  a: [number,number,number] | undefined,
  b: [number,number,number] | undefined,
  t: number
): string {
  if (!a || !b) return '#d946ef'
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`
}

function formatTime(s: number) {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// ─── Lyrics Panel ────────────────────────────────────────────────────────────

interface LyricsPanelProps {
  lyricsUrl: string | null
  duration: number
  currentTime: number
}

function LyricsPanel({ lyricsUrl, duration, currentTime }: LyricsPanelProps) {
  const [lines, setLines] = useState<string[]>([])
  const innerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lyricsUrl) { setLines([]); return }
    fetch(lyricsUrl)
      .then(r => r.text())
      .then(text => {
        // Strip everything up to and including the "--- Prompt ---" divider
        const promptIdx = text.indexOf('--- Prompt ---')
        const raw = promptIdx >= 0 ? text.slice(promptIdx + 14) : text
        const cleaned = raw
          .replace(/^Title:.*$/gim, '')
          .replace(/^ID:.*$/gim, '')
          .replace(/^Tags:.*$/gim, '')
          .replace(/^---.*$/gm, '')
          .replace(/^\[.*?\]$/gm, '')   // strip [Verse], [Chorus], [Bridge] etc
          .trim()
        const parsed = cleaned.split('\n').map(l => l.trim()).filter(Boolean)
        setLines(parsed)
      })
      .catch(() => setLines([]))
  }, [lyricsUrl])

  // Smooth scroll: set translateY once per timeupdate (~4×/sec)
  // Transition slightly longer than tick interval so it glides without lag
  useEffect(() => {
    const inner = innerRef.current
    const outer = outerRef.current
    if (!inner || !outer || !duration || lines.length === 0) return
    const overflow = inner.scrollHeight - outer.clientHeight
    if (overflow <= 0) return
    const progress = Math.min(currentTime / duration, 1)
    inner.style.transform = `translateY(-${progress * overflow}px)`
  }, [currentTime, duration, lines])

  if (!lyricsUrl || lines.length === 0) return null

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        ref={innerRef}
        className="px-8 py-12 space-y-2"
        style={{ transition: 'transform 0.6s linear', willChange: 'transform' }}
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-white/90 text-base md:text-lg leading-relaxed text-center font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]"
          >
            {line}
          </p>
        ))}
        {/* Spacer so final lines don't get cut */}
        <div className="h-32" />
      </div>
    </div>
  )
}

// ─── Single track row ────────────────────────────────────────────────────────

interface TrackRowProps {
  track: AlbumTrack
  albumSlug: string
  trackIdx: number
  isActive: boolean
  isPlaying: boolean
  onSelect: () => void
  trackColor: string // interpolated spectrum color for this track
}

function TrackRow({ track, albumSlug, trackIdx, isActive, isPlaying, onSelect, trackColor }: TrackRowProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-150 hover:brightness-125"
      style={{
        border: `1px solid ${isActive ? `${trackColor}80` : `${trackColor}35`}`,
        background: isActive ? `${trackColor}22` : `${trackColor}08`,
      }}
    >
      {/* Track number / playing indicator */}
      <div className="w-6 flex-shrink-0 text-center">
        {isActive && isPlaying ? (
          <span className="inline-flex items-end gap-px h-4">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-0.5 rounded-full animate-bounce"
                style={{ backgroundColor: trackColor, height: `${[10, 16, 10][i]}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        ) : (
          <span className="text-xs" style={{ color: `${trackColor}99` }}>
            {trackIdx + 1}
          </span>
        )}
      </div>

      {/* Title */}
      <span
        className="flex-1 text-sm truncate"
        style={isActive ? { color: trackColor, fontWeight: 500 } : { color: 'rgba(255,255,255,0.7)' }}
      >
        {track.title}
      </span>

      {/* Lyrics indicator */}
      {track.lyricsFile && (
        <span className="text-xs flex-shrink-0" style={{ color: `${trackColor}60` }}>♪</span>
      )}
    </button>
  )
}

// ─── Album section ───────────────────────────────────────────────────────────

interface AlbumSectionProps {
  album: Album
  nowPlaying: NowPlaying | null
  isPlaying: boolean
  onSelectTrack: (albumId: string, trackIdx: number) => void
  defaultOpen?: boolean
  slotIdx: number
  nextSlotIdx: number
  loopAlbumId: string | null
  onToggleLoop: (albumId: string) => void
  // drag
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
  isDragging: boolean
  isDragTarget: boolean
}

function AlbumSection({ album, nowPlaying, isPlaying, onSelectTrack, defaultOpen,
  slotIdx, nextSlotIdx, loopAlbumId, onToggleLoop,
  onDragStart, onDragOver, onDrop, onDragEnd, isDragging, isDragTarget }: AlbumSectionProps) {
  const isActive = nowPlaying?.albumId === album.id
  const [open, setOpen] = useState(defaultOpen ?? false)

  useEffect(() => { if (isActive) setOpen(true) }, [isActive])

  const colorA = spectrumColor(slotIdx ?? 0)
  const colorB = spectrumColor(nextSlotIdx ?? 1)
  const headerColor = lerpRgb(colorA, colorA, 0) // hex anchor color for header
  const n = album.tracks.length

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="rounded-xl transition-all duration-150 select-none"
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: isDragTarget ? 'scale(1.01)' : 'scale(1)',
        border: `1px solid ${isDragTarget ? `${headerColor}90` : isActive ? `${headerColor}70` : `${headerColor}45`}`,
      }}
    >
      {/* Album header with hot-edge internal glow */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left rounded-xl overflow-hidden relative"
        style={{
          background: `linear-gradient(to right, ${headerColor}55 0%, ${headerColor}28 18%, rgba(8,6,14,0.92) 50%, ${headerColor}18 82%, ${headerColor}45 100%)`,
          boxShadow: `inset 0 1px 0 ${headerColor}40, inset 0 -1px 0 ${headerColor}30`,
        }}
      >
        {/* Hot left edge bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ background: `linear-gradient(to bottom, ${headerColor}ff, ${headerColor}99, ${headerColor}ff)` }} />

        {/* Drag grip */}
        <span className="text-sm cursor-grab active:cursor-grabbing text-white/25" title="Drag to reorder">⠿</span>

        {/* Expand arrow */}
        <span className={`text-white/50 text-xs transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>

        {/* Album title + subtitle */}
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm truncate ${isActive ? 'text-gold' : 'text-white'}`}>
            {album.title}
          </div>
          {album.subtitle && (
            <div className="text-white/40 text-xs mt-0.5 truncate">{album.subtitle}</div>
          )}
        </div>

        {/* Loop toggle */}
        <span
          onClick={e => { e.stopPropagation(); onToggleLoop(album.id) }}
          title={loopAlbumId === album.id ? 'Loop on' : 'Loop off'}
          className="flex-shrink-0 text-sm cursor-pointer transition-opacity select-none"
          style={{ opacity: loopAlbumId === album.id ? 1 : 0.2, color: headerColor }}
        >⟳</span>

        {/* Track count */}
        <span className="text-white/35 text-xs flex-shrink-0">{album.tracks.length} tracks</span>
      </button>

      {/* Track list */}
      {open && (
        <div className="px-2 pb-3 space-y-0.5">
          {album.tracks.map((track, i) => {
            const t = n > 1 ? i / (n - 1) : 0
            const trackColor = lerpRgb(colorA, colorB, t)
            return (
              <TrackRow
                key={track.file}
                track={track}
                albumSlug={album.slug}
                trackIdx={i}
                isActive={isActive && nowPlaying?.trackIdx === i}
                isPlaying={isPlaying}
                onSelect={() => onSelectTrack(album.id, i)}
                trackColor={trackColor}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main AlbumPlayer ────────────────────────────────────────────────────────

export default function AlbumPlayer({ albums, onProgress, command, onAlbumEnd, onPlay, stopToken }: AlbumPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [loopAlbumId, setLoopAlbumId] = useState<string | null>(null)
  const [loopSequence, setLoopSequence] = useState(false)

  // ── Album ordering (draggable) ──
  const [orderedAlbums, setOrderedAlbums] = useState(() => albums.map((a, i) => i))
  const [albumDragFrom, setAlbumDragFrom] = useState<number | null>(null)
  const [albumDragOver, setAlbumDragOver] = useState<number | null>(null)

  const handleAlbumDragStart = (i: number) => (e: React.DragEvent) => {
    setAlbumDragFrom(i); e.dataTransfer.effectAllowed = 'move'
  }
  const handleAlbumDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    if (albumDragOver !== i) setAlbumDragOver(i)
  }
  const handleAlbumDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (albumDragFrom === null || albumDragFrom === i) { setAlbumDragFrom(null); setAlbumDragOver(null); return }
    const newOrder = [...orderedAlbums]
    const [moved] = newOrder.splice(albumDragFrom, 1)
    newOrder.splice(i, 0, moved)
    setOrderedAlbums(newOrder)
    setAlbumDragFrom(null); setAlbumDragOver(null)
  }
  const handleAlbumDragEnd = () => { setAlbumDragFrom(null); setAlbumDragOver(null) }

  const currentAlbum = nowPlaying ? albums.find(a => a.id === nowPlaying.albumId) : null
  const currentTrack = currentAlbum?.tracks[nowPlaying?.trackIdx ?? 0] ?? null

  const localAudioPath = currentAlbum && currentTrack
    ? `/audio/albums/${currentAlbum.slug}/${currentTrack.file}.mp3`
    : null
  const audioSrc = localAudioPath
    ? (AUDIO_CDN[localAudioPath] ?? localAudioPath)
    : null

  // Lyrics file is always named [track.file].txt (if it exists the fetch succeeds, else null)
  const localLyricsPath = currentAlbum && currentTrack
    ? `/audio/albums/${currentAlbum.slug}/lyrics/${currentTrack.file}.txt`
    : null
  const lyricsUrl = localLyricsPath
    ? (AUDIO_CDN[localLyricsPath] ?? localLyricsPath)
    : null

  // External command: jump to a specific album+track and play
  useEffect(() => {
    if (!command) return
    setNowPlaying({ albumId: command.albumId, trackIdx: command.trackIdx })
  }, [command?.token]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stop when parent signals exclusivity
  useEffect(() => {
    if (!stopToken) return
    const audio = audioRef.current
    if (audio && !audio.paused) { audio.pause(); setIsPlaying(false) }
  }, [stopToken])

  // Load + play when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioSrc) return
    audio.src = audioSrc
    audio.volume = volume
    audio.play().then(() => { setIsPlaying(true); onPlay?.() }).catch(() => setIsPlaying(false))
  }, [audioSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const handleSelectTrack = useCallback((albumId: string, trackIdx: number) => {
    if (nowPlaying?.albumId === albumId && nowPlaying?.trackIdx === trackIdx) {
      // Toggle play/pause on same track
      const audio = audioRef.current
      if (!audio) return
      if (isPlaying) { audio.pause(); setIsPlaying(false) }
      else { audio.play(); setIsPlaying(true); onPlay?.() }
    } else {
      setNowPlaying({ albumId, trackIdx })
    }
  }, [nowPlaying, isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !audioSrc) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true); onPlay?.() }
  }

  const handlePrev = () => {
    if (!nowPlaying || !currentAlbum) return
    if (currentTime > 3) {
      audioRef.current!.currentTime = 0
      return
    }
    const newIdx = nowPlaying.trackIdx - 1
    if (newIdx >= 0) setNowPlaying({ albumId: nowPlaying.albumId, trackIdx: newIdx })
  }

  const handleNext = useCallback(() => {
    if (!nowPlaying || !currentAlbum) return
    const newIdx = nowPlaying.trackIdx + 1
    if (newIdx < currentAlbum.tracks.length) {
      // Advance track within same album
      setNowPlaying({ albumId: nowPlaying.albumId, trackIdx: newIdx })
    } else {
      // Last track — loop album or advance
      if (loopAlbumId === nowPlaying.albumId) {
        setNowPlaying({ albumId: nowPlaying.albumId, trackIdx: 0 })
      } else {
        const curDispIdx = orderedAlbums.findIndex(i => albums[i].id === nowPlaying.albumId)
        const nextDispIdx = curDispIdx + 1
        const wrappedIdx = loopSequence
          ? nextDispIdx % orderedAlbums.length
          : nextDispIdx
        if (wrappedIdx < orderedAlbums.length) {
          const nextAlbum = albums[orderedAlbums[wrappedIdx]]
          setNowPlaying({ albumId: nextAlbum.id, trackIdx: 0 })
          onAlbumEnd?.(nowPlaying.albumId)
        } else {
          setIsPlaying(false)
          onAlbumEnd?.(nowPlaying.albumId)
        }
      }
    }
  }, [nowPlaying, currentAlbum, orderedAlbums, albums, onAlbumEnd, loopAlbumId, loopSequence])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  // Compute current album's display slot → spectrum color for transport bar
  const nowPlayingOrigIdx = nowPlaying ? albums.findIndex(a => a.id === nowPlaying.albumId) : -1
  const nowPlayingSlot = nowPlayingOrigIdx >= 0 ? orderedAlbums.indexOf(nowPlayingOrigIdx) : 0
  const npColor = lerpRgb(spectrumColor(nowPlayingSlot), spectrumColor(nowPlayingSlot), 0)

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          const t = audioRef.current?.currentTime ?? 0
          setCurrentTime(t)
          onProgress?.({ lyricsUrl, currentTime: t, duration })
        }}
        onLoadedMetadata={() => {
          const d = audioRef.current?.duration ?? 0
          setDuration(d)
          onProgress?.({ lyricsUrl, currentTime: 0, duration: d })
        }}
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* ── Now Playing bar ── */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: nowPlaying
            ? `linear-gradient(to right, ${npColor}55 0%, ${npColor}28 18%, rgba(8,6,14,0.95) 50%, ${npColor}18 82%, ${npColor}45 100%)`
            : 'rgba(8,6,14,0.8)',
          border: `1px solid ${nowPlaying ? `${npColor}55` : 'rgba(255,255,255,0.1)'}`,
          boxShadow: nowPlaying ? `inset 0 1px 0 ${npColor}40, inset 0 -1px 0 ${npColor}30` : 'none',
        }}
      >

        {/* Controls */}
        <div className="px-5 py-4">
          {/* Track info */}
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 flex-1">
              {currentTrack ? (
                <>
                  <div className="text-white font-semibold text-sm truncate">{currentTrack.title}</div>
                  <div className="text-white/40 text-xs mt-0.5 truncate">{currentAlbum?.title}</div>
                </>
              ) : (
                <div className="text-white/30 text-sm">Select a track to begin</div>
              )}
            </div>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/30 text-xs w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 appearance-none bg-white/15 rounded-full cursor-pointer accent-gold"
            />
            <span className="text-white/30 text-xs w-8 tabular-nums">{formatTime(duration)}</span>
          </div>

          {/* Buttons + volume */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={!nowPlaying}
                className="text-white/50 hover:text-white disabled:opacity-25 transition-colors text-lg"
              >
                ⏮
              </button>
              <button
                onClick={handlePlayPause}
                disabled={!audioSrc}
                className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 disabled:opacity-25 transition-all flex items-center justify-center text-base"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={handleNext}
                disabled={!nowPlaying}
                className="text-white/50 hover:text-white disabled:opacity-25 transition-colors text-lg"
              >
                ⏭
              </button>
            </div>

            {/* Loop sequence toggle */}
            <button
              onClick={() => setLoopSequence(v => !v)}
              title={loopSequence ? 'Loop sequence: on' : 'Loop sequence: off'}
              className="text-sm transition-opacity select-none"
              style={{ opacity: loopSequence ? 1 : 0.25, color: loopSequence ? npColor : 'white' }}
            >⟳</button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs">🔊</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-14 sm:w-20 h-1 appearance-none bg-white/15 rounded-full cursor-pointer accent-gold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Album accordion (draggable) ── */}
      <div className="space-y-2">
        {orderedAlbums.map((origIdx, dispIdx) => {
          const album = albums[origIdx]
          if (!album) return null
          return (
            <AlbumSection
              key={album.id}
              album={album}
              nowPlaying={nowPlaying}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
              defaultOpen={dispIdx === 0}
              slotIdx={dispIdx}
              nextSlotIdx={dispIdx + 1}
              loopAlbumId={loopAlbumId}
              onToggleLoop={id => setLoopAlbumId(prev => prev === id ? null : id)}
              onDragStart={handleAlbumDragStart(dispIdx)}
              onDragOver={handleAlbumDragOver(dispIdx)}
              onDrop={handleAlbumDrop(dispIdx)}
              onDragEnd={handleAlbumDragEnd}
              isDragging={albumDragFrom === dispIdx}
              isDragTarget={albumDragOver === dispIdx && albumDragFrom !== null && albumDragFrom !== dispIdx}
            />
          )
        })}
      </div>
    </div>
  )
}
