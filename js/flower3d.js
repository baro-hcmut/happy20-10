/**
 * 🌹 Three.js Enchanted 3D Velvet Blooming Rose Engine - Masterclass Edition
 * High-fidelity organic procedural petals with velvet texture maps,
 * golden stamen pollen cluster, thorns, optical dewdrops, studio lighting,
 * and 360° inertial orbit navigation.
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
        this.petalTextures = {};
        this.stamenGroup = null;
        this.haloMesh = null;
        this.rippleRings = [];

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

        // WebGL Renderer with High-Precision Tone Mapping
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
        this.renderer.toneMappingExposure = 1.25;
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        // Generate Procedural Textures & Environment
        this.generatePetalTextureMap();
        this.setupLighting();
        this.generateStudioReflection();

        // Build 3D Elements
        this.buildRose();
        this.createAtmosphericDust();
        this.createCelestialHalo();

        // Event listeners
        this.bindEvents();

        // Render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    // --- 🎨 Procedural Velvet Texture Map ---
    generatePetalTextureMap() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Base gradient from deep stem base to soft petal lip
        const grad = ctx.createLinearGradient(size / 2, size, size / 2, 0);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        grad.addColorStop(0.3, 'rgba(30, 0, 10, 0.2)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Organic longitudinal velvet micro-veins
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

        // Soft velvet edge rim
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
        // Soft ambient illumination
        this.ambientLight = new THREE.AmbientLight(0xfff5f0, 0.65);
        this.scene.add(this.ambientLight);

        // Key light (Warm golden studio spotlight)
        this.keyLight = new THREE.DirectionalLight(0xfff0e4, 2.5);
        this.keyLight.position.set(3.5, 6.0, 3.5);
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.width = 2048;
        this.keyLight.shadow.mapSize.height = 2048;
        this.keyLight.shadow.bias = -0.0001;
        this.scene.add(this.keyLight);

        // Fill light (Soft rose-tinted fill)
        this.fillLight = new THREE.DirectionalLight(0xfce7f3, 1.3);
        this.fillLight.position.set(-3.5, 3.5, 2.5);
        this.scene.add(this.fillLight);

        // Rim backlight (Velvet edge halo glow)
        this.rimLight = new THREE.DirectionalLight(0xffaacc, 2.0);
        this.rimLight.position.set(0, 4.5, -4.5);
        this.scene.add(this.rimLight);

        // Core underglow light for interior petal brilliance
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

        // Soft spotlight reflections
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

    // --- 🌹 Procedural Curved Petal Geometry ---
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
            let y = pos.getY(i) + length * 0.5; // Pivot at petal base
            pos.setY(i, y);

            const v = Math.max(0, Math.min(1, y / length));
            const u = x / (width * 0.5);

            // Natural organic petal contour (slender base, wide body, elegant tip)
            const widthScale = Math.sin(Math.pow(v, 0.72) * Math.PI);
            pos.setX(i, x * Math.max(0.06, widthScale));

            // Dual-axis 3D cupping, curling, and edge roll
            const cupOffset = (1 - u * u) * Math.sin(v * Math.PI * 0.85) * cup;
            const curlOffset = Math.pow(v, 1.6) * curl - Math.sin(v * Math.PI) * flare;
            const edgeDist = Math.abs(u);
            const edgeRuffle = edgeDist > 0.5 ? Math.sin(v * 24.0 + edgeDist * 6.0) * ruffle * (edgeDist - 0.5) : 0;
            
            // Subtle outward dog-ear fold on upper petal corners
            const lipRoll = v > 0.75 ? Math.sin((v - 0.75) * 4 * Math.PI) * edgeRoll * (1 - edgeDist) : 0;

            pos.setZ(i, cupOffset - curlOffset + edgeRuffle + lipRoll);
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

    buildRose() {
        this.roseGroup = new THREE.Group();
        this.roseGroup.position.set(0, -0.15, 0);
        this.scene.add(this.roseGroup);

        this.allPetals = [];

        // --- Core: Golden Stamen & Pollen Anther Cluster ---
        this.createStamenCluster();

        // --- Tier 1: Inner Spiraling Bud Core (12 petals) ---
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

            const angle = i * 2.39996; // Golden ratio spiral
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

        // --- Tier 2: Middle Unfurling Petals (16 petals) ---
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

        // --- Tier 3: Grand Outer Blooming Petals with Dewdrops (18 petals) ---
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

            // Dewdrops on outer petals
            if (i % 2 === 0) {
                const drop = this.createDewdrop(0.026 + Math.random() * 0.018);
                drop.position.set(
                    (Math.random() - 0.5) * 0.22,
                    0.45 + Math.random() * 0.35,
                    0.075
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

        // --- Thorns on Stem ---
        this.createThorns(stemMat);

        // --- Leaves ---
        this.createLeaves(stemMat);

        // --- Obsidian Mirror Pedestal with Concentric Glowing Ripple Rings ---
        this.createObsidianPedestal();
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

    // --- 🌿 Realistic Curved Thorns ---
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

        // Concentric Glowing Neon Rings
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
        // Soft volumetric halo behind the flower
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

    // --- 🎨 Switch Theme Palette Smoothly ---
    setTheme(themeKey) {
        if (!this.themes[themeKey]) return;
        this.currentTheme = themeKey;
        const theme = this.themes[themeKey];

        // Update lighting colors
        if (this.rimLight) this.rimLight.color.setHex(theme.rimColor);
        if (this.keyLight) this.keyLight.color.setHex(theme.keyColor);
        if (this.coreLight) this.coreLight.color.setHex(theme.haloColor);
        if (this.dustPoints) this.dustPoints.material.color.setHex(theme.dustColor);

        // Update ripple rings
        this.rippleRings.forEach(ring => {
            ring.material.color.setHex(theme.rimColor);
        });

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

        // Golden stamen reveal during bloom
        if (this.stamenGroup) {
            const stamenScale = 0.4 + this.bloomProgress * 0.6;
            this.stamenGroup.scale.setScalar(stamenScale);
            this.stamenGroup.rotation.y = elapsed * 0.05;
        }

        // Halo gentle pulse
        if (this.haloMesh) {
            this.haloMesh.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.08);
        }

        // Concentric ripples pulse
        this.rippleRings.forEach((ring, idx) => {
            ring.scale.setScalar(1 + Math.sin(elapsed * 2 + idx) * 0.015);
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
