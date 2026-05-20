"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building, FileText, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";

/**
 * @description 客户详情页面 — 显示客户信息和关联报价
 */
export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { clients, quotes, deleteClient, settings } = useStore();

  const client = clients.find((c) => c.id === params.id);
  const clientQuotes = quotes
    .filter((q) => q.client.id === params.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (!client) {
    return (
      <div className="flex h-96 items-center justify-center px-4">
        <p className="text-text-muted dark:text-text-muted-dark">
          Client not found
        </p>
      </div>
    );
  }

  const totalRevenue = clientQuotes
    .filter((q) => q.paymentStatus === "paid")
    .reduce((sum, q) => sum + q.paidAmount, 0);

  const totalQuoted = clientQuotes.reduce((sum, q) => sum + q.total, 0);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClient(client.id);
      router.push("/clients");
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-bold">{client.name}</h1>
      </div>

      {/* Client Info */}
      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        {client.company && (
          <div className="mb-2 flex items-center gap-2 text-sm">
            <Building size={14} className="text-text-muted dark:text-text-muted-dark" />
            <span>{client.company}</span>
          </div>
        )}
        <div className="mb-2 flex items-center gap-2 text-sm">
          <Mail size={14} className="text-text-muted dark:text-text-muted-dark" />
          <a href={`mailto:${client.email}`} className="text-primary hover:underline">
            {client.email}
          </a>
        </div>
        {client.phone && (
          <div className="mb-2 flex items-center gap-2 text-sm">
            <Phone size={14} className="text-text-muted dark:text-text-muted-dark" />
            <a href={`tel:${client.phone}`} className="text-primary hover:underline">
              {client.phone}
            </a>
          </div>
        )}
        {client.notes && (
          <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark">
            {client.notes}
          </p>
        )}
        <p className="mt-2 text-xs text-text-muted dark:text-text-muted-dark">
          Client since {formatDate(client.createdAt)}
        </p>
      </div>

      {/* Revenue Summary */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
            Revenue
          </p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalRevenue, settings.currency)}
          </p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
          <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
            Total Quoted
          </p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalQuoted, settings.currency)}
          </p>
        </div>
      </div>

      {/* Client Quotes */}
      <div className="mb-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Quotes ({clientQuotes.length})
        </h2>
        {clientQuotes.length === 0 ? (
          <div className="rounded-xl bg-surface p-6 text-center shadow-sm dark:bg-surface-dark">
            <FileText
              size={24}
              className="mx-auto mb-2 text-text-muted dark:text-text-muted-dark"
            />
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              No quotes for this client
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/quotes/${quote.id}`}
                className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {quote.quoteNumber}
                  </span>
                  <StatusBadge status={quote.quoteStatus} />
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                  <span>{formatDate(quote.createdAt)}</span>
                  <span className="font-semibold text-text dark:text-text-dark">
                    {formatCurrency(quote.total, settings.currency)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link
          href="/quotes/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-white"
        >
          <FileText size={16} /> New Quote
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
