// Modules
const jwt = require("jsonwebtoken");

// Redirection middlware - for authenticated users 
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(); // not logged in → allow access

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect("/dashboard"); // token valid → redirect
  } catch (err) {
    return next(); // token invalid → continue to login/register
  }
};

module.exports = { redirectIfAuthenticated };
