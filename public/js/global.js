document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    localStorage.setItem("langPulse", btn.getAttribute("href"));
  });
});
window.addEventListener("DOMContentLoaded", () => {
  const langPulseHref = localStorage.getItem("langPulse");

  if (langPulseHref) {
    const btn = document.querySelector(`.lang-btn[href="${langPulseHref}"]`);
    if (btn) {
      const pulse = document.createElement("span");
      pulse.classList.add("lang-pulse");
      btn.appendChild(pulse);

      pulse.addEventListener("animationend", () => {
        pulse.remove();
        localStorage.removeItem("langPulse"); // clear it after use
      });
    } else {
      localStorage.removeItem("langPulse");
    }
  }
});
