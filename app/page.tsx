import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import RecentMatches from '@/components/sections/RecentMatches';
import RecommendedGear from '@/components/gear/RecommendedGear';

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen antialiased">
      <Header />
      <Hero />
      <div className="h-px bg-white/[0.06] mx-10" />
      <RecommendedGear />
    </main>
  );
}