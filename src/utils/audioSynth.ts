/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Custom Web Audio API synthesizer for clean tones and alarms.
 * Avoids loading external Audio files which can trigger CORS or 404 errors.
 */

class AudioSynth {
  private ctx: AudioContext | null = null;
  private activeAudio: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stopActiveAudio() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {
        console.warn('Error pausing active audio:', e);
      }
      this.activeAudio = null;
    }
  }

  playPredefinedMp3(url: string, volume = 0.5) {
    try {
      this.stopActiveAudio();
      
      const audio = new Audio();
      this.activeAudio = audio;
      audio.src = url;
      audio.volume = volume;
      
      audio.onerror = () => {
        console.warn("Audio load/CORS error, falling back to synthesiser");
        this.playShortAdhan(volume);
      };
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play blocked/failed, falling back to synthesiser:", err);
          this.playShortAdhan(volume);
        });
      }
    } catch (e) {
      console.warn("Failed to play audio file, falling back to synthesiser:", e);
      this.playShortAdhan(volume);
    }
  }

  playBeepDigital(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime); // High pitch

    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playBeepSoft(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  playMelody(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
    const time = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.15);

      gainNode.gain.setValueAtTime(0, time + idx * 0.15);
      gainNode.gain.linearRampToValueAtTime(volume * 0.4, time + idx * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + idx * 0.15 + 0.6);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(time + idx * 0.15);
      osc.stop(time + idx * 0.15 + 0.6);
    });
  }

  playMakkahAdhan(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [392.00, 415.30, 493.88, 523.25, 587.33, 659.25, 392.00, 523.25, 493.88];
    const durations = [0.35, 0.35, 0.5, 0.45, 0.35, 0.45, 0.25, 0.5, 0.7];
    let startTime = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 8;
      lfoGain.gain.value = 5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[idx]);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      lfo.start(startTime);
      osc.start(startTime);
      lfo.stop(startTime + durations[idx]);
      osc.stop(startTime + durations[idx]);

      startTime += durations[idx] * 0.8;
    });
  }

  playMadinahAdhan(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [293.66, 329.63, 349.23, 440.00, 392.00, 349.23, 293.66, 329.63, 349.23];
    const durations = [0.55, 0.55, 0.75, 0.65, 0.55, 0.65, 0.45, 0.75, 0.95];
    let startTime = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 4.5;
      lfoGain.gain.value = 3.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.45, startTime + 0.06);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[idx]);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      lfo.start(startTime);
      osc.start(startTime);
      lfo.stop(startTime + durations[idx]);
      osc.stop(startTime + durations[idx]);

      startTime += durations[idx] * 0.9;
    });
  }

  playAqsaAdhan(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [220.00, 246.94, 261.63, 329.63, 293.66, 261.63, 220.00, 293.66, 261.63];
    const durations = [0.5, 0.5, 0.65, 0.55, 0.5, 0.55, 0.4, 0.65, 0.85];
    let startTime = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 5.5;
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.55, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[idx]);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      lfo.start(startTime);
      osc.start(startTime);
      lfo.stop(startTime + durations[idx]);
      osc.stop(startTime + durations[idx]);

      startTime += durations[idx] * 0.85;
    });
  }

  playShortAdhan(volume = 0.5) {
    this.stopActiveAudio();
    this.initCtx();
    if (!this.ctx) return;

    // Elegant modal flow simulating an eastern chime (Hijaz / Phrygian scale)
    const freqs = [
      329.63, // E4
      349.23, // F4
      415.30, // G#4
      440.00, // A4
      493.88, // B4
      523.25, // C5
      329.63, // E4
      440.00, // A4
      415.30  // G#4
    ];
    
    const durations = [
      0.4, 0.4, 0.6, 0.5, 0.4, 0.5, 0.3, 0.6, 0.8
    ];

    let startTime = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Add vibrato/tremolo for a spiritual human feeling
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 6; // 6 Hz vibrato
      lfoGain.gain.value = 4; // microtones
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[idx]);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      lfo.start(startTime);
      osc.start(startTime);
      
      lfo.stop(startTime + durations[idx]);
      osc.stop(startTime + durations[idx]);

      startTime += durations[idx] * 0.85; // slightly overlapping
    });
  }

  play(
    type: 'adhan_short' | 'beep_digital' | 'beep_soft' | 'melody',
    volume = 0.5,
    adhanSample?: string,
    customAdhanBase64?: string
  ) {
    if (type === 'adhan_short') {
      const sample = adhanSample || 'synth_classic';
      switch (sample) {
        case 'synth_makkah':
          this.playMakkahAdhan(volume);
          break;
        case 'synth_madinah':
          this.playMadinahAdhan(volume);
          break;
        case 'synth_aqsa':
          this.playAqsaAdhan(volume);
          break;
        case 'mp3_makkah':
          this.playPredefinedMp3('https://www.islamcan.com/audio/adhan/azan1.mp3', volume);
          break;
        case 'mp3_madinah':
          this.playPredefinedMp3('https://www.islamcan.com/audio/adhan/azan2.mp3', volume);
          break;
        case 'mp3_egypt':
          this.playPredefinedMp3('https://www.islamcan.com/audio/adhan/azan3.mp3', volume);
          break;
        case 'custom_uploaded':
          if (customAdhanBase64) {
            this.playPredefinedMp3(customAdhanBase64, volume);
          } else {
            this.playShortAdhan(volume);
          }
          break;
        case 'synth_classic':
        default:
          this.playShortAdhan(volume);
          break;
      }
      return;
    }

    switch (type) {
      case 'beep_digital':
        this.playBeepDigital(volume);
        break;
      case 'beep_soft':
        this.playBeepSoft(volume);
        break;
      case 'melody':
        this.playMelody(volume);
        break;
      default:
        this.playShortAdhan(volume);
        break;
    }
  }
}

export const audioSynth = new AudioSynth();
