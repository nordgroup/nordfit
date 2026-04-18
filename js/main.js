/* =========================
   NordFit main.js
   Header / Burger / Sprache / Modals / Reveal / Gallery
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const headerInner = document.querySelector(".site-header-inner");
  const burger = document.getElementById("burger");
  const siteNav = document.querySelector(".site-nav");

  const langToggle = document.getElementById("lang-toggle");
  const langMenu = document.getElementById("lang-menu");
  const langOptions = document.querySelectorAll(".lang-option");
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  const modalElements = document.querySelectorAll(".modal");
  const revealElements = document.querySelectorAll(".reveal");

  let lastFocusedElement = null;

  /* =========================
     Header scroll state
     ========================= */
  const updateHeaderScrollState = () => {
    if (!headerInner) return;

    if (window.scrollY > 10) {
      headerInner.classList.add("scrolled");
    } else {
      headerInner.classList.remove("scrolled");
    }
  };

  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

  /* =========================
     Burger menu
     ========================= */
  const closeBurgerMenu = () => {
    if (!burger || !siteNav) return;

    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("open");
    body.classList.remove("nav-open");
  };

  const openBurgerMenu = () => {
    if (!burger || !siteNav) return;

    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    siteNav.classList.add("open");
    body.classList.add("nav-open");
  };

  const toggleBurgerMenu = () => {
    if (!burger || !siteNav) return;

    const isOpen = siteNav.classList.contains("open");
    if (isOpen) {
      closeBurgerMenu();
    } else {
      closeBurgerMenu();
      closeLanguageMenu();
      openBurgerMenu();
    }
  };

  if (burger && siteNav) {
    burger.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleBurgerMenu();
    });

    const navLinks = siteNav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          closeBurgerMenu();
        }
      });
    });
  }

  /* =========================
     Language helpers
     ========================= */
  const getStoredLanguage = () => {
    try {
      return (localStorage.getItem("nordfit-language") || "de").trim().toLowerCase();
    } catch {
      return "de";
    }
  };

  const syncLanguageSelectionUI = (languageCode) => {
    const normalized = (languageCode || "de").trim().toLowerCase();

    if (langToggleLabel) {
      langToggleLabel.textContent = normalized.toUpperCase();
    }

    if (langOptions.length) {
      langOptions.forEach((option) => {
        const optionLang = option.dataset.lang?.trim().toLowerCase() || "";

        if (optionLang === normalized) {
          option.classList.add("is-selected");
          option.setAttribute("aria-current", "true");
        } else {
          option.classList.remove("is-selected");
          option.removeAttribute("aria-current");
        }
      });
    }
  };

  /* =========================
     Language dropdown
     ========================= */
  function closeLanguageMenu() {
    if (!langToggle || !langMenu) return;

    langToggle.classList.remove("is-open");
    langToggle.setAttribute("aria-expanded", "false");
    langMenu.classList.remove("show");
  }

  function openLanguageMenu() {
    if (!langToggle || !langMenu) return;

    syncLanguageSelectionUI(getStoredLanguage());
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

  syncLanguageSelectionUI(getStoredLanguage());

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLanguageMenu();
    });

    langMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (langOptions.length) {
    langOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const lang = option.dataset.lang?.trim().toLowerCase() || "de";

        try {
          localStorage.setItem("nordfit-language", lang);
        } catch {}

        syncLanguageSelectionUI(lang);
        closeLanguageMenu();
      });
    });
  }

  window.addEventListener("storage", () => {
    syncLanguageSelectionUI(getStoredLanguage());
  });

  /* =========================
     Global outside click close
     ========================= */
  document.addEventListener("click", (event) => {
    const target = event.target;

    const clickedInsideLang =
      langToggle?.contains(target) || langMenu?.contains(target);

    const clickedInsideBurger =
      burger?.contains(target) || siteNav?.contains(target);

    if (!clickedInsideLang) {
      closeLanguageMenu();
    }

    if (!clickedInsideBurger && window.innerWidth <= 768) {
      closeBurgerMenu();
    }
  });

  /* =========================
     Escape key
     ========================= */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
      closeBurgerMenu();
      closeAllModals();
    }
  });

  /* =========================
     Resize handling
     ========================= */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeBurgerMenu();
    }
  });

  /* =========================
     Reveal on scroll
     ========================= */
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* =========================
     Modal helpers
     ========================= */
  function openModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    const closeButton = modal.querySelector(".modal-close");
    if (closeButton instanceof HTMLElement) {
      closeButton.focus();
    }
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    const anyOpenModal = document.querySelector(".modal.show");
    if (!anyOpenModal) {
      body.classList.remove("modal-open");
      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    }
  }

  function closeAllModals() {
    modalElements.forEach((modal) => closeModal(modal));
  }

  window.openModal = openModalById;

  modalElements.forEach((modal) => {
    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) {
      closeButton.addEventListener("click", () => closeModal(modal));
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  /* =========================
     Focus trap for modals
     ========================= */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const openModal = document.querySelector(".modal.show");
    if (!openModal) return;

    const focusableSelectors = [
      "button",
      "[href]",
      "input",
      "select",
      "textarea",
      "[tabindex]:not([tabindex='-1'])",
    ];

    const focusableElements = Array.from(
      openModal.querySelectorAll(focusableSelectors.join(","))
    ).filter((el) => {
      return !(el instanceof HTMLElement)
        ? false
        : !el.hasAttribute("disabled");
    });

    if (!focusableElements.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !openModal.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* =========================
     Gallery pagination / arrows / dots
     ========================= */
  const galleryRows = document.querySelectorAll(".gallery-row");

  const updateGalleryState = (row) => {
    if (!(row instanceof HTMLElement)) return;

    const controls = row.closest(".area-section")?.querySelector(".gallery-controls");
    const dots = controls?.querySelectorAll(".gallery-dot");
    const prev = controls?.querySelector('[data-gallery-arrow="prev"]');
    const next = controls?.querySelector('[data-gallery-arrow="next"]');

    const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
    const progress = maxScroll > 0 ? row.scrollLeft / maxScroll : 0;
    const pageIndex = progress > 0.45 ? 1 : 0;

    dots?.forEach((dot, index) => {
      dot.classList.toggle("active", index === pageIndex);
      dot.setAttribute("aria-pressed", index === pageIndex ? "true" : "false");
    });

    if (prev instanceof HTMLButtonElement) {
      prev.disabled = row.scrollLeft <= 8;
      prev.style.opacity = prev.disabled ? "0.45" : "1";
    }

    if (next instanceof HTMLButtonElement) {
      next.disabled = row.scrollLeft >= maxScroll - 8;
      next.style.opacity = next.disabled ? "0.45" : "1";
    }
  };

  galleryRows.forEach((row) => {
    const section = row.closest(".area-section");
    const controls = section?.querySelector(".gallery-controls");

    if (!controls) return;

    const prev = controls.querySelector('[data-gallery-arrow="prev"]');
    const next = controls.querySelector('[data-gallery-arrow="next"]');
    const dots = controls.querySelectorAll(".gallery-dot");

    const goToPage = (pageIndex) => {
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      const target = pageIndex === 0 ? 0 : maxScroll;

      row.scrollTo({
        left: target,
        behavior: "smooth",
      });
    };

    if (prev instanceof HTMLButtonElement) {
      prev.addEventListener("click", () => goToPage(0));
    }

    if (next instanceof HTMLButtonElement) {
      next.addEventListener("click", () => goToPage(1));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToPage(index));
    });

    row.addEventListener("scroll", () => updateGalleryState(row), { passive: true });
    window.addEventListener("resize", () => updateGalleryState(row));

    updateGalleryState(row);
  });
});
