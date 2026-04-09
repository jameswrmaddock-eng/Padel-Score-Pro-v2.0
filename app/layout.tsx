import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PadelScorePro — The Smart Way to Track Padel Scores',
    template: '%s — PadelScorePro',
  },
  description:
    'Free real-time padel scoring app. Track matches, learn the rules, and play smarter. No account needed.',
  keywords: ['padel', 'score tracker', 'padel scoring', 'padel app', 'match tracker'],
  openGraph: {
    title: 'PadelScorePro',
    description: 'The smart way to track padel scores.',
    url: 'https://www.padelscorepro.com',
    siteName: 'PadelScorePro',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PadelScorePro',
    description: 'The smart way to track padel scores.',
  },
  metadataBase: new URL('https://www.padelscorepro.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
