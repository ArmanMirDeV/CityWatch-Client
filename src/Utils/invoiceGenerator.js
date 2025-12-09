import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadInvoice = (payment) => {
  const doc = new jsPDF();

  // Company Logo / Header
  doc.setFontSize(22);
  doc.setTextColor(40, 167, 69); // Green color
  doc.text("CityWatch", 14, 22);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Public Infrastructure Issue Reporting System", 14, 30);
  doc.text("Dhaka, Bangladesh", 14, 36);

  // Invoice Title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("INVOICE", 150, 22, { align: "right" });

  // Payment Details
  doc.setFontSize(10);
  doc.text(
    `Invoice ID: INV-${payment.transactionId?.slice(-6).toUpperCase()}`,
    150,
    30,
    { align: "right" }
  );
  doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`, 150, 36, {
    align: "right",
  });

  // Customer Details
  doc.text("Bill To:", 14, 50);
  doc.setFontSize(12);
  doc.text(payment.email, 14, 56);

  // Line Divider
  doc.setDrawColor(200);
  doc.line(14, 60, 196, 60);

  // Table
  autoTable(doc, {
    startY: 65,
    head: [["Description", "Transaction ID", "Amount (BDT)"]],
    body: [
      [
        payment.type === "subscription"
          ? "Premium Subscription"
          : "Service Payment",
        payment.transactionId,
        payment.price,
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: [40, 167, 69] },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total Paid: ${payment.price} BDT`, 196, finalY, { align: "right" });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your contribution to a better city.", 105, 280, {
    align: "center",
  });

  doc.save(`Invoice_${payment.transactionId}.pdf`);
};
