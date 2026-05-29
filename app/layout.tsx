import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: {
    default: 'Arcanum.Live — Enter the MythMachine',
    template: '%s | Arcanum.Live',
  },
  description:
    'A cinematic universe of immersive dome shows, 360 movies, AI films, mythic worlds, sacred media systems, and dimensional archives.',
  keywords: [
    'Rent 360 Movies for VR Headsets',
    '360 VR Films',
    'Immersive Dome Shows',
    'Fulldome Content Licensing',
    'AI Cinematic Experiences',
    'VR Movies for Meta Quest',
    '360 Movies for Apple Vision Pro',
    'Immersive Media Studio',
    'Dome Films for Planetariums',
    'AI Fantasy Cinema',
  ],
  openGraph: {
    title: 'Arcanum.Live — Enter the MythMachine',
    description:
      'Immersive dome shows, 360 films, mythic worlds, AI cinema, and living media portals.',
    url: 'https://arcanum.live',
    siteName: 'Arcanum.Live',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanum.Live — Enter the MythMachine',
    description: 'Immersive dome shows, 360 films, mythic worlds, AI cinema, and living media portals.',
  },
  robots: {
    index: true,
    follow: true,
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
