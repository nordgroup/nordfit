// 🌫 leichte Mausbewegung für „Liquid Feeling“
document.addEventListener("mousemove", (e) => {

  const x = (e.clientX / window.innerWidth - 0.5) * 4;
  const y = (e.clientY / window.innerHeight - 0.5) * 4;

  document.querySelectorAll(".glass").forEach(el => {
    el.style.transform = `translate(${x}px, ${y}px)`;
  });

});
