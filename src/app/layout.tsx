import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = 'https://dev-ops-fomo.vercel.app';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'DevOps-FOMO — We track the hype so you don\'t have to',
  description: 'Real-time radar for the most viral AI agent tools, DevOps repos, and breakthrough projects on GitHub. Stay ahead without the scroll.',
  keywords: [
    'GitHub trending', 'AI tools', 'DevOps', 'agent skills', 'Claude Code', 'MLOps',
    'LLMOps', 'open source', 'tech radar', 'Kubernetes', 'viral repos', 'developer tools',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'DevOps-FOMO',
    title: 'DevOps-FOMO — We track the hype so you don\'t have to',
    description: 'Real-time radar for the most viral AI agent tools, DevOps repos, and breakthrough projects on GitHub.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'DevOps-FOMO — Real-time GitHub trend radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@DevOpsFomo',
    creator: '@LuuHung247',
    title: 'DevOps-FOMO — We track the hype so you don\'t have to',
    description: 'Real-time radar for viral AI agent tools, DevOps repos, and breakout GitHub projects.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#020617] text-slate-100 min-h-screen relative overflow-x-hidden font-sans">
        {/* Ambient sci-fi aura glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-[30%] right-[10%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[160px]" />
          <div className="absolute top-[65%] left-[5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
