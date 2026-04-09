'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 border-b border-white/[0.07] bg-[#050505]/85 backdrop-blur-xl">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-7 h-7 bg-volt rounded-[7px] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#050505" strokeWidth="1.4" />
            <path d="M7 4v3l2 1.5" stroke="#050505" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-display text-[17px] font-bold tracking-[0.04em] uppercase text-white">
          Padel<span className="text-volt">Score</span>Pro
        </span>
      </Link>

      {/* Nav links — hidden on mobile */}
      <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
        {['Features', 'Rules', 'Blog'].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-[13px] font-medium text-white/45 hover:text-white/85 tracking-[0.02em] transition-colors duration-150"
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* Download CTA */}
      <a
        href="#download"
        className="
          inline-flex items-center gap-2
          bg-volt text-[#050505]
          font-display text-[13px] font-bold tracking-[0.08em] uppercase
          px-[18px] py-[9px] rounded-lg border-none
          transition-all duration-250 ease-out
          hover:bg-[#d4ff1a]
          hover:shadow-[0_0_0_1px_#CCFF00,0_0_20px_rgba(204,255,0,0.35),0_0_50px_rgba(204,255,0,0.12)]
          hover:-translate-y-px
          active:translate-y-0 active:shadow-none
        "
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v8M3.5 6.5l3 3 3-3M2 12h9" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Download App
      </a>
    </header>
  );
}
