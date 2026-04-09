'use client';

import { ChangeEvent } from 'react';

interface SetScoreBlockProps {
  label: string;
  valueA: string;
  valueB: string;
  dimmed?: boolean;
  onChangeA: (v: string) => void;
  onChangeB: (v: string) => void;
}

export default function SetScoreBlock({
  label,
  valueA,
  valueB,
  dimmed = false,
  onChangeA,
  onChangeB,
}: SetScoreBlockProps) {
  const scoreInputClass = [
    'flex-1 min-w-0 bg-transparent border-0 border-b border-white/10 outline-none',
    'font-display text-[22px] font-extrabold text-white text-center',
    'caret-volt transition-colors duration-200 py-1 px-0.5',
    'focus:border-volt focus:text-volt',
    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  ].join(' ');

  return (
    <div
      className={[
        'rounded-2xl p-3.5 border border-white/[0.07] bg-white/[0.03]',
        'transition-opacity duration-300',
        dimmed ? 'opacity-40' : 'opacity-100',
      ].join(' ')}
    >
      <p className="font-display text-[9px] font-bold tracking-[0.12em] uppercase text-white/20 text-center mb-2.5">
        {label}
      </p>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={99}
          value={valueA}
          placeholder="0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeA(e.target.value)}
          className={scoreInputClass}
          disabled={dimmed}
          style={{ borderRadius: 0, borderBottomWidth: '1px' }}
          aria-label={`${label} score for Team A`}
        />
        <span className="font-display text-sm font-light text-white/15 flex-shrink-0">–</span>
        <input
          type="number"
          min={0}
          max={99}
          value={valueB}
          placeholder="0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeB(e.target.value)}
          className={scoreInputClass}
          disabled={dimmed}
          style={{ borderRadius: 0, borderBottomWidth: '1px' }}
          aria-label={`${label} score for Team B`}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="font-display text-[9px] font-bold tracking-[0.06em] uppercase text-white/15">A</span>
        <span className="font-display text-[9px] font-bold tracking-[0.06em] uppercase text-white/15">B</span>
      </div>
    </div>
  );
}
