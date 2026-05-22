import Image from 'next/image'

interface SectionImageProps {
  /** Drop in a real image URL when ready — leave undefined for the golden placeholder */
  src?: string
  alt?: string
  aspectRatio?: string
  /** Symbol shown in placeholder center */
  glyph?: string
  /** Label shown at bottom of placeholder */
  caption?: string
  className?: string
}

export default function SectionImage({
  src,
  alt = '',
  aspectRatio = '16/9',
  glyph = '◈',
  caption,
  className = '',
}: SectionImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        aspectRatio,
        boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.18), 0 12px 48px rgba(0,0,0,0.7)',
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        /* ── Placeholder frame ── */
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            background:
              'linear-gradient(160deg, rgba(201,151,58,0.07) 0%, rgba(8,6,14,0.98) 50%, rgba(192,200,208,0.04) 100%)',
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(201,151,58,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,58,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Central glyph */}
          <span
            className="select-none font-cinzel"
            style={{ fontSize: '5rem', color: 'rgba(201,151,58,0.08)', lineHeight: 1 }}
          >
            {glyph}
          </span>
          {/* Corner brackets */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-gold/25 rounded-tl" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-gold/25 rounded-tr" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-gold/25 rounded-bl" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-gold/25 rounded-br" />
          {/* Swap label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="text-gold/20 text-[10px] tracking-[0.35em] uppercase">
              {caption ?? 'Add Image'}
            </span>
          </div>
        </div>
      )}

      {/* Permanent inner rim */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(201,151,58,0.12)' }}
      />
    </div>
  )
}
