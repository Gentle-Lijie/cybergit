
import React, { useEffect, useRef } from 'react';
import type { UserData, Language } from '../types';
import { Translations } from '../translations';
import { Braces, Volume2, VolumeX, Github } from 'lucide-react';
import { audioService } from '../services/audioService';

interface LayoutProps {
  loading: boolean
  userData: UserData | null,
  children: React.ReactNode;
  lang: Language;
  toggleLang: () => void;
  t: Translations;
  isMuted?: boolean;
  toggleMute?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  loading, 
  userData, 
  children, 
  lang, 
  toggleLang, 
  t,
  isMuted = false,
  toggleMute 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Determine if matrix background should be shown
  const showMatrix = loading || !userData;

  // Parallax Effect Logic (Runs once)
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      // Visual Parallax
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    
  // Canvas Matrix Rain Logic (Runs when canvas availability changes)
  useEffect(() => {
    // Only run if the canvas is supposed to be visible
    if (!showMatrix) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const columns = Math.floor(width / 20); 
    const drops: number[] = Array(columns).fill(1);
    const chars = 'アァカサタハマヤャヌムュルグ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#0F0'; 
      ctx.font = '14px monospace';
      
      for(let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        if (Math.random() > 0.98) {
           ctx.fillStyle = '#FFF'; 
        } else {
           ctx.fillStyle = '#00FF41';
        }
        ctx.fillText(text, i * 20, drops[i] * 20);
        if(drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); 
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [showMatrix]); // Depend on the derived visibility state, not raw data

  return (
    <>
      {showMatrix ? <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full opacity-50 pointer-events-none" 
      /> : null}
      
      {/* Dynamic Parallax Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* The grid pattern moves slightly as user scrolls */}
        <div 
            ref={parallaxRef}
            className="absolute -top-[100px] -left-0 -right-0 h-[200vh] bg-grid-pattern opacity-20"
            style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <div className="scanlines" />
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-50 animate-pulse-slow" />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-primary/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <Braces className="text-primary w-6 h-6 md:w-8 md:h-8 animate-pulse" />
            <div className="flex flex-col">
              <h1 className="text-primary font-bold tracking-[0.2em] text-xs md:text-sm leading-none">{t.layout.title}</h1>
              <span className="text-[9px] md:text-[10px] text-primary/60 tracking-widest">{t.layout.build}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <a
               href="https://github.com/Amery2010/cybergit"
               target="_blank"
               rel="noopener noreferrer"
               className="text-primary/70 hover:text-primary transition-colors p-1"
               onMouseEnter={() => audioService.playHover()}
               aria-label="GitHub Repository"
             >
               <Github className="w-4 h-4 md:w-5 md:h-5" />
             </a>

             {toggleMute && (
              <button
                onClick={toggleMute}
                className="text-primary/70 hover:text-primary transition-colors p-1"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            )}

            <button 
              onClick={toggleLang}
              onMouseEnter={() => audioService.playHover()}
              className="px-2 py-1 text-[10px] font-mono border border-primary/40 text-primary hover:bg-primary hover:text-black transition-colors rounded"
            >
              {lang === 'en' ? 'EN / 中文' : '中文 / EN'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-grow items-center pt-20 md:pt-24 px-4 md:px-8 min-h-screen relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </>
  );
};
