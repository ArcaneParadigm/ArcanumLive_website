'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface SequencePlayerProps {
  /** Array of image URLs in order */
  frames: string[]
  /** Playback speed in frames-per-second (default 12) */
  fps?: number
  /** Crossfade duration in seconds (default 0.18) */
  fadeDur?: number
  /** 0–1 opacity of the canvas layer (default 1) */
  opacity?: number
  /** Called each time a new frame starts — passes frame index */
  onFrame?: (idx: number) => void
  className?: string
  style?: React.CSSProperties
}

const BATCH = 20      // preload N frames ahead at a time
const MIN_READY = 6   // start playback once this many frames are cached

export default function SequencePlayer({
  frames,
  fps = 12,
  fadeDur = 0.18,
  opacity = 1,
  onFrame,
  className,
  style,
}: SequencePlayerProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const cacheRef   = useRef<Map<number, HTMLImageElement>>(new Map())
  const frameIdx   = useRef(0)
  const rafRef     = useRef<number>(0)
  const lastTime   = useRef<number>(0)
  const alphaRef   = useRef(1)         // current frame alpha (for crossfade)
  const nextIdxRef = useRef<number | null>(null)
  const fadingRef  = useRef(false)
  const [ready, setReady] = useState(false)

  // ── Preloader ──────────────────────────────────────────────────────────────
  const preload = useCallback((startIdx: number) => {
    const cache = cacheRef.current
    for (let i = 0; i < BATCH; i++) {
      const idx = (startIdx + i) % frames.length
      if (cache.has(idx)) continue
      const img = new Image()
      img.src = frames[idx]
      img.onload = () => {
        cache.set(idx, img)
        if (cache.size >= MIN_READY && !ready) setReady(true)
      }
    }
  }, [frames, ready])

  useEffect(() => {
    if (frames.length === 0) return
    preload(0)
  }, [frames, preload])

  // ── Render loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || frames.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const interval = 1000 / fps
    const fadeFrames = Math.max(1, Math.round(fadeDur * fps))

    function drawFrame(img: HTMLImageElement, alpha: number) {
      if (!canvas) return
      const { width: cw, height: ch } = canvas
      const { naturalWidth: iw, naturalHeight: ih } = img
      // object-cover: fill canvas, centered
      const scale = Math.max(cw / iw, ch / ih)
      const rw = iw * scale, rh = ih * scale
      const ox = (cw - rw) / 2, oy = (ch - rh) / 2
      ctx!.globalAlpha = alpha
      ctx!.drawImage(img, ox, oy, rw, rh)
    }

    function tick(now: number) {
      rafRef.current = requestAnimationFrame(tick)
      const cache = cacheRef.current

      // Resize canvas to match display size
      const dpr = window.devicePixelRatio || 1
      const dispW = canvas!.clientWidth  * dpr
      const dispH = canvas!.clientHeight * dpr
      if (canvas!.width !== dispW || canvas!.height !== dispH) {
        canvas!.width  = dispW
        canvas!.height = dispH
      }

      const cur = cache.get(frameIdx.current)
      if (!cur) return

      // Time to advance?
      if (!fadingRef.current && now - lastTime.current >= interval) {
        const next = (frameIdx.current + 1) % frames.length
        if (cache.has(next)) {
          nextIdxRef.current = next
          fadingRef.current  = true
          alphaRef.current   = 1
          lastTime.current   = now
          onFrame?.(next)
          // Preload next batch
          if (next % Math.floor(BATCH / 2) === 0) preload(next)
        }
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      if (fadingRef.current && nextIdxRef.current !== null) {
        const nxt = cache.get(nextIdxRef.current)
        const progress = Math.min(1, (now - lastTime.current) / (fadeDur * 1000))
        const a = 1 - progress   // current fades out
        const b = progress       // next fades in

        drawFrame(cur, a)
        if (nxt) drawFrame(nxt, b)

        if (progress >= 1) {
          frameIdx.current  = nextIdxRef.current
          nextIdxRef.current = null
          fadingRef.current  = false
          alphaRef.current   = 1
        }
      } else {
        drawFrame(cur, 1)
      }
    }

    lastTime.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [ready, frames, fps, fadeDur, onFrame, preload])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', opacity, ...style }}
    />
  )
}
