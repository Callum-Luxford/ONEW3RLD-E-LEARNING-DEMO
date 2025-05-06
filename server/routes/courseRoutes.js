// Modules
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { requireAuth } = require("../middleware/authMiddleware");

// View course (no lesson selected)
router.get("/:courseId", requireAuth, courseController.viewCourse);

// View specfic lesson
router.get(
  "/:courseId/modules/:moduleId/lessons/:lessonId",
  requireAuth,
  courseController.viewLesson
);

// Marks current lesson complete for tracking
router.post(
  "/:courseId/complete/:lessonId",
  requireAuth,
  courseController.completeLesson
);

module.exports = router;
