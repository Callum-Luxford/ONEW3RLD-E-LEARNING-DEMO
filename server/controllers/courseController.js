// Modules
const Course = require("../models/Course");
const User = require("../models/User");
const { getNextIncompleteLesson } = require("../utils/courseProgressHelpers");

// viewCourse request: - render courses
exports.viewCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).send("Course not found");

    const user = await User.findById(req.user._id);
    const progress = user?.progress?.find(
      (p) => p.course.toString() === course._id.toString()
    );
    const completed = progress?.completedLessons || [];

    const nextLesson = getNextIncompleteLesson(course, completed);

    if (nextLesson) {
      return res.redirect(
        `/courses/${course._id}/modules/${nextLesson.moduleId}/lessons/${nextLesson.lessonId}`
      );
    }

    res.render("courses/index", {
      title: course.title,
      course,
      currentLesson: null,
      user,
      preTitleText: "Course:",
      pageTitle: course.title,
      pageStyles: ["lessonView.css", "sidebar.css", "pageSubheader.css"],
      pageScripts: ["courseSidebar.js"],
      showSidebarToggle: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading course");
  }
};



// ViewLesson - render lesson
exports.viewLesson = async (req, res) => {
  const { courseId, moduleId, lessonId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).send("Course not found");

    const module = course.modules.find((mod) => mod.id === moduleId);
    const lesson = module?.lessons.find((les) => les.id === lessonId);
    if (!lesson) return res.status(404).send("Lesson not found");

    const user = await User.findById(req.user._id);
    const userCourseProgress = user.progress.find((p) =>
      p.course.equals(course._id)
    ) || { completedLessons: [] };

    const completedLessons = userCourseProgress.completedLessons || [];

    // Flatten all lessons to determine order
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const isUnlocked =
      lesson.id === "intro-1" ||
      (currentIndex === 0
        ? completedLessons.includes("intro-1")
        : completedLessons.includes(allLessons[currentIndex - 1].id));

    if (!isUnlocked)
      return res
        .status(403)
        .send("This lesson is locked. Complete the previous lesson first.");

    const isCompleted = completedLessons.includes(lesson.id);

    console.log("Current lesson:", lesson.id);
    console.log("Completed lessons:", completedLessons);
    console.log("Is completed:", isCompleted);

    res.render("courses/index", {
      title: `${course.title} - ${lesson.title}`,
      pageTitle: lesson.title,
      course,
      moduleId: module.id,
      currentLesson: lesson,
      isCompleted,
      user,
      pageStyles: ["lessonView.css", "sidebar.css"],
      pageScripts: ["courseSidebar.js"],
      showSidebarToggle: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading lesson");
  }
};

// completeLesson - To check and push completed lesson to user progress
exports.completeLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const flatLessons = course.modules.flatMap((m) => m.lessons);
    const lesson = flatLessons.find((l) => l.id === lessonId);

    // Prevent completing a locked or quiz lesson via POST
    if (
      lesson.id.includes("locked") ||
      (lesson.id !== "intro-1" &&
        lesson.quiz &&
        Array.isArray(lesson.quiz.questions) &&
        lesson.quiz.questions.length > 0)
    ) {
      return res.redirect(
        `/courses/${courseId}/modules/${lesson.id.split("-")[0]}/lessons/${
          lesson.id
        }`
      );
    }

    const user = await User.findById(req.user._id);
    let progress = user.progress.find((p) => p.course.equals(courseId));

    if (progress) {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
    } else {
      user.progress.push({
        course: courseId,
        completedLessons: [lessonId],
      });
    }

    await user.save();

    // Redirect to next lesson if any
    const currentIndex = flatLessons.findIndex((l) => l.id === lessonId);
    const nextLesson = flatLessons[currentIndex + 1];

    if (nextLesson) {
      const nextModule = course.modules.find((m) =>
        m.lessons.some((l) => l.id === nextLesson.id)
      );
      return res.redirect(
        `/courses/${courseId}/modules/${nextModule.id}/lessons/${nextLesson.id}`
      );
    } else {
      return res.redirect(`/courses/${courseId}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to complete lesson");
  }
};

// Show all courses for /courses/list
exports.showAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    const user = await User.findById(req.user._id);
    const enrolledIds = user.enrolledCourses.map((c) => c.toString());

    // res.locals.user = user;

    res.render("marketplace/list", {
      title: "Available Courses",
      courses,
      enrolledIds,
      preTitleText: "Available",
      pageTitle: "Courses",
    });
  } catch (err) {
    console.error("Error loading course list:", err);
    res.status(500).send("Course list error");
  }
};

// Handle course enrollment
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      user.progress.push({ course: courseId, completedLessons: [] });
      await user.save();
    }

    res.redirect(`/courses/${courseId}`);
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).send("Enrollment failed");
  }
};
