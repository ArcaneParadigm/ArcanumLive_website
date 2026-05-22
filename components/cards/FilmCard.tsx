'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Film } from '@/types'

interface FilmCardProps {
  film: Partial<Film>
}

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 2 }}
      transition={{ duration: 0.3 }}
      className="group perspective-1000"
    >
      <Link href={`/films/${film.slug}`}>
        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-card bg-obsidian-100">
          {/* Poster */}
          <div className="relative aspect-[2/3] bg-purple-cosmic">
            {film.poster_url ? (
              <Image
                src={film.poster_url}
                alt={film.title ?? ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-purple-deep to-obsidian-200 flex items-center justify-center">
                <span className="text-white/20 text-4xl">◈</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {film.is_360 && (
                <span className="px-2 py-0.5 text-xs bg-cyan-arcanum/20 border border-cyan-arcanum/40 text-cyan-arcanum rounded-full tracking-wider">
                  360°
                </span>
              )}
              {film.is_dome_available && (
                <span className="px-2 py-0.5 text-xs bg-gold/20 border border-gold/40 text-gold-bright rounded-full tracking-wider">
                  Dome
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-base leading-tight mb-1">
              {film.title}
            </h3>
            {film.short_description && (
              <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                {film.short_description}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <span className="text-gold-bright text-xs tracking-wider uppercase font-medium group-hover:text-gold-bright transition-colors">
                Rent on Vimeo →
              </span>
              {film.runtime_minutes && (
                <span className="text-white/30 text-xs">
                  {film.runtime_minutes}m
                </span>
              )}
            </div>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-gold-glow" />
        </div>
      </Link>
    </motion.div>
  )
}
