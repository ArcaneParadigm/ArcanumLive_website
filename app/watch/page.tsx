import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import WatchHub from '@/components/watch/WatchHub'
import { allVideos, premieres } from '@/lib/data/videos'

export const metadata: Metadata = {
  title: 'Watch · The Arcanum',
  description:
    'Films, music videos, trailers, and premieres — embedded and playable without leaving the page.',
}

export default function WatchPage() {
  const featured = premieres[0] ?? allVideos[0]
  return (
    <PageShell>
      <WatchHub videos={allVideos} featuredVideo={featured} />
    </PageShell>
  )
}
