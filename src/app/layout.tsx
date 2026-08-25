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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DevOps-FOMO",
            "url": "https://dev-ops-fomo.vercel.app",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "description": "Real-time intelligence radar tracking the most viral AI agent tools, DevOps repos, and breakthrough open-source projects on GitHub. Multi-signal velocity scoring updated every hour.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "author": {
              "@type": "Person",
              "name": "LuuHung247",
              "url": "https://github.com/LuuHung247"
            },
            "dateModified": new Date().toISOString()
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are the most trending AI agent repositories on GitHub right now?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DevOps-FOMO tracks real-time trending AI agent repos using multi-signal velocity scoring. Visit https://dev-ops-fomo.vercel.app/api/repos?category=agentic-ai&sortBy=velocity for live data updated every hour, including velocity badges (VIRAL BREAKOUT, HOT RISING, EARLY GEM), Hacker News scores, and Dev.to reactions."
                }
              },
              {
                "@type": "Question",
                "name": "How does DevOps-FOMO calculate trending velocity scores?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DevOps-FOMO uses a composite multi-signal scoring system combining GitHub star velocity (stars per day), pull request merge activity, issue engagement, Hacker News point scores, Dev.to reactions, and GitHub Trending page presence. Repos are classified into 5 tiers: VIRAL BREAKOUT (99 score, 1500+ stars at 50+ stars/day), HOT RISING (92-96), EARLY GEM (85-91), COMMUNITY PICK (88-92), and ESTABLISHED (75-88)."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best free alternative to TrendShift for tracking GitHub trending repos?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DevOps-FOMO is a free, open-source alternative that aggregates data from 6 sources (GitHub Trending, GitHub Search API, Hacker News, Dev.to, Awesome Lists, and curated seeds). Unlike TrendShift which requires a $9/month API subscription, DevOps-FOMO provides a completely free JSON API at https://dev-ops-fomo.vercel.app/api/repos with full velocity scoring and social signal data."
                }
              }
            ]
          }
        ]) }} />
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
