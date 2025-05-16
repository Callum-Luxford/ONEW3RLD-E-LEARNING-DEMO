// Modules
const User = require("../models/User");
const Course = require("../models/Course");
const { getCourseProgress } = require("../utils/courseProgressHelpers");
const { localizeCourse } = require("../utils/localizationHelpers");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");

    const lang = req.getLocale();
    const localizedCourses = user.enrolledCourses.map((course) =>
      localizeCourse(course.toObject(), lang)
    );

    const completedLessons = user.progress?.completedLessons || [];

    const coursesWithProgress = localizedCourses.map((course) => {
      const progress = getCourseProgress(course, user.progress);

      const hasCertificate = user.certificates?.some(
        (cert) => cert.courseId.toString() === course._id.toString()
      );

      return {
        ...course,
        ...progress,
        hasCertificate,
      };
    });

    res.render("dashboard/dashboard", {
      title: "Your Dashboard",
      user,
      userCourses: coursesWithProgress,
      pageStyles: ["dashboard.css"],
      pageScripts: ["dashboard.js"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Dashboard error");
  }
};
