import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'License the Worlds · Work With Us',
  description: 'Book immersive content, dome shows, custom visuals, AI cinema, and projection-mapped experiences for venues and events.',
}

export default function ContactPage() {
  return (
    <PageShell>
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
    </PageShell>
  )
}
