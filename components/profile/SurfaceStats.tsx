'use client';
import { SurfaceStat } from '@/types/player';

interface SurfaceStatsProps {
  stats: SurfaceStat[];
}

export default function SurfaceStats({ stats }: SurfaceStatsProps) {
  return (
    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'24px',padding:'24px'}}>
      <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:'16px',fontFamily:'Inter,sans-serif'}}>Surface Win Rate</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        {stats.map((s) => {
          const pct = Math.round(s.wins / (s.played || 1) * 100);
          return (
            <div key={s.surface}>
              <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.2)',marginBottom:'8px',fontFamily:'Inter,sans-serif'}}>{s.surface}</p>
              <div style={{height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden',marginBottom:'4px'}}>
                <div style={{height:'100%',width:`${pct}%`,borderRadius:'3px',background:'#CCFF00',transition:'width 1s ease'}}/>
              </div>
              <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.45)'}}>{pct}% · {s.wins}/{s.played}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
