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
  function getStoredLanguage() {
    try {
      return localStorage.getItem("nordfit-language") || "de";
    } catch {
      return "de";
    }
  }

  function updateLanguageUI(lang) {
    if (langToggleLabel) {
      langToggleLabel.textContent = lang.toUpperCase();
    }

    if (!langOptions.length) return;

    langOptions.forEach((option) => {
      const optionLang = option.dataset.lang?.trim().toLowerCase();

      if (optionLang === lang) {
        option.classList.add("is-active", "is-selected");
        option.setAttribute("aria-current", "true");
      } else {
        option.classList.remove("is-active", "is-selected");
        option.removeAttribute("aria-current");
      }
    });
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

    updateLanguageUI(getStoredLanguage());
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

  updateLanguageUI(getStoredLanguage());

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

        updateLanguageUI(lang);
        closeLanguageMenu();
      });
    });
  }

  /* =========================
     Outside click close
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

    refreshAllGalleries();
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
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

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
     Galleries
     ========================= */
  const galleryInstances = [];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getGalleryCards(row) {
    return Array.from(row.querySelectorAll(".gallery-card"));
  }

  function getClosestCardIndex(row) {
    const cards = getGalleryCards(row);
    if (!cards.length) return 0;

    const rowLeft = row.scrollLeft;
    let closestIndex = 0;
    let smallestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - rowLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function scrollToCard(row, index, smooth = true) {
    const cards = getGalleryCards(row);
    if (!cards.length) return;

    const safeIndex = clamp(index, 0, cards.length - 1);
    const targetCard = cards[safeIndex];

    row.scrollTo({
      left: targetCard.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function updateGalleryState(instance) {
    const { row, prevButton, nextButton, range } = instance;
    const cards = getGalleryCards(row);
    if (!cards.length) return;

    const activeIndex = getClosestCardIndex(row);
    const maxIndex = cards.length - 1;

    if (prevButton) {
      const disabled = activeIndex <= 0;
      prevButton.disabled = disabled;
      prevButton.classList.toggle("is-disabled", disabled);
    }

    if (nextButton) {
      const disabled = activeIndex >= maxIndex;
      nextButton.disabled = disabled;
      nextButton.classList.toggle("is-disabled", disabled);
    }

    if (range) {
      range.max = String(maxIndex);
      range.value = String(activeIndex);
    }
  }

  function buildGalleryControls(row) {
    const areaSection = row.closest(".area-section");
    if (!areaSection) return null;

    let topbar = areaSection.querySelector(".gallery-topbar");
    if (!topbar) {
      topbar = document.createElement("div");
      topbar.className = "gallery-topbar";
      row.parentNode.insertBefore(topbar, row);
    }

    let controls = topbar.querySelector(".gallery-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "gallery-controls";
      topbar.appendChild(controls);
    }

    let prevButton = controls.querySelector(".gallery-arrow.prev");
    if (!prevButton) {
      prevButton = document.createElement("button");
      prevButton.type = "button";
      prevButton.className = "gallery-arrow prev";
      prevButton.setAttribute("aria-label", "Vorheriges Bild");
      prevButton.innerHTML = "‹";
      controls.appendChild(prevButton);
    }

    let sliderWrap = controls.querySelector(".gallery-slider-wrap");
    if (!sliderWrap) {
      sliderWrap = document.createElement("div");
      sliderWrap.className = "gallery-slider-wrap";
      controls.appendChild(sliderWrap);
    }

    let range = sliderWrap.querySelector(".gallery-range");
    if (!range) {
      range = document.createElement("input");
      range.type = "range";
      range.className = "gallery-range";
      range.min = "0";
      range.step = "1";
      range.value = "0";
      range.setAttribute("aria-label", "Bilder wechseln");
      sliderWrap.appendChild(range);
    }

    let nextButton = controls.querySelector(".gallery-arrow.next");
    if (!nextButton) {
      nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.className = "gallery-arrow next";
      nextButton.setAttribute("aria-label", "Nächstes Bild");
      nextButton.innerHTML = "›";
      controls.appendChild(nextButton);
    }

    return { topbar, controls, prevButton, nextButton, range };
  }

  function setupGallery(row) {
    const controls = buildGalleryControls(row);
    if (!controls) return;

    const { prevButton, nextButton, range } = controls;
    const cards = getGalleryCards(row);
    if (!cards.length) return;

    row.dataset.galleryReady = "true";

    const instance = {
      row,
      prevButton,
      nextButton,
      range,
      isPointerDown: false,
      startX: 0,
      startScrollLeft: 0,
      moved: false,
      scrollTimeout: null,
    };

    prevButton.addEventListener("click", () => {
      const currentIndex = getClosestCardIndex(row);
      scrollToCard(row, currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      const currentIndex = getClosestCardIndex(row);
      scrollToCard(row, currentIndex + 1);
    });

    range.addEventListener("input", () => {
      const index = Number(range.value);
      scrollToCard(row, index, false);
      updateGalleryState(instance);
    });

    range.addEventListener("change", () => {
      const index = Number(range.value);
      scrollToCard(row, index, true);
    });

    row.addEventListener("scroll", () => {
      window.clearTimeout(instance.scrollTimeout);
      updateGalleryState(instance);

      instance.scrollTimeout = window.setTimeout(() => {
        updateGalleryState(instance);
      }, 80);
    }, { passive: true });

    row.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      instance.isPointerDown = true;
      instance.startX = event.clientX;
      instance.startScrollLeft = row.scrollLeft;
      instance.moved = false;

      row.classList.add("is-dragging");
      row.setPointerCapture?.(event.pointerId);
    });

    row.addEventListener("pointermove", (event) => {
      if (!instance.isPointerDown) return;

      const deltaX = event.clientX - instance.startX;
      if (Math.abs(deltaX) > 4) {
        instance.moved = true;
      }

      row.scrollLeft = instance.startScrollLeft - deltaX;
    });

    function endPointerDrag(event) {
      if (!instance.isPointerDown) return;

      instance.isPointerDown = false;
      row.classList.remove("is-dragging");

      try {
        row.releasePointerCapture?.(event.pointerId);
      } catch {}

      const closestIndex = getClosestCardIndex(row);
      scrollToCard(row, closestIndex);
    }

    row.addEventListener("pointerup", endPointerDrag);
    row.addEventListener("pointercancel", endPointerDrag);
    row.addEventListener("pointerleave", (event) => {
      if (!instance.isPointerDown) return;
      endPointerDrag(event);
    });

    const buttons = row.querySelectorAll(".gallery-button");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        if (instance.moved) {
          event.preventDefault();
          event.stopPropagation();
          instance.moved = false;
        }
      });
    });

    galleryInstances.push(instance);
    updateGalleryState(instance);
  }

  function refreshAllGalleries() {
    galleryInstances.forEach((instance) => {
      updateGalleryState(instance);
    });
  }

  galleryRows.forEach((row) => setupGallery(row));

  window.setTimeout(() => {
    refreshAllGalleries();
  }, 120);
});
