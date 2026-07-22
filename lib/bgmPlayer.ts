'use client';

// Web Audio API Lofi / Chiptune BGM Generator
class BGMPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private timerId: any = null;
  private currentStep: number = 0;

  // Relaxing Lofi Chord Progression (Cmaj7 -> Am7 -> Dm7 -> G7)
  private chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [293.66, 349.23, 440.00, 523.25], // Dm7
    [196.00, 246.94, 293.66, 349.23], // G7
  ];

  public init() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('hsk_bgm_enabled');
    this.isMuted = saved === 'false';
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      localStorage.setItem('hsk_bgm_enabled', 'false');
      return false;
    } else {
      this.start();
      localStorage.setItem('hsk_bgm_enabled', 'true');
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (typeof window === 'undefined') return;
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isPlaying = true;
      this.currentStep = 0;
      this.playLoop();
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private playLoop = () => {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.currentStep % this.chords.length];
    const now = this.ctx.currentTime;

    // Master filter for cozy low-pass Lofi effect
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now); // Soft warm cutoff

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.04, now); // Gentle background volume

    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    // Play soft sine waves for warm chord tones
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Smooth attack & decay
      noteGain.gain.setValueAtTime(0, now + idx * 0.08);
      noteGain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

      osc.connect(noteGain);
      noteGain.connect(filter);

      osc.start(now + idx * 0.08);
      osc.stop(now + 3.4);
    });

    this.currentStep++;
    this.timerId = setTimeout(this.playLoop, 3500);
  };
}

export const bgmPlayer = new BGMPlayer();
