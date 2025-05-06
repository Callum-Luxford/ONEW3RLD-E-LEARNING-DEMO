// Modules
const Course = require("../models/Course");
const User = require("../models/User");

// viewCourse request: - render courses
exports.viewCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const user = await User.findById(req.user._id);

    if (!course) return res.status(404).send("Course not found");

    res.render("courses/index", {
      title: course.title,
      course,
      currentLesson: null,
      user, 
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
      course,
      currentLesson: lesson,
      isCompleted,
      user,
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
