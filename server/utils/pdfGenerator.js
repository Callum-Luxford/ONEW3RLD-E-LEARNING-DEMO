const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

async function createCertificatePDF(user, course, certId, req) {
  const certDir = path.join(__dirname, "../certificates");
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

  const fileName = `${user._id}-${certId}.pdf`;
  const certPath = path.join(certDir, fileName);
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });

  const stream = fs.createWriteStream(certPath);
  doc.pipe(stream);

  // Header
  doc.fontSize(28).fillColor("#000").text("UAE", { align: "left" });
  doc
    .fontSize(24)
    .fillColor("#000")
    .text("Certificate of Completion", { align: "center", underline: true });

  // Spacer
  doc.moveDown(2);

  // Full Name
  doc
    .fontSize(36)
    .fillColor("#000")
    .text(user.fullName, { align: "center", bold: true });

  // Subtext
  doc
    .moveDown()
    .fontSize(18)
    .text("This is to certify that", { align: "center" })
    .moveDown()
    .fontSize(22)
    .text(`has successfully completed the accredited training course:`, {
      align: "center",
    });

  // Course Title
  doc
    .moveDown()
    .fontSize(24)
    .fillColor("#003366")
    .text(course.title, { align: "center", bold: true });

  // Certificate ID + Date
  const issuedAt = new Date();
  doc
    .fontSize(12)
    .fillColor("black")
    .text(`Certificate Number: ${certId}`, 50, 500)
    .text(`Date Issued: ${issuedAt.toLocaleDateString()}`, 50, 515);

  // QR Code
  const qrUrl = `${req.protocol}://${req.get(
    "host"
  )}/certificate/verify/${certId}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  doc.image(qrDataUrl, 700, 430, { width: 80 });

  // Signatures (placeholder)
  doc
    .fontSize(14)
    .text("Signed on behalf of RSA UAE", 100, 430)
    .text("xxxxxxxx", 100, 450)
    .text("CEO Director", 100, 470);

  doc
    .text("Signed on behalf of NQC", 500, 430)
    .text("xxxxxxxx", 500, 450)
    .text("Training Lead", 500, 470);

  doc.end();

  return { certPath, fileName, issuedAt };
}

module.exports = {
  createCertificatePDF,
};
