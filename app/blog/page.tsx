import type { Metadata } from 'next';
import Header from '@/components/layout/Header';

export const metadata: Metadata = { title: 'Blog' };

export default function BlogPage() {
  return (
    <main className="bg-[#050505] min-h-screen antialiased">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <span className="font-display text-[11px] font-bold tracking-[0.16em] uppercase text-volt mb-4">
          Coming Soon
        </span>
        <h1 className="font-display text-[48px] font-extrabold tracking-tight text-white leading-none mb-4">
          Blog
        </h1>
        <p className="text-white/40 text-[15px] max-w-md leading-relaxed">
          Tips, tactics and gear reviews coming soon.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 font-display text-[12px] font-bold tracking-[0.08em] uppercase text-white/30 hover:text-white/70 transition-colors"
        >
          ← Back home
        </a>
      </div>
    </main>
  );
}
