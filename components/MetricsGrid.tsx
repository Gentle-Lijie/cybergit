
import React from 'react';
import { CountUp, useInView } from './Animators';
import { Cpu, Waypoints, RefreshCw, GitBranch, GitPullRequestArrow, BugOff, CodeXml } from 'lucide-react';
import { Translations } from '../translations';

interface MetricsGridProps {
  totalContributions: number;
  commits: number;
  prs: number;
  issues: number;
  reviews: number;
  t: Translations;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ totalContributions, commits, prs, issues, reviews, t }) => {
  const { ref: barRef, isInView: barInView } = useInView();

  const metrics = [
    { 
      label: t.metrics.commits, 
      value: commits, 
      Icon: GitBranch
    },
    { 
      label: t.metrics.prs, 
      value: prs, 
      Icon: GitPullRequestArrow
    },
    { 
      label: t.metrics.issues, 
      value: issues, 
      Icon: BugOff
    },
    { 
      label: t.metrics.reviews, 
      value: reviews, 
      Icon: CodeXml
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6">
      {/* Core Metrics Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] flex-grow bg-primary/20" />
            <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            {t.metrics.core}
            </h3>
            <div className="h-[1px] flex-grow bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Integrated Annual Output Section */}
          <div className="bg-surface-dark border border-primary/30 p-6 md:p-8 shadow-neon group flex flex-col justify-center relative overflow-hidden min-h-[200px] md:min-h-[240px]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <Waypoints className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] text-primary" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <p className="text-primary text-xs font-bold tracking-[0.3em] mb-2 uppercase flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin animate-reverse" />
                  {t.metrics.output}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    <CountUp end={totalContributions} duration={2000} />
                  </span>
                  <span className="text-primary font-bold text-sm md:text-lg tracking-widest">{t.metrics.contributions}</span>
                </div>
              </div>

              <div className="mt-2 w-full flex flex-col gap-2" ref={barRef}>
                <div className="flex justify-between text-[10px] text-primary/70 tracking-widest uppercase">
                  <span>{t.metrics.efficiency}</span>
                  <span className="text-primary">
                    <CountUp end={100} duration={1000} suffix="%" />
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-light border border-primary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary w-full shadow-[0_0_10px_rgba(0,255,65,0.8)] transition-transform duration-1000 ease-out origin-left" 
                    style={{ transform: barInView ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-full">
              {metrics.map((item, idx) => (
              <div key={idx} className="bg-surface-dark border border-primary/20 p-4 hover:bg-surface-light transition-colors group flex flex-col justify-center gap-2">
                  <div className="flex items-center justify-between">
                      <div className="bg-primary/10 p-1.5 md:p-2 rounded">
                      <item.Icon className="text-primary w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <span className="text-[9px] md:text-[10px] text-gray-600 uppercase tracking-widest">2025</span>
                  </div>
                  <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-primary transition-colors leading-none">
                      <CountUp end={item.value} duration={1500} />
                  </p>
                  <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                      {item.label}
                  </p>
                  </div>
              </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
