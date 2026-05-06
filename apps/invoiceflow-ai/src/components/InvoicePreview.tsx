"use client";

import { Download, Send, Mail, Trash2 } from "lucide-react";
import type { Invoice } from "@/types";
import { generateInvoicePDF, downloadPDF } from "@/lib/pdf";
import { sendPaymentReminder } from "@/lib/email";
import { useStore } from "@/store/useStore";
import { useState } from "react";

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

/**
 * @description 发票预览与操作面板
 */
export function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const { updateInvoiceStatus, deleteInvoice } = useStore();
  const [sendingReminder, setSendingReminder] = useState(false);

  const handleDownload = () => {
    const blob = generateInvoicePDF(invoice);
    downloadPDF(blob, `${invoice.invoiceNumber}.pdf`);
  };

  const handleMarkSent = () => {
    updateInvoiceStatus(invoice.id, "sent");
  };

  const handleMarkPaid = () => {
    updateInvoiceStatus(invoice.id, "paid");
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    try {
      await sendPaymentReminder(invoice, "followup");
    } finally {
      setSendingReminder(false);
    }
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    onClose();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency,
    }).format(amount);

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            {invoice.invoiceNumber}
          </h3>
          <span className={`status-badge status-${invoice.status} mt-2`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {formatCurrency(invoice.total)}
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Due: {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-[var(--muted-foreground)] mb-1">From</p>
          <p className="font-medium text-[var(--foreground)]">{invoice.from.name}</p>
          <p className="text-[var(--muted-foreground)]">{invoice.from.email}</p>
        </div>
        <div>
          <p className="text-[var(--muted-foreground)] mb-1">To</p>
          <p className="font-medium text-[var(--foreground)]">{invoice.to.name}</p>
          <p className="text-[var(--muted-foreground)]">{invoice.to.email}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 text-[var(--muted-foreground)] font-medium">Item</th>
              <th className="text-right py-2 text-[var(--muted-foreground)] font-medium">Qty</th>
              <th className="text-right py-2 text-[var(--muted-foreground)] font-medium">Price</th>
              <th className="text-right py-2 text-[var(--muted-foreground)] font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--border)]/50">
                <td className="py-2 text-[var(--foreground)]">{item.description}</td>
                <td className="py-2 text-right text-[var(--foreground)]">{item.quantity}</td>
                <td className="py-2 text-right text-[var(--foreground)]">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-2 text-right font-medium text-[var(--foreground)]">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-[var(--muted-foreground)]">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--muted-foreground)]">
            <span>Tax ({invoice.taxRate}%)</span>
            <span>{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-[var(--foreground)] pt-2 border-t border-[var(--border)]">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        {invoice.status === "draft" && (
          <button onClick={handleMarkSent} className="btn-secondary flex items-center gap-2">
            <Send className="w-4 h-4" /> Mark as Sent
          </button>
        )}
        {(invoice.status === "sent" || invoice.status === "overdue") && (
          <>
            <button onClick={handleMarkPaid} className="btn-secondary flex items-center gap-2">
              ✓ Mark as Paid
            </button>
            <button
              onClick={handleSendReminder}
              disabled={sendingReminder}
              className="btn-secondary flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {sendingReminder ? "Sending..." : "Send Reminder"}
            </button>
          </>
        )}
        <button
          onClick={handleDelete}
          className="btn-secondary flex items-center gap-2 text-[var(--destructive)]"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}
