// utils/whatsapp.ts
// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp share utility.
//
// Generates a clean single-line result string:
//   🎾 Padel Score Pro: Team A beat Team B (6-4, 6-2). Check your stats at padelscorepro.com
//
// Swap shareToWhatsApp() for a clipboard copy or native share sheet later
// without changing any UI component — the text builder is pure and testable.
// ─────────────────────────────────────────────────────────────────────────────

export interface ShareableMatch {
  teamA: string;
  teamB: string;
  sets: { a: number; b: number }[];
  winner: string;
  location?: string;
  date?: string;
}

// ── Derive winner from sets if not pre-computed ───────────────────────────────
export function deriveWinner(match: ShareableMatch): string {
  if (match.winner) return match.winner;
  const winsA = match.sets.filter((s) => s.a > s.b).length;
  const winsB = match.sets.filter((s) => s.b > s.a).length;
  return winsA > winsB ? match.teamA : match.teamB;
}

// ── Format sets as "(6-4, 6-2)" ──────────────────────────────────────────────
export function formatSets(sets: { a: number; b: number }[]): string {
  return `(${sets.map((s) => `${s.a}-${s.b}`).join(', ')})`;
}

// ── Main text builder — pure function, no side effects ────────────────────────
export function buildWhatsAppText(match: ShareableMatch): string {
  const winner = deriveWinner(match);
  const loser  = winner === match.teamA ? match.teamB : match.teamA;
  const sets   = formatSets(match.sets);

  return `🎾 Padel Score Pro: ${winner} beat ${loser} ${sets}. Check your stats at padelscorepro.com`;
}

// ── Share via WhatsApp ────────────────────────────────────────────────────────
// To switch to clipboard copy on Day 2:
//   export async function shareResult(match: ShareableMatch): Promise<void> {
//     await navigator.clipboard.writeText(buildWhatsAppText(match))
//   }
//
// To switch to native share sheet:
//   export async function shareResult(match: ShareableMatch): Promise<void> {
//     await navigator.share({ text: buildWhatsAppText(match) })
//   }
// ─────────────────────────────────────────────────────────────────────────────
export function shareToWhatsApp(match: ShareableMatch): void {
  const text = buildWhatsAppText(match);
  const url  = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ── Convenience: build the URL without opening it (useful for testing) ────────
export function buildWhatsAppUrl(match: ShareableMatch): string {
  return `https://wa.me/?text=${encodeURIComponent(buildWhatsAppText(match))}`;
}
