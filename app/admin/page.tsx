import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Admin Dashboard' }

const adminSections = [
  { title: 'Worlds', href: '/admin/worlds', desc: 'Add and edit IP worlds', icon: '✦' },
  { title: 'Media', href: '/admin/media', desc: 'Upload images, videos, audio', icon: '⬡' },
  { title: 'Playlists', href: '/admin/playlists', desc: 'Create and manage playlists', icon: '◉' },
  { title: 'Albums', href: '/admin/albums', desc: 'Manage music albums', icon: '♫' },
  { title: 'Screensaver Presets', href: '/admin/screensaver-presets', desc: 'Create screensaver presets', icon: '◈' },
  { title: 'Films', href: '/admin/films', desc: 'Add Vimeo On Demand films', icon: '▶' },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-obsidian-200 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Arcanum Admin</h1>
            <p className="text-white/40 text-sm mt-1">Content management dashboard</p>
          </div>
          <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">← Back to site</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group p-5 rounded-xl border border-white/10 bg-obsidian-100 hover:border-gold/30 transition-all duration-200"
            >
              <div className="text-2xl text-gold/40 mb-3 group-hover:text-gold-bright transition-colors">{section.icon}</div>
              <h3 className="text-white font-semibold mb-1">{section.title}</h3>
              <p className="text-white/30 text-xs">{section.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl border border-white/5 bg-obsidian-100 text-center">
          <p className="text-white/25 text-xs">
            Admin authentication will be added in Phase 2 via Supabase Auth
          </p>
        </div>
      </div>
    </div>
  )
}
