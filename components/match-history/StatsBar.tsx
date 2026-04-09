interface StatsBarProps {
  total: number;
  wins: number;
  losses: number;
  threeSets: number;
}

export default function StatsBar({ total, wins, losses, threeSets }: StatsBarProps) {
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  const stats = [
    { num: total,      label: 'Matches' },
    { num: `${winRate}%`, label: 'Win rate' },
    { num: wins,       label: 'Wins' },
    { num: losses,     label: 'Losses' },
    { num: threeSets,  label: '3-set battles' },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-4">
          {i > 0 && <div className="w-px h-7 bg-white/[0.08]" />}
          <div className="text-right">
            <div className="font-display text-[20px] font-extrabold text-volt leading-none tracking-tight">
              {s.num}
            </div>
            <div className="text-[11px] text-white/28 mt-0.5">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
