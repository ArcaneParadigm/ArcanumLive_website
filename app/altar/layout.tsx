import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Altar — Sacred Frequencies & Dimensional Portal',
  description: 'Enter the Altar at Arcanum.Live — a sacred media space of frequencies, dimensional portals, and consciousness-expanding visual experiences.',
  keywords: ['sacred frequencies', 'dimensional portal', 'consciousness media', 'sacred geometry experience', 'meditation visuals', 'arcanum altar', 'sacred media', 'dimensional audio'],
  openGraph: {
    title: 'The Altar — Arcanum.Live',
    description: 'A sacred space of frequencies, dimensional portals, and consciousness-expanding experiences.',
    url: 'https://arcanum.live/altar',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'The Altar — Arcanum.Live', description: 'Sacred frequencies, dimensional portals, and consciousness media.' },
  alternates: { canonical: 'https://arcanum.live/altar' },
}

export default function AltarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
