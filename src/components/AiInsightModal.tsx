'use client';

import React, { useState, useEffect } from 'react';
import { RepoItem } from '@/lib/types';
import { X, Sparkles, Star, Users, CheckCircle2, Layers, ExternalLink, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';

interface AiInsightModalProps {
  repo: RepoItem | null;
  onClose: () => void;
}

interface DynamicInsight {
  tagline: string;
  whyUseful: string;
  targetAudience: string[];
  topFeatures: string[];
  architectureFit?: string;
}

export const AiInsightModal: React.FC<AiInsightModalProps> = ({ repo, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<DynamicInsight | null>(null);

  useEffect(() => {
    if (!repo) {
      setInsight(null);
      return;
    }

    // If pre-seeded AI summary exists, use it immediately
    if (repo.aiSummary) {
      setInsight({
        tagline: repo.aiSummary.tagline,
        whyUseful: repo.aiSummary.whyUseful,
        targetAudience: repo.aiSummary.targetAudience,
        topFeatures: repo.aiSummary.topFeatures,
        architectureFit: 'Core foundation for cloud-native DevOps & AI engineering workloads.'
      });
      return;
    }

    // Fetch dynamic AI analysis
    let isMounted = true;
    setLoading(true);

    fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: repo.fullName,
        description: repo.description,
        topics: repo.topics,
        stars: repo.stars,
        language: repo.language,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.insight) {
          setInsight(data.insight);
        }
      })
      .catch((err) => {
        console.error('Error fetching AI insight:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [repo]);

  if (!repo) return null;

  const starHistoryUrl = `https://star-history.com/#${repo.fullName}&Date`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                AI Repository Deep-Dive
              </h3>
              <p className="text-xs text-slate-400">Community utility & architecture assessment</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Repo Quick Identity */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center space-x-3">
              <img
                src={repo.ownerAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
                alt={repo.owner}
                className="w-12 h-12 rounded-xl border border-slate-600 bg-slate-900 flex-shrink-0"
              />
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-1.5">
                  {repo.fullName}
                  {repo.isVerified && <ShieldCheck className="w-4 h-4 text-brand-400" />}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{repo.description}</p>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-center space-x-1 text-amber-400 font-mono font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{repo.stars.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5">{repo.language}</span>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-7 h-7 text-brand-400 animate-spin" />
              <p className="text-xs">Analyzing repository characteristics...</p>
            </div>
          )}

          {/* Insight Content */}
          {!loading && insight && (
            <div className="space-y-5">
              
              {/* Tagline Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/10 via-teal-500/10 to-transparent border border-brand-500/20">
                <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
                  Core Proposition
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  {insight.tagline}
                </p>
              </div>

              {/* Why Useful */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  Why The Community Uses It
                </h5>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                  {insight.whyUseful}
                </p>
              </div>

              {/* Standout Features */}
              {insight.topFeatures && insight.topFeatures.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Key Capabilities & Highlights
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {insight.topFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200 bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Audience & Stack Fit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {insight.targetAudience && (
                  <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      Ideal For
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.targetAudience.map((role, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {insight.architectureFit && (
                  <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      Stack Fit
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {insight.architectureFit}
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <a
            href={starHistoryUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Star History Graph</span>
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-brand-500/20 transition-colors"
            >
              <span>Explore Repo on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
