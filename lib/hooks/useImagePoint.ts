'use client'

import { useState, useEffect } from 'react'

/**
 * Maps a fractional point inside an image (rendered with object-cover object-center)
 * to absolute screen coordinates, updating on every resize.
 *
 * @param imageW  Natural image width  (px)
 * @param imageH  Natural image height (px)
 * @param fx      Horizontal fraction 0–1 within image (0 = left edge, 1 = right edge)
 * @param fy      Vertical   fraction 0–1 within image (0 = top  edge, 1 = bottom edge)
 * @returns { x, y } screen pixel coords of that image point
 */
export function useImagePoint(imageW: number, imageH: number, fx: number, fy: number) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function calc() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // object-cover: scale so image fills viewport, preserving aspect ratio
      const scale = Math.max(vw / imageW, vh / imageH)
      const rw = imageW * scale
      const rh = imageH * scale
      // object-center: center the scaled image in viewport
      const ox = (vw - rw) / 2
      const oy = (vh - rh) / 2
      setPos({ x: ox + fx * rw, y: oy + fy * rh })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [imageW, imageH, fx, fy])

  return pos
}
