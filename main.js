// 🖱️ Mausbewegung erzeugt leichte Bewegung der Karten (Apple Feeling)
document.addEventListener("mousemove", (e) => {

  // X Position der Maus (zentriert berechnet)
  const x = (e.clientX / window.innerWidth - 0.5) * 10;

  // Y Position der Maus
  const y = (e.clientY / window.innerHeight - 0.5) * 10;

  // Alle Glass-Karten bewegen sich leicht mit der Maus
  document.querySelectorAll(".glass").forEach(el => {
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
});
