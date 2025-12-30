
import React from 'react';
import { AnalysisResult } from '../types';
import { CountUp, useInView, Typewriter } from './Animators';

interface HabitsSectionProps {
  analysis: AnalysisResult;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({ analysis }) => {
  const { ref: chartRef, isInView: chartInView } = useInView();

  // Find max for scaling
  const maxCommits = Math.max(...analysis.hoursDistribution, 1);
  const totalCommits = analysis.hoursDistribution.reduce((a, b) => a + b, 0) || 1;
  
  const breakdown = [
    { label: 'Night (00-06)', value: analysis.periodBreakdown.night, color: 'text-blue-400' },
    { label: 'Morning (06-12)', value: analysis.periodBreakdown.morning, color: 'text-yellow-400' },
    { label: 'Afternoon (12-18)', value: analysis.periodBreakdown.afternoon, color: 'text-orange-400' },
    { label: 'Evening (18-24)', value: analysis.periodBreakdown.evening, color: 'text-purple-400' },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Time Chronotype - Histogram */}
      <div className="bg-surface-dark border border-primary/20 p-6 shadow-neon relative overflow-hidden group flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">timelapse</span>
            Chronotype_Analysis
          </h3>
          <div className="text-right">
             <div className="text-xs md:text-sm font-bold text-white uppercase">
                <Typewriter text={analysis.timeCategory} speed={50} delay={500} />
             </div>
             <div className="text-[9px] md:text-[10px] text-gray-500">
                <Typewriter text={analysis.timeDescription} speed={20} delay={1000} />
             </div>
          </div>
        </div>

        {/* Histogram */}
        <div className="flex-grow flex flex-col items-center justify-end relative h-[140px] w-full px-2 mt-2" ref={chartRef}>
           <div className="flex justify-between items-end w-full h-[100px] gap-[1px]">
             {analysis.hoursDistribution.map((count, hour) => {
               const heightPct = (count / maxCommits) * 100;
               const isPeak = hour === analysis.topHour;
               return (
                 <div key={hour} className="flex flex-col items-center flex-1 h-full justify-end group/bar relative">
                   {/* Tooltip */}
                   <div className="opacity-0 group-hover/bar:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black border border-primary text-[9px] text-primary px-1 py-0.5 whitespace-nowrap z-20 pointer-events-none shadow-neon">
                      {hour}:00 ({count})
                   </div>
                   
                   <div 
                    className={`w-full rounded-sm transition-all duration-1000 ease-out ${isPeak ? 'bg-primary shadow-[0_0_8px_#00FF41]' : 'bg-primary/20 hover:bg-primary/60'}`}
                    style={{ 
                        height: chartInView ? `${Math.max(heightPct, 2)}%` : '0%',
                        transitionDelay: `${hour * 30}ms`
                    }} 
                   />
                 </div>
               );
             })}
           </div>
           
           {/* Detailed X-Axis Labels */}
           <div className="flex justify-between w-full mt-2 text-[9px] text-gray-600 font-mono border-t border-primary/20 pt-1">
             <span>00</span>
             <span>04</span>
             <span>08</span>
             <span>12</span>
             <span>16</span>
             <span>20</span>
             <span>24</span>
           </div>
        </div>
        
        {/* Interval Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 mt-6 border-t border-primary/10 pt-4">
            {breakdown.map((item, idx) => (
                <div key={idx} className="text-center">
                    <div className={`text-xs font-bold ${item.value > 0 ? item.color : 'text-gray-600'}`}>
                        <CountUp end={Math.round((item.value / totalCommits) * 100)} suffix="%" />
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-tighter scale-90">{item.label}</div>
                    <div className="text-[9px] text-gray-600">(<CountUp end={item.value} />)</div>
                </div>
            ))}
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500">
             <span className="material-symbols-outlined text-9xl text-primary">schedule</span>
        </div>
      </div>

      {/* Persistence / Streak */}
      <div className="bg-surface-dark border border-primary/20 p-6 shadow-neon relative overflow-hidden flex flex-col justify-center">
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-sm">history</span>
          Persistence_Log
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/40 p-3 md:p-4 border-l-2 border-primary/40 group hover:bg-primary/5 transition-colors">
            <div className="text-[9px] md:text-[10px] text-primary/60 uppercase tracking-widest mb-1">Longest Streak</div>
            <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
              <CountUp end={analysis.longestStreak} duration={2000} /> <span className="text-xs md:text-sm font-normal text-gray-500">DAYS</span>
            </div>
          </div>
          <div className="bg-black/40 p-3 md:p-4 border-l-2 border-primary/40 group hover:bg-primary/5 transition-colors">
            <div className="text-[9px] md:text-[10px] text-primary/60 uppercase tracking-widest mb-1">Current Streak</div>
            <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
              <CountUp end={analysis.currentStreak} duration={2000} /> <span className="text-xs md:text-sm font-normal text-gray-500">DAYS</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-2">
            <span className={`inline-block px-3 py-1 text-[10px] border font-mono ${analysis.isWeekendWarrior ? 'border-primary text-primary bg-primary/10 shadow-neon' : 'border-gray-700 text-gray-500'}`}>
                WEEKEND_WARRIOR: {analysis.isWeekendWarrior ? 'POSITIVE' : 'NEGATIVE'}
            </span>
        </div>
      </div>
    </section>
  );
};
