// certificateController.js

const fs = require("fs");
const path = require("path");
const Course = require("../../models/Course");
const User = require("../../models/User");
const { createCertificatePDF } = require("../../utils/pdfGenerator");

// Certificate Generation Controller
exports.generateCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    const progress = user.progress.find((p) => p.course.equals(courseId));
    if (!progress || !progress.completedLessons.includes("1-1-quiz")) {
      return res.status(403).send("Complete the course to unlock certificate.");
    }

    const certificateId = `RSA-${userId.toString().slice(-6)}-${Date.now()
      .toString()
      .slice(-4)}`;

    const { certPath, fileName, issuedAt } = await createCertificatePDF(
      user,
      course,
      certificateId,
      req
    );

    user.certificates.push({
      courseId,
      filePath: `/certificates/${fileName}`,
      issuedAt,
      certId: certificateId,
    });

    await user.save();
    return res.download(certPath);
  } catch (err) {
    console.error("Certificate generation failed:", err);
    res.status(500).send("Certificate error.");
  }
};

// QR Certificate Verification Controller
exports.verifyCertificate = async (req, res) => {
  const { certId } = req.params;

  const user = await User.findOne({ "certificates.certId": certId });
  if (!user) return res.status(404).send("Certificate not found");

  const cert = user.certificates.find((c) => c.certId === certId);
  const course = await Course.findById(cert.courseId);

  res.render("quizzes/verify", {
    title: "Verify Certificate",
    fullName: user.fullName,
    courseTitle: course.title,
    issuedAt: cert.issuedAt.toLocaleDateString(),
    certId: cert.certId,
  });
};
