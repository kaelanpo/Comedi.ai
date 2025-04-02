/**
 * Comedi.ai - Main JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Interactive gradient background for hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    // Create gradient elements for interactive effect
    const heroShape1 = document.querySelector('.hero-shape-1');
    const heroShape2 = document.querySelector('.hero-shape-2');
    
    // Add mouse move event listener to hero section
    heroSection.addEventListener('mousemove', (e) => {
      // Calculate mouse position relative to the section
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      // Calculate percentage position for smooth transitions
      const xPercent = Math.floor((x / rect.width) * 100);
      const yPercent = Math.floor((y / rect.height) * 100);
      
      // Update gradient position based on mouse movement
      if (heroShape1) {
        heroShape1.style.transform = `translate(${xPercent / 30 - 10}px, ${yPercent / 30 - 10}px)`;
        heroShape1.style.opacity = 0.1 + (xPercent / 1000);
      }
      
      if (heroShape2) {
        heroShape2.style.transform = `translate(${-xPercent / 25 + 10}px, ${-yPercent / 25 + 10}px)`;
        heroShape2.style.opacity = 0.1 + (yPercent / 1000);
      }
      
      // Update the background gradient
      heroSection.style.backgroundImage = `linear-gradient(${135 + xPercent / 20}deg, var(--white) 0%, var(--primary-ultra-light) ${80 + yPercent / 5}%)`;
    });
    
    // Reset when mouse leaves
    heroSection.addEventListener('mouseleave', () => {
      if (heroShape1) heroShape1.style.transform = 'translate(0, 0)';
      if (heroShape2) heroShape2.style.transform = 'translate(0, 0)';
      heroSection.style.backgroundImage = 'linear-gradient(135deg, var(--white) 0%, var(--primary-ultra-light) 100%)';
    });
  }

  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Scroll detection for header
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Animate elements when they enter viewport
  const animateElements = document.querySelectorAll('.fade-in-up');
  if (animateElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
      element.style.animationPlayState = 'paused';
      observer.observe(element);
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update copyright year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}); 