'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RepoItem, ReposApiResponse } from '@/lib/types';
import { VariantHorizontalRail } from '@/components/leaderboard/VariantHorizontalRail';
import { VariantPodiumBento } from '@/components/leaderboard/VariantPodiumBento';
import { VariantMarqueeTicker } from '@/components/leaderboard/VariantMarqueeTicker';
import { VariantChipStrip } from '@/components/leaderboard/VariantChipStrip';

export default function PreviewPage() {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVariant, setActiveVariant] = useState<1 | 2 | 3 | 4 | 'all'>('all');

  useEffect(() => {
    fetch('/api/repos?sortBy=velocity')
      .then((res) => res.json())
      .then((data: ReposApiResponse) => {
        if (data && data.repos) {
          setRepos(data.repos);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                ← Back to Main App
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Design Studio
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-1">
              🎨 Leaderboard UI Variant Preview & Selection
            </h1>
          </div>

          {/* Variant Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveVariant('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeVariant === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Variants
            </button>
            <button
              onClick={() => setActiveVariant(1)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                activeVariant === 1
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option 1: Rail
            </button>
            <button
              onClick={() => setActiveVariant(2)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                activeVariant === 2
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option 2: Podium
            </button>
            <button
              onClick={() => setActiveVariant(3)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                activeVariant === 3
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option 3: Ticker
            </button>
            <button
              onClick={() => setActiveVariant(4)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                activeVariant === 4
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option 4: Chips
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-mono text-sm">
            Loading preview data...
          </div>
        ) : (
          <>
            {/* OPTION 1 */}
            {(activeVariant === 'all' || activeVariant === 1) && (
              <section className="p-6 rounded-2xl bg-slate-950/60 border border-emerald-500/30 relative">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                      OPTION 1 (RECOMMENDED)
                    </span>
                    <h2 className="text-base font-bold text-white mt-1">
                      Linear / Vercel Horizontal Spotlight Rail
                    </h2>
                    <p className="text-xs text-slate-400">
                      Gọn gàng, hiện đại, vuốt ngang mượt mà, không chiếm diện tích thân trang.
                    </p>
                  </div>
                </div>
                <VariantHorizontalRail repos={repos} />
              </section>
            )}

            {/* OPTION 2 */}
            {(activeVariant === 'all' || activeVariant === 2) && (
              <section className="p-6 rounded-2xl bg-slate-950/60 border border-amber-500/30 relative">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      OPTION 2
                    </span>
                    <h2 className="text-base font-bold text-white mt-1">
                      Bento Podium Top 3 Spotlight (Raycast / Apple Style)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Bục vinh danh 3 cột cân đối: #1 ở giữa vươn cao viền sáng rực rỡ, #2 và #3 đối xứng hai bên.
                    </p>
                  </div>
                </div>
                <VariantPodiumBento repos={repos} />
              </section>
            )}

            {/* OPTION 3 */}
            {(activeVariant === 'all' || activeVariant === 3) && (
              <section className="p-6 rounded-2xl bg-slate-950/60 border border-red-500/30 relative">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                      OPTION 3
                    </span>
                    <h2 className="text-base font-bold text-white mt-1">
                      Compact Live Marquee Ticker (CoinMarketCap / HN Live Style)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Dải băng chuyền siêu thanh lịch, một dòng duy nhất với huy hiệu live radar.
                    </p>
                  </div>
                </div>
                <VariantMarqueeTicker repos={repos} />
              </section>
            )}

            {/* OPTION 4 */}
            {(activeVariant === 'all' || activeVariant === 4) && (
              <section className="p-6 rounded-2xl bg-slate-950/60 border border-violet-500/30 relative">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-black text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-500/40">
                      OPTION 4
                    </span>
                    <h2 className="text-base font-bold text-white mt-1">
                      Minimalist Interactive Chip Strip
                    </h2>
                    <p className="text-xs text-slate-400">
                      Hàng nút chip tương tác: bấm chọn repo nào thì hiển thị chi tiết repo đó bên dưới.
                    </p>
                  </div>
                </div>
                <VariantChipStrip repos={repos} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
