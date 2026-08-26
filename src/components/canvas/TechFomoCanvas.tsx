'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';
import { SEED_REPOSITORIES } from '@/lib/seeds';
import { HeroApexNode } from './HeroApexNode';
import { SatelliteNode } from './SatelliteNode';

interface TechFomoCanvasProps {
  repos: RepoItem[];
}

export const TechFomoCanvas: React.FC<TechFomoCanvasProps> = ({ repos }) => {
  const displayRepos = repos && repos.length > 0 ? repos : SEED_REPOSITORIES;

  const top1 = displayRepos[0] || SEED_REPOSITORIES[0];
  const top2 = displayRepos[1] || SEED_REPOSITORIES[1];
  const top3 = displayRepos[2] || SEED_REPOSITORIES[2];
  const top4 = displayRepos[3] || SEED_REPOSITORIES[3];
  const top5 = displayRepos[4] || SEED_REPOSITORIES[4];

  const handleScrollDown = () => {
    const feed = document.getElementById('main-feed');
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden bg-[#030712] font-sans py-4">
      
      {/* Spatial 5-Item Showcase Composition */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center my-auto">
        
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center justify-center max-w-6xl mx-auto">
          
          {/* LEFT SATELLITES (#2 & #4) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-end gap-14 pr-2">
            <SatelliteNode
              repo={top2}
              rank={2}
              className="transform hover:-translate-x-1"
            />
            <SatelliteNode
              repo={top4}
              rank={4}
              className="transform hover:-translate-x-1 opacity-90 hover:opacity-100"
            />
          </div>

          {/* CENTER DOMINANT HERO (#1) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <HeroApexNode
              repo={top1}
              onScrollDown={handleScrollDown}
            />
          </div>

          {/* RIGHT SATELLITES (#3 & #5) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-start gap-14 pl-2">
            <SatelliteNode
              repo={top3}
              rank={3}
              className="transform hover:translate-x-1"
            />
            <SatelliteNode
              repo={top5}
              rank={5}
              className="transform hover:translate-x-1 opacity-90 hover:opacity-100"
            />
          </div>

          {/* MOBILE/TABLET RESPONSIVE SATELLITES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden w-full max-w-[460px] mx-auto pt-2">
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
