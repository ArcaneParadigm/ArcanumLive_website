import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VR Play — Watch 360° Films in Your Browser or Headset',
  description: 'Play 360° immersive films directly in your browser or VR headset at Arcanum.Live. No app required — stream spatial video instantly on Meta Quest, Apple Vision Pro, and WebXR.',
  keywords: ['play 360 VR film', 'WebXR player', 'browser VR video', '360 video player', 'Meta Quest browser VR', 'Apple Vision Pro stream', 'immersive video play', 'VR film player online'],
  openGraph: {
    title: 'VR Play — Arcanum.Live',
    description: 'Play 360° immersive films in your browser or VR headset — no app required.',
    url: 'https://arcanum.live/vr-play',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'VR Play — Arcanum.Live', description: 'Stream 360° immersive films instantly in your browser or VR headset.' },
  alternates: { canonical: 'https://arcanum.live/vr-play' },
}

export default function VrPlayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
