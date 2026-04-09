import { Match } from '@/hooks/useMatchHistory';

export function buildWhatsAppText(match: Match): string {
  const setLine = match.sets
    .map((s) => `${s.a}-${s.b}`)
    .join('  |  ');

  const lines = [
    '🎾 *PadelScorePro Match Result* 🎾',
    '',
    `🏆 *Winner: ${match.winner}*`,
    '',
    `${match.teamA} vs ${match.teamB}`,
    setLine,
    '',
    `📍 ${match.location}  •  ${match.date}`,
    '',
    'Tracked with PadelScorePro ⚡',
    'padelscorepro.com',
  ];

  return lines.join('\n');
}

export function shareToWhatsApp(match: Match): void {
  const text = buildWhatsAppText(match);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
