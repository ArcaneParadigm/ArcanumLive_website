import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Store — Arcanum Merchandise & Digital Products',
  description: 'Shop Arcanum.Live — mythic apparel, digital downloads, immersive media products, and exclusive collectibles from the Arcane Paradigm universe.',
  keywords: ['Arcanum store', 'Arcane Paradigm merchandise', 'mythic apparel', 'immersive media products', 'consciousness merch', 'AI art prints', 'dome show merchandise', 'Glenn Grillo store'],
  openGraph: {
    title: 'Store — Arcanum.Live',
    description: 'Mythic merchandise, digital downloads, and exclusive products from the Arcane Paradigm universe.',
    url: 'https://arcanum.live/store',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Store — Arcanum.Live', description: 'Mythic merchandise and digital products from Arcane Paradigm.' },
  alternates: { canonical: 'https://arcanum.live/store' },
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
