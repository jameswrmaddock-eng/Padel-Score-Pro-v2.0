import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'PadelScorePro — The Smart Way to Track Padel Scores';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
        }} />

        {/* Volt accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CCFF00' }} />
          <span style={{ color: '#CCFF00', fontSize: '14px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            PadelScorePro
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            fontSize: '80px', fontWeight: 900, color: '#ffffff',
            letterSpacing: '-0.04em', lineHeight: 0.95, textTransform: 'uppercase',
          }}>
            Track Every<br />
            <span style={{ color: '#CCFF00' }}>Point.</span>
          </div>
          <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.45)', fontWeight: 400, lineHeight: 1.5, maxWidth: '640px' }}>
            Free real-time padel scoring. All deuce modes, tiebreak, match history. No account needed.
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16px', letterSpacing: '0.04em' }}>
            padelscorepro.com
          </span>
          <div style={{
            background: '#CCFF00', color: '#050505',
            padding: '14px 28px', borderRadius: '12px',
            fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Start Scoring Free →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
