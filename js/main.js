/* =========================
   NordFit main.js
   Header / Burger / Sprache / Modals / Galleries / Forms
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
  const galleryRows = document.querySelectorAll(".gallery-row");
  const contactForms = document.querySelectorAll("form[data-nordfit-contact-form]");

  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];
  const defaultLanguage = "de";

  let lastFocusedElement = null;
  const galleryInstances = [];

  function isMobileNav() {
    return window.innerWidth <= 980;
  }

  function getSafeLanguage(lang) {
    const cleanLang = String(lang || "").trim().toLowerCase();
    return supportedLanguages.includes(cleanLang) ? cleanLang : defaultLanguage;
  }

  function getSavedLanguage() {
    try {
      return getSafeLanguage(localStorage.getItem("nordfit-language") || defaultLanguage);
    } catch {
      return defaultLanguage;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem("nordfit-language", getSafeLanguage(lang));
    } catch {
      /* localStorage can be unavailable in private/restricted mode */
    }
  }

  function syncLanguageUi(langCode) {
    const safeLang = getSafeLanguage(langCode);

    if (langToggleLabel) {
      langToggleLabel.textContent = safeLang.toUpperCase();
    }

    langOptions.forEach((option) => {
      const optionLang = getSafeLanguage(option.dataset.lang);
      const isActive = optionLang === safeLang;

      option.classList.toggle("is-selected", isActive);
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateHeaderScrollState() {
    if (!headerInner) return;
    headerInner.classList.toggle("scrolled", window.scrollY > 10);
  }

  function closeBurgerMenu() {
    if (!burger || !siteNav) return;

    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("open");
    body.classList.remove("nav-open");
  }

  function openBurgerMenu() {
    if (!burger || !siteNav) return;

    closeLanguageMenu();

    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    siteNav.classList.add("open");
    body.classList.add("nav-open");
  }

  function toggleBurgerMenu() {
    if (!burger || !siteNav) return;

    if (siteNav.classList.contains("open")) {
      closeBurgerMenu();
    } else {
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

    closeBurgerMenu();

    langToggle.classList.add("is-open");
    langToggle.setAttribute("aria-expanded", "true");
    langMenu.classList.add("show");
  }

  function toggleLanguageMenu() {
    if (!langToggle || !langMenu) return;

    if (langMenu.classList.contains("show")) {
      closeLanguageMenu();
    } else {
      openLanguageMenu();
    }
  }

  function getFocusableElements(container) {
    const selectors = [
      "button",
      "[href]",
      "input",
      "select",
      "textarea",
      "[tabindex]:not([tabindex='-1'])",
    ];

    return Array.from(container.querySelectorAll(selectors.join(","))).filter((element) => {
      return (
        element instanceof HTMLElement &&
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true"
      );
    });
  }

  function openModalById(modalId) {
    if (!modalId) return;

    const modal = document.getElementById(modalId);
    if (!modal) return;

    closeLanguageMenu();
    closeBurgerMenu();

    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    const firstFocusable = getFocusableElements(modal)[0];

    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  }

  function closeModal(modal) {
    if (!(modal instanceof HTMLElement)) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    const anyOpenModal = document.querySelector(".modal.show");

    if (!anyOpenModal) {
      body.classList.remove("modal-open");

      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }

      lastFocusedElement = null;
    }
  }

  function closeAllModals() {
    modalElements.forEach((modal) => closeModal(modal));
  }

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

    function getCardWidth() {
      const firstCard = cards[0];
      if (!firstCard) return 0;

      const cardRect = firstCard.getBoundingClientRect();
      const rowStyles = window.getComputedStyle(row);
      const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || "0");

      return cardRect.width + gap;
    }

    function getMaxScroll() {
      return Math.max(0, row.scrollWidth - row.clientWidth);
    }

    function getCurrentIndex() {
      const cardWidth = getCardWidth();
      if (!cardWidth) return 0;

      return clamp(Math.round(row.scrollLeft / cardWidth), 0, cards.length - 1);
    }

    function scrollToIndex(indexToGo, behavior = "smooth") {
      const cardWidth = getCardWidth();
      const maxScroll = getMaxScroll();
      const nextScroll = clamp(indexToGo * cardWidth, 0, maxScroll);

      row.scrollTo({
        left: nextScroll,
        behavior,
      });
    }

    function updateButtons() {
      const maxScroll = getMaxScroll();
      const tolerance = 5;

      const atStart = row.scrollLeft <= tolerance;
      const atEnd = row.scrollLeft >= maxScroll - tolerance || maxScroll <= tolerance;

      prevButton.disabled = atStart;
      nextButton.disabled = atEnd;

      prevButton.classList.toggle("is-disabled", atStart);
      nextButton.classList.toggle("is-disabled", atEnd);
    }

    function update() {
      updateButtons();
    }

    function scrollByOne(direction) {
      const currentIndex = getCurrentIndex();
      const nextIndex = clamp(currentIndex + direction, 0, cards.length - 1);
      scrollToIndex(nextIndex, "smooth");
    }

    prevButton.addEventListener("click", () => scrollByOne(-1));
    nextButton.addEventListener("click", () => scrollByOne(1));

    row.addEventListener(
      "scroll",
      () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(update);
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

      if (typeof row.setPointerCapture === "function") {
        row.setPointerCapture(event.pointerId);
      }
    });

    row.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const delta = event.clientX - startX;

      if (Math.abs(delta) > 6) {
        dragMoved = true;
      }

      row.scrollLeft = scrollStart - delta;
    });

    function endDrag(event) {
      if (!isDragging) return;

      isDragging = false;
      row.classList.remove("is-dragging");

      if (typeof row.releasePointerCapture === "function") {
        try {
          row.releasePointerCapture(event.pointerId);
        } catch {
          /* pointer may already be released */
        }
      }

      const currentIndex = getCurrentIndex();
      scrollToIndex(currentIndex, "smooth");
      update();
    }

    row.addEventListener("pointerup", endDrag);
    row.addEventListener("pointercancel", endDrag);

    row.addEventListener("mouseleave", () => {
      if (!isDragging) return;

      isDragging = false;
      row.classList.remove("is-dragging");

      const currentIndex = getCurrentIndex();
      scrollToIndex(currentIndex, "smooth");
      update();
    });

    cards.forEach((card) => {
      const button = card.querySelector(".gallery-button");
      if (!(button instanceof HTMLButtonElement)) return;

      button.addEventListener("click", (event) => {
        if (!dragMoved) return;

        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      });
    });

    scrollToIndex(0, "auto");
    update();

    return {
      row,
      update,
    };
  }

  function setupContactForms() {
    contactForms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const mail = "nordgroup.business@gmail.com";
        const formData = new FormData(form);

        const firstname = String(formData.get("contact-firstname") || "").trim();
        const lastname = String(formData.get("contact-lastname") || "").trim();
        const email = String(formData.get("contact-email") || "").trim();
        const phone = String(formData.get("contact-phone") || "").trim();
        const topic = String(formData.get("contact-topic") || "").trim();
        const memberId = String(formData.get("contact-memberid") || "").trim();
        const message = String(formData.get("contact-message") || "").trim();

        const subject = encodeURIComponent(`NordFit Kontaktanfrage: ${topic || "Allgemein"}`);

        const bodyLines = [
          "Neue Kontaktanfrage über die NordFit Website",
          "",
          `Name: ${firstname} ${lastname}`.trim(),
          `E-Mail: ${email}`,
          phone ? `Telefon: ${phone}` : "Telefon: nicht angegeben",
          `Thema: ${topic || "nicht ausgewählt"}`,
          memberId ? `Member ID: ${memberId}` : "Member ID: nicht angegeben",
          "",
          "Nachricht:",
          message,
        ];

        const mailBody = encodeURIComponent(bodyLines.join("\n"));

        window.location.href = `mailto:${mail}?subject=${subject}&body=${mailBody}`;
      });
    });
  }

  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

  syncLanguageUi(getSavedLanguage());

  if (burger && siteNav) {
    burger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleBurgerMenu();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (isMobileNav()) {
          closeBurgerMenu();
        }
      });
    });
  }

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleLanguageMenu();
    });

    langMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  langOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const lang = getSafeLanguage(option.dataset.lang);

      saveLanguage(lang);
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
    const lang = getSafeLanguage(event.detail?.language);
    syncLanguageUi(lang);
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

    if (!clickedInsideBurger && isMobileNav()) {
      closeBurgerMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeLanguageMenu();
    closeBurgerMenu();
    closeAllModals();
  });

  window.addEventListener("resize", () => {
    if (!isMobileNav()) {
      closeBurgerMenu();
    }

    galleryInstances.forEach((instance) => instance.update());
  });

  window.openModal = openModalById;
  window.closeAllNordFitModals = closeAllModals;

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-modal-target]");
    if (!trigger) return;

    event.preventDefault();

    const modalId = trigger.getAttribute("data-modal-target");
    openModalById(modalId);
  });

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

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const openModal = document.querySelector(".modal.show");
    if (!openModal) return;

    const focusableElements = getFocusableElements(openModal);
    if (!focusableElements.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !openModal.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  galleryRows.forEach((row) => {
    const instance = setupGallery(row);
    if (instance) {
      galleryInstances.push(instance);
    }
  });

  setupContactForms();
});
