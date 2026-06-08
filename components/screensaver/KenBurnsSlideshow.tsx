'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KenBurnsSlideshowProps {
  images: string[]
  /** Seconds per image — default 10, range 3–30 */
  secPerImage?: number
  /** Show Speed slider inside the component */
  showControls?: boolean
  accentColor?: string
  className?: string
  style?: React.CSSProperties
}

// Scale always 1.0 → 1.3, varied pan direction
const KB_VARIANTS = [
  { initial: { scale: 1.0,  x: '0%',   y: '0%'  }, animate: { scale: 1.3, x: '-5%', y: '-4%' } },
  { initial: { scale: 1.0,  x: '0%',   y: '0%'  }, animate: { scale: 1.3, x: '5%',  y: '-4%' } },
  { initial: { scale: 1.0,  x: '0%',   y: '0%'  }, animate: { scale: 1.3, x: '-5%', y: '4%'  } },
  { initial: { scale: 1.0,  x: '0%',   y: '0%'  }, animate: { scale: 1.3, x: '5%',  y: '4%'  } },
  { initial: { scale: 1.0,  x: '-4%',  y: '0%'  }, animate: { scale: 1.3, x: '4%',  y: '0%'  } },
  { initial: { scale: 1.0,  x: '4%',   y: '0%'  }, animate: { scale: 1.3, x: '-4%', y: '0%'  } },
]

export default function KenBurnsSlideshow({
  images,
  secPerImage = 10,
  showControls = false,
  accentColor = '#c9973a',
  className,
  style,
}: KenBurnsSlideshowProps) {
  const [idx, setIdx]         = useState(0)
  const [variant, setVariant] = useState(0)
  const [speed, setSpeed]     = useState(secPerImage)
  const [restartKey, setRestartKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function applySpeed(s: number) {
    setSpeed(s)
    setVariant(Math.floor(Math.random() * KB_VARIANTS.length))
    setRestartKey(k => k + 1)  // force current image to remount with new duration
  }

  useEffect(() => {
    if (images.length <= 1) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx(i => {
        setVariant(Math.floor(Math.random() * KB_VARIANTS.length))
        return (i + 1) % images.length
      })
    }, speed * 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length, speed])

  if (images.length === 0) return null

  const kbv     = KB_VARIANTS[variant]
  const fadeDur = speed / 3   // locked: crossfade = 1/3 of display time

  return (
    <div className={className ?? ''} style={{ overflow: 'hidden', position: 'relative', ...style }}>
      <AnimatePresence mode="sync">
        <motion.img
          key={`${idx}-${images[idx]}-${restartKey}`}
          src={images[idx]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: kbv.initial.scale, x: kbv.initial.x, y: kbv.initial.y }}
          animate={{ opacity: 1,  scale: kbv.animate.scale, x: kbv.animate.x, y: kbv.animate.y }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: fadeDur, ease: 'easeInOut' },
            scale:   { duration: speed,   ease: 'linear' },
            x:       { duration: speed,   ease: 'linear' },
            y:       { duration: speed,   ease: 'linear' },
          }}
        />
      </AnimatePresence>

      {/* Header + footer gradient overlay — locked at 1/3 height each */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(8,6,14,0.72) 0%, transparent 33%, transparent 67%, rgba(8,6,14,0.72) 100%)',
      }} />

      {showControls && (
        <div
          className="absolute bottom-3 right-4 z-20 flex items-center gap-2 select-none"
          style={{ opacity: 0.7 }}
          onClick={e => e.stopPropagation()}
        >
          <span className="text-[8px] tracking-widest uppercase" style={{ color: accentColor }}>Speed</span>
          <input
            type="range" min={3} max={30} step={1} value={speed}
            onChange={e => applySpeed(Number(e.target.value))}
            className="w-20 h-1 cursor-pointer appearance-none rounded-full"
            style={{ accentColor }}
          />
          <span className="text-[8px] font-mono" style={{ color: accentColor, minWidth: 24 }}>{speed}s</span>
        </div>
      )}
    </div>
  )
}
