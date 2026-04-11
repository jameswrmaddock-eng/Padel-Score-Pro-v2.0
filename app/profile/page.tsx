// app/profile/page.tsx
import type { Metadata } from 'next';
import PlayerProfile from '@/components/profile/PlayerProfile';

export const metadata: Metadata = { title: 'Player Profile' };

export default function ProfilePage() {
  return (
    <main className="bg-[#050505] min-h-screen antialiased"
      style={{
        backgroundImage: 'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-10 py-16 max-sm:px-5 max-sm:py-10">

        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-volt" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:'11px', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#CCFF00' }}>
              Season 2026
            </span>
          </div>
          <h1 style={{ fontFamily:'Inter,sans-serif', fontSize:'28px', fontWeight:900, letterSpacing:'-0.03em', textTransform:'uppercase', color:'#fff', lineHeight:1 }}>
            Your Stats
          </h1>
        </div>

        {/* Profile module — pass userId when Supabase is wired up */}
        <PlayerProfile />

      </div>
    </main>
  );
}
