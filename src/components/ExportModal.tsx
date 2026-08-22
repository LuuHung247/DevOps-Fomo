'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  repos: RepoItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, repos }) => {
  const [format, setFormat] = useState<'markdown' | 'json' | 'csv'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateContent = () => {
    if (format === 'json') {
      return JSON.stringify(
        repos.map((r) => ({
          name: r.fullName,
          url: r.url,
          stars: r.stars,
          forks: r.forks,
          language: r.language,
          description: r.description,
          topics: r.topics,
          velocityLabel: r.velocityLabel,
        })),
        null,
        2
      );
    }

    if (format === 'csv') {
      const headers = ['Repository', 'Stars', 'Forks', 'Language', 'Description', 'URL'];
      const rows = repos.map((r) => [
        `"${r.fullName}"`,
        r.stars,
        r.forks,
        `"${r.language || ''}"`,
        `"${(r.description || '').replace(/"/g, '""')}"`,
        `"${r.url}"`,
      ]);
      return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    }

    // Markdown default
    const lines = [
      `# DevOps-FOMO Curated Tech Radar (${repos.length} Repositories)`,
      '',
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      '| Repository | Stars | Language | Description |',
      '| :--- | :---: | :---: | :--- |',
      ...repos.map(
        (r) =>
          `| [**${r.name}**](${r.url}) | \`${r.stars.toLocaleString()}\` | \`${r.language || 'Unknown'}\` | ${r.description.slice(0, 100)}... |`
      ),
      '',
      '---',
      '*Exported from [DevOps-FOMO](https://github.com/LuuHung247/DevOps-Fomo)*',
    ];
    return lines.join('\n');
  };

  const content = generateContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devops-fomo-export.${format === 'markdown' ? 'md' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h3 className="font-bold text-white text-base font-mono">EXPORT REPOSITORY CATALOG</h3>
            <p className="text-xs text-slate-400 font-mono">Export {repos.length} items to Markdown, JSON, or CSV</p>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded text-xs font-mono text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
          >
            [Close]
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-6 pb-2 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                format === 'markdown'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Markdown (.md)
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                format === 'json'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              JSON (.json)
            </button>

            <button
              onClick={() => setFormat('csv')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                format === 'csv'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              CSV (.csv)
            </button>
          </div>

          {/* Preview Box */}
          <div className="relative">
            <pre className="w-full h-64 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-auto scrollbar-thin">
              {content}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between font-mono">
          <span className="text-xs text-slate-400">
            {repos.length} items ready
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
