/**
 * @fileoverview 报价单列表页面
 */

"use client";

import { useStore } from "@/store/useStore";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function QuotesPage() {
  const { quotes, getClient, settings } = useStore();
  const sorted = [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">Quotes</h1>
        <Link
          href="/quotes/new"
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quotes yet"
          description="Create your first professional quote to send to clients."
          action={{ label: "Create Quote", href: "/quotes/new" }}
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((quote) => {
            const client = getClient(quote.clientId);
            return (
              <Link
                key={quote.id}
                href={`/quotes/${quote.id}`}
                className="block p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-text-muted dark:text-text-muted-dark">
                    {quote.quoteNumber}
                  </span>
                  <StatusBadge status={quote.status} />
                </div>
                <h3 className="font-medium text-text dark:text-text-dark text-sm mb-1">{quote.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted dark:text-text-muted-dark">
                    {client?.name || "Unknown Client"}
                  </span>
                  <span className="text-sm font-semibold text-text dark:text-text-dark">
                    {formatCurrency(quote.total, settings.currency)}
                  </span>
                </div>
                <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
                  Valid until {formatDate(quote.validUntil)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
