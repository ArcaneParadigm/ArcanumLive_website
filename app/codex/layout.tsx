import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Codex — Arcanum Lore, Mythology & Sacred Archives',
  description: 'The Arcanum Codex — a living archive of mythic lore, sacred knowledge, dimensional records, and the hidden history of the MythMachine universe.',
  keywords: ['arcanum codex', 'mythic lore', 'sacred archives', 'arcane knowledge', 'dimensional records', 'mythology database', 'occult archive', 'sacred text', 'MythMachine lore'],
  openGraph: {
    title: 'The Codex — Arcanum.Live',
    description: 'Living archive of mythic lore, sacred knowledge, and dimensional records from the Arcanum universe.',
    url: 'https://arcanum.live/codex',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'The Codex — Arcanum.Live', description: 'Mythic lore, sacred archives, and dimensional records from the Arcanum universe.' },
  alternates: { canonical: 'https://arcanum.live/codex' },
}

export default function CodexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
