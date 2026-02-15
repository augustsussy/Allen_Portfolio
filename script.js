// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler (guarded in case form is missing)
const contactFormEl = document.querySelector('.contact-form');
if (contactFormEl) {
    contactFormEl.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values (not used here, but left for future enhancements)
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';

        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
    });
}

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ENHANCED PARALLAX SCROLLING FOR ALL SECTIONS
let ticking = false;

function updateParallax() {
    // Keep the scroll-driven parallax minimal and focused on the hero
    const scrolled = window.pageYOffset;

    const hero = document.querySelector('#home');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            // Use a smaller, clamped translate and GPU-accelerated transform
            const maxTranslate = 60; // px
            const y = Math.min(maxTranslate, Math.max(-maxTranslate, scrolled * 0.2));
            heroContent.style.transform = `translate3d(0, ${y}px, 0)`;

            // Slight opacity fade but clamped between 0.35 and 1 for readability
            const opacity = Math.max(0.35, 1 - (scrolled * 0.0015));
            heroContent.style.opacity = opacity;
        }
    }

    ticking = false;
}

// Optimized scroll handler with requestAnimationFrame
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial states for animated elements and reveal them once when they enter viewport
    const selectors = [
        '.service-card',
        '.project-card',
        '.resume-item',
        '.about-text',
        '.about-image',
        '.contact-form',
        '.section-heading'
    ];

    // Apply initial hidden state with small offsets
    document.querySelectorAll(selectors.join(',')).forEach(el => {
        el.style.opacity = '0';
        el.style.willChange = 'transform, opacity';
        // Default transition for reveal (will be overridden for hero)
        el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease';
    });

    // Per-type initial transform offsets
    document.querySelectorAll('.service-card').forEach(el => el.style.transform = 'translate3d(0, 60px, 0)');
    document.querySelectorAll('.project-card').forEach(el => el.style.transform = 'translate3d(0, 40px, 0)');
    document.querySelectorAll('.resume-item').forEach(el => el.style.transform = 'translate3d(40px, 0, 0)');
    document.querySelectorAll('.about-text').forEach(el => el.style.transform = 'translate3d(-50px, 0, 0)');
    document.querySelectorAll('.about-image').forEach(el => el.style.transform = 'translate3d(50px, 0, 0) scale(0.9)');
    document.querySelectorAll('.contact-form').forEach(el => el.style.transform = 'translate3d(0, 50px, 0)');
    document.querySelectorAll('.section-heading').forEach(el => el.style.transform = 'translate3d(0, 30px, 0)');

    // Hero gets a quicker transition for responsive parallax
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transition = 'transform 0.2s ease-out, opacity 0.3s ease';
        heroContent.style.willChange = 'transform, opacity';
    }

    // IntersectionObserver to reveal elements once when they enter viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.18
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                // Reveal: reset transform and opacity
                el.style.transform = 'translate3d(0,0,0)';
                el.style.opacity = '1';

                // Stop observing once revealed to avoid flicker and extra work
                obs.unobserve(el);
            }
        });
    }, observerOptions);

    // Observe all elements in the selector list
    document.querySelectorAll(selectors.join(',')).forEach(el => revealObserver.observe(el));

    // Trigger initial hero parallax
    updateParallax();
});