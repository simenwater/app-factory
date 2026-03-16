import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice, UserSettings } from "@/types";

/**
 * @description 生成 PDF 发票/报价单
 * @param {Invoice} invoice - 发票数据
 * @param {UserSettings} settings - 用户设置
 * @returns {jsPDF} PDF 文档实例
 */
export function generateInvoicePDF(
  invoice: Invoice,
  settings: UserSettings
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(settings.businessName || "FieldFlow", 20, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  if (settings.ownerName) doc.text(settings.ownerName, 20, 38);
  if (settings.email) doc.text(settings.email, 20, 44);
  if (settings.phone) doc.text(settings.phone, 20, 50);
  if (settings.address) doc.text(settings.address, 20, 56);

  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  const isQuote = invoice.invoiceStatus === "draft";
  doc.text(isQuote ? "QUOTE" : "INVOICE", pageWidth - 20, 30, {
    align: "right",
  });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`#${invoice.invoiceNumber}`, pageWidth - 20, 38, {
    align: "right",
  });
  doc.text(
    `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
    pageWidth - 20,
    44,
    { align: "right" }
  );
  doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 20, 50, {
    align: "right",
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 65, pageWidth - 20, 65);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Bill To:", 20, 75);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(invoice.customer.name, 20, 82);
  if (invoice.customer.email) doc.text(invoice.customer.email, 20, 88);
  if (invoice.customer.phone) doc.text(invoice.customer.phone, 20, 94);
  if (invoice.customer.address) doc.text(invoice.customer.address, 20, 100);

  autoTable(doc, {
    startY: 110,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: invoice.items.map((item) => [
      item.description,
      item.quantity.toString(),
      `${settings.currency} ${item.unitPrice.toFixed(2)}`,
      `${settings.currency} ${(item.quantity * item.unitPrice).toFixed(2)}`,
    ]),
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = ((doc as any).lastAutoTable?.finalY as number) ?? 180;

  const summaryX = pageWidth - 80;
  let summaryY = finalY + 15;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", summaryX, summaryY);
  doc.text(
    `${settings.currency} ${invoice.subtotal.toFixed(2)}`,
    pageWidth - 20,
    summaryY,
    { align: "right" }
  );

  summaryY += 8;
  doc.text(`Tax (${settings.taxRate}%):`, summaryX, summaryY);
  doc.text(
    `${settings.currency} ${invoice.tax.toFixed(2)}`,
    pageWidth - 20,
    summaryY,
    { align: "right" }
  );

  summaryY += 10;
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text("Total:", summaryX, summaryY);
  doc.text(
    `${settings.currency} ${invoice.total.toFixed(2)}`,
    pageWidth - 20,
    summaryY,
    { align: "right" }
  );

  if (invoice.notes) {
    summaryY += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", 20, summaryY);
    doc.text(invoice.notes, 20, summaryY + 7);
  }

  return doc;
}

/**
 * @description 下载 PDF 发票
 */
export function downloadInvoicePDF(
  invoice: Invoice,
  settings: UserSettings
): void {
  const doc = generateInvoicePDF(invoice, settings);
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
}
