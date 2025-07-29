// MTI New Website JavaScript
// Professional interactions and animations

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Smooth Scrolling for Internal Links
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
    
    // Hero Stats Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const originalText = counter.textContent.trim();
                    animateCounter(counter, originalText, 2000);
                    observer.unobserve(counter);
                }
            });
        }, options);
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    function animateCounter(element, targetText, duration) {
        const startTime = performance.now();
        
        // Parse different types of stats
        const statConfig = parseStatValue(targetText);
        
        if (statConfig.animatable) {
            // For numeric values that can be animated
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(statConfig.start + (statConfig.end - statConfig.start) * easeOutQuart);
                
                element.textContent = statConfig.prefix + current + statConfig.suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = targetText;
                }
            }
            
            // Start with 0 and animate up
            element.textContent = statConfig.prefix + statConfig.start + statConfig.suffix;
            requestAnimationFrame(updateCounter);
        } else {
            // For non-numeric values (Q, SW, MBA), just do a reveal animation
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }, 100);
        }
    }
    
    function parseStatValue(text) {
        // Handle $86M+ format
        if (text.includes('$') && text.includes('M')) {
            const number = parseInt(text.replace(/[$M+]/g, ''));
            return {
                animatable: true,
                start: 0,
                end: number,
                prefix: '$',
                suffix: 'M+'
            };
        }
        
        // Handle percentage format (100%, 51%, etc.)
        if (text.includes('%')) {
            const number = parseInt(text.replace('%', ''));
            if (!isNaN(number)) {
                return {
                    animatable: true,
                    start: 0,
                    end: number,
                    prefix: '',
                    suffix: '%'
                };
            }
        }
        
        // Handle 8+ format
        if (text.includes('+') && !text.includes('$')) {
            const number = parseInt(text.replace('+', ''));
            return {
                animatable: true,
                start: 0,
                end: number,
                prefix: '',
                suffix: '+'
            };
        }
        
        // Handle plain numbers like 51, 3, etc.
        const plainNumber = parseInt(text);
        if (!isNaN(plainNumber) && plainNumber > 0) {
            return {
                animatable: true,
                start: 0,
                end: plainNumber,
                prefix: '',
                suffix: ''
            };
        }
        
        // Non-animatable text (Q, SW, MBA, etc.)
        return {
            animatable: false
        };
    }
    
    // Initialize counter animation
    animateCounters();
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.global-nav');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
    
    // Capability Bar Animations
    function animateCapabilityBars() {
        const bars = document.querySelectorAll('.bar-fill');
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    
                    observer.unobserve(bar);
                }
            });
        }, options);
        
        bars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Initialize capability bar animations
    animateCapabilityBars();
    
    // Card Hover Effects
    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.leadership-item, .project-card, .metric-card, .opportunity-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Initialize card hover effects
    addCardHoverEffects();
    
    // Form Enhancements
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add floating label effect
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (input.value) {
                    input.classList.add('has-value');
                }
                
                input.addEventListener('blur', function() {
                    if (this.value) {
                        this.classList.add('has-value');
                    } else {
                        this.classList.remove('has-value');
                    }
                });
                
                input.addEventListener('focus', function() {
                    this.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.classList.remove('focused');
                });
            });
            
            // Form submission handling
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = 'var(--success-green)';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        this.reset();
                    }, 3000);
                }, 2000);
            });
        });
    }
    
    // Initialize form enhancements
    enhanceForms();
    
    // Scroll Reveal Animation
    function addScrollReveal() {
        const elements = document.querySelectorAll('.leadership-item, .project-card, .metric-card, .leader-profile');
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // Initialize scroll reveal
    addScrollReveal();
    
    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Performance Monitoring
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    console.log(`Page load time: ${loadTime}ms`);
                }, 0);
            });
        }
    }
    
    // Initialize performance monitoring
    logPerformance();
    
});

// Additional CSS for enhanced interactions
const additionalStyles = `
    .global-nav {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .global-nav.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        padding: var(--space-lg);
        gap: var(--space-lg);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);