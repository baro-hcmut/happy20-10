/**
 * 🌟 20/10 Enchanted Experience Orchestrator - Masterclass Suite
 * Orchestrates ceremonies, 3D interaction, Polaroid photo studio,
 * cinematic movie mode, bouquet switching, and fortune card deck.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engines
    const particleEngine = new ParticleEngine('particles-canvas');
    window.particleEngine = particleEngine;

    const flowerEngine = new Flower3DEngine('flower-3d-container');
    window.flowerEngine = flowerEngine;

    // 2. Parse URL Params for Recipient Name
    const urlParams = new URLSearchParams(window.location.search);
    let recipientName = urlParams.get('to') || urlParams.get('name') || 'Bạn';
    recipientName = decodeURIComponent(recipientName).trim();

    // Elements
    const recipientDisplays = document.querySelectorAll('.dynamic-recipient');

    // Update Recipient Displays
    function updateRecipientDisplays(name) {
        recipientDisplays.forEach(el => {
            el.textContent = name;
        });
    }
    updateRecipientDisplays(recipientName);

    // 3. Audio & Visualizer Controls
    const btnMusic = document.getElementById('btn-toggle-music');
    const btnMusicMenu = document.getElementById('btn-music-menu');
    const musicPopover = document.getElementById('music-popover');
    const musicIcon = document.getElementById('music-icon');
    const visualizerBars = document.querySelectorAll('.visualizer-bar');

    if (btnMusic) {
        btnMusic.addEventListener('click', () => {
            if (window.soundEngine) {
                const isPlaying = window.soundEngine.toggleMusic();
                updateMusicUI(isPlaying);
            }
        });
    }

    if (btnMusicMenu && musicPopover) {
        btnMusicMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            musicPopover.classList.toggle('active');
            if (window.soundEngine) window.soundEngine.playSparkle();
        });

        document.addEventListener('click', () => {
            musicPopover.classList.remove('active');
        });

        const trackButtons = musicPopover.querySelectorAll('.track-btn');
        trackButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.dataset.track;
                if (window.soundEngine) {
                    window.soundEngine.setTrack(track);
                    updateMusicUI(true);
                }
                trackButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showToast(`Giai điệu: ${btn.textContent.trim()}`);
            });
        });
    }

    function updateMusicUI(isPlaying) {
        if (!btnMusic) return;
        if (isPlaying) {
            btnMusic.classList.add('playing');
            musicIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            `;
        } else {
            btnMusic.classList.remove('playing');
            musicIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l5.88 5.88c-.58.53-1.32.93-2.15 1.12v2.06c1.37-.27 2.6-.94 3.55-1.89L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z"/>
                </svg>
            `;
        }
    }

    // Audio Visualizer Animation Loop
    function updateVisualizer() {
        if (window.soundEngine && window.soundEngine.isPlaying && !window.soundEngine.isMuted) {
            const level = window.soundEngine.getAudioLevel();
            visualizerBars.forEach((bar, idx) => {
                const scale = Math.max(0.2, Math.sin(Date.now() * 0.008 + idx * 0.8) * level * 2.5 + level);
                bar.style.transform = `scaleY(${Math.min(1.8, scale)})`;
            });
        } else {
            visualizerBars.forEach(bar => {
                bar.style.transform = 'scaleY(0.2)';
            });
        }
        requestAnimationFrame(updateVisualizer);
    }
    updateVisualizer();

    // ==========================================================================
    // 4. 🎬 AUTOMATIC CINEMATIC STORYTELLING CONTROLLER
    // ==========================================================================
    const startScreen = document.getElementById('start-screen');
    const storyOverlay = document.getElementById('story-overlay');
    const storyScene1 = document.getElementById('story-scene-1');
    const storyScene2 = document.getElementById('story-scene-2');
    const storyScene3 = document.getElementById('story-scene-3');
    const stageGarden = document.getElementById('stage-garden');
    const btnSkipStory = document.getElementById('btn-skip-story');
    const btnReplayStory = document.getElementById('btn-replay-story');

    let storyTimeouts = [];
    let hasFlowerBloomed = false;
    let isStoryPlaying = false;

    function clearStoryTimeouts() {
        storyTimeouts.forEach(t => clearTimeout(t));
        storyTimeouts = [];
    }

    function addStoryTimeout(fn, delay) {
        const id = setTimeout(fn, delay);
        storyTimeouts.push(id);
        return id;
    }

    // --- Audio Unlock Helper ---
    function ensureAudioStarted() {
        if (window.soundEngine && !window.soundEngine.isPlaying && !window.soundEngine.isMuted) {
            window.soundEngine.startMusic();
            updateMusicUI(true);
        }
    }

    // --- Original Falling 3D Tumbling Hearts ---
    function createOriginalFallingHearts(count = 42) {
        const container = document.getElementById('hearts-container');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDelay = `${Math.random() * 6}s`;
            heart.style.animationDuration = `${Math.random() * 5 + 6}s`;
            const scale = Math.random() * 0.6 + 0.55;
            heart.style.transform = `scale(${scale})`;
            container.appendChild(heart);
        }
    }

    // --- Original Meteor Shooting Stars ---
    function startMeteors() {
        const meteorContainer = document.getElementById('meteor-container');
        if (!meteorContainer) return;
        meteorContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            meteor.style.left = `${Math.random() * 90 + 5}%`;
            meteor.style.top = `${Math.random() * 220 + 30}px`;
            meteor.style.animationDuration = `${Math.random() * 5 + 3}s`;
            meteor.style.animationDelay = `${Math.random() * 4}s`;
            meteorContainer.appendChild(meteor);
        }
    }

    // Initialize falling hearts & meteors immediately on page load!
    createOriginalFallingHearts(45);
    startMeteors();

    const flowerContainer = document.getElementById('flower-3d-container');

    // --- Automatic Cinematic Sequence ---
    function playCinematicSequence() {
        clearStoryTimeouts();
        isStoryPlaying = true;

        // UI Reset: Ensure 3D flower is completely hidden during intro & story scenes!
        if (flowerContainer) flowerContainer.classList.remove('visible');
        if (startScreen) startScreen.classList.add('hidden');
        if (stageGarden) stageGarden.classList.remove('active');
        if (storyOverlay) storyOverlay.classList.remove('hidden');
        if (btnSkipStory) btnSkipStory.classList.remove('hidden');
        if (btnReplayStory) btnReplayStory.classList.add('hidden');

        // Màn 1: Lời Mở Đầu Thi Vị (3.6 giây)
        if (storyScene1) storyScene1.classList.remove('hidden');
        if (storyScene2) storyScene2.classList.add('hidden');
        if (storyScene3) storyScene3.classList.add('hidden');
        if (particleEngine) particleEngine.autoFireworksEnabled = false;

        // Chuyển sang Màn 2: Món Quà & 20 Bong Bóng Trái Tim (sau 3.6s)
        addStoryTimeout(() => {
            if (!isStoryPlaying) return;
            if (storyScene1) storyScene1.classList.add('hidden');
            if (storyScene2) {
                storyScene2.classList.remove('hidden');
                if (window.soundEngine) window.soundEngine.playSparkle();
            }
        }, 3600);

        // Mở Hộp Quà ➔ Chuyển sang Màn 3: Đại Tiệc Pháo Hoa Ngân Hà (sau 7.4s)
        addStoryTimeout(() => {
            if (!isStoryPlaying) return;
            triggerGiftOpening();
        }, 7600);

        // Kết thúc Màn 3 ➔ Bước vào Màn 4: Vương Quốc Hoa Hồng 3D (sau 13.6s)
        addStoryTimeout(() => {
            if (!isStoryPlaying) return;
            enterGardenExperience();
        }, 13600);
    }

    // --- Hành động mở hộp quà & bắn pháo hoa ---
    function triggerGiftOpening() {
        if (window.soundEngine) {
            window.soundEngine.playGiftOpen();
        }
        if (window.confetti) {
            window.confetti({
                particleCount: 140,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#ffffff', '#e8ba5d']
            });
        }

        if (storyScene2) storyScene2.classList.add('hidden');
        if (storyScene3) storyScene3.classList.remove('hidden');

        // Bắn pháo hoa trái tim và thả đèn trời
        if (particleEngine) {
            particleEngine.autoFireworksEnabled = true;
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.3, window.innerHeight * 0.25, 350), 300);
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.7, window.innerHeight * 0.22, 45), 900);
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.5, window.innerHeight * 0.18, 330), 1600);
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.8, window.innerHeight * 0.28, 280), 2300);

            setTimeout(() => particleEngine.releaseSkyLantern(`Chúc ${recipientName} 20/10 Rực Rỡ 💖`), 600);
            setTimeout(() => particleEngine.releaseSkyLantern("Luôn Xinh Đẹp & Hạnh Phúc ✨"), 1400);
            setTimeout(() => particleEngine.releaseSkyLantern("Vạn Sự Cát Tường 🌸"), 2200);
        }
    }

    // --- Bước vào Vương Quốc Hoa Hồng 3D ---
    function enterGardenExperience() {
        clearStoryTimeouts();
        isStoryPlaying = false;

        if (particleEngine) particleEngine.autoFireworksEnabled = false;
        if (storyOverlay) storyOverlay.classList.add('hidden');
        if (startScreen) startScreen.classList.add('hidden');
        if (btnSkipStory) btnSkipStory.classList.add('hidden');
        if (btnReplayStory) btnReplayStory.classList.remove('hidden');

        // Show the 3D Rose Garden smoothly!
        if (flowerContainer) {
            flowerContainer.classList.add('visible');
        }

        if (stageGarden) {
            stageGarden.classList.add('active');
        }

        if (!hasFlowerBloomed && flowerEngine) {
            flowerEngine.startBloomAnimation();
            hasFlowerBloomed = true;
        }

        showToast("🌹 Chạm vào cánh hoa để gảy khúc tình ca hoặc ngắm bướm dạ quang!");
    }

    // --- Bắt đầu từ Start Screen ---
    if (startScreen) {
        startScreen.addEventListener('click', () => {
            ensureAudioStarted();
            playCinematicSequence();
        });
    }

    if (btnSkipStory) {
        btnSkipStory.addEventListener('click', (e) => {
            e.stopPropagation();
            ensureAudioStarted();
            enterGardenExperience();
        });
    }

    if (btnReplayStory) {
        btnReplayStory.addEventListener('click', (e) => {
            e.stopPropagation();
            ensureAudioStarted();
            playCinematicSequence();
            showToast("↺ Đang thưởng thức lại câu chuyện từ đầu...");
        });
    }

    // Hộp quà click ở Cảnh 2 để mở sớm nếu muốn
    const giftBoxClick = document.getElementById('gift-box-click');
    if (giftBoxClick) {
        giftBoxClick.addEventListener('click', () => {
            if (isStoryPlaying) {
                clearStoryTimeouts();
                triggerGiftOpening();
                addStoryTimeout(enterGardenExperience, 6000);
            }
        });
    }

    // --- Hiệu ứng Đom đóm bay lượn theo chuột ---
    const fireflies = document.querySelectorAll('.firefly');
    window.addEventListener('mousemove', (e) => {
        fireflies.forEach(firefly => {
            firefly.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });

    // --- Hiệu ứng Gợn sóng Click Pulse khi click trong vườn ---
    window.addEventListener('click', (e) => {
        if (stageGarden && stageGarden.classList.contains('active')) {
            const pulse = document.createElement('div');
            pulse.className = 'click-pulse';
            pulse.style.left = `${e.clientX}px`;
            pulse.style.top = `${e.clientY}px`;
            document.body.appendChild(pulse);
            setTimeout(() => pulse.remove(), 500);
        }
    });

    // 5. Modal Management
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.btn-close-modal');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('active');
        if (window.soundEngine) {
            window.soundEngine.playSparkle();
        }
    }
    window.openModal = openModal;

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // 6. Dock Navigation Actions
    // 💐 Toggle Royal Bouquet Mode
    const btnToggleBouquet = document.getElementById('btn-toggle-bouquet');
    const bouquetBtnLabel = document.getElementById('bouquet-btn-label');
    if (btnToggleBouquet) {
        btnToggleBouquet.addEventListener('click', () => {
            const nextMode = flowerEngine.toggleArrangement();
            if (nextMode === 'bouquet') {
                bouquetBtnLabel.textContent = "Đóa Đơn";
                showToast("💐 Đã chuyển sang Bó Hoa Hoàng Gia (Royal Bouquet)!");
            } else {
                bouquetBtnLabel.textContent = "Bó Hoa";
                showToast("🌹 Đã chuyển về Đóa Hồng Đơn (Royal Rose)!");
            }
        });
    }

    // 🎬 Cinematic Director Mode
    const btnCinematicMode = document.getElementById('btn-cinematic-mode');
    const subtitleText = document.getElementById('subtitle-text');
    const romanticQuotes = [
        `"Gửi ${recipientName}: Bạn xứng đáng với tất cả những điều dịu dàng và tốt đẹp nhất trên thế gian."`,
        `"Mỗi đóa hoa nở rộ giữa ngân hà đêm nay là một lời chúc ngọt ngào dành riêng cho bạn."`,
        `"Nụ cười của bạn là ánh dương rực rỡ nhất làm bừng sáng cả bầu trời tinh tú."`,
        `"Chúc ngày 20/10 của bạn vẹn tròn niềm vui, bình an trong tâm và hạnh phúc bất tận 💖"`
    ];
    let quoteIndex = 0;
    let quoteTimer = null;

    if (btnCinematicMode) {
        btnCinematicMode.addEventListener('click', () => {
            const isActive = flowerEngine.toggleCinematicMode();
            if (isActive) {
                if (quoteTimer) clearInterval(quoteTimer);
                subtitleText.textContent = romanticQuotes[quoteIndex % romanticQuotes.length];
                quoteTimer = setInterval(() => {
                    quoteIndex++;
                    subtitleText.style.opacity = 0;
                    setTimeout(() => {
                        subtitleText.textContent = romanticQuotes[quoteIndex % romanticQuotes.length];
                        subtitleText.style.opacity = 1;
                    }, 600);
                }, 7000);
            } else {
                if (quoteTimer) clearInterval(quoteTimer);
            }
        });
    }

    // 📸 Polaroid Photo Studio Capture
    const btnOpenPolaroid = document.getElementById('btn-open-polaroid');
    const polaroidCanvas = document.getElementById('polaroid-canvas');
    const btnDownloadPolaroid = document.getElementById('btn-download-polaroid');

    if (btnOpenPolaroid && polaroidCanvas) {
        btnOpenPolaroid.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.playCameraShutter();
            generatePolaroidPhoto();
            openModal('modal-polaroid');
        });
    }

    function generatePolaroidPhoto() {
        if (!flowerEngine || !flowerEngine.renderer) return;

        // Render current 3D frame cleanly
        flowerEngine.renderer.render(flowerEngine.scene, flowerEngine.camera);
        const flowerImg = new Image();
        flowerImg.src = flowerEngine.renderer.domElement.toDataURL('image/png');

        flowerImg.onload = () => {
            const w = 620;
            const h = 780;
            polaroidCanvas.width = w;
            polaroidCanvas.height = h;
            const ctx = polaroidCanvas.getContext('2d');

            // 1. Vintage Polaroid Paper Surface
            ctx.fillStyle = '#faf7f2';
            ctx.fillRect(0, 0, w, h);

            // Subtle paper border shadow
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, w - 2, h - 2);

            // 2. Photo Viewport Window (Dark camera frame)
            const photoX = 35;
            const photoY = 40;
            const photoW = w - 70;
            const photoH = 550;

            ctx.fillStyle = '#0a0812';
            ctx.fillRect(photoX, photoY, photoW, photoH);

            // Draw 3D flower image into viewport
            ctx.drawImage(flowerImg, photoX, photoY, photoW, photoH);

            // 3. Cute Washi Tape on Top Center
            ctx.save();
            ctx.translate(w / 2, 38);
            ctx.rotate(-0.03);
            ctx.fillStyle = 'rgba(255, 141, 161, 0.88)';
            ctx.fillRect(-65, -14, 130, 28);
            // Washi stripes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            for (let s = -60; s < 60; s += 10) {
                ctx.beginPath();
                ctx.moveTo(s, -14);
                ctx.lineTo(s + 8, 14);
                ctx.stroke();
            }
            ctx.restore();

            // 4. Handwritten Calligraphy at the Bottom
            ctx.font = '600 32px "Dancing Script", cursive';
            ctx.fillStyle = '#1c1524';
            ctx.textAlign = 'left';
            ctx.fillText(`Gửi ${recipientName} 💖`, 45, 640);

            ctx.font = '500 15px "Montserrat", sans-serif';
            ctx.fillStyle = '#6e5e78';
            ctx.fillText('Ngày Phụ Nữ Việt Nam • 20 Tháng 10, 2026', 45, 680);

            // 5. Special Gift Gold Foil Stamp at Bottom Right
            ctx.textAlign = 'right';
            ctx.font = '700 13px "Montserrat", sans-serif';
            ctx.fillStyle = '#b88628';
            ctx.fillText('✨ SPECIAL GIFT • FOR YOU ✨', w - 45, 680);

            ctx.font = '28px sans-serif';
            ctx.fillText('🌸', w - 45, 645);
        };
    }
    window.generatePolaroidPhoto = generatePolaroidPhoto;

    if (btnDownloadPolaroid && polaroidCanvas) {
        btnDownloadPolaroid.addEventListener('click', () => {
            const link = document.createElement('a');
            const safeName = recipientName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
            link.download = `Ky_Niem_20_10_${safeName}.png`;
            link.href = polaroidCanvas.toDataURL('image/png');
            link.click();
            showToast("📸 Đã tải ảnh Polaroid về máy thành công!");
            if (window.soundEngine) window.soundEngine.playSparkle();
        });
    }

    // 💌 Open Greeting Letter
    const btnOpenLetter = document.getElementById('btn-open-letter');
    if (btnOpenLetter) {
        btnOpenLetter.addEventListener('click', () => openModal('modal-letter'));
    }

    // 🎴 Open Fortune Cards Modal
    const btnOpenFortune = document.getElementById('btn-open-fortune');
    if (btnOpenFortune) {
        btnOpenFortune.addEventListener('click', () => {
            openModal('modal-fortune');
            initFortuneCards();
        });
    }

    // 🏮 Open Sky Lantern Modal
    const btnOpenLantern = document.getElementById('btn-open-lantern');
    if (btnOpenLantern) {
        btnOpenLantern.addEventListener('click', () => openModal('modal-lantern'));
    }

    // 🎆 Direct Firework Launch Button
    const btnLaunchFirework = document.getElementById('btn-launch-firework');
    if (btnLaunchFirework) {
        btnLaunchFirework.addEventListener('click', () => {
            const tx = Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.15;
            const ty = Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.15;
            particleEngine.launchHeartFirework(tx, ty);
            showToast("Đã bắn pháo hoa trái tim! 🎆💖");
        });
    }

    // 🎨 Flower Color Themes Menu
    const btnColorPalette = document.getElementById('btn-color-palette');
    const colorPopover = document.getElementById('color-popover');
    if (btnColorPalette && colorPopover) {
        btnColorPalette.addEventListener('click', (e) => {
            e.stopPropagation();
            colorPopover.classList.toggle('active');
            if (window.soundEngine) window.soundEngine.playSparkle();
        });

        document.addEventListener('click', () => {
            colorPopover.classList.remove('active');
        });

        colorPopover.addEventListener('click', (e) => e.stopPropagation());

        const themeButtons = colorPopover.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const themeKey = btn.dataset.theme;
                flowerEngine.setTheme(themeKey);

                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showToast(`Đã đổi màu hoa: ${btn.querySelector('.theme-name').textContent}`);
            });
        });
    }

    // ✏️ Personalize Recipient Modal
    const btnEditRecipient = document.getElementById('btn-edit-recipient');
    const inputRecipient = document.getElementById('input-recipient-name');
    const btnSaveRecipient = document.getElementById('btn-save-recipient');

    if (btnEditRecipient) {
        btnEditRecipient.addEventListener('click', () => {
            if (inputRecipient) inputRecipient.value = recipientName;
            openModal('modal-personalize');
        });
    }

    if (btnSaveRecipient) {
        btnSaveRecipient.addEventListener('click', () => {
            const newName = inputRecipient.value.trim();
            if (newName) {
                recipientName = newName;
                updateRecipientDisplays(recipientName);

                const newUrl = new URL(window.location);
                newUrl.searchParams.set('to', recipientName);
                window.history.replaceState({}, '', newUrl);

                closeModal(document.getElementById('modal-personalize'));
                showToast(`Đã đổi người nhận thành "${recipientName}" 💖`);
            }
        });
    }

    // 🔗 Share Link Button
    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', () => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(recipientName)}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast("✨ Đã sao chép link lời chúc vào clipboard!");
                if (window.soundEngine) window.soundEngine.playSparkle();
            }).catch(() => {
                showToast(`Link của bạn: ${shareUrl}`);
            });
        });
    }

    // 7. 🎴 Fortune Cards (Rút Quẻ May Mắn 20/10)
    const fortuneData = [
        {
            icon: '👑',
            title: 'Nhan Sắc Tỏa Sáng',
            badge: 'Thượng Thượng Quẻ',
            quote: 'Nụ cười của bạn là ánh dương rực rỡ nhất làm bừng sáng cả thế gian.',
            desc: 'Chúc bạn mỗi ngày trôi qua đều xinh đẹp kiêu sa như đóa hồng nhung, tự tin sải bước và luôn tràn ngập hạnh phúc!'
        },
        {
            icon: '✨',
            title: 'Vạn Sự Hanh Thông',
            badge: 'Đại Cát Đại Lợi',
            quote: 'Khi tâm bạn hướng về điều tươi sáng, vũ trụ sẽ hợp sức dẫn lối.',
            desc: 'Mọi dự định, ước mơ và kế hoạch trong công việc hay học tập của bạn sắp tới đều sẽ đơm hoa kết trái mỹ mãn ngoài mong đợi!'
        },
        {
            icon: '💖',
            title: 'Đong Đầy Yêu Thương',
            badge: 'Tình Duyên Viên Mãn',
            quote: 'Bạn xứng đáng được yêu thương bằng cả sự dịu dàng và chân thành nhất.',
            desc: 'Chúc bạn luôn được chở che, thấu hiểu và nâng niu. Trái tim bạn sẽ luôn tràn ngập sự ngọt ngào, ấm áp từ những người thân thương.'
        },
        {
            icon: '🍀',
            title: 'May Mắn Gõ Cửa',
            badge: 'Quý Nhân Phù Trợ',
            quote: 'May mắn không phải ngẫu nhiên, mà là phúc lành dành cho tâm hồn thuần khiết.',
            desc: 'Đi đến đâu bạn cũng sẽ gặp được cơ duyên tốt lành, những điều trắc trở tự khắc hóa nhẹ nhàng, niềm vui nhân lên gấp bội!'
        },
        {
            icon: '💎',
            title: 'Tự Do & Kiêu Hãnh',
            badge: 'Tâm Hồn Tự Do',
            quote: 'Hãy kiêu hãnh như một nữ hoàng và tự do như cánh hoa đón gió.',
            desc: 'Tự chủ trong cảm xúc, tự tin làm những điều mình khao khát và viết nên câu chuyện cuộc đời rực rỡ nhất!'
        },
        {
            icon: '🌸',
            title: 'Bình Yên Tâm Hồn',
            badge: 'An Nhiên Tự Tại',
            quote: 'Bình yên không phải nơi không có bão, mà là tâm tĩnh lặng giữa ngàn giông gió.',
            desc: 'Chúc bạn tìm thấy sự an tĩnh trong từng hơi thở, nụ cười luôn đọng nơi khoé mắt và mỗi ngày đều hạnh phúc an yên.'
        },
        {
            icon: '🧁',
            title: 'Ngọt Ngào Mỗi Ngày',
            badge: 'Cuộc Sống Thi Vị',
            quote: 'Cuộc sống là một tách trà, thêm vào nụ cười là ngọt ngào cả ngày dài.',
            desc: 'Ăn ngon mặc đẹp, ngủ tròn giấc say, luôn có những bất ngờ thú vị chờ đón bạn ở mỗi sớm mai thức dậy!'
        },
        {
            icon: '🎯',
            title: 'Thành Công Rực Rỡ',
            badge: 'Thăng Tiến Vượt Trội',
            quote: 'Mỗi giọt mồ hôi hôm nay là viên ngọc sáng lấp lánh cho vương miện ngày mai.',
            desc: 'Mọi thử thách đều là bệ phóng giúp bạn khẳng định tài năng và tỏa sáng rạng ngời!'
        }
    ];

    const fortuneCardContainer = document.getElementById('fortune-cards-grid');

    function initFortuneCards() {
        if (!fortuneCardContainer) return;
        fortuneCardContainer.innerHTML = '';

        const shuffled = [...fortuneData].sort(() => 0.5 - Math.random());

        shuffled.slice(0, 6).forEach((item, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'tarot-card';
            cardEl.innerHTML = `
                <div class="tarot-card-inner">
                    <div class="tarot-card-back">
                        <div class="tarot-pattern">
                            <span class="tarot-number">${index + 1}</span>
                            <div class="tarot-sigil">✨</div>
                            <span class="tarot-label">20/10</span>
                        </div>
                    </div>
                    <div class="tarot-card-front">
                        <div class="tarot-badge">${item.badge}</div>
                        <div class="tarot-icon">${item.icon}</div>
                        <div class="tarot-title">${item.title}</div>
                        <div class="tarot-quote">"${item.quote}"</div>
                        <div class="tarot-desc">${item.desc}</div>
                    </div>
                </div>
            `;

            cardEl.addEventListener('click', () => {
                if (!cardEl.classList.contains('flipped')) {
                    if (window.soundEngine) window.soundEngine.playCardFlip();
                    cardEl.classList.add('flipped');

                    if (window.confetti) {
                        window.confetti({
                            particleCount: 40,
                            spread: 60,
                            origin: { y: 0.7 },
                            colors: ['#ffd700', '#ff80ab', '#ffffff']
                        });
                    }
                }
            });

            fortuneCardContainer.appendChild(cardEl);
        });
    }
    window.initFortuneCards = initFortuneCards;

    // 8. 🏮 Release Custom Sky Lantern
    const btnSendLantern = document.getElementById('btn-send-lantern');
    const inputLanternWish = document.getElementById('input-lantern-wish');
    const quickWishChips = document.querySelectorAll('.wish-chip');

    quickWishChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (inputLanternWish) {
                inputLanternWish.value = chip.textContent;
            }
        });
    });

    if (btnSendLantern) {
        btnSendLantern.addEventListener('click', () => {
            const wish = inputLanternWish.value.trim() || `Chúc ${recipientName} 20/10 viên mãn! 💖`;
            particleEngine.releaseSkyLantern(wish);
            closeModal(document.getElementById('modal-lantern'));
            showToast(`🏮 Đã thả đèn trời mang điều ước: "${wish}"`);
        });
    }

    // ==========================================================================
    // 9. 🍾 ENCHANTED WISH BOTTLE MANAGER (LỌ THỦY TINH NGUYỆN ƯỚC)
    // ==========================================================================
    const btnOpenBottle = document.getElementById('btn-open-bottle');
    const modalWishBottle = document.getElementById('modal-wish-bottle');
    const tabBtnRead = document.getElementById('tab-btn-read');
    const tabBtnWrite = document.getElementById('tab-btn-write');
    const paneReadWish = document.getElementById('pane-read-wish');
    const paneWriteWish = document.getElementById('pane-write-wish');
    const wishScrollTarget = document.getElementById('wish-scroll-target');
    const btnDrawRandomWish = document.getElementById('btn-draw-random-wish');
    const btnGotoWriteWish = document.getElementById('btn-goto-write-wish');

    const inputWishTo = document.getElementById('input-wish-to');
    const inputWishMessage = document.getElementById('input-wish-message');
    const inputWishFrom = document.getElementById('input-wish-from');
    const btnSealBottleWish = document.getElementById('btn-seal-bottle-wish');
    const wishLinkContainer = document.getElementById('wish-link-container');
    const inputWishGeneratedLink = document.getElementById('input-wish-generated-link');
    const btnCopyWishLink = document.getElementById('btn-copy-wish-link');

    // Rich Poetic Wishes for Star Bottle
    const starWishesList = [
        {
            title: "Dịu Dàng & Tươi Vui",
            quote: "Mong bạn luôn rạng rỡ như đóa hồng nhung sớm mai, dịu dàng trong ánh mắt và ngập tràn niềm vui trong tim. Cầu chúc bạn mỗi ngày trôi qua đều là những ngày vui vẻ, bình an nhất!",
            from: "Một người bạn chân thành ✨"
        },
        {
            title: "Tỏa Sáng Ngọt Ngào",
            quote: "Bạn không cần phải trở thành một ai khác, bởi chính sự chân thành, nụ cười duyên dáng và nét đáng yêu của bạn đã là điều tuyệt vời nhất. Chúc bạn luôn hạnh phúc và an vui!",
            from: "Gửi tặng bạn 💖"
        },
        {
            title: "Bình An & An Nhiên",
            quote: "Giữa cuộc sống bộn bề, mong bạn luôn tìm thấy sự an yên, dịu ngọt. Nụ cười luôn nở trên môi, đêm về ngủ thật ngon giấc, sớm mai thức dậy ngập tràn năng lượng tươi vui!",
            from: "Vầng Trăng Dịu Dàng 🌙"
        },
        {
            title: "Trân Quý Nụ Cười Bạn",
            quote: "Cảm ơn vì sự hiện diện ấm áp và nụ cười rạng rỡ của bạn. Chúc ngày 20/10 của bạn ngập tràn hoa thơm, niềm vui bất ngờ và những điều tốt đẹp nhất!",
            from: "Đóa Hồng Thần Tiên 🌹"
        },
        {
            title: "Vạn Sự Cát Tường",
            quote: "Mỗi bước chân bạn đi đều ngập tràn may mắn, mọi điều bạn ấp ủ đều thuận buồm xuôi gió. Chúc bạn luôn là đóa hoa xinh tươi, rực rỡ và hạnh phúc theo cách của riêng mình!",
            from: "Ánh Sao Băng 🌠"
        }
    ];

    let currentWishIndex = 0;

    function renderStarWish() {
        if (!wishScrollTarget) return;

        // Check if there is a custom encoded wish in URL
        const customWish = urlParams.get('wish');
        const customFrom = urlParams.get('from');

        if (customWish) {
            wishScrollTarget.innerHTML = `
                <div class="wish-scroll-title">💌 Bức Thư Bí Mật Dành Riêng Cho Bạn</div>
                <p style="margin-bottom: 12px; font-weight: 600; color: #8c263e;">Gửi: ${recipientName} 🌹</p>
                <p style="font-size: 1.05rem; line-height: 1.75;">${decodeURIComponent(customWish)}</p>
                <div class="wish-scroll-from">— Ký tên: ${customFrom ? decodeURIComponent(customFrom) : 'Một người bạn gửi tặng'} ✨</div>
            `;
            return;
        }

        const wish = starWishesList[currentWishIndex % starWishesList.length];
        wishScrollTarget.innerHTML = `
            <div class="wish-scroll-title">${wish.title}</div>
            <p style="margin-bottom: 10px; font-weight: 600; color: #8c263e;">Gửi tặng: ${recipientName} 🌹</p>
            <p>${wish.quote}</p>
            <div class="wish-scroll-from">— ${wish.from}</div>
        `;
    }

    function openWishBottleModal() {
        renderStarWish();
        openModal('modal-wish-bottle');
        if (window.soundEngine) window.soundEngine.playCrystalChime();
    }
    window.openWishBottleModal = openWishBottleModal;

    if (btnOpenBottle) {
        btnOpenBottle.addEventListener('click', openWishBottleModal);
    }

    // Bottle Tab Switching
    if (tabBtnRead && tabBtnWrite && paneReadWish && paneWriteWish) {
        tabBtnRead.addEventListener('click', () => {
            tabBtnRead.classList.add('active');
            tabBtnWrite.classList.remove('active');
            paneReadWish.classList.add('active');
            paneWriteWish.classList.remove('active');
        });

        tabBtnWrite.addEventListener('click', () => {
            tabBtnWrite.classList.add('active');
            tabBtnRead.classList.remove('active');
            paneWriteWish.classList.add('active');
            paneReadWish.classList.remove('active');
            if (inputWishTo && !inputWishTo.value) inputWishTo.value = recipientName;
        });

        if (btnGotoWriteWish) {
            btnGotoWriteWish.addEventListener('click', () => {
                tabBtnWrite.click();
            });
        }
    }

    if (btnDrawRandomWish) {
        btnDrawRandomWish.addEventListener('click', () => {
            currentWishIndex++;
            renderStarWish();
            if (window.soundEngine) window.soundEngine.playSparkle();
        });
    }

    // Seal Personal Wish into Bottle & Generate Share Link
    if (btnSealBottleWish) {
        btnSealBottleWish.addEventListener('click', () => {
            const toName = (inputWishTo && inputWishTo.value.trim()) || recipientName;
            const message = (inputWishMessage && inputWishMessage.value.trim());
            const fromName = (inputWishFrom && inputWishFrom.value.trim()) || 'Một người bạn';

            if (!message) {
                showToast("Vui lòng nhập lời chúc của bạn trước khi niêm phong nhé! 💖");
                return;
            }

            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('to', toName);
            currentUrl.searchParams.set('wish', message);
            currentUrl.searchParams.set('from', fromName);

            if (inputWishGeneratedLink && wishLinkContainer) {
                inputWishGeneratedLink.value = currentUrl.toString();
                wishLinkContainer.classList.remove('hidden');
            }

            if (window.confetti) {
                window.confetti({
                    particleCount: 70,
                    spread: 80,
                    origin: { y: 0.65 },
                    colors: ['#ffd700', '#ff80ab', '#ffffff', '#e62b5a']
                });
            }

            if (window.soundEngine) window.soundEngine.playCrystalChime();
            showToast("✨ Đã niêm phong lời chúc vào Lọ Thủy Tinh thành công!");
        });
    }

    if (btnCopyWishLink && inputWishGeneratedLink) {
        btnCopyWishLink.addEventListener('click', () => {
            navigator.clipboard.writeText(inputWishGeneratedLink.value).then(() => {
                showToast("📋 Đã sao chép link Lọ Ước Nguyện vào bộ nhớ tạm!");
                if (window.soundEngine) window.soundEngine.playSparkle();
            }).catch(() => {
                inputWishGeneratedLink.select();
                showToast("Đã chọn toàn bộ link, bạn hãy nhấn Ctrl+C để sao chép!");
            });
        });
    }

    // If page is loaded with a secret wish parameter, notify the user with a welcoming hint!
    if (urlParams.has('wish')) {
        setTimeout(() => {
            showToast("💌 Bạn có một bức thư bí mật trong Lọ Thủy Tinh Ước Nguyện!");
        }, 4200);
    }

    // ==========================================================================
    // 10. 🎹 CUNG ĐÀN TÌNH CA (MELODY MODE CONTROLLER)
    // ==========================================================================
    const btnMelodyMode = document.getElementById('btn-melody-mode');
    const melodyPopover = document.getElementById('melody-popover');
    const melodyBtnLabel = document.getElementById('melody-btn-label');

    if (btnMelodyMode && melodyPopover) {
        btnMelodyMode.addEventListener('click', (e) => {
            e.stopPropagation();
            melodyPopover.classList.toggle('active');
            if (colorPopover) colorPopover.classList.remove('active');
            if (window.soundEngine) window.soundEngine.playSparkle();
        });

        document.addEventListener('click', () => {
            melodyPopover.classList.remove('active');
        });

        melodyPopover.addEventListener('click', (e) => e.stopPropagation());

        const songButtons = melodyPopover.querySelectorAll('.song-btn');
        songButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const songKey = btn.dataset.song;
                if (window.soundEngine) {
                    window.soundEngine.setMelodySong(songKey);
                }

                songButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const songName = btn.querySelector('.song-name').textContent;
                if (melodyBtnLabel) {
                    melodyBtnLabel.textContent = songKey === 'freestyle' ? 'Hợp Âm' : 'Tình Ca';
                }

                melodyPopover.classList.remove('active');
                showToast(`🎹 Chế độ đàn: ${songName}`);
            });
        });
    }

    // ==========================================================================
    // 11. 🎚️ BLOOM TIME-TRAVELER SLIDER & CONTROLLER
    // ==========================================================================
    const bloomRangeSlider = document.getElementById('bloom-range-slider');
    const bloomPercentLabel = document.getElementById('bloom-percent-label');
    const btnBloomBud = document.getElementById('btn-bloom-bud');
    const btnBloomFull = document.getElementById('btn-bloom-full');
    const btnBloomAuto = document.getElementById('btn-bloom-auto');

    if (bloomRangeSlider) {
        bloomRangeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) / 100;
            if (flowerEngine) {
                flowerEngine.setBloomProgress(val);
            }
            if (bloomPercentLabel) {
                bloomPercentLabel.textContent = `${e.target.value}%`;
            }
        });
    }

    if (btnBloomBud) {
        btnBloomBud.addEventListener('click', () => {
            if (bloomRangeSlider) bloomRangeSlider.value = 0;
            if (bloomPercentLabel) bloomPercentLabel.textContent = '0%';
            if (flowerEngine) flowerEngine.setBloomProgress(0.0);
            showToast("🌱 Đóa hoa trở về nụ hoa e ấp");
        });
    }

    if (btnBloomFull) {
        btnBloomFull.addEventListener('click', () => {
            if (bloomRangeSlider) bloomRangeSlider.value = 100;
            if (bloomPercentLabel) bloomPercentLabel.textContent = '100%';
            if (flowerEngine) flowerEngine.startBloomAnimation();
            showToast("🌹 Đóa hoa bung nở rực rỡ nhất!");
        });
    }

    if (btnBloomAuto) {
        btnBloomAuto.addEventListener('click', () => {
            if (bloomRangeSlider) bloomRangeSlider.value = 100;
            if (bloomPercentLabel) bloomPercentLabel.textContent = '100%';
            if (flowerEngine) flowerEngine.startBloomAnimation();
            showToast("✨ Đóa hoa bắt đầu tỏa hương ngào ngạt...");
        });
    }

    // 12. Toast Notification Helper
    function showToast(message) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.className = 'app-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3200);
    }
    window.showToast = showToast;
});

