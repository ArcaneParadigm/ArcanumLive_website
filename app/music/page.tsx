import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import MusicPageClient from '@/components/music/MusicPageClient'

export const metadata: Metadata = {
  title: 'Music — Sonic Realms & Mythic Soundscapes | Arcanum.Live',
  description: 'Explore music worlds built for goddesses, tricksters, cyber shamans, cosmic portals, Burning Man nights, and cinematic myth machines. AI-enhanced soundscapes from Arcane Paradigm.',
  keywords: ['arcanum music', 'mythic soundscapes', 'AI music', 'cosmic music', 'cyber shamanic music', 'Burning Man music', 'Glenn Grillo music', 'dimensional music', 'sacred frequencies music', 'Arcane Paradigm music'],
  openGraph: {
    title: 'Music — Sonic Realms | Arcanum.Live',
    description: 'Music worlds for goddesses, tricksters, cyber shamans, and cosmic dreamers from Arcane Paradigm.',
    url: 'https://arcanum.live/music',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Music — Sonic Realms | Arcanum.Live', description: 'Mythic soundscapes for goddesses, cyber shamans, and cosmic portals from Arcane Paradigm.' },
  alternates: { canonical: 'https://arcanum.live/music' },
}

export default function MusicPage() {
  return (
    <PageShell>
      <MusicPageClient />
    </PageShell>
  )
}
