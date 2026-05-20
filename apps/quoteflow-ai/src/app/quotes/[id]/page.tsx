"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Send,
  Check,
  X,
  DollarSign,
  Trash2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateQuotePDF } from "@/lib/pdf";
import { StatusBadge } from "@/components/StatusBadge";
import type { QuoteStatus, PaymentStatus } from "@/types";

/**
 * @description 报价单详情页面
 */
export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { quotes, updateQuote, deleteQuote, settings } = useStore();

  const quote = quotes.find((q) => q.id === params.id);

  if (!quote) {
    return (
      <div className="flex h-96 items-center justify-center px-4">
        <p className="text-text-muted dark:text-text-muted-dark">
          Quote not found
        </p>
      </div>
    );
  }

  /**
   * @description 更新报价单状态
   */
  const handleStatusChange = (quoteStatus: QuoteStatus) => {
    updateQuote(quote.id, { quoteStatus });
  };

  /**
   * @description 标记为已付款
   */
  const handleMarkPaid = () => {
    updateQuote(quote.id, {
      paymentStatus: "paid" as PaymentStatus,
      paidAmount: quote.total,
      paidDate: new Date().toISOString(),
    });
  };

  /**
   * @description 下载 PDF
   */
  const handleDownloadPDF = () => {
    generateQuotePDF(quote, settings);
  };

  /**
   * @description 删除报价单
   */
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      deleteQuote(quote.id);
      router.push("/quotes");
    }
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{quote.quoteNumber}</h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Created {formatDate(quote.createdAt)}
          </p>
        </div>
        <StatusBadge status={quote.quoteStatus} />
      </div>

      {/* Client Info */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h3 className="mb-1 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
          Client
        </h3>
        <p className="font-medium">{quote.client.name}</p>
        {quote.client.company && (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {quote.client.company}
          </p>
        )}
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          {quote.client.email}
        </p>
      </div>

      {/* Service Description */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h3 className="mb-1 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
          Service
        </h3>
        <p className="text-sm">{quote.serviceDescription}</p>
        {quote.aiGenerated && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            ✦ AI Generated
          </span>
        )}
      </div>

      {/* Line Items */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h3 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
          Items
        </h3>
        <div className="space-y-3">
          {quote.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0 dark:border-border-dark"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{item.description}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {item.quantity} × {formatCurrency(item.unitPrice, settings.currency)}
                </p>
              </div>
              <span className="font-medium">
                {formatCurrency(
                  item.quantity * item.unitPrice,
                  settings.currency
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-border pt-3 dark:border-border-dark">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Subtotal
            </span>
            <span>{formatCurrency(quote.subtotal, settings.currency)}</span>
          </div>
          {quote.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">
                Tax
              </span>
              <span>{formatCurrency(quote.tax, settings.currency)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(quote.total, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            Payment
          </h3>
          <StatusBadge status={quote.paymentStatus} />
        </div>
        {quote.paidDate && (
          <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
            Paid on {formatDate(quote.paidDate)}
          </p>
        )}
      </div>

      {/* Notes */}
      {quote.notes && (
        <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h3 className="mb-1 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            Notes
          </h3>
          <p className="whitespace-pre-line text-sm">{quote.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {quote.quoteStatus === "draft" && (
          <button
            onClick={() => handleStatusChange("sent")}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white"
          >
            <Send size={16} /> Mark as Sent
          </button>
        )}
        {quote.quoteStatus === "sent" && (
          <>
            <button
              onClick={() => handleStatusChange("accepted")}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-medium text-white"
            >
              <Check size={16} /> Accepted
            </button>
            <button
              onClick={() => handleStatusChange("declined")}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-medium text-white"
            >
              <X size={16} /> Declined
            </button>
          </>
        )}
        {quote.quoteStatus === "accepted" &&
          quote.paymentStatus !== "paid" && (
            <button
              onClick={handleMarkPaid}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-medium text-white"
            >
              <DollarSign size={16} /> Mark Paid
            </button>
          )}
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 rounded-xl bg-surface py-3 text-sm font-medium shadow-sm dark:bg-surface-dark"
        >
          <Download size={16} /> Download PDF
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>

      {/* Valid Until */}
      <p className="mb-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        Valid until {formatDate(quote.validUntil)}
      </p>
    </div>
  );
}
