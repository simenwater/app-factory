"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Search, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import type { QuoteStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: QuoteStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "草稿", value: "draft" },
  { label: "已发送", value: "sent" },
  { label: "已接受", value: "accepted" },
  { label: "已拒绝", value: "declined" },
];

/**
 * @description 报价单列表页面
 */
export default function QuotesPage() {
  const quotes = useStore((s) => s.quotes);
  const currency = useStore((s) => s.settings.currency);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");

  const filteredQuotes = quotes
    .filter((q) => {
      const matchesSearch =
        q.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          报价单
        </h1>
        <Link
          href="/quotes/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus size={18} />
          新建
        </Link>
      </div>

      {quotes.length > 0 && (
        <>
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="搜索客户或编号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-text-muted" />
              </button>
            )}
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {STATUS_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === value
                    ? "bg-primary text-white"
                    : "bg-surface text-text-muted border border-border dark:bg-surface-dark dark:border-border-dark"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="暂无报价单"
          description="创建您的第一个报价单，快速向客户发送专业报价"
          action={
            <Link
              href="/quotes/new"
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              创建报价单
            </Link>
          }
        />
      ) : filteredQuotes.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
          没有找到匹配的报价单
        </p>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-primary/5 dark:border-border-dark dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-text dark:text-text-dark">
                  {quote.customer.name}
                </span>
                <StatusBadge status={quote.status} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted dark:text-text-muted-dark">
                  #{quote.quoteNumber}
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(quote.total, currency)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                <span>{quote.items.length} 项服务</span>
                <span>{formatDate(quote.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
