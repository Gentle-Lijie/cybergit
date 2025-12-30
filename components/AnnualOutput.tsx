
import React from 'react';

interface AnnualOutputProps {
  totalContributions: number;
}

export const AnnualOutput: React.FC<AnnualOutputProps> = ({ totalContributions }) => {
  return (
    <section className="h-full bg-surface-dark border border-primary/30 rounded-sm p-6 md:p-8 shadow-neon group flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
        <span className="material-symbols-outlined text-[120px] text-primary">hub</span>
      </div>
      
      <div className="relative z-10">
        <p className="text-primary text-xs font-bold tracking-[0.3em] mb-2 uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
          Annual Output
        </p>
        <div className="flex flex-col gap-1">
          <span className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {totalContributions.toLocaleString()}
          </span>
          <span className="text-primary font-bold text-lg tracking-widest">CONTRIBUTIONS</span>
        </div>

        <div className="mt-6 w-full flex flex-col gap-2">
          <div className="flex justify-between text-[10px] text-primary/70 tracking-widest uppercase">
            <span>Target Efficiency</span>
            <span>100%</span>
          </div>
          <div className="h-2 w-full bg-surface-light border border-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
          </div>
        </div>
      </div>
    </section>
  );
};
