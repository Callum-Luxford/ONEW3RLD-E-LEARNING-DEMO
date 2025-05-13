document.addEventListener("DOMContentLoaded", () => {
  // === Animate subheader progress bar ===
  const fill = document.querySelector(".subheader-progress-fill");
  const label = document.querySelector(".subheader-progress-text");

  if (fill && label) {
    const target = parseInt(fill.dataset.progress, 10);

    // Force reflow-based transition
    fill.style.width = "0%";
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.width = `${target}%`;
      }, 30);
    });

    const match = label.textContent.match(/Completed: (\d+) \/ (\d+)/);
    if (match) {
      const final = parseInt(match[1], 10);
      const total = parseInt(match[2], 10);

      let current = 0;
      const interval = setInterval(() => {
        if (current < final) {
          current++;
          label.textContent = `Completed: ${current} / ${total}`;
        } else {
          clearInterval(interval);
        }
      }, 25);
    }
  }

  // === Animate dashboard progress cards (if any still exist) ===
  const courseCards = document.querySelectorAll(".course-card");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const bar = card.querySelector(".progress-fill");
          const label = card.querySelector(".progress-text");

          if (!bar || !label) return;

          const targetPercent = parseInt(bar.dataset.progress, 10);
          bar.style.width = `${targetPercent}%`;

          const match = label.textContent.match(/Completed: (\d+) \/ (\d+)/);
          if (!match) return;

          const final = parseInt(match[1], 10);
          const total = parseInt(match[2], 10);
          let current = 0;

          const countInterval = setInterval(() => {
            if (current < final) {
              current++;
              label.textContent = `Completed: ${current} / ${total}`;
            } else {
              clearInterval(countInterval);
            }
          }, 25);

          obs.unobserve(card);
        }
      });
    },
    { threshold: 0.6 }
  );

  courseCards.forEach((card) => observer.observe(card));
});
