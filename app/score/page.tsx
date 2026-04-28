// app/score/page.tsx
import type { Metadata } from 'next';
import Header       from '@/components/layout/Header';
import MatchScorer  from '@/components/scorer/MatchScorer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Score a Match — PadelScorePro',
  description: 'Track your padel match in real time. Free, no account needed.',
};

export default function ScorePage() {
  return (
    <main
      className="min-h-screen bg-[#050505] antialiased"
      style={{
        backgroundImage: 'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
        backgroundSize:  '20px 20px',
      }}
    >
      <Header />

      {/* Hero prompt above the scorer */}
      <div className="max-w-lg mx-auto px-5 pt-12 pb-4 text-center">
        <p className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-white mb-2">
          • NEW MATCH
        </p>
        <h1 className="font-sans text-[clamp(28px,5vw,40px)] font-black tracking-[-0.03em] uppercase text-volt leading-none mb-3">
          Match Settings
        </h1>
        <p className="font-sans text-[14px] text-white/65 leading-relaxed">
          Set up your teams, pick your format, and tap to score. Exactly what&apos;s in the app.
        </p>
      </div>

      {/* Scorer */}
      <div className="px-5 pb-20">
        <MatchScorer />
      </div>
    </main>
  );
}
