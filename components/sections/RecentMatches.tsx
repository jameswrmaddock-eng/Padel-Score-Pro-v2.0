'use client';

import { useState, useMemo } from 'react';
import { MATCHES, Match, MatchStatus } from '@/data/matches';
import MatchCard from '@/components/sections/MatchCard';

type Filter = 'all' | MatchStatus | '3set';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',   label: 'All'    },
  { key: 'live',  label: 'Live'   },
  { key: 'final', label: 'Final'  },
  { key: '3set',  label: '3 Sets' },
];

const MY_TEAM = 'Los Tigres';

export default function RecentMatches() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo<Match[]>(() => {
    return MATCHES.filter((m) => {
      if (filter === 'live')  return m.status === 'live';
      if (filter === 'final') return m.status === 'final';
      if (filter === '3set')  return m.sets.length === 3;
      return true;
    });
  }, [filter]);

  const stats = useMemo(() => {
    const wins      = MATCHES.filter((m) => {
      const wA = m.sets.filter((s) => s.a > s.b).length;
      const wB = m.sets.filter((s) => s.b > s.a).length;
      const winner = wA > wB ? m.teamA : wB > wA ? m.teamB : null;
      return winner === MY_TEAM;
    }).length;
    const liveCount = MATCHES.filter((m) => m.status === 'live').length;
    const threeSets = MATCHES.filter((m) => m.sets.length === 3).length;
    const winRate   = MATCHES.length > 0 ? Math.round((wins / MATCHES.length) * 100) : 0;
    return { total: MATCHES.length, wins, winRate, threeSets, liveCount };
  }, []);

  return (
    <section className="px-10 py-16 max-sm:px-5 max-sm:py-10" aria-labelledby="recent-matches-heading">

      {/* Section header */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-volt animate-[livePulse_2s_ease-in-out_infinite]" />
            <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
              Season 2026
            </span>
          </div>
          <h2
            id="recent-matches-heading"
            className="font-sans text-[28px] font-black tracking-[-0.03em] uppercase text-white leading-none"
          >
            Recent Matches
          </h2>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Filter pills */}
          <div className="flex gap-1.5" role="group" aria-label="Filter matches">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={[
                  'font-sans text-[11px] font-bold tracking-[0.08em] uppercase',
                  'px-3.5 py-1.5 rounded-full border transition-all duration-300 ease-in-out',
                  filter === key
                    ? 'bg-volt/[0.08] border-volt/25 text-volt'
                    : 'bg-transparent border-white/10 text-white/35 hover:border-white/20 hover:text-white/60',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <a
            href="/history"
            className="flex items-center gap-1.5 font-sans text-[12px] font-semibold text-white/35 hover:text-white/75 transition-colors duration-300 ease-in-out"
          >
            View all
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex overflow-hidden rounded-2xl border border-[#2A2A2A] mb-7 max-sm:flex-col">
        {[
          { num: stats.total,           label: 'Matches played' },
          { num: stats.wins,            label: 'Wins'           },
          { num: `${stats.winRate}%`,   label: 'Win rate'       },
          { num: stats.threeSets,       label: '3-set battles'  },
          { num: stats.liveCount,       label: 'Live now'       },
        ].map((s, i, arr) => (
          <div
            key={s.label}
            className={[
              'flex-1 px-6 py-5 bg-[#1A1A1A]',
              i < arr.length - 1
                ? 'border-r border-[#2A2A2A] max-sm:border-r-0 max-sm:border-b'
                : '',
            ].join(' ')}
          >
            <p className="font-mono text-[28px] font-bold tracking-[-0.03em] leading-none text-volt">
              {s.num}
            </p>
            <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-white/30 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bento grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-sans text-[15px] font-bold text-white/25">No matches found</p>
          <p className="font-sans text-[12px] text-white/15 mt-1">Try a different filter</p>
        </div>
      ) : (
        <div
          className="grid gap-2.5 max-sm:grid-cols-1"
          style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}
        >
          {filtered.map((match, i) => (
            <MatchCard
              key={match.id}
              match={match}
              myTeam={MY_TEAM}
              featured={match.featured && filter === 'all'}
              animDelay={i * 0.05}
            />
          ))}
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
    </section>
  );
}
