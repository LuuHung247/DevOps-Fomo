'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';
import { X, Download, Copy, Check, FileText, Code2, FileSpreadsheet } from 'lucide-react';

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
      `# 🚀 DevOps-FOMO Curated Tech Radar (${repos.length} Repositories)`,
      '',
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      '| Repository | Stars | Language | Description |',
      '| :--- | :---: | :---: | :--- |',
      ...repos.map(
        (r) =>
          `| [**${r.name}**](${r.url}) | ⭐ \`${r.stars.toLocaleString()}\` | \`${r.language || 'Unknown'}\` | ${r.description.slice(0, 100)}... |`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Export Curated Repositories</h3>
              <p className="text-xs text-slate-400">Export {repos.length} filtered repositories to Markdown, JSON, or CSV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-6 pb-2 space-y-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                format === 'markdown'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                format === 'json'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>JSON (.json)</span>
            </button>

            <button
              onClick={() => setFormat('csv')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                format === 'csv'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV (.csv)</span>
            </button>
          </div>

          {/* Preview Box */}
          <div className="relative">
            <pre className="w-full h-64 p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 overflow-auto scrollbar-thin">
              {content}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {repos.length} items ready to export
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
