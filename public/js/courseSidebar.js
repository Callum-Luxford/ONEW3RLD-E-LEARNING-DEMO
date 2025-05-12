document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.querySelector(".course-sidebar-overlay");
  const sidebar = document.querySelector(".course-sidebar");

  function closeSidebar() {
    overlay.classList.remove("open");
    sidebar.classList.remove("open");
  }

  function openSidebar() {
    overlay.classList.add("open");
    sidebar.classList.add("open");
  }

  if (toggleBtn && overlay && sidebar) {
    toggleBtn.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    overlay.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target)) {
        closeSidebar();
      }
    });

    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeSidebar();
      });
    });
  }
});
