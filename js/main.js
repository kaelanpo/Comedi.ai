/**
 * Comedi.ai - Main JS
 */

document.addEventListener('DOMContentLoaded', () => {
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