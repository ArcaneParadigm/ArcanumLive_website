import { Metadata } from 'next'
import Home2Nav from '@/components/home2/Home2Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact — License Dome Shows, AI Films & Immersive Media',
  description: 'Book or license immersive dome shows, 360° films, AI cinema, custom visuals, and projection-mapped experiences from Arcanum.Live for venues, festivals, and events worldwide.',
  keywords: ['book dome show', 'license fulldome content', 'hire AI film studio', 'immersive media licensing', 'dome show booking', 'projection mapping hire', '360 film licensing', 'Arcane Paradigm contact', 'Glenn Grillo booking'],
  openGraph: {
    title: 'Contact — License Dome Shows & AI Films | Arcanum.Live',
    description: 'Book dome shows, license 360° films, AI cinema, and immersive media from Arcanum.Live for venues and events.',
    url: 'https://arcanum.live/contact',
    type: 'website',
    images: [{ url: '/images/arcanum-portal-v1.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Contact — Arcanum.Live', description: 'Book dome shows, license AI cinema and immersive media from Arcanum.Live.' },
  alternates: { canonical: 'https://arcanum.live/contact' },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-obsidian-200 text-white">
      <Home2Nav />
      <div className="pt-6 pb-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">Arcane Realities</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              License <span className="text-gold-gradient">the Worlds</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              Book immersive content, dome shows, custom visuals, AI cinema, projection-mapped experiences, and mythic media worlds for venues and events.
            </p>
          </div>

          <form className="space-y-5 bg-obsidian-100 border border-white/10 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/50 text-xs tracking-wider uppercase mb-2">Name</label>
                <input type="text" className="w-full bg-obsidian-200 border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-gold/40 transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-wider uppercase mb-2">Email</label>
                <input type="email" className="w-full bg-obsidian-200 border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-gold/40 transition-colors" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs tracking-wider uppercase mb-2">Organization</label>
              <input type="text" className="w-full bg-obsidian-200 border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-gold/40 transition-colors" placeholder="Venue, company, or project" />
            </div>

            <div>
              <label className="block text-white/50 text-xs tracking-wider uppercase mb-2">Interested in</label>
              <div className="flex flex-wrap gap-2">
                {['Dome Shows', '360 Films', 'Custom Visuals', 'Licensing', 'Collaboration', 'Other'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="accent-gold" />
                    <span className="text-white/50 text-sm group-hover:text-white/80 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs tracking-wider uppercase mb-2">Message</label>
              <textarea rows={5} className="w-full bg-obsidian-200 border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none" placeholder="Describe your project, venue, or inquiry..." />
            </div>

            <button type="submit" className="w-full arcanum-btn-primary justify-center text-base py-4">
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
