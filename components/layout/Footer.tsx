import Link from 'next/link'

const YEAR = new Date().getFullYear()

type FooterLinkItem = { label: string; href: string; external?: true }

function FooterLink({ link, hoverClass = 'hover:text-white/90' }: { link: FooterLinkItem; hoverClass?: string }) {
  const className = `text-white/80 ${hoverClass} text-sm transition-colors`
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label} ↗
      </a>
    )
  }
  return <Link href={link.href} className={className}>{link.label}</Link>
}

const footerLinks: Record<string, FooterLinkItem[]> = {
  explore: [
    { label: 'Realms', href: '/realms' },
    { label: 'Dome Shows', href: '/dome-shows' },
    { label: 'Watch', href: '/watch' },
    { label: 'Music', href: '/music' },
    { label: 'Ascension Chamber', href: '/ascension' },
    { label: 'Lore Archive', href: '/blog' },
    { label: 'Archive', href: '/archive' },
  ],
  work: [
    { label: 'Licensing', href: '/contact' },
    { label: 'Venue Inquiries', href: '/contact' },
    { label: 'Commissions', href: '/contact' },
    { label: 'ArcaneRealities.com', href: 'https://arcane-realities.com', external: true },
  ],
  store: [
    { label: 'TV Art', href: 'https://www.etsy.com/shop/ArcanumTvArt', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-obsidian-200 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-baseline gap-2">
              <span className="font-cinzel text-xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-gold-dim via-gold-bright to-gold-dim">
                Arcanum
              </span>
              <span className="text-gold/30 font-cinzel">·</span>
              <span
                className="font-cinzel text-lg italic tracking-[0.2em] uppercase"
                style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.6), 0 0 24px rgba(0,212,255,0.25)' }}
              >
                Live
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Enter the MythMachine. A cinematic universe of immersive dome shows, 360 movies, AI films, and mythic worlds.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-gold-bright text-xs tracking-widest uppercase mb-4 font-medium">
              Enter the Arcanum
            </h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work */}
          <div>
            <h3 className="text-gold-bright text-xs tracking-widest uppercase mb-4 font-medium">
              Work with Us
            </h3>
            <ul className="space-y-2">
              {footerLinks.work.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          {/* Store */}
          <div>
            <h3 className="text-gold-bright text-xs tracking-widest uppercase mb-4 font-medium">
              TV Art
            </h3>
            <ul className="space-y-2">
              {footerLinks.store.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} hoverClass="hover:text-gold-bright" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/80 text-xs tracking-wider">
            © {YEAR} Arcanum Live · Arcane Realities
          </p>
          <div className="flex items-center gap-5">
            {/* Instagram — Arcane Paradigm */}
            <a href="https://www.instagram.com/arcaneparadigm/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/50 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* YouTube — EthiVerse 360 */}
            <a href="https://www.youtube.com/@ArcaneRealities360" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/50 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* X — HoneyVerse Girls */}
            <a href="https://x.com/HoneyVerseGirls" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-white/50 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Facebook — Arcane Paradigm */}
            <a href="https://www.facebook.com/ArcaneParadigm" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/50 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <Link href="/contact" className="text-white/80 hover:text-white text-xs tracking-wider transition-colors">Contact</Link>
            <Link href="/contact" className="text-white/80 hover:text-white text-xs tracking-wider transition-colors">Licensing</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
