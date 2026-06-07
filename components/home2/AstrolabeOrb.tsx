'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { AudioAnalysis } from '@/lib/hooks/useAstrolabeAudio'

// ── Rune canvas texture ───────────────────────────────────────────────────────
function makeRuneTexture(glowColor: string): THREE.CanvasTexture {
  const size = 512
  const cvs = document.createElement('canvas')
  cvs.width = size; cvs.height = size
  const ctx = cvs.getContext('2d')!
  ctx.clearRect(0, 0, size, size)

  ctx.strokeStyle = glowColor
  ctx.lineWidth = 2.5
  ctx.globalAlpha = 0.9
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2); ctx.stroke()

  const RUNES = '᛫ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ⊕⊗△▽◈⬡✦⊛'
  const count = 32
  ctx.font = `bold ${size * 0.042}px serif`
  ctx.fillStyle = glowColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const r = size * 0.44
    const x = size / 2 + Math.cos(angle) * r
    const y = size / 2 + Math.sin(angle) * r
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle + Math.PI / 2)
    ctx.globalAlpha = 0.85
    ctx.fillText(RUNES[i % RUNES.length], 0, 0)
    ctx.restore()
  }

  ctx.strokeStyle = glowColor
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.45
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(size / 2 + Math.cos(a) * size * 0.2, size / 2 + Math.sin(a) * size * 0.2)
    ctx.lineTo(size / 2 + Math.cos(a) * size * 0.42, size / 2 + Math.sin(a) * size * 0.42)
    ctx.stroke()
  }

  ctx.fillStyle = glowColor
  ctx.globalAlpha = 1
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2
    const x = size / 2 + Math.cos(a) * size * 0.44
    const y = size / 2 + Math.sin(a) * size * 0.44
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4)
    ctx.fillRect(-5, -5, 10, 10); ctx.restore()
  }

  return new THREE.CanvasTexture(cvs)
}

interface AstrolabeOrbProps {
  audio: AudioAnalysis
  speedMult: number
  pulseMult: number
  glowStrength: number
  mousePos: { x: number; y: number }
  className?: string
  style?: React.CSSProperties
}

export default function AstrolabeOrb({
  audio, speedMult, pulseMult, glowStrength, mousePos, className, style,
}: AstrolabeOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ audio, speedMult, pulseMult, glowStrength, mousePos })
  stateRef.current = { audio, speedMult, pulseMult, glowStrength, mousePos }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const w = canvas.offsetWidth || 400
    const h = canvas.offsetHeight || 400
    renderer.setSize(w, h)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, 4.5)

    const scene = new THREE.Scene()

    // ── Lights ────────────────────────────────────────────────────────────────
    const ambLight = new THREE.AmbientLight(0xffffff, 0.15)
    scene.add(ambLight)
    const pointA = new THREE.PointLight(0xff6a00, 3, 20)
    pointA.position.set(0, 0, 2)
    scene.add(pointA)
    const pointB = new THREE.PointLight(0xf5d06e, 1.5, 20)
    pointB.position.set(3, 2, 1)
    scene.add(pointB)
    const pointC = new THREE.PointLight(0xa855f7, 1.2, 20)
    pointC.position.set(-3, -2, 1)
    scene.add(pointC)

    // ── Mouse tilt group ──────────────────────────────────────────────────────
    const tiltGroup = new THREE.Group()
    scene.add(tiltGroup)

    // ── Rings ─────────────────────────────────────────────────────────────────
    const GOLD = new THREE.Color('#c9973a')
    const BRIGHT = new THREE.Color('#f5d06e')
    const PALE = new THREE.Color('#ffe9a0')
    const ORANGE = new THREE.Color('#ff9933')
    const PURPLE = new THREE.Color('#a855f7')

    const ringDefs = [
      { r: 1.72, tube: 0.028, tilt: [0, 0, 0],                          speed: 0.38,  color: GOLD,   emit: BRIGHT  },
      { r: 1.55, tube: 0.032, tilt: [Math.PI*0.3, 0, Math.PI*0.15],     speed: -0.55, color: PALE,   emit: BRIGHT  },
      { r: 1.32, tube: 0.036, tilt: [Math.PI*0.44, Math.PI*0.1, 0],     speed: 0.72,  color: GOLD,   emit: ORANGE  },
      { r: 1.85, tube: 0.014, tilt: [Math.PI*0.08, 0, 0],               speed: -0.18, color: PURPLE, emit: new THREE.Color('#d08fff') },
    ]

    const ringMeshes: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; speed: number }[] = []
    for (const def of ringDefs) {
      const geo = new THREE.TorusGeometry(def.r, def.tube, 32, 180)
      const tex = makeRuneTexture('#' + def.emit.getHexString())
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.emit,
        emissiveIntensity: 0.8,
        emissiveMap: tex,
        metalness: 0.95,
        roughness: 0.08,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2])
      tiltGroup.add(mesh)
      ringMeshes.push({ mesh, mat, speed: def.speed })
    }

    // ── Inner orb ─────────────────────────────────────────────────────────────
    const orbGeo = new THREE.SphereGeometry(0.52, 64, 64)
    const orbMat = new THREE.MeshStandardMaterial({ color: 0x050308, roughness: 0.0, metalness: 1.0 })
    const orbMesh = new THREE.Mesh(orbGeo, orbMat)
    tiltGroup.add(orbMesh)

    const haloGeo = new THREE.SphereGeometry(0.58, 32, 32)
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xff6a00, emissive: 0xff4400, emissiveIntensity: 1.2,
      transparent: true, opacity: 0.08, depthWrite: false,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    tiltGroup.add(haloMesh)

    // ── Particles ─────────────────────────────────────────────────────────────
    const COUNT = 320
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = (i / COUNT) * Math.PI * 2
      const r = 1.8 + (Math.random() - 0.5) * 0.4
      const y = (Math.random() - 0.5) * 0.3
      positions[i * 3]     = Math.cos(theta) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(theta) * r
    }
    const ptGeo = new THREE.BufferGeometry()
    ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const ptMat = new THREE.PointsMaterial({ size: 0.022, color: 0xf5d06e, transparent: true, opacity: 0.7, depthWrite: false, sizeAttenuation: true })
    const particles = new THREE.Points(ptGeo, ptMat)
    tiltGroup.add(particles)

    // ── Animation ─────────────────────────────────────────────────────────────
    let rafId = 0
    let last = performance.now()

    function animate() {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      const { audio: a, speedMult: sm, pulseMult: pm } = stateRef.current
      const mp = stateRef.current.mousePos
      const gs = stateRef.current.glowStrength

      // Mouse tilt lerp
      const tx = (mp.y - 0.5) * 0.55
      const ty = (mp.x - 0.5) * 0.55
      tiltGroup.rotation.x += (tx - tiltGroup.rotation.x) * 0.06
      tiltGroup.rotation.y += (ty - tiltGroup.rotation.y) * 0.06

      const beatBoost = a.beat ? 1.6 : 1
      for (const { mesh, mat, speed } of ringMeshes) {
        mesh.rotation.z += dt * speed * sm * beatBoost
        const bassBoost = 1 + a.bass * 1.2 * pm
        const s = 1 + (bassBoost - 1) * 0.18
        mesh.scale.setScalar(s)
        const emit = 0.6 + a.bass * 1.8 * pm + (a.beat ? 1.2 : 0)
        mat.emissiveIntensity = Math.min(emit, 3.5)
      }

      // Orb pulse
      const orbPulse = 1 + a.bass * 0.25 * pm + (a.beat ? 0.12 : 0)
      orbMesh.scale.setScalar(orbPulse)
      orbMesh.rotation.y += dt * 0.08
      orbMesh.rotation.x += dt * 0.04
      haloMesh.scale.setScalar(orbPulse * (1.35 + a.energy * 0.4 * pm))

      // Particles
      particles.rotation.y += dt * 0.12
      const ps = 1 + a.energy * 0.4 * pm
      particles.scale.setScalar(ps)

      // Point lights beat
      pointA.intensity = 3 * (1 + a.bass * gs * 0.5)
      pointB.intensity = 1.5 * (1 + a.energy * gs * 0.3)

      renderer.render(scene, camera)
    }

    animate()

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w2 = canvas.offsetWidth
      const h2 = canvas.offsetHeight
      if (w2 > 0 && h2 > 0) {
        renderer.setSize(w2, h2)
        camera.aspect = w2 / h2
        camera.updateProjectionMatrix()
      }
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      renderer.dispose()
      for (const { mesh, mat } of ringMeshes) {
        mesh.geometry.dispose(); mat.dispose()
      }
      orbGeo.dispose(); orbMat.dispose()
      haloGeo.dispose(); haloMat.dispose()
      ptGeo.dispose(); ptMat.dispose()
    }
  }, []) // init once

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
