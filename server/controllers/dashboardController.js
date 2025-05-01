// Modules
const User = require("../models/User");
const Course = require("../models/Course"); // required for populate

// Function to - Render dashboard and populate user with Course/'s
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    res.render("dashboard/dashboard", {
      title: "Your Dashboard",
      user,
      courses: user.enrolledCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Dashbaord error");
  }
};
