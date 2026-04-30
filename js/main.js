document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const headerInner = document.querySelector(".site-header-inner");
  const burger = document.getElementById("burger");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const modals = document.querySelectorAll(".modal");
  const modalTriggers = document.querySelectorAll("[data-modal-target]");
  const modalCloseButtons = document.querySelectorAll(".modal-close");

  const setMenuState = (isOpen) => {
    if (!burger || !nav) return;

    burger.classList.toggle("is-active", isOpen);
    nav.classList.toggle("open", isOpen);
    body.classList.toggle("nav-open", isOpen);

    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  };

  const closeMobileMenu = () => setMenuState(false);
  const openMobileMenu = () => setMenuState(true);

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.contains("open");
      setMenuState(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        closeAllModals();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        closeMobileMenu();
      }
    });
  }

  const updateHeaderScrollState = () => {
    if (!headerInner) return;

    if (window.scrollY > 8) {
      headerInner.classList.add("scrolled");
    } else {
      headerInner.classList.remove("scrolled");
    }
  };

  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

  const openModal = (modal) => {
    if (!modal) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    const closeButton = modal.querySelector(".modal-close");
    if (closeButton) closeButton.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  };

  function closeAllModals() {
    modals.forEach((modal) => closeModal(modal));
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-modal-target");
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  const contactForm = document.querySelector("[data-nordfit-contact-form]");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);

      const firstName = formData.get("contact-firstname") || "";
      const lastName = formData.get("contact-lastname") || "";
      const email = formData.get("contact-email") || "";
      const phone = formData.get("contact-phone") || "";
      const topic = formData.get("contact-topic") || "";
      const memberId = formData.get("contact-memberid") || "";
      const message = formData.get("contact-message") || "";

      const subject = encodeURIComponent(`NordFit Kontakt – ${topic || "Allgemeine Anfrage"}`);

      const bodyText = [
        `Vorname: ${firstName}`,
        `Nachname: ${lastName}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone || "Nicht angegeben"}`,
        `Thema: ${topic}`,
        `Member ID: ${memberId || "Nicht angegeben"}`,
        "",
        "Nachricht:",
        message
      ].join("\n");

      window.location.href =
        `mailto:nordgroup.business@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    });
  }

  const galleryRows = document.querySelectorAll(".gallery-row");

  galleryRows.forEach((row) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    row.addEventListener("mousedown", (event) => {
      isDown = true;
      row.classList.add("is-dragging");
      startX = event.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
    });

    row.addEventListener("mouseleave", () => {
      isDown = false;
      row.classList.remove("is-dragging");
    });

    row.addEventListener("mouseup", () => {
      isDown = false;
      row.classList.remove("is-dragging");
    });

    row.addEventListener("mousemove", (event) => {
      if (!isDown) return;

      event.preventDefault();

      const x = event.pageX - row.offsetLeft;
      const walk = (x - startX) * 1.4;
      row.scrollLeft = scrollLeft - walk;
    });
  });

  const galleryArrows = document.querySelectorAll("[data-gallery-target]");

  galleryArrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const targetId = arrow.getAttribute("data-gallery-target");
      const direction = arrow.getAttribute("data-gallery-direction");
      const row = document.getElementById(targetId);

      if (!row) return;

      const scrollAmount = Math.min(row.clientWidth * 0.85, 460);

      row.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    });
  });
});
