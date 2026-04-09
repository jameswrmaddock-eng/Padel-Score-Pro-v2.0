'use client';

import { useState, useMemo } from 'react';
import { useMatchHistory, Match } from '@/hooks/useMatchHistory';
import MatchCard from './MatchCard';
import StatsBar from './StatsBar';

type Filter = 'all' | 'win' | 'loss' | '3set';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',   label: 'All' },
  { key: 'win',   label: 'Wins' },
  { key: 'loss',  label: 'Losses' },
  { key: '3set',  label: '3 Sets' },
];

interface MatchHistoryProps {
  myTeam?: string;
}

export default function MatchHistory({ myTeam = '' }: MatchHistoryProps) {
  const { matches, isHydrated } = useMatchHistory();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo<Match[]>(() => {
    return matches.filter((m) => {
      if (filter === 'win')  return m.winner === myTeam;
      if (filter === 'loss') return m.winner !== myTeam && myTeam !== '';
      if (filter === '3set') return m.sets.length === 3;
      return true;
    }).slice().reverse(); // newest first
  }, [matches, filter, myTeam]);

  const stats = useMemo(() => {
    const wins     = matches.filter((m) => m.winner === myTeam).length;
    const losses   = matches.filter((m) => m.winner !== myTeam && myTeam !== '').length;
    const threeSets = matches.filter((m) => m.sets.length === 3).length;
    return { total: matches.length, wins, losses, threeSets };
  }, [matches, myTeam]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-volt rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] px-5 pt-7 pb-16">

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
            <span className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-volt">
              Season 2026
            </span>
          </div>
          <h1 className="font-display text-[28px] font-extrabold tracking-tight text-white leading-none">
            Match History
          </h1>
        </div>
        <StatsBar {...stats} />
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={[
              'font-display text-[11px] font-bold tracking-[0.08em] uppercase',
              'px-3.5 py-1.5 rounded-full border transition-all duration-150',
              filter === key
                ? 'bg-volt/[0.08] border-volt/[0.18] text-volt'
                : 'bg-transparent border-white/[0.1] text-white/28 hover:border-white/20 hover:text-white/60',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bento grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <rect x="3" y="3" width="14" height="14" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
              <path d="M7 10h6M10 7v6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-display text-[18px] font-bold text-white/40 mb-1.5">No matches found</p>
          <p className="text-[13px] text-white/20">Try a different filter or log your first match</p>
        </div>
      ) : (
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          }}
        >
          {filtered.map((match, idx) => {
            const isFeatured = idx === 0 && filter === 'all' && filtered.length >= 3;
            return (
              <MatchCard
                key={match.id}
                match={match}
                myTeam={myTeam}
                featured={isFeatured}
                style={{
                  gridColumn: isFeatured ? 'span 2' : 'span 1',
                  animationDelay: `${idx * 0.05}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Stagger-in keyframes */}
      <style>{`
        article {
          animation: cardIn 0.4s ease both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
