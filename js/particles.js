/**
 * ✨ Particle, Heart Fireworks, Fireflies, Petals, and Cosmic Nebula System
 * Masterclass 60FPS dual-canvas visual effects engine
 */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.nebulaClouds = [];
        this.stars = [];
        this.meteors = [];
        this.fireflies = [];
        this.petals = [];
        this.fireworks = [];
        this.fireworkParticles = [];
        this.lanterns = [];
        this.cursorParticles = [];

        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;

        this.lastMeteorTime = 0;
        this.lastAutoFireworkTime = 0;
        this.autoFireworksEnabled = false;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Track cursor
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.spawnCursorSparkles(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
                this.spawnCursorSparkles(this.mouseX, this.mouseY);
            }
        }, { passive: true });

        // Generate cosmic environment
        this.initNebulaClouds();
        this.initStars(240);
        this.initFireflies(26);
        this.initPetals(38);

        // Start render loop
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.initNebulaClouds();
    }

    // --- 🌌 Cosmic Nebula Clouds ---
    initNebulaClouds() {
        this.nebulaClouds = [
            {
                x: this.width * 0.25,
                y: this.height * 0.35,
                radius: Math.max(300, this.width * 0.35),
                color: '120, 40, 160', // Deep Violet Nebula
                baseAlpha: 0.14,
                phase: 0,
                speed: 0.005
            },
            {
                x: this.width * 0.75,
                y: this.height * 0.40,
                radius: Math.max(320, this.width * 0.40),
                color: '200, 50, 110', // Romantic Rose Nebula
                baseAlpha: 0.12,
                phase: 2.1,
                speed: 0.004
            },
            {
                x: this.width * 0.50,
                y: this.height * 0.20,
                radius: Math.max(280, this.width * 0.30),
                color: '240, 180, 80', // Golden Stardust Cluster
                baseAlpha: 0.08,
                phase: 4.2,
                speed: 0.006
            }
        ];
    }

    updateAndDrawNebula() {
        for (let neb of this.nebulaClouds) {
            neb.phase += neb.speed;
            const alpha = neb.baseAlpha * (0.8 + 0.2 * Math.sin(neb.phase));

            const grad = this.ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
            grad.addColorStop(0, `rgba(${neb.color}, ${alpha})`);
            grad.addColorStop(0.5, `rgba(${neb.color}, ${alpha * 0.4})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = grad;
            this.ctx.fillRect(neb.x - neb.radius, neb.y - neb.radius, neb.radius * 2, neb.radius * 2);
        }
    }

    // --- ⭐ Starfield ---
    initStars(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height * 0.82,
                radius: Math.random() * 1.5 + 0.3,
                baseAlpha: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                phase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.8 ? '#ffe6fa' : (Math.random() > 0.5 ? '#fff4cc' : '#ffffff')
            });
        }
    }

    updateAndDrawStars() {
        for (let s of this.stars) {
            s.phase += s.twinkleSpeed;
            const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));

            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();

            // Soft glow aura for bright stars
            if (s.radius > 1.2) {
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.radius * 2.4, 0, Math.PI * 2);
                this.ctx.fillStyle = s.color;
                this.ctx.globalAlpha = alpha * 0.3;
                this.ctx.fill();
            }
        }
        this.ctx.globalAlpha = 1.0;
    }

    // --- 🌠 Meteors / Shooting Stars ---
    spawnMeteor() {
        const startX = Math.random() * this.width * 0.8 + this.width * 0.1;
        const startY = Math.random() * (this.height * 0.35);
        const length = Math.random() * 130 + 90;
        const speed = Math.random() * 8 + 12;
        const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2;

        this.meteors.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: length,
            life: 1.0,
            decay: Math.random() * 0.015 + 0.012
        });
    }

    updateAndDrawMeteors() {
        const now = performance.now();
        if (now - this.lastMeteorTime > 5000 + Math.random() * 3500) {
            this.spawnMeteor();
            this.lastMeteorTime = now;
        }

        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const m = this.meteors[i];
            m.x += m.vx;
            m.y += m.vy;
            m.life -= m.decay;

            if (m.life <= 0 || m.x > this.width + 100 || m.y > this.height + 100) {
                this.meteors.splice(i, 1);
                continue;
            }

            const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
            const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;

            const grad = this.ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.7, `rgba(255, 220, 240, ${0.45 * m.life})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${m.life})`);

            this.ctx.beginPath();
            this.ctx.moveTo(tailX, tailY);
            this.ctx.lineTo(m.x, m.y);
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 2.2;
            this.ctx.stroke();

            // Head sparkle
            this.ctx.beginPath();
            this.ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${m.life})`;
            this.ctx.fill();
        }
    }

    // --- 💡 Fireflies ---
    initFireflies(count) {
        this.fireflies = [];
        for (let i = 0; i < count; i++) {
            this.fireflies.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2.5 + 1.6,
                phase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.04 + 0.02,
                color: Math.random() > 0.5 ? '255, 230, 130' : '200, 255, 170'
            });
        }
    }

    updateAndDrawFireflies() {
        for (let f of this.fireflies) {
            f.phase += f.pulseSpeed;

            // Organic wander
            f.vx += (Math.random() - 0.5) * 0.08;
            f.vy += (Math.random() - 0.5) * 0.08;

            // Soft attraction toward cursor when nearby
            const dx = this.mouseX - f.x;
            const dy = this.mouseY - f.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 220 && dist > 20) {
                f.vx += (dx / dist) * 0.055;
                f.vy += (dy / dist) * 0.055;
            }

            const speed = Math.hypot(f.vx, f.vy);
            if (speed > 1.4) {
                f.vx = (f.vx / speed) * 1.4;
                f.vy = (f.vy / speed) * 1.4;
            }

            f.x += f.vx;
            f.y += f.vy;

            // Wrap edges
            if (f.x < -20) f.x = this.width + 20;
            if (f.x > this.width + 20) f.x = -20;
            if (f.y < -20) f.y = this.height + 20;
            if (f.y > this.height + 20) f.y = -20;

            const alpha = Math.max(0.08, (Math.sin(f.phase) + 1) * 0.45);

            // Glow ring
            const glowGrad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 5.5);
            glowGrad.addColorStop(0, `rgba(${f.color}, ${alpha * 0.85})`);
            glowGrad.addColorStop(0.4, `rgba(${f.color}, ${alpha * 0.35})`);
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.size * 5.5, 0, Math.PI * 2);
            this.ctx.fillStyle = glowGrad;
            this.ctx.fill();

            // Core
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.size * 0.85, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fill();
        }
    }

    // --- 🌸 3D Fluttering Falling Petals ---
    initPetals(count) {
        this.petals = [];
        for (let i = 0; i < count; i++) {
            this.petals.push(this.createPetal(true));
        }
    }

    createPetal(randomY = false) {
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : -30,
            size: Math.random() * 11 + 12,
            speedY: Math.random() * 1.2 + 0.8,
            speedX: Math.random() * 0.8 - 0.4,
            sway: Math.random() * 2.2 + 1,
            swaySpeed: Math.random() * 0.02 + 0.015,
            swayOffset: Math.random() * Math.PI * 2,
            rotZ: Math.random() * Math.PI * 2,
            rotZSpeed: (Math.random() - 0.5) * 0.03,
            rotY: Math.random() * Math.PI * 2,
            rotYSpeed: Math.random() * 0.04 + 0.02,
            colorHue: Math.random() > 0.4 ? (Math.random() * 15 + 340) : (Math.random() * 15 + 355),
            lightness: Math.random() * 25 + 50,
            opacity: Math.random() * 0.3 + 0.68
        };
    }

    updateAndDrawPetals() {
        for (let i = 0; i < this.petals.length; i++) {
            const p = this.petals[i];
            p.swayOffset += p.swaySpeed;
            p.rotZ += p.rotZSpeed;
            p.rotY += p.rotYSpeed;

            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.swayOffset) * p.sway;

            if (p.y > this.height + 40) {
                this.petals[i] = this.createPetal(false);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotZ);

            // 3D flipping simulation with cos(rotY)
            const flip = Math.cos(p.rotY);
            this.ctx.scale(flip, 1);

            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size * 0.8);
            this.ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.6, p.size * 0.8, p.size * 0.3, 0, p.size * 0.8);
            this.ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.3, -p.size * 0.7, -p.size * 0.6, 0, -p.size * 0.8);

            const sideLight = flip >= 0 ? p.lightness : p.lightness * 0.78;
            this.ctx.fillStyle = `hsla(${p.colorHue}, 85%, ${sideLight}%, ${p.opacity})`;
            this.ctx.shadowColor = `hsla(${p.colorHue}, 90%, 65%, 0.45)`;
            this.ctx.shadowBlur = 7;
            this.ctx.fill();

            // Center vein highlight
            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size * 0.6);
            this.ctx.quadraticCurveTo(p.size * 0.1, 0, 0, p.size * 0.6);
            this.ctx.strokeStyle = `hsla(${p.colorHue}, 90%, ${sideLight + 15}%, ${p.opacity * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    // --- 🎆 Masterclass Heart Fireworks with Kamuro Golden Willow Tails ---
    launchHeartFirework(targetX = null, targetY = null, customHue = null) {
        const tx = targetX !== null ? targetX : Math.random() * (this.width * 0.7) + this.width * 0.15;
        const ty = targetY !== null ? targetY : Math.random() * (this.height * 0.4) + this.height * 0.15;
        const sx = tx + (Math.random() - 0.5) * 80;
        const sy = this.height + 20;

        const hue = customHue !== null ? customHue : (Math.random() > 0.5 ? 340 + Math.random() * 30 : 40 + Math.random() * 20);

        this.fireworks.push({
            x: sx,
            y: sy,
            tx: tx,
            ty: ty,
            vx: (tx - sx) / 38,
            vy: (ty - sy) / 38,
            hue: hue,
            trail: [],
            trailLength: 6
        });
    }

    explodeHeart(x, y, hue) {
        if (window.soundEngine) {
            window.soundEngine.playFireworkBoom();
        }

        // 1. Heart perimeter particles
        const particleCount = 88;
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const speedMultiplier = 0.28 + Math.random() * 0.08;
            const pSpeed = Math.random() * 0.5 + 0.8;

            this.fireworkParticles.push({
                x: x,
                y: y,
                vx: hx * speedMultiplier * pSpeed + (Math.random() - 0.5) * 0.5,
                vy: hy * speedMultiplier * pSpeed + (Math.random() - 0.5) * 0.5,
                friction: 0.965,
                gravity: 0.05,
                hue: hue + (Math.random() - 0.5) * 20,
                alpha: 1.0,
                decay: Math.random() * 0.014 + 0.012,
                size: Math.random() * 2.5 + 2.0,
                sparkle: Math.random() > 0.5
            });
        }

        // 2. Kamuro Golden Willow Sparklers (lingering golden rain)
        for (let k = 0; k < 36; k++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 2.5 + 0.5;
            this.fireworkParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd * 0.8 - 0.4,
                friction: 0.98,
                gravity: 0.03, // Gently falls down like golden weeping willow
                hue: 45, // Warm gold
                alpha: 1.0,
                decay: Math.random() * 0.009 + 0.008, // Longer linger
                size: Math.random() * 2.0 + 1.5,
                sparkle: true
            });
        }

        // 3. Inner glowing flash core
        for (let j = 0; j < 25; j++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 3.5;
            this.fireworkParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                friction: 0.94,
                gravity: 0.08,
                hue: 50,
                alpha: 1.0,
                decay: 0.03,
                size: 2.8,
                sparkle: true
            });
        }
    }

    updateAndDrawFireworks() {
        // Handle rockets ascending
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const f = this.fireworks[i];
            f.trail.unshift({ x: f.x, y: f.y });
            if (f.trail.length > f.trailLength) f.trail.pop();

            f.x += f.vx;
            f.y += f.vy;

            this.ctx.beginPath();
            for (let j = 0; j < f.trail.length; j++) {
                const pt = f.trail[j];
                const alpha = 1.0 - j / f.trail.length;
                this.ctx.lineTo(pt.x, pt.y);
                this.ctx.strokeStyle = `hsla(${f.hue}, 100%, 75%, ${alpha})`;
                this.ctx.lineWidth = 2.5;
            }
            this.ctx.stroke();

            if (f.y <= f.ty) {
                this.explodeHeart(f.tx, f.ty, f.hue);
                this.fireworks.splice(i, 1);
            }
        }

        // Handle exploding heart particles
        for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
            const p = this.fireworkParticles[i];
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.fireworkParticles.splice(i, 1);
                continue;
            }

            const currentAlpha = p.sparkle && Math.random() > 0.4 ? p.alpha * 0.4 : p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${currentAlpha})`;
            this.ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, ${currentAlpha})`;
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;

        if (this.autoFireworksEnabled) {
            const now = performance.now();
            if (now - this.lastAutoFireworkTime > 1800 + Math.random() * 1400) {
                this.launchHeartFirework();
                this.lastAutoFireworkTime = now;
            }
        }
    }

    // --- 🏮 Traditional Sky Lanterns (Thả Đèn Trời) ---
    releaseSkyLantern(wishText = "20/10 Rực Rỡ ✨") {
        const x = Math.random() * (this.width * 0.7) + this.width * 0.15;
        this.lanterns.push({
            x: x,
            y: this.height + 40,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(Math.random() * 0.9 + 1.2),
            swayOffset: Math.random() * Math.PI * 2,
            swaySpeed: 0.02,
            scale: 1.0,
            wish: wishText,
            flicker: 0,
            opacity: 1.0
        });

        if (window.soundEngine) {
            window.soundEngine.playSparkle();
        }
    }

    updateAndDrawLanterns() {
        for (let i = this.lanterns.length - 1; i >= 0; i--) {
            const L = this.lanterns[i];
            L.swayOffset += L.swaySpeed;
            L.x += L.vx + Math.sin(L.swayOffset) * 0.4;
            L.y += L.vy;
            L.scale = Math.max(0.25, L.scale - 0.0006);

            L.flicker += 0.15;
            const flickerAlpha = 0.85 + Math.sin(L.flicker) * 0.15;

            if (L.y < -100 || L.scale <= 0.25) {
                this.lanterns.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(L.x, L.y);
            this.ctx.scale(L.scale, L.scale);

            // Warm halo glow
            const glow = this.ctx.createRadialGradient(0, 0, 5, 0, 0, 48);
            glow.addColorStop(0, `rgba(255, 195, 65, ${0.75 * flickerAlpha})`);
            glow.addColorStop(0.5, `rgba(255, 125, 35, ${0.35 * flickerAlpha})`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 48, 0, Math.PI * 2);
            this.ctx.fillStyle = glow;
            this.ctx.fill();

            // Lantern Paper Body (curved cylinder/taper)
            this.ctx.beginPath();
            this.ctx.moveTo(-16, -22);
            this.ctx.quadraticCurveTo(-20, 0, -14, 20);
            this.ctx.lineTo(14, 20);
            this.ctx.quadraticCurveTo(20, 0, 16, -22);
            this.ctx.closePath();

            const lanternGrad = this.ctx.createLinearGradient(0, -22, 0, 20);
            lanternGrad.addColorStop(0, '#ffe8a3');
            lanternGrad.addColorStop(0.6, '#ffaa44');
            lanternGrad.addColorStop(1, '#ff6622');
            this.ctx.fillStyle = lanternGrad;
            this.ctx.shadowColor = '#ffbb44';
            this.ctx.shadowBlur = 16;
            this.ctx.fill();

            // Internal flame hotspot
            this.ctx.beginPath();
            this.ctx.arc(0, 10, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 230, ${flickerAlpha})`;
            this.ctx.fill();

            // Wish text floating softly above lantern
            if (L.scale > 0.65 && L.wish) {
                this.ctx.font = '500 12px Montserrat, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = `rgba(255, 245, 220, ${L.scale})`;
                this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
                this.ctx.shadowBlur = 4;
                this.ctx.fillText(L.wish, 0, -28);
            }

            this.ctx.restore();
        }
    }

    // --- ✨ Cursor Fairy Dust Particles ---
    spawnCursorSparkles(x, y) {
        for (let i = 0; i < 2; i++) {
            this.cursorParticles.push({
                x: x + (Math.random() - 0.5) * 15,
                y: y + (Math.random() - 0.5) * 15,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 0.5,
                size: Math.random() * 2.5 + 1.2,
                alpha: 1.0,
                decay: Math.random() * 0.04 + 0.03,
                color: Math.random() > 0.5 ? '#ffe082' : '#ff80ab'
            });
        }
    }

    updateAndDrawCursorSparkles() {
        for (let i = this.cursorParticles.length - 1; i >= 0; i--) {
            const p = this.cursorParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.cursorParticles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 6;
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 0;
    }

    // --- Main Render Loop ---
    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.updateAndDrawNebula();
        this.updateAndDrawStars();
        this.updateAndDrawMeteors();
        this.updateAndDrawLanterns();
        this.updateAndDrawFireflies();
        this.updateAndDrawFireworks();
        this.updateAndDrawPetals();
        this.updateAndDrawCursorSparkles();

        requestAnimationFrame(this.loop);
    }
}
