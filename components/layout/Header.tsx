'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Rules',    href: '/rules'    },
  { label: 'Blog',     href: '/blog'     },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="
          sticky top-0 z-50 h-16
          flex items-center justify-between
          border-b border-white/[0.07]
          bg-[#050505]/85 backdrop-blur-xl
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
          <span className="font-sans font-bold tracking-[0.04em] uppercase text-white leading-none">
            <span className="hidden sm:inline text-[17px]">
              Padel<span className="text-volt">S</span>corePro
            </span>
            <span className="sm:hidden text-[15px]">
              PSP<span className="text-volt">.</span>
            </span>
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center" aria-label="Primary">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-sans text-[13px] font-medium text-white/45 hover:text-white/85 tracking-[0.02em] transition-colors duration-300 ease-in-out"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side — CTA + hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/score"
            className="
              inline-flex items-center justify-center gap-2
              bg-volt text-[#050505]
              font-sans font-bold tracking-[0.08em] uppercase
              rounded-lg border-none cursor-pointer
              transition-all duration-300 ease-in-out
              header-cta-btn
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
            <span className="hidden sm:inline">Start Scoring</span>
            <span className="sm:hidden">Score</span>
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] gap-[5px] flex-shrink-0"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-[14px] h-[1.5px] bg-white/60 transition-all duration-200 origin-center"
              style={menuOpen ? { transform: 'translateY(6.5px) rotate(45deg)' } : {}}
            />
            <span
              className="block w-[14px] h-[1.5px] bg-white/60 transition-all duration-200"
              style={menuOpen ? { opacity: 0 } : {}}
            />
            <span
              className="block w-[14px] h-[1.5px] bg-white/60 transition-all duration-200 origin-center"
              style={menuOpen ? { transform: 'translateY(-6.5px) rotate(-45deg)' } : {}}
            />
          </button>
        </div>

        <style>{`
          .header-cta-btn:hover {
            background: #d4ff1a;
            box-shadow: 0 0 0 1px rgba(204,255,0,0.5), 0 0 20px rgba(204,255,0,0.3);
            transform: translateY(-1px);
          }
          .header-cta-btn:active { transform: translateY(0); box-shadow: none; }
        `}</style>
      </header>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav
          className="md:hidden sticky top-16 z-40 border-b border-white/[0.07] bg-[#050505]/95 backdrop-blur-xl"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-6 py-4 font-sans text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/[0.03] border-b border-white/[0.05] last:border-0 transition-colors duration-200"
            >
              {label}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
