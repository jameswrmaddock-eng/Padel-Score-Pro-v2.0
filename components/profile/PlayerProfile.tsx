'use client';
// components/profile/PlayerProfile.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Orchestration component. Pulls data from useUserStats and composes
// all sub-components. Adding a userId prop in future auto-switches
// the hook to fetch from Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import { useUserStats } from '@/hooks/useUserStats';
import PlayerAvatar from './PlayerAvatar';
import WinRateDial from './WinRateDial';
import RecentFormChart from './RecentFormChart';
import SurfaceStats from './SurfaceStats';

interface PlayerProfileProps {
  userId?: string;  // undefined = local data; populated = cloud fetch
}

const GLASS = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
} as const;

const LABEL_STYLE = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.25)',
  marginBottom: '16px',
};

function SkeletonCard({ height = 200 }: { height?: number }) {
  return (
    <div style={{ ...GLASS, height, padding: '28px' }}>
      <div style={{ width: '60%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '20px' }} />
      <div style={{ width: '100%', height: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }} />
    </div>
  );
}

export default function PlayerProfile({ userId }: PlayerProfileProps) {
  const { stats, isLoading, isError, errorMessage, refresh } = useUserStats(userId);

  if (isError) {
    return (
      <div style={{ ...GLASS, padding: '40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
          {errorMessage ?? 'Failed to load stats'}
        </p>
        <button
          onClick={refresh}
          style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 24px', borderRadius: '8px', background: '#CCFF00', color: '#050505', border: 'none', cursor: 'pointer' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gridTemplateRows: 'auto auto', gap: '10px' }}>
        <div style={{ gridRow: 'span 2' }}><SkeletonCard height={480} /></div>
        <SkeletonCard height={220} />
        <SkeletonCard height={220} />
        <SkeletonCard height={220} />
        <SkeletonCard height={220} />
      </div>
    );
  }

  const quickStats = [
    { label: 'Matches played',  value: String(stats.matchesPlayed),                            volt: false },
    { label: 'Wins',            value: String(stats.wins),                                      volt: true  },
    { label: 'Sets won',        value: String(stats.setsWon),                                   volt: false },
    { label: 'Avg sets / match',value: stats.avgSetsPerMatch.toFixed(1),                        volt: false },
    { label: 'Current streak',  value: stats.currentStreak,                                     volt: true  },
    { label: 'Best streak',     value: `W${stats.bestStreak}`,                                  volt: false },
  ];

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gridTemplateRows: 'auto auto', gap: '10px' }}
      className="max-lg:grid-cols-2 max-sm:grid-cols-1"
    >
      {/* ── Identity card — spans 2 rows ──────────────────────────────────── */}
      <div
        style={{ ...GLASS, gridRow: 'span 2', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        className="max-lg:row-span-1"
      >
        <PlayerAvatar initials={stats.initials} avatarUrl={stats.avatarUrl} size={96} />

        <div style={{ marginTop: '20px', marginBottom: '4px', fontFamily: 'Inter,sans-serif', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', textAlign: 'center' }}>
          {stats.displayName}
        </div>
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px', letterSpacing: '0.02em', textAlign: 'center' }}>
          {stats.handle} · {stats.club}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.2)', borderRadius: '100px', padding: '5px 14px', fontFamily: 'Inter,sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#CCFF00', marginBottom: '24px' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M5 1l1.2 2.4L9 3.8 7 5.8l.5 2.7L5 7.2 2.5 8.5 3 5.8 1 3.8l2.8-.4z" fill="#CCFF00" />
          </svg>
          {stats.level}
        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quickStats.map((s) => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                {s.label}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, color: s.volt ? '#CCFF00' : '#fff' }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <button
          style={{ marginTop: '24px', width: '100%', fontFamily: 'Inter,sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 0', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
        >
          Edit Profile
        </button>
      </div>

      {/* ── Win rate dial ──────────────────────────────────────────────────── */}
      <WinRateDial
        winRate={stats.winRate}
        wins={stats.wins}
        losses={stats.losses}
        threeSetsWins={stats.threeSetsWins}
      />

      {/* ── Current form streak card ───────────────────────────────────────── */}
      <div style={{ ...GLASS, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={LABEL_STYLE}>Current Form</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '28px', fontWeight: 700, color: '#CCFF00', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {stats.currentStreak}
            </p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '3px' }}>Streak</p>
          </div>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '28px', fontWeight: 700, color: '#CCFF00', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {stats.bestStreak}
            </p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '3px' }}>Best ever</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {stats.recentForm.map((f) => (
            <div
              key={f.matchId}
              title={`${f.opponent} · ${f.sets}`}
              style={{
                width: '28px', height: '28px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Inter,sans-serif', fontSize: '9px', fontWeight: 800,
                background: f.result === 'W' ? 'rgba(204,255,0,0.12)' : 'rgba(255,255,255,0.04)',
                border: f.result === 'W' ? '1px solid rgba(204,255,0,0.25)' : '1px solid rgba(255,255,255,0.08)',
                color: f.result === 'W' ? '#CCFF00' : 'rgba(255,255,255,0.25)',
              }}
            >
              {f.result}
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent form bar chart ─────────────────────────────────────────── */}
      <RecentFormChart form={stats.recentForm} />

      {/* ── Surface breakdown ─────────────────────────────────────────────── */}
      <SurfaceStats stats={stats.surfaceStats} />
    </div>
  );
}
