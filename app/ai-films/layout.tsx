import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Films — AI-Generated Cinema & Visual Storytelling',
  description: 'Watch AI-generated films by Glenn Grillo / Arcane Paradigm. Mythic worlds, sci-fi epics, sacred geometry visuals, and boundary-pushing AI cinema from Arcanum.Live.',
  keywords: ['AI films', 'AI generated movies', 'AI cinema', 'AI video art', 'AI storytelling', 'generative AI film', 'AI fantasy movies', 'Glenn Grillo films', 'Arcane Paradigm', 'AI visual art', 'Sora AI film', 'Kling AI video', 'Singularity film', 'AI mythology'],
  openGraph: {
    title: 'AI Films — AI-Generated Cinema | Arcanum.Live',
    description: 'Mythic worlds, sci-fi epics, and boundary-pushing AI-generated cinema from Glenn Grillo / Arcane Paradigm.',
    url: 'https://arcanum.live/ai-films',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AI Films | Arcanum.Live', description: 'AI-generated cinema — mythic worlds, sci-fi epics, sacred visuals from Arcane Paradigm.' },
  alternates: { canonical: 'https://arcanum.live/ai-films' },
}

export default function AiFilmsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
