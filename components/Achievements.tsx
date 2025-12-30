
import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp } from './Animators';

interface AchievementsProps {
  analysis: AnalysisResult;
}

export const Achievements: React.FC<AchievementsProps> = ({ analysis }) => {
  const formatNumber = (num: number) => {
    // We'll let CountUp handle small numbers, but for very large ones we could add suffix logic in CountUp
    // For now, simpler is cleaner for animation.
    return num;
  };

  const getRefactorLevel = () => {
    if (analysis.refactorRatio > 1.2) return { title: 'THE DELETER', color: 'text-red-500', desc: 'Code deleted > added' };
    if (analysis.refactorRatio > 0.8) return { title: 'REFACTOR MONK', color: 'text-yellow-400', desc: 'Balanced addition/deletion' };
    return { title: 'CREATOR', color: 'text-primary', desc: 'Mostly new features' };
  };

  const refactorStatus = getRefactorLevel();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-primary/20" />
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">military_tech</span>
          Influence_&_Achievements
        </h3>
        <div className="h-[1px] flex-grow bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Influence Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-surface-dark to-black border border-primary/30 p-6 flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="flex gap-4 sm:gap-6 z-10 flex-wrap justify-center">
            <div>
               <span className="material-symbols-outlined text-yellow-500 text-3xl mb-2">star</span>
               <div className="text-2xl font-bold text-white"><CountUp end={analysis.totalStars} /></div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest">Stars Earned</div>
            </div>
            <div className="hidden sm:block w-[1px] bg-white/10" />
            <div>
               <span className="material-symbols-outlined text-blue-400 text-3xl mb-2">fork_right</span>
               <div className="text-2xl font-bold text-white"><CountUp end={analysis.totalForks} /></div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest">Times Forked</div>
            </div>
          </div>
        </div>

        {/* Refactor Status */}
        <div className="md:col-span-1 bg-surface-dark border border-primary/30 p-6 relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
           
           <div>
             <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Code Entropy</div>
             <div className={`text-2xl font-black italic ${refactorStatus.color} tracking-tighter`}>
               {refactorStatus.title}
             </div>
             <div className="text-xs text-gray-400 mt-1">{refactorStatus.desc}</div>
           </div>

           <div className="mt-4 flex text-[10px] font-mono gap-4">
             <span className="text-green-400">++<CountUp end={analysis.totalAdditions} /></span>
             <span className="text-red-400">--<CountUp end={analysis.totalDeletions} /></span>
           </div>
        </div>

        {/* Hot Project */}
        <div className="md:col-span-1 bg-surface-dark border border-primary/30 p-6 relative flex flex-col justify-between">
           <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">High Value Target</div>
           <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary mt-1">local_fire_department</span>
              <div className="overflow-hidden">
                <div className="text-lg font-bold text-white truncate w-full" title={analysis.hottestProject}>
                  {analysis.hottestProject}
                </div>
                <div className="text-xs text-primary/60">Most active repository</div>
              </div>
           </div>
           <div className="mt-2 h-1 w-full bg-white/10 overflow-hidden">
              <div className="h-full bg-orange-500 animate-[loading_3s_ease-in-out_infinite] w-full" />
           </div>
        </div>
      </div>
    </section>
  );
};
