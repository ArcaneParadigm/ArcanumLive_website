import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import FilmCard from '@/components/cards/FilmCard'
import { featuredFilms } from '@/lib/data/seed'

export const metadata: Metadata = {
  title: 'Rent 360 Movies for VR Headsets',
  description: 'Watch immersive 360 films through Vimeo On Demand. Step inside cinematic worlds for Meta Quest, Apple Vision Pro, and VR headsets.',
}

export default function FilmsPage() {
  return (
    <PageShell>
      <div className="pt-6 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">Vimeo On Demand</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Rent 360 Movies<br /><span className="text-gold-gradient">for VR Headsets</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/50 text-base leading-relaxed">
              Watch immersive 360 films and step inside cinematic worlds built for VR headsets, spatial screens, and future media temples.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {featuredFilms.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>

          {/* How to watch section */}
          <div id="how-to-watch" className="border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold text-white mb-4">How to Watch in VR</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Rent on Vimeo', desc: 'Click any film and rent through Vimeo On Demand. Works on all devices.' },
                { step: '02', title: 'Open Vimeo App', desc: 'Download the Vimeo app on your Meta Quest, Apple Vision Pro, or PSVR2.' },
                { step: '03', title: 'Watch in 360°', desc: 'Open your rental inside the VR app and step into the cinematic world.' },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-xl border border-white/10 bg-obsidian-100">
                  <p className="text-gold/40 text-3xl font-bold mb-3">{item.step}</p>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
