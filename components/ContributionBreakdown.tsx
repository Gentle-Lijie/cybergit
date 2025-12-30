
import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp, AnimatedBar } from './Animators';
import { PieChart, GitCommit, GitPullRequest, Bug, MessageSquare } from 'lucide-react';
import { Translations } from '../translations';

interface ContributionBreakdownProps {
  analysis: AnalysisResult;
  t: Translations;
}

export const ContributionBreakdown: React.FC<ContributionBreakdownProps> = ({ analysis, t }) => {
  const { commits, prs, issues, reviews } = analysis.breakdown;
  const total = commits + prs + issues + reviews;
  
  const metrics = [
    { label: t.metrics.commits, value: commits, color: '#00FF41', icon: GitCommit },
    { label: t.metrics.prs, value: prs, color: '#3178c6', icon: GitPullRequest },
    { label: t.metrics.issues, value: issues, color: '#f1e05a', icon: Bug },
    { label: t.metrics.reviews, value: reviews, color: '#d03592', icon: MessageSquare },
  ].sort((a, b) => b.value - a.value);

  return (
    <section className="bg-surface-dark border border-primary/20 p-6 shadow-neon">
       <div className="flex items-center gap-2 mb-6">
          <PieChart className="text-primary w-5 h-5" />
          <h3 className="text-white font-bold tracking-widest text-sm uppercase">{t.breakdown.title}</h3>
       </div>

       <div className="flex flex-col gap-4">
          {/* Visual Bar */}
          <div className="flex w-full h-4 rounded-sm overflow-hidden border border-white/10">
             {metrics.map((item, idx) => {
               const pct = total > 0 ? (item.value / total) * 100 : 0;
               if (pct === 0) return null;
               return (
                  <div key={item.label} className="h-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: item.color }} title={item.label} />
               );
             })}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
             {metrics.map((item) => {
               const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
               return (
                 <div key={item.label} className="flex items-start gap-3">
                    <div className="p-2 rounded bg-white/5 border border-white/10 mt-1">
                       <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div>
                       <div className="text-xl font-bold text-white"><CountUp end={pct} suffix="%" /></div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest">{item.label}</div>
                       <div className="text-[9px] text-gray-600 font-mono mt-0.5"><CountUp end={item.value} /> {t.breakdown.ops}</div>
                    </div>
                 </div>
               )
             })}
          </div>
       </div>
    </section>
  );
};
