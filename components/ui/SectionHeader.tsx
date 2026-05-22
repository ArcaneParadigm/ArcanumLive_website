interface SectionHeaderProps {
  eyebrow: string
  heading: string
  accent: string
  subtitle: string
}

/**
 * Sitewide section header.
 *
 * eyebrow  — tiny black badge with white outline (e.g. "Section II")
 * heading  — small label badge above the lead title (e.g. "Immersive")
 * accent   — lead title with diagonal gold gradient (e.g. "Dome Shows")
 * subtitle — body copy beneath
 */
export default function SectionHeader({ eyebrow, heading, accent, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      {/* Eyebrow: tiny black badge, white outline */}
      <span
        className="inline-block text-[8px] font-medium tracking-[0.35em] uppercase px-2 py-0.5 rounded"
        style={{
          background: '#000',
          color: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(255,255,255,0.28)',
        }}
      >
        {eyebrow}
      </span>

      {/* Heading: small badge above lead title */}
      <span
        className="inline-block text-[10px] font-medium tracking-[0.3em] uppercase px-2.5 py-0.5 rounded"
        style={{
          background: '#000',
          color: 'rgba(255,255,255,0.65)',
          border: '1px solid rgba(255,255,255,0.22)',
        }}
      >
        {heading}
      </span>

      {/* Lead title: diagonal gold gradient */}
      <h2
        className="font-cinzel text-2xl md:text-3xl font-bold leading-tight tracking-widest"
        style={{
          background: 'linear-gradient(135deg, #6b4411 0%, #c9973a 22%, #f5d06e 50%, #c9973a 78%, #6b4411 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 16px rgba(201,151,58,0.4))',
        }}
      >
        {accent}
      </h2>

      {/* Subtitle */}
      <p className="font-raleway max-w-xl mx-auto text-silver-mid/60 text-xs leading-relaxed font-light tracking-wide">
        {subtitle}
      </p>
    </div>
  )
}
