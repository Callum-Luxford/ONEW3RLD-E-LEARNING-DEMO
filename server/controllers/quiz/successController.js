// Modules
const Course = require("../../models/Course");
const User = require("../../models/User");

exports.renderSuccessPage = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).send("Course not found");

    const user = await User.findById(req.user._id);
    const progress = user.progress.find((p) => p.course.equals(courseId));

    // For later - (Course-Wide)
    // const hasCompletedCourse =
    //   progress &&
    //   course.modules.every((mod) =>
    //     mod.lessons.every((lesson) =>
    //       progress.completedLessons.includes(lesson.id)
    //     )
    //   );

    const hasCompletedCourse =
      progress && progress.completedLessons.includes("1-1-quiz");

    const lang = req.cookies.lang || "en";
    const translations = require(`../../locales/${lang}.json`);

    res.render("quizzes/success", {
      title: "Course Complete",
      course,
      user,
      lang,
      translations,
      pageTitle: "Course Completed",
      showSidebarToggle: true,
      currentLesson: null,
      pageStyles: ["sidebar.css", "quiz.css", "quiz-result.css"],
      pageScripts: ["courseSidebar.js"],
      hasCompletedCourse,
    });
    
  } catch (err) {
    console.error("Success page error:", err);
    res.status(500).send("Error loading success page.");
  }
};
