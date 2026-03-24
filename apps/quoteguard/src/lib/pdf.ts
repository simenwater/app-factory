import type { Quote } from "@/types";
import { calculateQuoteTotal } from "./quote";
import { formatCurrency, formatDate } from "./utils";

/**
 * @description 生成报价单 PDF
 * @param {Quote} quote - 报价单数据
 * @param {string} businessName - 商家名称
 */
export async function generateQuotePDF(
  quote: Quote,
  businessName: string
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF();
  const total = calculateQuoteTotal(quote.lineItems);

  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text("QUOTEGUARD", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(businessName || "QuoteGuard User", 20, 35);

  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text("Quote / Invoice", 20, 55);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Quote #: ${quote.id}`, 20, 65);
  doc.text(`Date: ${formatDate(quote.createdAt)}`, 20, 72);
  doc.text(`Valid for: ${quote.validDays} days`, 20, 79);

  doc.text("Bill To:", 130, 65);
  doc.setTextColor(30, 41, 59);
  doc.text(quote.clientName, 130, 72);
  if (quote.clientEmail) {
    doc.text(quote.clientEmail, 130, 79);
  }
  doc.text(`Project: ${quote.projectName}`, 130, 86);

  const tableData = quote.lineItems.map((item) => [
    item.description,
    item.quantity.toString(),
    item.unit,
    formatCurrency(item.unitPrice, quote.currency),
    formatCurrency(item.quantity * item.unitPrice, quote.currency),
  ]);

  (doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
    startY: 100,
    head: [["Description", "Qty", "Unit", "Unit Price", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
    foot: [["", "", "", "Total", formatCurrency(total, quote.currency)]],
    footStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: "bold" },
  });

  if (quote.notes) {
    const finalY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", 20, finalY);
    doc.setTextColor(30, 41, 59);
    doc.text(quote.notes, 20, finalY + 7, { maxWidth: 170 });
  }

  doc.save(`quote-${quote.id}.pdf`);
}
