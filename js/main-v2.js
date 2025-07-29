// MTI Website Version 2 - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animate hamburger lines
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
        
        // Close menu when clicking on links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Reset hamburger lines
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            });
        });
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove backdrop based on scroll position
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Animated Number Counters
    function animateValue(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const range = end - start;
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (range * easeOut));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = end + suffix;
            }
        }
        
        requestAnimationFrame(updateValue);
    }
    
    // Intersection Observer for Animations (Reduced)
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate metric counters only
                if (entry.target.classList.contains('metric-value')) {
                    const target = parseInt(entry.target.dataset.count);
                    animateValue(entry.target, 0, target, 1500);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe only metric values for animation
    document.querySelectorAll('.metric-value').forEach(element => {
        observer.observe(element);
    });
    
    // Hero video handling
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Ensure video plays on mobile
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        
        // Handle video load errors gracefully
        heroVideo.addEventListener('error', function() {
            console.log('Video failed to load, using fallback background');
            const heroSection = document.querySelector('.hero');
            heroSection.style.background = 'linear-gradient(135deg, var(--primary-navy) 0%, var(--secondary-navy) 100%)';
        });
    }
    
    // Simplified Value Cards hover
    document.querySelectorAll('.value-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Form Handling
    const contactForm = document.getElementById('projectForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you for your project inquiry! Michael will contact you within 24 hours.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Log form data (for demo purposes)
                console.log('Form submitted:', formObject);
            }, 1500);
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            font-family: var(--font-primary);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s ease;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #00d4ff, #0099cc)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 5000);
    }
    
    
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.transform = 'scale(1.1)';
                overlay.style.background = 'var(--primary-navy)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.transform = 'scale(1)';
                overlay.style.background = 'var(--accent-blue)';
            }
        });
    });
    
    // Service card interactive features
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('consulting')) {
                this.style.background = 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
                this.style.borderColor = 'var(--accent-blue)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('consulting')) {
                this.style.background = 'var(--gray-50)';
                this.style.borderColor = 'var(--gray-200)';
            }
        });
    });
    
    
    
    // Enhanced form validation
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearValidationError(this);
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Clear previous errors
        clearValidationError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${getFieldLabel(fieldName)} is required`);
            return false;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\d\s\-\(\)\+\.]{10,}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error-red);
            font-size: 0.875rem;
            margin-top: 4px;
            font-weight: 500;
        `;
        
        formGroup.appendChild(errorElement);
        field.style.borderColor = 'var(--error-red)';
    }
    
    function clearValidationError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }
    
    function getFieldLabel(fieldName) {
        const labels = {
            'name': 'Name',
            'email': 'Email',
            'phone': 'Phone',
            'project-type': 'Project Type',
            'message': 'Project Details'
        };
        return labels[fieldName] || fieldName;
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Reset hamburger lines
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => span.style.transform = '');
                spans[1].style.opacity = '1';
            }
        }
    });
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll handler
    const debouncedScroll = debounce(function() {
        // Additional scroll handling can be added here
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
});

