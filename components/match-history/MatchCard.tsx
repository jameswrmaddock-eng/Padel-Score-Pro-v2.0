'use client';

import { useState } from 'react';
import { Match } from '@/hooks/useMatchHistory';
import { shareToWhatsApp } from '@/utils/whatsapp';

interface MatchCardProps {
  match: Match;
  myTeam?: string;
  featured?: boolean;
  style?: React.CSSProperties;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function LocationIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
      <circle cx="5.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1" />
      <path
        d="M5.5 2C3.57 2 2 3.57 2 5.5c0 2.76 3.5 5 3.5 5s3.5-2.24 3.5-5C9 3.57 7.43 2 5.5 2z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M6.5 9v2M4.5 11h4" stroke="#CCFF00" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 2h7v4a3.5 3.5 0 01-7 0V2z" stroke="#CCFF00" strokeWidth="1.2" />
      <path
        d="M3 3.5H1.5v1.5A2 2 0 003 6.8M10 3.5h1.5v1.5A2 2 0 0110 6.8"
        stroke="#CCFF00"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MatchCard({ match, featured = false, style }: MatchCardProps) {
  const [shareState, setShareState] = useState<'idle' | 'shared'>('idle');

  const teamAWins = match.sets.filter((s) => s.a > s.b).length;
  const teamBWins = match.sets.filter((s) => s.b > s.a).length;
  const aIsWinner = teamAWins > teamBWins;

  function handleShare() {
    shareToWhatsApp(match);
    setShareState('shared');
    setTimeout(() => setShareState('idle'), 2500);
  }

  function SetBadges({ side }: { side: 'a' | 'b' }) {
    return (
      <>
        {match.sets.map((s, i) => {
          const won = side === 'a' ? s.a > s.b : s.b > s.a;
          const score = side === 'a' ? s.a : s.b;
          return (
            <span
              key={i}
              className={[
                'font-display text-[13px] font-bold px-1.5 py-0.5 rounded-md min-w-[28px] text-center',
                won
                  ? 'bg-volt/10 text-volt'
                  : 'bg-white/[0.03] text-white/20',
              ].join(' ')}
            >
              {score}
            </span>
          );
        })}
      </>
    );
  }

  return (
    <article
      className={[
        'group relative flex flex-col rounded-[20px] border p-[18px] pb-[14px]',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5',
        featured
          ? 'bg-[#0c110a] border-volt/[0.18] hover:bg-[#0f1510] hover:border-volt/[0.28] col-span-2 max-sm:col-span-1'
          : 'bg-[#0e0e0e] border-white/[0.07] hover:bg-[#131313] hover:border-white/[0.1]',
      ].join(' ')}
      style={style}
      aria-label={`Match: ${match.teamA} vs ${match.teamB}, winner ${match.winner}`}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-[20px] pointer-events-none"
        style={{
          background: featured
            ? 'linear-gradient(90deg, transparent, rgba(204,255,0,0.15), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />

      {/* Card header */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-[10px] font-semibold tracking-[0.1em] uppercase text-white/[0.14]">
            {match.date}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/28">
            <LocationIcon />
            {match.location}
          </span>
        </div>
        <span className="font-display text-[10px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/[0.14] whitespace-nowrap">
          {match.sets.length} set{match.sets.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Teams & scores */}
      <div className="flex flex-col gap-2.5 flex-1 mb-3.5">
        {/* Team A */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className={[
                'w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0',
                'font-display text-[11px] font-extrabold',
                aIsWinner
                  ? 'bg-volt/[0.12] text-volt'
                  : 'bg-white/[0.04] text-white/25',
              ].join(' ')}
            >
              {initials(match.teamA)}
            </div>
            <span
              className={[
                'font-display text-[15px] font-bold tracking-tight truncate',
                aIsWinner ? 'text-white' : 'text-white/28',
              ].join(' ')}
            >
              {match.teamA}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <SetBadges side="a" />
            <span
              className={[
                'font-display text-[18px] font-extrabold tracking-tight ml-1',
                aIsWinner ? 'text-volt' : 'text-white/[0.18]',
              ].join(' ')}
            >
              {teamAWins}
            </span>
          </div>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className={[
                'w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0',
                'font-display text-[11px] font-extrabold',
                !aIsWinner
                  ? 'bg-volt/[0.12] text-volt'
                  : 'bg-white/[0.04] text-white/25',
              ].join(' ')}
            >
              {initials(match.teamB)}
            </div>
            <span
              className={[
                'font-display text-[15px] font-bold tracking-tight truncate',
                !aIsWinner ? 'text-white' : 'text-white/28',
              ].join(' ')}
            >
              {match.teamB}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <SetBadges side="b" />
            <span
              className={[
                'font-display text-[18px] font-extrabold tracking-tight ml-1',
                !aIsWinner ? 'text-volt' : 'text-white/[0.18]',
              ].join(' ')}
            >
              {teamBWins}
            </span>
          </div>
        </div>
      </div>

      {/* Hairline divider */}
      <div className="h-px bg-white/[0.05] mb-3" />

      {/* Card footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <TrophyIcon />
          <span className="font-display text-[10px] font-bold tracking-[0.1em] uppercase text-volt truncate">
            {match.winner}
          </span>
        </div>

        <button
          onClick={handleShare}
          aria-label={`Share ${match.teamA} vs ${match.teamB} to WhatsApp`}
          className={[
            'inline-flex items-center gap-1.5 font-display text-[10px] font-bold tracking-[0.08em] uppercase',
            'px-2.5 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap',
            shareState === 'shared'
              ? 'bg-volt/[0.08] border-volt/[0.18] text-volt'
              : 'bg-transparent border-white/[0.1] text-white/28 hover:bg-[#25D366]/[0.08] hover:border-[#25D366]/30 hover:text-[#25D366]',
          ].join(' ')}
        >
          {shareState === 'shared' ? (
            <>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Shared!
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </article>
  );
}
