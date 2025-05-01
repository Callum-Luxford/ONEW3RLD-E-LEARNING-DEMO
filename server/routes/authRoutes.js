// Modules
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { redirectIfAuthenticated } = require("../middleware/guestMiddleware");

// Register
router.get("/register", redirectIfAuthenticated, authController.getRegister);
router.post("/register", authController.postRegister);

// Login
router.get("/login", redirectIfAuthenticated, authController.getLogin);
router.post("/login", authController.postLogin);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
