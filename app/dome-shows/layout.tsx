import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dome Shows — Fulldome Cinema & Immersive Experiences',
  description: 'Arcanum.Live dome shows: fulldome films, 360° cinema, and immersive planetarium content for festivals, venues, and dome theaters worldwide. License or book now.',
  keywords: ['dome shows', 'fulldome films', 'planetarium content', 'immersive dome theater', '360 cinema', 'fulldome licensing', 'dome festival films', 'immersive projection mapping'],
  openGraph: {
    title: 'Dome Shows — Arcanum.Live',
    description: 'Fulldome films and 360° immersive cinema for planetariums, festivals, and dome theaters worldwide.',
    url: 'https://arcanum.live/dome-shows',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Dome Shows — Arcanum.Live', description: 'Fulldome films and 360° cinema for planetariums, festivals, and dome theaters.' },
  alternates: { canonical: 'https://arcanum.live/dome-shows' },
}

export default function DomeShowsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
