'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { featuredWorlds } from '@/lib/data/seed'

const WORLD_STARS = Array.from({ length: 60 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.5 + 0.1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 6,
}))

const worldSymbols: Record<string, string> = {
  'the-arcanum': '◈',
  'mythmachine': '⬡',
  'soulblade': '✦',
  'atlantis-nexus': '◉',
  'gaia-heart-shard': '✧',
  'aether': '⊛',
  'creatrix': '◎',
  'raven': '◆',
}

interface PortalCardProps {
  world: (typeof featuredWorlds)[number]
  index: number
  hero?: boolean
  inView: boolean
  delay?: number
}

function PortalCard({ world, index, hero = false, inView, delay = 0 }: PortalCardProps) {
  const color = world.color_primary ?? '#c9973a'
  const symbol = worldSymbols[world.slug ?? ''] ?? '◈'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <Link
        href={`/worlds/${world.slug}`}
        className="block relative overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-500 group-hover:border-opacity-0"
        style={{ minHeight: hero ? '460px' : '280px' }}
      >
        {/* World art background */}
        {world.thumbnail_url ? (
          <Image
            src={world.thumbnail_url}
            alt={world.title ?? ''}
            fill
            className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${color}28 0%, #06060a 55%, ${color}0a 100%)`,
            }}
          />
        )}

        {/* Depth atmosphere */}
        <div
          className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${color}22 0%, transparent 60%)`,
          }}
        />

        {/* Large background symbol */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-cinzel transition-all duration-700 group-hover:scale-110 group-hover:opacity-[0.06]"
            style={{
              fontSize: hero ? '14rem' : '8rem',
              color,
              opacity: 0.04,
              lineHeight: 1,
            }}
          >
            {symbol}
          </span>
        </div>

        {/* Top row: number + theme tag */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
          <span className="font-cinzel text-xs tracking-[0.3em] text-white/20">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="text-[10px] tracking-[0.25em] uppercase px-2 py-1 rounded border opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color, borderColor: `${color}44`, background: `${color}0f` }}
          >
            {world.theme_style}
          </span>
        </div>

        {/* Bottom: world name + reveal */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="relative p-5 md:p-6">
            <h3
              className={`font-cinzel font-bold text-white tracking-widest leading-tight mb-0 ${hero ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}
            >
              {world.title}
            </h3>

            {/* Description + CTA — hidden, slides up on hover */}
            <div className="overflow-hidden max-h-0 group-hover:max-h-28 transition-all duration-500 ease-out">
              {world.short_description && (
                <p className="text-white/55 text-sm leading-relaxed mt-2 mb-3">
                  {world.short_description}
                </p>
              )}
              <span
                className="text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300"
                style={{ color }}
              >
                Enter {world.title} →
              </span>
            </div>
          </div>
        </div>

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${color}55, inset 0 0 40px ${color}10` }}
        />
      </Link>
    </motion.div>
  )
}

export default function WorldsFeatureGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const heroWorld = featuredWorlds[0]
  const sideWorlds = featuredWorlds.slice(1, 5)
  const gridWorlds = featuredWorlds.slice(5, 9)
  const tagWorlds = featuredWorlds.slice(9)

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-obsidian-200 overflow-hidden">
      {/* Cosmic nebula atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(45,10,82,0.5) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(26,5,51,0.6) 0%, transparent 55%)' }} />
        <div
          className="section-orb"
          style={{
            '--orb-opacity': '0.18',
            '--orb-duration': '14s',
            '--orb-delay': '0s',
            width: '60%', height: '70%',
            top: '-10%', right: '-10%',
            background: 'radial-gradient(ellipse, #5b21b6 0%, #2d0a52 40%, transparent 70%)',
          } as React.CSSProperties}
        />
        {mounted && WORLD_STARS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity }}
            animate={{ opacity: [s.opacity, s.opacity * 2.5, s.opacity] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-obsidian-200 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian-200 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-3">Section IV</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white leading-tight tracking-widest">
              Choose<br />
              <span
                className="text-transparent bg-clip-text bg-gold-gradient"
                style={{ filter: 'drop-shadow(0 0 20px rgba(201,151,58,0.5)) drop-shadow(0 0 60px rgba(201,151,58,0.2))' }}
              >Your Realm</span>
            </h2>
            <p className="hidden md:block text-white/35 text-sm max-w-xs text-right leading-relaxed">
              Each world is a living cinematic universe — characters, music, films, visuals, and lore.
            </p>
          </div>
        </motion.div>

        {/* Hero + side grid — row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {/* Hero — spans 2 cols */}
          <div className="col-span-2">
            <PortalCard world={heroWorld} index={0} hero inView={inView} delay={0.15} />
          </div>

          {/* Side worlds — 2 cols, 2 rows */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {sideWorlds.map((world, i) => (
              <PortalCard
                key={world.id}
                world={world}
                index={i + 1}
                inView={inView}
                delay={0.2 + i * 0.08}
              />
            ))}
          </div>
        </div>

        {/* Second row — 4 equal portals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {gridWorlds.map((world, i) => (
            <PortalCard
              key={world.id}
              world={world}
              index={i + 5}
              inView={inView}
              delay={0.4 + i * 0.07}
            />
          ))}
        </div>

        {/* Remaining worlds — tag strip */}
        {tagWorlds.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {tagWorlds.map((world) => (
              <Link
                key={world.id}
                href={`/worlds/${world.slug}`}
                className="group px-4 py-2 text-xs tracking-wide border border-white/10 rounded-lg text-white/40 hover:text-white/80 transition-all duration-300"
                style={{
                  borderColor: world.color_primary ? `${world.color_primary}33` : undefined,
                }}
              >
                <span className="mr-1.5 opacity-50">{worldSymbols[world.slug ?? ''] ?? '◈'}</span>
                <span className="group-hover:tracking-wider transition-all duration-300">{world.title}</span>
              </Link>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center"
        >
          <Link href="/realms" className="arcanum-btn-primary">Explore All Worlds</Link>
        </motion.div>
      </div>
    </section>
  )
}
