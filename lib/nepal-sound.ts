import type { SoundMood } from '@/src/data/journey';

/** Original synthesized sound design. No field recordings or third-party audio. */
export class NepalSoundscape {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private wind: GainNode | null = null;
  private water: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private noise: AudioBuffer | null = null;
  private sources: AudioScheduledSourceNode[] = [];
  private lastCut = -Infinity;

  async enable() {
    const Context = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) throw new Error('Sound is unavailable in this browser.');
    if (!this.context) {
      const ctx = new Context({ latencyHint: 'playback' });
      this.context = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -22; limiter.knee.value = 12; limiter.ratio.value = 4;
      this.master.connect(limiter); limiter.connect(ctx.destination);
      this.noise = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate);
      const samples = this.noise.getChannelData(0);
      let seed = 8471, previous = 0;
      for (let i = 0; i < samples.length; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const white = (seed / 4294967296) * 2 - 1;
        previous = (previous + 0.025 * white) / 1.025;
        samples[i] = previous * 3.5;
      }
      const bed = (frequency: number, type: BiquadFilterType) => {
        const source = ctx.createBufferSource(); source.buffer = this.noise; source.loop = true;
        const filter = ctx.createBiquadFilter(); filter.type = type; filter.frequency.value = frequency; filter.Q.value = 0.3;
        const gain = ctx.createGain(); gain.gain.value = 0;
        source.connect(filter); filter.connect(gain); gain.connect(this.master!); source.start();
        this.sources.push(source); return { gain, filter };
      };
      const wind = bed(650, 'lowpass'); this.wind = wind.gain; this.windFilter = wind.filter;
      this.water = bed(1600, 'highpass').gain;
    }
    await this.context.resume();
    this.master!.gain.setTargetAtTime(0.34, this.context.currentTime, 0.35);
  }

  disable() {
    if (this.context && this.master) this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.08);
  }

  setMood(mood: SoundMood, chime = false) {
    const ctx = this.context;
    if (!ctx || !this.wind || !this.water || !this.master) return;
    const now = ctx.currentTime;
    this.wind.gain.setTargetAtTime(mood === 'wind' ? 0.32 : mood === 'quiet' ? 0.08 : 0.14, now, 1.1);
    this.water.gain.setTargetAtTime(mood === 'water' ? 0.45 : 0, now, 0.9);
    this.windFilter?.frequency.setTargetAtTime(mood === 'warm' ? 1100 : 550, now, 1.1);
    if (now - this.lastCut < 0.8) return;
    this.lastCut = now;
    if (chime) {
      // A restrained metallic overtone, rather than an imitated ritual recording.
      [1, 2.71, 4.18].forEach((partial, index) => {
        const oscillator = ctx.createOscillator(), gain = ctx.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = 392 * partial;
        gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.055 / (index + 1), now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6 / (index + 1));
        oscillator.connect(gain); gain.connect(this.master!); oscillator.start(now); oscillator.stop(now + 3);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } else {
      const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
      source.buffer = this.noise; filter.type = 'bandpass'; filter.frequency.setValueAtTime(1100, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.2); filter.Q.value = 0.5;
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.12, now + 0.035); gain.gain.linearRampToValueAtTime(0, now + 0.28);
      source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start(now); source.stop(now + 0.3);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    }
  }

  async destroy() {
    this.sources.forEach((source) => { try { source.stop(); } catch { /* already stopped */ } source.disconnect(); });
    this.sources = [];
    const ctx = this.context; this.context = null;
    if (ctx && ctx.state !== 'closed') await ctx.close();
  }
}
