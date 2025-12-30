
import React, { useState } from 'react';
import { Fingerprint, AlertTriangle, KeyRound } from 'lucide-react';
import { Translations } from '../translations';
import { audioService } from '../services/audioService';

interface LoginFormProps {
  onLogin: (token: string, username: string, enableAi: boolean) => void;
  isLoading: boolean;
  error: string | null;
  t: Translations;
}

const AI_PREF_KEY = 'cybergit_enable_ai';

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error, t }) => {
  const [token, setToken] = useState('');
  const [enableAi, setEnableAi] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(AI_PREF_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true; // Default to true
  });
  const [showManualInput, setShowManualInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playClick();
    // Pass empty username to trigger viewer query in backend service
    if (token) onLogin(token, '', enableAi);
  };

  const openGitHubTokenPage = () => {
    audioService.playClick();
    const scopes = 'read:user,read:org,repo,user:email';
    const description = 'CyberGit 2077 Report';
    const url = `https://github.com/settings/tokens/new?scopes=${scopes}&description=${encodeURIComponent(description)}`;
    window.open(url, '_blank');
    setShowManualInput(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-cyber-open origin-center">
      <div className="w-full max-w-md p-6 md:p-8 bg-surface-dark border border-primary/30 shadow-neon relative group">
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

        <div className="text-center mb-8 flex flex-col items-center">
            <Fingerprint className="text-primary w-12 h-12 mb-4 animate-pulse-slow" />
            <h2 className="text-2xl font-bold text-white tracking-[0.2em] leading-none">
            {t.login.title}
            </h2>
            <p className="text-[10px] text-primary/60 mt-2 uppercase tracking-widest">
            {t.login.subtitle}
            </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{t.login.error}: {error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
            {/* Primary OAuth-style Action */}
            <button 
                onClick={openGitHubTokenPage}
                onMouseEnter={() => audioService.playHover()}
                className="w-full bg-primary text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] py-4 px-4 font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group/btn relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                    <KeyRound className="w-5 h-5" />
                    {t.login.githubBtn}
                </span>
            </button>

            {/* Manual Input Section (Appears after click or if manually toggled) */}
            <div className={`transition-all duration-500 overflow-hidden ${showManualInput ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                        <input 
                            type="password"
                            value={token}
                            onChange={(e) => { setToken(e.target.value); audioService.playType(); }}
                            placeholder={t.login.tokenPlaceholder}
                            className="w-full bg-black border border-primary/30 text-primary p-3 pl-10 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all font-mono text-xs placeholder:text-primary/30"
                        />
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 w-4 h-4" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || !token}
                        onMouseEnter={() => audioService.playHover()}
                        className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black py-2 px-4 text-xs font-bold tracking-widest transition-all duration-300 disabled:opacity-50"
                    >
                        {isLoading ? t.login.decrypting : t.login.submitBtn}
                    </button>
                </form>
            </div>

            {!showManualInput && (
                <button 
                    onClick={() => { setShowManualInput(true); audioService.playClick(); }}
                    onMouseEnter={() => audioService.playHover()}
                    className="text-[10px] text-gray-500 hover:text-primary transition-colors uppercase tracking-widest text-center mt-2"
                >
                    {t.login.manualLink}
                </button>
            )}

            {/* AI Toggle */}
            <div className="flex items-center justify-center pt-4 border-t border-primary/10 mt-2">
                <label className="flex items-center gap-3 cursor-pointer group" onMouseEnter={() => audioService.playHover()}>
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={enableAi}
                        onChange={(e) => { 
                            const newValue = e.target.checked;
                            setEnableAi(newValue); 
                            localStorage.setItem(AI_PREF_KEY, String(newValue));
                            audioService.playClick(); 
                        }}
                    />
                    <div className={`block w-8 h-4 border border-primary/50 rounded-full transition-all duration-300 ${enableAi ? 'bg-primary/20 shadow-neon' : 'bg-black'}`}></div>
                    <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-primary rounded-full transition-transform duration-300 ${enableAi ? 'translate-x-4 shadow-[0_0_5px_#00FF41]' : 'translate-x-0 opacity-50'}`}></div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest transition-colors ${enableAi ? 'text-primary' : 'text-gray-600'}`}>
                    {t.login.aiToggle}
                </span>
                </label>
            </div>
        </div>

        <div className="mt-6 text-center">
            <button 
                onClick={() => { onLogin('demo', 'CyberRunner_2077', enableAi); audioService.playClick(); }}
                onMouseEnter={() => audioService.playHover()}
                className="text-[10px] text-primary/40 hover:text-primary underline decoration-dotted underline-offset-4 tracking-widest hover:shadow-neon transition-all"
            >
                {t.login.demoMode}
            </button>
        </div>
      </div>
    </div>
  );
};
