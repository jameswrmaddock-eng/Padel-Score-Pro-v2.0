'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="
        sticky top-0 z-50 h-16
        flex items-center justify-between
        border-b border-white/[0.07]
        bg-[#050505]/85 backdrop-blur-xl

        /* Command C: horizontal padding gives logo + button breathing room
           on all screen sizes. px-4 on mobile, px-10 on desktop. */
        px-4 sm:px-6 md:px-10
        gap-3 sm:gap-4
      "
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 flex-shrink-0"
        aria-label="PadelScorePro home"
      >
        <div className="w-7 h-7 bg-volt rounded-[7px] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="#050505" strokeWidth="1.4" />
            <path d="M7 4v3l2 1.5" stroke="#050505" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Full name on sm+, abbreviated on xs */}
        <span className="font-sans font-bold tracking-[0.04em] uppercase text-white leading-none">
          <span className="hidden sm:inline text-[17px]">
            Padel<span className="text-volt">Score</span>Pro
          </span>
          <span className="sm:hidden text-[15px]">
            PSP<span className="text-volt">.</span>
          </span>
        </span>
      </Link>

      {/* Nav links — hidden on mobile, shown md+ */}
      <nav className="hidden md:flex items-center gap-8 flex-1 justify-center" aria-label="Primary">
        {[
          { label: 'Features', href: '/features' },
          { label: 'Rules',    href: '/rules'    },
          { label: 'Blog',     href: '/blog'     },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="font-sans text-[13px] font-medium text-white/45 hover:text-white/85 tracking-[0.02em] transition-colors duration-300 ease-in-out"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* CTA — Command C: flex-shrink-0 prevents it ever being crushed,
          icon + text are centered at all sizes */}
      <a
        href="/score"
        className="
          flex-shrink-0
          inline-flex items-center justify-center gap-2
          bg-volt text-[#050505]
          font-sans font-bold tracking-[0.08em] uppercase
          rounded-lg border-none cursor-pointer
          transition-all duration-300 ease-in-out
          header-cta-btn

          /* Comfortable tap target on mobile, standard on desktop */
          text-[12px] px-3 py-2
          sm:text-[13px] sm:px-[18px] sm:py-[9px]
        "
        aria-label="Start scoring"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="flex-shrink-0">
          <path
            d="M6.5 1v8M3.5 6.5l3 3 3-3M2 12h9"
            stroke="#050505"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Full label sm+, short label on xs */}
        <span className="hidden sm:inline">Start Scoring</span>
        <span className="sm:hidden">Score</span>
      </a>

      <style>{`
        .header-cta-btn:hover {
          background: #d4ff1a;
          box-shadow: 0 0 0 1px rgba(204,255,0,0.5), 0 0 20px rgba(204,255,0,0.3);
          transform: translateY(-1px);
        }
        .header-cta-btn:active { transform: translateY(0); box-shadow: none; }
      `}</style>
    </header>
  );
}
