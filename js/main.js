/**
 * Luxury Jewellers - Main JavaScript
 * Handles navigation, animations, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initLazyLoading();
    initBorderBeamAnimations();
    initReviewSystem();
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


/* Scroll Animations (Intersection Observer & Fallback) */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Function to trigger animation
    const reveal = (element) => {
        if (!element.classList.contains('visible')) {
            element.classList.add('visible');
        }
    };

    // 1. Intersection Observer (Primary Method)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: '0px 0px -50px 0px' // Offset slightly
        };

        // Mobile-specific adjustments
        if (window.innerWidth < 768) {
            observerOptions.threshold = 0; // Trigger immediately
            observerOptions.rootMargin = '0px'; // No offset
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for no Observer support
        animatedElements.forEach(el => reveal(el));
    }

    // 2. Scroll Event Fallback (Secondary Method for Mobile Reliability)
    // Sometimes Observers can be sluggish on specific mobile viewports/browsers
    if (window.innerWidth < 768) {
        const checkScroll = () => {
            const triggerBottom = window.innerHeight * 0.9; // Trigger at 90% of viewport height

            animatedElements.forEach(el => {
                const boxTop = el.getBoundingClientRect().top;
                if (boxTop < triggerBottom) {
                    reveal(el);
                }
            });
        };

        window.addEventListener('scroll', checkScroll);
        // Run once on load to catch Hero elements
        checkScroll();
    }
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

    const beamElements = document.querySelectorAll('.category-card, .value-item, .showroom-card, .showroom-home-card');
    beamElements.forEach(el => beamObserver.observe(el));
}


/* =========================================
   Review Slider Logic
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initReviewSlider();
});

function initReviewSlider() {
    const track = document.querySelector('.review-track');
    if (!track) return;

    const slides = document.querySelectorAll('.review-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;
    const intervalTime = 5000;
    let slideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlidePosition() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlidePosition();
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Auto Play
    slideInterval = setInterval(nextSlide, intervalTime);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(slideInterval));
    track.addEventListener('mouseleave', () => resetInterval());
}

/* =========================================
   Review & Feedback System Logic (With Reset Fix)
   ========================================= */
function initReviewSystem() {
    const feedbackSystem = document.getElementById('feedback-system');
    // Only run if the review system is present on the page
    if (!feedbackSystem) return;

    // 1. Capture "Pristine" Templates on Page Load
    // We save the original HTML of the forms before anyone touches them.
    const fourStarTemplate = document.getElementById('review-container-4star')?.innerHTML;
    const negativeTemplate = document.getElementById('review-container-negative')?.innerHTML;
    const stars = document.querySelectorAll('input[name="rating"]');
    const reviewCta = document.getElementById('review-cta');

    // 2. Helper Function: The "Nuclear Option"
    // This completely destroys the old iframe and creates a new one from the template.
    function loadTemplate(containerId, templateContent) {
        const container = document.getElementById(containerId);
        if (!container || !templateContent) return;

        // Reset Content to original template
        container.innerHTML = templateContent;

        // Show Container
        container.classList.remove('hidden');
        container.style.display = 'flex';

        // Re-activate Scripts (innerHTML scripts don't run automatically by default)
        const scripts = container.getElementsByTagName('script');
        Array.from(scripts).forEach(oldScript => {
            const newScript = document.createElement('script');
            // Copy attributes like src, id, etc.
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            // Copy inline code
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            // Replace old script with executable new script
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // Scroll into view comfortably
        // container.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Removed automatic scroll to form to keep focus on stars/message
    }

    // 3. Main Star Click Listener
    stars.forEach(star => {
        star.addEventListener('change', (e) => { // Changed to 'change' for better reliability with labels
            const rating = parseInt(e.target.value);

            // Hide all forms initially
            if (reviewCta) reviewCta.classList.add('hidden');
            document.getElementById('review-container-negative')?.classList.add('hidden');
            document.getElementById('review-container-4star')?.classList.add('hidden');

            setTimeout(() => {
                if (rating === 5) {
                    // 5 Stars: Show Google Link (No reload needed, it's just text)
                    if (reviewCta) {
                        reviewCta.classList.remove('hidden');
                        // reviewCta.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else if (rating === 4) {
                    // 4 Stars: Force Reload from Template
                    loadTemplate('review-container-4star', fourStarTemplate);
                } else {
                    // 1-3 Stars: Force Reload from Template
                    loadTemplate('review-container-negative', negativeTemplate);
                }

                // Scroll stars to center (UX Polish)
                const starContainer = e.target.closest('.star-rating');
                if (starContainer) {
                    // Slight delay to ensure layout is settled
                    setTimeout(() => starContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }

            }, 50);
        });
    });

    // 4. Global Close Button Logic
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.close-form-btn');
        if (btn) {
            // Uncheck all stars
            document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);

            // Hide main container wrapper if needed, or just specific containers
            if (reviewCta) reviewCta.classList.add('hidden');
            document.getElementById('review-container-negative')?.classList.add('hidden');
            document.getElementById('review-container-4star')?.classList.add('hidden');

            // Scroll back to center of stars
            const starContainer = document.querySelector('.star-rating');
            if (starContainer) {
                starContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}
