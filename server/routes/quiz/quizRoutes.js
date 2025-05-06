// Modules
const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/quiz/quizController");
const successController = require("../../controllers/quiz/successController");
const { requireAuth } = require("../../middleware/authMiddleware");

// GET: quiz
router.get(
  "/:courseId/modules/:moduleId/lessons/:lessonId/quiz",
  requireAuth,
  quizController.renderQuiz
);

// POST: quiz submission
router.post(
  "/:courseId/modules/:moduleId/lessons/:lessonId/quiz",
  requireAuth,
  quizController.submitQuiz
);

// GET: Quiz success page
router.get(
  "/:courseId/success",
  requireAuth,
  successController.renderSuccessPage
);

module.exports = router;
