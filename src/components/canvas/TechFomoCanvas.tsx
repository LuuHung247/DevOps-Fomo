'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';
import { SEED_REPOSITORIES } from '@/lib/seeds';
import { RadarHeader } from './RadarHeader';
import { SpatialOrbitGuides } from './SpatialOrbitGuides';
import { HeroApexNode } from './HeroApexNode';
import { SatelliteNode } from './SatelliteNode';
import { IntelligenceDetailPanel } from './IntelligenceDetailPanel';

interface TechFomoCanvasProps {
  repos: RepoItem[];
}

export const TechFomoCanvas: React.FC<TechFomoCanvasProps> = ({ repos }) => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'LIVE'>('LIVE');
  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Guarantee instant render with fallback
  const displayRepos = repos && repos.length > 0 ? repos : SEED_REPOSITORIES;

  // Extract Top 5 ecosystem breakouts
  const top1 = displayRepos[0] || SEED_REPOSITORIES[0];
  const top2 = displayRepos[1] || SEED_REPOSITORIES[1];
  const top3 = displayRepos[2] || SEED_REPOSITORIES[2];
  const top4 = displayRepos[3] || SEED_REPOSITORIES[3];
  const top5 = displayRepos[4] || SEED_REPOSITORIES[4];

  // Active repo for detail panel
  const activeSelectedRepo =
    selectedRank === 1
      ? top1
      : selectedRank === 2
      ? top2
      : selectedRank === 3
      ? top3
      : selectedRank === 4
      ? top4
      : top5;

  const handleSelectNode = (rank: number) => {
    setSelectedRank(rank);
    setIsDetailOpen(true);
  };

  const handleScrollDown = () => {
    const feed = document.getElementById('main-feed');
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[#030712] font-sans pb-4">
      {/* 1. Canvas Top Radar Header */}
      <RadarHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        trackedCount={displayRepos.length}
      />

      {/* 2. Spatial Intelligence Landscape (The Orbit Canvas) */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center my-auto py-2">
        
        {/* Background Orbit Guide Rings & Vectors */}
        <SpatialOrbitGuides />

        {/* Spatial Node Composition (Desktop Orbital Grid / Mobile Responsive) */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center justify-center max-w-6xl mx-auto">
          
          {/* LEFT SATELLITE COLUMN (Tier 2 & Tier 3: #2 & #4) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-end gap-14 pr-2">
            {/* Satellite #2 (Top Left) */}
            <SatelliteNode
              repo={top2}
              rank={2}
              isSelected={selectedRank === 2}
              onClick={() => handleSelectNode(2)}
              className="transform hover:-translate-x-1"
            />

            {/* Satellite #4 (Bottom Left) */}
            <SatelliteNode
              repo={top4}
              rank={4}
              isSelected={selectedRank === 4}
              onClick={() => handleSelectNode(4)}
              className="transform hover:-translate-x-1 opacity-90 hover:opacity-100"
            />
          </div>

          {/* CENTER DOMINANT HERO (#1 APEX FOCAL POINT) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <HeroApexNode
              repo={top1}
              isSelected={selectedRank === 1}
              onClick={() => handleSelectNode(1)}
              onScrollDown={handleScrollDown}
            />
          </div>

          {/* RIGHT SATELLITE COLUMN (Tier 2 & Tier 3: #3 & #5) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-start gap-14 pl-2">
            {/* Satellite #3 (Top Right) */}
            <SatelliteNode
              repo={top3}
              rank={3}
              isSelected={selectedRank === 3}
              onClick={() => handleSelectNode(3)}
              className="transform hover:translate-x-1"
            />

            {/* Satellite #5 (Bottom Right) */}
            <SatelliteNode
              repo={top5}
              rank={5}
              isSelected={selectedRank === 5}
              onClick={() => handleSelectNode(5)}
              className="transform hover:translate-x-1 opacity-90 hover:opacity-100"
            />
          </div>

          {/* MOBILE/TABLET RESPONSIVE SATELLITES GRID (visible on < lg) */}
          <div className="grid grid-cols-2 gap-3.5 lg:hidden w-full max-w-[420px] mx-auto pt-2">
            <SatelliteNode
              repo={top2}
              rank={2}
              isSelected={selectedRank === 2}
              onClick={() => handleSelectNode(2)}
            />
            <SatelliteNode
              repo={top3}
              rank={3}
              isSelected={selectedRank === 3}
              onClick={() => handleSelectNode(3)}
            />
            <SatelliteNode
              repo={top4}
              rank={4}
              isSelected={selectedRank === 4}
              onClick={() => handleSelectNode(4)}
            />
            <SatelliteNode
              repo={top5}
              rank={5}
              isSelected={selectedRank === 5}
              onClick={() => handleSelectNode(5)}
            />
          </div>

        </div>

      </div>

      {/* 3. Slide-in Intelligence Detail Panel */}
      <IntelligenceDetailPanel
        repo={activeSelectedRepo}
        rank={selectedRank}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  );
};
