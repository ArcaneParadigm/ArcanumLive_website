'use client'

import { useEffect, useId, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { playCrystalBowl } from '@/lib/utils/crystalSound'

const GOLD   = '#c9973a'
const VIOLET = '#a855f7'

// ── Spinning 3D Merkaba (Star Tetrahedron) ──────────────────────────────────
export function MerkabaSpin({ size = 46 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number, angle = 0

    const sq23 = Math.sqrt(2 / 3), h = Math.sqrt(8 / 9)
    const base: [number,number,number][] = [
      [0,  1,  0],
      [0, -1/3,  h],
      [-sq23, -1/3, -h/2],
      [ sq23, -1/3, -h/2],
    ]
    const edges = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]] as [number,number][]

    function rotY(p: [number,number,number], a: number): [number,number,number] {
      return [p[0]*Math.cos(a)+p[2]*Math.sin(a), p[1], -p[0]*Math.sin(a)+p[2]*Math.cos(a)]
    }
    function rotX(p: [number,number,number], a: number): [number,number,number] {
      return [p[0], p[1]*Math.cos(a)-p[2]*Math.sin(a), p[1]*Math.sin(a)+p[2]*Math.cos(a)]
    }
    function project([x,y,z]: [number,number,number]): [number,number,number] {
      const fov = 3.5, s = fov / (fov + z + 1.5)
      return [size/2 + x*size*0.38*s, size/2 - y*size*0.38*s, z]
    }

    function draw() {
      ctx.clearRect(0, 0, size, size)
      const bg = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2)
      bg.addColorStop(0, 'rgba(80,60,200,0.22)')
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg; ctx.fillRect(0,0,size,size)

      const tilt = 0.42
      const t1 = base.map(p => project(rotX(rotY(p,  angle), tilt)))
      const t2 = base.map(p => project(rotX(rotY([p[0],-p[1],p[2]], -angle*0.72), tilt)))

      function drawTet(pts: [number,number,number][], bright: string, dim: string) {
        edges.forEach(([a,b]) => {
          const [x1,y1,z1] = pts[a], [x2,y2,z2] = pts[b]
          const z = ((z1+z2)/2 + 1.6) / 3.2
          const opacity = 0.3 + 0.7 * Math.max(0, Math.min(1, z))
          const lw = 0.7 + 1.0 * z
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2)
          ctx.strokeStyle = opacity > 0.55
            ? bright.replace('{a}', opacity.toFixed(2))
            : dim.replace('{a}', (opacity*0.7).toFixed(2))
          ctx.lineWidth = lw; ctx.stroke()
        })
      }

      drawTet(t1, 'rgba(240,185,60,{a})', 'rgba(180,120,20,{a})')
      drawTet(t2, 'rgba(255,220,90,{a})', 'rgba(200,150,30,{a})')

      ;[...t1, ...t2].forEach(([x,y,z]) => {
        const oz = ((z+1.6)/3.2); if (oz < 0.4) return
        ctx.beginPath(); ctx.arc(x,y,0.9,0,Math.PI*2)
        ctx.fillStyle = `rgba(255,210,80,${(oz*0.8).toFixed(2)})`; ctx.fill()
      })

      const cg = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size*0.11)
      cg.addColorStop(0,'rgba(255,230,130,0.95)')
      cg.addColorStop(0.5,'rgba(220,160,40,0.4)')
      cg.addColorStop(1,'rgba(180,120,20,0)')
      ctx.fillStyle = cg; ctx.beginPath()
      ctx.arc(size/2,size/2,size*0.11,0,Math.PI*2); ctx.fill()

      angle += 0.013
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [size])

  return <canvas ref={ref} width={size} height={size} style={{ display: 'block' }} />
}

// ── Ornate bevel octagonal button ───────────────────────────────────────────
interface BtnOrnateProps {
  label?: string
  width?: number
  height?: number
  href?: string
  responsive?: { width?: string; height?: string }
}

export function BtnOrnate({ label = 'Enter the Arcanum', width = 360, height = 116, href, responsive }: BtnOrnateProps) {
  const uid  = useId().replace(/:/g, '')
  const CX   = width / 2
  const CUT  = Math.round(height * 0.19)

  function oct(inset: number) {
    const c = Math.max(4, CUT - inset * 0.65)
    const i = inset
    return [
      `${i + c},${i}`,
      `${width - i - c},${i}`,
      `${width - i},${i + c}`,
      `${width - i},${height - i - c}`,
      `${width - i - c},${height - i}`,
      `${i + c},${height - i}`,
      `${i},${height - i - c}`,
      `${i},${i + c}`,
    ].join(' ')
  }

  const inner = (
    <>
      <svg width={width} height={height} className="absolute inset-0" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`${uid}Fr1`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#9a7830"/>
            <stop offset="18%"  stopColor="#e8c060"/>
            <stop offset="38%"  stopColor="#c49838"/>
            <stop offset="62%"  stopColor="#5a4018"/>
            <stop offset="100%" stopColor="#0e0b06"/>
          </linearGradient>
          <linearGradient id={`${uid}Fr2`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#7a5e22"/>
            <stop offset="22%"  stopColor="#d4a840"/>
            <stop offset="55%"  stopColor="#4a3410"/>
            <stop offset="100%" stopColor="#060406"/>
          </linearGradient>
          <linearGradient id={`${uid}Fr3`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#5a4820"/>
            <stop offset="30%"  stopColor="#b88830"/>
            <stop offset="100%" stopColor="#0c0a06"/>
          </linearGradient>
          <linearGradient id={`${uid}Fill`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#1a1840"/>
            <stop offset="45%"  stopColor="#100e28"/>
            <stop offset="100%" stopColor="#08061a"/>
          </linearGradient>
          <radialGradient id={`${uid}Glow`} cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="#2828b0" stopOpacity="0.5"/>
            <stop offset="55%"  stopColor="#141048" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#06040e" stopOpacity="0"/>
          </radialGradient>
          <filter id={`${uid}Shadow`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.9"/>
          </filter>
          <filter id={`${uid}Neon`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <polygon points={oct(0)} fill="#04030a" filter={`url(#${uid}Shadow)`} opacity="0.85"/>
        <polygon points={oct(0)} fill={`url(#${uid}Fr1)`}/>
        <polyline points={`${CUT+1},1 ${width-CUT-1},1 ${width-1},${CUT+1}`}
          fill="none" stroke="#f0d878" strokeWidth="1.5" opacity="0.85" strokeLinecap="round"/>
        <polyline points={`${width-1},${height-CUT-1} ${width-CUT-1},${height-1} ${CUT+1},${height-1} 1,${height-CUT-1}`}
          fill="none" stroke="#020102" strokeWidth="1.5" opacity="0.9"/>

        <polygon points={oct(3)} fill={`url(#${uid}Fr2)`}/>
        <polyline points={`${CUT-1},4 ${width-CUT-1},4 ${width-4},${CUT-1}`}
          fill="none" stroke="#d4a840" strokeWidth="1" opacity="0.7" strokeLinecap="round"/>

        <polygon points={oct(6)} fill={`url(#${uid}Fr3)`}/>
        <polyline points={`${CUT-3},7 ${width-CUT-3},7 ${width-7},${CUT-3}`}
          fill="none" stroke="#b88830" strokeWidth="0.8" opacity="0.6" strokeLinecap="round"/>

        <polygon points={oct(9)} fill="none" stroke="#c89030" strokeWidth="1" opacity="0.8"/>
        <polygon points={oct(11)} fill={`url(#${uid}Fill)`}/>
        <polygon points={oct(11)} fill={`url(#${uid}Glow)`}/>

        {/* Antique gold neon inner edge */}
        <polygon points={oct(11)} fill="none"
          stroke="#b86818" strokeWidth="4" opacity="0.6" filter={`url(#${uid}Neon)`}/>
        <polygon points={oct(11)} fill="none"
          stroke="#d4882a" strokeWidth="1" opacity="1"/>

        <polyline
          points={`${CUT-8},12 ${width-CUT-8},12 ${width-12},${CUT-8}`}
          fill="none" stroke="rgba(100,90,180,0.18)" strokeWidth="1" strokeLinecap="round"/>

        {/* Top connector stem */}
        <line x1={CX} y1={0} x2={CX} y2={-18}
          stroke={`${GOLD}60`} strokeWidth="0.8" strokeDasharray="2 2"/>
        <circle cx={CX} cy={0} r="2.5"
          fill="none" stroke={`${GOLD}90`} strokeWidth="0.8"/>

        {/* Bottom chevron */}
        <g transform={`translate(${CX}, ${height - 12})`}>
          <polyline points="-13,-5 0,5 13,-5"
            fill="none" stroke="#9a7825" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="-9,-4 0,3 9,-4"
            fill="none" stroke="#ffe060" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
        </g>
      </svg>

      {/* Merkaba ornament — centered on top edge */}
      <div className="absolute z-20 pointer-events-none" style={{ top: -23, left: CX - 23 }}>
        <MerkabaSpin size={46} />
      </div>

      {/* Label */}
      <span className="relative z-10 font-cinzel font-bold tracking-[0.22em] uppercase text-center"
        style={{
          fontSize: 'clamp(9px, 2vw, 13px)',
          lineHeight: 1.35,
          whiteSpace: 'pre-line',
          color: 'rgba(225,205,155,0.92)',
          textShadow: '0 0 24px rgba(80,60,180,0.45), 0 0 8px rgba(80,60,180,0.2), 0 1px 6px rgba(0,0,0,0.95)',
        }}>
        {label}
      </span>
    </>
  )

  const motionProps = {
    className: 'relative inline-flex items-center justify-center cursor-pointer select-none overflow-visible',
    style: {
      width: responsive?.width || width,
      height: responsive?.height || height,
      marginTop: 'clamp(16px, 3vh, 26px)',
      filter: 'drop-shadow(0 0 8px rgba(180,120,20,0.5)) drop-shadow(0 0 18px rgba(140,90,10,0.3))',
    },
    whileHover: {
      filter: 'drop-shadow(0 0 14px rgba(220,160,30,0.95)) drop-shadow(0 0 35px rgba(190,130,20,0.75)) drop-shadow(0 0 70px rgba(160,100,10,0.5))',
      scale: 1.025,
    },
    whileTap:   { scale: 0.97 },
    transition: { duration: 0.25 },
    onMouseEnter: () => playCrystalBowl(VIOLET, 0.03),
  }

  if (href) {
    return (
      <Link href={href} style={{ display: 'inline-block' }}>
        <motion.div {...motionProps}>{inner}</motion.div>
      </Link>
    )
  }

  return <motion.button {...motionProps}>{inner}</motion.button>
}
