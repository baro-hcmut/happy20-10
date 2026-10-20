/**
 * 🌟 20/10 Enchanted Experience Orchestrator
 * Manages user interactions, modal dialogues, fortune drawing, and share links
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engines
    const particleEngine = new ParticleEngine('particles-canvas');
    window.particleEngine = particleEngine;

    const flowerEngine = new Flower3DEngine('flower-3d-container');
    window.flowerEngine = flowerEngine;

    // 2. Parse URL Params for Recipient Name
    const urlParams = new URLSearchParams(window.location.search);
    let recipientName = urlParams.get('to') || urlParams.get('name') || 'Những Cô Gái Tuyệt Vời';
    recipientName = decodeURIComponent(recipientName).trim();

    // Elements
    const introStage = document.getElementById('stage-intro');
    const gardenStage = document.getElementById('stage-garden');
    const openGiftBtn = document.getElementById('btn-open-gift');
    const recipientDisplays = document.querySelectorAll('.dynamic-recipient');
    const celebrationOverlay = document.getElementById('celebration-overlay');

    // Update Recipient Displays
    function updateRecipientDisplays(name) {
        recipientDisplays.forEach(el => {
            el.textContent = name;
        });
    }
    updateRecipientDisplays(recipientName);

    // 3. Audio & Visualizer Controls
    const btnMusic = document.getElementById('btn-toggle-music');
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

    // 4. ✨ Open Gift Box Ceremony
    if (openGiftBtn) {
        openGiftBtn.addEventListener('click', () => {
            // Start audio & play opening SFX
            if (window.soundEngine) {
                window.soundEngine.playGiftOpen();
                window.soundEngine.startMusic();
                updateMusicUI(true);
            }

            // Confetti explosion
            if (window.confetti) {
                window.confetti({
                    particleCount: 100,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#ffffff']
                });
            }

            // Trigger celebration banner & fireworks
            celebrationOverlay.classList.add('active');
            particleEngine.autoFireworksEnabled = true;

            // Launch 4 staggered fireworks
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.3, window.innerHeight * 0.25, 350), 300);
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.7, window.innerHeight * 0.22, 45), 900);
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.5, window.innerHeight * 0.18, 330), 1600);
            setTimeout(() => particleEngine.launchHeartFirework(window.innerWidth * 0.8, window.innerHeight * 0.30, 280), 2300);

            // Release 3 sky lanterns
            setTimeout(() => particleEngine.releaseSkyLantern(`Chúc ${recipientName} 20/10 Rực Rỡ 💖`), 800);
            setTimeout(() => particleEngine.releaseSkyLantern("Luôn Xinh Đẹp & Hạnh Phúc ✨"), 1500);
            setTimeout(() => particleEngine.releaseSkyLantern("Vạn Sự Cát Tường 🌸"), 2200);

            // Hide Intro Stage with smooth fade
            introStage.classList.add('fade-out');

            // Trigger 3D Rose Bloom
            setTimeout(() => {
                flowerEngine.startBloomAnimation();
            }, 1000);

            // Reveal Garden UI
            setTimeout(() => {
                introStage.style.display = 'none';
                celebrationOverlay.classList.remove('active');
                gardenStage.classList.add('active');
                particleEngine.autoFireworksEnabled = false;

                // Show greeting letter on first entry
                setTimeout(() => {
                    openModal('modal-letter');
                }, 1400);
            }, 3600);
        });
    }

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

                // Update URL parameter without reload
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
            desc: 'Chúc bạn mỗi ngày trôi qua đều xinh đẹp kiêu sa như đóa hồng nhung, tự tin sải bước và luôn là tâm điểm của sự ngưỡng mộ!'
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
            desc: 'Độc lập về tài chính, tự chủ trong cảm xúc, tự tin làm những điều mình khao khát và viết nên câu chuyện cuộc đời rực rỡ nhất!'
        },
        {
            icon: '🌸',
            title: 'Bình Yên Tâm Hồn',
            badge: 'An Nhiên Tự Tại',
            quote: 'Bình yên không phải nơi không có bão, mà là tâm tĩnh lặng giữa ngàn giông gió.',
            desc: 'Chúc bạn tìm thấy sự an tĩnh trong từng hơi thở, nụ cười luôn đọng nơi khoé mắt và mỗi ngày đều thưởng ngoạn trọn vẹn thi vị nhân gian.'
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
            desc: 'Sự nghiệp thăng tiến vững chãi, mọi thử thách đều là bệ phóng giúp bạn khẳng định tài năng và bản lĩnh phi thường của mình!'
        }
    ];

    const fortuneCardContainer = document.getElementById('fortune-cards-grid');
    const fortuneResultModal = document.getElementById('fortune-result-card');

    function initFortuneCards() {
        if (!fortuneCardContainer) return;
        fortuneCardContainer.innerHTML = '';

        // Shuffle deck
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

    // 9. Toast Notification Helper
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
