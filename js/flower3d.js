/**
 * 🌹 Three.js Enchanted 3D Velvet Blooming Rose Engine
 * High-fidelity organic procedural petals, dewdrops, dynamic themes, and 360° orbit
 */

class Flower3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.roseGroup = null;

        this.allPetals = [];
        this.allMaterials = [];
        this.dewdrops = [];
        this.dustPoints = null;

        // Current color theme
        this.currentTheme = 'crimson';
        this.themes = {
            crimson: {
                name: 'Ruby Velvet (Đỏ Nhung)',
                baseHue: 0.98,
                sat: 0.90,
                light: 0.38,
                sheenHue: 0.97,
                sheenLight: 0.62,
                rimColor: 0xffaacc,
                keyColor: 0xfff0e4,
                dustColor: 0xffd5e0
            },
            sakura: {
                name: 'Pastel Sakura (Hồng Phấn)',
                baseHue: 0.93,
                sat: 0.75,
                light: 0.58,
                sheenHue: 0.94,
                sheenLight: 0.78,
                rimColor: 0xffd9ec,
                keyColor: 0xfff5f8,
                dustColor: 0xffe6f2
            },
            violet: {
                name: 'Mystic Violet (Tím Dạ Yến)',
                baseHue: 0.78,
                sat: 0.85,
                light: 0.42,
                sheenHue: 0.80,
                sheenLight: 0.70,
                rimColor: 0xd8b4fe,
                keyColor: 0xf5f0ff,
                dustColor: 0xe9d5ff
            },
            gold: {
                name: 'Golden Aurora (Hoàng Kim)',
                baseHue: 0.11,
                sat: 0.95,
                light: 0.46,
                sheenHue: 0.13,
                sheenLight: 0.72,
                rimColor: 0xffe082,
                keyColor: 0xfff8e1,
                dustColor: 0xfff3b0
            },
            crystal: {
                name: 'Frozen Crystal (Pha Lê Băng)',
                baseHue: 0.52,
                sat: 0.80,
                light: 0.50,
                sheenHue: 0.55,
                sheenLight: 0.82,
                rimColor: 0xa7f3d0,
                keyColor: 0xecfeff,
                dustColor: 0xcffafe
            }
        };

        // Blooming progress: 0 (tight bud) -> 1 (full bloom)
        this.bloomProgress = 0.0;
        this.targetBloom = 0.0;
        this.isBlooming = false;

        // Orbit navigation state
        this.isPointerDown = false;
        this.pointerStartX = 0;
        this.pointerStartY = 0;
        this.targetRotationY = 0;
        this.targetRotationX = 0.15;
        this.currentRotationY = 0;
        this.currentRotationX = 0.15;
        this.zoomDistance = 3.6;
        this.targetZoom = 3.6;

        this.init();
    }

    init() {
        if (!window.THREE) {
            console.error('Three.js not loaded!');
            return;
        }

        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
        this.camera.position.set(0, 1.3, this.zoomDistance);
        this.camera.lookAt(0, 0.35, 0);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // Studio Environment & Lighting
        this.setupLighting();
        this.generateStudioReflection();

        // Build 3D Rose
        this.buildRose();

        // Glowing dust motes
        this.createAtmosphericDust();

        // Event listeners
        this.bindEvents();

        // Render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLighting() {
        // Soft ambient light
        this.ambientLight = new THREE.AmbientLight(0xfff5f0, 0.55);
        this.scene.add(this.ambientLight);

        // Key light (Warm golden sunlight / spotlight)
        this.keyLight = new THREE.DirectionalLight(0xfff0e4, 2.4);
        this.keyLight.position.set(3.5, 5.5, 3.5);
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.width = 2048;
        this.keyLight.shadow.mapSize.height = 2048;
        this.keyLight.shadow.bias = -0.0001;
        this.scene.add(this.keyLight);

        // Fill light (Gentle rose-tinted soft fill)
        this.fillLight = new THREE.DirectionalLight(0xfce7f3, 1.2);
        this.fillLight.position.set(-3.5, 3.0, 2.5);
        this.scene.add(this.fillLight);

        // Rim backlight (Velvet petal edge halo glow)
        this.rimLight = new THREE.DirectionalLight(0xffaacc, 1.8);
        this.rimLight.position.set(0, 4.0, -4.5);
        this.scene.add(this.rimLight);
    }

    generateStudioReflection() {
        // Procedural soft gradient canvas for luxury HDR reflections
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#1a1020');
        grad.addColorStop(0.5, '#0d0812');
        grad.addColorStop(1, '#050208');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 256);

        // Soft spotlight reflections
        const rad1 = ctx.createRadialGradient(150, 80, 5, 150, 80, 120);
        rad1.addColorStop(0, 'rgba(255, 230, 240, 0.9)');
        rad1.addColorStop(1, 'transparent');
        ctx.fillStyle = rad1;
        ctx.fillRect(0, 0, 300, 200);

        const rad2 = ctx.createRadialGradient(380, 90, 5, 380, 90, 110);
        rad2.addColorStop(0, 'rgba(255, 240, 200, 0.8)');
        rad2.addColorStop(1, 'transparent');
        ctx.fillStyle = rad2;
        ctx.fillRect(250, 0, 262, 200);

        const tex = new THREE.CanvasTexture(canvas);
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmrem.fromEquirectangular(tex).texture;
        tex.dispose();
        pmrem.dispose();
    }

    // --- 🌹 Procedural Curved Petal Geometry ---
    createCurvedPetalGeometry(width, length, options = {}) {
        const {
            uSegments = 24,
            vSegments = 32,
            curl = 0.32,
            cup = 0.22,
            flare = 0.12,
            ruffle = 0.025
        } = options;

        const geom = new THREE.PlaneGeometry(width, length, uSegments, vSegments);
        const pos = geom.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i);
            let y = pos.getY(i) + length * 0.5; // Pivot at petal base
            pos.setY(i, y);

            const v = Math.max(0, Math.min(1, y / length));
            const u = x / (width * 0.5);

            // Natural petal outline curve (slender base, wide middle, tapered tip)
            const widthScale = Math.sin(Math.pow(v, 0.72) * Math.PI);
            pos.setX(i, x * Math.max(0.06, widthScale));

            // Dual-axis 3D cupping and petal curling
            const cupOffset = (1 - u * u) * Math.sin(v * Math.PI * 0.85) * cup;
            const curlOffset = Math.pow(v, 1.6) * curl - Math.sin(v * Math.PI) * flare;
            const edgeDist = Math.abs(u);
            const edgeRuffle = edgeDist > 0.5 ? Math.sin(v * 24.0 + edgeDist * 6.0) * ruffle * (edgeDist - 0.5) : 0;

            pos.setZ(i, cupOffset - curlOffset + edgeRuffle);
        }

        pos.needsUpdate = true;
        geom.computeVertexNormals();
        return geom;
    }

    // Material with physical velvet sheen, subsurface transmission & clearcoat
    createPetalMaterial(brightness = 1.0, hueOffset = 0) {
        const theme = this.themes[this.currentTheme];
        const baseColor = new THREE.Color().setHSL(
            (theme.baseHue + hueOffset + 1) % 1,
            theme.sat,
            theme.light * brightness
        );
        const sheenColor = new THREE.Color().setHSL(
            (theme.sheenHue + hueOffset + 1) % 1,
            Math.min(1.0, theme.sat + 0.1),
            theme.sheenLight * brightness
        );

        const mat = new THREE.MeshPhysicalMaterial({
            color: baseColor,
            roughness: 0.38,
            metalness: 0.02,
            transmission: 0.14,
            sheen: sheenColor,
            clearcoat: 0.18,
            clearcoatRoughness: 0.22,
            side: THREE.DoubleSide
        });

        this.allMaterials.push({ mat, brightness, hueOffset });
        return mat;
    }

    createDewdrop(radius = 0.035) {
        const geom = new THREE.SphereGeometry(radius, 14, 14);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.05,
            metalness: 0,
            transmission: 0.95,
            ior: 1.333,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.scale.set(1, 0.55, 1);
        this.dewdrops.push(mesh);
        return mesh;
    }

    buildRose() {
        this.roseGroup = new THREE.Group();
        this.roseGroup.position.set(0, -0.15, 0);
        this.scene.add(this.roseGroup);

        this.allPetals = [];

        // --- Tier 1: Inner Spiraling Bud Core (10 petals) ---
        const coreCount = 10;
        for (let i = 0; i < coreCount; i++) {
            const geom = this.createCurvedPetalGeometry(0.32, 0.65, {
                curl: 0.42,
                cup: 0.36,
                flare: 0.06,
                ruffle: 0.015,
                uSegments: 20,
                vSegments: 28
            });
            const mat = this.createPetalMaterial(0.82 + (i / coreCount) * 0.18, -0.01);
            const petal = new THREE.Mesh(geom, mat);

            const angle = i * 2.39996; // Golden ratio spiral
            const radius = 0.03 + (i / coreCount) * 0.08;
            petal.position.set(
                Math.cos(angle) * radius,
                0.55 + (i / coreCount) * 0.05,
                Math.sin(angle) * radius
            );
            petal.rotation.y = -angle + Math.PI / 2;
            petal.castShadow = true;

            const budRotZ = -0.08;
            const bloomRotZ = -0.22 - (i / coreCount) * 0.15;
            petal.rotation.z = budRotZ;

            this.roseGroup.add(petal);
            this.allPetals.push({
                mesh: petal,
                budRotZ: budRotZ,
                bloomRotZ: bloomRotZ,
                budScale: 0.85,
                bloomScale: 1.0,
                phase: i * 0.35,
                speed: 1.3
            });
        }

        // --- Tier 2: Middle Unfurling Petals (14 petals) ---
        const midCount = 14;
        for (let i = 0; i < midCount; i++) {
            const geom = this.createCurvedPetalGeometry(0.55, 0.95, {
                curl: 0.28,
                cup: 0.25,
                flare: 0.22,
                ruffle: 0.02,
                uSegments: 24,
                vSegments: 32
            });
            const mat = this.createPetalMaterial(0.92 + (i / midCount) * 0.15, 0);
            const petal = new THREE.Mesh(geom, mat);

            const angle = i * (Math.PI * 2 / midCount) + (i % 2) * 0.25;
            const radius = 0.14 + (i / midCount) * 0.14;
            petal.position.set(
                Math.cos(angle) * radius,
                0.50 - (i / midCount) * 0.04,
                Math.sin(angle) * radius
            );
            petal.rotation.y = -angle + Math.PI / 2;
            petal.castShadow = true;

            const budRotZ = -0.15;
            const bloomRotZ = -0.48 - (i / midCount) * 0.22;
            petal.rotation.z = budRotZ;

            this.roseGroup.add(petal);
            this.allPetals.push({
                mesh: petal,
                budRotZ: budRotZ,
                bloomRotZ: bloomRotZ,
                budScale: 0.75,
                bloomScale: 1.0,
                phase: i * 0.4 + 2,
                speed: 1.0
            });
        }

        // --- Tier 3: Grand Outer Blooming Petals with Dewdrops (16 petals) ---
        const outerCount = 16;
        for (let i = 0; i < outerCount; i++) {
            const geom = this.createCurvedPetalGeometry(0.72, 1.25, {
                curl: 0.18,
                cup: 0.18,
                flare: 0.38,
                ruffle: 0.035,
                uSegments: 28,
                vSegments: 36
            });
            const mat = this.createPetalMaterial(1.02 + (i % 3) * 0.06, 0.01);
            const petal = new THREE.Mesh(geom, mat);

            const angle = i * (Math.PI * 2 / outerCount) + 0.2;
            const radius = 0.26 + (i / outerCount) * 0.18;
            petal.position.set(
                Math.cos(angle) * radius,
                0.42 - (i / outerCount) * 0.08,
                Math.sin(angle) * radius
            );
            petal.rotation.y = -angle + Math.PI / 2;
            petal.castShadow = true;
            petal.receiveShadow = true;

            const budRotZ = -0.22;
            const bloomRotZ = -0.80 - (i / outerCount) * 0.25;
            petal.rotation.z = budRotZ;

            // Dewdrops on alternate outer petals
            if (i % 2 === 0) {
                const drop = this.createDewdrop(0.025 + Math.random() * 0.018);
                drop.position.set(
                    (Math.random() - 0.5) * 0.22,
                    0.45 + Math.random() * 0.35,
                    0.07
                );
                petal.add(drop);
            }

            this.roseGroup.add(petal);
            this.allPetals.push({
                mesh: petal,
                budRotZ: budRotZ,
                bloomRotZ: bloomRotZ,
                budScale: 0.65,
                bloomScale: 1.0,
                phase: i * 0.45 + 4,
                speed: 0.8
            });
        }

        // --- Calyx & Sepals (Green base) ---
        const calyxMat = new THREE.MeshPhysicalMaterial({
            color: 0x1f471f,
            roughness: 0.45,
            clearcoat: 0.2,
            side: THREE.DoubleSide
        });
        for (let i = 0; i < 5; i++) {
            const sepalGeom = this.createCurvedPetalGeometry(0.18, 0.65, {
                curl: 0.48,
                cup: 0.1,
                flare: 0.32,
                ruffle: 0.01
            });
            const sepal = new THREE.Mesh(sepalGeom, calyxMat);
            const angle = (i / 5) * Math.PI * 2;
            sepal.position.set(Math.cos(angle) * 0.12, 0.42, Math.sin(angle) * 0.12);
            sepal.rotation.y = -angle + Math.PI / 2;
            sepal.rotation.z = -1.25;
            this.roseGroup.add(sepal);
        }

        // --- Stem (Curved CatmullRom tube) ---
        const stemCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.42, 0),
            new THREE.Vector3(0.025, 0.15, 0.015),
            new THREE.Vector3(-0.02, -0.2, -0.01),
            new THREE.Vector3(0.01, -0.55, 0.005),
            new THREE.Vector3(0, -0.85, 0)
        ]);
        const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.038, 16, false);
        const stemMat = new THREE.MeshPhysicalMaterial({
            color: 0x255225,
            roughness: 0.42,
            clearcoat: 0.25,
            clearcoatRoughness: 0.2
        });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.castShadow = true;
        this.roseGroup.add(stem);

        // --- Leaves ---
        this.createLeaves(stemMat);

        // --- Reflected Dark Pedestal Ring ---
        const pedestalGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.06, 64);
        const pedestalMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a10,
            roughness: 0.15,
            metalness: 0.8
        });
        const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
        pedestal.position.y = -0.88;
        pedestal.receiveShadow = true;
        this.scene.add(pedestal);

        // Contact glow ring
        const ringGeom = new THREE.RingGeometry(1.58, 1.62, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xffaacc,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -0.85;
        this.scene.add(ring);
        this.pedestalRing = ring;
    }

    createLeaves(stemMat) {
        const createLeafGeom = () => {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.bezierCurveTo(0.15, 0.12, 0.26, 0.32, 0.14, 0.55);
            shape.bezierCurveTo(0.05, 0.68, 0.02, 0.72, 0, 0.75);
            shape.bezierCurveTo(-0.02, 0.72, -0.05, 0.68, -0.14, 0.55);
            shape.bezierCurveTo(-0.26, 0.32, -0.15, 0.12, 0, 0);

            const geom = new THREE.ShapeGeometry(shape, 20);
            const pos = geom.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const y = pos.getY(i);
                const arch = Math.sin((y / 0.75) * Math.PI) * 0.06;
                pos.setZ(i, -arch);
            }
            pos.needsUpdate = true;
            geom.computeVertexNormals();
            return geom;
        };

        const leafMat = new THREE.MeshPhysicalMaterial({
            color: 0x225522,
            roughness: 0.35,
            clearcoat: 0.3,
            clearcoatRoughness: 0.2,
            side: THREE.DoubleSide
        });

        [-0.08, -0.42].forEach((y, i) => {
            const leaf1 = new THREE.Mesh(createLeafGeom(), leafMat);
            leaf1.position.set(0.03, y, 0.02);
            leaf1.rotation.set(-0.35, 0.9 + i * 0.6, 0.3);
            leaf1.scale.setScalar(0.75 - i * 0.1);
            leaf1.castShadow = true;
            this.roseGroup.add(leaf1);

            const leaf2 = new THREE.Mesh(createLeafGeom(), leafMat);
            leaf2.position.set(-0.025, y - 0.08, -0.02);
            leaf2.rotation.set(-0.2, -0.8 - i * 0.5, -0.25);
            leaf2.scale.setScalar(0.68 - i * 0.1);
            leaf2.castShadow = true;
            this.roseGroup.add(leaf2);
        });
    }

    createAtmosphericDust() {
        const count = 120;
        const geom = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        const phase = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 4.5;
            pos[i * 3 + 1] = Math.random() * 3.5 - 0.8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4.5;

            vel[i * 3] = (Math.random() - 0.5) * 0.004;
            vel[i * 3 + 1] = Math.random() * 0.005 + 0.002;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;

            phase[i] = Math.random() * Math.PI * 2;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.035,
            color: this.themes[this.currentTheme].dustColor,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.dustPoints = new THREE.Points(geom, mat);
        this.dustVel = vel;
        this.dustPhase = phase;
        this.scene.add(this.dustPoints);
    }

    // --- 🎨 Switch Theme Palette Smoothly ---
    setTheme(themeKey) {
        if (!this.themes[themeKey]) return;
        this.currentTheme = themeKey;
        const theme = this.themes[themeKey];

        // Update lighting colors
        if (this.rimLight) this.rimLight.color.setHex(theme.rimColor);
        if (this.keyLight) this.keyLight.color.setHex(theme.keyColor);
        if (this.pedestalRing) this.pedestalRing.material.color.setHex(theme.rimColor);
        if (this.dustPoints) this.dustPoints.material.color.setHex(theme.dustColor);

        // Update petal materials
        this.allMaterials.forEach(({ mat, brightness, hueOffset }) => {
            mat.color.setHSL(
                (theme.baseHue + hueOffset + 1) % 1,
                theme.sat,
                theme.light * brightness
            );
            mat.sheen.setHSL(
                (theme.sheenHue + hueOffset + 1) % 1,
                Math.min(1.0, theme.sat + 0.1),
                theme.sheenLight * brightness
            );
            mat.needsUpdate = true;
        });

        if (window.soundEngine) {
            window.soundEngine.playSparkle();
        }
    }

    // --- 🌸 Trigger Bloom Unfurling ---
    startBloomAnimation() {
        this.targetBloom = 1.0;
        this.isBlooming = true;

        if (window.confetti) {
            setTimeout(() => {
                window.confetti({
                    particleCount: 60,
                    spread: 80,
                    origin: { y: 0.65 },
                    colors: ['#ff8da1', '#ffccd5', '#ffd700', '#fff']
                });
            }, 1200);
        }
    }

    resetToBud() {
        this.targetBloom = 0.0;
    }

    bindEvents() {
        const dom = this.renderer.domElement;

        const onStart = (clientX, clientY) => {
            this.isPointerDown = true;
            this.pointerStartX = clientX;
            this.pointerStartY = clientY;
        };

        const onMove = (clientX, clientY) => {
            if (!this.isPointerDown) return;
            const deltaX = clientX - this.pointerStartX;
            const deltaY = clientY - this.pointerStartY;
            this.pointerStartX = clientX;
            this.pointerStartY = clientY;

            this.targetRotationY += deltaX * 0.007;
            this.targetRotationX += deltaY * 0.005;
            this.targetRotationX = Math.max(-0.25, Math.min(0.65, this.targetRotationX));
        };

        const onEnd = () => {
            this.isPointerDown = false;
        };

        dom.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onEnd);

        dom.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                onStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', onEnd);

        // Zoom with wheel
        dom.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.targetZoom += e.deltaY * 0.002;
            this.targetZoom = Math.max(2.2, Math.min(5.5, this.targetZoom));
        }, { passive: false });

        // Click on rose to emit sparkles & chime
        dom.addEventListener('click', (e) => {
            if (window.soundEngine) {
                window.soundEngine.playSparkle();
            }
            if (window.particleEngine) {
                window.particleEngine.spawnCursorSparkles(e.clientX, e.clientY);
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            const w = this.container.clientWidth || window.innerWidth;
            const h = this.container.clientHeight || window.innerHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    animate() {
        requestAnimationFrame(this.animate);

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // Smooth bloom interpolation
        if (Math.abs(this.targetBloom - this.bloomProgress) > 0.001) {
            this.bloomProgress += (this.targetBloom - this.bloomProgress) * 0.04;
        }

        // Petals unfurling & gentle natural breathing
        this.allPetals.forEach(p => {
            const breathe = Math.sin(elapsed * p.speed + p.phase) * 0.015;
            const currentRotZ = p.budRotZ + (p.bloomRotZ - p.budRotZ) * this.bloomProgress;
            p.mesh.rotation.z = currentRotZ + breathe;

            const currentScale = p.budScale + (p.bloomScale - p.budScale) * this.bloomProgress;
            p.mesh.scale.setScalar(currentScale);
        });

        // Smooth orbit damping
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;
        this.zoomDistance += (this.targetZoom - this.zoomDistance) * 0.08;

        // Auto-rotation when not interacting
        if (!this.isPointerDown) {
            this.targetRotationY += 0.002;
        }

        // Apply camera framing
        const cosX = Math.cos(this.currentRotationX);
        const sinX = Math.sin(this.currentRotationX);
        const sinY = Math.sin(this.currentRotationY);
        const cosY = Math.cos(this.currentRotationY);

        this.camera.position.x = sinY * cosX * this.zoomDistance;
        this.camera.position.y = 0.45 + sinX * this.zoomDistance;
        this.camera.position.z = cosY * cosX * this.zoomDistance;
        this.camera.lookAt(0, 0.40, 0);

        // Update atmospheric dust motes
        if (this.dustPoints) {
            const p = this.dustPoints.geometry.attributes.position.array;
            for (let i = 0; i < p.length / 3; i++) {
                p[i * 3] += this.dustVel[i * 3] + Math.sin(elapsed * 0.6 + this.dustPhase[i]) * 0.0015;
                p[i * 3 + 1] += this.dustVel[i * 3 + 1];
                p[i * 3 + 2] += this.dustVel[i * 3 + 2] + Math.cos(elapsed * 0.6 + this.dustPhase[i]) * 0.0015;

                if (p[i * 3 + 1] > 2.5) {
                    p[i * 3 + 1] = -0.7;
                    p[i * 3] = (Math.random() - 0.5) * 4.5;
                    p[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
                }
            }
            this.dustPoints.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
