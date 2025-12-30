
import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp, AnimatedBar } from './Animators';

interface CommunitySectionProps {
  analysis: AnalysisResult;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ analysis }) => {
  const totalAnalyzedPRs = analysis.openSourcePRs + analysis.personalPRs;
  const ossPercentage = totalAnalyzedPRs > 0 ? Math.round((analysis.openSourcePRs / totalAnalyzedPRs) * 100) : 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fade-in-up_0.7s_ease-out]">
      
      {/* Open Source Impact Card */}
      <div className="bg-surface-dark border border-primary/30 p-6 relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
        
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary">public</span>
          <h3 className="text-primary font-bold tracking-widest text-sm uppercase">Open Source Impact</h3>
        </div>

        <div className="flex justify-between items-end mb-4">
           <div>
             <div className="text-4xl font-bold text-white mb-1"><CountUp end={analysis.openSourcePRs} /></div>
             <div className="text-[10px] text-gray-500 uppercase tracking-widest">External Contributions</div>
           </div>
           <div className="text-right">
             <div className="text-2xl font-mono text-primary"><CountUp end={ossPercentage} suffix="%" /></div>
             <div className="text-[10px] text-gray-500 uppercase tracking-widest">Of Total PRs</div>
           </div>
        </div>

        <div className="w-full bg-surface-light h-2 rounded-full overflow-hidden mb-4 border border-primary/20">
          <AnimatedBar 
             percentage={ossPercentage} 
             className="bg-primary shadow-[0_0_10px_rgba(0,255,65,0.6)]" 
          />
        </div>

        {analysis.openSourcePRs > 5 ? (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded flex items-center gap-3">
             <span className="material-symbols-outlined text-primary text-xl">volunteer_activism</span>
             <div>
               <div className="text-xs font-bold text-white uppercase">Open Source Philanthropist</div>
               <div className="text-[10px] text-primary/70">High volume of external contributions detected.</div>
             </div>
          </div>
        ) : (
           <div className="text-[10px] text-gray-600 font-mono text-center pt-2">
             Focusing on internal/personal vectors.
           </div>
        )}
      </div>

      {/* Community & Ecosystem Card */}
      <div className="bg-surface-dark border border-primary/30 p-6 relative overflow-hidden flex flex-col justify-between">
         <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary">domain</span>
          <h3 className="text-primary font-bold tracking-widest text-sm uppercase">Ecosystem & Org</h3>
        </div>

        <div className="space-y-4">
          {/* Top Organization */}
          {analysis.topOrganization ? (
             <div className="flex items-center justify-between bg-black/40 p-3 border-l-2 border-primary/50">
               <div className="flex items-center gap-3">
                 {analysis.topOrganization.avatarUrl ? (
                    <img src={analysis.topOrganization.avatarUrl} className="w-8 h-8 rounded bg-gray-800" alt="org" />
                 ) : (
                    <span className="material-symbols-outlined text-gray-500">corporate_fare</span>
                 )}
                 <div>
                   <div className="text-xs text-primary/60 uppercase tracking-widest">Primary Org</div>
                   <div className="text-white font-bold">{analysis.topOrganization.name}</div>
                 </div>
               </div>
               {analysis.topOrganization.count > 0 && (
                 <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                   <CountUp end={analysis.topOrganization.count} /> PRs
                 </div>
               )}
             </div>
          ) : (
             <div className="text-xs text-gray-500 p-3 border border-dashed border-gray-700 text-center">
               No Organization Affiliation Detected
             </div>
          )}

          {/* Impact Star Repo */}
          {analysis.impactRepo && (
             <div className="flex items-center justify-between bg-black/40 p-3 border-l-2 border-yellow-500/50">
               <div>
                 <div className="text-xs text-yellow-500/60 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">stars</span>
                    Impact Star
                 </div>
                 <div className="text-white font-bold truncate max-w-[150px]" title={analysis.impactRepo.name}>
                   {analysis.impactRepo.owner}/{analysis.impactRepo.name}
                 </div>
               </div>
               <div className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                 <CountUp end={analysis.impactRepo.stars} /> ★
               </div>
             </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[10px] text-gray-500 uppercase tracking-widest">
           <span>Org Contributions: <CountUp end={analysis.orgPRs} /></span>
           <span>Personal: <CountUp end={analysis.personalPRs} /></span>
        </div>
      </div>

    </section>
  );
};
