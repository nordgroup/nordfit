/* =========================
   NordFit main.js
   Header / Burger / Sprache / Modals / Reveal / Galleries
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
  const galleryShells = document.querySelectorAll("[data-gallery]");

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
      if (window.innerWidth <= 768) {
        closeBurgerMenu();
      }
      openLanguageMenu();
    }
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem("nordfit-language") || "de";
    } catch {
      return "de";
    }
  }

  function markActiveLanguage(langCode) {
    if (!langOptions.length) return;

    langOptions.forEach((option) => {
      const optionLang = option.dataset.lang?.trim().toLowerCase() || "";
      const isActive = optionLang === langCode;

      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLanguageMenu();
    });

    langMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (langOptions.length && langToggleLabel) {
    const initialLang = getStoredLanguage().toLowerCase();
    langToggleLabel.textContent = initialLang.toUpperCase();
    markActiveLanguage(initialLang);

    langOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const lang = option.dataset.lang?.trim().toLowerCase() || "de";
        langToggleLabel.textContent = lang.toUpperCase();
        markActiveLanguage(lang);
        closeLanguageMenu();
      });
    });

    window.addEventListener("storage", () => {
      const updatedLang = getStoredLanguage().toLowerCase();
      langToggleLabel.textContent = updatedLang.toUpperCase();
      markActiveLanguage(updatedLang);
    });
  }

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

    galleryShells.forEach((shell) => updateGalleryState(shell));
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
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeModal(modal);
      });
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
      if (!(el instanceof HTMLElement)) return false;
      return !el.hasAttribute("disabled");
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
     Galleries
     ========================= */
  function getGalleryStep(row) {
    const firstCard = row.querySelector(".gallery-card");
    if (!(firstCard instanceof HTMLElement)) {
      return Math.max(row.clientWidth * 0.85, 280);
    }

    const cardStyles = window.getComputedStyle(firstCard);
    const rowStyles = window.getComputedStyle(row);

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap =
      parseFloat(rowStyles.columnGap || rowStyles.gap || "0") ||
      parseFloat(cardStyles.marginRight || "0") ||
      0;

    return cardWidth + gap;
  }

  function updateGalleryState(shell) {
    const row = shell.querySelector(".gallery-row");
    const leftArrow = shell.querySelector(".gallery-arrow-left");
    const rightArrow = shell.querySelector(".gallery-arrow-right");

    if (!(row instanceof HTMLElement)) return;
    if (!(leftArrow instanceof HTMLElement) || !(rightArrow instanceof HTMLElement)) return;

    const maxScrollLeft = Math.max(0, row.scrollWidth - row.clientWidth);
    const currentScroll = row.scrollLeft;

    const atStart = currentScroll <= 6;
    const atEnd = currentScroll >= maxScrollLeft - 6;

    leftArrow.disabled = atStart;
    rightArrow.disabled = atEnd;

    leftArrow.classList.toggle("is-disabled", atStart);
    rightArrow.classList.toggle("is-disabled", atEnd);
  }

  function scrollGallery(row, direction) {
    if (!(row instanceof HTMLElement)) return;

    const step = getGalleryStep(row);
    const distance = direction === "left" ? -step * 2 : step * 2;

    row.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  }

  if (galleryShells.length) {
    galleryShells.forEach((shell) => {
      const row = shell.querySelector(".gallery-row");
      const leftArrow = shell.querySelector(".gallery-arrow-left");
      const rightArrow = shell.querySelector(".gallery-arrow-right");

      if (!(row instanceof HTMLElement)) return;

      if (leftArrow instanceof HTMLElement) {
        leftArrow.addEventListener("click", () => {
          scrollGallery(row, "left");
        });
      }

      if (rightArrow instanceof HTMLElement) {
        rightArrow.addEventListener("click", () => {
          scrollGallery(row, "right");
        });
      }

      row.addEventListener(
        "scroll",
        () => {
          updateGalleryState(shell);
        },
        { passive: true }
      );

      updateGalleryState(shell);
    });

    window.addEventListener("load", () => {
      galleryShells.forEach((shell) => updateGalleryState(shell));
    });
  }
});
