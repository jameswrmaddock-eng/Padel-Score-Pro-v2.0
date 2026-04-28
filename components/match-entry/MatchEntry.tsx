'use client';

import { useState, useMemo } from 'react';
import { useMatchHistory, Match, SetScore } from '@/hooks/useMatchHistory';
import FloatField from './FloatField';
import SetScoreBlock from './SetScoreBlock';
import SuccessView from './SuccessView';

interface FormState {
  teamA: string;
  teamB: string;
  s1a: string; s1b: string;
  s2a: string; s2b: string;
  s3a: string; s3b: string;
  location: string;
}

const EMPTY: FormState = {
  teamA: '', teamB: '',
  s1a: '', s1b: '',
  s2a: '', s2b: '',
  s3a: '', s3b: '',
  location: '',
};

export default function MatchEntry() {
  const { matches, saveMatch, isHydrated } = useMatchHistory();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saved, setSaved] = useState<Match | null>(null);
  const [error, setError] = useState('');

  const set = (key: keyof FormState) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const set3Needed = useMemo(() => {
    const { s1a, s1b, s2a, s2b } = form;
    if (!s1a || !s1b || !s2a || !s2b) return false;
    const winsA = (Number(s1a) > Number(s1b) ? 1 : 0) + (Number(s2a) > Number(s2b) ? 1 : 0);
    const winsB = (Number(s1b) > Number(s1a) ? 1 : 0) + (Number(s2b) > Number(s2a) ? 1 : 0);
    return winsA === 1 && winsB === 1;
  }, [form]);

  function handleSave() {
    const { teamA, teamB, s1a, s1b } = form;
    if (!teamA.trim() || !teamB.trim() || s1a === '' || s1b === '') {
      setError('Please fill in team names and at least Set 1 scores.');
      return;
    }
    setError('');

    const sets: SetScore[] = [{ a: Number(s1a) || 0, b: Number(s1b) || 0 }];
    if (form.s2a !== '' && form.s2b !== '')
      sets.push({ a: Number(form.s2a) || 0, b: Number(form.s2b) || 0 });
    if (form.s3a !== '' && form.s3b !== '')
      sets.push({ a: Number(form.s3a) || 0, b: Number(form.s3b) || 0 });

    const entry = saveMatch({
      teamA: teamA.trim(),
      teamB: teamB.trim(),
      sets,
      location: form.location.trim() || 'Unspecified',
    });
    setSaved(entry);
  }

  function handleReset() {
    setForm(EMPTY);
    setSaved(null);
    setError('');
  }

  const recentMatches = matches.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-[#050505] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-[#0d0d0d] rounded-[28px] border border-white/[0.08] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
              <span className="font-display text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
                New Entry
              </span>
            </div>
            <h1 className="font-display text-[26px] font-extrabold tracking-tight text-white leading-none">
              Log Match
            </h1>
          </div>
          {isHydrated && (
            <span className="bg-volt/[0.08] border border-volt/20 rounded-full px-3 py-1 font-display text-[11px] font-bold tracking-[0.06em] text-volt">
              {matches.length} saved
            </span>
          )}
        </div>

        {/* Form / Success */}
        {saved ? (
          <SuccessView match={saved} totalSaved={matches.length} onReset={handleReset} />
        ) : (
          <div className="px-7 pt-6 pb-7 space-y-5">

            {/* Teams */}
            <div>
              <p className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3.5">
                Teams
              </p>
              <div className="grid grid-cols-2 gap-5">
                <FloatField id="teamA" label="Team A name" value={form.teamA}
                  onChange={(e) => set('teamA')(e.target.value)} />
                <FloatField id="teamB" label="Team B name" value={form.teamB}
                  onChange={(e) => set('teamB')(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="font-display text-[11px] font-bold tracking-[0.1em] text-white/15">VS</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
            </div>

            {/* Sets */}
            <div>
              <p className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3.5">
                Score — 3 Sets
              </p>
              <div className="grid grid-cols-3 gap-3">
                <SetScoreBlock label="Set 1"
                  valueA={form.s1a} valueB={form.s1b}
                  onChangeA={set('s1a')} onChangeB={set('s1b')} />
                <SetScoreBlock label="Set 2"
                  valueA={form.s2a} valueB={form.s2b}
                  onChangeA={set('s2a')} onChangeB={set('s2b')} />
                <SetScoreBlock label="Set 3"
                  valueA={form.s3a} valueB={form.s3b}
                  onChangeA={set('s3a')} onChangeB={set('s3b')}
                  dimmed={!set3Needed} />
              </div>
              {set3Needed && (
                <p className="text-[11px] text-volt/60 mt-2 font-display font-bold tracking-wide">
                  Sets tied — enter Set 3
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <p className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3.5">
                Location
              </p>
              <FloatField id="location" label="Court / club name" value={form.location}
                onChange={(e) => set('location')(e.target.value)} />
            </div>

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-400">{error}</p>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              className={[
                'w-full mt-2 py-4 rounded-[14px]',
                'font-display text-[15px] font-extrabold tracking-[0.1em] uppercase text-[#050505]',
                'bg-volt flex items-center justify-center gap-2.5',
                'transition-all duration-200 ease-out',
                'hover:bg-[#d4ff1a]',
                'hover:shadow-[0_0_0_1px_rgba(204,255,0,0.5),0_0_28px_rgba(204,255,0,0.35),0_0_60px_rgba(204,255,0,0.12)]',
                'hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
              ].join(' ')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 9l4 4 8-8" stroke="#050505" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Save Match
            </button>
          </div>
        )}

        {/* Recent matches strip */}
        {isHydrated && recentMatches.length > 0 && (
          <div className="border-t border-white/[0.06] px-7 py-4 flex items-center gap-3">
            <span className="font-display text-[10px] font-bold tracking-[0.1em] uppercase text-white/20 whitespace-nowrap">
              Recent
            </span>
            <div className="flex gap-1.5 overflow-hidden">
              {recentMatches.map((m) => (
                <span
                  key={m.id}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-full px-2.5 py-1 font-display text-[10px] font-bold text-white/55 whitespace-nowrap tracking-[0.04em]"
                >
                  {m.teamA.slice(0, 6)} v {m.teamB.slice(0, 6)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes successPop {
          0%  { transform: scale(0); opacity: 0; }
          100%{ transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeIn { animation: fadeUp 0.3s ease both; }
      `}</style>
    </div>
  );
}
