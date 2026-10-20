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

        // 🦋 Living 3D Wildlife & Deep Environment
        this.butterflies = [];
        this.waterLilies = [];
        this.waterSurfaceMesh = null;
        this.volumetricBeam = null;
        this.wishBottle = null;
        this.wordSprites = [];
        this.dynamicWaterRipples = [];
        this.butterflyDust = [];
        this.interactiveObjects = [];
        this.mouseWorldTarget = new THREE.Vector3(0, 0.45, 1.2);

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
        this.createVolumetricMoonlight();
        this.createWaterSanctuary();
        this.create3DWishBottle();
        this.create3DButterflies();

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

    // --- 🌌 Volumetric Moonlight Godrays ---
    createVolumetricMoonlight() {
        const height = 7.5;
        const geom = new THREE.CylinderGeometry(0.35, 4.0, height, 32, 1, true);
        geom.translate(0, -height / 2, 0);

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, 'rgba(255, 245, 230, 0.45)');
        grad.addColorStop(0.3, 'rgba(255, 230, 240, 0.22)');
        grad.addColorStop(0.7, 'rgba(230, 210, 255, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.volumetricBeam = new THREE.Mesh(geom, mat);
        this.volumetricBeam.position.set(-1.4, 4.5, -0.9);
        this.volumetricBeam.rotation.z = -0.32;
        this.volumetricBeam.rotation.x = 0.16;
        this.scene.add(this.volumetricBeam);
    }

    // --- 🌊 Enchanted Midnight Water Sanctuary & Floating Lilies ---
    createWaterSanctuary() {
        const poolRadius = 2.9;
        const poolGeom = new THREE.CylinderGeometry(poolRadius, poolRadius + 0.12, 0.08, 64);
        const poolMat = new THREE.MeshPhysicalMaterial({
            color: 0x061524,
            roughness: 0.04,
            metalness: 0.28,
            transmission: 0.65,
            ior: 1.333,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03
        });
        this.waterSurfaceMesh = new THREE.Mesh(poolGeom, poolMat);
        this.waterSurfaceMesh.position.y = -0.88;
        this.waterSurfaceMesh.receiveShadow = true;
        this.waterSurfaceMesh.userData = { isWater: true };
        this.scene.add(this.waterSurfaceMesh);
        this.interactiveObjects.push(this.waterSurfaceMesh);

        // Gold & Obsidian Border Rim
        const rimGeom = new THREE.TorusGeometry(poolRadius + 0.05, 0.04, 16, 64);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.88,
            roughness: 0.22
        });
        const rim = new THREE.Mesh(rimGeom, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = -0.84;
        this.scene.add(rim);

        // Concentric Luminous Ambient Water Rings
        this.rippleRings = [];
        [2.1, 1.5, 0.9].forEach((radius, idx) => {
            const ringGeom = new THREE.RingGeometry(radius - 0.015, radius, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.themes[this.currentTheme].rimColor,
                transparent: true,
                opacity: 0.45 - idx * 0.12,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = -0.835 + idx * 0.001;
            this.scene.add(ring);
            this.rippleRings.push(ring);
        });

        // 🪷 Floating Sacred Water Lilies / Lotus Blossoms
        this.waterLilies = [];
        const lilyConfigs = [
            { angle: 0.55, dist: 1.55, scale: 0.38, color: 0xffb7c5, phase: 0 },
            { angle: 2.15, dist: 1.85, scale: 0.42, color: 0xfdf4f5, phase: 1.2 },
            { angle: 3.75, dist: 1.60, scale: 0.36, color: 0xd8b4fe, phase: 2.5 },
            { angle: 5.10, dist: 2.05, scale: 0.40, color: 0xfde047, phase: 3.8 }
        ];

        lilyConfigs.forEach((cfg) => {
            const lilyGroup = new THREE.Group();
            lilyGroup.position.set(
                Math.cos(cfg.angle) * cfg.dist,
                -0.84,
                Math.sin(cfg.angle) * cfg.dist
            );

            // Lily pad (round pad with notch)
            const padShape = new THREE.Shape();
            padShape.absarc(0, 0, 0.55, 0.22, Math.PI * 2 - 0.22, false);
            padShape.lineTo(0, 0);
            const padGeom = new THREE.ShapeGeometry(padShape, 32);
            const padMat = new THREE.MeshStandardMaterial({
                color: 0x1e4620,
                roughness: 0.4,
                side: THREE.DoubleSide
            });
            const padMesh = new THREE.Mesh(padGeom, padMat);
            padMesh.rotation.x = -Math.PI / 2;
            padMesh.rotation.z = cfg.angle + 0.3;
            lilyGroup.add(padMesh);

            // Water Lily Blossom Petals
            const petalCount = 12;
            const lilyPetalMat = new THREE.MeshPhysicalMaterial({
                color: cfg.color,
                roughness: 0.3,
                transmission: 0.25,
                clearcoat: 0.4,
                side: THREE.DoubleSide
            });

            for (let p = 0; p < petalCount; p++) {
                const pGeom = new THREE.PlaneGeometry(0.14, 0.38, 8, 8);
                const pos = pGeom.attributes.position;
                for (let v = 0; v < pos.count; v++) {
                    const py = pos.getY(v) + 0.19;
                    pos.setY(v, py);
                    const ratio = py / 0.38;
                    pos.setZ(v, Math.sin(ratio * Math.PI) * 0.05);
                }
                pos.needsUpdate = true;
                pGeom.computeVertexNormals();

                const pMesh = new THREE.Mesh(pGeom, lilyPetalMat);
                const pAngle = (p / petalCount) * Math.PI * 2;
                pMesh.position.set(Math.cos(pAngle) * 0.05, 0.02, Math.sin(pAngle) * 0.05);
                pMesh.rotation.y = -pAngle + Math.PI / 2;
                pMesh.rotation.x = 0.55 + (p % 2) * 0.25;
                lilyGroup.add(pMesh);
            }

            // Golden Lily Core
            const coreGeom = new THREE.SphereGeometry(0.045, 12, 12);
            const coreMat = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                emissive: 0xffa500,
                emissiveIntensity: 0.6
            });
            const core = new THREE.Mesh(coreGeom, coreMat);
            core.position.y = 0.04;
            lilyGroup.add(core);

            lilyGroup.scale.setScalar(cfg.scale);
            lilyGroup.userData = { phase: cfg.phase, baseScale: cfg.scale };
            this.scene.add(lilyGroup);
            this.waterLilies.push(lilyGroup);
        });
    }

    // 💧 Dynamic Water Ripple Effect
    spawnWaterRipple(x, z, maxRadius = 1.8) {
        const ringGeom = new THREE.RingGeometry(0.02, 0.05, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: this.themes[this.currentTheme].rimColor,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, -0.835, z);
        this.scene.add(ring);

        this.dynamicWaterRipples.push({
            mesh: ring,
            radius: 0.05,
            maxRadius: maxRadius,
            opacity: 0.85,
            speed: 0.032
        });
    }

    // --- 🍾 3D Floating Crystal Wish Bottle ---
    create3DWishBottle() {
        this.wishBottle = new THREE.Group();
        this.wishBottle.position.set(1.22, -0.77, 0.72);

        // Glass Body
        const bodyGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 24);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.04,
            metalness: 0.0,
            transmission: 0.96,
            ior: 1.52,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            transparent: true,
            opacity: 0.95
        });
        const body = new THREE.Mesh(bodyGeom, glassMat);
        this.wishBottle.add(body);

        // Glass Neck
        const neckGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.07, 24);
        const neck = new THREE.Mesh(neckGeom, glassMat);
        neck.position.y = 0.145;
        this.wishBottle.add(neck);

        // Cork Stopper
        const corkGeom = new THREE.CylinderGeometry(0.043, 0.039, 0.045, 16);
        const corkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
        const cork = new THREE.Mesh(corkGeom, corkMat);
        cork.position.y = 0.185;
        this.wishBottle.add(cork);

        // Rolled Parchment Scroll inside
        const scrollGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.13, 16);
        const scrollMat = new THREE.MeshStandardMaterial({ color: 0xfbf1d8, roughness: 0.5 });
        const scroll = new THREE.Mesh(scrollGeom, scrollMat);
        scroll.position.set(0, -0.01, 0);
        scroll.rotation.z = 0.15;
        this.wishBottle.add(scroll);

        // Red tie ribbon
        const ribbonGeom = new THREE.TorusGeometry(0.023, 0.005, 8, 16);
        const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xe62b5a });
        const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
        ribbon.rotation.x = Math.PI / 2;
        ribbon.position.y = -0.01;
        this.wishBottle.add(ribbon);

        // Glowing Fairy Starlight trapped inside
        const starLight = new THREE.PointLight(0xffea79, 1.2, 0.9);
        starLight.position.set(0, 0.04, 0);
        this.wishBottle.add(starLight);

        const sparkGeom = new THREE.SphereGeometry(0.015, 12, 12);
        const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfff3a8 });
        const sparkMesh = new THREE.Mesh(sparkGeom, sparkMat);
        sparkMesh.position.copy(starLight.position);
        this.wishBottle.add(sparkMesh);

        // Raycasting metadata
        body.userData = { isWishBottle: true };
        neck.userData = { isWishBottle: true };
        this.wishBottle.userData = { isWishBottle: true };
        this.scene.add(this.wishBottle);
        this.interactiveObjects.push(body);
        this.interactiveObjects.push(neck);
    }

    // --- 🦋 Procedural 3D Bioluminescent Butterflies ---
    generateButterflyWingTexture(themeHue = 0.55, rimHue = 0.95) {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(20, 256);
        ctx.bezierCurveTo(40, 60, 200, 20, 480, 50);
        ctx.bezierCurveTo(510, 160, 490, 280, 440, 360);
        ctx.bezierCurveTo(390, 480, 220, 500, 120, 460);
        ctx.bezierCurveTo(30, 420, 10, 320, 20, 256);
        ctx.closePath();
        ctx.clip();

        // Iridescent background gradient
        const grad = ctx.createRadialGradient(80, 256, 20, 320, 256, 360);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, `hsl(${themeHue * 360}, 100%, 70%)`);
        grad.addColorStop(0.65, `hsl(${themeHue * 360}, 95%, 45%)`);
        grad.addColorStop(0.92, `hsl(${rimHue * 360}, 90%, 35%)`);
        grad.addColorStop(1, '#050308');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Intricate Wing Veins
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 2.5;
        const veinEnds = [
            [460, 60], [490, 140], [480, 220], [450, 300],
            [410, 380], [330, 450], [240, 480], [160, 460]
        ];
        veinEnds.forEach(pt => {
            ctx.beginPath();
            ctx.moveTo(30, 256);
            ctx.bezierCurveTo(150, 256, 260, pt[1] * 0.8 + 50, pt[0], pt[1]);
            ctx.stroke();

            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(220, (256 + pt[1]) * 0.5);
            ctx.lineTo(pt[0] - 30, pt[1] + 20);
            ctx.stroke();
            ctx.lineWidth = 2.5;
        });

        // Golden Fairy Dust Spots on Border
        ctx.fillStyle = '#fff9db';
        for (let i = 0; i < 35; i++) {
            const angle = (i / 35) * Math.PI * 1.5 - 0.4;
            const r = 240 + Math.sin(i * 3) * 15;
            const x = 250 + Math.cos(angle) * r;
            const y = 256 + Math.sin(angle) * r;
            ctx.beginPath();
            ctx.arc(x, y, 2.5 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }

    createSingleButterfly(config) {
        const group = new THREE.Group();

        // Slender Iridescent Body
        const bodyGeom = new THREE.CylinderGeometry(0.012, 0.008, 0.16, 8);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x111322,
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Head with antennae
        const headGeom = new THREE.SphereGeometry(0.014, 8, 8);
        const head = new THREE.Mesh(headGeom, bodyMat);
        head.position.set(0, 0, -0.09);
        group.add(head);

        // Antennae
        const antMat = new THREE.LineBasicMaterial({ color: 0xffd700 });
        [-1, 1].forEach(side => {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -0.09),
                new THREE.Vector3(side * 0.02, 0.03, -0.13),
                new THREE.Vector3(side * 0.045, 0.06, -0.16)
            ]);
            const antGeom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(8));
            group.add(new THREE.Line(antGeom, antMat));
        });

        // Wing Texture & Materials
        const wingTex = this.generateButterflyWingTexture(config.themeHue, config.rimHue);
        const wingMat = new THREE.MeshPhysicalMaterial({
            map: wingTex,
            transparent: true,
            opacity: 0.92,
            transmission: 0.35,
            roughness: 0.25,
            clearcoat: 0.85,
            side: THREE.DoubleSide
        });

        // Left Wing Group (hinge at x = 0)
        const leftWingGroup = new THREE.Group();
        leftWingGroup.position.set(0.008, 0.01, 0);

        const wingGeom = new THREE.PlaneGeometry(0.38, 0.44, 8, 8);
        wingGeom.translate(0.19, 0, 0);
        const leftWingMesh = new THREE.Mesh(wingGeom, wingMat);
        leftWingMesh.rotation.x = -Math.PI / 2;
        leftWingGroup.add(leftWingMesh);
        group.add(leftWingGroup);

        // Right Wing Group (hinge at x = 0, mirrored)
        const rightWingGroup = new THREE.Group();
        rightWingGroup.position.set(-0.008, 0.01, 0);

        const rightWingGeom = new THREE.PlaneGeometry(0.38, 0.44, 8, 8);
        rightWingGeom.translate(-0.19, 0, 0);
        rightWingGeom.scale(-1, 1, 1);
        const rightWingMesh = new THREE.Mesh(rightWingGeom, wingMat);
        rightWingMesh.rotation.x = -Math.PI / 2;
        rightWingGroup.add(rightWingMesh);
        group.add(rightWingGroup);

        // Trapped starlight glow under butterfly
        const glow = new THREE.PointLight(config.glowColor, 0.8, 1.2);
        glow.position.set(0, 0.02, 0);
        group.add(glow);

        const butterflyObj = {
            mesh: group,
            leftWing: leftWingGroup,
            rightWing: rightWingGroup,
            config: config,
            state: 'flying',
            tOffset: config.tOffset || 0,
            speed: config.speed || 0.6,
            flapPhase: Math.random() * Math.PI,
            loopAngle: 0,
            triggerAcrobaticLoop: function() {
                this.state = 'looping';
                this.loopAngle = 0;
            }
        };

        // Raycasting click trigger
        body.userData = { isButterfly: true, butterflyRef: butterflyObj };
        leftWingMesh.userData = { isButterfly: true, butterflyRef: butterflyObj };
        rightWingMesh.userData = { isButterfly: true, butterflyRef: butterflyObj };
        group.userData = { isButterfly: true, butterflyRef: butterflyObj };

        this.scene.add(group);
        this.interactiveObjects.push(body);
        this.interactiveObjects.push(leftWingMesh);
        this.interactiveObjects.push(rightWingMesh);

        return butterflyObj;
    }

    create3DButterflies() {
        this.butterflies = [
            this.createSingleButterfly({
                name: 'Morpho Azure',
                themeHue: 0.55,
                rimHue: 0.78,
                glowColor: 0x38bdf8,
                tOffset: 0,
                speed: 0.55,
                radiusX: 1.35,
                radiusZ: 1.25,
                heightBase: 0.65,
                heightAmp: 0.35
            }),
            this.createSingleButterfly({
                name: 'Aura Rose',
                themeHue: 0.95,
                rimHue: 0.12,
                glowColor: 0xff69b4,
                tOffset: Math.PI,
                speed: 0.48,
                radiusX: 1.55,
                radiusZ: 1.45,
                heightBase: 0.50,
                heightAmp: 0.42
            })
        ];
    }

    // --- ✨ 3D Floating Word Sprites (Lời Chúc Khắc Ghi) ---
    spawnFloatingWordSprite(hitPoint) {
        const words = [
            '✨ Rạng Rỡ',
            '🌸 Xinh Đẹp',
            '💖 Hạnh Phúc',
            '🌟 Tỏa Sáng',
            '👑 Kiêu Hãnh',
            '🌷 Dịu Dàng',
            '🍀 Bình An',
            '💎 Quý Phái',
            '🕊️ Tự Do',
            '🌺 Ngát Hương'
        ];
        const text = words[Math.floor(Math.random() * words.length)];

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');

        // Draw pill badge
        ctx.fillStyle = 'rgba(15, 8, 24, 0.85)';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(10, 10, 236, 76, 38);
        } else {
            ctx.rect(10, 10, 236, 76);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 28px "Playfair Display", "Times New Roman", serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#e62b5a';
        ctx.shadowBlur = 10;
        ctx.fillText(text, 128, 48);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 1.0, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        sprite.position.copy(hitPoint);
        sprite.position.y += 0.1;
        sprite.scale.set(0.65, 0.24, 1);
        sprite.userData = {
            vy: 0.012 + Math.random() * 0.006,
            life: 1.0,
            seed: Math.random() * 10
        };

        this.scene.add(sprite);
        this.wordSprites.push(sprite);
    }

    // --- 🎚️ Interactive Bloom Progress Controller ---
    setBloomProgress(val) {
        this.targetBloom = Math.max(0.0, Math.min(1.0, val));
        this.isBlooming = this.targetBloom > 0.05;
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

            // 3D cursor plane intersection for curious butterfly tracking
            if (this.camera) {
                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                this.raycaster.setFromCamera(this.mouseVector, this.camera);
                this.raycaster.ray.intersectPlane(plane, this.mouseWorldTarget);
            }

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

        // 🌟 Raycasting Click across Petals, Butterflies, Wish Bottle, and Water Sanctuary!
        dom.addEventListener('click', (e) => {
            const rect = dom.getBoundingClientRect();
            this.mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const allTargets = [...this.interactivePetalMeshes, ...this.interactiveObjects];
            const intersects = this.raycaster.intersectObjects(allTargets, true);

            if (intersects.length > 0) {
                const hit = intersects[0];
                const hitObj = hit.object;

                // 1. Click on 3D Floating Crystal Wish Bottle
                if (hitObj.userData && hitObj.userData.isWishBottle) {
                    if (window.soundEngine) window.soundEngine.playCrystalChime();
                    if (window.openWishBottleModal) window.openWishBottleModal();
                    this.spawn3DPetalFlakes(hit.point, 16);
                    if (window.particleEngine) window.particleEngine.spawnCursorSparkles(e.clientX, e.clientY);
                    return;
                }

                // 2. Click on 3D Luminous Butterfly
                if (hitObj.userData && hitObj.userData.isButterfly) {
                    if (hitObj.userData.butterflyRef) {
                        hitObj.userData.butterflyRef.triggerAcrobaticLoop();
                    }
                    if (window.soundEngine) window.soundEngine.playFairyHarp();
                    if (window.showToast) window.showToast("🦋 Chú bướm dạ quang gửi tặng bạn muôn điều diệu kỳ!");
                    this.spawn3DPetalFlakes(hit.point, 14);
                    if (window.particleEngine) window.particleEngine.spawnCursorSparkles(e.clientX, e.clientY);
                    return;
                }

                // 3. Click on Midnight Water Sanctuary Surface
                if (hitObj.userData && hitObj.userData.isWater) {
                    if (window.soundEngine) window.soundEngine.playWaterDrop();
                    this.spawnWaterRipple(hit.point.x, hit.point.z, 2.2);
                    if (window.particleEngine) window.particleEngine.spawnCursorSparkles(e.clientX, e.clientY);
                    return;
                }

                // 4. Click on 3D Velvet Petal
                if (hitObj.userData && hitObj.userData.isPetal) {
                    const idx = hitObj.userData.petalIndex || 0;

                    // Play next note of iconic song melody or harmonic chord!
                    if (window.soundEngine) {
                        window.soundEngine.playMelodyNote(idx);
                    }

                    // Spawn 3D detached petal flakes & floating empowering word
                    this.spawn3DPetalFlakes(hit.point, 14);
                    this.spawnFloatingWordSprite(hit.point);

                    // Vibration punch on hit petal
                    hitObj.scale.multiplyScalar(1.15);
                    setTimeout(() => hitObj.scale.divideScalar(1.15), 180);
                }
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

        // 🌌 Volumetric Moonlight Godrays Breathing
        if (this.volumetricBeam) {
            this.volumetricBeam.material.opacity = 0.20 + Math.sin(elapsed * 0.8) * 0.06;
        }

        // 🪷 Floating Water Lilies Buoyant Bobbing
        this.waterLilies.forEach(lily => {
            const ph = lily.userData.phase || 0;
            lily.position.y = -0.84 + Math.sin(elapsed * 1.5 + ph) * 0.014;
            lily.rotation.z = Math.sin(elapsed * 1.2 + ph) * 0.02;
        });

        // 🍾 3D Floating Crystal Wish Bottle Bobbing
        if (this.wishBottle) {
            this.wishBottle.position.y = -0.77 + Math.sin(elapsed * 1.8) * 0.016;
            this.wishBottle.rotation.z = 0.12 + Math.sin(elapsed * 1.4) * 0.06;
            this.wishBottle.rotation.x = Math.cos(elapsed * 1.1) * 0.05;
        }

        // 💧 Dynamic Water Ripples Expansion
        for (let i = this.dynamicWaterRipples.length - 1; i >= 0; i--) {
            const rip = this.dynamicWaterRipples[i];
            rip.radius += rip.speed;
            rip.opacity -= 0.018;
            rip.mesh.scale.set(rip.radius, rip.radius, 1);
            rip.mesh.material.opacity = Math.max(0, rip.opacity);
            if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
                this.scene.remove(rip.mesh);
                rip.mesh.geometry.dispose();
                rip.mesh.material.dispose();
                this.dynamicWaterRipples.splice(i, 1);
            }
        }

        // 🦋 3D Living Butterflies Flight, Wing Flap, Cursor Tracking & Loop
        this.butterflies.forEach(b => {
            const cfg = b.config;
            b.flapPhase += delta * 24;

            if (b.state === 'looping') {
                b.loopAngle += delta * 7.0;
                b.mesh.rotation.x += delta * 7.0;
                const loopWingAngle = Math.sin(b.flapPhase * 1.5) * 0.85;
                b.leftWing.rotation.y = loopWingAngle;
                b.rightWing.rotation.y = -loopWingAngle;
                if (b.loopAngle >= Math.PI * 2) {
                    b.state = 'flying';
                    b.mesh.rotation.x = 0;
                }
            } else {
                const t = elapsed * b.speed + b.tOffset;
                const orbitX = Math.sin(t) * (cfg.radiusX + Math.cos(t * 0.5) * 0.3);
                const orbitZ = Math.cos(t) * (cfg.radiusZ + Math.sin(t * 0.5) * 0.3);
                const orbitY = cfg.heightBase + Math.sin(t * 1.6) * cfg.heightAmp;

                let targetX = orbitX;
                let targetY = orbitY;
                let targetZ = orbitZ;

                if (this.mouseWorldTarget && b.config.name === 'Morpho Azure') {
                    targetX = orbitX * 0.65 + this.mouseWorldTarget.x * 0.35;
                    targetY = orbitY * 0.65 + Math.max(0.15, this.mouseWorldTarget.y) * 0.35;
                    targetZ = orbitZ * 0.65 + this.mouseWorldTarget.z * 0.35;
                }

                b.mesh.position.x += (targetX - b.mesh.position.x) * 0.05;
                b.mesh.position.y += (targetY - b.mesh.position.y) * 0.05;
                b.mesh.position.z += (targetZ - b.mesh.position.z) * 0.05;

                const lookTarget = new THREE.Vector3(
                    targetX + Math.cos(t) * 0.5,
                    targetY + Math.cos(t * 1.6) * 0.15,
                    targetZ - Math.sin(t) * 0.5
                );
                b.mesh.lookAt(lookTarget);

                const wingAngle = Math.sin(b.flapPhase) * 0.75;
                b.leftWing.rotation.y = wingAngle;
                b.rightWing.rotation.y = -wingAngle;
            }
        });

        // ✨ 3D Floating Word Sprites Physics
        for (let i = this.wordSprites.length - 1; i >= 0; i--) {
            const ws = this.wordSprites[i];
            ws.position.y += ws.userData.vy;
            ws.position.x += Math.sin(elapsed * 2.5 + ws.userData.seed) * 0.0018;
            ws.userData.life -= 0.012;
            ws.material.opacity = Math.max(0, ws.userData.life);
            if (ws.userData.life <= 0) {
                this.scene.remove(ws);
                ws.material.map.dispose();
                ws.material.dispose();
                this.wordSprites.splice(i, 1);
            }
        }

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
