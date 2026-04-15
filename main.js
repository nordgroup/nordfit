document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // SMOOTH REVEAL ON SCROLL
  // =========================
  const elements = document.querySelectorAll(".section, .hero-content, .card, .split");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(25px)";
    el.style.transition = "all 0.8s ease";
    observer.observe(el);
  });


  // =========================
  // NAVBAR BLUR EFFECT
  // =========================
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.style.background = "rgba(255,255,255,0.85)";
      navbar.style.backdropFilter = "blur(25px)";
    } else {
      navbar.style.background = "rgba(255,255,255,0.7)";
      navbar.style.backdropFilter = "blur(20px)";
    }
  });


  // =========================
  // BUTTON MICRO INTERACTION
  // =========================
  const buttons = document.querySelectorAll("a");

  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)";
    });
  });

});
