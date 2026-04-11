// app/rules/page.tsx
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import RulesContent from '@/components/rules/RulesContent';

export const metadata: Metadata = {
  title: 'Padel Rules — PadelScorePro',
  description:
    'The complete padel rules guide. Court dimensions, scoring, serving, walls, deuce modes and common faults — fully updated for 2026.',
};

export default function RulesPage() {
  return (
    <main
      className="min-h-screen bg-[#050505] antialiased"
      style={{
        backgroundImage:
          'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Header />
      <RulesContent />
    </main>
  );
}
