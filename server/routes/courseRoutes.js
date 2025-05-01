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

module.exports = router;
