'use client';
// components/rules/RulesContent.tsx

import { useState } from 'react';

interface Rule {
  title: string;
  body: string;
  volt?: boolean;
}

interface Section {
  num: string;
  id: string;
  title: string;
  rules?: Rule[];
  custom?: 'scoring' | 'deuce';
}

const SECTIONS: Section[] = [
  {
    num: '01', id: 'court', title: 'The Court',
    rules: [
      { title: 'Dimensions', body: 'A padel court is 20m long × 10m wide, enclosed by walls and wire fencing on all sides. The court is divided into two halves by a net, with each half split into two service boxes.', volt: true },
      { title: 'Net height', body: 'The net is 88cm high at the posts and dips to 92cm in the centre. Posts are positioned at the court\'s side walls — not outside the court.', volt: true },
      { title: 'Walls', body: 'Back walls are 3m high solid panels. Side walls are 3m solid panels nearest the back, transitioning to 4m metal fencing in the middle sections.' },
      { title: 'Teams', body: 'Padel is always played as doubles — two players per side. Singles padel exists but is uncommon and uses different court configurations.' },
    ],
  },
  { num: '02', id: 'scoring', title: 'Scoring', custom: 'scoring' },
  {
    num: '03', id: 'serving', title: 'Serving',
    rules: [
      { title: 'Underarm only', body: 'Unlike tennis, the serve in padel must be underarm. The ball must be bounced on the ground and struck at or below waist height.', volt: true },
      { title: 'Diagonal serve', body: 'The serve must land in the diagonally opposite service box. Starting from the deuce side (right), the serve targets the opponent\'s deuce box.', volt: true },
      { title: 'Two attempts', body: 'The server gets two attempts to land a valid serve. A fault on both attempts gives the point to the receiver. A let (ball clips the net and lands in) is replayed.' },
      { title: 'Wall after bouncing', body: 'After bouncing in the service box, if the ball hits the back or side wall before the receiver strikes it, the serve is still valid — the receiver must return it.' },
      { title: 'Foot fault', body: 'At the moment of striking the ball, the server must have at least one foot on the ground. The server\'s feet must remain behind the service line.' },
    ],
  },
  {
    num: '04', id: 'walls', title: 'Walls & Fences',
    rules: [
      { title: 'Walls are in play', body: 'After the ball bounces once on your side, it may hit any wall or fence and still be played. Using the walls is a core part of padel strategy.', volt: true },
      { title: 'Out through the fence', body: 'If the ball exits through an open gate or a gap in the fence, it is still in play. Players may chase the ball outside the court to return it — a common and spectacular play.', volt: true },
      { title: 'Ball hits wall before bouncing', body: 'If the ball crosses the net and hits a wall or fence on your side before bouncing on the ground, it is a fault — the point goes to your opponents.' },
      { title: 'Hitting over the net', body: 'A player may reach over the net to play the ball only if the ball has crossed to their side first due to spin or wind. Touching the net at any time loses the point.' },
    ],
  },
  { num: '05', id: 'deuce', title: 'Deuce Modes', custom: 'deuce' },
  {
    num: '06', id: 'faults', title: 'Common Faults',
    rules: [
      { title: 'Double bounce', body: 'The ball must be returned before it bounces a second time on your side. Letting it bounce twice loses the point.' },
      { title: 'Hitting into the net', body: 'The ball must clear the net. Hitting the net on any shot (including serve) results in a fault.' },
      { title: 'Ball hits body or clothing', body: 'If the ball strikes a player\'s body or clothing before they play it intentionally, the point is lost. This includes accidental contact.' },
      { title: 'Volleying the serve', body: 'The receiver must allow the serve to bounce once before returning it. Volleying the serve directly is a fault.' },
      { title: 'Ball hit twice', body: 'A player may not strike the ball twice in succession. A double-hit loses the point, even if unintentional.' },
    ],
  },
];

const TOC_ITEMS = [
  { label: 'Court', id: 'court' },
  { label: 'Scoring', id: 'scoring' },
  { label: 'Serving', id: 'serving' },
  { label: 'Walls', id: 'walls' },
  { label: 'Deuce', id: 'deuce' },
  { label: 'Faults', id: 'faults' },
];

const SCORE_STEPS = [
  { num: '0',  label: 'Love' },
  { num: '15', label: 'One point' },
  { num: '30', label: 'Two points' },
  { num: '40', label: 'Three points', volt: true },
  { num: 'W',  label: 'Win game', volt: true },
];

const DEUCE_MODES = [
  {
    name: 'Long Deuce',
    desc: 'The traditional format. Advantage is played until one team wins two consecutive points. Can repeat indefinitely. Used in most professional matches.',
    featured: true,
  },
  {
    name: 'Silver Point',
    desc: 'At 40-40, advantage is played normally. If the team with advantage loses the next point (returning to 40-40), the very next point wins the game outright.',
    featured: false,
  },
  {
    name: 'Golden Point',
    desc: 'The receiver chooses which side to receive from. The next single point wins the game immediately. The fastest format — used in some tour events.',
    featured: false,
  },
];

function CheckIcon({ volt }: { volt?: boolean }) {
  const color = volt ? '#CCFF00' : 'rgba(255,255,255,0.35)';
  const bg    = volt ? 'rgba(204,255,0,0.1)'  : 'rgba(255,255,255,0.04)';
  const border= volt ? 'rgba(204,255,0,0.2)'  : 'rgba(255,255,255,0.08)';
  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
      background: bg, border: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
    }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2 6l3 3 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CrossIcon() {
  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
    }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M3 3l6 6M9 3l-6 6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function RulesContent() {
  const [open, setOpen] = useState<Record<string, boolean>>({ court: true });

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    // smooth scroll to section
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  return (
    <div className="max-w-[800px] mx-auto px-10 py-16 max-sm:px-5 max-sm:py-10">

      {/* Hero */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-volt" />
          <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
            Official Rules
          </span>
        </div>
        <h1
          className="font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-white mb-4"
          style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}
        >
          Padel<br /><span className="text-volt">Rules.</span>
        </h1>
        <p className="font-sans text-[15px] text-white/45 leading-relaxed max-w-[520px]">
          Everything you need to play, score, and referee a padel match —
          from court dimensions to deuce variations. Fully updated for 2026.
        </p>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 mt-6">
          {TOC_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setOpen((prev) => ({ ...prev, [item.id]: true }));
                setTimeout(() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="font-sans text-[11px] font-bold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full border border-white/10 text-white/40 transition-all duration-200 hover:border-volt/30 hover:text-volt hover:bg-volt/[0.05] cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-2">
        {SECTIONS.map((section) => {
          const isOpen = !!open[section.id];
          return (
            <div
              key={section.id}
              id={section.id}
              className="rounded-[20px] border overflow-hidden transition-colors duration-200"
              style={{
                borderColor: isOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
                background:  isOpen ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
              }}
            >
              {/* Header */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-4 px-7 py-6 text-left transition-colors duration-200 hover:bg-white/[0.03] cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-sans text-[11px] font-bold tracking-[0.1em] text-volt min-w-[28px]">
                  {section.num}
                </span>
                <span className="font-sans text-[17px] font-extrabold tracking-[-0.01em] uppercase text-white flex-1">
                  {section.title}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className="flex-shrink-0 transition-transform duration-250"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  aria-hidden
                >
                  <path d="M5 3l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Body */}
              {isOpen && (
                <div className="px-7 pb-7">

                  {/* Standard rules */}
                  {section.rules && (
                    <div className="flex flex-col">
                      {section.rules.map((rule, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start py-4"
                          style={{ borderBottom: i < section.rules!.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                        >
                          {rule.volt ? <CheckIcon volt /> : <CrossIcon />}
                          <div>
                            <h3 className="font-sans text-[13px] font-bold text-white mb-1">
                              {rule.title}
                            </h3>
                            <p className="font-sans text-[13px] text-white/40 leading-relaxed m-0">
                              {rule.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Scoring grid */}
                  {section.custom === 'scoring' && (
                    <>
                      <p className="font-sans text-[13px] text-white/40 leading-relaxed mb-4">
                        Padel uses the same point and game scoring as tennis. Points progress as follows:
                      </p>
                      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
                        {SCORE_STEPS.map((s) => (
                          <div
                            key={s.num}
                            className="rounded-xl p-3 text-center"
                            style={{
                              background:  s.volt ? 'rgba(204,255,0,0.06)' : 'rgba(255,255,255,0.03)',
                              border:      `1px solid ${s.volt ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.07)'}`,
                            }}
                          >
                            <div className="font-sans text-[20px] font-black leading-none text-volt mb-1">
                              {s.num}
                            </div>
                            <div className="font-sans text-[9px] font-bold tracking-[0.08em] uppercase text-white/25">
                              {s.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      {[
                        { title: 'Winning a set', body: 'First team to 6 games wins the set — provided they lead by at least 2. If scores reach 6-6, a tiebreak or play-on is used depending on agreed format.', volt: true },
                        { title: 'Winning the match', body: 'Matches are best of 3 sets. The first team to win 2 sets wins the match. Some casual formats play a single set.', volt: true },
                        { title: 'Tiebreak', body: 'At 6-6, a tiebreak is played to 7 points (win by 2). The first server serves 1 point, then serve alternates every 2 points. Players switch ends every 6 points.' },
                      ].map((rule, i, arr) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start py-4"
                          style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                        >
                          {rule.volt ? <CheckIcon volt /> : <CheckIcon />}
                          <div>
                            <h3 className="font-sans text-[13px] font-bold text-white mb-1">{rule.title}</h3>
                            <p className="font-sans text-[13px] text-white/40 leading-relaxed m-0">{rule.body}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Deuce cards */}
                  {section.custom === 'deuce' && (
                    <>
                      <p className="font-sans text-[13px] text-white/40 leading-relaxed mb-4">
                        When both teams reach 40-40, the format used to decide the game varies.
                        PadelScorePro supports all three official variants.
                      </p>
                      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
                        {DEUCE_MODES.map((d) => (
                          <div
                            key={d.name}
                            className="rounded-xl p-4"
                            style={{
                              background:  d.featured ? 'rgba(204,255,0,0.04)' : 'rgba(255,255,255,0.02)',
                              border:      `1px solid ${d.featured ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.08)'}`,
                            }}
                          >
                            <p
                              className="font-sans text-[12px] font-extrabold uppercase tracking-[0.06em] mb-2"
                              style={{ color: d.featured ? '#CCFF00' : '#fff' }}
                            >
                              {d.name}
                            </p>
                            <p className="font-sans text-[11px] text-white/35 leading-relaxed m-0">
                              {d.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        className="mt-12 flex items-center justify-between flex-wrap gap-5 rounded-[20px] px-8 py-7"
        style={{ background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.15)' }}
      >
        <div>
          <h2 className="font-sans text-[20px] font-black uppercase tracking-[-0.02em] text-white mb-1">
            Ready to play?
          </h2>
          <p className="font-sans text-[13px] text-white/40 m-0">
            The scorer handles all these rules automatically.
          </p>
        </div>
        <a
          href="/score"
          className="inline-flex items-center gap-2 font-sans text-[13px] font-bold tracking-[0.08em] uppercase px-7 py-3.5 rounded-xl rules-cta-btn"
          style={{ background: '#CCFF00', color: '#050505', transition: 'all 0.3s ease' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <path d="M6.5 1v8M3.5 6.5l3 3 3-3M2 12h9" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Start Scoring
        </a>
      </div>

      <style>{`
        .rules-cta-btn:hover {
          background: #d4ff1a !important;
          box-shadow: 0 0 0 1px rgba(204,255,0,.5), 0 0 24px rgba(204,255,0,.3);
          transform: translateY(-2px);
        }
        @media(max-width:600px) {
          .grid[style*="repeat(3"] { grid-template-columns: 1fr !important; }
          .grid[style*="repeat(5"] { grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
