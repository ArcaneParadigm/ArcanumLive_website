import { Metadata } from 'next'
import PageShell from '@/components/layout/PageShell'
import ScreensaverPresetCard from '@/components/cards/ScreensaverPresetCard'
import { screensaverModes, featuredScreensaverPresets } from '@/lib/data/seed'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ascension Chamber · The Arcanum',
  description: 'Choose a world, select a soundtrack, and let The Arcanum become a fullscreen ambient visualizer.',
}

export default function ScreensaverPage() {
  return (
    <PageShell>
      <div className="pt-16 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-block text-[8px] font-medium tracking-[0.35em] uppercase px-2 py-0.5 rounded mb-3" style={{ background: '#000', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.28)' }}>Living Visualizer</span>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold mb-3 tracking-widest" style={{ color: '#00d4ff', textShadow: '0 0 16px rgba(0,212,255,0.5)' }}>
              The Ascension Chamber
            </h1>
            <p className="max-w-xl mx-auto text-white/50 text-base leading-relaxed">
              Choose a realm, select a soundtrack, and let The Arcanum become a fullscreen ambient visualizer of animated art, music-reactive particles, videos, and cinematic motion.
            </p>
          </div>

          {/* Visual modes */}
          <div className="mb-6">
            <h2 className="text-white/60 text-xs tracking-widest uppercase mb-4 text-center">Visual Modes</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {screensaverModes.map((mode) => (
                <Link
                  key={mode.href}
                  href={mode.href}
                  className="group p-4 rounded-xl border border-white/10 bg-obsidian-100 hover:border-cyan-arcanum/40 transition-all duration-300 text-center"
                >
                  <div className="text-cyan-arcanum/40 text-2xl mb-2 group-hover:text-cyan-arcanum transition-colors">◉</div>
                  <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{mode.title}</p>
                  <p className="text-white/30 text-xs mt-1 leading-relaxed">{mode.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <h2 className="text-white/60 text-xs tracking-widest uppercase mb-4 text-center">Launch Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredScreensaverPresets.map((preset) => (
                <ScreensaverPresetCard key={preset.id} preset={preset} />
              ))}
            </div>
          </div>

          {/* Performance note */}
          <div className="mt-8 p-4 rounded-xl border border-white/5 bg-obsidian-100 text-center">
            <p className="text-white/30 text-xs">
              Performance settings: Low · Medium · High · Ultra — adjust in Ascension Chamber controls
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
