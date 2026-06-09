import { Metadata } from 'next'
import BlogHub from '@/components/blog/BlogHub'
import PageShell from '@/components/layout/PageShell'
import { blogPosts } from '@/lib/data/blog'
import { discoverRealmCardImage } from '@/lib/utils/realmMeta'

export const metadata: Metadata = {
  title: 'Lore Archive — Mythic Dispatches, Gnosis & Esoteric Writing',
  description: 'Deep lore, esoteric essays, character profiles, and mythic dispatches from across the Arcanum realms. Shadow studies, consciousness, gnosis, sacred geometry, and dimensional history.',
  keywords: ['arcanum lore', 'esoteric blog', 'gnosis articles', 'consciousness writing', 'mythic dispatches', 'shadow studies', 'sacred geometry blog', 'archons', 'dimensional history', 'occult essays', 'AI mythology blog'],
  openGraph: {
    title: 'Lore Archive — Arcanum.Live',
    description: 'Deep lore, esoteric essays, and mythic dispatches from the Arcanum realms.',
    url: 'https://arcanum.live/blog',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Lore Archive — Arcanum.Live', description: 'Deep lore, gnosis, and mythic dispatches from across the Arcanum realms.' },
  alternates: { canonical: 'https://arcanum.live/blog' },
}

export default function BlogPage() {
  // Build card image map for every post's realm
  const cardImages: Record<string, string | null> = {}
  for (const post of blogPosts) {
    if (!cardImages[post.realmSlug]) {
      cardImages[post.realmSlug] = discoverRealmCardImage(post.realmSlug)
    }
  }

  return (
    <PageShell noHeader>
      <BlogHub posts={blogPosts} cardImages={cardImages} />
    </PageShell>
  )
}
