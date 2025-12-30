
import React, { useEffect, useState, useRef } from 'react';
import { audioService } from '../services/audioService';

// --- Hook for visibility ---
export const useInView = (options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect(); // Only trigger once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

// --- Count Up Animation ---
interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ end, duration = 1500, suffix = '', prefix = '', className = '' }) => {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;
    let frameCount = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out expo function for cyberpunk feel
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(ease * end));

      // Play sound periodically (not every frame to avoid machine gun effect)
      // Check if value changed significantly or just periodically
      frameCount++;
      if (progress < duration) {
        // Throttle sound to every 5 frames (~12 times a sec at 60fps)
        if (frameCount % 5 === 0) {
           audioService.playCountTick();
        }
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Ensure final number is set
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// --- Typewriter Animation ---
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30, delay = 0, className = '', cursor = true }) => {
  const { ref, isInView } = useInView();
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        audioService.playType(); // Play sound on character reveal
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayedText}
      {cursor && isInView && displayedText.length < text.length && (
        <span className="animate-pulse text-primary">_</span>
      )}
    </span>
  );
};

// --- Animated Progress Bar ---
interface AnimatedBarProps {
  percentage: number;
  color?: string;
  className?: string;
  delay?: number;
}

export const AnimatedBar: React.FC<AnimatedBarProps> = ({ percentage, color, className = '', delay = 0 }) => {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={`h-full ${className} transition-all duration-1000 ease-out`}
         style={{ 
           width: isInView ? `${percentage}%` : '0%',
           backgroundColor: color,
           transitionDelay: `${delay}ms`
         }}
    />
  );
};
