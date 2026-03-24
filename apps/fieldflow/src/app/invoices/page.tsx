"use client";

import Link from "next/link";
import { Plus, FileText, Download } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import { exportInvoicesCSV } from "@/lib/export";

/**
 * @description 发票列表页（含免费CSV导出）
 */
export default function InvoicesPage() {
  const invoices = useStore((s) => s.invoices);
  const settings = useStore((s) => s.settings);

  const sortedInvoices = [...invoices].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex items-center gap-2">
          {invoices.length > 0 && (
            <button
              onClick={() => exportInvoicesCSV(invoices, settings)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface shadow-sm transition-colors hover:bg-gray-50 dark:bg-surface-dark dark:hover:bg-gray-800"
              title="Export CSV"
            >
              <Download size={16} className="text-text-muted" />
            </button>
          )}
          <Link
            href="/invoices/new"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Plus size={16} />
            New Invoice
          </Link>
        </div>
      </div>

      {sortedInvoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Invoices Yet"
          description="Create your first invoice or quote to start getting paid."
          actionLabel="Create Invoice"
          actionHref="/invoices/new"
        />
      ) : (
        <div className="space-y-3">
          {sortedInvoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoices/${inv.id}`}
              className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">#{inv.invoiceNumber}</h3>
                    <StatusBadge status={inv.invoiceStatus} />
                  </div>
                  <p className="mt-0.5 text-sm text-text-muted dark:text-text-muted-dark">
                    {inv.customer.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(inv.total, settings.currency)}
                  </p>
                  <StatusBadge status={inv.paymentStatus} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                <span>Created {formatDate(inv.createdAt)}</span>
                <span>Due {formatDate(inv.dueDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
