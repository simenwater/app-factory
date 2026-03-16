"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { downloadInvoicePDF } from "@/lib/pdf";
import type { InvoiceStatus, PaymentStatus } from "@/types";

/**
 * @description 发票详情页
 */
export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { invoices, updateInvoice, deleteInvoice, settings } = useStore();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Invoice Not Found</h2>
          <Link href="/invoices" className="text-primary hover:underline">
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    downloadInvoicePDF(invoice, settings);
  };

  const handleSend = () => {
    updateInvoice(id, { invoiceStatus: "sent" as InvoiceStatus });
  };

  const handleMarkPaid = () => {
    updateInvoice(id, {
      paymentStatus: "paid" as PaymentStatus,
      paidAmount: invoice.total,
      paidDate: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(id);
      router.push("/invoices");
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">#{invoice.invoiceNumber}</h1>
            <div className="mt-1 flex gap-2">
              <StatusBadge status={invoice.invoiceStatus} />
              <StatusBadge status={invoice.paymentStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Bill To
        </h3>
        <p className="font-semibold">{invoice.customer.name}</p>
        {invoice.customer.email && (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {invoice.customer.email}
          </p>
        )}
      </div>

      {/* Line Items */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Items
        </h3>
        <div className="space-y-3">
          {invoice.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.description}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {item.quantity} x{" "}
                  {formatCurrency(item.unitPrice, settings.currency)}
                </p>
              </div>
              <p className="font-medium">
                {formatCurrency(
                  item.quantity * item.unitPrice,
                  settings.currency
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-3 dark:border-border-dark">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Subtotal
            </span>
            <span>{formatCurrency(invoice.subtotal, settings.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Tax ({settings.taxRate}%)
            </span>
            <span>{formatCurrency(invoice.tax, settings.currency)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(invoice.total, settings.currency)}
            </span>
          </div>
          {invoice.paymentStatus === "paid" && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Paid</span>
              <span>
                {formatCurrency(invoice.paidAmount, settings.currency)}
                {invoice.paidDate && ` on ${formatDate(invoice.paidDate)}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted dark:text-text-muted-dark">
            Created
          </span>
          <span>{formatDate(invoice.createdAt)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-text-muted dark:text-text-muted-dark">
            Due Date
          </span>
          <span>{formatDate(invoice.dueDate)}</span>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Notes
          </h3>
          <p className="text-sm">{invoice.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Download size={16} />
            Download PDF
          </button>
          {invoice.invoiceStatus === "draft" && (
            <button
              onClick={handleSend}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              <Send size={16} />
              Mark as Sent
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {invoice.paymentStatus !== "paid" && (
            <button
              onClick={handleMarkPaid}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
            >
              <CheckCircle2 size={16} />
              Mark as Paid
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center justify-center rounded-xl bg-red-50 px-4 py-3 text-red-600 shadow-sm transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
