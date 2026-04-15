function toggleMenu() {
  const nav = document.querySelector(".site-nav");
  if (nav) {
    nav.classList.toggle("open");
  }
}

function setLanguage(lang = "de") {
  if (!window.translations || !window.translations[lang]) return;

  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = window.translations[lang][key];

    if (translation) {
      element.textContent = translation;
    }
  });

  document.documentElement.lang = lang;
  localStorage.setItem("nordfit-language", lang);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }
}

function initModals() {
  const closeButtons = document.querySelectorAll(".modal-close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  });
}

function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll("[data-lang]");

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  const savedLanguage = localStorage.getItem("nordfit-language") || "de";
  setLanguage(savedLanguage);
}

function initBurgerMenu() {
  const burger = document.getElementById("burger");

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }
}

function initLocationSelector() {
  const locationSelect = document.getElementById("location-select");

  if (!locationSelect) return;

  locationSelect.addEventListener("change", () => {
    console.log("Später können hier weitere Studios dynamisch geladen werden.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initLanguageSwitcher();
  initModals();
  initScrollAnimations();
  initLocationSelector();
});
