
import React from 'react';
import { UserData } from '../types';
import { Typewriter, CountUp } from './Animators';

interface HeroProps {
  user: UserData;
}

export const Hero: React.FC<HeroProps> = ({ user }) => {
  const contributions = user.contributionsCollection.contributionCalendar.totalContributions;

  return (
    <section className="relative animate-[fade-in-up_0.5s_ease-out]">
      {/* Decorative vertical lines */}
      <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0" />
      <div className="absolute -right-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0" />

      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 border-b border-primary/20 pb-6 text-center md:text-left">
        <div className="relative shrink-0 group">
            <img 
              src={user.avatarUrl} 
              alt={user.login} 
              className="w-20 h-20 md:w-24 md:h-24 rounded border-2 border-primary/50 shadow-neon group-hover:sepia transition-all duration-500" 
            />
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 md:translate-x-0 md:-right-2 bg-black border border-primary text-primary text-[10px] px-2 py-0.5 uppercase tracking-widest whitespace-nowrap">
                LVL.<CountUp end={Math.floor(contributions / 100)} duration={2000} />
            </div>
        </div>
        
        <div className="flex-grow">
            <div className="inline-flex items-center gap-2 text-primary/50 text-xs tracking-widest mb-1 justify-center md:justify-start">
                <span className="material-symbols-outlined text-sm">fingerprint</span>
                <Typewriter text="IDENTITY_VERIFIED" speed={50} />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase leading-none mb-3 md:mb-2 min-h-[1em]">
               <Typewriter text={user.name || user.login} speed={80} delay={300} cursor={false} />
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs font-mono text-primary/80 justify-center md:justify-start">
                <span className="bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    @{user.login}
                </span>
                <span className="bg-primary/10 px-2 py-1 rounded border border-primary/20 uppercase">
                    {user.location || 'UNKNOWN_REGION'}
                </span>
                <span className="bg-primary/10 px-2 py-1 rounded border border-primary/20 uppercase">
                    Joined {new Date(user.createdAt).getFullYear()}
                </span>
            </div>
        </div>
        
        <div className="hidden md:block text-right max-w-xs">
            <p className="text-xs text-gray-500 font-mono leading-relaxed border-r-2 border-primary/40 pr-4">
                <Typewriter 
                  text="System analysis complete. User demonstrates high-velocity code injection and consistent repository maintenance. Optimization targets met." 
                  speed={20} 
                  delay={1000}
                />
            </p>
        </div>
      </div>
    </section>
  );
};
