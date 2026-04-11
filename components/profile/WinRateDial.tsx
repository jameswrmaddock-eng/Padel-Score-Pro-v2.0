'use client';
import { useEffect, useRef } from 'react';

interface WinRateDialProps {
  winRate: number;
  wins: number;
  losses: number;
  threeSetsWins: number;
}

const CIRC = 2 * Math.PI * 54;

export default function WinRateDial({ winRate, wins, losses, threeSetsWins }: WinRateDialProps) {
  const fillRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (fillRef.current)
      fillRef.current.style.strokeDashoffset = String(CIRC - (winRate / 100) * CIRC);
  }, [winRate]);

  const total = wins + losses || 1;
  const rows = [
    { label: 'Wins',       count: wins,         pct: winRate,                               color: '#CCFF00' },
    { label: 'Losses',     count: losses,        pct: Math.round(losses / total * 100),      color: 'rgba(255,255,255,0.18)' },
    { label: '3-set wins', count: threeSetsWins, pct: Math.round(threeSetsWins / (wins||1)*100), color: 'rgba(255,255,255,0.08)' },
  ];

  return (
    <div style={{background:'rgba(204,255,0,0.03)',border:'1px solid rgba(204,255,0,0.18)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'24px',padding:'28px',display:'flex',flexDirection:'column'}}>
      <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:'20px',fontFamily:'Inter,sans-serif'}}>Win Rate</p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'28px',flex:1}}>
        <div style={{position:'relative',width:'120px',height:'120px',flexShrink:0}}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{transform:'rotate(-90deg)'}} aria-hidden>
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round"/>
            <circle ref={fillRef} cx="60" cy="60" r="54" fill="none" stroke="#CCFF00" strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC} style={{transition:'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'}}/>
          </svg>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'26px',fontWeight:700,color:'#CCFF00',lineHeight:1,letterSpacing:'-0.02em'}}>{winRate}%</span>
            <span style={{fontFamily:'Inter,sans-serif',fontSize:'9px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginTop:'2px'}}>Win rate</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {rows.map((r) => (
            <div key={r.label} style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:r.color,flexShrink:0}}/>
              <span style={{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'rgba(255,255,255,0.4)',flex:1}}>{r.label}</span>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'14px',fontWeight:600,color:'#fff'}}>{r.count}</span>
              <span style={{fontFamily:'Inter,sans-serif',fontSize:'11px',color:'rgba(255,255,255,0.25)',minWidth:'30px',textAlign:'right'}}>{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
