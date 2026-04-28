// app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { BLOG_POSTS } from '@/data/blogPosts';

export const metadata: Metadata = {
  title: 'Blog — PadelScorePro',
  description: 'Padel tactics, rules, and gear advice from PadelScorePro.',
};

const CATEGORY_COLORS: Record<string, string> = {
  Rules:   'rgba(204,255,0,0.1)',
  Tactics: 'rgba(255,255,255,0.06)',
  Gear:    'rgba(255,255,255,0.06)',
};
const CATEGORY_TEXT: Record<string, string> = {
  Rules:   '#CCFF00',
  Tactics: 'rgba(255,255,255,0.5)',
  Gear:    'rgba(255,255,255,0.5)',
};

export default function BlogPage() {
  return (
    <main
      className="min-h-screen bg-[#050505] antialiased"
      style={{
        backgroundImage: 'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Header />

      <div className="max-w-[1100px] mx-auto px-10 py-16 max-sm:px-5 max-sm:py-10">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-volt" />
            <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
              From the court
            </span>
          </div>
          <h1
            className="font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
          >
            Blog<span className="text-volt">.</span>
          </h1>
          <p className="font-sans text-[15px] text-white/65 mt-3 max-w-[480px] leading-relaxed">
            Tactics, rules, and gear advice for padel players who want to improve.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))' }}>
          {BLOG_POSTS.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card group flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all duration-300 ease-in-out hover:border-volt/[0.25] hover:bg-volt/[0.03] hover:-translate-y-1 no-underline"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Top shimmer */}
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)' }} />

              <div className="flex flex-col flex-1 p-6">
                {/* Category + read time */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: CATEGORY_COLORS[post.category] ?? 'rgba(255,255,255,0.06)',
                      color:      CATEGORY_TEXT[post.category]   ?? 'rgba(255,255,255,0.5)',
                      border:     `1px solid ${post.category === 'Rules' ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="font-sans text-[10px] text-white/50 tracking-[0.04em]">
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-sans text-[18px] font-extrabold tracking-[-0.02em] text-white leading-[1.2] mb-3 group-hover:text-volt transition-colors duration-200">
                  {post.title}
                </h2>

                {/* Subtitle */}
                <p className="font-sans text-[13px] text-white/65 leading-relaxed flex-1 mb-5">
                  {post.subtitle}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="font-sans text-[11px] text-white/50">{post.date}</span>
                  <span className="font-sans text-[11px] font-bold tracking-[0.06em] uppercase text-volt flex items-center gap-1.5 transition-gap duration-200">
                    Read
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                      <path d="M2 9L9 2M9 2H4M9 2v5" stroke="#CCFF00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
