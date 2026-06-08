'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KenBurnsSlideshowProps {
  images: string[]
  /** Seconds per image — default 10, range 5–30 */
  secPerImage?: number
  /** Show Fade + Speed sliders inside the component */
  showControls?: boolean
  accentColor?: string
  className?: string
  style?: React.CSSProperties
}

const KB_VARIANTS = [
  { initial: { scale: 1.18, x: '-3%',  y: '-3%'  }, animate: { scale: 1.0,  x: '0%',   y: '0%'   } },
  { initial: { scale: 1.18, x: '3%',   y: '-3%'  }, animate: { scale: 1.0,  x: '0%',   y: '0%'   } },
  { initial: { scale: 1.18, x: '-3%',  y: '3%'   }, animate: { scale: 1.0,  x: '0%',   y: '0%'   } },
  { initial: { scale: 1.18, x: '3%',   y: '3%'   }, animate: { scale: 1.0,  x: '0%',   y: '0%'   } },
  { initial: { scale: 1.0,  x: '0%',   y: '0%'   }, animate: { scale: 1.16, x: '-2%',  y: '-2%'  } },
  { initial: { scale: 1.0,  x: '0%',   y: '0%'   }, animate: { scale: 1.16, x: '2%',   y: '2%'   } },
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
  // slider-controlled values live here so parent never re-renders
  const [speed, setSpeed]     = useState(secPerImage)
  const [fadeDur, setFadeDur] = useState(2.4)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // use a ref for fadeDur so the transition reads the latest value without restarting animation
  const fadeDurRef = useRef(fadeDur)
  useEffect(() => { fadeDurRef.current = fadeDur }, [fadeDur])

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

  const kbv = KB_VARIANTS[variant]
  const fd  = fadeDur          // read state (only used on next image mount)
  const scaleDur = speed + 2   // scale slightly outlasts interval for overlap

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      <AnimatePresence mode="sync">
        <motion.img
          key={`${idx}-${images[idx]}`}
          src={images[idx]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: kbv.initial.scale, x: kbv.initial.x, y: kbv.initial.y }}
          animate={{ opacity: 1,  scale: kbv.animate.scale, x: kbv.animate.x, y: kbv.animate.y }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: fd,       ease: 'easeInOut' },
            scale:   { duration: scaleDur, ease: 'linear' },
            x:       { duration: scaleDur, ease: 'linear' },
            y:       { duration: scaleDur, ease: 'linear' },
          }}
        />
      </AnimatePresence>

      {showControls && (
        <div
          className="absolute bottom-3 right-4 z-20 flex items-center gap-4 select-none"
          style={{ opacity: 0.65 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] tracking-widest uppercase" style={{ color: accentColor }}>Fade</span>
            <input
              type="range" min={0.3} max={8} step={0.1} value={fadeDur}
              onChange={e => setFadeDur(Number(e.target.value))}
              className="w-16 h-1 cursor-pointer appearance-none rounded-full"
              style={{ accentColor }}
            />
            <span className="text-[8px] font-mono" style={{ color: accentColor, minWidth: 28 }}>{fadeDur.toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] tracking-widest uppercase" style={{ color: accentColor }}>Speed</span>
            <input
              type="range" min={5} max={30} step={1} value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-16 h-1 cursor-pointer appearance-none rounded-full"
              style={{ accentColor }}
            />
            <span className="text-[8px] font-mono" style={{ color: accentColor, minWidth: 24 }}>{speed}s</span>
          </div>
        </div>
      )}
    </div>
  )
}
