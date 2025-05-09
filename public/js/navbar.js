document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("mobileNavOverlay");
  const icon = document.getElementById("menuIcon");
  const navLinks = document.querySelectorAll(".nav-links a");
  let currentActive = document.querySelector(".nav-links a.active");

  // Mobile menu toggle logic
  if (toggle && overlay && icon) {
    toggle.addEventListener("click", () => {
      const isOpen = overlay.classList.contains("showing");
      overlay.classList.toggle("showing");
      icon.src = isOpen ? "/icons/burger-menu.png" : "/icons/close-menu.png";
      document.body.style.overflow = isOpen ? "" : "hidden";
    });
  }

  // Hover interaction
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      navLinks.forEach((l) => l.classList.remove("hovered"));
      link.classList.add("hovered");
      if (currentActive) currentActive.classList.remove("active");
    });

    link.addEventListener("mouseleave", () => {
      link.classList.remove("hovered");
      if (currentActive) currentActive.classList.add("active");
    });
  });
});
