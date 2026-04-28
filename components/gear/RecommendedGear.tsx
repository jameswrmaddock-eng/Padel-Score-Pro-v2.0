'use client';
// components/gear/RecommendedGear.tsx

import { GEAR_PRODUCTS } from '@/data/gearData';
import GearCard from './GearCard';

export default function RecommendedGear() {
  return (
    <section className="px-10 py-16 max-sm:px-5 max-sm:py-10" aria-labelledby="gear-heading">

      {/* Section header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-px bg-white/20" />
          <span className="font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-white/55">
            Curated gear
          </span>
        </div>

        <h2
          id="gear-heading"
          className="font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-white"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
        >
          The Pro{' '}
          <span className="text-volt">Kit.</span>
        </h2>

        <p className="font-sans text-[14px] text-white/60 mt-3 max-w-[440px] leading-relaxed">
          Three rackets trusted by club players and touring professionals. Chosen for build
          quality, feel, and longevity — not margin.
        </p>
        <p className="font-sans text-[11px] text-white/18 mt-1.5 italic">
          Affiliate links · we earn a small commission at no cost to you
        </p>
      </div>

      {/* Bento grid — 3 cols desktop, 1 col mobile */}
      <div
        className="grid gap-3 max-sm:grid-cols-1"
        style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
      >
        {GEAR_PRODUCTS.map((product, i) => (
          <GearCard
            key={product.id}
            product={product}
            animDelay={i * 0.08}
          />
        ))}
      </div>

      {/* Editorial disclosure */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className="flex-shrink-0 mt-px opacity-20"
          aria-hidden
        >
          <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.2" />
          <path d="M7 6.5v3M7 4.5v.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p className="font-sans text-[11px] text-white/20 italic leading-relaxed">
          Hand-picked based on what club players and professionals actually use on court. Prices
          are approximate and may vary. Links go to Amazon — we earn a small commission on
          purchases, which keeps PadelScorePro free.
        </p>
      </div>

      {/* Stagger-in keyframes */}
      <style>{`
        article[aria-label] {
          animation: gearCardIn 0.45s ease both;
        }
        @keyframes gearCardIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </section>
  );
}
