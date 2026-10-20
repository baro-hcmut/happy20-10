/**
 * 🌹 Three.js Enchanted 3D Velvet Blooming Rose Engine - God-Tier Edition
 * Features:
 * 1. Single Rose & Royal Bouquet Mode (7 Blooming Roses in 3D harmony!)
 * 2. Cinematic Camera Fly-Through / Director Mode with Hollywood Bezier dolly path
 * 3. Raycaster Direct 3D Touch (touch individual petals to trigger harmonic chords & 3D petal swirls)
 * 4. Procedural Velvet Petal Textures with micro-veins & subsurface scattering simulation
 * 5. Optical dewdrops, golden stamen cluster, stem thorns, and obsidian mirror reflections
 */

class Flower3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.roseGroup = null;
        this.bouquetGroup = null;
        this.currentArrangement = 'single'; // 'single' or 'bouquet'

        this.allPetals = [];
        this.allMaterials = [];
        this.dewdrops = [];
        this.dustPoints = null;
        this.petalTexture = null;
        this.stamenGroup = null;
        this.haloMesh = null;
        this.rippleRings = [];

        // Raycasting & 3D Interactive Touch
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.interactivePetalMeshes = [];
        this.floatingPetalParticles = [];

        // Cinematic Fly-Through Mode
        this.isCinematicMode = false;
        this.cinematicTime = 0;
        this.cinematicShots = [
            { name: "Dewdrop Macro", targetY: 0.52, dist: 1.85, rotX: 0.10, rotYSpd: 0.25, duration: 7 },
            { name: "Stem Drama", targetY: 0.20, dist: 2.20, rotX: -0.18, rotYSpd: 0.35, duration: 7 },
            { name: "Fibonacci Core", targetY: 0.45, dist: 1.90, rotX: 0.65, rotYSpd: 0.30, duration: 7 },
            { name: "Cosmic Panorama", targetY: 0.40, dist: 3.80, rotX: 0.15, rotYSpd: 0.20, duration: 9 }
        ];
        this.currentShotIndex = 0;
        this.shotProgress = 0;

        // Color Theme Palettes
        this.currentTheme = 'crimson';
        this.themes = {
            crimson: {
                name: 'Ruby Velvet (Đỏ Nhung Hoàng Gia)',
                baseHue: 0.98,
                sat: 0.92,
                light: 0.36,
                sheenHue: 0.97,
                sheenLight: 0.62,
                rimColor: 0xff88aa,
                keyColor: 0xfff0e4,
                dustColor: 0xffd5e0,
                haloColor: 0xff2a55
            },
            sakura: {
                name: 'Pastel Sakura (Hồng Phấn Ngọt Ngào)',
                baseHue: 0.93,
                sat: 0.78,
                light: 0.58,
                sheenHue: 0.94,
                sheenLight: 0.82,
                rimColor: 0xffc2d4,
                keyColor: 0xfff5f8,
                dustColor: 0xffe6f2,
                haloColor: 0xff8da1
            },
            violet: {
                name: 'Mystic Violet (Tím Dạ Yến)',
                baseHue: 0.78,
                sat: 0.88,
                light: 0.40,
                sheenHue: 0.80,
                sheenLight: 0.72,
                rimColor: 0xc084fc,
                keyColor: 0xf5f0ff,
                dustColor: 0xe9d5ff,
                haloColor: 0x9333ea
            },
            gold: {
                name: 'Golden Aurora (Hoàng Kim Ánh Dương)',
                baseHue: 0.11,
                sat: 0.96,
                light: 0.46,
                sheenHue: 0.13,
                sheenLight: 0.75,
                rimColor: 0xfde047,
                keyColor: 0xfff8e1,
                dustColor: 0xfff3b0,
                haloColor: 0xeab308
            },
            crystal: {
                name: 'Frozen Crystal (Pha Lê Băng Ngọc)',
                baseHue: 0.52,
                sat: 0.82,
                light: 0.48,
                sheenHue: 0.55,
                sheenLight: 0.85,
                rimColor: 0x67e8f9,
                keyColor: 0xecfeff,
                dustColor: 0xcffafe,
                haloColor: 0x06b6d4
            }
        };

        // Blooming animation state
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
        this.camera.lookAt(0, 0.38, 0);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true // Crucial for instant Polaroid photo snapshots!
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // Generate Procedural Textures & Environment
        this.generatePetalTextureMap();
        this.setupLighting();
        this.generateStudioReflection();

        // Build 3D Single Rose & Bouquet
        this.buildRose();
        this.buildBouquet();

        this.createAtmosphericDust();
        this.createCelestialHalo();

        // Event listeners
        this.bindEvents();

        // Render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    generatePetalTextureMap() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(size / 2, size, size / 2, 0);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        grad.addColorStop(0.3, 'rgba(30, 0, 10, 0.2)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Micro-veins
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1.2;
        const veinCount = 45;
        for (let i = 0; i < veinCount; i++) {
            const spread = (i / veinCount - 0.5) * (size * 0.85);
            ctx.beginPath();
            ctx.moveTo(size / 2, size * 0.95);
            ctx.bezierCurveTo(
                size / 2 + spread * 0.4, size * 0.65,
                size / 2 + spread * 0.8, size * 0.35,
                size / 2 + spread, size * 0.05
            );
            ctx.stroke();
        }

        const edgeGrad = ctx.createRadialGradient(size / 2, 0, size * 0.1, size / 2, 0, size * 0.5);
        edgeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, 0, size, size * 0.6);

        this.petalTexture = new THREE.CanvasTexture(canvas);
        this.petalTexture.wrapS = THREE.ClampToEdgeWrapping;
        this.petalTexture.wrapT = THREE.ClampToEdgeWrapping;
    }

    setupLighting() {
        this.ambientLight = new THREE.AmbientLight(0xfff5f0, 0.65);
        this.scene.add(this.ambientLight);

        this.keyLight = new THREE.DirectionalLight(0xfff0e4, 2.5);
        this.keyLight.position.set(3.5, 6.0, 3.5);
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.width = 2048;
        this.keyLight.shadow.mapSize.height = 2048;
        this.keyLight.shadow.bias = -0.0001;
        this.scene.add(this.keyLight);

        this.fillLight = new THREE.DirectionalLight(0xfce7f3, 1.3);
        this.fillLight.position.set(-3.5, 3.5, 2.5);
        this.scene.add(this.fillLight);

        this.rimLight = new THREE.DirectionalLight(0xffaacc, 2.0);
        this.rimLight.position.set(0, 4.5, -4.5);
        this.scene.add(this.rimLight);

        this.coreLight = new THREE.PointLight(0xff4d79, 1.5, 3.5);
        this.coreLight.position.set(0, 0.65, 0);
        this.scene.add(this.coreLight);
    }

    generateStudioReflection() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#1c1024');
        grad.addColorStop(0.5, '#0e0915');
        grad.addColorStop(1, '#050308');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 256);

        const rad1 = ctx.createRadialGradient(160, 80, 5, 160, 80, 130);
        rad1.addColorStop(0, 'rgba(255, 235, 245, 0.9)');
        rad1.addColorStop(1, 'transparent');
        ctx.fillStyle = rad1;
        ctx.fillRect(0, 0, 320, 200);

        const rad2 = ctx.createRadialGradient(380, 90, 5, 380, 90, 120);
        rad2.addColorStop(0, 'rgba(255, 245, 210, 0.85)');
        rad2.addColorStop(1, 'transparent');
        ctx.fillStyle = rad2;
        ctx.fillRect(250, 0, 262, 200);

        const tex = new THREE.CanvasTexture(canvas);
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmrem.fromEquirectangular(tex).texture;
        tex.dispose();
        pmrem.dispose();
    }

    createCurvedPetalGeometry(width, length, options = {}) {
        const {
            uSegments = 24,
            vSegments = 32,
            curl = 0.32,
            cup = 0.22,
            flare = 0.12,
            ruffle = 0.025,
            edgeRoll = 0.04
        } = options;

        const geom = new THREE.PlaneGeometry(width, length, uSegments, vSegments);
        const pos = geom.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i);
            let y = pos.getY(i) + length * 0.5;
            pos.setY(i, y);

            const v = Math.max(0, Math.min(1, y / length));
            const u = x / (width * 0.5);

            const widthScale = Math.sin(Math.pow(v, 0.72) * Math.PI);
            pos.setX(i, x * Math.max(0.06, widthScale));

            const cupOffset = (1 - u * u) * Math.sin(v * Math.PI * 0.85) * cup;
            const curlOffset = Math.pow(v, 1.6) * curl - Math.sin(v * Math.PI) * flare;
            const edgeDist = Math.abs(u);
            const edgeRuffle = edgeDist > 0.5 ? Math.sin(v * 24.0 + edgeDist * 6.0) * ruffle * (edgeDist - 0.5) : 0;
            const lipRoll = v > 0.75 ? Math.sin((v - 0.75) * 4 * Math.PI) * edgeRoll * (1 - edgeDist) : 0;

            pos.setZ(i, cupOffset - curlOffset + edgeRuffle + lipRoll);
        }

        pos.needsUpdate = true;
        geom.computeVertexNormals();
        return geom;
    }

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
            map: this.petalTexture,
            roughness: 0.36,
            metalness: 0.03,
            transmission: 0.18,
            sheen: sheenColor,
            clearcoat: 0.22,
            clearcoatRoughness: 0.20,
            side: THREE.DoubleSide
        });

        this.allMaterials.push({ mat, brightness, hueOffset });
        return mat;
    }

    createDewdrop(radius = 0.035) {
        const geom = new THREE.SphereGeometry(radius, 16, 16);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.04,
            metalness: 0,
            transmission: 0.96,
            ior: 1.333,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.scale.set(1, 0.55, 1);
        this.dewdrops.push(mesh);
        return mesh;
    }

    // --- 🌹 Build Grand Central Rose ---
    buildRose() {
        this.roseGroup = new THREE.Group();
        this.roseGroup.position.set(0, -0.15, 0);
        this.scene.add(this.roseGroup);

        this.allPetals = [];
        this.interactivePetalMeshes = [];

        this.createStamenCluster();

        // Tier 1: Inner Bud Core (12 petals)
        const coreCount = 12;
        for (let i = 0; i < coreCount; i++) {
            const geom = this.createCurvedPetalGeometry(0.32, 0.65, {
                curl: 0.42,
                cup: 0.36,
                flare: 0.06,
                ruffle: 0.015,
                edgeRoll: 0.02,
                uSegments: 20,
                vSegments: 28
            });
            const mat = this.createPetalMaterial(0.80 + (i / coreCount) * 0.20, -0.01);
            const petal = new THREE.Mesh(geom, mat);

            const angle = i * 2.39996;
            const radius = 0.025 + (i / coreCount) * 0.07;
            petal.position.set(
                Math.cos(angle) * radius,
                0.55 + (i / coreCount) * 0.05,
                Math.sin(angle) * radius
            );
            petal.rotation.y = -angle + Math.PI / 2;
            petal.castShadow = true;

            const budRotZ = -0.06;
            const bloomRotZ = -0.22 - (i / coreCount) * 0.15;
            petal.rotation.z = budRotZ;

            petal.userData = { petalIndex: i, isPetal: true };
            this.roseGroup.add(petal);
            this.interactivePetalMeshes.push(petal);

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

        // Tier 2: Middle Unfurling (16 petals)
        const midCount = 16;
        for (let i = 0; i < midCount; i++) {
            const geom = this.createCurvedPetalGeometry(0.55, 0.95, {
                curl: 0.28,
                cup: 0.25,
                flare: 0.22,
                ruffle: 0.022,
                edgeRoll: 0.035,
                uSegments: 24,
                vSegments: 32
            });
            const mat = this.createPetalMaterial(0.92 + (i / midCount) * 0.15, 0);
            const petal = new THREE.Mesh(geom, mat);

            const angle = i * (Math.PI * 2 / midCount) + (i % 2) * 0.25;
            const radius = 0.12 + (i / midCount) * 0.14;
            petal.position.set(
                Math.cos(angle) * radius,
                0.50 - (i / midCount) * 0.04,
                Math.sin(angle) * radius
            );
            petal.rotation.y = -angle + Math.PI / 2;
            petal.castShadow = true;

            const budRotZ = -0.14;
            const bloomRotZ = -0.48 - (i / midCount) * 0.22;
            petal.rotation.z = budRotZ;

            petal.userData = { petalIndex: coreCount + i, isPetal: true };
            this.roseGroup.add(petal);
            this.interactivePetalMeshes.push(petal);

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

        // Tier 3: Grand Outer Blooming with Dewdrops (18 petals)
        const outerCount = 18;
        for (let i = 0; i < outerCount; i++) {
            const geom = this.createCurvedPetalGeometry(0.72, 1.25, {
                curl: 0.18,
                cup: 0.18,
                flare: 0.38,
                ruffle: 0.038,
                edgeRoll: 0.05,
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

            const budRotZ = -0.20;
            const bloomRotZ = -0.80 - (i / outerCount) * 0.25;
            petal.rotation.z = budRotZ;

            if (i % 2 === 0) {
                const drop = this.createDewdrop(0.026 + Math.random() * 0.018);
                drop.position.set(
                    (Math.random() - 0.5) * 0.22,
                    0.45 + Math.random() * 0.35,
                    0.075
                );
                petal.add(drop);
            }

            petal.userData = { petalIndex: coreCount + midCount + i, isPetal: true };
            this.roseGroup.add(petal);
            this.interactivePetalMeshes.push(petal);

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

        // Calyx & Sepals
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

        // Stem
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

        this.createThorns(stemMat);
        this.createLeaves(stemMat);
        this.createObsidianPedestal();
    }

    // --- 💐 Build 6 Companion Roses for Royal Bouquet Mode ---
    buildBouquet() {
        this.bouquetGroup = new THREE.Group();
        this.bouquetGroup.position.set(0, -0.15, 0);
        this.bouquetGroup.visible = false;
        this.scene.add(this.bouquetGroup);

        const companionConfigs = [
            { angle: 0, r: 0.65, y: -0.12, rotZ: 0.32, scale: 0.68, hue: 0.93 }, // Sakura pink
            { angle: Math.PI / 3, r: 0.68, y: -0.18, rotZ: 0.35, scale: 0.62, hue: 0.78 }, // Mystic violet
            { angle: (2 * Math.PI) / 3, r: 0.65, y: -0.14, rotZ: 0.32, scale: 0.66, hue: 0.11 }, // Golden amber
            { angle: Math.PI, r: 0.66, y: -0.15, rotZ: 0.34, scale: 0.68, hue: 0.98 }, // Ruby red
            { angle: (4 * Math.PI) / 3, r: 0.68, y: -0.20, rotZ: 0.36, scale: 0.64, hue: 0.93 }, // Sakura pink
            { angle: (5 * Math.PI) / 3, r: 0.65, y: -0.15, rotZ: 0.33, scale: 0.66, hue: 0.78 } // Mystic violet
        ];

        companionConfigs.forEach((cfg, idx) => {
            const subGroup = new THREE.Group();
            subGroup.position.set(Math.cos(cfg.angle) * cfg.r, cfg.y, Math.sin(cfg.angle) * cfg.r);
            subGroup.rotation.y = -cfg.angle + Math.PI / 2;
            subGroup.rotation.z = cfg.rotZ;
            subGroup.scale.setScalar(cfg.scale);

            // Create mini rose bloom (14 petals)
            for (let p = 0; p < 14; p++) {
                const geom = this.createCurvedPetalGeometry(0.48, 0.85, { curl: 0.3, cup: 0.25, flare: 0.2 });
                const mat = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color().setHSL(cfg.hue, 0.85, 0.48),
                    map: this.petalTexture,
                    roughness: 0.38,
                    transmission: 0.15,
                    clearcoat: 0.2,
                    side: THREE.DoubleSide
                });
                const petalMesh = new THREE.Mesh(geom, mat);
                const a = p * (Math.PI * 2 / 14);
                petalMesh.position.set(Math.cos(a) * 0.12, 0.35, Math.sin(a) * 0.12);
                petalMesh.rotation.y = -a + Math.PI / 2;
                petalMesh.rotation.z = -0.45;
                subGroup.add(petalMesh);
            }

            // Stem for companion
            const stemC = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0.35, 0),
                new THREE.Vector3(0, -0.6, 0)
            ]);
            const stemG = new THREE.TubeGeometry(stemC, 12, 0.03, 8, false);
            const stemM = new THREE.MeshStandardMaterial({ color: 0x224822, roughness: 0.6 });
            subGroup.add(new THREE.Mesh(stemG, stemM));

            this.bouquetGroup.add(subGroup);
        });
    }

    setArrangement(type = 'single') {
        this.currentArrangement = type;
        if (type === 'bouquet') {
            this.bouquetGroup.visible = true;
            this.targetZoom = 4.2;
            if (window.confetti) {
                window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            }
        } else {
            this.bouquetGroup.visible = false;
            this.targetZoom = 3.6;
        }
        if (window.soundEngine) window.soundEngine.playSparkle();
    }

    toggleArrangement() {
        const next = this.currentArrangement === 'single' ? 'bouquet' : 'single';
        this.setArrangement(next);
        return next;
    }

    // --- ✨ Center Golden Stamen & Pollen Cluster ---
    createStamenCluster() {
        this.stamenGroup = new THREE.Group();
        this.stamenGroup.position.set(0, 0.52, 0);

        const count = 28;
        const radius = 0.07;
        const height = 0.16;

        const antherGeom = new THREE.SphereGeometry(0.014, 10, 10);
        antherGeom.scale(1, 1.6, 1);
        const antherMat = new THREE.MeshStandardMaterial({
            color: 0xffd166,
            emissive: 0xffa000,
            emissiveIntensity: 0.5,
            roughness: 0.5
        });

        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffeedd,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.15;
            const r = (0.2 + 0.8 * Math.sqrt((i + 1) / count)) * radius;
            const tipX = Math.cos(angle) * (r + 0.02);
            const tipZ = Math.sin(angle) * (r + 0.02);
            const tipY = height * (0.8 + 0.25 * Math.sin(i * 1.5));

            const points = [
                new THREE.Vector3(Math.cos(angle) * r * 0.2, 0, Math.sin(angle) * r * 0.2),
                new THREE.Vector3(Math.cos(angle) * r, tipY * 0.5, Math.sin(angle) * r),
                new THREE.Vector3(tipX, tipY, tipZ)
            ];
            const curve = new THREE.CatmullRomCurve3(points);
            const lineGeom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(8));
            const line = new THREE.Line(lineGeom, lineMat);
            this.stamenGroup.add(line);

            const anther = new THREE.Mesh(antherGeom, antherMat);
            anther.position.set(tipX, tipY, tipZ);
            this.stamenGroup.add(anther);
        }

        this.roseGroup.add(this.stamenGroup);
    }

    createThorns(stemMat) {
        const thornGeom = new THREE.ConeGeometry(0.02, 0.065, 8);
        thornGeom.translate(0, 0.03, 0);
        thornGeom.rotateZ(Math.PI / 2.3);

        const thornMat = new THREE.MeshPhysicalMaterial({
            color: 0x6e2626,
            roughness: 0.35,
            clearcoat: 0.2
        });

        const thornPositions = [
            { y: 0.05, angle: 0.8 },
            { y: -0.15, angle: 3.2 },
            { y: -0.35, angle: 1.7 },
            { y: -0.60, angle: 4.8 }
        ];

        thornPositions.forEach(tp => {
            const thorn = new THREE.Mesh(thornGeom, thornMat);
            thorn.position.set(Math.cos(tp.angle) * 0.038, tp.y, Math.sin(tp.angle) * 0.038);
            thorn.rotation.y = -tp.angle;
            thorn.castShadow = true;
            this.roseGroup.add(thorn);
        });
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

    createObsidianPedestal() {
        const pedestalGeom = new THREE.CylinderGeometry(1.6, 1.72, 0.07, 64);
        const pedestalMat = new THREE.MeshStandardMaterial({
            color: 0x08080d,
            roughness: 0.12,
            metalness: 0.85
        });
        const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
        pedestal.position.y = -0.88;
        pedestal.receiveShadow = true;
        this.scene.add(pedestal);

        this.rippleRings = [];
        [1.62, 1.35].forEach((radius, idx) => {
            const ringGeom = new THREE.RingGeometry(radius - 0.015, radius, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.themes[this.currentTheme].rimColor,
                transparent: true,
                opacity: 0.5 - idx * 0.2,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = -0.84 + idx * 0.002;
            this.scene.add(ring);
            this.rippleRings.push(ring);
        });
    }

    createCelestialHalo() {
        const haloGeom = new THREE.PlaneGeometry(3.2, 3.2);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const rad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
        rad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        rad.addColorStop(0.35, 'rgba(255, 105, 180, 0.2)');
        rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, 256, 256);

        const tex = new THREE.CanvasTexture(canvas);
        const haloMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.haloMesh = new THREE.Mesh(haloGeom, haloMat);
        this.haloMesh.position.set(0, 0.45, -0.6);
        this.scene.add(this.haloMesh);
    }

    createAtmosphericDust() {
        const count = 140;
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
            size: 0.038,
            color: this.themes[this.currentTheme].dustColor,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.dustPoints = new THREE.Points(geom, mat);
        this.dustVel = vel;
        this.dustPhase = phase;
        this.scene.add(this.dustPoints);
    }

    // --- 🎬 Director Cinematic Mode ---
    toggleCinematicMode() {
        this.isCinematicMode = !this.isCinematicMode;
        if (this.isCinematicMode) {
            document.body.classList.add('cinematic-active');
            this.cinematicTime = 0;
            this.currentShotIndex = 0;
            this.shotProgress = 0;
            if (window.showToast) window.showToast("🎬 Bắt đầu Chế Độ Điện Ảnh Cinematic");
        } else {
            document.body.classList.remove('cinematic-active');
            this.targetZoom = 3.6;
            this.targetRotationX = 0.15;
            if (window.showToast) window.showToast("Đã thoát chế độ điện ảnh");
        }
        return this.isCinematicMode;
    }

    // --- 🌸 Spawn Floating 3D Detached Petal Particles ---
    spawn3DPetalFlakes(sourcePos, count = 12) {
        for (let i = 0; i < count; i++) {
            const geom = this.createCurvedPetalGeometry(0.12, 0.22, { curl: 0.2, cup: 0.15 });
            const mat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(this.themes[this.currentTheme].baseHue, 0.9, 0.55),
                roughness: 0.4,
                transparent: true,
                opacity: 0.95,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(sourcePos);
            mesh.position.x += (Math.random() - 0.5) * 0.2;
            mesh.position.y += (Math.random() - 0.5) * 0.2;
            mesh.position.z += (Math.random() - 0.5) * 0.2;

            this.scene.add(mesh);
            this.floatingPetalParticles.push({
                mesh: mesh,
                vx: (Math.random() - 0.5) * 0.015,
                vy: Math.random() * 0.02 + 0.012,
                vz: (Math.random() - 0.5) * 0.015,
                rotX: (Math.random() - 0.5) * 0.08,
                rotY: (Math.random() - 0.5) * 0.08,
                rotZ: (Math.random() - 0.5) * 0.08,
                life: 1.0,
                decay: 0.008
            });
        }
    }

    // --- 🎨 Switch Theme Palette Smoothly ---
    setTheme(themeKey) {
        if (!this.themes[themeKey]) return;
        this.currentTheme = themeKey;
        const theme = this.themes[themeKey];

        if (this.rimLight) this.rimLight.color.setHex(theme.rimColor);
        if (this.keyLight) this.keyLight.color.setHex(theme.keyColor);
        if (this.coreLight) this.coreLight.color.setHex(theme.haloColor);
        if (this.dustPoints) this.dustPoints.material.color.setHex(theme.dustColor);

        this.rippleRings.forEach(ring => {
            ring.material.color.setHex(theme.rimColor);
        });

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

    startBloomAnimation() {
        this.targetBloom = 1.0;
        this.isBlooming = true;

        if (window.confetti) {
            setTimeout(() => {
                window.confetti({
                    particleCount: 75,
                    spread: 85,
                    origin: { y: 0.65 },
                    colors: ['#ff8da1', '#ffccd5', '#ffd700', '#ffffff', '#e8ba5d']
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
            if (this.isCinematicMode) {
                this.toggleCinematicMode();
            }
            this.isPointerDown = true;
            this.pointerStartX = clientX;
            this.pointerStartY = clientY;
        };

        const onMove = (clientX, clientY) => {
            const rect = dom.getBoundingClientRect();
            this.mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            this.mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

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

        // Raycasting Click directly on individual petals!
        dom.addEventListener('click', (e) => {
            const rect = dom.getBoundingClientRect();
            this.mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const intersects = this.raycaster.intersectObjects(this.interactivePetalMeshes, false);

            if (intersects.length > 0) {
                const hit = intersects[0];
                const hitMesh = hit.object;
                const idx = hitMesh.userData.petalIndex || 0;

                // Play harmonic piano chord note corresponding to petal height!
                if (window.soundEngine) {
                    window.soundEngine.playHarmonicNote(idx);
                }

                // Spawn floating 3D petal flakes at hit coordinate
                this.spawn3DPetalFlakes(hit.point, 14);

                // Vibration punch on hit petal
                hitMesh.scale.multiplyScalar(1.15);
                setTimeout(() => hitMesh.scale.divideScalar(1.15), 180);
            } else {
                if (window.soundEngine) window.soundEngine.playSparkle();
            }

            if (window.particleEngine) {
                window.particleEngine.spawnCursorSparkles(e.clientX, e.clientY);
            }
        });

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

        // Petals unfurling & natural breathing
        this.allPetals.forEach(p => {
            const breathe = Math.sin(elapsed * p.speed + p.phase) * 0.015;
            const currentRotZ = p.budRotZ + (p.bloomRotZ - p.budRotZ) * this.bloomProgress;
            p.mesh.rotation.z = currentRotZ + breathe;

            const currentScale = p.budScale + (p.bloomScale - p.budScale) * this.bloomProgress;
            p.mesh.scale.setScalar(currentScale);
        });

        // Bouquet companion roses breathing
        if (this.bouquetGroup && this.bouquetGroup.visible) {
            this.bouquetGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.05;
        }

        // Golden stamen reveal during bloom
        if (this.stamenGroup) {
            const stamenScale = 0.4 + this.bloomProgress * 0.6;
            this.stamenGroup.scale.setScalar(stamenScale);
            this.stamenGroup.rotation.y = elapsed * 0.05;
        }

        // Halo & neon ripple pulse
        if (this.haloMesh) {
            this.haloMesh.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.08);
        }
        this.rippleRings.forEach((ring, idx) => {
            ring.scale.setScalar(1 + Math.sin(elapsed * 2 + idx) * 0.015);
        });

        // Floating 3D Petal Flakes Physics
        for (let i = this.floatingPetalParticles.length - 1; i >= 0; i--) {
            const fp = this.floatingPetalParticles[i];
            fp.mesh.position.x += fp.vx;
            fp.mesh.position.y += fp.vy;
            fp.mesh.position.z += fp.vz;
            fp.mesh.rotation.x += fp.rotX;
            fp.mesh.rotation.y += fp.rotY;
            fp.mesh.rotation.z += fp.rotZ;
            fp.life -= fp.decay;
            fp.mesh.material.opacity = Math.max(0, fp.life);

            if (fp.life <= 0) {
                this.scene.remove(fp.mesh);
                fp.mesh.geometry.dispose();
                fp.mesh.material.dispose();
                this.floatingPetalParticles.splice(i, 1);
            }
        }

        // Camera positioning: Cinematic Mode vs Manual Orbit
        if (this.isCinematicMode) {
            const currentShot = this.cinematicShots[this.currentShotIndex];
            this.shotProgress += delta;
            this.currentRotationY += currentShot.rotYSpd * delta;
            this.currentRotationX += (currentShot.rotX - this.currentRotationX) * 0.05;
            this.zoomDistance += (currentShot.dist - this.zoomDistance) * 0.05;

            if (this.shotProgress >= currentShot.duration) {
                this.shotProgress = 0;
                this.currentShotIndex = (this.currentShotIndex + 1) % this.cinematicShots.length;
                this.targetRotationY = this.currentRotationY;
            }
        } else {
            this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;
            this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;
            this.zoomDistance += (this.targetZoom - this.zoomDistance) * 0.08;

            if (!this.isPointerDown) {
                this.targetRotationY += 0.002;
            }
        }

        const cosX = Math.cos(this.currentRotationX);
        const sinX = Math.sin(this.currentRotationX);
        const sinY = Math.sin(this.currentRotationY);
        const cosY = Math.cos(this.currentRotationY);

        const targetLookY = this.isCinematicMode ? this.cinematicShots[this.currentShotIndex].targetY : 0.40;
        this.camera.position.x = sinY * cosX * this.zoomDistance;
        this.camera.position.y = 0.45 + sinX * this.zoomDistance;
        this.camera.position.z = cosY * cosX * this.zoomDistance;
        this.camera.lookAt(0, targetLookY, 0);

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
