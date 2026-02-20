// ═══════════════════════════════════════
// PROTECTION
// ═══════════════════════════════════════

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false; }
});
document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });

// ═══════════════════════════════════════
// DOWNLOAD (MODRINTH REDIRECT)
// ═══════════════════════════════════════

let isDownloading = false;
const MODRINTH_URL = 'https://cdn.modrinth.com/data/5otNeFmH/versions/dmrZKG90/enoughvisuals-1.0.jar';

async function downloadMod(btn) {
    if (isDownloading) return;
    
    isDownloading = true;
    btn.classList.add('loading');

    // Небольшая задержка для визуального отклика кнопки
    setTimeout(() => {
        // Открывает ссылку в новой вкладке
        window.open(MODRINTH_URL, '_blank');
        
        showToast('Для скачивания необходим VPN');

        // Возвращаем кнопку в исходное состояние
        setTimeout(() => { 
            isDownloading = false; 
            btn.classList.remove('loading'); 
        }, 1000);
    }, 800);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (toast && toastText) {
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}


// ═══════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════

const canvas = document.getElementById('particles-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let mouseX = -500, mouseY = -500;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * (canvas ? canvas.width : 1920);
        this.y = Math.random() * (canvas ? canvas.height : 1080);
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.3 + 0.05;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            this.x -= dx * ((120 - dist) / 120) * 0.008;
            this.y -= dy * ((120 - dist) / 120) * 0.008;
        }
        if (canvas) {
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
    }
    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 92, 191, ' + this.opacity + ')';
        ctx.fill();
    }
}

function initParticles() {
    if (!canvas) return;
    resizeCanvas();
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
    if (!ctx) return;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = 'rgba(124, 92, 191, ' + ((1 - dist / 100) * 0.08) + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
initParticles();
animateParticles();

// ═══════════════════════════════════════
// CURSOR GLOW
// ═══════════════════════════════════════

const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    let raf;
    document.addEventListener('mousemove', (e) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('active');
        });
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

// ═══════════════════════════════════════
// TYPING
// ═══════════════════════════════════════

const typingTexts = [
    'Лучшие бесплатные визуалы',
    'Красивые партиклы',
    'Минимум потерь FPS',
    'Гибкие настройки',
];
let textIdx = 0, charIdx = 0, deleting = false, speed = 80;

function typeText() {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const cur = typingTexts[textIdx];
    if (deleting) {
        el.textContent = cur.substring(0, charIdx - 1);
        charIdx--;
        speed = 35;
    } else {
        el.textContent = cur.substring(0, charIdx + 1);
        charIdx++;
        speed = 75;
    }
    if (!deleting && charIdx === cur.length) { speed = 2200; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % typingTexts.length; speed = 350; }
    setTimeout(typeText, speed);
}
setTimeout(typeText, 500);

// ═══════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ═══════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// ═══════════════════════════════════════
// COUNTER
// ═══════════════════════════════════════

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            animateCounter(el, parseInt(el.dataset.target));
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
    if (target === 0) { el.textContent = '0₽'; return; }
    let current = 0;
    const step = target / 50;
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target + '+';
            clearInterval(interval);
        } else {
            el.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// ═══════════════════════════════════════
// FAQ
// ═══════════════════════════════════════

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('active');
        f.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!wasActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
    }
}

// ═══════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════

function openLightbox(el) {
    const img = el.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ═══════════════════════════════════════
// BACK TO TOP
// ═══════════════════════════════════════

const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
});
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ═══════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════

document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            const menu = document.getElementById('mobile-menu');
            const btn = document.getElementById('mobile-menu-btn');
            if (menu) menu.classList.remove('open');
            if (btn) btn.classList.remove('active');
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ═══════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });
}

// ═══════════════════════════════════════
// TILT (desktop)
// ═══════════════════════════════════════

if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            card.style.transform = 'perspective(600px) rotateX(' + ((y - 0.5) * 5) + 'deg) rotateY(' + ((x - 0.5) * -5) + 'deg) translateY(-2px)';
            card.style.setProperty('--mouse-x', (x * 100) + '%');
            card.style.setProperty('--mouse-y', (y * 100) + '%');
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('download-btn-1165');
    if (btn) { btn.classList.remove('loading'); isDownloading = false; }
});