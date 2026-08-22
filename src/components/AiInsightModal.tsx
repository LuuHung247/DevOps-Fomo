'use client';

import React, { useState, useEffect } from 'react';
import { RepoItem } from '@/lib/types';
import { X, Sparkles, Star, Users, CheckCircle2, Layers, ExternalLink, TrendingUp, ShieldCheck, Loader2, Cpu, Wrench } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                AI Tech Radar Review
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
          
          {/* Repo Identity Header */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center space-x-3.5 min-w-0">
              <img
                src={repo.ownerAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
                alt={repo.owner}
                className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-900 flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-white text-base flex items-center gap-1.5 truncate">
                  {repo.fullName}
                  {repo.isVerified && (
                    <span title="Community Verified">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </span>
                  )}
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
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-xs font-mono">Generating AI evaluation report...</p>
            </div>
          )}

          {/* Insight Content */}
          {!loading && insight && (
            <div className="space-y-5">
              
              {/* Tagline Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20">
                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 font-mono">
                  Core Value Proposition
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  {insight.tagline}
                </p>
              </div>

              {/* Why Useful */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Why The Community Relies On It
                </h5>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  {insight.whyUseful}
                </p>
              </div>

              {/* Standout Features */}
              {insight.topFeatures && insight.topFeatures.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    Key Capabilities & Strengths
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {insight.topFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200 bg-slate-950/80 px-3 py-2.5 rounded-xl border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Audience & Stack Fit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insight.targetAudience && (
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      Ideal Roles
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.targetAudience.map((role, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {insight.architectureFit && (
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      Stack Layer Fit
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
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors font-mono"
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
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>View Repository on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
