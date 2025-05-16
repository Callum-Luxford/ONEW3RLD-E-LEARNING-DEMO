// Modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const i18n = require("i18n");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const passport = require("./services/passportConfig");

// Call .env and connectDB before initializing everything
connectDB();

// App instance
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// view/download existing certificates
app.use(
  "/certificates",
  express.static(path.join(__dirname, "..", "certificates"))
);
app.use(cookieParser());

i18n.configure({
  locales: ["en", "ar"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  cookie: "lang",
  queryParameter: "lang",
  autoReload: true,
  updateFiles: false,
  syncFiles: false,
  objectNotation: true,
});

app.use(i18n.init);

// EJS + Layout / View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Passport Init
app.use(passport.initialize());

// req.user object to -> Global for all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// currentRoute available globally for nav highlighting
app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

// InjectUSerLocales Middlware
const injectUserLocals = require("./middleware/injectUserLocals");
app.use(injectUserLocals);

// Middleware Routes:
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const courseRoutes = require("./routes/courseRoutes");
const quizRoutes = require("./routes/quiz/quizRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const {
  router: langRoutes,
  languageMiddleware,
} = require("./routes/langRoutes");

app.use(languageMiddleware);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/courses", courseRoutes);
app.use("/courses", quizRoutes);
app.use("/certificate", certificateRoutes);
app.use("/", langRoutes);

// Root request
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// INIT APP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at hhtp://localhost:${PORT}`)
);
