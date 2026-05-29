import { Metadata } from 'next'
import BlogHub from '@/components/blog/BlogHub'
import PageShell from '@/components/layout/PageShell'
import { blogPosts } from '@/lib/data/blog'
import { discoverRealmCardImage } from '@/lib/utils/realmImages'

export const metadata: Metadata = {
  title: 'Lore Archive · The Arcanum',
  description: 'Deep lore, character profiles, and mythic dispatches from across the realms of The Arcanum.',
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
