import { Metadata } from 'next'
import { discoverPageArt, discoverPageOverlay, discoverRealmCardImage } from '@/lib/utils/realmImages'
import { featuredWorlds } from '@/lib/data/worlds'
import Home2Nav from '@/components/home2/Home2Nav'
import Home2Hero from '@/components/home2/Home2Hero'
import Home2Content from '@/components/home2/Home2Content'

export const metadata: Metadata = {
  title: 'Arcanum.Live — Immersive Dome Shows, AI Films & 360 VR Cinema',
  description: 'Enter the MythMachine. Arcanum.Live is a cinematic universe of immersive dome shows, 360° VR films, AI-generated cinema, mythic worlds, and sacred media experiences.',
  keywords: ['immersive dome shows', 'AI films', '360 VR cinema', 'fulldome content', 'mythic worlds', 'Arcanum Live', 'Glenn Grillo', 'Arcane Paradigm', 'consciousness cinema', 'planetary shows'],
  openGraph: {
    title: 'Arcanum.Live — Enter the MythMachine',
    description: 'Immersive dome shows, 360° VR films, AI cinema, and mythic worlds from Arcane Paradigm.',
    url: 'https://arcanum.live',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630, alt: 'Arcanum.Live — Enter the MythMachine' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanum.Live — Enter the MythMachine',
    description: 'Immersive dome shows, 360° VR films, AI cinema, and mythic worlds.',
    images: ['/images/arcanum-portal-v1.jpg'],
  },
  alternates: { canonical: 'https://arcanum.live' },
}

// Experimental homepage — visit at localhost:3000/home2
// Drop hero art into: public/art/home2/   (any 16:9 JPGs cycle automatically)
// UI chrome overlay:  public/art/home2/ui-overlay.png  (screen blend — black = transparent)
// Realm card images:  public/realms/[slug]/card.jpg    (portrait 3:4)

export default function Home2Page() {
  const heroImages = discoverPageArt('home2', ['/images/arcanum-portal-v1.jpg'])
  const uiOverlay  = discoverPageOverlay('home2')

  const cardImages = Object.fromEntries(
    featuredWorlds
      .filter(w => w.slug)
      .map(w => [w.slug, discoverRealmCardImage(w.slug!)])
  ) as Record<string, string | null>

  return (
    <div className="w-full min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />
      <Home2Hero heroImages={heroImages} uiOverlay={uiOverlay} />
      <Home2Content worlds={featuredWorlds} cardImages={cardImages} />
    </div>
  )
}
