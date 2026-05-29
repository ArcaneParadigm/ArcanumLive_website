'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { wobbleIn, staggerContainer, cardHover, cardTap, fadeUp, viewport } from '@/lib/utils/motionVariants'
import type { IpWorld } from '@/types'

interface WorldCardProps {
  world: Partial<IpWorld>
}

function WorldCard({ world }: WorldCardProps) {
  const accent = world.color_primary ?? '#c9973a'

  return (
    <motion.div
      variants={wobbleIn}
      whileHover={cardHover}
      whileTap={cardTap}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      <Link href={`/realms/${world.slug}`} className="group block">
        {/* 16:9 image panel */}
        <div
          className="relative overflow-hidden rounded-xl"
          style={{
            aspectRatio: '16/9',
            background: `radial-gradient(ellipse at 50% 30%, ${accent}30 0%, #08060e 80%)`,
            border: `1px solid ${accent}20`,
            boxShadow: `0 4px 24px ${accent}10`,
          }}
        >
          {world.thumbnail_url ? (
            <Image
              src={world.thumbnail_url}
              alt={world.title ?? ''}
              fill
              className="object-cover opacity-70 group-hover:opacity-95 transition-opacity duration-300"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: `radial-gradient(ellipse at 50% 50%, ${accent} 0%, transparent 65%)` }}
            />
          )}

          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Hover glow border */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ boxShadow: `inset 0 0 0 1px ${accent}80, 0 0 20px ${accent}20` }}
          />

          {/* Theme tag */}
          {world.theme_style && (
            <div className="absolute top-2 left-2">
              <span
                className="text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
                style={{
                  background: 'rgba(8,6,14,0.8)',
                  color: `${accent}cc`,
                  border: `1px solid ${accent}30`,
                }}
              >
                {world.theme_style}
              </span>
            </div>
          )}
        </div>

        {/* Info below */}
        <div className="pt-2.5 pb-1">
          <h3
            className="font-cinzel text-sm font-bold tracking-wide leading-tight mb-1"
            style={{ color: accent }}
          >
            {world.title}
          </h3>
          {world.short_description && (
            <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors duration-200">
              {world.short_description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

interface Home2WorldsSectionProps {
  worlds: Partial<IpWorld>[]
}

export default function Home2WorldsSection({ worlds }: Home2WorldsSectionProps) {
  const displayed = worlds.slice(0, 8)

  return (
    <section className="relative px-4 md:px-8 py-16" style={{ background: '#06040c' }}>

      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="max-w-7xl mx-auto mb-10"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase mb-2 font-medium" style={{ color: '#c9973a80' }}>
              Explore
            </p>
            <h2
              className="font-cinzel text-2xl md:text-3xl font-bold tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #c9973a 0%, #f5d06e 50%, #c9973a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Worlds
            </h2>
          </div>
          <Link href="/realms">
            <motion.span
              className="text-[9px] tracking-[0.4em] uppercase font-medium border-b pb-0.5 transition-colors"
              style={{ color: '#c9973a80', borderColor: '#c9973a30' }}
              whileHover={{ color: '#c9973a', borderColor: '#c9973a' } as never}
            >
              View All →
            </motion.span>
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,151,58,0.4), transparent)' }} />
      </motion.div>

      {/* Cards grid — staggered wobble in */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto"
      >
        {displayed.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </motion.div>
    </section>
  )
}
