
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (token: string, enableAi: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [token, setToken] = useState('');
  const [enableAi, setEnableAi] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) onLogin(token, enableAi);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-6 md:p-8 bg-surface-dark border border-primary/30 shadow-neon relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

        <h2 className="text-2xl font-bold text-white mb-6 tracking-widest text-center">
          SYSTEM_ACCESS
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
             <label className="text-xs text-primary/70 uppercase tracking-widest">Security Token (PAT)</label>
             <input 
               type="password"
               value={token}
               onChange={(e) => setToken(e.target.value)}
               placeholder="ghp_..."
               className="w-full bg-black border border-primary/30 text-white p-3 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all font-mono text-sm placeholder:text-gray-700"
             />
             <p className="text-[10px] text-gray-500">
               Requires 'read:user' scope. Token is not stored.
             </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !token}
            className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black py-3 px-4 font-bold tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE'}
          </button>

          <div className="flex items-center justify-center pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
               <div className="relative">
                 <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={enableAi}
                    onChange={(e) => setEnableAi(e.target.checked)}
                 />
                 <div className={`block w-10 h-5 border border-primary/50 rounded-full transition-all duration-300 ${enableAi ? 'bg-primary/20 shadow-neon' : 'bg-black'}`}></div>
                 <div className={`absolute left-1 top-1 w-3 h-3 bg-primary rounded-full transition-transform duration-300 ${enableAi ? 'translate-x-5 shadow-[0_0_5px_#00FF41]' : 'translate-x-0 opacity-50'}`}></div>
               </div>
               <span className={`text-xs uppercase tracking-widest transition-colors ${enableAi ? 'text-primary' : 'text-gray-600'}`}>
                 Enable Neural Analysis (AI)
               </span>
            </label>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-primary/10 text-center">
          <p className="text-[10px] text-gray-600 mb-3">NO CREDENTIALS FOUND?</p>
          <button 
            onClick={() => onLogin('demo', enableAi)}
            className="text-xs text-primary/60 hover:text-primary underline decoration-dotted underline-offset-4 tracking-widest hover:shadow-neon transition-all"
          >
            >> LOAD DEMO SIMULATION
          </button>
        </div>
      </div>
    </div>
  );
};
