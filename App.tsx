
import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { Hero } from './components/Hero';
import { MetricsGrid } from './components/MetricsGrid';
import { LanguageChart } from './components/LanguageChart';
import { Heatmap } from './components/Heatmap';
import { HabitsSection } from './components/HabitsSection';
import { Achievements } from './components/Achievements';
import { CommunitySection } from './components/CommunitySection';
import { PrAnalysis } from './components/PrAnalysis';
import { ContributionBreakdown } from './components/ContributionBreakdown';
import { ProjectGallery } from './components/ProjectGallery';
import { AiIdentity } from './components/AiIdentity';
import { ScrollReveal } from './components/ScrollReveal';
import { fetchGitHubData, processLanguageData, analyzeUserData } from './services/githubService';
import { generatePersonaAnalysis } from './services/geminiService';
import { audioService } from './services/audioService';
import type { UserData, ProcessedLanguage, AnalysisResult, AiPersona, Language } from './types';
import { translations } from './translations';
import { Camera } from 'lucide-react';

const CACHE_KEY = 'cybergit_report_cache_v1';

export default function App() {
  // Initialize language based on browser settings
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = typeof navigator !== 'undefined' 
      ? (navigator.language || navigator.languages?.[0] || 'en') 
      : 'en';
    return browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  });

  const t = translations[lang];

  const [userData, setUserData] = useState<UserData | null>(null);
  const [languages, setLanguages] = useState<ProcessedLanguage[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [aiPersona, setAiPersona] = useState<AiPersona | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string>(t.loading.init);
  const [savingImage, setSavingImage] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted

  // Initialize Audio Context on first interaction
  useEffect(() => {
    const initAudio = () => {
      audioService.init().catch(console.error);
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };

    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const toggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    if (!muted) audioService.playClick();
  };

  // Check URL for token on mount (Mock OAuth handling)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('access_token');
    
    // Clear URL to keep it clean
    if (token) {
        window.history.replaceState({}, document.title, window.location.pathname);
        handleLogin(token, '', true);
    } else {
      // If no token in URL, check cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { userData: cachedUserData, aiPersona: cachedAiPersona } = JSON.parse(cached);
          if (cachedUserData) {
            setUserData(cachedUserData);
            setLanguages(processLanguageData(cachedUserData.repositories.nodes));
            if (cachedAiPersona) {
               setAiPersona(cachedAiPersona);
            }
            setIsDemo(false);
          }
        } catch (e) {
          console.error("Cache parse error", e);
          localStorage.removeItem(CACHE_KEY);
        }
      }
    }
  }, []);

  // Update loading text when language changes if currently loading
  useEffect(() => {
     if (loading) {
       setLoadingText(t.loading.init);
     }
  }, [lang]);

  const toggleLang = () => {
    audioService.playClick();
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleLogin = async (token: string, username: string, enableAi: boolean) => {
    audioService.playStartup();
    setLoading(true);
    setError(null);
    setLoadingText(t.loading.handshake);
    
    const isDemoLogin = token === 'demo';
    setIsDemo(isDemoLogin);

    try {
      // 1. Fetch GitHub Data
      setLoadingText(t.loading.connecting);
      const data = await fetchGitHubData(token, username);
      setUserData(data);
      setLanguages(processLanguageData(data.repositories.nodes));
      setAnalysis(analyzeUserData(data, t));

      // 2. Generate AI Persona (Only if enabled)
      let persona = null;
      if (enableAi) {
        setLoadingText(t.loading.profile);
        try {
          persona = await generatePersonaAnalysis(data, lang);
          setAiPersona(persona);
        } catch (aiErr) {
          console.error("AI Generation failed", aiErr);
        }
      } else {
        setAiPersona(null);
      }

      // 3. Cache the results (Only if NOT demo)
      if (!isDemoLogin) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          userData: data,
          aiPersona: persona
        }));
      }

    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Re-analyze data when language changes if user is already logged in
  useEffect(() => {
    if (userData) {
      setAnalysis(analyzeUserData(userData, t));
    }
  }, [lang, userData]);


  const handleSaveImage = async () => {
    audioService.playClick();
    setSavingImage(true);
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    try {
        // Wait a brief moment for any pending animations/renders
        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await toPng(rootElement, {
            quality: 0.95,
            backgroundColor: '#000000',
            filter: (node) => {
                // Exclude elements with this class from the screenshot
                return !node.classList?.contains('hide-on-screenshot');
            }
        });

        const link = document.createElement('a');
        link.download = `cybergit-report-${userData?.login || '2077'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to save image:', err);
    } finally {
        setSavingImage(false);
    }
  };

  const handleTerminate = () => {
    audioService.playClick();
    setUserData(null);
    setLanguages([]);
    setAnalysis(null);
    setAiPersona(null);
    
    // Only remove cache if it was a real session
    if (!isDemo) {
        localStorage.removeItem(CACHE_KEY);
    }
    setIsDemo(false);
  };

  return (
    <Layout 
      userData={userData} 
      loading={loading} 
      lang={lang} 
      toggleLang={toggleLang} 
      t={t}
      isMuted={isMuted}
      toggleMute={toggleMute}
    >
      {!userData && !loading && (
        <LoginForm onLogin={handleLogin} isLoading={loading} error={error} t={t} />
      )}

      {loading && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 select-none">
          <div className="relative w-24 h-24">
             <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
             <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="font-mono text-primary tracking-widest text-sm animate-pulse">
            {loadingText}
          </div>
          <div className="w-64 h-1 bg-surface-light overflow-hidden">
            <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] w-full origin-left scale-x-0"></div>
          </div>
          <style>{`
            @keyframes loading {
              0% { transform: scaleX(0); }
              50% { transform: scaleX(1); }
              100% { transform: scaleX(0); transform-origin: right; }
            }
          `}</style>
        </div>
      )}

      {userData && analysis && !loading && (
        <>
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Identity - Top Section */}
          <ScrollReveal>
            <Hero user={userData} t={t} />
          </ScrollReveal>

          {/* AI Identity Dossier */}
          {aiPersona && (
            <ScrollReveal delay={200}>
              <AiIdentity persona={aiPersona} t={t} />
            </ScrollReveal>
          )}

          {/* Core Metrics & Annual Output */}
          <ScrollReveal>
            <MetricsGrid 
              totalContributions={userData.contributionsCollection.contributionCalendar.totalContributions}
              commits={userData.contributionsCollection.totalCommitContributions}
              issues={userData.contributionsCollection.totalIssueContributions}
              prs={userData.contributionsCollection.totalPullRequestContributions}
              reviews={userData.contributionsCollection.totalPullRequestReviewContributions}
              t={t}
            />
          </ScrollReveal>

          {/* Language Analysis */}
          <ScrollReveal>
            <LanguageChart languages={languages} t={t} />
          </ScrollReveal>

          {/* Heatmap */}
          <ScrollReveal>
            <Heatmap calendar={userData.contributionsCollection.contributionCalendar} t={t} />
          </ScrollReveal>

          {/* PR Efficiency */}
          <ScrollReveal>
            <PrAnalysis analysis={analysis} t={t} />
          </ScrollReveal>

          {/* Contribution Types */}
          <ScrollReveal>
            <ContributionBreakdown analysis={analysis} t={t} />
          </ScrollReveal>

          {/* Achievements */}
          <ScrollReveal>
            <Achievements analysis={analysis} t={t} />
          </ScrollReveal>

          {/* Community & Influence */}
          <ScrollReveal>
            <CommunitySection analysis={analysis} organizations={userData.organizations} t={t} />
          </ScrollReveal>

          {/* Projects & Topics */}
          <ScrollReveal>
             <ProjectGallery analysis={analysis} t={t} />
          </ScrollReveal>

          <ScrollReveal delay={300}>
            {/* Action Buttons - Hidden in Screenshot */}
            <div className="flex justify-center gap-4 mb-8 md:mb-12 hide-on-screenshot">
              <button 
                onClick={handleSaveImage}
                disabled={savingImage}
                onMouseEnter={() => audioService.playHover()}
                className="flex items-center gap-2 text-xs text-black bg-primary hover:bg-white border border-primary px-4 py-2 rounded transition-all font-bold shadow-neon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4" />
                {savingImage ? t.controls.capturing : t.controls.snapshot}
              </button>
              
              <button 
                onClick={handleTerminate}
                disabled={savingImage}
                onMouseEnter={() => audioService.playHover()}
                className="text-xs text-primary/40 hover:text-primary border border-primary/20 hover:border-primary px-4 py-2 rounded transition-all bg-black/50"
              >
                {t.controls.terminate}
              </button>
            </div>
          </ScrollReveal>
        </div>
          <div className="relative border-t border-primary/20 bg-black/90 py-6 text-center relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary/60 font-mono text-xs">
                <span className="animate-pulse">_</span>
                <span>{t.controls.systemConnected}</span>
              </div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                {t.layout.footer}
              </p>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
