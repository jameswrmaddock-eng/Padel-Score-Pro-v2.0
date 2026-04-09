import type { Metadata } from 'next';
import MatchEntry from '@/components/match-entry/MatchEntry';

export const metadata: Metadata = { title: 'Log Match' };

export default function LogPage() {
  return (
    <main className="bg-[#050505] min-h-screen antialiased">
      <MatchEntry />
    </main>
  );
}
