
import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp } from './Animators';
import { GitPullRequest, Timer, FileCode, CheckCircle2 } from 'lucide-react';
import { Translations } from '../translations';

interface PrAnalysisProps {
  analysis: AnalysisResult;
  t: Translations;
}

export const PrAnalysis: React.FC<PrAnalysisProps> = ({ analysis, t }) => {
  return (
    <section className="space-y-4">
       <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] flex-grow bg-primary/20" />
            <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
            <GitPullRequest className="w-4 h-4" />
            {t.pr.title}
            </h3>
            <div className="h-[1px] flex-grow bg-primary/20" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Merge Rate */}
            <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.pr.mergeRate}</div>
                <div className="text-2xl font-bold text-white">
                    <CountUp end={analysis.prMergeRate} suffix="%" />
                </div>
                <div className="text-[9px] text-primary/70 mt-1">{t.pr.basedOn}</div>
            </div>

            {/* Velocity */}
            <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Timer className="w-12 h-12 text-yellow-500" />
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.pr.velocity}</div>
                <div className="text-2xl font-bold text-white">
                   <CountUp end={analysis.avgMergeTimeHours} /> <span className="text-sm font-normal text-gray-500">{t.pr.hours}</span>
                </div>
                <div className="text-[9px] text-yellow-500/70 mt-1">{t.pr.velocityDesc}</div>
            </div>

            {/* Churn - Size */}
            <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <FileCode className="w-12 h-12 text-blue-500" />
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.pr.size}</div>
                <div className="text-2xl font-bold text-white">
                    <CountUp end={analysis.avgPrSize} /> <span className="text-sm font-normal text-gray-500">{t.pr.loc}</span>
                </div>
                <div className="text-[9px] text-blue-500/70 mt-1">{t.pr.lines}</div>
            </div>

             {/* Churn - Files */}
             <div className="bg-surface-dark border border-primary/20 p-4 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <FileCode className="w-12 h-12 text-purple-500" />
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.pr.scope}</div>
                <div className="text-2xl font-bold text-white">
                    {analysis.avgPrFiles} <span className="text-sm font-normal text-gray-500">{t.pr.files}</span>
                </div>
                <div className="text-[9px] text-purple-500/70 mt-1">{t.pr.filesDesc}</div>
            </div>
        </div>
    </section>
  );
};
