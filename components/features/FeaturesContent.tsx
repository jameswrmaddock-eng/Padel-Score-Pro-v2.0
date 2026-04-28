'use client';
// components/features/FeaturesContent.tsx

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.round(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, to, duration]);

  return (
    <span ref={ref} className="font-mono font-bold tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ── Fade-in-up wrapper ────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, className = '', style = {} as React.CSSProperties,
}: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-volt/50">{n}</span>
      <div className="w-8 h-px bg-volt/30" />
      <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
        {label}
      </span>
    </div>
  );
}

// ── Technical spec line ───────────────────────────────────────────────────────
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
      <span className="font-sans text-[11px] text-white/50 tracking-[0.04em]">{label}</span>
      <span className="font-mono text-[11px] text-white/45 tracking-[0.02em]">{value}</span>
    </div>
  );
}

// ── Live Tracker visual ───────────────────────────────────────────────────────
function LiveTrackerVisual() {
  const [pts, setPts] = useState({ a: 1, b: 0 }); // 15, 0
  const LABELS = ['0', '15', '30', '40'];

  useEffect(() => {
    const seq = [
      { a: 1, b: 0 }, { a: 2, b: 0 }, { a: 2, b: 1 },
      { a: 3, b: 1 }, { a: 3, b: 2 }, { a: 3, b: 3 },
    ];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setPts(seq[i]);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const aLeads = pts.a > pts.b;
  const bLeads = pts.b > pts.a;
  const isDeuce = pts.a === 3 && pts.b === 3;

  return (
    <div
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: '#070d12',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 80px rgba(204,255,0,0.08), 0 40px 80px rgba(0,0,0,0.6)',
        width: '300px',
        flexShrink: 0,
      }}
    >
      {/* Volt glow behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(204,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Status bar — all three slots are fixed width so label changes never shift layout */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3 relative z-10">
        <div className="flex items-center gap-2" style={{ width: '64px' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-volt flex-shrink-0" style={{ animation: 'livePulse 1.8s ease-in-out infinite' }} />
          <span className="font-sans text-[10px] font-bold tracking-[0.12em] uppercase text-volt">
            {isDeuce ? 'Deuce' : 'Live'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/50 text-center" style={{ width: '100px' }}>Set 1 · Game 4</span>
        <div className="flex items-center justify-end" style={{ width: '64px' }}>
          <span className="font-sans text-[9px] text-white/20 uppercase tracking-[0.08em]">Long Deuce</span>
        </div>
      </div>

      <div className="h-px mx-6 bg-white/[0.06]" />

      {/* Scores */}
      <div className="grid gap-3 px-5 py-5 relative z-10" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Team A */}
        <div
          className="flex flex-col items-center rounded-2xl py-6 transition-all duration-500"
          style={{
            background:  aLeads ? 'rgba(204,255,0,0.05)' : 'rgba(255,255,255,0.02)',
            border:      `1px solid ${aLeads ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.07)'}`
,            overflow: 'hidden',
          }}
        >
          <div className="flex items-center gap-1.5 mb-2 h-4">
            <div className="w-1.5 h-1.5 rounded-full bg-volt" style={{ animation: 'livePulse 1.8s ease-in-out infinite' }} />
            <span className="font-sans text-[9px] font-bold tracking-[0.08em] uppercase text-volt">Serving</span>
          </div>
          <p className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/60 mb-2">Los Tigres</p>
          <p
            className="font-sans font-black leading-none tracking-[-0.04em] transition-all duration-500 tabular-nums"
            style={{
              fontSize: '64px',
              color: isDeuce ? '#fff' : aLeads ? '#CCFF00' : '#ffffff',
              width: '80px',
              textAlign: 'center',
            }}
          >
            {isDeuce ? '40' : LABELS[pts.a]}
          </p>
          <p className="font-sans text-[28px] font-black text-volt/70 mt-2">3</p>
          <div className="flex gap-1 mt-2">
            {[6, 3].map((s, i) => (
              <span key={i} className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: i === 0 ? 'rgba(204,255,0,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? 'rgba(204,255,0,0.25)' : 'rgba(255,255,255,0.08)'}`, color: i === 0 ? '#CCFF00' : 'rgba(255,255,255,0.2)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Team B */}
        <div
          className="flex flex-col items-center rounded-2xl py-6 transition-all duration-500"
          style={{
            background:  bLeads ? 'rgba(204,255,0,0.05)' : 'rgba(255,255,255,0.02)',
            border:      `1px solid ${bLeads ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.07)'}`,
          }}
        >
          <div className="h-4 mb-2" />
          <p className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/60 mb-2">Raqueteros</p>
          <p
            className="font-sans font-black leading-none tracking-[-0.04em] transition-all duration-500 tabular-nums"
            style={{
              fontSize: '64px',
              color: isDeuce ? '#fff' : bLeads ? '#CCFF00' : '#ffffff',
              width: '80px',
              textAlign: 'center',
            }}
          >
            {isDeuce ? '40' : LABELS[pts.b]}
          </p>
          <p className="font-sans text-[28px] font-black text-white/20 mt-2">1</p>
          <div className="flex gap-1 mt-2">
            {[3, 0].map((s, i) => (
              <span key={i} className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-5 relative z-10">
        <div className="py-3 rounded-xl text-center font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-volt"
          style={{ background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.25)' }}>
          + Los Tigres
        </div>
        <div className="py-3 rounded-xl text-center font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-white/55"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          + Raqueteros
        </div>
      </div>
      <p className="text-center font-mono text-[9px] text-white/15 pb-4 tracking-[0.06em]">↩ undo last point</p>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.65)} }
      `}</style>
    </div>
  );
}

// ── Performance graph visual ──────────────────────────────────────────────────
function PerformanceVisual() {
  const { ref, visible } = useReveal(0.2);
  const WINS  = [3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 9, 12];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const max    = Math.max(...WINS);
  const H = 80;
  const W = 280;

  const points = WINS.map((v, i) => ({
    x: (i / (WINS.length - 1)) * W,
    y: H - (v / max) * H,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const fillD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div
      ref={ref}
      className="rounded-[24px] overflow-hidden"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div>
          <p className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/55 mb-0.5">Win rate</p>
          <p className="font-sans text-[24px] font-black tracking-[-0.03em] text-volt leading-none">
            <Counter to={78} suffix="%" />
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/55 mb-0.5">Season 2026</p>
          <p className="font-mono text-[13px] font-bold text-white/50">
            <Counter to={247} /> pts tracked
          </p>
        </div>
      </div>

      {/* Graph */}
      <div className="px-4 pb-2">
        <svg width="100%" viewBox={`0 0 ${W} ${H + 10}`} preserveAspectRatio="none" style={{ height: '90px' }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#CCFF00" stopOpacity="0" />
            </linearGradient>
            <clipPath id="lineReveal">
              <rect x="0" y="0" height={H + 10}
                width={visible ? W : 0}
                style={{ transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s' }}
              />
            </clipPath>
          </defs>
          <path d={fillD} fill="url(#lineGrad)" clipPath="url(#lineReveal)" />
          <path d={pathD} fill="none" stroke="#CCFF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#lineReveal)" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#CCFF00" opacity={visible ? 0.7 : 0}
              style={{ transition: `opacity 0.3s ease ${0.3 + i * 0.1}s` }} />
          ))}
        </svg>
      </div>

      {/* Month labels */}
      <div className="flex items-center justify-between px-4 pb-4">
        {MONTHS.map((m) => (
          <span key={m} className="font-mono text-[8px] text-white/20">{m}</span>
        ))}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 border-t border-white/[0.06]">
        {[
          { label: 'Matches', val: '32' },
          { label: 'Wins', val: '25' },
          { label: 'Best streak', val: 'W7' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center py-4 border-r border-white/[0.06] last:border-r-0">
            <p className="font-mono text-[18px] font-bold text-white leading-none">{s.val}</p>
            <p className="font-sans text-[9px] font-bold tracking-[0.08em] uppercase text-white/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Share card visual ─────────────────────────────────────────────────────────
function ShareVisual() {
  return (
    <div className="relative flex items-center justify-center py-6">
      {/* Background blur cards */}
      <div className="absolute inset-4 rounded-3xl blur-sm opacity-30"
        style={{ background: 'linear-gradient(135deg,rgba(204,255,0,0.15),rgba(0,0,0,0.4))' }} />

      {/* Story card */}
      <div
        className="relative w-[220px] rounded-[24px] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg,#0a0f0a 0%,#050505 60%,#0d120a 100%)',
          border: '1px solid rgba(204,255,0,0.2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(204,255,0,0.08)',
        }}
      >
        {/* Story header */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
          <div className="w-7 h-7 rounded-lg bg-volt flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#050505" strokeWidth="1.4"/>
              <path d="M7 4v3l2 1.5" stroke="#050505" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.06em] text-white leading-none">PadelScorePro</p>
            <p className="font-mono text-[8px] text-white/55 mt-0.5">Today · 16:42</p>
          </div>
        </div>

        <div className="mx-4 h-px bg-white/[0.08]" />

        {/* Match result */}
        <div className="px-5 py-5 text-center">
          <p className="font-sans text-[9px] font-bold tracking-[0.12em] uppercase text-white/55 mb-3">Match Result</p>

          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <p className="font-sans text-[11px] font-bold text-volt">Los Tigres</p>
              <p className="font-mono text-[28px] font-black text-volt leading-none tracking-[-0.03em]">2</p>
            </div>
            <p className="font-sans text-[10px] text-white/20 font-bold">VS</p>
            <div className="text-right">
              <p className="font-sans text-[11px] font-bold text-white/65">Raqueteros</p>
              <p className="font-mono text-[28px] font-black text-white/50 leading-none tracking-[-0.03em]">0</p>
            </div>
          </div>

          {/* Set scores */}
          <div className="flex justify-center gap-2 mb-4">
            {[['6','3'],['6','2']].map(([a,b], i) => (
              <div key={i} className="rounded-lg px-2.5 py-1.5 text-center"
                style={{ background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.2)' }}>
                <p className="font-mono text-[12px] font-bold text-volt">{a}–{b}</p>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/[0.06] mb-3" />

          <p className="font-sans text-[9px] text-white/50 leading-relaxed">
            &quot;Great match — solid performance at the net throughout.&quot;
          </p>
        </div>

        {/* Share button */}
        <div className="mx-4 mb-4 py-2.5 rounded-xl flex items-center justify-center gap-2"
          style={{ background: '#CCFF00' }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v6M3 4l2.5-3L8 4M1.5 8.5h8" stroke="#050505" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-sans text-[10px] font-bold tracking-[0.06em] text-[#050505]">Share to WhatsApp</span>
        </div>
      </div>
    </div>
  );
}

// ── Gear visual ───────────────────────────────────────────────────────────────
function GearVisual() {
  return (
    <div className="flex flex-col gap-3">
      {[
        { brand: 'Bullpadel', name: 'Hack 03', price: '£249', level: 'Advanced', pick: true },
        { brand: 'Head',      name: 'Delta Pro', price: '£179', level: 'All-round', pick: false },
        { brand: 'Adidas',    name: 'Metalbone', price: '£129', level: 'Beginner', pick: false },
      ].map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-4 rounded-[16px] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background:  p.pick ? 'rgba(204,255,0,0.04)' : '#1A1A1A',
            border:      `1px solid ${p.pick ? 'rgba(204,255,0,0.2)' : '#2A2A2A'}`,
          }}
        >
          {/* Racket SVG icon */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: p.pick ? 'rgba(204,255,0,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${p.pick ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
            <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
              <ellipse cx="9" cy="10" rx="7" ry="8" fill={p.pick ? 'rgba(204,255,0,0.15)' : 'rgba(255,255,255,0.06)'} stroke={p.pick ? '#CCFF00' : 'rgba(255,255,255,0.2)'} strokeWidth="1"/>
              <rect x="7.5" y="17" width="3" height="8" rx="1.5" fill={p.pick ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.08)'}/>
              <line x1="9" y1="4" x2="9" y2="16" stroke={p.pick ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="0.8"/>
              <line x1="3" y1="9" x2="15" y2="9" stroke={p.pick ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="0.8"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-sans text-[13px] font-bold text-white truncate">
                {p.brand} {p.name}
              </p>
              {p.pick && (
                <span className="font-sans text-[8px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: '#CCFF00', color: '#050505' }}>
                  Pick
                </span>
              )}
            </div>
            <p className="font-sans text-[10px] text-white/55">{p.level}</p>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="font-mono text-[14px] font-bold text-white">{p.price}</p>
            <a
              href={`https://www.amazon.co.uk/s?k=${encodeURIComponent(p.brand + ' ' + p.name + ' padel')}&tag=jmadd1791-21`}
              target="_blank"
              rel="sponsored noopener"
              className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-white/55 hover:text-volt transition-colors duration-200 mt-0.5"
            >
              Amazon
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FeaturesContent() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero intro ── */}
      <div className="max-w-[1100px] mx-auto px-10 pt-16 pb-8 max-sm:px-5">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-volt" />
            <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
              Product Features
            </span>
          </div>
          <h1
            className="font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-white mb-4"
            style={{ fontSize: 'clamp(36px,6vw,68px)' }}
          >
            Built for<br /><span className="text-volt">Padel.</span>
          </h1>
          <p className="font-sans text-[15px] text-white/65 max-w-[480px] leading-relaxed">
            Every feature designed around one thing — helping you play better and track it precisely.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1100px] mx-auto px-10 max-sm:px-5 flex flex-col gap-2 pb-24">

        {/* ── Section A: Live Tracker — image LEFT, text RIGHT ── */}
        <div className="rounded-[28px] border border-white/[0.07] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Visual */}
            <Reveal className="p-8 lg:p-10 flex items-center justify-center"
              style={{ background: '#1A1A1A', borderRight: '1px solid #2A2A2A' } as React.CSSProperties}>
              <LiveTrackerVisual />
            </Reveal>

            {/* Copy */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <Reveal delay={0.1}>
                <SectionLabel n="01" label="Live Tracker" />
                <h2 className="font-sans text-[clamp(26px,3vw,38px)] font-black tracking-[-0.03em] text-white leading-[1.05] mb-4">
                  Precision at your<br />fingertips.
                </h2>
                <p className="font-sans text-[15px] text-white/45 leading-relaxed mb-6">
                  No accounts. No friction. Just play. Tap to score, and the engine handles
                  everything — points, games, sets, serve rotation, and deuce in every format.
                </p>
                <p className="font-sans text-[13px] text-white/55 leading-relaxed italic mb-8">
                  &quot;Precision at your fingertips. No accounts. No friction. Just play.&quot;
                </p>
                <div className="rounded-xl overflow-hidden border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Spec label="Engineered for" value="iPhone · Android · Web" />
                  <Spec label="Deuce modes" value="Long · Silver · Golden · Star" />
                  <Spec label="Formats" value="1 Set · Best of 3" />
                  <Spec label="Undo history" value="Up to 50 moves" />
                  <Spec label="Account required" value="None" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── Section B: Performance — text LEFT, image RIGHT ── */}
        <div className="rounded-[28px] border border-white/[0.07] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Copy */}
            <div className="flex flex-col justify-center p-8 lg:p-12 order-2 lg:order-1">
              <Reveal>
                <SectionLabel n="02" label="Historical Performance" />
                <h2 className="font-sans text-[clamp(26px,3vw,38px)] font-black tracking-[-0.03em] text-white leading-[1.05] mb-4">
                  Your game,<br />documented.
                </h2>
                <p className="font-sans text-[15px] text-white/45 leading-relaxed mb-6">
                  Track every set, every comeback, and every victory across months of play.
                  Visualise your win rate, spot patterns, and measure improvement over time.
                </p>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-mono text-[48px] font-bold text-volt leading-none tracking-[-0.03em]">
                    <Counter to={247} />
                  </span>
                  <span className="font-sans text-[13px] text-white/55 uppercase tracking-[0.06em]">points tracked<br />this season</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Spec label="Data stored" value="localStorage · Supabase ready" />
                  <Spec label="Metrics" value="Win rate · Streaks · Surfaces" />
                  <Spec label="History depth" value="Unlimited" />
                  <Spec label="Export" value="WhatsApp · Share sheet" />
                </div>
              </Reveal>
            </div>

            {/* Visual */}
            <Reveal delay={0.15} className="p-8 lg:p-10 flex items-center justify-center order-1 lg:order-2"
              style={{ background: '#1A1A1A', borderLeft: '1px solid #2A2A2A' } as React.CSSProperties}>
              <div className="w-full max-w-[360px]">
                <PerformanceVisual />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Section C: Share Engine — image LEFT, text RIGHT ── */}
        <div className="rounded-[28px] border border-white/[0.07] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Visual */}
            <Reveal className="p-8 lg:p-10 flex items-center justify-center"
              style={{ background: '#1A1A1A', borderRight: '1px solid #2A2A2A' } as React.CSSProperties}>
              <ShareVisual />
            </Reveal>

            {/* Copy */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <Reveal delay={0.1}>
                <SectionLabel n="03" label="Share Engine" />
                <h2 className="font-sans text-[clamp(26px,3vw,38px)] font-black tracking-[-0.03em] text-white leading-[1.05] mb-4">
                  Share<br />the win.
                </h2>
                <p className="font-sans text-[15px] text-white/45 leading-relaxed mb-6">
                  Generate professional match summaries in one tap. Send directly to your
                  WhatsApp group chat or share to your story — with the full score, set breakdown,
                  and a clean visual summary.
                </p>
                <div className="flex items-center gap-3 mb-8 p-4 rounded-xl"
                  style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(37,211,102,0.8)" className="flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <p className="font-mono text-[12px] text-white/50 leading-relaxed">
                    🎾 PadelScorePro: Los Tigres beat Raqueteros (6-3, 6-2). Check your stats at padelscorepro.com
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Spec label="Share format" value="WhatsApp · Native share" />
                  <Spec label="Content" value="Score · Sets · Winner" />
                  <Spec label="One-tap" value="From match end screen" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── Section D: Pro Equipment — text LEFT, gear RIGHT ── */}
        <div className="rounded-[28px] border overflow-hidden"
          style={{ background: 'rgba(204,255,0,0.02)', borderColor: 'rgba(204,255,0,0.12)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Copy */}
            <div className="flex flex-col justify-center p-8 lg:p-12 order-2 lg:order-1">
              <Reveal>
                <SectionLabel n="04" label="Pro Equipment" />
                <h2 className="font-sans text-[clamp(26px,3vw,38px)] font-black tracking-[-0.03em] text-white leading-[1.05] mb-4">
                  The gear that<br />powers the<br /><span className="text-volt">pro.</span>
                </h2>
                <p className="font-sans text-[15px] text-white/45 leading-relaxed mb-6">
                  The right equipment makes the difference. Our curated recommendations are
                  chosen for build quality, feel, and longevity — not margin.
                </p>
                <p className="font-sans text-[12px] text-white/50 italic mb-8">
                  Affiliate links — we earn a small commission at no cost to you.
                  Keeps PadelScorePro free forever.
                </p>
                <Link
                  href="/#gear"
                  className="features-cta inline-flex items-center gap-2 font-sans text-[13px] font-bold tracking-[0.08em] uppercase px-6 py-3.5 rounded-xl w-fit"
                  style={{ background: '#CCFF00', color: '#050505', transition: 'all 0.3s ease' }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 9.5L9 2.5M9 2.5H3.5M9 2.5V8" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View full gear guide
                </Link>
              </Reveal>
            </div>

            {/* Gear visual */}
            <Reveal delay={0.1} className="p-8 lg:p-10 flex items-center justify-center order-1 lg:order-2"
              style={{ background: '#1A1A1A', borderLeft: '1px solid rgba(204,255,0,0.1)' } as React.CSSProperties}>
              <div className="w-full max-w-[380px]">
                <GearVisual />
              </div>
            </Reveal>
          </div>
        </div>

      </div>

      {/* ── CTA strip ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto px-10 py-16 max-sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Reveal>
            <p className="font-sans text-[11px] font-bold tracking-[0.12em] uppercase text-volt mb-2">Try it now</p>
            <h2 className="font-sans text-[28px] font-black tracking-[-0.03em] uppercase text-white">
              Ready to score?
            </h2>
            <p className="font-sans text-[14px] text-white/60 mt-1">Free. No account. Works on any device.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href="/score"
              className="features-cta inline-flex items-center gap-2 font-sans text-[14px] font-bold tracking-[0.08em] uppercase px-8 py-4 rounded-xl flex-shrink-0"
              style={{ background: '#CCFF00', color: '#050505', transition: 'all 0.3s ease' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v9M4 7.5l3 3 3-3M2 13h10" stroke="#050505" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Start Scoring
            </a>
          </Reveal>
        </div>
      </div>

      <style>{`
        .features-cta:hover {
          background: #d4ff1a !important;
          box-shadow: 0 0 0 1px rgba(204,255,0,.5), 0 0 24px rgba(204,255,0,.35);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
