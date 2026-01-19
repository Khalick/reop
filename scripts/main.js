/**
 * Oketch Salah Portfolio - Main JavaScript
 * Handles navigation, animations, and interactive features
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavigation();
    initScrollReveal();
    initCounterAnimation();
    initSmoothScroll();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll effect for navbar - passive for performance
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Add staggered animation to mobile menu links
    if (mobileMenu) {
        const links = mobileMenu.querySelectorAll('a');
        links.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.1}s`;
        });
    }
}

/**
 * Scroll reveal animation
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    // Use requestAnimationFrame for smooth scroll handling
    let revealTicking = false;
    const throttledReveal = () => {
        if (!revealTicking) {
            requestAnimationFrame(() => {
                revealOnScroll();
                revealTicking = false;
            });
            revealTicking = true;
        }
    };

    // Initial check
    revealOnScroll();

    // Check on scroll - passive for performance
    window.addEventListener('scroll', throttledReveal, { passive: true });
}

/**
 * Counter animation for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 50 && !counter.classList.contains('counted')) {
                animated = true;
                counter.classList.add('counted');

                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString() + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + '+';
                    }
                };

                updateCounter();
            }
        });
    };

    // Check on scroll - passive for performance
    window.addEventListener('scroll', animateCounters, { passive: true });

    // Initial check
    animateCounters();
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#') return;

            e.preventDefault();
            const element = document.querySelector(target);

            if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Gallery lightbox functionality
 */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (!img) return;

            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <img src="${img.src}" alt="${img.alt || 'Gallery image'}">
          <button class="lightbox-close">&times;</button>
        </div>
      `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Close on click
            lightbox.addEventListener('click', function (e) {
                if (e.target.classList.contains('lightbox-overlay') ||
                    e.target.classList.contains('lightbox-close')) {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });

            // Close on escape key
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        });
    });
}

/**
 * Form validation
 */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('[name="name"]');
        const email = form.querySelector('[name="email"]');
        const message = form.querySelector('[name="message"]');
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.error').forEach(el => el.remove());

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        }

        if (isValid) {
            // Show success message
            const success = document.createElement('div');
            success.className = 'form-success';
            success.innerHTML = `
        <h4>Thank you for your message!</h4>
        <p>We will get back to you soon.</p>
      `;
            form.innerHTML = '';
            form.appendChild(success);
        }
    });

    function showError(input, message) {
        const error = document.createElement('span');
        error.className = 'error';
        error.textContent = message;
        error.style.color = 'var(--color-red)';
        error.style.fontSize = 'var(--text-sm)';
        error.style.display = 'block';
        error.style.marginTop = 'var(--space-2)';
        input.parentNode.appendChild(error);
    }
}

// Initialize lightbox and form on page load
document.addEventListener('DOMContentLoaded', function () {
    initLightbox();
    initFormValidation();
});

