import type { Metadata } from 'next';
import MatchHistory from '@/components/match-history/MatchHistory';
import ProKitRecommendation from '@/components/pro-kit/ProKitRecommendation';

export const metadata: Metadata = { title: 'Match History' };

export default function HistoryPage() {
  return (
    <main className="bg-[#050505] min-h-screen antialiased">
      <MatchHistory myTeam="Los Tigres" />
      <div className="h-px bg-white/[0.05] mx-5" />
      <ProKitRecommendation />
    </main>
  );
}
