function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

const state = {
  menuOpen: false,
  langOpen: false
};

function getBurger() {
  return qs("#burger");
}

function getNav() {
  return qs(".site-nav");
}

function getLangToggle() {
  return qs("#lang-toggle");
}

function getLangMenu() {
  return qs("#lang-menu");
}

function setMenuState(open) {
  const burger = getBurger();
  const nav = getNav();

  if (!burger || !nav) return;

  state.menuOpen = open;
  nav.classList.toggle("open", open);
  burger.classList.toggle("is-active", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
}

function openMenu() {
  setMenuState(true);
}

function closeMenu() {
  setMenuState(false);
}

function toggleMenu() {
  setMenuState(!state.menuOpen);
}

function setLangState(open) {
  const toggle = getLangToggle();
  const menu = getLangMenu();

  if (!toggle || !menu) return;

  state.langOpen = open;
  menu.classList.toggle("show", open);
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
}

function openLangMenu() {
  setLangState(true);
}

function closeLangMenu() {
  setLangState(false);
}

function toggleLangMenu() {
  setLangState(!state.langOpen);
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

  const label = qs(".lang-toggle-label");
  if (label) {
    label.textContent = lang.toUpperCase();
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

  const anyOpen = qsa(".modal.show").length > 0;
  if (!anyOpen) {
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
  qsa(".modal-close").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) closeModal(modal.id);
    });
  });

  qsa(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function initRevealAnimations() {
  const revealElements = qsa(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initHeaderScrollState() {
  const headerInner = qs(".site-header-inner");
  if (!headerInner) return;

  const update = () => {
    headerInner.classList.toggle("scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initLanguageDropdown() {
  const toggle = getLangToggle();
  const menu = getLangMenu();

  if (!toggle || !menu) return;

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeMenu();
    toggleLangMenu();
  });

  qsa(".lang-option", menu).forEach((option) => {
    option.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const lang = option.getAttribute("data-lang");
      setLanguage(lang);
      closeLangMenu();
    });
  });
}

function initBurgerMenu() {
  const burger = getBurger();
  const nav = getNav();

  if (!burger || !nav) return;

  burger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeLangMenu();
    toggleMenu();
  });

  qsa("a", nav).forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });
}

function initOutsideClickHandling() {
  document.addEventListener("click", (event) => {
    const clickedBurger = event.target.closest("#burger");
    const clickedNav = event.target.closest(".site-nav");
    const clickedLang = event.target.closest(".language-dropdown");

    if (!clickedBurger && !clickedNav && state.menuOpen) {
      closeMenu();
    }

    if (!clickedLang && state.langOpen) {
      closeLangMenu();
    }
  });
}

function initResizeHandling() {
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

function initKeyboardHandling() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLangMenu();
      closeAllModals();
    }
  });
}

function initPressFeedback() {
  const interactive = qsa(".btn, .card, .lang-toggle, .burger, .site-nav a");

  interactive.forEach((element) => {
    const addPressed = () => element.classList.add("is-pressed");
    const removePressed = () => element.classList.remove("is-pressed");

    element.addEventListener("pointerdown", addPressed);
    element.addEventListener("pointerup", removePressed);
    element.addEventListener("pointerleave", removePressed);
    element.addEventListener("pointercancel", removePressed);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initLanguageDropdown();
  initOutsideClickHandling();
  initResizeHandling();
  initKeyboardHandling();
  initModals();
  initRevealAnimations();
  initHeaderScrollState();
  initPressFeedback();

  const savedLanguage = localStorage.getItem("nordfit-language") || "de";
  setLanguage(savedLanguage);
});
