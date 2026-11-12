/**
 * Pure Procedural Web Audio API Synthesizer & Dynamic Audio Mixer
 * No external sound files required! 100% self-contained & offline.
 */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.isDucked = false;
    this.deficitGlitch = false;
    this.complaintsFilter = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.6, this.ctx.currentTime);

      // Low-pass filter for petition/protest muffling
      this.protestFilter = this.ctx.createBiquadFilter();
      this.protestFilter.type = 'lowpass';
      this.protestFilter.frequency.setValueAtTime(20000, this.ctx.currentTime); // Normal open

      // Ducking gain for document view
      this.duckingGain = this.ctx.createGain();
      this.duckingGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

      // Routing: source -> duckingGain -> protestFilter -> masterGain -> destination
      this.duckingGain.connect(this.protestFilter);
      this.protestFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Bossa Nova Procedural Loop (公家機關輕快等候音樂)
   */
  startBossaNovaBGM() {
    this.ensureContext();
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;

    // Chord progression: Dm7 -> G7 -> Cmaj7 -> A7
    const chords = [
      [293.66, 349.23, 440.00, 523.25], // Dm7 (D4, F4, A4, C5)
      [196.00, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 277.18, 329.63, 392.00]  // A7 (A3, C#4, E4, G4)
    ];

    let step = 0;
    const tempoInterval = 480; // ms per beat

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const chordIdx = Math.floor(step / 4) % chords.length;
      const chord = chords[chordIdx];

      // Bass note on beats 0 & 2
      if (step % 2 === 0) {
        this.playBassTone(chord[0] / 2, t, 0.35);
      }

      // Light piano comping on syncopated beats
      if (step % 4 === 1 || step % 4 === 3) {
        this.playChord(chord, t, 0.25);
      }

      // Soft shaker on every beat
      this.playShakerNoise(t);

      step++;
    }, tempoInterval);
  }

  playBassTone(freq, time, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';

    // Pitch detune if in deficit glitch mode
    if (this.deficitGlitch) {
      osc.detune.setValueAtTime(-300, time);
    } else {
      osc.detune.setValueAtTime(0, time);
    }

    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.duckingGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  playChord(chordFreqs, time, duration) {
    if (!this.ctx) return;
    chordFreqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      if (this.deficitGlitch) {
        osc.detune.setValueAtTime(-250, time);
      }

      osc.frequency.setValueAtTime(f, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.duckingGain);
      osc.start(time);
      osc.stop(time + duration);
    });
  }

  playShakerNoise(time) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.duckingGain);
    whiteNoise.start(time);
  }

  /**
   * UI 避難所 (Ducking): 公文飛入時，所有背景災難音效壓低至 15%
   */
  duckAudio() {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.duckingGain.gain.cancelScheduledValues(t);
    this.duckingGain.gain.linearRampToValueAtTime(0.15, t + 0.3);
  }

  /**
   * 決行蓋印暴擊 (Slam) + 120% 音量轟然反彈
   */
  slamStampAndRebound() {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // 1. Deep heavy wooden thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.2);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.25);

    // 2. Rebound background audio to 120%
    setTimeout(() => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.duckingGain.gain.cancelScheduledValues(now);
      this.duckingGain.gain.setValueAtTime(1.2, now);
      this.duckingGain.gain.linearRampToValueAtTime(1.0, now + 1.2);
    }, 250);
  }

  /**
   * 預算赤字跳針 (Pitch Drop & Deficit Electrical Glitch)
   */
  setDeficitState(isDeficit) {
    this.deficitGlitch = isDeficit;
  }

  /**
   * 陳情破表低通濾波 (Muffle & Protest Squeal)
   */
  setComplaintsFilter(isHighComplaints) {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.complaintsFilter = isHighComplaints;
    if (isHighComplaints) {
      this.protestFilter.frequency.linearRampToValueAtTime(450, t + 0.5); // Muffled
    } else {
      this.protestFilter.frequency.linearRampToValueAtTime(20000, t + 0.5); // Clear
    }
  }

  /**
   * 大聲公尖嘯特效 (Megaphone Feedback Squeal)
   */
  playMegaphoneFeedback() {
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.linearRampToValueAtTime(2600, t + 0.4);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }
}
