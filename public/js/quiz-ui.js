// quiz-ui.js

/**
 * Initialize step-by-step quiz question navigation
 * Hides all questions initially except the first, then steps through each on button click
 */
function initQuizStepNavigation() {
  const questions = document.querySelectorAll(".question-block");
  const nextBtns = document.querySelectorAll(".next-btn");

  if (!questions.length) return;

  // Hide all except first question
  questions.forEach((q, i) => {
    q.style.display = i === 0 ? "block" : "none";
  });

  nextBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      questions[index].style.display = "none";
      if (questions[index + 1]) {
        questions[index + 1].style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
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

// Run scripts on load
document.addEventListener("DOMContentLoaded", () => {
  initQuizStepNavigation();
});
