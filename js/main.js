function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function getNav() {
  return qs(".site-nav");
}

function getBurger() {
  return qs("#burger");
}

function getLangToggle() {
  return qs("#lang-toggle");
}

function getLangMenu() {
  return qs("#lang-menu");
}

function setMenuState(isOpen) {
  const nav = getNav();
  const burger = getBurger();

  if (!nav || !burger) return;

  nav.classList.toggle("open", isOpen);
  burger.classList.toggle("is-active", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
}

function openMenu() {
  setMenuState(true);
}

function closeMenu() {
  setMenuState(false);
}

function toggleMenu() {
  const nav = getNav();
  if (!nav) return;
  setMenuState(!nav.classList.contains("open"));
}

function setLanguageMenuState(isOpen) {
  const langToggle = getLangToggle();
  const langMenu = getLangMenu();

  if (!langToggle || !langMenu) return;

  langMenu.classList.toggle("show", isOpen);
  langToggle.setAttribute("aria-expanded", String(isOpen));
}

function openLanguageMenu() {
  setLanguageMenuState(true);
}

function closeLanguageMenu() {
  setLanguageMenuState(false);
}

function toggleLanguageMenu() {
  const langMenu = getLangMenu();
  if (!langMenu) return;
  setLanguageMenuState(!langMenu.classList.contains("show"));
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

  const langToggleLabel = qs(".lang-toggle-label");
  if (langToggleLabel) {
    langToggleLabel.textContent = lang.toUpperCase();
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

  const hasOpenModal = qsa(".modal.show").length > 0;
  if (!hasOpenModal) {
    document.body.style.overflow = "";
  }
}

function closeAllModals() {
  qsa(".modal.show").forEach((modal) => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  });
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
}

function initScrollAnimations() {
  const revealElements = qsa(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initLanguageSwitcher() {
  const langToggle = getLangToggle();
  const langOptions = qsa(".lang-option");

  if (langToggle) {
    langToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      closeMenu();
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

  const savedLanguage = localStorage.getItem("nordfit-language") || "de";
  setLanguage(savedLanguage);
}

function initBurgerMenu() {
  const burger = getBurger();
  const navLinks = qsa(".site-nav a");

  if (burger) {
    burger.addEventListener("click", (event) => {
      event.stopPropagation();
      closeLanguageMenu();
      toggleMenu();
    });
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
    headerInner.classList.toggle("scrolled", window.scrollY > 10);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

function initPressStates() {
  const interactiveElements = qsa(".btn, .card, .lang-toggle, .burger, .site-nav a");

  interactiveElements.forEach((element) => {
    const addPressed = () => element.classList.add("is-pressed");
    const removePressed = () => element.classList.remove("is-pressed");

    element.addEventListener("pointerdown", addPressed);
    element.addEventListener("pointerup", removePressed);
    element.addEventListener("pointerleave", removePressed);
    element.addEventListener("pointercancel", removePressed);
  });
}

function initGlobalOutsideClick() {
  document.addEventListener("click", (event) => {
    const clickedInNav = event.target.closest(".site-nav");
    const clickedBurger = event.target.closest("#burger");
    const clickedLang = event.target.closest(".language-dropdown");

    if (!clickedInNav && !clickedBurger) {
      closeMenu();
    }

    if (!clickedLang) {
      closeLanguageMenu();
    }
  });
}

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLanguageMenu();
      closeAllModals();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initLanguageSwitcher();
  initModals();
  initScrollAnimations();
  initHeaderScrollState();
  initPressStates();
  initGlobalOutsideClick();
  initKeyboardShortcuts();
});
