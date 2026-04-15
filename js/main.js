function toggleMenu() {
  const nav = document.querySelector(".site-nav");
  if (nav) {
    nav.classList.toggle("open");
  }
}

function applyTranslation(element, value) {
  const attr = element.getAttribute("data-i18n-attr");

  if (attr) {
    element.setAttribute(attr, value);
    return;
  }

  if (element.tagName === "TITLE") {
    document.title = value;
    return;
  }

  element.textContent = value;
}

function setLanguage(lang = "de") {
  if (!window.translations || !window.translations[lang]) return;

  const translationSet = window.translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = translationSet[key];

    if (value !== undefined) {
      applyTranslation(element, value);
    }
  });

  document.documentElement.lang = lang;
  localStorage.setItem("nordfit-language", lang);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModals() {
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".modal-close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("show")) {
          closeModal(modal.id);
        }
      });
    }
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
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
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
  const navLinks = document.querySelectorAll(".site-nav a");

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.querySelector(".site-nav");
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
      }
    });
  });
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
