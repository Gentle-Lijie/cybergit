
import React from 'react';
import { AiPersona } from '../types';
import { Typewriter } from './Animators';
import { Contact, IdCard } from 'lucide-react';
import { Translations } from '../translations';

interface AiIdentityProps {
  persona: AiPersona;
  t: Translations;
}

export const AiIdentity: React.FC<AiIdentityProps> = ({ persona, t }) => {
  if (!persona) return null;

  // Destructure with default values to handle potential missing data from AI
  const finalPersona = persona.finalPersona || { 
    title: t.ai.unidentified, 
    summary: t.ai.incomplete, 
    keywords: [] 
  };
  
  const veteran = persona.veteran || { 
    title: 'UNKNOWN', 
    description: 'Data missing.' 
  };

  const specialist = persona.specialist || { 
    description: 'Analysis pending.' 
  };

  const creator = persona.creator || { 
    description: 'Analysis pending.' 
  };

  const aiSurfer = persona.aiSurfer || { 
    description: 'Analysis pending.' 
  };

  return (
    <section className="animate-[fade-in_1s_ease-out]">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-grow bg-primary/20" />
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
          <Contact className="w-4 h-4" />
          {t.ai.title}
        </h3>
        <div className="h-[1px] flex-grow bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Badge */}
        <div className="md:col-span-4 bg-surface-dark border border-primary/50 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 z-0" />
            <IdCard className="w-16 h-16 text-primary mb-4 z-10" />
            <div className="text-xs text-primary/60 uppercase tracking-widest z-10">{t.ai.classification}</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter z-10 my-2 min-h-[32px]">
                <Typewriter text={finalPersona.title} speed={40} delay={0} cursor={false} />
            </h2>
            <div className="text-xs text-gray-400 font-mono italic z-10 min-h-[48px] flex items-center justify-center">
                <Typewriter text={`"${finalPersona.summary}"`} speed={20} delay={800} />
            </div>
        </div>

        {/* Quick Traits */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black border-l-2 border-primary/30 p-4">
                <div className="text-primary font-bold text-xs uppercase mb-1">{veteran.title || t.ai.veteran}</div>
                <div className="text-[10px] text-gray-400 min-h-[40px]">
                    <Typewriter text={veteran.description} speed={15} delay={1200} />
                </div>
            </div>
            <div className="bg-black border-l-2 border-blue-500/30 p-4">
                <div className="text-blue-400 font-bold text-xs uppercase mb-1">{t.ai.specialist}</div>
                <div className="text-[10px] text-gray-400 min-h-[40px]">
                     <Typewriter text={specialist.description} speed={15} delay={1600} />
                </div>
            </div>
            <div className="bg-black border-l-2 border-purple-500/30 p-4">
                <div className="text-purple-400 font-bold text-xs uppercase mb-1">{t.ai.creator}</div>
                <div className="text-[10px] text-gray-400 min-h-[40px]">
                     <Typewriter text={creator.description} speed={15} delay={2000} />
                </div>
            </div>
            <div className="bg-black border-l-2 border-yellow-500/30 p-4">
                <div className="text-yellow-400 font-bold text-xs uppercase mb-1">{t.ai.surfer}</div>
                <div className="text-[10px] text-gray-400 min-h-[40px]">
                     <Typewriter text={aiSurfer.description} speed={15} delay={2400} />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
