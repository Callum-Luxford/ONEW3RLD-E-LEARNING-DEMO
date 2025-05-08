// Modules
const passport = require("passport");

// Middleware to protect routes using JWT
const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect("/auth/login"); // redirect on failure
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  requireAuth,
};
