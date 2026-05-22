'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { IpWorld } from '@/types'

interface WorldCardProps {
  world: Partial<IpWorld>
}

export default function WorldCard({ world }: WorldCardProps) {
  const accent = world.color_primary ?? '#c9973a'

  return (
    <Link href={`/worlds/${world.slug}`} className="group block">
      {/* 16:9 image panel */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: '16/9',
          background: `radial-gradient(ellipse at 50% 30%, ${accent}30 0%, #08060e 80%)`,
          border: `1px solid ${accent}20`,
        }}
      >
        {world.thumbnail_url ? (
          <Image
            src={world.thumbnail_url}
            alt={world.title ?? ''}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-400"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${accent} 0%, transparent 65%)`,
            }}
          />
        )}
        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Hover glow border */}
        <div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${accent}70` }}
        />

        {/* Theme tag */}
        {world.theme_style && (
          <div className="absolute top-2 left-2">
            <span
              className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded"
              style={{
                background: 'rgba(8,6,14,0.75)',
                color: `${accent}90`,
                border: `1px solid ${accent}25`,
              }}
            >
              {world.theme_style}
            </span>
          </div>
        )}
      </div>

      {/* Info below */}
      <div className="pt-2.5 pb-1 px-0.5">
        <h3
          className="font-cinzel text-sm font-bold tracking-wide leading-tight mb-1 transition-colors duration-200"
          style={{ color: accent }}
        >
          {world.title}
        </h3>
        {world.short_description && (
          <p className="text-white/40 text-xs leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors duration-200">
            {world.short_description}
          </p>
        )}
      </div>
    </Link>
  )
}
