'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Album } from '@/types'

interface AlbumCardProps {
  album: Partial<Album>
}

const WAVEFORM_HEIGHTS = Array.from({ length: 20 }, () => Math.random() * 20 + 4)

const energyColor = (level: number | null | undefined) => {
  if (!level) return '#c9973a'
  if (level >= 8) return '#ef4444'
  if (level >= 6) return '#f97316'
  if (level >= 4) return '#c9973a'
  return '#00e5ff'
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer"
    >
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-obsidian-100 shadow-card">
        {/* Cover art */}
        <div className="relative aspect-square bg-purple-cosmic">
          {album.cover_image_url ? (
            <Image
              src={album.cover_image_url}
              alt={album.title ?? ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-deep to-obsidian-200">
              <div
                className="w-16 h-16 rounded-full border-2 opacity-40 animate-glow-pulse"
                style={{ borderColor: energyColor(album.energy_level) }}
              />
            </div>
          )}

          {/* Waveform overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-0.5 pb-1 px-3">
            {mounted && WAVEFORM_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full animate-drift"
                style={{
                  height: `${h}px`,
                  backgroundColor: energyColor(album.energy_level),
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white text-sm font-semibold leading-tight truncate">{album.title}</h3>
          {album.mood && (
            <p className="text-white/40 text-xs mt-0.5 capitalize">{album.mood}</p>
          )}
          {album.energy_level && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: i < (album.energy_level ?? 0) ? energyColor(album.energy_level) : '#ffffff20',
                    }}
                  />
                ))}
              </div>
              <span className="text-white/30 text-xs">{album.energy_level}/10</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
