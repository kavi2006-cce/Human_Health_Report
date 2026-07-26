/* ============================================================
   HEALTHGUARDIAN AI - WEB AUDIO API SOUND SYNTHESIZER
   Zero external dependencies. High reliability audio feedback.
   ============================================================ */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.alarmInterval = null;
    this.heartbeatInterval = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const playThump = (freq, duration, delay) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + duration);

          gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
      }, delay);
    };

    // Lub-Dub pulse pair
    playThump(80, 0.12, 0);
    playThump(60, 0.15, 140);
  }

  startContinuousHeartbeat(bpm = 72) {
    this.stopContinuousHeartbeat();
    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.playHeartbeat();
    }, intervalMs);
  }

  stopContinuousHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  playEmergencySiren() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;

      // High-low alternating medical alarm siren
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(650, now + 0.25);
      osc.frequency.linearRampToValueAtTime(880, now + 0.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  startEmergencyLoop() {
    this.stopEmergencyLoop();
    this.playEmergencySiren();
    this.alarmInterval = setInterval(() => {
      this.playEmergencySiren();
    }, 600);
  }

  stopEmergencyLoop() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  playChimeNotification() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99].forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.2, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.3);
      });
    } catch (e) {}
  }

  playSuccessSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch (e) {}
  }

  speakText(text) {
    if (this.isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopContinuousHeartbeat();
      this.stopEmergencyLoop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }
}

// Global Singleton Instance
window.healthAudio = new AudioSynthesizer();

