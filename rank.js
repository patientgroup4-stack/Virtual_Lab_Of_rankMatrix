// Smooth scroll for better UX (future-proof)
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Tooltip-like feedback for calculator button
const calcBtn = document.querySelector('.calc-button');

if (calcBtn) {
  calcBtn.addEventListener('mouseenter', () => {
    calcBtn.title = 'Open Rank Calculator';
  });
}
