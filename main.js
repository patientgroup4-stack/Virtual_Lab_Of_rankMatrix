/* ---------------------------------
   Home Page JavaScript
   Purpose: Minimal, smooth, professional interactions
---------------------------------- */

// Smooth scrolling for internal links
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const target = link.getAttribute('href');

    // Apply only for same-page section links
    if (target && target.startsWith('#')) {
      event.preventDefault();
      const section = document.querySelector(target);

      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Subtle header shadow change on scroll
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
  } else {
    header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }
});

// Gentle animation for topic cards on page load
const topicCards = document.querySelectorAll('.topic-card');

topicCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';

  setTimeout(() => {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, index * 120);
});

console.log('Matrix Learning Home Page JS loaded');
