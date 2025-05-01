// Modules
const User = require("../models/User");
const passport = require("passport");
const { issueToken } = require("../services/authService");

// GET: Registration from
exports.getRegister = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.render("auth/register", { title: "Register" });
};

// POST: Handle user registration
exports.postRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use");
    }

    const user = new User({ fullName, email, password });
    await user.save();

    // Auto-login after registration
    const token = issueToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// GET: Login form
exports.getLogin = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.render("auth/login", { title: "Login" });
};

// POST: Handle login
exports.postLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).send(info?.message || "Invalid credentials");
    }

    const token = issueToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    res.redirect("/dashboard");
  })(req, res, next);
};

// Handle logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};
