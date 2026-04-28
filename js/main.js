document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const burger = document.getElementById("burger");
  const siteNav = document.querySelector(".site-nav");

  const langToggle = document.getElementById("lang-toggle");
  const langMenu = document.getElementById("lang-menu");
  const langOptions = Array.from(document.querySelectorAll(".lang-option"));

  const revealElements = document.querySelectorAll(".reveal");
  const galleryShells = document.querySelectorAll("[data-gallery]");

  function closeBurgerMenu() {
    if (!burger || !siteNav) return;
    burger.classList.remove("is-active");
    siteNav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }

  function toggleBurgerMenu() {
    if (!burger || !siteNav) return;
    const isOpen = siteNav.classList.toggle("is-open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    body.classList.toggle("menu-open", isOpen);
  }

  if (burger && siteNav) {
    burger.addEventListener("click", toggleBurgerMenu);

    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        closeBurgerMenu();
      });
    });
  }

  function closeLangMenu() {
    if (!langToggle || !langMenu) return;
    langToggle.classList.remove("is-open");
    langMenu.classList.remove("is-open");
    langToggle.setAttribute("aria-expanded", "false");
  }

  function openLangMenu() {
    if (!langToggle || !langMenu) return;
    langToggle.classList.add("is-open");
    langMenu.classList.add("is-open");
    langToggle.setAttribute("aria-expanded", "true");
  }

  function toggleLangMenu(event) {
    event.stopPropagation();
    if (!langToggle || !langMenu) return;

    const isOpen = langMenu.classList.contains("is-open");
    if (isOpen) {
      closeLangMenu();
    } else {
      openLangMenu();
    }
  }

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", toggleLangMenu);

    langOptions.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        closeLangMenu();

        const nextLang = option.dataset.lang?.trim().toLowerCase();
        if (!nextLang) return;

        window.dispatchEvent(
          new CustomEvent("nordfit:language-changed", {
            detail: { language: nextLang },
          })
        );
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideDropdown = event.target.closest(".language-dropdown");
      if (!clickedInsideDropdown) {
        closeLangMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLangMenu();
        closeBurgerMenu();
        closeAllModals();
      }
    });
  }

  function revealOnScroll() {
    if (!revealElements.length) return;

    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const visible = rect.top < window.innerHeight - 80;
      if (visible) {
        element.classList.add("is-visible");
      }
    });
  }

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("resize", revealOnScroll);

  galleryShells.forEach((shell) => {
    const row = shell.querySelector(".gallery-row");
    const prev = shell.querySelector(".gallery-arrow-left");
    const next = shell.querySelector(".gallery-arrow-right");

    if (!row || !prev || !next) return;

    const getScrollAmount = () => {
      const firstCard = row.querySelector(".gallery-card");
      if (!firstCard) return 320;

      const styles = window.getComputedStyle(row);
      const gap = parseFloat(styles.columnGap || styles.gap || "24");
      return firstCard.offsetWidth + gap;
    };

    prev.addEventListener("click", () => {
      row.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    });

    next.addEventListener("click", () => {
      row.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    });
  });

  function openModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    const anyOpenModal = document.querySelector(".modal.is-open");
    if (!anyOpenModal) {
      body.classList.remove("modal-open");
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.is-open").forEach((modal) => {
      closeModal(modal);
    });
  }

  window.openModal = openModalById;

  document.querySelectorAll(".modal").forEach((modal) => {
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

  window.addEventListener("nordfit:language-ui-sync", () => {
    closeLangMenu();
  });
});
