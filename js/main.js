function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function setMenuState(isOpen) {
  const nav = qs(".site-nav");
  const burger = qs("#burger");

  if (!nav || !burger) return;

  nav.classList.toggle("open", isOpen);
  burger.classList.toggle("is-active", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
}

function toggleMenu() {
  const nav = qs(".site-nav");
  if (!nav) return;
  setMenuState(!nav.classList.contains("open"));
}

function closeMenu() {
  setMenuState(false);
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

  qsa("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = translationSet[key];

    if (value !== undefined) {
      applyTranslation(element, value);
    }
  });

  const langToggleLabel = qs("#lang-toggle .lang-toggle-label");
  if (langToggleLabel) {
    langToggleLabel.textContent = lang.toUpperCase();
  } else {
    const firstSpan = qs("#lang-toggle span");
    if (firstSpan) firstSpan.textContent = lang.toUpperCase();
  }

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
  const modals = qsa(".modal");
  const closeButtons = qsa(".modal-close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) closeModal(modal.id);
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
      closeMenu();
      closeLanguageMenu();
    }
  });
}

function initScrollAnimations() {
  const revealElements = qsa(".reveal");
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
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function openLanguageMenu() {
  const langToggle = qs("#lang-toggle");
  const langMenu = qs("#lang-menu");
  if (!langToggle || !langMenu) return;

  langMenu.classList.add("show");
  langToggle.setAttribute("aria-expanded", "true");
}

function closeLanguageMenu() {
  const langToggle = qs("#lang-toggle");
  const langMenu = qs("#lang-menu");
  if (!langToggle || !langMenu) return;

  langMenu.classList.remove("show");
  langToggle.setAttribute("aria-expanded", "false");
}

function toggleLanguageMenu() {
  const langMenu = qs("#lang-menu");
  if (!langMenu) return;

  if (langMenu.classList.contains("show")) {
    closeLanguageMenu();
  } else {
    openLanguageMenu();
  }
}

function initLanguageSwitcher() {
  const langToggle = qs("#lang-toggle");
  const langOptions = qsa(".lang-option");

  if (langToggle) {
    langToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLanguageMenu();
    });
  }

  langOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang");
      setLanguage(lang);
      closeLanguageMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInside = event.target.closest(".language-dropdown");
    if (!clickedInside) {
      closeLanguageMenu();
    }
  });

  const savedLanguage = localStorage.getItem("nordfit-language") || "de";
  setLanguage(savedLanguage);
}

function initBurgerMenu() {
  const burger = qs("#burger");
  const navLinks = qsa(".site-nav a");

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

function initHeaderScrollState() {
  const headerInner = qs(".site-header-inner");
  if (!headerInner) return;

  const updateHeaderState = () => {
    const isScrolled = window.scrollY > 12;
    headerInner.classList.toggle("scrolled", isScrolled);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

function initSmoothHoverLift() {
  const interactiveElements = qsa(".btn, .card, .lang-toggle, .burger, .site-nav a");

  interactiveElements.forEach((element) => {
    element.addEventListener("pointerdown", () => {
      element.classList.add("is-pressed");
    });

    const release = () => element.classList.remove("is-pressed");

    element.addEventListener("pointerup", release);
    element.addEventListener("pointerleave", release);
    element.addEventListener("pointercancel", release);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initLanguageSwitcher();
  initModals();
  initScrollAnimations();
  initHeaderScrollState();
  initSmoothHoverLift();
});
