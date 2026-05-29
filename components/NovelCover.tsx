interface NovelCoverProps {
  title: string
  size?: 'sm' | 'md' | 'lg'
}

const COVER_PALETTE = [
  { bg: 'linear-gradient(160deg, #1a1035 0%, #0f0e17 50%, #2d1b4e 100%)', accent: '#ff8906' },
  { bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)', accent: '#e0c67d' },
  { bg: 'linear-gradient(160deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)', accent: '#a78bfa' },
]

export default function NovelCover({ title, size = 'md' }: NovelCoverProps) {
  const palette = COVER_PALETTE[0]

  const dims = {
    sm: { width: 80, height: 112, fontSize: 9, iconSize: 20 },
    md: { width: 160, height: 224, fontSize: 13, iconSize: 36 },
    lg: { width: 240, height: 336, fontSize: 16, iconSize: 52 },
  }[size]

  return (
    <div
      style={{
        width: dims.width,
        height: dims.height,
        background: palette.bg,
        borderRadius: size === 'lg' ? 8 : 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 12,
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 4px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Decorative lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`
      }} />
      <div style={{
        position: 'absolute', inset: 8,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 4,
        pointerEvents: 'none',
      }} />

      {/* Moon icon */}
      <div style={{ fontSize: dims.iconSize, lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(255,137,6,0.5))' }}>
        🌙
      </div>

      {/* Title */}
      <div style={{
        color: palette.accent,
        fontSize: dims.fontSize,
        fontWeight: 700,
        textAlign: 'center',
        fontFamily: 'serif',
        lineHeight: 1.4,
        letterSpacing: '0.1em',
        wordBreak: 'break-all',
        maxWidth: '100%',
      }}>
        {title}
      </div>

      {/* Bottom decorative dots */}
      <div style={{ display: 'flex', gap: 4, position: 'absolute', bottom: 14 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: '50%',
            background: palette.accent, opacity: 0.5 + i * 0.2
          }} />
        ))}
      </div>
    </div>
  )
}
