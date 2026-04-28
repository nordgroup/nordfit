/* =========================
   NordFit main.js
   Header / Burger / Sprache / Modals / Reveal / Galleries / Forms
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
  const modalTriggers = document.querySelectorAll("[data-modal-target]");
  const revealElements = document.querySelectorAll(".reveal");
  const galleryRows = document.querySelectorAll(".gallery-row");
  const contactForms = document.querySelectorAll("form[data-nordfit-contact-form]");

  let lastFocusedElement = null;
  const galleryInstances = [];

  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];

  function getSavedLanguage() {
    try {
      const saved = (localStorage.getItem("nordfit-language") || "de").toLowerCase();
      return supportedLanguages.includes(saved) ? saved : "de";
    } catch {
      return "de";
    }
  }

  function saveLanguage(langCode) {
    try {
      localStorage.setItem("nordfit-language", langCode);
    } catch {}
  }

  function syncLanguageUi(langCode) {
    const safeLang = supportedLanguages.includes((langCode || "").toLowerCase())
      ? langCode.toLowerCase()
      : "de";

    if (langToggleLabel) {
      langToggleLabel.textContent = safeLang.toUpperCase();
    }

    langOptions.forEach((option) => {
      const optionLang = (option.dataset.lang || "").trim().toLowerCase();
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

    closeLanguageMenu();

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

    const isOpen = langMenu.classList.contains("show");
    if (isOpen) {
      closeLanguageMenu();
    } else {
      openLanguageMenu();
    }
  }

  syncLanguageUi(getSavedLanguage());

  if (burger && siteNav) {
    burger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleBurgerMenu();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
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

      const lang = (option.dataset.lang || "").trim().toLowerCase();
      if (!supportedLanguages.includes(lang)) return;

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

  window.addEventListener("storage", (event) => {
    if (event.key !== "nordfit-language") return;
    syncLanguageUi(event.newValue || "de");
  });

  window.addEventListener("nordfit:language-ui-sync", (event) => {
    const nextLanguage = event.detail?.language;
    if (typeof nextLanguage === "string") {
      syncLanguageUi(nextLanguage);
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

    if (!clickedInsideBurger && window.innerWidth <= 980) {
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
    if (window.innerWidth > 980) {
      closeBurgerMenu();
    }

    galleryInstances.forEach((instance) => instance.update());
  });

  if (revealElements.length) {
    if ("IntersectionObserver" in window) {
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
    } else {
      revealElements.forEach((element) => element.classList.add("visible"));
    }
  }

  function getFocusableElements(container) {
    const focusableSelectors = [
      "button",
      "[href]",
      "input",
      "select",
      "textarea",
      "[tabindex]:not([tabindex='-1'])",
    ];

    return Array.from(container.querySelectorAll(focusableSelectors.join(","))).filter((element) => {
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
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

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

  window.openModal = openModalById;
  window.closeAllNordFitModals = closeAllModals;

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      const modalId = trigger.getAttribute("data-modal-target");
      openModalById(modalId);
    });
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
      const tolerance = 4;

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

    function endDrag(event) {
      if (!isDragging) return;

      isDragging = false;
      row.classList.remove("is-dragging");
      row.releasePointerCapture?.(event.pointerId);

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

  galleryRows.forEach((row) => {
    const instance = setupGallery(row);
    if (instance) {
      galleryInstances.push(instance);
    }
  });

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
});
