import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'

export const metadata: Metadata = {
  title: 'Store · The Arcanum',
  description: 'Bring the visual worlds of The Arcanum into your home, studio, altar, screen, or creative space.',
}

const platforms = [
  {
    name: 'Etsy',
    label: 'Arcanum TV Art',
    desc: 'Cinematic art prints, digital downloads, and ambient TV art for sacred spaces and digital frames.',
    href: 'https://www.etsy.com/shop/ArcanumTvArt',
    icon: '◈',
    color: '#c9973a',
    tag: 'Prints · TV Art · Downloads',
    cta: 'Shop on Etsy ↗',
  },
  {
    name: 'Fine Art America',
    label: 'Fine Art America',
    desc: 'Museum-quality prints, canvas wraps, metal prints, and framed art shipped worldwide.',
    href: 'https://fineartamerica.com',
    icon: '◉',
    color: '#8a9aaa',
    tag: 'Canvas · Metal · Framed Prints',
    cta: 'Shop Fine Art ↗',
  },
  {
    name: 'Amazon',
    label: 'Amazon Store',
    desc: 'Apparel, home décor, and Arcanum merchandise available for Prime delivery.',
    href: 'https://amazon.com',
    icon: '✦',
    color: '#f5d06e',
    tag: 'Apparel · Décor · Merchandise',
    cta: 'Shop on Amazon ↗',
  },
  {
    name: 'Gumroad',
    label: 'Digital Downloads',
    desc: 'Instant download screensavers, ambient visualizers, vibe-coded apps, and creative tools.',
    href: 'https://gumroad.com',
    icon: '⬡',
    color: '#00d4ff',
    tag: 'Screensavers · Apps · Tools',
    cta: 'Get Digital Goods ↗',
  },
  {
    name: 'Printify',
    label: 'Printify Store',
    desc: 'On-demand apparel, posters, and lifestyle products featuring Arcanum AI artwork.',
    href: 'https://printify.com',
    icon: '◫',
    color: '#a78bfa',
    tag: 'Apparel · Posters · On-Demand',
    cta: 'Shop Printify ↗',
  },
]

export default function StorePage() {
  return (
    <PageShell>
      <div className="pt-6 pb-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-5">
            <span className="inline-block text-[8px] font-medium tracking-[0.35em] uppercase px-2 py-0.5 rounded mb-3" style={{ background: '#000', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.28)' }}>The Arcanum</span>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold mb-3 tracking-widest block" style={{ background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Sacred Products
            </h1>
            <p className="max-w-xl mx-auto text-silver-mid/60 text-xs leading-relaxed">
              Bring the visual worlds of The Arcanum into your home, studio, altar, screen, or creative space.
            </p>
          </div>

          {/* Platform grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl border border-white/8 bg-obsidian-100/50 backdrop-blur-sm hover:bg-obsidian-100/70 transition-all duration-500 overflow-hidden p-6"
              >
                {/* Hover ambient glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${p.color}18 0%, transparent 70%)` }}
                />
                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${p.color}40, 0 0 24px ${p.color}18` }}
                />

                {/* Icon */}
                <div
                  className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block"
                  style={{
                    color: p.color,
                    filter: `drop-shadow(0 0 8px ${p.color}60)`,
                  }}
                >
                  {p.icon}
                </div>

                {/* Tag pill */}
                <div className="mb-3">
                  <span
                    className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
                    style={{ color: `${p.color}90`, borderColor: `${p.color}30`, background: `${p.color}0e` }}
                  >
                    {p.tag}
                  </span>
                </div>

                {/* Name + desc */}
                <h3 className="font-cinzel text-white/90 text-lg tracking-wide mb-2 group-hover:text-white transition-colors">
                  {p.label}
                </h3>
                <p className="text-silver-mid/50 text-sm leading-relaxed mb-5">
                  {p.desc}
                </p>

                {/* CTA */}
                <span
                  className="text-xs tracking-widest uppercase font-semibold transition-all duration-300 group-hover:tracking-[0.2em]"
                  style={{ color: p.color }}
                >
                  {p.cta}
                </span>
              </a>
            ))}
          </div>

          {/* Category legend */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Physical Art',
                desc: 'Museum-grade prints, canvas, metal, and framed pieces from Etsy and Fine Art America.',
                icon: '◈',
              },
              {
                title: 'Digital Goods',
                desc: 'Screensavers, ambient apps, AI visualizers, and vibe-coded tools — instant download via Gumroad.',
                icon: '◉',
              },
              {
                title: 'Apparel & Merch',
                desc: 'Arcanum-branded clothing, posters, and lifestyle goods via Amazon and Printify.',
                icon: '✦',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-gold/10 bg-obsidian-100/30"
              >
                <div className="text-gold/50 text-xl mb-2">{item.icon}</div>
                <h3 className="text-gold-bright/80 font-semibold text-sm mb-1.5 tracking-wide">{item.title}</h3>
                <p className="text-silver-mid/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PageShell>
  )
}
