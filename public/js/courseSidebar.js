document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.querySelector(".course-sidebar-overlay");
  const sidebar = document.querySelector(".course-sidebar");

  if (!toggleBtn || !overlay || !sidebar) return;

  // Toggle sidebar open/close
  toggleBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("open");

    if (isOpen) {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      toggleBtn.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    } else {
      sidebar.classList.add("open");
      overlay.classList.add("open");
      toggleBtn.classList.add("active");
      document.body.classList.add("sidebar-open");
    }
  });

  // Click anywhere outside sidebar (even inside overlay) to close
  // Close when clicking anywhere on the overlay (including its children)
  overlay.addEventListener("click", (e) => {
    if (sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      toggleBtn.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    }
  });

  // Close when clicking a link
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      toggleBtn.classList.remove("active");

      setTimeout(() => {
        document.body.classList.remove("sidebar-open");
      }, 300); // matches your CSS transition duration
    });
  });
});


