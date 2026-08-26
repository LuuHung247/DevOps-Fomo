'use client';

import React, { useState, useEffect } from 'react';

export const SplashIntro: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(20);
  const [statusText, setStatusText] = useState('Initializing intelligence feed...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(65);
      setStatusText('Scanning 7,100+ repositories & live signals...');
    }, 200);

    const t2 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ecosystem intelligence synchronized.');
    }, 600);

    const t3 = setTimeout(() => {
      setFading(true);
    }, 950);

    const t4 = setTimeout(() => {
      setVisible(false);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-300 font-sans ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full px-6 text-center space-y-5">
        {/* Logo with Pulse */}
        <div className="flex items-center justify-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Tech</span>
            <span className="text-amber-400">FOMO</span>
            <span className="text-xs font-mono text-slate-500 ml-1">.dev</span>
          </span>
        </div>

        {/* Slogan */}
        <p className="text-sm sm:text-base font-mono font-bold text-slate-300">
          "We track the hype so you don't have to."
        </p>

        {/* Progress Bar & Status */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{statusText}</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
