import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Channels — Follow Arcanum on YouTube, Rumble & Social Media',
  description: 'Follow Arcanum.Live across YouTube, Rumble, and social media. AI films, dome show content, mythic worlds, and immersive cinema — updated regularly.',
  keywords: ['Arcanum YouTube channel', 'Arcane Paradigm YouTube', 'AI film channel', 'Glenn Grillo YouTube', 'immersive media channel', 'dome show YouTube', 'consciousness cinema channel', 'Rumble AI films'],
  openGraph: {
    title: 'Channels — Arcanum.Live',
    description: 'Follow Arcanum.Live on YouTube, Rumble, and social — AI films, dome shows, and mythic worlds.',
    url: 'https://arcanum.live/channels',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Channels — Arcanum.Live', description: 'Follow Arcanum.Live on YouTube, Rumble, and social media.' },
  alternates: { canonical: 'https://arcanum.live/channels' },
}

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
