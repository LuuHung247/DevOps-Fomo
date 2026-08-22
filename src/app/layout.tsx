import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevOps-FOMO | AI & DevOps Tech Radar & Trending Tracker',
  description: 'Real-time discovery and intelligence hub for community-verified, high-utility, and rapidly rising GitHub repositories in AI, DevOps, MLOps, and Cloud-Native.',
  keywords: ['DevOps', 'AI', 'MLOps', 'LLMOps', 'GitHub', 'Trending Repos', 'Architecture', 'Kubernetes', 'Tech Radar'],
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
