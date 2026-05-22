import Link from 'next/link'

const YEAR = new Date().getFullYear()

type FooterLinkItem = { label: string; href: string; external?: true }

function FooterLink({ link, hoverClass = 'hover:text-white/90' }: { link: FooterLinkItem; hoverClass?: string }) {
  const className = `text-white/50 ${hoverClass} text-sm transition-colors`
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
    { label: 'Worlds', href: '/worlds' },
    { label: 'Dome Shows', href: '/dome-shows' },
    { label: '360 Movies', href: '/films' },
    { label: 'Music', href: '/music' },
    { label: 'Archive', href: '/archive' },
    { label: 'Screensaver', href: '/screensaver' },
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
            <div className="mb-4">
              <span className="text-2xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-gold-dim via-gold-bright to-gold-dim">
                Arcanum
              </span>
              <span className="text-gold/40 text-2xl"> · </span>
              <span className="text-2xl font-light tracking-widest uppercase text-cyan-arcanum/60">
                Live
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
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
                  <Link href={link.href} className="text-white/50 hover:text-white/90 text-sm transition-colors">
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
          <p className="text-white/30 text-xs tracking-wider">
            © {YEAR} Arcanum Live · Arcane Realities
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors">
              Contact
            </Link>
            <Link href="/contact" className="text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors">
              Licensing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
