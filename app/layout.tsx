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
  verification: {
    google: 'REn4WRJfp_EJFXYxc9vuA1IRuxgJozlE8UScmYYlOS8',
  },
  metadataBase: new URL('https://www.padelscorepro.com'),
  alternates: { canonical: 'https://www.padelscorepro.com' },
  openGraph: {
    title: 'PadelScorePro — The Smart Way to Track Padel Scores',
    description: 'Free real-time padel scoring. All deuce modes, tiebreak, match history. No account needed.',
    url: 'https://www.padelscorepro.com',
    siteName: 'PadelScorePro',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PadelScorePro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PadelScorePro — The Smart Way to Track Padel Scores',
    description: 'Free real-time padel scoring. All deuce modes, tiebreak, match history. No account needed.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
