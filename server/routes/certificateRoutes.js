const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const {
  generateCertificate,
  verifyCertificate,
} = require("../controllers/certificate/certificateController");

// Download Cert Route
router.get("/:courseId/download", requireAuth, generateCertificate);

// Verify Cert Route
router.get("/verify/:certId", verifyCertificate);

module.exports = router;
