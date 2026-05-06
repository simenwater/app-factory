"use client";

import { Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import type { Invoice } from "@/types";
import { daysUntilDue } from "@/lib/email";

interface PaymentTrackerProps {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
}

/**
 * @description 支付状态跟踪面板
 */
export function PaymentTracker({ invoices, onSelect }: PaymentTrackerProps) {
  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "sent" || i.status === "draft").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalRevenue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0),
    totalPending: invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + i.total, 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card text-center p-4">
          <FileText className="w-5 h-5 mx-auto mb-2 text-[var(--primary)]" />
          <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Total</p>
        </div>
        <div className="card text-center p-4">
          <CheckCircle className="w-5 h-5 mx-auto mb-2 text-[var(--success)]" />
          <p className="text-2xl font-bold text-[var(--success)]">{stats.paid}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Paid</p>
        </div>
        <div className="card text-center p-4">
          <Clock className="w-5 h-5 mx-auto mb-2 text-[var(--warning)]" />
          <p className="text-2xl font-bold text-[var(--warning)]">{stats.pending}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Pending</p>
        </div>
        <div className="card text-center p-4">
          <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-[var(--destructive)]" />
          <p className="text-2xl font-bold text-[var(--destructive)]">{stats.overdue}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Overdue</p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="card">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Recent Invoices</h3>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
            <p className="text-[var(--muted-foreground)]">No invoices yet</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Create your first invoice to start tracking payments
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {invoices.map((invoice) => {
              const days = daysUntilDue(invoice.dueDate);
              return (
                <div
                  key={invoice.id}
                  onClick={() => onSelect(invoice)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--muted)] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm text-[var(--foreground)]">
                        {invoice.to.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {invoice.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-[var(--foreground)]">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: invoice.currency,
                      }).format(invoice.total)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`status-badge status-${invoice.status}`}>
                        {invoice.status}
                      </span>
                      {invoice.status === "sent" && days > 0 && (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {days}d left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
