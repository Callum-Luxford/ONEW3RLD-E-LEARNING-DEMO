// quiz-ui.js

/**
 * Initialize step-by-step quiz question navigation
 * Hides all questions initially except the first, then steps through each on button click
 */
function initQuizStepNavigation() {
  const questions = document.querySelectorAll(".question-block");
  if (!questions.length) return;

  let currentIndex = 0;

  // Show only the first question
  questions.forEach((q, i) => {
    q.style.display = i === 0 ? "block" : "none";
  });

  // Animate progress for the first question
  const firstBar = questions[0].querySelector(".progress-fill");
  if (firstBar) {
    const step = parseInt(firstBar.dataset.fillStep);
    const total = parseInt(firstBar.dataset.total);
    const percent = (step / total) * 100;
    setTimeout(() => {
      firstBar.style.width = percent + "%";
    }, 50);
  }

  // Handle "Next Question" clicks
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("quiz-next")) return;

    // Hide current question
    questions[currentIndex].style.display = "none";

    // Move to next question
    currentIndex++;

    if (questions[currentIndex]) {
      questions[currentIndex].style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Animate progress bar
      const bar = questions[currentIndex].querySelector(".progress-fill");
      if (bar) {
        const step = parseInt(bar.dataset.fillStep);
        const total = parseInt(bar.dataset.total);
        const percent = (step / total) * 100;
        bar.style.width = percent + "%"; // Animate from current to new
      }
    }
  });
}


/**
 * Placeholder: Display quiz score feedback
 * (This would be called on the quiz result page)
 */
function displayQuizResults(score, total) {
  const resultContainer = document.querySelector(".quiz-results");
  if (!resultContainer) return;

  const percentage = Math.round((score / total) * 100);
  resultContainer.innerHTML = `
    <p>You scored <strong>${score} / ${total}</strong> (${percentage}%)</p>
    ${
      percentage === 100
        ? `<p class="success">✅ Well done! You passed the quiz.</p>`
        : `<p class="fail">❌ You did not pass. Please try again.</p>`
    }
  `;
}

/**
 * Enable visual selection highlighting for quiz options
 * Works with checkboxes or radio buttons
 */
function initQuizOptionSelection() {
  const questionBlocks = document.querySelectorAll(".question-block");

  questionBlocks.forEach((block) => {
    const options = block.querySelectorAll(".quiz-option");

    options.forEach((opt) => {
      const input = opt.querySelector("input");

      input.addEventListener("change", () => {
        if (input.type === "checkbox") {
          // MULTI-SELECT: Toggle this one only
          if (input.checked) {
            opt.classList.add("selected");
          } else {
            opt.classList.remove("selected");
          }
        } else if (input.type === "radio") {
          // SINGLE-SELECT: Remove from all, then add to this
          options.forEach((o) => o.classList.remove("selected"));
          if (input.checked) {
            opt.classList.add("selected");
          }
        }
      });
    });
  });
}


// Run scripts on load
document.addEventListener("DOMContentLoaded", () => {
  initQuizStepNavigation();
  initQuizOptionSelection();
});
