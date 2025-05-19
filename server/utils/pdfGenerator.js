const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

async function createCertificatePDF(user, course, certId, req) {
  const lang = req.cookies?.lang || "en";
  const __ = req.__.bind(req); // scoped translator

  const certDir = path.join(__dirname, "../certificates");
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

  const fileName = `${user._id}-${certId}-${lang}.pdf`;
  const certPath = path.join(certDir, fileName);
  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0 });

  const stream = fs.createWriteStream(certPath);
  doc.pipe(stream);

  const backgroundPath =
    lang === "ar"
      ? "templates/certificate-bg-ar.png"
      : "templates/certificate-bg.png";

  const bgPath = path.join(__dirname, "..", backgroundPath);

  if (fs.existsSync(bgPath)) {
    doc.image(bgPath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });
  }

  const fontPath = path.join(__dirname, "../fonts/Cairo-Regular.ttf");

  doc.fillColor("white");

  if (lang === "ar") {
    doc.font(fontPath); // ✅ Arabic-safe font
  } else {
    doc.font("Helvetica-Bold"); // ✅ Default English
  }

  const issuedAt = new Date();

  // Date — inline with "Date Issued:"
  doc.fontSize(12).text(issuedAt.toLocaleDateString(), 315, 148);

  const userName =
    typeof user.fullName === "object"
      ? user.fullName?.[lang] || user.fullName?.en || user.fullName
      : user.fullName;

  // Full Name — centered, lifted higher
  doc.fontSize(32).text(userName, 130, 230, {
    width: 330,
    align: "center",
  });

  // Certificate ID — higher position
  doc.fontSize(14).text(certId, 140, 330, {
    width: 310,
    align: "center",
  });

  const courseTitle =
    typeof course.title === "string"
      ? course.title
      : course.title?.[lang] || course.title?.en || "Course Title";

  console.log("Course title selected:", courseTitle);
  // Course Title — sharply lifted
  doc.fontSize(18).text(courseTitle, 110, 410, {
    width: 370,
    align: "center",
  });

  // QR Code — unchanged
  const qrUrl = `${req.protocol}://${req.get(
    "host"
  )}/certificate/view/${certId}`;

  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  doc.image(qrDataUrl, 260, 500, { width: 80 });

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { certPath, fileName, issuedAt };
}

module.exports = {
  createCertificatePDF,
};
