// Portfolio JavaScript - Ultra Modern Interactive Features

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  bindEvents() {
    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.navbar = $('#navbar');
    this.hamburger = $('#hamburger');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav-link');
    this.sections = $$('section[id]');
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
    this.setActiveLink();
  }

  bindEvents() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Smooth scrolling for nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Handle scroll events
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.setActiveLink();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
  }

  handleNavClick(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    
    if (target.startsWith('#')) {
      const section = $(target);
      if (section) {
        this.scrollToSection(section);
        this.closeMenu();
      }
    }
  }

  scrollToSection(section) {
    const offset = 80; // Account for fixed navbar
    const targetPosition = section.offsetTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  handleScroll() {
    const scrolled = window.scrollY > 50;
    this.navbar.classList.toggle('scrolled', scrolled);
  }

  setActiveLink() {
    const scrollPosition = window.scrollY + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.createObserver();
    this.animateElements();
    this.animateCounters();
    this.animateSkillBars();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger specific animations
          if (entry.target.classList.contains('stat-number')) {
            this.animateCounter(entry.target);
          }
          
          if (entry.target.classList.contains('skill-progress')) {
            this.animateSkillBar(entry.target);
          }
        }
      });
    }, this.observerOptions);
  }

  animateElements() {
    // Add animation classes to elements
    const animatedElements = [
      { selector: '.section-header', animation: 'fade-in' },
      { selector: '.about-text', animation: 'slide-in-left' },
      { selector: '.about-image', animation: 'slide-in-right' },
      { selector: '.skill-category', animation: 'fade-in' },
      { selector: '.project-card', animation: 'fade-in' },
      { selector: '.service-card', animation: 'fade-in' },
      { selector: '.contact-info', animation: 'slide-in-left' },
      { selector: '.contact-form', animation: 'slide-in-right' }
    ];

    animatedElements.forEach(({ selector, animation }) => {
      const elements = $$(selector);
      elements.forEach((element, index) => {
        element.classList.add(animation);
        element.style.animationDelay = `${index * 0.1}s`;
        this.observer.observe(element);
      });
    });
  }

  animateCounters() {
    const counters = $$('.stat-number');
    counters.forEach(counter => {
      this.observer.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  animateSkillBars() {
    const skillBars = $$('.skill-progress');
    skillBars.forEach(bar => {
      this.observer.observe(bar);
    });
  }

  animateSkillBar(element) {
    const width = element.dataset.width;
    setTimeout(() => {
      element.style.width = `${width}%`;
    }, 200);
  }
}

// Particle System (Optional Enhancement)
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.particleCount = 50;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.animate();
    this.bindEvents();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    this.container.appendChild(this.canvas);
    this.resize();
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary');
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }
}

// Form Manager
class FormManager {
  constructor() {
    this.form = $('#contact-form');
    this.init();
  }

  init() {
    if (this.form) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => this.clearErrors(e.target));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.submitForm();
    }
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing errors
    this.clearErrors(field);

    // Required validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'To pole jest wymagane';
      isValid = false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Wprowadź poprawny adres email';
        isValid = false;
      }
    }

    // Show error if invalid
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--text-sm)';
    errorElement.style.marginTop = 'var(--space-1)';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
  }

  clearErrors(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  async submitForm() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span>Wysyłanie...</span>';
    submitButton.disabled = true;

    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission();
      
      // Show success message
      this.showNotification('Wiadomość została wysłana pomyślnie!', 'success');
      this.form.reset();
      
    } catch (error) {
      // Show error message
      this.showNotification('Wystąpił błąd podczas wysyłania wiadomości.', 'error');
      console.error('Form submission error:', error);
      
    } finally {
      // Reset button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  }

  simulateFormSubmission() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        Math.random() > 0.1 ? resolve() : reject(new Error('Submission failed'));
      }, 2000);
    });
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = $$('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: var(--space-6);
      right: var(--space-6);
      background: var(--bg-glass);
      color: var(--text-primary);
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      backdrop-filter: blur(20px);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-toast);
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;

    // Set color based on type
    if (type === 'success') {
      notification.style.borderColor = 'var(--color-success)';
    } else if (type === 'error') {
      notification.style.borderColor = 'var(--color-error)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureInteractions();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      // Measure various performance metrics
      if (performance.timing) {
        const timing = performance.timing;
        this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
        this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        this.metrics.firstPaint = this.getFirstPaint();
      }

      // Log metrics in development
      if (this.isDevelopment()) {
        console.log('Performance Metrics:', this.metrics);
      }
    });
  }

  measureInteractions() {
    // Measure interaction responsiveness
    let interactionStart;
    
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionStart = performance.now();
      }, { passive: true });
    });

    ['click', 'keyup', 'touchend'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        if (interactionStart) {
          const interactionTime = performance.now() - interactionStart;
          if (interactionTime > 100) { // Log slow interactions
            console.warn(`Slow interaction detected: ${interactionTime}ms`);
          }
        }
      }, { passive: true });
    });
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  isDevelopment() {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }
}

// Accessibility Manager
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceKeyboardNavigation();
    this.addSkipLinks();
    this.manageFocusOutlines();
    this.handleReducedMotion();
  }

  enhanceKeyboardNavigation() {
    // Add keyboard navigation for interactive elements
    const interactiveElements = $$('button, a, [tabindex]:not([tabindex="-1"])');
    
    interactiveElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (element.tagName !== 'A') {
            e.preventDefault();
            element.click();
          }
        }
      });
    });
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Przejdź do głównej treści';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  manageFocusOutlines() {
    let isUsingKeyboard = false;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      isUsingKeyboard = false;
      document.body.classList.remove('using-keyboard');
    });
  }

  handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-normal', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
    }
  }
}

// Main Application
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize all components
    this.themeManager = new ThemeManager();
    this.navigationManager = new NavigationManager();
    this.animationManager = new AnimationManager();
    this.formManager = new FormManager();
    this.performanceMonitor = new PerformanceMonitor();
    this.accessibilityManager = new AccessibilityManager();

    // Initialize particle system for hero section (optional)
    const heroSection = $('.hero');
    if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.particleSystem = new ParticleSystem(heroSection);
    }

    // Add smooth reveal animation to hero content
    this.animateHeroContent();

    // Initialize lazy loading for images (if any)
    this.initializeLazyLoading();

    // Add Easter eggs and fun interactions
    this.addEasterEggs();
  }

  animateHeroContent() {
    const heroTitle = $('.hero-title');
    const heroDescription = $('.hero-description');
    const heroButtons = $('.hero-buttons');

    [heroTitle, heroDescription, heroButtons].forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(2rem)';
        
        setTimeout(() => {
          element.style.transition = 'all 0.8s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 200 + 500);
      }
    });
  }

  initializeLazyLoading() {
    const images = $$('img[data-src]');
    
    if (images.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  addEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.code);
      
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
      }
      
      if (konamiCode.join(',') === konamiSequence.join(',')) {
        this.triggerEasterEgg();
        konamiCode = [];
      }
    });

    // Add a secret developer console message
    console.log(
      '%cWitaj w moim portfolio! 🚀',
      'font-size: 24px; font-weight: bold; color: #6366f1; text-shadow: 2px 2px 4px rgba(99, 102, 241, 0.3);'
    );
    console.log(
      '%cJeśli szukasz programisty, który łączy kreatywność z technologią - jesteś we właściwym miejscu!',
      'font-size: 14px; color: #64748b;'
    );
  }

  triggerEasterEgg() {
    // Create a fun animation effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Create confetti particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        ctx.restore();
        
        if (particle.y > canvas.height) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        requestAnimationFrame(animateConfetti);
      } else {
        document.body.removeChild(canvas);
      }
    }
    
    animateConfetti();
    
    // Show a fun message
    this.formManager.showNotification('🎉 Gratulacje! Znalazłeś easter egg!', 'success');
  }
}

// CSS Animations for notifications
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .using-keyboard *:focus {
    outline: 2px solid var(--color-primary) !important;
    outline-offset: 2px !important;
  }
  
  :not(.using-keyboard) *:focus {
    outline: none !important;
  }
`;
document.head.appendChild(styleSheet);

// Initialize the application
new PortfolioApp();