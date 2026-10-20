/**
 * 🎵 Magic Web Audio Engine for 20/10 Greeting
 * Synthesizes emotional ambient piano chords, chime sparkles, and fireworks SFX
 * Zero external audio dependency - 100% reliable offline & online!
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.chordLoopTimer = null;
        this.currentChordIndex = 0;
        this.analyser = null;
        this.dataArray = null;

        // Pentatonic / Lyrical chord progression in F Major / D Minor:
        // Fmaj9 -> Am7 -> Bbmaj9 -> C7sus4 -> Dm9 -> Gm7 -> C9 -> Fadd9
        this.chords = [
            [174.61, 261.63, 329.63, 392.00, 440.00], // Fmaj9 (F3, C4, E4, G4, A4)
            [220.00, 261.63, 329.63, 392.00, 493.88], // Am7/9 (A3, C4, E4, G4, B4)
            [233.08, 293.66, 349.23, 440.00, 523.25], // Bbmaj9 (Bb3, D4, F4, A4, C5)
            [261.63, 349.23, 392.00, 466.16, 523.25], // C7sus4 (C4, F4, G4, Bb4, C5)
            [146.83, 220.00, 293.66, 349.23, 440.00], // Dm9 (D3, A3, D4, F4, A4)
            [196.00, 293.66, 349.23, 440.00, 523.25], // Gm9 (G3, D4, F4, A4, C5)
            [261.63, 329.63, 392.00, 466.16, 587.33], // C9 (C4, E4, G4, Bb4, D5)
            [174.61, 261.63, 329.63, 349.23, 440.00]  // Fadd9 (F3, C4, E4, F4, A4)
        ];

        // Gentle counter-melody notes (Ethereal music box arpeggios)
        this.melodyNotes = [
            [523.25, 659.25, 783.99],
            [440.00, 523.25, 659.25],
            [587.33, 698.46, 880.00],
            [523.25, 659.25, 783.99],
            [440.00, 587.33, 698.46],
            [392.00, 523.25, 659.25],
            [523.25, 587.33, 783.99],
            [659.25, 783.99, 880.00]
        ];
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Visualizer analyser
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
    }

    startMusic() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentChordIndex = 0;
        this.scheduleNextChord();
    }

    stopMusic() {
        this.isPlaying = false;
        if (this.chordLoopTimer) {
            clearTimeout(this.chordLoopTimer);
            this.chordLoopTimer = null;
        }
    }

    toggleMusic() {
        if (!this.isPlaying) {
            this.startMusic();
            return true;
        } else {
            this.stopMusic();
            return false;
        }
    }

    toggleMute() {
        this.init();
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(
                this.isMuted ? 0 : 0.7,
                this.ctx.currentTime,
                0.05
            );
        }
        return this.isMuted;
    }

    scheduleNextChord() {
        if (!this.isPlaying || !this.ctx) return;

        const chord = this.chords[this.currentChordIndex];
        const melody = this.melodyNotes[this.currentChordIndex];
        const chordDuration = 3.6; // seconds per chord
        const now = this.ctx.currentTime;

        // Play each note in the chord with gentle staggered attack (harp / electric piano strum)
        chord.forEach((freq, i) => {
            const noteDelay = i * 0.08 + Math.random() * 0.02;
            this.playWarmPadNote(freq, now + noteDelay, chordDuration - noteDelay);
        });

        // Arpeggiate melody sparkles gently over the bar
        melody.forEach((freq, idx) => {
            const delay = 0.9 + idx * 0.8 + Math.random() * 0.1;
            this.playGlockenspielNote(freq, now + delay, 1.8);
        });

        this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

        this.chordLoopTimer = setTimeout(() => {
            this.scheduleNextChord();
        }, chordDuration * 1000);
    }

    // Warm Rhodes / Soft Piano Pad tone
    playWarmPadNote(freq, startTime, duration) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(freq * 0.5, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, startTime);
        filter.frequency.exponentialRampToValueAtTime(320, startTime + duration);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.linearRampToValueAtTime(0.09, startTime + 0.35); // Soft swell
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        oscSub.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGain);

        osc.start(startTime);
        oscSub.start(startTime);
        osc.stop(startTime + duration);
        oscSub.stop(startTime + duration);
    }

    // Shimmering Glockenspiel / Music Box Bell
    playGlockenspielNote(freq, startTime, duration) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.musicGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    // ✨ SFX: Magical Fairy Wand Chime / Sparkle
    playSparkle() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const notes = [880, 1046.5, 1318.5, 1567.98, 2093.00, 2637.02];

        notes.forEach((freq, idx) => {
            const delay = idx * 0.05 + Math.random() * 0.02;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + delay);

            gain.gain.setValueAtTime(0.0001, now + delay);
            gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.4);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + delay);
            osc.stop(now + delay + 0.45);
        });
    }

    // 🎁 SFX: Gift Box Opening / Celestial Chime
    playGiftOpen() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];

        arpeggio.forEach((freq, i) => {
            const delay = i * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + delay);

            gain.gain.setValueAtTime(0.0001, now + delay);
            gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + delay);
            osc.stop(now + delay + 1.3);
        });
    }

    // 🎆 SFX: Firework Pop & Shimmer Crackle
    playFireworkBoom() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        // Low boom
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.45);

        // Crackle sparkles
        setTimeout(() => {
            if (!this.ctx || this.isMuted) return;
            for (let i = 0; i < 4; i++) {
                const crackleDelay = i * 0.07 + Math.random() * 0.04;
                const cOsc = this.ctx.createOscillator();
                const cGain = this.ctx.createGain();
                cOsc.type = 'square';
                cOsc.frequency.setValueAtTime(1200 + Math.random() * 800, this.ctx.currentTime + crackleDelay);

                cGain.gain.setValueAtTime(0.02, this.ctx.currentTime + crackleDelay);
                cGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + crackleDelay + 0.06);

                cOsc.connect(cGain);
                cGain.connect(this.sfxGain);

                cOsc.start(this.ctx.currentTime + crackleDelay);
                cOsc.stop(this.ctx.currentTime + crackleDelay + 0.08);
            }
        }, 180);
    }

    // 🎴 SFX: Card Flip / Fortune Draw
    playCardFlip() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // Get live audio intensity for visualizer (0.0 to 1.0)
    getAudioLevel() {
        if (!this.analyser || !this.isPlaying || this.isMuted) return 0;
        this.analyser.getByteFrequencyData(this.dataArray);
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        return sum / (this.dataArray.length * 255);
    }
}

// Global instance
window.soundEngine = new SoundEngine();
