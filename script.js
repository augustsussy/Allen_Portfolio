/* =============================================
   PROJECTS GRID
   ============================================= */

(function () {
    'use strict';

    function buildMasonry(cards) {
        reattachHover();
    }

    function reattachHover() {
        document.querySelectorAll('.project-card').forEach(card => {
            if (card.dataset.hoverBound === 'true') {
                return;
            }

            card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
            card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
            card.dataset.hoverBound = 'true';
        });
    }

    function getVisibleCards() {
        return Array.from(document.querySelectorAll('.project-card:not([hidden])'));
    }

    function initMasonry() {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;

        buildMasonry(getVisibleCards());
    }

    window.__buildMasonry = buildMasonry;
    window.__getVisibleCards = getVisibleCards;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMasonry);
    } else {
        initMasonry();
    }
})();

/* =============================================
   HAMBURGER MENU
   ============================================= */

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeNav());
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navToggle.contains(e.target) &&
            !navMenu.contains(e.target)) {
            closeNav();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) closeNav();
    });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* =============================================
   ACTIVE NAV ON SCROLL
   ============================================= */

window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        if (pageYOffset >= section.offsetTop - 200) {
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

/* =============================================
   PARALLAX
   ============================================= */

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('#home');

    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            const maxTranslate = 60;
            const y = Math.min(maxTranslate, Math.max(-maxTranslate, scrolled * 0.2));
            heroContent.style.transform = `translate3d(0, ${y}px, 0)`;
            heroContent.style.opacity = Math.max(0.35, 1 - scrolled * 0.0015);
        }
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

/* =============================================
   DOMContentLoaded — REVEAL ANIMATIONS + FILTER
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Reveal animations --- */
    const selectors = [
        '.service-card',
        '.project-card',
        '.resume-item',
        '.about-text',
        '.about-image',
        '.contact-form',
        '.section-heading',
        '.experience-item'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(el => {
        el.style.opacity = '0';
        el.style.willChange = 'transform, opacity';
        el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease';
    });

    document.querySelectorAll('.service-card').forEach(el => el.style.transform = 'translate3d(0, 60px, 0)');
    document.querySelectorAll('.project-card').forEach(el => el.style.transform = 'translate3d(0, 40px, 0)');
    document.querySelectorAll('.resume-item').forEach(el => el.style.transform = 'translate3d(40px, 0, 0)');
    document.querySelectorAll('.about-text').forEach(el => el.style.transform = 'translate3d(-50px, 0, 0)');
    document.querySelectorAll('.about-image').forEach(el => el.style.transform = 'translate3d(50px, 0, 0) scale(0.9)');
    document.querySelectorAll('.contact-form').forEach(el => el.style.transform = 'translate3d(0, 50px, 0)');
    document.querySelectorAll('.section-heading').forEach(el => el.style.transform = 'translate3d(0, 30px, 0)');
    document.querySelectorAll('.experience-item').forEach(el => el.style.transform = 'translate3d(-40px, 0, 0)');

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transition = 'transform 0.2s ease-out, opacity 0.3s ease';
        heroContent.style.willChange = 'transform, opacity';
    }

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translate3d(0,0,0)';
                entry.target.style.opacity = '1';
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.18 });

    document.querySelectorAll(selectors.join(',')).forEach(el => revealObserver.observe(el));

    /* --- Filter pills --- */
    const filterPills = document.querySelectorAll('.filter-pill');

    if (filterPills.length) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => {
                    p.classList.remove('is-active');
                    p.setAttribute('aria-pressed', 'false');
                });
                pill.classList.add('is-active');
                pill.setAttribute('aria-pressed', 'true');

                const filter = pill.dataset.filter || 'all';

                /* Hide/show cards */
                document.querySelectorAll('.project-card').forEach(card => {
                    if (filter === 'all') {
                        card.hidden = false;
                    } else {
                        const tags = (card.dataset.tags || '').split(/\s+/).filter(Boolean);
                        card.hidden = !tags.includes(filter);
                    }
                });

                if (window.__buildMasonry && window.__getVisibleCards) {
                    window.__buildMasonry(window.__getVisibleCards());
                }
            });
        });
    }

    updateParallax();
});