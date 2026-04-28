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
  const galleryRows = document.querySelectorAll(".gallery-row");

  let lastFocusedElement = null;
  const galleryInstances = [];
  let resizeTimeout = null;

  /* =========================
     Header scroll state
     ========================= */
  const updateHeaderScrollState = () => {
    if (!headerInner) return;
    headerInner.classList.toggle("scrolled", window.scrollY > 10);
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

    siteNav.querySelectorAll("a").forEach((link) => {
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
  function getSavedLanguage() {
    try {
      return (localStorage.getItem("nordfit-language") || "de").toLowerCase();
    } catch {
      return "de";
    }
  }

  function markActiveLanguage(langCode) {
    if (!langOptions.length) return;

    langOptions.forEach((option) => {
      const optionLang = option.dataset.lang?.trim().toLowerCase();
      const isActive = optionLang === langCode;

      option.classList.toggle("is-selected", isActive);
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function syncLanguageUi(langCode) {
    const safeLang = (langCode || "de").toLowerCase();

    if (langToggleLabel) {
      langToggleLabel.textContent = safeLang.toUpperCase();
    }

    markActiveLanguage(safeLang);
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

  syncLanguageUi(getSavedLanguage());

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

        syncLanguageUi(lang);

        window.dispatchEvent(
          new CustomEvent("nordfit:language-changed", {
            detail: { language: lang },
          })
        );

        closeLanguageMenu();
      });
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === "nordfit-language") {
      syncLanguageUi((event.newValue || "de").toLowerCase());
    }
  });

  window.addEventListener("nordfit:language-ui-sync", (event) => {
    const nextLanguage = event.detail?.language;
    if (typeof nextLanguage === "string") {
      syncLanguageUi(nextLanguage.toLowerCase());
    }
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

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(() => {
      galleryInstances.forEach((instance) => {
        instance.update(true);
      });
    }, 90);
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
     Basic focus trap for modals
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
      return el instanceof HTMLElement && !el.hasAttribute("disabled");
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
     Gallery helpers
     ========================= */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setupGallery(row) {
    const shell = row.closest(".gallery-shell");
    if (!shell) return null;

    const cards = Array.from(row.querySelectorAll(".gallery-card"));
    if (!cards.length) return null;

    const prevButton = shell.querySelector(".gallery-arrow-left");
    const nextButton = shell.querySelector(".gallery-arrow-right");

    if (!(prevButton instanceof HTMLButtonElement)) return null;
    if (!(nextButton instanceof HTMLButtonElement)) return null;

    let isDragging = false;
    let dragMoved = false;
    let startX = 0;
    let scrollStart = 0;
    let rafId = null;

    const getCardWidth = () => {
      const firstCard = cards[0];
      if (!firstCard) return 0;

      const cardRect = firstCard.getBoundingClientRect();
      const rowStyles = window.getComputedStyle(row);
      const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || "0");

      return cardRect.width + gap;
    };

    const getCurrentIndex = () => {
      const cardWidth = getCardWidth();
      if (!cardWidth) return 0;
      return clamp(Math.round(row.scrollLeft / cardWidth), 0, cards.length - 1);
    };

    const getMaxScroll = () => Math.max(0, row.scrollWidth - row.clientWidth);

    const scrollToIndex = (indexToGo, behavior = "smooth") => {
      const cardWidth = getCardWidth();
      const maxScroll = getMaxScroll();
      const nextScroll = clamp(indexToGo * cardWidth, 0, maxScroll);

      row.scrollTo({
        left: nextScroll,
        behavior,
      });
    };

    const updateButtons = () => {
      const maxScroll = getMaxScroll();
      const currentIndex = getCurrentIndex();
      const atStart = row.scrollLeft <= 4 || currentIndex <= 0;
      const atEnd = row.scrollLeft >= maxScroll - 4 || currentIndex >= cards.length - 1;

      prevButton.disabled = atStart;
      nextButton.disabled = atEnd;

      prevButton.classList.toggle("is-disabled", atStart);
      nextButton.classList.toggle("is-disabled", atEnd);
    };

    const update = (snapAfterResize = false) => {
      if (snapAfterResize) {
        const currentIndex = getCurrentIndex();
        scrollToIndex(currentIndex, "auto");
      }

      updateButtons();
    };

    const scrollByOne = (direction) => {
      const currentIndex = getCurrentIndex();
      const nextIndex = clamp(currentIndex + direction, 0, cards.length - 1);
      scrollToIndex(nextIndex, "smooth");
    };

    prevButton.addEventListener("click", () => scrollByOne(-1));
    nextButton.addEventListener("click", () => scrollByOne(1));

    row.addEventListener(
      "scroll",
      () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateButtons);
      },
      { passive: true }
    );

    row.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      isDragging = true;
      dragMoved = false;
      startX = event.clientX;
      scrollStart = row.scrollLeft;
      row.classList.add("is-dragging");
      row.setPointerCapture?.(event.pointerId);
    });

    row.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6) {
        dragMoved = true;
      }

      row.scrollLeft = scrollStart - delta;
    });

    const endDrag = (event) => {
      if (!isDragging) return;

      isDragging = false;
      row.classList.remove("is-dragging");
      row.releasePointerCapture?.(event.pointerId);

      const currentIndex = getCurrentIndex();
      scrollToIndex(currentIndex, "smooth");

      setTimeout(() => {
        updateButtons();
        dragMoved = false;
      }, 180);
    };

    row.addEventListener("pointerup", endDrag);
    row.addEventListener("pointercancel", endDrag);

    row.addEventListener("mouseleave", () => {
      if (!isDragging) return;

      isDragging = false;
      row.classList.remove("is-dragging");

      const currentIndex = getCurrentIndex();
      scrollToIndex(currentIndex, "smooth");

      setTimeout(() => {
        updateButtons();
        dragMoved = false;
      }, 180);
    });

    cards.forEach((card) => {
      const button = card.querySelector(".gallery-button");
      if (!(button instanceof HTMLButtonElement)) return;

      button.addEventListener("click", (event) => {
        if (dragMoved) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    });

    scrollToIndex(0, "auto");
    update();

    return {
      row,
      update,
    };
  }

  if (galleryRows.length) {
    galleryRows.forEach((row) => {
      const instance = setupGallery(row);
      if (instance) {
        galleryInstances.push(instance);
      }
    });
  }
});
