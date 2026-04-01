/* ============================================
   VẠN XUÂN HERITAGE — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2000);
    });
    // Fallback: hide preloader after 4 seconds max
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 4000);

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Mobile Navigation ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === Active Nav Link ===
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // === Scroll Animations (Intersection Observer) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // === Counter Animation ===
    function animateCounter(el) {
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(2);
            } else {
                el.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal ? target.toFixed(2) : target;
            }
        }

        requestAnimationFrame(update);
    }

    // Observe stat numbers
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stat-number[data-count]').forEach(el => {
        statObserver.observe(el);
    });

    // === Hero Particles ===
    function createParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const count = window.innerWidth < 768 ? 15 : 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = (Math.random() * 6) + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            container.appendChild(particle);
        }
    }
    createParticles();

    // === Lightbox for Masterplan ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const masterplanZoom = document.getElementById('masterplanZoom');
    const masterplanViewer = document.getElementById('masterplanViewer');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (masterplanZoom) {
        masterplanZoom.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = masterplanViewer.querySelector('img');
            openLightbox(img.src);
        });
    }

    if (masterplanViewer) {
        masterplanViewer.addEventListener('click', () => {
            const img = masterplanViewer.querySelector('img');
            openLightbox(img.src);
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // === Contact Form — 2-Step + Google Sheets + Email Integration ===
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaJyB7nnTPElr5oUUeRKzABW1M2d6WUy5aWcA5vxs8rAYzjYOsNJnoaKSGTxD-ThqEXg/exec'; // ← Thay bằng URL deploy của Google Apps Script

    const contactForm = document.getElementById('contactForm');
    const formStep1 = document.getElementById('formStep1');
    const formStep2 = document.getElementById('formStep2');
    const btnNextStep = document.getElementById('btnNextStep');
    const btnPrevStep = document.getElementById('btnPrevStep');
    const stepDots = document.querySelectorAll('.step-dot');
    const stepLine = document.querySelector('.step-line');

    // Step Navigation
    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            const emailInput = document.getElementById('email');
            if (!emailInput.value.trim() || !emailInput.checkValidity()) {
                emailInput.reportValidity();
                return;
            }
            // Transition to Step 2
            formStep1.classList.remove('active');
            formStep2.classList.add('active');
            stepDots[0].classList.remove('active');
            stepDots[0].classList.add('completed');
            stepDots[1].classList.add('active');
            if (stepLine) stepLine.classList.add('active');
        });
    }

    if (btnPrevStep) {
        btnPrevStep.addEventListener('click', () => {
            formStep2.classList.remove('active');
            formStep1.classList.add('active');
            stepDots[1].classList.remove('active');
            stepDots[0].classList.remove('completed');
            stepDots[0].classList.add('active');
            if (stepLine) stepLine.classList.remove('active');
        });
    }

    // Form Submit
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');

            // Validate
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!fullName || !phone) {
                alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

            try {
                const formData = {
                    hoTen: fullName,
                    email: email,
                    soDienThoai: phone,
                    ghiChu: message,
                    thoiGian: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
                };

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                // Show success
                contactForm.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3><i class="fas fa-heart" style="color: #e74c3c"></i> Cảm ơn bạn!</h3>
                        <p>Chúng tôi đã nhận được thông tin đăng ký của bạn.<br>
                        Đội ngũ tư vấn sẽ liên hệ lại trong vòng <strong>30 phút</strong>.</p>
                        <br>
                        <p style="font-size: 13px; color: #95a5a6;">
                            <i class="fas fa-phone-alt" style="color: #27ae60;"></i> 
                            Hoặc gọi ngay <a href="tel:0928569186" style="color: #1B6B3A; font-weight: 600;">0928 569 186</a>
                        </p>
                    </div>
                `;
            } catch (error) {
                console.error('Form submission error:', error);
                contactForm.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3><i class="fas fa-heart" style="color: #e74c3c"></i> Cảm ơn bạn!</h3>
                        <p>Chúng tôi đã nhận được thông tin đăng ký của bạn.<br>
                        Đội ngũ tư vấn sẽ liên hệ lại trong vòng <strong>30 phút</strong>.</p>
                    </div>
                `;
            }
        });
    }

    // === Smooth Scroll for all anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Parallax-like effect on hero (subtle) ===
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroContent = document.querySelector('.hero-content');
                if (heroContent && scrollY < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

});
