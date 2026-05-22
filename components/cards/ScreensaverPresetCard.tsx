'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ScreensaverPreset } from '@/types'

interface ScreensaverPresetCardProps {
  preset: Partial<ScreensaverPreset>
}

const modeIcons: Record<string, string> = {
  gallery_drift: '◈',
  video_temple: '⬡',
  music_reactor: '◉',
  fluid_oracle: '⌘',
  particle_cosmos: '✦',
  mythmachine_shuffle: '⧉',
}

const modeColors: Record<string, string> = {
  gallery_drift: '#c9973a',
  video_temple: '#7c3aed',
  music_reactor: '#00e5ff',
  fluid_oracle: '#06b6d4',
  particle_cosmos: '#f5d06e',
  mythmachine_shuffle: '#c9973a',
}

export default function ScreensaverPresetCard({ preset }: ScreensaverPresetCardProps) {
  const mode = preset.visual_mode ?? 'gallery_drift'
  const color = modeColors[mode] ?? '#c9973a'
  const icon = modeIcons[mode] ?? '◈'

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <Link href={`/screensaver?preset=${preset.slug}`}>
        <div
          className="relative rounded-xl overflow-hidden border border-white/10 bg-obsidian-100 shadow-card p-5 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${color}11 0%, #0a0a0f 100%)`,
          }}
        >
          {/* Icon */}
          <div
            className="text-3xl mb-3 animate-glow-pulse"
            style={{ color }}
          >
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm leading-tight mb-1">{preset.title}</h3>
          {preset.description && (
            <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{preset.description}</p>
          )}

          {/* Stats row */}
          <div className="mt-3 flex items-center gap-3">
            {preset.default_intensity && (
              <div className="flex items-center gap-1">
                <span className="text-white/30 text-xs">Intensity</span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(preset.default_intensity / 10) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            )}
            {preset.audio_reactive && (
              <span className="text-xs px-2 py-0.5 rounded-full border"
                style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
                Audio ⟳
              </span>
            )}
          </div>

          {/* Launch button hover */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-end px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs tracking-wider uppercase font-medium" style={{ color }}>
              Launch →
            </span>
          </div>

          {/* Border glow */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 1px ${color}44` }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
