// Web Audio Synthesizer - 100% reliable, zero external MP3 dependencies
// Generates responsive arcade, coin, and UI sound effects dynamically

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext is initialized on user gesture
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // 1. Crisp UI Button Click (used for general buttons)
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  // 2. Option Selection Blip (when choosing a price or answer)
  public playSelect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // 3. Hover / Focus Tick
  public playHover() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  // 4. Correct Answer - Bright Neon Arcade Chime
  public playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Ascending major chord (E5 -> G#5 -> B5 -> E6)
      const frequencies = [659.25, 830.61, 987.77, 1318.51];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
      });
    } catch {}
  }

  // 5. Level Transition / Whoosh / Screen Change (futuristic portal slide)
  public playLevelTransition() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';

      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.35);

      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.18);
      filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.38);

      // Add a sparkling shimmer bell on arrival
      setTimeout(() => {
        if (!this.enabled || !this.ctx) return;
        try {
          const bell = this.ctx.createOscillator();
          const bellGain = this.ctx.createGain();
          bell.type = 'sine';
          bell.frequency.setValueAtTime(1046.5, this.ctx.currentTime); // C6
          bellGain.gain.setValueAtTime(0.16, this.ctx.currentTime);
          bellGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
          bell.connect(bellGain);
          bellGain.connect(this.ctx.destination);
          bell.start();
          bell.stop(this.ctx.currentTime + 0.26);
        } catch {}
      }, 160);
    } catch {}
  }

  // 6. Wrong Answer - Soft arcade error buzz
  public playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  // 7. Coin Drop / Cash Register (for money tally & cash)
  public playCoin() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }

  // 8. Streak Multiplier Bonus - pitch rises with current streak
  public playStreakBonus(streak: number = 2) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const basePitch = Math.min(440 * Math.pow(1.12, streak), 1400);
      const notes = [basePitch, basePitch * 1.25, basePitch * 1.5, basePitch * 2];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.24);
      });
    } catch {}
  }

  // 9. Countdown Timer Warning Tick (under 10s)
  public playTimerTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // 10. Pause / Resume Toggle
  public playPause() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {}
  }

  // 11. Fanfare / Final Victory
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },
        { f: 523.25, t: 0.12, d: 0.12 },
        { f: 523.25, t: 0.24, d: 0.12 },
        { f: 659.25, t: 0.36, d: 0.22 },
        { f: 783.99, t: 0.58, d: 0.22 },
        { f: 1046.5, t: 0.80, d: 0.45 },
      ];

      melody.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d + 0.02);
      });
    } catch {}
  }

  // Backward compatibility aliases
  public playSuccess() {
    this.playCorrect();
  }

  public playError() {
    this.playWrong();
  }

  public playPop() {
    this.playClick();
  }
}

export const soundManager = new SoundManager();
