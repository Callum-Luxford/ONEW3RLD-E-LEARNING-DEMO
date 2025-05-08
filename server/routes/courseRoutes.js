// Modules
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const injectUserLocals = require("../middleware/injectUserLocals");
const {
  viewCourse,
  viewLesson,
  completeLesson,
  showAllCourses,
  enrollInCourse,
} = require("../controllers/courseController");

// Show all available courses with enrollment status
router.get("/list", requireAuth, injectUserLocals, showAllCourses);

// Enroll in a new course
router.post("/:courseId/enroll", requireAuth, enrollInCourse);

// View course (no lesson selected)
router.get("/:courseId", requireAuth, viewCourse);

// View specfic lesson
router.get(
  "/:courseId/modules/:moduleId/lessons/:lessonId",
  requireAuth,
  viewLesson
);

// Marks current lesson complete for tracking
router.post("/:courseId/complete/:lessonId", requireAuth, completeLesson);

module.exports = router;
