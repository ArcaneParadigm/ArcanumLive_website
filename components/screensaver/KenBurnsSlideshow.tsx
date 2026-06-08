'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KenBurnsSlideshowProps {
  images: string[]
  /** Seconds per image — default 10, range 5–30 */
  secPerImage?: number
  className?: string
  style?: React.CSSProperties
}

// Each image gets a random Ken Burns direction:
// pan from one corner toward center while zooming in or out
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
  className,
  style,
}: KenBurnsSlideshowProps) {
  const [idx, setIdx]         = useState(0)
  const [variant, setVariant] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (images.length <= 1) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % images.length
        setVariant(Math.floor(Math.random() * KB_VARIANTS.length))
        return next
      })
    }, secPerImage * 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length, secPerImage])

  if (images.length === 0) return null

  const kbv = KB_VARIANTS[variant]

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
            opacity: { duration: 2.4, ease: 'easeInOut' },
            scale:   { duration: secPerImage + 2, ease: 'linear' },
            x:       { duration: secPerImage + 2, ease: 'linear' },
            y:       { duration: secPerImage + 2, ease: 'linear' },
          }}
        />
      </AnimatePresence>
    </div>
  )
}
