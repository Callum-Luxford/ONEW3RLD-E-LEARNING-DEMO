// Modules
const User = require("../models/User");
const Course = require("../models/Course");
const { getCourseProgress } = require("../utils/courseProgressHelpers");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");

    const completedLessons = user.progress?.completedLessons || [];

    const coursesWithProgress = user.enrolledCourses.map((course) => {
      const progress = getCourseProgress(course, user.progress);

      return {
        ...course.toObject(),
        ...progress,
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
