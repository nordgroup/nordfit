document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const headerInner = document.querySelector(".site-header-inner");
  const burger = document.getElementById("burger");
  const siteNav = document.querySelector(".site-nav");

  const langToggle = document.getElementById("lang-toggle");
  const langMenu = document.getElementById("lang-menu");
  const langOptions = document.querySelectorAll(".lang-option");
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  function updateHeaderScrollState() {
    if (!headerInner) return;
    headerInner.classList.toggle("scrolled", window.scrollY > 10);
  }

  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

  function closeBurgerMenu() {
    if (!burger || !siteNav) return;
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("open");
    body.classList.remove("nav-open");
  }

  function openBurgerMenu() {
    if (!burger || !siteNav) return;
    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    siteNav.classList.add("open");
    body.classList.add("nav-open");
  }

  function toggleBurgerMenu() {
    if (!burger || !siteNav) return;
    const isOpen = siteNav.classList.contains("open");
    if (isOpen) {
      closeBurgerMenu();
    } else {
      closeLanguageMenu();
      openBurgerMenu();
    }
  }

  function closeLanguageMenu() {
    if (!langToggle || !langMenu) return;
    langToggle.classList.remove("is-open");
    langToggle.setAttribute("aria-expanded", "false");
    langMenu.classList.remove("show");
  }

  function openLanguageMenu() {
    if (!langToggle || !langMenu) return;
    langToggle.classList.add("is-open");
    langToggle.setAttribute("aria-expanded", "true");
    langMenu.classList.add("show");
  }

  function toggleLanguageMenu() {
    if (!langToggle || !langMenu) return;
    const isOpen = langMenu.classList.contains("show");
    if (isOpen) {
      closeLanguageMenu();
    } else {
      closeBurgerMenu();
      openLanguageMenu();
    }
  }

  function getSavedLanguage() {
    try {
      return (localStorage.getItem("nordfit-language") || "de").toLowerCase();
    } catch {
      return "de";
    }
  }

  function markActiveLanguage(lang) {
    langOptions.forEach((option) => {
      const optionLang = (option.dataset.lang || "").trim().toLowerCase();
      const isActive = optionLang === lang;
      option.classList.toggle("is-selected", isActive);
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function syncLanguageUi(lang) {
    const safeLang = (lang || "de").toLowerCase();

    if (langToggleLabel) {
      langToggleLabel.textContent = safeLang.toUpperCase();
    }

    markActiveLanguage(safeLang);
  }

  syncLanguageUi(getSavedLanguage());

  if (burger) {
    burger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleBurgerMenu();
    });
  }

  if (langToggle) {
    langToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleLanguageMenu();
    });
  }

  if (langMenu) {
    langMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  langOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const lang = (option.dataset.lang || "").trim().toLowerCase();
      if (!lang) return;

      try {
        localStorage.setItem("nordfit-language", lang);
      } catch {}

      syncLanguageUi(lang);

      window.dispatchEvent(
        new CustomEvent("nordfit:language-changed", {
          detail: { language: lang },
        })
      );

      closeLanguageMenu();
    });
  });

  window.addEventListener("nordfit:language-ui-sync", (event) => {
    const nextLang = event.detail?.language;
    if (typeof nextLang === "string") {
      syncLanguageUi(nextLang);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    const clickedInsideLang =
      (langToggle && langToggle.contains(target)) ||
      (langMenu && langMenu.contains(target));

    const clickedInsideBurger =
      (burger && burger.contains(target)) ||
      (siteNav && siteNav.contains(target));

    if (!clickedInsideLang) {
      closeLanguageMenu();
    }

    if (!clickedInsideBurger && window.innerWidth <= 768) {
      closeBurgerMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
      closeBurgerMenu();
    }
  });

  if (siteNav) {
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          closeBurgerMenu();
        }
      });
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeBurgerMenu();
    }
  });

  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }
});
