'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Maps a fractional point inside an image (rendered with object-cover object-center)
 * to absolute pixel coords within the container, updating via ResizeObserver.
 * Uses the container element's actual rendered size — immune to extension sidebars,
 * scrollbars, or anything else that changes CSS viewport without firing window resize.
 *
 * @param containerRef  ref attached to the hero container element
 * @param imageW        Natural image width  (px)
 * @param imageH        Natural image height (px)
 * @param fx            Horizontal fraction 0–1 within image
 * @param fy            Vertical   fraction 0–1 within image
 * @returns { x, y } pixel coords relative to container top-left
 */
export function useImagePoint(
  containerRef: React.RefObject<HTMLElement | null>,
  imageW: number,
  imageH: number,
  fx: number,
  fy: number,
) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function calc(vw: number, vh: number) {
      const scale = Math.max(vw / imageW, vh / imageH)
      const rw = imageW * scale
      const rh = imageH * scale
      const ox = (vw - rw) / 2
      const oy = (vh - rh) / 2
      setPos({ x: ox + fx * rw, y: oy + fy * rh })
    }

    // ResizeObserver fires whenever the element's box changes — catches
    // extension sidebars, zoom changes, scrollbar appearance, everything.
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      calc(width, height)
    })
    ro.observe(el)

    // Initial calc
    calc(el.clientWidth, el.clientHeight)

    return () => ro.disconnect()
  }, [containerRef, imageW, imageH, fx, fy])

  return pos
}
