"use client";

import Link from "next/link";
import { Plus, FileText, Search } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

/**
 * @description 报价单列表页面
 */
export default function QuotesPage() {
  const quotes = useStore((s) => s.quotes);
  const settings = useStore((s) => s.settings);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = quotes
    .filter((q) => {
      if (filterStatus !== "all" && q.quoteStatus !== filterStatus) return false;
      if (search) {
        const lower = search.toLowerCase();
        return (
          q.client.name.toLowerCase().includes(lower) ||
          q.quoteNumber.toLowerCase().includes(lower) ||
          q.serviceDescription.toLowerCase().includes(lower)
        );
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const statuses = ["all", "draft", "sent", "accepted", "declined", "expired"];

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Link
          href="/quotes/new"
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={16} />
          New Quote
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
        />
        <input
          type="text"
          placeholder="Search quotes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-surface-dark"
        />
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filterStatus === s
                ? "bg-primary text-white"
                : "bg-surface text-text-muted hover:bg-gray-100 dark:bg-surface-dark dark:text-text-muted-dark dark:hover:bg-gray-800"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Quotes List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quotes found"
          description={
            search
              ? "Try adjusting your search or filter"
              : "Create your first quote with AI assistance"
          }
          action={
            !search ? (
              <Link
                href="/quotes/new"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Create Quote
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{quote.client.name}</h3>
                <StatusBadge status={quote.quoteStatus} />
              </div>
              <p className="mb-1 text-xs text-text-muted dark:text-text-muted-dark line-clamp-1">
                {quote.serviceDescription}
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                <span>{quote.quoteNumber}</span>
                <div className="flex items-center gap-2">
                  <span>{formatDate(quote.createdAt)}</span>
                  <span className="font-semibold text-text dark:text-text-dark">
                    {formatCurrency(quote.total, settings.currency)}
                  </span>
                </div>
              </div>
              {quote.aiGenerated && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                  ✦ AI Generated
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
