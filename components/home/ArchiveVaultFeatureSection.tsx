'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { archiveCategories } from '@/lib/data/seed'

export default function ArchiveVaultFeatureSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-obsidian-200 overflow-hidden">
      {/* Arcane vault atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep violet convergence from both sides */}
        <div
          className="section-orb"
          style={{
            '--orb-opacity': '0.2',
            '--orb-duration': '16s',
            '--orb-delay': '0s',
            width: '50%', height: '80%',
            top: '10%', left: '-10%',
            background: 'radial-gradient(ellipse, #5b21b6 0%, #2d0a52 50%, transparent 75%)',
          } as React.CSSProperties}
        />
        <div
          className="section-orb"
          style={{
            '--orb-opacity': '0.15',
            '--orb-duration': '13s',
            '--orb-delay': '4s',
            width: '45%', height: '70%',
            top: '5%', right: '-8%',
            background: 'radial-gradient(ellipse, #7c3aed 0%, #1a0533 50%, transparent 75%)',
          } as React.CSSProperties}
        />
        {/* Central arcane convergence point */}
        <div
          className="section-orb-pulse"
          style={{
            '--orb-opacity': '0.08',
            '--orb-duration': '9s',
            width: '40%', height: '40%',
            top: '30%', left: '30%',
            background: 'radial-gradient(circle, #f5d06e 0%, #7c3aed 40%, transparent 70%)',
          } as React.CSSProperties}
        />
        {/* Arcane grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian-200 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian-200 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <SectionHeader
            eyebrow="Section VI"
            heading="Enter"
            accent="the Archive"
            subtitle="Browse the hidden galleries, AI films, lore fragments, visual relics, experiments, and dimensional media artifacts of The Arcanum."
          />
        </motion.div>

        {/* Archive category grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {archiveCategories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Link
                href={`/archive/${cat.slug}`}
                className="group block p-4 rounded-xl border border-white/10 bg-obsidian-100/50 hover:border-gold/30 hover:bg-obsidian-100 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center mb-3 group-hover:border-gold/50 transition-colors">
                  <span className="text-gold/50 text-sm group-hover:text-gold-bright transition-colors">◈</span>
                </div>
                <h3 className="text-white/70 text-sm font-medium mb-1 group-hover:text-white transition-colors">{cat.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-4">
          <Link href="/archive" className="arcanum-btn-primary">Enter the Archive</Link>
          <Link href="/archive/vault" className="arcanum-btn-ghost">Explore the Vault</Link>
        </div>
      </div>
    </section>
  )
}
