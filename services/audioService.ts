
// Web Audio API Service for Cyberpunk SFX

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true; // Default to muted
  private initialized: boolean = false;

  constructor() {
    // Lazy init handled in init()
  }

  public async init() {
    if (this.initialized) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master Volume
    this.masterGain = this.ctx.createGain();
    // Initialize volume based on isMuted state
    this.masterGain.gain.value = this.isMuted ? 0 : 0.3; 
    this.masterGain.connect(this.ctx.destination);
    
    this.initialized = true;
    
    // Only play startup sound if not muted
    if (!this.isMuted) {
      this.playStartup();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      // Smooth fade
      const now = this.ctx?.currentTime || 0;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.3, now, 0.1);
    }
    return this.isMuted;
  }

  public playHover() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    // High tech chirp
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playClick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    // Digital Thud/Zap
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playType() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    // Very short blip for typing
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Randomize pitch slightly for realism
    const baseFreq = 800;
    const randomOffset = Math.random() * 200 - 100;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq + randomOffset, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  public playCountTick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Short, high-tech "tick"
    const randomOffset = Math.random() * 100;
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + randomOffset, this.ctx.currentTime);
    
    // Lower volume significantly (was 0.015)
    gain.gain.setValueAtTime(0.005, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  public playStartup() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    // Power up sweep
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.0);
  }
}

export const audioService = new AudioService();
