
import React from 'react';
import { UserData } from '../types';
import { Typewriter, CountUp } from './Animators';
import { Fingerprint, Users, Clock, Building } from 'lucide-react';
import { Translations } from '../translations';

interface HeroProps {
  user: UserData;
  t: Translations;
}

export const Hero: React.FC<HeroProps> = ({ user, t }) => {
  const contributions = user.contributionsCollection.contributionCalendar.totalContributions;
  const accountYear = new Date(user.createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const accountAge = currentYear - accountYear;

  return (
    <section className="relative animate-[fade-in-up_0.5s_ease-out]">
      {/* Decorative vertical lines */}
      <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0" />
      <div className="absolute -right-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0" />

      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 border-b border-primary/20 pb-6 text-center md:text-left">
        <div className="relative shrink-0 group">
            <img 
              src={user.avatarUrl} 
              alt={user.login} 
              className="w-24 h-24 md:w-32 md:h-32 rounded border-2 border-primary/50 shadow-neon group-hover:sepia transition-all duration-500" 
            />
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 md:translate-x-0 md:-right-2 bg-black border border-primary text-primary text-[10px] px-2 py-0.5 uppercase tracking-widest whitespace-nowrap">
                LV.<CountUp end={Math.floor(contributions / 100)} duration={2000} />
            </div>
        </div>
        
        <div className="flex-grow flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 text-primary/50 text-xs tracking-widest mb-1">
                <Fingerprint className="w-4 h-4" />
                <Typewriter text={t.hero.identity} speed={50} />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tighter uppercase leading-none mb-3 min-h-[1em]">
               <Typewriter text={user.name || user.login} speed={80} delay={300} cursor={false} />
            </h2>
            
            <div className="flex flex-wrap gap-3 text-xs font-mono text-primary/80 justify-center md:justify-start mb-4">
                <span className="bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    @{user.login}
                </span>
                <span className="bg-primary/10 px-2 py-1 rounded border border-primary/20 uppercase">
                    {user.location || 'EARTH'}
                </span>
                <span className="bg-primary/10 px-2 py-1 rounded border border-primary/20 uppercase">
                    {t.hero.est} {accountYear}
                </span>
            </div>

            {/* Account Stat Micro-Grid */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                        <Clock className="w-3 h-3" /> {t.hero.age} <div className="ml-1 font-bold text-white"><CountUp end={accountAge} /> {t.hero.years}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                        <Users className="w-3 h-3" /> {t.hero.followers} <div className="ml-1 font-bold text-white"><CountUp end={user.followers.totalCount} /></div>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                        <Building className="w-3 h-3" /> {t.hero.orgs} <div className="ml-1 font-bold text-white"><CountUp end={user.organizations.nodes.length} /></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="hidden md:block text-right max-w-xs self-center">
            <p className="text-xs text-gray-500 font-mono leading-relaxed border-r-2 border-primary/40 pr-4">
                <Typewriter 
                  text={t.hero.systemAnalysis}
                  speed={20} 
                  delay={1000}
                />
            </p>
        </div>
      </div>
    </section>
  );
};
