'use client';
import { FormEntry } from '@/types/player';

interface RecentFormChartProps {
  form: FormEntry[];
}

const BAR_HEIGHTS: Record<string, number> = { W: 72, L: 28 };

export default function RecentFormChart({ form }: RecentFormChartProps) {
  return (
    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'24px',padding:'28px',display:'flex',flexDirection:'column'}}>
      <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:'16px',fontFamily:'Inter,sans-serif'}}>Recent Form — Last {form.length} Matches</p>
      <div style={{display:'flex',alignItems:'flex-end',gap:'8px',flex:1,height:'112px'}}>
        {form.map((f, i) => {
          const isWin = f.result === 'W';
          const h = BAR_HEIGHTS[f.result] ?? 28;
          return (
            <div key={f.matchId} title={`${f.opponent} · ${f.sets}`} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',flex:1}}>
              <div style={{width:'100%',height:'96px',background:'rgba(255,255,255,0.04)',borderRadius:'6px 6px 0 0',display:'flex',alignItems:'flex-end',overflow:'hidden'}}>
                <div style={{
                  width:'100%',
                  height:`${h}px`,
                  borderRadius:'6px 6px 0 0',
                  background: isWin ? '#CCFF00' : 'rgba(255,255,255,0.15)',
                  transition:`height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.06}s`,
                }}/>
              </div>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'10px',fontWeight:600,color: isWin ? '#CCFF00' : 'rgba(255,255,255,0.3)'}}>{f.result}</span>
              <span style={{fontFamily:'Inter,sans-serif',fontSize:'10px',color:'rgba(255,255,255,0.2)',whiteSpace:'nowrap'}}>{f.date}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',gap:'16px',marginTop:'12px'}}>
        {[{color:'#CCFF00',label:'Win'},{color:'rgba(255,255,255,0.15)',label:'Loss'}].map((l)=>(
          <div key={l.label} style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'Inter,sans-serif',fontSize:'11px',color:'rgba(255,255,255,0.3)',fontWeight:500}}>
            <div style={{width:'8px',height:'8px',borderRadius:'2px',background:l.color}}/>
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
