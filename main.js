document.addEventListener("DOMContentLoaded", () => {

  const elements = document.querySelectorAll(".section, .hero-content, .card, .split-section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(25px)";
    el.style.transition = "0.8s ease";
    observer.observe(el);
  });

});
