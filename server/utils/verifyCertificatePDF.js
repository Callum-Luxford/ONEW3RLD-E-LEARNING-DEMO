const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Generate Verififcation pdf
async function generateVerifiedCertificatePDF(user, course, cert, lang = "en") {
  const fontPath = path.join(__dirname, "../fonts/Cairo-Regular.ttf");
  const pdfPath = path.join(
    __dirname,
    `../certificates/verified-${cert.certId}-${lang}.pdf`
  );
  const courseTitle =
    typeof course.title === "string"
      ? course.title
      : course.title?.[lang] || course.title?.en || "Course Title";

  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0 });
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // Background
  const backgroundPath =
    lang === "ar"
      ? "templates/verified-certificate-ar.png"
      : "templates/verified-certificate-en.png";

  const bgPath = path.join(__dirname, "..", backgroundPath);

  if (fs.existsSync(bgPath)) {
    doc.image(bgPath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });
  }

  doc.fillColor("white");
  if (lang === "ar") {
    doc.font(fontPath);
  } else {
    doc.font("Helvetica-Bold");
  }

  doc.fontSize(28).text(user.fullName?.[lang] || user.fullName, 50, 500, {
    width: 500,
    align: "center",
  });

  doc.fontSize(14).text(cert.certId, 50, 580, {
    width: 500,
    align: "center",
  });

  doc.fontSize(22).text(courseTitle, 50, 670, {
    width: 500,
    align: "center",
  });

  doc
    .fontSize(12)
    .text(
      cert.issuedAt.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB"),
      100,
      757,
      {
        align: "center",
      }
    );
  doc.fontSize(12).text("N/A", 50, 793, {
    align: "center",
  });

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return pdfPath;
}

module.exports = { generateVerifiedCertificatePDF };
