// Function for progress bar and number counting animation
document.addEventListener("DOMContentLoaded", () => {
  const courseCards = document.querySelectorAll(".course-card");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;

          // Animate bar
          const bar = card.querySelector(".progress-fill");
          const targetPercent = parseInt(bar.dataset.progress, 10);
          bar.style.width = `${targetPercent}%`;

          // Animate number
          const label = card.querySelector(".progress-text");
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

          obs.unobserve(card); // Animate once
        }
      });
    },
    {
      threshold: 0.6, // 60% of the card must be visible
    }
  );

  courseCards.forEach((card) => observer.observe(card));
});
