'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';
import { SEED_REPOSITORIES } from '@/lib/seeds';
import { HeroApexNode } from './HeroApexNode';
import { SatelliteNode } from './SatelliteNode';

interface TechFomoCanvasProps {
  repos: RepoItem[];
  isScrolledOut?: boolean;
}

export const TechFomoCanvas: React.FC<TechFomoCanvasProps> = ({
  repos,
  isScrolledOut = false,
}) => {
  const displayRepos = repos && repos.length > 0 ? repos : SEED_REPOSITORIES;

  const top1 = displayRepos[0] || SEED_REPOSITORIES[0];
  const top2 = displayRepos[1] || SEED_REPOSITORIES[1];
  const top3 = displayRepos[2] || SEED_REPOSITORIES[2];
  const top4 = displayRepos[3] || SEED_REPOSITORIES[3];
  const top5 = displayRepos[4] || SEED_REPOSITORIES[4];

  return (
    <section className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden font-sans p-4">
      
      {/* 5-Item Spatial Stage with Dynamic Scroll Dispersion & Entrance */}
      <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center my-auto">
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center justify-center">
          
          {/* LEFT SATELLITES (#2 & #4) */}
          <div
            className={`hidden lg:flex lg:col-span-3 flex-col items-end gap-14 pr-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolledOut
                ? '-translate-x-28 opacity-0 scale-95 pointer-events-none'
                : 'translate-x-0 opacity-100 scale-100'
            }`}
          >
            <SatelliteNode
              repo={top2}
              rank={2}
              className="animate-sat-left-1"
            />
            <SatelliteNode
              repo={top4}
              rank={4}
              className="animate-sat-left-2 opacity-90 hover:opacity-100"
            />
          </div>

          {/* CENTER DOMINANT HERO (#1) */}
          <div
            className={`lg:col-span-6 flex justify-center w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolledOut
                ? '-translate-y-20 opacity-0 scale-90 blur-sm pointer-events-none'
                : 'translate-y-0 opacity-100 scale-100 blur-0 animate-hero-entrance'
            }`}
          >
            <HeroApexNode repo={top1} />
          </div>

          {/* RIGHT SATELLITES (#3 & #5) */}
          <div
            className={`hidden lg:flex lg:col-span-3 flex-col items-start gap-14 pl-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolledOut
                ? 'translate-x-28 opacity-0 scale-95 pointer-events-none'
                : 'translate-x-0 opacity-100 scale-100'
            }`}
          >
            <SatelliteNode
              repo={top3}
              rank={3}
              className="animate-sat-right-1"
            />
            <SatelliteNode
              repo={top5}
              rank={5}
              className="animate-sat-right-2 opacity-90 hover:opacity-100"
            />
          </div>

          {/* MOBILE/TABLET RESPONSIVE SATELLITES */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden w-full max-w-[460px] mx-auto pt-2 transition-all duration-700 ${
              isScrolledOut ? 'opacity-0 -translate-y-10 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100 animate-reveal'
            }`}
          >
            <SatelliteNode repo={top2} rank={2} />
            <SatelliteNode repo={top3} rank={3} />
            <SatelliteNode repo={top4} rank={4} />
            <SatelliteNode repo={top5} rank={5} />
          </div>

        </div>
      </div>

    </section>
  );
};
