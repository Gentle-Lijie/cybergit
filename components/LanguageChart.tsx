
import React from 'react';
import { ProcessedLanguage } from '../types';
import { CountUp, AnimatedBar, useInView } from './Animators';

interface LanguageChartProps {
  languages: ProcessedLanguage[];
}

export const LanguageChart: React.FC<LanguageChartProps> = ({ languages }) => {
  const topLanguages = languages.slice(0, 3);
  const otherLanguages = languages.slice(3);
  const { ref: tagsRef, isInView: tagsVisible } = useInView();

  return (
    <section className="border border-primary/20 bg-surface-dark/50 p-6 md:p-8 shadow-neon">
       <div className="flex flex-col md:flex-row md:gap-12 gap-6 h-full">
          {/* Main Chart Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">terminal</span>
              <h3 className="text-white font-bold tracking-widest text-sm uppercase">Language_Distribution</h3>
            </div>
            
            <div className="space-y-6">
              {topLanguages.map((lang, idx) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono text-primary/80 mb-2">
                    <span className="uppercase">{lang.name}</span>
                    <span><CountUp end={lang.percentage} suffix="%" duration={1000} /></span>
                  </div>
                  <div className="w-full h-3 bg-black border border-primary/20 p-[1px]">
                    <AnimatedBar 
                        percentage={lang.percentage} 
                        color={lang.color} 
                        className="shadow-[0_0_8px_rgba(0,255,65,0.4)]"
                        delay={idx * 200}
                    />
                  </div>
                </div>
              ))}
              {languages.length === 0 && (
                <div className="text-primary/40 text-xs font-mono uppercase">
                  No language data detected in sector.
                </div>
              )}
            </div>
          </div>

          {/* Tags Section - Side on desktop, bottom on mobile */}
          {otherLanguages.length > 0 && (
            <div className="md:w-1/3 flex flex-col justify-end">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-primary/10 pb-1">
                   Secondary Protocols
                </div>
                <div className="flex flex-wrap gap-2 content-start" ref={tagsRef}>
                  {otherLanguages.map((lang, idx) => (
                    <span 
                      key={lang.name} 
                      className={`inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-2 py-1 text-[10px] text-primary/70 font-mono uppercase rounded hover:bg-primary/10 transition-all duration-500 cursor-default ${tagsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                      style={{ transitionDelay: `${100 + (idx * 50)}ms` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }}></span>
                      {lang.name} {lang.percentage}%
                    </span>
                  ))}
                </div>
            </div>
          )}
       </div>
    </section>
  );
};
