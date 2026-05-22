'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { VideoItem } from '@/lib/data/videos'

interface TrailersStripProps {
  trailers: VideoItem[]
}

export default function TrailersStrip({ trailers }: TrailersStripProps) {
  return (
    <div className="relative">
      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin" style={{ scrollSnapType: 'x mandatory' }}>
        {trailers.map((trailer, i) => (
          <motion.div
            key={trailer.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="group shrink-0"
            style={{ scrollSnapAlign: 'start', width: 'clamp(220px, 30vw, 300px)' }}
          >
            <Link href={`/watch?v=${trailer.id}`}>
              {/* Thumbnail frame */}
              <div
                className="relative overflow-hidden rounded-xl mb-3 border border-gold/15 transition-all duration-400 group-hover:border-gold/40"
                style={{ aspectRatio: '16/9' }}
              >
                {/* Placeholder with gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(160deg, rgba(201,151,58,0.1) 0%, #08060e 100%)' }}
                />
                {/* Corner marks */}
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-gold/30" />
                <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-gold/30" />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-gold/30" />

                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(8,6,14,0.7)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(201,151,58,0.35)',
                    }}
                  >
                    <span className="text-gold/80 text-sm" style={{ marginLeft: 2 }}>▶</span>
                  </div>
                </div>

                {/* Duration badge */}
                {trailer.duration && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] text-gold/60 tracking-wide"
                    style={{ background: 'rgba(8,6,14,0.75)' }}>
                    {trailer.duration}
                  </div>
                )}

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,151,58,0.1) 0%, transparent 60%)' }}
                />
              </div>

              {/* Title */}
              <h4 className="font-cinzel text-white/80 text-sm tracking-wide leading-tight mb-1 group-hover:text-white transition-colors">
                {trailer.title}
              </h4>
              <p className="text-gold/50 text-[10px] tracking-[0.2em] uppercase group-hover:text-gold/80 transition-colors">
                Play Trailer →
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Right fade edge */}
      <div
        className="absolute right-0 top-0 bottom-4 w-16 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #08060e, transparent)' }}
      />
    </div>
  )
}
