document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.querySelector(".course-sidebar-overlay");
  const sidebar = document.querySelector(".course-sidebar");

  if (!toggleBtn || !overlay || !sidebar) return;

  const isMobile = () => window.innerWidth < 1024;

  if (isMobile()) {
    const openSidebar = () => {
      sidebar.classList.add("open");
      overlay.classList.add("open");
      toggleBtn.classList.add("active");
      document.body.classList.add("sidebar-open");
    };

    const closeSidebar = () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      toggleBtn.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    };

    // Toggle on button
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent document click from firing
      const isOpen = sidebar.classList.contains("open");
      isOpen ? closeSidebar() : openSidebar();
    });

    // Click anywhere on page — except the toggle button — closes sidebar
    document.addEventListener("click", (e) => {
      const isOpen = sidebar.classList.contains("open");

      // Don't close if clicking the toggle button
      if (!isOpen || toggleBtn.contains(e.target)) return;

      closeSidebar();
    });

    // Optional: pressing links still closes it as well
    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeSidebar();
      });
    });
  }
});
