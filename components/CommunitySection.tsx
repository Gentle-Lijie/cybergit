
import React from 'react';
import { AnalysisResult, UserData } from '../types';
import { CountUp, AnimatedBar } from './Animators';
import { Globe, HandHeart, Building2, Sparkles, ExternalLink, Network } from 'lucide-react';
import { Translations } from '../translations';

interface CommunitySectionProps {
  analysis: AnalysisResult;
  organizations: UserData['organizations'];
  t: Translations;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ analysis, organizations, t }) => {
  const totalAnalyzedPRs = analysis.openSourcePRs + analysis.personalPRs;
  const ossPercentage = totalAnalyzedPRs > 0 ? Math.round((analysis.openSourcePRs / totalAnalyzedPRs) * 100) : 0;

  return (
    <section className="space-y-6 animate-[fade-in-up_0.7s_ease-out]">
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-primary/20" />
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
          <Network className="w-4 h-4" />
          {t.community.title}
        </h3>
        <div className="h-[1px] flex-grow bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Open Source Impact Card */}
        <div className="bg-surface-dark border border-primary/30 p-6 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
          
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-primary w-5 h-5" />
            <h3 className="text-primary font-bold tracking-widest text-sm uppercase">{t.community.ossImpact}</h3>
          </div>

          <div className="flex justify-between items-end mb-4">
             <div>
               <div className="text-4xl font-bold text-white mb-1"><CountUp end={analysis.openSourcePRs} /></div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t.community.extContrib}</div>
             </div>
             <div className="text-right">
               <div className="text-2xl font-mono text-primary"><CountUp end={ossPercentage} suffix="%" /></div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t.community.ofTotal}</div>
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
               <HandHeart className="text-primary w-5 h-5" />
               <div>
                 <div className="text-xs font-bold text-white uppercase">{t.community.philanthropist}</div>
                 <div className="text-[10px] text-primary/70">{t.community.philanthropistDesc}</div>
               </div>
            </div>
          ) : (
             <div className="text-[10px] text-gray-600 font-mono text-center pt-2">
               {t.community.focusInternal}
             </div>
          )}
        </div>

        {/* Community & Ecosystem Card */}
        <div className="bg-surface-dark border border-primary/30 p-6 relative overflow-hidden flex flex-col">
           <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-primary w-5 h-5" />
            <h3 className="text-primary font-bold tracking-widest text-sm uppercase">{t.community.orgNetwork}</h3>
          </div>

          <div className="flex-grow space-y-4">
              {organizations.nodes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                      {organizations.nodes.map((org, idx) => (
                          <a 
                             key={idx} 
                             href={org.websiteUrl || `https://github.com/${org.login}`} 
                             target="_blank" 
                             rel="noreferrer"
                             className="flex items-center gap-3 bg-black/40 p-2 border border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all group"
                          >
                              <img src={org.avatarUrl} className="w-8 h-8 rounded bg-gray-800" alt={org.login} />
                              <div className="overflow-hidden">
                                  <div className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">{org.name || org.login}</div>
                                  <div className="text-[9px] text-gray-500 truncate flex items-center gap-1">
                                      @{org.login} <ExternalLink className="w-2 h-2" />
                                  </div>
                              </div>
                          </a>
                      ))}
                  </div>
              ) : (
                  <div className="text-xs text-gray-500 p-3 border border-dashed border-gray-700 text-center">
                      {t.community.noOrg}
                  </div>
              )}
          </div>

          {/* Impact Star Repo Highlight (if space permits or logical fit) */}
          {analysis.impactRepo && (
               <div className="mt-4 pt-4 border-t border-white/5">
                   <div className="flex items-center justify-between bg-black/40 p-3 border-l-2 border-yellow-500/50">
                      <div>
                          <div className="text-xs text-yellow-500/60 uppercase tracking-widest flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {t.community.impactStar}
                          </div>
                          <div className="text-white font-bold truncate max-w-[150px]" title={analysis.impactRepo.name}>
                          {analysis.impactRepo.owner}/{analysis.impactRepo.name}
                          </div>
                      </div>
                      <div className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                          <CountUp end={analysis.impactRepo.stars} /> ★
                      </div>
                   </div>
               </div>
            )}
        </div>

      </div>
    </section>
  );
};
