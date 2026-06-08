'use client'

/**
 * Crystal singing bowl synthesizer — Web Audio API
 * Each color accent maps to a pentatonic note so any combination sounds harmonious.
 * Crystal bowls have inharmonic overtones — ratios ~2.756x and ~5.404x the fundamental.
 */

let audioCtx: AudioContext | null = null
let lastPlayTime: Record<string, number> = {}
const DEBOUNCE_MS = 120 // prevent rapid re-triggers on same note

// Global volume multiplier — controlled by the dev panel, persisted in localStorage
let _volumeMultiplier = 1.0
export function setHoverVolumeMultiplier(v: number) { _volumeMultiplier = Math.max(0, Math.min(2, v)) }
export function getHoverVolumeMultiplier() { return _volumeMultiplier }

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

/** Shared AudioContext for use by other audio modules on the same page */
export function getSharedAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try { return getCtx() } catch { return null }
}

// Pentatonic scale — any combo sounds consonant
const COLOR_NOTES: Record<string, number> = {
  '#c9973a': 261.63,  // C4  — Gold
  '#a855f7': 329.63,  // E4  — Violet
  '#00aaff': 392.00,  // G4  — Aqua blue
  '#ec4899': 440.00,  // A4  — Pink
  '#f97316': 293.66,  // D4  — Orange
  '#7c3aed': 349.23,  // F4  — Deep violet
  default:   392.00,  // G4  — fallback
}

export function playCrystalBowl(color: string, volume = 0.04) {
  if (typeof window === 'undefined') return

  const now = Date.now()
  if (lastPlayTime[color] && now - lastPlayTime[color] < DEBOUNCE_MS) return
  lastPlayTime[color] = now

  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    const freq = COLOR_NOTES[color.toLowerCase()] ?? COLOR_NOTES.default

    // Reverb-like tail via a convolver would be ideal but for zero-deps
    // we fake it with 3 partials + a short delay echo

    // Master output gain
    const master = ctx.createGain()
    const finalVol = volume * _volumeMultiplier
    master.gain.setValueAtTime(0, t)
    master.gain.linearRampToValueAtTime(finalVol, t + 0.04)  // fast attack
    master.gain.exponentialRampToValueAtTime(0.001, t + 3.2) // long bowl decay
    master.connect(ctx.destination)

    // Crystal bowl overtone series (inharmonic — what makes bowls sound magical)
    const partials = [
      { ratio: 1,     amp: 0.60 },  // fundamental
      { ratio: 2.756, amp: 0.22 },  // characteristic bowl overtone
      { ratio: 5.404, amp: 0.10 },  // upper shimmer
      { ratio: 1.003, amp: 0.08 },  // slight beating — gives the "singing" wobble
    ]

    partials.forEach(({ ratio, amp }) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq * ratio, t)
      // Tiny frequency glide creates the bowl's natural pitch rise on strike
      osc.frequency.linearRampToValueAtTime(freq * ratio * 1.0008, t + 0.3)

      g.gain.setValueAtTime(amp, t)
      osc.connect(g)
      g.connect(master)

      osc.start(t)
      osc.stop(t + 3.5)
    })

    // Short echo tap — feels like the bowl ringing in a stone room
    const delay = ctx.createDelay(0.4)
    delay.delayTime.setValueAtTime(0.18, t)
    const echoGain = ctx.createGain()
    echoGain.gain.setValueAtTime(0.18, t)
    echoGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5)
    master.connect(delay)
    delay.connect(echoGain)
    echoGain.connect(ctx.destination)

  } catch {
    // AudioContext blocked (autoplay policy) — silently ignore
  }
}

/**
 * Deep gong strike — used for lore/character panel hover.
 * Low G2 (~98 Hz) with longer decay and heavy echo, feels like a temple bowl.
 */
export function playDeepGong(volume = 0.055) {
  if (typeof window === 'undefined') return
  const key = '__deep_gong__'
  const now = Date.now()
  if (lastPlayTime[key] && now - lastPlayTime[key] < 400) return
  lastPlayTime[key] = now
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    const freq = 97.999 // G2

    const master = ctx.createGain()
    const finalVol = volume * _volumeMultiplier
    master.gain.setValueAtTime(0, t)
    master.gain.linearRampToValueAtTime(finalVol, t + 0.06)
    master.gain.exponentialRampToValueAtTime(0.001, t + 5.5)
    master.connect(ctx.destination)

    const partials = [
      { ratio: 1,     amp: 0.65 },
      { ratio: 2.756, amp: 0.20 },
      { ratio: 5.404, amp: 0.08 },
      { ratio: 1.002, amp: 0.07 }, // subtle beating
    ]
    partials.forEach(({ ratio, amp }) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq * ratio, t)
      osc.frequency.linearRampToValueAtTime(freq * ratio * 1.0005, t + 0.5)
      g.gain.setValueAtTime(amp, t)
      osc.connect(g)
      g.connect(master)
      osc.start(t)
      osc.stop(t + 6)
    })

    // Long reverb tail
    const delay = ctx.createDelay(0.6)
    delay.delayTime.setValueAtTime(0.28, t)
    const echoGain = ctx.createGain()
    echoGain.gain.setValueAtTime(0.22, t)
    echoGain.gain.exponentialRampToValueAtTime(0.001, t + 4.5)
    master.connect(delay)
    delay.connect(echoGain)
    echoGain.connect(ctx.destination)
  } catch { /* AudioContext blocked */ }
}

/** Call once on first user interaction to unlock AudioContext early */
export function unlockAudio() {
  if (typeof window === 'undefined') return
  try { getCtx() } catch { /* ignore */ }
}
