'use client';

import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, ProductCategory } from '@/data/products';
import ProKitCard from './ProKitCard';

type FilterKey = ProductCategory | 'all';

export default function ProKitRecommendation() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeFilter),
    [activeFilter],
  );

  return (
    <section
      className="px-5 pt-10 pb-16"
      aria-label="Pro kit recommendations"
    >
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-px bg-white/20" />
            <span className="font-display text-[10px] font-bold tracking-[0.16em] uppercase text-white/28">
              Curated gear
            </span>
          </div>
          <h2 className="font-display text-[26px] font-extrabold tracking-tight leading-none text-white">
            What the <span className="text-volt">Pros</span> Use
          </h2>
        </div>
        <p className="text-[11px] text-white/18 italic leading-relaxed max-w-[200px] text-right">
          Affiliate links · we earn a small commission at no cost to you
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-5" role="group" aria-label="Filter by category">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key as FilterKey)}
            aria-pressed={activeFilter === key}
            className={[
              'font-display text-[10px] font-bold tracking-[0.1em] uppercase',
              'px-3.5 py-1.5 rounded-full border transition-all duration-150',
              activeFilter === key
                ? 'bg-volt/[0.07] border-volt/[0.20] text-volt'
                : 'bg-transparent border-white/[0.1] text-white/28 hover:border-white/20 hover:text-white/55',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bento grid — matches MatchHistory grid exactly */}
      {filtered.length > 0 ? (
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          }}
        >
          {filtered.map((product, i) => (
            <ProKitCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="font-display text-[16px] font-bold text-white/50 mb-1">
            Nothing here yet
          </p>
          <p className="text-[12px] text-white/15">Check back soon</p>
        </div>
      )}

      {/* Editorial disclosure */}
      <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="flex-shrink-0 mt-px opacity-20"
          aria-hidden
        >
          <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" />
          <path d="M8 7v4M8 5.2v.6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p className="text-[11px] text-white/22 italic leading-relaxed">
          These are hand-picked items based on what club players and professionals actually use on court.
          Prices are approximate and may vary. Links go to Amazon — we may earn a small commission
          on purchases, which helps keep PadelScorePro free.
        </p>
      </div>

      {/* Stagger-in animation */}
      <style>{`
        article[aria-label] {
          animation: proKitIn 0.45s ease both;
        }
        @keyframes proKitIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
