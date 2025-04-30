// Modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");

// Call .env and connectDB before initializing everything
dotenv.config();
connectDB();

// App instance
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// EJS + Layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Test route
app.get("/", (req, res) => {
  res.render("index.ejs", { title: "Welcome to RSA DEMO" });
});

// INIT APP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at hhtp://localhost:${PORT}`)
);
