'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { flyInLeft, flyInRight, fadeUp, viewport } from '@/lib/utils/motionVariants'

interface PanelProps {
  title: string
  subtitle?: string
  description: string
  buttons: { label: string; href: string; primary?: boolean }[]
  image?: string
  accent: string
  variants: typeof flyInLeft
}

function SectionPanel({ title, subtitle, description, buttons, image, accent, variants }: PanelProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="relative flex-1 rounded-2xl overflow-hidden border"
      style={{
        borderColor: `${accent}30`,
        background: 'linear-gradient(135deg, rgba(12,9,20,0.96) 0%, rgba(7,5,15,0.98) 100%)',
        boxShadow: `0 0 40px ${accent}10`,
      }}
    >
      {/* Subtle corner glow */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)` }} />

      <div className="flex gap-4 p-6 md:p-8">
        {/* Text side */}
        <div className="flex-1 min-w-0">
          {subtitle && (
            <p className="text-[9px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: `${accent}90` }}>
              {subtitle}
            </p>
          )}
          <h2
            className="font-cinzel text-xl md:text-2xl font-bold tracking-wide leading-tight mb-3"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, #f5d06e 50%, ${accent} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {title}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-5">{description}</p>

          <div className="flex flex-col gap-2">
            {buttons.map((btn) => (
              <Link key={btn.label} href={btn.href}>
                <motion.div
                  className="inline-flex items-center px-5 py-2 rounded-lg border text-xs font-medium tracking-widest uppercase transition-colors"
                  style={{
                    borderColor: btn.primary ? accent : `${accent}40`,
                    background: btn.primary ? `${accent}18` : 'transparent',
                    color: btn.primary ? accent : `${accent}80`,
                  }}
                  whileHover={{
                    borderColor: accent,
                    background: `${accent}25`,
                    color: accent,
                    boxShadow: `0 0 16px ${accent}30`,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {btn.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Image side */}
        {image && (
          <div className="w-32 md:w-44 shrink-0 rounded-xl overflow-hidden border" style={{ borderColor: `${accent}20` }}>
            <div className="relative w-full h-full" style={{ minHeight: 160 }}>
              <Image src={image} alt={title} fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}30, transparent)` }} />
            </div>
          </div>
        )}
        {/* Placeholder if no image */}
        {!image && (
          <div
            className="w-32 md:w-44 shrink-0 rounded-xl border flex items-center justify-center"
            style={{ minHeight: 160, borderColor: `${accent}20`, background: `${accent}08` }}
          >
            <p className="text-[9px] tracking-widest uppercase text-center leading-relaxed px-2" style={{ color: `${accent}40` }}>
              Drop image<br />in art folder
            </p>
          </div>
        )}
      </div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
    </motion.div>
  )
}

interface Home2DomeSectionProps {
  domeImage?: string
  moviesImage?: string
}

export default function Home2DomeSection({ domeImage, moviesImage }: Home2DomeSectionProps) {
  return (
    <section className="relative px-4 md:px-8 py-16" style={{ background: '#08060e' }}>
      {/* Section divider top */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}
        className="flex items-center gap-4 mb-10 max-w-7xl mx-auto"
      >
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.4))' }} />
        <span className="text-[9px] tracking-[0.5em] uppercase font-cinzel text-gold/50">The Arcanum</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,151,58,0.4), transparent)' }} />
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto">
        <SectionPanel
          title="Immersive Dome Shows"
          subtitle="Cinematic Fulldome"
          description="Cinematic journeys for domes and planetariums. Full-resolution immersive content for venues, festivals, and next-generation projection environments."
          buttons={[
            { label: 'Watch Dome Shows', href: '/dome-shows', primary: true },
            { label: 'License Dome Content', href: '/contact' },
          ]}
          image={domeImage}
          accent="#c9973a"
          variants={flyInLeft}
        />
        <SectionPanel
          title="Rent 360 Movies for VR Headsets"
          subtitle="360° Streaming"
          description="Step inside epic stories. Anytime, anywhere. Stream directly to your VR headset and experience cinematic worlds from the inside."
          buttons={[
            { label: 'Browse 360 Movies', href: '/watch', primary: true },
            { label: 'How to Watch in VR', href: '/watch#vr-guide' },
          ]}
          image={moviesImage}
          accent="#a855f7"
          variants={flyInRight}
        />
      </div>
    </section>
  )
}
