
import React, { useMemo } from 'react';
import { ContributionCalendar } from '../types';
import { useInView } from './Animators';
import { Calendar } from 'lucide-react';
import { Translations } from '../translations';

interface HeatmapProps {
  calendar: ContributionCalendar;
  t: Translations;
}

export const Heatmap: React.FC<HeatmapProps> = ({ calendar, t }) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  // Filter for year 2025 only
  const filteredWeeks = useMemo(() => {
    return calendar.weeks
      .map(week => ({
        ...week,
        contributionDays: week.contributionDays.filter(day => day.date.startsWith('2025'))
      }))
      .filter(week => week.contributionDays.length > 0);
  }, [calendar.weeks]);

  // Determine color intensity based on contribution count
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-[#0d110d] border border-primary/10';
    if (count <= 3) return 'bg-[#003300] border border-primary/20';
    if (count <= 6) return 'bg-[#006600] border border-primary/30';
    if (count <= 10) return 'bg-[#009900] border border-primary/40';
    return 'bg-[#00FF41] shadow-neon';
  };

  // Calculate month labels based on filtered data
  const monthLabels = useMemo(() => {
    const labels: { name: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    filteredWeeks.forEach((week, index) => {
      // Use the first day of the week to determine the month
      const firstDay = week.contributionDays[0];
      if (!firstDay) return;
      
      const date = new Date(firstDay.date);
      // Valid date check
      if (isNaN(date.getTime())) return;
      
      const month = date.getMonth();
      // If month changes or it's the first week, add a label
      if (month !== lastMonth) {
        // Use browser locale, or fallback to english short month if needed, but let's stick to simple
        const monthName = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        labels.push({ name: monthName, weekIndex: index });
        lastMonth = month;
      }
    });
    return labels;
  }, [filteredWeeks]);

  return (
    <section className="relative" ref={ref}>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t.heatmap.title}
          </h3>
          <p className="text-[10px] text-gray-500 mt-1 uppercase">{t.heatmap.subtitle}</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-500 mt-4 md:mt-0">
          <span>{t.heatmap.null}</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-[#0d110d] border border-primary/10"></div>
            <div className="w-3 h-3 bg-[#003300] border border-primary/20"></div>
            <div className="w-3 h-3 bg-[#006600] border border-primary/30"></div>
            <div className="w-3 h-3 bg-[#009900] border border-primary/40"></div>
            <div className="w-3 h-3 bg-[#00FF41] shadow-neon"></div>
          </div>
          <span>{t.heatmap.max}</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar bg-surface-dark border border-primary/30 p-4 shadow-neon-strong">
        <div className="min-w-max flex flex-col gap-1">
          {/* Month Labels Container */}
          <div className="relative h-4 w-full mb-2">
            {monthLabels.map((label, i) => (
              <span 
                key={i}
                className="absolute text-[10px] text-primary/40 font-mono"
                style={{ 
                  left: `${24 + 8 + (label.weekIndex * 13)}px` 
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            {/* Days label - Perfectly aligned using same structure as grid columns */}
            <div className="flex flex-col gap-[3px] text-[9px] text-primary/40 w-6 font-mono leading-none pt-[1px]">
              {/* Using explicit heights to match the 10px cells + 3px gap */}
              <div className="h-[10px] flex items-center"></div> {/* Sun */}
              <div className="h-[10px] flex items-center">Mon</div>
              <div className="h-[10px] flex items-center"></div> {/* Tue */}
              <div className="h-[10px] flex items-center">Wed</div>
              <div className="h-[10px] flex items-center"></div> {/* Thu */}
              <div className="h-[10px] flex items-center">Fri</div>
              <div className="h-[10px] flex items-center"></div> {/* Sat */}
            </div>

            {/* The Grid */}
            <div className="flex-1 flex gap-[3px]">
              {filteredWeeks.map((week, wIdx) => (
                 <div key={wIdx} className="flex flex-col gap-[3px]">
                   {week.contributionDays.map((day, dIdx) => (
                     <div 
                        key={`${wIdx}-${dIdx}`}
                        className={`w-[10px] h-[10px] rounded-[1px] ${getColorClass(day.contributionCount)} hover:scale-125 hover:z-10 transition-all duration-700 cursor-crosshair`}
                        style={{
                            opacity: isInView ? 1 : 0,
                            transform: isInView ? 'scale(1)' : 'scale(0.5)',
                            transitionDelay: `${Math.random() * 1500}ms`
                        }}
                        title={`${day.contributionCount} contributions on ${day.date}`}
                     />
                   ))}
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
