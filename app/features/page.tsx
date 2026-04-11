// app/features/page.tsx
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import FeaturesContent from '@/components/features/FeaturesContent';

export const metadata: Metadata = {
  title: 'Features — PadelScorePro',
  description:
    'Live match tracking, historical performance, WhatsApp sharing, and curated pro equipment. Built for padel players who take the game seriously.',
};

export default function FeaturesPage() {
  return (
    <main
      className="min-h-screen bg-[#050505] antialiased overflow-x-hidden"
      style={{
        backgroundImage:
          'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Header />
      <FeaturesContent />
    </main>
  );
}
