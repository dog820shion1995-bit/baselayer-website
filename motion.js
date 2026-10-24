// Progressive enhancement: content remains readable if JavaScript is unavailable.
(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.solutions-heading, .solution-row, .principle-grid, .closing-inner');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, {threshold: .08, rootMargin: '0px 0px -20px 0px'});
  targets.forEach((element) => { element.classList.add('motion-reveal'); observer.observe(element); });
})();
