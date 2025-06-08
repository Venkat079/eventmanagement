// backend/utils/pdfGenerator.js
const PDFDocument = require("pdfkit");

module.exports = function generatePDF(ticket, teammates = []) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (data) => buffers.push(data));
    doc.on("end", () => {
      const pdf = Buffer.concat(buffers);
      resolve(pdf);
    });

    // Title
    doc.fontSize(20).text("🎟 Event Ticket", { align: "center" });
    doc.moveDown();

    // Ticket details
    doc.fontSize(14);
    doc.text(`Name: ${ticket.user.name}`);
    doc.text(`Email: ${ticket.user.email}`);
    doc.text(`Event: ${ticket.event.title}`);
    doc.text(`Date: ${new Date(ticket.event.date).toLocaleDateString()}`);
    doc.text(`Location: ${ticket.event.location}`);
    doc.text(`Payment Method: ${ticket.usedTokens ? "Tokens" : "Cash"}`);

    // Teammates
    if (teammates.length > 0) {
      doc.moveDown().fontSize(16).text("👥 Team Members:");
      teammates.forEach((tm, i) => {
        doc.fontSize(12).text(`${i + 1}. ${tm.name} - ${tm.email}`);
      });
    }

    // End the PDF
    doc.end();
  });
};
