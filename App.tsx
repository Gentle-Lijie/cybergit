
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
import { Camera, Share2 } from 'lucide-react';

const CACHE_KEY = 'cybergit_report_cache_v1';
const API_BASE = 'https://cybergit-api.u14.app/api';
const LANG_KEY = 'cybergit_lang';

export default function App() {
  // Initialize language based on localStorage or browser settings
  const [lang, setLang] = useState<Language>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    }
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
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted
  const [showLogin, setShowLogin] = useState(false); // Controls login form visibility/animation

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

  // Function to load report data from a shared key
  const loadSharedReport = async (username: string) => {
    setLoading(true);
    setLoadingText(t.loading.retrieving);
    setIsDemo(true); // Treat as demo/read-only
    setShowLogin(false); // Ensure login is hidden while loading

    try {
        const response = await fetch(`${API_BASE}/read?key=${username}`);
        if (!response.ok) {
            throw new Error(response.status === 404 ? 'Report not found in archive' : 'Data corruption detected');
        }
        
        const responseJson = await response.json();
        // Use loose typing to extract potential AI cache
        const rawData = responseJson.data;

        // Extract AI cache if present
        let cachedPersona: AiPersona | null = null;
        if (rawData.aiPersonaCache) {
            cachedPersona = rawData.aiPersonaCache;
            // Remove it from the object to conform to UserData type, though strictly not necessary for runtime
            delete rawData.aiPersonaCache;
        }
        
        const data = rawData as UserData;
        
        // Calculate derived data
        const processedLangs = processLanguageData(data.repositories?.nodes);
        const analysisResult = analyzeUserData(data, t);

        setUserData(data);
        setLanguages(processedLangs);
        setAnalysis(analysisResult);

        // If we found cached AI persona, use it directly. Otherwise try to generate.
        if (cachedPersona) {
            setAiPersona(cachedPersona);
        } else {
            // Attempt to generate AI persona using fallback (no api key on shared view)
            try {
                const persona = await generatePersonaAnalysis(data, analysisResult, processedLangs, lang);
                setAiPersona(persona);
            } catch (aiErr) {
                console.warn("Shared view AI skipped:", aiErr);
            }
        }

    } catch (err: any) {
        setError(err.message || 'Connection failed');
        setShowLogin(true); // Show login on error so user isn't stuck
    } finally {
        setLoading(false);
    }
  };

  // Check URL for token or user param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('access_token');
    
    // Support hash-based user ID (preferred) or legacy query param
    const hashUser = window.location.hash ? window.location.hash.substring(1) : null;
    const sharedUser = hashUser || params.get('user');
    
    if (token) {
        // Clear URL to keep it clean
        window.history.replaceState({}, document.title, window.location.pathname);
        handleLogin(token, '', true);
    } else if (sharedUser) {
        // Load shared data
        loadSharedReport(sharedUser);
    } else {
      // If no token/user in URL, check cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { userData: cachedUserData, aiPersona: cachedAiPersona } = JSON.parse(cached);
          if (cachedUserData) {
            setUserData(cachedUserData);
            setLanguages(processLanguageData(cachedUserData.repositories?.nodes));
            if (cachedAiPersona) {
               setAiPersona(cachedAiPersona);
            }
            setIsDemo(false);
          } else {
            // Cache invalid
            setShowLogin(true);
          }
        } catch (e) {
          console.error("Cache parse error", e);
          localStorage.removeItem(CACHE_KEY);
          setShowLogin(true);
        }
      } else {
        // No cache, no params -> Show Login immediately
        setShowLogin(true);
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
    setLang(prev => {
        const next = prev === 'en' ? 'zh' : 'en';
        localStorage.setItem(LANG_KEY, next);
        return next;
    });
  };

  const handleLogin = async (token: string, username: string, enableAi: boolean) => {
    audioService.playStartup();
    setLoading(true);
    setError(null);
    setLoadingText(t.loading.handshake);
    setShowLogin(false); // Hide login form
    
    const isDemoLogin = token === 'demo';
    setIsDemo(isDemoLogin);

    try {
      // 1. Fetch GitHub Data
      setLoadingText(t.loading.connecting);
      const data = await fetchGitHubData(token, username);
      
      // Calculate derived data immediately for AI context
      const processedLangs = processLanguageData(data.repositories?.nodes);
      const analysisResult = analyzeUserData(data, t);

      setUserData(data);
      setLanguages(processedLangs);
      setAnalysis(analysisResult);

      // 2. Generate AI Persona (Only if enabled)
      let persona = null;
      if (enableAi) {
        setLoadingText(t.loading.profile);
        try {
          // Pass pre-calculated stats to optimized generator
          persona = await generatePersonaAnalysis(data, analysisResult, processedLangs, lang);
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
      setShowLogin(true); // Re-show login on failure
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

  const handleShare = async () => {
    if (!userData) return;
    audioService.playClick();
    setIsSharing(true);
    setShareSuccess(false);

    try {
        // Bundle userData with aiPersona for persistence
        const payload = {
            ...userData,
            aiPersonaCache: aiPersona
        };

        const response = await fetch(`${API_BASE}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        // Updated to use hash based URL
        const url = `${window.location.origin}${window.location.pathname}#${userData.login}`;
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
    } catch (err) {
        console.error("Share failed", err);
        alert("UPLINK FAILED: Unable to upload data to matrix.");
    } finally {
        setIsSharing(false);
    }
  };


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
    setShowLogin(true); // Show login form with animation
    
    // Clean URL params and hash
    window.history.replaceState({}, document.title, window.location.pathname);
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
      {!userData && !loading && showLogin && (
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
            <div className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12 hide-on-screenshot">
              <button 
                onClick={handleSaveImage}
                disabled={savingImage || isSharing}
                onMouseEnter={() => audioService.playHover()}
                className="flex items-center gap-2 text-xs border bg-black text-primary border-primary hover:bg-primary hover:text-black px-4 py-2 rounded transition-all font-bold shadow-neon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4" />
                {savingImage ? t.controls.capturing : t.controls.snapshot}
              </button>

              {!isDemo && (
                <button 
                  onClick={handleShare}
                  disabled={isSharing || savingImage}
                  onMouseEnter={() => audioService.playHover()}
                  className={`flex items-center gap-2 text-xs border px-4 py-2 rounded transition-all font-bold shadow-neon disabled:opacity-50 disabled:cursor-not-allowed ${shareSuccess ? 'bg-white text-black border-white' : 'bg-black text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-black'}`}
                >
                  <Share2 className="w-4 h-4" />
                  {isSharing ? t.controls.sharing : (shareSuccess ? t.controls.linkCopied : t.controls.share)}
                </button>
              )}
              
              <button 
                onClick={handleTerminate}
                disabled={savingImage || isSharing}
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
