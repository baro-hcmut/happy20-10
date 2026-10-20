/**
 * 🎵 Magic Web Audio Engine - Masterclass Edition
 * Synthesizes 3 distinct ambient acoustic/piano tracks,
 * interactive harmonic notes for 3D petal clicks, and custom audio streaming.
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

        // Active music track style
        this.currentTrack = 'piano'; // 'piano', 'musicbox', 'nocturne'

        // Track 1: Romantic Velvet Piano (F Major / D Minor Lyrical Progression)
        this.pianoChords = [
            [174.61, 261.63, 329.63, 392.00, 440.00], // Fmaj9
            [220.00, 261.63, 329.63, 392.00, 493.88], // Am7/9
            [233.08, 293.66, 349.23, 440.00, 523.25], // Bbmaj9
            [261.63, 349.23, 392.00, 466.16, 523.25], // C7sus4
            [146.83, 220.00, 293.66, 349.23, 440.00], // Dm9
            [196.00, 293.66, 349.23, 440.00, 523.25], // Gm9
            [261.63, 329.63, 392.00, 466.16, 587.33], // C9
            [174.61, 261.63, 329.63, 349.23, 440.00]  // Fadd9
        ];

        // Track 2: Celeste Music Box (Ethereal Pentatonic Lullaby in C)
        this.musicboxChords = [
            [261.63, 329.63, 392.00, 523.25], // C
            [220.00, 261.63, 329.63, 440.00], // Am
            [174.61, 261.63, 349.23, 440.00], // F
            [196.00, 246.94, 293.66, 392.00], // G
            [220.00, 261.63, 329.63, 523.25], // Am7
            [174.61, 220.00, 261.63, 349.23], // Fmaj7
            [196.00, 293.66, 392.00, 493.88], // Gsus4
            [261.63, 329.63, 392.00, 659.25]  // Cadd9
        ];

        // Track 3: Nocturne Twilight Ambient (Lush Ambient Drone in D)
        this.nocturneChords = [
            [146.83, 220.00, 293.66, 440.00, 554.37], // Dmaj9
            [164.81, 246.94, 329.63, 392.00, 493.88], // Em9
            [185.00, 220.00, 277.18, 369.99, 440.00], // F#m7
            [196.00, 293.66, 369.99, 440.00, 587.33]  // Gmaj9
        ];

        // Shimmering Glockenspiel notes
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

        // Harmonic scale for interactive 3D touches
        this.harmonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

        // 🎹 Cung Đàn Tình Ca - Interactive Song Melody Sequences
        this.melodySong = 'river'; // 'river', 'canon', 'thousand_years', 'freestyle'
        this.melodyStep = 0;
        this.melodySongs = {
            river: {
                title: 'River Flows In You (Yiruma)',
                notes: [
                    440.00, 415.30, 440.00, 329.63, 293.66, 277.18, 293.66, 329.63,
                    440.00, 415.30, 440.00, 493.88, 554.37, 493.88, 440.00, 415.30, 440.00, 369.99,
                    440.00, 415.30, 440.00, 329.63, 293.66, 277.18, 293.66, 329.63,
                    440.00, 415.30, 440.00, 493.88, 554.37, 587.33, 554.37, 493.88, 440.00
                ]
            },
            canon: {
                title: 'Canon in D (Pachelbel)',
                notes: [
                    587.33, 523.25, 493.88, 440.00, 392.00, 369.99, 392.00, 440.00,
                    493.88, 440.00, 392.00, 369.99, 329.63, 293.66, 329.63, 440.00,
                    587.33, 659.25, 587.33, 523.25, 493.88, 440.00, 392.00, 369.99,
                    329.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 587.33
                ]
            },
            thousand_years: {
                title: 'A Thousand Years (Christina Perri)',
                notes: [
                    523.25, 493.88, 392.00, 329.63, 523.25, 493.88, 392.00, 293.66,
                    329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63, 329.63,
                    392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00, 329.63
                ]
            }
        };
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

    setTrack(trackKey) {
        this.currentTrack = trackKey;
        this.currentChordIndex = 0;
        if (this.isPlaying) {
            this.stopMusic();
            this.startMusic();
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

    getCurrentChordList() {
        if (this.currentTrack === 'musicbox') return this.musicboxChords;
        if (this.currentTrack === 'nocturne') return this.nocturneChords;
        return this.pianoChords;
    }

    scheduleNextChord() {
        if (!this.isPlaying || !this.ctx) return;

        const chordList = this.getCurrentChordList();
        const chord = chordList[this.currentChordIndex % chordList.length];
        const melody = this.melodyNotes[this.currentChordIndex % this.melodyNotes.length];
        const chordDuration = this.currentTrack === 'nocturne' ? 4.2 : 3.6;
        const now = this.ctx.currentTime;

        // Play each note in the chord with gentle staggered attack
        chord.forEach((freq, i) => {
            const noteDelay = i * 0.08 + Math.random() * 0.02;
            if (this.currentTrack === 'musicbox') {
                this.playGlockenspielNote(freq * 1.5, now + noteDelay, 2.5);
            } else {
                this.playWarmPadNote(freq, now + noteDelay, chordDuration - noteDelay);
            }
        });

        // Arpeggiate melody sparkles gently
        melody.forEach((freq, idx) => {
            const delay = 0.9 + idx * 0.8 + Math.random() * 0.1;
            this.playGlockenspielNote(freq, now + delay, 1.8);
        });

        this.currentChordIndex = (this.currentChordIndex + 1) % chordList.length;

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
        gainNode.gain.linearRampToValueAtTime(0.09, startTime + 0.35);
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

    // 🌸 Interactive Harmonic Note on 3D Petal Click
    playHarmonicNote(index = 0) {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const freq = this.harmonicScale[index % this.harmonicScale.length];

        const osc = this.ctx.createOscillator();
        const oscHarm = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        oscHarm.type = 'triangle';
        oscHarm.frequency.setValueAtTime(freq * 2, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        oscHarm.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        oscHarm.start(now);
        osc.stop(now + 1.25);
        oscHarm.stop(now + 1.25);
    }

    // 🎹 Cung Đàn Tình Ca - Play next melody note of iconic love songs!
    playMelodyNote(petalIndex = 0) {
        this.init();
        if (this.isMuted) return;

        if (this.melodySong === 'freestyle' || !this.melodySongs[this.melodySong]) {
            this.playHarmonicNote(petalIndex);
            return;
        }

        const song = this.melodySongs[this.melodySong];
        const freq = song.notes[this.melodyStep % song.notes.length];
        this.melodyStep++;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const oscHarm = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        oscHarm.type = 'sine';
        oscHarm.frequency.setValueAtTime(freq * 2, now);

        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(freq * 0.5, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + 1.8);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(filter);
        oscHarm.connect(filter);
        oscSub.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        oscHarm.start(now);
        oscSub.start(now);
        osc.stop(now + 1.85);
        oscHarm.stop(now + 1.85);
        oscSub.stop(now + 1.85);

        return { song: song.title, step: this.melodyStep };
    }

    setMelodySong(songKey = 'river') {
        this.melodySong = songKey;
        this.melodyStep = 0;
    }

    // 🍾 SFX: Crystal Wish Bottle Bell Chime
    playCrystalChime() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        const freqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteTime = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.0001, noteTime);
            gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.0);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(noteTime);
            osc.stop(noteTime + 2.05);
        });
    }

    // 🦋 SFX: Fairy Harp Glissando (when butterfly is touched)
    playFairyHarp() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        const harpScale = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        harpScale.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.045;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(0.06, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 1.25);
        });
    }

    // 💧 SFX: Water Droplet Ripple
    playWaterDrop() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.3);
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

    // 🎁 SFX: Gift Box Opening
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

    // 🎆 SFX: Firework Pop & Shimmer
    playFireworkBoom() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

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

    // 📸 SFX: Polaroid Camera Shutter Snap
    playCameraShutter() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        // Click click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Visualizer intensity (0.0 to 1.0)
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
