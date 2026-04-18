/* =========================
   NordFit main.js
   Header / Burger / Sprache / Modals / Reveal / Gallery paging
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
    burger.addEventListener("click", toggleBurgerMenu);

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
      closeBurgerMenu();
      openLanguageMenu();
    }
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
    langOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const lang = option.dataset.lang?.trim().toUpperCase() || "DE";
        langToggleLabel.textContent = lang;
        closeLanguageMenu();
      });
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
    refreshAllGalleryDots();
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
      return !(el instanceof HTMLElement) ? false : !el.hasAttribute("disabled");
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
     Gallery paging dots
     ========================= */
  function getGalleryButtons(galleryId) {
    return document.querySelectorAll(
      `.gallery-dot[data-gallery-target="${galleryId}"]`
    );
  }

  function setActiveGalleryDot(galleryId, pageIndex) {
    const buttons = getGalleryButtons(galleryId);
    buttons.forEach((button) => {
      const isActive = Number(button.dataset.galleryPage) === pageIndex;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function getGalleryPageScrollLeft(gallery) {
    const maxScroll = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
    if (maxScroll <= 0) {
      return [0, 0];
    }
    return [0, maxScroll];
  }

  function scrollGalleryToPage(gallery, pageIndex) {
    const [page0, page1] = getGalleryPageScrollLeft(gallery);
    const targetLeft = pageIndex <= 0 ? page0 : page1;

    gallery.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });

    if (gallery.id) {
      setActiveGalleryDot(gallery.id, pageIndex <= 0 ? 0 : 1);
    }
  }

  function updateGalleryDotsFromScroll(gallery) {
    if (!gallery || !gallery.id) return;

    const maxScroll = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
    if (maxScroll <= 0) {
      setActiveGalleryDot(gallery.id, 0);
      return;
    }

    const current = gallery.scrollLeft;
    const midpoint = maxScroll * 0.5;
    const pageIndex = current < midpoint ? 0 : 1;

    setActiveGalleryDot(gallery.id, pageIndex);
  }

  function refreshAllGalleryDots() {
    galleryRows.forEach((gallery) => updateGalleryDotsFromScroll(gallery));
  }

  galleryRows.forEach((gallery) => {
    let scrollTimeout = null;

    updateGalleryDotsFromScroll(gallery);

    gallery.addEventListener(
      "scroll",
      () => {
        if (scrollTimeout) {
          window.clearTimeout(scrollTimeout);
        }

        scrollTimeout = window.setTimeout(() => {
          updateGalleryDotsFromScroll(gallery);
        }, 40);
      },
      { passive: true }
    );
  });

  const galleryDotButtons = document.querySelectorAll(".gallery-dot[data-gallery-target]");
  galleryDotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.galleryTarget;
      const pageIndex = Number(button.dataset.galleryPage || "0");
      const gallery = document.getElementById(targetId);

      if (!gallery) return;
      scrollGalleryToPage(gallery, pageIndex);
    });
  });

  refreshAllGalleryDots();
});
