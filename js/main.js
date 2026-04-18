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
     Gallery slider / arrows / dots / drag
     ========================= */
  const galleryRows = document.querySelectorAll(".gallery-row");

  const getGalleryCards = (row) => Array.from(row.querySelectorAll(".gallery-card"));

  const getVisibleStartIndex = (row) => {
    const cards = getGalleryCards(row);
    if (!cards.length) return 0;

    const rowLeft = row.getBoundingClientRect().left;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - rowLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  };

  const scrollToCardIndex = (row, index) => {
    const cards = getGalleryCards(row);
    if (!cards.length) return;

    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const targetCard = cards[safeIndex];

    row.scrollTo({
      left: targetCard.offsetLeft,
      behavior: "smooth",
    });
  };

  const getPageCount = (row) => {
    const controls = row.closest(".area-section")?.querySelector(".gallery-controls");
    const dots = controls?.querySelectorAll(".gallery-dot");
    return dots?.length ? dots.length : 2;
  };

  const getPageIndex = (row) => {
    const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
    if (maxScroll <= 0) return 0;

    const ratio = row.scrollLeft / maxScroll;
    const pageCount = getPageCount(row);
    return Math.min(pageCount - 1, Math.round(ratio * (pageCount - 1)));
  };

  const goToPage = (row, pageIndex) => {
    const pageCount = getPageCount(row);
    if (pageCount <= 1) return;

    const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
    const safePage = Math.max(0, Math.min(pageIndex, pageCount - 1));
    const target = (maxScroll / (pageCount - 1)) * safePage;

    row.scrollTo({
      left: target,
      behavior: "smooth",
    });
  };

  const updateGalleryState = (row) => {
    if (!(row instanceof HTMLElement)) return;

    const controls = row.closest(".area-section")?.querySelector(".gallery-controls");
    const dots = controls?.querySelectorAll(".gallery-dot");
    const prev = controls?.querySelector('[data-gallery-arrow="prev"]');
    const next = controls?.querySelector('[data-gallery-arrow="next"]');

    const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
    const pageIndex = getPageIndex(row);
    const pageCount = getPageCount(row);

    dots?.forEach((dot, index) => {
      dot.classList.toggle("active", index === pageIndex);
      dot.setAttribute("aria-pressed", index === pageIndex ? "true" : "false");
    });

    if (prev instanceof HTMLButtonElement) {
      prev.disabled = row.scrollLeft <= 8;
    }

    if (next instanceof HTMLButtonElement) {
      next.disabled = row.scrollLeft >= maxScroll - 8 || pageIndex >= pageCount - 1;
    }
  };

  galleryRows.forEach((row) => {
    const section = row.closest(".area-section");
    const controls = section?.querySelector(".gallery-controls");

    if (!controls) return;

    const prev = controls.querySelector('[data-gallery-arrow="prev"]');
    const next = controls.querySelector('[data-gallery-arrow="next"]');
    const dots = controls.querySelectorAll(".gallery-dot");

    if (prev instanceof HTMLButtonElement) {
      prev.addEventListener("click", () => {
        const currentPage = getPageIndex(row);
        goToPage(row, currentPage - 1);
      });
    }

    if (next instanceof HTMLButtonElement) {
      next.addEventListener("click", () => {
        const currentPage = getPageIndex(row);
        goToPage(row, currentPage + 1);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToPage(row, index));
    });

    let isPointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;

    const pointerDown = (clientX) => {
      isPointerDown = true;
      moved = false;
      startX = clientX;
      startScrollLeft = row.scrollLeft;
      row.classList.add("is-dragging");
    };

    const pointerMove = (clientX) => {
      if (!isPointerDown) return;
      const walk = clientX - startX;
      if (Math.abs(walk) > 4) moved = true;
      row.scrollLeft = startScrollLeft - walk;
    };

    const pointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      row.classList.remove("is-dragging");

      if (moved) {
        const index = getVisibleStartIndex(row);
        scrollToCardIndex(row, index);
      }
    };

    row.addEventListener("mousedown", (event) => {
      if (event.target.closest("button") && !event.target.closest(".gallery-button")) return;
      pointerDown(event.clientX);
    });

    row.addEventListener("mousemove", (event) => {
      pointerMove(event.clientX);
    });

    window.addEventListener("mouseup", pointerUp);

    row.addEventListener("mouseleave", () => {
      if (isPointerDown) {
        pointerUp();
      }
    });

    row.addEventListener(
      "touchstart",
      (event) => {
        if (!event.touches[0]) return;
        pointerDown(event.touches[0].clientX);
      },
      { passive: true }
    );

    row.addEventListener(
      "touchmove",
      (event) => {
        if (!event.touches[0]) return;
        pointerMove(event.touches[0].clientX);
      },
      { passive: true }
    );

    row.addEventListener("touchend", pointerUp);
    row.addEventListener("touchcancel", pointerUp);

    row.querySelectorAll(".gallery-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        if (moved) {
          event.preventDefault();
          event.stopPropagation();
          moved = false;
        }
      });
    });

    row.addEventListener("scroll", () => updateGalleryState(row), { passive: true });
    window.addEventListener("resize", () => updateGalleryState(row));

    updateGalleryState(row);
  });
});
