import type { Metadata, Viewport } from 'next'
import { Cinzel, Raleway } from 'next/font/google'
import './globals.css'
import DevControls from '@/components/admin/DevControls'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://arcanum.live'),
  title: {
    default: 'Arcanum.Live — Immersive Dome Shows, AI Films & 360 VR Cinema',
    template: '%s | Arcanum.Live',
  },
  description:
    'Arcanum.Live — immersive dome shows, 360 VR films, AI cinema, mythic worlds, fulldome content licensing, and sacred media experiences for planetariums, festivals, and VR headsets.',
  keywords: [
    'immersive dome shows',
    'fulldome content licensing',
    '360 VR films',
    'AI cinema',
    'AI films',
    'VR movies Meta Quest',
    '360 movies Apple Vision Pro',
    'planetarium films',
    'dome theater content',
    'immersive media studio',
    'AI fantasy cinema',
    'rent 360 movies VR',
    'mythic worlds',
    'Arcanum Live',
    'Glenn Grillo',
    'Arcane Paradigm',
    'fulldome festival films',
    'immersive experience licensing',
    'consciousness cinema',
    'sacred geometry films',
  ],
  authors: [{ name: 'Glenn Grillo', url: 'https://arcanum.live' }],
  creator: 'Glenn Grillo / Arcane Paradigm',
  publisher: 'Arcanum.Live',
  openGraph: {
    title: 'Arcanum.Live — Immersive Dome Shows, AI Films & 360 VR Cinema',
    description:
      'Immersive dome shows, 360 VR films, AI cinema, mythic worlds, and fulldome content for planetariums, festivals, and VR headsets.',
    url: 'https://arcanum.live',
    siteName: 'Arcanum.Live',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/arcanum-portal-v1.jpg',
        width: 1200,
        height: 630,
        alt: 'Arcanum.Live — Enter the MythMachine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanum.Live — Immersive Dome Shows, AI Films & 360 VR Cinema',
    description: 'Immersive dome shows, 360 VR films, AI cinema, mythic worlds, and fulldome content for planetariums, festivals, and VR headsets.',
    images: ['/images/arcanum-portal-v1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://arcanum.live',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable}`}>
      <body>
        {children}
        <DevControls />
      </body>
    </html>
  )
}
