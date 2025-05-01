// Modules
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id).populate("enrolledCourses");
    // res.render("dashboard/dashboard", {
    //   title: "Your Dashboard",
    //   user,
    //   courses: user.enrolledCourses,
    // });

    const user = await User.findById(req.user._id);
    res.render("dashboard/dashboard", {
      title: "Your Dashboard",
      user,
      courses: [], // Empty for now
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Dashbaord error");
  }
};
