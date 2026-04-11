interface PlayerAvatarProps {
  initials: string;
  avatarUrl?: string;
  size?: number;
}

export default function PlayerAvatar({ initials, avatarUrl, size = 96 }: PlayerAvatarProps) {
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <div style={{position:'absolute',inset:'-12px',borderRadius:'50%',border:'1px solid rgba(204,255,0,0.07)',animation:'ringPulse 3s ease-in-out infinite 0.5s',pointerEvents:'none'}}/>
      <div style={{position:'absolute',inset:'-6px',borderRadius:'50%',border:'1.5px solid rgba(204,255,0,0.15)',animation:'ringPulse 3s ease-in-out infinite',pointerEvents:'none'}}/>
      <div style={{width:`${size}px`,height:`${size}px`,borderRadius:'50%',background:'#1a1a1a',border:'2px solid rgba(204,255,0,0.25)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative'}}>
        {avatarUrl
          ? <img src={avatarUrl} alt={initials} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          : <span style={{fontFamily:'Inter,sans-serif',fontSize:`${Math.round(size*0.33)}px`,fontWeight:900,color:'rgba(204,255,0,0.65)',letterSpacing:'-0.02em'}}>{initials}</span>
        }
      </div>
      <style>{`@keyframes ringPulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
    </div>
  );
}
