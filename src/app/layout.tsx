import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevOps-FOMO | Verified AI & DevOps Repos Tracker',
  description: 'Never miss a hot, game-changing GitHub repository in AI, DevOps, MLOps, and Architecture. Live tracking and community-verified insights.',
  keywords: ['DevOps', 'AI', 'MLOps', 'LLMOps', 'GitHub', 'Trending Repos', 'Architecture', 'Kubernetes'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen relative overflow-x-hidden">
        {/* Background ambient lighting */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-[15%] left-[20%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[130px]" />
          <div className="absolute top-[35%] right-[10%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
