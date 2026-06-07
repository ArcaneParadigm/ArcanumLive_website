'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface AudioAnalysis {
  bass: number      // 0-1 low freq energy
  mid: number       // 0-1 mid freq energy
  high: number      // 0-1 high freq energy
  beat: boolean     // true on detected beat
  energy: number    // 0-1 overall energy
}

export interface AstrolabeTrack {
  title: string
  src: string       // URL or path
}

const EMPTY: AudioAnalysis = { bass: 0, mid: 0, high: 0, beat: false, energy: 0 }

export function useAstrolabeAudio(tracks: AstrolabeTrack[], sensitivity = 1.4) {
  const audioRef     = useRef<HTMLAudioElement | null>(null)
  const ctxRef       = useRef<AudioContext | null>(null)
  const analyserRef  = useRef<AnalyserNode | null>(null)
  const sourceRef    = useRef<MediaElementAudioSourceNode | null>(null)
  const rafRef       = useRef<number>(0)
  const beatHistory  = useRef<number[]>([])

  const [analysis, setAnalysis]   = useState<AudioAnalysis>(EMPTY)
  const [playing, setPlaying]     = useState(false)
  const [trackIdx, setTrackIdx]   = useState(0)
  const [volume, setVolume]       = useState(0.5)
  const [ready, setReady]         = useState(false)

  // Init audio context on first play (browser autoplay policy)
  const initCtx = useCallback(() => {
    if (ctxRef.current) return
    const audio = audioRef.current
    if (!audio) return
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.75
    const source = ctx.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current  = ctx
    analyserRef.current = analyser
    sourceRef.current   = source
  }, [])

  // Analysis loop
  useEffect(() => {
    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      const analyser = analyserRef.current
      if (!analyser) return
      const buf = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(buf)
      const binHz = (ctxRef.current?.sampleRate ?? 44100) / analyser.fftSize
      const bassEnd  = Math.floor(200 / binHz)
      const midEnd   = Math.floor(2000 / binHz)
      const highEnd  = Math.floor(8000 / binHz)

      const avg = (a: number, b: number) => {
        let s = 0; for (let i = a; i < b; i++) s += buf[i]
        return (s / ((b - a) || 1)) / 255
      }
      const bass   = avg(0, bassEnd)
      const mid    = avg(bassEnd, midEnd)
      const high   = avg(midEnd, highEnd)
      const energy = (bass * 0.5 + mid * 0.3 + high * 0.2)

      // Beat detection — compare current bass to rolling average
      beatHistory.current.push(bass)
      if (beatHistory.current.length > 30) beatHistory.current.shift()
      const avgBass = beatHistory.current.reduce((a, b) => a + b, 0) / beatHistory.current.length
      const beat = bass > avgBass * sensitivity && bass > 0.12

      setAnalysis({ bass, mid, high, beat, energy })
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [sensitivity])

  // Load track when index changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !tracks[trackIdx]) return
    const wasp = playing
    audio.src = tracks[trackIdx].src
    audio.volume = volume
    audio.load()
    if (wasp) audio.play().catch(() => setPlaying(false))
  }, [trackIdx, tracks]) // eslint-disable-line

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    initCtx()
    if (ctxRef.current?.state === 'suspended') await ctxRef.current.resume()
    await audio.play().catch(() => setPlaying(false))
    setPlaying(true)
  }, [initCtx])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  const next = useCallback(() => setTrackIdx(i => (i + 1) % Math.max(tracks.length, 1)), [tracks.length])
  const prev = useCallback(() => setTrackIdx(i => (i - 1 + Math.max(tracks.length, 1)) % Math.max(tracks.length, 1)), [tracks.length])

  return {
    audioRef, analysis, playing, trackIdx, volume,
    setVolume, play, pause, next, prev,
    currentTrack: tracks[trackIdx] ?? null,
  }
}
