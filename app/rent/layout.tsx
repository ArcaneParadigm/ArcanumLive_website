import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rent VR Films — Stream 360° Movies on Any Headset',
  description: 'Rent immersive 360° VR films from Arcanum.Live. Stream on Meta Quest, Apple Vision Pro, Oculus, and all major VR platforms. Instant access to premium fulldome and spatial cinema.',
  keywords: ['rent VR films', 'rent 360 movies', 'stream VR movies', 'download 360 video', 'Meta Quest rentals', 'Apple Vision Pro movies', 'immersive film rental', 'VR cinema on demand', '360 video streaming', 'fulldome rental'],
  openGraph: {
    title: 'Rent VR Films — Arcanum.Live',
    description: 'Stream 360° VR films on Meta Quest, Apple Vision Pro, and all major headsets.',
    url: 'https://arcanum.live/rent',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Rent VR Films — Arcanum.Live', description: 'Stream 360° VR films on Meta Quest, Apple Vision Pro, and major VR headsets.' },
  alternates: { canonical: 'https://arcanum.live/rent' },
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
