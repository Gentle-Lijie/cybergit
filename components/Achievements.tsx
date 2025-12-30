
import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp } from './Animators';
import { Award, Star, GitFork, Flame } from 'lucide-react';
import { Translations } from '../translations';

interface AchievementsProps {
  analysis: AnalysisResult;
  t: Translations;
}

export const Achievements: React.FC<AchievementsProps> = ({ analysis, t }) => {
  const getRefactorLevel = () => {
    if (analysis.refactorRatio > 1.2) return { title: t.achievements.levels.deleter, color: 'text-red-500', desc: t.achievements.levelDescs.deleter };
    if (analysis.refactorRatio > 0.8) return { title: t.achievements.levels.monk, color: 'text-yellow-400', desc: t.achievements.levelDescs.monk };
    return { title: t.achievements.levels.creator, color: 'text-primary', desc: t.achievements.levelDescs.creator };
  };

  const refactorStatus = getRefactorLevel();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-primary/20" />
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
          <Award className="w-4 h-4" />
          {t.achievements.title}
        </h3>
        <div className="h-[1px] flex-grow bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Influence Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-surface-dark to-black border border-primary/30 p-6 flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="flex gap-4 sm:gap-6 z-10 flex-wrap justify-center">
            <div className="flex flex-col items-center">
               <Star className="text-yellow-500 w-8 h-8 mb-2" />
               <div className="text-2xl font-bold text-white"><CountUp end={analysis.totalStars} /></div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t.achievements.stars}</div>
            </div>
            <div className="hidden sm:block w-[1px] bg-white/10" />
            <div className="flex flex-col items-center">
               <GitFork className="text-blue-400 w-8 h-8 mb-2" />
               <div className="text-2xl font-bold text-white"><CountUp end={analysis.totalForks} /></div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t.achievements.forks}</div>
            </div>
          </div>
        </div>

        {/* Refactor Status */}
        <div className="md:col-span-1 bg-surface-dark border border-primary/30 p-6 relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
           
           <div>
             <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{t.achievements.entropy}</div>
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
           <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{t.achievements.target}</div>
           <div className="flex items-start gap-2">
              <Flame className="text-primary w-5 h-5 mt-1" />
              <div className="overflow-hidden">
                <div className="text-lg font-bold text-white truncate w-full" title={analysis.hottestProject}>
                  {analysis.hottestProject}
                </div>
                <div className="text-xs text-primary/60">{t.achievements.activeRepo}</div>
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
