// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    initCountdown();
    initTimelineProgress();
    initEnvelopeAndRSVP();
});

/* ==========================================================================
   1. Canvas Particles (Hearts & Sparkles)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.reset();
            // Start at random heights on load
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.5 + 0.15;
            this.isHeart = Math.random() > 0.6; // 40% chance of hearts, 60% circles
            this.color = this.isHeart ? "#ff8fa3" : "#ffd166";
            this.wobble = Math.random() * Math.PI;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
            
            // Reset if out of bounds
            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            if (this.isHeart) {
                // Draw heart
                const size = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.bezierCurveTo(
                    this.x - size / 2, this.y - size / 2, 
                    this.x - size, this.y + size / 3, 
                    this.x, this.y + size
                );
                ctx.bezierCurveTo(
                    this.x + size, this.y + size / 3, 
                    this.x + size / 2, this.y - size / 2, 
                    this.x, this.y
                );
                ctx.fill();
            } else {
                // Draw circular sparkle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // Create 45 particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   2. Date Countdown Timer
   ========================================================================== */
function initCountdown() {
    const dSpan = document.getElementById("days");
    const hSpan = document.getElementById("hours");
    const mSpan = document.getElementById("minutes");
    const sSpan = document.getElementById("seconds");
    const msg = document.getElementById("countdownMsg");
    
    if (!dSpan) return;
    
    // Target dating time: 18:30 June 7th, 2026
    function getNextTargetDate() {
        return new Date(2026, 5, 7, 18, 30, 0).getTime();
    }
    
    const targetTime = getNextTargetDate();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetTime - now;
        
        if (difference <= 0) {
            dSpan.innerText = "00";
            hSpan.innerText = "00";
            mSpan.innerText = "00";
            sSpan.innerText = "00";
            msg.innerText = "Đã đến giờ hẹn hò rồi! Đi thôi em yêu ơi! ❤️✨";
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        dSpan.innerText = days.toString().padStart(2, "0");
        hSpan.innerText = hours.toString().padStart(2, "0");
        mSpan.innerText = minutes.toString().padStart(2, "0");
        sSpan.innerText = seconds.toString().padStart(2, "0");
        
        if (days === 0 && hours === 0 && minutes < 30) {
            msg.innerText = "Chỉ còn một chút nữa thôi, háo hức quá đi! 🥰";
        } else {
            msg.innerText = "Đang chờ đợi khoảnh khắc gặp em... ✨";
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================================================


/* ==========================================================================
   4. Scroll Progress & Card Entry Fade-in
   ========================================================================== */
function initTimelineProgress() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const progressLine = document.getElementById("timelineProgress");
    
    if (!timelineItems.length || !progressLine) return;
    
    // Scroll progress handler
    function updateProgress() {
        const timeline = document.querySelector(".timeline-container");
        if (!timeline) return;
        
        const timelineRect = timeline.getBoundingClientRect();
        const timelineHeight = timelineRect.height;
        const windowHeight = window.innerHeight;
        
        // Find position of progress starting/ending point
        const startPoint = windowHeight * 0.7; // Top of line progress
        
        // Calculate progress percentage
        let progress = 0;
        const relativeStart = -timelineRect.top + startPoint;
        
        if (relativeStart > 0) {
            progress = (relativeStart / timelineHeight) * 100;
        }
        
        // Limit bounds between 0 and 100%
        progress = Math.min(Math.max(progress, 0), 100);
        progressLine.style.height = `${progress}%`;
    }
    
    // Intersection observer for fading cards in & highlighting active nodes
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "-10% 0px -15% 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.classList.add("active");
            } else {
                // Remove active when scrolled out, keep visible
                entry.target.classList.remove("active");
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
    updateProgress();
}



/* ==========================================================================
   6. Secret Envelope Letter & RSVP Button interactions
   ========================================================================== */
function initEnvelopeAndRSVP() {
    const envelope = document.getElementById("envelope");
    const rsvpContainer = document.getElementById("rsvpContainer");
    const typewriterText = document.getElementById("typewriterText");
    const btnYes = document.getElementById("btnYes");
    const btnNo = document.getElementById("btnNo");
    
    if (!envelope || !rsvpContainer || !typewriterText) return;
    
    let isOpened = false;
    
    const letterMessage = `Gửi embee của anh,\n\nHôm nay anh đã lên một lịch trình thật chi tiết và đặc biệt dành riêng cho hai đứa mình.\n\nHy vọng ebeee sẽ thích ạ! Hẹn gặp ebee vào lúc 18:30 Chủ Nhật 7 tháng 6 nhenn!`;
    
    function startTypewriter() {
        let i = 0;
        typewriterText.innerHTML = "";
        
        function type() {
            if (i < letterMessage.length) {
                // Replace newlines with HTML linebreaks
                if (letterMessage.charAt(i) === '\n') {
                    typewriterText.innerHTML += '<br>';
                } else {
                    typewriterText.innerHTML += letterMessage.charAt(i);
                }
                i++;
                // Slight random delay to mimic natural handwriting speed
                setTimeout(type, Math.random() * 25 + 15);
            } else {
                // Typing finished, reveal RSVP block
                rsvpContainer.classList.remove("hidden");
                setTimeout(() => {
                    rsvpContainer.classList.add("fade-in");
                }, 100);
            }
        }
        type();
    }
    
    envelope.addEventListener("click", () => {
        if (isOpened) return; // Only trigger opening sequence once
        
        isOpened = true;
        envelope.classList.add("open");
        
        // Start typewriter once letter transitions up
        setTimeout(startTypewriter, 800);
    });
    
    // Yes Button RSVP (confetti & cute response card)
    btnYes.addEventListener("click", () => {
        // Trigger Canvas Confetti
        if (typeof confetti === "function") {
            // Heart shapes or standard explosion
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ff5e7e', '#ffd166', '#ff8fa3', '#ffffff']
            });
            
            // Multiple confetti bursts
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
            }, 250);
            
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 400);
        }
        
        // Replace RSVP section content with cute confirmation card
        rsvpContainer.style.transition = "opacity 0.3s ease";
        rsvpContainer.style.opacity = 0;
        
        setTimeout(() => {
            rsvpContainer.innerHTML = `
                <div class="glass" style="padding: 20px; border: 1.5px solid var(--primary); box-shadow: 0 0 15px var(--primary-glow); border-radius: 16px; margin-top: 15px;">
                    <p style="font-size: 1.25rem; font-weight: 700; color: var(--text-pink); margin-bottom: 8px;">Yayyy! Em đồng ý rồi nha! 🥰🎉</p>
                    <p style="font-size: 0.95rem; color: var(--text-white);">Anh sẽ qua đón em đúng giờ. Mau đi chuẩn bị đồ đẹp thôi công chúa của anh! Moahhh! 😘❤️</p>
                </div>
            `;
            rsvpContainer.style.opacity = 1;
        }, 300);
    });
    
    // Dodging Prank for No Button
    function teleportNoButton() {
        const container = rsvpContainer.querySelector(".rsvp-actions");
        const containerRect = container.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();
        
        // Calculate max random offsets within the buttons container bounds
        const maxDeltaX = containerRect.width - btnRect.width;
        const maxDeltaY = containerRect.height - btnRect.height;
        
        // Generate random percentage coordinate shifts
        let randomX = Math.random() * maxDeltaX;
        let randomY = (Math.random() - 0.5) * 60; // Up and down displacement
        
        // Set coordinates inline
        btnNo.style.position = "absolute";
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        btnNo.style.margin = "0";
    }
    
    btnNo.addEventListener("mouseover", teleportNoButton);
    btnNo.addEventListener("mouseenter", teleportNoButton);
    btnNo.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent double tap zoom
        teleportNoButton();
    });
}
