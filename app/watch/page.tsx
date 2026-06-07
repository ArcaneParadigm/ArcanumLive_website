import { Metadata } from 'next'
import { Suspense } from 'react'
import PageShell from '@/components/layout/PageShell'
import WatchHub from '@/components/watch/WatchHub'
import { allVideos, premieres } from '@/lib/data/videos'

export const metadata: Metadata = {
  title: 'Watch — Films, Trailers & Premieres | Arcanum.Live',
  description: 'Watch Arcanum.Live films, music videos, trailers, and world premieres — embedded and playable without leaving the page. AI cinema, dome show content, and immersive media.',
  keywords: ['watch arcanum films', 'arcanum video player', 'AI film premieres', 'dome show trailers', 'immersive media watch', 'Arcane Paradigm videos', 'watch 360 films online', 'mythology films online'],
  openGraph: {
    title: 'Watch — Arcanum.Live',
    description: 'Films, music videos, trailers, and premieres — play without leaving the page.',
    url: 'https://arcanum.live/watch',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Watch — Arcanum.Live', description: 'AI cinema, trailers, and premieres — play in the browser.' },
  alternates: { canonical: 'https://arcanum.live/watch' },
}

export default function WatchPage() {
  const featured = premieres[0] ?? allVideos[0]
  return (
    <PageShell>
      <Suspense fallback={null}>
        <WatchHub videos={allVideos} featuredVideo={featured} />
      </Suspense>
    </PageShell>
  )
}
