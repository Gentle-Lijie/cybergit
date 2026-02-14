import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp } from './Animators';
import { Radar, ShieldCheck, GitCommitHorizontal, Clock3 } from 'lucide-react';
import { Translations } from '../translations';

interface AdvancedInsightsProps {
  analysis: AnalysisResult;
  t: Translations;
}

export const AdvancedInsights: React.FC<AdvancedInsightsProps> = ({ analysis, t }) => {
  const ownershipRatio = analysis.filteredRepoCount > 0
    ? Math.round((analysis.ownedOrAdminRepoCount / analysis.filteredRepoCount) * 100)
    : 0;

  const commitCoverage = analysis.filteredRepoCount > 0
    ? Math.round((analysis.reposWithOwnCommits / analysis.filteredRepoCount) * 100)
    : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-[1px] flex-grow bg-primary/20" />
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
          <Radar className="w-4 h-4" />
          {t.insights.title}
        </h3>
        <div className="h-[1px] flex-grow bg-primary/20" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
            <ShieldCheck className="w-12 h-12 text-green-400" />
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.insights.ownershipControl}</div>
          <div className="text-2xl font-bold text-white">
            <CountUp end={ownershipRatio} suffix="%" />
          </div>
          <div className="text-[9px] text-green-400/70 mt-1">{analysis.ownedOrAdminRepoCount}/{analysis.filteredRepoCount}</div>
        </div>

        <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
            <GitCommitHorizontal className="w-12 h-12 text-primary" />
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.insights.commitCoverage}</div>
          <div className="text-2xl font-bold text-white">
            <CountUp end={commitCoverage} suffix="%" />
          </div>
          <div className="text-[9px] text-primary/70 mt-1">{analysis.reposWithOwnCommits}/{analysis.filteredRepoCount}</div>
        </div>

        <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
            <GitCommitHorizontal className="w-12 h-12 text-blue-400" />
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.insights.commitDensity}</div>
          <div className="text-2xl font-bold text-white">
            {analysis.commitDensity}
          </div>
          <div className="text-[9px] text-blue-400/70 mt-1">{t.insights.perRepo}</div>
        </div>

        <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
            <Clock3 className="w-12 h-12 text-yellow-400" />
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.insights.freshness90d}</div>
          <div className="text-2xl font-bold text-white">
            <CountUp end={Math.round(analysis.repoFreshnessRatio * 100)} suffix="%" />
          </div>
          <div className="text-[9px] text-yellow-400/70 mt-1">{t.insights.activeRecently}</div>
        </div>
      </div>
    </section>
  );
};
