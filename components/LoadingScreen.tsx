import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [text, setText] = useState('INITIALIZING CONNECTION...');
  
  useEffect(() => {
    const steps = [
      'ESTABLISHING SECURE HANDSHAKE...',
      'DECRYPTING BIOMETRICS...',
      'DOWNLOADING NEURAL LINK...',
      'COMPILING MATRIX DATA...',
      'ACCESS GRANTED.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setText(steps[i]);
        i++;
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
         <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
         <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <div className="font-mono text-primary tracking-widest text-sm animate-pulse">
        {text}
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
  );
};
