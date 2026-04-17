/**
 * @fileoverview PDF 报价单和合同生成
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Quote, Contract, Client, BusinessSettings } from "@/types";
import { formatCurrency, formatDate } from "./utils";

/**
 * 生成报价单 PDF
 * @param {Quote} quote - 报价单数据
 * @param {Client} client - 客户数据
 * @param {BusinessSettings} settings - 业务设置
 */
export function generateQuotePDF(
  quote: Quote,
  client: Client,
  settings: BusinessSettings
): void {
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(settings.businessName || "ContractFlow", 20, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(settings.ownerName, 20, 38);
  doc.text(settings.email, 20, 44);
  doc.text(settings.phone, 20, 50);

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text("QUOTATION", 140, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Quote #: ${quote.quoteNumber}`, 140, 40);
  doc.text(`Date: ${formatDate(quote.createdAt)}`, 140, 46);
  doc.text(`Valid Until: ${formatDate(quote.validUntil)}`, 140, 52);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 60, 190, 60);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Bill To:", 20, 72);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(client.name, 20, 80);
  if (client.company) doc.text(client.company, 20, 86);
  doc.text(client.email, 20, client.company ? 92 : 86);

  if (quote.title) {
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(quote.title, 20, 106);
  }

  if (quote.description) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(quote.description, 20, 114, { maxWidth: 170 });
  }

  const tableData = quote.lineItems.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice, settings.currency),
    formatCurrency(item.total, settings.currency),
  ]);

  autoTable(doc, {
    startY: 124,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 180;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", 130, finalY + 12);
  doc.text(formatCurrency(quote.subtotal, settings.currency), 170, finalY + 12, { align: "right" });

  if (quote.taxRate > 0) {
    doc.text(`Tax (${quote.taxRate}%):`, 130, finalY + 20);
    doc.text(formatCurrency(quote.taxAmount, settings.currency), 170, finalY + 20, { align: "right" });
  }

  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text("Total:", 130, finalY + 32);
  doc.text(formatCurrency(quote.total, settings.currency), 170, finalY + 32, { align: "right" });

  if (quote.notes) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", 20, finalY + 48);
    doc.text(quote.notes, 20, finalY + 56, { maxWidth: 170 });
  }

  doc.save(`${quote.quoteNumber}.pdf`);
}

/**
 * 生成合同 PDF
 * @param {Contract} contract - 合同数据
 * @param {Client} client - 客户数据
 * @param {BusinessSettings} settings - 业务设置
 */
export function generateContractPDF(
  contract: Contract,
  client: Client,
  settings: BusinessSettings
): void {
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(settings.businessName || "ContractFlow", 20, 30);

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text("SERVICE CONTRACT", 105, 50, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Contract #: ${contract.contractNumber}`, 20, 64);
  doc.text(`Date: ${formatDate(contract.createdAt)}`, 140, 64);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 70, 190, 70);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Parties", 20, 82);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Provider: ${settings.businessName} (${settings.ownerName})`, 20, 90);
  doc.text(`Client: ${client.name}${client.company ? ` (${client.company})` : ""}`, 20, 97);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Project Description", 20, 112);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(contract.description || "N/A", 20, 120, { maxWidth: 170 });

  let yPos = 136;

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Scope of Work", 20, yPos);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(contract.scope || "As per discussion.", 20, yPos + 8, { maxWidth: 170 });
  yPos += 28;

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Terms & Conditions", 20, yPos);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(contract.terms || "Standard terms apply.", 20, yPos + 8, { maxWidth: 170 });
  yPos += 28;

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Project Timeline", 20, yPos);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Start: ${formatDate(contract.startDate)}`, 20, yPos + 8);
  doc.text(`End: ${formatDate(contract.endDate)}`, 20, yPos + 14);
  yPos += 28;

  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text(`Total Amount: ${formatCurrency(contract.totalAmount, settings.currency)}`, 20, yPos);
  yPos += 20;

  doc.setDrawColor(226, 232, 240);
  doc.line(20, yPos, 90, yPos);
  doc.line(110, yPos, 190, yPos);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Provider Signature", 20, yPos + 6);
  doc.text("Client Signature", 110, yPos + 6);

  doc.save(`${contract.contractNumber}.pdf`);
}
