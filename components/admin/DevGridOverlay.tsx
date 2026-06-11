'use client'

import { useState, useEffect } from 'react'

interface Props {
  visible: boolean
}

export default function DevGridOverlay({ visible }: Props) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, vw: 0, vh: 0 })

  useEffect(() => {
    if (!visible) return

    const onMove = (e: MouseEvent) => {
      setCursor({
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        vw: (e.clientX / window.innerWidth) * 100,
        vh: (e.clientY / window.innerHeight) * 100,
      })
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      setCursor({
        x: Math.round(t.clientX),
        y: Math.round(t.clientY),
        vw: (t.clientX / window.innerWidth) * 100,
        vh: (t.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [visible])

  if (!visible) return null

  // 5% increments: 5,10,...,95 (19 lines each axis; 50 = center = red)
  const pcts = Array.from({ length: 19 }, (_, i) => (i + 1) * 5)

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 9997, pointerEvents: 'none' }}
    >
      {/* Vertical lines */}
      {pcts.map(p => {
        const isCenter = p === 50
        const isMajor = p % 25 === 0
        return (
          <div
            key={`v${p}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${p}%`,
              width: isCenter ? '1px' : '1px',
              background: isCenter
                ? 'rgba(255,60,60,0.75)'
                : 'rgba(180,180,180,0.18)',
            }}
          >
            {/* Label at top for major + center lines */}
            {(isCenter || isMajor) && (
              <span
                className="absolute top-1 left-1 font-mono"
                style={{
                  fontSize: 9,
                  color: isCenter ? 'rgba(255,100,100,0.9)' : 'rgba(200,200,200,0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {p}vw
              </span>
            )}
          </div>
        )
      })}

      {/* Horizontal lines */}
      {pcts.map(p => {
        const isCenter = p === 50
        const isMajor = p % 25 === 0
        return (
          <div
            key={`h${p}`}
            className="absolute left-0 right-0"
            style={{
              top: `${p}%`,
              height: '1px',
              background: isCenter
                ? 'rgba(255,60,60,0.75)'
                : 'rgba(180,180,180,0.18)',
            }}
          >
            {/* Label at left for major + center lines */}
            {(isCenter || isMajor) && (
              <span
                className="absolute left-1 font-mono"
                style={{
                  fontSize: 9,
                  top: 2,
                  color: isCenter ? 'rgba(255,100,100,0.9)' : 'rgba(200,200,200,0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {p}vh
              </span>
            )}
          </div>
        )
      })}

      {/* Cursor HUD */}
      <div
        className="fixed font-mono"
        style={{
          bottom: 56,
          left: 12,
          background: 'rgba(0,0,0,0.88)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 6,
          padding: '5px 9px',
          fontSize: 11,
          lineHeight: 1.7,
          backdropFilter: 'blur(6px)',
        }}
      >
        <div>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>x </span>
          <span style={{ color: '#ff8888' }}>{cursor.x}px</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}> · </span>
          <span style={{ color: '#ffaa66' }}>{cursor.vw.toFixed(1)}vw</span>
        </div>
        <div>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>y </span>
          <span style={{ color: '#88aaff' }}>{cursor.y}px</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}> · </span>
          <span style={{ color: '#88ddff' }}>{cursor.vh.toFixed(1)}vh</span>
        </div>
      </div>
    </div>
  )
}
