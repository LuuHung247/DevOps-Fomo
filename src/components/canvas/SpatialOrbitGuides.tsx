'use client';

import React from 'react';

export const SpatialOrbitGuides: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Background Subtle Tech Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 65% 60% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* SVG Spatial Orbit Rings & Trajectory Guides */}
      <svg
        className="w-full h-full max-w-[1400px] max-h-[900px] opacity-25"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="500" cy="300" r="280" fill="url(#orbitGlow)" />

        {/* Orbit Ring 1 (Inner Guide) */}
        <ellipse
          cx="500"
          cy="300"
          rx="250"
          ry="190"
          stroke="#06b6d4"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.4"
        />

        {/* Orbit Ring 2 (Outer Orbit) */}
        <ellipse
          cx="500"
          cy="300"
          rx="410"
          ry="270"
          stroke="#06b6d4"
          strokeWidth="1"
          strokeDasharray="2 8"
          strokeOpacity="0.25"
        />

        {/* Diagonal Trajectory Vector Lines */}
        {/* Top-Left to Center */}
        <line x1="180" y1="120" x2="350" y2="230" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="3 5" />
        {/* Top-Right to Center */}
        <line x1="820" y1="120" x2="650" y2="230" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="3 5" />
        {/* Bottom-Left to Center */}
        <line x1="180" y1="480" x2="350" y2="370" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="3 5" />
        {/* Bottom-Right to Center */}
        <line x1="820" y1="480" x2="650" y2="370" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="3 5" />

        {/* Small Coordinate Crosshairs */}
        <circle cx="500" cy="300" r="3" fill="#06b6d4" fillOpacity="0.6" />
        <line x1="490" y1="300" x2="510" y2="300" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="500" y1="290" x2="500" y2="310" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" />
      </svg>
    </div>
  );
};
