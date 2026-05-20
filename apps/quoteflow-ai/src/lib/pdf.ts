import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Quote, UserSettings } from "@/types";
import { formatCurrency, formatDate } from "./utils";

/**
 * @description 生成报价单 PDF
 * @param {Quote} quote - 报价单数据
 * @param {UserSettings} settings - 用户设置
 */
export function generateQuotePDF(quote: Quote, settings: UserSettings): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(24);
  doc.setTextColor(99, 102, 241);
  doc.text("QUOTATION", 20, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(quote.quoteNumber, 20, 38);

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  const fromX = 20;
  const toX = pageWidth / 2 + 10;
  let y = 55;

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("FROM", fromX, y);
  doc.text("TO", toX, y);
  y += 6;

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(settings.businessName || "Your Business", fromX, y);
  doc.text(quote.client.name, toX, y);
  y += 5;

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  if (settings.email) doc.text(settings.email, fromX, y);
  if (quote.client.email) doc.text(quote.client.email, toX, y);
  y += 5;
  if (settings.phone) doc.text(settings.phone, fromX, y);
  if (quote.client.phone) doc.text(quote.client.phone, toX, y);

  y += 15;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${formatDate(quote.createdAt)}`, fromX, y);
  doc.text(`Valid Until: ${formatDate(quote.validUntil)}`, toX, y);

  y += 10;
  const tableBody = quote.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice, settings.currency),
    formatCurrency(item.quantity * item.unitPrice, settings.currency),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  const summaryX = pageWidth - 80;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", summaryX, finalY);
  doc.text(formatCurrency(quote.subtotal, settings.currency), summaryX + 50, finalY, { align: "right" });

  doc.text("Tax:", summaryX, finalY + 7);
  doc.text(formatCurrency(quote.tax, settings.currency), summaryX + 50, finalY + 7, { align: "right" });

  doc.setFontSize(12);
  doc.setTextColor(99, 102, 241);
  doc.text("Total:", summaryX, finalY + 17);
  doc.text(formatCurrency(quote.total, settings.currency), summaryX + 50, finalY + 17, { align: "right" });

  if (quote.notes) {
    const notesY = finalY + 30;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", 20, notesY);
    doc.setTextColor(30, 41, 59);
    const splitNotes = doc.splitTextToSize(quote.notes, pageWidth - 40);
    doc.text(splitNotes, 20, notesY + 6);
  }

  doc.save(`${quote.quoteNumber}.pdf`);
}
