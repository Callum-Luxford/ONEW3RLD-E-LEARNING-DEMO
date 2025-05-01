// Modules
const Course = require("../models/Course");

// viewCourse request: - render courses
exports.viewCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).send("Course not found");

    res.render("courses/index", {
      title: course.title,
      course,
      currentLesson: null,
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

    res.render("courses/index", {
      title: `${course.title} - ${lesson.title}`,
      course,
      currentLesson: lesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading lesson");
  }
};
