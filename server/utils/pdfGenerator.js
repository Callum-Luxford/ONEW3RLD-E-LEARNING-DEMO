const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

async function createCertificatePDF(user, course, certId, req) {
  const certDir = path.join(__dirname, "../certificates");
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

  const fileName = `${user._id}-${certId}.pdf`;
  const certPath = path.join(certDir, fileName);
  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0 });
  const stream = fs.createWriteStream(certPath);
  doc.pipe(stream);

  const bgPath = path.join(__dirname, "../templates/certificate-bg.png");
  if (fs.existsSync(bgPath)) {
    doc.image(bgPath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });
  }

  doc.fillColor("white").font("Helvetica-Bold");

  const issuedAt = new Date();

  // Date — inline with "Date Issued:"
  doc.fontSize(12).text(issuedAt.toLocaleDateString(), 315, 148);

  // Full Name — centered, lifted higher
  doc.fontSize(32).text(user.fullName, 130, 230, {
    width: 330,
    align: "center",
  });

  // Certificate ID — higher position
  doc.fontSize(14).text(certId, 140, 330, {
    width: 310,
    align: "center",
  });

  // Course Title — sharply lifted
  doc.fontSize(18).text(course.title, 110, 410, {
    width: 370,
    align: "center",
  });

  // QR Code — unchanged
  const qrUrl = `${req.protocol}://${req.get(
    "host"
  )}/certificate/verify/${certId}`;
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
