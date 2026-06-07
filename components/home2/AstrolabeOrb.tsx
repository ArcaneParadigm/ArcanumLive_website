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
    camera.position.set(0, 0, 9.0)

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
    tiltGroup.scale.setScalar(1.58)
    // 5 o'clock = 150° clockwise from top: x=sin(150°)=0.5, y=−cos(150°)=−0.866
    // one sphere diameter ≈ 1.04 units
    scene.add(tiltGroup)

    // ── Rings ─────────────────────────────────────────────────────────────────
    const GOLD = new THREE.Color('#c8901a')
    const BRIGHT = new THREE.Color('#f0c040')
    const PALE = new THREE.Color('#e8c878')
    const ORANGE = new THREE.Color('#ff9933')
    const PURPLE = new THREE.Color('#a855f7')

    // axis: which local axis each ring spins on — gives divergent motion
    const ringDefs = [
      { r: 1.72, tube: 0.071, tilt: [0, 0, 0],                          speed:  0.13, axis: 'y' as const, color: GOLD,   emit: BRIGHT  },
      { r: 1.55, tube: 0.082, tilt: [Math.PI*0.3, 0, Math.PI*0.15],    speed: -0.19, axis: 'x' as const, color: PALE,   emit: BRIGHT  },
      { r: 1.32, tube: 0.092, tilt: [Math.PI*0.44, Math.PI*0.1, 0],    speed:  0.24, axis: 'y' as const, color: GOLD,   emit: ORANGE  },
      { r: 1.85, tube: 0.036, tilt: [Math.PI*0.08, 0, 0],              speed: -0.08, axis: 'x' as const, color: PURPLE, emit: new THREE.Color('#d08fff') },
    ]

    const ringMeshes: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; speed: number; axis: 'x'|'y'|'z' }[] = []
    for (const def of ringDefs) {
      const geo = new THREE.TorusGeometry(def.r, def.tube, 32, 180)
      const tex = makeRuneTexture('#' + def.emit.getHexString())
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.emit,
        emissiveIntensity: 1.4,
        emissiveMap: tex,
        metalness: 0.55,
        roughness: 0.18,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2])
      tiltGroup.add(mesh)
      ringMeshes.push({ mesh, mat, speed: def.speed, axis: def.axis })
    }

    // ── Inner orb — semi-transparent refractive crystal ───────────────────────
    const orbGeo = new THREE.SphereGeometry(0.52, 64, 64)
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a0a28,
      transmission: 0.82,
      thickness: 1.4,
      roughness: 0.04,
      metalness: 0.0,
      ior: 1.65,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 0.5,
    })
    const orbMesh = new THREE.Mesh(orbGeo, orbMat)
    tiltGroup.add(orbMesh)

    const haloGeo = new THREE.SphereGeometry(0.58, 32, 32)
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xff6a00, emissive: 0xff4400, emissiveIntensity: 1.2,
      transparent: true, opacity: 0.08, depthWrite: false,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    tiltGroup.add(haloMesh)

    // ── Orbital sparkle ring ──────────────────────────────────────────────────
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

    // ── Fire emitter — ring emission + secondary sparks ───────────────────────
    // Particles spawn from a ring at the orb equator (r=0.56) and fly outward.
    // Secondaries (sparks) spawn near active primaries → 6x density cascade.
    const RING_R  = 0.56
    const isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024)
    const PRI_N   = isMobile ? 80  : 300
    const SPK_N   = isMobile ? 960 : 3900
    const TOTAL_F = PRI_N + SPK_N

    type FP = { x:number; y:number; z:number; vx:number; vy:number; vz:number; life:number; maxLife:number; seed:number; sz:number }

    // Spawn primary on emission ring in XY plane — faces camera (camera at z=9)
    function spawnPrimary(): FP {
      const a   = Math.random() * Math.PI * 2
      const spd = 0.22 + Math.random() * 0.32
      return {
        x: Math.cos(a) * RING_R, y: Math.sin(a) * RING_R, z: (Math.random() - 0.5) * 0.06,
        vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, vz: (Math.random() - 0.5) * 0.18,
        life: 0, maxLife: (1.2 + Math.random() * 1.1) * (Math.random() < 1/3 ? 2 : 1),
        seed: Math.random() * 100,
        sz: 0.06 + Math.random() * 0.07,
      }
    }

    // Spawn spark near a given world position, scatter outward
    function spawnSpark(px: number, py: number, pz: number): FP {
      const a   = Math.random() * Math.PI * 2
      const el  = (Math.random() - 0.5) * 0.8
      const spd = 0.08 + Math.random() * 0.18
      return {
        x: px + (Math.random()-0.5)*0.06, y: py + (Math.random()-0.5)*0.06, z: pz + (Math.random()-0.5)*0.06,
        vx: Math.cos(el)*Math.cos(a)*spd, vy: Math.sin(el)*spd + 0.06, vz: Math.cos(el)*Math.sin(a)*spd,
        life: 0, maxLife: (0.25 + Math.random() * 0.45) * (Math.random() < 1/3 ? 2 : 1),
        seed: Math.random() * 100,
        sz: 0.022 + Math.random() * 0.03,
      }
    }

    const priPool: FP[] = []
    const spkPool: FP[] = []
    for (let i = 0; i < PRI_N; i++) { const p = spawnPrimary(); p.life = Math.random() * p.maxLife; priPool.push(p) }
    for (let i = 0; i < SPK_N; i++) { const p = spawnSpark(0, 0, 0); p.life = p.maxLife; spkPool.push(p) }

    // 4 meshes: primary small/large + spark small/large — real per-particle size variance
    // primaries: i < PRI_N/2 → small (0.045), i >= PRI_N/2 → large (0.175)
    // sparks:    i < SPK_N/2 → small (0.022), i >= SPK_N/2 → large (0.072)
    const PRI_H = Math.floor(PRI_N / 2)
    const SPK_H = Math.floor(SPK_N / 2)

    const priSPos = new Float32Array(PRI_H * 3); const priSCol = new Float32Array(PRI_H * 3)
    const priLPos = new Float32Array((PRI_N - PRI_H) * 3); const priLCol = new Float32Array((PRI_N - PRI_H) * 3)
    const spkSPos = new Float32Array(SPK_H * 3); const spkSCol = new Float32Array(SPK_H * 3)
    const spkLPos = new Float32Array((SPK_N - SPK_H) * 3); const spkLCol = new Float32Array((SPK_N - SPK_H) * 3)

    function makePoints(pos: Float32Array, col: Float32Array, size: number, opacity: number) {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity, depthWrite: false, sizeAttenuation: true })
      const mesh = new THREE.Points(geo, mat)
      tiltGroup.add(mesh)
      return { geo, mat, mesh }
    }
    const priS = makePoints(priSPos, priSCol, 0.045, 0.88)
    const priL = makePoints(priLPos, priLCol, 0.175, 0.95)
    const spkS = makePoints(spkSPos, spkSCol, 0.022, 0.80)
    const spkL = makePoints(spkLPos, spkLCol, 0.072, 0.90)
    // helper: fire color with fade-in + fade-out
    function fireColor(t: number, outArr: Float32Array, base: number) {
      const fadeIn  = t < 0.12 ? t / 0.12 : 1.0
      const fadeOut = t > 0.68 ? 1.0 - (t - 0.68) / 0.32 : 1.0
      const fade = fadeIn * fadeOut
      outArr[base]   = 1.0 * fade
      outArr[base+1] = Math.max(0, 0.88 - t * 1.7) * fade
      outArr[base+2] = Math.max(0, 0.12 - t * 0.5) * fade
    }

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
      for (const { mesh, mat, speed, axis } of ringMeshes) {
        mesh.rotation[axis] += dt * speed * sm * beatBoost
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

      // Orbital sparkle
      particles.rotation.y += dt * 0.12
      const ps = 1 + a.energy * 0.4 * pm
      particles.scale.setScalar(ps)

      // Fire — primary ring emitters (split small/large by index)
      const beatFire = 1 + (a.beat ? 0.9 : 0) + a.bass * 0.4
      for (let i = 0; i < PRI_N; i++) {
        const p = priPool[i]
        p.life += dt
        if (p.life >= p.maxLife) { Object.assign(p, spawnPrimary()); }
        const t = p.life / p.maxLife
        const turb = 0.38 * Math.exp(-t * 1.4)
        p.x += (p.vx + Math.sin(p.life * 3.8 + p.seed)     * turb) * dt * beatFire
        p.y += (p.vy + Math.cos(p.life * 2.9 + p.seed + 1) * turb * 0.5) * dt * beatFire
        p.z += (p.vz + Math.sin(p.life * 3.3 + p.seed + 2) * turb) * dt * beatFire
        p.vx *= 0.984; p.vy *= 0.984; p.vz *= 0.984
        const posArr = i < PRI_H ? priSPos : priLPos
        const colArr = i < PRI_H ? priSCol : priLCol
        const j = i < PRI_H ? i : i - PRI_H
        posArr[j*3] = p.x; posArr[j*3+1] = p.y; posArr[j*3+2] = p.z
        fireColor(t, colArr, j*3)
      }
      priS.geo.attributes.position.needsUpdate = true; priS.geo.attributes.color.needsUpdate = true
      priL.geo.attributes.position.needsUpdate = true; priL.geo.attributes.color.needsUpdate = true

      // Fire — secondary sparks (split small/large by index)
      for (let i = 0; i < SPK_N; i++) {
        const p = spkPool[i]
        p.life += dt
        if (p.life >= p.maxLife) {
          const parent = priPool[Math.floor(Math.random() * PRI_N)]
          Object.assign(p, spawnSpark(parent.x, parent.y, parent.z))
        }
        const t = p.life / p.maxLife
        const turb2 = 0.28 * Math.exp(-t * 2.2)
        p.x += (p.vx + Math.sin(p.life * 5.1 + p.seed)     * turb2) * dt * beatFire
        p.y += (p.vy + Math.cos(p.life * 4.3 + p.seed)     * turb2 * 0.4) * dt * beatFire
        p.z += (p.vz + Math.sin(p.life * 4.7 + p.seed + 3) * turb2) * dt * beatFire
        p.vx *= 0.978; p.vy *= 0.978; p.vz *= 0.978
        const posArr = i < SPK_H ? spkSPos : spkLPos
        const colArr = i < SPK_H ? spkSCol : spkLCol
        const j = i < SPK_H ? i : i - SPK_H
        posArr[j*3] = p.x; posArr[j*3+1] = p.y; posArr[j*3+2] = p.z
        fireColor(t, colArr, j*3)
      }
      spkS.geo.attributes.position.needsUpdate = true; spkS.geo.attributes.color.needsUpdate = true
      spkL.geo.attributes.position.needsUpdate = true; spkL.geo.attributes.color.needsUpdate = true

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
      priS.geo.dispose(); priS.mat.dispose()
      priL.geo.dispose(); priL.mat.dispose()
      spkS.geo.dispose(); spkS.mat.dispose()
      spkL.geo.dispose(); spkL.mat.dispose()
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
