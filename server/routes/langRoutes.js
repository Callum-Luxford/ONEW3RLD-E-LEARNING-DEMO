const express = require("express");
const router = express.Router();

// Middleware to apply selected language or detect from browser
const languageMiddleware = (req, res, next) => {
  if (!req.cookies.lang) {
    const browserLang = req.acceptsLanguages("ar", "en") || "en";
    req.setLocale(browserLang);
    res.cookie("lang", browserLang, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
  } else {
    req.setLocale(req.cookies.lang);
  }

  next();
};

// Language switch route
router.get("/set-language/:lang", (req, res) => {
  const lang = req.params.lang;

  res.cookie("lang", lang, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  req.setLocale(lang);

  const referer = req.get("referer") || "/";

  // Prevent redirecting to self
  if (referer.includes("/set-language")) {
    return res.redirect("/");
  }

  res.redirect(referer);
});

module.exports = {
  router,
  languageMiddleware,
};
