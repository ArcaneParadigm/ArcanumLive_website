'use client'

import { useState } from 'react'
import RealmsPlayer from '@/components/realms/RealmsPlayer'
import RealmsPortraitGrid from '@/components/realms/RealmsPortraitGrid'
import type { IpWorld } from '@/types'
import type { DiscoveredTrack } from '@/components/realms/RealmsPlayer'

interface DiscoveredAudioTrack {
  id: string
  title: string
  url: string
}

interface Props {
  worlds: Partial<IpWorld>[]
  cardImages: Record<string, string | null>
  galleryImages: Record<string, string[]>
  audioMap: Record<string, DiscoveredAudioTrack[]>
  sequenceMap: Record<string, string[]>
}

export default function RealmsPageHub({ worlds, cardImages, galleryImages, audioMap, sequenceMap }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined)

  return (
    <>
      <RealmsPlayer
        audioMap={audioMap}
        sequenceMap={sequenceMap}
        imageMap={galleryImages}
        activeSlug={activeSlug}
      />
      <RealmsPortraitGrid
        worlds={worlds}
        cardImages={cardImages}
        galleryImages={galleryImages}
        onActivate={(slug) => {
          setActiveSlug(slug)
          document.getElementById('realms-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />
    </>
  )
}
