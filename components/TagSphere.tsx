
import React, { useMemo } from 'react';
import { TopicStat } from '../types';
import { Translations } from '../translations';

interface TagSphereProps {
  tags: TopicStat[];
  radius?: number; 
  t: Translations;
}

export const TagSphere: React.FC<TagSphereProps> = ({ tags, t }) => {
  // Process tags for the "Stunning Art" layout
  const processedTags = useMemo(() => {
    if (!tags || tags.length === 0) return [];

    // 1. Sort by count DESC
    let sorted = [...tags].sort((a, b) => b.count - a.count);

    // 2. Hide low frequency tags if we have too many (e.g., > 30)
    if (sorted.length > 30) {
      // Keep top 30 or top 70%, whichever is larger, to ensure density
      const cutoff = Math.max(30, Math.floor(sorted.length * 0.7));
      sorted = sorted.slice(0, cutoff);
    }

    // 3. Determine Scaling Factors
    const maxCount = sorted[0]?.count || 1;
    const minCount = sorted[sorted.length - 1]?.count || 0;
    const countRange = Math.max(maxCount - minCount, 1);
    
    // If few tags, boost size significantly to fill space
    const isSparse = sorted.length < 15;
    const minSizeRem = isSparse ? 1.2 : 0.7;
    const maxSizeRem = isSparse ? 4.0 : 2.2;

    // 4. Map to Display Properties
    const mapped = sorted.map(t => {
      const weight = (t.count - minCount) / countRange; // 0 to 1
      
      // Font Size interpolation
      const fontSize = minSizeRem + (weight * (maxSizeRem - minSizeRem));
      
      // Visual Tiers
      let colorClass = 'text-primary/40';
      let shadowClass = '';
      let zIndex = 1;

      if (weight > 0.8) {
        colorClass = 'text-white drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]';
        shadowClass = 'shadow-neon';
        zIndex = 10;
      } else if (weight > 0.5) {
        colorClass = 'text-primary drop-shadow-[0_0_3px_rgba(0,255,65,0.5)]';
        zIndex = 5;
      } else if (weight > 0.2) {
        colorClass = 'text-primary/70';
        zIndex = 2;
      }

      return {
        ...t,
        fontSize: `${fontSize.toFixed(2)}rem`,
        weight,
        colorClass,
        shadowClass,
        zIndex,
        rotation: Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : -2) : 0, // Occasional slight tilt
        // Random delay for the "light up" effect (between 0s and 1.5s)
        animationDelay: Math.random() * 1.5
      };
    });

    // 5. Shuffle the array so big tags aren't all at the start (Cluster effect)
    // We use a deterministic shuffle based on name length to keep it consistent across renders without flicker
    return mapped.sort((a, b) => {
        // Simple consistent hash-like sort
        return (a.name.length + a.count) % 3 - (b.name.length + b.count) % 3;
    });

  }, [tags]);

  return (
    <div className="relative w-full min-h-[300px] h-full flex flex-wrap items-center justify-center content-center gap-x-4 gap-y-2 p-6 overflow-hidden bg-black/20 perspective-1000">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      {processedTags.map((tag, idx) => (
        <div
          key={tag.name}
          className={`
            relative font-mono font-bold leading-none cursor-crosshair transition-all duration-300 ease-out
            hover:scale-110 hover:text-white hover:z-50 hover:drop-shadow-[0_0_15px_rgba(0,255,65,1)]
            ${tag.colorClass}
          `}
          style={{
            fontSize: tag.fontSize,
            zIndex: tag.zIndex,
            transform: `rotate(${tag.rotation}deg)`,
            opacity: 0, // Start invisible
            animation: `cyberFlash 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards ${tag.animationDelay}s`
          }}
          title={`${tag.name}: ${tag.count} references`}
        >
          {tag.name}
          
          {/* Small decorative marker for top tags */}
          {tag.weight > 0.8 && (
             <span className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full animate-ping" />
          )}
        </div>
      ))}

      {processedTags.length === 0 && (
         <div className="text-primary/30 font-mono text-sm uppercase tracking-widest">
            {t.tags.noData}
         </div>
      )}

      <style>{`
        @keyframes cyberFlash {
          0% { opacity: 0; transform: scale(0.95); filter: blur(5px); }
          10% { opacity: 1; transform: scale(1.1); filter: blur(0px); text-shadow: 0 0 20px currentColor; }
          20% { opacity: 0.5; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.05); text-shadow: 0 0 10px currentColor; }
          40% { opacity: 0.8; }
          100% { opacity: 1; transform: scale(1) rotate(var(--tw-rotate)); }
        }
      `}</style>
    </div>
  );
};
