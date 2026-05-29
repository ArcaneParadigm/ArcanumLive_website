'use client'

/**
 * Full-featured YouTube player for dedicated watch pages.
 * - Full controls: timeline, volume, fullscreen, quality selector
 * - Audio on by default
 * - No autoplay (user initiates)
 * - Highest resolution: player fills container so YouTube serves HD automatically
 * - Minimal branding via modestbranding + nocookie domain
 */

interface YouTubePlayerProps {
  videoId: string
  title?: string
  /** Autoplay with sound — only use when the user explicitly clicked to watch */
  autoplay?: boolean
  /** Start time in seconds */
  startAt?: number
  className?: string
}

export default function YouTubePlayer({
  videoId,
  title = 'Video',
  autoplay = false,
  startAt,
  className = '',
}: YouTubePlayerProps) {
  const params = new URLSearchParams({
    rel:            '0',   // no related videos at end
    modestbranding: '1',   // suppress YouTube wordmark
    iv_load_policy: '3',   // no annotations / cards
    color:          'white', // white progress bar — cleaner look
    fs:             '1',   // fullscreen button on
    controls:       '1',   // full controls: timeline, volume, quality, fullscreen
    // NOTE: no mute=1 — audio is on
    ...(autoplay ? { autoplay: '1' } : {}),
    ...(startAt   ? { start: String(startAt) } : {}),
  })

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={{ aspectRatio: '16/9', background: '#000' }}
    >
      <iframe
        className="absolute inset-0 w-full h-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        style={{ border: 'none' }}
        // loading="lazy" intentionally omitted on featured players — load immediately
      />
    </div>
  )
}
