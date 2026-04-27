// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { BLOG_POSTS, getPostBySlug } from '@/data/blogPosts';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.title} — PadelScorePro`,
    description: post.subtitle,
    openGraph: {
      title: `${post.title} — PadelScorePro`,
      description: post.subtitle,
      url: `https://www.padelscorepro.com/blog/${slug}`,
      siteName: 'PadelScorePro',
      locale: 'en_GB',
      type: 'article',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — PadelScorePro`,
      description: post.subtitle,
      images: ['/opengraph-image'],
    },
    alternates: { canonical: `https://www.padelscorepro.com/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    Rules:   { bg: 'rgba(204,255,0,0.1)',    border: 'rgba(204,255,0,0.2)',    text: '#CCFF00' },
    Tactics: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.5)' },
    Gear:    { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.5)' },
  };
  const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Gear;

  return (
    <main
      className="min-h-screen bg-[#050505] antialiased"
      style={{
        backgroundImage: 'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Header />

      <article className="max-w-[720px] mx-auto px-10 py-16 max-sm:px-5 max-sm:py-10">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-white/30 hover:text-white/70 transition-colors duration-200 mb-10 no-underline"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M9 6H3M3 6l3-3M3 6l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All posts
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
            >
              {post.category}
            </span>
            <span className="font-sans text-[11px] text-white/25">{post.readTime}</span>
            <span className="font-sans text-[11px] text-white/25">{post.date}</span>
          </div>

          <h1
            className="font-sans font-black tracking-[-0.03em] text-white leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(28px, 4.5vw, 48px)' }}
          >
            {post.title}
          </h1>

          <p className="font-sans text-[16px] text-white/50 leading-relaxed">
            {post.subtitle}
          </p>
        </header>

        {/* Volt divider */}
        <div
          className="h-px mb-10"
          style={{ background: 'linear-gradient(90deg,rgba(204,255,0,0.25),rgba(255,255,255,0.06),transparent)' }}
        />

        {/* Intro */}
        <p className="font-sans text-[16px] text-white/65 leading-[1.75] mb-10 font-medium">
          {post.intro}
        </p>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-sans text-[20px] font-extrabold tracking-[-0.02em] text-white mb-3">
                  {section.heading}
                </h2>
              )}
              {section.body.split('\n\n').map((para, j) => (
                <p key={j} className="font-sans text-[15px] text-white/50 leading-[1.75] mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* CTA */}
        {post.cta && (
          <div
            className="mt-14 flex items-center justify-between flex-wrap gap-5 rounded-[20px] px-7 py-6"
            style={{ background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.15)' }}
          >
            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-volt mb-1">
                Ready to apply this?
              </p>
              <p className="font-sans text-[14px] text-white/50 m-0">
                PadelScorePro tracks every point, set, and match automatically.
              </p>
            </div>
            <a
              href={post.cta.href}
              className="post-cta-btn inline-flex items-center gap-2 font-sans text-[13px] font-bold tracking-[0.08em] uppercase px-6 py-3.5 rounded-xl no-underline"
              style={{ background: '#CCFF00', color: '#050505', transition: 'all 0.3s ease' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M6.5 1v8M3.5 6.5l3 3 3-3M2 12h9" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {post.cta.label}
            </a>
          </div>
        )}

        {/* Back */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-[12px] font-bold tracking-[0.06em] uppercase text-white/30 hover:text-white/70 transition-colors duration-200 no-underline"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M9 6H3M3 6l3-3M3 6l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all posts
          </Link>
        </div>

        <style>{`
          .post-cta-btn:hover {
            background: #d4ff1a !important;
            box-shadow: 0 0 0 1px rgba(204,255,0,.5), 0 0 24px rgba(204,255,0,.3);
            transform: translateY(-2px);
          }
        `}</style>
      </article>
    </main>
  );
}
