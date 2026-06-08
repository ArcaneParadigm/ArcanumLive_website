'use client'

import { useEffect, useRef } from 'react'

interface SequencePlayerProps {
  frames: string[]
  fps?: number
  fadeDur?: number
  opacity?: number
  onFrame?: (idx: number) => void
  className?: string
  style?: React.CSSProperties
}

const BATCH = 20   // preload N frames ahead

export default function SequencePlayer({
  frames,
  fps = 12,
  fadeDur = 0.18,
  opacity = 1,
  onFrame,
  className,
  style,
}: SequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (frames.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cache = new Map<number, HTMLImageElement>()
    let frameIdx = 0
    let rafId = 0
    let lastTime = 0
    let fading = false
    let nextIdx: number | null = null
    let started = false
    let destroyed = false

    const interval = 1000 / fps
    const fadeDurMs = fadeDur * 1000

    function preload(startIdx: number) {
      for (let i = 0; i < BATCH; i++) {
        const idx = (startIdx + i) % frames.length
        if (cache.has(idx)) continue
        const img = new Image()
        img.src = frames[idx]
        img.onload = () => {
          if (destroyed) return
          cache.set(idx, img)
          // Start playback as soon as the first frame is ready
          if (!started && cache.has(0)) {
            started = true
            lastTime = performance.now()
            rafId = requestAnimationFrame(tick)
          }
        }
      }
    }

    function drawFrame(img: HTMLImageElement, alpha: number) {
      if (!canvas) return
      const { width: cw, height: ch } = canvas
      const { naturalWidth: iw, naturalHeight: ih } = img
      const scale = Math.max(cw / iw, ch / ih)
      const rw = iw * scale, rh = ih * scale
      const ox = (cw - rw) / 2, oy = (ch - rh) / 2
      ctx.globalAlpha = alpha
      ctx.drawImage(img, ox, oy, rw, rh)
    }

    function tick(now: number) {
      rafId = requestAnimationFrame(tick)

      // Sync canvas size to display size
      const dpr = window.devicePixelRatio || 1
      const dispW = canvas!.clientWidth * dpr
      const dispH = canvas!.clientHeight * dpr
      if (canvas!.width !== dispW || canvas!.height !== dispH) {
        canvas!.width = dispW
        canvas!.height = dispH
      }

      const cur = cache.get(frameIdx)
      if (!cur) return

      // Advance frame when interval elapsed
      if (!fading && now - lastTime >= interval) {
        const next = (frameIdx + 1) % frames.length
        if (cache.has(next)) {
          nextIdx = next
          fading = true
          lastTime = now
          onFrame?.(next)
          // Preload next batch
          if (next % Math.floor(BATCH / 2) === 0) preload(next)
        }
      }

      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      if (fading && nextIdx !== null) {
        const nxt = cache.get(nextIdx)
        const progress = Math.min(1, (now - lastTime) / fadeDurMs)
        drawFrame(cur, 1 - progress)
        if (nxt) drawFrame(nxt, progress)
        if (progress >= 1) {
          frameIdx = nextIdx!
          nextIdx = null
          fading = false
        }
      } else {
        drawFrame(cur, 1)
      }
    }

    preload(0)

    return () => {
      destroyed = true
      cancelAnimationFrame(rafId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, fps, fadeDur])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', opacity, ...style }}
    />
  )
}
