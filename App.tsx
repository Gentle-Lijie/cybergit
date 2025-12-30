
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { Hero } from './components/Hero';
import { MetricsGrid } from './components/MetricsGrid';
import { LanguageChart } from './components/LanguageChart';
import { Heatmap } from './components/Heatmap';
import { HabitsSection } from './components/HabitsSection';
import { Achievements } from './components/Achievements';
import { CommunitySection } from './components/CommunitySection';
import { AiIdentity } from './components/AiIdentity';
import { ScrollReveal } from './components/ScrollReveal';
import { fetchGitHubData, processLanguageData, analyzeUserData } from './services/githubService';
import { generatePersonaAnalysis } from './services/geminiService';
import type { UserData, ProcessedLanguage, AnalysisResult, AiPersona } from './types';

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [languages, setLanguages] = useState<ProcessedLanguage[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [aiPersona, setAiPersona] = useState<AiPersona | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string>('INITIALIZING CONNECTION...');

  const handleLogin = async (token: string, enableAi: boolean) => {
    setLoading(true);
    setError(null);
    setLoadingText('ESTABLISHING SECURE HANDSHAKE...');
    
    try {
      // 1. Fetch GitHub Data
      setLoadingText('CONNECTING NEURA NETWORKS...');
      const data = await fetchGitHubData(token, undefined);
      setUserData(data);
      setLanguages(processLanguageData(data.repositories.nodes));
      setAnalysis(analyzeUserData(data));

      // 2. Generate AI Persona (Only if enabled)
      if (enableAi) {
        setLoadingText('PROCESSING AI PROFILE...');
        try {
          const persona = await generatePersonaAnalysis(data);
          setAiPersona(persona);
        } catch (aiErr) {
          console.error("AI Generation failed", aiErr);
        }
      } else {
        setAiPersona(null);
      }

    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout userData={userData} loading={loading}>
      {!userData && !loading && (
        <LoginForm onLogin={handleLogin} isLoading={loading} error={error} />
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
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Identity - Top Section */}
          <ScrollReveal>
            <Hero user={userData} />
          </ScrollReveal>

          {/* Core Metrics & Annual Output */}
          <ScrollReveal>
            <MetricsGrid 
              totalContributions={userData.contributionsCollection.contributionCalendar.totalContributions}
              commits={userData.contributionsCollection.totalCommitContributions}
              issues={userData.contributionsCollection.totalIssueContributions}
              prs={userData.contributionsCollection.totalPullRequestContributions}
              reviews={userData.contributionsCollection.totalPullRequestReviewContributions}
            />
          </ScrollReveal>

          {/* Language Analysis */}
          <ScrollReveal>
            <LanguageChart languages={languages} />
          </ScrollReveal>

          {/* Heatmap */}
          <ScrollReveal>
            <Heatmap calendar={userData.contributionsCollection.contributionCalendar} />
          </ScrollReveal>

          {/* Habits Analysis */}
          <ScrollReveal>
            <HabitsSection analysis={analysis} />
          </ScrollReveal>

          {/* Community & Influence */}
          <ScrollReveal>
            <CommunitySection analysis={analysis} />
          </ScrollReveal>

          {/* Achievements */}
          <ScrollReveal>
            <Achievements analysis={analysis} />
          </ScrollReveal>

          {/* AI Identity Dossier */}
          {aiPersona && (
            <ScrollReveal delay={200}>
              <AiIdentity persona={aiPersona} />
            </ScrollReveal>
          )}

          <ScrollReveal delay={300}>
            <div className="text-center">
              <button 
                onClick={() => { setUserData(null); setLanguages([]); setAnalysis(null); setAiPersona(null); }}
                className="text-xs text-primary/40 hover:text-primary border border-primary/20 hover:border-primary px-4 py-2 rounded transition-all bg-black/50"
              >
                TERMINATE_SESSION
              </button>
            </div>
          </ScrollReveal>

          <div className="border-t border-primary/20 bg-black/90 py-8 px-6 text-center relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary/60 font-mono text-xs">
                <span className="animate-pulse">_</span>
                <span>SYSTEM CONNECTED</span>
              </div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                Generated by u14.app © 2025
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
