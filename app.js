/* ==========================================================================
   AETHER STUDIO — Premium Interactive Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Particle Canvas System
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
            this.color = `rgba(6, 182, 212, ${Math.random() * 0.15 + 0.05})`; // Cyan glowing particles
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Loop particles back into view if they drift off-screen
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // 2. Custom Mouse Follow Glow
    const mouseGlow = document.getElementById('mouseGlow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateMouseGlow() {
        // Easing interpolation for luxury lag effect
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        mouseGlow.style.left = `${currentX}px`;
        mouseGlow.style.top = `${currentY}px`;

        requestAnimationFrame(animateMouseGlow);
    }
    animateMouseGlow();

    // Hover scales on the mouse glow for interactive response
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, .faq-question, .filter-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            mouseGlow.style.width = '750px';
            mouseGlow.style.height = '750px';
            mouseGlow.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(37, 99, 235, 0.04) 40%, rgba(0,0,0,0) 70%)';
        });
        el.addEventListener('mouseleave', () => {
            mouseGlow.style.width = '600px';
            mouseGlow.style.height = '600px';
            mouseGlow.style.background = 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.03) 40%, rgba(0,0,0,0) 70%)';
        });
    });

    // 3. Magnetic Buttons with Ripple Canvas
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Attract the button and text independently to create parallax depth
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            const text = btn.querySelector('.btn-text');
            if (text) {
                text.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            const text = btn.querySelector('.btn-text');
            if (text) {
                text.style.transform = 'translate(0px, 0px)';
            }
        });
        
        // Dynamic ripple click animation on primary buttons canvas
        const canvas = btn.querySelector('.ripple-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let radius = 0;
        let maxRadius = 0;
        let clickX = 0;
        let clickY = 0;
        let opacity = 1;

        function resizeCanvas() {
            canvas.width = btn.offsetWidth;
            canvas.height = btn.offsetHeight;
        }
        resizeCanvas();

        btn.addEventListener('click', (e) => {
            resizeCanvas();
            const rect = btn.getBoundingClientRect();
            clickX = e.clientX - rect.left;
            clickY = e.clientY - rect.top;
            radius = 0;
            opacity = 1;
            maxRadius = Math.max(btn.offsetWidth, btn.offsetHeight) * 1.5;
            cancelAnimationFrame(animationFrame);
            animateRipple();
        });

        function animateRipple() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.beginPath();
            ctx.arc(clickX, clickY, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.18})`;
            ctx.fill();
            
            radius += 3.5;
            opacity = 1 - (radius / maxRadius);
            
            if (radius < maxRadius) {
                animationFrame = requestAnimationFrame(animateRipple);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    });

    // 4. 3D Tilt Cards & Custom Card Radial Glow Positioner
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            // Set custom parameters to update the CSS glow background positioning
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Rotational calculations relative to card boundaries
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = -(y - centerY) / (centerY / 8); // Max ~8 degrees of rotation
            const rotateY = (x - centerX) / (centerX / 8);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 5. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserverOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Section Scroll Spy for Active Navigation Indicators
    const sections = document.querySelectorAll('.scroll-spy-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.getElementById('navIndicator');

    function updateNavIndicator(activeLink) {
        if (!activeLink || window.innerWidth <= 768) {
            indicator.style.opacity = '0';
            return;
        }
        const rect = activeLink.getBoundingClientRect();
        const navRect = activeLink.parentElement.getBoundingClientRect();
        indicator.style.left = `${rect.left - navRect.left}px`;
        indicator.style.width = `${rect.width}px`;
        indicator.style.opacity = '1';
    }

    const spyObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('data-sec') === id) {
                        link.classList.add('active');
                        updateNavIndicator(link);
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, spyObserverOptions);

    sections.forEach(section => {
        spyObserver.observe(section);
    });

    // Re-verify navigation indicator boundaries on window resizing
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updateNavIndicator(activeLink);
    });
    
    // Initial indicator setup
    const initialActive = document.querySelector('.nav-link.active');
    if (initialActive) {
        setTimeout(() => updateNavIndicator(initialActive), 300);
    }

    // Header scroll background transitions
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 7. Typing Animation for Hero Sub-Headline
    const typedTextSpan = document.getElementById("typedText");
    const textArray = ["Web Application Development", "Mobile App Development", "Digital Marketing", "Presentation Design", "eBook Creation"];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 1800;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, 1200);
    }

    // 8. Stats Incremental Counting Animation
    const statNumbers = document.querySelectorAll('.stat-number, .stat-number-hours');
    const statsObserverOptions = {
        root: null,
        threshold: 0.5
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                let currentCount = 0;
                const duration = 1800; // 1.8 seconds duration
                const increment = countTo / (duration / 16); // ~60fps step
                
                function updateCount() {
                    currentCount += increment;
                    if (currentCount >= countTo) {
                        target.textContent = countTo;
                    } else {
                        target.textContent = Math.floor(currentCount);
                        requestAnimationFrame(updateCount);
                    }
                }
                
                requestAnimationFrame(updateCount);
                observer.unobserve(target);
            }
        });
    }, statsObserverOptions);

    statNumbers.forEach(num => {
        statsObserver.observe(num);
    });

    // 9. Portfolio Filtering Grid logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    // 10. FAQ Accordions toggle details
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Collapse all other accordion items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 11. Contact Form Simulation & Feedback
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('contactSubmitBtn');
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your request has been successfully submitted.';
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.style.pointerEvents = 'all';
                contactForm.reset();
                
                // Clear success notification
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1800);
        });
    }

    // 12. Mobile Navbar Menu drawer action
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu upon navigation clicks
        const navLinksMobile = document.querySelectorAll('.nav-link');
        navLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 13. Skills Progress Fill Animation
    const progressFills = document.querySelectorAll('.reveal-progress');
    const progressObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width;
                observer.unobserve(fill);
            }
        });
    }, progressObserverOptions);

    progressFills.forEach(fill => {
        progressObserver.observe(fill);
    });
    
});
