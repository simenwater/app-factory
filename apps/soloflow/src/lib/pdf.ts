/**
 * @description PDF 生成模块 — 用于导出报价单和发票为 PDF
 */

import type { Quote, Invoice, Client } from "@/types";
import { formatCurrency, formatDate } from "./utils";

/**
 * @description 生成报价单 PDF（使用 jsPDF）
 * @param {Quote} quote - 报价单数据
 * @param {Client} client - 客户信息
 */
export async function generateQuotePDF(quote: Quote, client: Client): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text("QUOTE", 20, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${formatDate(quote.createdAt)}`, 20, 45);
  doc.text(`Valid Until: ${formatDate(quote.validUntil)}`, 20, 52);
  doc.text(`Status: ${quote.status.toUpperCase()}`, 20, 59);

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("Bill To:", 120, 45);
  doc.setFontSize(10);
  doc.text(client.name, 120, 52);
  doc.text(client.company || "", 120, 59);
  doc.text(client.email, 120, 66);

  autoTable(doc, {
    startY: 80,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: quote.items.map((item) => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.quantity * item.unitPrice),
    ]),
    foot: [
      ["", "", "Subtotal", formatCurrency(quote.subtotal)],
      ["", "", `Tax (${quote.taxRate}%)`, formatCurrency(quote.taxAmount)],
      ["", "", "Total", formatCurrency(quote.total)],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    footStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: "bold" },
  });

  if (quote.notes) {
    const finalY = ((doc as unknown as Record<string, Record<string, number>>).lastAutoTable?.finalY as number) || 200;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", 20, finalY + 15);
    doc.text(quote.notes, 20, finalY + 22);
  }

  doc.save(`quote-${quote.id.slice(0, 8)}.pdf`);
}

/**
 * @description 生成发票 PDF
 * @param {Invoice} invoice - 发票数据
 * @param {Client} client - 客户信息
 */
export async function generateInvoicePDF(invoice: Invoice, client: Client): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.setTextColor(16, 185, 129);
  doc.text("INVOICE", 20, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 45);
  doc.text(`Date: ${formatDate(invoice.createdAt)}`, 20, 52);
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 59);

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("Bill To:", 120, 45);
  doc.setFontSize(10);
  doc.text(client.name, 120, 52);
  doc.text(client.company || "", 120, 59);
  doc.text(client.email, 120, 66);

  autoTable(doc, {
    startY: 80,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: invoice.items.map((item) => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.quantity * item.unitPrice),
    ]),
    foot: [
      ["", "", "Subtotal", formatCurrency(invoice.subtotal)],
      ["", "", `Tax (${invoice.taxRate}%)`, formatCurrency(invoice.taxAmount)],
      ["", "", "Total", formatCurrency(invoice.total)],
    ],
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
    footStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: "bold" },
  });

  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
}
