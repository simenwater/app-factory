/**
 * @fileoverview 报价单详情页面
 */

"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Download, Send, FileCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateQuotePDF } from "@/lib/pdf";

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getQuote, getClient, updateQuote, deleteQuote, settings } = useStore();
  const quote = getQuote(id);

  if (!quote) {
    return (
      <div className="px-4 py-6">
        <p className="text-text-muted dark:text-text-muted-dark">Quote not found.</p>
        <Link href="/quotes" className="text-primary text-sm mt-2 inline-block">Back to quotes</Link>
      </div>
    );
  }

  const client = getClient(quote.clientId);

  const handleSend = () => {
    updateQuote(id, { status: "sent" });
  };

  const handleDownloadPDF = () => {
    if (client) {
      generateQuotePDF(quote, client, settings);
    }
  };

  const handleConvertToContract = () => {
    router.push(`/contracts/new?quoteId=${id}`);
  };

  const handleDelete = () => {
    if (confirm("Delete this quote?")) {
      deleteQuote(id);
      router.push("/quotes");
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/quotes" className="p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface-dark">
            <ArrowLeft className="w-5 h-5 text-text dark:text-text-dark" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-text dark:text-text-dark">{quote.quoteNumber}</h1>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">{quote.title}</p>
          </div>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      {/* Client Info */}
      <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-4">
        <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Client</p>
        <p className="text-sm font-medium text-text dark:text-text-dark">{client?.name || "Unknown"}</p>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">{client?.email}</p>
      </div>

      {/* Line Items */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-2">Items</h3>
        {quote.lineItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b border-border dark:border-border-dark last:border-0"
          >
            <div>
              <p className="text-sm text-text dark:text-text-dark">{item.description || "Untitled"}</p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                {item.quantity} × {formatCurrency(item.unitPrice, settings.currency)}
              </p>
            </div>
            <p className="text-sm font-medium text-text dark:text-text-dark">
              {formatCurrency(item.total, settings.currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-muted dark:text-text-muted-dark">Subtotal</span>
          <span className="text-text dark:text-text-dark">{formatCurrency(quote.subtotal, settings.currency)}</span>
        </div>
        {quote.taxRate > 0 && (
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-muted dark:text-text-muted-dark">Tax ({quote.taxRate}%)</span>
            <span className="text-text dark:text-text-dark">{formatCurrency(quote.taxAmount, settings.currency)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold border-t border-border dark:border-border-dark pt-2 mt-2">
          <span className="text-text dark:text-text-dark">Total</span>
          <span className="text-primary">{formatCurrency(quote.total, settings.currency)}</span>
        </div>
      </div>

      {/* Dates */}
      <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted dark:text-text-muted-dark">Created</span>
          <span className="text-text dark:text-text-dark">{formatDate(quote.createdAt)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-text-muted dark:text-text-muted-dark">Valid Until</span>
          <span className="text-text dark:text-text-dark">{formatDate(quote.validUntil)}</span>
        </div>
      </div>

      {quote.notes && (
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-6">
          <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Notes</p>
          <p className="text-sm text-text dark:text-text-dark">{quote.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {quote.status === "draft" && (
          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Send className="w-4 h-4" />
            Mark as Sent
          </button>
        )}
        {(quote.status === "sent" || quote.status === "accepted") && (
          <button
            onClick={() => updateQuote(id, { status: "accepted" })}
            className="w-full flex items-center justify-center gap-2 py-3 bg-success text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Accept Quote
          </button>
        )}
        {quote.status === "accepted" && (
          <button
            onClick={handleConvertToContract}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <FileCheck className="w-4 h-4" />
            Convert to Contract
          </button>
        )}
        <button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 py-3 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl font-medium text-text dark:text-text-dark hover:border-primary/30 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 py-3 text-danger text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete Quote
        </button>
      </div>
    </div>
  );
}
