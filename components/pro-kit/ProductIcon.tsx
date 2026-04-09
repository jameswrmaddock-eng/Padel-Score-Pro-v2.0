import { ProductCategory } from '@/data/products';

interface ProductIconProps {
  category: ProductCategory;
  className?: string;
}

export default function ProductIcon({ category, className = '' }: ProductIconProps) {
  const base = 'w-full h-full';

  if (category === 'racket') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={`${base} ${className}`} aria-hidden>
        <ellipse cx="40" cy="30" rx="22" ry="26" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <ellipse cx="40" cy="30" rx="14" ry="17" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="40" y1="4"  x2="40" y2="56" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="18" y1="20" x2="62" y2="20" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="18" y1="30" x2="62" y2="30" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="18" y1="40" x2="62" y2="40" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <rect x="36" y="55" width="8" height="18" rx="4" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      </svg>
    );
  }

  if (category === 'ball') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={`${base} ${className}`} aria-hidden>
        <circle cx="40" cy="40" r="26" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <path d="M20 28 Q40 36 60 28" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
        <path d="M20 52 Q40 44 60 52" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="40" r="3.5" fill="rgba(255,255,255,0.07)" />
      </svg>
    );
  }

  if (category === 'shoe') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={`${base} ${className}`} aria-hidden>
        <path
          d="M12 52 L18 36 Q22 28 34 27 L58 31 Q67 33 68 42 L68 52 Z"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.8"
          fill="none"
        />
        <path d="M12 52 L68 52" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
        <path d="M30 27 L30 37 M42 28 L42 38 M54 30 L54 40"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>
    );
  }

  if (category === 'bag') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={`${base} ${className}`} aria-hidden>
        <rect x="14" y="28" width="52" height="36" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="1.8" />
        <path
          d="M28 28 L28 22 Q28 15 40 15 Q52 15 52 22 L52 28"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="14" y1="41" x2="66" y2="41" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="40" cy="51" r="3" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </svg>
    );
  }

  /* accessory — checkmark circle */
  return (
    <svg viewBox="0 0 80 80" fill="none" className={`${base} ${className}`} aria-hidden>
      <circle cx="40" cy="40" r="22" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8" />
      <path
        d="M30 40 L37 47 L52 32"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
