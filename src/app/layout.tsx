import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TGM Lead Scraper',
  description: 'Prospection automatique TGM Automation'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: '#0a0a0f', color: '#e8e8f0', fontFamily: "'Syne', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
