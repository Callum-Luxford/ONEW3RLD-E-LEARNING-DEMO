module.exports = (req, res, next) => {
  if (req.user) res.locals.user = req.user;
  res.locals.lang = req.cookies.lang || "en";
  res.locals.__ = res.__; // This is critical
  next();
};
