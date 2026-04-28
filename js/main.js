document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const siteNav = document.querySelector(".site-nav");

  if (burger && siteNav) {
    burger.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        element.classList.add("is-visible");
      }
    });
  }

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);

  document.querySelectorAll(".modal").forEach((modal) => {
    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      });
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  });
});

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
