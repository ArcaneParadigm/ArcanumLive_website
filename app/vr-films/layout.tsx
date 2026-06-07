import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VR Films — 360° Movies for Meta Quest & Apple Vision Pro',
  description: 'Rent and stream premium 360° VR films from Arcanum.Live. Immersive cinematic experiences optimized for Meta Quest, Apple Vision Pro, and all major VR headsets.',
  keywords: ['360 VR films', 'rent VR movies', 'Meta Quest movies', 'Apple Vision Pro 360', '360 degree films', 'immersive VR cinema', 'VR movie streaming', 'spatial video', '360 video download', 'VR headset movies'],
  openGraph: {
    title: 'VR Films — 360° Cinema | Arcanum.Live',
    description: 'Rent premium 360° VR films — optimized for Meta Quest, Apple Vision Pro, and all major VR headsets.',
    url: 'https://arcanum.live/vr-films',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'VR Films — 360° Cinema | Arcanum.Live', description: 'Rent premium 360° VR films for Meta Quest, Apple Vision Pro, and all VR headsets.' },
  alternates: { canonical: 'https://arcanum.live/vr-films' },
}

export default function VrFilmsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
