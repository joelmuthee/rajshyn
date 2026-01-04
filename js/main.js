/**
 * Rajshyn Jewellers - Main JavaScript
 * Handles navigation, animations, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initLazyLoading();
    initBorderBeamAnimations();
});

/* Navigation Logic */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.main-header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* Scroll Animations (Intersection Observer) */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

/* Lazy Loading Images */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/* Border Beam Animation on Scroll (Mobile) */
function initBorderBeamAnimations() {
    const observerOptions = {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: '0px'
    };

    const beamObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-beam');
                // Optional: Stop observing once activated if you want it to happen only once
                // beamObserver.unobserve(entry.target);
            } else {
                // Optional: Remove class when out of view to re-trigger animation?
                // For a 'beam' effect, keeping it active usually looks better, or toggling it.
                // User said 'appear as you scroll', implying strictly when in view.
                // Let's remove it when out of view so it re-animates nicely as they scroll up/down.
                entry.target.classList.remove('active-beam');
            }
        });
    }, observerOptions);

    const beamElements = document.querySelectorAll('.category-card, .value-item');
    beamElements.forEach(el => beamObserver.observe(el));
}

