'use client'

import { motion } from 'framer-motion'
import Home2Nav from '@/components/home2/Home2Nav'

const GOLD = '#c9973a'
const VIOLET = '#a855f7'

export default function ArchitectureOfControlArticle() {
  return (
    <div className="min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-4">
            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: VIOLET }}>
              Essay
            </p>
          </div>
          <h1
            className="font-cinzel text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{
              background: `linear-gradient(135deg, #6b4411 0%, ${GOLD} 22%, #f5d06e 50%, ${GOLD} 78%, #6b4411 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Architecture of Control and the Hijacking of Spiritual Pathways
          </h1>
          <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            By Glenn Grillo working with Deepseek AI
          </p>
        </motion.div>

        {/* Dual View Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-cinzel text-2xl font-bold mb-6" style={{ color: '#e8dcc8' }}>
            Article Display
          </h2>

          {/* Desktop and Mobile View Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Desktop View */}
            <div
              className="rounded-2xl overflow-hidden border p-1"
              style={{
                borderColor: `${GOLD}40`,
                boxShadow: `0 0 40px ${GOLD}15`,
                background: 'linear-gradient(135deg, #0d0a18 0%, #08060e 100%)',
              }}
            >
              <div className="relative" style={{ background: '#06040c' }}>
                {/* Browser Chrome */}
                <div
                  className="px-4 py-3 border-b flex items-center gap-3"
                  style={{ borderColor: `${GOLD}25`, background: '#0d0a18' }}
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                  </div>
                  <p className="text-[10px] flex-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    arcanum.live/articles/architecture-of-control
                  </p>
                </div>

                {/* Content */}
                <div className="p-6" style={{ minHeight: 'clamp(400px, 60vh, 600px)', overflowY: 'auto' }}>
                  <p
                    className="font-cinzel text-base font-bold mb-4 leading-relaxed"
                    style={{ color: GOLD }}
                  >
                    The Architecture of Control and the Hijacking of Spiritual Pathways
                  </p>
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Long before there were banks or bloodlines or Bilderberg, the old stories warned us: there are forces that feed on fear. The Gnostics called them Archons—rulers of this dark age who cannot create, only consume. The Hebrews named them Watchers—beings who traded their divine station for dominion over flesh and bone.
                  </p>
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    The names shift, but the pattern holds: something has hijacked this world and installed a management team of the spiritually dead. Sociopaths. Psychopaths. Narcissists. Humans who do not feel what you feel, who do not love as you love, who rise through hierarchies not despite their emptiness but because of it.
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    And beneath them, the rest of us—awake or half-asleep—generate the only thing they truly need: loosh. Fear. Rage. Grief. Addiction. Outrage. The harvest never ends because the fear never stops.
                  </p>
                </div>
              </div>
              <p className="text-xs text-center py-2" style={{ color: `${GOLD}60` }}>
                Desktop View (1200px+)
              </p>
            </div>

            {/* Mobile View */}
            <div
              className="rounded-2xl overflow-hidden border p-1"
              style={{
                borderColor: `${VIOLET}40`,
                boxShadow: `0 0 40px ${VIOLET}15`,
                background: 'linear-gradient(135deg, #0d0a18 0%, #08060e 100%)',
              }}
            >
              <div className="relative" style={{ background: '#06040c', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
                {/* Mobile Status Bar */}
                <div
                  className="px-3 py-2 flex items-center justify-between text-[9px]"
                  style={{ background: '#000', color: 'rgba(255,255,255,0.8)' }}
                >
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span>📶</span>
                    <span>📡</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Mobile Browser Bar */}
                <div
                  className="px-3 py-2 border-b flex items-center gap-2"
                  style={{ borderColor: `${VIOLET}25`, background: '#0d0a18' }}
                >
                  <span style={{ color: `${VIOLET}60` }}>←</span>
                  <p className="text-[8px] flex-1 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    arcanum.live/articles/ar...
                  </p>
                  <span style={{ color: `${VIOLET}60` }}>⋯</span>
                </div>

                {/* Content */}
                <div className="p-4" style={{ minHeight: 'clamp(400px, 60vh, 600px)', overflowY: 'auto' }}>
                  <p
                    className="font-cinzel text-sm font-bold mb-3 leading-tight"
                    style={{ color: VIOLET }}
                  >
                    The Architecture of Control
                  </p>
                  <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Long before there were banks or bloodlines or Bilderberg, the old stories warned us: there are forces that feed on fear.
                  </p>
                  <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    The Gnostics called them Archons—rulers of this dark age who cannot create, only consume. The Hebrews named them Watchers—beings who traded their divine station for dominion over flesh and bone.
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Something has hijacked this world. Sociopaths. Psychopaths. Narcissists.
                  </p>
                </div>

                {/* Mobile Home Indicator */}
                <div
                  className="h-6 rounded-t-3xl flex items-center justify-center"
                  style={{ background: '#000', color: 'rgba(255,255,255,0.5)' }}
                >
                  <div className="w-24 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
                </div>
              </div>
              <p className="text-xs text-center py-2" style={{ color: `${VIOLET}60` }}>
                Mobile View (375px)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Full Article */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="font-cinzel text-2xl font-bold mb-8" style={{ color: '#e8dcc8' }}>
            Part One: Spiritual Opening
          </h2>

          <div className="space-y-6 leading-relaxed">
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>
              Long before there were banks or bloodlines or Bilderberg, the old stories warned us: there are forces that feed on fear. The Gnostics called them Archons—rulers of this dark age who cannot create, only consume. The Hebrews named them Watchers—beings who traded their divine station for dominion over flesh and bone. The Hindus knew them as Asuras, the Buddhists as Māra's legions.
            </p>

            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              The names shift, but the pattern holds: something has hijacked this world and installed a management team of the spiritually dead. Sociopaths. Psychopaths. Narcissists. Humans who do not feel what you feel, who do not love as you love, who rise through hierarchies not despite their emptiness but because of it. They marry their own kind, raise children in the cold, and pass down wealth like a curse.
            </p>

            <p style={{ color: 'rgba(255,255,255,0.75)' }}>
              And beneath them, the rest of us—awake or half-asleep—generate the only thing they truly need: loosh. Fear. Rage. Grief. Addiction. Outrage. The harvest never ends because the fear never stops. But what if the old scriptures were instructions, not warnings? What if the Kingdom of Heaven is not a place you go after you die, but a frequency you reclaim while you live?
            </p>

            <p style={{ color: 'rgba(255,255,255,0.7)' }} className="font-cinzel font-bold text-lg">
              This essay is not about conspiracy. It is about sovereignty. And it begins with a single question: what happens when you stop feeding the machine?
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center py-12"
        >
          <a
            href="/blog"
            className="px-6 py-3 rounded-lg text-sm tracking-widest uppercase font-medium"
            style={{
              background: `linear-gradient(135deg, #4a3008, #a87828, #4a3008)`,
              border: `1px solid #9a7030`,
              color: '#fff',
            }}
          >
            Back to Blog
          </a>
        </motion.div>
      </div>
    </div>
  )
}
