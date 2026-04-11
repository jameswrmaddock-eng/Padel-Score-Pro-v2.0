// components/gear/RacketIllustration.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SVG wire-frame racket used as a placeholder while you source real PNGs.
// Replace with <Image> once you have assets in /public/rackets/.
// ─────────────────────────────────────────────────────────────────────────────

type Variant = 'featured' | 'standard' | 'entry';

const CONFIGS: Record<Variant, { stroke: string; textFill: string; handleFill: string }> = {
  featured: {
    stroke:     'rgba(204,255,0,0.35)',
    textFill:   'rgba(204,255,0,0.5)',
    handleFill: 'rgba(204,255,0,0.15)',
  },
  standard: {
    stroke:     'rgba(255,255,255,0.15)',
    textFill:   'rgba(255,255,255,0.35)',
    handleFill: 'rgba(255,255,255,0.08)',
  },
  entry: {
    stroke:     'rgba(255,255,255,0.12)',
    textFill:   'rgba(255,255,255,0.25)',
    handleFill: 'rgba(255,255,255,0.06)',
  },
};

interface RacketIllustrationProps {
  brand: string;
  variant?: Variant;
  className?: string;
}

export default function RacketIllustration({
  brand,
  variant = 'standard',
  className = '',
}: RacketIllustrationProps) {
  const c = CONFIGS[variant];
  const gridColor = variant === 'featured' ? 'rgba(204,255,0,0.07)' : 'rgba(255,255,255,0.04)';

  return (
    <svg
      viewBox="0 0 100 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${brand} racket illustration`}
    >
      {/* Head */}
      <ellipse cx="50" cy="70" rx="37" ry="42" fill="#131313" stroke={c.stroke} strokeWidth="1.5" />
      <ellipse cx="50" cy="70" rx="29" ry="34" fill="none" stroke={gridColor} strokeWidth="1" />

      {/* String grid */}
      {[58, 70, 82].map((y) => (
        <line key={`h${y}`} x1="13" y1={y} x2="87" y2={y} stroke={gridColor} strokeWidth="0.8" />
      ))}
      {[44, 96].map((y) => (
        <line key={`hs${y}`} x1="22" y1={y} x2="78" y2={y} stroke={gridColor} strokeWidth="0.8" />
      ))}
      {[34, 46, 54, 66].map((x) => (
        <line key={`v${x}`} x1={x} y1="28" x2={x} y2="112" stroke={gridColor} strokeWidth="0.8" />
      ))}
      <line x1="50" y1="28" x2="50" y2="112" stroke={gridColor} strokeWidth="0.8" />

      {/* Brand text */}
      <text
        x="50" y="74"
        textAnchor="middle"
        fontSize="6"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fill={c.textFill}
        letterSpacing="0.5"
      >
        {brand.toUpperCase()}
      </text>

      {/* Handle */}
      <rect x="43" y="111" width="14" height="52" rx="7" fill="#0e0e0e" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="45" y="113" width="10" height="20" rx="4" fill={c.handleFill} />
      <rect x="45" y="135" width="10" height="4" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="45" y="141" width="10" height="4" rx="2" fill="rgba(255,255,255,0.03)" />

      {/* Butt cap */}
      <ellipse cx="50" cy="163" rx="4" ry="2.5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
    </svg>
  );
}
