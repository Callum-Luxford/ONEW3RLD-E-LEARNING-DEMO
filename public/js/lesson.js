// Video overlay for play button img functionality 
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("lessonVideo");
  const overlay = document.getElementById("videoOverlay");

  if (!video || !overlay) return;

  // Show native controls now that overlay won't block them
  video.setAttribute("controls", "true");

  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden"); // fade out + disable events
    video.play();

    // (optional) focus video so keyboard users can use controls
    video.focus();
  });
});
