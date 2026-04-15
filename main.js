// Smooth scroll für Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// kleiner Mouse-Parallax Effekt (Glow bewegt sich leicht)
const glow = document.querySelector(".glow");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});

// Button Effekt
const button = document.querySelector("button");

if (button) {
  button.addEventListener("click", () => {
    button.innerText = "Coming soon…";
    setTimeout(() => {
      button.innerText = "Jetzt starten";
    }, 2000);
  });
}
