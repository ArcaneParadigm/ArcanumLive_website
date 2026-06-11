'use client'

import { useState, useEffect } from 'react'

/** True when viewport is landscape AND narrower than 1024px (phone/tablet sideways) */
export function useLandscapeMobile() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const check = () => setOn(window.innerWidth < 1024 && window.innerWidth > window.innerHeight)
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])
  return on
}
