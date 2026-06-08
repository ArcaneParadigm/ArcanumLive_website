'use client'

import { useState } from 'react'
import GallerySystem, { type GalleryImage } from '@/components/ui/GallerySystem'
import GlassButton from '@/components/ui/GlassButton'

interface Props {
  images: GalleryImage[]
  accentColor: string
  label: string
}

export default function RealmGallerySection({ images, accentColor, label }: Props) {
  const [openAt, setOpenAt] = useState<number | undefined>(undefined)

  return (
    <>
      <section id="realm-gallery" className="relative overflow-hidden" style={{ background: '#08060e' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(160deg, ${accentColor}12 0%, transparent 50%, ${accentColor}08 100%)` }}
        />
        <GallerySystem
          images={images}
          accentColor={accentColor}
          aspectRatio="21/9"
          label={label}
          fullWidth
          kenBurns
          openLightboxAt={openAt}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #08060e, transparent)' }}
        />
      </section>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 py-5" style={{ background: '#08060e' }}>
        <GlassButton href="/ascension" variant="gold">Ascension Chamber</GlassButton>
        <GlassButton href="/dome-shows" variant="silver">Dome Shows</GlassButton>
        <button
          onClick={() => setOpenAt(0)}
          className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl overflow-hidden text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-300"
          style={{ color: '#c0c8d0' }}
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'rgba(6,4,10,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(192,200,208,0.2)',
            }}
          />
          <span className="relative z-10">View Gallery</span>
        </button>
      </div>
    </>
  )
}
